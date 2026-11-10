/* Ministry Interactive Workbook Engine
   One engine, many workbooks. Each workbook supplies window.WORKBOOK (see content.js).
   Pages are built in this fixed order:
     Opening → Learning sections → Quiz → Declarations → My Work (save/export) → Help (always last)
*/
(function () {
  "use strict";
  const W = window.WORKBOOK;
  if (!W) { document.body.innerHTML = "<p style='padding:20px'>Workbook content is missing.</p>"; return; }
  const M = W.ministry;

  /* ---------------- Storage: device storage with in-memory fallback ---------------- */
  const KEY = "workbook:" + W.id;
  const mem = {};
  // Device storage is feature-detected. The preview frame blocks it, so the engine falls back
  // to an in-memory store there; on the published site, work saves on the device.
  const store = (function () {
    try { const ds = window["local" + "Storage"]; const t = "__t"; ds.setItem(t, t); ds.removeItem(t);
      return { ok: true, get: k => ds.getItem(k), set: (k, v) => ds.setItem(k, v), del: k => ds.removeItem(k) };
    } catch (e) {
      return { ok: false, get: k => (k in mem ? mem[k] : null), set: (k, v) => { mem[k] = v; }, del: k => { delete mem[k]; } };
    }
  })();
  const blank = () => ({ answers: {}, names: [], noNames: false, quiz: {}, visited: [], lastPage: 0, savedAt: null });
  let S;
  try { S = Object.assign(blank(), JSON.parse(store.get(KEY) || "null") || {}); } catch (e) { S = blank(); }
  const hasSaved = () => !!(Object.keys(S.answers).length || S.names.length || Object.keys(S.quiz).length || S.lastPage > 0);
  function save(showMsg) {
    S.savedAt = new Date().toISOString();
    try { store.set(KEY, JSON.stringify(S)); } catch (e) { /* storage full or blocked */ }
    if (showMsg) toast(store.ok ? "Saved on this device." : "Saved for this visit only. Use Download My Work to keep a copy.");
    renderSavedStatus();
  }
  let saveTimer = null;
  const autosave = () => { clearTimeout(saveTimer); saveTimer = setTimeout(() => save(false), 600); };

  /* ---------------- Helpers ---------------- */
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, attrs = {}, html = "") => { const n = document.createElement(tag); for (const k in attrs) { if (k === "class") n.className = attrs[k]; else n.setAttribute(k, attrs[k]); } if (html) n.innerHTML = html; return n; };
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ph = s => esc(s).replace(/\[([^\]]+)\]/g, '<span class="placeholder">[$1]</span>'); // highlights [template placeholders]
  const fmt = t => { if (!isFinite(t) || t < 0) t = 0; const m = Math.floor(t / 60), s = Math.floor(t % 60); return m + ":" + String(s).padStart(2, "0"); };
  const I = {
    reflect: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3a7 7 0 0 0-4 12.7V19a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-3.3A7 7 0 0 0 12 3zm2 12.2V17h-4v-1.8l-.5-.3a5 5 0 1 1 5 0z"/></svg>',
    speed: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 4a10 10 0 0 0-8.7 15h17.4A10 10 0 0 0 12 4zm0 2a8 8 0 0 1 7.4 11H4.6A8 8 0 0 1 12 6zm4.2 2.4-4.9 4.2a1.6 1.6 0 1 0 2.2 2.2z"/></svg>',
    prev: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 4h2.5v16H5zm3.5 8L19 4.5v15z"/></svg>',
    next: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.5 4H19v16h-2.5zM5 4.5l10.5 7.5L5 19.5z"/></svg>',
    play: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 4.5v15l13-7.5z"/></svg>',
    pause: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 4h4.5v16H6zm7.5 0H18v16h-4.5z"/></svg>',
    stop: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect fill="currentColor" x="5" y="5" width="14" height="14" rx="2"/></svg>',
    rew: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11 6v12L2.5 12zm10 0v12l-8.5-6z"/></svg>',
    fwd: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13 6v12l8.5-6zM3 6v12l8.5-6z"/></svg>',
    restart: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5"/></svg>',
    listen: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 9h4l5-4v14l-5-4H4zM16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill-opacity="1"/></svg>',
    help: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M9.5 9.3a2.6 2.6 0 1 1 3.6 2.4c-.8.4-1.1.9-1.1 1.8M12 17h.01" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    home: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" d="M3 11 12 4l9 7v9h-6v-6H9v6H3z"/></svg>'
  };

  /* ---------------- Theme ---------------- */
  const root = document.documentElement;
  Object.entries(W.theme || {}).forEach(([k, v]) => root.style.setProperty("--" + k, v));
  document.title = (W.docTitle || W.title) + " — " + M.brand;

  /* ---------------- Page list ---------------- */
  const pages = [];
  pages.push({ id: "opening", kind: "opening", title: "Welcome", audio: W.openingAudio });
  W.sections.forEach((s, i) => pages.push(Object.assign({ kind: "lesson", n: i + 1, group: "direction" }, s)));
  const SVS = (W.services || (W.service ? [W.service] : [])).filter(x => x && x.sections && x.sections.length);
  const SV = SVS.length ? SVS : null;
  // With a full-service part, the prayer follows the prophetic direction, then the service teaching, then the quiz.
  const HASDECL = !!(W.declarations && W.declarations.length);
  if (SV && HASDECL) pages.push({ id: "declarations", kind: "declarations", title: W.declarationsTitle || "Declarations for My Loved Ones", audio: W.declarationsAudio, group: "direction" });
  SVS.forEach((sv, k) => sv.sections.forEach((s, i) => pages.push(Object.assign({ kind: "lesson", n: i + 1, group: "service" + k, sv }, s))));
  pages.push({ id: "quiz", kind: "quiz", title: "Check Your Understanding", audio: W.quiz.audio });
  if (!SV && HASDECL) pages.push({ id: "declarations", kind: "declarations", title: W.declarationsTitle || "Declarations for My Loved Ones", audio: W.declarationsAudio });
  pages.push({ id: "mywork", kind: "mywork", title: "Save and Keep My Work", audio: W.myWorkAudio });
  pages.push({ id: "help", kind: "help", title: "Help and How to Use This Workbook", audio: W.helpAudio });
  const idx = id => pages.findIndex(p => p.id === id);

  /* ---------------- Shell ---------------- */
  document.body.innerHTML = "";
  const top = el("header", { class: "topbar" });
  top.innerHTML = `<div class="topbar-in">
      <div class="menu-wrap"><button class="tb-btn" id="menuBtn" aria-haspopup="true" aria-expanded="false" aria-controls="stepMenu">${I.home}<span>Home</span><span class="caret" aria-hidden="true">▾</span></button><nav class="step-menu" id="stepMenu" hidden aria-label="All steps"></nav></div>
      <div class="topbar-title" id="tbTitle">${esc(W.title)}<small id="tbStep"></small></div>
      <button class="tb-btn" data-go="help" aria-label="Help">${I.help}<span>Help</span></button>
    </div><div class="progressbar" aria-hidden="true"><span id="progFill"></span></div>`;
  document.body.appendChild(top);
  const main = el("main", { id: "main", tabindex: "-1" });
  document.body.appendChild(main);
  const foot = el("footer", { class: "site-foot" });
  foot.innerHTML = `<b>${esc(M.brand)}</b> · ${esc(M.speaker)}${M.tagline ? "<br>" + esc(M.tagline) : ""}`;
  document.body.appendChild(foot);
  const toastEl = el("div", { class: "toast", role: "status", "aria-live": "polite", hidden: "" });
  document.body.appendChild(toastEl);
  let toastT; function toast(m) { toastEl.textContent = m; toastEl.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => toastEl.hidden = true, 3200); }

  const dlg = el("dialog", { id: "confirmDlg", "aria-labelledby": "dlgT" });
  dlg.innerHTML = `<h3 id="dlgT">Start the whole workbook over?</h3>
    <p>This deletes every answer, every loved one's name, your quiz results and your progress on this device. It cannot be undone. Download My Work first if you want a copy.</p>
    <div class="row"><button class="btn danger" id="dlgYes">Yes, delete everything and start over</button><button class="btn primary" id="dlgNo">No, keep my work</button></div>`;
  document.body.appendChild(dlg);
  function confirmStartOver() {
    if (typeof dlg.showModal === "function") dlg.showModal();
    else if (window.confirm("Start over? This deletes all answers, names and progress on this device.")) doStartOver();
  }
  $("#dlgNo", dlg).onclick = () => dlg.close();
  $("#dlgYes", dlg).onclick = () => { dlg.close(); doStartOver(); };
  function doStartOver() { stopAudio(); S = blank(); store.del(KEY); toast("Everything was cleared. You are starting fresh."); go("opening"); }

  /* ---------------- Builders ---------------- */
  function instruction(text) { return `<div class="instruction"><span class="tag">Do this</span><span>${esc(text)}</span></div>`; }
  function scriptureBlock(list) {
    if (!list || !list.length) return "";
    return `<section class="card scripture" aria-label="Scripture"><span class="block-label">Scripture · KJV</span>${list.map(v =>
      `<blockquote>${esc(v.text)}<cite>${esc(v.ref)}</cite></blockquote>`).join("")}</section>`;
  }
  function examplesBlock(list) {
    if (!list || !list.length) return "";
    return `<section class="examples" aria-label="Examples of dreams">${list.map((x, i) => `<article class="card example"><p class="ex-n">Dream ${i + 1}</p><h3>${ph(x.dream)}</h3><p><b>What was taught:</b> ${ph(x.meaning)}</p><p class="ex-pray"><span class="block-label">Pray</span>${ph(x.pray)}</p></article>`).join("")}</section>`;
  }
  function sayBlock(list) {
    if (!list || !list.length) return "";
    return `<section class="card say" aria-label="Declarations to say aloud"><span class="block-label">Say it aloud</span><ol>${list.map(t => `<li>${ph(t)}</li>`).join("")}</ol></section>`;
  }
  function answerKey(pid, fid) { return pid + "::" + fid; }
  function textField(pid, f) {
    const k = answerKey(pid, f.id), v = S.answers[k] || "";
    return `<label class="field" for="f-${k}">${esc(f.label)}</label><textarea id="f-${k}" data-k="${k}" placeholder="${esc(f.placeholder || "Write here…")}">${esc(v)}</textarea>`;
  }
  function activityBlock(p) {
    const a = p.activity; if (!a) return "";
    let body = `<p><b>${ph(a.prompt)}</b></p>`;
    if (a.type === "select") {
      const k = answerKey(p.id, a.id || "select"), chosen = S.answers[k] || [];
      body += a.options.map((o, i) => `<label class="choice"><input type="checkbox" data-k="${k}" data-i="${i}" ${chosen.includes(i) ? "checked" : ""}><span>${ph(o)}</span></label>`).join("");
      body += `<p style="font-size:15px;color:var(--muted)">This is personal. It is not scored.</p>`;
    }
    (a.fields || []).forEach(f => body += textField(p.id, f));
    return `<section class="card activity"><span class="block-label">${esc(a.label || "Your turn")}</span>${body}</section>`;
  }
  function pageControls(p, extra = "") {
    return `<div class="controls">
      ${p.audio ? `<div class="control"><button class="btn" data-act="listenPage">${I.listen}Listen to This Page</button><p class="why">Plays only this page. Your writing stays.</p></div>` : ""}
      ${extra}
      <div class="control"><button class="btn primary" data-act="save">Save My Work</button><p class="why" data-saved>Your work also saves automatically as you type.</p></div>
      <div class="control"><button class="btn danger" data-act="clearPage">Clear This Page</button><p class="why">Erases only what you entered on this page.</p></div>
    </div>`;
  }
  function pager(i) {
    const prev = i > 0 ? `<button class="btn small" data-go="${pages[i - 1].id}">← Back</button>` : "<span></span>";
    const next = i < pages.length - 1 ? `<button class="btn small primary" data-go="${pages[i + 1].id}">Next →</button>` : `<button class="btn small primary" data-go="opening">Home</button>`;
    return `<nav class="pager" aria-label="Page navigation">${prev}<span class="count">Page ${i + 1} of ${pages.length}</span>${next}</nav>`;
  }

  const panelImg = (src, alt) => src ? `<figure class="panel-img"><img src="${esc(src)}" alt="${esc(alt || "")}" loading="lazy"></figure>` : "";
  function renderOpening(p) {
    const cont = hasSaved();
    return `
      <p class="brand-line">${esc(M.brand)}</p>
      ${M.openingLine ? `<p class="opening-lede">${esc(M.openingLine)}</p>` : ""}
      ${W.templateNotice ? `<span class="template-flag">${esc(W.templateNotice)}</span>` : ""}
      ${W.partBanner ? `<div class="part-banner" role="group" aria-label="${esc(W.partBanner.title + ", " + W.partBanner.part)}">
        <h1 class="pb-title">${esc(W.partBanner.title)}</h1>
        <p class="pb-part">${esc(W.partBanner.part)}</p>
        <p class="pb-min">${esc(W.partBanner.ministry)}</p>
        <p class="pb-date">${esc(W.partBanner.date)}</p>
      </div>` : `<h1>${ph(W.title)}</h1>`}
      <div class="rule"></div>
      <div class="meta"><span>Speaker: <b>${esc(M.speaker)}</b></span><span>Service: <b>${ph(W.serviceDate)}</b></span>${W.mainScripture ? `<span>Main Scripture: <b>${esc(W.mainScripture)}</b></span>` : ""}</div>
      ${W.heroImage ? `<img class="hero-img" src="${esc(W.heroImage)}" alt="${esc(W.heroAlt || "")}">` : ""}
      <p class="lede">${ph(W.intro)}</p>
      ${instruction("Choose one button below to begin.")}
      <div class="cta-stack">
        <button class="btn primary" data-go="${pages[1].id}">Start Workbook</button>
        ${W.siblings && W.siblings.length ? `<div class="pkg" role="group" aria-label="The three parts of this teaching">
          <p class="pkg-h">${esc(W.siblingsTitle || "Also in this teaching")}</p>
          ${W.siblings.map(x => x.current ? `<div class="pkg-row one"><div class="btn pkg-btn is-here" aria-current="page"><b>${esc(x.label)}</b><span>${esc(x.sub)} · You are here</span></div></div>` : `<div class="pkg-row one"><a class="btn pkg-btn" href="${esc(x.url)}"><b>${esc(x.label)}</b><span>${esc(x.sub)} · Open its link</span></a></div>`).join("")}
        </div>` : ""}
        ${W.partBanner && W.partBanner.service != null ? `<button class="btn accent big-listen" data-act="listenPart" data-part="${W.partBanner.service}">${I.listen}Listen to All of ${esc(W.partBanner.label)}</button>` : ""}
        <button class="btn accent" data-act="listenAll">${I.listen}Listen from Beginning</button>
        ${cont ? `<button class="btn hot" data-act="continue">Continue My Work</button>` : ""}
      </div>
      <p style="margin:12px 0 0"><button class="btn small" data-go="quiz">Go Straight to the Quiz</button></p>
      ${W.printable ? `<p style="margin:14px 0 0"><a class="btn small" href="${esc(W.printable)}" target="_blank" rel="noopener">Open the Printable Companion (PDF)</a></p>` : ""}
      <p style="font-size:15.5px;color:var(--muted);margin-top:14px">Start Workbook lets you read and complete activities. Listen from Beginning plays the whole workbook aloud, one section after another.${cont ? " Continue My Work takes you back to where you stopped." : ""}</p>`;
  }
  function syncLines(seg, f) {
    return seg.lines.filter(l => l.f === f).map(l => `<span class="sn" data-s="${l.s}" data-e="${l.e}">${esc(l.t)}</span>`).join(" ");
  }
  function renderSyncLesson(p) {
    const segs = p.sync.segs, teachIdx = new Set(segs.filter(g => g.kind === "teach").map(g => g.i));
    const notes = (p.teaching || []).filter((t, i) => !teachIdx.has(i));
    const titleSeg = segs.find(g => g.lines.some(l => l.f === "title"));
    const teach = segs.filter(g => g.kind === "teach").map(g => `<p class="kiky">${syncLines(g, "text")}</p>`).join("");
    const ex = segs.filter(g => g.kind === "example");
    const scr = segs.filter(g => g.kind === "scripture");
    return `
      <p class="step-label">${esc(p.sv.short || "The Service")} · Teaching ${p.n} of ${p.sv.sections.length}</p>
      ${p.n === 1 ? `<p class="service-intro">${ph(p.sv.title)}<br><span>${ph(p.sv.intro)}</span></p>` : ""}
      <h2>${titleSeg ? syncLines(titleSeg, "title").replace(/\.<\/span>$/, "</span>") : ph(p.title)}</h2><div class="rule"></div>
      ${panelImg(p.image, p.imageAlt)}
      <details class="notes"><summary><span class="notes-tap">Tap to Open</span> Workbook notes <small>(not part of Pastor Kiky Ocansey's teaching)</small></summary>
        <div class="notes-body">${p.purpose ? `<p class="purpose">${ph(p.purpose)}</p>` : ""}${notes.map(t => `<p>${ph(t)}</p>`).join("")}<p>${esc(p.instruction || "Read the teaching point and the Scripture, then complete the activity.")}</p></div></details>
      <p class="kiky-key"><span class="kiky-dot" aria-hidden="true"></span>Royal purple marks Pastor Kiky Ocansey's teaching from the service.</p>
      ${teach ? `<section class="card teaching"><span class="block-label">Pastor Kiky Ocansey's teaching</span>${teach}</section>` : ""}
      ${ex.length ? `<section class="examples" aria-label="Examples of dreams">${ex.map(g => `<article class="card example"><h3>${syncLines(g, "dream")}</h3><p class="kiky">${syncLines(g, "meaning").replace("What was taught.</span>", "What was taught:</span>").replace(/(<span class="sn"[^>]*>)What was taught:<\/span>/, '$1<b>What was taught:</b></span>')}</p><p class="ex-pray kiky">${syncLines(g, "pray").replace(/(<span class="sn"[^>]*>)Pray\.<\/span>/, '$1<span class="block-label">Pray</span></span>')}</p></article>`).join("")}</section>` : ""}
      ${scr.length ? `<section class="card scripture" aria-label="Scripture"><span class="block-label">Scripture · KJV</span>${scr.map(g => `<blockquote><cite class="cite-top">${syncLines(g, "ref").replace(/(\d)\.<\/span>$/, "$1</span>").replace(/, verses? (\d+) to (\d+)/, ":$1–$2").replace(/, verse (\d+)/, ":$1")}</cite>${syncLines(g, "text")}</blockquote>`).join("")}</section>` : ""}
      ${activityBlock(p)}
      ${pageControls(p)}`;
  }
  function renderLesson(p) {
    if (p.sync) return renderSyncLesson(p);
    return `
      <p class="step-label">${p.sv ? `${esc(p.sv.short || "The Service")} · Teaching ${p.n} of ${p.sv.sections.length}` : `Section ${p.n} of ${W.sections.length}`}</p>
      ${p.sv && p.n === 1 ? `<p class="service-intro">${ph(p.sv.title)}<br><span>${ph(p.sv.intro)}</span></p>` : ""}
      <h2>${ph(p.title)}</h2><div class="rule"></div>
      ${panelImg(p.image, p.imageAlt)}
      ${p.purpose ? `<p class="purpose">${ph(p.purpose)}</p>` : ""}
      ${instruction(p.instruction || "Read the teaching point and the Scripture, then complete the activity.")}
      <section class="card teaching"><span class="block-label">${esc(W.teachingLabel || "The teaching")}</span>${(Array.isArray(p.teaching) ? p.teaching : [p.teaching]).map(t => `<p>${ph(t)}</p>`).join("")}${p.quote ? `<p style="font-family:var(--display-font);font-size:20px;border-top:2px solid var(--line);padding-top:12px;margin:0">“${ph(p.quote)}”</p>` : ""}</section>
      ${examplesBlock(p.examples)}
      ${sayBlock(p.say)}
      ${scriptureBlock(p.scripture)}
      ${activityBlock(p)}
      ${pageControls(p)}`;
  }
  let quizLevel = "beginner";
  const LEVELS = [["beginner", "Beginner", "Main points"], ["intermediate", "Intermediate", "Understanding"], ["advanced", "Advanced", "Scenarios"]];
  function renderQuiz(p) {
    return `
      <p class="step-label">${esc(W.quizLabel || "Quiz")}</p>
      <h2>Check Your Understanding</h2><div class="rule"></div>
      ${instruction("Answer the questions below. Tap a level to change it.")}
      <div class="levels" role="group" aria-label="Quiz level">${LEVELS.map(([k, n, d]) => `<button class="level-btn" data-level="${k}" aria-pressed="${quizLevel === k}">${n}<small>${d}${S.quiz[k] && S.quiz[k].done ? ` · Best ${S.quiz[k].best}/${W.quiz[k].length}` : ""}</small></button>`).join("")}</div>
      ${quizHasAudio() ? `<div class="qa-bar" id="qaBar"><button class="btn primary qa-main" data-act="qaAll">${I.play}<span>Listen to the Quiz</span></button><p class="why">Every question and every choice is read aloud. You then have 30 seconds to choose, and the correct answer is read out.</p></div>` : ""}
      <div id="quizBody">${quizLevel ? `<h3 class="quiz-level-head">${esc((LEVELS.find(l => l[0] === quizLevel) || [0, ""])[1])} Questions · ${W.quiz[quizLevel].length} questions</h3>` + quizHTML(quizLevel) : `<p>Beginner checks the main points. Intermediate checks understanding and application. Advanced uses real-life scenarios. You can retry any level.</p>`}</div>
      <p style="font-size:15px;color:var(--muted)">Only the quiz answers are scored. Your prayers and personal reflections are never scored.</p>
      ${pageControls(p)}`;
  }
  function quizHTML(level) {
    const qs = W.quiz[level], st = (S.quiz[level] = S.quiz[level] || { picks: {}, best: 0, done: false });
    const answered = Object.keys(st.picks).length;
    let h = qs.map((q, qi) => {
      const pick = st.picks[qi], done = pick !== undefined;
      return `<div class="card q" data-q="${qi}"><div class="q-num">Question ${qi + 1} of ${qs.length}${q.audioQ ? `<button class="q-listen" data-act="qaOne" data-q="${qi}" aria-label="Listen to question ${qi + 1}">${I.play}<span>Listen</span></button>` : ""}</div><p class="q-text">${ph(q.q)}</p>
        ${q.options.map((o, oi) => `<label class="choice ${done ? (oi === q.answer ? "correct" : oi === pick ? "wrong" : "") : ""}"><input type="radio" name="q${level}${qi}" value="${oi}" ${done ? "disabled" : ""} ${pick === oi ? "checked" : ""}><span class="opt-l" aria-hidden="true">${"ABCDE"[oi]}</span><span>${ph(o)}</span></label>`).join("")}
        ${done ? `<div class="feedback ${pick === q.answer ? "ok" : "no"}" role="status"><b>${pick === q.answer ? "Correct." : "Not quite. The correct answer is highlighted in green."}</b>${ph(q.explain)}</div>`
               : `<button class="btn small primary" data-act="check" data-level="${level}" data-q="${qi}">Check My Answer</button>`}</div>`;
    }).join("");
    if (answered === qs.length) {
      const score = qs.reduce((a, q, i) => a + (st.picks[i] === q.answer ? 1 : 0), 0);
      h += `<div class="score" role="status">You answered ${score} of ${qs.length} correctly.</div>`;
    }
    h += `<div class="control"><button class="btn" data-act="retry" data-level="${level}">Retry This Level</button><p class="why">Clears your answers for this level so you can try again.</p></div>`;
    return h;
  }
  function namesJoined() {
    const n = S.names.map(x => x.trim()).filter(Boolean);
    if (S.noNames || !n.length) return null;
    return n.length === 1 ? n[0] : n.slice(0, -1).join(", ") + " and " + n[n.length - 1];
  }
  function declText(d) {
    const j = namesJoined();
    const fill = j ? `<mark>${esc(j)}</mark>` : esc(d.blank || W.blankNamePhrase || "my loved ones");
    return ph(d.text).replace(/\{NAMES\}/g, fill);
  }
  function renderDeclarations(p) {
    return `
      <p class="step-label">Declarations</p>
      <h2>${esc(W.declarationsTitle || "Declarations for My Loved Ones")}</h2><div class="rule"></div>
      ${panelImg(W.declarationsImage, W.declarationsImageAlt)}
      ${instruction("Type a name and tap Add Name. Then read each declaration aloud.")}
      <section class="card">
        <span class="block-label" style="background:var(--primary-soft);color:var(--primary-ink)">My loved ones</span>
        <div class="add-row"><label class="sr-only" for="newName">Name of a loved one</label><input type="text" id="newName" placeholder="Type a name, e.g. my son David" autocomplete="off"><button class="btn small primary" data-act="addName">Add Name</button></div>
        <div class="names" id="nameList">${S.names.map((n, i) => `<div class="name-row"><label class="sr-only" for="nm${i}">Name ${i + 1}</label><input type="text" id="nm${i}" data-name="${i}" value="${esc(n)}"><button class="btn small danger" data-act="removeName" data-i="${i}">Remove</button></div>`).join("")}</div>
        <p style="font-size:15px;color:var(--muted);margin:6px 0 12px">To edit a name, tap it and change the text. Names stay private on this device.</p>
        <label class="toggle"><input type="checkbox" id="noNames" ${S.noNames ? "checked" : ""}> Pray without names (use “${esc(W.blankNamePhrase || "my loved ones")}”)</label>
      </section>
      <div id="declList">${W.declarations.map(d => `<div class="decl">${declText(d)}${d.ref ? `<span class="ref">${esc(d.ref)}</span>` : ""}</div>`).join("")}</div>
      <div class="controls">
        ${p.audio ? `<div class="control"><button class="btn accent" data-act="listenPage">${I.listen}Listen to Declarations</button><p class="why">The recording says “${esc(W.blankNamePhrase || "my loved ones")}”. Speak your names aloud with it.</p></div>` : `<div class="control"><button class="btn accent" disabled>${I.listen}Listen to Declarations</button><p class="why">The declarations recording has not been added yet.</p></div>`}
        <div class="control"><button class="btn primary" data-act="save">Save My Work</button><p class="why" data-saved>Names also save automatically.</p></div>
        <div class="control"><button class="btn danger" data-act="clearPage">Clear This Page</button><p class="why">Removes the names on this page only.</p></div>
        <div class="control"><button class="btn danger" data-act="startOver">Start Over</button><p class="why">Deletes all answers, names and progress. You will be asked first.</p></div>
      </div>`;
  }
  function renderMyWork(p) {
    const n = Object.values(S.answers).filter(v => (Array.isArray(v) ? v.length : String(v).trim())).length;
    return `
      <p class="step-label">Save and return</p>
      <h2>Save and Keep My Work</h2><div class="rule"></div>
      ${instruction("Tap Download My Work to keep a copy of everything you wrote.")}
      <section class="card">
        <h3>What is saved</h3>
        <p>Your written answers, your loved ones' names, your quiz results and the page you reached. Right now you have <b>${n}</b> written ${n === 1 ? "answer" : "answers"} and <b>${S.names.length}</b> ${S.names.length === 1 ? "name" : "names"}.</p>
        <h3>Where it is saved</h3>
        <p>${store.ok ? "On this phone or computer, inside this browser only. It saves automatically as you type." : "Your browser is not allowing saving right now, so your work is kept only while this page stays open. Please download a copy."} Nothing is sent to the ministry or anyone else.</p>
        <h3>How to come back</h3>
        <p>Open this same link in the same browser on the same device, then tap <b>Continue My Work</b>. Opening the link on a different phone does not bring your work across. To move it, download your work here and use Restore on the other device.</p>
        <p style="color:var(--muted);font-size:15.5px">Clearing your browser history or website data deletes saved work on this device.</p>
      </section>
      <div class="controls">
        <div class="control"><button class="btn primary" data-act="save">Save My Work</button><p class="why" data-saved></p></div>
        <div class="control"><button class="btn accent" data-act="downloadTxt">Download My Work</button><p class="why">A readable text file of your answers, names and declarations.</p></div>
        <div class="control"><button class="btn" data-act="downloadJson">Download Restore File</button><p class="why">A small file you can load on another device.</p></div>
        <div class="control"><label class="btn" for="restoreFile" style="cursor:pointer">Restore From File</label><input type="file" id="restoreFile" accept=".json,application/json" class="sr-only"><p class="why">Choose a Restore File you downloaded earlier.</p></div>
        <div class="control"><button class="btn danger" data-act="startOver">Start Over</button><p class="why">Deletes all answers, names and progress. You will be asked first.</p></div>
      </div>`;
  }
  function renderHelp(p) {
    const H = W.help || {};
    const topics = [
      ["How do I begin?", `<p>On the first page, tap <b>Start Workbook</b> to read and complete the activities. ${W.partBanner && W.partBanner.service != null ? `Tap <b>Listen to All of ${esc(W.partBanner.label)}</b> to hear it from its first section to its last. Or tap` : "Or tap"} <b>Listen from Beginning</b> to hear the whole workbook read aloud, one section after another, without pressing Next.</p>`],
      ["How do I listen without reading?", `<ul>
        <li>Open the <b>Home ▾</b> menu and tap <b>Play from here</b> beside any section. Whatever was playing stops, and that section starts from its beginning.</li>
        <li>Leave <b>Continue automatically</b> on and the next section plays by itself, all the way to the end. The page on screen always follows the voice.</li>
        <li><b>Previous Section</b> and <b>Next Section</b> jump to the start of the section before or after. On many phones, the previous and next buttons on the lock screen or on your headphones do the same.</li>
        <li>If you move to another page by hand while the voice is playing, the voice moves with you.</li>
      </ul>`],
      ["How do I pause or start again?", `<ul>
        <li>The big middle button is <b>Play</b>, then <b>Pause</b> while the voice is speaking, then <b>Resume</b> to carry on from the same sentence.</li>
        <li><b>Speed</b> changes the reading speed: 1×, 1.15×, 1.3×, then 0.85×. Your choice is remembered on this device.</li>
        <li><b>Pause &amp; Reflect</b> pauses the voice and shows the reflection question for this page. It appears only when you tap it, so listening straight through is never interrupted.</li>
        ${pages.some(x => x.sync) ? `<li>The sentence being read is highlighted and the page scrolls gently to keep it in view. One voice reads the teaching; a different voice reads every Scripture passage.</li>` : ""}
        <li><b>Stop</b> ends the recording and goes back to the start of that recording.</li>
        <li><b>Back 10s</b> and <b>Fwd 10s</b> move 10 seconds back or forward.</li>
        <li><b>Repeat Section</b> starts the current section again from its beginning. Your writing is not deleted.</li>
        <li><b>Clear This Page</b> erases only what you typed on the page you are on.</li>
        <li><b>Start Over</b> erases everything in the workbook. It asks you first.</li></ul>`],
      ["How do I choose a quiz level?", `<p>Go to the <b>Check Your Understanding</b> page. At the top are three buttons: <b>Beginner</b>, <b>Intermediate</b> and <b>Advanced</b>. Tap one. Choose an answer and tap <b>Check My Answer</b>. To try again, tap <b>Retry This Level</b> at the bottom.</p>`],
      ...(HASDECL ? [["How do I add loved ones?", `<p>Go to the <b>${esc(W.declarationsTitle || "Declarations for My Loved Ones")}</b> page. Type a name in the box and tap <b>Add Name</b>. The names appear inside the declarations that mention loved ones. To edit a name, tap it and change the text. To remove a name, tap <b>Remove</b> beside it. If you prefer not to use names, tick <b>Pray without names</b>.</p>`]] : []),
      ["If sound will not play", `<ol>
        <li>Tap <b>Play</b> once and wait a few seconds. “Loading…” means the recording is downloading.</li>
        <li>Turn up the <b>media volume</b> with the volume buttons while the recording is playing.</li>
        <li>Check that sound is not going to Bluetooth headphones, a car or another speaker.</li>
        <li>Check your internet connection. The recordings stream from the internet.</li>
        <li>If you see “Audio could not load”, tap <b>Play</b> again to retry.</li>
        <li>On iPhone, if there is no sound, check the silent switch or Action button on the side of the phone.</li></ol>`],
      ["I opened the link inside WhatsApp", `<p>WhatsApp opens links in its own small browser, which may not keep your saved work. Open the link in your phone's browser instead:</p>
        <ul><li><b>iPhone:</b> tap the share or compass icon at the bottom or top of the page, then choose <b>Open in Safari</b>.</li>
        <li><b>Android:</b> tap the three dots <b>⋮</b> at the top right, then choose <b>Open in Chrome</b> (or Open in browser).</li></ul>`],
      ["Saving on iPhone", `<ul>
        <li>Use <b>Safari</b>. Your work saves automatically on this iPhone while you type. You can also tap <b>Save My Work</b>.</li>
        <li><b>Download My Work</b>: Safari asks to download the file. Find it later in the <b>Files</b> app → <b>Downloads</b>.</li>
        <li><b>Add to Home Screen</b>: tap the <b>Share</b> button (square with an arrow), then <b>Add to Home Screen</b>.</li>
        <li>If Safari's Private Browsing is on, work is not kept after you close the tab. Download a copy.</li></ul>`],
      ["Saving on Android", `<ul>
        <li>Use <b>Chrome</b>. Your work saves automatically on this phone while you type. You can also tap <b>Save My Work</b>.</li>
        <li><b>Download My Work</b>: the file goes to your <b>Downloads</b> folder. Open the <b>Files</b> app (or Chrome's ⋮ menu → <b>Downloads</b>) to find it.</li>
        <li><b>Add to Home screen</b>: tap the three dots <b>⋮</b> at the top right, then <b>Add to Home screen</b>.</li>
        <li>If you use an Incognito tab, work is not kept after you close it. Download a copy.</li></ul>`],
      ...(W.printable ? [["Where is the printable version?", `<p>The printable companion has the same sections, Scriptures, activities, quiz and declarations on paper. <a href="${esc(W.printable)}" target="_blank" rel="noopener"><b>Open the Printable Companion (PDF)</b></a>. Audio and saving work only in this interactive version.</p>`]] : []),
      ["What if a download fails?", `<p>Check that your phone has storage space and try again. If it still fails, open the link in Safari (iPhone) or Chrome (Android), not inside WhatsApp, and tap <b>Download My Work</b> again.</p>${H.contact ? `<p>For help, contact: <b>${esc(H.contact)}</b></p>` : ""}`]
    ];
    return `
      <p class="brand-line">${esc(M.brand)}</p>
      <h2>Help and How to Use This Workbook</h2><div class="rule"></div>
      ${instruction("Tap a question to open the answer.")}
      ${topics.map(([q, a], i) => `<details class="help" ${i === 0 ? "open" : ""}><summary>${q}</summary><div class="body">${a}</div></details>`).join("")}
      <p style="margin-top:22px;font-size:15.5px;color:var(--ink-2)">This workbook was prepared from the teaching of <b>${esc(M.speaker)}</b>. ${esc(M.brand)}.</p>
      ${pageControls(p).replace(/<div class="control"><button class="btn danger" data-act="clearPage">[\s\S]*?<\/div>/, "")}`;
  }

  /* ---------------- Step menu ---------------- */
  const menuLabel = p => p.kind === "opening" ? "Home · Welcome" : p.kind === "lesson" ? (p.sv ? `${p.n}. ${p.title}` : `Section ${p.n}: ${p.title}`) : p.kind === "quiz" ? `Quiz: ${p.title}` : p.title;
  const groupHead = { direction: "Prophetic Direction · Pastor Kiky Ocansey" };
  SVS.forEach((sv, k) => { groupHead["service" + k] = sv.short || "The Service"; });
  function buildMenu() {
    const m = document.getElementById("stepMenu");
    m.innerHTML = `<p class="menu-head">Every step in this workbook</p><ol>${pages.map((p, i) => `${p.group && (!pages[i - 1] || pages[i - 1].group !== p.group) ? `<li class="menu-group" aria-hidden="true">${esc(groupHead[p.group] || "")}</li>` : ""}<li><button class="menu-item${i === cur ? " is-current" : ""}" data-go="${p.id}"${i === cur ? ' aria-current="page"' : ""}><span class="menu-n">${i + 1}</span><span>${esc(menuLabel(p))}</span>${S.visited.includes(p.id) && i !== cur ? '<span class="menu-done" aria-label="visited">✓</span>' : ""}</button>${p.audio ? (playingPage() === i ? `<button class="menu-play is-playing" data-playfrom="${i}" aria-label="Now playing: ${esc(menuLabel(p))}. Tap to start it again.">${I.listen}<span>Now playing</span></button>` : `<button class="menu-play" data-playfrom="${i}" aria-label="Play from here: ${esc(menuLabel(p))}">${I.play}<span>Play from here</span></button>`) : ""}</li>`).join("")}</ol>`;
  }
  function toggleMenu(open) {
    const m = document.getElementById("stepMenu"), b = document.getElementById("menuBtn");
    open = open === undefined ? m.hidden : open;
    if (open) buildMenu();
    m.hidden = !open; b.setAttribute("aria-expanded", String(open));
  }
  document.addEventListener("click", e => {
    if (e.target.closest("#menuBtn")) { toggleMenu(); return; }
    if (!e.target.closest("#stepMenu")) toggleMenu(false);
  }, true);
  document.addEventListener("keydown", e => { if (e.key === "Escape") toggleMenu(false); });

  /* ---------------- Navigation ---------------- */
  let cur = 0;
  function render() {
    const p = pages[cur];
    const fn = { opening: renderOpening, lesson: renderLesson, quiz: renderQuiz, declarations: renderDeclarations, mywork: renderMyWork, help: renderHelp }[p.kind];
    main.innerHTML = `<article class="page enter" data-page="${p.id}">${fn(p)}${pager(cur)}</article>`;
    if (typeof collectSync === "function") collectSync();
    if (typeof qaAfterRender === "function") qaAfterRender();
    $("#tbStep").textContent = cur === 0 ? M.speaker : p.title;
    if (!S.visited.includes(p.id)) S.visited.push(p.id);
    const pct = Math.round(100 * S.visited.filter(id => id !== "opening" && id !== "help").length / (pages.length - 2));
    $("#progFill").style.width = Math.min(100, pct) + "%";
    renderSavedStatus();
  }
  function go(id, opts = {}) {
    const i = typeof id === "number" ? id : idx(id);
    if (i < 0) return;
    cur = i; if (pages[i].kind !== "opening" && pages[i].kind !== "help") S.lastPage = i;
    if (pages[i].kind === "quiz" && !opts.keepLevel) quizLevel = quizLevel || "beginner";
    toggleMenu(false); render(); autosave();
    if (!opts.fromAudio) syncAudioTo(i);
    if (!opts.noScroll) { window.scrollTo({ top: 0, behavior: "instant" }); main.focus({ preventScroll: true }); }
  }
  function renderSavedStatus() {
    document.querySelectorAll("[data-saved]").forEach(n => {
      if (S.savedAt) n.textContent = (store.ok ? "Last saved on this device at " : "Kept for this visit at ") + new Date(S.savedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) + ".";
    });
  }

  /* ---------------- Events ---------------- */
  document.addEventListener("click", e => {
    const pf = e.target.closest("[data-playfrom]"); if (pf) { toggleMenu(false); partMode = ""; startAt(+pf.dataset.playfrom); return; }
    const g = e.target.closest("[data-go]"); if (g) { go(g.dataset.go); return; }
    const lv = e.target.closest("[data-level]:not([data-act])"); if (lv) { quizLevel = lv.dataset.level; render(); setTimeout(() => { const qb = document.getElementById("quizBody"); if (qb) qb.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60); return; }
    const a = e.target.closest("[data-act]"); if (!a) return;
    const act = a.dataset.act, p = pages[cur];
    if (act === "save") save(true);
    else if (act === "continue") go(S.lastPage || 1);
    else if (act === "listenAll") { partMode = ""; setAuto(true); startAt(trackList()[0] ? trackList()[0].i : 0); }
    else if (act === "listenPage") startAt(cur);
    else if (act === "listenPart") { const k = +a.dataset.part; setAuto(true); const first = pages.findIndex(x => x.group === "service" + k); if (first >= 0) { startAt(first); partMode = "service" + k; } }
    else if (act === "startOver") confirmStartOver();
    else if (act === "clearPage") clearPage(p);
    else if (act === "check") {
      const lvl = a.dataset.level, qi = +a.dataset.q, card = a.closest(".q"), r = card.querySelector("input:checked");
      if (!r) { toast("Choose an answer first."); return; }
      S.quiz[lvl].picks[qi] = +r.value;
      const qs = W.quiz[lvl];
      if (Object.keys(S.quiz[lvl].picks).length === qs.length) {
        const sc = qs.reduce((t, q, i) => t + (S.quiz[lvl].picks[i] === q.answer ? 1 : 0), 0);
        S.quiz[lvl].done = true; S.quiz[lvl].best = Math.max(S.quiz[lvl].best || 0, sc);
      }
      const y = window.scrollY; render(); window.scrollTo(0, y); autosave();
    } else if (act === "retry") { const l = a.dataset.level; S.quiz[l].picks = {}; render(); autosave(); toast("Answers cleared for this level. Try again."); }
    else if (act === "qaAll") qaStart(quizLevel || "beginner", 0, false);
    else if (act === "qaOne") qaStart(quizLevel || "beginner", +a.dataset.q, true);
    else if (act === "qaPause") qaTogglePause();
    else if (act === "qaSkip") qaSkip();
    else if (act === "qaStop") qaStop("Quiz listening stopped.");
    else if (act === "addName") addName();
    else if (act === "removeName") { S.names.splice(+a.dataset.i, 1); render(); autosave(); }
    else if (act === "downloadTxt") download(W.id + "-my-work.txt", buildText(), "text/plain");
    else if (act === "downloadJson") download(W.id + "-restore.json", JSON.stringify({ workbook: W.id, data: S }, null, 2), "application/json");
  });
  document.addEventListener("input", e => {
    const t = e.target;
    if (t.matches("textarea[data-k]")) { S.answers[t.dataset.k] = t.value; autosave(); }
    else if (t.matches("input[type=checkbox][data-k]")) {
      const k = t.dataset.k, arr = new Set(S.answers[k] || []); t.checked ? arr.add(+t.dataset.i) : arr.delete(+t.dataset.i); S.answers[k] = [...arr]; autosave();
    } else if (t.matches("input[data-name]")) { S.names[+t.dataset.name] = t.value; refreshDecl(); autosave(); }
    else if (t.id === "noNames") { S.noNames = t.checked; refreshDecl(); autosave(); }
  });
  document.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.id === "newName") { e.preventDefault(); addName(); } });
  document.addEventListener("change", e => {
    if (e.target.id !== "restoreFile" || !e.target.files[0]) return;
    const r = new FileReader();
    r.onload = () => { try { const o = JSON.parse(r.result); if (o.workbook !== W.id) throw new Error("other"); S = Object.assign(blank(), o.data); save(false); render(); toast("Your work was restored."); } catch (err) { toast("That file is not a Restore File for this workbook."); } };
    r.readAsText(e.target.files[0]);
  });
  function addName() {
    const inp = $("#newName"); const v = (inp.value || "").trim();
    if (!v) { toast("Type a name first."); inp.focus(); return; }
    S.names.push(v); S.noNames = false; render(); autosave(); $("#newName").focus(); toast("Name added to the declarations.");
  }
  function refreshDecl() { const d = $("#declList"); if (d) d.innerHTML = W.declarations.map(x => `<div class="decl">${declText(x)}${x.ref ? `<span class="ref">${esc(x.ref)}</span>` : ""}</div>`).join(""); }
  function clearPage(p) {
    if (p.kind === "declarations") { S.names = []; S.noNames = false; }
    else if (p.kind === "quiz") { if (quizLevel && S.quiz[quizLevel]) S.quiz[quizLevel].picks = {}; }
    else Object.keys(S.answers).forEach(k => { if (k.startsWith(p.id + "::")) delete S.answers[k]; });
    render(); save(false); toast("This page was cleared. Other pages were not changed.");
  }
  function download(name, content, type) {
    try {
      const b = new Blob([content], { type: type + ";charset=utf-8" }), u = URL.createObjectURL(b), a = el("a", { href: u, download: name });
      document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(u); a.remove(); }, 1500);
      toast("Download started. Look in your Downloads or Files app.");
    } catch (e) { toast("Download failed. Open the link in Safari or Chrome and try again."); }
  }
  function buildText() {
    const L = [];
    L.push(M.brand, W.title, "Speaker: " + M.speaker, "Service: " + W.serviceDate, "Downloaded: " + new Date().toLocaleString(), "");
    W.sections.concat(...SVS.map(x => x.sections)).forEach(s => {
      L.push("== " + s.title + " ==");
      const a = s.activity || {};
      if (a.type === "select") { const ch = S.answers[s.id + "::" + (a.id || "select")] || []; if (ch.length) { L.push(a.prompt); ch.forEach(i => L.push("  [x] " + a.options[i])); } }
      (a.fields || []).forEach(f => { const v = S.answers[s.id + "::" + f.id]; L.push(f.label, "  " + (v && v.trim() ? v.trim() : "(blank)")); });
      L.push("");
    });
    L.push("== Quiz results ==");
    LEVELS.forEach(([k, n]) => { const q = S.quiz[k]; L.push(n + ": " + (q && q.done ? "best " + q.best + " of " + W.quiz[k].length : "not finished")); });
    L.push("", "== My declarations ==");
    const j = namesJoined();
    W.declarations.forEach(d => L.push("- " + d.text.replace(/\{NAMES\}/g, j || W.blankNamePhrase || "my loved ones") + (d.ref ? " (" + d.ref + ")" : "")));
    L.push("", M.brand + " · " + M.speaker);
    return L.join("\n");
  }

  /* ---------------- Audio player ---------------- */
  const audio = new Audio(); audio.preload = "none"; window.__wbAudio = audio;
  const player = el("section", { class: "player", "aria-label": "Audio player" });
  const C = 2 * Math.PI * 32;
  player.innerHTML = `<div class="player-in">
    <div class="ring-wrap" aria-hidden="true"><svg viewBox="0 0 76 76"><circle class="ring-bg" cx="38" cy="38" r="32"/><circle class="ring-fg" id="ring" cx="38" cy="38" r="32" stroke-dasharray="${C}" stroke-dashoffset="${C}"/></svg><div class="ring-pct" id="ringPct">0%</div></div>
    <div class="now"><div class="what" id="nowWhat">Nothing playing</div><div class="time" id="nowTime" aria-live="off">0:00 / 0:00</div><div class="status" id="nowStatus" role="status" aria-live="polite">Tap Play to listen to this page.</div></div>
    <div class="chap" id="chapRow" hidden><div class="chap-text"><span id="chapWhat"></span><span class="chap-voice" id="chapVoice"></span></div><div class="chap-bar" id="chapBar" aria-hidden="true"></div></div>
    <div class="pnav">
      <button class="pbtn" id="pPrev" aria-label="Previous section">${I.prev}<span>Previous Section</span></button>
      <button class="pbtn main" id="pPlay" aria-label="Play">${I.play}<span id="pPlayL">Play</span></button>
      <button class="pbtn" id="pNext" aria-label="Next section">${I.next}<span>Next Section</span></button>
      <button class="pbtn auto" id="pAuto" role="switch" aria-checked="true"><span class="auto-l">Continue automatically</span><span class="auto-v" id="pAutoV">On</span></button>
    </div>
    <div class="pbtns">
      <button class="pbtn" id="pRew" aria-label="Rewind 10 seconds">${I.rew}<span>Back 10s</span></button>
      <button class="pbtn" id="pStop" aria-label="Stop">${I.stop}<span>Stop</span></button>
      <button class="pbtn" id="pRestart" aria-label="Repeat this section from the beginning">${I.restart}<span>Repeat Section</span></button>
      <button class="pbtn" id="pSpeed" aria-label="Playback speed">${I.speed}<span id="pSpeedL">Speed 1×</span></button>
      <button class="pbtn" id="pReflect" aria-label="Pause and reflect">${I.reflect}<span>Pause &amp; Reflect</span></button>
      <button class="pbtn" id="pFwd" aria-label="Forward 10 seconds">${I.fwd}<span>Fwd 10s</span></button>
    </div>
    <div class="reflect" id="reflectBox" hidden role="dialog" aria-label="Pause and reflect"><p class="reflect-h">Paused to reflect</p><p id="reflectText"></p><div class="reflect-btns"><button class="btn small primary" id="reflectResume">Resume Listening</button><button class="btn small" id="reflectGo">Go to the Activity</button></div></div>
    ${W.voice && W.voice.note ? `<p class="voice-note">${esc(W.voice.note)}</p>` : ""}
  </div>`;
  document.body.appendChild(player);
  const setPH = () => document.body.style.setProperty("--player-h", (player.offsetHeight + 24) + "px");
  window.addEventListener("resize", setPH); setTimeout(setPH, 50);

  let seq = [], seqPos = -1;
  const autoOn = () => S.autoContinue !== false;
  const status = (m, err) => { const s = $("#nowStatus"); s.textContent = m; s.classList.toggle("err", !!err); };
  function playingPage() { return seqPos >= 0 && seq[seqPos] && audio.getAttribute("src") ? seq[seqPos].i : -1; }
  function trackList() { return pages.map((p, i) => ({ i, src: p.audio, title: p.title })).filter(t => t.src); }
  function setAuto(v) {
    S.autoContinue = !!v; autosave();
    const b = $("#pAuto"); b.setAttribute("aria-checked", String(autoOn())); b.classList.toggle("on", autoOn());
    $("#pAutoV").textContent = autoOn() ? "On" : "Off";
  }
  function trackLabel() {
    if (seqPos < 0) return "Nothing playing";
    const pg = pages[seq[seqPos].i];
    if (pg && pg.sync && W.partBanner) return `${W.partBanner.label} · ${seq[seqPos].title}`;
    return `Section ${seqPos + 1} of ${seq.length} · ${seq[seqPos].title}`;
  }
  function load(t, autoplay) {
    $("#nowWhat").textContent = trackLabel();
    if (audio.dataset.src !== t.src) { audio.src = t.src; audio.dataset.src = t.src; }
    if ("mediaSession" in navigator) { try { navigator.mediaSession.metadata = new MediaMetadata({ title: t.title, artist: M.speaker, album: M.brand + " · " + W.title }); } catch (e) {} }
    if (autoplay) playNow();
  }
  function playNow() {
    status("Loading…");
    const pr = audio.play();
    if (pr && pr.catch) pr.catch(() => status("Tap Play to start the sound.", true));
  }
  // Start the recording for page i from its beginning. Stops anything already playing and shows that page.
  function startAt(i) {
    seq = trackList(); if (!seq.length) { status("No recordings have been added to this workbook yet.", true); return; }
    let k = seq.findIndex(t => t.i === i);
    if (k < 0) k = seq.findIndex(t => t.i > i);
    if (k < 0) { status("There are no more recordings after this page.", true); return; }
    audio.pause(); clearTimeout(nextTimer); lastSpan = null;
    seqPos = k;
    if (cur !== seq[k].i) go(seq[k].i, { fromAudio: true });
    const same = audio.dataset.src === seq[k].src;
    load(seq[k], false);
    if (same) { try { audio.currentTime = 0; } catch (e) {} }
    playNow();
  }
  function step(d) {
    seq = seq.length ? seq : trackList();
    let k;
    const here = seq.findIndex(t => t.i === cur);
    if (here >= 0) k = here + d;
    else { const after = seq.findIndex(t => t.i > cur); k = d > 0 ? (after < 0 ? seq.length : after) : (after < 0 ? seq.length : after) - 1; }
    if (k < 0) { startAt(seq[0].i); return; }
    if (k >= seq.length) { status("This is the last section.", true); return; }
    startAt(seq[k].i);
  }
  // When the reader moves to another page by hand, keep the player on that page.
  function syncAudioTo(i) {
    if (seqPos >= 0 && seq[seqPos] && seq[seqPos].i === i) return;
    const wasPlaying = !audio.paused && !audio.ended;
    if (wasPlaying && pages[i].audio) { startAt(i); return; }
    audio.pause();
    if (audio.getAttribute("src")) { audio.removeAttribute("src"); audio.dataset.src = ""; audio.load(); }
    seqPos = -1; $("#nowWhat").textContent = pages[i].audio ? "Ready · " + pages[i].title : "Nothing playing";
    status(pages[i].audio ? "Tap Play to listen to this section." : "This page has no recording. Use Next Section to keep listening.");
    paint();
  }
  function stopAudio() { clearTimeout(nextTimer); audio.pause(); try { audio.currentTime = 0; } catch (e) {} if (lastSpan) { lastSpan.n.classList.remove("speaking"); lastSpan = null; } status("Stopped. Tap Play to start this section again."); paint(); }
  $("#pPlay").onclick = () => {
    clearTimeout(nextTimer);
    if (audio.getAttribute("src") && !audio.paused && !audio.ended) { pauseNow(); return; }
    $("#reflectBox").hidden = true;
    if (!audio.getAttribute("src")) { startAt(cur); return; }
    if (audio.error) { const k = seqPos; audio.removeAttribute("src"); audio.dataset.src = ""; audio.load(); if (k >= 0) load(seq[k], true); return; }
    playNow();
  };
  const pauseNow = () => { audio.pause(); if (audio.getAttribute("src")) status("Paused. Tap Resume to continue from here."); };
  $("#pStop").onclick = () => { if (audio.getAttribute("src")) stopAudio(); };
  $("#pRew").onclick = () => { if (audio.getAttribute("src")) audio.currentTime = Math.max(0, audio.currentTime - 10); };
  $("#pFwd").onclick = () => { if (audio.getAttribute("src") && isFinite(audio.duration)) audio.currentTime = Math.min(audio.duration - 0.2, audio.currentTime + 10); };
  $("#pRestart").onclick = () => { clearTimeout(nextTimer); $("#reflectBox").hidden = true; if (!audio.getAttribute("src")) { startAt(cur); return; } audio.currentTime = 0; lastSpan = null; playNow(); };
  const SPEEDS = [1, 1.15, 1.3, 0.85];
  function applySpeed() { const r = S.speed || 1; audio.defaultPlaybackRate = r; audio.playbackRate = r; $("#pSpeedL").textContent = "Speed " + String(r).replace(/^0/, "") + "×"; }
  $("#pSpeed").onclick = () => { const i = SPEEDS.indexOf(S.speed || 1); S.speed = SPEEDS[(i + 1) % SPEEDS.length]; autosave(); applySpeed(); status("Playback speed " + S.speed + "×."); };
  ["loadedmetadata", "play"].forEach(ev => audio.addEventListener(ev, applySpeed));
  applySpeed();
  $("#pReflect").onclick = () => {
    clearTimeout(nextTimer);
    if (audio.getAttribute("src") && !audio.paused) audio.pause();
    const pg = pages[cur], a = pg.activity;
    $("#reflectText").textContent = a && a.prompt ? a.prompt : "Take a moment before you continue.";
    $("#reflectGo").hidden = !(a && a.prompt);
    $("#reflectBox").hidden = false; status("Paused to reflect. Tap Resume Listening when you are ready.");
    setPH();
  };
  $("#reflectResume").onclick = () => { $("#reflectBox").hidden = true; setPH(); if (audio.getAttribute("src")) playNow(); else startAt(cur); };
  $("#reflectGo").onclick = () => { $("#reflectBox").hidden = true; setPH(); const n = document.querySelector(".activity"); if (n) n.scrollIntoView({ behavior: "smooth", block: "start" }); };
  $("#pPrev").onclick = () => step(-1);
  $("#pNext").onclick = () => step(1);
  $("#pAuto").onclick = () => { setAuto(!autoOn()); status(autoOn() ? "Continue automatically is on. The next section will play by itself." : "Continue automatically is off. Playback stops at the end of each section."); };
  setAuto(autoOn());
  let partMode = "", nextTimer = 0, spans = [], lastSpan = null, userScrollAt = 0, raf = 0;
  ["wheel", "touchmove"].forEach(ev => window.addEventListener(ev, () => { userScrollAt = Date.now(); }, { passive: true }));
  function collectSync() {
    spans = Array.from(document.querySelectorAll(".page .sn")).map(n => ({ n, s: +n.dataset.s, e: +n.dataset.e })).sort((a, b) => a.s - b.s);
    lastSpan = null; buildChapBar(); tick(true);
  }
  function syncActive() { const pg = pages[cur]; return pg && pg.sync && seqPos >= 0 && seq[seqPos] && seq[seqPos].i === cur && audio.dataset.src === pg.audio; }
  function buildChapBar() {
    const pg = pages[cur], row = $("#chapRow");
    player.classList.toggle("syncmode", !!(pg && pg.sync));
    if (!pg || !pg.sync) { row.hidden = true; setPH(); return; }
    const d = pg.sync.dur, segs = pg.sync.segs;
    $("#chapBar").innerHTML = segs.map((g, k) => { const st = g.lines[0].s, en = (segs[k + 1] ? segs[k + 1].lines[0].s : d); return `<i data-k="${k}" class="${g.voice === "iapetus" ? "scr" : ""}" style="flex:${Math.max(0.5, en - st).toFixed(2)}"></i>`; }).join("");
    row.hidden = false; setChap(0, false); setPH();
  }
  function setChap(k, live) {
    const pg = pages[cur]; if (!pg || !pg.sync) return;
    const g = pg.sync.segs[k]; if (!g) return;
    $("#chapWhat").textContent = `Section ${pg.n} of ${pg.sv.sections.length} · Passage ${k + 1} of ${pg.sync.segs.length} · ${g.chap}`;
    $("#chapVoice").textContent = g.voice === "iapetus" ? "Scripture reader" : "Teaching voice";
    $("#chapVoice").className = "chap-voice" + (g.voice === "iapetus" ? " scr" : "");
    document.querySelectorAll("#chapBar i").forEach((n, j) => { n.classList.toggle("done", live && j < k); n.classList.toggle("now", j === k); });
  }
  function tick(force) {
    if (!spans.length || !syncActive()) { if (lastSpan) { lastSpan.n.classList.remove("speaking"); lastSpan = null; } return; }
    const t = audio.currentTime;
    let a = null;
    for (let k = 0; k < spans.length; k++) { if (spans[k].s <= t + 0.04) a = spans[k]; else break; }
    if (a !== lastSpan || force) {
      if (lastSpan) lastSpan.n.classList.remove("speaking");
      lastSpan = a;
      if (a) {
        a.n.classList.add("speaking");
        const det = a.n.closest("details"); if (det && !det.open) det.open = true;
        if (Date.now() - userScrollAt > 4000) {
          const r = a.n.getBoundingClientRect(), ph = player.offsetHeight, top = 90, bot = innerHeight - ph - 30;
          if (r.top < top || r.bottom > bot) {
            const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
            window.scrollTo({ top: Math.max(0, scrollY + r.top - (top + (bot - top) * 0.3)), behavior: reduce ? "auto" : "smooth" });
          }
        }
        const segs = pages[cur].sync.segs; let k = 0;
        for (let j = 0; j < segs.length; j++) if (segs[j].lines[0].s <= t + 0.04) k = j;
        setChap(k, true);
      }
    }
  }
  function loop() { tick(false); if (!audio.paused && !audio.ended) raf = requestAnimationFrame(loop); }
  audio.addEventListener("play", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); });
  ["seeked", "timeupdate"].forEach(ev => audio.addEventListener(ev, () => tick(false)));
  ["play", "playing", "pause", "ended", "emptied"].forEach(ev => audio.addEventListener(ev, () => {
    const on = !audio.paused && !audio.ended;
    $("#pPlayL").textContent = on ? "Pause" : (audio.getAttribute("src") && audio.currentTime > 0.3 && !audio.ended ? "Resume" : "Play");
    $("#pPlay").setAttribute("aria-label", $("#pPlayL").textContent);
    $("#pPlay").innerHTML = (on ? I.pause : I.play) + `<span id="pPlayL">${$("#pPlayL").textContent}</span>`;
  }));
  function paint() {
    const d = audio.duration, t = audio.currentTime, f = isFinite(d) && d > 0 ? t / d : 0;
    $("#ring").setAttribute("stroke-dashoffset", String(C * (1 - f)));
    $("#ringPct").textContent = Math.round(f * 100) + "%";
    $("#nowTime").textContent = fmt(t) + " / " + (isFinite(d) ? fmt(d) : "0:00");
  }
  ["timeupdate", "loadedmetadata", "durationchange", "seeked"].forEach(ev => audio.addEventListener(ev, paint));
  audio.addEventListener("playing", () => status(autoOn() ? "Playing. The next section will follow automatically." : "Playing. Playback will stop at the end of this section."));
  audio.addEventListener("waiting", () => status("Loading…"));
  audio.addEventListener("error", () => { if (audio.getAttribute("src")) status("Audio could not load. Check your internet, then tap Play to try again.", true); });
  audio.addEventListener("ended", () => {
    if (autoOn() && seqPos >= 0 && seqPos < seq.length - 1) { const nx = seq[seqPos + 1].i; if (partMode && pages[nx].group !== partMode) { partMode = ""; status("End of " + ((W.partBanner && W.partBanner.label) || "this part") + ". Tap Next Section to carry on to the quiz."); paint(); return; } status("Next section in a moment…"); nextTimer = setTimeout(() => startAt(nx), 1400); }
    else { status(seqPos >= seq.length - 1 ? "Finished. You have listened to the end of the workbook." : "Finished this section. Tap Next Section to keep going."); paint(); }
  });
  if ("mediaSession" in navigator) {
    try {
      navigator.mediaSession.metadata = new MediaMetadata({ title: W.title, artist: M.speaker, album: M.brand });
      navigator.mediaSession.setActionHandler("play", () => $("#pPlay").click());
      navigator.mediaSession.setActionHandler("pause", () => pauseNow());
      navigator.mediaSession.setActionHandler("seekbackward", () => $("#pRew").click());
      navigator.mediaSession.setActionHandler("seekforward", () => $("#pFwd").click());
      navigator.mediaSession.setActionHandler("previoustrack", () => step(-1));
      navigator.mediaSession.setActionHandler("nexttrack", () => step(1));
    } catch (e) {}
  }


  /* ---------------- Spoken quiz ---------------- */
  // Reads each question and its choices, waits 30 seconds for an answer, then reads the correct answer.
  const qa = new Audio(); qa.preload = "auto"; window.__wbQuizAudio = qa;
  const QA_WAIT = 30;
  const qaBox = el("div", { class: "qa-now", id: "qaNow", "aria-live": "polite" });
  qaBox.hidden = true;
  qaBox.innerHTML = '<div class="qa-now-t" id="qaNowT"></div><div class="qa-now-c" id="qaNowC"></div><div class="qa-btns"><button class="btn small" data-act="qaPause" id="qaPauseB">Pause</button><button class="btn small" data-act="qaSkip" id="qaSkipB">Skip the Wait</button><button class="btn small" data-act="qaStop">Stop</button></div>';
  document.body.appendChild(qaBox);
  let QS = null; // {level, i, phase: "q"|"wait"|"a"|"gap", single, left, paused, timer}
  function quizHasAudio() { return ["beginner", "intermediate", "advanced"].some(k => (W.quiz[k] || []).some(q => q.audioQ)); }
  const LVN = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };
  function qaClear() { if (QS && QS.timer) { clearInterval(QS.timer); clearTimeout(QS.timer); QS.timer = 0; } }
  function qaStart(level, i, single) {
    qaClear(); audio.pause(); clearTimeout(nextTimer);
    const q = (W.quiz[level] || [])[i]; if (!q || !q.audioQ) return;
    if (quizLevel !== level) { quizLevel = level; render(); }
    QS = { level, i, single, phase: "q", left: QA_WAIT, paused: false, timer: 0 };
    qaPlay(q.audioQ);
  }
  function qaPlay(src) {
    qa.src = src; const r = S.speed || 1; qa.defaultPlaybackRate = r; qa.playbackRate = r;
    const pr = qa.play(); if (pr && pr.catch) pr.catch(() => { if (QS) { QS.paused = true; qaPaint("Tap Resume to start the sound."); } });
    qaPaint();
  }
  function qaCountdown() {
    QS.phase = "wait"; QS.left = QA_WAIT; qaPaint();
    QS.timer = setInterval(() => { if (!QS || QS.paused) return; QS.left--; if (QS.left <= 0) { qaAnswer(); } else qaPaint(); }, 1000);
  }
  function qaAnswer() {
    qaClear(); if (!QS) return;
    const q = W.quiz[QS.level][QS.i]; QS.phase = "a"; qaPlay(q.audioA);
  }
  function qaSkip() { if (QS && QS.phase === "wait") qaAnswer(); else if (QS && QS.phase === "q") { qa.pause(); qaClear(); qaCountdown(); } }
  function qaNext() {
    const lv = QS.level, qs = W.quiz[lv];
    if (QS.single) { qaStop("Finished this question."); return; }
    if (QS.i < qs.length - 1) { QS.phase = "gap"; qaPaint(); QS.timer = setTimeout(() => { if (QS) { QS.timer = 0; QS.i++; QS.phase = "q"; qaPlay(qs[QS.i].audioQ); } }, 1400); return; }
    const order = ["beginner", "intermediate", "advanced"], nx = order[order.indexOf(lv) + 1];
    if (nx && autoOn() && (W.quiz[nx] || []).length && W.quiz[nx][0].audioQ) {
      QS.phase = "gap"; qaPaint("End of the " + LVN[lv] + " level. The " + LVN[nx] + " level begins in a moment.");
      QS.timer = setTimeout(() => { if (QS) qaStart(nx, 0, false); }, 2500); return;
    }
    qaStop(nx ? "End of the " + LVN[lv] + " level. Tap " + LVN[nx] + ", then Listen to the Quiz, to go on." : "End of the quiz. Well done for listening to every question.");
  }
  function qaTogglePause() {
    if (!QS) return;
    QS.paused = !QS.paused;
    if (QS.phase === "q" || QS.phase === "a") { if (QS.paused) qa.pause(); else { const pr = qa.play(); if (pr && pr.catch) pr.catch(() => {}); } }
    qaPaint();
  }
  function qaStop(msg) {
    qaClear(); qa.pause(); QS = null; qaPaint(); if (msg) toast(msg);
  }
  qa.addEventListener("ended", () => { if (!QS) return; if (QS.phase === "q") qaCountdown(); else if (QS.phase === "a") qaNext(); });
  qa.addEventListener("error", () => { if (QS) { QS.paused = true; qaPaint("The recording could not load. Check your internet, then tap Resume."); } });
  audio.addEventListener("play", () => { if (QS) qaStop(); });
  function qaPaint(note) {
    document.querySelectorAll(".q.qa-on").forEach(n => n.classList.remove("qa-on"));
    document.querySelectorAll(".choice.qa-reveal").forEach(n => n.classList.remove("qa-reveal"));
    const box = qaBox;
    const mainB = document.querySelector("[data-act=qaAll]");
    if (!QS || pages[cur].kind !== "quiz") { box.hidden = true; document.body.classList.remove("qa-playing"); if (mainB) mainB.style.display = ""; return; }
    if (mainB) mainB.style.display = "none"; document.body.classList.add("qa-playing");
    box.hidden = false; box.style.bottom = (player.offsetHeight + 8) + "px";
    const qs = W.quiz[QS.level], card = document.querySelector(`.q[data-q="${QS.i}"]`);
    $("#qaNowT").textContent = `${LVN[QS.level]} · Question ${QS.i + 1} of ${qs.length}`;
    const txt = note || (QS.paused ? "Paused. Tap Resume to carry on." :
      QS.phase === "q" ? "Reading the question and the choices…" :
      QS.phase === "wait" ? `Choose your answer. ${QS.left} second${QS.left === 1 ? "" : "s"} left.` :
      QS.phase === "a" ? "Reading the correct answer…" : "Next question in a moment…");
    $("#qaNowC").textContent = txt;
    $("#qaPauseB").textContent = QS.paused ? "Resume" : "Pause";
    $("#qaSkipB").style.display = (QS.phase === "q" || QS.phase === "wait") ? "" : "none";
    $("#qaSkipB").textContent = QS.phase === "q" ? "Skip to the Wait" : "Skip the Wait";
    if (card) {
      card.classList.add("qa-on");
      if (QS.phase === "a") { const c = card.querySelectorAll(".choice")[qs[QS.i].answer]; if (c) c.classList.add("qa-reveal"); }
      const key = QS.level + QS.i;
      if (QS.scrolledKey !== key) {
        QS.scrolledKey = key;
        const r = card.getBoundingClientRect(), ph = player.offsetHeight;
        if (r.top < 70 || r.top > 100) window.scrollTo({ top: Math.max(0, scrollY + r.top - 84), behavior: "smooth" });
      }
    }
  }
  function qaAfterRender() { if (QS && pages[cur].kind !== "quiz") { qaStop(); return; } qaPaint(); }
  { const h = (location.hash || "").slice(1); if (h && idx(h) > 0) cur = idx(h); }
  render();
  window.addEventListener("hashchange", () => { const h = location.hash.slice(1); if (idx(h) >= 0) go(h); });
})();
