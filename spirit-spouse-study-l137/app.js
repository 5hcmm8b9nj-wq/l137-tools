/* Spirit Spouse Study — Interactive JS
 * All state kept in an in-memory object (see store below).
 */

/* In-memory state store. Works in sandboxed previews without any
 * browser storage APIs. Progress persists only for the current tab.
 */
const _mem = {};
const store = {
  get(key, fallback = null) { return (key in _mem) ? _mem[key] : fallback; },
  set(key, val) { _mem[key] = val; }
};

/* -------- Comparison rows -------- */
const COMPARE_ROWS = [
  { cat: "all", topic: "Biblical umbrella",
    kiky: "Eph. 6:12 — wrestle not against flesh and blood.",
    ext1: "Same umbrella; adds Mark 1:23–26 unclean spirit language.",
    ext2: "Full-KJV Eph. 6:12 + Lev. 19:31 + 1 Cor. 6:16 + Isa. 49:24–26 + Col. 2:14–15 + Luke 11:24–26 + Rev. 12:11." },

  { cat: "all", topic: "Blood-of-Jesus homework",
    kiky: "Rev. 12:11 with Heb. 9:12–14 — conscience-cleansing frame.",
    ext1: "Cited under aftercare — same anchors, same purpose.",
    ext2: "Rev. 12:11 quoted in full and used to seal Step 9." },

  { cat: "all", topic: "One-sign diagnosis?",
    kiky: "Never. Patterns matter, not a single dream or sensation.",
    ext1: "Explicit — signs must cluster consistently and resist prayer.",
    ext2: "Repeated caveat: discernment first, medical/pastoral care alongside." },

  { cat: "marine", topic: "Definition of marine spirits",
    kiky: "Queen of the Coast, Leviathan, and Lilith — same overlap referenced in the Brain.",
    ext1: "Names Olukoya (MFM), Okpara, and Kanaan Ministries as sources.",
    ext2: "Adds mermaid spirits and marine spouses; frames marriage-family-destiny attack." },

  { cat: "marine", topic: "Marine entry points",
    kiky: "Ancestral covenants, water dedications, generational iniquity.",
    ext1: "Riverine dedications, marine altars, occult jewelry, sacrifices.",
    ext2: "Ancestral idol worship, water rites, sexual immorality at shrines, objects as points of contact." },

  { cat: "marine", topic: "Marine deliverance style",
    kiky: "Same standard L137 flow with sealing by the blood.",
    ext1: "Adds Olukoya's 'speak to the waters, command them to receive the blood of Jesus.'",
    ext2: "Same flow; adds aggressive prayer language against thrones in the sea." },

  { cat: "incubus", topic: "Definition",
    kiky: "Spirit husband / spirit wife — sexual attachment in dreams.",
    ext1: "Incubus = with women; succubus = with men. Kanaan Ministries wording.",
    ext2: "Counterfeit covenants stealing intimacy; anchors Mark 1:23–27." },

  { cat: "incubus", topic: "Sleep paralysis with sexual pressure",
    kiky: "Named in her Clubhouse teaching as a common attack.",
    ext1: "Distinctive marker for incubus/succubus — not marine.",
    ext2: "Listed under incubus signs; 'demon Mare' framing from Kanaan Ministries." },

  { cat: "incubus", topic: "Sanctify the bed",
    kiky: "Included in her prayer sections.",
    ext1: "Explicit line: 'I declare my bed sanctified by the blood of Jesus.'",
    ext2: "Sealing prayer covers bed, sleep, and dreams." },

  { cat: "familiar", topic: "Biblical vs modern usage",
    kiky: "She teaches that 'familiar spirit' is biblical (Lev. 19:31), extended by deliverance ministry to bloodline spirits.",
    ext1: "Same distinction preserved.",
    ext2: "Deep-dive on generational iniquity, mediumship, and false prophecy." },

  { cat: "familiar", topic: "Signature dream",
    kiky: "Dead relatives 'giving guidance' — treated with suspicion.",
    ext1: "9 markers from See His Grace, plus generational cycle repetition.",
    ext2: "Monitoring spirits, being watched, blessings that vanish." },

  { cat: "familiar", topic: "R-R-R-C-R-R deliverance",
    kiky: "Aligned with her flow — Repent, Renounce, Command, Fill.",
    ext1: "Repent · Renounce · Remove · Command · Replace · Resist — six steps.",
    ext2: "Nine-step L137 flow with generational blood-of-Jesus prayer." },

  { cat: "masquerade", topic: "Masquerading spirits",
    kiky: "Handled inside her spirit-spouse and dream-interpretation teaching — 'test the dream.'",
    ext1: "Full Kevin Laewing framework — face, wardrobe, off-character behavior.",
    ext2: "Chosen Generation Ministry — masquerade fights at the doorway of breakthrough." },

  { cat: "masquerade", topic: "Rule for dreams accusing a real person",
    kiky: "Never confront on dream evidence — cover the relationship in prayer.",
    ext1: "Same rule — 'great friendships ended by dreams the dreamer thought were the Lord.'",
    ext2: "Test every dream by Scripture, prayer, and witnesses." },

  { cat: "all", topic: "Aftercare — 21-night window",
    kiky: "Signature Pastor Kiky format — anointing oil, communion, ring finger, invisible ring, 4 prayer sections.",
    ext1: "Compatible; recommends night-watch discipline and journaling.",
    ext2: "Daily / weekly / seasonal aftercare with 21-day renunciation window." },

  { cat: "all", topic: "New Age / cosmic-powers boundary",
    kiky: "Firm boundary — no energy language; demons cannot own a believer's anointing.",
    ext1: "Same — sources vetted, excludes Auntie Flow / astrology.",
    ext2: "Explicit note excluding New Age and astrological sources." },

  { cat: "all", topic: "Separated / legally married safety",
    kiky: "Renounce fear, control, coercion, bitterness — do not declare the marriage spiritually dissolved.",
    ext1: "Same guardrail.",
    ext2: "Christian counselling alongside prayer for abuse/trauma cases." },

  { cat: "all", topic: "Why deliverance fails",
    kiky: "Empty house, unrepented sin, unforgiveness, isolation.",
    ext1: "Same list expanded.",
    ext2: "10-point failure list including untreated trauma and returning to former patterns." }
];

