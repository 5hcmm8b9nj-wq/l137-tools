/* ============================================================
   David's Cave of Adullam — App Logic
   ============================================================ */

const STORE_KEY = "adullam.warriors.v1";

// Safe storage wrapper: uses browser persistent storage when available, falls back to in-memory.
const safeStorage = (() => {
  const KEY = ["local", "Storage"].join("");
  const mem = {};
  const memStore = {
    get: (k) => (k in mem ? mem[k] : null),
    set: (k, v) => { mem[k] = v; },
    remove: (k) => { delete mem[k]; },
    persistent: false
  };
  try {
    const s = window[KEY];
    if (!s) return memStore;
    const t = "__t__";
    s.setItem(t, t); s.removeItem(t);
    return {
      get: (k) => s.getItem(k),
      set: (k, v) => s.setItem(k, v),
      remove: (k) => s.removeItem(k),
      persistent: true
    };
  } catch (e) {
    return memStore;
  }
})();

const store = {
  data: null,
  load() {
    try {
      this.data = JSON.parse(safeStorage.get(STORE_KEY)) || {};
    } catch (e) { this.data = {}; }
    if (!this.data.days) this.data.days = {};
    if (!this.data.characters) this.data.characters = {};
    if (!this.data.testimonies) this.data.testimonies = [];
    if (!this.data.covenant) this.data.covenant = { qualities: [], name: "", date: "" };
    return this.data;
  },
  save() {
    safeStorage.set(STORE_KEY, JSON.stringify(this.data));
  },
  reset() {
    safeStorage.remove(STORE_KEY);
    this.load();
  }
};

/* ---------- Nav ---------- */
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  toggle?.addEventListener("click", () => links.classList.toggle("open"));
  document.querySelectorAll(".nav-links a").forEach(a => {
    a.addEventListener("click", () => links.classList.remove("open"));
  });
}

/* ---------- Stations ---------- */
function renderStations() {
  const tabsEl = document.getElementById("station-tabs");
  const panelsEl = document.getElementById("station-panels");
  tabsEl.innerHTML = "";
  panelsEl.innerHTML = "";

  STATIONS.forEach((s, i) => {
    const tab = document.createElement("button");
    tab.className = "station-tab" + (i === 0 ? " active" : "");
    tab.textContent = `Station ${s.n}`;
    tab.dataset.index = i;
    tabsEl.appendChild(tab);

    const panel = document.createElement("div");
    panel.className = "station-panel" + (i === 0 ? " active" : "");
    panel.dataset.index = i;
    panel.innerHTML = `
      <div class="station-number">Prayer Station ${s.n}</div>
      <h3>${s.title}</h3>
      <blockquote class="scripture">${s.scripture.text}<span class="ref">${s.scripture.ref}</span></blockquote>
      <span class="label">Prayer Focus</span>
      <p class="body-text">${s.focus}</p>
      <span class="label">Pray</span>
      <p class="body-text">${s.prayer}</p>
      ${s.declaration ? `<span class="label">Declaration</span><div class="declaration">${s.declaration}</div>` : ""}
      <div class="station-nav">
        <button class="btn" data-nav="prev">◂ Previous</button>
        <button class="btn btn-primary" data-nav="next">Next Station ▸</button>
      </div>
    `;
    panelsEl.appendChild(panel);
  });

  const setActive = (i) => {
    document.querySelectorAll(".station-tab").forEach(t => t.classList.toggle("active", +t.dataset.index === i));
    document.querySelectorAll(".station-panel").forEach(p => p.classList.toggle("active", +p.dataset.index === i));
    document.getElementById("stations").scrollIntoView({ behavior: "smooth", block: "start" });
  };

  tabsEl.addEventListener("click", e => {
    if (e.target.classList.contains("station-tab")) setActive(+e.target.dataset.index);
  });
  panelsEl.addEventListener("click", e => {
    if (e.target.dataset.nav) {
      const active = document.querySelector(".station-panel.active");
      const idx = +active.dataset.index;
      const next = e.target.dataset.nav === "next" ? Math.min(idx + 1, STATIONS.length - 1) : Math.max(0, idx - 1);
      setActive(next);
    }
  });
}

