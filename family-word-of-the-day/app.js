// ============ CONFIG ============
// TODAY is injected by the template as window.__TODAY__.
// Fallback keeps the file usable if opened standalone.
const TODAY = (typeof window !== "undefined" && window.__TODAY__) ? window.__TODAY__ : {
  date: "2026-08-11",
  title: "Walking in Divine Power",
  scripture: "Romans 8:19",
  lesson: "Creation is waiting for the sons of God to manifest divine power in daily life."
};

// ============ IN-MEMORY STATE + URL SYNC ============
// We can't use localStorage in the preview iframe, so state lives in memory
// and can be exported / imported via the URL hash. That way a family member
// can bookmark the URL after committing, or paste yesterday's URL the next day
// to see their follow-up.

let store = { days: {}, lastTier: "teen" };

function encodeState(s) {
  try { return btoa(unescape(encodeURIComponent(JSON.stringify(s)))); }
  catch { return ""; }
}
function decodeState(str) {
  try { return JSON.parse(decodeURIComponent(escape(atob(str)))); }
  catch { return null; }
}

function loadFromHash() {
  const hash = (location.hash || "").replace(/^#/, "");
  if (!hash) return;
  const params = new URLSearchParams(hash);
  const s = params.get("s");
  if (s) {
    const parsed = decodeState(s);
    if (parsed && typeof parsed === "object") store = { days: {}, lastTier: "teen", ...parsed };
  }
}

function updateHash() {
  const encoded = encodeState(store);
  history.replaceState(null, "", `#s=${encoded}`);
  // Also update share links
  const url = location.href;
  const shareEl = document.getElementById("share-url");
  if (shareEl) shareEl.value = url;
}

// ============ YESTERDAY FOLLOW-UP ============
function findYesterday() {
  const entries = Object.entries(store.days || {})
    .filter(([date, d]) => date !== TODAY.date && d.commits && Object.keys(d.commits).length > 0)
    .sort((a, b) => b[0].localeCompare(a[0]));
  return entries[0] || null;
}

function renderYesterday() {
  const y = findYesterday();
  if (!y) return;
  const [date, data] = y;
  const tierOrder = ["teen", "young", "older", "retired"];
  const lastTier = store.lastTier && data.commits[store.lastTier] ? store.lastTier : tierOrder.find(t => data.commits[t]);
  const commit = data.commits[lastTier];
  if (!commit) return;

  document.getElementById("y-title").textContent = `${data.title} (${data.scripture})`;
  document.getElementById("y-lesson").textContent = data.lesson;
  document.getElementById("y-commit").textContent = `"${commit.text}"`;
  if (commit.reflection) document.getElementById("y-reflect").value = commit.reflection;
  document.getElementById("yesterday-section").classList.remove("hidden");
}

document.getElementById("save-reflect").addEventListener("click", () => {
  const y = findYesterday();
  if (!y) { document.getElementById("yesterday-section").classList.add("hidden"); return; }
  const [date, data] = y;
  const tierOrder = ["teen", "young", "older", "retired"];
  const lastTier = store.lastTier && data.commits[store.lastTier] ? store.lastTier : tierOrder.find(t => data.commits[t]);
  const text = document.getElementById("y-reflect").value.trim();
  if (text && lastTier) {
    data.commits[lastTier].reflection = text;
    store.days[date] = data;
    updateHash();
  }
  document.getElementById("yesterday-section").classList.add("hidden");
  document.querySelector(".scripture").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("skip-yesterday").addEventListener("click", () => {
  document.getElementById("yesterday-section").classList.add("hidden");
});

// ============ TABS ============
function activateTier(tier) {
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.tier === tier));
  document.querySelectorAll(".tier-panel").forEach(p => p.classList.toggle("active", p.dataset.panel === tier));
  store.lastTier = tier;
  updateHash();
  restoreCommitUI(tier);
}
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => activateTier(tab.dataset.tier));
});

// ============ COMMIT ============
function currentChoice(tier) {
  const radios = document.querySelectorAll(`input[name="${tier}-choice"]`);
  let val = null;
  radios.forEach(r => { if (r.checked) val = r.value; });
  if (val === "__custom__") {
    const custom = document.querySelector(`.custom-input[data-for="${tier}"]`);
    return (custom.value || "").trim();
  }
  return val;
}

