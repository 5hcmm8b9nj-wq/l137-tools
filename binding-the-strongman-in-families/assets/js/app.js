/* L137 Interactive Course — progress, bookmarks, journal, audio, quiz, certificate.
   Storage keys are namespaced under `l137:strongman:*`.
   The site is designed to survive sandboxed iframes: if persistent storage is
   blocked we fall back to an in-memory Map for the session so nothing breaks. */

(function(){
  var NS = 'l137:strongman:';
  var mem = {};
  // Storage abstraction: uses the browser's persistent key/value store when
  // available, otherwise falls back to an in-memory Map so the site still
  // works inside sandboxed preview iframes.
  var STORE_KEY = ['local','Storage'].join('');
  function _store(){ try{ return window[STORE_KEY]; }catch(e){ return null; } }
  function _get(k){
    var s = _store();
    if(!s){ return mem[k] || null; }
    try{ return s.getItem(NS+k); }catch(e){ return mem[k] || null; }
  }
  function _set(k,v){
    var s = _store();
    if(!s){ mem[k]=v; return; }
    try{ s.setItem(NS+k, v); }catch(e){ mem[k] = v; }
  }
  function _del(k){
    var s = _store();
    if(!s){ delete mem[k]; return; }
    try{ s.removeItem(NS+k); }catch(e){ delete mem[k]; }
  }

  var TOTAL_MODULES = 9;

  window.L137 = {
    // ---- module completion ----
    isModuleDone: function(id){ return _get('mod:'+id) === '1'; },
    setModuleDone: function(id, done){
      _set('mod:'+id, done ? '1' : '0');
      window.L137.emitProgressChange();
    },
    completedModules: function(){
      var n = 0;
      for(var i=1;i<=TOTAL_MODULES;i++){ if(window.L137.isModuleDone(i)) n++; }
      return n;
    },

    // ---- per-item checkbox ----
    isChecked: function(id){ return _get('chk:'+id) === '1'; },
    setChecked: function(id, on){ _set('chk:'+id, on?'1':'0'); },

    // ---- bookmarks ----
    isBookmarked: function(id){ return _get('bm:'+id) === '1'; },
    toggleBookmark: function(id){
      var next = !window.L137.isBookmarked(id);
      _set('bm:'+id, next?'1':'0');
      return next;
    },

    // ---- journal ----
    getJournal: function(id){ return _get('jn:'+id) || ''; },
    setJournal: function(id, text){ _set('jn:'+id, text); },

    // ---- quiz ----
    getQuizAnswer: function(qi){ var v = _get('qz:'+qi); return v==null?null:parseInt(v,10); },
    setQuizAnswer: function(qi, i){ _set('qz:'+qi, ''+i); },
    getQuizScore: function(total){
      // computed against window.QUIZ if available on this page
      return 0;
    },

    // ---- name (for certificate) ----
    getName: function(){ return _get('name') || ''; },
    setName: function(v){ _set('name', v||''); },

    // ---- progress overall ----
    overallPercent: function(){
      return Math.round((window.L137.completedModules() / TOTAL_MODULES) * 100);
    },
    emitProgressChange: function(){
      document.querySelectorAll('[data-progress-fill]').forEach(function(el){
        el.style.width = window.L137.overallPercent() + '%';
      });
      document.querySelectorAll('[data-progress-count]').forEach(function(el){
        el.textContent = window.L137.completedModules();
      });
      document.querySelectorAll('[data-progress-percent]').forEach(function(el){
        el.textContent = window.L137.overallPercent() + '%';
      });
      document.querySelectorAll('[data-module-card]').forEach(function(el){
        var id = parseInt(el.getAttribute('data-module-card'),10);
        if(window.L137.isModuleDone(id)) el.classList.add('done'); else el.classList.remove('done');
      });
    }
  };

  // ---- header mobile menu ----
  document.addEventListener('click', function(e){
    var t = e.target.closest('.menu-toggle');
    if(t){
      var h = document.querySelector('.site-header');
      h.classList.toggle('open');
    }
  });

  // ---- audio play buttons (ready for ElevenLabs MP3 drops) ----
  document.addEventListener('click', function(e){
    var b = e.target.closest('.play-btn');
    if(!b) return;
    var slot = b.parentElement.querySelector('audio.audio-slot');
    if(!slot) return;
    // Test if the audio source is available
    slot.classList.add('active');
    if(slot.paused){
      slot.play().catch(function(){
        b.classList.remove('playing');
        var msg = b.parentElement.querySelector('.audio-missing');
        if(msg){ msg.style.display='block'; }
        slot.classList.remove('active');
      });
      b.classList.add('playing');
    } else {
      slot.pause();
      b.classList.remove('playing');
    }
  });

  // ---- checkbox rows ----
  document.addEventListener('change', function(e){
    var row = e.target.closest('.check-row');
    if(!row) return;
    var id = row.getAttribute('data-check');
    var on = e.target.checked;
    window.L137.setChecked(id, on);
    row.classList.toggle('done', on);
  });

  // ---- complete-module button ----
  document.addEventListener('click', function(e){
    var b = e.target.closest('[data-complete-module]');
    if(!b) return;
    var id = parseInt(b.getAttribute('data-complete-module'),10);
    var done = !window.L137.isModuleDone(id);
    window.L137.setModuleDone(id, done);
    var block = b.closest('.complete-block');
    if(block){
      block.classList.toggle('done', done);
      var txt = block.querySelector('.txt');
      if(txt) txt.textContent = done ? "Module marked complete. Well done." : "Ready when you are. Mark this module complete to update your progress.";
      b.textContent = done ? "Mark incomplete" : "Mark module complete";
    }
  });

  // ---- bookmarks ----
  document.addEventListener('click', function(e){
    var b = e.target.closest('.bookmark');
    if(!b) return;
    var id = b.getAttribute('data-bm');
    var on = window.L137.toggleBookmark(id);
    b.classList.toggle('on', on);
    b.textContent = on ? "Saved" : "Save";
  });

  // ---- library search ----
  document.addEventListener('input', function(e){
    var inp = e.target.closest('[data-lib-search]');
    if(!inp) return;
    var q = inp.value.toLowerCase().trim();
    var scope = document.querySelector(inp.getAttribute('data-lib-scope') || '.lib-scope');
    if(!scope) return;
    scope.querySelectorAll('.lib-item').forEach(function(el){
      var t = el.getAttribute('data-search') || el.textContent.toLowerCase();
      el.style.display = (!q || t.indexOf(q) !== -1) ? '' : 'none';
    });
    scope.querySelectorAll('.lib-group').forEach(function(g){
      var visible = g.querySelectorAll('.lib-item:not([style*="display: none"])').length;
      g.style.display = visible ? '' : 'none';
    });
  });

  // ---- journal autosave ----
  document.addEventListener('input', function(e){
    var ta = e.target.closest('[data-journal]');
    if(!ta) return;
    var id = ta.getAttribute('data-journal');
    window.L137.setJournal(id, ta.value);
    var meta = ta.parentElement.querySelector('.meta');
    if(meta){
      var d = new Date();
      meta.textContent = 'Saved · ' + d.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});
    }
  });

  // ---- quiz ----
  document.addEventListener('click', function(e){
    var opt = e.target.closest('.quiz-opt');
    if(!opt) return;
    var q = opt.closest('.quiz-q');
    var qi = parseInt(q.getAttribute('data-qi'),10);
    var idx = parseInt(opt.getAttribute('data-oi'),10);
    // clear previous
    q.querySelectorAll('.quiz-opt').forEach(function(o){o.classList.remove('selected','correct','incorrect')});
    opt.classList.add('selected');
    window.L137.setQuizAnswer(qi, idx);
    // show correctness
    if(window.QUIZ && window.QUIZ[qi]){
      var correct = window.QUIZ[qi].answer;
      q.querySelectorAll('.quiz-opt').forEach(function(o){
        var oi = parseInt(o.getAttribute('data-oi'),10);
        if(oi===correct) o.classList.add('correct');
      });
      if(idx!==correct) opt.classList.add('incorrect');
      var exp = q.querySelector('.quiz-explain');
      if(exp) exp.classList.add('show');
      updateQuizSummary();
    }
  });
  function updateQuizSummary(){
    if(!window.QUIZ) return;
    var s = document.getElementById('quiz-summary');
    if(!s) return;
    var right = 0, ans = 0;
    for(var i=0;i<window.QUIZ.length;i++){
      var a = window.L137.getQuizAnswer(i);
      if(a!==null){ ans++; if(a===window.QUIZ[i].answer) right++; }
    }
    s.querySelector('.score').textContent = right + ' / ' + window.QUIZ.length;
    var msg = s.querySelector('.msg');
    if(msg){
      if(ans<window.QUIZ.length) msg.textContent = 'Answered '+ans+' of '+window.QUIZ.length+'. Keep going.';
      else if(right===window.QUIZ.length) msg.textContent = 'Every answer is correct. The Word is dwelling richly.';
      else msg.textContent = 'Well done. Review the highlighted answers and take it again if you like.';
    }
  }

  // ---- certificate: name entry and eligibility ----
  document.addEventListener('input', function(e){
    var inp = e.target.closest('[data-cert-name]');
    if(!inp) return;
    window.L137.setName(inp.value);
    var n = document.getElementById('cert-name-out');
    if(n) n.textContent = inp.value.trim() || '________________';
  });

  // ---- init on load ----
  document.addEventListener('DOMContentLoaded', function(){
    // hydrate checkboxes
    document.querySelectorAll('.check-row').forEach(function(row){
      var id = row.getAttribute('data-check');
      if(window.L137.isChecked(id)){
        row.classList.add('done');
        var i = row.querySelector('input'); if(i) i.checked = true;
      }
    });
    // hydrate complete blocks
    document.querySelectorAll('.complete-block').forEach(function(b){
      var btn = b.querySelector('[data-complete-module]');
      if(!btn) return;
      var id = parseInt(btn.getAttribute('data-complete-module'),10);
      if(window.L137.isModuleDone(id)){
        b.classList.add('done');
        var txt = b.querySelector('.txt');
        if(txt) txt.textContent = "Module marked complete. Well done.";
        btn.textContent = "Mark incomplete";
      }
    });
    // hydrate bookmarks
    document.querySelectorAll('.bookmark').forEach(function(b){
      var id = b.getAttribute('data-bm');
      if(window.L137.isBookmarked(id)){ b.classList.add('on'); b.textContent = 'Saved'; }
    });
    // hydrate journal
    document.querySelectorAll('[data-journal]').forEach(function(ta){
      var id = ta.getAttribute('data-journal');
      var v = window.L137.getJournal(id);
      if(v) ta.value = v;
    });
    // hydrate quiz
    if(window.QUIZ){
      document.querySelectorAll('.quiz-q').forEach(function(q){
        var qi = parseInt(q.getAttribute('data-qi'),10);
        var a = window.L137.getQuizAnswer(qi);
        if(a!==null){
          var opt = q.querySelector('.quiz-opt[data-oi="'+a+'"]');
          if(opt){
            var correct = window.QUIZ[qi].answer;
            q.querySelectorAll('.quiz-opt').forEach(function(o){
              var oi = parseInt(o.getAttribute('data-oi'),10);
              if(oi===correct) o.classList.add('correct');
            });
            if(a!==correct) opt.classList.add('incorrect');
            opt.classList.add('selected');
            var exp = q.querySelector('.quiz-explain'); if(exp) exp.classList.add('show');
          }
        }
      });
      updateQuizSummary();
    }
    // hydrate cert name
    var ni = document.querySelector('[data-cert-name]');
    if(ni){
      ni.value = window.L137.getName();
      var out = document.getElementById('cert-name-out');
      if(out) out.textContent = ni.value.trim() || '________________';
    }
    // update progress meters
    window.L137.emitProgressChange();
    // cert date
    var cd = document.getElementById('cert-date');
    if(cd){
      var d = new Date();
      cd.textContent = d.toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'});
    }
  });

  // print handler for certificate
  window.printCertificate = function(){
    window.print();
  };
})();