/* ---------- 40-Day Journey ---------- */
function renderJourney() {
  const grid = document.getElementById("day-grid");
  grid.innerHTML = "";
  DAYS.forEach((d, i) => {
    const chip = document.createElement("button");
    chip.className = "day-chip";
    chip.dataset.day = d.n;
    chip.textContent = d.n;
    const entry = store.data.days[d.n];
    if (entry && (entry.prayed || entry.read || entry.journal)) chip.classList.add("completed");
    grid.appendChild(chip);
  });
  grid.addEventListener("click", e => {
    if (e.target.classList.contains("day-chip")) openDay(+e.target.dataset.day);
  });
  openDay(1);
  updateProgress();
}

function openDay(n) {
  document.querySelectorAll(".day-chip").forEach(c => c.classList.toggle("active", +c.dataset.day === n));
  const d = DAYS.find(x => x.n === n);
  const panel = document.getElementById("day-panel");
  const entry = store.data.days[n] || {};

  panel.innerHTML = `
    <div class="day-title">Day ${d.n}</div>
    <h3>${d.theme}</h3>
    <blockquote class="scripture">${d.scripture.text}<span class="ref">${d.scripture.ref}</span></blockquote>

    <span class="label" style="display:block;font-family:'Cinzel',serif;font-size:0.72rem;letter-spacing:0.25em;text-transform:uppercase;color:var(--gold-400);margin-top:1.5rem;margin-bottom:0.5rem;">Think</span>
    <p style="color:var(--parchment);font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.1rem;">${d.prompt}</p>
    <textarea data-field="journal" rows="4" placeholder="Write your reflection…">${entry.journal || ""}</textarea>

    <span class="label" style="display:block;font-family:'Cinzel',serif;font-size:0.72rem;letter-spacing:0.25em;text-transform:uppercase;color:var(--gold-400);margin-top:1.5rem;margin-bottom:0.5rem;">Pray</span>
    <p style="color:var(--parchment);font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.15rem;padding-left:1rem;border-left:2px solid var(--gold-500);">${d.prayer}</p>

    <span class="label" style="display:block;font-family:'Cinzel',serif;font-size:0.72rem;letter-spacing:0.25em;text-transform:uppercase;color:var(--gold-400);margin-top:1.5rem;margin-bottom:0.5rem;">Declaration</span>
    <p style="color:var(--gold-200);font-family:'Cinzel',serif;font-size:1rem;text-align:center;padding:1rem;background:rgba(212,169,73,0.06);border-radius:4px;">${d.declaration}</p>

    <div class="tracker-actions">
      <button class="tracker-btn ${entry.prayed ? "on" : ""}" data-toggle="prayed">✓ Prayed</button>
      <button class="tracker-btn ${entry.read ? "on" : ""}" data-toggle="read">✓ Read Scripture</button>
      <button class="tracker-btn ${entry.journal ? "on" : ""}" data-toggle="journalDone">✓ Journaled</button>
    </div>

    <div class="station-nav" style="margin-top:1.5rem;">
      <button class="btn" data-nav="prev" ${n === 1 ? "disabled" : ""}>◂ Day ${n - 1}</button>
      <button class="btn btn-primary" data-nav="next" ${n === 40 ? "disabled" : ""}>Day ${n + 1} ▸</button>
    </div>
  `;

  // Bindings
  panel.querySelector("[data-field='journal']").addEventListener("input", e => {
    store.data.days[n] = store.data.days[n] || {};
    store.data.days[n].journal = e.target.value;
    store.save();
    updateProgress();
    document.querySelector(`.day-chip[data-day='${n}']`).classList.toggle("completed",
      !!(store.data.days[n].prayed || store.data.days[n].read || store.data.days[n].journal));
  });

  panel.querySelectorAll("[data-toggle]").forEach(btn => {
    btn.addEventListener("click", () => {
      const field = btn.dataset.toggle;
      store.data.days[n] = store.data.days[n] || {};
      store.data.days[n][field] = !store.data.days[n][field];
      store.save();
      btn.classList.toggle("on", store.data.days[n][field]);
      updateProgress();
      document.querySelector(`.day-chip[data-day='${n}']`).classList.toggle("completed",
        !!(store.data.days[n].prayed || store.data.days[n].read || store.data.days[n].journal));
    });
  });

  panel.querySelectorAll("[data-nav]").forEach(btn => {
    btn.addEventListener("click", () => {
      const dir = btn.dataset.nav === "next" ? 1 : -1;
      const target = Math.max(1, Math.min(40, n + dir));
      openDay(target);
      document.getElementById("journey").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function updateProgress() {
  const total = 40;
  const done = DAYS.filter(d => {
    const e = store.data.days[d.n];
    return e && e.prayed && e.read;
  }).length;
  const pct = Math.round((done / total) * 100);
  document.getElementById("progress-fill").style.width = pct + "%";
  document.getElementById("progress-count").textContent = `${done} of ${total} days`;
  document.getElementById("progress-pct").textContent = pct + "%";
}

/* ---------- Character Studies ---------- */
function renderCharacters() {
  const grid = document.getElementById("char-grid");
  grid.innerHTML = "";
  CHARACTERS.forEach(c => {
    const card = document.createElement("article");
    card.className = "char-card";
    card.dataset.key = c.key;
    card.innerHTML = `
      <svg class="char-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14.5 17.5 3 6V3h3l11.5 11.5"/>
        <path d="M13 19l6-6"/>
        <path d="M16 16l4 4"/>
        <path d="M19 21l2-2"/>
      </svg>
      <h3>${c.name}</h3>
      <span class="verse-ref">${c.ref}</span>
      <p>“${c.tagline}”</p>
    `;
    grid.appendChild(card);
  });
  grid.addEventListener("click", e => {
    const card = e.target.closest(".char-card");
    if (card) openCharacter(card.dataset.key);
  });
}

function openCharacter(key) {
  const c = CHARACTERS.find(x => x.key === key);
  const modal = document.getElementById("modal");
  const body = document.getElementById("modal-body");
  const saved = store.data.characters[key] || {};

  let promptsHtml = "";
  c.prompts.forEach(p => {
    if (p.type === "checklist") {
      const chosen = saved[p.key] || [];
      promptsHtml += `<span class="label">${p.label}</span><ul class="checklist" data-key="${p.key}" data-type="checklist">`;
      p.options.forEach(opt => {
        promptsHtml += `<li><input type="checkbox" ${chosen.includes(opt) ? "checked" : ""} value="${opt}"><span>${opt}</span></li>`;
      });
      promptsHtml += `</ul>`;
    } else {
      promptsHtml += `<span class="label">${p.label}</span><textarea data-key="${p.key}" rows="3">${saved[p.key] || ""}</textarea>`;
    }
  });

  body.innerHTML = `
    <button class="modal-close" aria-label="Close">×</button>
    <div class="day-title">Character Study</div>
    <h3>${c.name}</h3>
    <blockquote class="scripture">${c.scripture}<span class="ref">${c.ref}</span></blockquote>
    ${promptsHtml}
    <span class="label">Prayer</span>
    <p style="font-family:'Cormorant Garamond',serif;font-style:italic;color:var(--gold-200);font-size:1.15rem;padding-left:1rem;border-left:2px solid var(--gold-500);">${c.prayer}</p>
    <button class="btn btn-primary" style="margin-top:1.5rem;width:100%;" id="char-save">Save Reflection</button>
  `;

  modal.classList.add("open");

  body.querySelector(".modal-close").onclick = () => modal.classList.remove("open");
  body.querySelector("#char-save").onclick = () => {
    const entry = {};
    body.querySelectorAll("textarea[data-key]").forEach(t => entry[t.dataset.key] = t.value);
    body.querySelectorAll("ul.checklist[data-type='checklist']").forEach(ul => {
      const list = [];
      ul.querySelectorAll("input[type='checkbox']:checked").forEach(cb => list.push(cb.value));
      entry[ul.dataset.key] = list;
    });
    store.data.characters[key] = entry;
    store.save();
    modal.classList.remove("open");
  };
}

/* ---------- Testimonies ---------- */
function renderTestimonies() {
  const list = document.getElementById("testimony-list");
  list.innerHTML = "";
  if (!store.data.testimonies.length) {
    list.innerHTML = `<p style="text-align:center;color:var(--gold-400);font-family:'Cormorant Garamond',serif;font-style:italic;">Your testimonies will appear here as you record what God has done.</p>`;
    return;
  }
  store.data.testimonies.slice().reverse().forEach((t, revIdx) => {
    const idx = store.data.testimonies.length - 1 - revIdx;
    const card = document.createElement("div");
    card.className = "testimony-card";
    card.innerHTML = `
      <div class="meta">
        <span>${t.date} · ${t.status}</span>
        <button class="del" data-idx="${idx}">Delete</button>
      </div>
      <p>${t.text.replace(/</g,"&lt;")}</p>
    `;
    list.appendChild(card);
  });
  list.querySelectorAll(".del").forEach(b => b.onclick = () => {
    const i = +b.dataset.idx;
    store.data.testimonies.splice(i, 1);
    store.save();
    renderTestimonies();
  });
}

function initTestimonyForm() {
  const form = document.getElementById("testimony-form");
  form.querySelector("[name=date]").value = new Date().toISOString().slice(0,10);
  form.addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(form);
    const t = { date: fd.get("date"), status: fd.get("status"), text: fd.get("text").trim() };
    if (!t.text) return;
    store.data.testimonies.push(t);
    store.save();
    form.reset();
    form.querySelector("[name=date]").value = new Date().toISOString().slice(0,10);
    renderTestimonies();
  });
}

/* ---------- Scripture Library ---------- */
function renderScripture() {
  const passages = [
    { key: "sam22", title: "1 Samuel 22:1–2 · The Cave of Adullam", verses: KJV_1_SAM_22 },
    { key: "sam23", title: "2 Samuel 23:8–39 · The Mighty Men", verses: KJV_2_SAMUEL_23 },
    { key: "chr11", title: "1 Chronicles 11:10–47 · Strengthened Themselves With Him", verses: KJV_1_CHRON_11 }
  ];
  const tabs = document.getElementById("scripture-tabs");
  const container = document.getElementById("scripture-container");
  tabs.innerHTML = "";
  container.innerHTML = "";
  passages.forEach((p, i) => {
    const t = document.createElement("button");
    t.className = "scripture-tab" + (i === 0 ? " active" : "");
    t.textContent = p.key === "sam22" ? "1 Samuel 22" : p.key === "sam23" ? "2 Samuel 23" : "1 Chronicles 11";
    t.dataset.key = p.key;
    tabs.appendChild(t);

    const passage = document.createElement("div");
    passage.className = "scripture-passage" + (i === 0 ? " active" : "");
    passage.dataset.key = p.key;
    passage.innerHTML = `<h3>${p.title}</h3>` +
      p.verses.map(([n, v]) => `<p class="verse"><span class="num">${n}</span>${v}</p>`).join("");
    container.appendChild(passage);
  });

  tabs.addEventListener("click", e => {
    if (!e.target.classList.contains("scripture-tab")) return;
    tabs.querySelectorAll(".scripture-tab").forEach(t => t.classList.toggle("active", t.dataset.key === e.target.dataset.key));
    container.querySelectorAll(".scripture-passage").forEach(p => p.classList.toggle("active", p.dataset.key === e.target.dataset.key));
  });
}

/* ---------- Covenant ---------- */
function renderCovenant() {
  const box = document.getElementById("covenant-qualities");
  box.innerHTML = "";
  const chosen = store.data.covenant.qualities || [];
  COVENANT_QUALITIES.forEach(q => {
    const li = document.createElement("li");
    li.innerHTML = `<input type="checkbox" value="${q}" ${chosen.includes(q) ? "checked" : ""}><span>${q}</span>`;
    box.appendChild(li);
  });

  const nameInput = document.getElementById("cov-name");
  const dateInput = document.getElementById("cov-date");
  nameInput.value = store.data.covenant.name || "";
  dateInput.value = store.data.covenant.date || new Date().toISOString().slice(0,10);

  const save = () => {
    const list = [];
    box.querySelectorAll("input[type='checkbox']:checked").forEach(cb => list.push(cb.value));
    store.data.covenant = { qualities: list, name: nameInput.value, date: dateInput.value };
    store.save();
  };
  box.addEventListener("change", save);
  nameInput.addEventListener("input", save);
  dateInput.addEventListener("change", save);

  document.getElementById("cov-print").addEventListener("click", () => window.print());
  document.getElementById("cov-reset").addEventListener("click", () => {
    if (confirm("Reset your entire journey? All journal entries, prayer tracker, testimonies, and covenant will be cleared.")) {
      store.reset();
      renderJourney();
      renderTestimonies();
      renderCovenant();
    }
  });
}

/* ---------- Export progress ---------- */
function initExport() {
  document.getElementById("export-json")?.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(store.data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `adullam-journey-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  store.load();
  initNav();
  renderStations();
  renderJourney();
  renderCharacters();
  renderTestimonies();
  initTestimonyForm();
  renderScripture();
  renderCovenant();
  initExport();

  // Close modal on backdrop click
  document.getElementById("modal").addEventListener("click", e => {
    if (e.target.id === "modal") e.currentTarget.classList.remove("open");
  });
});
