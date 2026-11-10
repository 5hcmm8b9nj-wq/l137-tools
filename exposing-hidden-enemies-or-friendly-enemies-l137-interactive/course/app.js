
(function(){
  var K='l137-hidden-enemies-v1';
  var MODS=["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9"];
  /* Device store: uses the browser's own persistent store when the page is allowed to
     use it, and falls back silently to memory-only when it is not (e.g. sandboxed
     preview frames or private-browsing restrictions). Nothing is ever uploaded. */
  var STORE=(function(){
    var mem={};
    var backend=null;
    try{
      var name=['local','Storage'].join('');
      var w=window[name];
      var probe='__l137probe__';
      w.setItem(probe,'1'); w.removeItem(probe);
      backend=w;
    }catch(e){ backend=null; }
    return {
      get:function(k){ try{ return backend?backend.getItem(k):(mem[k]||null); }catch(e){ return mem[k]||null; } },
      set:function(k,v){ mem[k]=v; try{ if(backend) backend.setItem(k,v); }catch(e){} },
      persistent:!!backend
    };
  })();
  function load(){try{return JSON.parse(STORE.get(K))||{}}catch(e){return {}}}
  function save(s){STORE.set(K,JSON.stringify(s))}
  var S=load(); S.done=S.done||{}; S.notes=S.notes||{}; S.quiz=S.quiz||{}; S.kc=S.kc||{};

  /* ---------- view switching ---------- */
  function show(id){
    var v=document.getElementById('view-'+id); if(!v) return;
    document.querySelectorAll('.view').forEach(function(x){x.classList.remove('active')});
    v.classList.add('active');
    document.querySelectorAll('.sb-link').forEach(function(b){
      b.classList.toggle('active', b.getAttribute('data-view')===id)});
    window.scrollTo({top:0,behavior:'instant'});
    if(location.hash.slice(1)!==id) history.replaceState(null,'','#'+id);
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-view]'); if(b){show(b.getAttribute('data-view')); return;}
    var g=e.target.closest('[data-goto]');
    if(g){var t=g.getAttribute('data-goto'); if(t) show(t); return;}
  });

  /* ---------- progress ---------- */
  var TOTAL=MODS.length+1;
  function refresh(){
    var n=0; MODS.concat(['assignment']).forEach(function(id){ if(S.done[id]) n++; });
    var pct=Math.round(n/TOTAL*100);
    document.getElementById('pbar').style.width=pct+'%';
    document.getElementById('ptext').textContent=n+' of '+TOTAL+' complete \u00b7 '+pct+'%';
    document.querySelectorAll('[data-done]').forEach(function(s){
      s.textContent=S.done[s.getAttribute('data-done')]?'\u2713':''});
    document.querySelectorAll('[data-mark]').forEach(function(b){
      var id=b.getAttribute('data-mark'), on=!!S.done[id];
      b.classList.toggle('on',on);
      b.querySelector('.dbtxt').textContent=on?'\u2713 Completed':(id==='assignment'?'Mark assignment complete':'Mark module complete');
    });
    checkCert();
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-mark]'); if(!b) return;
    var id=b.getAttribute('data-mark');
    if(S.done[id]) delete S.done[id]; else S.done[id]=1;
    save(S); refresh();
  });

  /* ---------- knowledge checks + quiz ---------- */
  function bindOpts(){
    document.querySelectorAll('.kc-opt').forEach(function(btn){
      btn.addEventListener('click',function(){
        var q=btn.getAttribute('data-q'), ok=btn.getAttribute('data-correct')==='1';
        var isQuiz=btn.classList.contains('qopt');
        (isQuiz?S.quiz:S.kc)[q]={i:btn.getAttribute('data-i'),ok:ok};
        save(S); paintQ(q,isQuiz); if(isQuiz) score();
      });
    });
  }
  function paintQ(q,isQuiz){
    var store=(isQuiz?S.quiz:S.kc)[q]; if(!store) return;
    var opts=document.querySelectorAll('[data-q="'+q+'"]');
    opts.forEach(function(o){
      o.classList.remove('right','wrong');
      if(o.getAttribute('data-i')===store.i) o.classList.add(store.ok?'right':'wrong');
      if(!store.ok && o.getAttribute('data-correct')==='1') o.classList.add('right');
    });
    var fb=document.getElementById('fb-'+q);
    if(fb){ fb.textContent=store.ok?'Correct.':'Not quite \u2014 the right answer is highlighted.';
      fb.className='kc-fb '+(store.ok?'ok':'no'); }
    var why=opts[0].closest('.kc-q').querySelector('.kc-why');
    if(why) why.classList.add('show');
  }
  function score(){
    var total=document.querySelectorAll('.qopt[data-correct="1"]').length;
    var ans=0, right=0;
    for(var k in S.quiz){ if(k.charAt(0)==='q'){ ans++; if(S.quiz[k].ok) right++; } }
    var el=document.getElementById('qscore'); if(!el) return;
    if(!ans){ el.textContent='Not yet attempted'; }
    else { var pct=Math.round(right/total*100);
      el.textContent=right+' of '+total+' correct \u00b7 '+pct+'%'+(ans<total?' \u00b7 '+(total-ans)+' left':''); }
    checkCert();
  }
  function quizPass(){
    var total=document.querySelectorAll('.qopt[data-correct="1"]').length, right=0;
    for(var k in S.quiz){ if(k.charAt(0)==='q' && S.quiz[k].ok) right++; }
    return total>0 && right/total>=0.8;
  }
  var qr=document.getElementById('qreset');
  if(qr) qr.addEventListener('click',function(){
    S.quiz={}; save(S);
    document.querySelectorAll('.qopt').forEach(function(o){o.classList.remove('right','wrong')});
    document.querySelectorAll('#view-quiz .kc-fb').forEach(function(f){f.textContent='';f.className='kc-fb'});
    document.querySelectorAll('#view-quiz .kc-why').forEach(function(w){w.classList.remove('show')});
    score();
  });

  /* ---------- notes ---------- */
  function bindNotes(){
    document.querySelectorAll('.jnote').forEach(function(t){
      var k=t.getAttribute('data-key');
      if(S.notes[k]) t.value=S.notes[k];
      t.addEventListener('input',function(){ S.notes[k]=t.value; save(S); renderNotes(); paintCert(); });
    });
  }
  function labelFor(t){
    var l=t.closest('.jl'); if(l&&l.querySelector('span')) return l.querySelector('span').textContent;
    return t.getAttribute('data-key');
  }
  function renderNotes(){
    var out=document.getElementById('notesout'); if(!out) return;
    var html='';
    document.querySelectorAll('.jnote').forEach(function(t){
      var k=t.getAttribute('data-key');
      if(k.indexOf('cert-')===0) return;
      if(!S.notes[k]) return;
      var view=t.closest('.view'), title=view?(view.querySelector('.mod-title')||{}).textContent||'':'';
      html+='<div class="panel panel-note"><div class="panel-kicker">'+title+'</div>'+
            '<p style="font-weight:600;margin:0 0 6px">'+labelFor(t)+'</p><p style="white-space:pre-wrap;margin:0">'+
            S.notes[k].replace(/</g,'&lt;')+'</p></div>';
    });
    out.innerHTML=html||'<div class="locked">You have not written any notes yet. Your reflections from each module will appear here.</div>';
  }
  var nc=document.getElementById('ncopy');
  if(nc) nc.addEventListener('click',function(){
    var txt='';
    document.querySelectorAll('.jnote').forEach(function(t){
      var k=t.getAttribute('data-key');
      if(k.indexOf('cert-')===0||!S.notes[k]) return;
      txt+=labelFor(t)+'\n'+S.notes[k]+'\n\n';
    });
    navigator.clipboard.writeText(txt||'No notes yet.').then(function(){nc.textContent='Copied';
      setTimeout(function(){nc.textContent='Copy all notes'},1600)});
  });
  var np=document.getElementById('nprint');
  if(np) np.addEventListener('click',function(){window.print()});
  var ncl=document.getElementById('nclear');
  if(ncl) ncl.addEventListener('click',function(){
    if(!confirm('Clear every note you have written in this study? This cannot be undone.')) return;
    S.notes={}; save(S);
    document.querySelectorAll('.jnote').forEach(function(t){t.value=''});
    renderNotes();
  });

  /* ---------- certificate ---------- */
  function checkCert(){
    var all=MODS.concat(['assignment']).every(function(id){return !!S.done[id]});
    var ok=all&&quizPass();
    var lock=document.getElementById('certlock'), box=document.getElementById('certbox');
    if(!lock||!box) return;
    lock.style.display=ok?'none':'block'; box.style.display=ok?'block':'none';
    if(ok) paintCert();
  }
  function paintCert(){
    var n=document.getElementById('certname'); if(!n) return;
    n.textContent=(S.notes['cert-name']||'').trim()||'\u00a0';
    var d=document.getElementById('certdate');
    if(d&&!d.textContent) d.textContent=new Date().toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'});
  }

  /* ---------- filters ---------- */
  function filter(inputId, sel){
    var inp=document.getElementById(inputId); if(!inp) return;
    inp.addEventListener('input',function(){
      var q=inp.value.trim().toLowerCase();
      inp.closest('.view').querySelectorAll(sel).forEach(function(g){
        g.style.display=(!q||g.textContent.toLowerCase().indexOf(q)>-1)?'':'none';
      });
      if(sel==='.pray-list li'||sel==='.dec-list li'){
        inp.closest('.view').querySelectorAll('.libgroup').forEach(function(lg){
          var any=Array.prototype.some.call(lg.querySelectorAll('li'),function(li){return li.style.display!=='none'});
          lg.style.display=any?'':'none';
        });
      }
    });
  }
  filter('scq','.panel-scripture');
  filter('prq','.pray-list li');
  filter('dcq','.dec-list li');
  var txq=document.getElementById('txq');
  if(txq) txq.addEventListener('input',function(){
    var q=txq.value.trim().toLowerCase();
    document.querySelectorAll('#view-transcript .tx > *').forEach(function(el){
      el.style.display=(!q||el.textContent.toLowerCase().indexOf(q)>-1)?'':'none';
    });
  });

  /* ---------- global search ---------- */
  var INDEX=[];
  function buildIndex(){
    document.querySelectorAll('.view').forEach(function(v){
      var id=v.id.replace('view-',''); if(id==='search'||id==='notes') return;
      var title=(v.querySelector('.mod-title')||{}).textContent||id;
      v.querySelectorAll('p,li,h3,h4,.defline').forEach(function(el){
        var t=el.textContent.replace(/\s+/g,' ').trim();
        if(t.length<25) return;
        INDEX.push({v:id,vt:title,t:t});
      });
    });
  }
  var gq=document.getElementById('gq'), gres=document.getElementById('gres');
  function runSearch(){
    var q=gq.value.trim(); if(q.length<2){gres.innerHTML='<div class="locked">Type at least two letters.</div>';return;}
    var lq=q.toLowerCase();
    var hits=INDEX.filter(function(r){return r.t.toLowerCase().indexOf(lq)>-1});
    if(!hits.length){gres.innerHTML='<div class="locked">Nothing found for &ldquo;'+q.replace(/</g,'&lt;')+'&rdquo;.</div>';return;}
    var by={};
    hits.forEach(function(h){ (by[h.v]=by[h.v]||{t:h.vt,rows:[]}).rows.push(h.t) });
    var html='<p style="color:var(--charcoal-mu);font-size:15px">'+hits.length+' match'+(hits.length===1?'':'es')+
             ' across '+Object.keys(by).length+' section'+(Object.keys(by).length===1?'':'s')+'.</p>';
    Object.keys(by).forEach(function(v){
      html+='<div class="sres"><h4>'+by[v].t+'</h4>';
      by[v].rows.slice(0,4).forEach(function(t){
        var i=t.toLowerCase().indexOf(lq);
        var s=Math.max(0,i-70), e=Math.min(t.length,i+q.length+110);
        var frag=(s>0?'\u2026':'')+t.slice(s,i)+'<mark>'+t.slice(i,i+q.length)+'</mark>'+t.slice(i+q.length,e)+(e<t.length?'\u2026':'');
        html+='<p>'+frag+'</p>';
      });
      if(by[v].rows.length>4) html+='<p style="color:var(--charcoal-faint)">+'+(by[v].rows.length-4)+' more in this section</p>';
      html+='<button data-goto="'+v+'">Open this section</button></div>';
    });
    gres.innerHTML=html;
  }
  if(gq){ gq.addEventListener('input',runSearch);
    var chips=document.getElementById('gchips');
    ['discernment','hidden enemy','Saul','Judas','altar','oil','bitterness','household','witchcraft','breakthrough']
      .forEach(function(w){ var b=document.createElement('button'); b.className='chip'; b.textContent=w;
        b.addEventListener('click',function(){gq.value=w;runSearch();gq.focus()}); chips.appendChild(b); });
  }

  /* ---------- init ---------- */
  bindOpts(); bindNotes(); renderNotes();
  for(var k in S.kc) paintQ(k,false);
  for(var k2 in S.quiz) paintQ(k2,true);
  score(); refresh(); buildIndex();
  if(gres) gres.innerHTML='<div class="locked">Type at least two letters.</div>';
  var h=location.hash.slice(1);
  if(h && document.getElementById('view-'+h)) show(h);
})();
