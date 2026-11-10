/* Deliverance From The Strongman — interactive workbook
   L137 Deliverance Ministry International · Pastor Kiky Ocansey
   Vanilla JS. All state persists on the device under keys prefixed l137_strongman_
   (device storage is used when the browser allows it; otherwise an in-memory
   fallback keeps every feature working for the session).  */
(function () {
  "use strict";
  var D = window.L137, T = D.teaching, S = D.scriptures, DEC = D.declarations, ST = D.study;
  var MOD = T.modules, META = T.meta;

  /* ---------------- storage ---------------- */
  var NS = "l137_strongman_";
  var MEM = {};
  function store() {
    try {
      var s = window["local" + "Storage"];
      var probe = NS + "__probe";
      s.setItem(probe, "1"); s.removeItem(probe);
      return s;
    } catch (e) { return null; }
  }
  var DB = store();
  function save(k, v) {
    var s = JSON.stringify(v);
    MEM[NS + k] = s;
    if (DB) { try { DB.setItem(NS + k, s); } catch (e) {} }
  }
  function load(k, d) {
    var raw = null;
    if (DB) { try { raw = DB.getItem(NS + k); } catch (e) { raw = null; } }
    if (raw === null || raw === undefined) raw = MEM[NS + k];
    if (raw === null || raw === undefined) return d;
    try { return JSON.parse(raw); } catch (e) { return d; }
  }
  function keysOf() {
    var out = {};
    Object.keys(MEM).forEach(function (k) { out[k] = 1; });
    if (DB) { try { for (var i = 0; i < DB.length; i++) out[DB.key(i)] = 1; } catch (e) {} }
    return Object.keys(out);
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function el(id) { return document.getElementById(id); }
  function toast(msg) {
    var t = document.createElement("div");
    t.className = "toast"; t.textContent = msg; document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2200);
  }
  function head(eyebrow, title, lede) {
    return '<p class="eyebrow">' + esc(eyebrow) + "</p><h2 class=\"sec-h\">" + esc(title) +
      '</h2><div class="rule"></div>' + (lede ? '<p class="lede">' + esc(lede) + "</p>" : "");
  }
  function scrOf(ref) {
    for (var i = 0; i < S.scriptures.length; i++) if (S.scriptures[i].ref === ref) return S.scriptures[i];
    return null;
  }
  function scrPanel(ref) {
    var s = scrOf(ref);
    return '<div class="panel p-teal"><p class="scripture"><span class="ref">' + esc(ref) + "</span>" +
      esc(s ? s.text : "") + "</p></div>";
  }

  /* ---------------- tabs / routing ---------------- */
  var TABS = [
    ["home", "Home"], ["panels", "Panel Reader"], ["modules", "9 Modules"], ["faces", "14 Faces"],
    ["vault", "Scripture Vault"], ["cloze", "Cloze Drill"], ["cards", "Flashcards"], ["match", "Match Game"],
    ["order", "Battle Order"], ["exam", "Self-Exam"], ["declare", "Declarations"], ["prayers", "Prayer Library"],
    ["bombard", "7-Day Bombardment"], ["dreams", "Dream Watch"], ["quiz", "Quiz"], ["memory", "Memory Verses"],
    ["search", "Search"], ["notes", "My Notes"], ["progress", "Progress"], ["care", "Prepare & Aftercare"],
    ["pack", "Download Pack"]
  ];
  function buildTabs() {
    el("tabs").innerHTML = TABS.map(function (t) {
      return '<button class="tab" role="tab" data-view="' + t[0] + '" aria-selected="false">' + esc(t[1]) + "</button>";
    }).join("");
    el("tabs").addEventListener("click", function (e) {
      var b = e.target.closest(".tab"); if (b) go(b.dataset.view);
    });
  }
  function go(name, skipHash) {
    if (!document.getElementById("v-" + name)) name = "home";
    Array.prototype.forEach.call(document.querySelectorAll(".view"), function (v) {
      v.classList.toggle("active", v.id === "v-" + name);
    });
    Array.prototype.forEach.call(document.querySelectorAll(".tab"), function (t) {
      var on = t.dataset.view === name;
      t.setAttribute("aria-selected", on ? "true" : "false");
      if (on) t.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    });
    if (!skipHash) location.hash = name;
    window.scrollTo({ top: 0, behavior: "auto" });
    current = name;
  }
  var current = "home";

  /* ================= HOME ================= */
  function renderHome() {
    el("heroDate").textContent = "May 3, 2025";
    el("heroScr").textContent = META.main_scripture;
    el("heroTitle").textContent = META.title;
    el("heroDesc").textContent = META.description;
    el("heroAttrib").textContent = META.pastor + " · " + META.ministry;
    el("heroTag").textContent = META.tagline;
    el("footAttrib").textContent = META.title + " · " + META.pastor + " · " + META.service_date;
    el("footTag").textContent = META.tagline;
    el("heroStats").innerHTML = [
      [MOD.length, "Teaching modules"], [MOD[2].faces.length, "Faces of the strongman"],
      [MOD[5].steps.length, "Ways to fight"], [S.scriptures.length, "KJV scriptures"]
    ].map(function (s) { return '<div class="stat"><b class="tnum">' + s[0] + "</b><span>" + s[1] + "</span></div>"; }).join("");

    var h = "";
    h += head("How to use this workbook", "Twenty ways to read, pray and remember",
      "Every section works offline on your phone and remembers what you have done. Tap a tab above at any time.");
    h += '<div class="grid g3">' + TABS.slice(1).map(function (t) {
      return '<button class="card" style="text-align:left;cursor:pointer" data-go="' + t[0] + '">' +
        '<p class="eyebrow" style="margin-bottom:4px">Open</p><h3 style="font-size:19px;margin:0">' + esc(t[1]) + "</h3></button>";
    }).join("") + "</div>";

    h += '<div style="height:34px"></div>' + head("Order of service", "The standard deliverance flow",
      "Never skipped, never reordered.");
    h += T.service_flow.map(function (f) {
      return '<div class="panel p-cream"><p class="kick" style="color:var(--teal)">Stage ' + f.n + '</p><h3>' +
        esc(f.stage) + "</h3><p style=\"margin:0\">" + esc(f.note) + "</p></div>";
    }).join("");

    h += '<div style="height:34px"></div>' + head("Teaching flow chart", "Problem to maintenance", null);
    h += T.flow_chart.map(function (f, i) {
      return '<div class="panel p-teal"><p class="kick">Step ' + (i + 1) + '</p><h3>' + esc(f.stage) +
        "</h3><p style=\"margin:0\">" + esc(f.text) + "</p></div>";
    }).join("");

    h += '<div style="height:34px"></div>' + head("Audio companion", "Listen &amp; pray aloud", null);
    h += '<div class="panel p-ember"><p class="kick">LISTEN &amp; PRAY ALOUD</p>' +
      '<h3>Scan the QR code to begin</h3>' +
      '<p class="muted small" style="margin:0">Audio for this service will be linked here. When the recording is added, ' +
      'this card becomes the player — pray every declaration out loud as you listen.</p>' +
      '<p class="small" style="margin-top:10px"><a href="assets/downloads/audio-placeholder.txt" id="audioLink">Audio link — coming soon</a></p></div>';

    h += '<div style="height:34px"></div>' + head("Bible characters", "Nine strongman studies", null);
    h += T.characters.map(function (c) {
      return "<details><summary>" + esc(c.name) + ' <span class="pill">' + esc(c.ref) + "</span></summary>" +
        '<div class="details-body"><p>' + esc(c.story) + "</p>" +
        '<div class="panel p-gold" style="margin:0"><p class="kick">Deliverance principle</p><p style="margin:0">' +
        esc(c.principle) + "</p></div></div></details>";
    }).join("");
    el("homeBody").innerHTML = h;
  }

  /* ================= 1. PANEL READER ================= */
  var PANELS = [];
  (function buildPanels() {
    MOD.forEach(function (m) {
      if (m.panels) {
        m.panels.forEach(function (p) { PANELS.push({ mod: m, q: p.q, text: p.text }); });
      } else if (m.teaching_points) {
        m.teaching_points.forEach(function (tp) { PANELS.push({ mod: m, q: null, text: tp }); });
      }
      if (m.definitions) m.definitions.forEach(function (d) { PANELS.push({ mod: m, q: "Who is he?", text: d }); });
      if (m.faces) m.faces.forEach(function (f) { PANELS.push({ mod: m, q: f.face, text: f.detail + (f.bible !== "—" ? "  (" + f.bible + ")" : "") }); });
      if (m.agenda) m.agenda.forEach(function (a) {
        a.items.forEach(function (it) { PANELS.push({ mod: m, q: a.arm, text: it }); });
      });
      if (m.signs) m.signs.forEach(function (s) { PANELS.push({ mod: m, q: "Sign: " + s.sign, text: s.detail }); });
      if (m.steps) m.steps.forEach(function (s) { PANELS.push({ mod: m, q: "Step " + s.n + " — " + s.step, text: s.detail }); });
    });
  })();
  var pIdx = 0;
  function renderPanelReader() {
    pIdx = Math.min(load("panel_index", 0) || 0, PANELS.length - 1);
    el("panelsBody").innerHTML = head("Panel reader", "One idea at a time",
      "Built for anyone who struggles with long reading. Tap the arrows, swipe, or use your keyboard arrow keys.") +
      '<div class="reader" id="reader"><p class="rmod" id="rMod"></p><p class="rq" id="rQ"></p>' +
      '<p class="rtext" id="rText"></p>' +
      '<div class="reader-bar"><button class="iconbtn" id="rPrev" aria-label="Previous panel">‹</button>' +
      '<div style="flex:1"><div class="progressbar"><i id="rBar"></i></div></div>' +
      '<span class="count tnum" id="rCount"></span>' +
      '<button class="iconbtn" id="rNext" aria-label="Next panel">›</button></div></div>' +
      '<div class="btn-row"><button class="btn btn-ghost btn-sm" id="rRestart">Start again</button>' +
      '<button class="btn btn-soft btn-sm" data-go="modules">Read the full module text</button></div>';
    el("rPrev").onclick = function () { setPanel(pIdx - 1); };
    el("rNext").onclick = function () { setPanel(pIdx + 1); };
    el("rRestart").onclick = function () { setPanel(0); };
    var r = el("reader"), x0 = null;
    r.addEventListener("touchstart", function (e) { x0 = e.changedTouches[0].clientX; }, { passive: true });
    r.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 48) setPanel(pIdx + (dx < 0 ? 1 : -1));
    }, { passive: true });
    setPanel(pIdx);
  }
  function setPanel(i) {
    pIdx = Math.max(0, Math.min(PANELS.length - 1, i));
    var p = PANELS[pIdx];
    el("rMod").textContent = "Module " + p.mod.n + " · " + p.mod.title;
    el("rQ").textContent = p.q || "Teaching point";
    el("rText").textContent = p.text;
    el("rCount").textContent = (pIdx + 1) + " / " + PANELS.length;
    el("rBar").style.width = ((pIdx + 1) / PANELS.length * 100) + "%";
    el("rPrev").disabled = pIdx === 0;
    el("rNext").disabled = pIdx === PANELS.length - 1;
    save("panel_index", pIdx);
    if (pIdx === PANELS.length - 1) {
      var a = load("activities", {});
      if (!a.panels) { a.panels = true; save("activities", a); refreshProgress(); }
    }
  }
  document.addEventListener("keydown", function (e) {
    if (current !== "panels") return;
    if (e.key === "ArrowRight") setPanel(pIdx + 1);
    if (e.key === "ArrowLeft") setPanel(pIdx - 1);
  });

  /* ================= 2. MODULES ================= */
  function renderModules() {
    var h = head("The teaching", "The nine modules",
      "The full teaching as delivered on May 3, 2025, with every scripture written out in full KJV.");
    MOD.forEach(function (m) {
      h += '<div class="card" style="margin-bottom:18px" id="mod-' + m.id + '">';
      h += '<p class="eyebrow">Module ' + m.n + " · " + esc(m.kicker) + "</p>";
      h += "<h3 style=\"font-size:24px\">" + esc(m.title) + "</h3>";
      h += "<p>" + esc(m.summary) + "</p>";
      if (m.definitions) h += m.definitions.map(function (d) {
        return '<div class="panel p-gold"><p class="kick">Definition</p><p style="margin:0">' + esc(d) + "</p></div>";
      }).join("");
      if (m.teaching_points) h += "<ul>" + m.teaching_points.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>";
      if (m.faces) h += '<div class="grid g2">' + m.faces.map(function (f) {
        return '<div class="face-card"><h3>' + esc(f.face) + '</h3><p class="anchor">' + esc(f.bible) +
          '</p><p style="margin:0" class="small">' + esc(f.detail) + "</p></div>";
      }).join("") + "</div>";
      if (m.agenda) h += m.agenda.map(function (a) {
        return '<div class="panel p-ember"><p class="kick">' + esc(a.arm) + "</p><ul style=\"margin:0 0 0 -8px\">" +
          a.items.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul></div>";
      }).join("");
      if (m.signs) h += '<div class="panel p-cream"><p class="kick" style="color:var(--ember-deep)">Ten signs</p><ol style="margin:0 0 0 -8px">' +
        m.signs.map(function (s) { return "<li><b>" + esc(s.sign) + "</b> — " + esc(s.detail) + "</li>"; }).join("") + "</ol></div>";
      if (m.steps) h += '<div class="panel p-green"><p class="kick">Twelve ways to fight</p><ol style="margin:0 0 0 -8px">' +
        m.steps.map(function (s) { return "<li><b>" + esc(s.step) + "</b> — " + esc(s.detail) + "</li>"; }).join("") + "</ol></div>";
      if (m.scriptures) h += m.scriptures.map(scrPanel).join("");
      h += '<label class="check" style="margin-top:12px"><input type="checkbox" data-mod="' + m.id + '"><span>I have studied module ' + m.n + "</span></label>";
      h += "</div>";
    });
    el("modulesBody").innerHTML = h;
    var done = load("modules_done", {});
    Array.prototype.forEach.call(el("modulesBody").querySelectorAll("[data-mod]"), function (cb) {
      cb.checked = !!done[cb.dataset.mod];
      cb.parentNode.classList.toggle("on", cb.checked);
      cb.onchange = function () {
        var d = load("modules_done", {}); d[cb.dataset.mod] = cb.checked; save("modules_done", d);
        cb.parentNode.classList.toggle("on", cb.checked); refreshProgress();
      };
    });
  }

  /* ================= 3. SCRIPTURE VAULT ================= */
  var vaultHidden = true;
  function renderVault() {
    var topics = {};
    S.scriptures.forEach(function (s) { (topics[s.topic] = topics[s.topic] || []).push(s); });
    var h = head("Scripture vault", "Every scripture, full KJV",
      "Grouped by topic. Turn on recall mode and the verse stays hidden until you tap it — say it from memory first.");
    h += '<div class="btn-row"><button class="btn btn-sm" id="vToggle"></button>' +
      '<button class="btn btn-ghost btn-sm" id="vCopyAll">Copy all scriptures</button></div>';
    Object.keys(topics).forEach(function (t) {
      h += '<p class="eyebrow" style="margin-top:22px">' + esc(t) + "</p>";
      h += topics[t].map(function (s) {
        return '<div class="vault-item" data-ref="' + esc(s.ref) + '"><div class="vref"><b>' + esc(s.ref) + "</b>" +
          '<button class="btn btn-ghost btn-sm" data-copy="' + esc(s.ref) + '">Copy</button></div>' +
          '<div class="vault-body"><p class="scripture" style="margin:0">' + esc(s.text) + "</p></div>" +
          '<p class="reveal-hint hidden">Tap to reveal the verse</p></div>';
      }).join("");
    });
    el("vaultBody").innerHTML = h;
    el("vToggle").onclick = function () { vaultHidden = !vaultHidden; applyVault(); };
    el("vCopyAll").onclick = function () {
      copy(S.scriptures.map(function (s) { return s.ref + "\n" + s.text; }).join("\n\n"));
    };
    el("vaultBody").addEventListener("click", function (e) {
      var c = e.target.closest("[data-copy]");
      if (c) { var s = scrOf(c.dataset.copy); copy(s.ref + "\n" + s.text); return; }
      var item = e.target.closest(".vault-item");
      if (item && vaultHidden) {
        item.querySelector(".vault-body").classList.toggle("hidden");
        item.querySelector(".reveal-hint").classList.toggle("hidden");
      }
    });
    vaultHidden = true; applyVault();
  }
  function applyVault() {
    el("vToggle").textContent = vaultHidden ? "Recall mode: ON — verses hidden" : "Recall mode: OFF — verses shown";
    Array.prototype.forEach.call(el("vaultBody").querySelectorAll(".vault-item"), function (i) {
      i.querySelector(".vault-body").classList.toggle("hidden", vaultHidden);
      i.querySelector(".reveal-hint").classList.toggle("hidden", !vaultHidden);
    });
  }
  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast("Copied"); }, fallback);
    } else fallback();
    function fallback() {
      var ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta);
      ta.select(); try { document.execCommand("copy"); toast("Copied"); } catch (e) { toast("Copy not supported"); }
      ta.remove();
    }
  }

  /* ================= 4. CLOZE ================= */
  function renderCloze() {
    var h = head("Cloze memory drill", "Fill in the missing words",
      "Type the missing word into each gap and check it. Capitals do not matter.");
    h += '<div class="panel p-gold"><p class="kick">Score</p><p style="margin:0" class="tnum" id="clozeScore"></p></div>';
    ST.cloze.forEach(function (c, i) {
      var parts = c.text.split("____");
      var body = "";
      parts.forEach(function (p, j) {
        body += esc(p);
        if (j < parts.length - 1) body += '<input class="cloze-in" data-c="' + i + '" data-a="' + j + '" aria-label="missing word ' + (j + 1) + '">';
      });
      h += '<div class="card" style="margin-bottom:12px" data-cloze="' + i + '">' +
        '<p class="eyebrow">' + esc(c.ref) + "</p>" +
        '<p class="scripture" style="font-style:normal">' + body + "</p>" +
        '<div class="btn-row" style="margin-bottom:0"><button class="btn btn-sm" data-check="' + i + '">Check answer</button>' +
        '<button class="btn btn-ghost btn-sm" data-show="' + i + '">Show verse</button></div>' +
        '<div class="panel p-teal hidden" data-full="' + i + '" style="margin-top:12px"><p class="scripture" style="margin:0">' +
        '<span class="ref">' + esc(c.ref) + "</span>" + esc(fullVerse(c)) + "</p></div></div>";
    });
    el("clozeBody").innerHTML = h;
    updateClozeScore();
    el("clozeBody").addEventListener("click", function (e) {
      var ck = e.target.closest("[data-check]"), sh = e.target.closest("[data-show]");
      if (ck) checkCloze(+ck.dataset.check);
      if (sh) el("clozeBody").querySelector('[data-full="' + sh.dataset.show + '"]').classList.remove("hidden");
    });
  }
  function fullVerse(c) {
    var s = scrOf(c.ref);
    if (s) return s.text;
    var out = c.text, k = 0;
    return out.replace(/____/g, function () { return c.answers[k++]; });
  }
  function checkCloze(i) {
    var c = ST.cloze[i], ok = true;
    Array.prototype.forEach.call(el("clozeBody").querySelectorAll('[data-c="' + i + '"]'), function (inp) {
      var want = String(c.answers[+inp.dataset.a] || "").trim().toLowerCase().replace(/[.,;:]$/, "");
      var got = inp.value.trim().toLowerCase().replace(/[.,;:]$/, "");
      var good = got !== "" && got === want;
      inp.classList.toggle("ok", good); inp.classList.toggle("bad", !good);
      if (!good) ok = false;
    });
    var done = load("cloze_done", {});
    if (ok) {
      done[i] = true; save("cloze_done", done);
      el("clozeBody").querySelector('[data-full="' + i + '"]').classList.remove("hidden");
      toast("Correct — well done");
    } else toast("Not yet — try again");
    updateClozeScore(); refreshProgress();
  }
  function updateClozeScore() {
    var done = load("cloze_done", {}), n = Object.keys(done).filter(function (k) { return done[k]; }).length;
    if (el("clozeScore")) el("clozeScore").textContent = n + " of " + ST.cloze.length + " verses completed";
  }

  /* ================= 5. FLASHCARDS (spaced repetition) ================= */
  var fOrder = [], fPos = 0, fFlipped = false;
  var INTERVALS = { again: 0, good: 1, easy: 3 }; // days added at bucket level
  function today() { var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function dayNum(str) { return Math.floor(new Date(str + "T00:00:00").getTime() / 86400000); }
  function cardState() { return load("cards", {}); }
  function dueCards() {
    var st = cardState(), t = dayNum(today()), out = [];
    ST.flashcards.forEach(function (c, i) {
      var s = st[i];
      if (!s || dayNum(s.due) <= t) out.push(i);
    });
    return out;
  }
  function renderCards() {
    fOrder = dueCards(); if (!fOrder.length) fOrder = ST.flashcards.map(function (_, i) { return i; });
    fPos = 0; fFlipped = false;
    el("cardsBody").innerHTML = head("Flashcards", "Twenty-four cards, spaced repetition",
      "Tap the card to flip it. Then say how it went — the card is rescheduled for you and saved on this device.") +
      '<div class="btn-row"><span class="pill" id="dueCount"></span>' +
      '<button class="btn btn-ghost btn-sm" id="fShuffle">Shuffle</button>' +
      '<button class="btn btn-ghost btn-sm" id="fAll">Study all 24</button>' +
      '<button class="btn btn-soft btn-sm" id="fReset">Reset schedule</button></div>' +
      '<div class="flip" id="flip"><div class="flip-in" id="flipIn">' +
      '<div class="face face-f" id="fFront"></div><div class="face face-b" id="fBack"></div></div></div>' +
      '<div class="reader-bar"><span class="count tnum" id="fCount"></span>' +
      '<div style="flex:1"><div class="progressbar"><i id="fBar"></i></div></div></div>' +
      '<div class="btn-row"><button class="btn btn-ghost" data-grade="again" style="flex:1">Again</button>' +
      '<button class="btn btn-soft" data-grade="good" style="flex:1">Good</button>' +
      '<button class="btn" data-grade="easy" style="flex:1">Easy</button></div>' +
      '<p class="small muted">Again = see it again today · Good = in a few days · Easy = later still.</p>';
    el("flip").onclick = function () { fFlipped = !fFlipped; el("flip").classList.toggle("on", fFlipped); };
    el("fShuffle").onclick = function () { fOrder = shuffle(fOrder.slice()); fPos = 0; showCard(); };
    el("fAll").onclick = function () { fOrder = ST.flashcards.map(function (_, i) { return i; }); fPos = 0; showCard(); };
    el("fReset").onclick = function () { save("cards", {}); fOrder = ST.flashcards.map(function (_, i) { return i; }); fPos = 0; showCard(); toast("Schedule reset"); };
    el("cardsBody").addEventListener("click", function (e) {
      var g = e.target.closest("[data-grade]"); if (g) grade(g.dataset.grade);
    });
    showCard();
  }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function showCard() {
    if (!fOrder.length) return;
    fPos = ((fPos % fOrder.length) + fOrder.length) % fOrder.length;
    var c = ST.flashcards[fOrder[fPos]];
    fFlipped = false; el("flip").classList.remove("on");
    el("fFront").textContent = c.front;
    el("fBack").textContent = c.back;
    el("fCount").textContent = (fPos + 1) + " / " + fOrder.length;
    el("fBar").style.width = ((fPos + 1) / fOrder.length * 100) + "%";
    el("dueCount").textContent = dueCards().length + " due today";
  }
  function grade(g) {
    var st = cardState(), idx = fOrder[fPos], s = st[idx] || { bucket: 0 };
    if (g === "again") s.bucket = 0; else if (g === "good") s.bucket = Math.min(5, (s.bucket || 0) + 1);
    else s.bucket = Math.min(6, (s.bucket || 0) + 2);
    var steps = [0, 1, 2, 4, 7, 14, 30];
    var d = new Date(); d.setDate(d.getDate() + steps[s.bucket]);
    s.due = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    s.seen = true; st[idx] = s; save("cards", st);
    var seen = Object.keys(st).length;
    if (seen >= ST.flashcards.length) { var a = load("activities", {}); a.cards = true; save("activities", a); refreshProgress(); }
    fPos++; showCard();
  }

  /* ================= 6. FACES ================= */
  function renderFaces() {
    var faces = MOD[2].faces;
    var h = head("Module 3", "The fourteen faces of the strongman",
      "Filter the list, or tap the pills to focus on the faces with a named Bible anchor.");
    h += '<div class="btn-row"><input id="faceFilter" placeholder="Filter the faces…" ' +
      'style="flex:1;min-width:200px;min-height:44px;padding:10px 14px;border:1px solid var(--line);border-radius:999px;background:#fff">' +
      '<button class="btn btn-ghost btn-sm" id="faceBible">Bible-named only</button>' +
      '<button class="btn btn-ghost btn-sm" id="faceAll">Show all</button></div>';
    h += '<div class="grid g3" id="faceGrid">' + faces.map(function (f) {
      return '<div class="face-card" data-bible="' + (f.bible !== "—" ? "1" : "0") + '" data-text="' +
        esc((f.face + " " + f.bible + " " + f.detail).toLowerCase()) + '"><h3>' + esc(f.face) + "</h3>" +
        '<p class="anchor">' + esc(f.bible === "—" ? "Face named in the teaching" : f.bible) + "</p>" +
        '<p style="margin:0" class="small">' + esc(f.detail) + "</p></div>";
    }).join("") + "</div>";
    h += scrPanel(MOD[2].scriptures[0]);
    el("facesBody").innerHTML = h;
    function filter(q, bibleOnly) {
      Array.prototype.forEach.call(el("faceGrid").children, function (c) {
        var ok = c.dataset.text.indexOf(q) > -1 && (!bibleOnly || c.dataset.bible === "1");
        c.classList.toggle("hidden", !ok);
      });
    }
    el("faceFilter").oninput = function () { filter(this.value.toLowerCase(), false); };
    el("faceBible").onclick = function () { filter(el("faceFilter").value.toLowerCase(), true); };
    el("faceAll").onclick = function () { el("faceFilter").value = ""; filter("", false); };
  }

  /* ================= 7. MATCHING ================= */
  var mSel = null, mDone = 0;
  function renderMatch() {
    var pairs = ST.matching;
    var lefts = shuffle(pairs.map(function (p, i) { return { i: i, t: p.left }; }));
    var rights = shuffle(pairs.map(function (p, i) { return { i: i, t: p.right }; }));
    mSel = null; mDone = 0;
    el("matchBody").innerHTML = head("Match the Bible character", "Eight pairs",
      "Tap a name on the left, then the description on the right. Correct pairs lock in green.") +
      '<div class="panel p-gold"><p class="kick">Matched</p><p style="margin:0" class="tnum" id="mScore">0 of 8</p></div>' +
      '<div class="match-grid" id="mGrid"><div id="mL"></div><div id="mR"></div></div>' +
      '<div class="btn-row"><button class="btn btn-ghost btn-sm" id="mReset">Reset game</button></div>';
    function col(list, side) {
      return list.map(function (o) {
        return '<button class="mbtn" style="width:100%;margin-bottom:10px" data-side="' + side + '" data-i="' + o.i + '">' + esc(o.t) + "</button>";
      }).join("");
    }
    el("mL").innerHTML = col(lefts, "l");
    el("mR").innerHTML = col(rights, "r");
    el("mGrid").addEventListener("click", function (e) {
      var b = e.target.closest(".mbtn"); if (!b || b.classList.contains("done")) return;
      if (!mSel) { clearSel(); b.classList.add("sel"); mSel = b; return; }
      if (mSel === b) { b.classList.remove("sel"); mSel = null; return; }
      if (mSel.dataset.side === b.dataset.side) { clearSel(); b.classList.add("sel"); mSel = b; return; }
      if (mSel.dataset.i === b.dataset.i) {
        mSel.classList.remove("sel"); mSel.classList.add("done"); b.classList.add("done");
        mSel = null; mDone++; el("mScore").textContent = mDone + " of " + ST.matching.length;
        if (mDone === ST.matching.length) {
          toast("All eight matched"); var a = load("activities", {}); a.match = true; save("activities", a); refreshProgress();
        }
      } else {
        var w = mSel; b.classList.add("shake"); w.classList.add("shake");
        setTimeout(function () { b.classList.remove("shake"); w.classList.remove("shake"); w.classList.remove("sel"); }, 420);
        mSel = null;
      }
    });
    el("mReset").onclick = renderMatch;
    function clearSel() { Array.prototype.forEach.call(el("mGrid").querySelectorAll(".sel"), function (x) { x.classList.remove("sel"); }); }
  }

  /* ================= 8. BATTLE ORDER SEQUENCER ================= */
  var seq = [];
  function renderOrder() {
    seq = shuffle(MOD[5].steps.slice());
    el("orderBody").innerHTML = head("Battle order sequencer", "Put the twelve ways to fight in order",
      "Bind first, then spoil. Move each step until the order matches the teaching, then check it.") +
      '<div id="seqList"></div>' +
      '<div class="btn-row"><button class="btn" id="seqCheck">Check order</button>' +
      '<button class="btn btn-ghost btn-sm" id="seqShuffle">Shuffle again</button>' +
      '<button class="btn btn-soft btn-sm" id="seqSolve">Show correct order</button></div>' +
      '<p class="small muted" id="seqResult"></p>';
    drawSeq();
    el("seqCheck").onclick = checkSeq;
    el("seqShuffle").onclick = function () { seq = shuffle(seq.slice()); drawSeq(); el("seqResult").textContent = ""; };
    el("seqSolve").onclick = function () { seq = MOD[5].steps.slice(); drawSeq(); checkSeq(); };
  }
  function drawSeq() {
    el("seqList").innerHTML = seq.map(function (s, i) {
      return '<div class="seq-item" data-i="' + i + '"><span class="num tnum">' + (i + 1) + "</span>" +
        '<span class="txt"><b>' + esc(s.step) + "</b></span>" +
        '<span class="seq-ctrl"><button data-up="' + i + '" aria-label="Move up">▲</button>' +
        '<button data-down="' + i + '" aria-label="Move down">▼</button></span></div>';
    }).join("");
    el("seqList").onclick = function (e) {
      var u = e.target.closest("[data-up]"), d = e.target.closest("[data-down]");
      if (u) move(+u.dataset.up, -1); if (d) move(+d.dataset.down, 1);
    };
  }
  function move(i, dir) {
    var j = i + dir; if (j < 0 || j >= seq.length) return;
    var t = seq[i]; seq[i] = seq[j]; seq[j] = t; drawSeq(); el("seqResult").textContent = "";
  }
  function checkSeq() {
    var right = 0;
    Array.prototype.forEach.call(el("seqList").children, function (row, i) {
      var ok = seq[i].n === i + 1;
      row.classList.toggle("right", ok); row.classList.toggle("wrong", !ok);
      if (ok) right++;
    });
    el("seqResult").textContent = right + " of " + seq.length + " steps are in the right place.";
    if (right === seq.length) { var a = load("activities", {}); a.order = true; save("activities", a); refreshProgress(); toast("Perfect order"); }
  }

  /* ================= 9. SELF-EXAMINATION ================= */
  var SIGN_MAP = [
    ["Deliverance", "Restoration"], ["Repentance", "Deliverance"], ["Repentance", "Breaking Altars And Strongholds"],
    ["Renunciation", "Protection"], ["Breaking Covenants", "Deliverance"], ["Restoration", "Breaking Altars And Strongholds"],
    ["Breaking Covenants", "Breaking Altars And Strongholds"], ["Restoration", "Healing"],
    ["Protection", "Sealing"], ["Sealing", "Healing"]
  ];
  function renderExam() {
    var signs = MOD[4].signs;
    var saved = load("exam", {});
    var h = head("Self-examination", "The ten signs of a strongman attack",
      "Tick every sign you recognise in your own life, then build your personal prayer list from the prayer manual.");
    h += signs.map(function (s, i) {
      return '<label class="check"><input type="checkbox" data-sign="' + i + '"' + (saved[i] ? " checked" : "") +
        '><span><b>' + esc(s.sign) + "</b><br><span class=\"small muted\">" + esc(s.detail) + "</span></span></label>";
    }).join("");
    h += '<div class="btn-row"><button class="btn" id="examBuild">Build my prayer list</button>' +
      '<button class="btn btn-ghost btn-sm" id="examPrint">Print</button>' +
      '<button class="btn btn-soft btn-sm" id="examClear">Clear</button></div><div id="examOut"></div>';
    el("examBody").innerHTML = h;
    Array.prototype.forEach.call(el("examBody").querySelectorAll("[data-sign]"), function (cb) {
      cb.parentNode.classList.toggle("on", cb.checked);
      cb.onchange = function () {
        var s = load("exam", {}); s[cb.dataset.sign] = cb.checked; save("exam", s);
        cb.parentNode.classList.toggle("on", cb.checked);
      };
    });
    el("examBuild").onclick = buildExam;
    el("examPrint").onclick = function () { window.print(); };
    el("examClear").onclick = function () {
      save("exam", {}); save("exam_list", null); renderExam();
    };
    if (load("exam_list", null)) buildExam();
  }
  function buildExam() {
    var saved = load("exam", {}), sections = [], signs = MOD[4].signs;
    Object.keys(saved).forEach(function (k) {
      if (saved[k]) SIGN_MAP[+k].forEach(function (sec) { if (sections.indexOf(sec) < 0) sections.push(sec); });
    });
    if (!sections.length) sections = ["Repentance", "Deliverance", "Sealing"];
    var picked = signs.filter(function (_, i) { return saved[i]; }).map(function (s) { return s.sign; });
    var h = head("Your prayer list", "Pray these sections out loud", null);
    h += '<div class="panel p-cream"><p class="kick" style="color:var(--teal)">Signs you ticked</p><p style="margin:0">' +
      (picked.length ? esc(picked.join(" · ")) : "None ticked yet — this is the standard starting list.") + "</p></div>";
    sections.forEach(function (sec) {
      var block = ST.prayer_points.filter(function (p) { return p.section === sec; })[0];
      if (!block) return;
      h += '<div class="panel p-ember"><p class="kick">' + esc(block.section) + "</p><ul style=\"margin:0 0 0 -8px\">" +
        block.points.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul></div>";
    });
    el("examOut").innerHTML = h;
    save("exam_list", sections);
    var a = load("activities", {}); a.exam = true; save("activities", a); refreshProgress();
  }

  /* ================= 10. DECLARATION TELEPROMPTER ================= */
  var tele = { set: 0, line: 0, timer: null, secs: 5 };
  function renderDeclare() {
    var h = head("Declarations", "Twelve declaration sets, exactly as spoken",
      "Read them here, or open the teleprompter for full-screen large type, one line at a time.");
    h += DEC.sets.map(function (s, i) {
      return "<details><summary>" + esc(s.title) + "</summary><div class=\"details-body\">" +
        '<p class="small muted">' + esc(s.when) + "</p>" +
        '<div class="panel p-gold"><p class="kick">' + esc(s.kicker) + "</p>" +
        s.lines.map(function (l) { return '<p style="margin:0 0 6px" class="scripture" >' + esc(l) + "</p>"; }).join("") +
        "</div><div class=\"btn-row\" style=\"margin-bottom:0\"><button class=\"btn btn-sm\" data-tele=\"" + i +
        '">Open teleprompter</button><button class="btn btn-ghost btn-sm" data-deccopy="' + i + '">Copy</button></div></div></details>';
    }).join("");
    h += '<p class="small muted">' + esc(DEC.note) + "</p>";
    el("declareBody").innerHTML = h;
    el("declareBody").addEventListener("click", function (e) {
      var t = e.target.closest("[data-tele]"), c = e.target.closest("[data-deccopy]");
      if (t) openTele(+t.dataset.tele);
      if (c) { var s = DEC.sets[+c.dataset.deccopy]; copy(s.kicker + "\n\n" + s.lines.join("\n")); }
    });
  }
  function openTele(i) {
    tele.set = i; tele.line = 0;
    var s = DEC.sets[i];
    el("teleMount").innerHTML = '<div class="tele" id="tele">' +
      '<div class="tele-head"><span class="tele-kick">' + esc(s.kicker) + "</span>" +
      '<button class="btn btn-ghost btn-sm" id="teleClose" style="margin-left:auto">Close</button>' +
      '<span class="pill" style="flex:1 0 100%">' + esc(s.title) + "</span></div>" +
      '<div class="tele-line" id="teleLine"></div>' +
      '<div class="tele-foot"><button class="iconbtn" id="telePrev" aria-label="Previous line">‹</button>' +
      '<span class="count tnum" id="teleCount"></span>' +
      '<button class="iconbtn" id="teleNext" aria-label="Next line">›</button>' +
      '<button class="btn btn-sm" id="teleAuto">Auto-advance</button>' +
      '<label>Seconds <input id="teleSecs" type="range" min="3" max="10" step="1" value="' + tele.secs + '">' +
      '<b class="tnum" id="teleSecsVal">' + tele.secs + "</b></label></div></div>";
    el("teleClose").onclick = closeTele;
    el("telePrev").onclick = function () { teleGo(tele.line - 1); };
    el("teleNext").onclick = function () { teleGo(tele.line + 1); };
    el("teleLine").onclick = function () { teleGo(tele.line + 1); };
    el("teleSecs").oninput = function () { tele.secs = +this.value; el("teleSecsVal").textContent = tele.secs; if (tele.timer) startAuto(); };
    el("teleAuto").onclick = function () { tele.timer ? stopAuto() : startAuto(); };
    teleGo(0);
    var a = load("activities", {}); a.declare = true; save("activities", a); refreshProgress();
  }
  function teleGo(n) {
    var s = DEC.sets[tele.set];
    if (n >= s.lines.length) { n = s.lines.length - 1; stopAuto(); }
    tele.line = Math.max(0, n);
    el("teleLine").textContent = s.lines[tele.line];
    el("teleCount").textContent = (tele.line + 1) + " / " + s.lines.length;
  }
  function startAuto() {
    stopAuto();
    el("teleAuto").textContent = "Stop auto";
    tele.timer = setInterval(function () {
      var s = DEC.sets[tele.set];
      if (tele.line >= s.lines.length - 1) { stopAuto(); return; }
      teleGo(tele.line + 1);
    }, tele.secs * 1000);
  }
  function stopAuto() { if (tele.timer) clearInterval(tele.timer); tele.timer = null; if (el("teleAuto")) el("teleAuto").textContent = "Auto-advance"; }
  function closeTele() { stopAuto(); el("teleMount").innerHTML = ""; }
  document.addEventListener("keydown", function (e) {
    if (!el("tele")) return;
    if (e.key === "Escape") closeTele();
    if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); teleGo(tele.line + 1); }
    if (e.key === "ArrowLeft") teleGo(tele.line - 1);
  });

  /* ================= 11. PRAYER LIBRARY ================= */
  function renderPrayers() {
    var ticks = load("prayer_ticks", {});
    var h = head("Prayer library", "Every prayer point, by section",
      "Twelve sections in the deliverance order. Each tick is saved on this device.");
    h += ST.prayer_points.map(function (blk, bi) {
      var n = blk.points.filter(function (_, pi) { return ticks[bi + ":" + pi]; }).length;
      return "<details><summary>" + esc(blk.section) + ' <span class="pill tnum">' + n + "/" + blk.points.length +
        "</span></summary><div class=\"details-body\">" +
        blk.points.map(function (p, pi) {
          var k = bi + ":" + pi;
          return '<label class="check' + (ticks[k] ? " on" : "") + '"><input type="checkbox" data-pray="' + k + '"' +
            (ticks[k] ? " checked" : "") + "><span>" + esc(p) + "</span></label>";
        }).join("") + "</div></details>";
    }).join("");
    el("prayersBody").innerHTML = h;
    Array.prototype.forEach.call(el("prayersBody").querySelectorAll("[data-pray]"), function (cb) {
      cb.onchange = function () {
        var t = load("prayer_ticks", {}); t[cb.dataset.pray] = cb.checked; save("prayer_ticks", t);
        cb.parentNode.classList.toggle("on", cb.checked);
        var a = load("activities", {}); a.prayers = true; save("activities", a); refreshProgress();
      };
    });
  }

  /* ================= 12. BOMBARDMENT TRACKER ================= */
  function renderBombard() {
    var done = load("bombard", {});
    var h = head("Seven-day bombardment", "The Moses-and-Pharaoh principle",
      "Moses went back to Pharaoh again and again. Do not change the prayer and do not be discouraged — go back until he lets you go.");
    h += '<div class="panel p-gold"><p class="kick">Streak</p><p style="margin:0" class="tnum" id="bStreak"></p></div>';
    h += ST.weekly_assignment.map(function (t, i) {
      var parts = t.split("—");
      var label = parts[0].trim(), body = parts.slice(1).join("—").trim();
      return '<div class="day' + (done[i] ? " on" : "") + '" data-day="' + i + '">' +
        '<label class="check" style="border:none;background:none;padding:0;margin:0;flex:1;align-items:flex-start">' +
        '<input type="checkbox" data-bomb="' + i + '"' + (done[i] ? " checked" : "") + ">" +
        '<span><span class="dn">' + esc(label) + "</span><br>" + esc(body) + "</span></label></div>";
    }).join("");
    h += '<div class="btn-row"><button class="btn btn-ghost btn-sm" id="bReset">Reset the week</button></div>';
    el("bombardBody").innerHTML = h;
    Array.prototype.forEach.call(el("bombardBody").querySelectorAll("[data-bomb]"), function (cb) {
      cb.onchange = function () {
        var d = load("bombard", {}); d[cb.dataset.bomb] = cb.checked; save("bombard", d);
        cb.closest(".day").classList.toggle("on", cb.checked);
        updateStreak();
        var a = load("activities", {}); a.bombard = Object.keys(d).filter(function (k) { return d[k]; }).length === 7; save("activities", a);
        refreshProgress();
      };
    });
    updateStreak();
    el("bReset").onclick = function () { save("bombard", {}); renderBombard(); };
  }
  function updateStreak() {
    var d = load("bombard", {}), s = 0;
    for (var i = 0; i < 7; i++) { if (d[i]) s++; else break; }
    var total = Object.keys(d).filter(function (k) { return d[k]; }).length;
    if (el("bStreak")) el("bStreak").textContent = s + " day streak · " + total + " of 7 days completed";
  }

  /* ================= 13. DREAM WATCH LOG ================= */
  function renderDreams() {
    var logs = load("dreams", []);
    var h = head("Dream watch log", "Your early-warning system",
      "Your dreams will indicate if the strongman is on the move. Record them, note the biblical symbol, and pray.");
    h += '<div class="card"><label class="small"><b>Date</b><br><input id="dDate" type="date" style="min-height:44px;width:100%;padding:10px;border:1px solid var(--line);border-radius:10px;background:#fff"></label>' +
      '<p class="small" style="margin:12px 0 4px"><b>The dream</b></p><textarea id="dText" rows="4" placeholder="What did you see?"></textarea>' +
      '<p class="small" style="margin:12px 0 4px"><b>Biblical symbol / interpretation note</b></p><textarea id="dNote" rows="3" placeholder="Scripture, symbol, prayer point…"></textarea>' +
      '<div class="btn-row" style="margin-bottom:0"><button class="btn" id="dSave">Save entry</button>' +
      '<button class="btn btn-ghost btn-sm" id="dExport">Export as text</button></div></div>';
    h += '<div id="dList" style="margin-top:18px"></div>';
    el("dreamsBody").innerHTML = h;
    el("dDate").value = today();
    el("dSave").onclick = function () {
      var t = el("dText").value.trim();
      if (!t) { toast("Write the dream first"); return; }
      var l = load("dreams", []);
      l.unshift({ date: el("dDate").value || today(), text: t, note: el("dNote").value.trim() });
      save("dreams", l); el("dText").value = ""; el("dNote").value = "";
      var a = load("activities", {}); a.dreams = true; save("activities", a);
      drawDreams(); refreshProgress(); toast("Entry saved");
    };
    el("dExport").onclick = function () {
      var l = load("dreams", []);
      download("l137-dream-watch-log.txt", "DREAM WATCH LOG\nDeliverance From The Strongman · L137 Deliverance Ministry International\n\n" +
        l.map(function (e) { return e.date + "\n" + e.text + (e.note ? "\nSymbol / note: " + e.note : ""); }).join("\n\n----------\n\n"));
    };
    drawDreams();
  }
  function drawDreams() {
    var l = load("dreams", []);
    el("dList").innerHTML = l.length ? l.map(function (e, i) {
      return '<div class="panel p-cream"><p class="kick" style="color:var(--teal)">' + esc(e.date) + "</p><p>" + esc(e.text) + "</p>" +
        (e.note ? '<p class="small muted" style="margin:0"><b>Symbol / note:</b> ' + esc(e.note) + "</p>" : "") +
        '<div class="btn-row" style="margin:10px 0 0"><button class="btn btn-ghost btn-sm" data-ddel="' + i + '">Delete</button></div></div>';
    }).join("") : '<p class="muted small">No dreams recorded yet.</p>';
    el("dList").onclick = function (e) {
      var b = e.target.closest("[data-ddel]"); if (!b) return;
      var l = load("dreams", []); l.splice(+b.dataset.ddel, 1); save("dreams", l); drawDreams();
    };
  }
  function download(name, text) {
    var b = new Blob([text], { type: "text/plain;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  /* ================= 14. QUIZ ================= */
  var qIdx = 0, qScore = 0, qAnswered = false;
  function renderQuiz() {
    qIdx = 0; qScore = 0; qAnswered = false;
    el("quizBody").innerHTML = head("Knowledge check", "Twelve questions",
      "One question at a time. You get the reason for the right answer straight away.") +
      '<div class="card" id="qCard"></div>';
    drawQuiz();
  }
  function drawQuiz() {
    var q = ST.quiz[qIdx];
    el("qCard").innerHTML = '<p class="eyebrow tnum">Question ' + (qIdx + 1) + " of " + ST.quiz.length + "</p>" +
      "<h3 style=\"font-size:21px\">" + esc(q.q) + "</h3>" +
      q.options.map(function (o, i) { return '<button class="opt" data-opt="' + i + '">' + esc(o) + "</button>"; }).join("") +
      '<div id="qWhy"></div>';
    qAnswered = false;
    el("qCard").onclick = function (e) {
      var b = e.target.closest("[data-opt]"); if (!b || qAnswered) return;
      qAnswered = true;
      var pick = +b.dataset.opt, q = ST.quiz[qIdx];
      Array.prototype.forEach.call(el("qCard").querySelectorAll(".opt"), function (o, i) {
        o.disabled = true;
        if (i === q.a) o.classList.add("correct");
        else if (i === pick) o.classList.add("incorrect");
      });
      if (pick === q.a) qScore++;
      el("qWhy").innerHTML = '<div class="panel ' + (pick === q.a ? "p-green" : "p-ember") + '" style="margin-top:14px">' +
        '<p class="kick">' + (pick === q.a ? "Correct" : "Not quite") + "</p><p style=\"margin:0\">" + esc(q.why) + "</p></div>" +
        '<div class="btn-row" style="margin-bottom:0"><button class="btn" id="qNext">' +
        (qIdx === ST.quiz.length - 1 ? "See my score" : "Next question") + "</button></div>";
      el("qNext").onclick = function () {
        if (qIdx === ST.quiz.length - 1) finishQuiz(); else { qIdx++; drawQuiz(); }
      };
    };
  }
  function finishQuiz() {
    save("quiz_score", qScore);
    var a = load("activities", {}); a.quiz = true; save("activities", a); refreshProgress();
    el("qCard").innerHTML = '<p class="eyebrow">Result</p><h3 style="font-size:26px" class="tnum">' + qScore + " out of " + ST.quiz.length + "</h3>" +
      "<p>" + (qScore === ST.quiz.length ? "Perfect. You know the teaching." :
        qScore >= 9 ? "Strong. Review the modules you missed." : "Go back through the nine modules and the flashcards, then try again.") + "</p>" +
      '<div class="btn-row" style="margin-bottom:0"><button class="btn" id="qRetake">Retake the quiz</button>' +
      '<button class="btn btn-ghost btn-sm" data-go="modules">Back to the modules</button></div>';
    el("qRetake").onclick = renderQuiz;
  }

  /* ================= 15. MEMORY VERSES ================= */
  function renderMemory() {
    var mv = S.memory_verses;
    var d = new Date();
    var doy = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
    var vod = mv[doy % mv.length];
    var h = head("Memory verses", "Eight verses to carry", "Print this page and cut along the cards — two by four on a page.");
    h += '<div class="panel p-teal"><p class="kick">Verse of the day</p><p class="scripture" style="margin:0">' +
      '<span class="ref">' + esc(vod.ref) + "</span>" + esc(vod.text) + "</p></div>";
    h += '<div class="btn-row no-print"><button class="btn" id="mvPrint">Print the cards</button>' +
      '<button class="btn btn-ghost btn-sm" id="mvCopy">Copy all eight</button></div>';
    h += '<div class="mv-grid">' + mv.map(function (v) {
      return '<div class="mv-card"><p class="ref">' + esc(v.ref) + '</p><p class="txt">' + esc(v.text) + "</p>" +
        '<p class="mv-src">L137 · Deliverance From The Strongman</p></div>';
    }).join("") + "</div>";
    el("memoryBody").innerHTML = h;
    el("mvPrint").onclick = function () { window.print(); };
    el("mvCopy").onclick = function () { copy(mv.map(function (v) { return v.ref + "\n" + v.text; }).join("\n\n")); };
  }

  /* ================= 16. SEARCH ================= */
  var INDEX = [];
  (function buildIndex() {
    MOD.forEach(function (m) {
      INDEX.push({ v: "modules", where: "Module " + m.n + " · " + m.title, text: m.summary });
      (m.teaching_points || []).forEach(function (t) { INDEX.push({ v: "modules", where: "Module " + m.n + " · " + m.title, text: t }); });
      (m.definitions || []).forEach(function (t) { INDEX.push({ v: "modules", where: "Module " + m.n + " · definition", text: t }); });
      (m.faces || []).forEach(function (f) { INDEX.push({ v: "faces", where: "Face · " + f.face, text: f.bible + " — " + f.detail }); });
      (m.agenda || []).forEach(function (a) { a.items.forEach(function (i) { INDEX.push({ v: "modules", where: a.arm, text: i }); }); });
      (m.signs || []).forEach(function (s) { INDEX.push({ v: "exam", where: "Sign · " + s.sign, text: s.detail }); });
      (m.steps || []).forEach(function (s) { INDEX.push({ v: "order", where: "Step " + s.n + " · " + s.step, text: s.detail }); });
    });
    S.scriptures.forEach(function (s) { INDEX.push({ v: "vault", where: "Scripture · " + s.ref, text: s.text }); });
    S.memory_verses.forEach(function (s) { INDEX.push({ v: "memory", where: "Memory verse · " + s.ref, text: s.text }); });
    DEC.sets.forEach(function (s) { s.lines.forEach(function (l) { INDEX.push({ v: "declare", where: "Declaration · " + s.title, text: l }); }); });
    ST.prayer_points.forEach(function (b) { b.points.forEach(function (p) { INDEX.push({ v: "prayers", where: "Prayer · " + b.section, text: p }); }); });
    ST.flashcards.forEach(function (c) { INDEX.push({ v: "cards", where: "Flashcard · " + c.front, text: c.back }); });
    T.characters.forEach(function (c) { INDEX.push({ v: "home", where: "Character · " + c.name, text: c.story + " " + c.principle }); });
    ST.key_lessons.forEach(function (l) { INDEX.push({ v: "care", where: "Key lesson", text: l }); });
    ST.prophetic_directions.forEach(function (l) { INDEX.push({ v: "care", where: "Prophetic direction", text: l }); });
  })();
  function renderSearch() {
    el("searchBody").innerHTML = head("Search", "Everything in this teaching",
      "Modules, scriptures, declarations, prayer points, flashcards and characters.") +
      '<input id="searchInput" placeholder="Search…" style="width:100%;min-height:48px;padding:12px 16px;border:1px solid var(--line);border-radius:999px;background:#fff">' +
      '<p class="small muted" id="searchCount" style="margin-top:12px"></p><div id="searchOut"></div>';
    el("searchInput").oninput = function () { doSearch(this.value); };
  }
  function doSearch(q) {
    q = (q || "").trim();
    var out = el("searchOut"), cnt = el("searchCount");
    if (q.length < 2) { out.innerHTML = ""; cnt.textContent = "Type at least two letters."; return; }
    var lq = q.toLowerCase();
    var hits = INDEX.filter(function (i) { return (i.where + " " + i.text).toLowerCase().indexOf(lq) > -1; }).slice(0, 80);
    cnt.textContent = hits.length + (hits.length === 1 ? " result" : " results");
    out.innerHTML = hits.map(function (hobj) {
      return '<div class="hit"><p class="where">' + hl(hobj.where, q) + "</p><p style=\"margin:6px 0 10px\">" + hl(hobj.text, q) + "</p>" +
        '<button class="btn btn-ghost btn-sm" data-go="' + hobj.v + '">Open section</button></div>';
    }).join("") || '<p class="muted">Nothing found.</p>';
  }
  function hl(text, q) {
    var e = esc(text), re = new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
    return e.replace(re, "<mark>$1</mark>");
  }

  /* ================= 17. NOTES ================= */
  var NOTE_SECTIONS = MOD.map(function (m) { return { k: m.id, label: "Module " + m.n + " — " + m.title }; })
    .concat([{ k: "declarations", label: "Declarations" }, { k: "prayers", label: "Prayer library" },
    { k: "dreams", label: "Dreams and warfare" }, { k: "general", label: "General notes" }]);
  function renderNotes() {
    var notes = load("notes", {});
    var h = head("My notes", "Write it down", "Everything you type is saved on this device as you type.");
    h += NOTE_SECTIONS.map(function (s) {
      return '<div class="card" style="margin-bottom:12px"><p class="eyebrow">' + esc(s.label) + "</p>" +
        '<textarea rows="4" data-note="' + s.k + '" placeholder="Your notes…">' + esc(notes[s.k] || "") + "</textarea></div>";
    }).join("");
    h += '<div class="btn-row"><button class="btn" id="exportAll">Export all my work</button>' +
      '<button class="btn btn-ghost btn-sm" id="clearAll">Clear everything on this device</button></div>';
    el("notesBody").innerHTML = h;
    Array.prototype.forEach.call(el("notesBody").querySelectorAll("[data-note]"), function (ta) {
      ta.oninput = function () {
        var n = load("notes", {}); n[ta.dataset.note] = ta.value; save("notes", n);
        var a = load("activities", {}); a.notes = true; save("activities", a);
      };
    });
    el("exportAll").onclick = exportAll;
    el("clearAll").onclick = function () {
      if (!confirm("Clear all notes, ticks, logs and progress saved on this device?")) return;
      keysOf().forEach(function (k) {
        if (k.indexOf(NS) !== 0) return;
        delete MEM[k];
        if (DB) { try { DB.removeItem(k); } catch (e) {} }
      });
      toast("Cleared"); renderAll(); go("home");
    };
  }
  function exportAll() {
    var L = [];
    L.push("DELIVERANCE FROM THE STRONGMAN — MY WORKBOOK");
    L.push(META.pastor + " · " + META.ministry);
    L.push("Service date: May 3, 2025 · Exported " + new Date().toLocaleString());
    L.push(META.tagline); L.push("");
    var notes = load("notes", {});
    L.push("== MY NOTES ==");
    NOTE_SECTIONS.forEach(function (s) { if (notes[s.k]) { L.push("-- " + s.label); L.push(notes[s.k]); L.push(""); } });
    var exam = load("exam", {}); var signs = MOD[4].signs;
    L.push("== SELF-EXAMINATION ==");
    signs.forEach(function (s, i) { L.push((exam[i] ? "[x] " : "[ ] ") + s.sign); });
    var list = load("exam_list", null);
    if (list) L.push("My prayer sections: " + list.join(", "));
    L.push("");
    L.push("== SEVEN-DAY BOMBARDMENT ==");
    var b = load("bombard", {});
    ST.weekly_assignment.forEach(function (t, i) { L.push((b[i] ? "[x] " : "[ ] ") + t); });
    L.push("");
    L.push("== DELIVERANCE CHECKLIST ==");
    var ck = load("checklist", {});
    ST.checklist.forEach(function (t, i) { L.push((ck[i] ? "[x] " : "[ ] ") + t); });
    L.push("");
    L.push("== REFLECTION ==");
    var refl = load("reflection", {});
    ST.reflection_questions.forEach(function (q, i) { L.push(q); L.push(refl[i] ? refl[i] : "(no answer yet)"); L.push(""); });
    L.push("== DREAM WATCH LOG ==");
    load("dreams", []).forEach(function (e) { L.push(e.date + " — " + e.text + (e.note ? " | " + e.note : "")); });
    L.push("");
    L.push("== PROGRESS ==");
    var p = progressStats();
    L.push(p.done + " of " + p.total + " items complete (" + p.pct + "%)");
    var qs = load("quiz_score", null);
    if (qs !== null) L.push("Quiz score: " + qs + " / " + ST.quiz.length);
    L.push("");
    L.push(META.tagline);
    download("l137-strongman-my-workbook.txt", L.join("\n"));
  }

  /* ================= 18. PROGRESS + CERTIFICATE ================= */
  var ACTIVITIES = [
    ["panels", "Panel reader"], ["cloze", "Cloze memory drill"], ["cards", "Flashcards (all 24 graded)"],
    ["match", "Match the Bible character"], ["order", "Battle order sequencer"], ["exam", "Self-examination"],
    ["declare", "Declaration teleprompter"], ["prayers", "Prayer library"], ["bombard", "Seven-day bombardment"],
    ["dreams", "Dream watch log"], ["quiz", "Knowledge check quiz"], ["checklist", "Deliverance checklist"],
    ["reflection", "Reflection questions"], ["notes", "My notes"]
  ];
  function progressStats() {
    var mods = load("modules_done", {}), acts = load("activities", {});
    var mDone = MOD.filter(function (m) { return mods[m.id]; }).length;
    var aDone = ACTIVITIES.filter(function (a) { return acts[a[0]]; }).length;
    var total = MOD.length + ACTIVITIES.length, done = mDone + aDone;
    return { done: done, total: total, pct: Math.round(done / total * 100), mDone: mDone, aDone: aDone };
  }
  function renderProgress() {
    var mods = load("modules_done", {}), acts = load("activities", {}), p = progressStats();
    var h = head("Progress", "Your journey through the teaching",
      "Modules tick automatically from the module page; activities tick as you complete them.");
    h += '<div class="card"><p class="eyebrow tnum" id="pLabel">' + p.done + " of " + p.total + " complete · " + p.pct + "%</p>" +
      '<div class="progressbar" style="height:14px"><i id="pBar" style="width:' + p.pct + '%"></i></div></div>';
    h += '<p class="eyebrow" style="margin-top:24px">The nine modules</p>';
    h += MOD.map(function (m) {
      return '<label class="check' + (mods[m.id] ? " on" : "") + '"><input type="checkbox" data-pmod="' + m.id + '"' +
        (mods[m.id] ? " checked" : "") + "><span>Module " + m.n + " — " + esc(m.title) + "</span></label>";
    }).join("");
    h += '<p class="eyebrow" style="margin-top:24px">The activities</p>';
    h += ACTIVITIES.map(function (a) {
      return '<label class="check' + (acts[a[0]] ? " on" : "") + '"><input type="checkbox" data-pact="' + a[0] + '"' +
        (acts[a[0]] ? " checked" : "") + "><span>" + esc(a[1]) + "</span></label>";
    }).join("");
    h += '<div style="height:28px"></div>' + head("Certificate", "Completion certificate", null);
    h += '<div class="card no-print"><p class="small"><b>Your name as it should appear</b></p>' +
      '<input id="certName" value="' + esc(load("cert_name", "")) + '" placeholder="Full name" style="width:100%;min-height:46px;padding:12px;border:1px solid var(--line);border-radius:10px;background:#fff">' +
      '<div class="btn-row" style="margin-bottom:0"><button class="btn" id="certMake">Generate certificate</button>' +
      '<button class="btn btn-ghost btn-sm" id="certPrint">Print certificate</button></div>' +
      '<p class="small muted" id="certNote" style="margin-top:10px"></p></div>';
    h += '<div id="certOut" style="margin-top:16px"></div>';
    el("progressBody").innerHTML = h;
    Array.prototype.forEach.call(el("progressBody").querySelectorAll("[data-pmod]"), function (cb) {
      cb.onchange = function () { var m = load("modules_done", {}); m[cb.dataset.pmod] = cb.checked; save("modules_done", m); renderProgress(); renderModules(); };
    });
    Array.prototype.forEach.call(el("progressBody").querySelectorAll("[data-pact]"), function (cb) {
      cb.onchange = function () { var a = load("activities", {}); a[cb.dataset.pact] = cb.checked; save("activities", a); renderProgress(); };
    });
    el("certMake").onclick = makeCert;
    el("certPrint").onclick = function () { if (!el("certOut").innerHTML) makeCert(); if (el("certOut").innerHTML) window.print(); };
    el("certNote").textContent = p.done === p.total ? "Everything is complete — your certificate is ready."
      : "Complete all " + p.total + " items to unlock the certificate (" + (p.total - p.done) + " to go).";
    if (load("cert_name", "") && p.done === p.total) makeCert();
  }
  function makeCert() {
    var p = progressStats(), name = el("certName").value.trim();
    if (p.done < p.total) { toast("Complete every item first"); return; }
    if (!name) { toast("Enter your name"); return; }
    save("cert_name", name);
    el("certOut").innerHTML = '<div class="cert"><p class="eyebrow" style="letter-spacing:.28em">Certificate of completion</p>' +
      '<p class="small muted" style="margin:0">This certifies that</p><div class="name">' + esc(name) + "</div>" +
      "<p style=\"margin:0\">has completed the interactive workbook</p>" +
      "<h3>" + esc(META.title) + "</h3>" +
      '<p class="small">Taught by ' + esc(META.pastor) + " · " + esc(META.ministry) + "<br>Service date: May 3, 2025 · Main scripture: " + esc(META.main_scripture) + "</p>" +
      '<p class="small" style="margin:0">Completed ' + new Date().toLocaleDateString() + "</p>" +
      '<p class="tagline" style="color:var(--gold);font-weight:700;letter-spacing:.08em;margin-top:14px">' + esc(META.tagline) + "</p></div>";
  }
  function refreshProgress() {
    if (el("pBar")) renderProgress();
  }

  /* ================= 19/20. PREPARE, AFTERCARE, CHECKLIST, REFLECTION, GUARDRAILS ================= */
  function renderCare() {
    var ck = load("checklist", {}), refl = load("reflection", {});
    var h = head("Before you begin", "Deliverance preparation", null);
    h += ST.preparation.map(function (p, i) {
      return '<div class="panel p-teal"><p class="kick">Step ' + (i + 1) + "</p><p style=\"margin:0\">" + esc(p) + "</p></div>";
    }).join("");
    h += '<div style="height:30px"></div>' + head("Deliverance checklist", "Tick as you go", "Saved on this device.");
    h += ST.checklist.map(function (c, i) {
      return '<label class="check' + (ck[i] ? " on" : "") + '"><input type="checkbox" data-ck="' + i + '"' + (ck[i] ? " checked" : "") +
        "><span>" + esc(c) + "</span></label>";
    }).join("");
    h += '<div style="height:30px"></div>' + head("After the deliverance", "Aftercare", null);
    h += '<div class="panel p-green"><p class="kick">Keep your deliverance</p><ul style="margin:0 0 0 -8px">' +
      ST.aftercare.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ul></div>";
    h += '<div style="height:30px"></div>' + head("Prophetic directions", "Practical instructions", null);
    h += '<div class="panel p-gold"><p class="kick">Do these</p><ul style="margin:0 0 0 -8px">' +
      ST.prophetic_directions.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ul></div>";
    h += '<div style="height:30px"></div>' + head("Key lessons", "Eight things to carry away", null);
    h += '<div class="panel p-cream"><ol style="margin:0 0 0 -8px">' +
      ST.key_lessons.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ol></div>";
    h += '<div style="height:30px"></div>' + head("Reflection", "Answer honestly", "Your answers save as you type and are included in the export.");
    h += ST.reflection_questions.map(function (q, i) {
      return '<div class="card" style="margin-bottom:12px"><p style="font-family:var(--serif);font-weight:700;font-size:18px;margin:0 0 8px">' +
        esc(q) + "</p><textarea rows=\"3\" data-refl=\"" + i + '">' + esc(refl[i] || "") + "</textarea></div>";
    }).join("");
    h += '<div style="height:30px"></div>' + head("Read this carefully", "How not to misread this teaching", null);
    h += '<div class="panel p-cream"><p class="kick" style="color:var(--charcoal-mu)">Guardrails</p><ul style="margin:0 0 0 -8px">' +
      ST.misread_guardrails.map(function (g) { return "<li>" + esc(g) + "</li>"; }).join("") + "</ul></div>";
    el("careBody").innerHTML = h;
    Array.prototype.forEach.call(el("careBody").querySelectorAll("[data-ck]"), function (cb) {
      cb.onchange = function () {
        var c = load("checklist", {}); c[cb.dataset.ck] = cb.checked; save("checklist", c);
        cb.parentNode.classList.toggle("on", cb.checked);
        var a = load("activities", {});
        a.checklist = ST.checklist.every(function (_, i) { return c[i]; }); save("activities", a); refreshProgress();
      };
    });
    Array.prototype.forEach.call(el("careBody").querySelectorAll("[data-refl]"), function (ta) {
      ta.oninput = function () {
        var r = load("reflection", {}); r[ta.dataset.refl] = ta.value; save("reflection", r);
        var a = load("activities", {});
        a.reflection = Object.keys(r).some(function (k) { return (r[k] || "").trim().length > 0; });
        save("activities", a);
      };
    });
  }

  /* ================= DOWNLOAD PACK ================= */
  var PACK = [
    { t: "The Book", f: "deliverance-from-the-strongman-BOOK.pdf", n: "PDF · 76 pages · ready" },
    { t: "Printable Workbook", f: "deliverance-from-the-strongman-WORKBOOK.pdf", n: "PDF · 36 pages · ready" },
    { t: "Clean Public Transcript", f: "clean-public-transcript.md", n: "Text · ready" },
    { t: "Prophetic Directions", f: "", n: "PDF · coming soon" },
    { t: "Recall Sheet", f: "", n: "PDF · coming soon" },
    { t: "Declaration Card", f: "", n: "PDF · coming soon" },
    { t: "Prayer Point Manual", f: "", n: "PDF · coming soon" },
    { t: "Scripture Companion", f: "", n: "PDF · coming soon" },
    { t: "Deliverance Preparation Guide", f: "", n: "PDF · coming soon" },
    { t: "Deliverance Aftercare Guide", f: "", n: "PDF · coming soon" },
    { t: "Deliverance Checklist", f: "", n: "PDF · coming soon" },
    { t: "Reflection Journal", f: "", n: "PDF · coming soon" },
    { t: "Weekly Assignment", f: "", n: "PDF · coming soon" },
    { t: "Memory Verse Cards", f: "", n: "PDF · coming soon" },
    { t: "Family Prayer Guide", f: "", n: "PDF · coming soon" },
    { t: "Leader's Guide", f: "", n: "PDF · coming soon" },
    { t: "Bible Character Studies", f: "", n: "PDF · coming soon" },
    { t: "Teaching Flow Chart", f: "", n: "PDF · coming soon" }];
  function renderPack() {
    var h = head("Download the pack", "Printable resources",
      "The book, the printable workbook and the clean public transcript are ready now. The rest of the L137 pack is added here as each file is built.");
    h += '<div class="grid g2">' + PACK.map(function (p, i) {
      var ready = !!p.f;
      var open = ready ? '<a class="card" style="text-decoration:none;display:block" href="assets/downloads/' + p.f + '" download>'
        : '<div class="card" style="opacity:.62">';
      return open +
        '<p class="eyebrow tnum">' + String(i + 1).padStart(2, "0") + "</p>" +
        '<h3 style="font-size:19px;margin:0">' + esc(p.t) + "</h3>" +
        '<p class="small muted" style="margin:6px 0 0">' + esc(p.n) + "</p>" +
        (ready ? "</a>" : "</div>");
    }).join("") + "</div>";
    h += '<div style="height:26px"></div><div class="panel p-ember"><p class="kick">LISTEN &amp; PRAY ALOUD</p>' +
      "<h3>Scan the QR code to begin</h3><p style=\"margin:0\" class=\"small\">The audio companion for this service will be linked here.</p></div>";
    h += '<div class="btn-row"><button class="btn" id="packExport">Export all my work</button></div>';
    el("packBody").innerHTML = h;
    el("packExport").onclick = exportAll;
  }

  /* ================= boot ================= */
  function renderAll() {
    renderHome(); renderPanelReader(); renderModules(); renderVault(); renderCloze(); renderCards();
    renderFaces(); renderMatch(); renderOrder(); renderExam(); renderDeclare(); renderPrayers();
    renderBombard(); renderDreams(); renderQuiz(); renderMemory(); renderSearch(); renderNotes();
    renderProgress(); renderCare(); renderPack();
  }
  buildTabs();
  renderAll();
  document.body.addEventListener("click", function (e) {
    var g = e.target.closest("[data-go]"); if (g) { go(g.dataset.go); }
  });
  el("navSearch").addEventListener("input", function () {
    if (current !== "search") go("search");
    el("searchInput").value = this.value; doSearch(this.value);
  });
  window.addEventListener("hashchange", function () { go(location.hash.replace("#", "") || "home", true); });
  go(location.hash.replace("#", "") || "home", true);
})();
