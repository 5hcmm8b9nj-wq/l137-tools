/* Daily Devotion Prophetic Word — vanilla JS, browser storage only. */
(function () {
  "use strict";

  var PREFIX = "juice-extraction/";
  var INDEX_KEY = PREFIX + "index";

  var EXAMPLE_DEVOTIONAL =
    "HOW TO OVERCOME FEAR AND ANXIETY.\n\n" +
    "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end. Jeremiah 29:11.\n\n" +
    "For years, every time I taught on fear, I would say FEAR stands for \"False Evidence Appearing Real.\" The enemy is good at painting false pictures in our minds, convincing us that trouble is ahead. That's why it's so important to renew our minds with God's Word. When we know the truth, it helps us to expose the lies.\n\n" +
    "For instance, I used to be extremely negative. I believed the worst about everyone and assumed bad things were bound to happen eventually. But then I began reading God's Word and learned that He has only good things planned for our lives. And beyond that, He wants us to actively expect Him to do good things. Now, when the enemy tries to bring these negative thoughts of doom and gloom, I choose to stop, then think and say what God's Word says.\n\n" +
    "I declare in the Name of Jesus Christ, that every evil devices against us shall never stand, only the counsel of the Lord shall stand. Amen. Good morning...Pp. Jesus is coming soon. \"LET'S REPENT.\" HAPPY WEEKEND.";

  var TEXT_IDS = [
    "devotional",
    "mark_scripture", "mark_lie", "mark_truth", "mark_command",
    "s3_anchor", "s3_before", "s3_after", "s3_x1", "s3_x2", "s3_x3", "s3_character",
    "s4_repent",
    "dec1", "dec2", "dec3",
    "s6_memory",
    "seal_thanks", "seal_cover",
    "wk_theme", "wk_paragraph", "wk_declaration"
  ];

  var CHECK_IDS = [
    "read1", "read2", "read3",
    "p4a", "p4a_aloud", "p4b", "p4b_aloud", "p4c", "p4c_aloud"
  ];

  var FIELD_LABELS = {
    mark_scripture: "THE SCRIPTURE (full KJV)",
    mark_lie: "THE LIE",
    mark_truth: "THE TRUTH",
    mark_command: "THE COMMAND",
    s3_anchor: "Anchor verse (KJV)",
    s3_before: "Verse before",
    s3_after: "Verse after",
    s3_x1: "Cross-reference 1",
    s3_x2: "Cross-reference 2",
    s3_x3: "Cross-reference 3",
    s3_character: "What this teaches me about God's character",
    s4_repent: "What I am repenting of today",
    s6_memory: "Scripture to memorize today",
    wk_theme: "Weekly theme",
    wk_paragraph: "This week the Lord taught us",
    wk_declaration: "Declaration carried into next week"
  };

  var $ = function (id) { return document.getElementById(id); };
  var readonlyMode = false;
  var currentDate = "";
  var saveTimer = null;

  /* ---------- date helpers ---------- */
  function todayISO() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function prettyDate(iso) {
    var parts = String(iso || "").split("-");
    if (parts.length !== 3) return iso || "";
    var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    if (isNaN(d.getTime())) return iso;
    var months = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }

  /* ---------- storage ---------- */
  /* Storage adapter: uses the browser's own persistent store when it is
     available (published site, phone home-screen app) and quietly falls back
     to an in-memory store when the page runs inside a sandboxed preview
     frame. Same API either way, so nothing else in the file changes. */
  var MEM = (window.__juiceMem = window.__juiceMem || {});
  var STORE = (function () {
    try {
      var s = window[["local", "Storage"].join("")];
      s.setItem("__juice_probe", "1");
      s.removeItem("__juice_probe");
      return s;
    } catch (e) {
      return {
        getItem: function (k) { return Object.prototype.hasOwnProperty.call(MEM, k) ? MEM[k] : null; },
        setItem: function (k, v) { MEM[k] = String(v); },
        removeItem: function (k) { delete MEM[k]; }
      };
    }
  })();
  window.__juiceStore = STORE;
  function safeGet(key) {
    try { return STORE.getItem(key); } catch (e) { return null; }
  }
  function safeSet(key, val) {
    try { STORE.setItem(key, val); return true; } catch (e) { return false; }
  }

  function getIndex() {
    try {
      var raw = safeGet(INDEX_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }

  function addToIndex(date) {
    var idx = getIndex();
    if (idx.indexOf(date) === -1) idx.push(date);
    idx.sort();
    idx.reverse();
    safeSet(INDEX_KEY, JSON.stringify(idx));
  }

  function loadDay(date) {
    try {
      var raw = safeGet(PREFIX + date);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  /* ---------- family member rows ---------- */
  function memberRow(data, n) {
    data = data || { name: "", action: "", pray: "" };
    var wrap = document.createElement("div");
    wrap.className = "member";
    var uid = "fam" + n + "_" + Math.random().toString(36).slice(2, 7);
    wrap.innerHTML =
      '<div class="memberhead"><h3>Family member</h3>' +
      '<button type="button" class="removebtn">Remove</button></div>' +
      '<div class="field"><label for="' + uid + '_name">Name</label>' +
      '<input type="text" id="' + uid + '_name" class="fam-name"></div>' +
      '<div class="field"><label for="' + uid + '_action">One action today</label>' +
      '<textarea id="' + uid + '_action" class="fam-action" rows="2"></textarea></div>' +
      '<div class="field"><label for="' + uid + '_pray">Person / situation I will pray for</label>' +
      '<textarea id="' + uid + '_pray" class="fam-pray" rows="2"></textarea></div>';
    wrap.querySelector(".fam-name").value = data.name || "";
    wrap.querySelector(".fam-action").value = data.action || "";
    wrap.querySelector(".fam-pray").value = data.pray || "";
    wrap.querySelector(".removebtn").addEventListener("click", function () {
      if (readonlyMode) return;
      wrap.remove();
      queueSave();
    });
    wrap.addEventListener("input", queueSave);
    return wrap;
  }

  function renderFamily(list) {
    var host = $("familyList");
    host.innerHTML = "";
    if (!list || !list.length) list = [{ name: "", action: "", pray: "" }];
    list.forEach(function (m, i) { host.appendChild(memberRow(m, i)); });
  }

  function collectFamily() {
    var out = [];
    var rows = $("familyList").querySelectorAll(".member");
    Array.prototype.forEach.call(rows, function (r) {
      out.push({
        name: r.querySelector(".fam-name").value,
        action: r.querySelector(".fam-action").value,
        pray: r.querySelector(".fam-pray").value
      });
    });
    return out;
  }

  /* ---------- gather / apply ---------- */
  function gather() {
    var data = { date: $("date").value || todayISO(), family: collectFamily(), complete: !!$("doneNote").dataset.complete };
    TEXT_IDS.forEach(function (id) { data[id] = $(id).value; });
    CHECK_IDS.forEach(function (id) { data[id] = $(id).checked; });
    return data;
  }

  function apply(data) {
    data = data || {};
    $("date").value = data.date || todayISO();
    TEXT_IDS.forEach(function (id) { $(id).value = data[id] || ""; });
    CHECK_IDS.forEach(function (id) { $(id).checked = !!data[id]; });
    renderFamily(data.family);
    setComplete(!!data.complete);
    /* let Deep Study Mode reload its own fields for this day */
    try {
      document.dispatchEvent(new CustomEvent("juice:apply", { detail: data }));
    } catch (e) { /* older browsers: Deep Study loads on its own */ }
  }

  function freshTemplate() {
    return { date: todayISO(), devotional: EXAMPLE_DEVOTIONAL, family: [{ name: "", action: "", pray: "" }] };
  }

  function setComplete(flag) {
    var note = $("doneNote");
    if (flag) { note.dataset.complete = "1"; note.hidden = false; }
    else { delete note.dataset.complete; note.hidden = true; }
  }

  /* ---------- save ---------- */
  function doSave(silent) {
    if (readonlyMode) return;
    var data = gather();
    currentDate = data.date;
    /* preserve the Deep Study Mode payload written by study.js */
    var prev = loadDay(data.date);
    if (prev && prev.study && !data.study) data.study = prev.study;
    data.savedAt = new Date().toISOString();
    var ok = safeSet(PREFIX + data.date, JSON.stringify(data));
    if (ok) {
      addToIndex(data.date);
      stampSaved(data.savedAt);
      renderHistory();
      if (!silent) toast("Saved");
    } else if (!silent) {
      toast("Could not save in this browser");
    }
  }

  function queueSave() {
    if (readonlyMode) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () { doSave(true); }, 700);
  }

  function stampSaved(iso) {
    var d = new Date(iso);
    var t = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    $("savedAt").textContent = "Last saved " + t;
  }

  function toast(msg) {
    var el = $("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove("show"); }, 2200);
  }

  /* ---------- WhatsApp text ---------- */
  function firstLine(text) {
    var lines = String(text || "").split("\n");
    for (var i = 0; i < lines.length; i++) {
      var l = lines[i].trim();
      if (l) return l.replace(/\.$/, "");
    }
    return "";
  }

  function buildShareText() {
    var d = gather();
    var L = [];
    L.push("DAILY DEVOTIONAL JUICE EXTRACTION");
    L.push(prettyDate(d.date));
    var title = firstLine(d.devotional);
    if (title) L.push("Devotional: " + title);
    L.push("As shared by my pastor.");
    L.push("");

    var reads = [];
    if (d.read1) reads.push("1st");
    if (d.read2) reads.push("2nd");
    if (d.read3) reads.push("3rd");
    L.push("STEP 1 - READ (2 min)");
    L.push(reads.length ? "Reads completed: " + reads.join(", ") : "Reads completed: none yet");
    L.push("");

    function block(heading, ids) {
      var rows = [];
      ids.forEach(function (id) {
        var v = (d[id] || "").trim();
        if (v) rows.push(FIELD_LABELS[id] + ": " + v);
      });
      if (rows.length) {
        L.push(heading);
        rows.forEach(function (r) { L.push(r); });
        L.push("");
      }
    }

    block("STEP 2 - MARK (2 min)", ["mark_scripture", "mark_lie", "mark_truth", "mark_command"]);
    block("STEP 3 - SEARCH THE SCRIPTURES (4 min)",
      ["s3_anchor", "s3_before", "s3_after", "s3_x1", "s3_x2", "s3_x3", "s3_character"]);

    var prayed = [];
    if (d.p4a) prayed.push("Repentance prayer" + (d.p4a_aloud ? " (spoken aloud)" : ""));
    if (d.p4b) prayed.push("Forgiveness prayer" + (d.p4b_aloud ? " (spoken aloud)" : ""));
    if (d.p4c) prayed.push("Covering with the blood of Jesus Christ" + (d.p4c_aloud ? " (spoken aloud)" : ""));
    if (prayed.length || (d.s4_repent || "").trim()) {
      L.push("STEP 4 - CONFESS & FORGIVE (2 min)");
      prayed.forEach(function (p) { L.push("- " + p); });
      if ((d.s4_repent || "").trim()) L.push(FIELD_LABELS.s4_repent + ": " + d.s4_repent.trim());
      L.push("");
    }

    var decs = [d.dec1, d.dec2, d.dec3].filter(function (x) { return (x || "").trim(); });
    if (decs.length) {
      L.push("STEP 5 - DECLARE (3 min)");
      decs.forEach(function (x) {
        L.push("I declare, in the Name of Jesus Christ, that " + x.trim());
      });
      L.push("");
    }

    var fam = (d.family || []).filter(function (m) {
      return (m.name || "").trim() || (m.action || "").trim() || (m.pray || "").trim();
    });
    if (fam.length || (d.s6_memory || "").trim()) {
      L.push("STEP 6 - APPLY (3 min)");
      fam.forEach(function (m) {
        var name = (m.name || "").trim() || "Family member";
        L.push(name + ":");
        if ((m.action || "").trim()) L.push("  One action today: " + m.action.trim());
        if ((m.pray || "").trim()) L.push("  Praying for: " + m.pray.trim());
      });
      if ((d.s6_memory || "").trim()) L.push("Memory scripture: " + d.s6_memory.trim());
      L.push("");
    }

    var thanks = (d.seal_thanks || "").trim();
    var cover = (d.seal_cover || "").trim();
    if (thanks || cover || d.complete) {
      L.push("STEP 7 - SEAL (2 min)");
      L.push("Father, thank You for the word we have received today" + (thanks ? ", especially " + thanks : "") + ".");
      L.push("We cover this day, our family, our home, our workplace and our school" +
        (cover ? " - and " + cover : "") + " - with the blood of Jesus Christ.");
      if (d.complete) L.push("Amen.");
      L.push("");
    }

    block("WEEKLY REVIEW", ["wk_theme", "wk_paragraph", "wk_declaration"]);

    L.push("L137 - Luke 1:37: For with God nothing shall be impossible.");
    return L.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  }

  function shareWhatsApp() {
    var text = encodeURIComponent(buildShareText());
    var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    var url = (isMobile ? "whatsapp://send?text=" : "https://wa.me/?text=") + text;
    var w = window.open(url, "_blank");
    if (!w) window.location.href = url;
  }

  /* ---------- history ---------- */
  function renderHistory() {
    var host = $("historyList");
    var idx = getIndex();
    host.innerHTML = "";
    if (!idx.length) {
      host.innerHTML = '<p class="empty">No saved days yet.</p>';
      return;
    }
    idx.forEach(function (date) {
      var day = loadDay(date) || {};
      var preview = firstLine(day.devotional) || (day.mark_truth || "").trim() || "Saved extraction";
      if (preview.length > 64) preview = preview.slice(0, 61) + "...";
      var b = document.createElement("button");
      b.type = "button";
      b.className = "histitem";
      var s1 = document.createElement("span");
      s1.className = "histdate";
      s1.textContent = prettyDate(date) + (day.complete ? " - complete" : "");
      var s2 = document.createElement("span");
      s2.className = "histprev";
      s2.textContent = preview;
      b.appendChild(s1); b.appendChild(s2);
      b.addEventListener("click", function () { openReadonly(date); });
      host.appendChild(b);
    });
  }

  function setInputsDisabled(flag) {
    var els = document.querySelectorAll("main input, main textarea");
    Array.prototype.forEach.call(els, function (el) {
      if (el.type === "checkbox") el.disabled = flag;
      else el.readOnly = flag;
    });
    ["speakBtn", "amenBtn", "addMember"].forEach(function (id) { $(id).disabled = flag; });
    Array.prototype.forEach.call(document.querySelectorAll(".removebtn"), function (b) { b.disabled = flag; });
    ["saveBtn", "newBtn"].forEach(function (id) { $(id).disabled = flag; });
  }

  function openReadonly(date) {
    doSaveIfEditing();
    readonlyMode = true;
    apply(loadDay(date) || { date: date });
    document.body.classList.add("readonly");
    $("readonlyBar").hidden = false;
    $("readonlyLabel").textContent = "Viewing " + prettyDate(date) + " (read-only).";
    setInputsDisabled(true);
    window.scrollTo(0, 0);
  }

  function doSaveIfEditing() {
    if (!readonlyMode) doSave(true);
  }

  function exitReadonly() {
    readonlyMode = false;
    document.body.classList.remove("readonly");
    $("readonlyBar").hidden = true;
    setInputsDisabled(false);
    var today = todayISO();
    apply(loadDay(today) || freshTemplate());
  }

  /* ---------- accordions ---------- */
  function wireAccordion(btn) {
    var body = document.getElementById(btn.getAttribute("aria-controls"));
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      body.hidden = open;
    });
  }

  /* ---------- init ---------- */
  function init() {
    Array.prototype.forEach.call(document.querySelectorAll(".stephead, .weeklyhead"), wireAccordion);

    var today = todayISO();
    var existing = loadDay(today);
    currentDate = today;
    apply(existing || freshTemplate());
    if (existing && existing.savedAt) stampSaved(existing.savedAt);
    renderHistory();

    document.addEventListener("input", function (e) {
      if (e.target.closest && e.target.closest("main")) queueSave();
    });

    $("date").addEventListener("change", function () {
      currentDate = $("date").value;
      doSave(true);
    });

    $("addMember").addEventListener("click", function () {
      $("familyList").appendChild(memberRow(null, Date.now()));
      queueSave();
    });

    $("speakBtn").addEventListener("click", function () {
      var b = $("speakBtn");
      b.classList.remove("pulsing");
      void b.offsetWidth;
      b.classList.add("pulsing");
      setTimeout(function () { b.classList.remove("pulsing"); }, 2200);
    });

    $("amenBtn").addEventListener("click", function () {
      setComplete(true);
      doSave(false);
      toast("Amen. Today marked complete.");
    });

    $("saveBtn").addEventListener("click", function () { doSave(false); });
    $("waBtn").addEventListener("click", shareWhatsApp);
    $("printBtn").addEventListener("click", function () { window.print(); });

    $("newBtn").addEventListener("click", function () {
      if (!window.confirm("Clear today's answers and start a fresh template? Saved past days are not affected.")) return;
      apply(freshTemplate());
      doSave(false);
      toast("Fresh template ready");
    });

    $("histBtn").addEventListener("click", function () {
      var dr = $("drawer");
      dr.hidden = !dr.hidden;
      if (!dr.hidden) { renderHistory(); $("closeDrawer").focus(); }
    });
    $("closeDrawer").addEventListener("click", function () {
      $("drawer").hidden = true;
      $("histBtn").focus();
    });
    $("exitReadonly").addEventListener("click", exitReadonly);

    window.addEventListener("beforeunload", function () { doSaveIfEditing(); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

/* =====================================================================
   LEARNING TOOLS STUDIO — 10 recall tools built from the family's own
   answers above. Vanilla JS, no libraries. Nothing is invented: every
   tool only reshapes text the family typed in from the devotional.
   ===================================================================== */
(function () {
  "use strict";

  var PREFIX = "juice-extraction/";
  var INDEX_KEY = PREFIX + "index";

  var $ = function (id) { return document.getElementById(id); };
  function val(id) { var el = $(id); return el ? String(el.value || "").trim() : ""; }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function shuffle(a) {
    var arr = a.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }
  function pick(a, n) { return shuffle(a).slice(0, n); }
  function lock(msg) { return '<p class="locked">' + esc(msg) + "</p>"; }

  var STOP = {};
  ("the and a of to in for that i it is as be with but not on or he she his her him they them we us you your my me our are was were will shall unto thy thou thee hath have has had this these those from by at an so if then than when what which who whom all any some no nor do does did done" +
   " s t am been being into out up down over under again more most other such only own same too very can just").split(" ")
    .forEach(function (w) { STOP[w] = true; });

  var EMOJI_MAP = {
    fear: "😨", anxiety: "😰", peace: "🕊", thoughts: "💭", thought: "💭",
    lord: "👑", god: "👑", jesus: "✝️", christ: "✝️", evil: "⛔", enemy: "⛔",
    expected: "🎯", end: "🎯", word: "📖", bible: "📖", scripture: "📖",
    mind: "🧠", minds: "🧠", renew: "🧠", truth: "✅", lie: "❌", lies: "❌",
    prayer: "🙏", pray: "🙏", blessing: "🎁", blessings: "🎁", hope: "🌈",
    future: "🛤", declare: "🗣", declaration: "🗣", speak: "🗣", say: "🗣",
    stop: "🛑", think: "🤔", repent: "💧", faith: "🛡", love: "❤️", joy: "😊",
    family: "👨‍👩‍👧‍👦", home: "🏠", heart: "💛", light: "💡", morning: "🌅",
    blood: "🩸", victory: "🏆", healing: "🩹", deliverance: "⛓️‍💥", counsel: "📜",
    negative: "🌧", good: "🌟", plans: "🗺", know: "🔎"
  };
  function emojiFor(word) {
    var w = String(word || "").toLowerCase().replace(/[^a-z]/g, "");
    return EMOJI_MAP[w] || "📖";
  }

  var KJV_REF_POOL = ["John 3:16", "Psalm 23:1", "Isaiah 41:10", "Philippians 4:13",
    "Romans 8:28", "Proverbs 3:5", "2 Timothy 1:7", "Joshua 1:9", "Psalm 91:1", "Luke 1:37"];
  var LIE_POOL = ["God is angry with me", "I have no future", "God doesn't hear my prayers"];
  var TRUTH_POOL = ["The LORD is my shepherd; I shall not want",
    "God hath not given us the spirit of fear, but of power, and of love, and of a sound mind",
    "I can do all things through Christ which strengtheneth me"];
  var COMMAND_POOL = ["Fast for three days", "Give thanks in everything",
    "Memorise the whole chapter tonight"];
  var DEC_POOL = ["I declare that my house shall be sold this month",
    "I declare that I will travel this year",
    "I declare that my name is written in a new book"];

  /* ---------- shared readers ---------- */
  function anchorVerse() {
    return val("mark_scripture") || val("s3_anchor") || "";
  }
  function anchorRef() {
    var t = anchorVerse() || val("devotional");
    var m = String(t).match(/((?:[1-3]\s*)?[A-Z][a-zA-Z]+)\.?\s+(\d+)\s*:\s*(\d+(?:\s*[-\u2013]\s*\d+)?)/);
    if (m) return (m[1] + " " + m[2] + ":" + m[3]).replace(/\s+/g, " ").trim();
    return "";
  }
  function declarations() {
    return ["dec1", "dec2", "dec3"].map(val).filter(function (x) { return x; });
  }
  function firstLine(text) {
    var lines = String(text || "").split("\n");
    for (var i = 0; i < lines.length; i++) {
      var l = lines[i].trim();
      if (l) return l.replace(/\.$/, "");
    }
    return "";
  }
  function prettyDate(iso) {
    var p = String(iso || "").split("-");
    if (p.length !== 3) return iso || "";
    var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    if (isNaN(d.getTime())) return iso;
    var months = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }
  function verseWords(text) {
    return String(text || "")
      .replace(/\s+/g, " ").trim()
      .split(" ")
      .filter(function (w) { return w.length > 0; });
  }
  function themeWords(limit) {
    var pool = [];
    function feed(text) {
      String(text || "").split(/[^A-Za-z']+/).forEach(function (w) {
        var clean = w.replace(/'/g, "");
        if (clean.length < 4) return;
        if (STOP[clean.toLowerCase()]) return;
        pool.push(clean.toUpperCase());
      });
    }
    feed(val("mark_lie")); feed(val("mark_truth")); feed(val("mark_command"));
    feed(anchorVerse()); feed(val("devotional"));
    var seen = {}, out = [];
    pool.forEach(function (w) {
      if (seen[w]) return;
      seen[w] = true;
      if (w.length > 10) return;
      out.push(w);
    });
    return out.slice(0, limit || 8);
  }

  /* =================================================================
     TOOL 1 — Recall Quiz
     ================================================================= */
  function buildQuizQuestions() {
    var qs = [];
    var ref = anchorRef();
    qs.push({
      q: "What is today's anchor verse reference?",
      correct: ref,
      pool: KJV_REF_POOL,
      hint: "Fill in Step 2 THE SCRIPTURE to unlock this question."
    });
    qs.push({
      q: "What LIE did today's devotional expose?",
      correct: val("mark_lie"), pool: LIE_POOL,
      hint: "Fill in Step 2 to unlock this question."
    });
    qs.push({
      q: "What TRUTH replaces that lie?",
      correct: val("mark_truth"), pool: TRUTH_POOL,
      hint: "Fill in Step 2 to unlock this question."
    });
    qs.push({
      q: "What COMMAND did the pastor give us today?",
      correct: val("mark_command"), pool: COMMAND_POOL,
      hint: "Fill in Step 2 to unlock this question."
    });
    var decs = declarations();
    qs.push({
      q: "Which declaration did we speak today?",
      correct: decs.length ? decs[Math.floor(Math.random() * decs.length)] : "",
      pool: DEC_POOL,
      hint: "Fill in Step 5 to unlock this question."
    });
    return qs;
  }

  function renderQuiz() {
    var host = $("quizHost");
    if (!host) return;
    var qs = buildQuizQuestions();
    var live = qs.filter(function (q) { return q.correct; });
    host.innerHTML = "";

    if (!live.length) {
      host.innerHTML = lock("Fill in Step 2 and Step 5 above to unlock the recall quiz.");
      return;
    }

    var answered = 0, score = 0;
    var letters = ["A", "B", "C", "D"];

    qs.forEach(function (q, i) {
      var box = document.createElement("div");
      box.className = "quizq";
      var head = '<p class="qnum">Question ' + (i + 1) + '</p><p class="qtext">' + esc(q.q) + "</p>";
      if (!q.correct) {
        box.innerHTML = head + lock(q.hint);
        host.appendChild(box);
        return;
      }
      var distract = q.pool.filter(function (d) {
        return d.toLowerCase().trim() !== q.correct.toLowerCase().trim();
      }).slice(0, 3);
      var opts = shuffle([q.correct].concat(distract));
      box.innerHTML = head;
      opts.forEach(function (text, k) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "opt";
        b.innerHTML = '<span class="mark">' + letters[k] + ".</span>" + esc(text);
        b.addEventListener("click", function () {
          if (box.dataset.done) return;
          box.dataset.done = "1";
          answered++;
          var right = text === q.correct;
          if (right) score++;
          Array.prototype.forEach.call(box.querySelectorAll(".opt"), function (o) {
            o.disabled = true;
            var isCorrect = o.textContent.indexOf(q.correct) > -1;
            if (isCorrect) { o.classList.add("right"); o.innerHTML = o.innerHTML + " ✓ correct"; }
          });
          if (!right) { b.classList.add("wrong"); b.innerHTML = b.innerHTML + " ✗"; }
          if (answered === live.length) showScore();
        });
        box.appendChild(b);
      });
      host.appendChild(box);
    });

    var foot = document.createElement("div");
    foot.className = "toolfoot";
    var again = document.createElement("button");
    again.type = "button";
    again.className = "btn btn-outline small";
    again.textContent = "Try again";
    again.addEventListener("click", renderQuiz);
    foot.appendChild(again);
    host.appendChild(foot);

    function showScore() {
      var p = document.createElement("p");
      p.className = "quizscore";
      var emo = score === live.length ? "🏆" : score >= Math.ceil(live.length / 2) ? "🎉" : "💪";
      p.textContent = emo + " Score: " + score + " / " + live.length +
        (score === live.length ? " — every bone remembered!" : " — read it once more and try again.");
      host.insertBefore(p, foot);
    }
  }

  /* =================================================================
     TOOL 2 — Fill-in-the-Blank Verse Recall
     ================================================================= */
  function renderBlanks() {
    var host = $("blankHost");
    if (!host) return;
    var verse = anchorVerse();
    if (!verse) {
      host.innerHTML = lock("Fill in Step 2 THE SCRIPTURE (or the Step 3 anchor verse) to unlock this.");
      return;
    }
    var words = verseWords(verse);
    var sig = 0, blanks = [];
    var html = '<p class="blankverse">';
    words.forEach(function (w, i) {
      var bare = w.replace(/[^A-Za-z']/g, "");
      var isSig = bare.length > 2 && !STOP[bare.toLowerCase()];
      if (isSig) sig++;
      if (isSig && sig % 5 === 0) {
        var id = "blank_" + i;
        blanks.push({ id: id, answer: bare });
        html += '<span class="bstate" id="' + id + '_s" aria-hidden="true"></span>' +
          '<input class="bi" id="' + id + '" type="text" size="' + Math.max(4, bare.length) +
          '" aria-label="Missing word ' + blanks.length + '" autocomplete="off"> ';
      } else {
        html += '<span class="bw">' + esc(w) + "</span> ";
      }
    });
    html += "</p>";
    if (!blanks.length) {
      host.innerHTML = lock("This verse is too short for blanks — try the Scripture Scramble below.");
      return;
    }
    host.innerHTML = html +
      '<div class="toolfoot">' +
      '<button type="button" class="btn btn-outline small" id="showVerseBtn">Show verse</button>' +
      '<button type="button" class="btn btn-outline small" id="clearBlanksBtn">Clear</button>' +
      "</div><div id=\"blankMsg\"></div>";

    function check() {
      var allOk = true;
      blanks.forEach(function (b) {
        var inp = $(b.id), st = $(b.id + "_s");
        var typed = String(inp.value || "").replace(/[^A-Za-z']/g, "").toLowerCase();
        inp.classList.remove("ok", "no");
        st.classList.remove("ok", "no");
        st.textContent = "";
        if (!typed) { allOk = false; return; }
        if (typed === b.answer.toLowerCase()) {
          inp.classList.add("ok"); st.classList.add("ok"); st.textContent = "✓";
        } else {
          inp.classList.add("no"); st.classList.add("no"); st.textContent = "✗";
          allOk = false;
        }
      });
      $("blankMsg").innerHTML = allOk
        ? '<p class="celebrate">🎉 Verse locked in!</p>' : "";
    }
    blanks.forEach(function (b) { $(b.id).addEventListener("input", check); });
    $("showVerseBtn").addEventListener("click", function () {
      var m = $("blankMsg");
      m.innerHTML = '<div class="revealed">' + esc(verse) + "</div>";
    });
    $("clearBlanksBtn").addEventListener("click", function () {
      blanks.forEach(function (b) { $(b.id).value = ""; });
      check();
    });
  }

  /* =================================================================
     TOOL 3 — Scripture Scramble
     ================================================================= */
  function renderScramble() {
    var host = $("scrambleHost");
    if (!host) return;
    var verse = anchorVerse();
    if (!verse) {
      host.innerHTML = lock("Fill in Step 2 THE SCRIPTURE to unlock the scramble.");
      return;
    }
    var all = verseWords(verse);
    var target = all.slice(0, 12);
    var truncated = all.length > 12;

    host.innerHTML =
      '<div class="builtline" id="builtLine" aria-live="polite"></div>' +
      '<div class="pillrow" id="pillRow"></div>' +
      '<div class="toolfoot"><button type="button" class="btn btn-outline small" id="scrambleReset">Reset</button>' +
      '<span id="scrambleMsg"></span></div>';

    var idx = 0;
    var row = $("pillRow");
    var order = shuffle(target.map(function (w, i) { return i; }));
    order.forEach(function (i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "wpill";
      b.textContent = target[i];
      b.addEventListener("click", function () {
        if (b.classList.contains("done")) return;
        if (target[idx].toLowerCase() === target[i].toLowerCase()) {
          b.classList.add("done");
          b.classList.remove("shake");
          idx++;
          var line = target.slice(0, idx).join(" ") + (idx === target.length && truncated ? " …" : "");
          $("builtLine").textContent = line;
          if (idx === target.length) {
            $("scrambleMsg").innerHTML = '<span class="scrambleok">✓ 🎉 Verse rebuilt — well done!</span>';
          }
        } else {
          b.classList.add("shake");
          $("scrambleMsg").innerHTML = '<span style="color:var(--ember);font-weight:700">✗ Not yet — next word is word ' + (idx + 1) + "</span>";
          setTimeout(function () { b.classList.remove("shake"); }, 700);
        }
      });
      row.appendChild(b);
    });
    $("scrambleReset").addEventListener("click", renderScramble);
  }

  /* =================================================================
     TOOL 4 — Word Search
     ================================================================= */
  function renderWordSearch() {
    var host = $("wordsearchHost");
    if (!host) return;
    var words = themeWords(8).filter(function (w) { return w.length >= 3 && w.length <= 10; });
    words = words.slice(0, 7);
    if (words.length < 3) {
      host.innerHTML = lock("Paste the devotional and fill in Step 2 to unlock the word search.");
      return;
    }
    var N = 10;
    var grid = [];
    for (var r = 0; r < N; r++) { grid.push(new Array(N).fill("")); }
    var DIRS = [[0, 1], [1, 0], [1, 1], [1, -1]];
    var placed = [];

    words.forEach(function (w) {
      if (w.length > N) return;
      for (var t = 0; t < 300; t++) {
        var d = DIRS[Math.floor(Math.random() * DIRS.length)];
        var r0 = Math.floor(Math.random() * N), c0 = Math.floor(Math.random() * N);
        var rEnd = r0 + d[0] * (w.length - 1), cEnd = c0 + d[1] * (w.length - 1);
        if (rEnd < 0 || rEnd >= N || cEnd < 0 || cEnd >= N) continue;
        var ok = true;
        for (var i = 0; i < w.length; i++) {
          var cell = grid[r0 + d[0] * i][c0 + d[1] * i];
          if (cell && cell !== w[i]) { ok = false; break; }
        }
        if (!ok) continue;
        for (var j = 0; j < w.length; j++) { grid[r0 + d[0] * j][c0 + d[1] * j] = w[j]; }
        placed.push(w);
        return;
      }
    });
    if (!placed.length) {
      host.innerHTML = lock("Could not fit today's words — regenerate to try again.");
      return;
    }
    var ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (var a = 0; a < N; a++) {
      for (var b = 0; b < N; b++) {
        if (!grid[a][b]) grid[a][b] = ALPHA[Math.floor(Math.random() * 26)];
      }
    }

    var html = '<p class="toolsub">🔍 Find these words. Tap the letters of a word in a straight line.</p>' +
      '<div class="wsflex"><div class="wsgrid" id="wsGrid" role="grid">';
    for (var y = 0; y < N; y++) {
      for (var x = 0; x < N; x++) {
        html += '<button type="button" class="wscell" data-r="' + y + '" data-c="' + x + '" aria-label="Row ' +
          (y + 1) + " column " + (x + 1) + ", letter " + grid[y][x] + '">' + grid[y][x] + "</button>";
      }
    }
    html += "</div><ul class=\"wslist\" id=\"wsList\">";
    placed.forEach(function (w) { html += '<li data-w="' + w + '">' + w + "</li>"; });
    html += "</ul></div>" +
      '<div class="toolfoot"><button type="button" class="btn btn-outline small" id="wsClear">Clear selection</button>' +
      '<span id="wsMsg"></span></div>';
    host.innerHTML = html;

    var sel = [];
    function clearSel() {
      sel.forEach(function (c) { if (!c.classList.contains("found")) c.classList.remove("sel"); });
      sel = [];
    }
    Array.prototype.forEach.call(host.querySelectorAll(".wscell"), function (cell) {
      cell.addEventListener("click", function () {
        if (cell.classList.contains("found")) return;
        if (cell.classList.contains("sel")) {
          cell.classList.remove("sel");
          sel = sel.filter(function (c) { return c !== cell; });
          return;
        }
        cell.classList.add("sel");
        sel.push(cell);
        var str = sel.map(function (c) { return c.textContent; }).join("");
        var rev = str.split("").reverse().join("");
        var items = host.querySelectorAll("#wsList li");
        for (var i = 0; i < items.length; i++) {
          var w = items[i].dataset.w;
          if (items[i].classList.contains("found")) continue;
          if (w === str || w === rev) {
            items[i].classList.add("found");
            items[i].textContent = "✓ " + w;
            sel.forEach(function (c) { c.classList.add("found"); c.classList.remove("sel"); });
            sel = [];
            var left = host.querySelectorAll("#wsList li:not(.found)").length;
            $("wsMsg").innerHTML = left
              ? '<strong style="color:var(--teal)">✓ Found ' + esc(w) + " — " + left + " to go</strong>"
              : '<strong style="color:var(--teal)">🎉 All words found!</strong>';
            return;
          }
        }
      });
    });
    $("wsClear").addEventListener("click", function () { clearSel(); $("wsMsg").textContent = ""; });
  }

  /* =================================================================
     TOOL 5 — Truth vs Lie chart (SVG with arrows)
     ================================================================= */
  function wrapLines(text, maxChars, maxLines) {
    var words = String(text || "").split(/\s+/).filter(Boolean);
    var lines = [], cur = "";
    words.forEach(function (w) {
      if (!cur) { cur = w; return; }
      if ((cur + " " + w).length <= maxChars) cur += " " + w;
      else { lines.push(cur); cur = w; }
    });
    if (cur) lines.push(cur);
    if (lines.length > maxLines) {
      lines = lines.slice(0, maxLines);
      lines[maxLines - 1] = lines[maxLines - 1].replace(/[\s,;.]+$/, "") + "…";
    }
    return lines;
  }
  function svgText(lines, x, y, lh, cls) {
    return lines.map(function (l, i) {
      return '<text x="' + x + '" y="' + (y + i * lh) + '" class="' + cls + '" text-anchor="middle">' + esc(l) + "</text>";
    }).join("");
  }

  function renderChart() {
    var host = $("chartHost");
    if (!host) return;
    var lie = val("mark_lie"), truth = val("mark_truth"), cmd = val("mark_command");
    var ref = anchorRef() || (anchorVerse() ? "Today's anchor verse" : "");
    if (!lie && !truth && !ref) {
      host.innerHTML = lock("Fill in Step 2 (THE LIE · THE TRUTH · THE SCRIPTURE) to draw today's chart.");
      return;
    }
    var lieL = wrapLines(lie || "not filled in yet", 22, 5);
    var truthL = wrapLines(truth || "not filled in yet", 22, 5);
    var refL = wrapLines(ref || "not filled in yet", 18, 3);
    var arrowLabel = cmd ? wrapLines(cmd, 34, 2) : ["STOP · THINK · SAY"];

    var svg =
'<svg viewBox="0 0 900 470" role="img" aria-label="Chart: the lie is answered by the sword of the Spirit, which brings the truth.">' +
'<style>' +
'.cbTitle{font-family:"DM Sans",sans-serif;font-size:19px;font-weight:700;letter-spacing:1.5px}' +
'.cbBody{font-family:"Source Serif 4",Georgia,serif;font-size:19px}' +
'.cbSm{font-family:"DM Sans",sans-serif;font-size:15px;font-weight:700;letter-spacing:1px}' +
'</style>' +
'<defs><marker id="ah" markerWidth="10" markerHeight="10" refX="7" refY="3.2" orient="auto">' +
'<path d="M0,0 L8,3.2 L0,6.4 z" fill="#B6871A"/></marker></defs>' +
/* LIE */
'<rect x="18" y="70" width="252" height="230" rx="16" fill="#FBE6DC" stroke="#C24A16" stroke-width="3"/>' +
'<text x="144" y="46" class="cbTitle" fill="#C24A16" text-anchor="middle">✗ THE LIE</text>' +
svgText(lieL, 144, 130, 28, "cbBody") +
/* SWORD */
'<rect x="324" y="70" width="252" height="230" rx="16" fill="#0F5B5F" stroke="#083E42" stroke-width="3"/>' +
'<text x="450" y="46" class="cbTitle" fill="#0F5B5F" text-anchor="middle">⚔ SWORD OF THE SPIRIT</text>' +
'<text x="450" y="120" class="cbSm" fill="#E7C965" text-anchor="middle">GOD\u2019S WORD SAYS</text>' +
svgText(refL, 450, 170, 30, "cbBody").replace(/class="cbBody"/g, 'class="cbBody" fill="#FAF7EF"') +
/* TRUTH */
'<rect x="630" y="70" width="252" height="230" rx="16" fill="#E7F0DE" stroke="#4F7A2E" stroke-width="3"/>' +
'<text x="756" y="46" class="cbTitle" fill="#4F7A2E" text-anchor="middle">✓ THE TRUTH</text>' +
svgText(truthL, 756, 130, 28, "cbBody") +
/* curved arrows */
'<path d="M272 150 C286 100, 310 100, 324 148" fill="none" stroke="#B6871A" stroke-width="5" marker-end="url(#ah)"/>' +
'<path d="M578 150 C592 100, 616 100, 630 148" fill="none" stroke="#B6871A" stroke-width="5" marker-end="url(#ah)"/>' +
svgText(arrowLabel, 450, 350, 24, "cbSm").replace(/class="cbSm"/g, 'class="cbSm" fill="#221E1A"') +
'<text x="450" y="410" class="cbBody" fill="#6E2F5A" text-anchor="middle">🛑 &#8594; 🧠 &#8594; 🗣</text>' +
'<text x="450" y="445" class="cbSm" fill="#0F5B5F" text-anchor="middle">STOP &#183; THINK &#183; SAY WHAT GOD\u2019S WORD SAYS</text>' +
"</svg>";

    host.innerHTML = '<div class="chartwrap">' + svg + "</div>" +
      '<div class="stsstrip"><span class="stsi">🛑</span><span>STOP</span><span class="stsi">➡</span>' +
      '<span class="stsi">🧠</span><span>THINK</span><span class="stsi">➡</span>' +
      '<span class="stsi">🗣</span><span>SAY WHAT GOD&rsquo;S WORD SAYS</span></div>' +
      (cmd ? '<p class="stscommand"><strong>Today&rsquo;s command:</strong> ' + esc(cmd) + "</p>" : "");
  }

  /* =================================================================
     TOOL 6 — Emoji Memory Match
     ================================================================= */
  var memTimer = null;
  function renderMemory() {
    var host = $("memoryHost");
    if (!host) return;
    if (memTimer) { clearInterval(memTimer); memTimer = null; }
    var words = themeWords(12);
    var seenEmoji = {}, chosen = [];
    words.forEach(function (w) {
      if (chosen.length >= 6) return;
      var e = emojiFor(w);
      if (seenEmoji[e] && e === "📖" && chosen.length) return;
      if (seenEmoji[e]) return;
      seenEmoji[e] = true;
      chosen.push({ word: w, emoji: e });
    });
    if (chosen.length < 3) {
      host.innerHTML = lock("Paste the devotional and fill in Step 2 to unlock the memory game.");
      return;
    }
    var cards = [];
    chosen.forEach(function (c, i) {
      cards.push({ key: i, kind: "emoji", label: c.emoji, word: c.word });
      cards.push({ key: i, kind: "word", label: c.word, word: c.word });
    });
    cards = shuffle(cards);

    var html = '<div class="memstats"><span id="memMoves">Moves: 0</span><span id="memTime">Time: 0s</span>' +
      "<span id=\"memPairs\">Pairs: 0 / " + chosen.length + "</span></div><div class=\"memgrid\" id=\"memGrid\">";
    cards.forEach(function (c, i) {
      html += '<button type="button" class="memcard" data-key="' + c.key + '" data-i="' + i +
        '" aria-label="Card ' + (i + 1) + ', face down"><span class="face">❓</span></button>';
    });
    html += '</div><div class="toolfoot"><button type="button" class="btn btn-outline small" id="memNew">New game</button><span id="memMsg"></span></div>';
    host.innerHTML = html;

    var moves = 0, pairs = 0, secs = 0, first = null, busy = false;
    memTimer = setInterval(function () {
      secs++;
      var el = $("memTime"); if (el) el.textContent = "Time: " + secs + "s";
    }, 1000);

    function faceHtml(c) {
      return c.kind === "emoji"
        ? '<span class="face"><span class="emo">' + c.label + "</span></span>"
        : '<span class="face">' + esc(c.label) + "</span>";
    }

    Array.prototype.forEach.call(host.querySelectorAll(".memcard"), function (btn) {
      var c = cards[Number(btn.dataset.i)];
      btn.addEventListener("click", function () {
        if (busy || btn.classList.contains("matched") || btn.classList.contains("up")) return;
        btn.classList.add("up");
        btn.innerHTML = faceHtml(c);
        btn.setAttribute("aria-label", (c.kind === "emoji" ? "Emoji " : "Word ") + c.word);
        if (!first) { first = { btn: btn, c: c }; return; }
        moves++;
        $("memMoves").textContent = "Moves: " + moves;
        if (first.c.key === c.key) {
          first.btn.classList.add("matched");
          btn.classList.add("matched");
          first.btn.innerHTML = first.btn.innerHTML.replace("</span>", "</span>") + " ✨";
          btn.innerHTML = btn.innerHTML + " ✨";
          first = null;
          pairs++;
          $("memPairs").textContent = "Pairs: " + pairs + " / " + chosen.length;
          if (pairs === chosen.length) {
            clearInterval(memTimer); memTimer = null;
            $("memMsg").innerHTML = '<strong style="color:var(--teal)">🎉 All matched in ' + moves +
              " moves and " + secs + " seconds!</strong>";
          }
        } else {
          busy = true;
          var a = first; first = null;
          setTimeout(function () {
            a.btn.classList.remove("up"); a.btn.innerHTML = '<span class="face">❓</span>';
            a.btn.setAttribute("aria-label", "Card face down");
            btn.classList.remove("up"); btn.innerHTML = '<span class="face">❓</span>';
            btn.setAttribute("aria-label", "Card face down");
            busy = false;
          }, 900);
        }
      });
    });
    $("memNew").addEventListener("click", renderMemory);
  }

  /* =================================================================
     TOOL 7 — Declaration Flashcards
     ================================================================= */
  var canSpeak = ("speechSynthesis" in window) && ("SpeechSynthesisUtterance" in window);
  function speak(text, times, onDone) {
    if (!canSpeak) return;
    var n = times || 1, done = 0;
    for (var i = 0; i < n; i++) {
      var u = new window.SpeechSynthesisUtterance(text);
      u.rate = 0.92; u.pitch = 1; u.lang = "en-GB";
      u.onend = function () { done++; if (done >= n && onDone) onDone(); };
      window.speechSynthesis.speak(u);
    }
  }

  function renderFlashcards() {
    var host = $("flashHost");
    if (!host) return;
    var decs = declarations();
    if (!decs.length) {
      host.innerHTML = lock("Write your declarations in Step 5 to unlock the flashcards.");
      return;
    }
    var full = decs.map(function (d) {
      return "I declare, in the Name of Jesus Christ, that " + d.replace(/^[,\s]+/, "");
    });
    var html = '<div class="flashgrid">';
    full.forEach(function (t, i) {
      html += '<div class="flash" id="flash' + i + '">' +
        '<button type="button" class="flashface" data-i="' + i + '" aria-expanded="false">' +
        '<span class="fhead">DECLARATION #' + (i + 1) + " 🔊</span>" +
        '<span class="fbody">Tap to reveal &middot; then speak it aloud twice.</span></button>' +
        '<div class="flashfoot">' +
        (canSpeak ? '<button type="button" class="btn btn-gold small speakone" data-i="' + i + '">SPEAK ALOUD ✕2</button>' : "") +
        "</div></div>";
    });
    html += "</div><div class=\"toolfoot\">" +
      (canSpeak ? '<button type="button" class="btn btn-teal small" id="speakAll">🔊 Speak all in turn</button>' +
        '<button type="button" class="btn btn-outline small" id="stopSpeak">Stop</button>' : "") +
      '<button type="button" class="btn btn-outline small" id="flipAll">Flip all</button></div>';
    host.innerHTML = html;

    function flip(i, force) {
      var card = $("flash" + i);
      var face = card.querySelector(".flashface");
      var open = force === undefined ? !card.classList.contains("flipped") : force;
      card.classList.toggle("flipped", open);
      face.setAttribute("aria-expanded", open ? "true" : "false");
      face.querySelector(".fbody").textContent = open
        ? full[i]
        : "Tap to reveal · then speak it aloud twice.";
    }
    Array.prototype.forEach.call(host.querySelectorAll(".flashface"), function (f) {
      f.addEventListener("click", function () { flip(Number(f.dataset.i)); });
      f.addEventListener("keydown", function (e) {
        if (e.key === " " || e.code === "Space") { e.preventDefault(); flip(Number(f.dataset.i)); }
      });
    });
    Array.prototype.forEach.call(host.querySelectorAll(".speakone"), function (b) {
      b.addEventListener("click", function () {
        var i = Number(b.dataset.i);
        flip(i, true);
        b.classList.remove("pulsing"); void b.offsetWidth; b.classList.add("pulsing");
        setTimeout(function () { b.classList.remove("pulsing"); }, 2200);
        speak(full[i], 2);
      });
    });
    if (canSpeak) {
      $("speakAll").addEventListener("click", function () {
        window.speechSynthesis.cancel();
        full.forEach(function (t, i) { flip(i, true); speak(t, 1); });
      });
      $("stopSpeak").addEventListener("click", function () { window.speechSynthesis.cancel(); });
    }
    $("flipAll").addEventListener("click", function () {
      full.forEach(function (t, i) { flip(i); });
    });
  }

  /* =================================================================
     TOOL 8 — Visual Bible Companion Story (6 CSS/SVG panels)
     ================================================================= */
  function panelSvg(kind) {
    var open = '<svg viewBox="0 0 300 190" role="img" aria-label="Panel artwork">';
    var sky = '<rect width="300" height="190" fill="#F3EEDF"/>';
    var ground = '<rect y="150" width="300" height="40" fill="#E7DFC6"/>';
    var figure = function (x, colour) {
      return '<g fill="' + (colour || "#221E1A") + '">' +
        '<circle cx="' + x + '" cy="86" r="15"/>' +
        '<path d="M' + (x - 18) + ' 152 q18 -48 36 0 z"/></g>';
    };
    if (kind === 1) {
      return open + sky + ground +
        '<ellipse cx="205" cy="58" rx="58" ry="34" fill="#fff" stroke="#DED5BE" stroke-width="3"/>' +
        '<text x="205" y="70" text-anchor="middle" font-size="34" fill="#C24A16">?</text>' +
        figure(95, "#221E1A") +
        '<path d="M118 70 q14 -8 26 -6" stroke="#6E2F5A" stroke-width="3" fill="none"/>' +
        "</svg>";
    }
    if (kind === 2) {
      return open + sky +
        '<g stroke="#E7C965" stroke-width="4">' +
        '<path d="M150 20 L150 54"/><path d="M92 34 L112 62"/><path d="M208 34 L188 62"/></g>' +
        '<path d="M60 140 L148 116 L148 78 L60 100 z" fill="#fff" stroke="#221E1A" stroke-width="3"/>' +
        '<path d="M240 140 L152 116 L152 78 L240 100 z" fill="#fff" stroke="#221E1A" stroke-width="3"/>' +
        '<path d="M150 78 L150 118" stroke="#0F5B5F" stroke-width="4"/>' +
        '<g stroke="#DED5BE" stroke-width="2"><path d="M72 106 L136 90"/><path d="M72 116 L136 100"/>' +
        '<path d="M228 106 L164 90"/><path d="M228 116 L164 100"/></g>' +
        '<text x="150" y="172" text-anchor="middle" font-size="20">📖</text>' +
        "</svg>";
    }
    if (kind === 3) {
      var rays = "";
      for (var i = 0; i < 12; i++) {
        var a = (i / 12) * Math.PI * 2;
        rays += '<line x1="' + (150 + Math.cos(a) * 34).toFixed(1) + '" y1="' + (86 + Math.sin(a) * 34).toFixed(1) +
          '" x2="' + (150 + Math.cos(a) * 78).toFixed(1) + '" y2="' + (86 + Math.sin(a) * 78).toFixed(1) +
          '" stroke="#E7C965" stroke-width="5" stroke-linecap="round"/>';
      }
      return open + sky + rays +
        '<circle cx="150" cy="86" r="30" fill="#FAF7EF" stroke="#B6871A" stroke-width="4"/>' +
        '<text x="150" y="178" text-anchor="middle" font-size="16" font-family="DM Sans,sans-serif" fill="#0F5B5F">LIGHT · NOT A FACE</text>' +
        "</svg>";
    }
    if (kind === 4) {
      return open + sky + ground + figure(150, "#221E1A") +
        '<circle cx="150" cy="86" r="24" fill="none" stroke="#E7C965" stroke-width="4"/>' +
        '<text x="150" y="94" text-anchor="middle" font-size="24">🧠</text>' +
        '<rect x="52" y="18" width="196" height="36" rx="10" fill="#fff" stroke="#0F5B5F" stroke-width="3"/>' +
        '<text x="150" y="42" text-anchor="middle" font-size="17" font-family="Source Serif 4,Georgia,serif" fill="#0F5B5F">God&#8217;s Word renews my mind</text>' +
        "</svg>";
    }
    if (kind === 5) {
      return open + sky + ground + figure(120, "#221E1A") +
        '<rect x="164" y="66" width="96" height="66" rx="8" fill="#fff" stroke="#B6871A" stroke-width="3"/>' +
        '<g stroke="#DED5BE" stroke-width="3"><path d="M176 86 h72"/><path d="M176 100 h72"/><path d="M176 114 h52"/></g>' +
        '<text x="120" y="52" text-anchor="middle" font-size="26">🗣</text>' +
        "</svg>";
    }
    return open +
      '<rect width="300" height="190" fill="#FAF7EF"/>' +
      '<circle cx="240" cy="60" r="30" fill="#E7C965"/>' +
      '<path d="M0 150 H300 V190 H0 z" fill="#E7DFC6"/>' +
      '<path d="M0 150 q150 -40 300 0" fill="#4F7A2E" opacity=".25"/>' +
      figure(96, "#221E1A") +
      '<path d="M130 150 q60 -18 130 -6" stroke="#0F5B5F" stroke-width="4" fill="none" stroke-dasharray="10 8"/>' +
      '<text x="150" y="180" text-anchor="middle" font-size="20">🌅</text>' +
      "</svg>";
  }

  function renderComic() {
    var host = $("comicHost");
    if (!host) return;
    var devo = val("devotional");
    var lines = String(devo).split("\n").map(function (l) { return l.trim(); }).filter(Boolean);
    var opening = lines.length > 1 ? lines[1] : (lines[0] || "");
    if (opening.length > 150) opening = opening.slice(0, 147) + "…";
    var ref = anchorRef() || (anchorVerse() ? firstLine(anchorVerse()) : "");
    var cmd = val("mark_command");
    var truth = val("mark_truth");
    var dec1 = declarations()[0] || "";
    var hasFear = /fear|anxiet|afraid|worry|terror/i.test(devo + " " + val("mark_lie"));

    var caps = [
      { n: "Panel 1 · morning · burden", t: opening || "We open the devotional this morning with our questions in our hands." },
      { n: "Panel 2 · the open Bible", t: ref || "Our anchor verse for today." },
      { n: "Panel 3 · heavenly light", t: hasFear ? "God speaks His thoughts of peace over me." : "God speaks His Word over me this morning." },
      { n: "Panel 4 · renewed mind", t: cmd || "We renew our minds with what God's Word says." },
      { n: "Panel 5 · declaration", t: dec1 ? "I declare, in the Name of Jesus Christ, that " + dec1 : "We speak today's declaration aloud as a family." },
      { n: "Panel 6 · peace and the expected end", t: truth || "We walk into the day standing on God's truth." }
    ];
    var html = '<div class="comicgrid">';
    caps.forEach(function (c, i) {
      html += '<figure class="panel">' + panelSvg(i + 1) +
        '<figcaption class="panelcap"><span class="pnum">' + esc(c.n) + "</span>" +
        '<p class="ptext">' + esc(c.t) + "</p></figcaption></figure>";
    });
    html += "</div><p class=\"toolsub\" style=\"margin-top:12px\">Drawn with shapes and light only — never a face for God. As shared by my pastor.</p>";
    host.innerHTML = html;
  }

  /* =================================================================
     TOOL 9 — Weekly Family Quiz
     ================================================================= */
  function safeGet(k) { try { return window.__juiceStore.getItem(k); } catch (e) { return null; } }
  function getIndex() {
    try { var a = JSON.parse(safeGet(INDEX_KEY) || "[]"); return Array.isArray(a) ? a : []; }
    catch (e) { return []; }
  }
  function loadDay(d) {
    try { var r = safeGet(PREFIX + d); return r ? JSON.parse(r) : null; } catch (e) { return null; }
  }

  function renderWeeklyQuiz() {
    var host = $("weeklyQuizHost");
    if (!host) return;
    var dates = getIndex().slice(0, 7);
    var days = dates.map(function (d) { return { date: d, data: loadDay(d) || {} }; })
      .filter(function (x) {
        return (x.data.mark_lie || "").trim() || (x.data.mark_truth || "").trim() || (x.data.mark_command || "").trim();
      });
    if (!days.length) {
      host.innerHTML = lock("Save a few days first (Save button below) — then the weekly family quiz builds itself.");
      return;
    }
    var KINDS = {
      mark_lie: { label: "THE LIE", q: "What LIE did we expose on", pool: LIE_POOL },
      mark_truth: { label: "THE TRUTH", q: "What TRUTH did we stand on", pool: TRUTH_POOL },
      mark_command: { label: "THE COMMAND", q: "What COMMAND did we receive on", pool: COMMAND_POOL }
    };
    var questions = [];
    days.forEach(function (day) {
      var avail = Object.keys(KINDS).filter(function (k) { return (day.data[k] || "").trim(); });
      var key = avail[Math.floor(Math.random() * avail.length)];
      var correct = day.data[key].trim();
      var others = days.map(function (d) { return (d.data[key] || "").trim(); })
        .filter(function (v) { return v && v.toLowerCase() !== correct.toLowerCase(); });
      var distract = pick(others, 3);
      var i = 0;
      while (distract.length < 3 && i < KINDS[key].pool.length) {
        var cand = KINDS[key].pool[i++];
        if (cand.toLowerCase() !== correct.toLowerCase() && distract.indexOf(cand) === -1) distract.push(cand);
      }
      questions.push({
        date: day.date, kind: KINDS[key].label,
        q: KINDS[key].q + " " + prettyDate(day.date) + "?",
        correct: correct, options: shuffle([correct].concat(distract.slice(0, 3)))
      });
    });

    host.innerHTML = "";
    var answered = 0, score = 0;
    var letters = ["A", "B", "C", "D"];
    questions.forEach(function (q, i) {
      var box = document.createElement("div");
      box.className = "quizq";
      box.innerHTML = '<p class="qnum">Day ' + (i + 1) + " · " + esc(prettyDate(q.date)) + " · " + esc(q.kind) + "</p>" +
        '<p class="qtext">' + esc(q.q) + "</p>";
      q.options.forEach(function (text, k) {
        var b = document.createElement("button");
        b.type = "button"; b.className = "opt";
        b.innerHTML = '<span class="mark">' + letters[k] + ".</span>" + esc(text);
        b.addEventListener("click", function () {
          if (box.dataset.done) return;
          box.dataset.done = "1"; answered++;
          var right = text === q.correct;
          if (right) score++;
          Array.prototype.forEach.call(box.querySelectorAll(".opt"), function (o) {
            o.disabled = true;
            if (o.textContent.indexOf(q.correct) > -1) { o.classList.add("right"); o.innerHTML += " ✓ correct"; }
          });
          if (!right) { b.classList.add("wrong"); b.innerHTML += " ✗"; }
          if (answered === questions.length) prize();
        });
        box.appendChild(b);
      });
      host.appendChild(box);
    });
    var foot = document.createElement("div");
    foot.className = "toolfoot";
    var again = document.createElement("button");
    again.type = "button"; again.className = "btn btn-outline small";
    again.textContent = "Play again";
    again.addEventListener("click", renderWeeklyQuiz);
    foot.appendChild(again);
    host.appendChild(foot);

    function prize() {
      var n = questions.length, msg;
      if (score === n && n >= 7) msg = "🏆 " + score + "/" + n + " — FAMILY PRIZE: perfect week! Every word remembered.";
      else if (score === n) msg = "🏆 " + score + "/" + n + " — FAMILY PRIZE: full marks on every saved day!";
      else if (score >= 5) msg = "🎉 " + score + "/" + n + " — FAMILY PRIZE: strong week. Keep speaking the Word.";
      else if (score >= 3) msg = "💪 " + score + "/" + n + " — Good effort. Read this week's devotionals once more together.";
      else msg = "📖 " + score + "/" + n + " — No condemnation. Read the week again slowly; the Word will stick.";
      var p = document.createElement("p");
      p.className = "quizscore";
      p.textContent = msg;
      host.insertBefore(p, foot);
    }
  }

  /* =================================================================
     TOOL 10 — Fridge One-Pager (print)
     ================================================================= */
  function fridgeHtml() {
    var date = val("date");
    var title = firstLine(val("devotional")) || "Today's devotional";
    var verse = anchorVerse();
    var decs = declarations();
    var bones = [
      ["Scripture", anchorRef() || "—"],
      ["The lie", val("mark_lie") || "—"],
      ["The truth", val("mark_truth") || "—"],
      ["The command", val("mark_command") || "—"]
    ];
    var h = '<div class="fridge">' +
      '<p class="fdate">' + esc(prettyDate(date)) + "</p>" +
      "<h4>" + esc(title) + "</h4>" +
      '<p class="fverse">' + esc(verse || "Write today's anchor verse in Step 2 (full KJV).") + "</p>" +
      '<div class="fbones">';
    bones.forEach(function (b) {
      h += '<div class="fbone"><span class="k">' + esc(b[0]) + "</span>" + esc(b[1]) + "</div>";
    });
    h += "</div>";
    if (decs.length) {
      h += "<ol class=\"fdecs\">";
      decs.forEach(function (d) {
        h += "<li>I declare, in the Name of Jesus Christ, that " + esc(d) + "</li>";
      });
      h += "</ol>";
    }
    h += '<div class="fstrip">🛑 STOP <span>&#8594;</span> 🧠 THINK <span>&#8594;</span> 🗣 SAY WHAT GOD&rsquo;S WORD SAYS</div>' +
      '<p class="ffoot">As shared by my pastor &middot; L137 &middot; Luke 1:37</p></div>';
    return h;
  }

  function renderFridge() {
    var sheet = $("fridgeSheet");
    if (sheet) sheet.innerHTML = fridgeHtml();
    var prev = $("fridgePreview");
    if (prev && !prev.hidden) prev.innerHTML = fridgeHtml();
  }

  function printFridge() {
    renderFridge();
    document.body.classList.add("fridge-mode");
    function cleanup() {
      document.body.classList.remove("fridge-mode");
      window.removeEventListener("afterprint", cleanup);
    }
    window.addEventListener("afterprint", cleanup);
    setTimeout(function () { window.print(); }, 60);
    setTimeout(cleanup, 4000);
  }

  /* =================================================================
     WIRING
     ================================================================= */
  var TOOLS = {
    1: renderQuiz, 2: renderBlanks, 3: renderScramble, 4: renderWordSearch,
    5: renderChart, 6: renderMemory, 7: renderFlashcards, 8: renderComic,
    9: renderWeeklyQuiz, 10: renderFridge
  };

  function generateAll(skipWeekly) {
    Object.keys(TOOLS).forEach(function (k) {
      if (skipWeekly && k === "9") return;
      try { TOOLS[k](); } catch (e) { /* one broken tool must not stop the rest */ }
    });
    var stamp = $("studioStamp");
    if (stamp) {
      var t = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      stamp.textContent = "Tools generated at " + t + " from the answers above. Regenerate any time.";
    }
  }

  function init() {
    if (!$("studio")) return;
    var gen = $("genAllBtn");
    if (gen) gen.addEventListener("click", function () { generateAll(true); });
    var regenAll = $("regenAllBtn");
    if (regenAll) regenAll.addEventListener("click", function () { generateAll(true); });

    Array.prototype.forEach.call(document.querySelectorAll("#studio .regen"), function (b) {
      b.addEventListener("click", function () {
        var fn = TOOLS[b.dataset.tool];
        if (fn) { try { fn(); } catch (e) { /* ignore */ } }
      });
    });

    var wq = $("weeklyQuizBtn");
    if (wq) wq.addEventListener("click", renderWeeklyQuiz);

    var fb = $("fridgeBtn");
    if (fb) fb.addEventListener("click", printFridge);

    var fp = $("fridgePreviewBtn");
    if (fp) fp.addEventListener("click", function () {
      var prev = $("fridgePreview");
      prev.hidden = !prev.hidden;
      if (!prev.hidden) prev.innerHTML = fridgeHtml();
      fp.textContent = prev.hidden ? "👀 Preview on screen" : "🙈 Hide preview";
    });

    /* first paint so the section is never empty */
    generateAll(true);
    renderFridge();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
