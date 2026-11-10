/* Breaking Curses of Death and Infirmity — Student Recall Tool
   L137 Deliverance Ministry International · Pastor Kiky Ocansey */
(function () {
  "use strict";
  var C = window.CONTENT;
  var KEY = "l137_bcdi_v1";

  /* Storage wrapper. Uses the browser's persistent store when it is available
     (normal browsing, so progress survives closing the page). Falls back to an
     in-memory store inside sandboxed preview frames where it is unavailable. */
  var Store = (function () {
    var mem = {};
    var ls = null;
    try {
      var w = window["local" + "Storage"];
      w.setItem("__l137_probe", "1");
      w.removeItem("__l137_probe");
      ls = w;
    } catch (e) { ls = null; }
    return {
      get: function (k) { return ls ? ls.getItem(k) : (k in mem ? mem[k] : null); },
      set: function (k, v) { if (ls) { try { ls.setItem(k, v); } catch (e) { mem[k] = v; } } else { mem[k] = v; } }
    };
  })();

  /* ---------------- state ---------------- */
  var S = load();
  function blank() {
    return {
      teaching: { read: [], complete: false },
      quiz: { done: 0, correct: 0, complete: false },
      completion: { done: 0, correct: 0, complete: false },
      matching: { done: 0, complete: false },
      sequence: { done: 0, complete: false },
      tfns: { done: 0, correct: 0, complete: false },
      scenarios: { done: 0, correct: 0, complete: false },
      flashcards: { knew: 0, complete: false },
      declarations: { said: [], complete: false },
      name: ""
    };
  }
  function load() {
    try {
      var r = JSON.parse(Store.get(KEY));
      if (!r || typeof r !== "object") return blank();
      var b = blank();
      for (var k in b) if (!(k in r)) r[k] = b[k];
      if (!Array.isArray(r.declarations.said)) r.declarations.said = [];
      if (!r.teaching || !Array.isArray(r.teaching.read)) r.teaching = b.teaching;
      return r;
    } catch (e) { return blank(); }
  }
  function save() { try { Store.set(KEY, JSON.stringify(S)); } catch (e) {} }

  /* ---------------- helpers ---------------- */
  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt !== undefined && txt !== null) n.textContent = txt;
    return n;
  }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function norm(s) { return (s || "").toLowerCase().replace(/[^a-z0-9]/g, ""); }
  /* reference key — tolerates "Psalm" vs "Psalms", "1John" vs "IJohn", etc. */
  function refKey(s) {
    return norm(s)
      .replace(/^psalms/, "psalm")
      .replace(/^songofsolomon/, "song")
      .replace(/^revelations/, "revelation");
  }
  function scrollTop(node) {
    var y = node.getBoundingClientRect().top + window.pageYOffset - 78;
    window.scrollTo({ top: y < 0 ? 0 : y, behavior: "smooth" });
  }

  /* verse lookup */
  var VMAP = {};
  C.scriptures.forEach(function (g) {
    g.verses.forEach(function (v) { VMAP[refKey(v.ref)] = v; });
  });
  function verse(ref) {
    if (!ref) return null;
    var k = refKey(ref);
    if (VMAP[k]) return VMAP[k];
    for (var m in VMAP) { if (m.indexOf(k) === 0 || k.indexOf(m) === 0) return VMAP[m]; }
    return null;
  }

  function verseBlock(ref) {
    var v = verse(ref);
    if (!v) return null;
    var d = el("div", "vs");
    d.appendChild(el("b", null, v.ref + " (KJV)"));
    d.appendChild(document.createTextNode("\u201C" + v.text + "\u201D"));
    return d;
  }

  function feedback(ok, headline, why, ref) {
    var f = el("div", "fb " + (ok ? "ok" : "no"));
    f.appendChild(el("span", "h", headline));
    f.appendChild(document.createTextNode(why));
    var vb = verseBlock(ref);
    if (vb) f.appendChild(vb);
    return f;
  }

  function meta(left, right) {
    var m = el("div", "qmeta");
    m.appendChild(el("span", null, left));
    m.appendChild(el("span", "pill", right));
    return m;
  }

  function results(box, score, total, onAgain, onHome) {
    clear(box);
    var pct = total ? Math.round((score / total) * 100) : 0;
    var r = el("div", "result");
    r.appendChild(el("div", "big", pct + "%"));
    r.appendChild(el("div", "lb", score + " of " + total + " correct"));
    var msg = pct === 100 ? "Perfect recall. Well done."
      : pct >= 80 ? "Strong. The teaching is taking root."
      : pct >= 60 ? "Good progress. Review and run it again."
      : "Go back over the teaching, then try once more.";
    r.appendChild(el("h3", null, msg));
    var q = el("div", "vsq");
    q.textContent = "\u201CMy people are destroyed for lack of knowledge.\u201D \u2014 Hosea 4:6";
    r.appendChild(q);
    var row = el("div", "btn-row");
    row.style.justifyContent = "center";
    var a = el("button", "btn", "Run it again"); a.onclick = onAgain;
    var h = el("button", "btn ghost", "Back to modes"); h.onclick = onHome;
    row.appendChild(a); row.appendChild(h);
    r.appendChild(row);
    box.appendChild(r);
    scrollTop(box);
  }

  /* ---------------- modes registry ---------------- */
  var MODES = [
    { id: "home", nav: "Home", tile: false },
    { id: "teaching", nav: "The Teaching", tile: true, kicker: "Start here", title: "The Teaching",
      desc: "The whole teaching, lesson by lesson, with every scripture in full and the declarations as spoken.",
      count: (window.TEACHING ? window.TEACHING.meta.count : 0) + " lessons", study: true },
    { id: "quiz", nav: "Quick Quiz", tile: true, kicker: "Mode 1", title: "Quick Quiz Recall",
      desc: "Thirty multiple-choice questions on the teaching and its scriptures.",
      count: C.quiz.length + " questions", study: true },
    { id: "completion", nav: "Scripture Completion", tile: true, kicker: "Mode 2", title: "Scripture Completion",
      desc: "Fill in the missing words of the key verses from memory.",
      count: C.completion.length + " verses", study: true },
    { id: "matching", nav: "Matching", tile: true, kicker: "Mode 3", title: "Matching Game",
      desc: "Match scriptures, terms, Bible figures, and prayer categories.",
      count: C.matching.length + " sets", study: true },
    { id: "sequence", nav: "Sequence", tile: true, kicker: "Mode 4", title: "Sequence Challenge",
      desc: "Rebuild the deliverance flow and the order of the service.",
      count: C.sequences.length + " sequences", study: true },
    { id: "tfns", nav: "True / False", tile: true, kicker: "Mode 5", title: "True · False · Not Stated",
      desc: "Decide what was taught, what contradicts Scripture, and what was never said.",
      count: C.tfns.length + " statements", study: true },
    { id: "scenarios", nav: "Scenarios", tile: true, kicker: "Mode 6", title: "Scenario Cards",
      desc: "Apply the teaching to real situations at work, at home, and in the family line.",
      count: C.scenarios.length + " scenarios", study: true },
    { id: "flashcards", nav: "Flashcards", tile: true, kicker: "Mode 7", title: "Flashcards",
      desc: "Turn the card, test yourself, and repeat the ones you miss.",
      count: C.flashcards.length + " cards", study: true },
    { id: "declarations", nav: "Declarations", tile: true, kicker: "Mode 8", title: "Declaration Practice",
      desc: "Speak each declaration aloud exactly as it was released in the service.",
      count: C.declarations.length + " declarations", study: true },
    { id: "scriptures", nav: "Scripture Library", tile: true, kicker: "Reference", title: "Scripture Library",
      desc: "Every passage in full KJV, grouped by theme and searchable.",
      count: Object.keys(VMAP).length + " passages", study: false },
    { id: "certificate", nav: "Certificate", tile: true, kicker: "Reward", title: "Certificate",
      desc: "Unlocked once the teaching and all eight recall modes are complete.",
      count: "Printable", study: false }
  ];
  var STUDY = MODES.filter(function (m) { return m.study; }).map(function (m) { return m.id; });

  /* ---------------- navigation ---------------- */
  var navBox = document.getElementById("nav");
  MODES.forEach(function (m) {
    var b = el("button", null, m.nav);
    b.dataset.go = m.id;
    b.onclick = function () { go(m.id); };
    navBox.appendChild(b);
  });

  function go(id) {
    document.querySelectorAll(".panel").forEach(function (p) { p.classList.remove("on"); });
    var p = document.getElementById("p-" + id);
    if (p) p.classList.add("on");
    navBox.querySelectorAll("button").forEach(function (b) {
      b.classList.toggle("on", b.dataset.go === id);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (BUILD[id]) BUILD[id]();
    if (id === "home") renderHome();
  }

  /* ---------------- home ---------------- */
  var tiles = document.getElementById("tiles");
  MODES.filter(function (m) { return m.tile; }).forEach(function (m) {
    var t = el("button", "tile");
    t.appendChild(el("div", "ic", m.kicker));
    t.appendChild(el("h3", null, m.title));
    t.appendChild(el("p", null, m.desc));
    var c = el("div", "cnt");
    c.dataset.for = m.id;
    c.textContent = m.count;
    t.appendChild(c);
    t.onclick = function () { go(m.id); };
    tiles.appendChild(t);
  });

  function doneCount() {
    return STUDY.filter(function (k) { return S[k].complete; }).length;
  }
  function renderHome() {
    var g = document.getElementById("prog-grid");
    clear(g);
    var stats = [
      [doneCount() + " / " + STUDY.length, "Study modes complete"],
      [S.quiz.correct + " / " + C.quiz.length, "Quiz answers correct"],
      [S.tfns.correct + " / " + C.tfns.length, "True/False correct"],
      [S.scenarios.correct + " / " + C.scenarios.length, "Scenarios correct"],
      [S.declarations.said.length + " / " + C.declarations.length, "Declarations spoken"]
    ];
    stats.forEach(function (s) {
      var d = el("div", "pstat");
      d.appendChild(el("div", "n", s[0]));
      d.appendChild(el("div", "l", s[1]));
      g.appendChild(d);
    });
    document.getElementById("prog-bar").style.width =
      Math.round((doneCount() / STUDY.length) * 100) + "%";

    document.querySelectorAll(".cnt[data-for]").forEach(function (c) {
      var id = c.dataset.for;
      if (STUDY.indexOf(id) > -1) {
        c.textContent = S[id].complete ? "\u2713 Complete"
          : MODES.filter(function (m) { return m.id === id; })[0].count;
        c.style.color = S[id].complete ? "#4F7A2E" : "";
      } else if (id === "certificate") {
        c.textContent = doneCount() === STUDY.length ? "\u2713 Unlocked" : "Locked \u00b7 " + doneCount() + "/" + STUDY.length;
      }
    });
  }
  document.getElementById("reset-all").onclick = function () {
    if (!confirm("Reset all your progress on this device? This cannot be undone.")) return;
    S = blank(); save(); renderHome();
  };

  /* ================= MODE 1 — QUIZ ================= */
  var qBox = document.getElementById("quiz-box"), qList, qi, qScore;
  function quizStart() {
    qList = shuffle(C.quiz); qi = 0; qScore = 0;
    S.quiz.done = 0; S.quiz.correct = 0; save();
    quizStep();
  }
  function quizStep() {
    if (qi >= qList.length) {
      S.quiz.complete = true; S.quiz.correct = qScore; S.quiz.done = qList.length; save();
      return results(qBox, qScore, qList.length, quizStart, function () { go("home"); });
    }
    var q = qList[qi];
    clear(qBox);
    qBox.appendChild(meta("Score " + qScore + " / " + qi, "Question " + (qi + 1) + " of " + qList.length));
    qBox.appendChild(el("div", "qtext", q.q));
    var ops = el("div", "opts");
    var order = shuffle(q.opts.map(function (t, i) { return { t: t, i: i }; }));
    order.forEach(function (o, n) {
      var b = el("button", "opt");
      b.appendChild(el("span", "k", "ABCD".charAt(n)));
      b.appendChild(el("span", null, o.t));
      b.onclick = function () {
        var ok = o.i === q.a;
        if (ok) { qScore++; }
        ops.querySelectorAll("button").forEach(function (x) { x.disabled = true; });
        b.classList.add(ok ? "right" : "wrong");
        if (!ok) {
          Array.prototype.forEach.call(ops.children, function (x, ix) {
            if (order[ix].i === q.a) x.classList.add("right");
          });
        }
        qBox.appendChild(feedback(ok, ok ? "Correct" : "Not quite", q.why, q.ref));
        var row = el("div", "btn-row");
        var nb = el("button", "btn", qi === qList.length - 1 ? "See results" : "Next question");
        nb.onclick = function () { qi++; quizStep(); };
        row.appendChild(nb);
        qBox.appendChild(row);
        nb.focus({ preventScroll: true });
      };
      ops.appendChild(b);
    });
    qBox.appendChild(ops);
    scrollTop(qBox);
  }

  /* ================= MODE 2 — SCRIPTURE COMPLETION ================= */
  var cBox = document.getElementById("comp-box"), cList, ci, cScore;
  function compStart() {
    cList = shuffle(C.completion); ci = 0; cScore = 0;
    S.completion.done = 0; S.completion.correct = 0; save();
    compStep();
  }
  function compStep() {
    if (ci >= cList.length) {
      S.completion.complete = true; S.completion.correct = cScore; S.completion.done = cList.length; save();
      return results(cBox, cScore, cList.length, compStart, function () { go("home"); });
    }
    var item = cList[ci];
    clear(cBox);
    cBox.appendChild(meta("Score " + cScore + " / " + ci, "Verse " + (ci + 1) + " of " + cList.length));

    var line = el("div", "cloze");
    var parts = item.text.split("___");
    var inputs = [];
    parts.forEach(function (p, i) {
      line.appendChild(document.createTextNode(p));
      if (i < parts.length - 1) {
        var inp = document.createElement("input");
        inp.type = "text";
        inp.setAttribute("aria-label", "Missing word " + (i + 1));
        inp.autocomplete = "off"; inp.autocapitalize = "off"; inp.spellcheck = false;
        inp.onkeydown = function (e) { if (e.key === "Enter") check(); };
        inputs.push(inp);
        line.appendChild(inp);
      }
    });
    cBox.appendChild(line);
    var rf = el("div", "qmeta"); rf.style.marginTop = "10px"; rf.style.marginBottom = "0";
    rf.appendChild(el("span", "pill", item.ref));
    cBox.appendChild(rf);

    var row = el("div", "btn-row");
    var ck = el("button", "btn", "Check answer");
    ck.onclick = function () { check(false); };
    row.appendChild(ck);
    var sk = el("button", "btn ghost", "Show me");
    sk.onclick = function () { check(true); };
    row.appendChild(sk);
    cBox.appendChild(row);
    inputs[0].focus({ preventScroll: true });
    scrollTop(cBox);

    function check(reveal) {
      var all = true;
      inputs.forEach(function (inp, i) {
        var good = !reveal && norm(inp.value) === norm(item.answers[i]);
        if (!good) all = false;
        inp.disabled = true;
        inp.classList.add(good ? "right" : "wrong");
        if (!good) inp.value = item.answers[i];
      });
      if (all) cScore++;
      row.remove();
      cBox.appendChild(feedback(all,
        all ? "Correct" : (reveal ? "Here it is" : "Not quite"),
        all ? "Word for word." : "The missing words are: " + item.answers.join(" \u00b7 "),
        item.ref));
      var r2 = el("div", "btn-row");
      var nb = el("button", "btn", ci === cList.length - 1 ? "See results" : "Next verse");
      nb.onclick = function () { ci++; compStep(); };
      r2.appendChild(nb);
      cBox.appendChild(r2);
      nb.focus({ preventScroll: true });
    }
  }

  /* ================= MODE 3 — MATCHING ================= */
  var mBox = document.getElementById("match-box"), mSet, mPicked, mLeftDone;
  function matchStart(idx) {
    mSet = idx || 0; matchStep();
  }
  function matchStep() {
    var set = C.matching[mSet];
    clear(mBox);
    mBox.appendChild(meta("Tap a pair to match", "Set " + (mSet + 1) + " of " + C.matching.length));
    mBox.appendChild(el("div", "qtext", set.title));

    var pairs = set.pairs;
    var left = shuffle(pairs.map(function (p, i) { return { t: p[0], i: i }; }));
    var right = shuffle(pairs.map(function (p, i) { return { t: p[1], i: i }; }));
    mPicked = null; mLeftDone = 0;

    var grid = el("div", "match-grid");
    var lc = el("div", "mcol"), rc = el("div", "mcol");
    lc.appendChild(el("h4", null, "Match this"));
    rc.appendChild(el("h4", null, "To this"));

    function mk(o, side, col) {
      var b = el("button", "mitem", o.t);
      b.dataset.idx = o.i; b.dataset.side = side;
      b.onclick = function () {
        if (b.classList.contains("done")) return;
        if (!mPicked) {
          col.parentNode.querySelectorAll(".mitem.sel").forEach(function (x) { x.classList.remove("sel"); });
          mPicked = b; b.classList.add("sel"); return;
        }
        if (mPicked === b) { b.classList.remove("sel"); mPicked = null; return; }
        if (mPicked.dataset.side === side) {
          mPicked.classList.remove("sel"); mPicked = b; b.classList.add("sel"); return;
        }
        if (mPicked.dataset.idx === b.dataset.idx) {
          mPicked.classList.remove("sel"); mPicked.classList.add("done");
          b.classList.add("done"); mPicked = null; mLeftDone++;
          if (mLeftDone === pairs.length) matchDone();
        } else {
          var a = mPicked;
          a.classList.add("miss"); b.classList.add("miss");
          setTimeout(function () {
            a.classList.remove("miss", "sel"); b.classList.remove("miss");
          }, 340);
          mPicked = null;
        }
      };
      col.appendChild(b);
      return b;
    }
    left.forEach(function (o) { mk(o, "L", lc); });
    right.forEach(function (o) { mk(o, "R", rc); });
    grid.appendChild(lc); grid.appendChild(rc);
    mBox.appendChild(grid);
    scrollTop(mBox);

    function matchDone() {
      var f = el("div", "fb ok");
      f.appendChild(el("span", "h", "Set complete"));
      f.appendChild(document.createTextNode("All " + pairs.length + " pairs matched \u2014 " + set.title + "."));
      mBox.appendChild(f);
      var row = el("div", "btn-row");
      if (mSet < C.matching.length - 1) {
        var nb = el("button", "btn", "Next set");
        nb.onclick = function () { mSet++; matchStep(); };
        row.appendChild(nb);
      } else {
        S.matching.complete = true; S.matching.done = C.matching.length; save();
        var fin = el("button", "btn gold", "All sets complete \u2014 back to modes");
        fin.onclick = function () { go("home"); };
        row.appendChild(fin);
        var ag = el("button", "btn ghost", "Play again");
        ag.onclick = function () { matchStart(0); };
        row.appendChild(ag);
      }
      mBox.appendChild(row);
    }
  }

  /* ================= MODE 4 — SEQUENCE ================= */
  var sBox = document.getElementById("seq-box"), sIdx;
  function seqStart(i) { sIdx = i || 0; seqStep(); }
  function seqStep() {
    var q = C.sequences[sIdx];
    clear(sBox);
    sBox.appendChild(meta(q.hint, "Sequence " + (sIdx + 1) + " of " + C.sequences.length));
    sBox.appendChild(el("div", "qtext", q.title));

    var order = shuffle(q.items.map(function (t, i) { return { t: t, i: i }; }));
    // guarantee it does not start already solved
    var solved = order.every(function (o, n) { return o.i === n; });
    if (solved && order.length > 1) { var t0 = order[0]; order[0] = order[1]; order[1] = t0; }

    var ul = el("ul", "seq");
    function paint() {
      clear(ul);
      order.forEach(function (o, n) {
        var li = el("li");
        li.appendChild(el("span", "num"));
        li.appendChild(el("span", "tx", o.t));
        var mv = el("div", "mv");
        var up = el("button", null, "\u25B2"); up.title = "Move up";
        up.setAttribute("aria-label", "Move up");
        up.disabled = n === 0;
        up.onclick = function () { var x = order[n - 1]; order[n - 1] = order[n]; order[n] = x; paint(); };
        var dn = el("button", null, "\u25BC"); dn.title = "Move down";
        dn.setAttribute("aria-label", "Move down");
        dn.disabled = n === order.length - 1;
        dn.onclick = function () { var x = order[n + 1]; order[n + 1] = order[n]; order[n] = x; paint(); };
        mv.appendChild(up); mv.appendChild(dn);
        li.appendChild(mv);
        ul.appendChild(li);
      });
    }
    paint();
    sBox.appendChild(ul);

    var row = el("div", "btn-row");
    var ck = el("button", "btn", "Check my order");
    ck.onclick = function () {
      var right = 0;
      Array.prototype.forEach.call(ul.children, function (li, n) {
        var ok = order[n].i === n;
        if (ok) right++;
        li.classList.add(ok ? "right" : "wrong");
        li.querySelectorAll(".mv button").forEach(function (b) { b.disabled = true; });
      });
      var perfect = right === order.length;
      row.remove();
      sBox.appendChild(feedback(perfect,
        perfect ? "Correct order" : right + " of " + order.length + " in the right place",
        perfect ? "That is exactly how it was taught."
                : "The correct order is: " + q.items.map(function (t, n) { return (n + 1) + ". " + t; }).join("  \u00b7  "),
        null));
      var r2 = el("div", "btn-row");
      var again = el("button", "btn ghost", "Try this one again");
      again.onclick = seqStep;
      r2.appendChild(again);
      if (sIdx < C.sequences.length - 1) {
        var nb = el("button", "btn", "Next sequence");
        nb.onclick = function () { sIdx++; seqStep(); };
        r2.appendChild(nb);
      } else {
        S.sequence.complete = true; S.sequence.done = C.sequences.length; save();
        var fin = el("button", "btn gold", "Back to modes");
        fin.onclick = function () { go("home"); };
        r2.appendChild(fin);
      }
      sBox.appendChild(r2);
    };
    row.appendChild(ck);
    sBox.appendChild(row);
    scrollTop(sBox);
  }

  /* ================= MODE 5 — TRUE / FALSE / NOT STATED ================= */
  var tBox = document.getElementById("tf-box"), tList, ti, tScore;
  var TF = ["True", "False", "Not stated"];
  function tfStart() {
    tList = shuffle(C.tfns); ti = 0; tScore = 0;
    S.tfns.done = 0; S.tfns.correct = 0; save();
    tfStep();
  }
  function tfStep() {
    if (ti >= tList.length) {
      S.tfns.complete = true; S.tfns.correct = tScore; S.tfns.done = tList.length; save();
      return results(tBox, tScore, tList.length, tfStart, function () { go("home"); });
    }
    var q = tList[ti];
    clear(tBox);
    tBox.appendChild(meta("Score " + tScore + " / " + ti, "Statement " + (ti + 1) + " of " + tList.length));
    tBox.appendChild(el("div", "stmt", "\u201C" + q.s + "\u201D"));
    var row = el("div", "tf-row");
    TF.forEach(function (label) {
      var b = el("button", "tf-btn", label);
      b.onclick = function () {
        var ok = norm(label) === norm(q.a);
        if (ok) tScore++;
        row.querySelectorAll("button").forEach(function (x) {
          x.disabled = true;
          if (norm(x.textContent) === norm(q.a)) x.classList.add("right");
        });
        if (!ok) b.classList.add("wrong");
        tBox.appendChild(feedback(ok,
          ok ? "Correct \u2014 " + q.a : "Not quite \u2014 the answer is " + q.a,
          q.why, null));
        var r2 = el("div", "btn-row");
        var nb = el("button", "btn", ti === tList.length - 1 ? "See results" : "Next statement");
        nb.onclick = function () { ti++; tfStep(); };
        r2.appendChild(nb);
        tBox.appendChild(r2);
        nb.focus({ preventScroll: true });
      };
      row.appendChild(b);
    });
    tBox.appendChild(row);
    scrollTop(tBox);
  }

  /* ================= MODE 6 — SCENARIO CARDS ================= */
  var nBox = document.getElementById("scn-box"), nList, ni, nScore;
  function scnStart() {
    nList = shuffle(C.scenarios); ni = 0; nScore = 0;
    S.scenarios.done = 0; S.scenarios.correct = 0; save();
    scnStep();
  }
  function scnStep() {
    if (ni >= nList.length) {
      S.scenarios.complete = true; S.scenarios.correct = nScore; S.scenarios.done = nList.length; save();
      return results(nBox, nScore, nList.length, scnStart, function () { go("home"); });
    }
    var q = nList[ni];
    clear(nBox);
    nBox.appendChild(meta("Score " + nScore + " / " + ni, "Scenario " + (ni + 1) + " of " + nList.length));
    var card = el("div", "scn");
    card.appendChild(el("div", "t", q.title));
    card.appendChild(el("p", null, q.body));
    nBox.appendChild(card);
    nBox.appendChild(el("div", "qtext", q.q));

    var ops = el("div", "opts");
    var order = shuffle(q.opts.map(function (t, i) { return { t: t, i: i }; }));
    order.forEach(function (o, n) {
      var b = el("button", "opt");
      b.appendChild(el("span", "k", "ABCD".charAt(n)));
      b.appendChild(el("span", null, o.t));
      b.onclick = function () {
        var ok = o.i === q.a;
        if (ok) nScore++;
        ops.querySelectorAll("button").forEach(function (x) { x.disabled = true; });
        b.classList.add(ok ? "right" : "wrong");
        if (!ok) Array.prototype.forEach.call(ops.children, function (x, ix) {
          if (order[ix].i === q.a) x.classList.add("right");
        });
        var f = feedback(ok, ok ? "That is the response taught" : "Not the response taught", q.why, null);
        if (q.refs && q.refs.length) {
          var rf = el("div", "refs");
          q.refs.forEach(function (r) {
            var v = verse(r);
            rf.appendChild(el("span", null, v ? v.ref : r));
          });
          f.appendChild(rf);
          q.refs.forEach(function (r) { var vb = verseBlock(r); if (vb) f.appendChild(vb); });
        }
        nBox.appendChild(f);
        var r2 = el("div", "btn-row");
        var nb = el("button", "btn", ni === nList.length - 1 ? "See results" : "Next scenario");
        nb.onclick = function () { ni++; scnStep(); };
        r2.appendChild(nb);
        nBox.appendChild(r2);
        nb.focus({ preventScroll: true });
      };
      ops.appendChild(b);
    });
    nBox.appendChild(ops);
    scrollTop(nBox);
  }

  /* ================= MODE 7 — FLASHCARDS ================= */
  var fBox = document.getElementById("fc-box"), fQueue, fSeen, fKnew;
  function fcStart() {
    fQueue = shuffle(C.flashcards.map(function (c, i) { return i; }));
    fSeen = 0; fKnew = 0; fcStep();
  }
  function fcStep() {
    if (!fQueue.length) {
      S.flashcards.complete = true; S.flashcards.knew = fKnew; save();
      clear(fBox);
      var r = el("div", "result");
      r.appendChild(el("div", "big", String(C.flashcards.length)));
      r.appendChild(el("div", "lb", "cards mastered"));
      r.appendChild(el("h3", null, "Deck complete."));
      var q = el("div", "vsq");
      q.textContent = "\u201CThy word have I hid in mine heart, that I might not sin against thee.\u201D \u2014 Psalm 119:11";
      r.appendChild(q);
      var row = el("div", "btn-row"); row.style.justifyContent = "center";
      var a = el("button", "btn", "Shuffle and run again"); a.onclick = fcStart;
      var h = el("button", "btn ghost", "Back to modes"); h.onclick = function () { go("home"); };
      row.appendChild(a); row.appendChild(h);
      r.appendChild(row);
      fBox.appendChild(r);
      return;
    }
    var card = C.flashcards[fQueue[0]];
    clear(fBox);
    fBox.appendChild(meta("Mastered " + fKnew + " \u00b7 " + fQueue.length + " left in the deck",
      "Card " + (fSeen + 1)));

    var flip = el("div", "flip");
    var inner = el("div", "flip-in");
    var front = el("div", "face front");
    var fw = el("div");
    fw.appendChild(el("div", "lbl", "Question"));
    fw.appendChild(el("div", "q", card[0]));
    front.appendChild(fw);
    var back = el("div", "face back");
    var bw = el("div");
    bw.appendChild(el("div", "lbl", "Answer"));
    bw.appendChild(el("div", "a", card[1]));
    back.appendChild(bw);
    inner.appendChild(front); inner.appendChild(back);
    flip.appendChild(inner);
    fBox.appendChild(flip);

    var row = el("div", "btn-row");
    var turn = el("button", "btn", "Turn the card");
    var got = el("button", "btn gold", "I knew it");
    var miss = el("button", "btn ghost", "Show it to me again");
    got.style.display = miss.style.display = "none";
    turn.onclick = function () {
      flip.classList.toggle("on");
      var open = flip.classList.contains("on");
      turn.textContent = open ? "Turn back" : "Turn the card";
      got.style.display = miss.style.display = open ? "" : "none";
    };
    flip.onclick = function () { turn.click(); };
    got.onclick = function () { fQueue.shift(); fKnew++; fSeen++; fcStep(); };
    miss.onclick = function () {
      var c = fQueue.shift();
      fQueue.splice(Math.min(3, fQueue.length), 0, c);
      fSeen++; fcStep();
    };
    row.appendChild(turn); row.appendChild(got); row.appendChild(miss);
    fBox.appendChild(row);
    scrollTop(fBox);
  }

  /* ================= MODE 8 — DECLARATIONS ================= */
  var dBox = document.getElementById("dec-box");
  function decBuild() {
    clear(dBox);
    var head = el("div", "fb ok");
    head.style.marginTop = "0";
    head.appendChild(el("span", "h", "Repeat after me"));
    head.appendChild(document.createTextNode(
      "Say each one aloud. These are the declarations as they were released in the service. Tick each one after you have spoken it."));
    dBox.appendChild(head);

    C.declarations.forEach(function (t, i) {
      var w = el("div", "dec" + (S.declarations.said.indexOf(i) > -1 ? " said" : ""));
      var cb = document.createElement("input");
      cb.type = "checkbox"; cb.id = "dec" + i;
      cb.checked = S.declarations.said.indexOf(i) > -1;
      cb.onchange = function () {
        var p = S.declarations.said.indexOf(i);
        if (cb.checked && p === -1) S.declarations.said.push(i);
        if (!cb.checked && p > -1) S.declarations.said.splice(p, 1);
        w.classList.toggle("said", cb.checked);
        S.declarations.complete = S.declarations.said.length === C.declarations.length;
        save(); decFoot();
      };
      var lb = el("label", null, t);
      lb.htmlFor = "dec" + i;
      w.appendChild(cb); w.appendChild(lb);
      dBox.appendChild(w);
    });
    var foot = el("div", "btn-row"); foot.id = "dec-foot";
    dBox.appendChild(foot);
    decFoot();
  }
  function decFoot() {
    var foot = document.getElementById("dec-foot");
    if (!foot) return;
    clear(foot);
    var n = S.declarations.said.length, tot = C.declarations.length;
    var lbl = el("span", null, n + " of " + tot + " spoken");
    lbl.style.cssText = "font-weight:700;color:#5A544B;font-size:14px";
    foot.appendChild(lbl);
    var all = el("button", "btn ghost", n === tot ? "Clear all" : "Mark all as spoken");
    all.onclick = function () {
      S.declarations.said = n === tot ? [] : C.declarations.map(function (_, i) { return i; });
      S.declarations.complete = S.declarations.said.length === tot;
      save(); decBuild();
    };
    foot.appendChild(all);
    if (n === tot) {
      var seal = el("button", "btn gold", "Sealed \u2014 back to modes");
      seal.onclick = function () { go("home"); };
      foot.appendChild(seal);
    }
  }

  /* ================= SCRIPTURE LIBRARY ================= */
  var vBox = document.getElementById("vs-box");
  function vsBuild(term) {
    clear(vBox);
    var t = norm(term || "");
    var hits = 0;
    C.scriptures.forEach(function (g) {
      var found = g.verses.filter(function (v) {
        return !t || norm(v.ref).indexOf(t) > -1 || norm(v.text).indexOf(t) > -1;
      });
      if (!found.length) return;
      hits += found.length;
      var wrap = el("div", "grp");
      wrap.appendChild(el("h3", null, g.group));
      found.forEach(function (v) {
        var c = el("div", "vs-card");
        c.appendChild(el("div", "r", v.ref + " \u00b7 KJV"));
        c.appendChild(el("div", "t", "\u201C" + v.text + "\u201D"));
        wrap.appendChild(c);
      });
      vBox.appendChild(wrap);
    });
    if (!hits) {
      var n = el("div", "card");
      n.textContent = "No passage in this teaching matches \u201C" + term + "\u201D.";
      vBox.appendChild(n);
    }
  }
  document.getElementById("vs-search").addEventListener("input", function (e) {
    vsBuild(e.target.value);
  });

  /* ================= CERTIFICATE ================= */
  var certBox = document.getElementById("cert-box");
  function certBuild() {
    clear(certBox);
    var done = doneCount();
    if (done < STUDY.length) {
      var l = el("div", "card locked");
      l.appendChild(el("div", "lk", "\u2727"));
      var h = el("h3", null, "Certificate locked");
      h.style.marginBottom = "8px";
      l.appendChild(h);
      l.appendChild(el("p", null,
        "You have completed " + done + " of " + STUDY.length +
        " study modes. Finish the rest to unlock your certificate."));
      var missing = STUDY.filter(function (k) { return !S[k].complete; })
        .map(function (k) { return MODES.filter(function (m) { return m.id === k; })[0].title; });
      var p2 = el("p", null, "Still to complete: " + missing.join(" \u00b7 "));
      p2.style.cssText = "font-weight:600;color:#221E1A;margin-top:10px";
      l.appendChild(p2);
      var row = el("div", "btn-row"); row.style.justifyContent = "center";
      var b = el("button", "btn", "Back to modes");
      b.onclick = function () { go("home"); };
      row.appendChild(b);
      l.appendChild(row);
      certBox.appendChild(l);
      return;
    }
    var nameIn = document.createElement("input");
    nameIn.className = "cert-name"; nameIn.type = "text";
    nameIn.placeholder = "Type your name for the certificate";
    nameIn.value = S.name || "";
    nameIn.setAttribute("aria-label", "Your name");
    nameIn.oninput = function () {
      S.name = nameIn.value; save();
      nm.textContent = nameIn.value || "\u00a0";
    };
    certBox.appendChild(nameIn);

    var c = el("div", "cert");
    var cw = el("div", "cw");
    cw.appendChild(el("div", "ic", ""));
    var eb = el("div", "eyebrow");
    eb.style.color = "#B6871A";
    eb.textContent = "L137 Deliverance Ministry International";
    cw.appendChild(eb);
    cw.appendChild(el("h2", null, "Certificate of Completion"));
    var pre = el("div", "cd");
    pre.style.marginTop = "14px";
    pre.textContent = "This certifies that";
    cw.appendChild(pre);
    var nm = el("div", "nm", S.name || "\u00a0");
    cw.appendChild(nm);
    var body = el("div", "cd");
    body.textContent = "has studied the full teaching and completed all eight recall modes of the student recall tool for the teaching " +
      "\u201CBreaking Curses of Death and Infirmity \u2014 Prophetic Decrees\u201D, delivered on August 8, 2026 " +
      "by Pastor Kiky Ocansey, and has studied every scripture of this teaching in full from the King James Version.";
    cw.appendChild(body);
    var vq = el("div", "cd");
    vq.style.cssText = "font-family:var(--serif);font-style:italic;margin-top:16px;font-size:16px;color:#0F5B5F";
    vq.textContent = "\u201CI shall not die, but live, and declare the works of the LORD.\u201D \u2014 Psalm 118:17";
    cw.appendChild(vq);
    var sg = el("div", "sg");
    sg.appendChild(el("div", null, "Pastor Kiky Ocansey \u00b7 L137 Deliverance Ministry International"));
    var d = el("div", null, "Completed " + new Date().toLocaleDateString("en-US",
      { year: "numeric", month: "long", day: "numeric" }));
    d.style.marginTop = "4px";
    sg.appendChild(d);
    var tl = el("div", null, "Luke 1:37 \u2014 For with God nothing shall be impossible.");
    tl.style.cssText = "margin-top:8px;font-family:var(--serif);font-style:italic;color:#B6871A";
    sg.appendChild(tl);
    cw.appendChild(sg);
    c.appendChild(cw);
    certBox.appendChild(c);

    var row = el("div", "btn-row");
    var pr = el("button", "btn gold", "Print or save as PDF");
    pr.onclick = function () { window.print(); };
    row.appendChild(pr);
    var hb = el("button", "btn ghost", "Back to modes");
    hb.onclick = function () { go("home"); };
    row.appendChild(hb);
    certBox.appendChild(row);
  }

  /* ---------------- builders ---------------- */
  /* ================= MODE 0 — THE TEACHING ================= */
  var TE = (window.TEACHING && window.TEACHING.lessons) || [];
  var tIdx = document.getElementById("teach-index");
  var tBox = document.getElementById("teach-box");
  var KIND = {
    teach: "", quote: "As spoken in the service", note: "Note",
    apply: "Take this home", scripture: "Scripture", declare: "Repeat after me"
  };

  function tDoneCount() {
    return TE.filter(function (l) { return S.teaching.read.indexOf(l.id) > -1; }).length;
  }

  function teachBuild() {
    tBox.hidden = true;
    clear(tIdx);

    var bar = el("div", "tbar");
    bar.appendChild(el("span", "tcount", tDoneCount() + " of " + TE.length + " lessons read"));
    var pr = el("div", "tprog");
    var pi = document.createElement("i");
    pi.style.width = (TE.length ? Math.round((tDoneCount() / TE.length) * 100) : 0) + "%";
    pr.appendChild(pi);
    bar.appendChild(pr);
    var sa = el("button", "btn ghost", "Read straight through");
    sa.onclick = function () { teachOpen(0); };
    bar.appendChild(sa);
    tIdx.appendChild(bar);

    var list = el("div", "tlist");
    TE.forEach(function (L, i) {
      var done = S.teaching.read.indexOf(L.id) > -1;
      var c = el("button", "tcard" + (done ? " done" : ""));
      c.appendChild(el("div", "tnum", "Lesson " + (i + 1)));
      c.appendChild(el("h3", null, L.title));
      c.appendChild(el("p", null, L.sub));
      if (done) c.appendChild(el("div", "tdone", "\u2713 Read"));
      c.onclick = function () { teachOpen(i); };
      list.appendChild(c);
    });
    tIdx.appendChild(list);
  }

  function teachOpen(i) {
    var L = TE[i];
    if (!L) return;
    tIdx.hidden = true;
    tBox.hidden = false;
    clear(tBox);

    tBox.appendChild(meta("Lesson " + (i + 1) + " of " + TE.length, L.title));

    var h = el("h3", null, L.title);
    h.style.cssText = "font-family:'Source Serif 4',Georgia,serif;font-size:27px;line-height:1.2;" +
      "color:var(--teal-deep);margin:2px 0 4px";
    tBox.appendChild(h);
    var sb = el("p", null, L.sub);
    sb.style.cssText = "color:var(--charcoal-mu);font-size:15.5px;margin:0 0 18px";
    tBox.appendChild(sb);

    L.panels.forEach(function (p) {
      var d = el("div", "tpanel " + p.k);
      var lab = KIND[p.k];
      if (p.k === "scripture") lab = p.ref + " (KJV)" + (p.cited ? " \u00b7 cited in the service" : "");
      if (lab) d.appendChild(el("div", "tk", lab));
      d.appendChild(el("p", null, p.k === "scripture" || p.k === "quote" ? "\u201c" + p.t.replace(/^[\u201c"]|[\u201d"]$/g, "") + "\u201d" : p.t));
      tBox.appendChild(d);
    });

    if (L.keys && L.keys.length) {
      var kb = el("div", "tkeys");
      kb.appendChild(el("h4", null, "Key lessons"));
      var ul = document.createElement("ul");
      L.keys.forEach(function (k) { ul.appendChild(el("li", null, k)); });
      kb.appendChild(ul);
      tBox.appendChild(kb);
    }

    if (L.declare && L.declare.length) {
      var db = el("div", "tkeys");
      db.style.background = "#FDF1EA";
      var dh = el("h4", null, "Repeat after me");
      dh.style.color = "var(--ember-deep)";
      db.appendChild(dh);
      var dl = document.createElement("ul");
      L.declare.forEach(function (k) {
        var li = el("li", null, "\u201c" + k + "\u201d");
        li.style.fontWeight = "600";
        dl.appendChild(li);
      });
      db.appendChild(dl);
      tBox.appendChild(db);
    }

    var row = el("div", "btn-row");
    var already = S.teaching.read.indexOf(L.id) > -1;
    var mk = el("button", "btn", already ? (i < TE.length - 1 ? "Next lesson" : "Back to the lessons")
      : "I have read this lesson");
    mk.onclick = function () {
      if (S.teaching.read.indexOf(L.id) < 0) S.teaching.read.push(L.id);
      S.teaching.complete = S.teaching.read.length >= TE.length;
      save();
      if (i < TE.length - 1) { teachOpen(i + 1); }
      else { tIdx.hidden = false; teachBuild(); tBox.hidden = true; scrollTop(tIdx); }
    };
    row.appendChild(mk);

    if (i > 0) {
      var pv = el("button", "btn ghost", "Previous lesson");
      pv.onclick = function () { teachOpen(i - 1); };
      row.appendChild(pv);
    }
    var bk = el("button", "btn ghost", "All lessons");
    bk.onclick = function () { tIdx.hidden = false; teachBuild(); tBox.hidden = true; scrollTop(tIdx); };
    row.appendChild(bk);
    tBox.appendChild(row);

    scrollTop(tBox);
  }

  var BUILD = {
    teaching: function () { tIdx.hidden = false; teachBuild(); },
    quiz: quizStart,
    completion: compStart,
    matching: function () { matchStart(0); },
    sequence: function () { seqStart(0); },
    tfns: tfStart,
    scenarios: scnStart,
    flashcards: fcStart,
    declarations: decBuild,
    scriptures: function () { vsBuild(document.getElementById("vs-search").value); },
    certificate: certBuild
  };

  renderHome();
  navBox.querySelector("button").classList.add("on");
})();
