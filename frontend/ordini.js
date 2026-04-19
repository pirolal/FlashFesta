const API_BASE = "http://127.0.0.1:8000";
const LOCAL_KEY = "flashfesta_saved_orders";

const refs = {
  count: document.getElementById("orders-count"),
  source: document.getElementById("orders-source"),
  grid: document.getElementById("orders-grid"),
};

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

async function loadOrders() {
  try {
    const response = await fetch(`${API_BASE}/api/orders`);
    if (!response.ok) throw new Error("backend_error");
    const orders = await response.json();
    refs.source.textContent = "Fonte dati: backend JSON (orders.json).";
    return Array.isArray(orders) ? orders : [];
  } catch {
    const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
    refs.source.textContent = "Fonte dati: fallback localStorage (backend non raggiungibile).";
    return Array.isArray(local) ? local : [];
  }
}

function renderOrders(orders) {
  refs.count.textContent = `${orders.length} ordini`;
  refs.grid.innerHTML = orders.length
    ? orders.map((order) => {
        const customer = `${order.customerFirstName || ""} ${order.customerLastName || ""}`.trim() || "Cliente senza nome";
        const lines = (order.lines || []).map((line) => {
          const notes = line.notes ? ` (${line.notes})` : "";
          return `<p>${line.quantity}x ${line.itemId}${notes}</p>`;
        }).join("");

        return `
          <article class="saved-order">
            <h3>Ordine ${order.orderNumber || "-"} - ${customer}</h3>
            <p>${order.createdAt ? new Date(order.createdAt).toLocaleString("it-IT") : "Data non disponibile"}</p>
            <div>${lines || "<p>Nessuna riga ordine.</p>"}</div>
            <div class="saved-order-footer">
              <strong>${formatCurrency(order.total)}</strong>
              <span>${formatCurrency(order.change)} resto</span>
            </div>
          </article>
        `;
      }).join("")
    : `<div class="receipt-empty">Nessun ordine trovato.</div>`;
}

loadOrders().then(renderOrders);
