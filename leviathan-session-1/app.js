(function(){
'use strict';
var D = window.LEV, A = window.AUDIO || {};
var SECS = D.sections, BYID = {}; SECS.forEach(function(s,i){ s.n=i+1; BYID[s.id]=s; });
var TOTAL = SECS.length + 1; // teaching sections + quiz
var APP_ID = 'L137-Leviathan-Session1';
var KEY = 'l137-leviathan-s1-work-v2';
var LETTERS = ['A','B','C','D'];
var SITE = 'https://l137-leviathan.pplx.app/';

/* ---------- storage: feature-detect with in-memory fallback ---------- */
var mem = {};
var store = (function(){
  function ok(name){ try{ var s=window[name]; var k='__t'; s.setItem(k,'1'); s.removeItem(k); return s; }catch(e){ return null; } }
  var ls = ok('localStorage'), ss = ls ? null : ok('sessionStorage');
  var hasIDB = false; try{ hasIDB = !!window.indexedDB; }catch(e){}
  var s = ls || ss;
  return {
    kind: ls ? 'this phone (local storage)' : (ss ? 'this browser tab only' : 'this visit only'),
    persistent: !!ls, idb: hasIDB,
    get: function(k){ try{ return s ? s.getItem(k) : (k in mem ? mem[k] : null); }catch(e){ return mem[k]||null; } },
    set: function(k,v){ try{ if(s) s.setItem(k,v); else mem[k]=v; }catch(e){ mem[k]=v; } },
    del: function(k){ try{ if(s) s.removeItem(k); }catch(e){} delete mem[k]; }
  };
})();

function fresh(){ return { v:2, screen:'home', done:{}, quiz:{i:0, ans:{}, sub:{}, finished:false, score:null},
  audioPos:{}, prayed:{}, prayAt:{}, names:[], namesBy:{}, notes:{}, recall:{}, verses:[], order:{}, scaleAt:0, scaleSeen:{},
  reflect:{choice:null, note:''}, journal:'', theme:'day', fs:19, updated:null, lastTeaching:null }; }
var S;
try{ S = JSON.parse(store.get(KEY)||'null'); }catch(e){ S=null; }
if(!S || S.v!==2) S = fresh();
S = Object.assign(fresh(), S);
var saveTimer=null;
function save(now){ S.updated = new Date().toISOString(); if(now){ store.set(KEY, JSON.stringify(S)); return; }
  clearTimeout(saveTimer); saveTimer=setTimeout(function(){ store.set(KEY, JSON.stringify(S)); }, 250); }
window.addEventListener('pagehide', function(){ save(true); });
document.addEventListener('visibilitychange', function(){ if(document.hidden) save(true); });

/* ---------- helpers ---------- */
function esc(t){ return String(t==null?'':t).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
function $(s,r){ return (r||document).querySelector(s); }
function $$(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }
function toast(m){ var t=document.createElement('div'); t.className='toast'; t.setAttribute('role','status'); t.textContent=m; document.body.appendChild(t); setTimeout(function(){t.remove();},2600); }
function kjvHTML(ref){ var vs=D.kjv[ref]||[]; return vs.map(function(v){ return '<sup>'+v.v+'</sup>'+esc(v.t); }).join(' '); }
function kjvPlain(ref){ return (D.kjv[ref]||[]).map(function(v){return v.v+' '+v.t;}).join(' '); }
function doneCount(){ var n=0; SECS.forEach(function(s){ if(S.done[s.id]) n++; }); if(S.quiz.finished) n++; return n; }
function fmt(t){ if(!isFinite(t)) return '0:00'; t=Math.floor(t); return Math.floor(t/60)+':'+('0'+(t%60)).slice(-2); }
function today(){ var d=new Date(); return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2); }
function namesFor(){ return (S.names||[]).map(function(n){return n.trim();}).filter(Boolean); }

/* ---------- navigation order ---------- */
var ORDER = ['home'];
SECS.forEach(function(s){ ORDER.push(s.id); if(s.id==='s17') ORDER.push('reflect'); });
ORDER.push('quiz');
var LIBS = { print:'Printable Library', audio:'Audio Library', posters:'Posters', verses:'My Verses and Notes', save:'Save, Restore and Offline' };
function titleOf(id){ if(id==='home') return 'Welcome'; if(id==='reflect') return 'Personal Reflection and Prayer Focus'; if(id==='quiz') return 'Final Quiz'; if(LIBS[id]) return LIBS[id]; var s=BYID[id]; return s? s.n+'. '+s.title : id; }

/* ---------- audio (single element; approved human recordings only) ---------- */
var AU = new Audio(); AU.preload='metadata';
var active = null; // {key, ui, opts, cuesHit:{}}
function hasAudio(key){ return !!(A[key] && A[key].src); }
function stopAudio(){ try{ AU.pause(); }catch(e){} if(active){ S.audioPos[active.key]=AU.currentTime||0; save(); } active=null; $$('.player').forEach(function(p){ setPlayerUI(p,false); }); }
function playerHTML(key, label, cls){
  var ok=hasAudio(key); if(!ok) return '';
  return '<div class="player '+(cls||'')+'" data-key="'+esc(key)+'"><div class="pl-title">'+esc(label)+'</div>'+
    '<div class="ctrls"><button type="button" data-a="play" '+(ok?'':'disabled')+'>Play</button><button type="button" data-a="pause" '+(ok?'':'disabled')+'>Pause</button><button type="button" data-a="stop" '+(ok?'':'disabled')+'>Stop</button><button type="button" data-a="back" '+(ok?'':'disabled')+'>Back 10s</button></div>'+
    '<input type="range" min="0" max="100" step="0.1" value="0" aria-label="Seek" '+(ok?'':'disabled')+'>'+
    '<div class="time"><span class="cur">'+fmt(S.audioPos[key]||0)+'</span><span class="dur">'+(ok?'':'--:--')+'</span></div>'+
    '<div class="status" aria-live="polite">'+(ok?'':'Recording coming soon. The full words are on this page.')+'</div></div>';
}
function setPlayerUI(p, playing){ var b=$('[data-a=play]',p); if(b) b.textContent = playing?'Playing':'Play'; }
function wirePlayers(root, opts){
  $$('.player',root).forEach(function(p){
    var key=p.getAttribute('data-key'); if(!hasAudio(key)) return;
    var range=$('input[type=range]',p);
    p.addEventListener('click',function(e){ var a=e.target.getAttribute && e.target.getAttribute('data-a'); if(!a) return;
      if(a==='play') startAudio(key,p,(opts&&opts[key])||{});
      if(a==='pause'){ if(active&&active.key===key){ AU.pause(); S.audioPos[key]=AU.currentTime; save(); setPlayerUI(p,false);} }
      if(a==='stop'){ if(active&&active.key===key){ AU.pause(); AU.currentTime=0; } S.audioPos[key]=0; save(); $('.cur',p).textContent='0:00'; range.value=0; setPlayerUI(p,false); }
      if(a==='back'){ if(active&&active.key===key){ AU.currentTime=Math.max(0,AU.currentTime-10);} else { S.audioPos[key]=Math.max(0,(S.audioPos[key]||0)-10); save(); $('.cur',p).textContent=fmt(S.audioPos[key]); } }
    });
    range.addEventListener('input',function(){ if(active&&active.key===key&&AU.duration){ AU.currentTime = AU.duration*range.value/100; } });
  });
}
function startAudio(key,p,opts){
  if(!active || active.key!==key){
    stopAudio(); AU.src = A[key].src; active={key:key, ui:p, opts:opts||{}, cuesHit:{}};
    var pos=S.audioPos[key]||0;
    AU.addEventListener('loadedmetadata', function once(){ AU.removeEventListener('loadedmetadata',once); if(pos && pos < (AU.duration||0)-1) AU.currentTime=pos; (A[key].cues||[]).forEach(function(c,i){ if(c.t<=pos) active.cuesHit[i]=true; }); });
  }
  var pr=AU.play(); if(pr&&pr.catch) pr.catch(function(){ $('.status',p).textContent='This recording could not be played. Please check your connection.'; });
  setPlayerUI(p,true);
}
AU.addEventListener('timeupdate',function(){ if(!active) return; var p=active.ui; S.audioPos[active.key]=AU.currentTime; save();
  if(p && document.body.contains(p)){ $('.cur',p).textContent=fmt(AU.currentTime); $('.dur',p).textContent=fmt(AU.duration); if(AU.duration) $('input[type=range]',p).value = AU.currentTime/AU.duration*100; }
  var cues=(A[active.key]&&A[active.key].cues)||[];
  cues.forEach(function(c,i){ if(active.cuesHit[i] || AU.currentTime < c.t) return; active.cuesHit[i]=true;
    if(c.type==='names' && namesFor().length){ AU.pause(); setPlayerUI(p,false); showNamePause(function(){ startAudio(active.key,p,active.opts); }); }
    if(c.type==='activity'){ AU.pause(); setPlayerUI(p,false); if(active.opts.onPause) active.opts.onPause(); }
  });
});
AU.addEventListener('ended',function(){ if(!active) return; var k=active.key, o=active.opts, p=active.ui; S.audioPos[k]=0; save(); setPlayerUI(p,false); if(o.onEnded) o.onEnded(); });
AU.addEventListener('error',function(){ if(active&&active.ui) $('.status',active.ui).textContent='This recording could not be loaded. The full words are on this page.'; });
function showNamePause(cont){
  var w=document.createElement('div'); w.className='nameprompt'; w.setAttribute('role','dialog'); w.setAttribute('aria-modal','true');
  w.innerHTML='<div class="in"><div class="kicker">Pause and pray</div><p>Speak each name aloud now.</p><div class="names">'+namesFor().map(esc).join('<br>')+'</div><button class="btn block" type="button">Continue</button></div>';
  document.body.appendChild(w); $('button',w).focus(); $('button',w).onclick=function(){ w.remove(); cont(); };
}

/* ---------- chrome ---------- */
function applyTheme(){ document.documentElement.setAttribute('data-theme', S.theme==='night'?'night':'day'); document.documentElement.style.setProperty('--fs', (S.fs||19)+'px');
  var b=$('#themeBtn'); if(b){ b.textContent = S.theme==='night' ? 'Day' : 'Night'; b.setAttribute('aria-label', S.theme==='night'?'Switch to Day mode':'Switch to Night mode'); } }
function renderChrome(){
  var n=doneCount(), pct=Math.round(n/TOTAL*100);
  $('#pbar').style.width=pct+'%'; $('#ptext').textContent = pct+'% · '+n+' of '+TOTAL+' sections complete';
  $('#pbarWrap').setAttribute('aria-valuenow',pct);
  var sel=$('#chooser'), cur=S.screen, html='<option value="home"'+(cur==='home'?' selected':'')+'>'+(cur==='home'?'▶ You are here · ':'')+'Welcome</option>';
  [1,2,3,4].forEach(function(pt){
    html+='<optgroup label="'+esc(D.parts[pt])+'">';
    SECS.filter(function(s){return s.part===pt;}).forEach(function(s){
      var mark = cur===s.id ? '▶ You are here · ' : (S.done[s.id] ? '✓ ' : '');
      html+='<option value="'+s.id+'"'+(cur===s.id?' selected':'')+'>'+mark+s.n+'. '+esc(s.title)+'</option>';
      if(s.id==='s17') html+='<option value="reflect"'+(cur==='reflect'?' selected':'')+'>'+(cur==='reflect'?'▶ You are here · ':'')+'Personal Reflection and Prayer Focus (optional)</option>';
    });
    html+='</optgroup>';
  });
  html+='<optgroup label="Review"><option value="quiz"'+(cur==='quiz'?' selected':'')+'>'+(cur==='quiz'?'▶ You are here · ':(S.quiz.finished?'✓ ':''))+'Final Quiz</option></optgroup>';
  html+='<optgroup label="Libraries and My Work">'; Object.keys(LIBS).forEach(function(k){ html+='<option value="'+k+'"'+(cur===k?' selected':'')+'>'+(cur===k?'▶ You are here · ':'')+LIBS[k]+'</option>'; }); html+='</optgroup>';
  sel.innerHTML=html;
  var idx=ORDER.indexOf(cur);
  $('#here').textContent = 'You are here: '+titleOf(cur)+(BYID[cur]?' · Section '+BYID[cur].n+' of '+SECS.length:'');
  var prev=$('#prevBtn'), next=$('#nextBtn'), mid=$('#midBtn');
  prev.disabled = idx<=0 && !LIBS[cur]; next.disabled = idx===ORDER.length-1 || idx<0;
  if(LIBS[cur]){ prev.disabled=false; prev.textContent='Back'; } else prev.textContent='Previous';
  if(BYID[cur]){ mid.style.visibility='visible'; mid.textContent = S.done[cur] ? '✓ Complete' : 'Mark Complete'; mid.className = 'btn '+(S.done[cur]?'ghost':'gold'); }
  else mid.style.visibility='hidden';
}
var backTo='home';
function go(id, opts){
  stopAudio();
  if(LIBS[id] && !LIBS[S.screen]) backTo=S.screen;
  S.screen=id; if(BYID[id]) S.lastTeaching=id; if(id!=='home' && !LIBS[id]) S.resume=id; save();
  render(); window.scrollTo(0,0);
  var h=$('main h1, main h2'); if(h){ h.setAttribute('tabindex','-1'); h.focus({preventScroll:true}); }
  if(opts&&opts.autoplay&&BYID[id]&&hasAudio('teach-'+id)){ var p=$('.player[data-key="teach-'+id+'"]'); if(p) startAudio('teach-'+id,p,teachOpts(id)); }
}
function markDone(id){ if(!S.done[id]){ S.done[id]=true; save(true); toast('Section '+BYID[id].n+' marked complete'); } renderChrome(); var b=$('#doneState'); if(b) b.innerHTML=doneBadge(id); }
function doneBadge(id){ return S.done[id] ? '<span class="done-badge">✓ Section complete</span>' : '<span class="tag">Not yet complete. Finish the narration or tap Mark Complete.</span>'; }

/* ---------- screens ---------- */
function render(){
  applyTheme(); renderChrome();
  var m=$('#main'), id=S.screen, h='';
  if(id==='home') h=homeHTML(); else if(BYID[id]) h=sectionHTML(BYID[id]); else if(id==='reflect') h=reflectHTML();
  else if(id==='quiz') h=quizHTML(); else if(id==='print') h=printHTML(); else if(id==='audio') h=audioLibHTML(); else if(id==='posters') h=postersHTML();
  else if(id==='verses') h=versesHTML(); else if(id==='save') h=saveHTML(); else { S.screen='home'; h=homeHTML(); }
  m.innerHTML=h; wire(id);
}
function homeHTML(){
  var n=doneCount(), started = n>0 || Object.keys(S.quiz.ans).length || S.lastTeaching;
  var cont = S.resume || S.lastTeaching || 's01';
  return '<div class="eyebrow">L137 Deliverance Ministry International</div><h1>Deliverance from the Spirit of Leviathan</h1><div class="rule"></div>'+
   '<p class="muted">Session 1 · Pastor Kiky Ocansey</p>'+
   '<p class="opening">The following is an interactive study following a service held on Clubhouse by Pastor Kiky Ocansey.</p>'+
   '<div class="stack" style="margin:20px 0">'+
     (started? '<button class="btn block" type="button" data-go="'+cont+'">Continue Where I Left Off</button><div class="small muted" style="text-align:center">'+esc(titleOf(cont))+'</div><button class="btn ghost block" type="button" data-go="s01">Begin from Section 1</button>'
            : '<button class="btn block" type="button" data-go="s01">Begin</button>')+
   '</div>'+
   '<div class="card"><h3>How this workbook works</h3><ul>'+
     '<li>Each screen shows one part of the teaching, its recording, and one way to take part.</li>'+
     '<li>Use <b>Choose a Section</b> at the top to move to any part. A check mark shows the parts you have finished.</li>'+
     '<li>A section is counted when its recording finishes or when you tap <b>Mark Complete</b>.</li>'+
     '<li>Your place, answers and notes are kept on this phone. Use <b>Save My Work to My Phone</b> to keep a copy.</li>'+
   '</ul></div>'+
   '<div class="stack"><button class="btn ghost block" type="button" data-go="save">Save My Work to My Phone</button><button class="btn ghost block" type="button" data-go="print">Printable Library</button><button class="btn ghost block" type="button" data-go="audio">Audio Library</button></div>';
}
function scriptureCard(ref){
  return '<div class="scripture"><div class="ref">Scripture · '+esc(ref)+' · KJV</div>'+playerHTML('scr-'+ref,'Listen to '+ref,'voice-scripture')+'<p class="ktext">'+kjvHTML(ref)+'</p></div>';
}
function posterBlock(p){
  if(!p) return '';
  return '<div class="poster"><div class="kicker">Poster</div><img src="posters/'+p.id+'.png" alt="'+esc(p.title)+'. The full wording is below." loading="lazy" data-enlarge="posters/'+p.id+'.png">'+
   '<button class="btn ghost block enl" type="button" data-enlarge="posters/'+p.id+'.png">Tap to Enlarge</button>'+
   '<details class="ptxt"><summary>Read the poster wording as text</summary>'+posterText(p)+'</details></div>';
}
function posterText(p){
  if(p.scales) return '<p><b>'+esc(p.title)+'</b></p><ol>'+D.scales.map(function(s){return '<li>'+esc(s.name)+'</li>';}).join('')+'</ol><p>“and there are many more.” · Pastor Kiky Ocansey</p>';
  return '<p><b>'+esc(p.title)+'</b></p><ul>'+p.lines.map(function(l){return '<li>“'+esc(l[1])+'”</li>';}).join('')+'</ul><p>Pastor Kiky Ocansey</p>';
}
function teachOpts(id){ return { onEnded:function(){ markDone(id); showPausePrompt(id,true); }, onPause:function(){ showPausePrompt(id,false); } }; }
function showPausePrompt(id, ended){
  var nx = ORDER[ORDER.indexOf(id)+1];
  var w=document.createElement('div'); w.className='modal'; w.setAttribute('role','dialog'); w.setAttribute('aria-modal','true');
  w.innerHTML='<div class="in"><div class="kicker">A moment to take part</div><p>'+(ended?'This part of the teaching has finished.':'This is a natural pause in the teaching.')+'</p><div class="stack"><button class="btn block" type="button" data-x="act">Take Part in the Activity</button><button class="btn ghost block" type="button" data-x="cont">Continue Listening</button></div></div>';
  document.body.appendChild(w);
  w.onclick=function(e){ var x=e.target.getAttribute('data-x'); if(!x) return; w.remove();
    if(x==='act'){ var a=$('#activity'); if(a){ a.scrollIntoView({behavior:'smooth'}); a.focus&&a.focus(); } }
    if(x==='cont'){ if(ended){ if(nx) go(nx,{autoplay:true}); } else { var p=$('.player[data-key="teach-'+id+'"]'); if(p) startAudio('teach-'+id,p,teachOpts(id)); } } };
}
function origKey(id){ var n=parseInt(id.slice(1),10);
  if(n<=6) return 'orig-02'; if(n<=17) return 'orig-01'; if(n>=26&&n<=28) return 'orig-05'; if(n<=31) return 'orig-04'; return 'orig-06'; }
function origPlayer(id){ var k=origKey(id); if(!hasAudio(k)) return ''; var o=(window.ORIG||[]).filter(function(x){return x[0]===k;})[0];
  return playerHTML(k,'Listen: '+(o?o[1]:'Original recording')); }
function origLibHTML(){ var h=''; (window.ORIG||[]).forEach(function(o){ if(!hasAudio(o[0])) return; h+=playerHTML(o[0],o[1])+'<p class="small muted" style="margin:-6px 0 18px">'+esc(o[2])+'</p>'; }); return h; }
function sectionHTML(s){
  var h='<div class="eyebrow">'+esc(D.parts[s.part])+'</div><h2>'+s.n+'. '+esc(s.title)+'</h2><div class="rule"></div>'+
   '<div id="doneState">'+doneBadge(s.id)+'</div>'+
   (hasAudio('teach-'+s.id)? playerHTML('teach-'+s.id,'Listen to this part of the teaching') : '')+ origPlayer(s.id)+
   '<div class="passage"><div class="who">Pastor Kiky Ocansey · from the service</div>'+s.paras.map(function(p){return '<p>'+esc(p)+'</p>';}).join('')+'</div>';
  if(s.scripture.length && hasAudio('orig-03')) h+=playerHTML('orig-03','Listen: Scripture Meditation (KJV)');
  s.scripture.forEach(function(r){ h+=scriptureCard(r); });
  h+=posterBlock(s.poster);
  h+='<section class="activity" id="activity" tabindex="-1" aria-label="Take part">'+activityHTML(s)+'</section>';
  return h;
}
function activityHTML(s){
  var a=s.act, id=s.id;
  if(a.type==='recall'){
    var rv = S.recall[id] && S.recall[id].shown;
    return '<div class="kicker">Listen and recall</div><p><b>'+esc(a.q)+'</b></p>'+
      '<label class="sr" for="rc">Your answer</label><textarea id="rc" data-recall="'+id+'" placeholder="Type or say your answer first (optional)">'+esc((S.recall[id]&&S.recall[id].text)||'')+'</textarea>'+
      '<div class="row" style="margin-top:10px"><button class="btn" type="button" data-reveal="'+id+'">'+(rv?'Hide':'Tap to Reveal What Pastor Kiky Said')+'</button></div>'+
      (rv? '<div class="reveal">“'+esc(a.a)+'”<div class="src">Pastor Kiky Ocansey · '+esc(s.title)+'</div></div>':'' );
  }
  if(a.type==='verse'){
    return '<div class="kicker">Choose a verse to revisit</div><p>Save a verse to <b>My Verses</b>, or write a private note in your own words.</p>'+
      s.scripture.map(function(r){ return (D.kjv[r]||[]).map(function(v){ var ref=r.split(':')[0]+':'+v.v; var saved=S.verses.some(function(x){return x.ref===ref;});
        return '<div class="card" style="margin:10px 0"><div class="kicker">'+esc(ref)+' · KJV</div><p style="font-family:var(--serif);font-style:italic;margin:0 0 10px">'+esc(v.t)+'</p><button class="btn '+(saved?'ghost':'gold')+'" type="button" data-saveverse="'+esc(ref)+'" data-vt="'+esc(v.t)+'">'+(saved?'✓ Saved to My Verses':'Save to My Verses')+'</button></div>'; }).join(''); }).join('')+
      '<label for="note" class="kicker" style="display:block;margin-top:12px">My private note</label><textarea id="note" data-note="'+id+'" placeholder="Write in your own words (optional)">'+esc(S.notes[id]||'')+'</textarea>';
  }
  if(a.type==='pray') return prayHTML(s);
  if(a.type==='order') return orderHTML(s);
  if(a.type==='scales') return scalesHTML();
  return '';
}
function namesBoxHTML(id){
  var ns = S.names.length? S.names : [''];
  return '<div class="card" style="margin:10px 0"><div class="kicker">Optional</div>'+ns.map(function(n,i){ return '<label class="small" for="nm'+i+'">Name of child or loved one</label><input class="field" id="nm'+i+'" data-name="'+i+'" value="'+esc(n)+'" autocomplete="off" style="margin-bottom:8px">'; }).join('')+
   '<div class="row"><button class="btn ghost" type="button" data-addname="1">+ Add another name</button><button class="btn ghost" type="button" data-preview="'+id+'">Private Preview</button></div><div id="pv"></div>'+
   '<p class="small muted">Names stay on this phone and in any copy you choose to save.</p></div>';
}
function prayHTML(s){
  var a=s.act, id=s.id, i=Math.min(S.prayAt[id]||0, a.lines.length-1), done=(S.prayed[id]||[]);
  var nm=namesFor();
  return '<div class="kicker">Pray line by line</div><p class="small">From the service. Pray one line at a time.</p>'+(a.names?namesBoxHTML(id):'')+
   '<div class="qcount">Line '+(i+1)+' of '+a.lines.length+(done.indexOf(i)>=0?' · <span class="prayed-mark">✓ Prayed</span>':'')+'</div>'+
   '<div class="prayline">'+(a.names&&nm.length?'<div class="prayfor">I am praying for: '+nm.map(esc).join(', ')+'</div>':'')+'“'+esc(a.lines[i])+'”</div>'+
   playerHTML('pray-'+id+'-'+(i+1),'Listen to this line')+
   '<div class="row"><button class="btn ghost" type="button" data-replay="'+id+'">Replay</button><button class="btn gold" type="button" data-prayed="'+id+'">I Have Prayed This</button><button class="btn" type="button" data-praynext="'+id+'" '+(i>=a.lines.length-1?'disabled':'')+'>Next</button></div>'+
   (i>0?'<div class="row" style="margin-top:8px"><button class="btn ghost" type="button" data-prayprev="'+id+'">Previous line</button></div>':'')+
   '<p class="small muted" style="margin-top:10px">'+done.length+' of '+a.lines.length+' lines prayed.</p>';
}
function orderItems(s){ if(s.act.service) return D.serviceOrder.map(function(id){ return {k:id, t:BYID[id].title}; }); return s.act.items.map(function(t,i){ return {k:'i'+i, t:t}; }); }
function shuffled(arr, seed){ var a=arr.slice(), x=seed; for(var i=a.length-1;i>0;i--){ x=(x*9301+49297)%233280; var j=Math.floor(x/233280*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } if(a.every(function(v,i){return v===arr[i];})) a.push(a.shift()); return a; }
function orderHTML(s){
  var id=s.id, items=orderItems(s), keys=items.map(function(x){return x.k;}), map={}; items.forEach(function(x){map[x.k]=x.t;});
  var st=S.order[id]; if(!st){ st=S.order[id]={cur:shuffled(keys, id.charCodeAt(2)*31+7), checked:false}; save(); }
  return '<div class="kicker">Put it in order</div><p><b>'+esc(s.act.q)+'</b></p><p class="small muted">Use the arrows to move each step.</p><ol class="order-list">'+
    st.cur.map(function(k,i){ var cls = st.checked ? (k===keys[i]?'ok':'no') : ''; return '<li class="'+cls+'"><span class="t">'+(i+1)+'. '+(s.act.service?esc(map[k]):'“'+esc(map[k])+'”')+'</span><button type="button" aria-label="Move up" data-mv="'+id+'|'+i+'|-1" '+(i===0?'disabled':'')+'>↑</button><button type="button" aria-label="Move down" data-mv="'+id+'|'+i+'|1" '+(i===st.cur.length-1?'disabled':'')+'>↓</button></li>'; }).join('')+'</ol>'+
    '<div class="row"><button class="btn" type="button" data-checkorder="'+id+'">Check My Order</button>'+(st.checked?'<button class="btn ghost" type="button" data-showorder="'+id+'">Show the Order</button>':'')+'</div>'+
    (st.checked? '<p class="small" style="margin-top:8px">'+(st.cur.every(function(k,i){return k===keys[i];})?'<b>Well done. That is the order Pastor Kiky gave.</b>':'Green steps are in the right place.')+'</p>':'')+
    (s.act.service? '' : playerHTML('teach-'+id,'Replay that part of the recording'));
}
function scalesHTML(){
  var i=S.scaleAt||0, sc=D.scales[i], seen=S.scaleSeen[i];
  var body='';
  if(seen){
    body = sc.quote ? '<div class="reveal">“'+esc(sc.quote)+'”<div class="src">Pastor Kiky Ocansey · '+esc(BYID[sc.sec].title)+'</div></div>'
      : '<div class="reveal">“And what are their [scales]? Their [scales] are witchcraft. Their [scales] are anger. Their [scales] are rage. The [scales] of Leviathan are mockery, rebellion. Their [scales] are shame, control, arrogance. Their [scales] [boasting, cussing], lying, selfishness. The [scales] of Leviathan Unwilling to apologize, unforgiveness in your heart are the [scales] of [Leviathan], and there are many more.”<div class="src">Pastor Kiky Ocansey · Hindrances and the Scales of Leviathan</div></div>';
    if(sc.ref) body+='<div class="scripture"><div class="ref">Scripture · '+esc(sc.ref)+' · KJV</div><p class="ktext">'+kjvHTML(sc.ref)+'</p></div>';
  }
  return '<div class="kicker">Tap to reveal · The scales</div><div class="qcount">Scale '+(i+1)+' of '+D.scales.length+'</div><h3 style="margin-top:6px">'+esc(sc.name)+'</h3>'+
   '<p>What did Pastor Kiky say about this scale? Think about it first.</p><div class="row"><button class="btn" type="button" data-scalerev="1">'+(seen?'Hide':'Tap to Reveal')+'</button></div>'+body+
   '<div class="row" style="margin-top:12px"><button class="btn ghost" type="button" data-scale="-1" '+(i===0?'disabled':'')+'>Previous scale</button><button class="btn ghost" type="button" data-scale="1" '+(i===D.scales.length-1?'disabled':'')+'>Next scale</button></div>';
}
function reflectHTML(){
  var c=S.reflect.choice, r= c!=null ? D.reflect[c] : null;
  return '<div class="eyebrow">Optional · Part Two</div><h2>Personal Reflection and Prayer Focus</h2><div class="rule"></div>'+
   '<p>Choose one concern you would like to bring to God in prayer. Your choice guides the prayer below. It does not tell you what is causing your experience.</p>'+
   '<fieldset style="border:0;padding:0;margin:0"><legend class="kicker">Choose one</legend>'+
   D.reflect.map(function(x,i){ return '<label class="choice'+(c===i?' sel':'')+'"><input type="radio" name="rf" value="'+i+'" '+(c===i?'checked':'')+'><span>'+esc(x.label)+'</span></label>'; }).join('')+'</fieldset>'+
   (r? '<div class="panel"><div class="kicker">You chose</div><p><b>'+esc(r.label)+'</b></p></div>'+
     '<div class="panel gold"><div class="kicker">What Pastor Kiky taught</div><p>“'+esc(r.quote)+'”</p><button class="btn ghost" type="button" data-go="'+r.sec+'">Read Section '+BYID[r.sec].n+': '+esc(BYID[r.sec].title)+'</button></div>'+
     '<div class="panel ember"><div class="kicker">Pray this line from the service</div><p style="font-family:var(--serif);font-size:22px">“'+esc(r.prayer)+'”</p><button class="btn ghost" type="button" data-go="'+r.psec+'">Go to Section '+BYID[r.psec].n+': '+esc(BYID[r.psec].title)+'</button></div>'+
     '<label class="kicker" for="rfn">My private prayer (optional)</label><textarea id="rfn" data-rnote="1" placeholder="Write your own prayer if you wish">'+esc(S.reflect.note||'')+'</textarea>' : '');
}
function quizHTML(){
  var Q=D.quiz, q=S.quiz, i=Math.min(q.i||0,Q.length-1), it=Q[i], sel=q.ans[i], sub=q.sub[i];
  var answered=Object.keys(q.sub).length;
  var h='<div class="eyebrow">Review</div><h2>Final Quiz</h2><div class="rule"></div><div class="qcount">Question '+(i+1)+' of '+Q.length+'</div>'+
   '<p class="small muted">'+answered+' of '+Q.length+' answers checked'+(q.finished?' · Quiz submitted: '+q.score+' of '+Q.length:'')+'</p>'+
   '<div class="card"><p style="font-family:var(--serif);font-size:24px;line-height:1.35;margin-top:0"><b>'+esc(it.q)+'</b></p>'+
   playerHTML('quiz-q'+('0'+(i+1)).slice(-2),'Read Question and Choices')+
   '<fieldset style="border:0;padding:0;margin:0"><legend class="sr">Choices</legend>'+
   it.c.map(function(c,j){ var cls='choice'+(sel===j?' sel':''); if(sub){ if(j===it.a) cls+=' right'; else if(sel===j) cls+=' wrong'; }
     return '<label class="'+cls+'"><input type="radio" name="qc" value="'+j+'" '+(sel===j?'checked':'')+' '+(sub?'disabled':'')+'><span class="letter">'+LETTERS[j]+'.</span><span>'+esc(c)+'</span></label>'; }).join('')+'</fieldset>';
  if(!sub) h+='<button class="btn block" type="button" data-qsubmit="1" '+(sel==null?'disabled':'')+' style="margin-top:8px">Submit My Answer</button>';
  else {
    var right = sel===it.a;
    h+='<div class="reveal"><b>'+(right?'Correct.':'Not quite.')+' The answer is '+LETTERS[it.a]+'. '+esc(it.c[it.a])+'</b>'+
      (it.quote?'<p style="margin:.6em 0 0">“'+esc(it.quote)+'”</p><div class="src">Pastor Kiky Ocansey · '+esc(BYID[it.sec].title)+'</div>':'')+
      (it.kjv?'<div class="scripture" style="margin-bottom:0"><div class="ref">Scripture · '+esc(it.kjv)+' · KJV</div><p class="ktext">'+kjvHTML(it.kjv)+'</p></div>':'')+'</div>'+
      playerHTML('quiz-q'+('0'+(i+1)).slice(-2)+'-answer','Hear the Correct Answer and Explanation');
  }
  h+='</div><div class="row"><button class="btn ghost" type="button" data-qnav="-1" '+(i===0?'disabled':'')+'>Previous Question</button><button class="btn ghost" type="button" data-qnav="1" '+(i===Q.length-1?'disabled':'')+'>Next Question</button></div>';
  if(!q.finished) h+='<div class="card"><p><b>Submit the quiz</b> when you have checked all '+Q.length+' answers.</p><button class="btn gold block" type="button" data-qfinish="1" '+(answered<Q.length?'disabled':'')+'>Submit Quiz</button></div>';
  else h+='<div class="panel green"><div class="kicker">Quiz submitted</div><p>You answered '+q.score+' of '+Q.length+' correctly. You can review any question above.</p></div>';
  return h;
}
var PDFS=[
 ['Complete Teaching Text','The full teaching from the service, in order, with every Scripture in full KJV.','pdfs/Leviathan-S1-Complete-Teaching-Text.pdf'],
 ['Scripture Companion','Every Scripture from the service, written out in full KJV.','pdfs/Leviathan-S1-Scripture-Companion.pdf'],
 ['Declarations and Prayers','The prayers and declarations from the service, line by line, with optional name lines.','pdfs/Leviathan-S1-Declarations-and-Prayers.pdf'],
 ['Learner Workbook','Recall questions, reflection pages and the quiz, with the answer key at the back.','pdfs/Leviathan-S1-Learner-Workbook.pdf'],
 ['Poster Pack','All posters, one per page, with the wording printed large.','pdfs/Leviathan-S1-Poster-Pack.pdf']];
function printHTML(){
  return '<div class="eyebrow">Library</div><h2>Printable Library</h2><div class="rule"></div><p>Open or download any of these to print or keep on your phone.</p>'+
   PDFS.map(function(p){ return '<div class="lib-item"><div><div class="t">'+esc(p[0])+'</div><div class="small muted">'+esc(p[1])+'</div></div><a class="btn ghost" href="'+p[2]+'" target="_blank" rel="noopener" download>Open PDF</a></div>'; }).join('');
}
function audioItems(){
  var list=[]; SECS.forEach(function(s){ list.push(['teach-'+s.id, s.n+'. '+s.title, 'Teaching']); s.scripture.forEach(function(r){ list.push(['scr-'+r, r+' (KJV)', 'Scripture']); }); });
  D.quiz.forEach(function(q,i){ var n=('0'+(i+1)).slice(-2); list.push(['quiz-q'+n,'Quiz question '+(i+1)+' and choices','Quiz']); list.push(['quiz-q'+n+'-answer','Quiz answer '+(i+1)+' and explanation','Quiz']); });
  return list;
}
function audioLibHTML(){
  var items=audioItems(), avail=items.filter(function(x){return hasAudio(x[0]);});
  var h='<div class="eyebrow">Library</div><h2>Audio Library</h2><div class="rule"></div><div class="panel gold"><div class="kicker">Listen and pray aloud</div><p>The original recordings of this study. Every word is also written in the sections.</p></div>'+origLibHTML();
  items=items.filter(function(x){return hasAudio(x[0]);});
  var seen={};
  items.forEach(function(x){ if(seen[x[0]]) return; seen[x[0]]=1; var ok=hasAudio(x[0]);
    h+= ok ? playerHTML(x[0], x[2]+' · '+x[1]) : '<div class="lib-item"><div><div class="t">'+esc(x[1])+'</div><div class="small muted">'+esc(x[2])+'</div></div><span class="tag">Recording coming soon</span></div>'; });
  return h;
}
function postersHTML(){ var h='<div class="eyebrow">Library</div><h2>Posters</h2><div class="rule"></div>'; SECS.forEach(function(s){ if(s.poster) h+='<h3>'+esc(s.poster.title)+'</h3>'+posterBlock(s.poster); }); return h; }
function versesHTML(){
  var h='<div class="eyebrow">My Work</div><h2>My Verses and Notes</h2><div class="rule"></div>';
  h+= S.verses.length? S.verses.map(function(v,i){ return '<div class="scripture"><div class="ref">'+esc(v.ref)+' · KJV</div><p class="ktext">'+esc(v.t)+'</p><button class="btn ghost" type="button" data-unverse="'+i+'">Remove</button></div>'; }).join('') : '<p class="muted">No verses saved yet. Look for “Choose a verse to revisit” in the sections.</p>';
  var notes=Object.keys(S.notes).filter(function(k){return S.notes[k];});
  h+='<h3>My private notes</h3>'+(notes.length? notes.map(function(k){ return '<div class="card"><div class="kicker">'+esc(titleOf(k))+'</div><p style="white-space:pre-wrap;margin:0">'+esc(S.notes[k])+'</p></div>'; }).join('') : '<p class="muted">No notes yet.</p>');
  h+='<label class="kicker" for="jr">My journal (optional)</label><textarea id="jr" data-journal="1" placeholder="Write anything you want to remember">'+esc(S.journal||'')+'</textarea>';
  return h;
}
function summaryList(st){
  var done=SECS.filter(function(s){return st.done&&st.done[s.id];}).length;
  var prayed=0; Object.keys(st.prayed||{}).forEach(function(k){ prayed+=(st.prayed[k]||[]).length; });
  var notes=Object.keys(st.notes||{}).filter(function(k){return st.notes[k];}).length + (st.journal?1:0) + (st.reflect&&st.reflect.note?1:0);
  var recalls=Object.keys(st.recall||{}).filter(function(k){return st.recall[k]&&st.recall[k].text;}).length;
  var aud=Object.keys(st.audioPos||{}).filter(function(k){return st.audioPos[k]>0;}).length;
  var names=(st.names||[]).filter(function(n){return n&&n.trim();}).length;
  return '<ul class="saved"><li>Current place: '+esc(titleOf(st.resume||st.lastTeaching||'home'))+'</li><li>Teaching sections complete: '+done+' of '+SECS.length+'</li>'+
    '<li>Quiz: '+Object.keys((st.quiz||{}).ans||{}).length+' answers chosen, '+Object.keys((st.quiz||{}).sub||{}).length+' checked'+((st.quiz||{}).finished?', submitted ('+st.quiz.score+' of '+D.quiz.length+')':'')+'; on question '+(((st.quiz||{}).i||0)+1)+'</li>'+
    '<li>Prayer lines marked as prayed: '+prayed+'</li><li>Names of loved ones: '+names+'</li><li>Personal responses and notes: '+(notes+recalls)+'</li><li>Saved verses: '+(st.verses||[]).length+'</li><li>Audio positions remembered: '+aud+'</li>'+
    '<li>Display: '+(st.theme==='night'?'Night':'Day')+' mode</li></ul>';
}
function saveHTML(){
  return '<div class="eyebrow">My Work</div><h2>Save, Restore and Offline</h2><div class="rule"></div>'+
   '<div class="card"><h3>Kept automatically</h3><p class="small">Your work is remembered on '+esc(store.kind)+'.'+(store.persistent?'':' To keep it, use Save My Work to My Phone below.')+'</p>'+summaryList(S)+'</div>'+
   '<div class="card"><h3>Save My Work to My Phone</h3><p class="small">Downloads a dated copy of your work, including any names and notes. Keep it private.</p><button class="btn block" type="button" data-savefile="1">Save My Work to My Phone</button><div id="saveOut"></div></div>'+
   '<div class="card"><h3>Restore Saved Work</h3><p class="small">Open a copy you saved earlier to continue where you left off.</p><label class="btn ghost block" for="restoreFile" style="cursor:pointer">Restore Saved Work</label><input id="restoreFile" type="file" accept=".json,application/json" class="sr"><div id="restoreOut"></div></div>'+
   '<div class="card"><h3>Save for Offline Study</h3><p class="small">Keeps the lesson text, posters, printables and approved recordings on this phone so you can study without a connection.</p><button class="btn block" type="button" data-offline="1">Save for Offline Study</button><div id="offOut"></div></div>'+
   '<div class="card"><h3>Text size</h3><div class="row"><button class="btn ghost" type="button" data-fs="-1">Smaller</button><button class="btn ghost" type="button" data-fs="1">Larger</button></div></div>'+
   '<div class="card"><h3>Start Over</h3><p class="small">Clears your progress, answers, names and notes from this phone. Copies you downloaded are not affected.</p><button class="btn warn block" type="button" data-startover="1">Start Over</button></div>';
}

/* ---------- wiring ---------- */
function wire(id){
  var m=$('#main');
  var opts={}; if(BYID[id]){ opts['teach-'+id]=teachOpts(id); }
  wirePlayers(m, opts);
  m.onclick=function(e){
    var t=e.target.closest('button, [data-enlarge]'); if(!t) return;
    var d=t.dataset;
    if(d.go){ go(d.go); return; }
    if(d.enlarge){ enlarge(d.enlarge); return; }
    if(d.reveal){ var r=S.recall[d.reveal]||{}; r.shown=!r.shown; S.recall[d.reveal]=r; save(); rerenderActivity(); return; }
    if(d.saveverse){ var ix=-1; S.verses.forEach(function(v,i){ if(v.ref===d.saveverse) ix=i; }); if(ix>=0) S.verses.splice(ix,1); else { S.verses.push({ref:d.saveverse,t:d.vt}); toast('Saved to My Verses'); } save(); rerenderActivity(); return; }
    if(d.unverse){ S.verses.splice(+d.unverse,1); save(); render(); return; }
    if(d.addname){ collectNames(); S.names.push(''); save(); rerenderActivity(); var ins=$$('[data-name]'); if(ins.length) ins[ins.length-1].focus(); return; }
    if(d.preview){ collectNames(); var nm=namesFor(), s=BYID[d.preview], line=s.act.lines[Math.min(S.prayAt[d.preview]||0,s.act.lines.length-1)];
      $('#pv').innerHTML = nm.length? '<div class="panel" style="margin-top:10px"><div class="kicker">Private preview</div><div class="prayfor">I am praying for: '+nm.map(esc).join(', ')+'</div><p style="font-family:var(--serif)">“'+esc(line)+'”</p><p class="small muted">The declaration wording stays exactly as Pastor Kiky gave it.</p></div>' : '<p class="small">No names entered. The declaration will be shown on its own.</p>'; return; }
    if(d.prayed){ collectNames(); var arr=S.prayed[d.prayed]||[], at=S.prayAt[d.prayed]||0; if(arr.indexOf(at)<0) arr.push(at); S.prayed[d.prayed]=arr; save(); rerenderActivity(); return; }
    if(d.praynext){ collectNames(); S.prayAt[d.praynext]=(S.prayAt[d.praynext]||0)+1; save(); rerenderActivity(); maybeNamePause(d.praynext); return; }
    if(d.prayprev){ collectNames(); S.prayAt[d.prayprev]=Math.max(0,(S.prayAt[d.prayprev]||0)-1); save(); rerenderActivity(); return; }
    if(d.replay){ var k='pray-'+d.replay+'-'+((S.prayAt[d.replay]||0)+1), p=$('.player[data-key="'+k+'"]'); if(hasAudio(k)&&p){ AU.currentTime=0; S.audioPos[k]=0; startAudio(k,p,{}); } else { var pl=$('.prayline'); if(pl){ pl.style.outline='3px solid var(--gold-light)'; setTimeout(function(){pl.style.outline='';},900);} toast('Recording coming soon. Read the line aloud.'); } return; }
    if(d.mv){ var a=d.mv.split('|'), st=S.order[a[0]], i=+a[1], j=i+(+a[2]); var tmp=st.cur[i]; st.cur[i]=st.cur[j]; st.cur[j]=tmp; st.checked=false; save(); rerenderActivity(); return; }
    if(d.checkorder){ S.order[d.checkorder].checked=true; save(); rerenderActivity(); return; }
    if(d.showorder){ var s2=BYID[d.showorder]; S.order[d.showorder].cur=orderItems(s2).map(function(x){return x.k;}); S.order[d.showorder].checked=true; save(); rerenderActivity(); return; }
    if(d.scalerev){ S.scaleSeen[S.scaleAt]=!S.scaleSeen[S.scaleAt]; save(); rerenderActivity(); return; }
    if(d.scale){ S.scaleAt=Math.max(0,Math.min(D.scales.length-1,(S.scaleAt||0)+(+d.scale))); save(); rerenderActivity(); return; }
    if(d.qsubmit){ S.quiz.sub[S.quiz.i]=true; save(true); stopAudio(); render(); return; }
    if(d.qnav){ stopAudio(); S.quiz.i=Math.max(0,Math.min(D.quiz.length-1,(S.quiz.i||0)+(+d.qnav))); save(true); render(); return; }
    if(d.qfinish){ var sc=0; D.quiz.forEach(function(q,i){ if(S.quiz.ans[i]===q.a) sc++; }); S.quiz.finished=true; S.quiz.score=sc; save(true); toast('Quiz submitted'); render(); return; }
    if(d.savefile){ saveFile(); return; }
    if(d.offline){ saveOffline(); return; }
    if(d.fs){ S.fs=Math.max(16,Math.min(26,(S.fs||19)+(+d.fs)*2)); save(); applyTheme(); return; }
    if(d.startover){ confirmStartOver(); return; }
  };
  m.oninput=function(e){ var t=e.target, d=t.dataset;
    if(d.recall){ var r=S.recall[d.recall]||{}; r.text=t.value; S.recall[d.recall]=r; save(); }
    if(d.note){ S.notes[d.note]=t.value; save(); }
    if(d.rnote){ S.reflect.note=t.value; save(); }
    if(d.journal){ S.journal=t.value; save(); }
    if(d.name!=null){ collectNames(); save(); }
  };
  m.onchange=function(e){ var t=e.target;
    if(t.name==='qc'){ S.quiz.ans[S.quiz.i]=+t.value; save(true); $$('.choice',m).forEach(function(c){ c.classList.toggle('sel', $('input',c).checked); }); var b=$('[data-qsubmit]'); if(b) b.disabled=false; }
    if(t.name==='rf'){ S.reflect.choice=+t.value; save(); render(); }
    if(t.id==='restoreFile' && t.files && t.files[0]) restoreFile(t.files[0]);
  };
}
function collectNames(){ var ins=$$('[data-name]'); if(ins.length) S.names = ins.map(function(i){ return i.value; }); }
function rerenderActivity(){ var s=BYID[S.screen], box=$('#activity'); if(!s||!box) return; stopAudio(); box.innerHTML=activityHTML(s); wirePlayers(box,{}); }
function maybeNamePause(id){ var s=BYID[id]; if(s&&s.act.names&&namesFor().length){ showNamePause(function(){}); } }
function enlarge(src){
  var w=document.createElement('div'); w.className='lightbox'; w.setAttribute('role','dialog'); w.setAttribute('aria-modal','true'); w.setAttribute('aria-label','Enlarged poster');
  var z=1;
  w.innerHTML='<div class="lb-top"><button type="button" data-z="-1">Smaller</button><button type="button" data-z="1">Larger</button><button type="button" data-z="0">Close</button></div><div class="lb-body"><img alt="Enlarged poster" src="'+src+'"></div>';
  document.body.appendChild(w); var img=$('img',w); function size(){ img.style.width=(Math.min(window.innerWidth,900)*z)+'px'; } size();
  w.onclick=function(e){ var b=e.target.getAttribute('data-z'); if(b==null) return; if(b==='0'){ w.remove(); return; } z=Math.max(1,Math.min(3,z+(+b)*0.5)); size(); };
  $('button[data-z="0"]',w).focus();
  document.addEventListener('keydown',function esc(e){ if(e.key==='Escape'){ w.remove(); document.removeEventListener('keydown',esc);} });
}
function saveFile(){
  collectNames(); save(true);
  var payload={app:APP_ID, kind:'learner-work', version:2, savedAt:new Date().toISOString(), site:SITE, work:S};
  var blob=new Blob([JSON.stringify(payload,null,1)],{type:'application/json'}), name='L137-Leviathan-My-Work-'+today()+'.json';
  try{ var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); },1500); }catch(e){}
  $('#saveOut').innerHTML='<div class="panel green"><div class="kicker">Saved</div><p class="small">File: <b>'+esc(name)+'</b>. On iPhone, look in Files › Downloads. On Android, look in Downloads.</p><p class="small"><b>This copy contains:</b></p>'+summaryList(S)+'</div>';
}
function restoreFile(f){
  var r=new FileReader();
  r.onload=function(){ var out=$('#restoreOut');
    try{ var p=JSON.parse(r.result); if(!p||p.app!==APP_ID||!p.work) throw new Error('x');
      var w=Object.assign(fresh(), p.work); w.v=2; S=w; S.screen='save'; save(true); applyTheme(); render(); out=$('#restoreOut');
      out.innerHTML='<div class="panel green"><div class="kicker">Restored</div><p class="small">Saved on '+esc(new Date(p.savedAt).toLocaleString())+'. <b>Restored:</b></p>'+summaryList(S)+'<button class="btn block" type="button" data-go="'+(S.resume||S.lastTeaching||'s01')+'">Continue Where I Left Off</button></div>';
    }catch(e){ out.innerHTML='<div class="panel ember"><p class="small">This file is not a saved copy of this workbook. Please choose the file named L137-Leviathan-My-Work.</p></div>'; }
  };
  r.readAsText(f);
}
function offlineList(){
  var core=['./','index.html','styles.css','app.js','data.js','audio-manifest.js','fonts/DMSans-400.ttf','fonts/DMSans-400i.ttf','fonts/DMSans-500.ttf','fonts/DMSans-700.ttf','fonts/SourceSerif4-400.ttf','fonts/SourceSerif4-400i.ttf','fonts/SourceSerif4-600.ttf','fonts/SourceSerif4-700.ttf'];
  var posters=[]; SECS.forEach(function(s){ if(s.poster) posters.push('posters/'+s.poster.id+'.png'); });
  var pdfs=PDFS.map(function(p){return p[2];});
  var aud=Object.keys(A).map(function(k){return A[k].src;}).filter(Boolean);
  return {core:core, posters:posters, pdfs:pdfs, audio:aud};
}
function saveOffline(){
  var out=$('#offOut');
  if(!('caches' in window)){ out.innerHTML='<div class="panel ember"><p class="small">Offline saving is not available in this browser. Open the workbook in Safari or Chrome at '+esc(SITE)+'.</p></div>'; return; }
  out.innerHTML='<p class="small">Saving…</p>';
  var L=offlineList(), all=L.core.concat(L.posters,L.pdfs,L.audio), results=[];
  if('serviceWorker' in navigator){ try{ navigator.serviceWorker.register('sw.js'); }catch(e){} }
  caches.open('l137-leviathan-s1-offline').then(function(c){
    return Promise.all(all.map(function(u){ return fetch(u,{cache:'reload'}).then(function(res){ if(!res.ok) throw 0; var len=+res.headers.get('content-length')||0; return c.put(u,res.clone()).then(function(){ results.push([u,true,len]); }); }).catch(function(){ results.push([u,false,0]); }); }));
  }).then(function(){
    var ok=results.filter(function(x){return x[1];}), bad=results.filter(function(x){return !x[1];});
    function grp(lbl,arr){ var r=arr.map(function(u){ var x=results.filter(function(y){return y[0]===u;})[0]; return x&&x[1]; }); return '<li>'+lbl+': '+r.filter(Boolean).length+' of '+arr.length+' saved</li>'; }
    var kb=Math.round(ok.reduce(function(a,x){return a+x[2];},0)/1024);
    S.offlineSavedAt=new Date().toISOString(); save();
    out.innerHTML='<div class="panel green"><div class="kicker">Saved for offline study</div><ul class="saved">'+grp('Lesson text and app files',L.core)+grp('Posters',L.posters)+grp('Printable PDFs',L.pdfs)+'<li>Approved recordings: '+L.audio.length+(L.audio.length?'':' (none approved yet; recordings will be added when ready)')+'</li></ul><p class="small">About '+kb+' KB saved on this phone.</p>'+(bad.length?'<p class="small">Not saved: '+bad.map(function(x){return esc(x[0]);}).join(', ')+'</p>':'')+'</div>';
  }).catch(function(){ out.innerHTML='<div class="panel ember"><p class="small">Offline saving could not finish here. Open the workbook directly at '+esc(SITE)+' and try again.</p></div>'; });
}
function confirmStartOver(){
  var w=document.createElement('div'); w.className='modal'; w.setAttribute('role','dialog'); w.setAttribute('aria-modal','true');
  w.innerHTML='<div class="in"><h3>Start over?</h3><p>This clears your progress, quiz answers, prayer checks, names, notes and saved verses from this phone. Copies you downloaded are not affected.</p><div class="stack"><button class="btn warn block" type="button" data-y="1">Yes, Clear My Work</button><button class="btn ghost block" type="button" data-y="0">Cancel</button></div></div>';
  document.body.appendChild(w); $('[data-y="0"]',w).focus();
  w.onclick=function(e){ var y=e.target.getAttribute('data-y'); if(y==null) return; w.remove(); if(y==='1'){ stopAudio(); var th=S.theme; S=fresh(); S.theme=th; store.del(KEY); save(true); toast('Your work has been cleared'); go('home'); } };
}

