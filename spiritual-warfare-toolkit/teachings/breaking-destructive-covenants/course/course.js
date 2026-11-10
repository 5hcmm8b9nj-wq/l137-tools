/* Interactive course engine — Breaking Destructive Covenants
   Features: tabs, modules with level tabs, knowledge checks (MCQ/TF/FIB/multi/order),
   flashcards, quiz, weekly assignment, notes, progress tracking, completion certificate.
   Storage: localStorage with in-memory fallback (preview iframe blocks storage). */

(function () {
  'use strict';

  // ---------------- STORAGE (in-memory session store)
  // Note: this course runs inside sandboxed preview iframes that block persistent
  // browser storage APIs. All state is kept in memory for the current tab only.
  const memStore = {};
  const STORAGE = {
    get: (k) => (k in memStore ? memStore[k] : null),
    set: (k, v) => { memStore[k] = v; },
    del: (k) => { delete memStore[k]; }
  };

  const SK = 'l137:breaking-destructive-covenants';
  const stateKey = SK + ':state';

  function loadState() {
    try {
      const s = STORAGE.get(stateKey);
      if (s) return JSON.parse(s);
    } catch (e) {}
    return { completedModules: {}, quiz: {}, levels: {}, notes: '' };
  }
  function saveState() {
    STORAGE.set(stateKey, JSON.stringify(state));
  }

  const state = loadState();
  const COURSE = window.COURSE;

  // ---------------- TAB NAVIGATION ----------------
  const tabBtns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  function switchTab(name) {
    tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === name));
    panels.forEach(p => p.classList.toggle('active', p.id === 'tab-' + name));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  tabBtns.forEach(b => b.addEventListener('click', () => switchTab(b.dataset.tab)));
  document.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', () => switchTab(el.dataset.goto));
  });

  // ---------------- PROGRESS ----------------
  function updateProgress() {
    const total = COURSE.modules.length;
    const done = Object.values(state.completedModules).filter(Boolean).length;
    const pct = Math.round((done / total) * 100);
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('progressLabel').textContent = pct + '%';
    updateCertificate();
  }

  // ---------------- ESCAPE HTML ----------------
  function esc(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // ---------------- KNOWLEDGE CHECKS ----------------
  function renderKC(mod) {
    const kc = mod.knowledgeCheck;
    if (!kc) return '';
    const id = 'kc-' + mod.id;
    let body = '';

    if (kc.type === 'mcq') {
      body = '<div class="kc-options">' + kc.options.map((opt, i) =>
        `<button class="kc-option" data-i="${i}">${esc(opt)}</button>`
      ).join('') + '</div>';
    } else if (kc.type === 'tf') {
      body = '<div class="kc-options"><button class="kc-option" data-i="true">True</button><button class="kc-option" data-i="false">False</button></div>';
    } else if (kc.type === 'fib') {
      body = `<input type="text" class="kc-input" placeholder="Type your answer..." />` +
             `<button class="btn btn-primary kc-submit">Check answer</button>`;
    } else if (kc.type === 'multi') {
      body = '<div class="kc-options">' + kc.options.map((opt, i) =>
        `<button class="kc-option" data-i="${i}">${esc(opt)}</button>`
      ).join('') + '</div>' +
      `<button class="btn btn-primary kc-submit" style="margin-top:14px">Check my selections</button>`;
    } else if (kc.type === 'order') {
      body = `<div class="order-list">` +
        kc.items.map((item, i) => `
          <div class="order-item" data-idx="${i}">
            <div class="order-num">${i + 1}</div>
            <div>${esc(item)}</div>
            <div class="order-controls">
              <button class="order-btn" data-move="up" aria-label="Move up">▲</button>
              <button class="order-btn" data-move="down" aria-label="Move down">▼</button>
            </div>
          </div>
        `).join('') +
        `</div>` +
        `<button class="btn btn-primary kc-submit">Check my order</button>`;
    }

    return `
      <div class="kc-block" id="${id}">
        <div class="kc-label">Knowledge check</div>
        <div class="kc-question">${esc(kc.question)}</div>
        ${body}
        <div class="kc-explain"><strong>Explanation.</strong> ${esc(kc.explanation)}</div>
      </div>
    `;
  }

  function bindKC(mod, root) {
    const kc = mod.knowledgeCheck;
    if (!kc) return;
    const block = root.querySelector('#kc-' + mod.id);
    if (!block) return;
    const explain = block.querySelector('.kc-explain');
    const showExplain = () => explain.classList.add('show');

    if (kc.type === 'mcq') {
      block.querySelectorAll('.kc-option').forEach(btn => {
        btn.addEventListener('click', () => {
          const chosen = parseInt(btn.dataset.i, 10);
          block.querySelectorAll('.kc-option').forEach((b, i) => {
            b.classList.add('disabled');
            if (i === kc.correctIndex) b.classList.add('correct');
            else if (i === chosen && i !== kc.correctIndex) b.classList.add('wrong');
          });
          showExplain();
        });
      });
    } else if (kc.type === 'tf') {
      block.querySelectorAll('.kc-option').forEach(btn => {
        btn.addEventListener('click', () => {
          const chosen = btn.dataset.i === 'true';
          block.querySelectorAll('.kc-option').forEach(b => {
            b.classList.add('disabled');
            const bVal = b.dataset.i === 'true';
            if (bVal === kc.correct) b.classList.add('correct');
            else if (bVal === chosen) b.classList.add('wrong');
          });
          showExplain();
        });
      });
    } else if (kc.type === 'fib') {
      const input = block.querySelector('.kc-input');
      const submit = block.querySelector('.kc-submit');
      const onSubmit = () => {
        const ans = (input.value || '').trim().toLowerCase();
        const acceptable = [kc.correct.toLowerCase()].concat((kc.alternatives || []).map(a => a.toLowerCase()));
        const ok = acceptable.includes(ans);
        input.style.borderColor = ok ? 'var(--green)' : 'var(--ember)';
        input.style.background = ok ? '#EEF5E4' : '#FBEEE7';
        input.disabled = true;
        submit.disabled = true;
        showExplain();
      };
      submit.addEventListener('click', onSubmit);
      input.addEventListener('keydown', e => { if (e.key === 'Enter') onSubmit(); });
    } else if (kc.type === 'multi') {
      block.querySelectorAll('.kc-option').forEach(btn => {
        btn.addEventListener('click', () => {
          if (btn.classList.contains('disabled')) return;
          btn.classList.toggle('selected');
        });
      });
      block.querySelector('.kc-submit').addEventListener('click', () => {
        const chosen = new Set(Array.from(block.querySelectorAll('.kc-option.selected')).map(b => parseInt(b.dataset.i, 10)));
        const correct = new Set(kc.correctIndices);
        block.querySelectorAll('.kc-option').forEach((b, i) => {
          b.classList.add('disabled');
          b.classList.remove('selected');
          if (correct.has(i)) b.classList.add('correct');
          else if (chosen.has(i)) b.classList.add('wrong');
        });
        showExplain();
      });
    } else if (kc.type === 'order') {
      const list = block.querySelector('.order-list');
      list.addEventListener('click', e => {
        const btn = e.target.closest('.order-btn');
        if (!btn) return;
        const item = btn.closest('.order-item');
        if (btn.dataset.move === 'up' && item.previousElementSibling) {
          list.insertBefore(item, item.previousElementSibling);
        } else if (btn.dataset.move === 'down' && item.nextElementSibling) {
          list.insertBefore(item.nextElementSibling, item);
        }
        Array.from(list.children).forEach((el, i) => el.querySelector('.order-num').textContent = i + 1);
      });
      block.querySelector('.kc-submit').addEventListener('click', () => {
        const currentOrder = Array.from(list.children).map(el => parseInt(el.dataset.idx, 10));
        const isCorrect = currentOrder.every((v, i) => v === kc.correctOrder[i]);
        Array.from(list.children).forEach(el => {
          el.style.borderColor = isCorrect ? 'var(--green)' : 'var(--ember)';
          el.style.background = isCorrect ? '#EEF5E4' : '#FBEEE7';
        });
        showExplain();
      });
    }
  }

  // ---------------- MODULES ----------------
  function renderModule(mod) {
    const savedLevel = state.levels[mod.id] || 'adult';
    const isDone = !!state.completedModules[mod.id];
    return `
      <article class="module-block" data-mod="${mod.id}">
        <div class="module-head">
          <div>
            <div class="module-num">Module ${mod.num} of ${COURSE.modules.length}</div>
            <div class="module-kicker">${esc(mod.kicker)}</div>
          </div>
          <div class="module-status ${isDone ? 'done' : 'pending'}">${isDone ? 'Complete' : 'In progress'}</div>
        </div>
        <h3 class="module-title">${esc(mod.title)}</h3>

        <div class="panel panel-scripture" style="margin:12px 0 18px">
          <div class="scripture-ref">${esc(mod.scriptureRef)}</div>
          <div class="scripture-text">${esc(mod.scriptureText)}</div>
        </div>

        <div class="level-tabs" role="tablist" aria-label="Learning level">
          <button class="level-btn ${savedLevel==='simple'?'active':''}" data-level="simple">Simple</button>
          <button class="level-btn ${savedLevel==='teen'?'active':''}" data-level="teen">Teen</button>
          <button class="level-btn ${savedLevel==='adult'?'active':''}" data-level="adult">Adult</button>
          <button class="level-btn ${savedLevel==='deeper'?'active':''}" data-level="deeper">Deeper Study</button>
        </div>
        <div class="level-body" data-body>${esc(mod[savedLevel] || mod.adult)}</div>

        <div class="module-key">
          <div class="kicker">Key point · Remember this</div>
          <p>${esc(mod.keyPoint)}</p>
        </div>

        <div class="module-prayer">
          <div class="kicker">Pray aloud · LISTEN · SAY · REPEAT</div>
          ${esc(mod.corporatePrayer)}
        </div>

        <div class="module-declare">
          <div class="kicker">Declare aloud · Repeat after me</div>
          ${esc(mod.declaration)}
        </div>

        ${renderKC(mod)}

        <div class="module-application">
          <div class="kicker">Apply it · This week</div>
          ${esc(mod.applicationQuestion)}
        </div>

        <div class="module-application" style="background:#FDF6E0;border-left:4px solid var(--gold);border-radius:0 12px 12px 0;padding:14px 18px">
          <div class="kicker" style="color:var(--gold)">Recall it</div>
          <div style="margin-bottom:8px">${esc(mod.recall)}</div>
          <details><summary style="cursor:pointer;font-family:var(--sans);font-size:13px;color:var(--teal-deep);font-weight:600">Reveal answer</summary>
          <div style="margin-top:8px;font-style:italic">${esc(mod.recallAnswer)}</div></details>
        </div>

        <div class="module-actions">
          <button class="complete-btn ${isDone?'done':''}" data-complete>${isDone ? 'Completed' : 'Mark module complete'}</button>
          ${mod.num < COURSE.modules.length ? `<button class="btn btn-ghost" data-next="${mod.num}">Next module ›</button>` : ''}
        </div>
      </article>
    `;
  }

  function bindModule(mod, article) {
    // Level tabs
    article.querySelectorAll('.level-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lvl = btn.dataset.level;
        state.levels[mod.id] = lvl;
        saveState();
        article.querySelectorAll('.level-btn').forEach(b => b.classList.toggle('active', b === btn));
        article.querySelector('[data-body]').textContent = mod[lvl] || mod.adult;
      });
    });

    // Knowledge check
    bindKC(mod, article);

    // Complete button
    const cbtn = article.querySelector('[data-complete]');
    cbtn.addEventListener('click', () => {
      const now = !state.completedModules[mod.id];
      state.completedModules[mod.id] = now;
      saveState();
      cbtn.classList.toggle('done', now);
      cbtn.textContent = now ? 'Completed' : 'Mark module complete';
      const status = article.querySelector('.module-status');
      status.classList.toggle('done', now);
      status.classList.toggle('pending', !now);
      status.textContent = now ? 'Complete' : 'In progress';
      updateProgress();
    });

    // Next button
    const nbtn = article.querySelector('[data-next]');
    if (nbtn) {
      nbtn.addEventListener('click', () => {
        const target = document.querySelector(`[data-mod="m${parseInt(nbtn.dataset.next, 10) + 1}"]`);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  function renderModules() {
    const root = document.getElementById('modulesRoot');
    root.innerHTML = COURSE.modules.map(renderModule).join('');
    COURSE.modules.forEach(mod => {
      const article = root.querySelector(`[data-mod="${mod.id}"]`);
      bindModule(mod, article);
    });
  }

  // ---------------- SCRIPTURES ----------------
  function renderScriptures() {
    const root = document.getElementById('scripturesRoot');
    root.innerHTML = COURSE.scriptureLibrary.map(s => `
      <div class="scripture-card">
        <div class="scripture-ref">${esc(s.ref)} · KJV</div>
        <div class="scripture-text">${esc(s.text)}</div>
        ${s.note ? `<div class="scripture-note">${esc(s.note)}</div>` : ''}
      </div>
    `).join('');
  }

  // ---------------- PRAYERS ----------------
  function renderPrayers() {
    const root = document.getElementById('prayersRoot');
    root.innerHTML = COURSE.prayerLibrary.map(p => `
      <div class="prayer-card">
        <div class="prayer-section">${esc(p.section)}</div>
        <div class="prayer-text">${esc(p.text)}</div>
      </div>
    `).join('');
  }

  // ---------------- DECLARATIONS ----------------
  function renderDeclarations() {
    const root = document.getElementById('declarationsRoot');
    root.innerHTML = '<div class="dec-list">' + COURSE.declarationLibrary.map(d => `
      <div class="dec-item">${esc(d)}</div>
    `).join('') + '</div>';
  }

  // ---------------- FLASHCARDS ----------------
  function renderFlashcards() {
    const root = document.getElementById('flashcardsRoot');
    const cards = [];
    // Memory verses
    COURSE.memoryVerses.forEach(v => {
      cards.push({ front: v.ref, back: v.text, label: 'Memory verse' });
    });
    // Concept cards from module recall
    COURSE.modules.forEach(m => {
      cards.push({ front: m.recall, back: m.recallAnswer, label: 'Recall · Module ' + m.num });
    });

    root.innerHTML = cards.map((c, i) => `
      <div class="flashcard" data-i="${i}">
        <div class="flashcard-inner">
          <div class="flashcard-face flashcard-front">
            <div class="flashcard-label">${esc(c.label)}</div>
            <div class="flashcard-content">${esc(c.front)}</div>
            <div class="flashcard-hint">Tap to reveal</div>
          </div>
          <div class="flashcard-face flashcard-back">
            <div class="flashcard-label">Answer</div>
            <div class="flashcard-content">${esc(c.back)}</div>
            <div class="flashcard-hint">Tap to flip back</div>
          </div>
        </div>
      </div>
    `).join('');
    root.querySelectorAll('.flashcard').forEach(card => {
      card.addEventListener('click', () => card.classList.toggle('flipped'));
    });
  }

  // ---------------- FINAL QUIZ ----------------
  const QUIZ = [
    {
      q: "According to the teaching, why must a covenant be renounced even after you walk away from the relationship?",
      opts: [
        "Because it's a good spiritual habit",
        "Because in the spiritual realm the covenant is still legally binding until it is broken by the blood of Jesus",
        "Because Pastor Kiky says so",
        "Because the person will find you again"
      ],
      correct: 1,
      explain: "The covenant is an invisible chain — a legal, binding agreement. Walking away from the person does not dissolve the spiritual covenant. Only renunciation by the blood of Jesus does."
    },
    {
      q: "Which scripture is the main scripture for this teaching?",
      opts: ["Psalm 92:1", "Isaiah 28:18", "Genesis 6:18", "Matthew 3:11"],
      correct: 1,
      explain: "Isaiah 28:18 — 'And your covenant with death shall be disannulled, and your agreement with hell shall not stand.'"
    },
    {
      q: "Which of these is NOT one of the six things Pastor Kiky said the blood of Jesus does to evil covenants?",
      opts: [
        "Cancels evil covenants",
        "Breaks satanic agreements",
        "Cleanses spiritual contamination",
        "Ignores them and lets them expire naturally"
      ],
      correct: 3,
      explain: "The blood cancels, breaks, cleanses, destroys legal rights, delivers from ancestral bondage, and speaks mercy — it never ignores or lets any evil covenant expire naturally."
    },
    {
      q: "What is the correct order in Pastor Kiky's standard deliverance flow?",
      opts: [
        "Deliverance → Teaching → Praise → Sealing",
        "Praise & worship → Thanksgiving → Confession → Forgive others → Invite Holy Spirit → Teaching → Deliverance → Sealing",
        "Confession → Praise → Deliverance → Teaching",
        "Praise → Deliverance → Confession → Sealing"
      ],
      correct: 1,
      explain: "This is the standard L137 deliverance flow — never reorder it. Praise and worship first, thanksgiving, confession, forgiveness, inviting the Holy Spirit, teaching, deliverance prayers and declarations, then sealing."
    },
    {
      q: "What specific homework did Pastor Kiky assign?",
      opts: [
        "Fast for seven days",
        "Visit the pastor for personal prayer",
        "Write the names of ex-partners and third parties on paper, renounce each by name, disconnect, then destroy the paper",
        "Read the whole Bible in a week"
      ],
      correct: 2,
      explain: "The specific homework was to take a piece of paper, write the names of ex-partners and any third parties involved in altar work on your behalf, renounce each by name, and disconnect. If the Lord continues to show a person in a dream, do it again for that one."
    },
    {
      q: "According to Colossians 2:14–15, what did Christ do to the handwriting of ordinances that was against us?",
      opts: [
        "He hid it",
        "He blotted it out and nailed it to His cross, then triumphed openly over principalities and powers",
        "He ignored it",
        "He negotiated with the devil"
      ],
      correct: 1,
      explain: "Colossians 2:14–15 declares Christ blotted out the handwriting of ordinances, nailed it to His cross, spoiled principalities and powers, and made a shew of them openly, triumphing over them in it."
    },
    {
      q: "Why is sealing important after deliverance?",
      opts: [
        "It's a nice way to end the service",
        "Deliverance without sealing leaves the house empty and open for a return attack (Matthew 12:43–45)",
        "It replaces the need for aftercare",
        "It's optional but polite"
      ],
      correct: 1,
      explain: "Matthew 12:43–45 warns of the empty house — when a spirit is cast out and the house is not filled, seven more return. Sealing prayer covers the believer, sends angels, cancels retaliation, and prevents return."
    }
  ];

  function renderQuiz() {
    const root = document.getElementById('quizRoot');
    root.innerHTML = QUIZ.map((q, i) => `
      <div class="kc-block" data-qi="${i}">
        <div class="kc-label">Question ${i + 1} of ${QUIZ.length}</div>
        <div class="kc-question">${esc(q.q)}</div>
        <div class="kc-options">
          ${q.opts.map((opt, j) => `<button class="kc-option" data-i="${j}">${esc(opt)}</button>`).join('')}
        </div>
        <div class="kc-explain"><strong>Explanation.</strong> ${esc(q.explain)}</div>
      </div>
    `).join('') + `<div style="margin-top:22px;text-align:center"><button class="btn btn-primary" id="quizScoreBtn">Score my quiz</button></div>`;

    root.querySelectorAll('[data-qi]').forEach(block => {
      const qi = parseInt(block.dataset.qi, 10);
      const q = QUIZ[qi];
      block.querySelectorAll('.kc-option').forEach(btn => {
        btn.addEventListener('click', () => {
          if (block.dataset.answered) return;
          const chosen = parseInt(btn.dataset.i, 10);
          block.dataset.answered = '1';
          state.quiz[qi] = chosen === q.correct;
          saveState();
          block.querySelectorAll('.kc-option').forEach((b, k) => {
            b.classList.add('disabled');
            if (k === q.correct) b.classList.add('correct');
            else if (k === chosen) b.classList.add('wrong');
          });
          block.querySelector('.kc-explain').classList.add('show');
        });
      });
    });

    document.getElementById('quizScoreBtn').addEventListener('click', () => {
      const correct = QUIZ.reduce((n, _, i) => n + (state.quiz[i] ? 1 : 0), 0);
      const total = QUIZ.length;
      const pct = Math.round((correct / total) * 100);
      const result = document.getElementById('quizResult');
      result.hidden = false;
      result.innerHTML = `<strong>You scored ${correct} of ${total} (${pct}%).</strong> ${
        pct === 100 ? 'Perfect — every truth stored. Now go and walk it out.' :
        pct >= 70 ? 'Strong understanding. Review the questions you missed above.' :
        'Review the modules and try again — repetition is how deliverance sticks.'
      }`;
      updateProgress();
    });
  }

  // ---------------- ASSIGNMENT + HOMEWORK ----------------
  function renderAssignment() {
    const root = document.getElementById('assignmentRoot');
    root.innerHTML = COURSE.weeklyAssignment.map(d => `
      <div class="assignment-day">
        <div class="day-label">Day ${d.day}</div>
        <div class="day-focus">${esc(d.focus)}</div>
        <div class="day-scripture">${esc(d.scripture)} · KJV</div>
        <div class="day-action">${esc(d.action)}</div>
      </div>
    `).join('');
    const hw = document.getElementById('homeworkRoot');
    hw.innerHTML = COURSE.homework.map(h => `<li>${esc(h)}</li>`).join('');
  }

  // ---------------- NOTES ----------------
  function initNotes() {
    const area = document.getElementById('notesArea');
    const status = document.getElementById('notesStatus');
    area.value = state.notes || '';
    let t;
    area.addEventListener('input', () => {
      state.notes = area.value;
      status.textContent = 'Saving...';
      status.classList.remove('saved');
      clearTimeout(t);
      t = setTimeout(() => {
        saveState();
        status.textContent = 'Saved to this device';
        status.classList.add('saved');
      }, 500);
    });
    document.getElementById('notesClearBtn').addEventListener('click', () => {
      if (!confirm('Clear all your notes?')) return;
      area.value = '';
      state.notes = '';
      saveState();
      status.textContent = 'Cleared';
      status.classList.remove('saved');
    });
    if (state.notes) {
      status.textContent = 'Saved to this device';
      status.classList.add('saved');
    }
  }

  // ---------------- CERTIFICATE ----------------
  function updateCertificate() {
    const root = document.getElementById('certRoot');
    if (!root) return;
    const allModules = COURSE.modules.every(m => state.completedModules[m.id]);
    const quizComplete = Object.keys(state.quiz).length >= QUIZ.length;
    if (allModules && quizComplete) {
      root.innerHTML = `
        <div class="cert-card">
          <div class="cert-eyebrow">Certificate of Completion</div>
          <h3>You have completed<br />Breaking Destructive Covenants</h3>
          <div class="cert-body">Ten modules studied. The scripture library, prayer library, and declaration library reviewed. The final quiz taken. Homework received.</div>
          <div class="cert-body"><strong>Pastor Kiky Ocansey · L137 Deliverance Ministry International</strong><br />Service of ${esc(COURSE.serviceDate)}</div>
          <div class="cert-verse">"For with God nothing shall be impossible." — Luke 1:37</div>
        </div>
      `;
    } else {
      const modLeft = COURSE.modules.length - Object.values(state.completedModules).filter(Boolean).length;
      const quizLeft = QUIZ.length - Object.keys(state.quiz).length;
      root.innerHTML = `
        <div class="cert-locked">
          Your completion certificate unlocks when you finish every module and every quiz question.<br />
          ${modLeft > 0 ? `${modLeft} module${modLeft === 1 ? '' : 's'} left. ` : ''}
          ${quizLeft > 0 ? `${quizLeft} quiz question${quizLeft === 1 ? '' : 's'} left.` : ''}
        </div>
      `;
    }
  }

  // ---------------- NAV + FOOTER ----------------
  document.getElementById('nav-slot').innerHTML = renderNav('covenants-chains', { base: '../../../' });
  document.getElementById('footer-slot').innerHTML = renderFooter({ base: '../../../' });

  // ---------------- INIT ----------------
  renderModules();
  renderScriptures();
  renderPrayers();
  renderDeclarations();
  renderFlashcards();
  renderQuiz();
  renderAssignment();
  initNotes();
  updateProgress();

})();
