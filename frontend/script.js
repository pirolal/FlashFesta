const STORAGE_KEYS = {
  nextOrderNumber: "flashfesta_next_order",
  savedOrders: "flashfesta_saved_orders",
  festivalStats: "flashfesta_festival_stats_v1",
};

const API_BASE = "http://127.0.0.1:8000";
const EXTRA_INGREDIENT_PRICE = 1.0;

const catalog = [
  { id: "americana", name: "Americana", category: "pizze", price: 9.5, note: "Pomodoro, mozzarella, wurstel e patatine.", ingredients: ["pomodoro", "mozzarella", "wurstel", "patatine"] },
  { id: "capricciosa", name: "Capricciosa", category: "pizze", price: 8.0, note: "Un grande classico.", ingredients: ["pomodoro", "mozzarella", "prosciutto", "funghi", "carciofi", "olive", "acciughe"] },
  { id: "della-sagra", name: "Della Sagra", category: "pizze", price: 10.0, note: "Salame e branzi.", ingredients: ["pomodoro", "mozzarella", "salame", "branzi"] },
  { id: "margherita", name: "Margherita", category: "pizze", price: 6.0, note: "La piu amata.", ingredients: ["pomodoro", "mozzarella"] },
  { id: "margherita-doppia", name: "Margherita DP Mozz.", category: "pizze", price: 7.5, note: "Doppia mozzarella.", ingredients: ["pomodoro", "mozzarella"] },
  { id: "napoli", name: "Napoli", category: "pizze", price: 7.5, note: "Acciughe, capperi e olive.", ingredients: ["pomodoro", "mozzarella", "acciughe", "capperi", "olive"] },
  { id: "primavera", name: "Primavera", category: "pizze", price: 7.5, note: "Carciofi e grana.", ingredients: ["pomodoro", "mozzarella", "carciofi", "grana"] },
  { id: "prosciutto", name: "Prosciutto", category: "pizze", price: 7.5, note: "Classica al prosciutto.", ingredients: ["pomodoro", "mozzarella", "prosciutto"] },
  { id: "prosciutto-funghi", name: "Prosciutto e Funghi", category: "pizze", price: 8.5, note: "Sempre richiesta.", ingredients: ["pomodoro", "mozzarella", "prosciutto", "funghi"] },
  { id: "romana", name: "Romana", category: "pizze", price: 8.0, note: "Acciughe, capperi, olive e origano.", ingredients: ["pomodoro", "mozzarella", "acciughe", "capperi", "olive", "origano"] },
  { id: "salamino-piccante", name: "Salamino", category: "pizze", price: 8.0, note: "Gusto deciso.", ingredients: ["pomodoro", "mozzarella", "salamino"] },
  { id: "speck", name: "Speck", category: "pizze", price: 8.0, note: "Molto apprezzata.", ingredients: ["pomodoro", "mozzarella", "speck"] },
  { id: "tonno", name: "Tonno", category: "pizze", price: 8.0, note: "Tonno classica.", ingredients: ["pomodoro", "mozzarella", "tonno"] },
  { id: "tonno-cipolle", name: "Tonno e Cipolle", category: "pizze", price: 8.5, note: "Piu saporita.", ingredients: ["pomodoro", "mozzarella", "tonno", "cipolle"] },
  { id: "verdure", name: "Verdure", category: "pizze", price: 8.0, note: "Vegetariana.", ingredients: ["pomodoro", "mozzarella", "verdure"] },
  { id: "4-stagioni", name: "4 Stagioni", category: "pizze", price: 8.0, note: "Completa.", ingredients: ["pomodoro", "mozzarella", "prosciutto", "funghi", "carciofi", "olive"] },
  { id: "saporita", name: "Saporita", category: "pizze", price: 8.0, note: "Pomodoro, mozzarella salamino formaggio e cipolle.", ingredients: ["pomodoro", "mozzarella", "salamino", "formaggio", "cipolle"] },
  { id: "diavolo", name: "Diavolo", category: "pizze", price: 8.0, note: "Pomodoro, mozzarella salamino.", ingredients: ["pomodoro", "mozzarella", "salamino"] },
  { id: "4-formaggi", name: "4 Formaggi", category: "pizze", price: 8.0, note: "Intensa.", ingredients: ["pomodoro", "mozzarella", "zola", "grana", "fontina"] },
  { id: "wurstel", name: "Wurstel", category: "pizze", price: 7.5, note: "Pomodoro, mozzarella e wurstel.", ingredients: ["pomodoro", "mozzarella", "wurstel"] },
  { id: "patatine", name: "Patatine", category: "cucina", price: 3.0, note: "Patatine fritte.", ingredients: ["patatine"] },
//  { id: "pane", name: "Pane", category: "cucina", price: 0.3, note: "Aggiunta base." },
//  { id: "affettamisti", name: "Affettamisti", category: "cucina", price: 5.0, note: "Tagliere misto." },
//  { id: "formaggi-misti", name: "Formaggi Misti", category: "cucina", price: 6.0, note: "Tagliere misto." },
//  { id: "taleggio", name: "Taleggio", category: "cucina", price: 3.0, note: "Porzione singola." },
//  { id: "pane-salame", name: "Pane Salame", category: "cucina", price: 4.0, note: "Pane con salame." },
//  { id: "casoncelli", name: "Casoncelli", category: "cucina", price: 6.0, note: "Primo piatto." },
//  { id: "lasagne", name: "Lasagne", category: "cucina", price: 6.0, note: "Primo piatto." },
//  { id: "pasta-pomodoro", name: "Pasta Pomodoro", category: "cucina", price: 3.5, note: "Piatto semplice." },
//  { id: "costata", name: "Costata", category: "cucina", price: 18.0, note: "Taglio importante." },
//  { id: "costine", name: "Costine", category: "cucina", price: 6.0, note: "Carne alla griglia." },
//  { id: "cotechino-pane", name: "Cotechino + Pane", category: "cucina", price: 4.0, note: "Servito con pane." },
//  { id: "grigliata-mista", name: "Grigliata Mista", category: "cucina", price: 8.5, note: "Misto griglia." },
//  { id: "insalata", name: "Insalata", category: "cucina", price: 2.0, note: "Contorno fresco." },
//  { id: "insalata-pomodori", name: "Insalata Pomodori", category: "cucina", price: 3.5, note: "Contorno fresco." },
//  { id: "polenta-asino", name: "Polenta e Asino", category: "cucina", price: 11.5, note: "Piatto della casa." },
//  { id: "pollo", name: "Pollo", category: "cucina", price: 5.0, note: "Porzione singola." },
//  { id: "roast-beef", name: "Roast Beef", category: "cucina", price: 5.5, note: "Carne fredda." },
//  { id: "spiedini", name: "Spiedini", category: "cucina", price: 6.5, note: "Alla griglia." },
//  { id: "stufato-asina", name: "Stufato d'Asina", category: "cucina", price: 8.5, note: "Secondo piatto." },
//  { id: "taragna-asina", name: "Taragna e Asina", category: "cucina", price: 14.5, note: "Piatto completo." },
//  { id: "taragna", name: "Taragna", category: "cucina", price: 6.0, note: "Piatto completo." },
//  { id: "polenta", name: "Polenta", category: "cucina", price: 3.0, note: "Contorno semplice." },
//  { id: "pomodori", name: "Pomodori", category: "cucina", price: 2.0, note: "Contorno semplice." },
  { id: "ketchup-maionese", name: "Ketchup o Maionese", category: "cucina", price: 0.5, note: "Salse extra." },
  { id: "acqua-mezzo", name: "Acqua 0,50 L", category: "bevande", price: 1.0, note: "Formato piccolo." },
  { id: "acqua-lt", name: "Acqua 1 L", category: "bevande", price: 1.5, note: "Formato grande." },
  { id: "bibite-1l", name: "Bibite 1 L", category: "bevande", price: 3.0, note: "Bottiglia da litro." },
//  { id: "panasche-media", name: "Panasche Media", category: "bevande", price: 3.5, note: "Bibita mista." },
  { id: "birra", name: "Birra Media", category: "bevande", price: 4.0, note: "Boccale medio." },
  { id: "coca-cola-litro", name: "Coca Cola 1 L", category: "bevande", price: 4.0, note: "Bottiglia da litro." },
  { id: "lattines", name: "Lattina", category: "bevande", price: 2.0, note: "Bibita fresca." },
  { id: "vino-bottiglia", name: "Vino Bottiglia", category: "bevande", price: 8.0, note: "Per tavolata." },
  { id: "vino-calice", name: "Vino 1 Calice", category: "bevande", price: 2.0, note: "Al bicchiere." },
  { id: "vino-mezzo-spina", name: "Vino 1/2 Spina", category: "bevande", price: 4.0, note: "Alla spina." },
  { id: "vino-spina-litro", name: "Vino 1 L Spina", category: "bevande", price: 7.0, note: "Alla spina." },
  { id: "spumante", name: "Spumante", category: "bevande", price: 14.0, note: "Bottiglia." },
  { id: "fiordinello", name: "Fortunello", category: "dopo-cena", price: 1.5, note: "Gelato singolo." },
  { id: "coppe", name: "Coppe", category: "dopo-cena", price: 2.5, note: "Coppa gelato." },
  { id: "ghiacciolo", name: "Ghiacciolo", category: "dopo-cena", price: 1.0, note: "Gelato su stecco." },
  { id: "liquirizia", name: "Liquì", category: "dopo-cena", price: 1.5, note: "Gelato alla liquirizia." },
  { id: "maxi-cono", name: "Maxi Cono", category: "dopo-cena", price: 2.5, note: "Cono grande." },
  { id: "mottarello", name: "Mottarello", category: "dopo-cena", price: 1.5, note: "Gelato confezionato." },
  { id: "limoncello", name: "Limoncello", category: "dopo-cena", price: 3.0, note: "Dopo pasto." },
  { id: "dolce", name: "Dolce", category: "dopo-cena", price: 4.0, note: "Dessert del giorno." },
  { id: "cognac-grappa", name: "Cognac Grappa", category: "dopo-cena", price: 3.0, note: "Distillato." },
  { id: "caffe", name: "Caffe' Liscio", category: "dopo-cena", price: 1.0, note: "Fine pasto." },
  { id: "caffe-corretto", name: "Caffe' Corretto", category: "dopo-cena", price: 1.5, note: "Con extra." },
  { id: "amaro", name: "Amaro", category: "dopo-cena", price: 4.0, note: "Dopo pasto." },
  { id: "caffe-deca", name: "Caffe' Deca", category: "dopo-cena", price: 1.2, note: "Con extra." },



];

