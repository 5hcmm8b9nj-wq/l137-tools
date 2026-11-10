/* Breaking Destructive Covenants — private interactive study
   L137 Deliverance Ministry International · Pastor Kiky Ocansey
   All state is stored in this browser only (localStorage). Nothing is uploaded. */
(function () {
  "use strict";
  var C = window.CONTENT;
  var KEY = "l137-bdc-v1";
  var esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
  var $ = function (id) { return document.getElementById(id); };

  /* ── private device storage (falls back to memory if the browser blocks it) ── */
  var MEM = {};
  var STORE = (function () {
    try {
      var s = window[["local", "Storage"].join("")];
      s.setItem("__l137probe", "1"); s.removeItem("__l137probe");
      return s;
    } catch (e) { return null; }
  })();
  function sGet(k) { try { return STORE ? STORE.getItem(k) : (k in MEM ? MEM[k] : null); } catch (e) { return MEM[k] || null; } }
  function sSet(k, v) { try { if (STORE) { STORE.setItem(k, v); return; } } catch (e) {} MEM[k] = v; }
  function sDel(k) { try { if (STORE) { STORE.removeItem(k); } } catch (e) {} delete MEM[k]; }

  /* ── state ───────────────────────────────────────────────── */
  var S = { mods: {}, pts: {}, flow: {}, session: {}, prayers: {}, decl: {}, checklist: {}, journal: {}, notes: {}, free: "", bmk: [], names: [], quiz: {}, quizDone: false, kc: {}, cert: "" };
  try { var raw = sGet(KEY); if (raw) S = Object.assign(S, JSON.parse(raw)); } catch (e) {}
  if (!S.pts) S.pts = {};
  var save = function () { sSet(KEY, JSON.stringify(S)); };
  var flash = function (el) { if (!el) return; el.classList.add("on"); setTimeout(function () { el.classList.remove("on"); }, 1200); };

  /* ── hero ────────────────────────────────────────────────── */
  $("hDate").textContent = C.meta.date + " · " + C.meta.platform;
  $("hTitle").textContent = C.meta.title;
  $("hSub").textContent = C.meta.subtitle;
  $("hRef").textContent = C.meta.mainScripture;
  $("hDesc").textContent = C.meta.description;
  $("ovLead").textContent = C.meta.description;

  var scrCount = C.scriptures.reduce(function (n, s) { return n + s.verses.length; }, 0);
  var decCount = C.declarationGroups.reduce(function (n, g) { return n + g.lines.length; }, 0);
  var prayCount = C.prayerSections.reduce(function (n, p) { return n + p.points.length; }, 0);
  $("mMods").textContent = C.modules.length;
  $("mScr").textContent = scrCount;
  $("mDec").textContent = decCount;
  $("mPrayer").textContent = prayCount;

  /* ── navigation ──────────────────────────────────────────── */
  var NAV = [
    ["Study", [["overview", "Welcome"], ["flow", "Order of service"], ["modules", "Teaching modules"], ["session", "Guided session"]]],
    ["Libraries", [["scripture", "Scripture library"], ["prayers", "Prayer points"], ["declarations", "Declarations"], ["characters", "Character studies"], ["chart", "Flow chart"], ["directions", "Prophetic directions"]]],
    ["Do the work", [["names", "Names worksheet"], ["cards", "Memory verse cards"], ["match", "Match the scripture"], ["checklist", "Checklist"], ["journal", "Reflection journal"], ["quiz", "Knowledge check"], ["notes", "My notes"], ["bookmarks", "Bookmarks"]]],
    ["More", [["search", "Search"], ["media", "Audio & video"], ["downloads", "Download the pack"], ["certificate", "Certificate"], ["transcript", "Source notes"]]]
  ];
  var nav = $("nav"), html = "";
  NAV.forEach(function (g) {
    html += '<div class="grp">' + g[0] + "</div>";
    g[1].forEach(function (it) { html += '<a href="#" data-go="' + it[0] + '">' + it[1] + "</a>"; });
  });
  nav.innerHTML = html;
  function go(id) {
    document.querySelectorAll(".panel").forEach(function (p) { p.classList.toggle("on", p.id === "p-" + id); });
    document.querySelectorAll("nav.side a").forEach(function (a) { a.classList.toggle("on", a.dataset.go === id); });
    if (id === "bookmarks") renderBookmarks();
    if (id === "notes") renderNoteRoll();
    if (id === "certificate") renderCert();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-go]");
    if (t) { e.preventDefault(); go(t.dataset.go); }
  });
  go("overview");

  /* ── overview cards ──────────────────────────────────────── */
  $("ovHow").innerHTML = [
    ["Hear it read aloud", "Every scripture, every declaration, every module and every prayer has a Read aloud button. The study will speak it to you, so nobody has to struggle through the reading."],
    ["Walk the order of service", "The eight stages of the L137 deliverance flow, in the order Pastor Kiky Ocansey led them — praise, thanksgiving, confession, forgiving others, inviting the Holy Spirit, teaching, deliverance, sealing."],
    ["Run the guided session", "A fourteen-step runner for praying the whole service through at home, with a built-in prayer timer you can set from five to sixty minutes."],
    ["Study the fourteen modules", "Every teaching point of the service, with the full KJV scriptures, the prayers that belong to each part, your own notes, and a knowledge check."],
    ["Declare aloud", "The declaration reader shows one line at a time, exactly as spoken, and will read it out to you if you want to hear it first."],
    ["Do the names worksheet", "The prophetic assignment made interactive — add each name, renounce it, mark it, print or save the paper copy."],
    ["Turn the verse cards", "Tap a card to flip it and see the whole verse; tap again to hear it. Then test yourself on Match the scripture."],
    ["Keep your own record", "Notes, journal answers, checklist, bookmarks, quiz results and progress all save on your own device."]
  ].map(function (c) { return '<div class="libcard"><h3>' + c[0] + "</h3><p style=\"margin:8px 0 0\" class=\"note\">" + c[1] + "</p></div>"; }).join("");

  /* ── order of service ────────────────────────────────────── */
  $("flowList").innerHTML = C.flow.map(function (f) {
    var on = S.flow[f.n] ? " done" : "";
    return '<div class="step' + on + '" data-flow="' + f.n + '"><div class="n tnum">' + f.n + "</div><div style=\"flex:1\"><h4>" + esc(f.name) + "</h4><p>" + esc(f.note) + '</p><label class="chk" style="margin-top:8px"><input type="checkbox" data-fchk="' + f.n + '"' + (S.flow[f.n] ? " checked" : "") + "> Completed</label></div></div>";
  }).join("");
  $("flowList").addEventListener("change", function (e) {
    var n = e.target.dataset.fchk; if (!n) return;
    S.flow[n] = e.target.checked; save();
    e.target.closest(".step").classList.toggle("done", e.target.checked);
  });

  /* ── read aloud (browser speech) ─────────────────────────── */
  var SPEECH = ("speechSynthesis" in window);
  var sayingBtn = null;
  function stopSpeak() {
    try { window.speechSynthesis.cancel(); } catch (e) {}
    if (sayingBtn) { sayingBtn.classList.remove("on"); sayingBtn.textContent = sayingBtn.dataset.label || "Read aloud"; sayingBtn = null; }
  }
  function speak(text, btn) {
    if (!SPEECH) { alert("This browser cannot read text aloud. Chrome, Safari and Edge all support it."); return; }
    if (sayingBtn === btn) { stopSpeak(); return; }
    stopSpeak();
    var u = new window.SpeechSynthesisUtterance(text);
    u.rate = 0.9; u.pitch = 1;
    u.onend = function () { stopSpeak(); };
    sayingBtn = btn;
    if (btn) { btn.dataset.label = btn.textContent; btn.classList.add("on"); btn.textContent = "Stop"; }
    try { window.speechSynthesis.speak(u); } catch (e) { stopSpeak(); }
  }
  function sayBtn(kind, key, label) {
    return '<button class="say" data-say="' + kind + ':' + key + '">' + (label || "&#9834; Read aloud") + "</button>";
  }
  function sayText(kind, key) {
    if (kind === "scr") {
      var o = scrByRef(key);
      return o ? (o.ref + ", King James Version. " + o.verses.map(function (v) { return v[1]; }).join(" ")) : "";
    }
    if (kind === "dec") {
      var g = C.declarationGroups[+key];
      return g ? (g.name + ". " + g.lines.join(" ")) : "";
    }
    if (kind === "rd") return $("rdTxt").textContent;
    if (kind === "txt") return decodeURIComponent(key);
    return "";
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-say]");
    if (!b) return;
    e.preventDefault();
    var p = b.dataset.say.split(":");
    speak(sayText(p[0], p.slice(1).join(":")), b);
  });
  window.addEventListener("beforeunload", stopSpeak);

  /* ── scripture helpers ───────────────────────────────────── */
  function scrByRef(ref) { return C.scriptures.filter(function (s) { return s.ref === ref; })[0]; }
  function scrBlock(s, withBmk) {
    var b = withBmk ? '<button class="bmk' + (S.bmk.indexOf("scr:" + s.ref) > -1 ? " on" : "") + '" data-bmk="scr:' + s.ref + '" title="Bookmark">&#9733;</button>' : "";
    return '<div class="block scripture"><div class="kicker" style="display:flex;justify-content:space-between;align-items:center">' +
      "<span>" + esc(s.ref) + " · King James Version</span>" + b + "</div>" +
      s.verses.map(function (v) { return '<div class="v"><b>' + v[0] + "</b>" + esc(v[1]) + "</div>"; }).join("") +
      (s.asDelivered ? '<div class="asdel">' + esc(s.asDelivered) + "</div>" : "") +
      '<div class="saybar">' + sayBtn("scr", s.ref) + "</div></div>";
  }

  /* ── modules ─────────────────────────────────────────────── */
  function stageClass(stage) {
    var s = (stage || "").toLowerCase();
    if (s.indexOf("deliverance") > -1) return "st-deliv";
    if (s.indexOf("seal") > -1) return "st-seal";
    if (s.indexOf("teaching") > -1) return "st-teach";
    if (s.indexOf("prophetic") > -1) return "st-prop";
    return "st-praise";
  }
  function firstSentence(t) {
    var m = t.match(/^([\s\S]{20,140}?[.!?—])(\s|$)/);
    if (m) return m[1].trim();
    return t.length > 130 ? t.slice(0, 130).trim() + "…" : t;
  }
  function pointTags(text) {
    var out = [];
    var t = text;
    var refs = [
      "Psalm 100:4", "Psalm 92", "Psalm 32", "Ephesians 4:31", "Matthew 3:11",
      "Colossians 2:14", "Galatians 3:13", "Genesis 31:44", "Genesis 31:45",
      "1 Samuel 18:3", "Genesis 6:18", "Isaiah 28:18", "Matthew 26:28",
      "Isaiah 54:17", "Hosea 4:6", "Romans 10:13", "Luke 1:37", "Micah 7:19", "1 John 1:9", "Jeremiah 22:29"
    ];
    refs.forEach(function (r) { if (t.indexOf(r) > -1) out.push('<span class="tag scr">' + esc(r) + "</span>"); });
    if (/\bblood of Jesus\b/i.test(t)) out.push('<span class="tag">Blood of Jesus</span>');
    if (/renounce|denounce/i.test(t)) out.push('<span class="tag warn">Renounce</span>');
    if (/covenant/i.test(t)) out.push('<span class="tag">Covenant</span>');
    if (/Holy (Ghost|Spirit)/i.test(t)) out.push('<span class="tag">Holy Spirit</span>');
    if (/altar/i.test(t)) out.push('<span class="tag warn">Altar</span>');
    if (/seed/i.test(t)) out.push('<span class="tag">Seed</span>');
    return out.slice(0, 3).join("");
  }
  function pointCard(mid, idx, text) {
    var pid = mid + ":p" + idx;
    var done = !!S.pts[pid];
    var isBmk = S.bmk.indexOf("pt:" + pid) > -1;
    return '<div class="pt' + (done ? " done" : "") + '" data-pt="' + pid + '">' +
      '<div class="h" data-toggle="1"><div class="n">' + (idx + 1) + "</div>" +
      '<div class="lead">' + esc(firstSentence(text)) + "</div>" +
      '<div class="chev">&#9662;</div></div>' +
      '<div class="body"><p>' + esc(text) + "</p>" +
      '<div class="tags">' + pointTags(text) + "</div>" +
      '<div class="toolrow">' +
        sayBtn("txt", encodeURIComponent(text), "&#9834; Read aloud") +
        '<button data-ptcopy="' + pid + '">Copy</button>' +
        '<button class="bmk' + (isBmk ? " on" : "") + '" data-bmk="pt:' + pid + '">' + (isBmk ? "★ Saved" : "☆ Save") + "</button>" +
        '<button class="mark" data-ptdone="' + pid + '">' + (done ? "✓ Studied" : "Mark studied") + "</button>" +
      "</div></div></div>";
  }
  function renderModules() {
    $("modList").innerHTML = C.modules.map(function (m, i) {
      var done = !!S.mods[m.id];
      var scrs = "";
      m.scriptures.forEach(function (r) { var o = scrByRef(r); if (o) scrs += scrBlock(o, true); });
      var pr = m.prayers.length ? '<div class="block prayer"><div class="kicker">Pray this aloud</div><ul>' + m.prayers.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + '</ul><div class="saybar">' + sayBtn("txt", encodeURIComponent("Pray this aloud. " + m.prayers.join(" ")), "&#9834; Pray this aloud") + "</div></div>" : "";
      var kc = "";
      if (m.check) {
        var st = S.kc[m.id];
        kc = '<div class="kc" data-kc="' + m.id + '"><div class="q">Knowledge check · ' + esc(m.check.q) + "</div>" +
          m.check.a.map(function (a, j) {
            var cls = "";
            if (st !== undefined) cls = (j === m.check.correct ? " right" : (j === st ? " wrong" : ""));
            return '<button data-kco="' + j + '" class="' + cls + '">' + esc(a) + "</button>";
          }).join("") +
          '<div class="fb">' + (st === undefined ? "" : (st === m.check.correct ? "Correct." : "Not quite — the answer is highlighted.")) + "</div></div>";
      }
      var cards = '<div class="pt-controls"><button data-ptall="open:' + m.id + '">Open all points</button>' +
        '<button data-ptall="close:' + m.id + '">Close all</button></div>' +
        '<div class="pt-grid" data-mgrid="' + m.id + '">' + m.points.map(function (p, k) { return pointCard(m.id, k, p); }).join("") + "</div>";
      return '<div class="mod' + (done ? " done" : "") + '" data-mod="' + m.id + '">' +
        '<div class="head" data-toggle="1"><div class="num tnum">' + (i + 1) + "</div>" +
        '<div class="titles"><span class="stag ' + stageClass(m.stage) + '">' + esc(m.stage) + '</span><h3>' + esc(m.title) + '</h3>' +
        '<span class="stat' + (done ? " ok" : "") + '" style="font-family:var(--sans);font-size:11px;letter-spacing:.06em;color:var(--charcoal-mu);margin-top:4px;display:block">' + m.points.length + " teaching points" + (m.prayers.length ? " · " + m.prayers.length + " prayer" + (m.prayers.length > 1 ? "s" : "") : "") + (m.scriptures.length ? " · " + m.scriptures.length + " scripture" + (m.scriptures.length > 1 ? "s" : "") : "") + "</span></div>" +
        '<div class="chev">&#9662;</div></div><div class="body">' +
        cards + scrs + pr + kc +
        '<div class="tools"><label class="chk"><input type="checkbox" data-mchk="' + m.id + '"' + (done ? " checked" : "") + "> Mark module complete</label></div>" +
        '<div style="margin-top:12px"><label class="chk" style="margin-bottom:6px">My note on this module</label>' +
        '<textarea data-note="' + m.id + '" placeholder="What did the Lord show you here?">' + esc(S.notes[m.id] || "") + "</textarea>" +
        '<span class="saved" data-saved="' + m.id + '">Saved</span></div>' +
        "</div></div>";
    }).join("");
  }
  renderModules();

  var modList = $("modList");
  modList.addEventListener("click", function (e) {
    if (e.target.closest("[data-say]") || e.target.closest(".toolrow")) {
      // let toolrow buttons handle themselves without collapsing the point
    }
    var pcopy = e.target.closest("[data-ptcopy]");
    if (pcopy) {
      var pid = pcopy.dataset.ptcopy, ids = pid.split(":p"), mm = C.modules.filter(function (x) { return x.id === ids[0]; })[0];
      var txt = mm ? mm.points[+ids[1]] : "";
      try { navigator.clipboard.writeText(txt); pcopy.textContent = "Copied"; setTimeout(function () { pcopy.textContent = "Copy"; }, 1200); } catch (er) {}
      return;
    }
    var pdone = e.target.closest("[data-ptdone]");
    if (pdone) {
      var id2 = pdone.dataset.ptdone;
      S.pts[id2] = !S.pts[id2]; save();
      var card = pdone.closest(".pt");
      card.classList.toggle("done", S.pts[id2]);
      pdone.textContent = S.pts[id2] ? "✓ Studied" : "Mark studied";
      return;
    }
    var pall = e.target.closest("[data-ptall]");
    if (pall) {
      var parts = pall.dataset.ptall.split(":"), grid = modList.querySelector('[data-mgrid="' + parts[1] + '"]');
      if (grid) grid.querySelectorAll(".pt").forEach(function (p) { p.classList.toggle("open", parts[0] === "open"); });
      return;
    }
    var pth = e.target.closest(".pt > .h"); if (pth && !e.target.closest(".toolrow")) { pth.parentElement.classList.toggle("open"); return; }
    if (e.target.closest(".mod > .head[data-toggle]")) { e.target.closest(".mod").classList.toggle("open"); return; }
    var b = e.target.closest("[data-bmk]"); if (b) { toggleBmk(b.dataset.bmk, b); return; }
    var o = e.target.closest("[data-kco]");
    if (o) {
      var box = o.closest("[data-kc]"), id = box.dataset.kc;
      var m = C.modules.filter(function (x) { return x.id === id; })[0];
      S.kc[id] = +o.dataset.kco; save();
      box.querySelectorAll("button").forEach(function (btn, j) {
        btn.classList.toggle("right", j === m.check.correct);
        btn.classList.toggle("wrong", j === S.kc[id] && j !== m.check.correct);
      });
      box.querySelector(".fb").textContent = (S.kc[id] === m.check.correct) ? "Correct." : "Not quite — the answer is highlighted.";
    }
  });
  modList.addEventListener("change", function (e) {
    var id = e.target.dataset.mchk; if (!id) return;
    S.mods[id] = e.target.checked; save();
    e.target.closest(".mod").classList.toggle("done", e.target.checked);
    updateProgress();
  });
  modList.addEventListener("input", function (e) {
    var id = e.target.dataset.note; if (!id) return;
    S.notes[id] = e.target.value; save();
    flash(modList.querySelector('[data-saved="' + id + '"]'));
  });
  $("expandAll").addEventListener("click", function () { modList.querySelectorAll(".mod").forEach(function (m) { m.classList.add("open"); }); });
  $("collapseAll").addEventListener("click", function () { modList.querySelectorAll(".mod").forEach(function (m) { m.classList.remove("open"); }); });

  /* ── guided session ──────────────────────────────────────── */
  var SESSION = [
    { t: "Praise and worship", d: "Enter His gates with thanksgiving and His courts with praise — Psalm 100:4. Lift your voice where you are and activate His presence in the room.", s: "Psalm 100:4" },
    { t: "Thanksgiving", d: "Read Psalm 92 verse one to fifteen aloud as a thanksgiving prayer over the atmosphere of your home, your workplace, your car — wherever you are. Then thank Him for life, protection, provision, health and family.", s: "Psalm 92:1-15" },
    { t: "Confession of sins", d: "Ask the Lord to wash you and cleanse you, to create in you a clean heart and renew a right spirit within you, so that every barrier of sin, every legal ground of the enemy and every accusation is removed.", s: "Psalm 32:1-2" },
    { t: "Forgive others", d: "Let all bitterness, wrath, anger, clamour and evil speaking be put away from you, with all malice. Forgive as God for Christ's sake hath forgiven you.", s: "Ephesians 4:31-32" },
    { t: "Invite the Holy Spirit", d: "Ask the Holy Ghost to go ahead of you, to baptize you with the fire of the Lord, to destroy every barrier that would stop your deliverance, and to reveal the covenants you have forgotten.", s: "Matthew 3:11" },
    { t: "Receive the teaching", d: "Work through the fourteen modules. Do not rush this stage — the teaching is what exposes the agreement so it can be renounced.", s: "" },
    { t: "Recall and renounce", d: "Close your eyes and bow your head. Look back to your father's house, your mother's house, and into your own life, and begin to recall every covenant — the ones you know, and the ones made on your behalf.", s: "" },
    { t: "Break the covenant by the blood", d: "Take the communion wine. If you do not have the blood, take water that represents the blood of Jesus. Speak the words directly into the cup you are holding, then drink.", s: "Isaiah 28:18" },
    { t: "Speak the declarations aloud", d: "Declare every line in the declaration library exactly as it was spoken in the service, including every repetition.", s: "" },
    { t: "Anoint yourself and place the blessing", d: "Take your oil and place the blessings of the Lord upon yourself: no more poverty, no more sickness, no more evil dedication. Mention every blessing as you anoint.", s: "" },
    { t: "Write and renounce the names", d: "Take the paper and the pen. Write the names down, then renounce and disconnect from each one. Use the names worksheet in this study to keep the record.", s: "" },
    { t: "Place your seed on the altar of God", d: "You gave seed to others to place on other altars for you; now place a seed on the altar of God and cancel every demonic seed placed on your behalf.", s: "" },
    { t: "Thanksgiving", d: "Thank the Lord for deliverance, restoration, healing, protection and victory — for every chain broken and every yoke destroyed.", s: "" },
    { t: "Sealing — cover with the blood", d: "Cover yourself and your household with the blood of Jesus. Ask for His angels to surround you, that no evil come near your dwelling, and for peaceful sleep. No weapon formed against you shall prosper.", s: "Isaiah 54:17" }
  ];
  var sess = { cur: 0 };
  function drawStepnav() {
    $("stepnav").innerHTML = SESSION.map(function (st, i) {
      return '<button data-step="' + i + '" class="' + (S.session[i] ? "done" : "") + (sess.cur === i ? " cur" : "") + '"><span class="n">' + (S.session[i] ? "✓" : (i + 1)) + "</span>" + esc(st.t) + "</button>";
    }).join("");
  }
  function drawStep() {
    var i = sess.cur, st = SESSION[i], s = st.s ? scrByRef(st.s) : null, done = !!S.session[i];
    var next = (i < SESSION.length - 1) ? '<button class="go" data-sgo="' + (i + 1) + '">Next step ›</button>' : "";
    var prev = (i > 0) ? '<button data-sgo="' + (i - 1) + '">‹ Previous</button>' : "";
    $("stepview").className = "stepview" + (done ? " done" : "");
    $("stepview").innerHTML =
      '<div class="n">Step ' + (i + 1) + " of " + SESSION.length + "</div>" +
      "<h4>" + esc(st.t) + "</h4>" +
      '<p class="big">' + esc(st.d) + "</p>" +
      (s ? '<div style="margin-top:18px">' + scrBlock(s, false) + "</div>" : "") +
      '<div class="actions">' + prev +
        '<button data-sdone="' + i + '" class="mark">' + (done ? "✓ Done" : "Mark this step done") + "</button>" +
        '<button data-say="txt:' + encodeURIComponent(st.t + ". " + st.d) + '" class="say">&#9834; Read aloud</button>' +
        next + "</div>";
    drawStepnav();
  }
  drawStep();
  $("stepnav").addEventListener("click", function (e) {
    var b = e.target.closest("[data-step]"); if (!b) return;
    sess.cur = +b.dataset.step; drawStep();
  });
  $("stepview").addEventListener("click", function (e) {
    var go = e.target.closest("[data-sgo]");
    if (go) { sess.cur = +go.dataset.sgo; drawStep(); window.scrollTo({ top: $("p-session").offsetTop - 30, behavior: "smooth" }); return; }
    var d = e.target.closest("[data-sdone]");
    if (d) { var idx = +d.dataset.sdone; S.session[idx] = !S.session[idx]; save(); drawStep(); }
  });

  /* ── scripture library ───────────────────────────────────── */
  (function () {
    var topics = [], byTopic = {};
    C.scriptures.forEach(function (s) { if (!byTopic[s.topic]) { byTopic[s.topic] = []; topics.push(s.topic); } byTopic[s.topic].push(s); });
    $("scrList").innerHTML = topics.map(function (t) {
      return '<h3 class="topic-h">' + esc(t) + "</h3>" + byTopic[t].map(function (s) { return scrBlock(s, true); }).join("");
    }).join("");
  })();
  $("scrList").addEventListener("click", function (e) { var b = e.target.closest("[data-bmk]"); if (b) toggleBmk(b.dataset.bmk, b); });

  /* ── prayer library ──────────────────────────────────────── */
  $("prayList").innerHTML = C.prayerSections.map(function (sec, i) {
    return '<div class="libcard" style="margin-bottom:14px"><div class="ref">Section ' + (i + 1) + "</div><h3>" + esc(sec.name) + "</h3>" +
      sec.points.map(function (p, j) {
        var k = i + "-" + j;
        return '<label class="chk" style="margin:11px 0;align-items:flex-start"><input type="checkbox" data-pray="' + k + '"' + (S.prayers[k] ? " checked" : "") + "><span>" + esc(p) + "</span></label>";
      }).join("") + "</div>";
  }).join("");
  $("prayList").addEventListener("change", function (e) {
    var k = e.target.dataset.pray; if (!k) return; S.prayers[k] = e.target.checked; save(); updateProgress();
  });

  /* ── declarations ────────────────────────────────────────── */
  $("decList").innerHTML = C.declarationGroups.map(function (g, i) {
    return '<div class="block declare"><div class="kicker" style="display:flex;justify-content:space-between;align-items:center"><span>Declare out loud · ' + esc(g.name) + "</span>" +
      '<button class="bmk' + (S.bmk.indexOf("dec:" + i) > -1 ? " on" : "") + '" data-bmk="dec:' + i + '" title="Bookmark">&#9733;</button></div><ul>' +
      g.lines.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + '</ul><div class="saybar">' +
      sayBtn("dec", i, "&#9834; Read this set aloud") + "</div></div>";
  }).join("");
  $("decList").addEventListener("click", function (e) { var b = e.target.closest("[data-bmk]"); if (b) toggleBmk(b.dataset.bmk, b); });

  var rd = { g: 0, i: 0 };
  $("rdSel").innerHTML = C.declarationGroups.map(function (g, i) { return '<option value="' + i + '">' + esc(g.name) + "</option>"; }).join("");
  function drawReader() {
    var g = C.declarationGroups[rd.g];
    $("rdMeta").textContent = g.name + " · " + (rd.i + 1) + " of " + g.lines.length;
    $("rdTxt").textContent = g.lines[rd.i];
  }
  $("rdSel").addEventListener("change", function () { rd.g = +this.value; rd.i = 0; drawReader(); });
  $("rdNext").addEventListener("click", function () {
    var g = C.declarationGroups[rd.g];
    if (rd.i < g.lines.length - 1) rd.i++;
    else if (rd.g < C.declarationGroups.length - 1) { rd.g++; rd.i = 0; $("rdSel").value = rd.g; }
    drawReader();
  });
  $("rdPrev").addEventListener("click", function () {
    if (rd.i > 0) rd.i--;
    else if (rd.g > 0) { rd.g--; $("rdSel").value = rd.g; rd.i = C.declarationGroups[rd.g].lines.length - 1; }
    drawReader();
  });
  drawReader();

  /* ── names worksheet ─────────────────────────────────────── */
  var nDecl = C.declarationGroups.filter(function (g) { return g.name.indexOf("Renouncing Written Names") === 0; })[0];
  $("nDecl").innerHTML = (nDecl ? nDecl.lines : []).map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("");
  function renderNames() {
    $("nBody").innerHTML = S.names.map(function (n, i) {
      return '<tr class="' + (n.done ? "done" : "") + '"><td class="nm">' + esc(n.name) + "</td><td>" + esc(n.kind) + "</td><td>" + esc(n.note || "—") +
        '</td><td><input type="checkbox" data-ndone="' + i + '"' + (n.done ? " checked" : "") + '></td><td><button class="del" data-ndel="' + i + '">Remove</button></td></tr>';
    }).join("");
    $("nEmpty").style.display = S.names.length ? "none" : "block";
  }
  renderNames();
  $("nAdd").addEventListener("click", function () {
    var v = $("nName").value.trim(); if (!v) { $("nName").focus(); return; }
    S.names.push({ name: v, kind: $("nKind").value, note: $("nNote").value.trim(), done: false });
    $("nName").value = ""; $("nNote").value = ""; save(); renderNames();
  });
  $("nName").addEventListener("keydown", function (e) { if (e.key === "Enter") $("nAdd").click(); });
  $("nBody").addEventListener("change", function (e) {
    var i = e.target.dataset.ndone; if (i === undefined) return;
    S.names[i].done = e.target.checked; save(); renderNames();
  });
  $("nBody").addEventListener("click", function (e) {
    var i = e.target.dataset.ndel; if (i === undefined) return;
    S.names.splice(+i, 1); save(); renderNames();
  });
  $("nPrint").addEventListener("click", function () { window.print(); });
  $("nExport").addEventListener("click", function () {
    var txt = "BREAKING DESTRUCTIVE COVENANTS — NAMES WORKSHEET (PRIVATE)\nL137 Deliverance Ministry International · Pastor Kiky Ocansey\n\n" +
      S.names.map(function (n, i) { return (i + 1) + ". " + n.name + " — " + n.kind + (n.note ? " — " + n.note : "") + (n.done ? "  [RENOUNCED]" : "  [ ]"); }).join("\n") +
      "\n\nDECLARE OVER EACH NAME:\n" + (nDecl ? nDecl.lines.join("\n") : "");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([txt], { type: "text/plain" }));
    a.download = "names-worksheet-private.txt"; a.click(); URL.revokeObjectURL(a.href);
  });

  /* ── characters, chart, directions ───────────────────────── */
  (function () {
    var wrap = $("charList");
    wrap.innerHTML = '<div class="tabs" id="charTabs"></div><div id="charBody"></div>';
    $("charTabs").innerHTML = C.characters.map(function (c, i) { return '<button data-ctab="' + i + '" class="' + (i === 0 ? "cur" : "") + '">' + esc(c.name) + "</button>"; }).join("");
    function drawChar(i) {
      var c = C.characters[i];
      $("charBody").innerHTML = '<div class="tabcard" style="max-width:820px">' +
        '<div class="ref">' + esc(c.ref) + "</div><h3>" + esc(c.name) + "</h3><p>" + esc(c.story) + "</p>" +
        '<div class="prin"><b>Deliverance principle</b>' + esc(c.principle) + "</div>" +
        '<div class="saybar">' + sayBtn("txt", encodeURIComponent(c.name + ". " + c.story + " " + c.principle), "&#9834; Read aloud") + "</div></div>";
      $("charTabs").querySelectorAll("button").forEach(function (b, j) { b.classList.toggle("cur", j === i); });
    }
    drawChar(0);
    $("charTabs").addEventListener("click", function (e) { var b = e.target.closest("[data-ctab]"); if (b) drawChar(+b.dataset.ctab); });
  })();
  $("chartList").innerHTML = C.flowchart.map(function (f, i) {
    return '<div class="step"><div class="n tnum">' + (i + 1) + "</div><div><h4>" + esc(f.step) + "</h4><p>" + esc(f.text) + "</p></div></div>";
  }).join("");
  (function () {
    var groups = [
      { key: "all", label: "All (" + C.directions.length + ")", match: function () { return true; } },
      { key: "prep", label: "Prepare & recall", match: function (d) { return /recall|renounce|involve|skilled|treat prayer/i.test(d.title); } },
      { key: "break", label: "Break the covenant", match: function (d) { return /blood|isaiah|anoint|write the names|lingers/i.test(d.title); } },
      { key: "seed", label: "Seed & altar", match: function (d) { return /seed|altar/i.test(d.title); } },
      { key: "safe", label: "Safety & stewardship", match: function (d) { return /careful|be careful/i.test(d.title); } },
      { key: "salv", label: "Salvation & house", match: function (d) { return /salvation|part two|connected to the house/i.test(d.title); } }
    ];
    var wrap = $("dirList");
    wrap.innerHTML = '<div class="tabs" id="dirTabs"></div><div class="tabgrid" id="dirGrid"></div>';
    $("dirTabs").innerHTML = groups.map(function (g, i) { return '<button data-dtab="' + g.key + '" class="' + (i === 0 ? "cur" : "") + '">' + esc(g.label) + "</button>"; }).join("");
    function drawDir(key) {
      var g = groups.filter(function (x) { return x.key === key; })[0];
      var list = C.directions.map(function (d, i) { return { d: d, i: i }; }).filter(function (o) { return g.match(o.d); });
      $("dirGrid").innerHTML = list.length ? list.map(function (o) {
        return '<div class="tabcard"><div class="ref">Direction ' + (o.i + 1) + "</div><h3>" + esc(o.d.title) + "</h3><p>" + esc(o.d.detail) + "</p>" +
          '<div class="saybar">' + sayBtn("txt", encodeURIComponent(o.d.title + ". " + o.d.detail), "&#9834; Read aloud") + "</div></div>";
      }).join("") : '<p class="note">No directions in this group.</p>';
      $("dirTabs").querySelectorAll("button").forEach(function (b) { b.classList.toggle("cur", b.dataset.dtab === key); });
    }
    drawDir("all");
    $("dirTabs").addEventListener("click", function (e) { var b = e.target.closest("[data-dtab]"); if (b) drawDir(b.dataset.dtab); });
  })();

  /* ── quiz ────────────────────────────────────────────────── */
  function renderQuiz() {
    $("quizList").innerHTML = C.quiz.map(function (q, i) {
      return '<div class="qz"><div class="qn">Question ' + (i + 1) + "</div><div class=\"q\" style=\"font-weight:700;margin-bottom:10px\">" + esc(q.q) + "</div>" +
        q.a.map(function (a, j) {
          var sel = S.quiz[i] === j;
          var cls = "";
          if (S.quizDone) cls = (j === q.correct ? "right" : (sel ? "wrong" : ""));
          return '<label class="chk" style="margin:8px 0;padding:9px 11px;border:1px solid var(--line);border-radius:9px;align-items:flex-start;background:' +
            (cls === "right" ? "var(--green-soft)" : cls === "wrong" ? "var(--ember-soft)" : "#fff") + '"><input type="radio" name="q' + i + '" data-q="' + i + '" data-a="' + j + '"' + (sel ? " checked" : "") + '><span>' + esc(a) + "</span></label>";
        }).join("") + "</div>";
    }).join("");
    if (S.quizDone) showScore();
  }
  function showScore() {
    var n = 0; C.quiz.forEach(function (q, i) { if (S.quiz[i] === q.correct) n++; });
    $("qScore").style.display = "block";
    $("qScore").innerHTML = "<b class=\"tnum\">" + n + " / " + C.quiz.length + "</b><span class=\"note\">" +
      (n === C.quiz.length ? "Every answer correct." : "Review the highlighted answers and the modules they came from.") + "</span>";
  }
  renderQuiz();
  $("quizList").addEventListener("change", function (e) {
    var i = e.target.dataset.q; if (i === undefined) return;
    S.quiz[i] = +e.target.dataset.a; save();
  });
  $("qSubmit").addEventListener("click", function () { S.quizDone = true; save(); renderQuiz(); updateProgress(); window.scrollTo({ top: 0, behavior: "smooth" }); });
  $("qReset").addEventListener("click", function () { S.quiz = {}; S.quizDone = false; save(); $("qScore").style.display = "none"; renderQuiz(); updateProgress(); });

  /* ── journal ─────────────────────────────────────────────── */
  $("jrnList").innerHTML = C.reflection.map(function (q, i) {
    return '<div class="libcard" style="margin-bottom:14px"><h3 style="font-size:19px">' + esc(q) + "</h3>" +
      '<textarea data-jrn="' + i + '" style="margin-top:10px">' + esc(S.journal[i] || "") + '</textarea><span class="saved" data-jsaved="' + i + '">Saved</span></div>';
  }).join("");
  $("jrnList").addEventListener("input", function (e) {
    var i = e.target.dataset.jrn; if (i === undefined) return;
    S.journal[i] = e.target.value; save();
    flash($("jrnList").querySelector('[data-jsaved="' + i + '"]'));
  });

  /* ── checklist ───────────────────────────────────────────── */
  $("chkList").innerHTML = C.checklist.map(function (c, i) {
    return '<label class="chk" style="margin:12px 0;align-items:flex-start"><input type="checkbox" data-chk="' + i + '"' + (S.checklist[i] ? " checked" : "") + "><span>" + esc(c) + "</span></label>";
  }).join("");
  $("chkList").addEventListener("change", function (e) {
    var i = e.target.dataset.chk; if (i === undefined) return;
    S.checklist[i] = e.target.checked; save(); updateProgress();
  });

  /* ── notes ───────────────────────────────────────────────── */
  $("freeNote").value = S.free || "";
  $("freeNote").addEventListener("input", function () { S.free = this.value; save(); flash($("freeSaved")); });
  function renderNoteRoll() {
    var rows = C.modules.filter(function (m) { return (S.notes[m.id] || "").trim(); });
    $("noteRoll").innerHTML = rows.length
      ? '<h3 class="topic-h">Module notes</h3>' + rows.map(function (m) {
          return '<div class="libcard" style="margin-bottom:12px"><div class="ref">' + esc(m.stage) + "</div><h3>" + esc(m.title) + "</h3><p style=\"margin:8px 0 0;white-space:pre-wrap\">" + esc(S.notes[m.id]) + "</p></div>";
        }).join("")
      : '<p class="note">No module notes written yet.</p>';
  }

  /* ── bookmarks ───────────────────────────────────────────── */
  function toggleBmk(k, btn) {
    var i = S.bmk.indexOf(k);
    if (i > -1) S.bmk.splice(i, 1); else S.bmk.push(k);
    save();
    document.querySelectorAll('[data-bmk="' + k + '"]').forEach(function (b) { b.classList.toggle("on", S.bmk.indexOf(k) > -1); });
  }
  function renderBookmarks() {
    if (!S.bmk.length) { $("bmkList").innerHTML = '<p class="note">No bookmarks yet. Tap the star on any scripture or declaration set.</p>'; return; }
    $("bmkList").innerHTML = S.bmk.map(function (k) {
      if (k.indexOf("scr:") === 0) { var s = scrByRef(k.slice(4)); return s ? scrBlock(s, true) : ""; }
      var g = C.declarationGroups[+k.slice(4)];
      return g ? '<div class="block declare"><div class="kicker" style="display:flex;justify-content:space-between"><span>Declare out loud · ' + esc(g.name) + '</span><button class="bmk on" data-bmk="' + k + '">&#9733;</button></div><ul>' + g.lines.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + "</ul></div>" : "";
    }).join("");
  }
  $("bmkList").addEventListener("click", function (e) {
    var b = e.target.closest("[data-bmk]"); if (b) { toggleBmk(b.dataset.bmk, b); renderBookmarks(); }
  });

  /* ── search ──────────────────────────────────────────────── */
  var IDX = [];
  C.modules.forEach(function (m, i) {
    m.points.forEach(function (p) { IDX.push({ w: "Module " + (i + 1) + " · " + m.title, t: p, go: "modules" }); });
    m.prayers.forEach(function (p) { IDX.push({ w: "Prayer · " + m.title, t: p, go: "modules" }); });
  });
  C.scriptures.forEach(function (s) { s.verses.forEach(function (v) { IDX.push({ w: "Scripture · " + s.ref + ":" + v[0], t: v[1], go: "scripture" }); }); });
  C.declarationGroups.forEach(function (g) { g.lines.forEach(function (l) { IDX.push({ w: "Declaration · " + g.name, t: l, go: "declarations" }); }); });
  C.prayerSections.forEach(function (p) { p.points.forEach(function (l) { IDX.push({ w: "Prayer point · " + p.name, t: l, go: "prayers" }); }); });
  C.directions.forEach(function (d) { IDX.push({ w: "Prophetic direction · " + d.title, t: d.detail, go: "directions" }); });
  C.characters.forEach(function (c) { IDX.push({ w: "Character study · " + c.name, t: c.story + " " + c.principle, go: "characters" }); });
  C.flow.forEach(function (f) { IDX.push({ w: "Order of service · " + f.name, t: f.note, go: "flow" }); });

  $("sq").addEventListener("input", function () {
    var q = this.value.trim();
    if (q.length < 2) { $("sRes").innerHTML = ""; $("sCount").textContent = ""; return; }
    var re = new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
    var hits = IDX.filter(function (x) { return re.test(x.t) || re.test(x.w); }).slice(0, 80);
    $("sCount").textContent = hits.length + (hits.length === 1 ? " result" : " results") + ' for "' + q + '"';
    $("sRes").innerHTML = hits.map(function (h) {
      return '<div class="hit"><div class="where">' + esc(h.w) + "</div><div>" + esc(h.t).replace(re, "<mark>$1</mark>") +
        '</div><button class="btn btn-ghost btn-sm" data-go="' + h.go + '" style="margin-top:10px">Open section</button></div>';
    }).join("");
  });

  /* ── prayer timer ────────────────────────────────────────── */
  (function () {
    var box = $("timer"), total = 15 * 60, left = total, tick = null;
    function draw() {
      var m = Math.floor(left / 60), sec = left % 60;
      $("tClock").textContent = m + ":" + (sec < 10 ? "0" : "") + sec;
    }
    function stop() { if (tick) { clearInterval(tick); tick = null; } }
    function done() {
      stop(); box.classList.add("ring"); $("tClock").textContent = "Amen";
      if (SPEECH) speak("The prayer time is complete. Give Him thanks.", null);
    }
    box.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (b.dataset.min) {
        box.querySelectorAll("[data-min]").forEach(function (x) { x.classList.remove("sel"); });
        b.classList.add("sel"); total = +b.dataset.min * 60; left = total;
        box.classList.remove("ring"); stop(); draw(); return;
      }
      if (b.id === "tStart") {
        box.classList.remove("ring"); if (left <= 0) left = total;
        stop(); tick = setInterval(function () { left--; if (left <= 0) { left = 0; draw(); done(); return; } draw(); }, 1000);
      }
      if (b.id === "tPause") stop();
      if (b.id === "tReset") { stop(); box.classList.remove("ring"); left = total; draw(); }
    });
    draw();
  })();

  /* ── memory verse flip cards ─────────────────────────────── */
  (function () {
    var cards = [];
    C.scriptures.forEach(function (sc) {
      var base = sc.ref.indexOf(":") > -1 ? sc.ref.slice(0, sc.ref.lastIndexOf(":")) : sc.ref;
      sc.verses.forEach(function (v) {
        if (v[1].length > 300) return;              // keep cards readable
        cards.push({ ref: base + ":" + v[0], topic: sc.topic, text: v[1], parent: sc.ref });
      });
    });
    $("cardGrid").innerHTML = cards.map(function (c) {
      return '<div class="flip" data-flip="1"><div class="in">' +
        '<div class="face front"><div class="t">' + esc(c.topic) + '</div><div class="r">' + esc(c.ref) +
        '</div><div class="h">Tap to turn over</div></div>' +
        '<div class="face back"><div class="r">' + esc(c.ref) + " &middot; KJV</div><p>" + esc(c.text) + "</p>" +
        '<div class="saybar">' + sayBtn("txt", encodeURIComponent(c.ref + ". " + c.text), "&#9834; Hear it") + "</div></div>" +
        "</div></div>";
    }).join("");
    $("cardGrid").addEventListener("click", function (e) {
      if (e.target.closest("[data-say]")) return;
      var f = e.target.closest("[data-flip]"); if (f) f.classList.toggle("turned");
    });
  })();

  /* ── match the scripture ─────────────────────────────────── */
  (function () {
    var sel = null, solved = 0, pairs = [];
    function words(sc) {
      var w = sc.verses[0][1].split(/\s+/).slice(0, 9).join(" ");
      return w + "…";
    }
    function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    function start() {
      sel = null; solved = 0;
      $("mScore").style.display = "none";
      pairs = shuffle(C.scriptures.slice()).slice(0, 10);
      $("mLeft").innerHTML = shuffle(pairs.slice()).map(function (p) { return '<div class="mi" data-l="' + esc(p.ref) + '"><b>' + esc(p.ref) + "</b></div>"; }).join("");
      $("mRight").innerHTML = shuffle(pairs.slice()).map(function (p) { return '<div class="mi" data-r="' + esc(p.ref) + '">' + esc(words(p)) + "</div>"; }).join("");
    }
    function hit(el, side) {
      if (el.classList.contains("ok")) return;
      if (!sel) { clearSel(); el.classList.add("sel"); sel = { el: el, side: side, ref: el.dataset.l || el.dataset.r }; return; }
      if (sel.side === side) { clearSel(); el.classList.add("sel"); sel = { el: el, side: side, ref: el.dataset.l || el.dataset.r }; return; }
      var ref = el.dataset.l || el.dataset.r;
      if (ref === sel.ref) {
        el.classList.add("ok"); sel.el.classList.remove("sel"); sel.el.classList.add("ok"); sel = null; solved++;
        if (solved === pairs.length) {
          $("mScore").style.display = "block";
          $("mScore").innerHTML = '<b class="tnum">' + solved + " / " + pairs.length + '</b><span class="note">Every pair matched. Well done.</span>';
        }
      } else {
        el.classList.add("no"); var bad = sel.el; bad.classList.add("no");
        setTimeout(function () { el.classList.remove("no", "sel"); bad.classList.remove("no", "sel"); }, 650);
        sel = null;
      }
    }
    function clearSel() { document.querySelectorAll(".match .mi.sel").forEach(function (x) { x.classList.remove("sel"); }); }
    $("mLeft").addEventListener("click", function (e) { var t = e.target.closest("[data-l]"); if (t) hit(t, "l"); });
    $("mRight").addEventListener("click", function (e) { var t = e.target.closest("[data-r]"); if (t) hit(t, "r"); });
    $("mNew").addEventListener("click", start);
    start();
  })();

  /* ── downloads ───────────────────────────────────────────── */
  var PACK = [
    ["workbook.pdf", "Workbook (Study Guide)", "The full teaching with every KJV scripture, reflection questions, deliverance exercises and journaling pages"],
    ["prophetic-directions.pdf", "Prophetic Directions", "Every practical instruction given in the service"],
    ["recall-sheet.pdf", "Recall Sheet", "One page — main teaching, key points, main scriptures, application"],
    ["declaration-card.pdf", "Declaration Card", "Every corporate declaration exactly as spoken"],
    ["prayer-point-manual.pdf", "Prayer Point Manual", "Organised by section from repentance to sealing"],
    ["scripture-companion.pdf", "Scripture Companion", "Every scripture in full KJV, grouped by topic"],
    ["preparation-guide.pdf", "Deliverance Preparation Guide", "Repentance, forgiveness, communion, worship, faith"],
    ["aftercare-guide.pdf", "Deliverance Aftercare Guide", "Bible study, prayer, worship, fellowship, renewing the mind"],
    ["checklist.pdf", "Deliverance Checklist", "Repented, forgiven, renounced, prayed, took the blood, anointed, wrote the names"],
    ["reflection-journal.pdf", "Reflection Journal", "What I learned, what convicted me, my practical step, my prayer response"],
    ["weekly-assignment.pdf", "Weekly Assignment", "Writing and renouncing the names"],
    ["memory-verse-cards.pdf", "Memory Verse Cards", "Printable and cuttable"],
    ["family-prayer-guide.pdf", "Family Prayer Guide", "For families to study and pray together"],
    ["leaders-guide.pdf", "Leader's Guide", "For pastors and small groups"],
    ["bible-character-studies.pdf", "Bible Character Studies", "Jacob and Laban, David and Jonathan, Noah, the Cross"],
    ["teaching-flow-chart.pdf", "Teaching Flow Chart", "Problem to maintenance on one page"]
  ];
  $("dlList").innerHTML = PACK.map(function (p) {
    return '<div class="dl"><div><b>' + esc(p[1]) + "</b><br><span>" + esc(p[2]) + '</span></div><a class="btn btn-primary btn-sm" href="assets/downloads/' + p[0] + '" download>Download</a></div>';
  }).join("");

  /* ── certificate ─────────────────────────────────────────── */
  function renderCert() {
    var mods = C.modules.every(function (m) { return S.mods[m.id]; });
    var chk = C.checklist.every(function (_, i) { return S.checklist[i]; });
    if (!(mods && chk && S.quizDone)) {
      $("certBox").innerHTML = '<div class="locked"><b>Not unlocked yet.</b><br>' +
        (mods ? "" : "All fourteen modules must be marked complete.<br>") +
        (chk ? "" : "Every checklist item must be ticked.<br>") +
        (S.quizDone ? "" : "The knowledge check must be marked.") + "</div>";
      return;
    }
    var n = 0; C.quiz.forEach(function (q, i) { if (S.quiz[i] === q.correct) n++; });
    $("certBox").innerHTML = '<div class="cert"><div class="sm">L137 Deliverance Ministry International</div>' +
      '<div class="ttl">Certificate of Completion</div><div class="sm">This certifies that</div>' +
      '<div class="nm" id="certName" contenteditable="true">' + esc(S.cert || "Write your name here") + "</div>" +
      '<p style="max-width:560px;margin:0 auto 18px">has completed the interactive study <b>Breaking Destructive Covenants Through Prayer and Deliverance — Part One</b>, taught by Pastor Kiky Ocansey, including all fourteen modules, the deliverance checklist and the knowledge check (' + n + " of " + C.quiz.length + " correct).</p>" +
      '<div class="sm">' + esc(C.meta.date) + " · " + esc(C.meta.platform) + '</div><p style="font-family:var(--serif);font-style:italic;color:var(--teal-deep);margin-top:18px">For with God nothing shall be impossible. — Luke 1:37</p></div>' +
      '<div class="btnrow"><button class="btn btn-ghost btn-sm" onclick="window.print()">Print the certificate</button></div>';
    var cn = $("certName");
    cn.addEventListener("blur", function () { S.cert = cn.textContent.trim(); save(); });
  }

  /* ── progress ────────────────────────────────────────────── */
  function updateProgress() {
    var total = C.modules.length + C.checklist.length + prayCount + 1, done = 0;
    C.modules.forEach(function (m) { if (S.mods[m.id]) done++; });
    C.checklist.forEach(function (_, i) { if (S.checklist[i]) done++; });
    Object.keys(S.prayers).forEach(function (k) { if (S.prayers[k]) done++; });
    if (S.quizDone) done++;
    var pct = Math.round(done / total * 100);
    $("pctTxt").textContent = pct + "%";
    $("ringFg").style.strokeDashoffset = 264 - 264 * pct / 100;
    var nm = C.modules.filter(function (m) { return S.mods[m.id]; }).length;
    $("pctSub").textContent = nm + " of " + C.modules.length + " modules complete";
  }
  updateProgress();

  $("resetBtn").addEventListener("click", function () {
    if (!confirm("Clear all progress, notes, journal answers, bookmarks and the names worksheet saved in this browser?")) return;
    sDel(KEY); sDel(KEY + "-ok"); location.reload();
  });
})();