/* ---------- boot ---------- */
function boot(){
  $('#chooser').onchange=function(e){ go(e.target.value); };
  $('#themeBtn').onclick=function(){ S.theme = S.theme==='night'?'day':'night'; save(); applyTheme(); };
  $('#prevBtn').onclick=function(){ var cur=S.screen; if(LIBS[cur]){ go(backTo||'home'); return; } var i=ORDER.indexOf(cur); if(i>0) go(ORDER[i-1]); };
  $('#nextBtn').onclick=function(){ var i=ORDER.indexOf(S.screen); if(i>=0&&i<ORDER.length-1) go(ORDER[i+1]); };
  $('#midBtn').onclick=function(){ var id=S.screen; if(BYID[id]) markDone(id); };
  $('#menuBtn').onclick=openMenu;
  if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost')){ try{ navigator.serviceWorker.register('sw.js').catch(function(){}); }catch(e){} }
  if(S.screen && S.screen!=='home'){ if(!LIBS[S.screen]) S.resume=S.screen; S.screen='home'; }
  render();
}
function openMenu(){
  var w=document.createElement('div'); w.className='drawer'; w.setAttribute('role','dialog'); w.setAttribute('aria-modal','true'); w.setAttribute('aria-label','Menu');
  var items=[['home','Welcome'],[S.resume||S.lastTeaching||'s01','Continue Where I Left Off'],['quiz','Final Quiz'],['reflect','Personal Reflection and Prayer Focus'],['print','Printable Library'],['audio','Audio Library'],['posters','Posters'],['verses','My Verses and Notes'],['save','Save My Work to My Phone'],['save','Restore Saved Work'],['save','Save for Offline Study'],['save','Start Over']];
  w.innerHTML='<div class="in"><div class="row" style="justify-content:space-between;align-items:center"><h3 style="margin:0">Menu</h3><button class="icon-btn" type="button" data-close="1">Close</button></div>'+items.map(function(x){ return '<button class="mi" type="button" data-to="'+x[0]+'">'+esc(x[1])+'</button>'; }).join('')+'</div>';
  document.body.appendChild(w); $('[data-close]',w).focus();
  w.onclick=function(e){ if(e.target===w||e.target.getAttribute('data-close')){ w.remove(); return; } var t=e.target.getAttribute('data-to'); if(t){ w.remove(); go(t); } };
}
window.__lev = { state:function(){return S;}, store:store, au:function(){return {paused:AU.paused,t:AU.currentTime,src:AU.src};} };
boot();
})();
