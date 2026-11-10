(function(){
  'use strict';
  var MEM = {};

  function store(){
    return MEM;
  }
  function save(o){
    MEM = o || {};
  }
  var state = store();
  state.steps = state.steps || {};
  state.assess = state.assess || {};
  state.notes  = state.notes  || {};

  /* ---------------- toast ---------------- */
  var toast = document.getElementById('toast');
  var tt;
  function say(msg){
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(tt);
    tt = setTimeout(function(){ toast.classList.remove('show'); }, 1700);
  }

  /* ---------------- copy ---------------- */
  function copyText(txt, cb){
    if (navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(txt).then(cb, function(){ legacy(txt); cb(); });
    } else { legacy(txt); cb(); }
  }
  function legacy(txt){
    var ta = document.createElement('textarea');
    ta.value = txt;
    ta.setAttribute('readonly','');
    ta.style.position='fixed'; ta.style.left='-9999px';
    document.body.appendChild(ta);
    ta.select(); ta.setSelectionRange(0, txt.length);
    try { document.execCommand('copy'); } catch(e){}
    document.body.removeChild(ta);
  }

  document.addEventListener('click', function(ev){
    var b = ev.target.closest ? ev.target.closest('[data-copy]') : null;
    if (!b) return;
    ev.preventDefault();
    copyText(b.getAttribute('data-copy'), function(){
      b.classList.add('done');
      var old = b.textContent;
      b.textContent = 'Copied';
      say('Copied to clipboard');
      setTimeout(function(){ b.textContent = old; b.classList.remove('done'); }, 1800);
    });
  });

  /* ---------------- whatsapp share ---------------- */
  document.addEventListener('click', function(ev){
    var a = ev.target.closest ? ev.target.closest('[data-share]') : null;
    if (!a) return;
    ev.preventDefault();
    var txt = a.getAttribute('data-share');
    window.location.href = 'https://wa.me/?text=' + encodeURIComponent(txt);
  });

  /* ---------------- tabs ---------------- */
  var tabBtns = Array.prototype.slice.call(document.querySelectorAll('nav.tabs button[data-tab]'));
  function showTab(id){
    tabBtns.forEach(function(b){
      b.setAttribute('aria-selected', b.getAttribute('data-tab') === id ? 'true' : 'false');
    });
    document.querySelectorAll('section.panel').forEach(function(s){
      s.classList.toggle('hidden', s.id !== 'tab-' + id);
    });
    window.scrollTo(0, 0);
  }
  tabBtns.forEach(function(b){
    b.addEventListener('click', function(){ showTab(b.getAttribute('data-tab')); });
  });
  document.querySelectorAll('[data-go]').forEach(function(b){
    b.addEventListener('click', function(){ showTab(b.getAttribute('data-go')); });
  });

  /* ---------------- accordion ---------------- */
  document.querySelectorAll('.mod > button.head').forEach(function(h){
    h.addEventListener('click', function(){
      var m = h.parentNode;
      var open = m.classList.toggle('open');
      h.setAttribute('aria-expanded', open ? 'true' : 'false');
      h.querySelector('.chev').textContent = open ? '\u2013' : '+';
    });
    var m = h.parentNode;
    h.querySelector('.chev').textContent = m.classList.contains('open') ? '\u2013' : '+';
  });

  /* ---------------- quizzes ---------------- */
  document.querySelectorAll('.quiz').forEach(function(qz){
    var btn = qz.querySelector('.quizscore');
    var out = qz.querySelector('.score');
    qz.querySelectorAll('.q input[type=radio]').forEach(function(r){
      r.addEventListener('change', function(){
        var q = r.closest('.q');
        q.querySelectorAll('label').forEach(function(l){ l.classList.remove('right','wrong'); });
        var ok = r.getAttribute('data-ok') === '1';
        r.parentNode.classList.add(ok ? 'right' : 'wrong');
        var fb = q.querySelector('.fb');
        fb.innerHTML = (ok ? '\u2713 Correct. ' : '\u2717 Not quite. ') + q.getAttribute('data-fb');
      });
    });
    if (btn) btn.addEventListener('click', function(){
      var qs = qz.querySelectorAll('.q'), got = 0, tot = qs.length, answered = 0;
      qs.forEach(function(q){
        var sel = q.querySelector('input[type=radio]:checked');
        if (sel){ answered++; if (sel.getAttribute('data-ok') === '1') got++; }
        var fb = q.querySelector('.fb');
        if (!sel){ fb.innerHTML = 'Not answered yet. ' + q.getAttribute('data-fb'); }
      });
      if (answered === 0){ out.textContent = 'Answer the questions first.'; return; }
      var pct = Math.round(got / tot * 100);
      var word = pct === 100 ? 'Perfect. Well studied.' : pct >= 67 ? 'Good. Review the ones you missed.' : 'Go back over this module and try again.';
      out.textContent = 'Score: ' + got + ' of ' + tot + ' (' + pct + '%). ' + word;
    });
  });

  /* ---------------- self-assessment ---------------- */
  var boxes = Array.prototype.slice.call(document.querySelectorAll('.asx'));
  boxes.forEach(function(b){
    var k = b.getAttribute('data-i');
    if (state.assess[k]) b.checked = true;
    b.addEventListener('change', function(){
      state.assess[k] = b.checked ? 1 : 0;
      save(state);
    });
  });
  var rbox = document.getElementById('assessResult');
  var sBtn = document.getElementById('scoreAssess');
  if (sBtn) sBtn.addEventListener('click', function(){
    var n = boxes.filter(function(b){ return b.checked; }).length;
    var tot = boxes.length;
    var head, body;
    if (n === 0){
      head = 'Nothing ticked';
      body = '<p>Either none of these apply to you, or you have not ticked anything yet. If none apply, thank God and still take the study &mdash; you may be standing in the gap for your family or your household.</p>';
    } else if (n <= 4){
      head = n + ' of ' + tot + ' &middot; A few markers';
      body = '<p>A small number of markers. Take them seriously but not fearfully. Work through Module 4 (doorways) and Module 7 (the blood), then pray the guided sequence. Where any item is physical or emotional, also see a doctor.</p>';
    } else if (n <= 12){
      head = n + ' of ' + tot + ' &middot; A clear pattern';
      body = '<p>This is a pattern worth taking to God directly. Read Modules 4, 5, 6, 7 and 8 carefully, write your marriage certificate and divorce it aloud, then begin the 21-day direction in Module 11. Keep a written record of your dreams so you can testify to the change.</p>';
    } else if (n <= 22){
      head = n + ' of ' + tot + ' &middot; A heavy pattern';
      body = '<p>Many markers together. Pastor Kiky&rsquo;s counsel applies fully: work the whole study in order, do not skip the confession and forgiveness steps, and be consistent every single night rather than praying once. Ask a mature believer or your pastor to stand with you in prayer, and get medical help for anything physical.</p>';
    } else {
      head = n + ' of ' + tot + ' &middot; Do not do this alone';
      body = '<p>This is a great deal to be carrying. Work the whole study in order, begin the nightly blood-marking direction, and <strong>ask your pastor or a mature believer to pray with you</strong> rather than doing this by yourself. Please also see a doctor or a mental-health professional for anything physical or emotional on this list.</p>';
    }
    rbox.innerHTML = '<div class="big">' + head + '</div>' + body +
      '<p style="margin-bottom:0"><strong>Remember:</strong> the score is not a verdict on your salvation, and it is not a medical diagnosis. Whatever the number, the answer is the same Christ and the same blood. &ldquo;For with God nothing shall be impossible.&rdquo; &mdash; Luke 1:37 KJV</p>';
    rbox.classList.add('show');
    rbox.scrollIntoView({behavior:'smooth', block:'center'});
  });
  var rst = document.getElementById('resetAssess');
  if (rst) rst.addEventListener('click', function(){
    boxes.forEach(function(b){ b.checked = false; });
    state.assess = {}; save(state);
    rbox.classList.remove('show');
    say('Checklist cleared');
  });

  /* ---------------- guided prayer progress ---------------- */
  var stepBoxes = Array.prototype.slice.call(document.querySelectorAll('.stepbox'));
  var pBar = document.getElementById('progBar');
  var pTxt = document.getElementById('progTxt');
  function paint(){
    var done = 0;
    stepBoxes.forEach(function(b){
      var on = !!state.steps[b.getAttribute('data-step')];
      b.checked = on;
      b.closest('.step').classList.toggle('done', on);
      if (on) done++;
    });
    var tot = stepBoxes.length;
    if (pBar) pBar.style.width = (tot ? (done / tot * 100) : 0) + '%';
    if (pTxt) pTxt.textContent = done === tot && tot > 0
      ? 'All ' + tot + ' steps prayed \u2014 sealed in the blood of Jesus'
      : done + ' of ' + tot + ' steps prayed';
  }
  stepBoxes.forEach(function(b){
    b.addEventListener('change', function(){
      state.steps[b.getAttribute('data-step')] = b.checked ? 1 : 0;
      save(state); paint();
      if (b.checked) say('Step marked');
    });
  });
  paint();
  var rs = document.getElementById('resetSteps');
  if (rs) rs.addEventListener('click', function(){
    state.steps = {}; save(state); paint(); say('Prayer progress reset');
  });

  /* ---------------- journal notes persistence ---------------- */
  document.querySelectorAll('textarea[data-note]').forEach(function(ta, i){
    var k = 'n' + i;
    if (state.notes[k]) ta.value = state.notes[k];
    ta.addEventListener('input', function(){
      state.notes[k] = ta.value; save(state);
    });
  });

  /* ---------------- search index ---------------- */
  var index = [];
  document.querySelectorAll('#tab-modules .mod').forEach(function(m, mi){
    var title = m.getAttribute('data-mod');
    var id = m.id;
    m.querySelectorAll('.body p, .body li, .scr .txt, .dec li, .memverse .txt, .q .qt').forEach(function(el){
      var t = el.textContent.trim();
      if (t.length > 12) index.push({ m: (mi + 1) + '. ' + title, id: id, t: t });
    });
  });
  document.querySelectorAll('#tab-scriptures .scr').forEach(function(s){
    index.push({ m: 'Scripture Library \u2014 ' + s.querySelector('.ref').textContent, id: 'tab-scriptures', t: s.querySelector('.txt').textContent.trim(), tab: 'scriptures' });
  });
  document.querySelectorAll('#tab-declarations .dec').forEach(function(d){
    var lbl = d.querySelector('.lbl').textContent;
    d.querySelectorAll('li').forEach(function(li){
      index.push({ m: 'Declaration Library \u2014 ' + lbl, id: 'tab-declarations', t: li.textContent.trim(), tab: 'declarations' });
    });
  });

  var qEl = document.getElementById('q');
  var rEl = document.getElementById('results');
  function esc(s){ return s.replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function run(){
    var v = (qEl.value || '').trim();
    if (v.length < 2){ rEl.innerHTML = '<p style="color:var(--charcoal-mu)">Type at least two letters.</p>'; return; }
    var needle = v.toLowerCase();
    var hits = index.filter(function(r){ return r.t.toLowerCase().indexOf(needle) !== -1; }).slice(0, 80);
    if (!hits.length){
      rEl.innerHTML = '<p style="color:var(--charcoal-mu)">No match for &ldquo;' + esc(v) + '&rdquo;. Try: dream, ring, blood, python, covenant, fire, barren, Lazarus, Passover, finances, aftercare.</p>';
      return;
    }
    var re = new RegExp('(' + v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    rEl.innerHTML = '<p style="color:var(--charcoal-mu)">' + hits.length + ' result' + (hits.length === 1 ? '' : 's') + '</p>' +
      hits.map(function(r){
        return '<div class="result"><div class="rm">' + esc(r.m) + '</div><div>' +
               esc(r.t).replace(re, '<mark>$1</mark>') + '</div>' +
               '<a href="#" data-jump="' + r.id + '" data-tab="' + (r.tab || 'modules') + '">Go to this section \u2192</a></div>';
      }).join('');
  }
  if (qEl){
    qEl.addEventListener('input', run);
    rEl.addEventListener('click', function(ev){
      var a = ev.target.closest ? ev.target.closest('[data-jump]') : null;
      if (!a) return;
      ev.preventDefault();
      var id = a.getAttribute('data-jump');
      showTab(a.getAttribute('data-tab'));
      var t = document.getElementById(id);
      if (t){
        if (t.classList && t.classList.contains('mod') && !t.classList.contains('open')){
          t.classList.add('open');
          var hd = t.querySelector('button.head');
          if (hd){ hd.setAttribute('aria-expanded','true'); hd.querySelector('.chev').textContent = '\u2013'; }
        }
        setTimeout(function(){ t.scrollIntoView({behavior:'smooth', block:'start'}); }, 60);
      }
    });
  }
})();
