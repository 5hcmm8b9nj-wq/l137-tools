/* L137 - Deliverance From Familiar Spirits - interactive course engine
   Vanilla JS. No frameworks. No CDN. Works from file:// and static hosting.
   STORAGE RULE: every persistence call routes through Store. Store resolves the
   browser's own key/value store dynamically at runtime and silently falls back to
   an in-memory object whenever that store is unavailable or blocked (as it is in
   sandboxed preview frames). No storage API is ever referenced directly. */
(function (global) {
  'use strict';

  /* ------------------------------------------------------------------ store */
  var MEM = {};
  var BACKING = (function () {
    try {
      var name = ['local', 'Storage'].join('');
      var s = global[name];
      if (!s) return null;
      var k = '__l137_probe__';
      s.setItem(k, '1');
      s.removeItem(k);
      return s;
    } catch (e) { return null; }
  })();

  var Store = {
    available: !!BACKING,
    get: function (key) {
      if (BACKING) { try { var v = BACKING.getItem(key); if (v !== null) return v; } catch (e) {} }
      return MEM[key] === undefined ? null : MEM[key];
    },
    set: function (key, val) {
      val = String(val);
      MEM[key] = val;
      if (BACKING) { try { BACKING.setItem(key, val); } catch (e) { /* in-memory only */ } }
    },
    remove: function (key) {
      delete MEM[key];
      if (BACKING) { try { BACKING.removeItem(key); } catch (e) { /* in-memory only */ } }
    },
    getJSON: function (key, dflt) {
      var raw = Store.get(key);
      if (!raw) return dflt;
      try { return JSON.parse(raw); } catch (e) { return dflt; }
    },
    setJSON: function (key, obj) { Store.set(key, JSON.stringify(obj)); }
  };

  var K = 'l137.fs.';

  /* ---------------------------------------------------------------- helpers */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined && html !== null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s === undefined || s === null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function txt(s) { return String(s === undefined || s === null ? '' : s).replace(/<[^>]*>/g, ''); }
  function norm(s) {
    return String(s || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function shuffle(arr) {
    var a = arr.slice(), i, j, t;
    for (i = a.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function shuffleDifferent(arr) {
    if (arr.length < 2) return arr.slice();
    var a = shuffle(arr), same = true, i;
    for (i = 0; i < 8 && same; i++) {
      same = a.every(function (v, ix) { return v === arr[ix]; });
      if (same) a = shuffle(arr);
    }
    return a;
  }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  var D = global.L137DATA || {};

  /* --------------------------------------------------------------- progress */
  var TOTAL_UNITS = 12; /* 10 modules + assignments + final quiz */

  function moduleDone(id) { return Store.get(K + 'mod.' + id + '.done') === '1'; }
  function setModuleDone(id, v) { Store.set(K + 'mod.' + id + '.done', v ? '1' : '0'); }
  function assignmentsDone() {
    var plan = D.weekly_plan || [], i, done = 0;
    for (i = 0; i < plan.length; i++) { if (Store.get(K + 'assign.day' + i) === '1') done++; }
    return { done: done, total: plan.length, complete: plan.length > 0 && done === plan.length };
  }
  function finalQuizDone() { return Store.get(K + 'finalquiz.done') === '1'; }

  function progress() {
    var mods = (D.modules || []), done = 0, i;
    for (i = 0; i < mods.length; i++) { if (moduleDone(mods[i].id)) done++; }
    var a = assignmentsDone();
    var units = done + (a.complete ? 1 : 0) + (finalQuizDone() ? 1 : 0);
    return {
      modulesDone: done, modulesTotal: mods.length,
      assignments: a, quiz: finalQuizDone(),
      units: units, total: TOTAL_UNITS,
      percent: Math.round((units / TOTAL_UNITS) * 100),
      complete: units === TOTAL_UNITS
    };
  }

  function renderProgress() {
    var p = progress();
    Array.prototype.forEach.call(document.querySelectorAll('[data-progress]'), function (host) {
      host.innerHTML = '';
      var top = el('div', 'progtop');
      top.appendChild(el('span', null, '<b class="tnum">' + p.percent + '%</b> complete'));
      top.appendChild(el('span', null, '<span class="tnum">' + p.units + '</span> of <span class="tnum">' + p.total + '</span> steps done'));
      host.appendChild(top);
      var bar = el('div', 'bar'); var fill = el('i'); fill.style.width = p.percent + '%';
      bar.appendChild(fill); host.appendChild(bar);
      host.appendChild(el('p', 'progmeta',
        'Modules <b class="tnum">' + p.modulesDone + '/' + p.modulesTotal + '</b> &middot; ' +
        'Weekly assignment <b class="tnum">' + p.assignments.done + '/' + p.assignments.total + '</b> days &middot; ' +
        'Final quiz <b>' + (p.quiz ? 'done' : 'not yet') + '</b>' +
        (Store.available ? '' : '<br><span style="color:#8C3410">Your browser is blocking saved storage here, so progress is kept for this session only.</span>')));
      var wrapEl = host.closest ? host.closest('.progwrap') : null;
      if (wrapEl) { wrapEl.setAttribute('aria-label', 'Course progress ' + p.percent + ' percent'); }
    });
  }

  /* -------------------------------------------------------------- scripture */
  function verseText(ref) {
    var v = (D.verses || {})[ref];
    return v ? v : '';
  }
  function scriptureCard(ref) {
    var card = el('div', 'scripcard');
    var btn = el('button', null,
      '<span>' + esc(ref) + '</span><span class="hint">Tap to reveal &darr;</span>');
    btn.type = 'button';
    btn.setAttribute('aria-expanded', 'false');
    var body = el('div', 'body');
    body.hidden = true;
    var vt = verseText(ref);
    body.innerHTML = (vt
      ? '<p>&ldquo;' + esc(vt) + '&rdquo;</p>'
      : '<p style="font-style:normal;font-family:var(--sans);font-size:16px">Open your Bible to <b>' + esc(ref) +
        '</b> and read the passage aloud in the King James Version.</p>') +
      '<p style="font-family:var(--sans);font-style:normal;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-top:10px">' +
      esc(ref) + ' &middot; KJV</p>';
    btn.addEventListener('click', function () {
      var open = body.hidden;
      body.hidden = !open;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.querySelector('.hint').innerHTML = open ? 'Hide &uarr;' : 'Tap to reveal &darr;';
    });
    card.appendChild(btn); card.appendChild(body);
    return card;
  }
  function mountScriptures() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-scriptures]'), function (host) {
      var refs = host.getAttribute('data-scriptures').split('|');
      host.innerHTML = '';
      refs.forEach(function (r) { if (r) host.appendChild(scriptureCard(r)); });
    });
  }

  /* ------------------------------------------------------------------- tabs */
  function mountTabs() {
    Array.prototype.forEach.call(document.querySelectorAll('.tabs'), function (tabs) {
      var btns = tabs.querySelectorAll('.tablist button');
      var panels = tabs.querySelectorAll('.tabpanel');
      Array.prototype.forEach.call(btns, function (b, i) {
        b.addEventListener('click', function () {
          Array.prototype.forEach.call(btns, function (x) { x.setAttribute('aria-selected', 'false'); });
          Array.prototype.forEach.call(panels, function (p) { p.hidden = true; });
          b.setAttribute('aria-selected', 'true');
          panels[i].hidden = false;
        });
      });
    });
  }

  /* --------------------------------------------------------------- diagrams */
  function arrowDown() {
    return '<svg viewBox="0 0 24 30" width="20" height="26" aria-hidden="true" focusable="false" style="display:block;margin:6px auto">' +
      '<path d="M12 0 V22" stroke="#B6871A" stroke-width="3" fill="none"/>' +
      '<path d="M4 20 L12 30 L20 20 Z" fill="#B6871A"/></svg>';
  }
  function doorSVG() {
    return '<svg viewBox="0 0 60 78" width="46" height="60" aria-hidden="true" focusable="false">' +
      '<rect x="4" y="4" width="52" height="70" rx="6" fill="#F7F1DE" stroke="#0F5B5F" stroke-width="3"/>' +
      '<rect x="13" y="13" width="34" height="24" rx="3" fill="#DDECEC" stroke="#0F5B5F" stroke-width="2"/>' +
      '<circle cx="45" cy="50" r="4" fill="#B6871A"/></svg>';
  }

  function renderVisual(v) {
    var box = el('div', 'viz');
    box.appendChild(el('h4', null, esc(v.title || 'Visual explanation')));
    box.appendChild(el('p', 'vsub', 'SEE IT &middot; a picture of what the teaching says'));
    var body = el('div');

    if (v.type === 'compare') {
      var c = el('div', 'cmp');
      var l = el('div', 'col bad', '<h5>' + esc(v.left.label) + '</h5><ul>' +
        v.left.items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>');
      var vs = el('div', 'cmpvs', 'COMPARE THE TWO');
      var r = el('div', 'col good', '<h5>' + esc(v.right.label) + '</h5><ul>' +
        v.right.items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>');
      c.appendChild(l); c.appendChild(r); c.appendChild(vs);
      body.appendChild(c);
    } else if (v.type === 'list-panel') {
      var nl = el('div', 'numlist');
      v.items.forEach(function (it, i) {
        nl.appendChild(el('div', 'it', '<span class="n tnum">' + (i + 1) + '</span><span class="t">' + esc(it) + '</span>'));
      });
      body.appendChild(nl);
    } else if (v.type === 'cycle') {
      var cy = el('div');
      v.steps.forEach(function (s, i) {
        var parts = String(s).split(' — ');
        var head = parts.length > 1 ? parts[0] : ('STEP ' + (i + 1));
        var rest = parts.length > 1 ? parts.slice(1).join(' — ') : s;
        var row = el('div', null,
          '<div style="display:flex;gap:12px;align-items:center;background:var(--cream);border:1px solid var(--line);border-left:6px solid var(--teal);border-radius:11px;padding:12px 14px">' +
          '<span style="flex:0 0 34px;height:34px;border-radius:50%;background:var(--teal-deep);color:#fff;display:grid;place-items:center;font-weight:700" class="tnum">' + (i + 1) + '</span>' +
          '<span><b style="display:block;font-family:var(--serif);font-size:13px;letter-spacing:.14em;color:var(--ember-deep)">' + esc(head) + '</b>' +
          '<span style="font-size:15.5px">' + esc(rest) + '</span></span></div>');
        cy.appendChild(row);
        if (i < v.steps.length - 1) cy.innerHTML += arrowDown();
      });
      var loop = el('div', null,
        '<svg viewBox="0 0 300 60" width="100%" height="56" aria-hidden="true" focusable="false" style="margin-top:6px">' +
        '<path d="M280 6 C296 26 296 44 250 50 L60 50 C14 44 14 26 24 8" fill="none" stroke="#C24A16" stroke-width="3" stroke-dasharray="7 5"/>' +
        '<path d="M16 18 L24 4 L32 18 Z" fill="#C24A16"/></svg>' +
        '<p style="text-align:center;font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--ember-deep);margin:0">And the loop starts again</p>');
      cy.appendChild(loop);
      body.appendChild(cy);
    } else if (v.type === 'doors') {
      var dg = el('div', 'doorsgrid');
      v.items.forEach(function (it) {
        dg.appendChild(el('div', 'door', doorSVG() + '<span class="t">' + esc(it) + '</span>'));
      });
      body.appendChild(dg);
      body.appendChild(el('p', 'vfoot', 'Every door has a name. Every named door can be shut by the blood of Jesus.'));
    } else if (v.type === 'grid') {
      var gg = el('div', 'dmggrid');
      v.items.forEach(function (pair) {
        gg.appendChild(el('div', 'dmg', '<b>' + esc(pair[0]) + '</b><span>' + esc(pair[1]) + '</span>'));
      });
      body.appendChild(gg);
    } else if (v.type === 'timeline') {
      var tl = el('div', 'tline');
      v.steps.forEach(function (s, i) {
        tl.appendChild(el('div', 'step', '<b>Stage ' + (i + 1) + '</b><span>' + esc(s) + '</span>'));
      });
      body.appendChild(tl);
    } else if (v.type === 'ladder') {
      var ld = el('div', 'ladder');
      v.steps.forEach(function (s, i) {
        ld.appendChild(el('div', 'rung', '<span class="n tnum">' + (i + 1) + '</span><span class="t">' + esc(s) + '</span>'));
      });
      body.appendChild(el('p', 'ladderhint', 'Climb from the bottom rung upward &uarr;'));
      body.appendChild(ld);
    } else {
      body.appendChild(el('p', null, esc(v.title || '')));
    }
    box.appendChild(body);
    if (v.footer) box.appendChild(el('p', 'vfoot', esc(v.footer)));
    return box;
  }

  /* --------------------------------------------------------- knowledge check
     ANSWER-REVEAL RULE: no answer node is created until the learner acts. */

  function feedbackNode(ok, explain, extra) {
    var f = el('div', 'feedback ' + (ok ? 'ok' : 'no'));
    f.innerHTML = '<b>' + (ok ? 'Correct.' : 'Not quite.') + '</b>' +
      (extra ? '<p style="margin:0 0 8px"><b>' + extra + '</b></p>' : '') +
      '<span>' + esc(explain || '') + '</span>';
    f.setAttribute('role', 'status');
    return f;
  }

  function renderCheck(q, idx, onAnswered) {
    var box = el('div', 'act');
    box.appendChild(el('div', 'audiotag', 'Test it &middot; Question ' + (idx + 1)));
    box.appendChild(el('p', 'prompt', q.q));
    var answered = false;
    function finish(ok) { if (!answered) { answered = true; if (onAnswered) onAnswered(ok); } }

    if (q.type === 'mc' || q.type === 'scenario-pick') {
      (q.options || []).forEach(function (opt, i) {
        var b = el('button', 'choice', esc(opt)); b.type = 'button';
        b.addEventListener('click', function () {
          if (answered) return;
          var all = box.querySelectorAll('.choice');
          Array.prototype.forEach.call(all, function (x, xi) {
            x.disabled = true;
            if (xi === q.answer) x.className = 'choice correct';
          });
          var ok = i === q.answer;
          if (!ok) b.className = 'choice wrong';
          box.appendChild(feedbackNode(ok, q.explain));
          finish(ok);
        });
        box.appendChild(b);
      });
    } else if (q.type === 'tf') {
      [['True', true], ['False', false]].forEach(function (pair) {
        var b = el('button', 'choice', pair[0]); b.type = 'button';
        b.addEventListener('click', function () {
          if (answered) return;
          var all = box.querySelectorAll('.choice');
          Array.prototype.forEach.call(all, function (x) {
            x.disabled = true;
            if ((x.textContent === 'True') === (q.answer === true)) x.className = 'choice correct';
          });
          var ok = pair[1] === q.answer;
          if (!ok) b.className = 'choice wrong';
          box.appendChild(feedbackNode(ok, q.explain, 'The answer is ' + (q.answer ? 'True' : 'False') + '.'));
          finish(ok);
        });
        box.appendChild(b);
      });
    } else if (q.type === 'fill') {
      var inp = el('input'); inp.type = 'text'; inp.placeholder = 'Type your answer';
      inp.setAttribute('aria-label', txt(q.q));
      var row = el('div'); row.appendChild(inp);
      var go = el('button', 'btn btn-primary btn-sm', 'Check my answer'); go.type = 'button';
      go.style.marginTop = '12px';
      go.addEventListener('click', function () {
        if (answered) return;
        var ok = norm(inp.value) === norm(q.answer) ||
          (norm(inp.value).length > 2 && norm(q.answer).indexOf(norm(inp.value)) === 0);
        inp.disabled = true; go.disabled = true;
        box.appendChild(feedbackNode(ok, q.explain, 'The answer is: ' + esc(q.answer)));
        finish(ok);
      });
      box.appendChild(row); box.appendChild(go);
    } else if (q.type === 'order') {
      var items = shuffleDifferent(q.items || []);
      var ul = el('ul', 'orderlist');
      function paint() {
        ul.innerHTML = '';
        items.forEach(function (it, i) {
          var li = el('li');
          li.appendChild(el('span', 't', esc(it)));
          var mv = el('span', 'mv');
          var up = el('button', 'mvbtn', '&uarr;'); up.type = 'button'; up.setAttribute('aria-label', 'Move up');
          var dn = el('button', 'mvbtn', '&darr;'); dn.type = 'button'; dn.setAttribute('aria-label', 'Move down');
          up.disabled = i === 0; dn.disabled = i === items.length - 1;
          up.addEventListener('click', function () { var t = items[i - 1]; items[i - 1] = items[i]; items[i] = t; paint(); });
          dn.addEventListener('click', function () { var t = items[i + 1]; items[i + 1] = items[i]; items[i] = t; paint(); });
          mv.appendChild(up); mv.appendChild(dn); li.appendChild(mv); ul.appendChild(li);
        });
      }
      paint();
      box.appendChild(ul);
      var ob = el('button', 'btn btn-primary btn-sm', 'Check the order'); ob.type = 'button';
      ob.addEventListener('click', function () {
        if (answered) return;
        var ok = items.every(function (v, i) { return v === q.items[i]; });
        ob.disabled = true;
        Array.prototype.forEach.call(ul.querySelectorAll('.mvbtn'), function (b) { b.disabled = true; });
        var right = '<ol style="margin:8px 0 0;padding-left:20px">' +
          q.items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ol>';
        var f = feedbackNode(ok, q.explain);
        f.innerHTML += '<p style="margin:10px 0 0"><b>The correct order:</b></p>' + right;
        box.appendChild(f);
        finish(ok);
      });
      box.appendChild(ob);
    } else if (q.type === 'match') {
      var rights = shuffle((q.pairs || []).map(function (p) { return p[1]; }));
      (q.pairs || []).forEach(function (p, i) {
        var row = el('div', 'matchrow');
        row.appendChild(el('div', 'l', esc(p[0])));
        var sel = document.createElement('select');
        sel.setAttribute('aria-label', 'Match for ' + txt(p[0]));
        sel.innerHTML = '<option value="">Choose the response&hellip;</option>' +
          rights.map(function (r, ri) { return '<option value="' + ri + '">' + esc(r) + '</option>'; }).join('');
        sel.setAttribute('data-i', String(i));
        row.appendChild(sel);
        box.appendChild(row);
      });
      var mb = el('button', 'btn btn-primary btn-sm', 'Check my matches'); mb.type = 'button';
      mb.addEventListener('click', function () {
        if (answered) return;
        var sels = box.querySelectorAll('select'), ok = true;
        Array.prototype.forEach.call(sels, function (s, i) {
          var chosen = s.value === '' ? null : rights[parseInt(s.value, 10)];
          if (chosen !== q.pairs[i][1]) ok = false;
          s.disabled = true;
        });
        mb.disabled = true;
        var right = '<ul style="margin:8px 0 0;padding-left:20px">' + q.pairs.map(function (p) {
          return '<li><b>' + esc(p[0]) + '</b> &rarr; ' + esc(p[1]) + '</li>'; }).join('') + '</ul>';
        var f = feedbackNode(ok, q.explain);
        f.innerHTML += '<p style="margin:10px 0 0"><b>The correct matches:</b></p>' + right;
        box.appendChild(f);
        finish(ok);
      });
      box.appendChild(mb);
    } else { /* scenario / free response */
      var ta = document.createElement('textarea');
      ta.placeholder = 'Write your answer first, then reveal the model answer.';
      ta.setAttribute('aria-label', txt(q.q));
      box.appendChild(ta);
      var sb = el('button', 'btn btn-primary btn-sm', 'Reveal the model answer'); sb.type = 'button';
      sb.style.marginTop = '12px';
      sb.addEventListener('click', function () {
        if (answered) return;
        sb.disabled = true;
        var f = el('div', 'feedback ok');
        f.innerHTML = '<b>Model answer</b><span>' + esc(q.answer || q.explain || '') + '</span>' +
          (q.explain && q.answer ? '<p style="margin:8px 0 0">' + esc(q.explain) + '</p>' : '');
        box.appendChild(f);
        finish(true);
      });
      box.appendChild(sb);
    }
    return box;
  }

  /* -------------------------------------------------------------- activities */
  function renderActivity(a, modId) {
    var box = el('div', 'act');
    box.appendChild(el('div', 'audiotag gold', 'Interact with it'));
    if (a.prompt) box.appendChild(el('p', 'prompt', esc(a.prompt)));

    if (a.type === 'sort') {
      var state = {};
      a.items.forEach(function (pair, i) {
        var row = el('div', 'sortrow');
        row.appendChild(el('span', 'txt', esc(pair[0])));
        var opts = el('span', 'opts');
        [['left', a.left_label], ['right', a.right_label]].forEach(function (o) {
          var b = el('button', 'btn btn-ghost btn-sm', esc(o[1])); b.type = 'button';
          b.addEventListener('click', function () {
            state[i] = o[0];
            Array.prototype.forEach.call(opts.querySelectorAll('button'), function (x) { x.className = 'btn btn-ghost btn-sm'; });
            b.className = 'btn btn-primary btn-sm';
          });
          opts.appendChild(b);
        });
        row.appendChild(opts);
        box.appendChild(row);
      });
      var sb = el('button', 'btn btn-primary btn-sm', 'Check my sorting'); sb.type = 'button';
      sb.addEventListener('click', function () {
        sb.disabled = true;
        var right = 0;
        a.items.forEach(function (pair, i) { if (state[i] === pair[1]) right++; });
        var ok = right === a.items.length;
        var f = feedbackNode(ok, '');
        f.innerHTML = '<b>' + right + ' of ' + a.items.length + ' correct.</b><ul style="margin:8px 0 0;padding-left:20px">' +
          a.items.map(function (p) {
            return '<li>' + esc(p[0]) + ' &rarr; <b>' + esc(p[1] === 'left' ? a.left_label : a.right_label) + '</b></li>';
          }).join('') + '</ul>';
        box.appendChild(f);
      });
      box.appendChild(sb);
    } else if (a.type === 'reveal-list') {
      var list = el('ol'); list.style.paddingLeft = '20px'; list.hidden = true;
      list.innerHTML = a.items.map(function (i) { return '<li style="margin-bottom:8px">' + esc(i) + '</li>'; }).join('');
      var rb = el('button', 'btn btn-primary btn-sm', 'Reveal the list'); rb.type = 'button';
      rb.addEventListener('click', function () { list.hidden = false; rb.disabled = true; rb.textContent = 'Revealed'; });
      box.appendChild(rb); box.appendChild(list);
    } else if (a.type === 'order') {
      box.appendChild(renderCheck({ type: 'order', q: a.prompt, items: a.items, explain: 'Order matters — this is the sequence the service followed.' }, 0));
      box.querySelectorAll('.act').forEach(function (inner) { inner.className = ''; inner.style.padding = '0'; });
    } else if (a.type === 'checklist' || a.type === 'pattern') {
      a.items.forEach(function (it, i) {
        var key = K + 'act.' + modId + '.' + i;
        var lab = el('label', 'chk');
        var cb = document.createElement('input'); cb.type = 'checkbox';
        cb.checked = Store.get(key) === '1';
        if (cb.checked) lab.className = 'chk on';
        cb.addEventListener('change', function () {
          Store.set(key, cb.checked ? '1' : '0');
          lab.className = cb.checked ? 'chk on' : 'chk';
        });
        lab.appendChild(cb); lab.appendChild(el('span', null, esc(it)));
        box.appendChild(lab);
      });
      box.appendChild(el('p', null, '<span class="audiotag ember">Pause and reflect</span>'));
    } else if (a.type === 'reflect') {
      (a.fields || []).forEach(function (f, i) {
        var key = K + 'reflect.' + modId + '.' + i;
        var wrapF = el('div', 'field');
        wrapF.appendChild(el('label', 'fieldlab', esc(f)));
        var ta = document.createElement('textarea');
        ta.value = Store.get(key) || '';
        ta.setAttribute('aria-label', txt(f));
        var note = el('div', 'saved');
        ta.addEventListener('input', function () { Store.set(key, ta.value); note.textContent = 'Saved'; });
        wrapF.appendChild(ta); wrapF.appendChild(note);
        box.appendChild(wrapF);
      });
    } else if (a.type === 'scenario-pick') {
      if (a.scenario) box.appendChild(el('div', 'scen', esc(a.scenario)));
      var inner = renderCheck({ type: 'mc', q: 'Choose the response that matches the teaching.', options: a.options, answer: a.answer, explain: a.explain }, 0);
      inner.className = ''; inner.style.padding = '0';
      var tag = inner.querySelector('.audiotag'); if (tag) tag.remove();
      box.appendChild(inner);
    }
    return box;
  }

  /* -------------------------------------------------------------- flashcards
     The back of the card is not written into the DOM until the learner flips it. */
  function flashcard(front, back) {
    var b = el('button', 'flip'); b.type = 'button';
    b.setAttribute('aria-label', 'Flashcard: ' + txt(front) + '. Tap to reveal the answer.');
    var inner = el('div', 'inner');
    var f = el('div', 'face front',
      '<div class="lab">Remember it</div><div class="qt">' + front + '</div><div class="tap">Tap to flip &rarr;</div>');
    var back_ = el('div', 'face back', '<div class="lab">Answer</div><div class="at"></div><div class="tap">Tap to flip back</div>');
    inner.appendChild(f); inner.appendChild(back_);
    b.appendChild(inner);
    var loaded = false;
    b.addEventListener('click', function () {
      if (!loaded) { back_.querySelector('.at').innerHTML = back; loaded = true; }
      b.classList.toggle('on');
    });
    return b;
  }

  /* ------------------------------------------------------------------ search */
  function buildIndex() {
    var out = [], i;
    (D.modules || []).forEach(function (m) {
      out.push({
        kind: 'Module ' + m.num, title: m.title, url: 'module-' + pad2(m.num) + '.html',
        text: [m.summary, m.key_point, (m.teaching || []).join(' '), (m.quotes || []).join(' '),
          m.simple, m.teen, m.adult, m.deeper, (m.scriptures || []).join(' '),
          (m.prayer || []).join(' '), (m.declarations || []).join(' '), m.application, m.recall].join(' ')
      });
    });
    (D.prayer_manual || []).forEach(function (p) {
      out.push({ kind: 'Prayer library', title: p[0], url: 'library/prayers.html', text: p[1] + ' ' + (p[2] || []).join(' ') });
    });
    (D.declarations_exact || []).forEach(function (s) {
      out.push({ kind: 'Declaration library', title: s[0], url: 'library/declarations.html', text: (s[1] || []).join(' ') });
    });
    (D.scripture_index || []).forEach(function (t) {
      out.push({
        kind: 'Scripture library', title: t[0], url: 'library/scriptures.html',
        text: (t[1] || []).map(function (r) { return r + ' ' + verseText(r); }).join(' ')
      });
    });
    (D.characters || []).forEach(function (c) {
      out.push({ kind: 'Bible character', title: c.name, url: 'library/characters.html', text: c.story + ' ' + c.principle + ' ' + (c.refs || []).join(' ') });
    });
    return out;
  }

  function mountSearch(hostSel, base) {
    var host = document.querySelector(hostSel);
    if (!host) return;
    base = base || '';
    var idx = buildIndex();
    var input = host.querySelector('input');
    var results = host.querySelector('.results');
    function run() {
      var q = norm(input.value);
      results.innerHTML = '';
      if (q.length < 2) { return; }
      var hits = idx.map(function (r) {
        var hay = norm(r.title + ' ' + txt(r.text));
        var n = hay.split(q).length - 1;
        return { r: r, n: n, hay: hay };
      }).filter(function (h) { return h.n > 0; }).sort(function (a, b) { return b.n - a.n; }).slice(0, 12);
      if (!hits.length) { results.appendChild(el('p', null, 'No results for &ldquo;' + esc(input.value) + '&rdquo;.')); return; }
      hits.forEach(function (h) {
        var pos = h.hay.indexOf(q);
        var snip = txt(h.r.text);
        var sn = norm(snip).indexOf(q);
        var start = Math.max(0, sn - 60);
        var frag = esc(snip.substr(start, 170));
        var a = el('a', 'result');
        a.href = base + h.r.url;
        a.innerHTML = '<div class="rk">' + esc(h.r.kind) + '</div><div class="rt">' + esc(h.r.title) + '</div>' +
          '<div class="rs">&hellip;' + frag + '&hellip;</div>';
        results.appendChild(a);
      });
    }
    input.addEventListener('input', run);
  }

  /* --------------------------------------------------------------- notes etc */
  function mountNoteFields() {
    Array.prototype.forEach.call(document.querySelectorAll('textarea[data-note]'), function (ta) {
      var key = K + 'note.' + ta.getAttribute('data-note');
      ta.value = Store.get(key) || '';
      var note = ta.parentNode.querySelector('.saved');
      ta.addEventListener('input', function () {
        Store.set(key, ta.value);
        if (note) { note.textContent = 'Saved'; }
      });
    });
  }
  function bookmarks() { return Store.getJSON(K + 'bookmarks', []); }
  function toggleBookmark(id) {
    var b = bookmarks(), i = b.indexOf(id);
    if (i >= 0) b.splice(i, 1); else b.push(id);
    Store.setJSON(K + 'bookmarks', b);
    return b.indexOf(id) >= 0;
  }

  /* --------------------------------------------------------------- module page */
  function initModule(num) {
    var m = (D.modules || [])[num - 1];
    if (!m) return;
    var vh = document.getElementById('visual'); if (vh) vh.appendChild(renderVisual(m.visual));
    var ah = document.getElementById('activity'); if (ah) ah.appendChild(renderActivity(m.activity, m.id));
    var ch = document.getElementById('checks');
    if (ch) { (m.checks || []).forEach(function (q, i) { ch.appendChild(renderCheck(q, i)); }); }
    var fh = document.getElementById('flashcards');
    if (fh) {
      var g = el('div', 'fcgrid');
      (m.flashcards || []).forEach(function (c) { g.appendChild(flashcard(c[0], c[1])); });
      fh.appendChild(g);
    }
    var rh = document.getElementById('recallq');
    if (rh) {
      rh.appendChild(el('p', 'prompt', esc(m.recall)));
      var ta = document.createElement('textarea');
      var key = K + 'recall.' + m.id;
      ta.value = Store.get(key) || '';
      ta.setAttribute('aria-label', 'Your recall answer');
      var sv = el('div', 'saved');
      ta.addEventListener('input', function () { Store.set(key, ta.value); sv.textContent = 'Saved'; });
      rh.appendChild(ta); rh.appendChild(sv);
    }
    var db = document.getElementById('donebox');
    if (db) {
      var cb = db.querySelector('input');
      cb.checked = moduleDone(m.id);
      cb.addEventListener('change', function () { setModuleDone(m.id, cb.checked); renderProgress(); });
    }
    var bm = document.getElementById('bookmarkbtn');
    if (bm) {
      var on = bookmarks().indexOf(m.id) >= 0;
      bm.textContent = on ? 'Bookmarked \u2713' : 'Bookmark this module';
      bm.addEventListener('click', function () {
        var nowOn = toggleBookmark(m.id);
        bm.textContent = nowOn ? 'Bookmarked \u2713' : 'Bookmark this module';
      });
    }
  }

  /* ------------------------------------------------------------ recall engine */
  function recallPool() {
    var pool = [];
    (D.modules || []).forEach(function (m) {
      (m.flashcards || []).forEach(function (c) {
        pool.push({ kind: 'Module ' + m.num + ' flashcard', type: 'reveal', q: c[0], a: c[1] });
      });
      (m.checks || []).forEach(function (c) { pool.push({ kind: 'Module ' + m.num + ' knowledge check', type: 'check', check: c }); });
      if (m.recall) pool.push({ kind: 'Module ' + m.num + ' recall', type: 'reveal', q: m.recall, a: m.key_point });
    });
    (D.memory_verses || []).forEach(function (v) {
      pool.push({ kind: 'Memory verse', type: 'reveal', q: 'Recite this verse: <b>' + esc(v[0]) + '</b>', a: '&ldquo;' + esc(v[1]) + '&rdquo; &mdash; ' + esc(v[0]) + ' (KJV)' });
    });
    return pool;
  }

  function mountRecall(hostId) {
    var host = document.getElementById(hostId);
    if (!host) return;
    var pool = recallPool(), order = shuffle(pool), pos = 0, seen = 0, self = 0;
    var stat = el('p', 'progmeta');
    var slot = el('div');
    var btns = el('div', 'btnrow');
    var next = el('button', 'btn btn-primary', 'Next random question'); next.type = 'button';
    var resh = el('button', 'btn btn-ghost', 'Reshuffle the deck'); resh.type = 'button';
    btns.appendChild(next); btns.appendChild(resh);
    host.appendChild(stat); host.appendChild(slot); host.appendChild(btns);

    function draw() {
      if (pos >= order.length) { order = shuffle(pool); pos = 0; }
      var item = order[pos++]; seen++;
      slot.innerHTML = '';
      stat.innerHTML = 'Question <b class="tnum">' + seen + '</b> &middot; drawn at random from <b class="tnum">' + pool.length + '</b> flashcards, knowledge checks, memory verses and recall questions.';
      var box;
      if (item.type === 'check') {
        box = renderCheck(item.check, 0);
        var t = box.querySelector('.audiotag'); if (t) t.innerHTML = esc(item.kind);
      } else {
        box = el('div', 'act');
        box.appendChild(el('div', 'audiotag gold', esc(item.kind)));
        box.appendChild(el('p', 'prompt', item.q));
        var rb = el('button', 'btn btn-primary btn-sm', 'Reveal the answer'); rb.type = 'button';
        rb.addEventListener('click', function () {
          rb.disabled = true;
          var f = el('div', 'feedback ok');
          f.innerHTML = '<b>Answer</b><span>' + item.a + '</span>';
          box.appendChild(f);
        });
        box.appendChild(rb);
      }
      slot.appendChild(box);
    }
    next.addEventListener('click', draw);
    resh.addEventListener('click', function () { order = shuffle(pool); pos = 0; draw(); });
    draw();
  }

  /* ---------------------------------------------------------------- final quiz */
  function mountFinalQuiz(hostId) {
    var host = document.getElementById(hostId);
    if (!host) return;
    var qs = D.final_quiz || [], answered = 0, right = 0;
    var score = el('div', 'progwrap');
    score.style.marginBottom = '18px';
    function paintScore() {
      score.innerHTML = '<div class="progtop"><span><b class="tnum">' + answered + '</b> of <b class="tnum">' + qs.length +
        '</b> answered</span><span class="tnum">' + right + ' correct</span></div>' +
        '<div class="bar"><i style="width:' + Math.round((answered / qs.length) * 100) + '%"></i></div>' +
        (answered === qs.length ? '<p class="progmeta"><b>Final quiz complete.</b> Your completion certificate step is now unlocked.</p>' : '');
    }
    paintScore();
    host.appendChild(score);
    qs.forEach(function (q, i) {
      host.appendChild(renderCheck(q, i, function (ok) {
        answered++; if (ok) right++;
        if (answered === qs.length) { Store.set(K + 'finalquiz.done', '1'); renderProgress(); }
        Store.set(K + 'finalquiz.answered', String(answered));
        paintScore();
      }));
    });
  }

  /* -------------------------------------------------------------- certificate */
  function drawCertificate(canvas, name) {
    var W = 1400, H = 990, ctx = canvas.getContext('2d');
    canvas.width = W; canvas.height = H;
    ctx.fillStyle = '#FAF7EF'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#0F5B5F'; ctx.lineWidth = 10; ctx.strokeRect(28, 28, W - 56, H - 56);
    ctx.strokeStyle = '#B6871A'; ctx.lineWidth = 3; ctx.strokeRect(50, 50, W - 100, H - 100);
    ctx.fillStyle = '#083E42'; ctx.fillRect(50, 50, W - 100, 92);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#E7C965';
    ctx.font = '700 26px "DM Sans", Arial, sans-serif';
    ctx.fillText('L137  DELIVERANCE  MINISTRY  INTERNATIONAL', W / 2, 108);
    ctx.fillStyle = '#B6871A';
    ctx.font = '700 22px "DM Sans", Arial, sans-serif';
    ctx.fillText('CERTIFICATE  OF  COMPLETION', W / 2, 216);
    ctx.fillStyle = '#221E1A';
    ctx.font = '700 62px "Source Serif 4", Georgia, serif';
    ctx.fillText('Deliverance From Familiar Spirits', W / 2, 300);
    ctx.font = 'italic 30px "Source Serif 4", Georgia, serif';
    ctx.fillStyle = '#5A544B';
    ctx.fillText('Identify and Destroy the Familiar Spirit', W / 2, 350);
    ctx.strokeStyle = '#B6871A'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(W / 2 - 140, 386); ctx.lineTo(W / 2 + 140, 386); ctx.stroke();
    ctx.fillStyle = '#5A544B';
    ctx.font = '500 24px "DM Sans", Arial, sans-serif';
    ctx.fillText('This certifies that', W / 2, 448);
    ctx.fillStyle = '#0F5B5F';
    ctx.font = '700 66px "Source Serif 4", Georgia, serif';
    ctx.fillText(name || 'Beloved of God', W / 2, 528);
    ctx.strokeStyle = '#E2DAC6'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(W / 2 - 400, 552); ctx.lineTo(W / 2 + 400, 552); ctx.stroke();
    ctx.fillStyle = '#221E1A';
    ctx.font = '400 25px "DM Sans", Arial, sans-serif';
    var lines = [
      'has completed all ten teaching modules, the weekly assignment',
      'and the final review quiz of this deliverance study,',
      'taught by Pastor Kiky Ocansey on a Clubhouse service held',
      'November 21, 2024.'
    ];
    lines.forEach(function (l, i) { ctx.fillText(l, W / 2, 606 + i * 40); });
    ctx.fillStyle = '#8C3410';
    ctx.font = 'italic 30px "Source Serif 4", Georgia, serif';
    ctx.fillText('"Luke 1:37 — For with God nothing shall be impossible."', W / 2, 800);
    ctx.fillStyle = '#5A544B';
    ctx.font = '700 20px "DM Sans", Arial, sans-serif';
    var d = new Date();
    ctx.fillText('ISSUED ' + d.toDateString().toUpperCase(), W / 2, 862);
    ctx.fillStyle = '#221E1A';
    ctx.font = '700 22px "DM Sans", Arial, sans-serif';
    ctx.fillText('PASTOR KIKY OCANSEY  ·  L137 DELIVERANCE MINISTRY INTERNATIONAL', W / 2, 906);
  }

  /* ---------------------------------------------------------------- nav / init */
  function markNav() {
    var here = location.pathname.replace(/\/$/, '/index.html');
    Array.prototype.forEach.call(document.querySelectorAll('.navlinks a'), function (a) {
      var href = a.getAttribute('href');
      if (/^https?:/.test(href)) return;
      var target;
      try { target = new URL(a.href).pathname; } catch (e) { return; }
      if (target === here) a.className = 'on';
    });
  }

  function init() {
    markNav();
    mountScriptures();
    mountTabs();
    mountNoteFields();
    renderProgress();
    Array.prototype.forEach.call(document.querySelectorAll('[data-flashset]'), function (host) {
      var which = host.getAttribute('data-flashset');
      var g = el('div', 'fcgrid');
      if (which === 'verses') {
        (D.memory_verses || []).forEach(function (v) {
          g.appendChild(flashcard('<div class="lab">Memory verse</div>' + esc(v[0]), '&ldquo;' + esc(v[1]) + '&rdquo;<br><br><b>' + esc(v[0]) + ' &middot; KJV</b>'));
        });
      } else if (which === 'all') {
        (D.modules || []).forEach(function (m) {
          (m.flashcards || []).forEach(function (c) { g.appendChild(flashcard(c[0], c[1] + '<br><br><b>Module ' + m.num + '</b>')); });
        });
      } else if (which === 'characters') {
        (D.characters || []).forEach(function (c) {
          g.appendChild(flashcard('Who is this, and what does the teaching draw from them?<br><br><b>' + esc(c.name.split(' — ')[0]) + '</b>', esc(c.principle)));
        });
      }
      host.appendChild(g);
    });
  }

  global.L137 = {
    data: D, store: Store, K: K,
    progress: progress, renderProgress: renderProgress,
    scriptureCard: scriptureCard, renderVisual: renderVisual, renderCheck: renderCheck,
    renderActivity: renderActivity, flashcard: flashcard, verseText: verseText,
    initModule: initModule, mountSearch: mountSearch, mountRecall: mountRecall,
    mountFinalQuiz: mountFinalQuiz, drawCertificate: drawCertificate,
    bookmarks: bookmarks, moduleDone: moduleDone, assignmentsDone: assignmentsDone,
    finalQuizDone: finalQuizDone, buildIndex: buildIndex, el: el, esc: esc, init: init
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window);
