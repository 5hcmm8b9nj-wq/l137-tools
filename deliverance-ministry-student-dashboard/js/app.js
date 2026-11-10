// L137 Deliverance Ministry · Student Dashboard
// LocalStorage progress tracking. Passcode gate.

// Accept any of these (case-insensitive, ignores spaces / dashes / dots / colons)
const ACCEPTED_PASSCODES = ["L137", "L-137", "L 137", "LUKE137", "LUKE 1 37", "LUKE 1:37", "137"];
const STORAGE_KEY = "l137_progress_v1";

// ---------- Safe storage (falls back to in-memory when blocked, e.g. preview iframe) ----------
const _mem = { session: {}, local: {} };
const safeStore = (kind) => {
  const real = kind === "session" ? "sessionStorage" : "localStorage";
  return {
    get(k) {
      try { return window[real].getItem(k); } catch { return _mem[kind][k] ?? null; }
    },
    set(k, v) {
      try { window[real].setItem(k, v); } catch { _mem[kind][k] = v; }
    },
    remove(k) {
      try { window[real].removeItem(k); } catch { delete _mem[kind][k]; }
    }
  };
};
const sStore = safeStore("session");
const lStore = safeStore("local");

// ---------- Gate ----------
function unlocked() { return sStore.get("l137_gate") === "1"; }
function setUnlocked() { sStore.set("l137_gate", "1"); }

function initGate() {
  const gate = document.getElementById("gate");
  if (unlocked()) { gate.style.display = "none"; return; }
  const input = document.getElementById("gate-input");
  const btn = document.getElementById("gate-btn");
  const err = document.getElementById("gate-err");
  // Do NOT autofocus on mobile (iOS opens keyboard, hides the button)
  const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  if (!isTouch) { try { input.focus(); } catch {} }
  // When the input gains focus on mobile, scroll the button into view so it isn't hidden by keyboard
  input.addEventListener("focus", () => {
    setTimeout(() => {
      btn.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 300);
  });
  const normalize = (s) => (s || "").toUpperCase().replace(/[\s\-\.\:_]/g, "");
  const accepted = ACCEPTED_PASSCODES.map(normalize);
  const tryUnlock = () => {
    const v = normalize(input.value);
    if (accepted.includes(v)) {
      setUnlocked();
      gate.style.opacity = "0";
      gate.style.transition = "opacity .3s ease";
      setTimeout(() => { gate.style.display = "none"; }, 300);
    } else {
      err.textContent = v ? `"${input.value}" not recognised. Try L137 (no space).` : "Please enter the passcode.";
      input.select();
      input.focus();
    }
  };
  btn.addEventListener("click", tryUnlock);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") tryUnlock(); });
}

// ---------- Progress ----------
function getProgress() {
  try { return JSON.parse(lStore.get(STORAGE_KEY)) || {}; }
  catch { return {}; }
}
function setLessonComplete(id, complete) {
  const p = getProgress();
  if (complete) p[id] = { complete: true, at: new Date().toISOString() };
  else delete p[id];
  lStore.set(STORAGE_KEY, JSON.stringify(p));
  renderProgressStrip();
  renderLessonGrid();
}
function resetProgress() {
  if (!confirm("Reset all lesson progress? This cannot be undone.")) return;
  lStore.remove(STORAGE_KEY);
  renderProgressStrip();
  renderLessonGrid();
}

function renderProgressStrip() {
  const total = LESSONS.length;
  const done = LESSONS.filter(l => getProgress()[l.id]).length;
  const pct = Math.round((done / total) * 100);
  document.getElementById("stat-done").textContent = done;
  document.getElementById("stat-total").textContent = `of ${total} lessons completed`;
  document.getElementById("stat-pct").textContent = pct + "%";
  document.getElementById("progress-fill").style.width = pct + "%";
}

// ---------- Lesson grid ----------
function renderLessonGrid() {
  const grid = document.getElementById("lesson-grid");
  const progress = getProgress();
  grid.innerHTML = LESSONS.map(l => {
    const complete = !!progress[l.id];
    return `
      <article class="lesson-card ${complete ? "is-complete" : ""}" style="--accent:${l.color}" data-lesson="${l.id}">
        <span class="accent"></span>
        <div class="lc-top">
          <span class="num">LESSON ${l.number}</span>
          <span class="status-dot" aria-label="${complete ? "Completed" : "Not completed"}"></span>
        </div>
        <h3>${l.title}</h3>
        <div class="tagline">${l.tagline}</div>
        ${l.duration ? `<div class="meta">${l.duration}</div>` : ""}
        <p class="summary">${l.summary}</p>
        <div class="lc-footer">
          <span class="doc-count"><strong>${l.documents.length}</strong> document${l.documents.length !== 1 ? "s" : ""}</span>
          <span class="open-link">Open ›</span>
        </div>
      </article>
    `;
  }).join("");
  grid.querySelectorAll(".lesson-card").forEach(card => {
    card.addEventListener("click", () => openLesson(card.dataset.lesson));
  });
}

// ---------- Lesson detail ----------
const KIND_ICON = {
  workbook: "WB",
  transcript: "TX",
  declarations: "DC",
  worksheet: "WS",
  guide: "GD",
  journal: "JN",
  scripture: "SC"
};
function openLesson(id) {
  const l = LESSONS.find(x => x.id === id);
  if (!l) return;
  const complete = !!getProgress()[id];
  const docs = l.documents.map(d => {
    const ext = d.file.split(".").pop().toLowerCase();
    const isPdf = ext === "pdf";
    return `
      <a href="assets/pdfs/${d.file}" target="_blank" rel="noopener" class="doc-item ${d.featured ? "is-featured" : ""}">
        <span class="doc-icon" style="background:${l.color}">${KIND_ICON[d.kind] || "PDF"}</span>
        <div>
          <div class="doc-name">${d.label}</div>
          <div class="doc-kind">${d.kind} · ${ext.toUpperCase()}</div>
        </div>
        <span class="doc-action">Open ›</span>
        ${isPdf ? `<button class="doc-print" title="Print" onclick="event.preventDefault(); event.stopPropagation(); window.open('assets/pdfs/${d.file}','_blank').print();" aria-label="Print">⎙</button>` : `<span></span>`}
      </a>
    `;
  }).join("");
  const verses = (l.keyScriptures || []).map(s => `<span class="chip">${s}</span>`).join("");
  const overlay = document.getElementById("detail-overlay");
  overlay.innerHTML = `
    <div class="detail-card">
      <button class="close" aria-label="Close" onclick="closeLesson()">✕</button>
      <div class="detail-banner" style="background:${l.color}">
        <div class="num">LESSON ${l.number}</div>
        <h2>${l.title}</h2>
        <div class="tagline">${l.tagline}</div>
      </div>
      <div class="detail-body">
        <div class="detail-section">
          <h4>Overview</h4>
          <p>${l.summary}</p>
        </div>
        ${verses ? `
        <div class="detail-section">
          <h4>Key Scriptures (KJV)</h4>
          <div class="scripture-chips">${verses}</div>
        </div>` : ""}
        <div class="detail-section">
          <h4>Lesson Materials</h4>
          <div class="doc-list">${docs}</div>
        </div>
        <div class="complete-toggle">
          <input type="checkbox" id="complete-check" ${complete ? "checked" : ""}>
          <label for="complete-check">Mark Lesson ${l.number} as complete</label>
        </div>
      </div>
    </div>
  `;
  overlay.classList.add("is-open");
  document.body.style.overflow = "hidden";
  overlay.querySelector("#complete-check").addEventListener("change", (e) => {
    setLessonComplete(id, e.target.checked);
  });
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeLesson(); });
}
function closeLesson() {
  document.getElementById("detail-overlay").classList.remove("is-open");
  document.body.style.overflow = "";
}