/* -------- Flashcards -------- */
const FLASHCARDS = [
  { cat: "foundation", q: "Which KJV verse is the umbrella over all four spirit-spouse categories?", a: "Ephesians 6:12 — 'For we wrestle not against flesh and blood, but against principalities, against powers, against the rulers of the darkness of this world, against spiritual wickedness in high places.'" },
  { cat: "foundation", q: "Pastor Kiky's blood-of-Jesus homework anchors?", a: "Revelation 12:11 with Hebrews 9:12–14 — cleanses the conscience from dead works to serve the living God." },
  { cat: "foundation", q: "What does L137 stand for?", a: "Luke 1:37 — 'For with God nothing shall be impossible.'" },
  { cat: "foundation", q: "Why must the house be filled after deliverance?", a: "Luke 11:24–26 — an empty swept house invites seven worse spirits. Fill with the Holy Spirit, Word, worship, and community." },
  { cat: "marine", q: "Signature dream sign of a marine spirit?", a: "Water — swimming in seas or rivers, thrones set up in the sea, eating in the marine kingdom, or dream pregnancy with a 'satanic load.'" },
  { cat: "marine", q: "Who does MFM (Olukoya) name as the ruler of the marine kingdom?", a: "The Queen of the Coast, working with Leviathan and marine demons." },
  { cat: "marine", q: "MFM's distinctive prayer instruction over marine bondage?", a: "Speak to the waters and command them to receive the blood of Jesus. 'Ordinary prayers' are insufficient — bombardment is required." },
  { cat: "incubus", q: "Kanaan Ministries' definition of an incubus?", a: "'A spirit being that comes to have intimate relationships with women while they are asleep.' A succubus does the same to men." },
  { cat: "incubus", q: "Sanctifying the bed — the prayer phrase?", a: "'I declare my bed sanctified by the Blood of Jesus. No demon will touch me.'" },
  { cat: "incubus", q: "Why is abuse/rape as an entry point framed carefully?", a: "It is never the victim's fault. It may create spiritual vulnerability that needs healing — but it is not chosen sin." },
  { cat: "familiar", q: "Scriptural anchor for 'familiar spirits'?", a: "Leviticus 19:31 — 'Regard not them that have familiar spirits, neither seek after wizards, to be defiled by them: I am the LORD your God.'" },
  { cat: "familiar", q: "See His Grace's six-step familiar-spirit framework?", a: "Repent · Renounce · Remove · Command · Replace · Resist." },
  { cat: "familiar", q: "Signature dream sign of an ancestral / familiar spirit?", a: "Dead relatives 'offering guidance,' generational patterns repeating, being chased, or eating food in dreams." },
  { cat: "masquerade", q: "Scriptural anchor for masquerading spirits?", a: "2 Corinthians 11:13–15 — 'Satan himself is transformed into an angel of light.'" },
  { cat: "masquerade", q: "Kevin Laewing's discernment markers for masquerading spirits?", a: "Face barely shown; off-character behavior; distorted height/weight/wardrobe; dead relatives 'talking'; dreams accusing a real friend or spouse." },
  { cat: "masquerade", q: "Rule when a dream accuses a real person?", a: "Never confront on dream evidence. Cover the relationship in prayer. Test the dream by Scripture, prayer, and witnesses." }
];

