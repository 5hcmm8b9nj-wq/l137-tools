(function () {
  var D = window.L137, K = D.kjv;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"); };
  var store = window.L137Store;
  var getJ = function (k, d) { try { var v = store.get(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
  var setJ = function (k, v) { store.set(k, JSON.stringify(v)); };
  var NUM = ["One","Two","Three","Four","Five","Six","Seven"];

  var kjv = function (r) { return '<div class="kjv"><span class="kjv-ref"><span>✝ ' + esc(r) + ' (KJV)</span></span>“' + esc(K[r]) + '”</div>'; };
  var kiky = function (t) { return '<blockquote class="kiky"><span class="chip kiky-chip">❝ Pastor Kiky Ocansey</span><p>' + esc(t) + '</p></blockquote>'; };

  var lvBlocks = function (o, id) {
    return '<details class="notes"><summary><span class="chip ed-chip">✎ Study notes</span> <span class="nt-open">Open study notes</span><span class="nt-close">Close study notes</span><span class="chev">▾</span></summary>' + '<div class="lv b" data-cue="' + id + '-b"><span class="chip lv-chip b">Beginner</span><p>' + esc(o.b) + '</p></div>' +
      '<div class="lv i" data-cue="' + id + '-i"><span class="chip lv-chip i">Intermediate</span><p>' + esc(o.i) + '</p></div>' +
      '<div class="lv a" data-cue="' + id + '-a"><span class="chip lv-chip a">Advanced</span><p>' + esc(o.a) + '</p></div></details>';
  };
  var kikyQ = function (t, cue) { return '<blockquote class="kiky" data-cue="' + cue + '"><span class="chip kiky-chip">❝ Pastor Kiky Ocansey</span><p>' + esc(t) + '</p></blockquote>'; };
  var refGroup = function (refs, cue) { return refs.length ? '<div class="refgrp" data-cue="' + cue + '">' + refs.map(kjv).join("") + '</div>' : ""; };
  var listenBtn = function (cue, part) { return '<button class="cbtn lbtn" data-from="' + cue + '" data-part="' + (part || "p2") + '">▶ Listen from here</button>'; };

  // ---------- PART 1: Pastor Kiky's words exactly as given ----------
  var nl = function (t) { return esc(t).replace(/\n/g, "<br>"); };
  $("#p1Text").innerHTML = D.p1.map(function (b) {
    if (b.kind === "head") return '<div class="p1-head" data-cue="' + b.id + '">' + b.text.split("\n").map(function (l, i) { return '<p class="p1h' + i + '">' + esc(l) + '</p>'; }).join("") + '</div>';
    if (b.kind === "kjv") { var parts = b.text.split("\n"); return '<div class="kjv p1-kjv" data-cue="' + b.id + '"><span class="kjv-ref"><span>✝ ' + esc(parts[0]) + '</span></span>' + esc(parts.slice(1).join(" ")) + '</div>'; }
    var cls = { kiky: "p1-p", step: "p1-p p1-step", say: "p1-say", decl: "p1-p p1-decl", end: "p1-end" }[b.kind] || "p1-p";
    return '<p class="' + cls + '" data-cue="' + b.id + '">' + nl(b.text) + '</p>';
  }).join("");

  // ---------- PART 2: Prophetic Directions Explained ----------
  $("#prepList").innerHTML = D.prep.map(function (p, i) { return '<li><div data-cue="prep' + (i + 1) + '"><b>' + esc(p.t) + '</b><br>' + esc(p.d) + '</div>' + refGroup([p.ref], "prep" + (i + 1) + "-r") + '</li>'; }).join("");
  $("#wordList").innerHTML = D.word.map(function (w, n) {
    return '<article class="step" id="' + w.id + '"><div class="step-h"><span class="num">' + (n + 1) + '</span><h3>' + esc(w.title) + ' <span class="muted small">' + esc(w.ref) + '</span></h3><button class="done" data-mark="w:' + w.id + '" aria-pressed="false">Mark studied</button></div>' +
      kikyQ(w.k[0], w.id + "-k") + refGroup(w.refs, w.id + "-r") + lvBlocks(w, w.id) +
      '<details class="deep"><summary>✝ Scripture for deeper study (' + w.deep.length + ' passages, not read aloud) <span class="chev">▾</span></summary>' + w.deep.map(kjv).join("") + '</details>' +
      '<div class="dact">' + listenBtn(w.id + "-k") + '</div></article>';
  }).join("");
  $("#stepList").innerHTML = D.steps.map(function (s, n) {
    return '<article class="step" id="' + s.id + '"><div class="step-h"><span class="num">' + (n + 1) + '</span><h3>Step ' + NUM[n] + '</h3><button class="done" data-mark="s:' + s.id + '" aria-pressed="false">Mark studied</button></div>' +
      kikyQ(s.k, s.id + "-k") + refGroup(s.refs, s.id + "-r") + lvBlocks(s, s.id) + (s.note ? '<p class="edn" data-cue="' + s.id + '-note">✎ A note · ' + esc(s.note) + '</p>' : "") +
      '<div class="dact">' + listenBtn(s.id + "-k") + '</div></article>';
  }).join("");
  // ---------- Names ----------
  var N = getJ("names", { self: "", spouse: "", children: [""], family: [""], others: [""] });
  var saveN = function () { setJ("names", N); renderSpeakOver(); renderSeal(); renderCert(); };
  $("#nmSelf").value = N.self || ""; $("#nmSpouse").value = N.spouse || "";
  $("#nmSelf").addEventListener("input", function () { N.self = this.value; if (!store.get("certName")) $("#certInput").value = this.value; saveN(); });
  $("#nmSpouse").addEventListener("input", function () { N.spouse = this.value; saveN(); });
  var drawGroup = function (g) {
    var box = $('[data-group="' + g + '"] .rows');
    if (!N[g] || !N[g].length) N[g] = [""];
    var label = { children: "Child’s name", family: "Family member’s name", others: "Name" }[g];
    box.innerHTML = N[g].map(function (v, i) { return '<div class="nrow"><input type="text" autocomplete="off" aria-label="' + label + " " + (i + 1) + '" placeholder="' + label + '" data-g="' + g + '" data-i="' + i + '" value="' + esc(v) + '"><button class="x" data-del="' + g + ':' + i + '" aria-label="Remove">×</button></div>'; }).join("");
  };
  ["children", "family", "others"].forEach(drawGroup);
  document.addEventListener("input", function (e) { var t = e.target; if (t.dataset && t.dataset.g) { N[t.dataset.g][+t.dataset.i] = t.value; saveN(); } });
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-add]"); if (a) { var g = a.dataset.add; N[g].push(""); drawGroup(g); var ins = $$('[data-group="' + g + '"] input'); ins[ins.length - 1].focus(); saveN(); }
    var d = e.target.closest("[data-del]"); if (d) { var p = d.dataset.del.split(":"); N[p[0]].splice(+p[1], 1); drawGroup(p[0]); saveN(); }
  });
  var list = function (arr) { return (arr || []).map(function (s) { return s.trim(); }).filter(Boolean); };
  var joinNames = function (a) { return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; };
  var namesFor = function (tags) {
    var out = [];
    tags.forEach(function (t) {
      if (t === "self" && N.self.trim()) out.push(["Myself", [N.self.trim()]]);
      if (t === "spouse" && N.spouse.trim()) out.push(["My husband or wife", [N.spouse.trim()]]);
      if (t === "children" && list(N.children).length) out.push(["My children", list(N.children)]);
      if (t === "family") { var f = list(N.family).concat(list(N.others)); if (N.spouse.trim() && tags.indexOf("spouse") < 0) f.unshift(N.spouse.trim()); if (list(N.children).length && tags.indexOf("children") < 0) f = f.concat(list(N.children)); if (f.length) out.push(["My family", f]); }
    });
    return out;
  };

  // ---------- Part 2: Declarations explained ----------
  $("#declList").innerHTML = D.decl.map(function (d, n) {
    var id = "d" + (n + 1), refs = d.refs.concat(d.deep || []);
    var wants = d.tags.some(function (t) { return t !== "self"; });
    return '<article class="dcard" id="' + id + '"><div class="dcard-h"><span class="num">' + (n + 1) + '</span><h3>' + esc(d.t) + '</h3><span class="dbtns"><button class="done pray" data-pray="' + (n + 1) + '" aria-pressed="false">Prayed today</button><button class="done" data-mark="d:' + (n + 1) + '" aria-pressed="false">Mark studied</button></span></div>' +
      kikyQ(d.k, id + "-k") + refGroup(refs, id + "-r") + lvBlocks(d, id) + (d.note ? '<p class="edn" data-cue="' + id + '-note">✎ A note · ' + esc(d.note) + '</p>' : "") +
      '<div class="so" data-tags="' + d.tags.join(",") + '"' + (wants ? ' data-cue="' + id + '-so"' : "") + '></div>' +
      '<div class="dact">' + listenBtn(id + "-k") + '</div></article>';
  }).join("");
  var renderSpeakOver = function () {
    var any = false;
    $$(".so").forEach(function (el) {
      var tags = el.dataset.tags.split(","), groups = namesFor(tags);
      var wantsNames = tags.some(function (t) { return t !== "self"; });
      if (groups.length) { any = true; el.innerHTML = '<div class="speak-over"><b>SPEAK THESE NAMES ALOUD</b>' + groups.map(function (g) { return esc(g[0]) + ": " + esc(joinNames(g[1])); }).join("<br>") + '</div>'; }
      else if (wantsNames) el.innerHTML = '<div class="speak-over"><b>SPEAK THESE NAMES ALOUD</b><a href="#family">Add your family’s names</a> to see them here.</div>';
      else el.innerHTML = "";
    });
    var all = [N.self, N.spouse].map(function (s) { return (s || "").trim(); }).filter(Boolean).concat(list(N.children), list(N.family), list(N.others));
    var box = $("#namesSummary");
    if (all.length) { box.hidden = false; box.innerHTML = '<span class="chip kiky-chip">Standing for ' + all.length + (all.length === 1 ? " name" : " names") + '</span><p>' + esc(joinNames(all)) + '</p>'; } else box.hidden = true;
  };
  var renderSeal = function () {
    $("#sealPrayer").textContent = D.seal;
    var all = [N.self, N.spouse].map(function (s) { return (s || "").trim(); }).filter(Boolean).concat(list(N.children), list(N.family), list(N.others));
    var el = $("#sealNames"); el.hidden = !all.length; el.innerHTML = all.length ? "<b>The names you are covering:</b> " + esc(joinNames(all)) : "";
  };
  $("#closeVerses").innerHTML = refGroup(["Revelation 12:11", "Luke 1:37"], "close-r");

  // ---------- Additional work ----------
  $("#assignList").innerHTML = D.assign.map(function (a) { return "<li><b>" + esc(a[0]) + ".</b> " + esc(a[1]) + "</li>"; }).join("");
  var J = getJ("journal", {});
  $("#journal").innerHTML = '<p class="muted small">Your answers stay on this device.</p>' + D.journal.map(function (q, i) { return '<div class="jq"><label for="j' + i + '">' + esc(q) + '</label><textarea id="j' + i + '" rows="3" data-j="' + i + '">' + esc(J[i] || "") + '</textarea></div>'; }).join("");
  document.addEventListener("input", function (e) { if (e.target.dataset && e.target.dataset.j !== undefined) { J[e.target.dataset.j] = e.target.value; setJ("journal", J); } });
  $("#charList").innerHTML = D.chars.map(function (c) { return '<div class="char2"><b>' + esc(c[0]) + '</b>' + esc(c[1]) + c[2].map(kjv).join("") + '</div>'; }).join("");

  // ---------- level choice (one setting for the whole page and the audio) ----------
  var MODE = store.get("mode") || "prayer";
  var applyMode = function (m) {
    MODE = m; store.set("mode", m);
    $$(".mode-bar button").forEach(function (x) { x.setAttribute("aria-pressed", x.dataset.mode === m ? "true" : "false"); });
    $(".levels-bar").hidden = m !== "study";
    $$("details.notes").forEach(function (d) { d.open = m === "study"; });
    window.L137Level = m === "study" ? (store.get("level") || "all") : "none";
  };
  document.addEventListener("click", function (e) { var g = e.target.closest(".mode-bar button"); if (g) applyMode(g.dataset.mode); });
  var applyLevel = function (lv) {
    store.set("level", lv); if (MODE === "study") window.L137Level = lv;
    $$(".levels-bar button").forEach(function (x) { x.setAttribute("aria-pressed", x.dataset.level === lv ? "true" : "false"); });
    $$(".lv").forEach(function (el) { el.hidden = !(lv === "all" || el.classList.contains(lv)); });
  };
  document.addEventListener("click", function (e) { var g = e.target.closest(".levels-bar button"); if (g) applyLevel(g.dataset.level); });
  applyLevel(store.get("level") || "all"); applyMode(MODE);
  // ---------- progress ----------
  var P = getJ("progress", {});
  var today = function () { var d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); };
  var prayedToday = function () { var r = getJ("prayed", null); if (!r || r.day !== today()) { r = { day: today(), m: {} }; setJ("prayed", r); } return r; };
  document.addEventListener("click", function (e) { var b = e.target.closest("[data-pray]"); if (!b) return; var r = prayedToday(); r.m[b.dataset.pray] = !r.m[b.dataset.pray]; setJ("prayed", r); syncMarks(); });
  var markEls = function () { return $$("[data-mark]"); };
  var syncMarks = function () {
    markEls().forEach(function (b) {
      var on = !!P[b.dataset.mark]; b.setAttribute("aria-pressed", on ? "true" : "false");
      var k = b.dataset.mark.charAt(0);
      b.textContent = on ? "✓ Studied" : "Mark studied";
    });
    var PR = prayedToday();
    $$("[data-pray]").forEach(function (b) { var on = !!PR.m[b.dataset.pray]; b.setAttribute("aria-pressed", on ? "true" : "false"); b.textContent = on ? "✓ Prayed today" : "Prayed today"; });
    var dc = Object.keys(PR.m).filter(function (k) { return PR.m[k]; }).length;
    $("#declCount").textContent = "Today’s prayer: " + dc + " of 25 declarations prayed" + (dc === 25 ? " · complete for today" : "");
    updateProgress();
  };
  document.addEventListener("click", function (e) { var b = e.target.closest("[data-mark]"); if (!b) return; P[b.dataset.mark] = !P[b.dataset.mark]; setJ("progress", P); syncMarks(); renderCert(); });
  var quizPassed = function () { return !!getJ("quizBest", 0) && getJ("quizBest", 0) >= 10; };
  var updateProgress = function () {
    var w = D.word.filter(function (x) { return P["w:" + x.id]; }).length, s = D.steps.filter(function (x) { return P["s:" + x.id]; }).length, d = D.decl.filter(function (_, i) { return P["d:" + (i + 1)]; }).length;
    var tot = 3 + 7 + 25, done = w + s + d, pct = Math.round(done / tot * 100);
    $("#ringFill").style.strokeDashoffset = (113.1 * (1 - done / tot)).toFixed(1);
    $("#progPct").textContent = pct + "%"; $("#progText").innerHTML = '<span class="pl">Study progress: </span><span class="pm">Study </span>' + done + " of " + tot;
    $("#progBtn").setAttribute("aria-label", "Study progress: " + pct + "%. Show what counts");
    $("#progList").innerHTML = "<li>Bible Study points studied: " + w + " of 3</li><li>Steps studied: " + s + " of 7</li><li>Declarations studied: " + d + " of 25</li>";
  };
  $("#progBtn").onclick = function () { var i = $("#progInfo"); i.hidden = !i.hidden; this.setAttribute("aria-expanded", String(!i.hidden)); };

  var ask = function (t, b, ok, fn) {
    var m = $("#confirmBox"); $("#cTitle").textContent = t; $("#cBody").textContent = b; $("#cOk").textContent = ok; m.hidden = false;
    $("#cOk").onclick = function () { m.hidden = true; fn(); }; $("#cCancel").onclick = function () { m.hidden = true; };
  };
  $("#restartBtn").onclick = function () {
    ask("Start over?", "This clears your study marks, today’s prayer marks, and quiz results on this device. Your family names and journal are kept.", "Start over", function () {
      P = {}; setJ("progress", P); setJ("prayed", { day: today(), m: {} }); setJ("quizBest", 0); QA = {}; setJ("quizA", QA); renderQuiz(); syncMarks(); renderCert();
    });
  };

  // ---------- quiz ----------
  var QA = getJ("quizA", {});
  var norm = function (s) { return String(s || "").toLowerCase().replace(/[^a-z]/g, ""); };
  var shuffleOrder = function (n) { var a = []; for (var i = 0; i < n; i++) a.push(i); return [2, 0, 3, 1].slice(0, n); };
  var renderQuiz = function () {
    $("#quizBox").innerHTML = D.quiz.map(function (q, i) {
      var h = '<div class="q" data-i="' + i + '"><p>' + (i + 1) + ". " + esc(q.q) + "</p>";
      if (q.type === "mc") h += '<div class="opts">' + q.o.map(function (o, j) { return '<button class="opt" data-q="' + i + '" data-v="' + j + '">' + esc(o) + "</button>"; }).join("") + "</div>";
      if (q.type === "tf") h += '<div class="opts"><button class="opt" data-q="' + i + '" data-v="true">True</button><button class="opt" data-q="' + i + '" data-v="false">False</button></div>';
      if (q.type === "fill") h += '<div class="fill"><input type="text" aria-label="Your answer" autocomplete="off" data-fill="' + i + '"><button class="cbtn" data-check="' + i + '">Check</button></div>';
      if (q.type === "order") { var ord = shuffleOrder(q.items.length); h += '<div class="ord">' + ord.map(function (k) { return '<label><select data-ord="' + i + '" data-k="' + k + '" aria-label="Position"><option value="">#</option>' + q.items.map(function (_, p) { return '<option value="' + p + '">' + (p + 1) + '</option>'; }).join("") + '</select><span>' + esc(q.items[k]) + '</span></label>'; }).join("") + '</div><div class="row"><button class="cbtn" data-check="' + i + '">Check order</button></div>'; }
      return h + '<div class="fb" aria-live="polite"></div><p class="exp" hidden>' + esc(q.e) + "</p></div>";
    }).join("");
    Object.keys(QA).forEach(function (i) { showResult(+i, QA[i].ok, QA[i].v, true); });
    score();
  };
  var showResult = function (i, ok, v, restoring) {
    var box = $('.q[data-i="' + i + '"]'), q = D.quiz[i];
    box.classList.add(ok ? "ok" : "no");
    $(".fb", box).textContent = ok ? "Correct." : "Not quite.";
    $(".exp", box).hidden = false;
    $$(".opt", box).forEach(function (b) {
      b.disabled = true;
      var isAns = q.type === "mc" ? +b.dataset.v === q.a : String(q.a) === b.dataset.v;
      if (isAns) b.classList.add("right"); else if (b.dataset.v === String(v)) b.classList.add("wrong");
    });
    $$("input,select,[data-check]", box).forEach(function (el) { el.disabled = true; });
    if (restoring && q.type === "fill") $("input", box).value = v || "";
  };
  var score = function () {
    var n = Object.keys(QA).length, c = Object.keys(QA).filter(function (k) { return QA[k].ok; }).length;
    if (!n) { $("#quizScore").textContent = ""; return; }
    if (n < D.quiz.length) { $("#quizScore").textContent = c + " correct so far · " + (D.quiz.length - n) + " to go"; return; }
    var best = Math.max(getJ("quizBest", 0), c); setJ("quizBest", best);
    $("#quizScore").textContent = "You scored " + c + " of " + D.quiz.length + "." + (c >= 10 ? " Your Study Completion Certificate is ready below." : " A score of 10 or more gives the Study Completion Certificate. Use Retake to try again if you wish.");
    updateProgress(); renderCert();
  };
  document.addEventListener("click", function (e) {
    var o = e.target.closest(".opt"); if (o && !o.disabled) {
      var i = +o.dataset.q, q = D.quiz[i], v = o.dataset.v, ok = q.type === "mc" ? +v === q.a : String(q.a) === v;
      QA[i] = { ok: ok, v: v }; setJ("quizA", QA); showResult(i, ok, v); score(); return;
    }
    var c = e.target.closest("[data-check]"); if (c && !c.disabled) {
      var i2 = +c.dataset.check, q2 = D.quiz[i2], ok2, val = "";
      if (q2.type === "fill") { val = $('[data-fill="' + i2 + '"]').value; if (!val.trim()) { $('.q[data-i="' + i2 + '"] .fb').textContent = "Type your answer first."; return; } ok2 = q2.a.some(function (a) { return norm(a) === norm(val); }); }
      else { var sel = $$('[data-ord="' + i2 + '"]'); if (sel.some(function (s) { return s.value === ""; })) { $('.q[data-i="' + i2 + '"] .fb').textContent = "Number every step first."; return; } ok2 = sel.every(function (s) { return +s.value === +s.dataset.k; }); }
      QA[i2] = { ok: ok2, v: val }; setJ("quizA", QA); showResult(i2, ok2, val); score();
    }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Enter" && e.target.dataset && e.target.dataset.fill !== undefined) { $('[data-check="' + e.target.dataset.fill + '"]').click(); } });
  $("#quizReset").onclick = function () { QA = {}; setJ("quizA", QA); renderQuiz(); };

  // ---------- certificate ----------
  var certIn = $("#certInput"); certIn.value = store.get("certName") || N.self || "";
  certIn.addEventListener("input", function () { store.set("certName", certIn.value); renderCert(); });
  var completedOn = function () { var d = store.get("certDate"); if (!d) { d = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }); store.set("certDate", d); } return d; };
  var renderCert = function () {
    var ok = quizPassed();
    $("#certWrap").hidden = !ok;
    $("#certMsg").textContent = ok ? "Your Study Completion Certificate is ready. Check the name, then download or print it." : "Score 10 or more in the optional quiz to receive this certificate.";
    if (!ok) return;
    var nm = (certIn.value || "").trim() || "Your Name";
    $("#certName").textContent = nm;
    $("#certMeta").textContent = "Study completed " + completedOn() + " · Quiz score " + getJ("quizBest", 0) + " of 12";
  };
  $("#certPrint").onclick = function () { window.print(); };
  $("#certDl").onclick = function () {
    var W = 1600, H = 1130, cv = document.createElement("canvas"); cv.width = W; cv.height = H; var c = cv.getContext("2d");
    var go = function () {
      c.fillStyle = "#fbf7ea"; c.fillRect(0, 0, W, H);
      var g = c.createRadialGradient(W / 2, 0, 0, W / 2, 0, 900); g.addColorStop(0, "rgba(230,209,154,.45)"); g.addColorStop(1, "rgba(230,209,154,0)"); c.fillStyle = g; c.fillRect(0, 0, W, H);
      c.strokeStyle = "#9a7010"; c.lineWidth = 6; c.strokeRect(40, 40, W - 80, H - 80); c.strokeStyle = "#c9a34a"; c.lineWidth = 2; c.strokeRect(62, 62, W - 124, H - 124);
      c.textAlign = "center";
      var t = function (s, y, font, col) { c.font = font; c.fillStyle = col; c.fillText(s, W / 2, y); };
      t("L137 DELIVERANCE MINISTRY INTERNATIONAL", 170, "700 26px Cinzel", "#9a7010");
      t("Study Completion Certificate", 265, "700 62px Cinzel", "#0f172a");
      t("This is to certify that", 345, "500 34px 'Cormorant Garamond'", "#2a2722");
      var nm = $("#certName").textContent, fs = 84; c.font = "italic 700 " + fs + "px 'Cormorant Garamond'"; while (c.measureText(nm).width > 1200 && fs > 40) { fs -= 4; c.font = "italic 700 " + fs + "px 'Cormorant Garamond'"; }
      c.fillStyle = "#5B2A86"; c.fillText(nm, W / 2, 455); c.strokeStyle = "#c9a34a"; c.lineWidth = 2; c.beginPath(); c.moveTo(380, 485); c.lineTo(W - 380, 485); c.stroke();
      t("has completed the interactive study and quiz for the prophetic direction", 550, "500 32px 'Cormorant Garamond'", "#2a2722");
      t("REFUSE TO REMAIN LIKE THIS", 640, "700 54px Cinzel", "#0f172a");
      t("Family Bondage · Earth! Earth!! Earth!!! Hear the Word of the Lord", 705, "500 30px 'Cormorant Garamond'", "#2a2722");
      t("A prophetic direction by Pastor Kiky Ocansey · October 21, 2026", 750, "500 30px 'Cormorant Garamond'", "#5B2A86");
      t($("#certMeta").textContent, 850, "500 24px Inter", "#5b5446");
      t("“For with God nothing shall be impossible.” Luke 1:37", 940, "italic 500 34px 'Cormorant Garamond'", "#8b0000");
      t("This certificate records completion of a study. It is not a ministry accreditation or credential and does not measure any spiritual outcome.", 1020, "500 19px Inter", "#6b6457");
      var a = document.createElement("a"); a.download = "Study Completion Certificate - Refuse to Remain Like This.png";
      try { a.href = cv.toDataURL("image/png"); a.click(); } catch (e) { window.print(); }
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(go); else go();
  };

  renderSpeakOver(); renderSeal(); renderQuiz(); syncMarks(); renderCert();

  // ---------- day / night ----------
  var root = document.documentElement, btn = $("#themeBtn");
  var setTheme = function (t) { root.setAttribute("data-theme", t); store.set("theme", t); $(".theme-label", btn).textContent = t === "night" ? "Night" : "Day"; btn.setAttribute("aria-label", t === "night" ? "Switch to day" : "Switch to night"); };
  btn.onclick = function () { setTheme(root.getAttribute("data-theme") === "night" ? "day" : "night"); };
  setTheme(store.get("theme") || "day");
  var cv = $("#sky"), ctx = cv.getContext("2d"), stars = [], W = 0, H = 0;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var size = function () { var dpr = Math.min(window.devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); stars = []; var n = Math.round(W * H / 6000); for (var i = 0; i < n; i++) stars.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.3 + .3, p: Math.random() * 6.28, s: .5 + Math.random() * 1.5 }); };
  var draw = function (t) {
    if (root.getAttribute("data-theme") === "night") {
      ctx.clearRect(0, 0, W, H);
      var g = ctx.createRadialGradient(W * .85, H * .12, 0, W * .85, H * .12, 260); g.addColorStop(0, "rgba(230,209,154,.18)"); g.addColorStop(1, "rgba(230,209,154,0)"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(240,230,200,.9)"; ctx.beginPath(); ctx.arc(W * .85, H * .12, 26, 0, 6.29); ctx.fill();
      ctx.fillStyle = "#0b1220"; ctx.beginPath(); ctx.arc(W * .85 + 11, H * .12 - 7, 23, 0, 6.29); ctx.fill();
      for (var i = 0; i < stars.length; i++) { var s = stars[i], a = reduce ? .7 : .35 + .65 * Math.abs(Math.sin(s.p + t / 1000 * s.s)); ctx.fillStyle = "rgba(246,236,206," + a.toFixed(2) + ")"; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.29); ctx.fill(); }
    }
    requestAnimationFrame(draw);
  };
  size(); addEventListener("resize", size); requestAnimationFrame(draw);
})();