// ---------- Sheets ----------
function renderSheets() {
  const grid = document.getElementById("sheets-grid");
  grid.innerHTML = FOUNDATIONAL_SHEETS.map(s => `
    <article class="sheet-card">
      <div class="icon">PS</div>
      <h4>${s.label}</h4>
      <p>${s.description}</p>
      <div class="sheet-actions">
        <a href="assets/pdfs/${s.file}" target="_blank" rel="noopener">View</a>
        <a class="primary" href="assets/pdfs/${s.file}" download>Download</a>
      </div>
    </article>
  `).join("");
}

// ---------- Scriptures ----------
function renderScriptures() {
  const wrap = document.getElementById("scripture-wrap");
  wrap.innerHTML = SCRIPTURE_LIBRARY.map(cat => `
    <div class="scripture-cat">
      <h3>${cat.category}</h3>
      <div class="verse-list">
        ${cat.verses.map(v => `
          <div class="verse">
            <div class="ref">${v.ref}</div>
            <div class="text">"${v.text}"</div>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("");
}

// ---------- Tabs ----------
function initTabs() {
  document.querySelectorAll(".tab").forEach(t => {
    t.addEventListener("click", () => {
      const target = t.dataset.target;
      document.querySelectorAll(".tab").forEach(x => x.classList.toggle("is-active", x === t));
      document.querySelectorAll(".section").forEach(s => s.classList.toggle("is-active", s.id === target));
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

// ---------- Boot ----------
document.addEventListener("DOMContentLoaded", () => {
  initGate();
  initTabs();
  renderProgressStrip();
  renderLessonGrid();
  renderSheets();
  renderScriptures();
  document.getElementById("reset-btn").addEventListener("click", resetProgress);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLesson(); });
});