/* -------- Quiz -------- */
const QUIZ = [
  {
    q: "Which category is signaled MOST DISTINCTIVELY by sleep paralysis with sexual pressure?",
    opts: ["Marine / water spirits", "Incubus / succubus", "Ancestral / familiar", "Masquerading spirits"],
    correct: 1,
    explain: "Sleep paralysis with sexual pressure is the classic incubus/succubus marker. Kanaan Ministries links it to the 'demon Mare' (the root of the word 'nightmare')."
  },
  {
    q: "A dream shows your late grandmother giving you spiritual instructions. Pastor Kiky's teaching says:",
    opts: ["Obey the guidance — it is a family blessing", "Journal it and act on it", "Treat it as a masquerading spirit by default (Ecclesiastes 9:5–6); do not agree, do not accept gifts", "Ignore all dreams"],
    correct: 2,
    explain: "The dead do not speak to the living. A departed relative 'talking' in a dream is a masquerading spirit — refuse fellowship, renounce anything received, and cancel the words."
  },
  {
    q: "What must never be skipped after commanding a spirit to leave?",
    opts: ["Salt baths", "Filling the house with the Holy Spirit (Luke 11:24–26)", "Public testimony", "Fasting for 21 days"],
    correct: 1,
    explain: "Luke 11:24–26 warns that an empty swept house invites seven worse spirits. Fill with the Holy Spirit, Word, worship, and community. Salt baths are not part of L137 teaching."
  },
  {
    q: "Which of these is the correct L137 standard flow?",
    opts: [
      "Command demons → praise → close",
      "Praise → Thanksgiving → Confession → Forgive → Invite Holy Spirit → Teaching → Deliverance → Seal with the blood",
      "Fast for 3 days → confront the spirit → prophecy",
      "Rebuke → repent → move on"
    ],
    correct: 1,
    explain: "L137's non-negotiable flow — praise and worship first establishes God's throne; sealing with the blood closes."
  },
  {
    q: "A dream reveals your spouse is having an affair. The correct response is:",
    opts: [
      "Confront them immediately",
      "Divorce",
      "Test the dream by Scripture, prayer, and witnesses; cover the marriage in prayer; do not confront on dream evidence alone",
      "Post about it"
    ],
    correct: 2,
    explain: "Kevin Laewing's warning: 'great friendships and relationships brought to an end simply because of a dream that the dreamer thought was the Lord revealing evil secrets.' Test every dream."
  },
  {
    q: "Which is INSIDE Pastor Kiky's boundary?",
    opts: [
      "Energy work and chakra alignment",
      "Repentance, renunciation of covenants, breaking soul ties, Christ's authority, Holy Spirit filling",
      "Consulting a medium to identify the spirit",
      "Ancestor veneration for protection"
    ],
    correct: 1,
    explain: "L137's Christian boundary — no New Age energy language, no divination, no ancestor veneration. Christ, blood, Word, Holy Spirit, holiness."
  }
];

/* -------- Category tabs -------- */
function initCategoryTabs() {
  const tabs = document.querySelectorAll(".cat-tab");
  const panels = document.querySelectorAll(".cat-panel");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => { t.classList.remove("is-active"); t.setAttribute("aria-selected", "false"); });
      panels.forEach(p => p.classList.remove("is-active"));
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
      const cat = tab.dataset.cat;
      document.querySelector(`.cat-panel[data-cat="${cat}"]`).classList.add("is-active");
    });
  });
}