const categories = {
  pizze: { title: "Pizze", subtitle: "Le proposte salate disponibili." },
  cucina: { title: "Cucina", subtitle: "Primi, griglia e piatti caldi." },
  bevande: { title: "Bevande", subtitle: "Acqua, caffe, birra e altro." },
  "dopo-cena": { title: "Dopo cena", subtitle: "Coppe, coni, ghiaccioli e dessert." },
};

const refs = {
  menuGroups: document.getElementById("menu-groups"),
  receiptLines: document.getElementById("receipt-lines"),
  receiptTotal: document.getElementById("receipt-total"),
  receiptCount: document.getElementById("receipt-count"),
  receiptDate: document.getElementById("receipt-date"),
  receiptCustomer: document.getElementById("receipt-customer"),
  receiptTable: document.getElementById("receipt-table"),
  orderNumber: document.getElementById("order-number"),
  firstNameInput: document.getElementById("customer-first-name"),
  tableNumberInput: document.getElementById("table-number"),
  cashInput: document.getElementById("cash-input"),
  changeValue: document.getElementById("change-value"),
  ingredientDialog: document.getElementById("ingredient-dialog"),
  ingredientTitle: document.getElementById("ingredient-title"),
  ingredientRemoveList: document.getElementById("ingredient-remove-list"),
  ingredientNotes: document.getElementById("ingredient-notes"),
  saveStatus: document.getElementById("save-status"),
  printCategoryTickets: document.getElementById("print-category-tickets"),
  saveOrderButton: document.querySelector('[data-action="save-order"]'),
};

