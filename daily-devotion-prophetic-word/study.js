/* =====================================================================
   DEEP STUDY MODE (12 layers) · GOLDEN PAGE · GROWING LIBRARY ·
   MINISTRY SEQUENCE
   Vanilla JS. Everything the family types is saved into the same daily
   daily record: juice-extraction/<YYYY-MM-DD> under .study
   Libraries:      juice-library/<tab>
   Golden Pages:   golden-pages/<YYYY-MM-DD>  (+ golden-pages/index)
   Nothing is invented — every tool only reshapes what the family typed
   in from the pastor's devotional. As shared by my pastor.
   ===================================================================== */
(function () {
  "use strict";

  var PREFIX = "juice-extraction/";
  var INDEX_KEY = PREFIX + "index";
  var LIB = "juice-library/";
  var GOLD = "golden-pages/";
  var GOLD_INDEX = GOLD + "index";

  var $ = function (id) { return document.getElementById(id); };
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function store() { return window.__juiceStore; }
  function safeGet(k) { try { return store().getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { store().setItem(k, v); return true; } catch (e) { return false; } }
  function jget(k, fallback) {
    try { var r = safeGet(k); return r ? JSON.parse(r) : fallback; } catch (e) { return fallback; }
  }
  function todayISO() {
    var d = new Date(), m = String(d.getMonth() + 1).padStart(2, "0"), day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
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
  function fval(id) { var el = $(id); return el ? String(el.value || "").trim() : ""; }
  function dateVal() { return fval("date") || todayISO(); }
  function firstLine(t) {
    var lines = String(t || "").split("\n");
    for (var i = 0; i < lines.length; i++) { if (lines[i].trim()) return lines[i].trim().replace(/\.$/, ""); }
    return "";
  }
  function anchorRef() {
    var t = fval("mark_scripture") || fval("s3_anchor") || fval("devotional");
    var m = String(t).match(/((?:[1-3]\s*)?[A-Z][a-zA-Z]+)\.?\s+(\d+)\s*:\s*(\d+(?:\s*[-\u2013]\s*\d+)?)/);
    return m ? (m[1] + " " + m[2] + ":" + m[3]).replace(/\s+/g, " ").trim() : "";
  }
  function anchorVerse() { return fval("mark_scripture") || fval("s3_anchor"); }
  function toast(msg) {
    var el = $("toast");
    if (!el) { return; }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._t2);
    el._t2 = setTimeout(function () { el.classList.remove("show"); }, 2200);
  }

  var STOP = {};
  ("the and a of to in for that i it is as be with but not on or he she his her him they them we us you your my me our are was were will shall unto thy thou thee hath have has had this these those from by at an so if then than when what which who whom all any some no nor do does did done been being into out up down over under again more most other such only own same too very can just about there their would could should also every each because" +
   " s t am said say says one two now day today morning good great little much many well come came go went know knew like time thing things people man men woman women life").split(" ")
    .forEach(function (w) { STOP[w] = true; });

  /* =================================================================
     LIBRARY TABS
     ================================================================= */
  var TABS = [
    { id: "promises", label: "\uD83D\uDCD6 Promises of God" },
    { id: "warfare", label: "\u2694\uFE0F Spiritual Warfare Scriptures" },
    { id: "prayers", label: "\uD83D\uDE4F Prayers" },
    { id: "declarations", label: "\uD83D\uDCE2 Declarations" },
    { id: "character", label: "\u2764\uFE0F The Character of God" },
    { id: "christ", label: "\u271D\uFE0F The Life and Teachings of Christ" },
    { id: "spirit", label: "\uD83D\uDD4A\uFE0F The Work of the Holy Spirit" },
    { id: "characters", label: "\uD83D\uDC64 Bible Character Studies" },
    { id: "words", label: "\uD83D\uDCDA Hebrew and Greek Word Studies" },
    { id: "maps", label: "\uD83D\uDDFA\uFE0F Maps and Historical Background" },
    { id: "quotes", label: "\uD83D\uDC8E Favorite Quotes from the Devotions" },
    { id: "testimonies", label: "\uD83C\uDF31 Personal Testimonies and Answered Prayers" }
  ];
  var activeTab = TABS[0].id;

  function libGet(tab) { var a = jget(LIB + tab, []); return Array.isArray(a) ? a : []; }
  function libAdd(tab, text, note) {
    text = String(text || "").trim();
    if (!text) { toast("Nothing to send yet — write something first."); return false; }
    var arr = libGet(tab);
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].text === text) { toast("Already in the library."); return false; }
    }
    arr.unshift({ text: text, note: note || "", date: dateVal(), added: new Date().toISOString() });
    safeSet(LIB + tab, JSON.stringify(arr));
    var t = TABS.filter(function (x) { return x.id === tab; })[0];
    toast("Sent to " + (t ? t.label.replace(/^\S+\s/, "") : tab));
    if ($("libList")) renderLibrary();
    return true;
  }
  function libRemove(tab, idx) {
    var arr = libGet(tab);
    arr.splice(idx, 1);
    safeSet(LIB + tab, JSON.stringify(arr));
    renderLibrary();
  }

  /* =================================================================
     STUDY MODEL
     ================================================================= */
  function defaultStudy() {
    return {
      l1_main: "", l1_emphasis: "",
      l2_before: "", l2_after: "", l2_chapter: "", l2_why: "", l2_speaker: "", l2_listener: "", l2_happening: "",
      words: [],
      chain: [],
      doctrines: {}, customDoctrines: [],
      l6_text: "", l6_attrs: [],
      l7_where: "", l7_attitudes: "", l7_fears: "", l7_lies: "",
      l8: { home: "", work: "", ministry: "", prayer: "", family: "", finances: "" },
      l9_prayer: "", l9_paras: [],
      l10: [""],
      l11_journal: "", l11_sig: "",
      l12_child: "", l12_believer: "", l12_family: "",
      gp_questions: "", gp_testimony: "",
      complete: {}
    };
  }
  var STUDY = defaultStudy();
  var saveTimer = null;

  function loadDay(date) { return jget(PREFIX + date, null); }
  function addToIndex(date) {
    var idx = jget(INDEX_KEY, []);
    if (!Array.isArray(idx)) idx = [];
    if (idx.indexOf(date) === -1) idx.push(date);
    idx.sort(); idx.reverse();
    safeSet(INDEX_KEY, JSON.stringify(idx));
  }
  function saveStudy() {
    var date = dateVal();
    var rec = loadDay(date) || { date: date };
    rec.study = STUDY;
    rec.savedAt = new Date().toISOString();
    if (safeSet(PREFIX + date, JSON.stringify(rec))) addToIndex(date);
  }
  function queueSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveStudy, 600);
  }
  function loadStudyFor(date, preloaded) {
    var rec = preloaded || loadDay(date);
    var d = defaultStudy();
    var s = (rec && rec.study) ? rec.study : null;
    if (s) {
      Object.keys(d).forEach(function (k) {
        if (s[k] === undefined || s[k] === null) return;
        d[k] = s[k];
      });
    }
    if (!Array.isArray(d.l10) || !d.l10.length) d.l10 = [""];
    if (!d.l8) d.l8 = defaultStudy().l8;
    STUDY = d;
  }

  /* dotted path get / set — supports arrays: "words.0.definition" */
  function getPath(path) {
    var parts = String(path).split("."), cur = STUDY;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return "";
      cur = cur[parts[i]];
    }
    return cur == null ? "" : cur;
  }
  function setPath(path, value) {
    var parts = String(path).split("."), cur = STUDY;
    for (var i = 0; i < parts.length - 1; i++) {
      var k = parts[i];
      if (cur[k] == null) cur[k] = /^\d+$/.test(parts[i + 1]) ? [] : {};
      cur = cur[k];
    }
    cur[parts[parts.length - 1]] = value;
  }

  /* =================================================================
     FIELD HTML HELPERS
     ================================================================= */
  function libBtn(path, tab) {
    if (!tab) return "";
    return '<button type="button" class="tolib" data-src="' + esc(path) + '" data-tab="' + tab +
      '" title="Send to library">\u2795 Send to library</button>';
  }
  function ta(path, label, rows, tab, ph) {
    var v = getPath(path);
    return '<div class="field dsfield"><div class="dslabel"><label for="sk_' + esc(path) + '">' + label + "</label>" +
      libBtn(path, tab) + "</div>" +
      '<textarea id="sk_' + esc(path) + '" data-sk="' + esc(path) + '" rows="' + (rows || 3) +
      '" placeholder="' + esc(ph || "") + '">' + esc(v) + "</textarea></div>";
  }
  function tx(path, label, tab, ph) {
    var v = getPath(path);
    return '<div class="field dsfield"><div class="dslabel"><label for="sk_' + esc(path) + '">' + label + "</label>" +
      libBtn(path, tab) + "</div>" +
      '<input type="text" id="sk_' + esc(path) + '" data-sk="' + esc(path) + '" value="' + esc(v) +
      '" placeholder="' + esc(ph || "") + '"></div>';
  }

  /* =================================================================
     LAYER DEFINITIONS
     ================================================================= */
  var LAYERS = [
    { n: 1, name: "READ", time: "5 min", emoji: "\uD83D\uDC53", body: layer1 },
    { n: 2, name: "SCRIPTURE", time: "10\u201320 min", emoji: "\uD83D\uDCD6", body: layer2 },
    { n: 3, name: "DIG DEEPER \u00B7 word studies", time: "10 min", emoji: "\u26CF", body: layer3 },
    { n: 4, name: "BIBLE CONNECTIONS \u00B7 scripture chain", time: "10 min", emoji: "\uD83D\uDD17", body: layer4 },
    { n: 5, name: "THEOLOGY \u00B7 doctrines", time: "5 min", emoji: "\uD83C\uDFDB", body: layer5 },
    { n: 6, name: "DISCOVER GOD", time: "5 min", emoji: "\u2764\uFE0F", body: layer6 },
    { n: 7, name: "DISCOVER YOURSELF", time: "5 min", emoji: "\uD83E\uDEA9", body: layer7 },
    { n: 8, name: "APPLICATION", time: "5 min", emoji: "\uD83D\uDEE0", body: layer8 },
    { n: 9, name: "PRAYER \u00B7 personal response", time: "10 min", emoji: "\uD83D\uDE4F", body: layer9 },
    { n: 10, name: "DECLARATIONS", time: "5 min", emoji: "\uD83D\uDCE2", body: layer10 },
    { n: 11, name: "JOURNAL", time: "5 min", emoji: "\uD83D\uDCD3", body: layer11 },
    { n: 12, name: "TEACH SOMEONE", time: "9 min", emoji: "\uD83E\uDDD1\u200D\uD83C\uDFEB", body: layer12 }
  ];

  function layer1() {
    return ta("l1_main", "In one sentence, what is the main message?", 2, "quotes",
      "Today's devotional is telling us that\u2026") +
      ta("l1_emphasis", "What is God emphasizing today?", 3, "quotes",
        "The thing God keeps repeating to us is\u2026");
  }

  function layer2() {
    var ref = anchorRef();
    var chapterRef = ref ? ref.replace(/:\d+(\s*[-\u2013]\s*\d+)?$/, "") : "";
    var link = chapterRef
      ? '<p class="dshelp"><a class="bglink" target="_blank" rel="noopener" href="https://www.biblegateway.com/passage/?search=' +
        encodeURIComponent(chapterRef) + '&amp;version=KJV">\uD83D\uDCD6 Read ' + esc(chapterRef) +
        " on BibleGateway.com (KJV)</a></p>"
      : '<p class="dshelp">Fill in Step 2 THE SCRIPTURE above and a KJV chapter link will appear here.</p>';
    return link +
      (anchorVerse() ? '<p class="anchorecho"><strong>Anchor verse:</strong> ' + esc(anchorVerse()) + "</p>" : "") +
      ta("l2_before", "The 5 verses BEFORE the anchor verse \u2014 full KJV", 6, "promises") +
      ta("l2_after", "The 5 verses AFTER the anchor verse \u2014 full KJV", 6, "promises") +
      ta("l2_chapter", "The whole chapter \u2014 full KJV (optional)", 8, "promises") +
      '<div class="ds2grid">' +
      ta("l2_why", "Why was this verse written?", 3, "maps") +
      ta("l2_speaker", "Who was speaking?", 2, "maps") +
      ta("l2_listener", "Who was listening?", 2, "maps") +
      ta("l2_happening", "What was happening?", 3, "maps") +
      "</div>";
  }

  function layer3() {
    var html = '<p class="dshelp">Add every key word from today\u2019s devotional. One word, six questions. This is how a word becomes yours for life.</p>' +
      '<div class="chiprow"><button type="button" class="btn btn-outline small" id="suggestWords">\uD83D\uDD0D Suggest key words from today\u2019s devotional</button></div>' +
      '<div class="chiprow" id="wordSuggestions"></div><div id="wordList">';
    if (!STUDY.words.length) html += '<p class="empty">No word studies yet. Add one below.</p>';
    STUDY.words.forEach(function (w, i) {
      html += '<div class="subcard"><div class="subhead"><h4>' + (esc(w.word) || "Word " + (i + 1)) + "</h4>" +
        '<button type="button" class="removebtn dsremove" data-list="words" data-i="' + i + '">Remove</button></div>' +
        tx("words." + i + ".word", "The word", "words") +
        ta("words." + i + ".definition", "Definition", 2, "words") +
        tx("words." + i + ".original", "Hebrew or Greek word", "words") +
        ta("words." + i + ".verses", "Key verses about it \u2014 full KJV", 3, "words") +
        ta("words." + i + ".use", "Godly use vs sinful use", 2, "words") +
        tx("words." + i + ".first", "First mention in Scripture", "words") +
        ta("words." + i + ".jesus", "What Jesus taught about it", 2, "christ") +
        "</div>";
    });
    html += "</div><button type=\"button\" class=\"btn btn-outline\" id=\"addWord\">\u2795 Add a word study</button>";
    return html;
  }

  function layer4() {
    /* keep the anchor node in step with Step 2 as the family fills it in */
    (STUDY.chain || []).forEach(function (node) {
      if (!node.anchor) return;
      if (!(node.ref || "").trim()) node.ref = anchorRef();
      if (!(node.text || "").trim()) node.text = anchorVerse();
    });
    var html = '<p class="dshelp">Build the chain: what comes before this promise in Scripture, and what it opens up after. Add nodes above and below the anchor verse.</p>' +
      '<div class="chainwrap" id="chainWrap">';
    STUDY.chain.forEach(function (node, i) {
      html += '<div class="chainnode' + (node.anchor ? " anchornode" : "") + '">' +
        '<svg class="chainlink" viewBox="0 0 24 40" aria-hidden="true"><path d="M12 0 V40" stroke="#B6871A" stroke-width="3"/>' +
        '<circle cx="12" cy="20" r="7" fill="' + (node.anchor ? "#0F5B5F" : "#FAF7EF") + '" stroke="#0F5B5F" stroke-width="3"/></svg>' +
        '<div class="chainbody"><div class="subhead"><h4>' + (node.anchor ? "\u2693 Anchor verse" : "Link " + (i + 1)) + "</h4>" +
        '<div class="chainbtns">' +
        '<button type="button" class="minibtn chainadd" data-at="' + i + '" title="Add a link above">\u2795 above</button>' +
        '<button type="button" class="minibtn chainadd" data-at="' + (i + 1) + '" title="Add a link below">\u2795 below</button>' +
        '<button type="button" class="minibtn chaindel" data-i="' + i + '" title="Remove this link">\u2796</button>' +
        "</div></div>" +
        tx("chain." + i + ".ref", "Book and chapter : verse", "promises") +
        ta("chain." + i + ".text", "Verse text \u2014 full KJV", 3, "promises") +
        tx("chain." + i + ".note", "One-line note \u2014 why this link belongs here", "promises") +
        "</div></div>";
    });
    html += "</div><div class=\"toolfoot\">" +
      '<button type="button" class="btn btn-outline small chainadd" data-at="' + STUDY.chain.length + '">\u2795 Add a link</button>' +
      '<button type="button" class="btn btn-teal small" id="saveChain">\uD83D\uDCBE Save this chain to the library</button></div>';
    return html;
  }

  var DOCTRINES = ["Sovereignty of God", "Goodness of God", "Renewing the mind", "Spiritual warfare",
    "Faith", "Prayer", "Hope", "Salvation", "Sanctification", "Holy Spirit", "Blood of Jesus",
    "Resurrection", "Second Coming"];

  function layer5() {
    var all = DOCTRINES.concat(STUDY.customDoctrines || []);
    var html = '<p class="dshelp">Which doctrines does today\u2019s devotional touch? Tick one and a notes box opens.</p><div class="docgrid">';
    all.forEach(function (d, i) {
      var rec = STUDY.doctrines[d] || {};
      var id = "doc_" + i;
      html += '<div class="docitem' + (rec.on ? " on" : "") + '">' +
        '<div class="checkrow"><input type="checkbox" id="' + id + '" data-doc="' + esc(d) + '"' + (rec.on ? " checked" : "") + ">" +
        '<label for="' + id + '">' + esc(d) + "</label></div>" +
        (rec.on ? '<div class="field"><label class="inlinelabel" for="docn_' + i + '">Notes on ' + esc(d) + "</label>" +
          '<textarea id="docn_' + i + '" data-sk="doctrines.' + esc(d) + '.notes" rows="2" placeholder="What does today\u2019s devotional say about this?">' +
          esc(rec.notes || "") + "</textarea>" + libBtn("doctrines." + d + ".notes", "quotes") + "</div>" : "") +
        "</div>";
    });
    html += "</div><div class=\"toolfoot\"><label class=\"inlinelabel\" for=\"customDoc\">Add a doctrine</label>" +
      '<input type="text" id="customDoc" placeholder="Add another doctrine\u2026" style="max-width:280px">' +
      '<button type="button" class="btn btn-outline small" id="addDoc">\u2795 Add doctrine</button></div>';
    return html;
  }

  var ATTRS = ["Faithful", "Peace", "Good", "Truthful", "Wise", "Sovereign", "Merciful", "Just",
    "Love", "Holy", "Almighty", "Everlasting", "Provider", "Healer", "Shepherd", "Father", "King"];

  function layer6() {
    var html = ta("l6_text", "Today I learned God is\u2026", 4, "character",
      "Today I learned God is\u2026") +
      '<p class="dshelp">Tap every attribute today\u2019s devotional showed you. Each one is filed in \u2764\uFE0F The Character of God.</p><div class="chiprow">';
    ATTRS.forEach(function (a) {
      var on = (STUDY.l6_attrs || []).indexOf(a) > -1;
      html += '<button type="button" class="chip' + (on ? " on" : "") + '" data-attr="' + esc(a) + '" aria-pressed="' +
        (on ? "true" : "false") + '">' + (on ? "\u2713 " : "") + esc(a) + "</button>";
    });
    html += "</div>";
    return html;
  }

  function layer7() {
    return ta("l7_where", "Where am I in this passage?", 3, "testimonies") +
      ta("l7_attitudes", "What attitudes need changing?", 3) +
      ta("l7_fears", "What fears am I holding?", 3) +
      ta("l7_lies", "What lies have I believed?", 3);
  }

  var AREAS = [["home", "\uD83C\uDFE0 At Home"], ["work", "\uD83D\uDCBC At Work"], ["ministry", "\u26EA In Ministry"],
    ["prayer", "\uD83D\uDE4F In Prayer"], ["family", "\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67 With My Family"],
    ["finances", "\uD83D\uDCB0 With My Finances"]];

  function layer8() {
    var html = '<div class="applygrid"><div class="applyhead"><span>Area of life</span><span>What must change today?</span></div>';
    AREAS.forEach(function (a) {
      html += '<div class="applyrow"><span class="applyarea">' + a[1] + "</span>" +
        '<span class="applyinput"><label class="inlinelabel" for="sk_l8.' + a[0] + '">' + a[1] + " \u2014 what must change today?</label>" +
        '<textarea id="sk_l8.' + a[0] + '" data-sk="l8.' + a[0] + '" rows="2"></textarea></span></div>';
    });
    html += "</div>";
    return html;
  }

  function layer9() {
    var html = ta("l9_prayer", "Turn every paragraph into prayer. Do not copy the devotion \u2014 respond personally.", 8, "prayers",
      "Father, You said\u2026 so I ask You\u2026") +
      '<div class="toolfoot"><button type="button" class="btn btn-outline small" id="breakParas">\u2702 Break my devotional into paragraphs</button></div>' +
      '<div id="paraHost"></div>';
    return html;
  }

  function renderParagraphs() {
    var host = $("paraHost");
    if (!host) return;
    var paras = String(fval("devotional")).split(/\n\s*\n/).map(function (p) { return p.trim(); })
      .filter(function (p) { return p.length > 2; });
    if (!paras.length) {
      host.innerHTML = '<p class="locked">Paste today\u2019s devotional in Section 1 first.</p>';
      return;
    }
    var html = "";
    paras.forEach(function (p, i) {
      html += '<div class="pararow"><blockquote class="paratext">' + esc(p) + "</blockquote>" +
        '<div class="field dsfield"><div class="dslabel"><label for="sk_l9_paras.' + i + '">My prayer for this paragraph</label>' +
        libBtn("l9_paras." + i, "prayers") + "</div>" +
        '<textarea id="sk_l9_paras.' + i + '" data-sk="l9_paras.' + i + '" rows="2">' +
        esc((STUDY.l9_paras || [])[i] || "") + "</textarea></div></div>";
    });
    host.innerHTML = html;
  }

  function layer10() {
    var html = '<p class="dshelp">Use the pastor\u2019s own words. Add nothing new. Speak each one aloud twice.</p>' +
      '<div class="chiprow"><button type="button" class="btn btn-outline small" id="suggestDecs">\u2728 Suggest declarations from today\u2019s promises</button></div>' +
      '<div id="decSuggestions" class="chiprow"></div><div id="decList">';
    (STUDY.l10 || []).forEach(function (d, i) {
      html += '<div class="declare dsdeclare"><div class="dslabel"><label for="sk_l10.' + i + '">Declaration ' + (i + 1) + "</label>" +
        '<span class="chainbtns">' + libBtn("l10." + i, "declarations") +
        '<button type="button" class="minibtn dsremove" data-list="l10" data-i="' + i + '">\u2796</button></span></div>' +
        '<p class="declead">I declare, in the Name of Jesus Christ, that</p>' +
        '<input type="text" id="sk_l10.' + i + '" data-sk="l10.' + i + '" value="' + esc(d) + '" placeholder="\u2026"></div>';
    });
    html += "</div><button type=\"button\" class=\"btn btn-outline\" id=\"addDec\">\u2795 Add another declaration</button>";
    return html;
  }

  function layer11() {
    return ta("l11_journal", "What did the Holy Spirit impress upon me today?", 7, "testimonies") +
      '<p class="dshelp">Signed and dated \u2014 this is filed straight into your Golden Pages archive when you save the Golden Page.</p>' +
      tx("l11_sig", "Signature line \u2014 name and time", null, null,
        "Written by\u2026 on " + prettyDate(dateVal()));
  }

  function layer12() {
    function script(key, label, tab) {
      return '<div class="teachcard">' + ta(key, label, 4, tab,
        "Keep it to three minutes \u2014 one verse, one truth, one action.") +
        '<div class="toolfoot"><button type="button" class="btn btn-outline small readaloud" data-src="' + key +
        '">\uD83D\uDD0A Read aloud</button>' +
        '<button type="button" class="btn btn-gold small washare" data-src="' + key +
        '" data-title="' + esc(label) + '">\uD83D\uDCF1 Share to WhatsApp</button></div></div>';
    }
    return '<p class="dshelp">You have not learned it until you can teach it in three minutes.</p>' +
      script("l12_child", "\uD83E\uDDD2 Teach a child \u2014 3-minute script", "quotes") +
      script("l12_believer", "\uD83C\uDF31 Teach a new believer \u2014 3-minute script", "quotes") +
      script("l12_family", "\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67 Teach my family \u2014 3-minute script", "quotes");
  }

  /* =================================================================
     LAYER RENDERING
     ================================================================= */
  function layerTouched(n) {
    function any() {
      for (var i = 0; i < arguments.length; i++) {
        var v = getPath(arguments[i]);
        if (typeof v === "string" && v.trim()) return true;
      }
      return false;
    }
    switch (n) {
      case 1: return any("l1_main", "l1_emphasis");
      case 2: return any("l2_before", "l2_after", "l2_chapter", "l2_why", "l2_speaker", "l2_listener", "l2_happening");
      case 3: return (STUDY.words || []).some(function (w) { return (w.word || "").trim(); });
      case 4: return (STUDY.chain || []).some(function (c) { return (c.ref || "").trim() || (c.text || "").trim(); });
      case 5: return Object.keys(STUDY.doctrines || {}).some(function (k) { return STUDY.doctrines[k].on; });
      case 6: return any("l6_text") || (STUDY.l6_attrs || []).length > 0;
      case 7: return any("l7_where", "l7_attitudes", "l7_fears", "l7_lies");
      case 8: return AREAS.some(function (a) { return (STUDY.l8[a[0]] || "").trim(); });
      case 9: return any("l9_prayer") || (STUDY.l9_paras || []).some(function (p) { return (p || "").trim(); });
      case 10: return (STUDY.l10 || []).some(function (d) { return (d || "").trim(); });
      case 11: return any("l11_journal");
      case 12: return any("l12_child", "l12_believer", "l12_family");
    }
    return false;
  }

  function updateProgress() {
    var count = 0;
    for (var n = 1; n <= 12; n++) {
      var touched = layerTouched(n) || !!(STUDY.complete || {})[n];
      if (touched) count++;
      var card = $("layer" + n);
      if (card) card.classList.toggle("touched", touched);
      var badge = $("layerBadge" + n);
      if (badge) badge.textContent = touched ? "\u2713 touched" : "";
    }
    var label = $("dsProgressLabel"), fill = $("dsProgressFill"), bar = $("dsProgressBar");
    if (label) label.textContent = count + " of 12 layers touched \u2014 Golden Page progress";
    if (fill) fill.style.width = Math.round((count / 12) * 100) + "%";
    if (bar) bar.setAttribute("aria-valuenow", String(count));
  }

  function renderLayers(keepOpen) {
    var host = $("layerHost");
    if (!host) return;
    var open = keepOpen || {};
    if (!keepOpen) {
      Array.prototype.forEach.call(host.querySelectorAll(".stephead"), function (b) {
        open[b.dataset.layer] = b.getAttribute("aria-expanded") === "true";
      });
    }
    var html = "";
    LAYERS.forEach(function (L) {
      var isOpen = !!open[String(L.n)];
      var done = !!(STUDY.complete || {})[L.n];
      html += '<article class="step layercard" id="layer' + L.n + '">' +
        '<button class="stephead" type="button" data-layer="' + L.n + '" aria-expanded="' + (isOpen ? "true" : "false") +
        '" aria-controls="layerbody' + L.n + '">' +
        '<span class="stepnum">' + L.n + "</span>" +
        '<span class="steptitle"><span class="stepname">' + L.emoji + " " + esc(L.name) + "</span>" +
        '<span class="stepsub">Layer ' + L.n + " of 12 &middot; " + L.time +
        ' <span class="layerbadge" id="layerBadge' + L.n + '"></span></span></span>' +
        '<svg class="chev" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 8l5 5 5-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>' +
        "</button>" +
        '<div class="stepbody" id="layerbody' + L.n + '"' + (isOpen ? "" : " hidden") + ">" +
        L.body() +
        '<div class="checkrow layerdone"><input type="checkbox" id="layerdone' + L.n + '" data-done="' + L.n + '"' +
        (done ? " checked" : "") + '><label for="layerdone' + L.n + '">Complete this layer</label></div>' +
        "</div></article>";
    });
    host.innerHTML = html;

    /* set values that HTML escaping cannot carry (textarea grids) */
    AREAS.forEach(function (a) {
      var el = document.getElementById("sk_l8." + a[0]);
      if (el) el.value = STUDY.l8[a[0]] || "";
    });
    Array.prototype.forEach.call(host.querySelectorAll(".stephead"), function (btn) {
      btn.addEventListener("click", function () {
        var body = document.getElementById(btn.getAttribute("aria-controls"));
        var isOpen = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", isOpen ? "false" : "true");
        body.hidden = isOpen;
      });
    });
    if (open["9"]) renderParagraphs();
    updateProgress();
  }

  /* =================================================================
     SUGGESTION HELPERS (only re-use the family's own words)
     ================================================================= */
  function suggestKeyWords() {
    var text = [fval("devotional"), fval("mark_lie"), fval("mark_truth"), fval("mark_command"), anchorVerse()].join(" ");
    var freq = {};
    String(text).split(/[^A-Za-z']+/).forEach(function (w) {
      var c = w.replace(/'/g, "");
      if (c.length < 4 || STOP[c.toLowerCase()]) return;
      var k = c.toLowerCase();
      freq[k] = (freq[k] || 0) + 1;
    });
    return Object.keys(freq).sort(function (a, b) { return freq[b] - freq[a]; }).slice(0, 5)
      .map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); });
  }

  function suggestDeclarations() {
    var devo = fval("devotional") + " " + fval("mark_truth") + " " + anchorVerse();
    var sentences = (devo.match(/[^.!?\n]+[.!?]?/g) || []).map(function (s) { return s.trim(); }).filter(Boolean);
    var PROMISE = /\b(LORD|I will|He will|God will|shall|expected end|peace|not of evil|thoughts of peace|good things|counsel of the Lord|strength|deliver|heal|bless)\b/;
    var out = [];
    sentences.forEach(function (s) {
      if (out.length >= 3) return;
      if (!PROMISE.test(s)) return;
      var clean = s.replace(/^["“'\s]+|["”'\s]+$/g, "").replace(/\s+/g, " ");
      if (clean.length < 12) return;
      if (clean.length > 150) clean = clean.slice(0, 147) + "\u2026";
      out.push(clean);
    });
    return out;
  }

  /* =================================================================
     GOLDEN PAGE
     ================================================================= */
  function goldenData() {
    var decs = (STUDY.l10 || []).filter(function (d) { return (d || "").trim(); });
    var stepDecs = ["dec1", "dec2", "dec3"].map(fval).filter(Boolean);
    return {
      date: dateVal(),
      title: firstLine(fval("devotional")) || "Today's devotional",
      devotional: fval("devotional"),
      ref: anchorRef(),
      verse: anchorVerse(),
      before: STUDY.l2_before, after: STUDY.l2_after, chapter: STUDY.l2_chapter,
      background: [["Why was this written?", STUDY.l2_why], ["Who was speaking?", STUDY.l2_speaker],
        ["Who was listening?", STUDY.l2_listener], ["What was happening?", STUDY.l2_happening]],
      words: (STUDY.words || []).filter(function (w) { return (w.word || "").trim(); }),
      chain: (STUDY.chain || []).filter(function (c) { return (c.ref || "").trim() || (c.text || "").trim(); }),
      characters: libGet("characters").slice(0, 5).map(function (e) { return e.text; }),
      doctrines: Object.keys(STUDY.doctrines || {}).filter(function (k) { return STUDY.doctrines[k].on; })
        .map(function (k) { return k + (STUDY.doctrines[k].notes ? " \u2014 " + STUDY.doctrines[k].notes : ""); }),
      insights: [STUDY.l1_main, STUDY.l1_emphasis, STUDY.l11_journal].filter(function (x) { return (x || "").trim(); }),
      reflection: [["Where am I in this passage?", STUDY.l7_where], ["Attitudes to change", STUDY.l7_attitudes],
        ["Fears I am holding", STUDY.l7_fears], ["Lies I have believed", STUDY.l7_lies]],
      prayer: STUDY.l9_prayer,
      paraPrayers: (STUDY.l9_paras || []).filter(function (p) { return (p || "").trim(); }),
      declarations: decs.length ? decs : stepDecs,
      actions: AREAS.map(function (a) { return [a[1], STUDY.l8[a[0]] || ""]; })
        .filter(function (r) { return r[1].trim(); }),
      questions: STUDY.gp_questions,
      discussion: [["Teach a child", STUDY.l12_child], ["Teach a new believer", STUDY.l12_believer],
        ["Teach my family", STUDY.l12_family]],
      testimony: STUDY.gp_testimony,
      journal: STUDY.l11_journal,
      sig: STUDY.l11_sig,
      godIs: STUDY.l6_text, attrs: STUDY.l6_attrs || []
    };
  }

  function blockHtml(title, value) {
    if (!value || !String(value).trim()) return "";
    return '<section class="gpblock"><h4>' + title + "</h4><p>" +
      esc(String(value)).replace(/\n/g, "<br>") + "</p></section>";
  }
  function pairsHtml(title, pairs) {
    var rows = pairs.filter(function (p) { return (p[1] || "").trim(); });
    if (!rows.length) return "";
    return '<section class="gpblock"><h4>' + title + "</h4><dl class=\"gpdl\">" +
      rows.map(function (p) { return "<dt>" + esc(p[0]) + "</dt><dd>" + esc(p[1]).replace(/\n/g, "<br>") + "</dd>"; }).join("") +
      "</dl></section>";
  }
  function listHtml(title, items, ordered) {
    var rows = (items || []).filter(function (x) { return String(x || "").trim(); });
    if (!rows.length) return "";
    var tag = ordered ? "ol" : "ul";
    return '<section class="gpblock"><h4>' + title + "</h4><" + tag + ' class="gplist">' +
      rows.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</" + tag + "></section>";
  }

  function renderGolden() {
    var g = goldenData();
    var host = $("goldenSpread");
    if (!host) return;
    var left = '<div class="gppage gpleft"><p class="gpkicker">Left page</p><h3>\uD83D\uDCD6 What God Says</h3>' +
      '<p class="gpdate">' + esc(prettyDate(g.date)) + " &middot; " + esc(g.title) + "</p>" +
      blockHtml("The devotion \u2014 as received", g.devotional) +
      blockHtml("Full Scripture \u2014 anchor verse (KJV)", (g.ref ? g.ref + " \u2014 " : "") + g.verse) +
      blockHtml("The 5 verses before (KJV)", g.before) +
      blockHtml("The 5 verses after (KJV)", g.after) +
      blockHtml("The whole chapter (KJV)", g.chapter) +
      pairsHtml("Historical background", g.background) +
      listHtml("Word studies", g.words.map(function (w) {
        return w.word + (w.original ? " (" + w.original + ")" : "") + (w.definition ? " \u2014 " + w.definition : "");
      })) +
      listHtml("Cross-references \u2014 the scripture chain", g.chain.map(function (c) {
        return (c.ref || "") + (c.text ? " \u2014 " + c.text : "") + (c.note ? " [" + c.note + "]" : "");
      })) +
      listHtml("Bible characters", g.characters) +
      listHtml("Related doctrines", g.doctrines) +
      listHtml("Key insights", g.insights) +
      blockHtml("Today I learned God is\u2026", g.godIs + (g.attrs.length ? "\n" + g.attrs.join(" \u00B7 ") : "")) +
      "</div>";

    var right = '<div class="gppage gpright"><p class="gpkicker">Right page</p><h3>\uD83D\uDE4F My Response</h3>' +
      '<p class="gpdate">As shared by my pastor.</p>' +
      pairsHtml("Personal reflection", g.reflection) +
      blockHtml("Prayer \u2014 my personal response", g.prayer) +
      listHtml("Prayer, paragraph by paragraph", g.paraPrayers) +
      listHtml("Declarations", g.declarations.map(function (d) {
        return "I declare, in the Name of Jesus Christ, that " + d;
      }), true) +
      pairsHtml("Action steps", g.actions) +
      '<section class="gpblock"><h4>Questions I still have</h4>' +
      '<label class="inlinelabel" for="sk_gp_questions">Questions I still have</label>' +
      '<textarea id="sk_gp_questions" data-sk="gp_questions" rows="3" placeholder="What do I still want to search out?"></textarea></section>' +
      pairsHtml("Family discussion \u2014 3-minute teaching scripts", g.discussion) +
      '<section class="gpblock"><h4>Testimony \u2014 answered prayers</h4>' +
      '<label class="inlinelabel" for="sk_gp_testimony">Testimony and answered prayers</label>' +
      '<textarea id="sk_gp_testimony" data-sk="gp_testimony" rows="3" placeholder="What has God already answered?"></textarea>' +
      '<button type="button" class="tolib" data-src="gp_testimony" data-tab="testimonies">\u2795 Send to library</button></section>' +
      blockHtml("Notes from the Holy Spirit", g.journal) +
      (g.sig ? '<p class="gpsig">' + esc(g.sig) + "</p>" : "") +
      '<p class="gpfoot">L137 &middot; Luke 1:37 &mdash; For with God nothing shall be impossible.</p></div>';

    host.innerHTML = left + right;
    var q = $("sk_gp_questions"); if (q) q.value = STUDY.gp_questions || "";
    var t = $("sk_gp_testimony"); if (t) t.value = STUDY.gp_testimony || "";
    updateGoldenCount();
  }

  function goldenIndex() { var a = jget(GOLD_INDEX, []); return Array.isArray(a) ? a : []; }
  function updateGoldenCount() {
    var el = $("goldenCount");
    if (!el) return;
    var n = goldenIndex().length;
    el.textContent = "You have " + n + " Golden Page" + (n === 1 ? "" : "s") + " saved. 365 = a full year.";
  }
  function saveGolden() {
    var g = goldenData();
    safeSet(GOLD + g.date, JSON.stringify(g));
    var idx = goldenIndex();
    if (idx.indexOf(g.date) === -1) idx.push(g.date);
    idx.sort(); idx.reverse();
    safeSet(GOLD_INDEX, JSON.stringify(idx));
    if ((STUDY.l11_journal || "").trim()) libAdd("testimonies", STUDY.l11_journal.trim());
    updateGoldenCount();
    toast("Golden Page saved to your archive.");
  }
  function openGolden() {
    renderGolden();
    $("goldenWrap").hidden = false;
    document.body.classList.add("golden-open");
    $("goldenClose").focus();
  }
  function closeGolden() {
    $("goldenWrap").hidden = true;
    document.body.classList.remove("golden-open");
  }
  function printGolden() {
    renderGolden();
    document.body.classList.add("golden-print");
    function cleanup() {
      document.body.classList.remove("golden-print");
      window.removeEventListener("afterprint", cleanup);
    }
    window.addEventListener("afterprint", cleanup);
    setTimeout(function () { window.print(); }, 60);
    setTimeout(cleanup, 4000);
  }

  /* =================================================================
     LIBRARY UI
     ================================================================= */
  function renderTabs() {
    var host = $("libTabs");
    if (!host) return;
    host.innerHTML = TABS.map(function (t) {
      var n = libGet(t.id).length;
      return '<button type="button" role="tab" class="libtab' + (t.id === activeTab ? " on" : "") +
        '" data-tab="' + t.id + '" aria-selected="' + (t.id === activeTab ? "true" : "false") + '">' +
        t.label + ' <span class="libcount">' + n + "</span></button>";
    }).join("");
    Array.prototype.forEach.call(host.querySelectorAll(".libtab"), function (b) {
      b.addEventListener("click", function () {
        activeTab = b.dataset.tab;
        renderTabs(); renderLibrary();
      });
    });
  }

  function renderLibrary() {
    renderTabs();
    var host = $("libList");
    if (!host) return;
    var q = (fval("libSearch") || "").toLowerCase();
    var arr = libGet(activeTab);
    var shown = arr.filter(function (e) {
      return !q || (e.text + " " + (e.note || "") + " " + e.date).toLowerCase().indexOf(q) > -1;
    });
    var tabLabel = TABS.filter(function (t) { return t.id === activeTab; })[0].label;
    if (!arr.length) {
      host.innerHTML = '<p class="empty">' + esc(tabLabel) + " is empty. Use the \u2795 Send to library buttons in Deep Study Mode above.</p>";
      return;
    }
    if (!shown.length) { host.innerHTML = '<p class="empty">Nothing matches &ldquo;' + esc(q) + "&rdquo; in this collection.</p>"; return; }
    host.innerHTML = shown.map(function (e) {
      var realIdx = arr.indexOf(e);
      return '<article class="libentry"><p class="libdate">' + esc(prettyDate(e.date)) + "</p>" +
        "<p class=\"libtext\">" + esc(e.text).replace(/\n/g, "<br>") + "</p>" +
        (e.note ? '<p class="libnote">' + esc(e.note) + "</p>" : "") +
        '<button type="button" class="removebtn libdel" data-i="' + realIdx + '">Remove</button></article>';
    }).join("");
    Array.prototype.forEach.call(host.querySelectorAll(".libdel"), function (b) {
      b.addEventListener("click", function () { libRemove(activeTab, Number(b.dataset.i)); });
    });
  }

  function libText() {
    var t = TABS.filter(function (x) { return x.id === activeTab; })[0];
    var arr = libGet(activeTab);
    var L = [t.label.replace(/[^\x20-\x7E]/g, "").trim(), "L137 · Luke 1:37 · As shared by my pastor.", ""];
    arr.forEach(function (e) {
      L.push(prettyDate(e.date) + ":");
      L.push(e.text);
      if (e.note) L.push("Note: " + e.note);
      L.push("");
    });
    return L.join("\n").trim();
  }
  function download(name, text) {
    var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }
  function whatsapp(text) {
    var url = (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? "whatsapp://send?text=" : "https://wa.me/?text=") +
      encodeURIComponent(text);
    var w = window.open(url, "_blank");
    if (!w) window.location.href = url;
  }

  /* =================================================================
     MINISTRY SEQUENCE — 8 outputs
     ================================================================= */
  function ministryOutputs() {
    var g = goldenData();
    function j(rows) { return rows.filter(function (r) { return String(r || "").trim(); }).join("\n"); }
    var out = [];
    out.push({
      icon: "\uD83D\uDCF2", title: "1 · The Daily Devotion (as received)",
      text: j([prettyDate(g.date), "As shared by my pastor.", "", g.devotional])
    });
    out.push({
      icon: "\uD83D\uDD0E", title: "2 · Deep Bible Study (Layers 2\u20135)",
      text: j([
        g.ref ? "Anchor verse: " + g.ref : "", g.verse,
        g.before ? "\nVERSES BEFORE (KJV):\n" + g.before : "",
        g.after ? "\nVERSES AFTER (KJV):\n" + g.after : "",
        g.background.filter(function (p) { return (p[1] || "").trim(); })
          .map(function (p) { return p[0] + " " + p[1]; }).join("\n"),
        g.words.length ? "\nWORD STUDIES:\n" + g.words.map(function (w) {
          return "- " + w.word + (w.original ? " (" + w.original + ")" : "") + (w.definition ? ": " + w.definition : "");
        }).join("\n") : "",
        g.chain.length ? "\nSCRIPTURE CHAIN:\n" + g.chain.map(function (c) {
          return "- " + (c.ref || "") + (c.text ? ": " + c.text : "");
        }).join("\n") : "",
        g.doctrines.length ? "\nDOCTRINES:\n- " + g.doctrines.join("\n- ") : ""
      ])
    });
    out.push({
      icon: "\uD83D\uDCD3", title: "3 · Interactive Workbook (today's saved day)",
      text: j(["Today's extraction is saved in this app under " + prettyDate(g.date) + ".",
        "Open History in the bottom toolbar to revisit any past day.",
        g.ref ? "Anchor verse: " + g.ref : "", g.title ? "Devotional: " + g.title : ""])
    });
    out.push({
      icon: "\uD83D\uDE4F", title: "4 · Prayer and Declarations (Layers 9 + 10)",
      text: j([g.prayer ? "PRAYER:\n" + g.prayer : "",
        g.paraPrayers.length ? "\nPARAGRAPH PRAYERS:\n- " + g.paraPrayers.join("\n- ") : "",
        g.declarations.length ? "\nDECLARATIONS:\n" + g.declarations.map(function (d) {
          return "I declare, in the Name of Jesus Christ, that " + d;
        }).join("\n") : ""])
    });
    out.push({
      icon: "\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67", title: "5 · Family Discussion Guide (Layers 7 + 12)",
      text: j([
        g.reflection.filter(function (p) { return (p[1] || "").trim(); })
          .map(function (p) { return "Q: " + p[0] + "\nOur answer: " + p[1]; }).join("\n\n"),
        g.discussion.filter(function (p) { return (p[1] || "").trim(); })
          .map(function (p) { return "\n" + p[0].toUpperCase() + ":\n" + p[1]; }).join("\n")
      ])
    });
    out.push({
      icon: "\uD83D\uDDBC", title: "6 · Realistic Cartoon Storyboard (6 panels)",
      text: j(["The 6-panel Visual Bible Companion Story is drawn in the Learning Tools Studio above (Tool 8).",
        "Panels: morning burden \u00B7 open Bible \u00B7 heavenly light \u00B7 renewed mind \u00B7 declaration \u00B7 expected end.",
        g.ref ? "Anchor verse on panel 2: " + g.ref : ""]),
      jump: "tool8"
    });
    out.push({
      icon: "\uD83D\uDCDD", title: "7 · Teaching Notes (Layers 1, 5, 8, 10, 12)",
      text: j([prettyDate(g.date) + " \u2014 TEACHING NOTES",
        "As shared by my pastor.",
        g.insights.length ? "\nMAIN MESSAGE:\n" + g.insights.join("\n") : "",
        g.doctrines.length ? "\nDOCTRINES TOUCHED:\n- " + g.doctrines.join("\n- ") : "",
        g.actions.length ? "\nAPPLICATION:\n" + g.actions.map(function (a) {
          return "- " + a[0].replace(/[^\x20-\x7E]/g, "").trim() + ": " + a[1];
        }).join("\n") : "",
        g.declarations.length ? "\nDECLARATIONS:\n" + g.declarations.map(function (d) {
          return "I declare, in the Name of Jesus Christ, that " + d;
        }).join("\n") : "",
        g.discussion.filter(function (p) { return (p[1] || "").trim(); })
          .map(function (p) { return "\n" + p[0].toUpperCase() + ":\n" + p[1]; }).join("\n"),
        "\nL137 \u00B7 Luke 1:37 \u2014 For with God nothing shall be impossible."])
    });
    out.push({
      icon: "\uD83D\uDCD6", title: "8 · Personal Journal (Layer 11)",
      text: j([g.journal, g.sig])
    });
    return out;
  }

  function renderMinistry() {
    var host = $("ministryHost");
    if (!host) return;
    var outs = ministryOutputs();
    host.innerHTML = outs.map(function (o, i) {
      var body = o.text.trim();
      return '<article class="mincard"><h3>' + o.icon + " " + esc(o.title.replace(/^\d+ \u00B7 /, "")) + "</h3>" +
        '<p class="minnum">Output ' + (i + 1) + " of 8</p>" +
        (body ? '<pre class="minbody">' + esc(body) + "</pre>"
              : '<p class="locked">Fill in the matching layers above and this output assembles itself.</p>') +
        '<div class="toolfoot"><button type="button" class="btn btn-outline small mincopy" data-i="' + i + '">\uD83D\uDCCB Copy</button>' +
        '<button type="button" class="btn btn-gold small minwa" data-i="' + i + '">\uD83D\uDCF1 Share to WhatsApp</button>' +
        (o.jump ? '<a class="btn btn-outline small" href="#' + o.jump + '">Open the storyboard</a>' : "") +
        "</div></article>";
    }).join("");
    Array.prototype.forEach.call(host.querySelectorAll(".mincopy"), function (b) {
      b.addEventListener("click", function () {
        var t = outs[Number(b.dataset.i)].text;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(t).then(function () { toast("Copied"); }, function () { toast("Copy not allowed here"); });
        } else { toast("Copy not supported in this browser"); }
      });
    });
    Array.prototype.forEach.call(host.querySelectorAll(".minwa"), function (b) {
      b.addEventListener("click", function () { whatsapp(outs[Number(b.dataset.i)].text); });
    });
  }

  /* =================================================================
     SPEECH
     ================================================================= */
  var canSpeak = ("speechSynthesis" in window) && ("SpeechSynthesisUtterance" in window);
  function speak(text) {
    if (!canSpeak || !String(text || "").trim()) return;
    window.speechSynthesis.cancel();
    var u = new window.SpeechSynthesisUtterance(text);
    u.rate = 0.94; u.lang = "en-GB";
    window.speechSynthesis.speak(u);
  }

  /* =================================================================
     EVENT WIRING (delegated — survives re-renders)
     ================================================================= */
  function wireDelegates() {
    document.addEventListener("input", function (e) {
      var el = e.target;
      if (!el || !el.getAttribute) return;
      var key = el.getAttribute("data-sk");
      if (key) {
        setPath(key, el.value);
        queueSave();
        updateProgress();
        return;
      }
      if (el.id === "libSearch") renderLibrary();
    });

    document.addEventListener("change", function (e) {
      var el = e.target;
      if (!el || !el.getAttribute) return;
      var doc = el.getAttribute("data-doc");
      if (doc) {
        if (!STUDY.doctrines[doc]) STUDY.doctrines[doc] = { on: false, notes: "" };
        STUDY.doctrines[doc].on = el.checked;
        saveStudy();
        renderLayers();
        var body = $("layerbody5"); if (body) { body.hidden = false; $("layer5").querySelector(".stephead").setAttribute("aria-expanded", "true"); }
        return;
      }
      var done = el.getAttribute("data-done");
      if (done) {
        STUDY.complete[done] = el.checked;
        saveStudy();
        updateProgress();
      }
    });

    document.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest("button, a") : null;
      if (!t) return;

      /* send to library */
      if (t.classList.contains("tolib")) {
        var src = t.dataset.src;
        var v = getPath(src);
        libAdd(t.dataset.tab, v);
        return;
      }
      /* remove from dynamic list */
      if (t.classList.contains("dsremove")) {
        var list = t.dataset.list, i = Number(t.dataset.i);
        if (Array.isArray(STUDY[list])) {
          STUDY[list].splice(i, 1);
          if (list === "l10" && !STUDY.l10.length) STUDY.l10 = [""];
          saveStudy(); renderLayers();
        }
        return;
      }
      /* layer 3 */
      if (t.id === "addWord") {
        STUDY.words.push({ word: "", definition: "", original: "", verses: "", use: "", first: "", jesus: "" });
        saveStudy(); renderLayers();
        return;
      }
      if (t.id === "suggestWords") {
        var sug = suggestKeyWords();
        var host = $("wordSuggestions");
        host.innerHTML = sug.length
          ? sug.map(function (w) { return '<button type="button" class="chip wordchip">' + esc(w) + "</button>"; }).join("") +
            '<span class="dshelp">Tap a word to start its study.</span>'
          : '<span class="dshelp">Paste the devotional in Section 1 first.</span>';
        Array.prototype.forEach.call(host.querySelectorAll(".wordchip"), function (c) {
          c.addEventListener("click", function () {
            STUDY.words.push({ word: c.textContent, definition: "", original: "", verses: "", use: "", first: "", jesus: "" });
            saveStudy(); renderLayers();
            var b = $("layerbody3"); if (b) b.hidden = false;
          });
        });
        return;
      }
      /* layer 4 */
      if (t.classList.contains("chainadd")) {
        var at = Number(t.dataset.at);
        STUDY.chain.splice(at, 0, { ref: "", text: "", note: "", anchor: false });
        saveStudy(); renderLayers();
        return;
      }
      if (t.classList.contains("chaindel")) {
        STUDY.chain.splice(Number(t.dataset.i), 1);
        saveStudy(); renderLayers();
        return;
      }
      if (t.id === "saveChain") {
        var chain = (STUDY.chain || []).filter(function (c) { return (c.ref || "").trim() || (c.text || "").trim(); });
        if (!chain.length) { toast("Add at least one link first."); return; }
        libAdd("promises", chain.map(function (c) {
          return (c.ref || "") + (c.text ? " \u2014 " + c.text : "") + (c.note ? " [" + c.note + "]" : "");
        }).join("\n"), "Scripture chain");
        return;
      }
      /* layer 5 custom doctrine */
      if (t.id === "addDoc") {
        var v2 = fval("customDoc");
        if (!v2) { toast("Type a doctrine name first."); return; }
        if (DOCTRINES.indexOf(v2) === -1 && STUDY.customDoctrines.indexOf(v2) === -1) STUDY.customDoctrines.push(v2);
        STUDY.doctrines[v2] = STUDY.doctrines[v2] || { on: true, notes: "" };
        STUDY.doctrines[v2].on = true;
        saveStudy(); renderLayers();
        return;
      }
      /* layer 6 chips */
      if (t.dataset && t.dataset.attr) {
        var a = t.dataset.attr;
        var arr = STUDY.l6_attrs || (STUDY.l6_attrs = []);
        var at2 = arr.indexOf(a);
        if (at2 > -1) arr.splice(at2, 1);
        else { arr.push(a); libAdd("character", "God is " + a); }
        saveStudy(); renderLayers();
        var b6 = $("layerbody6"); if (b6) b6.hidden = false;
        return;
      }
      /* layer 9 */
      if (t.id === "breakParas") { renderParagraphs(); return; }
      /* layer 10 */
      if (t.id === "addDec") { STUDY.l10.push(""); saveStudy(); renderLayers(); return; }
      if (t.id === "suggestDecs") {
        var sd = suggestDeclarations();
        var h = $("decSuggestions");
        h.innerHTML = sd.length
          ? sd.map(function (s) { return '<button type="button" class="chip decchip">' + esc(s) + "</button>"; }).join("") +
            '<span class="dshelp">Tap to accept a promise from the devotional, then edit it into your own declaration.</span>'
          : '<span class="dshelp">No promise sentences found yet \u2014 paste the devotional in Section 1.</span>';
        Array.prototype.forEach.call(h.querySelectorAll(".decchip"), function (c) {
          c.addEventListener("click", function () {
            STUDY.l10.push(c.textContent);
            saveStudy(); renderLayers();
            var b = $("layerbody10"); if (b) b.hidden = false;
          });
        });
        return;
      }
      /* layer 12 */
      if (t.classList.contains("readaloud")) { speak(getPath(t.dataset.src)); return; }
      if (t.classList.contains("washare")) {
        var text = getPath(t.dataset.src);
        if (!String(text).trim()) { toast("Write the script first."); return; }
        whatsapp((t.dataset.title || "").replace(/[^\x20-\x7E]/g, "").trim() + "\n" + prettyDate(dateVal()) +
          "\nAs shared by my pastor.\n\n" + text + "\n\nL137 \u00B7 Luke 1:37");
        return;
      }
      /* expand / collapse */
      if (t.id === "dsExpandBtn" || t.id === "dsCollapseBtn") {
        var openAll = t.id === "dsExpandBtn";
        Array.prototype.forEach.call(document.querySelectorAll("#layerHost .stephead"), function (b) {
          b.setAttribute("aria-expanded", openAll ? "true" : "false");
          document.getElementById(b.getAttribute("aria-controls")).hidden = !openAll;
        });
        if (openAll) renderParagraphs();
        return;
      }
      /* golden page */
      if (t.id === "goldenOpenBtn" || t.id === "goldenNavBtn") { openGolden(); return; }
      if (t.id === "goldenClose") { closeGolden(); return; }
      if (t.id === "goldenPrint") { printGolden(); return; }
      if (t.id === "goldenSave") { saveGolden(); return; }
      /* library */
      if (t.id === "libNavBtn") {
        var sec = $("library");
        if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (t.id === "libAddBtn") {
        var man = $("libManual");
        if (libAdd(activeTab, man.value)) man.value = "";
        return;
      }
      if (t.id === "libExport") { download("l137-library-" + activeTab + ".txt", libText()); return; }
      if (t.id === "libShare") { whatsapp(libText()); return; }
      /* ministry */
      if (t.id === "minRebuild") { renderMinistry(); toast("Eight outputs rebuilt"); return; }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !$("goldenWrap").hidden) closeGolden();
    });
  }

  /* =================================================================
     INIT
     ================================================================= */
  function bootFor(date, rec) {
    loadStudyFor(date, rec);
    /* auto-seed the scripture chain with today's anchor verse in the middle */
    if (!STUDY.chain.length && (anchorRef() || anchorVerse())) {
      STUDY.chain = [
        { ref: "", text: "", note: "", anchor: false },
        { ref: anchorRef(), text: anchorVerse(), note: "Today's anchor verse", anchor: true },
        { ref: "", text: "", note: "", anchor: false }
      ];
    }
    renderLayers({});
    renderLibrary();
    renderMinistry();
    if (!$("goldenWrap").hidden) renderGolden();
    updateGoldenCount();
  }

  function init() {
    if (!$("layerHost")) return;
    wireDelegates();
    bootFor(dateVal(), null);

    /* the main app broadcasts whenever a day is loaded (today, history, new day) */
    document.addEventListener("juice:apply", function (e) {
      var d = (e.detail && e.detail.date) || dateVal();
      bootFor(d, e.detail);
    });

    /* keep the eight outputs and the chart-ish summaries fresh as the 7 steps are filled */
    var t = null;
    document.addEventListener("input", function (ev) {
      if (!ev.target.closest) return;
      if (!ev.target.closest("#main")) return;
      clearTimeout(t);
      t = setTimeout(function () { renderMinistry(); }, 1200);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