/* -------- Comparison table -------- */
function renderCompareTable() {
  const tbody = document.getElementById("compare-tbody");
  const savedTags = store.get("compareTags", {});
  tbody.innerHTML = "";
  COMPARE_ROWS.forEach((row, i) => {
    const key = `row${i}`;
    const currentTag = savedTags[key] || "";
    const tr = document.createElement("tr");
    tr.className = `row-${row.cat}`;
    tr.dataset.cat = row.cat;
    tr.innerHTML = `
      <td class="topic">${row.topic}</td>
      <td>${row.kiky}</td>
      <td>${row.ext1}</td>
      <td>${row.ext2}</td>
      <td>
        <div class="tag-btns">
          <button class="tag-btn ${currentTag === 'same' ? 'is-active' : ''}" data-row="${key}" data-tag="same" title="Same as Pastor Kiky">✓ Same</button>
          <button class="tag-btn ${currentTag === 'add' ? 'is-active' : ''}" data-row="${key}" data-tag="add" title="New — extends her teaching">➕ New</button>
          <button class="tag-btn ${currentTag === 'check' ? 'is-active' : ''}" data-row="${key}" data-tag="check" title="Needs her review">⚠ Check</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
  tbody.addEventListener("click", (e) => {
    const btn = e.target.closest(".tag-btn");
    if (!btn) return;
    const row = btn.dataset.row;
    const tag = btn.dataset.tag;
    const saved = store.get("compareTags", {});
    saved[row] = saved[row] === tag ? "" : tag;
    store.set("compareTags", saved);
    // update buttons in this row
    btn.parentElement.querySelectorAll(".tag-btn").forEach(b => b.classList.remove("is-active"));
    if (saved[row]) btn.classList.add("is-active");
    updateProgress();
  });
}

function initCompareFilters() {
  const filters = document.querySelectorAll(".cat-filter");
  filters.forEach(f => f.addEventListener("change", applyFilters));
}
function applyFilters() {
  const active = new Set();
  document.querySelectorAll(".cat-filter").forEach(f => { if (f.checked) active.add(f.value); });
  document.querySelectorAll("#compare-tbody tr").forEach(tr => {
    tr.style.display = active.has(tr.dataset.cat) ? "" : "none";
  });
}

/* -------- Flashcards -------- */
let fcIndex = 0;
let fcDeck = [...FLASHCARDS];
function initFlashcards() {
  const flip = () => document.getElementById("flashcard").classList.toggle("is-flipped");
  document.getElementById("flashcard").addEventListener("click", flip);
  document.getElementById("fc-flip").addEventListener("click", (e) => { e.stopPropagation(); flip(); });
  document.getElementById("fc-prev").addEventListener("click", () => nudge(-1));
  document.getElementById("fc-next").addEventListener("click", () => nudge(1));
  document.querySelectorAll(".fc-filter").forEach(f => f.addEventListener("change", refilterDeck));
  refilterDeck();
}
function refilterDeck() {
  const active = new Set();
  document.querySelectorAll(".fc-filter").forEach(f => { if (f.checked) active.add(f.value); });
  fcDeck = FLASHCARDS.filter(c => active.has(c.cat));
  if (fcDeck.length === 0) fcDeck = [{cat: "foundation", q: "No categories selected.", a: "Select a category to see cards."}];
  fcIndex = 0;
  renderFlashcard();
}
function nudge(dir) {
  fcIndex = (fcIndex + dir + fcDeck.length) % fcDeck.length;
  renderFlashcard();
}
function renderFlashcard() {
  const card = fcDeck[fcIndex];
  document.getElementById("fc-q").textContent = card.q;
  document.getElementById("fc-a").textContent = card.a;
  document.getElementById("fc-index").textContent = fcIndex + 1;
  document.getElementById("fc-total").textContent = fcDeck.length;
  document.getElementById("flashcard").classList.remove("is-flipped");
}

/* -------- Quiz -------- */
function initQuiz() {
  const container = document.getElementById("quiz-container");
  QUIZ.forEach((item, qi) => {
    const div = document.createElement("div");
    div.className = "quiz-q";
    div.dataset.qi = qi;
    div.innerHTML = `
      <h5>${qi + 1}. ${item.q}</h5>
      <div class="quiz-opts">
        ${item.opts.map((opt, oi) => `
          <label data-oi="${oi}">
            <input type="radio" name="q${qi}" value="${oi}" />
            <span>${opt}</span>
          </label>`).join("")}
      </div>
      <p class="quiz-explain">${item.explain}</p>
    `;
    container.appendChild(div);
  });

  document.getElementById("quiz-check").addEventListener("click", () => {
    let score = 0;
    QUIZ.forEach((item, qi) => {
      const qdiv = container.querySelector(`.quiz-q[data-qi="${qi}"]`);
      const selected = qdiv.querySelector(`input[name="q${qi}"]:checked`);
      qdiv.classList.add("revealed");
      qdiv.querySelectorAll("label").forEach(l => { l.classList.remove("correct","wrong"); });
      if (selected) {
        const oi = Number(selected.value);
        const correctLabel = qdiv.querySelector(`label[data-oi="${item.correct}"]`);
        correctLabel.classList.add("correct");
        if (oi === item.correct) score++;
        else qdiv.querySelector(`label[data-oi="${oi}"]`).classList.add("wrong");
      } else {
        qdiv.querySelector(`label[data-oi="${item.correct}"]`).classList.add("correct");
      }
    });
    document.getElementById("quiz-score").textContent = `Score: ${score} / ${QUIZ.length}`;
    store.set("quizScore", score);
    updateProgress();
  });

  document.getElementById("quiz-reset").addEventListener("click", () => {
    container.querySelectorAll(".quiz-q").forEach(q => q.classList.remove("revealed"));
    container.querySelectorAll("label").forEach(l => l.classList.remove("correct","wrong"));
    container.querySelectorAll("input[type=radio]").forEach(r => r.checked = false);
    document.getElementById("quiz-score").textContent = "Score: 0";
    store.set("quizScore", 0);
    updateProgress();
  });
}

/* -------- Steps -------- */
function initSteps() {
  const checks = document.querySelectorAll(".step-check");
  const saved = store.get("stepsDone", {});
  checks.forEach(c => {
    if (saved[c.dataset.step]) {
      c.checked = true;
      c.closest("li").classList.add("done");
    }
    c.addEventListener("change", () => {
      const state = store.get("stepsDone", {});
      state[c.dataset.step] = c.checked;
      store.set("stepsDone", state);
      c.closest("li").classList.toggle("done", c.checked);
      updateProgress();
    });
  });
}

/* -------- Log -------- */
function initLog() {
  document.querySelectorAll("[data-key]").forEach(ta => {
    ta.value = store.get(ta.dataset.key, "") || "";
    ta.addEventListener("input", () => store.set(ta.dataset.key, ta.value));
  });
  document.getElementById("log-export").addEventListener("click", async () => {
    const parts = [];
    document.querySelectorAll("[data-key]").forEach(ta => {
      const label = ta.previousSibling?.textContent?.trim() || ta.dataset.key;
      parts.push(`${label}\n${ta.value || "(empty)"}\n`);
    });
    const text = `Spirit Spouse Study — Prayer Log\n${new Date().toLocaleString()}\n\n${parts.join("\n")}`;
    try {
      await navigator.clipboard.writeText(text);
      alert("Log copied to clipboard. Paste into WhatsApp, Notes, or Dropbox.");
    } catch {
      alert("Could not copy automatically. Long-press to copy manually.");
    }
  });
  document.getElementById("log-clear").addEventListener("click", () => {
    if (!confirm("Clear all log entries on this device?")) return;
    document.querySelectorAll("[data-key]").forEach(ta => { ta.value = ""; store.set(ta.dataset.key, ""); });
  });
}

/* -------- Night watch -------- */
function initNightwatch() {
  const grid = document.getElementById("nightwatch-grid");
  const state = store.get("nightwatch", {});
  for (let n = 1; n <= 21; n++) {
    const cell = document.createElement("button");
    cell.className = "night-cell" + (state[`n${n}`] ? " done" : "");
    cell.textContent = n;
    cell.dataset.n = n;
    cell.title = `Night ${n} — tap to mark complete`;
    cell.addEventListener("click", () => {
      const s = store.get("nightwatch", {});
      s[`n${n}`] = !s[`n${n}`];
      store.set("nightwatch", s);
      cell.classList.toggle("done", s[`n${n}`]);
      updateNightCount();
      updateProgress();
    });
    grid.appendChild(cell);
  }
  updateNightCount();
}
function updateNightCount() {
  const s = store.get("nightwatch", {});
  const c = Object.values(s).filter(Boolean).length;
  document.getElementById("nightwatch-count").textContent = c;
}

/* -------- Overall progress -------- */
function updateProgress() {
  const steps = Object.values(store.get("stepsDone", {})).filter(Boolean).length; // /9
  const tags = Object.values(store.get("compareTags", {})).filter(v => v).length; // /18
  const nights = Object.values(store.get("nightwatch", {})).filter(Boolean).length; // /21
  const quiz = store.get("quizScore", 0); // /6

  const total = 9 + COMPARE_ROWS.length + 21 + QUIZ.length;
  const done = steps + tags + nights + quiz;
  const pct = Math.round((done / total) * 100);
  document.getElementById("progress-pct").textContent = pct + "%";
  document.getElementById("progress-fill").style.width = pct + "%";
}

/* -------- Init -------- */
document.addEventListener("DOMContentLoaded", () => {
  initCategoryTabs();
  renderCompareTable();
  initCompareFilters();
  initFlashcards();
  initQuiz();
  initSteps();
  initLog();
  initNightwatch();
  updateProgress();
});