const state = {
  lines: [],
  filter: "all",
  search: "",
  customerFirstName: "",
  tableNumber: "",
  customerLastName: "",
  cashReceived: "",
  currentOrderNumber: loadNextOrderNumber(),
  savedOrders: loadSavedOrders(),
  ingredientDrafts: new Map(),
  activeIngredientContext: null,
  isSavingOrder: false,
};

function uid() {
  return (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadNextOrderNumber() {
  const value = Number(localStorage.getItem(STORAGE_KEYS.nextOrderNumber));
  return Number.isFinite(value) && value > 0 ? value : 1;
}

function saveNextOrderNumber(value) {
  localStorage.setItem(STORAGE_KEYS.nextOrderNumber, String(value));
}

function loadSavedOrders() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.savedOrders) || "[]");
  } catch {
    return [];
  }
}

function saveSavedOrders() {
  localStorage.setItem(STORAGE_KEYS.savedOrders, JSON.stringify(state.savedOrders));
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
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEYS.festivalStats) || "null");
    if (!raw || typeof raw !== "object") return defaultFestivalStats();
    const evenings = Array.isArray(raw.evenings) ? raw.evenings : [];
    const currentEvening = raw.currentEvening && typeof raw.currentEvening === "object"
      ? {
          startedAt: String(raw.currentEvening.startedAt || new Date().toISOString()),
          total: Number(raw.currentEvening.total || 0),
          orders: Number(raw.currentEvening.orders || 0),
        }
      : { startedAt: new Date().toISOString(), total: 0, orders: 0 };

    return {
      festivalStartedAt: String(raw.festivalStartedAt || new Date().toISOString()),
      evenings: evenings.map((entry) => ({
        id: String(entry.id || uid()),
        startedAt: String(entry.startedAt || new Date().toISOString()),
        closedAt: String(entry.closedAt || new Date().toISOString()),
        total: Number(entry.total || 0),
        orders: Number(entry.orders || 0),
      })),
      currentEvening,
      lastUpdatedAt: String(raw.lastUpdatedAt || new Date().toISOString()),
    };
  } catch {
    return defaultFestivalStats();
  }
}

