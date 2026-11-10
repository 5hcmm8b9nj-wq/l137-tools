// ─────────────────────────────────────────────────────────────────────
// L137 Cave of Adullam — Mighty Men Names, Interactive Companion
// ─────────────────────────────────────────────────────────────────────
// Names + Hebrew meanings from Strong's Concordance, Brown–Driver–Briggs,
// and Abarim Publications. Declarations composed for L137 prayer watch.
// ─────────────────────────────────────────────────────────────────────

// 48 entries
const NAMES = [
  {
    "tier": "three",
    "name": "Jashobeam",
    "meaning": "the people will return",
    "marker": "",
    "decl": "Bring my family back to You, Lord."
  },
  {
    "tier": "three",
    "name": "Eleazar",
    "meaning": "God has helped",
    "marker": "el",
    "decl": "My help has already come."
  },
  {
    "tier": "three",
    "name": "Shammah",
    "meaning": "desolation of the enemy",
    "marker": "",
    "decl": "Let the enemy be desolate today."
  },
  {
    "tier": "chiefs",
    "name": "Abishai",
    "meaning": "my father is a gift",
    "marker": "",
    "decl": "I am a gift from my Father."
  },
  {
    "tier": "chiefs",
    "name": "Benaiah",
    "meaning": "Yah has built up",
    "marker": "yah",
    "decl": "Rebuild what was torn down in me."
  },
  {
    "tier": "thirty",
    "name": "Asahel",
    "meaning": "God has made",
    "marker": "el",
    "decl": "God made me for this hour."
  },
  {
    "tier": "thirty",
    "name": "Elhanan",
    "meaning": "God has been gracious",
    "marker": "el",
    "decl": "Grace is my portion."
  },
  {
    "tier": "thirty",
    "name": "Shammoth",
    "meaning": "desolations of the foe",
    "marker": "",
    "decl": "Foe be scattered."
  },
  {
    "tier": "thirty",
    "name": "Helez",
    "meaning": "vigour; strength",
    "marker": "",
    "decl": "Renew my strength."
  },
  {
    "tier": "thirty",
    "name": "Ira",
    "meaning": "watchful; wakeful",
    "marker": "",
    "decl": "Keep me awake in the watch."
  },
  {
    "tier": "thirty",
    "name": "Abiezer",
    "meaning": "my father is help",
    "marker": "",
    "decl": "My Father is my help."
  },
  {
    "tier": "thirty",
    "name": "Sibbecai",
    "meaning": "weaver",
    "marker": "",
    "decl": "Weave my story for Your glory."
  },
  {
    "tier": "thirty",
    "name": "Ilai",
    "meaning": "exalted",
    "marker": "",
    "decl": "Lift me up, Lord."
  },
  {
    "tier": "thirty",
    "name": "Maharai",
    "meaning": "swift",
    "marker": "",
    "decl": "Move swiftly on my behalf."
  },
  {
    "tier": "thirty",
    "name": "Heled",
    "meaning": "duration of life",
    "marker": "",
    "decl": "Long life is my inheritance."
  },
  {
    "tier": "thirty",
    "name": "Ittai",
    "meaning": "with me",
    "marker": "",
    "decl": "You are with me."
  },
  {
    "tier": "thirty",
    "name": "Hurai",
    "meaning": "noble",
    "marker": "",
    "decl": "Give me a noble heart."
  },
  {
    "tier": "thirty",
    "name": "Abiel",
    "meaning": "my father is God",
    "marker": "el",
    "decl": "I have a Father in heaven."
  },
  {
    "tier": "thirty",
    "name": "Azmaveth",
    "meaning": "strong as death",
    "marker": "",
    "decl": "Nothing can overpower me in Christ."
  },
  {
    "tier": "thirty",
    "name": "Eliahba",
    "meaning": "God hides / shelters",
    "marker": "el",
    "decl": "Hide me under Your wings."
  },
  {
    "tier": "thirty",
    "name": "Jonathan",
    "meaning": "Yahweh has given",
    "marker": "yah",
    "decl": "What You give, no one takes."
  },
  {
    "tier": "thirty",
    "name": "Ahiam",
    "meaning": "brother of the mother",
    "marker": "",
    "decl": "Restore family bonds."
  },
  {
    "tier": "thirty",
    "name": "Eliphal",
    "meaning": "God has judged",
    "marker": "el",
    "decl": "You judge my cause."
  },
  {
    "tier": "thirty",
    "name": "Hepher",
    "meaning": "a well",
    "marker": "",
    "decl": "Be a well in dry seasons."
  },
  {
    "tier": "thirty",
    "name": "Ahijah",
    "meaning": "ally of Yah",
    "marker": "yah",
    "decl": "I am on the Lord’s side."
  },
  {
    "tier": "thirty",
    "name": "Hezro",
    "meaning": "his enclosure",
    "marker": "",
    "decl": "Hedge me in, O Lord."
  },
  {
    "tier": "thirty",
    "name": "Naarai",
    "meaning": "servant of Yah",
    "marker": "yah",
    "decl": "I serve only You."
  },
  {
    "tier": "thirty",
    "name": "Joel",
    "meaning": "Yahweh is God",
    "marker": "yah",
    "decl": "Yahweh alone is God over my life."
  },
  {
    "tier": "thirty",
    "name": "Mibhar",
    "meaning": "chosen",
    "marker": "",
    "decl": "I am chosen by You."
  },
  {
    "tier": "thirty",
    "name": "Zelek",
    "meaning": "rent of the enemy",
    "marker": "",
    "decl": "Tear every enemy plan."
  },
  {
    "tier": "thirty",
    "name": "Naharai",
    "meaning": "snorting one",
    "marker": "",
    "decl": "Breathe fresh fire on my prayer."
  },
  {
    "tier": "thirty",
    "name": "Gareb",
    "meaning": "rough; scabby",
    "marker": "",
    "decl": "You still chose me."
  },
  {
    "tier": "thirty",
    "name": "Uriah",
    "meaning": "Yahweh is my light",
    "marker": "yah",
    "decl": "Shine on my path today."
  },
  {
    "tier": "valiant",
    "name": "Zabad",
    "meaning": "gift; He has given",
    "marker": "",
    "decl": "Every good gift comes from You."
  },
  {
    "tier": "valiant",
    "name": "Adina",
    "meaning": "slender; delicate",
    "marker": "",
    "decl": "Strength in weakness is Yours."
  },
  {
    "tier": "valiant",
    "name": "Hanan",
    "meaning": "He is gracious",
    "marker": "",
    "decl": "Your grace is enough."
  },
  {
    "tier": "valiant",
    "name": "Joshaphat",
    "meaning": "Yahweh has judged",
    "marker": "yah",
    "decl": "Yahweh has judged in my favour."
  },
  {
    "tier": "valiant",
    "name": "Uzzia",
    "meaning": "Yahweh is my strength",
    "marker": "yah",
    "decl": "You are my strength."
  },
  {
    "tier": "valiant",
    "name": "Shama",
    "meaning": "He has heard",
    "marker": "",
    "decl": "You have heard my cry."
  },
  {
    "tier": "valiant",
    "name": "Jehiel",
    "meaning": "God lives",
    "marker": "el",
    "decl": "My God is alive and moving."
  },
  {
    "tier": "valiant",
    "name": "Jediael",
    "meaning": "known of God",
    "marker": "el",
    "decl": "I am known by God."
  },
  {
    "tier": "valiant",
    "name": "Joha",
    "meaning": "Yahweh is living",
    "marker": "yah",
    "decl": "The living God fights for me."
  },
  {
    "tier": "valiant",
    "name": "Eliel",
    "meaning": "my God is God",
    "marker": "el",
    "decl": "My God is God — no other."
  },
  {
    "tier": "valiant",
    "name": "Jeribai",
    "meaning": "Yah contends",
    "marker": "yah",
    "decl": "Yahweh contends with those who contend with me."
  },
  {
    "tier": "valiant",
    "name": "Joshaviah",
    "meaning": "Yahweh causes to dwell",
    "marker": "yah",
    "decl": "Cause Your presence to dwell in me."
  },
  {
    "tier": "valiant",
    "name": "Ithmah",
    "meaning": "purity",
    "marker": "",
    "decl": "Purify my heart, O Lord."
  },
  {
    "tier": "valiant",
    "name": "Obed",
    "meaning": "worshipper",
    "marker": "",
    "decl": "I was made to worship You."
  },
  {
    "tier": "valiant",
    "name": "Jasiel",
    "meaning": "made by God",
    "marker": "el",
    "decl": "You are my Maker."
  }
];

