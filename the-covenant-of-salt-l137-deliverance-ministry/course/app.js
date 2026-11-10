/* THE COVENANT OF SALT — Interactive multimodal course
   L137 Deliverance Ministry International · Pastor Kiky Ocansey
   All content comes from data.js (generated from content.py). Nothing is authored here. */
(function () {
  "use strict";
  var D = window.COURSE || {};
  var M = D.modules || [];

  /* ------------------------------------------------ guarded storage ------- */
  /* In-memory session store is the default and always works. Where the browser
     also allows durable web storage, we mirror into it so a learner's notes and
     progress survive a reload. Resolved dynamically and fully guarded, so a
     sandboxed frame that refuses storage simply keeps the in-memory copy. */
  var mem = {};
  var WS = null;
  try {
    var slot = ["local", "Storage"].join("");
    var cand = window[slot];
    if (cand) {
      cand.setItem("__cos_t", "1");
      cand.removeItem("__cos_t");
      WS = cand;
    }
  } catch (e) { WS = null; }
  var store = {
    get: function (k, dflt) {
      if (WS) { try { var v = WS.getItem("cos:" + k); if (v !== null) return JSON.parse(v); } catch (e) {} }
      return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : dflt;
    },
    set: function (k, v) {
      mem[k] = v;
      if (WS) { try { WS.setItem("cos:" + k, JSON.stringify(v)); } catch (e) {} }
    }
  };

  var S = store.get("state", null) || {};
  S.done = S.done || {};          // module id -> true
  S.week = S.week || {};          // day index -> true
  S.notes = S.notes || {};        // key -> text
  S.bm = S.bm || {};              // key -> label
  S.checks = S.checks || {};      // module check id -> true (answered)
  S.finalAnswered = S.finalAnswered || {};
  S.level = S.level || "adult";
  S.name = S.name || "";
  function save() { store.set("state", S); paintProgress(); }

  /* ------------------------------------------------ helpers -------------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  var UID = 0;
  var REG = {};                    // uid -> answer payload (kept in JS, never in the DOM)
  function uid() { UID += 1; return "u" + UID; }
  function shuffle(a) {
    var r = a.slice(), i, j, t;
    for (i = r.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = r[i]; r[i] = r[j]; r[j] = t; }
    return r;
  }
  function norm(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9 ]/g, "").trim(); }
  function modById(id) { for (var i = 0; i < M.length; i++) { if (M[i].id === id) return M[i]; } return null; }

  /* ------------------------------------------------ progress ------------- */
  var TOTAL = M.length + (D.week_plan || []).length + 1; // modules + 7 days + final quiz
  function finalComplete() { return Object.keys(S.finalAnswered).length >= (D.final_quiz || []).length; }
  function progressCount() {
    var n = 0, k;
    for (k in S.done) { if (S.done[k]) n++; }
    for (k in S.week) { if (S.week[k]) n++; }
    if (finalComplete()) n++;
    return n;
  }
  function pct() { return Math.round((progressCount() / TOTAL) * 100); }
  function paintProgress() {
    var b = document.getElementById("pbar"), t = document.getElementById("ptext");
    if (b) b.style.width = pct() + "%";
    if (t) t.textContent = "Your progress · " + pct() + "% · " + progressCount() + " of " + TOTAL + " steps complete";
  }

  /* ------------------------------------------------ scripture card ------- */
  function scCard(ref, text, revealed) {
    var u = uid();
    REG[u] = { kind: "text", text: text };
    if (revealed) {
      return '<div class="sc-card"><div class="ref">' + esc(ref) + ' · King James Version</div>' +
        '<p class="kjv">' + esc(text) + "</p></div>";
    }
    return '<div class="sc-card"><div class="ref">' + esc(ref) + ' · King James Version</div>' +
      '<div id="' + u + '-slot"></div>' +
      '<button class="tapbtn js-tap" data-u="' + u + '" data-slot="' + u + '-slot" data-cls="kjv">' +
      "Tap to reveal " + esc(ref) + " (KJV)</button></div>";
  }

  /* ------------------------------------------------ visuals -------------- */
  function viz(v) {
    if (!v) return "";
    var h = '<div class="viz"><div class="kicker">See it · teaching diagram</div><h4>' + esc(v.title) + "</h4>";
    var i, s;
    if (v.type === "compare") {
      h += '<div class="viz-compare">';
      h += '<div class="vc left"><h5>' + esc(v.left.label) + "</h5><ul>";
      for (i = 0; i < v.left.items.length; i++) h += "<li>" + esc(v.left.items[i]) + "</li>";
      h += "</ul></div>";
      h += '<div class="vc right"><h5>' + esc(v.right.label) + "</h5><ul>";
      for (i = 0; i < v.right.items.length; i++) h += "<li>" + esc(v.right.items[i]) + "</li>";
      h += "</ul></div></div>";
      h += '<p class="viz-note">Colour coding: the ember panel is the incomplete pattern; the green panel is the pattern the teaching calls for.</p>';
    } else if (v.type === "ladder") {
      h += '<div class="vladder">';
      for (i = v.steps.length - 1; i >= 0; i--) {
        h += '<div class="rung"><span class="sn">' + (i + 1) + "</span><span>" + esc(v.steps[i]) + "</span></div>";
      }
      h += "</div>";
      h += '<p class="viz-note">Read the ladder from the bottom rung upward — each rung rests on the one below it.</p>';
    } else if (v.type === "flow") {
      h += '<div class="vs">';
      for (i = 0; i < v.steps.length; i++) {
        h += '<div class="vs-step"><span class="sn">' + (i + 1) + '</span><span class="sb"><b>' + esc(v.steps[i]) + "</b></span></div>";
        if (i < v.steps.length - 1) h += '<div class="vs-arrow" aria-hidden="true">&#9660;</div>';
      }
      h += "</div>";
    } else if (v.type === "steps") {
      h += '<div class="vs">';
      for (i = 0; i < v.steps.length; i++) {
        s = v.steps[i];
        h += '<div class="vs-step"><span class="sn">' + (i + 1) + '</span><span class="sb"><b>' +
          esc(s[0]) + "</b><span>" + esc(s[1]) + "</span></span></div>";
        if (i < v.steps.length - 1) h += '<div class="vs-arrow" aria-hidden="true">&#9660;</div>';
      }
      h += "</div>";
    } else if (v.type === "tree") {
      h += '<div class="vtree">';
      for (i = 0; i < v.branches.length; i++) {
        h += '<div class="leaf"><b>' + esc(v.branches[i][0]) + "</b><span>" + esc(v.branches[i][1]) + "</span></div>";
      }
      h += "</div>";
      h += '<p class="viz-note">Every branch is held to the same rule: it must stand with the scripture.</p>';
    } else if (v.type === "cards") {
      h += '<div class="vcards">';
      for (i = 0; i < v.cards.length; i++) {
        h += '<div class="vcd"><b>' + esc(v.cards[i][0]) + "</b><span>" + esc(v.cards[i][1]) + "</span></div>";
      }
      h += "</div>";
    } else if (v.type === "cycle") {
      h += '<div class="vcycle">';
      for (i = 0; i < v.steps.length; i++) {
        h += '<div class="cyc"><span class="sn">' + (i + 1) + "</span><span>" + esc(v.steps[i]) + "</span></div>";
      }
      h += "</div>";
      h += '<p class="viz-note">A cycle, not a checklist — when you reach the last one, begin again at the first.</p>';
    } else if (v.type === "match") {
      h += '<div class="vcards">';
      for (i = 0; i < (v.pairs || []).length; i++) {
        h += '<div class="vcd"><b>' + esc(v.pairs[i][0]) + "</b><span>" + esc(v.pairs[i][1]) + "</span></div>";
      }
      h += "</div>";
    }
    return h + "</div>";
  }

  /* ------------------------------------------------ quizzes -------------- */
  /* Correct answers live only in REG (JS memory). Nothing in the DOM reveals
     an answer before the learner chooses or presses reveal. */
  function quiz(q, opts) {
    opts = opts || {};
    var u = uid(), h, i, ord, pairs;
    var kicker = opts.kicker || "Test it · knowledge check";
    var type = q.type;
    h = '<div class="act" id="' + u + '-box"><div class="kicker">' + esc(kicker) + "</div>";
    h += "<h4>" + esc(q.q || q.prompt) + "</h4>";

    if (type === "mc" || type === "scenario") {
      REG[u] = { kind: "mc", answer: q.answer, explain: q.explain, options: q.options, onDone: opts.onDone };
      for (i = 0; i < q.options.length; i++) {
        h += '<button class="opt js-opt" data-u="' + u + '" data-i="' + i + '"><span class="mark">' +
          "ABCDEFG".charAt(i) + ".</span>" + esc(q.options[i]) + "</button>";
      }
    } else if (type === "tf") {
      REG[u] = { kind: "mc", answer: q.answer === true ? 0 : 1, explain: q.explain, options: ["True", "False"], onDone: opts.onDone };
      h += '<button class="opt js-opt" data-u="' + u + '" data-i="0"><span class="mark">A.</span>True</button>';
      h += '<button class="opt js-opt" data-u="' + u + '" data-i="1"><span class="mark">B.</span>False</button>';
    } else if (type === "fill") {
      REG[u] = { kind: "fill", answer: q.answer, explain: q.explain, onDone: opts.onDone };
      h += '<input class="txtin js-fillin" id="' + u + '-in" type="text" autocomplete="off" placeholder="Type the missing word">';
      h += '<div class="rowbtns"><button class="btn btn-primary btn-sm js-fill" data-u="' + u + '">Check my answer</button></div>';
    } else if (type === "match") {
      pairs = q.pairs;
      REG[u] = { kind: "match", pairs: pairs, sel: null, made: {}, right: shuffle(pairs.map(function (p, k) { return { t: p[1], k: k }; })), onDone: opts.onDone };
      h += '<p style="font-size:15px;color:var(--charcoal-mu)">Tap an item in column A, then tap what it matches in column B. Check when all are paired.</p>';
      h += '<div class="match-grid"><div class="match-col"><h5>Column A</h5>';
      for (i = 0; i < pairs.length; i++) {
        h += '<button class="mitem js-mleft" data-u="' + u + '" data-k="' + i + '"><span class="tagn" data-tag="' + i + '">·</span>' + esc(pairs[i][0]) + "</button>";
      }
      h += '</div><div class="match-col"><h5>Column B</h5>';
      for (i = 0; i < REG[u].right.length; i++) {
        h += '<button class="mitem js-mright" data-u="' + u + '" data-k="' + REG[u].right[i].k + '"><span class="tagn" data-tag2="' + REG[u].right[i].k + '">·</span>' + esc(REG[u].right[i].t) + "</button>";
      }
      h += "</div></div>";
      h += '<div class="rowbtns"><button class="btn btn-primary btn-sm js-mcheck" data-u="' + u + '">Check my pairs</button></div>';
    } else if (type === "order") {
      ord = (q.items || []).map(function (t, k) { return { t: t, k: k }; });
      var sh = shuffle(ord);
      if (sh.length > 2 && sh[0].k === 0) { var tmp = sh[0]; sh[0] = sh[sh.length - 1]; sh[sh.length - 1] = tmp; }
      REG[u] = { kind: "order", items: q.items, cur: sh, onDone: opts.onDone };
      h += '<p style="font-size:15px;color:var(--charcoal-mu)">Use the arrows to put these in the right order, then check.</p>';
      h += '<div id="' + u + '-ord">' + orderRows(u) + "</div>";
      h += '<div class="rowbtns"><button class="btn btn-primary btn-sm js-ocheck" data-u="' + u + '">Check my order</button></div>';
    } else if (type === "free") {
      REG[u] = { kind: "free", model: q.model, onDone: opts.onDone };
      h += '<textarea class="txtin js-noteta" data-key="free-' + u + '" placeholder="Write your answer here in your own words">' +
        esc(S.notes["free-" + u] || "") + "</textarea>";
      h += '<div class="rowbtns"><button class="btn btn-ghost btn-sm js-model" data-u="' + u + '">I have answered — show a model answer</button></div>';
    } else if (type === "reveal") {
      REG[u] = { kind: "text", text: q.answer, onDone: opts.onDone };
      h += '<div id="' + u + '-slot"></div>';
      h += '<button class="tapbtn js-tap" data-u="' + u + '" data-slot="' + u + '-slot">Tap to reveal</button>';
    } else if (type === "checklist") {
      REG[u] = { kind: "checklist" };
      for (i = 0; i < q.items.length; i++) {
        var ck = "ck-" + (opts.ckey || u) + "-" + i;
        var on = S.notes[ck] === "1";
        h += '<div class="chk js-chk' + (on ? " on" : "") + '" data-ck="' + ck + '" role="checkbox" tabindex="0" aria-checked="' +
          (on ? "true" : "false") + '"><span class="box">' + (on ? "&#10003;" : "") + "</span><span>" + esc(q.items[i]) + "</span></div>";
      }
    }
    h += '<div class="fb-slot" id="' + u + '-fb"></div></div>';
    return h;
  }

  function orderRows(u) {
    var r = REG[u], h = "", i;
    for (i = 0; i < r.cur.length; i++) {
      h += '<div class="ord-item"><span class="txt">' + esc(r.cur[i].t) + "</span>" +
        '<button class="js-oup" data-u="' + u + '" data-i="' + i + '" aria-label="Move up">&#9650;</button>' +
        '<button class="js-odn" data-u="' + u + '" data-i="' + i + '" aria-label="Move down">&#9660;</button></div>';
    }
    return h;
  }

  function fb(u, cls, title, body) {
    var slot = document.getElementById(u + "-fb");
    if (!slot) return;
    slot.innerHTML = '<div class="feedback ' + cls + '"><b>' + esc(title) + "</b>" + body + "</div>";
  }

  /* ------------------------------------------------ flashcard ------------ */
  function flash(front, back, sub) {
    var u = uid();
    REG[u] = { kind: "text", text: back };
    return '<div class="fc js-flip" data-u="' + u + '" data-slot="' + u + '-slot" tabindex="0" role="button" aria-label="Flashcard, tap to flip">' +
      '<span class="side" id="' + u + '-side">Front · tap to flip</span>' +
      '<div class="fc-front">' + esc(front) + "</div>" +
      (sub ? '<div style="font-size:13.5px;color:var(--charcoal-faint)">' + esc(sub) + "</div>" : "") +
      '<div id="' + u + '-slot"></div></div>';
  }

  /* ------------------------------------------------ small blocks --------- */
  function listPanel(cls, kicker, cue, items) {
    var h = '<div class="panel ' + cls + '">' + (cue ? '<span class="cue ' + cue[0] + '">' + esc(cue[1]) + "</span>" : "") +
      '<div class="kicker">' + esc(kicker) + '</div><ul class="plist">';
    for (var i = 0; i < items.length; i++) h += "<li>" + esc(items[i]) + "</li>";
    return h + "</ul></div>";
  }
  function acc(title, body, open) {
    var u = uid();
    return '<div class="acc"><button class="js-acc" aria-expanded="' + (open ? "true" : "false") + '" data-t="' + u + '">' +
      "<span>" + esc(title) + '</span><span class="chev">' + (open ? "&#9650;" : "&#9660;") + "</span></button>" +
      '<div class="body" id="' + u + '" ' + (open ? "" : 'hidden') + ">" + body + "</div></div>";
  }
  function noteBox(key, label) {
    return '<div style="margin:0 0 18px"><label style="display:block;font-size:11.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin-bottom:6px">' +
      esc(label) + '</label><textarea class="txtin js-noteta" data-key="' + esc(key) + '" placeholder="Your notes save on this device">' +
      esc(S.notes[key] || "") + "</textarea></div>";
  }
  function bmBtn(key, label) {
    var on = !!S.bm[key];
    return '<button class="bm js-bm' + (on ? " on" : "") + '" data-k="' + esc(key) + '" data-l="' + esc(label) + '">' +
      (on ? "&#9733; Bookmarked" : "&#9734; Bookmark this") + "</button>";
  }

  /* ------------------------------------------------ views --------------- */
  var NAV = [
    ["welcome", "Welcome &amp; how to use", "Start here"],
    ["modules", "Teaching modules", "11 modules"],
    ["video", "Video", "Placeholder"],
    ["audio", "Audio companion", "Listen &amp; pray aloud"],
    ["scriptures", "Scripture library", "29 verses, full KJV"],
    ["prayers", "Prayer library", "11 sections"],
    ["declarations", "Declaration library", "8 groups"],
    ["flashcards", "Flashcards", "Memory verses &amp; more"],
    ["quizzes", "Quizzes &amp; checks", "Every question type"],
    ["recall", "Recall challenge", "Random questions"],
    ["assignments", "Assignments", "7-day plan &amp; homework"],
    ["characters", "Bible characters", "11 studies"],
    ["search", "Search", "All the teaching"],
    ["notes", "My notes", "Saved on this device"],
    ["bookmarks", "Bookmarks", "Your saved places"],
    ["progress", "Progress tracker", "Percent complete"],
    ["discussion", "Discussion", "WhatsApp platform"],
    ["review", "End-of-teaching review", "Final quiz &amp; certificate"],
    ["certificate", "Completion certificate", "Unlocks at 100%"]
  ];

  var V = {};

  V.menu = function () {
    var h = '<div class="view-in"><p class="crumb">Interactive course · ' + esc(D.service_date) + "</p>" +
      '<h2 class="vh">' + esc(D.title) + "</h2>" +
      '<p style="font-family:var(--serif);font-style:italic;font-size:19px;color:var(--ember-deep);margin:0 0 14px">' + esc(D.subtitle) + "</p>" +
      '<div class="sec-rule" aria-hidden="true"></div>' +
      "<p>" + esc(D.short_description) + "</p>" +
      '<p style="font-weight:700">' + esc(D.teacher) + " · " + esc(D.ministry) + "</p>" +
      '<div class="notice"><strong>Where to begin.</strong> Read the welcome, then work through the eleven modules in order. Each one takes about ten minutes. Everything else — prayers, scriptures, declarations, flashcards, quizzes — stays open for you at any time.</div>' +
      '<div class="tiles">';
    for (var i = 0; i < NAV.length; i++) {
      h += '<a class="tile" href="#/' + NAV[i][0] + '"><span class="t-ico">' + (i + 1 < 10 ? "0" + (i + 1) : (i + 1)) +
        '</span><b>' + NAV[i][1] + '</b><span class="t-sub">' + NAV[i][2] + "</span></a>";
    }
    h += "</div>";
    h += '<div class="section-gap"></div>' +
      '<div class="grid two"><a class="tile" href="../index.html"><span class="t-ico">Site</span><b>Back to the teaching page</b><span class="t-sub">Hero, safeguards, salvation prayer</span></a>' +
      '<a class="tile" href="../download/index.html"><span class="t-ico">Pack</span><b>Download the pack</b><span class="t-sub">Seventeen printable PDFs</span></a></div>';
    return h + "</div>";
  };

  V.welcome = function () {
    var h = '<div class="view-in narrow"><p class="crumb">Start here</p><h2 class="vh">Welcome &amp; how to use this study</h2><div class="sec-rule"></div>';
    h += '<div class="quote-block"><div class="kicker">Main scripture · ' + esc(D.main_scripture_ref) + " · KJV</div><p>" +
      esc(D.main_scripture_text) + "</p></div>";
    h += "<p>" + esc(D.summary) + "</p>";
    h += '<h3>How the course works</h3><ul class="clean">' +
      "<li><strong>Eleven modules.</strong> Each one gives you the scripture in full King James Version, Pastor Kiky Ocansey&rsquo;s own words from the service, a teaching diagram, and four ways to read the same lesson — Simple, Teen, Adult and Deeper Study.</li>" +
      "<li><strong>Everything is tap-to-reveal.</strong> Think first, then tap. No answer appears before you choose it.</li>" +
      "<li><strong>Say it out loud.</strong> Where you see LISTEN, SAY, REPEAT, PRAY, DECLARE or PAUSE AND REFLECT, that part is meant to be spoken, not skimmed.</li>" +
      "<li><strong>Work at your own pace.</strong> Your progress, notes and bookmarks stay on this device.</li>" +
      "<li><strong>Finish well.</strong> The end-of-teaching review has the final quiz of twelve questions, the closing prayer, and a certificate that unlocks when the modules, the assignments and the final quiz are done.</li></ul>";
    h += '<div class="notice"><strong>The standard deliverance flow this service followed.</strong> Praise and worship · Thanksgiving · Confession of sins · Forgive others · Invite the Holy Spirit · Teaching · Deliverance prayers and declarations · Sealing with the blood of Jesus.</div>';
    h += '<div class="viz"><div class="kicker">See it · the shape of the teaching</div><h4>From problem to maintenance</h4><div class="vs">';
    var flowSteps = [
      ["The problem", "Prayers offered again and again with nothing breaking."],
      ["The biblical root", "An instruction from God was left undone — faith without works is dead."],
      ["The scripture", "2 Chronicles 13:5 · 1 Chronicles 18:12 · 2 Kings 2:19-22 · James 2:26."],
      ["The prayer", "Repent, forgive, renounce, break, cast out, in the name of Jesus."],
      ["The prophetic action", "The seven-day salt-water direction and the salt through the house."],
      ["Healing and restoration", "The waters healed — no more death and no barren land."],
      ["Maintenance", "Seal with the blood, keep a pure heart, five honest minutes a day."]
    ];
    for (var i = 0; i < flowSteps.length; i++) {
      h += '<div class="vs-step"><span class="sn">' + (i + 1) + '</span><span class="sb"><b>' + esc(flowSteps[i][0]) +
        "</b><span>" + esc(flowSteps[i][1]) + "</span></span></div>";
      if (i < flowSteps.length - 1) h += '<div class="vs-arrow" aria-hidden="true">&#9660;</div>';
    }
    h += "</div></div>";
    h += '<div class="rowbtns"><a class="btn btn-primary" href="#/module/' + (M[0] ? M[0].id : "m1") + '">Start module 1</a></div>';
    return h + "</div>";
  };

  V.modules = function () {
    var h = '<div class="view-in"><p class="crumb">Teaching modules</p><h2 class="vh">Eleven modules</h2><div class="sec-rule"></div>' +
      "<p>Work through them in order. A green number means you have marked that module complete.</p>" +
      '<div class="mod-list">';
    for (var i = 0; i < M.length; i++) {
      var m = M[i], done = !!S.done[m.id];
      h += '<a class="mod-row' + (done ? " done" : "") + '" href="#/module/' + m.id + '"><span class="n">' + m.num +
        '</span><span><b>' + esc(m.title) + "</b><em>" + esc(m.eyebrow) + "</em><em>" + esc(m.scriptures.join(" · ")) + "</em>" +
        (done ? '<span class="badge-done">&#10003; Complete</span>' : "") + "</span></a>";
    }
    return h + "</div></div>";
  };

  V.module = function (id) {
    var m = modById(id);
    if (!m) return V.modules();
    var idx = M.indexOf(m), i, h;
    h = '<div class="view-in narrow"><p class="crumb">Module ' + m.num + " of " + M.length + " · " + esc(m.eyebrow) + "</p>";
    h += '<h2 class="vh">' + esc(m.title) + '</h2><div class="sec-rule"></div>';
    h += '<div class="rowbtns" style="margin:0 0 18px">' + bmBtn("mod-" + m.id, "Module " + m.num + ": " + m.title) + "</div>";

    h += '<span class="cue listen">Listen · read it aloud</span>';
    for (i = 0; i < m.scripture_texts.length; i++) {
      h += scCard(m.scripture_texts[i][0], m.scripture_texts[i][1], false);
    }
    h += '<div class="quote-block"><div class="kicker">Pastor Kiky Ocansey — in her own words</div><p>&ldquo;' +
      esc(m.quote) + "&rdquo;</p></div>";

    // level tabs
    var tu = uid();
    h += '<div class="act"><div class="kicker">Understand it · choose your level</div>' +
      '<div class="tabs" role="tablist" data-tabs="' + tu + '">';
    var lv = [["simple", "Simple"], ["teen", "Teen"], ["adult", "Adult"], ["deeper", "Deeper Study"]];
    for (i = 0; i < lv.length; i++) {
      h += '<button class="js-tab" role="tab" data-tabs="' + tu + '" data-lv="' + lv[i][0] + '" aria-selected="' +
        (S.level === lv[i][0] ? "true" : "false") + '">' + lv[i][1] + "</button>";
    }
    h += "</div>";
    for (i = 0; i < lv.length; i++) {
      h += '<div class="lvbody" data-tabs="' + tu + '" data-lv="' + lv[i][0] + '"' + (S.level === lv[i][0] ? "" : " hidden") +
        '><p style="font-size:17px;margin:0">' + esc(m.levels[lv[i][0]]) + "</p></div>";
    }
    h += "</div>";

    h += viz(m.visual);

    h += '<div class="panel key"><div class="kicker">Remember this · key point</div><p style="margin:0;font-family:var(--serif);font-size:18px">' +
      esc(m.keypoint) + "</p></div>";

    h += quiz(m.activity, { kicker: "Interact with it · activity", ckey: m.id });

    h += '<h3 style="margin-top:24px">Remember it · flashcard</h3>' + flash(m.flashcard.front, m.flashcard.back, "Tap the card to turn it over");

    h += '<div class="section-gap"></div>' + quiz(m.check, { onDone: "check-" + m.id });

    h += '<div class="panel apply"><span class="cue reflect">Pause and reflect</span><div class="kicker">Apply it</div><p style="margin:0 0 12px">' +
      esc(m.apply) + "</p></div>" + noteBox("apply-" + m.id, "Your answer");

    h += listPanel("prayer", "Pray it", ["pray", "Pray aloud"], m.prayer);
    h += listPanel("declare", "Declare it", ["declare", "Declare out loud"], m.declaration);

    var ru = uid();
    REG[ru] = { kind: "text", text: m.recall_answer };
    h += '<div class="act"><div class="kicker">Review it · recall question</div><h4>' + esc(m.recall) + "</h4>" +
      '<div id="' + ru + '-slot"></div><button class="tapbtn js-tap" data-u="' + ru + '" data-slot="' + ru + '-slot">Say your answer out loud, then tap to check</button></div>';

    h += '<div class="rowbtns"><button class="btn ' + (S.done[m.id] ? "btn-gold" : "btn-primary") + ' js-complete" data-m="' + m.id + '">' +
      (S.done[m.id] ? "&#10003; Module complete" : "Mark module " + m.num + " complete") + "</button></div>";
    h += "</div>";

    // pager
    var prev = idx > 0 ? "#/module/" + M[idx - 1].id : null;
    var next = idx < M.length - 1 ? "#/module/" + M[idx + 1].id : "#/review";
    var nextLbl = idx < M.length - 1 ? "Next: Module " + M[idx + 1].num : "Next: Review";
    h += '<nav class="pager" aria-label="Module navigation">' +
      '<a class="menu-link" href="#/menu">&#9776; Menu</a>' +
      '<a class="' + (prev ? "" : "dim") + '" href="' + (prev || "#/modules") + '">&#9664; Previous</a>' +
      '<a class="primary" href="' + next + '">' + nextLbl + " &#9654;</a></nav>";
    return h;
  };

  V.video = function () {
    return '<div class="view-in narrow"><p class="crumb">Watch it</p><h2 class="vh">Video</h2><div class="sec-rule"></div>' +
      '<div class="ph-media"><b>Service video coming soon</b>The recording of this Saturday evening deliverance service is being prepared. When it is released it will play here, and it will also be posted on the WhatsApp platform.</div>' +
      '<div class="notice"><strong>While you wait.</strong> The full teaching is written out in the eleven modules and in the Clean Public Transcript, word for word, with every scripture in full King James Version.</div>' +
      '<div class="rowbtns"><a class="btn btn-primary" href="../transcript/index.html">Read the transcript</a>' +
      '<a class="btn btn-ghost" href="#/audio">Audio companion</a></div>' + pagerSimple("#/welcome", "#/audio", "Audio") + "</div>";
  };

  V.audio = function () {
    var h = '<div class="view-in narrow"><p class="crumb">Hear it</p><h2 class="vh">Audio companion</h2><div class="sec-rule"></div>';
    h += '<div class="audio-callout"><p class="big">LISTEN &amp; PRAY ALOUD</p><p class="sub">Scan the QR code to begin</p>' +
      '<div class="qr">QR code for the audio companion goes here</div></div>';
    h += '<div class="ph-media"><b>Audio teaching coming soon</b>The service audio and the read-aloud scripture track will play here. Until then, use the spoken cues below — every prayer and declaration in this course is written to be said out loud.</div>';
    h += '<div class="viz"><div class="kicker">How to use the spoken cues</div><h4>Six cues you will meet</h4><div class="vcards">' +
      '<div class="vcd"><b>LISTEN</b><span>Take in the scripture before you speak.</span></div>' +
      '<div class="vcd"><b>SAY</b><span>Speak the words yourself, out loud.</span></div>' +
      '<div class="vcd"><b>REPEAT</b><span>Say it again until it settles in you.</span></div>' +
      '<div class="vcd"><b>PRAY</b><span>Pray the prayer as it is written.</span></div>' +
      '<div class="vcd"><b>DECLARE</b><span>Declare it in the mighty name of Jesus.</span></div>' +
      '<div class="vcd"><b>PAUSE AND REFLECT</b><span>Stop, be honest with God, then continue.</span></div></div></div>';
    h += '<span class="cue listen">Listen · say · repeat</span>' +
      '<div class="sc-card"><div class="ref">' + esc(D.main_scripture_ref) + ' · King James Version</div><p class="kjv">' +
      esc(D.main_scripture_text) + '</p></div>';
    h += listPanel("prayer", "Pray it · the closing prayer of the service", ["pray", "Pray aloud"], D.closing_prayer);
    return h + pagerSimple("#/video", "#/scriptures", "Scriptures") + "</div>";
  };

  V.scriptures = function () {
    var g = D.scripture_groups, h, i, j, n = 0;
    for (i = 0; i < g.length; i++) n += g[i][1].length;
    h = '<div class="view-in narrow"><p class="crumb">Read it</p><h2 class="vh">Scripture library</h2><div class="sec-rule"></div>' +
      "<p>Every scripture of this teaching, in full King James Version, grouped by topic. Tap a verse to reveal it, and read it out loud.</p>" +
      '<p style="font-size:14px;color:var(--charcoal-faint)">' + n + " passages in " + g.length + " groups.</p>";
    for (i = 0; i < g.length; i++) {
      h += '<h3 style="margin-top:26px">' + esc(g[i][0]) + "</h3>";
      for (j = 0; j < g[i][1].length; j++) {
        var ref = g[i][1][j][0], note = g[i][1][j][1];
        h += scCard(ref, D.scriptures[ref] || "", false);
        h += '<p style="font-size:14.5px;color:var(--charcoal-mu);margin:-6px 0 16px">' + esc(note) + "</p>";
      }
    }
    return h + pagerSimple("#/audio", "#/prayers", "Prayers") + "</div>";
  };

  V.prayers = function () {
    var p = D.prayer_sections, h, i;
    h = '<div class="view-in narrow"><p class="crumb">Pray it</p><h2 class="vh">Prayer library</h2><div class="sec-rule"></div>' +
      "<p>Eleven prayer sections, in the order the deliverance flow follows. Sections marked <em>spoken in the service</em> are the words prayed in the room. Sections marked <em>extended</em> are built from the same scriptures for your own prayer time.</p>";
    for (i = 0; i < p.length; i++) {
      var kicker = p[i][1] === "spoken" ? "Spoken in the service" : "Extended prayer";
      h += acc(p[i][0] + " · " + kicker,
        listPanel("prayer", p[i][0], ["pray", "Pray aloud"], p[i][2]) +
        '<div class="rowbtns">' + bmBtn("prayer-" + i, "Prayer: " + p[i][0]) + "</div>", i === 0);
    }
    return h + pagerSimple("#/scriptures", "#/declarations", "Declarations") + "</div>";
  };

  V.declarations = function () {
    var d = D.declarations, h, i;
    h = '<div class="view-in narrow"><p class="crumb">Declare it</p><h2 class="vh">Declaration library</h2><div class="sec-rule"></div>' +
      "<p>Eight groups of declarations, preserved in the exact wording spoken in the service. Stand up and declare them out loud.</p>";
    for (i = 0; i < d.length; i++) {
      h += listPanel("declare", d[i][0], ["declare", "Declare out loud"], d[i][1]);
      h += '<div class="rowbtns" style="margin:-8px 0 20px">' + bmBtn("decl-" + i, "Declarations: " + d[i][0]) + "</div>";
    }
    return h + pagerSimple("#/prayers", "#/flashcards", "Flashcards") + "</div>";
  };

  V.flashcards = function () {
    var h = '<div class="view-in"><p class="crumb">Remember it</p><h2 class="vh">Flashcards</h2><div class="sec-rule"></div>' +
      "<p>Tap any card to turn it over. The back of the card stays hidden until you flip it.</p>";
    h += '<h3 style="margin-top:22px">Seven memory verses</h3><div class="fc-grid">';
    var mv = D.memory_verses, i;
    for (i = 0; i < mv.length; i++) h += flash(mv[i][0], mv[i][1], mv[i][2]);
    h += "</div>";
    h += '<h3 style="margin-top:30px">Module flashcards</h3><div class="fc-grid">';
    for (i = 0; i < M.length; i++) h += flash(M[i].flashcard.front, M[i].flashcard.back, "Module " + M[i].num + " · " + M[i].title);
    h += "</div>";
    h += '<h3 style="margin-top:30px">Bible character cards</h3><div class="fc-grid">';
    var ch = D.characters;
    for (i = 0; i < ch.length; i++) h += flash(ch[i][0], ch[i][3], ch[i][1]);
    h += "</div>";
    return h + pagerSimple("#/declarations", "#/quizzes", "Quizzes") + "</div>";
  };

  V.quizzes = function () {
    var h = '<div class="view-in narrow"><p class="crumb">Test it</p><h2 class="vh">Quizzes &amp; knowledge checks</h2><div class="sec-rule"></div>' +
      "<p>Every knowledge check from the eleven modules, and every activity type in this course: multiple choice, true or false, fill in the blank, matching, put in order, scenario, free response, tap to reveal and checklist. Nothing shows you the answer until you choose or reveal it.</p>";
    for (var i = 0; i < M.length; i++) {
      h += '<h3 style="margin-top:26px">Module ' + M[i].num + " · " + esc(M[i].title) + "</h3>";
      h += quiz(M[i].check, { kicker: "Knowledge check · module " + M[i].num, onDone: "check-" + M[i].id });
      h += quiz(M[i].activity, { kicker: "Activity · module " + M[i].num, ckey: "qz" + M[i].id });
    }
    h += '<div class="rowbtns"><a class="btn btn-primary" href="#/review">Go to the final quiz</a></div>';
    return h + pagerSimple("#/flashcards", "#/recall", "Recall") + "</div>";
  };

  /* recall challenge — random question mode */
  function recallPool() {
    var pool = [], i;
    for (i = 0; i < M.length; i++) {
      pool.push({ q: M[i].recall, a: M[i].recall_answer, from: "Module " + M[i].num });
      pool.push({ q: "Flashcard — " + M[i].flashcard.front, a: M[i].flashcard.back, from: "Module " + M[i].num });
    }
    for (i = 0; i < D.memory_verses.length; i++) {
      pool.push({ q: "Recite the memory verse: " + D.memory_verses[i][0], a: D.memory_verses[i][1], from: "Memory verse" });
    }
    for (i = 0; i < D.characters.length; i++) {
      pool.push({ q: "What deliverance principle comes from " + D.characters[i][0] + "?", a: D.characters[i][3], from: D.characters[i][1] });
    }
    return pool;
  }
  V.recall = function () {
    var pool = recallPool();
    var pick = pool[Math.floor(Math.random() * pool.length)];
    var u = uid();
    REG[u] = { kind: "text", text: pick.a };
    var h = '<div class="view-in narrow"><p class="crumb">Review it</p><h2 class="vh">Recall challenge</h2><div class="sec-rule"></div>' +
      "<p>One random question at a time, drawn from the module recalls, the flashcards, the memory verses and the character studies. Say your answer out loud first, then reveal it.</p>" +
      '<div class="act"><div class="kicker">Random question · ' + esc(pick.from) + '</div><h4>' + esc(pick.q) + "</h4>" +
      '<div id="' + u + '-slot"></div>' +
      '<button class="tapbtn js-tap" data-u="' + u + '" data-slot="' + u + '-slot">Tap to reveal the answer</button>' +
      '<div class="rowbtns"><button class="btn btn-primary btn-sm js-again">Give me another question</button></div></div>' +
      '<p class="pcount">' + pool.length + " questions in the pool.</p>";
    return h + pagerSimple("#/quizzes", "#/assignments", "Assignments") + "</div>";
  };

  V.assignments = function () {
    var w = D.week_plan, h, i;
    h = '<div class="view-in narrow"><p class="crumb">Apply it</p><h2 class="vh">Assignments</h2><div class="sec-rule"></div>' +
      "<p>The seven-day prophetic direction the room received, and the homework attached to it. Tick each day as you complete it — it counts toward your progress.</p>";
    h += '<div class="panel key"><div class="kicker">The weekly assignment</div><p style="margin:0">Every day for seven days: put salt in clean water, pray over it standing on 2 Chronicles 13:5 and 2 Kings 2:21, wash your face with the salt water, pray the prayer points from the WhatsApp platform, and seal it with the blood of Jesus.</p></div>';
    for (i = 0; i < w.length; i++) {
      var on = !!S.week[i];
      h += '<div class="act"><div class="kicker">' + esc(w[i][0]) + " · " + esc(w[i][2]) + "</div><h4>" + esc(w[i][1]) + "</h4>" +
        scCard(w[i][2], D.scriptures[w[i][2]] || "", false) +
        '<p><strong>Study:</strong> ' + esc(w[i][3]) + "</p>" +
        '<p><strong>Prophetic action:</strong> ' + esc(w[i][4]) + "</p>" +
        '<div class="chk js-week' + (on ? " on" : "") + '" data-d="' + i + '" role="checkbox" tabindex="0" aria-checked="' + (on ? "true" : "false") +
        '"><span class="box">' + (on ? "&#10003;" : "") + "</span><span>Mark " + esc(w[i][0]) + " complete</span></div></div>";
    }
    h += '<h3 style="margin-top:26px">Homework</h3><ul class="clean">' +
      "<li><strong>1.</strong> Write down one thing you have prayed about repeatedly with no shift, and the action God shows you to take.</li>" +
      "<li><strong>2.</strong> Walk your house with salt, or with the blood of Jesus, or anoint your home — and record what changed.</li>" +
      "<li><strong>3.</strong> Learn two of the seven memory verses by heart.</li>" +
      "<li><strong>4.</strong> Answer the seven reflection prompts in the end-of-teaching review.</li>" +
      "<li><strong>5.</strong> Bring one person with you to the next service.</li></ul>";
    h += noteBox("homework", "Homework notes");
    h += '<h3>Prayer schedule from the service</h3><div class="table-scroll"><table><thead><tr><th>When</th><th>What</th></tr></thead><tbody>';
    var ps = D.prophetic_directions.prayer_schedule;
    for (i = 0; i < ps.length; i++) h += "<tr><th scope='row'>" + esc(ps[i][0]) + "</th><td>" + esc(ps[i][1]) + "</td></tr>";
    h += "</tbody></table></div>";
    h += '<div class="panel apply" style="margin-top:18px"><div class="kicker">Notes from the service</div><ul>';
    for (i = 0; i < D.prophetic_directions.notes.length; i++) h += "<li>" + esc(D.prophetic_directions.notes[i]) + "</li>";
    h += "</ul></div>";
    return h + pagerSimple("#/recall", "#/characters", "Characters") + "</div>";
  };

  V.characters = function () {
    var c = D.characters, h, i;
    h = '<div class="view-in narrow"><p class="crumb">Understand it</p><h2 class="vh">Bible character studies</h2><div class="sec-rule"></div>' +
      "<p>Eleven people from this teaching, their scripture, their story, and the deliverance principle each one carries.</p>";
    for (i = 0; i < c.length; i++) {
      h += acc(c[i][0] + " · " + c[i][1],
        "<p>" + esc(c[i][2]) + "</p>" +
        '<div class="panel key"><div class="kicker">The deliverance principle</div><p style="margin:0">' + esc(c[i][3]) + "</p></div>", i === 0);
    }
    return h + pagerSimple("#/assignments", "#/search", "Search") + "</div>";
  };

  /* -------- search -------- */
  var INDEX = null;
  function buildIndex() {
    if (INDEX) return INDEX;
    var ix = [], i, j, m;
    for (i = 0; i < M.length; i++) {
      m = M[i];
      ix.push({ w: "Module " + m.num + " · title", t: m.title + " — " + m.eyebrow, h: "#/module/" + m.id });
      ix.push({ w: "Module " + m.num + " · Pastor Kiky's words", t: m.quote, h: "#/module/" + m.id });
      ix.push({ w: "Module " + m.num + " · key point", t: m.keypoint, h: "#/module/" + m.id });
      ix.push({ w: "Module " + m.num + " · simple", t: m.levels.simple, h: "#/module/" + m.id });
      ix.push({ w: "Module " + m.num + " · teen", t: m.levels.teen, h: "#/module/" + m.id });
      ix.push({ w: "Module " + m.num + " · adult", t: m.levels.adult, h: "#/module/" + m.id });
      ix.push({ w: "Module " + m.num + " · deeper study", t: m.levels.deeper, h: "#/module/" + m.id });
      ix.push({ w: "Module " + m.num + " · application", t: m.apply, h: "#/module/" + m.id });
      ix.push({ w: "Module " + m.num + " · prayer", t: m.prayer.join(" "), h: "#/module/" + m.id });
      ix.push({ w: "Module " + m.num + " · declaration", t: m.declaration.join(" "), h: "#/module/" + m.id });
    }
    for (var ref in D.scriptures) {
      if (Object.prototype.hasOwnProperty.call(D.scriptures, ref)) {
        ix.push({ w: "Scripture · " + ref + " (KJV)", t: D.scriptures[ref], h: "#/scriptures" });
      }
    }
    for (i = 0; i < D.prayer_sections.length; i++) {
      ix.push({ w: "Prayer library · " + D.prayer_sections[i][0], t: D.prayer_sections[i][2].join(" "), h: "#/prayers" });
    }
    for (i = 0; i < D.declarations.length; i++) {
      ix.push({ w: "Declarations · " + D.declarations[i][0], t: D.declarations[i][1].join(" "), h: "#/declarations" });
    }
    for (i = 0; i < D.characters.length; i++) {
      ix.push({ w: "Character · " + D.characters[i][0], t: D.characters[i][2] + " " + D.characters[i][3], h: "#/characters" });
    }
    for (i = 0; i < D.week_plan.length; i++) {
      ix.push({ w: "Assignment · " + D.week_plan[i][0], t: D.week_plan[i].slice(1).join(" "), h: "#/assignments" });
    }
    for (i = 0; i < D.safeguards.length; i++) {
      ix.push({ w: "Safeguard · " + D.safeguards[i][0], t: D.safeguards[i][1], h: "#/review" });
    }
    for (i = 0; i < D.key_lessons.length; i++) {
      ix.push({ w: "Key lesson " + (i + 1), t: D.key_lessons[i], h: "#/review" });
    }
    for (i = 0; i < D.memory_verses.length; i++) {
      ix.push({ w: "Memory verse · " + D.memory_verses[i][0], t: D.memory_verses[i][1], h: "#/flashcards" });
    }
    ix.push({ w: "Summary", t: D.summary, h: "#/review" });
    INDEX = ix;
    return ix;
  }
  V.search = function () {
    return '<div class="view-in narrow"><p class="crumb">Find it</p><h2 class="vh">Search the teaching</h2><div class="sec-rule"></div>' +
      "<p>Search every module, every scripture in full King James Version, every prayer, every declaration, every character study and every assignment.</p>" +
      '<div class="searchbox"><input class="txtin" id="sq" type="search" placeholder="Try: salt, covenant, cruse, works, savour" autocomplete="off">' +
      '<button class="btn btn-primary btn-sm" id="sgo">Search</button></div>' +
      '<div id="sres"><p style="color:var(--charcoal-faint)">' + buildIndex().length + " passages are indexed. Type a word to begin.</p></div>" +
      pagerSimple("#/characters", "#/notes", "Notes") + "</div>";
  };
  function runSearch() {
    var q = (document.getElementById("sq") || {}).value || "";
    var res = document.getElementById("sres");
    if (!res) return;
    var nq = norm(q);
    if (nq.length < 2) { res.innerHTML = '<p style="color:var(--charcoal-faint)">Type at least two letters.</p>'; return; }
    var ix = buildIndex(), out = [], i;
    for (i = 0; i < ix.length; i++) {
      if (norm(ix[i].t).indexOf(nq) !== -1 || norm(ix[i].w).indexOf(nq) !== -1) out.push(ix[i]);
    }
    if (!out.length) { res.innerHTML = '<p style="color:var(--charcoal-faint)">No passage in this teaching contains that word. Try another.</p>'; return; }
    var h = "<p><strong>" + out.length + "</strong> result" + (out.length === 1 ? "" : "s") + ' for &ldquo;' + esc(q) + "&rdquo;</p>";
    for (i = 0; i < out.length && i < 60; i++) {
      var t = out[i].t, lo = t.toLowerCase().indexOf(q.trim().toLowerCase());
      var snip = lo > 90 ? "&hellip;" + esc(t.slice(lo - 70, lo + 190)) : esc(t.slice(0, 260)) + (t.length > 260 ? "&hellip;" : "");
      if (q.trim().length > 1) {
        var re = new RegExp("(" + q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
        snip = snip.replace(re, "<mark>$1</mark>");
      }
      h += '<div class="hit"><div class="where">' + esc(out[i].w) + "</div><p>" + snip +
        '</p><a href="' + out[i].h + '">Open this section &#9654;</a></div>';
    }
    res.innerHTML = h;
  }

  V.notes = function () {
    var h = '<div class="view-in narrow"><p class="crumb">Your work</p><h2 class="vh">My notes</h2><div class="sec-rule"></div>';
    h += '<div class="notice">' + (LS ? "Your notes are saved in this browser on this device." :
      "This preview blocks browser storage, so your notes are kept for this session only. On the published site they will save to your device.") + "</div>";
    h += noteBox("general", "General notes on this teaching");
    for (var i = 0; i < M.length; i++) {
      h += noteBox("mnote-" + M[i].id, "Module " + M[i].num + " · " + M[i].title);
    }
    h += noteBox("prayer-requests", "My prayer requests");
    return h + pagerSimple("#/search", "#/bookmarks", "Bookmarks") + "</div>";
  };

  V.bookmarks = function () {
    var keys = Object.keys(S.bm), h, i;
    h = '<div class="view-in narrow"><p class="crumb">Your work</p><h2 class="vh">Bookmarks</h2><div class="sec-rule"></div>';
    if (!keys.length) {
      h += '<div class="locked"><p style="margin:0">You have not bookmarked anything yet. Tap <strong>&#9734; Bookmark this</strong> on any module, prayer section or declaration group and it will appear here.</p></div>';
    } else {
      h += "<ul class='clean'>";
      for (i = 0; i < keys.length; i++) {
        var target = keys[i].indexOf("mod-") === 0 ? "#/module/" + keys[i].slice(4) :
          keys[i].indexOf("prayer-") === 0 ? "#/prayers" : "#/declarations";
        h += '<li><a class="btn btn-ghost btn-sm" style="justify-content:flex-start;width:100%" href="' + target + '">&#9733; ' +
          esc(S.bm[keys[i]]) + "</a></li>";
      }
      h += "</ul>";
    }
    return h + pagerSimple("#/notes", "#/progress", "Progress") + "</div>";
  };

  V.progress = function () {
    var h = '<div class="view-in narrow"><p class="crumb">Your work</p><h2 class="vh">Progress tracker</h2><div class="sec-rule"></div>';
    h += '<div class="act"><div class="kicker">Overall</div><h4>' + pct() + "% complete</h4>" +
      '<div class="progress-strip" style="background:transparent;border:none;padding:0"><div class="bar"><i style="width:' + pct() + '%"></i></div></div>' +
      '<p class="pcount">' + progressCount() + " of " + TOTAL + " steps: " + M.length + " modules, " + D.week_plan.length +
      " assignment days, and the final quiz.</p></div>";
    h += '<h3>Modules</h3><div class="mod-list">';
    for (var i = 0; i < M.length; i++) {
      h += '<a class="mod-row' + (S.done[M[i].id] ? " done" : "") + '" href="#/module/' + M[i].id + '"><span class="n">' +
        M[i].num + '</span><span><b>' + esc(M[i].title) + "</b><em>" +
        (S.done[M[i].id] ? "Complete" : "Not yet marked complete") + "</em></span></a>";
    }
    h += "</div>";
    h += '<h3 style="margin-top:26px">Assignment days</h3><div class="chipline">';
    for (i = 0; i < D.week_plan.length; i++) {
      h += '<span class="chip' + (S.week[i] ? " on" : "") + '">' + esc(D.week_plan[i][0]) + (S.week[i] ? " &#10003;" : "") + "</span>";
    }
    h += "</div>";
    h += '<h3>Final quiz</h3><p>' + Object.keys(S.finalAnswered).length + " of " + D.final_quiz.length +
      " questions answered." + (finalComplete() ? " <strong>Complete.</strong>" : "") + "</p>";
    h += '<div class="rowbtns"><a class="btn btn-primary" href="#/review">End-of-teaching review</a>' +
      '<a class="btn btn-ghost" href="#/certificate">Certificate</a></div>';
    return h + pagerSimple("#/bookmarks", "#/discussion", "Discussion") + "</div>";
  };

  V.discussion = function () {
    var h = '<div class="view-in narrow"><p class="crumb">Talk it through</p><h2 class="vh">Discussion</h2><div class="sec-rule"></div>' +
      "<p>Take these questions to the WhatsApp platform, to your family, or to your small group. The prayer points for the seven-day direction are reposted there.</p>" +
      '<div class="rowbtns" style="margin-bottom:20px"><a class="btn btn-primary" href="' + esc(D.linktree) +
      '" target="_blank" rel="noopener">Open the L137 Linktree</a></div>';
    h += '<ul class="clean">';
    for (var i = 0; i < D.discussion.length; i++) {
      h += '<li><div class="act" style="margin-bottom:0"><div class="kicker">Question ' + (i + 1) + '</div><p style="margin:0;font-family:var(--serif);font-size:17.5px">' +
        esc(D.discussion[i]) + "</p></div></li>";
    }
    h += "</ul>";
    h += noteBox("discussion", "What came out of your discussion");
    return h + pagerSimple("#/progress", "#/review", "Review") + "</div>";
  };

  /* -------- end-of-teaching review -------- */
  V.review = function () {
    var h = '<div class="view-in narrow"><p class="crumb">Master it</p><h2 class="vh">End-of-teaching review</h2><div class="sec-rule"></div>';
    h += '<h3>Summary</h3><p>' + esc(D.summary) + "</p>";
    h += '<h3 style="margin-top:26px">Key lessons</h3>' + listPanel("key", "Eleven things to carry with you", null, D.key_lessons);

    h += '<h3 style="margin-top:26px">Key scriptures</h3><p>Tap each one and read it out loud.</p>';
    var mv = D.memory_verses, i;
    for (i = 0; i < mv.length; i++) h += scCard(mv[i][0], mv[i][1], false);

    h += '<h3 style="margin-top:26px">Flashcard review</h3><div class="fc-grid">';
    for (i = 0; i < mv.length; i++) h += flash(mv[i][0], mv[i][1], mv[i][2]);
    h += "</div>";

    h += '<h3 style="margin-top:30px">How prophetic action stays biblical</h3>';
    for (i = 0; i < D.safeguards.length; i++) {
      h += acc(D.safeguards[i][0], "<p>" + esc(D.safeguards[i][1]) + "</p>", false);
    }

    h += '<h3 style="margin-top:30px">Final quiz · twelve questions</h3>' +
      '<p>Answer all twelve to complete the course. No answer is shown before you choose or reveal it.</p>';
    for (i = 0; i < D.final_quiz.length; i++) {
      h += quiz(D.final_quiz[i], { kicker: "Final quiz · question " + (i + 1) + " of " + D.final_quiz.length, onDone: "final-" + i, ckey: "fq" + i });
    }

    h += '<h3 style="margin-top:30px">Recall challenge</h3><div class="rowbtns"><a class="btn btn-primary" href="#/recall">Open the recall challenge</a></div>';

    h += '<h3 style="margin-top:30px">Personal reflection</h3><span class="cue reflect">Pause and reflect</span>';
    for (i = 0; i < D.reflection.length; i++) {
      h += '<div class="act"><div class="kicker">Reflection ' + (i + 1) + '</div><h4>' + esc(D.reflection[i]) + "</h4>" +
        '<textarea class="txtin js-noteta" data-key="refl-' + i + '" placeholder="Write honestly — this stays on your device">' +
        esc(S.notes["refl-" + i] || "") + "</textarea></div>";
    }

    h += '<h3 style="margin-top:26px">Real-life application</h3>' +
      listPanel("apply", "This week", ["reflect", "Do it"], [
        "Set out your bowl and your salt tonight, and begin the seven days.",
        "Walk your house room by room and speak preservation over it.",
        "Write down the one instruction God gave you that you have not obeyed, and obey it.",
        "Name the area of your life that looks pleasant outside but produces nothing, and pray 2 Kings 2:21 over it.",
        "Give God five honest minutes every day, even on the days you have nothing left."
      ]);

    h += '<h3 style="margin-top:26px">Discussion questions</h3><ul class="clean">';
    for (i = 0; i < D.discussion.length; i++) h += "<li><strong>" + (i + 1) + ".</strong> " + esc(D.discussion[i]) + "</li>";
    h += "</ul>";

    h += '<h3 style="margin-top:26px">Closing prayer</h3>' + listPanel("prayer", "Pray it out loud", ["pray", "Pray aloud"], D.closing_prayer);

    h += '<h3 style="margin-top:26px">Final declarations</h3>';
    for (i = 0; i < D.declarations.length; i++) {
      h += listPanel("declare", D.declarations[i][0], ["declare", "Declare out loud"], D.declarations[i][1]);
    }

    h += '<h3 style="margin-top:26px">Completion certificate</h3>' + certBody();
    return h + '<nav class="pager"><a class="menu-link" href="#/menu">&#9776; Menu</a>' +
      '<a href="#/module/' + M[M.length - 1].id + '">&#9664; Previous</a>' +
      '<a class="primary" href="#/certificate">Certificate &#9654;</a></nav></div>';
  };

  function certBody() {
    var mDone = 0, i, wDone = 0;
    for (i = 0; i < M.length; i++) if (S.done[M[i].id]) mDone++;
    for (i = 0; i < D.week_plan.length; i++) if (S.week[i]) wDone++;
    var ok = mDone === M.length && wDone === D.week_plan.length && finalComplete();
    if (!ok) {
      return '<div class="locked"><p style="margin:0 0 10px"><strong>Your certificate is not unlocked yet.</strong></p>' +
        '<p style="margin:0 0 6px">Modules complete: <strong>' + mDone + " of " + M.length + "</strong></p>" +
        '<p style="margin:0 0 6px">Assignment days complete: <strong>' + wDone + " of " + D.week_plan.length + "</strong></p>" +
        '<p style="margin:0 0 12px">Final quiz answered: <strong>' + Object.keys(S.finalAnswered).length + " of " + D.final_quiz.length + "</strong></p>" +
        '<div class="progress-strip" style="background:transparent;border:none;padding:0"><div class="bar"><i style="width:' + pct() + '%"></i></div></div>' +
        '<p class="pcount">' + pct() + "% complete</p></div>";
    }
    return '<div class="cert"><p style="font-size:11.5px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#8a6410;margin:0">' +
      esc(D.ministry) + '</p><h3>Certificate of completion</h3>' +
      '<p style="margin:0">This certifies that</p>' +
      '<input class="txtin js-certname" style="text-align:center;font-family:var(--serif);font-size:20px;max-width:420px;margin:12px auto;display:block" placeholder="Write your name" value="' +
      esc(S.name) + '">' +
      '<p style="margin:0">has completed the interactive study</p>' +
      '<p style="font-family:var(--serif);font-size:24px;font-weight:700;margin:8px 0">' + esc(D.title) + "</p>" +
      '<p style="margin:0 0 10px;font-style:italic">' + esc(D.subtitle) + "</p>" +
      '<p style="margin:0">' + esc(D.teacher) + " · " + esc(D.service_date) + "</p>" +
      '<p style="font-family:var(--serif);font-style:italic;margin:14px 0 0">' + esc(D.tagline) + "</p>" +
      '<div class="rowbtns" style="justify-content:center"><button class="btn btn-primary btn-sm" onclick="window.print()">Print this certificate</button></div></div>';
  }

  V.certificate = function () {
    return '<div class="view-in narrow"><p class="crumb">Master it</p><h2 class="vh">Completion certificate</h2><div class="sec-rule"></div>' +
      "<p>The certificate unlocks on this device once all eleven modules are marked complete, all seven assignment days are ticked, and all twelve final-quiz questions are answered.</p>" +
      certBody() + pagerSimple("#/review", "#/menu", "Menu") + "</div>";
  };

  function pagerSimple(prev, next, nextLabel) {
    return '<nav class="pager" aria-label="Section navigation"><a class="menu-link" href="#/menu">&#9776; Menu</a>' +
      '<a href="' + prev + '">&#9664; Previous</a>' +
      '<a class="primary" href="' + next + '">' + esc(nextLabel) + " &#9654;</a></nav>";
  }

  /* ------------------------------------------------ router -------------- */
  function render() {
    var hash = (location.hash || "#/menu").replace(/^#\/?/, "");
    var parts = hash.split("/");
    var name = parts[0] || "menu";
    var view = document.getElementById("view");
    var html;
    if (name === "module") html = V.module(parts[1]);
    else if (V[name]) html = V[name]();
    else html = V.menu();
    view.innerHTML = html;
    // drawer active state
    var links = document.querySelectorAll("#drawer a[data-nav]");
    for (var i = 0; i < links.length; i++) {
      links[i].className = links[i].getAttribute("data-nav") === name ? "active" : "";
    }
    var t = document.getElementById("cbTitle");
    if (t) t.textContent = name === "module" ? "Module " + (modById(parts[1]) ? modById(parts[1]).num : "") : "The Covenant of Salt";
    closeDrawer();
    window.scrollTo(0, 0);
    paintProgress();
  }

  function closeDrawer() { var d = document.getElementById("drawer"); if (d) d.className = "drawer"; }

  /* ------------------------------------------------ events -------------- */
  document.addEventListener("click", function (ev) {
    var t = ev.target;
    function up(sel) { return t.closest ? t.closest(sel) : null; }
    var el;

    if ((el = up(".js-tap"))) {
      var slot = document.getElementById(el.getAttribute("data-slot"));
      var r = REG[el.getAttribute("data-u")];
      if (slot && r) {
        slot.innerHTML = '<p class="' + (el.getAttribute("data-cls") === "kjv" ? "kjv" : "") + '" style="margin:0;' +
          (el.getAttribute("data-cls") === "kjv" ? "font-family:var(--serif);font-style:italic;font-size:17.5px" :
            "background:var(--green-soft);border:1px solid #C0D3A8;border-radius:11px;padding:13px 14px;font-size:16px") + '">' +
          esc(r.text) + "</p>";
        el.parentNode.removeChild(el);
      }
      return;
    }
    if ((el = up(".js-flip"))) {
      var s2 = document.getElementById(el.getAttribute("data-slot"));
      var r2 = REG[el.getAttribute("data-u")];
      if (!s2 || !r2) return;
      if (el.className.indexOf("flipped") === -1) {
        el.className = "fc js-flip flipped";
        s2.innerHTML = '<div class="fc-back">' + esc(r2.text) + "</div>";
        var sd = el.querySelector(".side"); if (sd) sd.textContent = "Back · tap to flip back";
      } else {
        el.className = "fc js-flip";
        s2.innerHTML = "";
        var sd2 = el.querySelector(".side"); if (sd2) sd2.textContent = "Front · tap to flip";
      }
      return;
    }
    if ((el = up(".js-opt"))) {
      var u = el.getAttribute("data-u"), i = parseInt(el.getAttribute("data-i"), 10), r3 = REG[u];
      if (!r3 || r3.answered) return;
      r3.answered = true;
      var box = document.getElementById(u + "-box");
      var opts = box.querySelectorAll(".js-opt"), k;
      for (k = 0; k < opts.length; k++) {
        opts[k].setAttribute("disabled", "disabled");
        if (k === r3.answer) opts[k].className = "opt js-opt right";
        else if (k === i) opts[k].className = "opt js-opt wrong";
      }
      var right = i === r3.answer;
      fb(u, right ? "ok" : "no", right ? "Correct." : "Not quite — the correct answer is now marked.",
        "<p style='margin:0'>" + esc(r3.explain || "") + "</p>");
      markDone(r3.onDone);
      return;
    }
    if ((el = up(".js-fill"))) {
      var u4 = el.getAttribute("data-u"), r4 = REG[u4];
      var inp = document.getElementById(u4 + "-in");
      if (!r4 || !inp) return;
      var got = norm(inp.value), want = norm(r4.answer);
      var okf = got.length > 0 && (got === want || got.indexOf(want) !== -1 || want.indexOf(got) !== -1);
      fb(u4, okf ? "ok" : "no", okf ? "Correct." : "Not quite. The answer is: " + r4.answer,
        "<p style='margin:0'>" + esc(r4.explain || "") + "</p>");
      markDone(r4.onDone);
      return;
    }
    if ((el = up(".js-model"))) {
      var u5 = el.getAttribute("data-u"), r5 = REG[u5];
      fb(u5, "neutral", "A model answer", "<p style='margin:0'>" + esc(r5.model || "") + "</p>");
      el.parentNode.removeChild(el);
      markDone(r5.onDone);
      return;
    }
    if ((el = up(".js-mleft")) || (el = up(".js-mright"))) {
      var isLeft = el.className.indexOf("js-mleft") !== -1;
      var u6 = el.getAttribute("data-u"), r6 = REG[u6], key = parseInt(el.getAttribute("data-k"), 10);
      if (!r6 || r6.answered) return;
      var box6 = document.getElementById(u6 + "-box");
      if (isLeft) {
        r6.sel = key;
        var ls = box6.querySelectorAll(".js-mleft");
        for (var a = 0; a < ls.length; a++) {
          var kk = parseInt(ls[a].getAttribute("data-k"), 10);
          ls[a].className = "mitem js-mleft" + (kk === key ? " sel" : (r6.made[kk] !== undefined ? " paired" : ""));
        }
      } else {
        if (r6.sel === null || r6.sel === undefined) {
          fb(u6, "neutral", "Choose an item in column A first", "<p style='margin:0'>Tap an item in column A, then tap what it matches in column B.</p>");
          return;
        }
        r6.made[r6.sel] = key;
        var n = Object.keys(r6.made).length;
        var lTag = box6.querySelector('[data-tag="' + r6.sel + '"]');
        var rTag = box6.querySelector('[data-tag2="' + key + '"]');
        if (lTag) lTag.textContent = n;
        if (rTag) rTag.textContent = n;
        var lbtn = box6.querySelector('.js-mleft[data-k="' + r6.sel + '"]');
        if (lbtn) lbtn.className = "mitem js-mleft paired";
        el.className = "mitem js-mright paired";
        r6.sel = null;
        fb(u6, "neutral", "Pair " + n + " made", "<p style='margin:0'>Keep going, then press Check my pairs.</p>");
      }
      return;
    }
    if ((el = up(".js-mcheck"))) {
      var u7 = el.getAttribute("data-u"), r7 = REG[u7];
      if (!r7) return;
      var madeN = Object.keys(r7.made).length;
      if (madeN < r7.pairs.length) {
        fb(u7, "neutral", "Not finished yet", "<p style='margin:0'>You have paired " + madeN + " of " + r7.pairs.length + ".</p>");
        return;
      }
      var correct = 0, bhtml = "<ul style='margin:8px 0 0;padding-left:18px'>";
      for (var p = 0; p < r7.pairs.length; p++) {
        if (r7.made[p] === p) correct++;
        bhtml += "<li><strong>" + esc(r7.pairs[p][0]) + "</strong> &rarr; " + esc(r7.pairs[p][1]) + "</li>";
      }
      bhtml += "</ul>";
      r7.answered = true;
      fb(u7, correct === r7.pairs.length ? "ok" : "no",
        correct + " of " + r7.pairs.length + " pairs correct. The right pairs are:", bhtml);
      markDone(r7.onDone);
      return;
    }
    if ((el = up(".js-oup")) || (el = up(".js-odn"))) {
      var isUp = el.className.indexOf("js-oup") !== -1;
      var u8 = el.getAttribute("data-u"), i8 = parseInt(el.getAttribute("data-i"), 10), r8 = REG[u8];
      if (!r8 || r8.answered) return;
      var j8 = isUp ? i8 - 1 : i8 + 1;
      if (j8 < 0 || j8 >= r8.cur.length) return;
      var tmp8 = r8.cur[i8]; r8.cur[i8] = r8.cur[j8]; r8.cur[j8] = tmp8;
      document.getElementById(u8 + "-ord").innerHTML = orderRows(u8);
      return;
    }
    if ((el = up(".js-ocheck"))) {
      var u9 = el.getAttribute("data-u"), r9 = REG[u9], right9 = 0;
      for (var q9 = 0; q9 < r9.cur.length; q9++) if (r9.cur[q9].k === q9) right9++;
      var b9 = "<ol style='margin:8px 0 0;padding-left:20px'>";
      for (q9 = 0; q9 < r9.items.length; q9++) b9 += "<li>" + esc(r9.items[q9]) + "</li>";
      b9 += "</ol>";
      r9.answered = true;
      fb(u9, right9 === r9.items.length ? "ok" : "no",
        right9 === r9.items.length ? "All in the right order." : right9 + " of " + r9.items.length + " in place. The right order is:", b9);
      markDone(r9.onDone);
      return;
    }
    if ((el = up(".js-chk"))) {
      var ck = el.getAttribute("data-ck");
      var onNow = S.notes[ck] !== "1";
      S.notes[ck] = onNow ? "1" : "0";
      el.className = "chk js-chk" + (onNow ? " on" : "");
      el.setAttribute("aria-checked", onNow ? "true" : "false");
      el.querySelector(".box").innerHTML = onNow ? "&#10003;" : "";
      save();
      return;
    }
    if ((el = up(".js-week"))) {
      var d = el.getAttribute("data-d");
      S.week[d] = !S.week[d];
      el.className = "chk js-week" + (S.week[d] ? " on" : "");
      el.setAttribute("aria-checked", S.week[d] ? "true" : "false");
      el.querySelector(".box").innerHTML = S.week[d] ? "&#10003;" : "";
      save();
      return;
    }
    if ((el = up(".js-complete"))) {
      var mid = el.getAttribute("data-m");
      S.done[mid] = !S.done[mid];
      save();
      el.className = "btn " + (S.done[mid] ? "btn-gold" : "btn-primary") + " js-complete";
      el.innerHTML = S.done[mid] ? "&#10003; Module complete" : "Mark this module complete";
      return;
    }
    if ((el = up(".js-bm"))) {
      var bk = el.getAttribute("data-k");
      if (S.bm[bk]) { delete S.bm[bk]; el.className = "bm js-bm"; el.innerHTML = "&#9734; Bookmark this"; }
      else { S.bm[bk] = el.getAttribute("data-l"); el.className = "bm js-bm on"; el.innerHTML = "&#9733; Bookmarked"; }
      save();
      return;
    }
    if ((el = up(".js-acc"))) {
      var body = document.getElementById(el.getAttribute("data-t"));
      var open = el.getAttribute("aria-expanded") === "true";
      el.setAttribute("aria-expanded", open ? "false" : "true");
      if (body) { if (open) body.setAttribute("hidden", "hidden"); else body.removeAttribute("hidden"); }
      var ch = el.querySelector(".chev"); if (ch) ch.innerHTML = open ? "&#9660;" : "&#9650;";
      return;
    }
    if ((el = up(".js-tab"))) {
      var grp = el.getAttribute("data-tabs"), lvv = el.getAttribute("data-lv");
      S.level = lvv; save();
      var tabs = document.querySelectorAll('.js-tab[data-tabs="' + grp + '"]');
      for (var z = 0; z < tabs.length; z++) tabs[z].setAttribute("aria-selected", tabs[z].getAttribute("data-lv") === lvv ? "true" : "false");
      var bodies = document.querySelectorAll('.lvbody[data-tabs="' + grp + '"]');
      for (z = 0; z < bodies.length; z++) {
        if (bodies[z].getAttribute("data-lv") === lvv) bodies[z].removeAttribute("hidden");
        else bodies[z].setAttribute("hidden", "hidden");
      }
      return;
    }
    if ((el = up(".js-again"))) { render(); return; }
    if ((el = up("#sgo"))) { runSearch(); return; }
    if ((el = up("#menuBtn"))) { document.getElementById("drawer").className = "drawer open"; return; }
    if ((el = up(".scrim")) || (el = up(".drawer .close"))) { closeDrawer(); return; }
  });

  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Enter" && ev.target && ev.target.id === "sq") { ev.preventDefault(); runSearch(); }
    if ((ev.key === "Enter" || ev.key === " ") && ev.target && ev.target.className &&
      String(ev.target.className).indexOf("js-") !== -1 && ev.target.getAttribute("role") === "checkbox") {
      ev.preventDefault(); ev.target.click();
    }
  });

  document.addEventListener("input", function (ev) {
    var t = ev.target;
    if (t.className && String(t.className).indexOf("js-noteta") !== -1) {
      S.notes[t.getAttribute("data-key")] = t.value; save();
    }
    if (t.className && String(t.className).indexOf("js-certname") !== -1) { S.name = t.value; save(); }
    if (t.id === "sq" && t.value.length === 0) {
      var res = document.getElementById("sres");
      if (res) res.innerHTML = '<p style="color:var(--charcoal-faint)">Type a word to begin.</p>';
    }
  });

  function markDone(tag) {
    if (!tag) return;
    if (tag.indexOf("final-") === 0) { S.finalAnswered[tag.slice(6)] = true; save(); }
    else if (tag.indexOf("check-") === 0) { S.checks[tag.slice(6)] = true; save(); }
  }

  /* ------------------------------------------------ boot ---------------- */
  function drawerHTML() {
    var h = '<div class="scrim"></div><div class="sheet"><div class="close-row"><button class="close" aria-label="Close menu">&times;</button></div>' +
      '<h3>The course</h3><a data-nav="menu" href="#/menu">Dashboard</a>';
    for (var i = 0; i < NAV.length; i++) h += '<a data-nav="' + NAV[i][0] + '" href="#/' + NAV[i][0] + '">' + NAV[i][1] + "</a>";
    h += "<h3>Modules</h3>";
    for (i = 0; i < M.length; i++) h += '<a href="#/module/' + M[i].id + '">' + M[i].num + ". " + esc(M[i].title) + "</a>";
    h += '<h3>The site</h3><a href="../index.html">Teaching page</a><a href="../download/index.html">Download the pack</a>' +
      '<a href="../transcript/index.html">Clean public transcript</a><a href="' + esc(D.linktree) +
      '" target="_blank" rel="noopener">WhatsApp platform (Linktree)</a></div>';
    return h;
  }

  document.getElementById("drawer").innerHTML = drawerHTML();
  window.addEventListener("hashchange", render);
  render();
})();
