const API_BASE = "http://127.0.0.1:8000";
const LOCAL_KEY = "flashfesta_saved_orders";
const FESTIVAL_KEY = "flashfesta_festival_stats_v1";

const refs = {
  count: document.getElementById("orders-count"),
  source: document.getElementById("orders-source"),
  grid: document.getElementById("orders-grid"),
  status: document.getElementById("orders-status"),
};

const state = {
  orders: [],
};

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getOrderKey(order) {
  return String(order?.id || order?.orderNumber || order?.createdAt || "");
}

function loadLocalOrders() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalOrders(orders) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(Array.isArray(orders) ? orders : []));
}

function defaultFestivalStats() {
  return {
    festivalStartedAt: new Date().toISOString(),
    evenings: [],
    currentEvening: {
      startedAt: new Date().toISOString(),
      total: 0,
      orders: 0,
    },
    lastUpdatedAt: new Date().toISOString(),
  };
}

function loadFestivalStats() {
  try {
    const raw = JSON.parse(localStorage.getItem(FESTIVAL_KEY) || "null");
    if (!raw || typeof raw !== "object") return defaultFestivalStats();
    return {
      festivalStartedAt: String(raw.festivalStartedAt || new Date().toISOString()),
      evenings: Array.isArray(raw.evenings)
        ? raw.evenings.map((entry) => ({
            id: String(entry.id || ""),
            startedAt: String(entry.startedAt || ""),
            closedAt: String(entry.closedAt || ""),
            total: Number(entry.total || 0),
            orders: Number(entry.orders || 0),
          }))
        : [],
      currentEvening: raw.currentEvening && typeof raw.currentEvening === "object"
        ? {
            startedAt: String(raw.currentEvening.startedAt || new Date().toISOString()),
            total: Number(raw.currentEvening.total || 0),
            orders: Number(raw.currentEvening.orders || 0),
          }
        : { startedAt: new Date().toISOString(), total: 0, orders: 0 },
      lastUpdatedAt: String(raw.lastUpdatedAt || new Date().toISOString()),
    };
  } catch {
    return defaultFestivalStats();
  }
}

function saveFestivalStats(stats) {
  localStorage.setItem(FESTIVAL_KEY, JSON.stringify(stats));
}

function rebuildFestivalStatsFromOrders(orders) {
  const existing = loadFestivalStats();
  const stats = {
    festivalStartedAt: existing.festivalStartedAt,
    evenings: existing.evenings.map((evening) => ({
      ...evening,
      total: 0,
      orders: 0,
    })),
    currentEvening: {
      ...existing.currentEvening,
      total: 0,
      orders: 0,
    },
    lastUpdatedAt: new Date().toISOString(),
  };

  const sortedOrders = [...(Array.isArray(orders) ? orders : [])].sort((left, right) => {
    const leftTime = new Date(left.createdAt || 0).getTime();
    const rightTime = new Date(right.createdAt || 0).getTime();
    return leftTime - rightTime;
  });

  sortedOrders.forEach((order) => {
    const orderTime = new Date(order.createdAt || 0).getTime();
    let target = stats.currentEvening;

    if (Number.isFinite(orderTime)) {
      const closedMatch = stats.evenings.find((evening) => {
        const startTime = new Date(evening.startedAt || 0).getTime();
        const endTime = new Date(evening.closedAt || 0).getTime();
        return Number.isFinite(startTime) && Number.isFinite(endTime) && orderTime >= startTime && orderTime <= endTime;
      });

      if (closedMatch) {
        target = closedMatch;
      } else {
        const currentStart = new Date(stats.currentEvening.startedAt || 0).getTime();
        if (Number.isFinite(currentStart) && orderTime >= currentStart) {
          target = stats.currentEvening;
        } else if (stats.evenings.length) {
          target = stats.evenings[stats.evenings.length - 1];
        }
      }
    }

    target.total += Number(order.total || 0);
    target.orders += 1;
  });

  saveFestivalStats(stats);
}

async function loadOrders() {
  try {
    const response = await fetch(`${API_BASE}/api/orders`);
    if (!response.ok) throw new Error("backend_error");
    const orders = await response.json();
    const normalized = Array.isArray(orders) ? orders : [];
    saveLocalOrders(normalized);
    refs.source.textContent = "Fonte dati: backend JSON (orders.json).";
    return normalized;
  } catch {
    const local = loadLocalOrders();
    refs.source.textContent = "Fonte dati: fallback localStorage (backend non raggiungibile).";
    return local;
  }
}

