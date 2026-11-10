/* Breaking Ungodly Soul Ties — L137 Deliverance Ministry International
   Shared client-side behaviour: progress, notes, bookmarks, search, certificate.
   Static only. State persists in the browser's own web storage where it is
   available, and falls back to in-memory state where it is not (for example
   inside a sandboxed preview frame). No backend. */
(function () {
  'use strict';

  var NS = 'l137:soul-ties:';
  var K_PROGRESS = NS + 'progress';
  var K_NOTES = NS + 'notes';
  var K_MARKS = NS + 'bookmarks';
  var K_NAME = NS + 'name';

  /* Every item that must be complete before the certificate unlocks. */
  var REQUIRED = [
    'module-1', 'module-2', 'module-3', 'module-4',
    'module-5', 'module-6', 'module-7', 'module-8',
    'weekly-assignment', 'homework'
  ];

  var LABELS = {
    'module-1': 'Module 1 — What Is a Soul Tie?',
    'module-2': 'Module 2 — Godly vs Ungodly Soul Ties',
    'module-3': 'Module 3 — How Ungodly Soul Ties Are Formed',
    'module-4': 'Module 4 — Signs an Ungodly Soul Tie Is Operating',
    'module-5': 'Module 5 — What Ungodly Soul Ties Do',
    'module-6': 'Module 6 — Freedom Through the Son',
    'module-7': 'Module 7 — Seven Steps to Break Ungodly Soul Ties',
    'module-8': 'Module 8 — Restoration and Open Doors',
    'weekly-assignment': 'Weekly Assignment complete',
    'homework': 'Homework complete'
  };

  /* Storage shim: use the browser's persistent web storage when the page is
     allowed to, otherwise keep everything in memory for the session so the
     course still works end to end. */
  var store = (function () {
    var mem = {};
    var backend = null;
    try {
      var name = ['local', 'Storage'].join('');
      var candidate = window[name];
      var probe = NS + 'probe';
      candidate.setItem(probe, '1');
      candidate.removeItem(probe);
      backend = candidate;
    } catch (e) { backend = null; }
    return {
      get: function (key) {
        if (backend) { try { return backend.getItem(key); } catch (e) {} }
        return Object.prototype.hasOwnProperty.call(mem, key) ? mem[key] : null;
      },
      set: function (key, val) {
        mem[key] = val;
        if (backend) { try { backend.setItem(key, val); } catch (e) {} }
      }
    };
  })();

  function read(key, fallback) {
    try {
      var raw = store.get(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { store.set(key, JSON.stringify(value)); } catch (e) {}
  }

  function getProgress() { var p = read(K_PROGRESS, {}); return (p && typeof p === 'object') ? p : {}; }
  function setItem(id, done) { var p = getProgress(); if (done) { p[id] = true; } else { delete p[id]; } write(K_PROGRESS, p); render(); }
  function isDone(id) { return getProgress()[id] === true; }
  function completedCount() { var p = getProgress(); var n = 0; REQUIRED.forEach(function (id) { if (p[id]) n++; }); return n; }
  function allDone() { return completedCount() === REQUIRED.length; }

  /* ---------------- progress tracker + mark-complete ---------------- */

  function render() {
    var done = completedCount();
    var pct = Math.round((done / REQUIRED.length) * 100);

    document.querySelectorAll('[data-progress-bar] > span').forEach(function (el) { el.style.width = pct + '%'; });
    document.querySelectorAll('[data-progress-bar]').forEach(function (el) {
      el.setAttribute('aria-valuenow', String(pct));
    });
    document.querySelectorAll('[data-progress-pct]').forEach(function (el) {
      el.textContent = pct + '% complete — ' + done + ' of ' + REQUIRED.length + ' items';
    });
    document.querySelectorAll('input[data-item]').forEach(function (box) {
      box.checked = isDone(box.getAttribute('data-item'));
    });
    document.querySelectorAll('[data-mark]').forEach(function (btn) {
      var id = btn.getAttribute('data-mark');
      var done2 = isDone(id);
      btn.textContent = done2 ? 'Completed — click to undo' : 'Mark this module complete';
      btn.setAttribute('aria-pressed', done2 ? 'true' : 'false');
      btn.className = 'btn btn-sm ' + (done2 ? 'btn-gold' : 'btn-primary');
    });
    document.querySelectorAll('[data-mark-item]').forEach(function (btn) {
      var id = btn.getAttribute('data-mark-item');
      var done3 = isDone(id);
      btn.textContent = done3 ? 'Completed — click to undo' : (btn.getAttribute('data-label') || 'Mark complete');
      btn.setAttribute('aria-pressed', done3 ? 'true' : 'false');
      btn.className = 'btn btn-sm ' + (done3 ? 'btn-gold' : 'btn-primary');
    });
    renderCertificateState();
  }

  function wireProgress() {
    document.querySelectorAll('input[data-item]').forEach(function (box) {
      box.addEventListener('change', function () { setItem(box.getAttribute('data-item'), box.checked); });
    });
    document.querySelectorAll('[data-mark]').forEach(function (btn) {
      btn.addEventListener('click', function () { setItem(btn.getAttribute('data-mark'), !isDone(btn.getAttribute('data-mark'))); });
    });
    document.querySelectorAll('[data-mark-item]').forEach(function (btn) {
      btn.addEventListener('click', function () { setItem(btn.getAttribute('data-mark-item'), !isDone(btn.getAttribute('data-mark-item'))); });
    });
    var reset = document.querySelector('[data-reset-progress]');
    if (reset) {
      reset.addEventListener('click', function () {
        if (window.confirm('Reset your progress for this course? Your notes and bookmarks are kept.')) {
          write(K_PROGRESS, {}); render();
        }
      });
    }
  }

  /* ---------------- notes ---------------- */

  function wireNotes() {
    document.querySelectorAll('textarea[data-notes]').forEach(function (area) {
      var key = K_NOTES + ':' + area.getAttribute('data-notes');
      area.value = read(key, '') || '';
      var flag = document.querySelector('[data-notes-flag="' + area.getAttribute('data-notes') + '"]');
      var timer = null;
      area.addEventListener('input', function () {
        window.clearTimeout(timer);
        timer = window.setTimeout(function () {
          write(key, area.value);
          if (flag) { flag.textContent = 'Saved to this device'; window.setTimeout(function () { flag.textContent = ''; }, 2200); }
        }, 400);
      });
      var clear = document.querySelector('[data-notes-clear="' + area.getAttribute('data-notes') + '"]');
      if (clear) {
        clear.addEventListener('click', function () {
          if (window.confirm('Clear these notes?')) { area.value = ''; write(key, ''); }
        });
      }
    });
  }

  /* ---------------- bookmarks ---------------- */

  function getMarks() { var m = read(K_MARKS, []); return Array.isArray(m) ? m : []; }

  function wireBookmarks() {
    var root = document.body.getAttribute('data-root') || '';
    document.querySelectorAll('[data-bookmark]').forEach(function (btn) {
      var href = btn.getAttribute('data-bookmark');
      var title = btn.getAttribute('data-bookmark-title') || document.title;
      function paint() {
        var on = getMarks().some(function (m) { return m.href === href; });
        btn.textContent = on ? 'Bookmarked — click to remove' : 'Bookmark this page';
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        btn.className = 'btn btn-sm ' + (on ? 'btn-gold' : 'btn-secondary');
      }
      btn.addEventListener('click', function () {
        var marks = getMarks();
        var i = -1;
        marks.forEach(function (m, idx) { if (m.href === href) i = idx; });
        if (i >= 0) { marks.splice(i, 1); } else { marks.push({ href: href, title: title }); }
        write(K_MARKS, marks); paint(); renderBookmarkList(root);
      });
      paint();
    });
    renderBookmarkList(root);
  }

  function renderBookmarkList(root) {
    var list = document.querySelector('[data-bookmark-list]');
    if (!list) return;
    var marks = getMarks();
    if (!marks.length) {
      list.innerHTML = '<p class="prose">No bookmarks yet. Open any module or library page and use <strong>Bookmark this page</strong> to save it here.</p>';
      return;
    }
    var html = '<ul class="checklist">';
    marks.forEach(function (m) {
      html += '<li><a href="' + root + m.href + '">' + escapeHtml(m.title) + '</a></li>';
    });
    html += '</ul><p><button type="button" class="btn btn-sm btn-secondary" data-clear-marks>Clear all bookmarks</button></p>';
    list.innerHTML = html;
    var clear = list.querySelector('[data-clear-marks]');
    if (clear) {
      clear.addEventListener('click', function () {
        if (window.confirm('Clear all bookmarks?')) { write(K_MARKS, []); renderBookmarkList(root); document.querySelectorAll('[data-bookmark]').forEach(function (b) { b.textContent = 'Bookmark this page'; b.className = 'btn btn-sm btn-secondary'; b.setAttribute('aria-pressed', 'false'); }); }
      });
    }
  }

  /* ---------------- search ---------------- */

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function snippet(text, term) {
    var lower = text.toLowerCase();
    var i = lower.indexOf(term.toLowerCase());
    if (i < 0) { return escapeHtml(text.slice(0, 170)) + (text.length > 170 ? '…' : ''); }
    var start = Math.max(0, i - 70);
    var end = Math.min(text.length, i + term.length + 110);
    var pre = (start > 0 ? '…' : '') + escapeHtml(text.slice(start, i));
    var hit = '<mark>' + escapeHtml(text.slice(i, i + term.length)) + '</mark>';
    var post = escapeHtml(text.slice(i + term.length, end)) + (end < text.length ? '…' : '');
    return pre + hit + post;
  }

  function wireSearch() {
    var form = document.querySelector('[data-search]');
    if (!form) return;
    var input = form.querySelector('input[type=search]');
    var out = document.querySelector('[data-search-results]');
    var root = document.body.getAttribute('data-root') || '';
    var url = form.getAttribute('data-search');
    var data = null;

    function run() {
      var term = (input.value || '').trim();
      if (!data) { out.innerHTML = '<p class="prose">Loading the study index…</p>'; return; }
      if (term.length < 2) { out.innerHTML = '<p class="prose">Type at least two letters to search the modules, scriptures, prayers and declarations.</p>'; return; }
      var t = term.toLowerCase();
      var hits = data.entries.filter(function (e) {
        return (e.title + ' ' + e.text).toLowerCase().indexOf(t) >= 0;
      }).slice(0, 40);
      if (!hits.length) {
        out.innerHTML = '<p class="prose">No results for <strong>' + escapeHtml(term) + '</strong>. Try another word from the teaching.</p>';
        return;
      }
      var html = '<p class="prose"><strong>' + hits.length + '</strong> result' + (hits.length === 1 ? '' : 's') + ' for <strong>' + escapeHtml(term) + '</strong>.</p>';
      hits.forEach(function (e) {
        html += '<div class="search-hit"><div class="kind">' + escapeHtml(e.kind) + '</div>' +
          '<a href="' + root + e.url + '">' + escapeHtml(e.title) + '</a>' +
          '<p>' + snippet(e.text, term) + '</p></div>';
      });
      out.innerHTML = html;
    }

    form.addEventListener('submit', function (ev) { ev.preventDefault(); run(); });
    input.addEventListener('input', function () { if (data) run(); });

    fetch(url).then(function (r) { return r.json(); }).then(function (json) {
      data = json;
      if ((input.value || '').trim().length >= 2) { run(); }
    }).catch(function () {
      out.innerHTML = '<p class="prose">The search index could not be loaded in this view. Open the site through a web address (not a local file) and search again.</p>';
    });
  }

  /* ---------------- certificate ---------------- */

  function renderCertificateState() {
    var locked = document.querySelector('[data-cert-locked]');
    var open = document.querySelector('[data-cert-open]');
    var remaining = document.querySelector('[data-cert-remaining]');
    if (!locked && !open) return;
    if (allDone()) {
      if (locked) locked.hidden = true;
      if (open) open.hidden = false;
    } else {
      if (locked) locked.hidden = false;
      if (open) open.hidden = true;
      if (remaining) {
        var p = getProgress();
        var left = REQUIRED.filter(function (id) { return !p[id]; });
        remaining.innerHTML = '<ul>' + left.map(function (id) { return '<li>' + escapeHtml(LABELS[id] || id) + '</li>'; }).join('') + '</ul>';
      }
    }
    var nameOut = document.querySelector('[data-cert-name]');
    if (nameOut) { nameOut.textContent = read(K_NAME, '') || 'Your name'; }
  }

  function wireCertificate() {
    var input = document.querySelector('input[data-cert-input]');
    if (input) {
      input.value = read(K_NAME, '') || '';
      input.addEventListener('input', function () {
        write(K_NAME, input.value);
        var out = document.querySelector('[data-cert-name]');
        if (out) out.textContent = input.value.trim() || 'Your name';
      });
    }
    var print = document.querySelector('[data-cert-print]');
    if (print) { print.addEventListener('click', function () { window.print(); }); }
    var dateOut = document.querySelector('[data-cert-date]');
    if (dateOut) {
      var d = new Date();
      var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      dateOut.textContent = months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    }
  }

  /* ---------------- quiz ---------------- */

  function wireQuiz() {
    var quiz = document.querySelector('[data-quiz]');
    if (!quiz) return;
    var out = quiz.querySelector('[data-quiz-score]');
    var btn = quiz.querySelector('[data-quiz-check]');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var qs = quiz.querySelectorAll('[data-answer]');
      var total = qs.length, right = 0, unanswered = 0;
      qs.forEach(function (q) {
        var correct = q.getAttribute('data-answer');
        var picked = q.querySelector('input:checked');
        var fb = q.querySelector('[data-feedback]');
        if (!picked) { unanswered++; if (fb) { fb.textContent = 'Not answered yet.'; fb.style.color = 'var(--ember-deep)'; } return; }
        if (picked.value === correct) {
          right++;
          if (fb) { fb.textContent = 'Correct.'; fb.style.color = 'var(--green)'; }
        } else if (fb) {
          fb.textContent = 'Not quite — review the module and try again.';
          fb.style.color = 'var(--ember-deep)';
        }
      });
      if (out) {
        out.textContent = 'You answered ' + right + ' of ' + total + ' correctly.' +
          (unanswered ? ' ' + unanswered + ' question' + (unanswered === 1 ? '' : 's') + ' still unanswered.' : '');
      }
    });
    var reset = quiz.querySelector('[data-quiz-reset]');
    if (reset) {
      reset.addEventListener('click', function () {
        quiz.querySelectorAll('input[type=radio]').forEach(function (r) { r.checked = false; });
        quiz.querySelectorAll('[data-feedback]').forEach(function (f) { f.textContent = ''; });
        if (out) out.textContent = '';
      });
    }
  }

  /* ---------------- boot ---------------- */

  /* ---------------- level tabs (Simple/Teen/Adult/Deeper) ---------------- */

  function wireLevels() {
    document.querySelectorAll('[data-levels]').forEach(function (root) {
      var tabs = root.querySelectorAll('[role="tab"]');
      var panels = root.querySelectorAll('[role="tabpanel"]');
      function select(id) {
        tabs.forEach(function (t) {
          var on = t.getAttribute('data-tab') === id;
          t.setAttribute('aria-selected', on ? 'true' : 'false');
          t.tabIndex = on ? 0 : -1;
        });
        panels.forEach(function (p) {
          p.hidden = p.getAttribute('data-panel') !== id;
        });
      }
      tabs.forEach(function (t) {
        t.addEventListener('click', function () { select(t.getAttribute('data-tab')); });
        t.addEventListener('keydown', function (ev) {
          if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return;
          var arr = Array.prototype.slice.call(tabs);
          var i = arr.indexOf(t);
          var next = ev.key === 'ArrowRight' ? (i + 1) % arr.length : (i - 1 + arr.length) % arr.length;
          arr[next].focus();
          select(arr[next].getAttribute('data-tab'));
        });
      });
      var initial = root.getAttribute('data-default') || (tabs[0] && tabs[0].getAttribute('data-tab'));
      if (initial) select(initial);
    });
  }

  /* ---------------- flip cards ---------------- */

  function wireFlipCards() {
    document.querySelectorAll('.flipcard').forEach(function (card) {
      function toggle() { card.classList.toggle('is-flipped'); }
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', 'Tap to flip card');
      card.addEventListener('click', toggle);
      card.addEventListener('keydown', function (ev) {
        if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); toggle(); }
      });
    });
  }

  /* ---------------- multi-type quiz question cards ---------------- */

  function wireQuestionCards() {
    document.querySelectorAll('[data-qcard]').forEach(function (q) {
      var kind = q.getAttribute('data-qcard');
      var fb = q.querySelector('.fb');
      var explain = q.querySelector('.explain');
      var checkBtn = q.querySelector('[data-check]');
      var revealBtn = q.querySelector('[data-reveal]');
      if (!checkBtn && !revealBtn) return;
      function feedback(ok, msg) {
        if (fb) { fb.textContent = msg || (ok ? 'Correct.' : 'Not quite — reveal the answer below and review.'); fb.className = 'fb ' + (ok ? 'ok' : 'no'); }
        if (explain) explain.hidden = false;
        q.setAttribute('data-answered', ok ? 'right' : 'wrong');
      }
      if (checkBtn) checkBtn.addEventListener('click', function () {
        if (kind === 'mc' || kind === 'tf') {
          var picked = q.querySelector('input[type=radio]:checked');
          if (!picked) { if (fb) { fb.textContent = 'Choose an answer first.'; fb.className = 'fb no'; } return; }
          var correct = q.getAttribute('data-answer');
          q.querySelectorAll('.choices label').forEach(function (l) { l.classList.remove('right','wrong'); });
          var lbl = picked.closest('label');
          if (picked.value === correct) { if (lbl) lbl.classList.add('right'); feedback(true); }
          else {
            if (lbl) lbl.classList.add('wrong');
            var correctInput = q.querySelector('input[value="' + correct + '"]');
            if (correctInput) { var cl = correctInput.closest('label'); if (cl) cl.classList.add('right'); }
            feedback(false);
          }
        } else if (kind === 'fib') {
          var input = q.querySelector('input[type=text]');
          var val = (input && input.value ? input.value : '').trim().toLowerCase();
          var accepts = (q.getAttribute('data-answer') || '').toLowerCase().split('|').map(function(s){return s.trim();});
          if (!val) { if (fb) { fb.textContent = 'Type your answer first.'; fb.className = 'fb no'; } return; }
          feedback(accepts.indexOf(val) >= 0);
        } else if (kind === 'scenario') {
          var picked2 = q.querySelector('input[type=radio]:checked');
          if (!picked2) { if (fb) { fb.textContent = 'Choose an answer first.'; fb.className = 'fb no'; } return; }
          var correct2 = q.getAttribute('data-answer');
          feedback(picked2.value === correct2);
          var outcome = q.querySelector('.outcome');
          if (outcome) outcome.hidden = false;
        }
      });
      if (revealBtn) revealBtn.addEventListener('click', function () {
        if (explain) explain.hidden = false;
        revealBtn.setAttribute('aria-expanded', 'true');
        revealBtn.disabled = true;
        revealBtn.textContent = 'Sample answer shown';
      });
    });
  }

  /* ---------------- matching pairs ---------------- */

  function wireMatching() {
    document.querySelectorAll('[data-match]').forEach(function (root) {
      var left = root.querySelectorAll('.col.left .item');
      var right = root.querySelectorAll('.col.right .item');
      var selL = null, selR = null;
      var matched = 0, total = left.length;
      var fb = root.parentElement.querySelector('.fb');
      var explain = root.parentElement.querySelector('.explain');
      function tryMatch() {
        if (!selL || !selR) return;
        if (selL.getAttribute('data-key') === selR.getAttribute('data-key')) {
          selL.classList.add('matched'); selR.classList.add('matched');
          selL.classList.remove('selected'); selR.classList.remove('selected');
          matched++;
          if (fb) { fb.textContent = 'Matched — ' + matched + ' of ' + total; fb.className = 'fb ok'; }
          if (matched === total) { if (explain) explain.hidden = false; }
        } else {
          selL.classList.remove('selected'); selR.classList.remove('selected');
          if (fb) { fb.textContent = 'Not quite — try again.'; fb.className = 'fb no'; }
        }
        selL = null; selR = null;
      }
      left.forEach(function (i) {
        i.addEventListener('click', function () {
          if (i.classList.contains('matched')) return;
          left.forEach(function (x) { x.classList.remove('selected'); });
          i.classList.add('selected'); selL = i; tryMatch();
        });
      });
      right.forEach(function (i) {
        i.addEventListener('click', function () {
          if (i.classList.contains('matched')) return;
          right.forEach(function (x) { x.classList.remove('selected'); });
          i.classList.add('selected'); selR = i; tryMatch();
        });
      });
      var reveal = root.parentElement.querySelector('[data-reveal]');
      if (reveal) reveal.addEventListener('click', function () { if (explain) explain.hidden = false; });
    });
  }

  /* ---------------- ordering (put in order) ---------------- */

  function wireOrdering() {
    document.querySelectorAll('[data-order]').forEach(function (list) {
      var fb = list.parentElement.querySelector('.fb');
      var explain = list.parentElement.querySelector('.explain');
      function renumber() {
        Array.prototype.forEach.call(list.children, function (li, i) {
          var n = li.querySelector('.n');
          if (n) n.textContent = String(i + 1);
        });
      }
      list.addEventListener('click', function (ev) {
        var t = ev.target;
        if (!t || !t.getAttribute) return;
        var dir = t.getAttribute('data-dir');
        if (!dir) return;
        var li = t.closest('.order-item');
        if (!li) return;
        if (dir === 'up' && li.previousElementSibling) list.insertBefore(li, li.previousElementSibling);
        if (dir === 'down' && li.nextElementSibling) list.insertBefore(li.nextElementSibling, li);
        renumber();
      });
      var check = list.parentElement.querySelector('[data-check]');
      if (check) check.addEventListener('click', function () {
        var ok = true;
        Array.prototype.forEach.call(list.children, function (li, i) {
          var target = parseInt(li.getAttribute('data-order-index'), 10);
          if (target === i + 1) { li.classList.add('correct'); li.classList.remove('incorrect'); }
          else { li.classList.add('incorrect'); li.classList.remove('correct'); ok = false; }
        });
        if (fb) { fb.textContent = ok ? 'All in the right order.' : 'Not yet in order — keep moving them.'; fb.className = 'fb ' + (ok ? 'ok' : 'no'); }
        if (ok && explain) explain.hidden = false;
      });
      var reveal = list.parentElement.querySelector('[data-reveal]');
      if (reveal) reveal.addEventListener('click', function () { if (explain) explain.hidden = false; });
      renumber();
    });
  }

  /* ---------------- flashcard deck ---------------- */

  function wireDeck() {
    var deck = document.querySelector('[data-deck]');
    if (!deck) return;
    var cards = Array.prototype.slice.call(deck.querySelectorAll('.flipcard'));
    if (!cards.length) return;
    var meta = deck.querySelector('.deck-meta');
    var pos = 0;
    function paint() {
      cards.forEach(function (c, i) { c.hidden = i !== pos; c.classList.remove('is-flipped'); });
      if (meta) meta.textContent = 'Card ' + (pos + 1) + ' of ' + cards.length;
    }
    var prev = deck.querySelector('[data-deck-prev]');
    var next = deck.querySelector('[data-deck-next]');
    var shuf = deck.querySelector('[data-deck-shuffle]');
    if (prev) prev.addEventListener('click', function () { pos = (pos - 1 + cards.length) % cards.length; paint(); });
    if (next) next.addEventListener('click', function () { pos = (pos + 1) % cards.length; paint(); });
    if (shuf) shuf.addEventListener('click', function () {
      for (var i = cards.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var a = cards[i], b = cards[j];
        deck.insertBefore(a, b);
        cards[i] = b; cards[j] = a;
      }
      pos = 0; paint();
    });
    paint();
  }

  /* ---------------- recall challenge (random-question pool) ---------------- */

  var RECALL_POOL = [
    { kind: 'MC', q: 'Which scripture is the main scripture of this teaching?', choices: ['Isaiah 60:1','Isaiah 28:18','1 Corinthians 6:17','Genesis 2:24'], answer: 1, why: 'Isaiah 28:18 — And your covenant with death shall be disannulled, and your agreement with hell shall not stand.' },
    { kind: 'T/F', q: 'All soul ties are ungodly. True or false?', choices: ['True','False'], answer: 1, why: 'False. Godly soul ties are real — husband and wife, parents and children, believers and Christ. Jonathan and David is a godly friendship bond.' },
    { kind: 'Fill-in-the-blank', q: 'A soul tie is a spiritual and emotional _____ that connects two people together.', answer: 'bond', why: 'Pastor Kiky defined it as a bond that joins two people at the level of mind, will, emotion and sometimes spirit.' },
    { kind: 'MC', q: 'What did Samson lose through Delilah?', choices: ['His prayer life','His strength, ability and destiny','His inheritance','His hair only'], answer: 1, why: 'Judges 16:19 — his strength went from him. Pastor Kiky said he lost his strength, his ability, and his destiny.' },
    { kind: 'MC', q: 'Which is the FIRST step to break an ungodly soul tie?', choices: ['Apply the blood','Renounce out loud','Repentance','Fill the void'], answer: 2, why: 'Step 1 is repentance for any involvement. Acts 3:19.' },
    { kind: 'T/F', q: 'Freedom is voice-activated. True or false?', choices: ['True','False'], answer: 0, why: 'True. Pastor Kiky repeated: your freedom is voice-activated — you must speak out.' },
    { kind: 'Fill-in-the-blank', q: 'Revelation 12:11 — And they overcame him by the blood of the Lamb, and by the word of their _____.', answer: 'testimony', why: 'The blood and the spoken word together overcome — testimony.' },
    { kind: 'MC', q: 'Which verse warns that a house left empty invites seven worse spirits?', choices: ['Matthew 12:45','Genesis 2:24','John 8:36','Acts 3:19'], answer: 0, why: 'Matthew 12:43-45. Pastor Kiky said: fill the void with the Holy Ghost and the Word of God.' },
    { kind: 'Scenario', q: 'You broke up with an ex last year but you still keep their shirt under your pillow because it makes you feel close to them. What does the teaching say to do?', choices: ['Keep it — it is only a shirt','Remove it and guard your heart','Wear it when you feel lonely','Give it back to them'], answer: 1, why: 'Step 5 — remove anything that keeps that connection alive, and guard your heart. It is an emotional and spiritual asset.' },
    { kind: 'MC', q: 'Who did Jonathan\u2019s soul knit with?', choices: ['Saul','Samuel','David','Solomon'], answer: 2, why: '1 Samuel 18:1 — the soul of Jonathan was knit with the soul of David.' },
    { kind: 'T/F', q: 'A person can pray and fast for freedom and still remain bound. True or false?', choices: ['True','False'], answer: 0, why: 'True. Not because God has not answered — but because an ungodly soul tie is still connecting them.' },
    { kind: 'MC', q: 'What is the strongest and most important soul tie a believer can have?', choices: ['Marriage','Friendship','Being joined to the Lord as one spirit','Family'], answer: 2, why: '1 Corinthians 6:17 — He that is joined unto the Lord is one spirit.' },
    { kind: 'Fill-in-the-blank', q: 'John 8:36 — If the Son therefore shall make you free, ye shall be free _____.', answer: 'indeed', why: 'Freedom through the Son is real freedom, not partial freedom.' },
    { kind: 'MC', q: 'Which is NOT one of the nine signs Pastor Kiky named?', choices: ['Cannot stop thinking about the person','Repeated dreams of them','Fear without a clear reason','Immediate financial breakthrough'], answer: 3, why: 'The nine signs are torment and drain, not sudden prosperity.' },
    { kind: 'MC', q: 'Which of the following is one of the five ways an ungodly soul tie forms?', choices: ['Fear of being alone','Toxic and abusive relationships','Fasting','Tithing'], answer: 1, why: 'The five: sexual sin outside God\u2019s will, toxic and abusive relationships, past relationships never released, trauma, and covenants and spiritual agreements.' },
    { kind: 'Scenario', q: 'A friend keeps returning to a partner who beats them. What did Pastor Kiky say the deeper reason is?', choices: ['They enjoy the drama','A soul tie has made them emotionally dependent','They cannot find anyone else','They lack money to leave'], answer: 1, why: 'The bond will not be talked out of them — it must be broken by prayer, by the blood of Jesus, and by the power of the Holy Ghost.' },
    { kind: 'MC', q: 'What does Isaiah 28:18 declare over an ungodly covenant?', choices: ['That it will multiply','That it shall be disannulled','That it must be tolerated','That it will bless'], answer: 1, why: 'Your covenant with death shall be disannulled, and your agreement with hell shall not stand.' },
    { kind: 'Fill-in-the-blank', q: 'Step 6 — Fill the void with the _____ _____.', answer: 'holy ghost', why: 'When God takes something, He replaces it. Fill the void with the Holy Ghost and the Word of God.' },
    { kind: 'MC', q: 'Which name did Pastor Kiky give God at the anointing with oil?', choices: ['The God of my ex','The Father of open doors','The God of second chances','The Silent Watcher'], answer: 1, why: 'Revelation 3:8 — I have set before thee an open door, and no man can shut it.' },
    { kind: 'T/F', q: 'The blood of Jesus disconnects the believer from every ungodly covenant. True or false?', choices: ['True','False'], answer: 0, why: 'Because the blood speaks of a new covenant. Revelation 12:11.' }
  ];

  function wireRecallChallenge() {
    var host = document.querySelector('[data-recall-host]');
    if (!host) return;
    var promptEl = host.querySelector('.rc-prompt');
    var meta = host.querySelector('.rc-meta');
    var kindEl = host.querySelector('.rc-kind');
    var hidden = host.querySelector('.rc-hidden');
    var revealBtn = host.querySelector('[data-recall-reveal]');
    var nextBtn = host.querySelector('[data-recall-next]');
    var rightBtn = host.querySelector('[data-recall-right]');
    var wrongBtn = host.querySelector('[data-recall-wrong]');
    var scoreOut = host.querySelector('[data-recall-score]');
    var right = 0, seen = 0, current = null, last = -1;
    function pick() {
      var idx = last;
      while (idx === last && RECALL_POOL.length > 1) idx = Math.floor(Math.random() * RECALL_POOL.length);
      last = idx;
      current = RECALL_POOL[idx];
      var choicesLine = '';
      if (current.choices) choicesLine = current.choices.map(function (c, i) { return String.fromCharCode(65 + i) + '. ' + c; }).join(' · ');
      promptEl.textContent = current.q + (choicesLine ? '  ( ' + choicesLine + ' )' : '');
      if (kindEl) kindEl.textContent = current.kind;
      var answerText = '';
      if (typeof current.answer === 'number') answerText = String.fromCharCode(65 + current.answer) + '. ' + current.choices[current.answer];
      else answerText = current.answer;
      hidden.innerHTML = '<strong>Answer:</strong> ' + escapeHtml(answerText) + '<br><em>' + escapeHtml(current.why) + '</em>';
      hidden.hidden = true;
      if (revealBtn) { revealBtn.disabled = false; revealBtn.textContent = 'Reveal the answer'; }
      if (rightBtn) rightBtn.disabled = true;
      if (wrongBtn) wrongBtn.disabled = true;
      if (meta) meta.textContent = 'Question ' + (seen + 1);
    }
    if (revealBtn) revealBtn.addEventListener('click', function () {
      hidden.hidden = false; revealBtn.disabled = true;
      if (rightBtn) rightBtn.disabled = false;
      if (wrongBtn) wrongBtn.disabled = false;
    });
    function score(ok) {
      seen++;
      if (ok) right++;
      if (scoreOut) scoreOut.textContent = 'Score this session: ' + right + ' of ' + seen;
      pick();
    }
    if (rightBtn) rightBtn.addEventListener('click', function () { score(true); });
    if (wrongBtn) wrongBtn.addEventListener('click', function () { score(false); });
    if (nextBtn) nextBtn.addEventListener('click', function () { seen++; if (scoreOut) scoreOut.textContent = 'Score this session: ' + right + ' of ' + seen; pick(); });
    pick();
  }

  /* ---------------- final quiz (review page) ---------------- */

  var K_QUIZ = NS + 'final-quiz-score';

  function wireFinalQuiz() {
    var quiz = document.querySelector('[data-final-quiz]');
    if (!quiz) return;
    var out = quiz.querySelector('[data-final-score]');
    var btn = quiz.querySelector('[data-final-check]');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var cards = quiz.querySelectorAll('[data-qcard]');
      var total = cards.length, correct = 0, unanswered = 0;
      cards.forEach(function (q) {
        var kind = q.getAttribute('data-qcard');
        var explain = q.querySelector('.explain');
        var fb = q.querySelector('.fb');
        var wanted = q.getAttribute('data-answer');
        var right = false, answered = false;
        if (kind === 'mc' || kind === 'tf') {
          var picked = q.querySelector('input[type=radio]:checked');
          if (picked) { answered = true; right = picked.value === wanted; }
        } else if (kind === 'fib') {
          var input = q.querySelector('input[type=text]');
          var v = (input && input.value ? input.value : '').trim().toLowerCase();
          if (v) { answered = true; right = (wanted || '').toLowerCase().split('|').map(function(s){return s.trim();}).indexOf(v) >= 0; }
        }
        if (!answered) { unanswered++; if (fb) { fb.textContent = 'Not answered.'; fb.className = 'fb no'; } }
        else {
          if (right) correct++;
          if (fb) { fb.textContent = right ? 'Correct.' : 'Not quite.'; fb.className = 'fb ' + (right ? 'ok' : 'no'); }
        }
        if (explain) explain.hidden = false;
      });
      var pct = total ? Math.round((correct / total) * 100) : 0;
      write(K_QUIZ, { correct: correct, total: total, pct: pct, when: Date.now() });
      if (out) out.innerHTML = '<strong>' + correct + ' of ' + total + '</strong> correct — ' + pct + '%' + (unanswered ? '. ' + unanswered + ' unanswered.' : '.') + (pct >= 80 ? ' <span style="color:var(--green);font-weight:700">You passed the review.</span>' : ' <span style="color:var(--ember-deep);font-weight:700">80% is needed to pass.</span>');
      renderBadge();
    });
    var reset = quiz.querySelector('[data-final-reset]');
    if (reset) reset.addEventListener('click', function () {
      quiz.querySelectorAll('input[type=radio],input[type=text]').forEach(function (i) { if (i.type === 'text') i.value = ''; else i.checked = false; });
      quiz.querySelectorAll('.fb').forEach(function (f) { f.textContent = ''; });
      quiz.querySelectorAll('.explain').forEach(function (e) { e.hidden = true; });
      write(K_QUIZ, null);
      if (out) out.textContent = '';
      renderBadge();
    });
    var s = read(K_QUIZ, null);
    if (s && out) out.innerHTML = 'Last attempt: <strong>' + s.correct + ' of ' + s.total + '</strong> — ' + s.pct + '%.';
  }

  function passedFinal() {
    var s = read(K_QUIZ, null);
    return s && typeof s.pct === 'number' && s.pct >= 80;
  }

  function renderBadge() {
    var b = document.querySelector('[data-badge]');
    if (!b) return;
    var locked = b.querySelector('[data-badge-locked]');
    var open = b.querySelector('[data-badge-open]');
    var ok = allDone() && passedFinal();
    if (ok) {
      b.classList.remove('locked');
      if (locked) locked.hidden = true;
      if (open) open.hidden = false;
    } else {
      b.classList.add('locked');
      if (locked) locked.hidden = false;
      if (open) open.hidden = true;
      var reasons = [];
      if (!allDone()) reasons.push('Finish every module and both assignments.');
      if (!passedFinal()) reasons.push('Score at least 80% on the Final Quiz.');
      var r = b.querySelector('[data-badge-reasons]');
      if (r) r.innerHTML = '<ul>' + reasons.map(function (x) { return '<li>' + escapeHtml(x) + '</li>'; }).join('') + '</ul>';
    }
  }

  /* ---------------- reflection saves ---------------- */

  function wireReflections() {
    document.querySelectorAll('textarea[data-reflect]').forEach(function (area) {
      var key = NS + 'reflect:' + area.getAttribute('data-reflect');
      area.value = read(key, '') || '';
      var flag = document.querySelector('[data-reflect-flag="' + area.getAttribute('data-reflect') + '"]');
      var timer = null;
      area.addEventListener('input', function () {
        window.clearTimeout(timer);
        timer = window.setTimeout(function () {
          write(key, area.value);
          if (flag) { flag.textContent = 'Saved to this device'; window.setTimeout(function () { flag.textContent = ''; }, 2200); }
        }, 400);
      });
    });
  }

  function boot() {
    wireProgress();
    wireNotes();
    wireBookmarks();
    wireSearch();
    wireCertificate();
    wireQuiz();
    wireLevels();
    wireFlipCards();
    wireQuestionCards();
    wireMatching();
    wireOrdering();
    wireDeck();
    wireRecallChallenge();
    wireFinalQuiz();
    wireReflections();
    render();
    renderBadge();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
