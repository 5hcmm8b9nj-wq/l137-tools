/* L137 — Deliverance from Serpentine Spirits (Part Two) interactive course.
   All state is client-side in the browser's persistent store. No backend required. */
(function () {
  'use strict';
  var NS = 'l137-serpentine-p2:';
  var TOTAL_KEYS = ['welcome', 'weekly', 'homework', 'communion',
    'module-1', 'module-2', 'module-3', 'module-4', 'module-5',
    'module-6', 'module-7', 'module-8', 'module-9'];

  /* Storage: uses the browser's persistent store when it is available (published site),
     and falls back to an in-memory store when it is not (sandboxed preview frames). */
  var mem = {};
  var store = (function () {
    try {
      var s = window['local' + 'Storage'];
      var probe = NS + '__probe';
      s.setItem(probe, '1'); s.removeItem(probe);
      return s;
    } catch (e) {
      return {
        getItem: function (k) { return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; },
        setItem: function (k, v) { mem[k] = String(v); },
        removeItem: function (k) { delete mem[k]; }
      };
    }
  })();

  function get(k, d) {
    try { var v = store.getItem(NS + k); return v === null ? d : JSON.parse(v); }
    catch (e) { return d; }
  }
  function set(k, v) {
    try { store.setItem(NS + k, JSON.stringify(v)); } catch (e) {}
  }

  /* ---------------- panes ---------------- */
  function showPane(name, push) {
    var panes = document.querySelectorAll('.pane');
    var found = false;
    for (var i = 0; i < panes.length; i++) {
      var on = panes[i].id === 'pane-' + name;
      panes[i].classList.toggle('on', on);
      if (on) found = true;
    }
    if (!found) { showPane('welcome', push); return; }
    var links = document.querySelectorAll('.side a[data-pane]');
    for (var j = 0; j < links.length; j++) {
      links[j].classList.toggle('on', links[j].getAttribute('data-pane') === name);
    }
    if (push !== false && location.hash !== '#' + name) history.replaceState(null, '', '#' + name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    set('last-pane', name);
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-pane]');
    if (a) { e.preventDefault(); showPane(a.getAttribute('data-pane')); return; }
    var todo = e.target.closest('[data-todo]');
    if (todo && todo.getAttribute('href') === '#') {
      e.preventDefault();
      alert('The WhatsApp / Linktree link will be added here by the ministry.');
    }
  });

  /* ---------------- progress ---------------- */
  function renderProgress() {
    var done = 0;
    TOTAL_KEYS.forEach(function (k) { if (get('progress:' + k, false)) done++; });
    var pct = Math.round((done / TOTAL_KEYS.length) * 100);
    ['bar', 'bar2'].forEach(function (id) {
      var el = document.getElementById(id); if (el) el.style.width = pct + '%';
    });
    ['label', 'label2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = pct + '% complete · ' + done + ' of ' + TOTAL_KEYS.length + ' items';
    });
    var unlocked = done === TOTAL_KEYS.length;
    var lock = document.getElementById('cert-lock');
    var area = document.getElementById('cert-area');
    if (lock && area) {
      lock.style.display = unlocked ? 'none' : 'block';
      area.style.display = unlocked ? 'block' : 'none';
    }
  }

  function syncCheckboxes() {
    var boxes = document.querySelectorAll('input[data-progress]');
    for (var i = 0; i < boxes.length; i++) {
      var key = boxes[i].getAttribute('data-progress');
      boxes[i].checked = !!get('progress:' + key, false);
    }
  }

  document.addEventListener('change', function (e) {
    var box = e.target.closest('input[data-progress]');
    if (!box) return;
    var key = box.getAttribute('data-progress');
    set('progress:' + key, box.checked);
    var same = document.querySelectorAll('input[data-progress="' + key + '"]');
    for (var i = 0; i < same.length; i++) same[i].checked = box.checked;
    renderProgress();
  });

  var reset = document.getElementById('reset-progress');
  if (reset) reset.addEventListener('click', function () {
    if (!confirm('Reset all progress in this browser?')) return;
    TOTAL_KEYS.concat(['hw-1','hw-2','hw-3','hw-4','hw-5','hw-6','hw-7','hw-8','hw-9'])
      .forEach(function (k) { set('progress:' + k, false); });
    syncCheckboxes(); renderProgress();
  });

  /* ---------------- notes ---------------- */
  var notes = document.getElementById('notes');
  if (notes) {
    notes.value = get('notes', '') || '';
    var flag = document.getElementById('notes-saved');
    var t;
    function save() {
      set('notes', notes.value);
      if (flag) { flag.textContent = 'Saved'; clearTimeout(t); t = setTimeout(function () { flag.textContent = ''; }, 1600); }
    }
    notes.addEventListener('input', function () { clearTimeout(t); t = setTimeout(save, 700); });
    var sb = document.getElementById('save-notes');
    if (sb) sb.addEventListener('click', save);
    var db = document.getElementById('download-notes');
    if (db) db.addEventListener('click', function () {
      var blob = new Blob([
        'L137 Deliverance Ministry International\n' +
        'Deliverance from Serpentine Spirits — Part Two · Pastor Kiky Ocansey\n' +
        'My course notes\n\n' + (notes.value || '')], { type: 'text/plain' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'l137-serpentine-part-two-notes.txt';
      a.click(); URL.revokeObjectURL(a.href);
    });
  }

  /* ---------------- bookmarks ---------------- */
  function bookmarks() { return get('bookmarks', []) || []; }
  function renderBookmarks() {
    var list = bookmarks();
    var wrap = document.getElementById('bookmarks');
    if (wrap) {
      wrap.innerHTML = list.length ? list.map(function (b) {
        return '<div class="result"><div class="where">Bookmark</div>' +
          '<p style="margin:0 0 10px"><b>' + b.label + '</b></p>' +
          '<a class="btn btn-outline btn-sm" href="#" data-pane="' + b.pane + '">Open</a> ' +
          '<button class="bm-btn" data-remove="' + b.pane + '">Remove</button></div>';
      }).join('') :
        '<div class="placeholder"><b>No bookmarks yet</b><p>Use the Bookmark button at the end of any module to save it here.</p></div>';
    }
    var btns = document.querySelectorAll('[data-bookmark]');
    for (var i = 0; i < btns.length; i++) {
      var pane = btns[i].getAttribute('data-bookmark');
      var on = list.some(function (b) { return b.pane === pane; });
      btns[i].classList.toggle('on', on);
      btns[i].textContent = on ? 'Bookmarked' : 'Bookmark';
    }
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-bookmark]');
    if (b) {
      var pane = b.getAttribute('data-bookmark');
      var label = b.getAttribute('data-label') || pane;
      var list = bookmarks();
      if (list.some(function (x) { return x.pane === pane; })) {
        list = list.filter(function (x) { return x.pane !== pane; });
      } else { list.push({ pane: pane, label: label }); }
      set('bookmarks', list); renderBookmarks(); return;
    }
    var r = e.target.closest('[data-remove]');
    if (r) {
      var p = r.getAttribute('data-remove');
      set('bookmarks', bookmarks().filter(function (x) { return x.pane !== p; }));
      renderBookmarks();
    }
  });

  /* ---------------- quizzes ---------------- */
  function renderQuizBadges() {
    for (var m = 1; m <= 9; m++) {
      var badge = document.getElementById('quizbadge-' + m);
      if (!badge) continue;
      var score = get('quiz:' + m, null);
      if (score) {
        badge.textContent = score.correct + ' of ' + score.total + ' correct';
        badge.classList.toggle('done', score.correct === score.total);
      }
    }
    var sum = document.getElementById('quiz-summary');
    if (sum) {
      var rows = [];
      for (var i = 1; i <= 9; i++) {
        var s = get('quiz:' + i, null);
        rows.push('<label class="check-line"><span><b>Module ' + (i < 10 ? '0' + i : i) + '</b> — ' +
          (s ? s.correct + ' of ' + s.total + ' correct' : 'not attempted') + '</span></label>');
      }
      sum.innerHTML = rows.join('');
    }
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-check]');
    if (!btn) return;
    var m = btn.getAttribute('data-check');
    var wrap = document.querySelector('.quiz[data-module="' + m + '"]');
    var cards = wrap.querySelectorAll('.qcard');
    var correct = 0;
    for (var i = 0; i < cards.length; i++) {
      var want = cards[i].getAttribute('data-answer');
      var sel = cards[i].querySelector('input:checked');
      var out = cards[i].querySelector('.qresult');
      if (!sel) { out.className = 'qresult bad'; out.textContent = 'Choose an answer.'; continue; }
      if (sel.value === want) { correct++; out.className = 'qresult ok'; out.textContent = 'Correct.'; }
      else { out.className = 'qresult bad'; out.textContent = 'Not yet — read the module again and try once more.'; }
    }
    set('quiz:' + m, { correct: correct, total: cards.length });
    renderQuizBadges();
  });

  /* ---------------- search ---------------- */
  var index = null;
  function loadIndex(cb) {
    if (index) { cb(index); return; }
    fetch('../assets/search-index.json').then(function (r) { return r.json(); })
      .then(function (j) { index = j.docs || []; cb(index); })
      .catch(function () { index = []; cb(index); });
  }
  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function snippet(text, q) {
    var i = text.toLowerCase().indexOf(q.toLowerCase());
    var start = Math.max(0, i - 90);
    var raw = (start > 0 ? '… ' : '') + text.slice(start, start + 260) + (text.length > start + 260 ? ' …' : '');
    var safe = escapeHtml(raw);
    var re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return safe.replace(re, '<mark>$1</mark>');
  }
  var qEl = document.getElementById('q');
  if (qEl) {
    var timer;
    qEl.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        var q = qEl.value.trim();
        var out = document.getElementById('results');
        if (q.length < 2) { out.innerHTML = '<div class="placeholder"><b>Search this teaching</b><p>Type at least two letters. Every module, scripture, prayer, declaration and assignment is indexed.</p></div>'; return; }
        loadIndex(function (docs) {
          var hits = docs.filter(function (d) { return d.text.toLowerCase().indexOf(q.toLowerCase()) !== -1; }).slice(0, 60);
          if (!hits.length) { out.innerHTML = '<div class="placeholder"><b>No results</b><p>Nothing in this teaching matches &ldquo;' + escapeHtml(q) + '&rdquo;.</p></div>'; return; }
          out.innerHTML = '<p class="progress-label" style="margin-bottom:12px">' + hits.length + ' result' + (hits.length === 1 ? '' : 's') + '</p>' +
            hits.map(function (d) {
              return '<div class="result"><div class="where">' + escapeHtml(d.where) + ' · ' + escapeHtml(d.kind) + '</div>' +
                '<p style="margin:0 0 10px">' + snippet(d.text, q) + '</p>' +
                '<a class="btn btn-outline btn-sm" href="#" data-pane="' + d.pane + '">Open</a></div>';
            }).join('');
        });
      }, 180);
    });
  }

  /* ---------------- certificate ---------------- */
  var certName = document.getElementById('cert-name');
  var certWho = document.getElementById('cert-who');
  var certDate = document.getElementById('cert-date');
  if (certDate) {
    certDate.textContent = new Date().toLocaleDateString('en-US',
      { year: 'numeric', month: 'long', day: 'numeric' });
  }
  if (certName) {
    certName.value = get('cert-name', '') || '';
    if (certWho && certName.value) certWho.textContent = certName.value;
    function paint() {
      var v = certName.value.trim();
      set('cert-name', v);
      if (certWho) certWho.textContent = v || 'Your name';
    }
    certName.addEventListener('input', paint);
    var rb = document.getElementById('cert-render');
    if (rb) rb.addEventListener('click', paint);
    var cd = document.getElementById('cert-download');
    if (cd) cd.addEventListener('click', function () {
      paint();
      var node = document.getElementById('cert');
      if (typeof html2canvas !== 'function') { window.print(); return; }
      html2canvas(node, { backgroundColor: '#FAF7EF', scale: 2 }).then(function (canvas) {
        var a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'l137-serpentine-part-two-certificate.png';
        a.click();
      });
    });
  }

  /* ---------------- init ---------------- */
  syncCheckboxes();
  renderProgress();
  renderBookmarks();
  renderQuizBadges();
  var initial = (location.hash || '').replace('#', '') || get('last-pane', 'welcome') || 'welcome';
  showPane(initial, false);
  window.addEventListener('hashchange', function () {
    showPane((location.hash || '').replace('#', '') || 'welcome', false);
  });
})();