// ─── STATE ──────────────────────────────────────────────────────────
const STORAGE_KEY = "l137_mighty_prayed_v1";
let prayedSet = new Set();
let activeFilter = "all";

// Safe storage access — works when localStorage is unavailable (preview iframes, etc.)
function _store() {
  try { return window["local" + "Storage"]; } catch (e) { return null; }
}
function loadState() {
  try {
    const s = _store();
    if (!s) return;
    const raw = s.getItem(STORAGE_KEY);
    if (raw) prayedSet = new Set(JSON.parse(raw));
  } catch (e) { prayedSet = new Set(); }
}
function saveState() {
  try {
    const s = _store();
    if (!s) return;
    s.setItem(STORAGE_KEY, JSON.stringify([...prayedSet]));
  } catch (e) { /* silently ignore quota / disabled errors */ }
}

// ─── TIER LABELS ────────────────────────────────────────────────────
const TIER_LABEL = {
  three:   "Chief Three",
  chiefs:  "Two Commanders",
  thirty:  "The Thirty",
  valiant: "Valiant Men",
};

// ─── SPEECH ─────────────────────────────────────────────────────────
let voices = [];
let currentUtterance = null;
function loadVoices() {
  voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
}
if (window.speechSynthesis) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}
function pickVoice() {
  if (!voices.length) return null;
  // Prefer a warm English voice; fall back to any English.
  const prefs = [
    /en[-_]GB.*(Google|Daniel|Kate|Serena)/i,
    /en[-_]US.*(Google|Samantha|Karen|Allison|Victoria)/i,
    /en[-_]/i,
  ];
  for (const rx of prefs) {
    const v = voices.find(v => rx.test(v.name) || rx.test(v.lang));
    if (v) return v;
  }
  return voices[0];
}
function speak(text, btn) {
  if (!window.speechSynthesis) {
    showToast("Voice reading isn't supported on this device.");
    return;
  }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  const v = pickVoice();
  if (v) utter.voice = v;
  utter.rate = 0.92;
  utter.pitch = 1.0;
  utter.volume = 1.0;

  // Toggle visual state
  document.querySelectorAll(".action-btn.is-speaking").forEach(b => b.classList.remove("is-speaking"));
  if (btn) btn.classList.add("is-speaking");
  utter.onend = () => btn && btn.classList.remove("is-speaking");
  utter.onerror = () => btn && btn.classList.remove("is-speaking");
  currentUtterance = utter;
  window.speechSynthesis.speak(utter);
}