function saveCommit(tier) {
  const text = currentChoice(tier);
  const msgEl = document.querySelector(`[data-saved="${tier}"]`);
  if (!text) {
    msgEl.textContent = "Please pick one (or write your own) first.";
    msgEl.style.color = "#a53030";
    return;
  }
  if (!store.days[TODAY.date]) {
    store.days[TODAY.date] = {
      title: TODAY.title,
      scripture: TODAY.scripture,
      lesson: TODAY.lesson,
      commits: {}
    };
  }
  store.days[TODAY.date].commits[tier] = { text, savedAt: new Date().toISOString() };
  store.lastTier = tier;
  updateHash();
  msgEl.textContent = "✓ Saved. Bookmark this page or use the Share link below to keep it for tomorrow.";
  msgEl.style.color = "#2f7a2a";
  const btn = document.querySelector(`[data-commit="${tier}"]`);
  btn.classList.add("saved");
  btn.textContent = "Saved ✓ — Update";
  // Reveal share panel
  document.getElementById("share-panel").classList.remove("hidden");
}

function restoreCommitUI(tier) {
  const today = store.days[TODAY.date];
  const msgEl = document.querySelector(`[data-saved="${tier}"]`);
  const btn = document.querySelector(`[data-commit="${tier}"]`);
  if (!today || !today.commits[tier]) {
    msgEl.textContent = "";
    btn.classList.remove("saved");
    btn.textContent = "Commit for Today";
    return;
  }
  const saved = today.commits[tier].text;
  let matched = false;
  document.querySelectorAll(`input[name="${tier}-choice"]`).forEach(r => {
    if (r.value === saved) { r.checked = true; matched = true; }
  });
  if (!matched) {
    const customRadio = document.querySelector(`input[name="${tier}-choice"][value="__custom__"]`);
    if (customRadio) customRadio.checked = true;
    const customInput = document.querySelector(`.custom-input[data-for="${tier}"]`);
    if (customInput) customInput.value = saved;
  }
  msgEl.textContent = "✓ Saved. Bookmark this page or use the Share link below to keep it for tomorrow.";
  msgEl.style.color = "#2f7a2a";
  btn.classList.add("saved");
  btn.textContent = "Saved ✓ — Update";
  document.getElementById("share-panel").classList.remove("hidden");
}

document.querySelectorAll("[data-commit]").forEach(btn => {
  btn.addEventListener("click", () => saveCommit(btn.dataset.commit));
});

document.querySelectorAll(".custom-input").forEach(inp => {
  inp.addEventListener("focus", () => {
    const tier = inp.dataset.for;
    const r = document.querySelector(`input[name="${tier}-choice"][value="__custom__"]`);
    if (r) r.checked = true;
  });
});

// ============ SHARE / COPY ============
document.addEventListener("click", (e) => {
  if (e.target.matches("#copy-url")) {
    const el = document.getElementById("share-url");
    el.select();
    try {
      document.execCommand("copy");
      e.target.textContent = "Copied ✓";
      setTimeout(() => { e.target.textContent = "Copy link"; }, 1600);
    } catch {
      e.target.textContent = "Copy failed";
    }
  }
  if (e.target.matches("#copy-whatsapp")) {
    const today = store.days[TODAY.date];
    const tier = store.lastTier;
    const commit = today && today.commits[tier] ? today.commits[tier].text : "";
    const msg = `📖 Walking in Divine Power — Romans 8:19\n\nToday I will: "${commit}"\n\nJoin the family devotional: ${location.href}`;
    const ta = document.createElement("textarea");
    ta.value = msg;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); e.target.textContent = "Copied ✓"; }
    catch { e.target.textContent = "Copy failed"; }
    setTimeout(() => { e.target.textContent = "Copy WhatsApp message"; }, 1800);
    document.body.removeChild(ta);
  }
});

// ============ RESET ============
document.getElementById("reset-all").addEventListener("click", () => {
  if (confirm("Clear all commitments and reflections from this session?")) {
    store = { days: {}, lastTier: "teen" };
    history.replaceState(null, "", location.pathname);
    location.reload();
  }
});

// ============ INIT ============
(function init() {
  loadFromHash();
  activateTier(store.lastTier || "teen");
  renderYesterday();
  updateHash();
})();