function saveFestivalStats(stats) {
  localStorage.setItem(STORAGE_KEYS.festivalStats, JSON.stringify(stats));
}

function registerSavedOrder(order) {
  const stats = loadFestivalStats();
  const amount = Number(order?.total || 0);
  stats.currentEvening.total += Number.isFinite(amount) ? amount : 0;
  stats.currentEvening.orders += 1;
  stats.lastUpdatedAt = new Date().toISOString();
  saveFestivalStats(stats);
}

function closeCurrentEveningAndStartNew() {
  const stats = loadFestivalStats();
  const total = Number(stats.currentEvening.total || 0);
  const orders = Number(stats.currentEvening.orders || 0);
  const hasData = total > 0 || orders > 0;

  if (hasData) {
    stats.evenings.push({
      id: uid(),
      startedAt: stats.currentEvening.startedAt,
      closedAt: new Date().toISOString(),
      total,
      orders,
    });
  }

  stats.currentEvening = {
    startedAt: new Date().toISOString(),
    total: 0,
    orders: 0,
  };
  stats.lastUpdatedAt = new Date().toISOString();
  saveFestivalStats(stats);
  return { hasData, total, orders };
}

function getItem(itemId) {
  return catalog.find((entry) => entry.id === itemId);
}

function formatCurrency(value) {
  return value.toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Evita che unità come "L" finiscano su riga successiva: "0,50 L" -> "0,50\u00A0L"
function preventUnitWrap(text) {
  try {
    return String(text).replace(/(\d[\d.,]*)\s+([A-Za-z]{1,3})\b/g, function(_, num, unit) {
      return num + "\u00A0" + unit;
    });
  } catch (e) {
    return text;
  }
}

function normalizeIngredients(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return [...new Set(value.map((entry) => String(entry).trim()).filter(Boolean))];
  }
  return String(value).split(/[,;\n]/).map((entry) => entry.trim()).filter(Boolean);
}

function extraIngredientsFromNotes(notes) {
  return normalizeIngredients(notes);
}

function extraIngredientsCost(line) {
  return extraIngredientsFromNotes(line.notes).length * EXTRA_INGREDIENT_PRICE * line.quantity;
}

function lineTotal(line) {
  const item = getItem(line.itemId);
  return item ? ((item.price * line.quantity) + extraIngredientsCost(line)) : 0;
}

function customizationText(line) {
  const removed = normalizeIngredients(line.removeIngredients);
  const extras = extraIngredientsFromNotes(line.notes);
  const parts = [];
  if (removed.length) parts.push(`- ${removed.join(", ")}`);
  if (extras.length) parts.push(`+ ${extras.join(", ")} (${formatCurrency(extras.length * EXTRA_INGREDIENT_PRICE)} cad.)`);
  return parts.join(" | ");
}

function totals() {
  const total = state.lines.reduce((sum, line) => sum + lineTotal(line), 0);
  const count = state.lines.reduce((sum, line) => sum + line.quantity, 0);
  const cash = Number.parseFloat(state.cashReceived);
  const paid = Number.isFinite(cash) ? cash : 0;
  return { total, count, change: paid - total, paid };
}

function lineSignature(itemId, removeIngredients, notes) {
  return JSON.stringify({
    itemId,
    removeIngredients: normalizeIngredients(removeIngredients).sort(),
    notes: String(notes || "").trim(),
  });
}

function itemQuantity(itemId) {
  return state.lines.filter((line) => line.itemId === itemId).reduce((sum, line) => sum + line.quantity, 0);
}