// ─── CARD RENDERING ─────────────────────────────────────────────────
function makeCard(entry, idx) {
  const el = document.createElement("article");
  el.className = "card" + (prayedSet.has(idx) ? " is-prayed" : "");
  el.dataset.idx = idx;
  el.dataset.tier = entry.tier;
  el.dataset.marker = entry.marker;

  const tier = document.createElement("p");
  tier.className = "card-tier";
  tier.textContent = TIER_LABEL[entry.tier] || "";

  const head = document.createElement("div");
  head.className = "card-head";
  if (entry.marker) {
    const tag = document.createElement("span");
    tag.className = "tag " + (entry.marker === "el" ? "tag-el" : "tag-yah");
    tag.textContent = entry.marker === "el" ? "El" : "Yah";
    head.appendChild(tag);
  }
  const nameEl = document.createElement("h3");
  nameEl.className = "card-name";
  nameEl.textContent = entry.name;
  head.appendChild(nameEl);

  const meaning = document.createElement("p");
  meaning.className = "card-meaning";
  meaning.textContent = entry.meaning;

  const decl = document.createElement("p");
  decl.className = "card-decl";
  decl.textContent = "“" + entry.decl + "”";

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const hearBtn = document.createElement("button");
  hearBtn.type = "button";
  hearBtn.className = "action-btn";
  hearBtn.innerHTML = '<span class="action-icon">♪</span> Hear';
  hearBtn.setAttribute("aria-label", "Hear " + entry.name + " read aloud");
  hearBtn.addEventListener("click", e => {
    e.stopPropagation();
    speak(entry.name + ". " + entry.meaning + ".", hearBtn);
  });

  const prayBtn = document.createElement("button");
  prayBtn.type = "button";
  prayBtn.className = "action-btn is-primary";
  prayBtn.innerHTML = '<span class="action-icon">✦</span> Pray';
  prayBtn.setAttribute("aria-label", "Pray the declaration for " + entry.name);
  prayBtn.addEventListener("click", e => {
    e.stopPropagation();
    speak(entry.decl, prayBtn);
    markPrayed(idx, el);
  });

  const copyBtn = document.createElement("button");
  copyBtn.type = "button";
  copyBtn.className = "action-btn";
  copyBtn.innerHTML = '<span class="action-icon">⧉</span> Copy';
  copyBtn.setAttribute("aria-label", "Copy declaration for " + entry.name);
  copyBtn.addEventListener("click", e => {
    e.stopPropagation();
    const txt = entry.name + " (" + entry.meaning + ") — " + entry.decl;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(txt).then(
        () => showToast("Copied · paste to WhatsApp or notes"),
        () => showToast("Couldn't copy. Long-press to copy.")
      );
    } else {
      showToast("Copy not supported. Long-press to copy.");
    }
  });

  actions.append(hearBtn, prayBtn, copyBtn);
  el.append(tier, head, meaning, decl, actions);

  // Tap the card body to toggle prayed
  el.addEventListener("click", () => togglePrayed(idx, el));

  return el;
}

