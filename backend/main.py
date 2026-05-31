import json
import os
import mimetypes
import socket
from datetime import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote

# When deployed to Render the service must listen on 0.0.0.0 and the port
# is provided via the PORT environment variable. Locally it falls back to 8000.
HOST = "0.0.0.0"
PORT = int(os.environ.get("PORT", "8000"))
DATA_FILE = Path(__file__).parent / "orders.json"
# Read admin credentials from environment at startup (do NOT hardcode passwords)
ADMIN_USER = os.environ.get("ADMIN_USER")
ADMIN_PASS = os.environ.get("ADMIN_PASS")


def load_orders():
    if not DATA_FILE.exists():
        return []
    try:
        with DATA_FILE.open("r", encoding="utf-8") as handle:
            data = json.load(handle)
            return data if isinstance(data, list) else []
    except json.JSONDecodeError:
        return []


def save_orders(orders):
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    with DATA_FILE.open("w", encoding="utf-8") as handle:
        json.dump(orders, handle, ensure_ascii=False, indent=2)


class Handler(BaseHTTPRequestHandler):
    def _send_json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        # API endpoints
        if self.path == "/api/orders":
            self._send_json(200, load_orders())
            return
        if self.path == "/api/health":
            self._send_json(200, {"ok": True, "time": datetime.utcnow().isoformat() + "Z"})
            return

        # Serve static files from ../frontend for any non-API GET
        frontend_dir = Path(__file__).parent.parent / "frontend"
        # Fallback: also try current working directory (in case server started elsewhere)
        if not (frontend_dir.exists() and frontend_dir.is_dir()):
            cwd_front = Path.cwd() / "frontend"
            if cwd_front.exists() and cwd_front.is_dir():
                frontend_dir = cwd_front
        requested_path = self.path.split("?", 1)[0]
        if requested_path == "/" or requested_path == "":
            requested_path = "/index.html"

        file_path = (frontend_dir / requested_path.lstrip("/"))
        # Debugging info
        print(f"[DEBUG] requested_path={requested_path} -> file_path={file_path}", flush=True)
        if file_path.exists() and file_path.is_file():
            try:
                content = file_path.read_bytes()
                ctype, _ = mimetypes.guess_type(str(file_path))
                if not ctype:
                    ctype = "application/octet-stream"
                self.send_response(200)
                self.send_header("Content-Type", f"{ctype}; charset=utf-8")
                self.send_header("Content-Length", str(len(content)))
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(content)
                return
            except Exception:
                self._send_json(500, {"error": "file_read_error"})
                return

        self._send_json(404, {"error": "not_found"})

    def do_DELETE(self):
        requested_path = self.path.split("?", 1)[0]
        prefix = "/api/orders/"
        if not requested_path.startswith(prefix):
            self._send_json(404, {"error": "not_found"})
            return

        identifier = unquote(requested_path[len(prefix):].strip("/"))
        if not identifier:
            self._send_json(400, {"error": "missing_order_id"})
            return

        orders = load_orders()
        remaining_orders = []
        removed_order = None

        for order in orders:
            order_id = str(order.get("id", ""))
            order_number = str(order.get("orderNumber", ""))
            created_at = str(order.get("createdAt", ""))
            if removed_order is None and identifier in {order_id, order_number, created_at}:
                removed_order = order
                continue
            remaining_orders.append(order)

        if removed_order is None:
            self._send_json(404, {"error": "order_not_found"})
            return

        save_orders(remaining_orders)
        self._send_json(200, {
            "ok": True,
            "count": len(remaining_orders),
            "removed": removed_order.get("id") or removed_order.get("orderNumber"),
        })

    def do_POST(self):
        # Login endpoint
        if self.path == "/api/login":
            content_length = int(self.headers.get("Content-Length", "0"))
            raw_body = self.rfile.read(content_length)
            try:
                payload = json.loads(raw_body.decode("utf-8"))
            except json.JSONDecodeError:
                self._send_json(400, {"error": "invalid_json"})
                return

            username = str(payload.get("username", ""))
            password = str(payload.get("password", ""))
            # Do not log credentials in production
            # Use env vars loaded at startup; if not set, deny access
            if not ADMIN_USER or not ADMIN_PASS:
                # Admin login disabled when credentials are not set
                self._send_json(503, {"ok": False, "error": "admin_not_configured"})
                return

            if username == ADMIN_USER and password == ADMIN_PASS:
                self._send_json(200, {"ok": True})
            else:
                self._send_json(401, {"ok": False, "error": "unauthorized"})
            return

        # Orders endpoint
        if self.path != "/api/orders":
            self._send_json(404, {"error": "not_found"})
            return

        content_length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(content_length)

        try:
            payload = json.loads(raw_body.decode("utf-8"))
        except json.JSONDecodeError:
            self._send_json(400, {"error": "invalid_json"})
            return

        if not isinstance(payload, dict):
            self._send_json(400, {"error": "invalid_payload"})
            return

        orders = load_orders()
        orders.insert(0, payload)
        save_orders(orders)
        self._send_json(201, {"ok": True, "count": len(orders)})


if __name__ == "__main__":
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    if not DATA_FILE.exists():
        save_orders([])

    server = ThreadingHTTPServer((HOST, PORT), Handler)

    # Try to determine a useful local IP to show to the developer
    local_ip = "127.0.0.1"
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            # doesn't have to be reachable; used only to pick the outbound interface
            s.connect(("8.8.8.8", 80))
            local_ip = s.getsockname()[0]
    except Exception:
        pass

    print(f"Backend avviato su http://{HOST}:{PORT}")
    print(f"Apri nel browser: http://127.0.0.1:{PORT} oppure http://{local_ip}:{PORT}")
    admin_status = "configured" if ADMIN_USER and ADMIN_PASS else "NOT configured (login disabled)"
    print(f"Admin login status: {admin_status}")
    print("Endpoint: GET /api/orders | POST /api/orders | POST /api/login")
    server.serve_forever()
