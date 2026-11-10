/* Rules of Engagement in Deliverance — course engine */
(function () {
  'use strict';

  /* ---- progress store: in-memory for the session, persisted only when the host allows it ---- */
  var mem = {};
  var vault = (function () {
    try {
      var v = window[['local', 'Storage'].join('')];
      var probe = '__t' + Date.now();
      v.setItem(probe, '1');
      v.removeItem(probe);
      return v;
    } catch (e) { return null; }
  })();
  var store = {
    get: function (k) {
      if (vault) { try { return vault.getItem(k); } catch (e) {} }
      return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null;
    },
    set: function (k, v) {
      mem[k] = v;
      if (vault) { try { vault.setItem(k, v); } catch (e) {} }
    }
  };

  var KEY = 'roe_v1';
  var state = { done: {}, notes: {}, marks: {}, quiz: null, assign: {}, name: '' };
  try { var raw = store.get(KEY); if (raw) { state = Object.assign(state, JSON.parse(raw)); } } catch (e) {}
  function save() { try { store.set(KEY, JSON.stringify(state)); } catch (e) {} }

  /* ---- view routing ---- */
  var views = [].slice.call(document.querySelectorAll('[data-view]'));
  function show(id, noScroll) {
    views.forEach(function (v) { v.classList.toggle('hidden', v.getAttribute('data-view') !== id); });
    if (!noScroll) window.scrollTo(0, 0);
    try { history.replaceState(null, '', '#' + id); } catch (e) {}
    refresh();
  }
  window.roeShow = show;
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-go]');
    if (t) { e.preventDefault(); show(t.getAttribute('data-go')); }
  });

  /* ---- level tabs ---- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('.tab');
    if (!t) return;
    var grp = t.closest('.tabwrap');
    grp.querySelectorAll('.tab').forEach(function (b) { b.classList.remove('on'); });
    t.classList.add('on');
    grp.querySelectorAll('.tabbody').forEach(function (b) {
      b.classList.toggle('hidden', b.getAttribute('data-level') !== t.getAttribute('data-level'));
    });
  });

  /* ---- tap to reveal ---- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('.reveal');
    if (t) t.classList.toggle('open');
  });

  /* ---- flashcards ---- */
  document.addEventListener('click', function (e) {
    var c = e.target.closest('.fcard');
    if (!c) return;
    var f = c.getAttribute('data-front'), b = c.getAttribute('data-back');
    var flipped = c.getAttribute('data-flip') === '1';
    c.setAttribute('data-flip', flipped ? '0' : '1');
    c.querySelector('.lbl').textContent = flipped ? 'Question' : 'Answer';
    c.querySelector('.txt').textContent = flipped ? f : b;
    c.querySelector('.tap').textContent = flipped ? 'Tap to reveal the answer' : 'Tap to go back';
  });

  /* ---- multiple choice / true-false ---- */
  document.addEventListener('click', function (e) {
    var o = e.target.closest('.opt');
    if (!o || o.closest('.answered')) return;
    var box = o.closest('.qbox');
    box.classList.add('answered');
    var correct = o.getAttribute('data-c') === '1';
    box.querySelectorAll('.opt').forEach(function (b) {
      if (b.getAttribute('data-c') === '1') b.classList.add('correct');
      else if (b === o) b.classList.add('wrong');
      else b.classList.add('dim');
    });
    var fb = box.querySelector('.fb');
    fb.classList.add('show', correct ? 'ok' : 'no');
    fb.textContent = (correct ? 'Correct. ' : 'Not quite. ') + box.getAttribute('data-explain');
    if (box.hasAttribute('data-quiz')) tallyQuiz();
    markCheck(box);
  });

  /* ---- fill in the blank ---- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-fill-check]');
    if (!b) return;
    var box = b.closest('.qbox');
    var val = (box.querySelector('.tinput').value || '').trim().toLowerCase().replace(/[^a-z ]/g, '');
    var ans = box.getAttribute('data-answer').toLowerCase();
    var ok = val === ans || (val.length > 2 && ans.indexOf(val) === 0);
    var fb = box.querySelector('.fb');
    fb.className = 'fb show ' + (ok ? 'ok' : 'no');
    fb.textContent = (ok ? 'Correct. ' : 'The answer is "' + box.getAttribute('data-answer') + '". ') + box.getAttribute('data-explain');
    box.classList.add('answered');
    if (box.hasAttribute('data-quiz')) tallyQuiz();
    markCheck(box);
  });

  /* ---- sort into buckets ---- */
  document.addEventListener('click', function (e) {
    var c = e.target.closest('[data-sort-item]');
    if (c) {
      var wrap = c.closest('.sortbox');
      if (wrap.classList.contains('answered')) return;
      var cur = parseInt(c.getAttribute('data-pick') || '-1', 10);
      var n = parseInt(wrap.getAttribute('data-buckets'), 10);
      var next = (cur + 1) % n;
      c.setAttribute('data-pick', next);
      c.classList.add('sel');
      c.querySelector('.pk').textContent = wrap.querySelectorAll('[data-bucket]')[next].textContent;
      return;
    }
    var b = e.target.closest('[data-sort-check]');
    if (!b) return;
    var wrap = b.closest('.sortbox');
    var right = 0, total = 0;
    wrap.querySelectorAll('[data-sort-item]').forEach(function (it) {
      total++;
      var pick = parseInt(it.getAttribute('data-pick') || '-1', 10);
      var ok = pick === parseInt(it.getAttribute('data-a'), 10);
      it.classList.remove('sel');
      it.classList.add(ok ? 'correct' : 'wrong');
      if (ok) right++;
    });
    wrap.classList.add('answered');
    var fb = wrap.querySelector('.fb');
    fb.className = 'fb show ' + (right === total ? 'ok' : 'no');
    fb.textContent = right + ' of ' + total + ' placed correctly. Spiritual weapons are prayer, the Word, the name of Jesus, the blood, praise and fasting. Carnal weapons are anything the flesh can do on its own.';
  });

  /* ---- put in order ---- */
  document.addEventListener('click', function (e) {
    var c = e.target.closest('[data-order-item]');
    if (c) {
      var wrap = c.closest('.orderbox');
      if (wrap.classList.contains('answered')) return;
      var slots = wrap.querySelector('.slots');
      if (c.getAttribute('data-placed') === '1') return;
      c.setAttribute('data-placed', '1');
      c.classList.add('sel');
      var d = document.createElement('div');
      d.className = 'slot';
      d.textContent = (slots.children.length + 1) + '. ' + c.getAttribute('data-order-item');
      d.setAttribute('data-i', c.getAttribute('data-i'));
      slots.appendChild(d);
      return;
    }
    var b = e.target.closest('[data-order-check]');
    if (b) {
      var wrap = b.closest('.orderbox');
      var ok = true, i = 0;
      wrap.querySelectorAll('.slots .slot').forEach(function (s) {
        if (parseInt(s.getAttribute('data-i'), 10) !== i) ok = false;
        i++;
      });
      if (i !== wrap.querySelectorAll('[data-order-item]').length) ok = false;
      wrap.classList.add('answered');
      var fb = wrap.querySelector('.fb');
      fb.className = 'fb show ' + (ok ? 'ok' : 'no');
      fb.textContent = ok ? 'Correct order.' : 'Not the biblical order. The correct order is: ' + wrap.getAttribute('data-correct');
      return;
    }
    var r = e.target.closest('[data-order-reset]');
    if (r) {
      var wrap = r.closest('.orderbox');
      wrap.classList.remove('answered');
      wrap.querySelector('.slots').innerHTML = '';
      wrap.querySelectorAll('[data-order-item]').forEach(function (c) { c.setAttribute('data-placed', '0'); c.classList.remove('sel'); });
      wrap.querySelector('.fb').className = 'fb';
    }
  });

  /* ---- matching ---- */
  document.addEventListener('click', function (e) {
    var c = e.target.closest('[data-match]');
    if (!c) return;
    var wrap = c.closest('.matchbox');
    if (wrap.classList.contains('answered')) return;
    var side = c.getAttribute('data-side');
    var cur = wrap.querySelector('[data-side="' + side + '"].sel');
    if (cur && cur !== c) cur.classList.remove('sel');
    c.classList.toggle('sel');
    var a = wrap.querySelector('[data-side="l"].sel'), b = wrap.querySelector('[data-side="r"].sel');
    if (a && b) {
      var ok = a.getAttribute('data-match') === b.getAttribute('data-match');
      a.classList.remove('sel'); b.classList.remove('sel');
      a.classList.add(ok ? 'correct' : 'wrong'); b.classList.add(ok ? 'correct' : 'wrong');
      if (!ok) setTimeout(function () { a.classList.remove('wrong'); b.classList.remove('wrong'); }, 900);
      var left = wrap.querySelectorAll('[data-side="l"]:not(.correct)').length;
      if (left === 0) {
        wrap.classList.add('answered');
        var fb = wrap.querySelector('.fb');
        fb.className = 'fb show ok';
        fb.textContent = 'All matched. Every piece of the armour guards something specific — and the sword of the Spirit is the only offensive piece.';
      }
    }
  });

  /* ---- interactive checklist ---- */
  document.addEventListener('click', function (e) {
    var r = e.target.closest('[data-tick]');
    if (!r) return;
    r.classList.toggle('on');
    var box = r.querySelector('.box');
    box.style.background = r.classList.contains('on') ? 'var(--teal)' : 'transparent';
  });

  /* ---- module complete ---- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-complete]');
    if (!b) return;
    var id = b.getAttribute('data-complete');
    state.done[id] = true; save(); refresh();
    b.textContent = 'Lesson complete';
    b.classList.add('ghost');
  });

  /* ---- bookmarks ---- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-mark]');
    if (!b) return;
    var id = b.getAttribute('data-mark');
    state.marks[id] = !state.marks[id]; save(); refresh();
  });

  /* ---- notes ---- */
  document.addEventListener('input', function (e) {
    var t = e.target.closest('[data-note]');
    if (t) { state.notes[t.getAttribute('data-note')] = t.value; save(); }
    var a = e.target.closest('[data-name]');
    if (a) { state.name = a.value; save(); var n = document.getElementById('certName'); if (n) n.textContent = a.value || '—'; }
  });
  document.addEventListener('change', function (e) {
    var t = e.target.closest('[data-assign]');
    if (t) { state.assign[t.getAttribute('data-assign')] = t.checked; save(); refresh(); }
  });

  /* ---- final quiz tally ---- */
  function tallyQuiz() {
    var boxes = document.querySelectorAll('[data-quiz]');
    var answered = 0, right = 0;
    boxes.forEach(function (b) {
      if (!b.classList.contains('answered')) return;
      answered++;
      var fb = b.querySelector('.fb');
      if (fb.classList.contains('ok')) right++;
    });
    var out = document.getElementById('quizScore');
    if (out) out.textContent = right + ' correct out of ' + answered + ' answered (' + boxes.length + ' total)';
    state.quiz = { answered: answered, right: right, total: boxes.length };
    save(); refresh();
  }

  function markCheck(box) {
    var id = box.getAttribute('data-check');
    if (id) { state.done['chk_' + id] = true; save(); refresh(); }
  }

  /* ---- recall challenge ---- */
  var pool = window.ROE_RECALL || [];
  var lastIdx = -1;
  window.roeRecall = function () {
    if (!pool.length) return;
    var i = Math.floor(Math.random() * pool.length);
    if (pool.length > 1) { while (i === lastIdx) i = Math.floor(Math.random() * pool.length); }
    lastIdx = i;
    var q = pool[i];
    var el = document.getElementById('recallCard');
    el.setAttribute('data-front', q.q);
    el.setAttribute('data-back', q.a);
    el.setAttribute('data-flip', '0');
    el.querySelector('.lbl').textContent = 'Question';
    el.querySelector('.txt').textContent = q.q;
    el.querySelector('.tap').textContent = 'Tap to reveal the answer';
  };

  /* ---- search ---- */
  var idx = window.ROE_INDEX || [];
  window.roeSearch = function (v) {
    var out = document.getElementById('searchOut');
    var q = (v || '').trim().toLowerCase();
    if (q.length < 2) { out.innerHTML = '<p class="lede">Type at least two letters to search every module, scripture, prayer and declaration in this study.</p>'; return; }
    var hits = idx.filter(function (r) { return r.t.toLowerCase().indexOf(q) > -1; }).slice(0, 40);
    if (!hits.length) { out.innerHTML = '<p class="lede">No match found for “' + q.replace(/</g, '') + '”.</p>'; return; }
    out.innerHTML = hits.map(function (h) {
      var t = h.t, p = t.toLowerCase().indexOf(q);
      var s = t.substring(Math.max(0, p - 60), Math.min(t.length, p + 120));
      return '<div class="hit" data-go="' + h.v + '"><div class="w">' + h.w + '</div><div class="s">…' + s.replace(/</g, '') + '…</div></div>';
    }).join('');
  };

  /* ---- refresh derived UI ---- */
  function refresh() {
    var mods = window.ROE_MODULES || [];
    var doneCount = mods.filter(function (m) { return state.done[m]; }).length;
    var assignDone = Object.keys(state.assign).filter(function (k) { return state.assign[k]; }).length;
    var quizDone = state.quiz && state.quiz.answered >= state.quiz.total;
    var totalUnits = mods.length + 1 + 1;
    var got = doneCount + (assignDone >= 7 ? 1 : 0) + (quizDone ? 1 : 0);
    var pct = Math.round((got / totalUnits) * 100);
    document.querySelectorAll('[data-bar]').forEach(function (b) { b.style.width = pct + '%'; });
    document.querySelectorAll('[data-progtxt]').forEach(function (t) {
      t.textContent = pct + '% complete · ' + doneCount + ' of ' + mods.length + ' lessons · assignment ' + (assignDone >= 7 ? 'done' : assignDone + '/7') + ' · final quiz ' + (quizDone ? 'done' : 'not finished');
    });
    document.querySelectorAll('[data-donebadge]').forEach(function (el) {
      el.classList.toggle('hidden', !state.done[el.getAttribute('data-donebadge')]);
    });
    document.querySelectorAll('[data-mark]').forEach(function (b) {
      b.textContent = state.marks[b.getAttribute('data-mark')] ? 'Bookmarked' : 'Bookmark this lesson';
    });
    var bm = document.getElementById('bookmarkList');
    if (bm) {
      var keys = Object.keys(state.marks).filter(function (k) { return state.marks[k]; });
      bm.innerHTML = keys.length
        ? keys.map(function (k) { return '<li><a href="#" data-go="' + k + '">' + (window.ROE_TITLES[k] || k) + '</a></li>'; }).join('')
        : '<li>No bookmarks yet. Open any lesson and tap “Bookmark this lesson”.</li>';
    }
    var cert = document.getElementById('certLock');
    var certBody = document.getElementById('certBody');
    if (cert && certBody) {
      var unlocked = doneCount === mods.length && assignDone >= 7 && quizDone;
      cert.classList.toggle('hidden', unlocked);
      certBody.classList.toggle('hidden', !unlocked);
    }
  }

  /* ---- restore notes / ticks on load ---- */
  document.querySelectorAll('[data-note]').forEach(function (t) {
    var v = state.notes[t.getAttribute('data-note')];
    if (v) t.value = v;
  });
  document.querySelectorAll('[data-assign]').forEach(function (c) {
    if (state.assign[c.getAttribute('data-assign')]) c.checked = true;
  });
  var nameEl = document.querySelector('[data-name]');
  if (nameEl && state.name) { nameEl.value = state.name; var cn = document.getElementById('certName'); if (cn) cn.textContent = state.name; }

  var start = (location.hash || '#home').replace('#', '');
  if (!document.querySelector('[data-view="' + start + '"]')) start = 'home';
  show(start, true);
})();