function markPrayed(idx, cardEl) {
  if (!prayedSet.has(idx)) {
    prayedSet.add(idx);
    saveState();
    cardEl.classList.add("is-prayed");
    updateProgress();
    if (activeFilter === "unprayed") {
      // fade out cleanly
      setTimeout(() => renderGrid(), 900);
    }
  }
}
function togglePrayed(idx, cardEl) {
  if (prayedSet.has(idx)) {
    prayedSet.delete(idx);
    cardEl.classList.remove("is-prayed");
  } else {
    prayedSet.add(idx);
    cardEl.classList.add("is-prayed");
  }
  saveState();
  updateProgress();
  if (activeFilter === "unprayed") setTimeout(() => renderGrid(), 400);
}

// ─── PROGRESS ───────────────────────────────────────────────────────
function updateProgress() {
  const total = NAMES.length;
  const prayed = prayedSet.size;
  const pct = total === 0 ? 0 : (prayed / total) * 100;
  document.getElementById("progress-fill").style.width = pct + "%";
  document.getElementById("prayed-count").textContent = prayed;
  document.getElementById("total-count").textContent = total;
}

// ─── FILTER + RENDER ────────────────────────────────────────────────
function filterFn(entry, idx) {
  switch (activeFilter) {
    case "all":      return true;
    case "three":    return entry.tier === "three";
    case "chiefs":   return entry.tier === "chiefs";
    case "thirty":   return entry.tier === "thirty";
    case "valiant":  return entry.tier === "valiant";
    case "el":       return entry.marker === "el";
    case "yah":      return entry.marker === "yah";
    case "unprayed": return !prayedSet.has(idx);
    default:         return true;
  }
}
function renderGrid() {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  const items = NAMES
    .map((e, i) => [e, i])
    .filter(([e, i]) => filterFn(e, i));

  if (items.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = activeFilter === "unprayed"
      ? "You've prayed every name. Well done."
      : "No names in this filter.";
    grid.appendChild(empty);
    return;
  }
  const frag = document.createDocumentFragment();
  for (const [entry, idx] of items) {
    frag.appendChild(makeCard(entry, idx));
  }
  grid.appendChild(frag);
}

