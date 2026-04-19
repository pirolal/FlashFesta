const STORAGE_KEYS = {
  festivalStats: "flashfesta_festival_stats_v1",
  adminAuth: "flashfesta_admin_auth_v1",
};

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "flashfesta2026",
};

const refs = {
  app: document.getElementById("admin-app"),
  loginView: document.getElementById("admin-login-view"),
  loginForm: document.getElementById("admin-login-form"),
  usernameInput: document.getElementById("admin-username"),
  passwordInput: document.getElementById("admin-password"),
  loginError: document.getElementById("admin-login-error"),
  festivalTotal: document.getElementById("festival-total"),
  eveningsCount: document.getElementById("evenings-count"),
  currentEveningTotal: document.getElementById("current-evening-total"),
  currentEveningOrders: document.getElementById("current-evening-orders"),
  chart: document.getElementById("evening-chart"),
  eveningList: document.getElementById("evening-list"),
  status: document.getElementById("admin-status"),
  reloadButton: document.getElementById("reload-admin"),
  resetFestivalButton: document.getElementById("reset-festival"),
  logoutButton: document.getElementById("logout-admin"),
};

function setAuthenticated(value) {
  if (value) {
    sessionStorage.setItem(STORAGE_KEYS.adminAuth, "1");
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.adminAuth);
  }
}

function isAuthenticated() {
  return sessionStorage.getItem(STORAGE_KEYS.adminAuth) === "1";
}

function showLogin() {
  if (refs.app) refs.app.classList.add("is-hidden");
  if (refs.loginView) refs.loginView.classList.remove("is-hidden");
  if (refs.passwordInput) refs.passwordInput.value = "";
}

function showApp() {
  if (refs.loginView) refs.loginView.classList.add("is-hidden");
  if (refs.app) refs.app.classList.remove("is-hidden");
}

function checkCredentials(username, password) {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const username = String(refs.usernameInput?.value || "").trim();
  const password = String(refs.passwordInput?.value || "");
  const ok = checkCredentials(username, password);

  if (!ok) {
    if (refs.loginError) refs.loginError.textContent = "Credenziali non valide.";
    return;
  }

  setAuthenticated(true);
  if (refs.loginError) refs.loginError.textContent = "";
  showApp();
  renderAdmin();
}

function logoutAdmin() {
  setAuthenticated(false);
  showLogin();
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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

function festivalTotal(stats) {
  const closed = stats.evenings.reduce((sum, evening) => sum + Number(evening.total || 0), 0);
  return closed + Number(stats.currentEvening.total || 0);
}

function buildSeries(stats) {
  const closedSeries = stats.evenings.map((evening, index) => ({
    label: `Serata ${index + 1}`,
    amount: Number(evening.total || 0),
    subtitle: `${formatDate(evening.closedAt)} - ${Number(evening.orders || 0)} ordini`,
  }));

  return [
    ...closedSeries,
    {
      label: "In corso",
      amount: Number(stats.currentEvening.total || 0),
      subtitle: `${Number(stats.currentEvening.orders || 0)} ordini`,
    },
  ];
}

function drawChart(series) {
  if (!refs.chart) return;

  const rect = refs.chart.getBoundingClientRect();
  const width = Math.max(320, Math.floor(rect.width));
  const height = 320;
  const dpr = window.devicePixelRatio || 1;

  refs.chart.width = Math.floor(width * dpr);
  refs.chart.height = Math.floor(height * dpr);

  const ctx = refs.chart.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  ctx.clearRect(0, 0, width, height);

  const padding = { top: 24, right: 20, bottom: 54, left: 56 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  ctx.fillStyle = "rgba(255,255,255,0.58)";
  ctx.fillRect(padding.left, padding.top, plotWidth, plotHeight);

  const maxValue = Math.max(10, ...series.map((point) => point.amount));
  const yStep = maxValue / 4;

  ctx.strokeStyle = "rgba(44,28,16,0.16)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i += 1) {
    const y = padding.top + (plotHeight * i) / 4;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(padding.left + plotWidth, y);
    ctx.stroke();

    const value = maxValue - (yStep * i);
    ctx.fillStyle = "#6e6258";
    ctx.font = "11px Inter, sans-serif";
    ctx.fillText(formatCurrency(value), 8, y + 4);
  }

  const count = Math.max(1, series.length);
  const xStep = count > 1 ? plotWidth / (count - 1) : 0;

  const points = series.map((point, index) => {
    const x = padding.left + (index * xStep);
    const ratio = maxValue > 0 ? point.amount / maxValue : 0;
    const y = padding.top + plotHeight - (ratio * plotHeight);
    return { ...point, x, y };
  });

  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.strokeStyle = "#d45d2f";
  ctx.lineWidth = 3;
  ctx.stroke();

  points.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#2f6f5f";
    ctx.fill();

    ctx.fillStyle = "#201913";
    ctx.font = "600 11px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(point.label, point.x, height - 30);
    ctx.fillStyle = "#6e6258";
    ctx.fillText(formatCurrency(point.amount), point.x, point.y - 10);
  });
}

function renderEveningList(stats) {
  const rows = [
    ...stats.evenings.map((evening, index) => ({
      label: `Serata ${index + 1}`,
      when: `${formatDate(evening.startedAt)} -> ${formatDate(evening.closedAt)}`,
      total: Number(evening.total || 0),
      orders: Number(evening.orders || 0),
      state: "Chiusa",
    })),
    {
      label: "Serata in corso",
      when: `Da ${formatDate(stats.currentEvening.startedAt)}`,
      total: Number(stats.currentEvening.total || 0),
      orders: Number(stats.currentEvening.orders || 0),
      state: "Aperta",
    },
  ];

  refs.eveningList.innerHTML = rows.length
    ? rows.map((row) => `
      <article class="saved-order admin-row">
        <h3>${row.label}</h3>
        <p>${row.when}</p>
        <div class="saved-order-footer">
          <strong>${formatCurrency(row.total)}</strong>
          <span>${row.orders} ordini - ${row.state}</span>
        </div>
      </article>
    `).join("")
    : `<div class="receipt-empty">Nessuna serata registrata.</div>`;
}

function renderAdmin() {
  const stats = loadFestivalStats();
  const total = festivalTotal(stats);

  refs.festivalTotal.textContent = formatCurrency(total);
  refs.eveningsCount.textContent = String(stats.evenings.length);
  refs.currentEveningTotal.textContent = formatCurrency(stats.currentEvening.total);
  refs.currentEveningOrders.textContent = String(stats.currentEvening.orders);

  const series = buildSeries(stats);
  drawChart(series);
  renderEveningList(stats);

  refs.status.textContent = `Ultimo aggiornamento: ${formatDate(stats.lastUpdatedAt)}`;
}

function resetFestival() {
  const ok = window.confirm("Confermi fine sagra? I totali admin verranno azzerati.");
  if (!ok) return;

  localStorage.removeItem(STORAGE_KEYS.festivalStats);
  refs.status.textContent = "Fine sagra eseguita: totali admin azzerati.";
  renderAdmin();
}

if (refs.loginForm) refs.loginForm.addEventListener("submit", handleLoginSubmit);
if (refs.reloadButton) refs.reloadButton.addEventListener("click", renderAdmin);
if (refs.resetFestivalButton) refs.resetFestivalButton.addEventListener("click", resetFestival);
if (refs.logoutButton) refs.logoutButton.addEventListener("click", logoutAdmin);
window.addEventListener("resize", () => {
  if (isAuthenticated()) renderAdmin();
});

if (isAuthenticated()) {
  showApp();
  renderAdmin();
} else {
  showLogin();
}