function lineSummary(line) {
  const name = line.itemName || line.itemId || "Articolo";
  const extras = String(line.notes || "").trim();
  const removals = Array.isArray(line.removeIngredients) && line.removeIngredients.length
    ? ` - tolto: ${line.removeIngredients.join(", ")}`
    : "";
  const notes = extras ? ` - extra: ${extras}` : "";
  return `${line.quantity}x ${name}${removals}${notes}`;
}

function renderOrders(orders) {
  state.orders = Array.isArray(orders) ? orders : [];
  refs.count.textContent = `${state.orders.length} ordini`;
  refs.grid.innerHTML = state.orders.length
    ? state.orders.map((order) => {
        const customer = `${order.customerFirstName || ""} ${order.customerLastName || ""}`.trim() || "Cliente senza nome";
        const createdAt = order.createdAt ? new Date(order.createdAt).toLocaleString("it-IT") : "Data non disponibile";
        const lines = (order.lines || []).map((line) => `<p>${escapeHtml(lineSummary(line))}</p>`).join("");
        const orderKey = escapeHtml(getOrderKey(order));

        return `
          <article class="saved-order">
            <h3>Ordine ${escapeHtml(order.orderNumber || "-")} - ${escapeHtml(customer)}</h3>
            <p>${escapeHtml(createdAt)}</p>
            <div>${lines || "<p>Nessuna riga ordine.</p>"}</div>
            <div class="saved-order-footer">
              <strong>${formatCurrency(order.total)}</strong>
              <span>${formatCurrency(order.change)} resto</span>
            </div>
            <div class="saved-order-actions">
              <button type="button" class="secondary" data-action="reprint-order" data-order-id="${orderKey}">Ristampa</button>
              <button type="button" class="danger" data-action="delete-order" data-order-id="${orderKey}">X Elimina</button>
            </div>
          </article>
        `;
      }).join("")
    : `<div class="receipt-empty">Nessun ordine trovato.</div>`;
}

function showStatus(message) {
  if (refs.status) refs.status.textContent = message;
}

function getOrderById(orderId) {
  return state.orders.find((order) => getOrderKey(order) === String(orderId));
}

function reprintOrder(orderId) {
  const order = getOrderById(orderId);
  if (!order) {
    showStatus("Ordine non trovato per la ristampa.");
    return;
  }

  const orderKey = encodeURIComponent(String(orderId));
  // Open the main index page which contains the canonical print routine.
  const url = `index.html?reprint=${orderKey}`;
  const w = window.open(url, "_blank", "width=900,height=900");
  if (!w) showStatus("Popup bloccato: consenti la finestra di stampa e riprova.");
}

async function deleteOrderFromBackend(orderId) {
  try {
    const response = await fetch(`${API_BASE}/api/orders/${encodeURIComponent(orderId)}`, {
      method: "DELETE",
    });
    return { ok: response.ok, status: response.status };
  } catch {
    return { ok: false, status: null };
  }
}

async function deleteOrder(orderId) {
  const order = getOrderById(orderId);
  if (!order) {
    showStatus("Ordine non trovato.");
    return;
  }

  const orderNumber = order.orderNumber || "-";
  const confirmed = window.confirm(`Vuoi eliminare definitivamente l'ordine ${orderNumber}?`);
  if (!confirmed) return;

  showStatus("Eliminazione in corso...");
  const result = await deleteOrderFromBackend(orderId);
  const nextOrders = state.orders.filter((entry) => getOrderKey(entry) !== String(orderId));

  if (result.ok || result.status === 404 || result.status === null) {
    saveLocalOrders(nextOrders);
    rebuildFestivalStatsFromOrders(nextOrders);
    renderOrders(nextOrders);
    showStatus(result.ok ? "Ordine eliminato da backend e conteggi aggiornati." : "Ordine eliminato in locale e conteggi aggiornati.");
    return;
  }

  showStatus("Eliminazione fallita: impossibile aggiornare il backend.");
}

if (refs.grid) {
  refs.grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const orderId = button.dataset.orderId;
    if (!orderId) return;

    if (button.dataset.action === "reprint-order") {
      reprintOrder(orderId);
      return;
    }

    if (button.dataset.action === "delete-order") {
      deleteOrder(orderId);
    }
  });
}

loadOrders().then(renderOrders);