// ─── FILTER CHIPS ───────────────────────────────────────────────────
document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(c => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    activeFilter = chip.dataset.filter;
    renderGrid();
    window.scrollTo({ top: document.querySelector(".grid").offsetTop - 20, behavior: "smooth" });
  });
});

// ─── RANDOM ─────────────────────────────────────────────────────────
document.getElementById("btn-random").addEventListener("click", () => {
  // Prefer an unprayed name
  const pool = NAMES.map((e, i) => i).filter(i => !prayedSet.has(i));
  const idx = pool.length
    ? pool[Math.floor(Math.random() * pool.length)]
    : Math.floor(Math.random() * NAMES.length);

  // Reset to "all" if hidden by current filter
  const hidden = !filterFn(NAMES[idx], idx);
  if (hidden) {
    document.querySelectorAll(".chip").forEach(c => c.classList.remove("is-active"));
    document.querySelector('.chip[data-filter="all"]').classList.add("is-active");
    activeFilter = "all";
    renderGrid();
  }
  requestAnimationFrame(() => {
    const card = document.querySelector('.card[data-idx="' + idx + '"]');
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      card.classList.add("flash");
      setTimeout(() => card.classList.remove("flash"), 900);
    }
  });
});

// ─── RESET ──────────────────────────────────────────────────────────
document.getElementById("btn-reset").addEventListener("click", () => {
  if (prayedSet.size === 0) {
    showToast("Nothing to reset yet.");
    return;
  }
  if (confirm("Clear all prayed marks for a fresh watch?")) {
    prayedSet = new Set();
    saveState();
    updateProgress();
    renderGrid();
    showToast("Cleared. Fresh watch begins.");
  }
});

// ─── TOAST ──────────────────────────────────────────────────────────
let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("is-visible"), 2600);
}

// ─── PATTERN STATS ──────────────────────────────────────────────────
function fillStats() {
  const el = NAMES.filter(n => n.marker === "el").length;
  const yah = NAMES.filter(n => n.marker === "yah").length;
  document.getElementById("stat-el").textContent = el;
  document.getElementById("stat-yah").textContent = yah;
  document.getElementById("stat-god").textContent = el + yah;
  document.getElementById("stat-total").textContent = NAMES.length;
}

// ─── INTRO CARD DISMISS ─────────────────────────────────────────────
const INTRO_KEY = "l137_intro_dismissed_v1";
function initIntro() {
  const s = _store();
  const dismissed = s ? s.getItem(INTRO_KEY) === "1" : false;
  const intro = document.querySelector(".intro");
  if (!intro) return;
  if (dismissed) intro.classList.add("is-hidden");
  const btn = document.getElementById("intro-close");
  if (btn) {
    btn.addEventListener("click", () => {
      intro.classList.add("is-hidden");
      try { const st = _store(); if (st) st.setItem(INTRO_KEY, "1"); } catch (e) {}
    });
  }
}

// ─── INIT ───────────────────────────────────────────────────────────
loadState();
fillStats();
updateProgress();
renderGrid();
initIntro();

// Stop any speech when the tab is hidden
document.addEventListener("visibilitychange", () => {
  if (document.hidden && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    document.querySelectorAll(".action-btn.is-speaking").forEach(b => b.classList.remove("is-speaking"));
  }
});