function renderMenu() {
  const grouped = catalog.reduce((acc, item) => {
    const categoryOk = state.filter === "all" || item.category === state.filter;
    const searchText = `${item.name} ${item.note || ""}`.toLowerCase();
    const searchOk = searchText.includes(state.search);
    if (!categoryOk || !searchOk) return acc;
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const visibleCategories = state.filter === "all"
    ? Object.entries(categories)
    : Object.entries(categories).filter(([key]) => key === state.filter);

  refs.menuGroups.innerHTML = visibleCategories.map(([key, meta]) => {
    const items = (grouped[key] || []).slice().sort((a, b) =>
      a.name.localeCompare(b.name, "it-IT", { sensitivity: "base" })
    );
    const cards = items.map((item) => `
      <button class="compact-menu-button" type="button" data-action="add-item" data-item-id="${item.id}">
        <span class="compact-menu-label">${item.name}</span>
      </button>
    `).join("");

    return `
      <section class="menu-group category-${key}">
        <div class="group-header">
          <div>
            <p>${meta.title}</p>
          </div>
        </div>
        <div class="compact-menu-grid ${items.length ? "" : "is-hidden"}">${cards}</div>
        <div class="receipt-empty ${items.length ? "is-hidden" : ""}">Nessun risultato.</div>
      </section>
    `;
  }).join("");


}

function renderReceipt() {
  const sum = totals();
  refs.orderNumber.textContent = String(state.currentOrderNumber);
  if (refs.receiptCustomer) refs.receiptCustomer.textContent = state.customerFirstName.trim() || "-";
  if (refs.receiptTable) refs.receiptTable.textContent = state.tableNumber.trim() || "-";
  refs.receiptDate.textContent = new Date().toLocaleString("it-IT", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  refs.receiptLines.innerHTML = state.lines.length ? state.lines.map((line) => {
    const item = getItem(line.itemId);
    const splitButton = line.quantity > 1 ? `<button class="soft" data-action="line-split-edit" data-line-id="${line.id}">Personalizza 1</button>` : "";
    const extras = extraIngredientsFromNotes(line.notes);
    return `
      <div class="receipt-line">
        <div>
          <strong>${line.quantity} x ${item.name}</strong>
          <span>${formatCurrency(item.price)} cad.${extras.length ? ` + ${formatCurrency(extraIngredientsCost(line))} extra` : ""}</span>
          ${customizationText(line) ? `<div class="line-note">Ingredienti: ${customizationText(line)}</div>` : ""}
        </div>
        <div>
          <strong>${formatCurrency(lineTotal(line))}</strong>
          <div class="line-actions">
            ${splitButton}
            <button class="soft" data-action="line-minus" data-line-id="${line.id}">-1</button>
            <button class="soft" data-action="line-edit" data-line-id="${line.id}">Ingredienti</button>
            <button class="danger" data-action="line-remove" data-line-id="${line.id}">Rimuovi</button>
          </div>
        </div>
      </div>
    `;
  }).join("") : `<div class="receipt-empty">Aggiungi una o piu voci dal menu per vedere l'ordine.</div>`;

  if (refs.receiptTotal) refs.receiptTotal.textContent = formatCurrency(sum.total);
  if (refs.receiptCount) refs.receiptCount.textContent = String(sum.count);
  if (refs.changeValue) refs.changeValue.textContent = sum.change >= 0 ? formatCurrency(sum.change) : `mancano ${formatCurrency(Math.abs(sum.change))}`;
}

function renderSavedOrders() {
  // Placeholder per futura implementazione della lista ordini salvati
}

function openIngredientDialog(itemId, lineId = null) {
  const item = getItem(itemId);
  if (!item || item.category !== "pizze") return;

  let draft = { removeIngredients: [], notes: "" };
  if (lineId) {
    const line = state.lines.find((entry) => entry.id === lineId);
    if (line) {
      draft = { removeIngredients: normalizeIngredients(line.removeIngredients), notes: String(line.notes || "") };
    }
  } else {
    draft = state.ingredientDrafts.get(itemId) || draft;
  }

  state.activeIngredientContext = { itemId, lineId, draft };
  refs.ingredientTitle.textContent = item.name;
  refs.ingredientRemoveList.innerHTML = `
    <div class="chip-list">
      ${(item.ingredients || []).map((ingredient) => `
        <label class="chip">
          <input type="checkbox" data-remove-ingredient value="${ingredient}" ${draft.removeIngredients.includes(ingredient) ? "checked" : ""}>
          <span>${ingredient}</span>
        </label>
      `).join("")}
    </div>
  `;
  refs.ingredientNotes.innerHTML = `
    <label class="ingredient-freeform">
      <span>Ingredienti extra scritti a mano</span>
      <textarea id="ingredient-notes-input" rows="5" placeholder="Esempio: panna, cipolla, funghi...">${draft.notes || ""}</textarea>
    </label>
  `;

  refs.ingredientDialog.showModal();
}

function closeIngredientDialog() {
  if (refs.ingredientDialog.open) refs.ingredientDialog.close();
  state.activeIngredientContext = null;
}

function addItem(itemId) {
  const draft = state.ingredientDrafts.get(itemId) || { removeIngredients: [], notes: "" };
  const sig = lineSignature(itemId, draft.removeIngredients, draft.notes);
  const existing = state.lines.find((line) => lineSignature(line.itemId, line.removeIngredients, line.notes) === sig);

  if (existing) {
    existing.quantity += 1;
  } else {
    state.lines.push({
      id: uid(),
      itemId,
      quantity: 1,
      removeIngredients: normalizeIngredients(draft.removeIngredients),
      notes: String(draft.notes || "").trim(),
    });
  }

  renderAll();
}

function lineMinus(lineId) {
  const line = state.lines.find((entry) => entry.id === lineId);
  if (!line) return;
  line.quantity -= 1;
  if (line.quantity <= 0) {
    state.lines = state.lines.filter((entry) => entry.id !== lineId);
  }
  renderAll();
}

function lineRemove(lineId) {
  state.lines = state.lines.filter((entry) => entry.id !== lineId);
  renderAll();
}

function splitLineAndEdit(lineId) {
  const line = state.lines.find((entry) => entry.id === lineId);
  if (!line) return;
  if (line.quantity <= 1) {
    openIngredientDialog(line.itemId, line.id);
    return;
  }

  line.quantity -= 1;
  const newLine = {
    id: uid(),
    itemId: line.itemId,
    quantity: 1,
    removeIngredients: normalizeIngredients(line.removeIngredients),
    notes: String(line.notes || "").trim(),
  };
  state.lines.push(newLine);
  renderAll();
  openIngredientDialog(newLine.itemId, newLine.id);
}

function saveIngredientSelection() {
  const context = state.activeIngredientContext;
  if (!context) return;

  const removeIngredients = [...refs.ingredientRemoveList.querySelectorAll("input[data-remove-ingredient]:checked")].map((checkbox) => checkbox.value);
  const notes = (document.getElementById("ingredient-notes-input") || { value: "" }).value.trim();

  if (context.lineId) {
    const line = state.lines.find((entry) => entry.id === context.lineId);
    if (line) {
      line.removeIngredients = normalizeIngredients(removeIngredients);
      line.notes = notes;
    }
  } else {
    state.ingredientDrafts.set(context.itemId, { removeIngredients: normalizeIngredients(removeIngredients), notes });
  }

  closeIngredientDialog();
  renderAll();
}

function clearIngredientSelection() {
  refs.ingredientRemoveList.querySelectorAll("input[data-remove-ingredient]").forEach((checkbox) => {
    checkbox.checked = false;
  });
  const notesInput = document.getElementById("ingredient-notes-input");
  if (notesInput) notesInput.value = "";
}

function clearCurrentOrder() {
  state.lines = [];
  state.customerFirstName = "";
  state.tableNumber = "";
  state.customerLastName = "";
  state.cashReceived = "";
  state.ingredientDrafts.clear();
  refs.firstNameInput.value = "";
  refs.tableNumberInput.value = "";
  refs.cashInput.value = "";
  renderAll();
}

function buildOrderSnapshot() {
  const sum = totals();
  return {
    id: uid(),
    orderNumber: state.currentOrderNumber,
    customerFirstName: state.customerFirstName,
    tableNumber: state.tableNumber,
    customerLastName: state.customerLastName,
    cashReceived: sum.paid,
    change: sum.change,
    total: sum.total,
    createdAt: new Date().toISOString(),
    lines: state.lines.map((line) => ({
      id: line.id,
      itemId: line.itemId,
      itemName: getItem(line.itemId)?.name || line.itemId,
      itemPrice: Number(getItem(line.itemId)?.price || 0),
      quantity: line.quantity,
      removeIngredients: normalizeIngredients(line.removeIngredients),
      notes: String(line.notes || "").trim(),
    })),
  };
}

function buildCategoryPrintTickets(order) {
  if (!refs.printCategoryTickets) return;

  const grouped = order.lines.reduce((acc, line) => {
    const item = getItem(line.itemId);
    if (!item) return acc;
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(line);
    return acc;
  }, {});

  const categoryOrder = Object.keys(categories);
  const createdAt = new Date(order.createdAt).toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const pages = categoryOrder
    .filter((categoryKey) => Array.isArray(grouped[categoryKey]) && grouped[categoryKey].length)
    .map((categoryKey) => {
      const lines = grouped[categoryKey];
      const categoryLabel = categories[categoryKey]?.title || categoryKey;
      const subtotal = lines.reduce((sum, line) => sum + lineTotal(line), 0);

      const rows = lines.map((line) => {
        const item = getItem(line.itemId);
        const details = customizationText(line);
        const rawName = `${line.quantity} x ${item?.name || line.itemId}`;
        const safeName = escapeHtml(preventUnitWrap(rawName));
        return `
          <div class="print-ticket-row">
            <div class="print-ticket-line-main">
              <strong class="print-ticket-item-name">${safeName}</strong>
              ${details ? `<span class="print-ticket-item-details">${escapeHtml(details)}</span>` : ""}
            </div>
          </div>
        `;
      }).join("");

      return `
        <section class="print-ticket-page">
          <p class="print-ticket-brand">Parrocchia di Sombreno</p>
          <h2 class="print-ticket-title">Sagra di Sombreno</h2>
          <p class="print-ticket-meta"><strong>Ordine N.</strong> ${order.orderNumber}</p>
          <p class="print-ticket-meta"><strong>Cliente:</strong> ${escapeHtml(order.customerFirstName || "-")}</p>
          <p class="print-ticket-meta"><strong>Tavolo:</strong> ${escapeHtml(order.tableNumber || "-")}</p>
          <p class="print-ticket-meta">Data e ora: ${createdAt}</p>
          <p class="print-ticket-department">Reparto: ${escapeHtml(categoryLabel)}</p>
          <div class="print-ticket-lines">${rows}</div>
          <div class="print-ticket-total">Totale reparto: ${formatCurrency(subtotal)}</div>
        </section>
      `;
    });

  refs.printCategoryTickets.innerHTML = pages.join("");
}

function waitForPrintAssets(timeoutMs = 1500) {
  if (!refs.printCategoryTickets) return Promise.resolve();

  const images = [...refs.printCategoryTickets.querySelectorAll("img")];
  if (!images.length) return Promise.resolve();

  return new Promise((resolve) => {
    let pending = images.length;
    const done = () => {
      pending -= 1;
      if (pending <= 0) resolve();
    };

    const timeoutId = window.setTimeout(resolve, timeoutMs);

    images.forEach((image) => {
      if (image.complete && image.naturalWidth > 0) {
        done();
        return;
      }

      const finish = () => {
        image.removeEventListener("load", finish);
        image.removeEventListener("error", finish);
        done();
      };

      image.addEventListener("load", finish, { once: true });
      image.addEventListener("error", finish, { once: true });
    });

    Promise.resolve().then(() => {
      if (pending <= 0) {
        window.clearTimeout(timeoutId);
        resolve();
      }
    });
  });
}

async function saveOrderToBackend(order) {
  try {
    const response = await fetch(`${API_BASE}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    if (response.ok) return { status: "saved" };
    if (response.status === 409) return { status: "duplicate" };
    return { status: "error" };
  } catch {
    return { status: "offline" };
  }
}

function setSaveOrderBusy(isBusy) {
  state.isSavingOrder = Boolean(isBusy);
  if (refs.saveOrderButton) {
    refs.saveOrderButton.disabled = state.isSavingOrder;
    refs.saveOrderButton.textContent = state.isSavingOrder ? "Salvataggio in corso..." : "Salva ordine";
  }
}

async function saveOrder() {
  if (state.isSavingOrder) {
    if (refs.saveStatus) refs.saveStatus.textContent = "Salvataggio gia in corso...";
    return;
  }

  if (!state.lines.length) {
    if (refs.saveStatus) refs.saveStatus.textContent = "Nessun articolo da salvare.";
    return;
  }

  setSaveOrderBusy(true);
  try {
    const order = buildOrderSnapshot();
    const backendResult = await saveOrderToBackend(order);

    if (backendResult.status === "duplicate") {
      if (refs.saveStatus) refs.saveStatus.textContent = "Ordine duplicato bloccato: non salvato due volte.";
      return;
    }

    state.savedOrders.unshift(order);
    saveSavedOrders();
    registerSavedOrder(order);

    if (refs.saveStatus) {
      refs.saveStatus.textContent = backendResult.status === "saved"
        ? "Ordine salvato su browser e file JSON backend."
        : "Ordine salvato solo in browser. Avvia il backend per il file JSON.";
    }

    buildCategoryPrintTickets(order);
    await waitForPrintAssets();
    window.print();

    state.currentOrderNumber += 1;
    saveNextOrderNumber(state.currentOrderNumber);
    clearCurrentOrder();
  } catch {
    if (refs.saveStatus) refs.saveStatus.textContent = "Errore durante il salvataggio ordine.";
  } finally {
    setSaveOrderBusy(false);
  }
}

window.addEventListener("afterprint", () => {
  if (refs.printCategoryTickets) refs.printCategoryTickets.innerHTML = "";
});

function resetEvening() {
  const ok = window.confirm("Confermi reset serata? Verranno azzerati ordini locali e contatore.");
  if (!ok) return;
  const closedEvening = closeCurrentEveningAndStartNew();
  state.lines = [];
  state.savedOrders = [];
  state.currentOrderNumber = 1;
  state.customerFirstName = "";
  state.tableNumber = "";
  state.customerLastName = "";
  state.cashReceived = "";
  state.ingredientDrafts.clear();
  saveSavedOrders();
  saveNextOrderNumber(1);
  refs.firstNameInput.value = "";
  refs.tableNumberInput.value = "";
  refs.cashInput.value = "";
  if (refs.saveStatus) {
    refs.saveStatus.textContent = closedEvening.hasData
      ? `Serata chiusa: ${formatCurrency(closedEvening.total)} su ${closedEvening.orders} ordini.`
      : "Serata azzerata.";
  }
  renderAll();
}

function renderAll() {
  renderMenu();
  renderReceipt();
  renderSavedOrders();
}

document.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");
  if (actionButton) {
    const action = actionButton.dataset.action;
    const itemId = actionButton.dataset.itemId;
    const lineId = actionButton.dataset.lineId;

    if (action === "add-item") return addItem(itemId);
    if (action === "open-ingredient-dialog") return openIngredientDialog(itemId);
    if (action === "line-minus") return lineMinus(lineId);
    if (action === "line-remove") return lineRemove(lineId);
    if (action === "line-edit") {
      const line = state.lines.find((entry) => entry.id === lineId);
      if (line) openIngredientDialog(line.itemId, line.id);
      return;
    }
    if (action === "line-split-edit") return splitLineAndEdit(lineId);
    if (action === "save-ingredients") return saveIngredientSelection();
    if (action === "clear-ingredient-selection") return clearIngredientSelection();
    if (action === "close-ingredient-dialog") return closeIngredientDialog();
    if (action === "save-order") return saveOrder();
    if (action === "reset-evening") return resetEvening();
  }

  const filterButton = event.target.closest(".filter");
  if (filterButton) {
    state.filter = filterButton.dataset.filter;
    document.querySelectorAll(".filter").forEach((button) => {
      button.classList.toggle("active", button.dataset.filter === state.filter);
    });
    renderMenu();
  }
});

refs.firstNameInput.addEventListener("input", (event) => {
  state.customerFirstName = event.target.value;
  renderReceipt();
});

refs.tableNumberInput.addEventListener("input", (event) => {
  state.tableNumber = event.target.value;
  renderReceipt();
});

refs.cashInput.addEventListener("input", (event) => {
  state.cashReceived = event.target.value;
  renderReceipt();
});

refs.ingredientDialog.addEventListener("close", () => {
  state.activeIngredientContext = null;
});

window.addEventListener("beforeunload", () => {
  saveNextOrderNumber(state.currentOrderNumber);
});

renderAll();

// Se la pagina viene aperta con ?reprint=<id> esegui la ristampa usando il template canonico
window.addEventListener("load", async () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const reprintId = params.get("reprint");
    if (!reprintId) return;

    // assicurati di avere gli ordini caricati
    const saved = loadSavedOrders();
    const order = saved.find((o) => (o.id && String(o.id) === reprintId) || String(o.orderNumber) === reprintId || String(o.createdAt) === reprintId);
    if (!order) return;

    // costruisci i tickets e stampa con lo stesso flusso
    buildCategoryPrintTickets(order);
    await waitForPrintAssets();
    window.print();
  } catch (err) {
    // fail silently
  }
});
