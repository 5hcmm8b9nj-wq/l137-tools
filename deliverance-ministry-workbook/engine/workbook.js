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
  document.title = W.title + " — " + M.brand;

  /* ---------------- Page list ---------------- */
  const pages = [];
  pages.push({ id: "opening", kind: "opening", title: "Welcome", audio: W.openingAudio });
  W.sections.forEach((s, i) => pages.push(Object.assign({ kind: "lesson", n: i + 1 }, s)));
  pages.push({ id: "quiz", kind: "quiz", title: "Check Your Understanding", audio: W.quiz.audio });
  pages.push({ id: "declarations", kind: "declarations", title: "Declarations for My Loved Ones", audio: W.declarationsAudio });
  pages.push({ id: "mywork", kind: "mywork", title: "Save and Keep My Work", audio: W.myWorkAudio });
  pages.push({ id: "help", kind: "help", title: "Help and How to Use This Workbook", audio: W.helpAudio });
  const idx = id => pages.findIndex(p => p.id === id);

  /* ---------------- Shell ---------------- */
  document.body.innerHTML = "";
  const top = el("header", { class: "topbar" });
  top.innerHTML = `<div class="topbar-in">
      <button class="tb-btn" data-go="opening" aria-label="Home">${I.home}<span>Home</span></button>
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

  function renderOpening(p) {
    const cont = hasSaved();
    return `
      <p class="brand-line">${esc(M.brand)}</p>
      ${M.openingLine ? `<p class="opening-lede">${esc(M.openingLine)}</p>` : ""}
      ${W.templateNotice ? `<span class="template-flag">${esc(W.templateNotice)}</span>` : ""}
      <h1>${ph(W.title)}</h1>
      <div class="rule"></div>
      <div class="meta"><span>Speaker: <b>${esc(M.speaker)}</b></span><span>Service: <b>${ph(W.serviceDate)}</b></span>${W.mainScripture ? `<span>Main Scripture: <b>${esc(W.mainScripture)}</b></span>` : ""}</div>
      ${W.heroImage ? `<img class="hero-img" src="${esc(W.heroImage)}" alt="${esc(W.heroAlt || "")}">` : ""}
      <p class="lede">${ph(W.intro)}</p>
      ${instruction("Choose one button below to begin.")}
      <div class="cta-stack">
        <button class="btn primary" data-go="${pages[1].id}">Start Workbook</button>
        <button class="btn accent" data-act="listenAll">${I.listen}Listen from Beginning</button>
        ${cont ? `<button class="btn hot" data-act="continue">Continue My Work</button>` : ""}
      </div>
      ${W.printable ? `<p style="margin:14px 0 0"><a class="btn small" href="${esc(W.printable)}" target="_blank" rel="noopener">Open the Printable Companion (PDF)</a></p>` : ""}
      <p style="font-size:15.5px;color:var(--muted);margin-top:14px">Start Workbook lets you read and complete activities. Listen from Beginning plays the whole workbook aloud, one section after another.${cont ? " Continue My Work takes you back to where you stopped." : ""}</p>`;
  }
  function renderLesson(p) {
    return `
      <p class="step-label">Section ${p.n} of ${W.sections.length}</p>
      <h2>${ph(p.title)}</h2><div class="rule"></div>
      ${p.purpose ? `<p class="purpose">${ph(p.purpose)}</p>` : ""}
      ${instruction(p.instruction || "Read the teaching point and the Scripture, then complete the activity.")}
      <section class="card teaching"><span class="block-label">${esc(W.teachingLabel || "The teaching")}</span>${(Array.isArray(p.teaching) ? p.teaching : [p.teaching]).map(t => `<p>${ph(t)}</p>`).join("")}${p.quote ? `<p style="font-family:var(--display-font);font-size:20px;border-top:2px solid var(--line);padding-top:12px;margin:0">“${ph(p.quote)}”</p>` : ""}</section>
      ${scriptureBlock(p.scripture)}
      ${activityBlock(p)}
      ${pageControls(p)}`;
  }
  let quizLevel = null;
  const LEVELS = [["beginner", "Beginner", "Main points"], ["intermediate", "Intermediate", "Understanding"], ["advanced", "Advanced", "Scenarios"]];
  function renderQuiz(p) {
    return `
      <p class="step-label">Quiz</p>
      <h2>Check Your Understanding</h2><div class="rule"></div>
      ${instruction("Choose a level, then answer one question at a time.")}
      <div class="levels" role="group" aria-label="Quiz level">${LEVELS.map(([k, n, d]) => `<button class="level-btn" data-level="${k}" aria-pressed="${quizLevel === k}">${n}<small>${d}${S.quiz[k] && S.quiz[k].done ? ` · Best ${S.quiz[k].best}/${W.quiz[k].length}` : ""}</small></button>`).join("")}</div>
      <div id="quizBody">${quizLevel ? quizHTML(quizLevel) : `<p>Beginner checks the main points. Intermediate checks understanding and application. Advanced uses real-life scenarios. You can retry any level.</p>`}</div>
      <p style="font-size:15px;color:var(--muted)">Only the quiz answers are scored. Your prayers and personal reflections are never scored.</p>
      ${pageControls(p)}`;
  }
  function quizHTML(level) {
    const qs = W.quiz[level], st = (S.quiz[level] = S.quiz[level] || { picks: {}, best: 0, done: false });
    const answered = Object.keys(st.picks).length;
    let h = qs.map((q, qi) => {
      const pick = st.picks[qi], done = pick !== undefined;
      return `<div class="card q" data-q="${qi}"><div class="q-num">Question ${qi + 1} of ${qs.length}</div><p class="q-text">${ph(q.q)}</p>
        ${q.options.map((o, oi) => `<label class="choice ${done ? (oi === q.answer ? "correct" : oi === pick ? "wrong" : "") : ""}"><input type="radio" name="q${level}${qi}" value="${oi}" ${done ? "disabled" : ""} ${pick === oi ? "checked" : ""}><span>${ph(o)}</span></label>`).join("")}
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
      <h2>Declarations for My Loved Ones</h2><div class="rule"></div>
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
      ["How do I begin?", `<p>On the first page, tap <b>Start Workbook</b> to read and complete the activities. Or tap <b>Listen from Beginning</b> to hear the whole workbook read aloud, one section after another, without pressing Next.</p>`],
      ["How do I pause or start again?", `<ul>
        <li><b>Pause</b> stops the voice and remembers your place. Tap <b>Play</b> to continue.</li>
        <li><b>Stop</b> ends the recording and goes back to the start of that recording.</li>
        <li><b>Back 10s</b> and <b>Fwd 10s</b> move 10 seconds back or forward.</li>
        <li><b>Restart Audio</b> starts the listening from the beginning again. Your writing is not deleted.</li>
        <li><b>Clear This Page</b> erases only what you typed on the page you are on.</li>
        <li><b>Start Over</b> erases everything in the workbook. It asks you first.</li></ul>`],
      ["How do I choose a quiz level?", `<p>Go to the <b>Check Your Understanding</b> page. At the top are three buttons: <b>Beginner</b>, <b>Intermediate</b> and <b>Advanced</b>. Tap one. Choose an answer and tap <b>Check My Answer</b>. To try again, tap <b>Retry This Level</b> at the bottom.</p>`],
      ["How do I add loved ones?", `<p>Go to the <b>Declarations for My Loved Ones</b> page. Type a name in the box and tap <b>Add Name</b>. The name appears inside every declaration. To edit a name, tap it and change the text. To remove a name, tap <b>Remove</b> beside it. If you prefer not to use names, tick <b>Pray without names</b>.</p>`],
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

  /* ---------------- Navigation ---------------- */
  let cur = 0;
  function render() {
    const p = pages[cur];
    const fn = { opening: renderOpening, lesson: renderLesson, quiz: renderQuiz, declarations: renderDeclarations, mywork: renderMyWork, help: renderHelp }[p.kind];
    main.innerHTML = `<article class="page" data-page="${p.id}">${fn(p)}${pager(cur)}</article>`;
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
    if (pages[i].kind === "quiz" && !opts.keepLevel) quizLevel = quizLevel || null;
    render(); autosave();
    if (!opts.noScroll) { window.scrollTo({ top: 0, behavior: "instant" }); main.focus({ preventScroll: true }); }
  }
  function renderSavedStatus() {
    document.querySelectorAll("[data-saved]").forEach(n => {
      if (S.savedAt) n.textContent = (store.ok ? "Last saved on this device at " : "Kept for this visit at ") + new Date(S.savedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) + ".";
    });
  }

  /* ---------------- Events ---------------- */
  document.addEventListener("click", e => {
    const g = e.target.closest("[data-go]"); if (g) { go(g.dataset.go); return; }
    const lv = e.target.closest("[data-level]:not([data-act])"); if (lv) { quizLevel = lv.dataset.level; render(); return; }
    const a = e.target.closest("[data-act]"); if (!a) return;
    const act = a.dataset.act, p = pages[cur];
    if (act === "save") save(true);
    else if (act === "continue") go(S.lastPage || 1);
    else if (act === "listenAll") startSequence(0);
    else if (act === "listenPage") startPage(cur);
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
    W.sections.forEach(s => {
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
  const audio = new Audio(); audio.preload = "none";
  const player = el("section", { class: "player", "aria-label": "Audio player" });
  const C = 2 * Math.PI * 32;
  player.innerHTML = `<div class="player-in">
    <div class="ring-wrap" aria-hidden="true"><svg viewBox="0 0 76 76"><circle class="ring-bg" cx="38" cy="38" r="32"/><circle class="ring-fg" id="ring" cx="38" cy="38" r="32" stroke-dasharray="${C}" stroke-dashoffset="${C}"/></svg><div class="ring-pct" id="ringPct">0%</div></div>
    <div class="now"><div class="what" id="nowWhat">Nothing playing</div><div class="time" id="nowTime" aria-live="off">0:00 / 0:00</div><div class="status" id="nowStatus" role="status" aria-live="polite">Tap Play to listen to this page.</div></div>
    <div class="pbtns">
      <button class="pbtn main" id="pPlay" aria-label="Play">${I.play}<span>Play</span></button>
      <button class="pbtn" id="pPause" aria-label="Pause">${I.pause}<span>Pause</span></button>
      <button class="pbtn" id="pStop" aria-label="Stop">${I.stop}<span>Stop</span></button>
      <button class="pbtn" id="pRew" aria-label="Rewind 10 seconds">${I.rew}<span>Back 10s</span></button>
      <button class="pbtn" id="pFwd" aria-label="Forward 10 seconds">${I.fwd}<span>Fwd 10s</span></button>
      <button class="pbtn" id="pRestart" aria-label="Restart audio from the beginning">${I.restart}<span>Restart</span></button>
    </div>
    ${W.voice && W.voice.note ? `<p class="voice-note">${esc(W.voice.note)}</p>` : ""}
  </div>`;
  document.body.appendChild(player);
  const setPH = () => document.body.style.setProperty("--player-h", (player.offsetHeight + 24) + "px");
  window.addEventListener("resize", setPH); setTimeout(setPH, 50);

  let seq = [], seqPos = 0, mode = "page"; // mode: "page" | "all"
  const status = (m, err) => { const s = $("#nowStatus"); s.textContent = m; s.classList.toggle("err", !!err); };
  function trackList() { return pages.map((p, i) => ({ i, src: p.audio, title: p.title })).filter(t => t.src); }
  function load(t, autoplay) {
    $("#nowWhat").textContent = (mode === "all" ? "Listening from beginning · " : "") + t.title;
    if (audio.dataset.src !== t.src) { audio.src = t.src; audio.dataset.src = t.src; }
    if (autoplay) playNow();
  }
  function playNow() {
    status("Loading…");
    const pr = audio.play();
    if (pr && pr.catch) pr.catch(() => status("Tap Play to start the sound.", true));
  }
  function startSequence(from) {
    seq = trackList(); if (!seq.length) { status("No recordings have been added to this workbook yet.", true); return; }
    mode = "all"; seqPos = Math.max(0, from || 0);
    go(seq[seqPos].i, { noScroll: false }); load(seq[seqPos], true);
  }
  function startPage(i) {
    const p = pages[i]; if (!p.audio) { status("This page does not have a recording yet.", true); return; }
    mode = "page"; seq = [{ i, src: p.audio, title: p.title }]; seqPos = 0; load(seq[0], true); try { audio.currentTime = 0; } catch (e) {}
  }
  function stopAudio() { audio.pause(); try { audio.currentTime = 0; } catch (e) {} status("Stopped. Tap Play to start this recording again."); paint(); }
  $("#pPlay").onclick = () => {
    if (!audio.src) { const p = pages[cur]; if (p.audio) startPage(cur); else if (cur === 0) startSequence(0); else status("This page does not have a recording yet.", true); return; }
    if (audio.error) { const s = audio.dataset.src; audio.removeAttribute("src"); audio.dataset.src = ""; audio.load(); load({ src: s, title: $("#nowWhat").textContent }, true); return; }
    playNow();
  };
  $("#pPause").onclick = () => { audio.pause(); if (audio.src) status("Paused. Tap Play to continue from here."); };
  $("#pStop").onclick = () => { if (audio.src) stopAudio(); };
  $("#pRew").onclick = () => { if (audio.src) audio.currentTime = Math.max(0, audio.currentTime - 10); };
  $("#pFwd").onclick = () => { if (audio.src && isFinite(audio.duration)) audio.currentTime = Math.min(audio.duration - 0.2, audio.currentTime + 10); };
  $("#pRestart").onclick = () => {
    if (mode === "all") { startSequence(0); return; }
    if (!audio.src) { $("#pPlay").click(); return; }
    audio.currentTime = 0; playNow();
  };
  function paint() {
    const d = audio.duration, t = audio.currentTime, f = isFinite(d) && d > 0 ? t / d : 0;
    $("#ring").setAttribute("stroke-dashoffset", String(C * (1 - f)));
    $("#ringPct").textContent = Math.round(f * 100) + "%";
    $("#nowTime").textContent = fmt(t) + " / " + (isFinite(d) ? fmt(d) : "0:00");
  }
  ["timeupdate", "loadedmetadata", "durationchange", "seeked"].forEach(ev => audio.addEventListener(ev, paint));
  audio.addEventListener("playing", () => status(mode === "all" ? `Playing section ${seqPos + 1} of ${seq.length}. Activities can be done later.` : "Playing."));
  audio.addEventListener("waiting", () => status("Loading…"));
  audio.addEventListener("error", () => { if (audio.getAttribute("src")) status("Audio could not load. Check your internet, then tap Play to try again.", true); });
  audio.addEventListener("ended", () => {
    if (mode === "all" && seqPos < seq.length - 1) { seqPos++; go(seq[seqPos].i); load(seq[seqPos], true); }
    else { status(mode === "all" ? "Finished listening to the whole workbook." : "Finished. Tap Restart to hear it again."); paint(); }
  });
  if ("mediaSession" in navigator) {
    try {
      navigator.mediaSession.metadata = new MediaMetadata({ title: W.title, artist: M.speaker, album: M.brand });
      navigator.mediaSession.setActionHandler("play", () => playNow());
      navigator.mediaSession.setActionHandler("pause", () => audio.pause());
      navigator.mediaSession.setActionHandler("seekbackward", () => $("#pRew").click());
      navigator.mediaSession.setActionHandler("seekforward", () => $("#pFwd").click());
    } catch (e) {}
  }

  render();
})();
