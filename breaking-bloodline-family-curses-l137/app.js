(function(){
'use strict';
var KEY='l137-bbfc-20261007';
var LANGS=[{code:'en',name:'English (Original — Pastor Kiki Ocansey)'},{code:'sw',name:'Kiswahili — translation coming soon'},{code:'tw',name:'Twi — translation coming soon'},{code:'fr',name:'Français — traduction à venir'},{code:'es',name:'Español — traducción próximamente'},{code:'pt',name:'Português — tradução em breve'}];

/* ---------- storage with in-memory fallback ---------- */
var mem={};var store=(function(){try{return null;}catch(e){return null;}})();
function load(){try{return JSON.parse((store?store.getItem(KEY):mem[KEY])||'{}');}catch(e){return {};}}
function save(){var o={theme:S.theme,scale:S.scale,step:S.step,rate:S.rate,reps:S.reps,pauseMode:S.pauseMode,autoLen:S.autoLen,fixedSec:S.fixedSec,lr:S.lr,ann:S.ann,cues:S.cues,voice:S.voice,lang:S.lang,lastMode:S.lastMode,inProgress:S.inProgress};var j=JSON.stringify(o);try{if(store)store.setItem(KEY,j);else mem[KEY]=j;}catch(e){mem[KEY]=j;}}

var saved=load();
var S={theme:saved.theme||'day',scale:saved.scale||1,step:saved.step||0,rate:saved.rate||1,reps:saved.reps||1,pauseMode:saved.pauseMode||'auto',autoLen:saved.autoLen||'normal',fixedSec:saved.fixedSec||10,lr:saved.lr!==false,ann:saved.ann!==false,cues:saved.cues!==false,voice:saved.voice||'',lang:saved.lang||'en',lastMode:saved.lastMode||'',inProgress:!!saved.inProgress};
var C=window.L137_CONTENT[S.lang]||window.L137_CONTENT.en;
var STEPS=C.steps,N=STEPS.length;
if(S.step>=N)S.step=0;
function setHash(){try{history.replaceState(null,'',location.pathname+location.search+(S.inProgress||S.step>0?'#p='+(S.step+1):''));}catch(e){}}
(function(){var m=/#p=(\d+)/.exec(location.hash);if(m){var k=Math.min(N,Math.max(1,+m[1]))-1;S.step=k;S.inProgress=k>0;}})();

var $=function(s,r){return (r||document).querySelector(s);};var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));};
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function toast(m){var t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(function(){t.classList.remove('show');},2600);}

/* ---------- theme & size ---------- */
var SIZES=[{k:0.88,l:'A−'},{k:1,l:'A'},{k:1.15,l:'A+'},{k:1.32,l:'A++'},{k:1.55,l:'EXTRA LARGE'}];
function applyTheme(){document.documentElement.setAttribute('data-theme',S.theme);$('#dayBtn').setAttribute('aria-pressed',S.theme==='day');$('#nightBtn').setAttribute('aria-pressed',S.theme==='night');var m=document.querySelector('meta[name=theme-color]');if(m)m.content=S.theme==='night'?'#120E0B':'#8E1B22';}
function applyScale(){document.documentElement.style.setProperty('--scale',S.scale);renderSettings();}
$('#dayBtn').onclick=function(){S.theme='day';applyTheme();save();};
$('#nightBtn').onclick=function(){S.theme='night';applyTheme();save();};
function sizeIdx(){var b=0;SIZES.forEach(function(s,i){if(Math.abs(s.k-S.scale)<Math.abs(SIZES[b].k-S.scale))b=i;});return b;}
$('#aMinus').onclick=function(){S.scale=SIZES[Math.max(0,sizeIdx()-1)].k;applyScale();save();};
$('#aPlus').onclick=function(){S.scale=SIZES[Math.min(SIZES.length-1,sizeIdx()+1)].k;applyScale();save();};
$('#aReset').onclick=function(){S.scale=1;applyScale();save();};

/* ---------- sound cues (Web Audio, gentle) ---------- */
var AC=null;function ac(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(e){}}if(AC){watchAC();if(AC.state==='suspended'||AC.state==='interrupted'){try{AC.resume();}catch(e){}}}return AC;}
function tone(f,start,dur,vol){var a=ac();if(!a)return;var o=a.createOscillator(),g=a.createGain();o.type='sine';o.frequency.value=f;var t=a.currentTime+start;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol||.11,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+dur+.05);}
var CUES={scripture:function(){tone(659,0,1.3);tone(988,0,1.1,.05);},decl:function(){tone(392,0,.5);tone(523,.18,.8);},turn:function(){tone(880,0,.35,.09);},next:function(){tone(523,0,.4,.07);tone(659,.12,.5,.06);},done:function(){tone(523,0,1.2);tone(659,.2,1.2);tone(784,.4,1.6);tone(1047,.6,1.8,.06);}};
function playCue(k){if(S.cues&&CUES[k])try{CUES[k]();}catch(e){}}

/* ---------- speech ---------- */
var SS=window.speechSynthesis,hasTTS=!!(SS&&window.SpeechSynthesisUtterance);var VOICES=[];
function loadVoices(){if(!hasTTS)return;VOICES=SS.getVoices().filter(function(v){return /^en/i.test(v.lang);});var sel=$('#voiceSel');sel.innerHTML='<option value="">Automatic (best English voice)</option>'+VOICES.map(function(v){return '<option value="'+esc(v.name)+'"'+(v.name===S.voice?' selected':'')+'>'+esc(v.name)+' ('+v.lang+')</option>';}).join('');}
if(hasTTS){loadVoices();if('onvoiceschanged' in SS)SS.onvoiceschanged=loadVoices;}
$('#voiceSel').onchange=function(){S.voice=this.value;save();};
function pickVoice(){if(!VOICES.length)return null;if(S.voice){var v=VOICES.find(function(x){return x.name===S.voice;});if(v)return v;}var pref=['Samantha','Google US English','Microsoft Aria','Microsoft Jenny','Daniel','Karen','Google UK English Female'];for(var i=0;i<pref.length;i++){var m=VOICES.find(function(x){return x.name.indexOf(pref[i])>-1;});if(m)return m;}return VOICES.find(function(x){return x.localService;})||VOICES[0];}
function chunk(text){var parts=String(text).replace(/\s+/g,' ').trim().match(/[^.!?;:]+[.!?;:]*\s*/g)||[text];var out=[];parts.forEach(function(p){p=p.trim();if(!p)return;if(p.length<=200){out.push(p);return;}var sub=p.split(/,\s+/),cur='';sub.forEach(function(s,i){var add=s+(i<sub.length-1?',':'');if((cur+' '+add).length>180&&cur){out.push(cur.trim());cur=add;}else cur+=' '+add;});if(cur.trim())out.push(cur.trim());});return out;}
function words(t){return String(t).trim().split(/\s+/).length;}

/* ---------- pause length ---------- */
var AUTO={short:{k:.42,b:2,min:4},normal:{k:.6,b:3,min:6},long:{k:.85,b:4,min:9}};
function turnMs(w){if(S.pauseMode==='fixed')return S.fixedSec*1000;var a=AUTO[S.autoLen];return Math.max(a.min,Math.round(w*a.k+a.b))*1000;}

/* ---------- build the audio ops for a step ---------- */
function label(st){if(st.type==='instruction')return 'PROPHETIC INSTRUCTION '+st.n+' of '+st.of;if(st.type==='scripture')return 'SCRIPTURE '+st.n+' of '+st.of;if(st.type==='declaration')return (st.n===st.of?'FINAL ':'')+'DECLARATION '+st.n+' of '+st.of;if(st.type==='deut')return 'DECLARE DEUTERONOMY 28 · '+st.n+' of '+st.of;return 'THANKSGIVING';}
function buildOps(i,mode,fromPrev){var st=STEPS[i],o=[],A=S.ann;var auto=!isCard(mode);var noTurn=(mode==='listen'||mode==='cardListen');
  function say(t,kind,rep){chunk(t).forEach(function(c){o.push({t:'say',text:c,kind:kind||'content',rep:rep});});}
  if(st.type==='instruction'){o.push({t:'cue',k:'next'});if(A)say(st.n===1?'Prophetic direction. Instruction '+st.n+'.':'Instruction '+st.n+'.','announce');say(st.speak);o.push({t:'wait',kind:'gap',ms:1400});}
  else if(st.type==='scripture'){o.push({t:'cue',k:'scripture'});if(A)say('Scripture.','announce');say(st.speakRef,'announce');say(st.speak);o.push({t:'wait',kind:'reflect',ms:2600});}
  else if(st.type==='declaration'||st.type==='deut'){
    var reps=noTurn?1:S.reps,turn=!noTurn&&S.lr;
    o.push({t:'cue',k:'decl'});
    if(A){var ann='';if(st.type==='deut'){ann=(st.n===1?'Pour the Blood of Jesus on the ground, and declare Deuteronomy 28 over your life. ':'')+st.speakRef;}
      else{if(st.action)ann='Prophetic action. As you pour, declare. ';ann+=(st.n===st.of?'Final declaration.':(auto&&fromPrev&&st.n>1?'Next declaration. Number '+st.n+'.':'Declaration '+st.n+'.'));}
      say(ann,'announce');if(turn)say('Repeat after me.','announce');}
    for(var r=1;r<=reps;r++){if(r>1&&A)say('Again.','announce',r);say(st.speak,'content',r);
      if(turn){o.push({t:'cue',k:'turn'});if(A)say('Your turn.','announce',r);o.push({t:'wait',kind:'turn',w:words(st.speak),rep:r,reps:reps});}
      else if(r<reps)o.push({t:'wait',kind:'gap',ms:1200});}
    if(!turn)o.push({t:'wait',kind:'gap',ms:1500});
  }
  else if(st.type==='thanks'){o.push({t:'cue',k:'next'});say(st.speak);o.push({t:'wait',kind:'gap',ms:1200});}
  return o;}

/* ---------- playback engine ---------- */
function isCard(m){return m==='card'||m==='cardListen';}
var E={mode:null,step:0,ops:[],op:0,playing:false,paused:false,tok:0,timer:null,watch:null,waitLeft:null,waitTotal:null,waitStart:0,end:null,custom:null,curRep:1,curReps:1};
function clearTimers(){clearTimeout(E.timer);clearTimeout(E.watch);clearInterval(E.tick);}
function hush(){E.tok++;clearTimers();if(hasTTS){try{SS.cancel();}catch(e){}}}
function start(mode,i,opts){opts=opts||{};hush();ac();E.mode=mode;E.custom=opts.custom||null;E.end=opts.end==null?(isCard(mode)?i:N-1):opts.end;E.step=i;E.ops=E.custom?E.custom:buildOps(i,mode,false);E.op=0;E.playing=true;E.paused=false;E.waitLeft=null;
  if(!E.custom){S.step=i;S.lastMode=mode;S.inProgress=true;save();setHash();}
  if(!isCard(mode))wake(true);
  render();setTimeout(run,60);}
function run(){if(!E.playing||E.paused)return;
  if(E.op>=E.ops.length){return stepDone();}
  var op=E.ops[E.op],my=++E.tok;
  if(op.rep){E.curRep=op.rep;}
  if(op.t==='cue'){playCue(op.k);E.timer=setTimeout(function(){if(my!==E.tok)return;E.op++;run();},S.cues?420:30);return;}
  if(op.t==='wait'){var total=op.kind==='turn'?turnMs(op.w):op.ms;if(E.waitLeft==null){E.waitTotal=total;E.waitLeft=total;}E.waitStart=Date.now();showTurn(op);
    E.tick=setInterval(function(){updTurn();},250);
    E.timer=setTimeout(function(){if(my!==E.tok)return;finishWait();},E.waitLeft);return;}
  if(op.t==='say'){status(op.kind==='announce'?'🔊 '+op.text:(op.rep&&repsOf()>1?'🔊 Speaking · '+op.rep+' of '+repsOf():'🔊 Speaking…'));hideTurn();
    if(!hasTTS){var est=Math.max(1500,op.text.length*65/S.rate);E.timer=setTimeout(function(){if(my!==E.tok)return;E.op++;run();},est);return;}
    var u=new SpeechSynthesisUtterance(op.text);var v=pickVoice();if(v){u.voice=v;u.lang=v.lang;}else u.lang='en-US';u.rate=S.rate;u.pitch=1;u.volume=1;
    var done=false;function fin(){if(done||my!==E.tok)return;done=true;clearTimeout(E.watch);E.op++;E.timer=setTimeout(run,op.kind==='announce'?220:120);}
    u.onend=fin;u.onerror=function(ev){if(done||my!==E.tok)return;var er=ev&&ev.error;if(er==='interrupted'||er==='canceled'||er==='audio-busy'||er==='audio-hardware'){interrupted('The audio was interrupted (for example by a phone call or another app).');return;}fin();};
    var est2=(op.text.length/13)/S.rate*1000*1.9+3500;function arm(){E.watch=setTimeout(function(){if(my!==E.tok||done)return;if(SS.speaking&&!SS.paused){arm();return;}if(document.hidden){interrupted('The prayer paused while your screen was off or another app was open.');return;}fin();},est2);}arm();
    try{if(SS.paused)SS.resume();SS.speak(u);}catch(e){fin();}return;}
  E.op++;run();}
function repsOf(){var m=0;E.ops.forEach(function(o){if(o.reps)m=o.reps;});return m||1;}
function finishWait(){clearInterval(E.tick);E.waitLeft=null;hideTurn();E.op++;run();}
function stepDone(){if(E.custom){E.playing=false;E.custom=null;status('✔️ Finished');render();return;}
  if(isCard(E.mode)||E.step>=E.end){if(!isCard(E.mode)&&E.step>=N-1){return complete();}E.playing=false;status(isCard(E.mode)?'✔️ Finished — tap NEXT ⏭️ to continue':'✔️ Finished');
    if(!isCard(E.mode)){wake(false);}render();return;}
  E.step++;S.step=E.step;save();setHash();E.ops=buildOps(E.step,E.mode,true);E.op=0;E.waitLeft=null;render();E.timer=setTimeout(run,350);}
function pause(){if(!E.playing||E.paused)return;E.paused=true;if(E.ops[E.op]&&E.ops[E.op].t==='wait'&&E.waitLeft!=null){E.waitLeft=Math.max(0,E.waitLeft-(Date.now()-E.waitStart));}
  var my=E.op;hush();E.op=my;status('⏸️ Paused — tap RESUME to continue from the same place');render();}
function resume(){if(!E.playing||!E.paused)return;E.paused=false;E.autoPaused=false;hideBanner();ac();try{if(hasTTS){SS.cancel();if(SS.paused)SS.resume();}}catch(e){}if(!isCard(E.mode))wake(true);render();setTimeout(run,120);}
function stop(){hush();E.playing=false;E.paused=false;E.op=0;E.waitLeft=null;E.custom=null;hideTurn();wake(false);status('⏹️ Stopped');render();}
function jump(i,keepPlaying){i=Math.max(0,Math.min(N-1,i));var was=E.playing&&!E.paused,mode=E.mode;hush();E.waitLeft=null;hideTurn();S.step=i;save();setHash();closePanels();
  if(keepPlaying&&mode&&!isCard(mode)&&E.playing){E.step=i;E.ops=buildOps(i,mode,false);E.op=0;E.paused=false;render();setTimeout(run,80);}
  else{E.playing=false;E.paused=false;E.step=i;render();status('');}}
function complete(){hush();E.playing=false;wake(false);S.inProgress=false;S.step=0;save();setHash();show('done');playCue('done');
  if(hasTTS&&S.ann){setTimeout(function(){var u=new SpeechSynthesisUtterance('Prophetic direction completed. Breaking bloodline and family curses. Thank you Jesus.');var v=pickVoice();if(v)u.voice=v;u.rate=S.rate;try{SS.speak(u);}catch(e){}},900);}}

/* ---------- turn UI ---------- */
function curTurnEl(){return isCard(E.mode)?$('#cTurn'):$('#hTurn');}
function showTurn(op){var el=curTurnEl();if(op.kind!=='turn'){status(op.kind==='reflect'?'⏸️ Pause and reflect…':'…');return;}el.classList.add('show');updTurn();}
function hideTurn(){$('#cTurn').classList.remove('show');$('#hTurn').classList.remove('show');}
function updTurn(){var op=E.ops[E.op];if(!op||op.t!=='wait')return;var left=Math.max(0,E.waitLeft-(Date.now()-E.waitStart));var s=Math.ceil(left/1000);
  if(op.kind==='turn'){var txt=s+' seconds'+(op.reps>1?' · Say it '+op.rep+' of '+op.reps:'');$$('.turn .sec').forEach(function(x){x.textContent=txt;});status('🗣️ YOUR TURN — say it aloud');}}
function adjustTurn(delta){var op=E.ops[E.op];if(!E.playing||E.paused||!op||op.t!=='wait')return;clearTimeout(E.timer);clearInterval(E.tick);var left=Math.max(0,E.waitLeft-(Date.now()-E.waitStart));
  if(delta==='skip'){E.waitLeft=null;finishWait();return;}E.waitLeft=left+delta;E.waitStart=Date.now();var my=++E.tok;E.tick=setInterval(updTurn,250);E.timer=setTimeout(function(){if(my!==E.tok)return;finishWait();},E.waitLeft);updTurn();}
function retime(){/* settings changed during a running turn pause: apply new length now */var op=E.ops[E.op];if(!E.playing||E.paused||!op||op.t!=='wait'||op.kind!=='turn')return;var elapsed=(E.waitTotal-E.waitLeft)+(Date.now()-E.waitStart);var nt=turnMs(op.w);E.waitTotal=nt;E.waitLeft=Math.max(1000,nt-elapsed);E.waitStart=Date.now();clearTimeout(E.timer);var my=++E.tok;E.timer=setTimeout(function(){if(my!==E.tok)return;finishWait();},E.waitLeft);updTurn();}
$$('[data-turn]').forEach(function(b){b.onclick=function(){adjustTurn(b.dataset.turn==='more'?5000:'skip');};});

/* ---------- wake lock & leaving the page ---------- */
var WL=null;function wake(on){try{if(on&&'wakeLock' in navigator){if(!WL)navigator.wakeLock.request('screen').then(function(l){WL=l;l.addEventListener('release',function(){WL=null;});}).catch(function(){});}else if(!on&&WL){WL.release();WL=null;}}catch(e){}}
function interrupted(msg){if(!E.playing||E.paused)return;var keep=E.op;pause();E.op=keep;E.autoPaused=true;E.intMsg=msg;if(!document.hidden)offerResume();}
function offerResume(){var st=STEPS[E.step];showBanner('⏸️ '+(E.intMsg||'Prayer paused.')+' Your place is kept: '+label(st)+'.','▶️ RESUME',function(){hideBanner();resume();});}
function awayPause(){if(E.playing&&!E.paused&&!E.custom){interrupted(isCard(E.mode)?'Audio paused while you were away.':'Hands-free prayer paused while your screen was off or another app was open.');}save();setHash();}
document.addEventListener('visibilitychange',function(){if(document.hidden){awayPause();}
  else{if(E.playing&&E.paused&&E.autoPaused){offerResume();}if(E.playing&&!E.paused&&!isCard(E.mode))wake(true);}});
window.addEventListener('pagehide',awayPause);
document.addEventListener('freeze',awayPause);
window.addEventListener('pageshow',function(ev){if(ev.persisted&&E.playing&&E.paused)offerResume();});
function watchAC(){var a=AC;if(!a||a.__w)return;a.__w=1;a.addEventListener('statechange',function(){if(a.state==='interrupted'){interrupted('The audio was interrupted (for example by a phone call).');}});}
function showBanner(msg,btn,fn){var b=$('#resumeBanner');b.innerHTML='<div>'+esc(msg)+'</div><div class="grid2" style="margin-top:10px"><button class="btn btn-primary" id="bGo">'+btn+'</button><button class="btn btn-outline" id="bX">Close</button></div>';b.classList.add('show');$('#bGo').onclick=fn;$('#bX').onclick=hideBanner;window.scrollTo({top:0,behavior:'smooth'});}
function hideBanner(){$('#resumeBanner').classList.remove('show');}

/* ---------- rendering ---------- */
var L=(window.L137_LEARN||{})[S.lang]||(window.L137_LEARN||{}).en||{help:{},review:{}};
function hkey(st){return st.type+'-'+st.n;}
function stepHTML(st,inCard){var cls=st.type==='declaration'||st.type==='deut'?'decl':st.type==='scripture'?'scr':st.type==='instruction'?'ins':'';var icon={instruction:'🛑',scripture:'📖',declaration:'🔥',deut:'📜',thanks:'🙏🏽'}[st.type];
  var h='<span class="badge '+cls+'">'+icon+' '+label(st)+'</span>';
  if(st.action)h+='<div class="action-box"><svg class="drop" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C9 7 6 10.5 6 14a6 6 0 0 0 12 0c0-3.5-3-7-6-12z" fill="currentColor"/></svg><span class="ripple"></span><span class="ripple r2"></span><span class="ripple r3"></span>🩸 PROPHETIC ACTION<small>'+(st.type==='deut'?'Pour the Blood of Jesus on the ground and declare Deuteronomy 28 over your life.':'AS YOU POUR, DECLARE:')+'</small></div>';
  if(inCard)h+='<span class="orig-label">📖 '+(st.type==='scripture'||st.type==='deut'?'Scripture · King James Version':'Pastor Kiki’s original words')+'</span>';
  if(st.lead)h+='<div class="lead">🗣️ '+esc(st.lead.toUpperCase())+'</div>';
  if(st.ref)h+='<div class="ref">'+esc(st.ref)+'</div>';
  if(st.type==='deut'){h+='<div class="prayer-text scripture long">'+st.verses.map(function(v){return '<span class="vnum">'+v.v+'</span>'+esc(v.t);}).join(' ')+'</div>';}
  else{var t=st.type==='scripture'?'“'+esc(st.text)+'”':esc(st.text);h+='<div class="prayer-text'+(st.type==='scripture'?' scripture':'')+(st.text.length>170?' long':'')+'"'+(st.type==='thanks'?' style="color:var(--blood);font-size:2.2rem"':'')+'>'+t+'</div>';}
  return h;}
var SECS=[{t:'instruction',l:'Prepare'},{t:'scripture',l:'Scripture'},{t:'declaration',l:'Declare'},{t:'deut',l:'Deut 28'},{t:'thanks',l:'Thanks'}];
function trackHTML(i){var st=STEPS[i];var where,pct;
  if(st.type==='declaration'){where='Declaration '+st.n+' of '+st.of;}
  else if(st.type==='instruction'){where='Prophetic instruction '+st.n+' of '+st.of;}
  else if(st.type==='scripture'){where='Scripture '+st.n+' of '+st.of;}
  else if(st.type==='deut'){where='Deuteronomy 28 · part '+st.n+' of '+st.of;}
  else where='Thanksgiving';
  pct=Math.round(st.n/st.of*100);
  var si=SECS.findIndex(function(x){return x.t===st.type;});
  var steps=SECS.map(function(x,k){return '<div class="tk-s '+(k<si?'done':k===si?'now':'')+'"><i></i>'+(k<si?'✓ ':'')+x.l+'</div>';}).join('');
  return '<div class="tk-main"><div class="tk-where">'+where+'</div><div class="tk-pct">'+pct+'%</div></div><div class="tk-bar" role="progressbar" aria-label="'+where+'" aria-valuenow="'+pct+'" aria-valuemin="0" aria-valuemax="100"><i style="width:'+pct+'%"></i></div><div class="tk-steps">'+steps+'</div><div class="tk-all">Step '+(i+1)+' of '+N+' in the whole prophetic direction</div>';}
var lastRendered=-1;
function render(){var i=E.playing&&!E.custom?E.step:S.step;
  if(i!==lastRendered){$('#prayCard').innerHTML=stepHTML(STEPS[i],true);$('#hfCard').innerHTML=stepHTML(STEPS[i],true);closePanels();lastRendered=i;}
  $('#trackPray').innerHTML=trackHTML(i);$('#trackHf').innerHTML=trackHTML(i);
  var cp=E.playing&&isCard(E.mode)&&!E.custom;
  $('#mListen').classList.toggle('on',cp&&E.mode==='cardListen');$('#mDeclare').classList.toggle('on',cp&&E.mode==='card');
  $('#cPause').innerHTML=cp&&E.paused?'▶️ <span>RESUME</span>':'⏸️ <span>PAUSE</span>';
  $('#ePauseLbl').textContent=E.paused?'RESUME':(E.playing?'PAUSE':'START');$('#ePause .ic').textContent=(E.paused||!E.playing)?'▶️':'⏸️';
  if(!E.playing)$('#hStatus').textContent=E.mode&&!isCard(E.mode)?'⏹️ Stopped — tap START to continue, or STOP to leave':'Ready';
  $('#cNext').innerHTML=i>=N-1?'🏁 FINISH':'NEXT ⏭️';
  var sb=$('#startSub');if(sb){if(S.inProgress&&S.step>0){$('#startBtn .big').textContent='🔥 CONTINUE PRAYING';sb.textContent='You are at: '+trackWhere(S.step);}else{$('#startBtn .big').textContent='🔥 START PRAYING';sb.textContent='One prayer at a time · 43 steps';}}
  $$('.list-item').forEach(function(li){li.classList.toggle('playing',E.playing&&isCard(E.mode)&&!E.custom&&+li.dataset.i===E.step&&cur==='read');});}
function trackWhere(i){var st=STEPS[i];return st.type==='declaration'?'Declaration '+st.n+' of 29':label(st).toLowerCase().replace(/^./,function(c){return c.toUpperCase();});}
function status(m){$('#cStatus').textContent=m;$('#hStatus').textContent=m||' ';}

/* ---------- Understand & Remember panels ---------- */
function closePanels(){['#pUnder','#pRemember'].forEach(function(p){var el=$(p);if(el)el.hidden=true;});$('#mUnder')&&$('#mUnder').setAttribute('aria-expanded','false');$('#mRemember')&&$('#mRemember').setAttribute('aria-expanded','false');}
function helpFor(i){return L.help[hkey(STEPS[i])];}
function openUnder(){var i=S.step,hp=helpFor(i),el=$('#pUnder');var open=el.hidden;closePanels();if(!open||!hp)return;
  el.innerHTML='<span class="tag">💡 Help me understand</span><p class="counter" style="margin-top:8px">Explanation · separate from Pastor Kiki’s original words above</p><h4>What does this mean?</h4><p>'+esc(hp.simple)+'</p><h4>🏠 Practical example</h4><p>'+esc(hp.example)+'</p>'+(hp.verse?'<h4>📖 The Bible says</h4><div class="vbox"><b>'+esc(hp.verse.ref)+'</b>“'+esc(hp.verse.text)+'”</div>':'')+(hp.teach?'<h4>📚 Deliverance teaching</h4>'+hp.teach.map(function(t){return '<div class="vbox tbox">“'+esc(t.q)+'”<b style="margin-top:6px">— '+esc(t.by)+', <a href="'+esc(t.url)+'" target="_blank" rel="noopener">'+esc(t.src)+'</a></b></div>';}).join(''):'')+'<div class="row" style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap"><button class="chip" id="hListen">🔊 Listen to explanation</button><button class="chip" id="hClose">Close</button></div>';
  el.hidden=false;$('#mUnder').setAttribute('aria-expanded','true');
  $('#hListen').onclick=function(){start('cardListen',i,{custom:sayOps(hp.simple+' For example: '+hp.example+(hp.verse?' The Bible says, '+hp.verse.ref.replace(' KJV','')+'. '+hp.verse.text:'')+(hp.teach?hp.teach.map(function(t){return ' '+t.by+' teaches: '+t.q;}).join(''):''),'Help me understand.')});};
  $('#hClose').onclick=closePanels;}
function openRemember(){var i=S.step,st=STEPS[i],hp=helpFor(i)||{},el=$('#pRemember');var open=el.hidden;closePanels();if(!open)return;
  var full=st.type==='deut'?st.verses.map(function(v){return v.v+' '+v.t;}).join(' '):st.text;
  el.innerHTML='<span class="tag">🧠 Remember it</span><h4>Memory key</h4><div class="memkey">'+esc(hp.key||label(st))+'</div><p>Look away and try to say the whole '+(st.type==='scripture'||st.type==='deut'?'Scripture':st.type==='declaration'?'declaration':'instruction')+' from memory. Then tap to check yourself.</p><div class="reveal-card" id="remCard"><button class="btn btn-outline" id="remBtn">👀 CHECK MY ANSWER</button><div class="rc-a">'+(st.ref?'<b>'+esc(st.ref)+'</b><br>':'')+esc(full)+'</div></div><button class="chip" id="remClose">Close</button>';
  el.hidden=false;$('#mRemember').setAttribute('aria-expanded','true');
  $('#remBtn').onclick=function(){$('#remCard').classList.add('open');this.style.display='none';};$('#remClose').onclick=closePanels;}
$('#mUnder').onclick=openUnder;$('#mRemember').onclick=openRemember;

/* ---------- screens ---------- */
var cur='home';function show(name){cur=name;$$('.screen').forEach(function(s){s.classList.remove('active');});$('#s-'+name).classList.add('active');window.scrollTo(0,0);if(name==='review')renderReview();render();}
function go(where){ac();switch(where){
  case 'home':if(E.playing)stop();show('home');break;
  case 'begin':hideBanner();show('pray');if(S.inProgress&&S.step>0){status('Continuing where you left off.');}break;
  case 'hf':show('hf');start('hf',S.inProgress?S.step:0);break;
  case 'listen':show('hf');start('listen',S.inProgress&&S.lastMode==='listen'?S.step:0);break;
  case 'read':if(E.playing)stop();show('read');break;
  case 'scriptures':if(E.playing)stop();show('scr');break;
  case 'review':if(E.playing)stop();show('review');break;
  case 'share':share();break;
  case 'restart':closeSheet();$('#confirmModal').classList.add('open');break;
  case 'again':S.step=0;show('hf');start('hf',0);break;
  case 'final':show('hf');start('hf',firstFinal());break;}}
function firstFinal(){for(var i=0;i<N;i++)if(STEPS[i].type==='declaration'&&STEPS[i].n===22)return i;return 0;}
$$('[data-go]').forEach(function(b){b.addEventListener('click',function(){go(b.dataset.go);});});
$('#homeBtn').onclick=function(){go('home');};
$('#cfNo').onclick=function(){$('#confirmModal').classList.remove('open');};
$('#cfYes').onclick=function(){$('#confirmModal').classList.remove('open');stop();S.step=0;S.inProgress=false;save();setHash();hideBanner();show('pray');status('🔄 Back at the beginning');toast('Starting from the beginning');};

/* card controls */
$('#mListen').onclick=function(){closePanels();start('cardListen',S.step);};
$('#mDeclare').onclick=function(){closePanels();start('card',S.step);};
$('#cPause').onclick=function(){if(E.playing&&E.paused)resume();else if(E.playing)pause();else toast('Tap 🔊 Listen or 🗣️ Declare to start the audio');};
$('#cStop').onclick=stop;
$('#cRepeat').onclick=function(){start(E.mode==='cardListen'?'cardListen':'card',S.step);};
$('#cPrev').onclick=function(){jump((E.playing&&!E.custom?E.step:S.step)-1,false);};
$('#cNext').onclick=function(){var i=(E.playing&&!E.custom?E.step:S.step);if(i>=N-1){stop();complete();return;}jump(i+1,false);};
$('#cHfHere').onclick=function(){show('hf');start('hf',S.step);};
/* hands-free emergency controls */
$('#ePause').onclick=function(){if(!E.playing){start(E.mode&&!isCard(E.mode)?E.mode:'hf',S.step);return;}if(E.paused)resume();else pause();};
$('#eStop').onclick=function(){stop();show('pray');status('⏹️ Hands-free stopped. Your place is saved.');};
$('#eBack').onclick=function(){if(!E.playing){jump(S.step-1,false);return;}jump(E.step-1,true);};
$('#soundCheck').onclick=function(){ac();playCue('turn');start('cardListen',S.step,{custom:sayOps('Sound check. If you can hear this voice, you are ready to pray.')});};

/* ---------- lists ---------- */
function buildRead(){var h='',last='';STEPS.forEach(function(st,i){var g={instruction:'🛑 PROPHETIC DIRECTION — INSTRUCTIONS',scripture:'📖 SCRIPTURES — READ ALOUD',declaration:'🔥 SAY — DECLARATIONS',deut:'📜 POUR THE BLOOD OF JESUS ON THE GROUND AND DECLARE DEUTERONOMY 28',thanks:'🙏🏽 THANKSGIVING'}[st.type];if(g!==last){h+='<h3 class="section-title" style="font-size:1.15rem">'+g+'</h3>';last=g;}
  h+='<div class="list-item" data-i="'+i+'">'+stepHTML(st)+'<div class="row"><button class="chip" data-play="'+i+'">🔊 PLAY</button><button class="chip" data-stop>⏹️ STOP</button><button class="chip" data-open="'+i+'">🔥 OPEN AS CARD</button></div></div>';});
  $('#readList').innerHTML=h;
  $$('#readList [data-play]').forEach(function(b){b.onclick=function(){var i=+b.dataset.play;start('card',i);};});
  $$('#readList [data-stop]').forEach(function(b){b.onclick=stop;});
  $$('#readList [data-open]').forEach(function(b){b.onclick=function(){stop();S.step=+b.dataset.open;S.inProgress=true;save();setHash();show('pray');};});}
function sayOps(text,pre){var o=[];if(pre)chunk(pre).forEach(function(c){o.push({t:'say',text:c,kind:'announce'});});chunk(text).forEach(function(c){o.push({t:'say',text:c,kind:'content'});});return o;}
function buildScr(){var h='<p class="counter">Scripture is shown exactly as given in the prophetic direction, in the King James Version.</p>';
  C.scriptures.forEach(function(s,i){h+='<div class="list-item"><span class="badge scr">📖 SCRIPTURE '+(i+1)+'</span><div class="ref">'+esc(s.ref)+'</div><div class="prayer-text scripture">“'+esc(s.text)+'”</div><div class="row"><button class="chip" data-sp="'+i+'">🔊 PLAY</button><button class="chip" data-stop>⏹️ STOP</button></div></div>';});
  h+='<div class="list-item"><span class="badge act">🩸 DEUTERONOMY 28 DECLARATION</span><p>The prophetic direction says: “When you have finished praying, pour the Blood of Jesus on the ground and declare Deuteronomy 28 over your life.” In the guided prayer, Deuteronomy 28:1–14 KJV (the blessings) is read aloud for you to declare. The complete chapter is below.</p>'+
  '<div class="row"><button class="chip" data-d14>🔊 PLAY 28:1–14</button><button class="chip" data-stop>⏹️ STOP</button></div>'+
  '<details class="full"><summary>📜 Read Deuteronomy 28 — full chapter (68 verses, KJV)</summary><div style="padding:8px 4px">'+C.deutFull.map(function(t,i){return '<div class="verse"><span class="vnum">'+(i+1)+'</span>'+esc(t)+'</div>';}).join('')+'</div><div class="row" style="margin-top:10px"><button class="chip" data-dall>🔊 PLAY FULL CHAPTER</button><button class="chip" data-stop>⏹️ STOP</button></div></details></div>';
  $('#scrList').innerHTML=h;
  $$('#scrList [data-sp]').forEach(function(b){b.onclick=function(){var s=C.scriptures[+b.dataset.sp];start('card',0,{custom:sayOps(s.text,s.say)});};});
  $$('#scrList [data-stop]').forEach(function(b){b.onclick=stop;});
  $('#scrList [data-d14]').onclick=function(){start('card',0,{custom:sayOps(C.deutFull.slice(0,14).join(' '),'Deuteronomy chapter 28, verses 1 to 14.')});};
  $('#scrList [data-dall]').onclick=function(){start('card',0,{custom:sayOps(C.deutFull.join(' '),'Deuteronomy chapter 28.')});};}

/* ---------- Learn & Review ---------- */
var R=L.review||{};var RV={i:0,seen:{},quiz:{},refl:{},fl:0,flip:false,rc:null,rcOpen:false,rcCount:0,ord:null,ordDone:false};
var RSEC=[{k:'summary',ic:'📝',t:'Summary'},{k:'lessons',ic:'🔑',t:'Key lessons'},{k:'scr',ic:'📖',t:'Key Scriptures'},{k:'flash',ic:'🃏',t:'Flashcards'},{k:'quiz',ic:'❓',t:'Final quiz'},{k:'recall',ic:'🧠',t:'Recall challenge'},{k:'reflect',ic:'🤔',t:'Reflection'},{k:'apply',ic:'🏠',t:'Real-life application'},{k:'discuss',ic:'👨‍👩‍👧‍👦',t:'Discussion'},{k:'prayer',ic:'🙏🏽',t:'Closing prayer'},{k:'decl',ic:'🔥',t:'Declarations'},{k:'done',ic:'🏆',t:'Completion'}];
function quizTotal(){return (R.quiz||[]).length;}
function quizAnswered(){return Object.keys(RV.quiz).length;}
function quizRight(){var n=0;Object.keys(RV.quiz).forEach(function(k){if(RV.quiz[k].ok)n++;});return n;}
function decls(){return STEPS.filter(function(x){return x.type==='declaration';});}
function renderReview(){var sec=RSEC[RV.i];RV.seen[sec.k]=true;
  $('#rvStep').textContent=sec.ic+' '+sec.t+' · '+(RV.i+1)+' of '+RSEC.length;$('#rvBar').style.width=Math.round((RV.i+1)/RSEC.length*100)+'%';
  $('#rvDots').innerHTML=RSEC.map(function(x,k){return '<button class="rv-dot '+(k===RV.i?'now':RV.seen[x.k]?'done':'')+'" data-rv="'+k+'" aria-label="'+x.t+'">'+x.ic+'</button>';}).join('');
  $$('#rvDots [data-rv]').forEach(function(b){b.onclick=function(){RV.i=+b.dataset.rv;renderReview();window.scrollTo(0,0);};});
  $('#rvPrev').disabled=RV.i===0;$('#rvNext').innerHTML=RV.i===RSEC.length-1?'🏠 MAIN MENU':'NEXT: '+RSEC[RV.i+1].ic+' '+RSEC[RV.i+1].t;
  var b=$('#rvBody'),h='<h2>'+sec.ic+' '+sec.t+'</h2>';
  if(sec.k==='summary'){h+='<p class="counter">What this prophetic direction is about.</p><ul>'+R.summary.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul><button class="chip" id="rvSay">🔊 Listen</button>';}
  if(sec.k==='lessons'){h+=R.lessons.map(function(x,k){return '<div class="lesson"><b>'+(k+1)+'. '+esc(x.t)+'</b><br>'+esc(x.d)+'</div>';}).join('')+'<button class="chip" id="rvSay">🔊 Listen</button>';}
  if(sec.k==='scr'){h+='<p class="counter">Say the reference, try to recall the verse, then tap to reveal it.</p>'+C.scriptures.map(function(x,k){return '<div class="reveal-card" data-rc><b>📖 '+esc(x.ref)+'</b><div class="rc-a">“'+esc(x.text)+'”</div><div style="margin-top:8px"><button class="chip" data-rcb>👀 Reveal</button> <button class="chip" data-sv="'+k+'">🔊 Listen</button></div></div>';}).join('')+'<div class="reveal-card" data-rc><b>📖 Deuteronomy 28:13 KJV</b><div class="rc-a">“'+esc(C.deutFull[12])+'”</div><div style="margin-top:8px"><button class="chip" data-rcb>👀 Reveal</button></div></div>'+'<div class="lesson"><b>⭐ Memory verse: '+esc(R.memory.ref)+'</b><br>“'+esc(R.memory.text)+'”</div>';}
  if(sec.k==='flash'){var f=R.flash[RV.fl];h+='<p class="counter">Card '+(RV.fl+1)+' of '+R.flash.length+' · Tap the card to flip it.</p><div class="flip'+(RV.flip?' on':'')+'" id="flip" role="button" tabindex="0" aria-label="Flip card"><div class="flip-in"><div class="flip-f">'+esc(f.q)+'</div><div class="flip-b">'+esc(f.a)+'</div></div></div><div class="navrow"><button class="btn btn-outline" id="flPrev">⬅️ Card</button><button class="btn btn-dark" id="flNext">Next card ➡️</button></div>';}
  if(sec.k==='quiz'){h+='<p class="counter">Choose an answer first. The correct answer and explanation appear after you choose.</p>';
    R.quiz.forEach(function(q,k){var st=RV.quiz[k];h+='<div class="q"><div class="qn">QUESTION '+(k+1)+' OF '+R.quiz.length+' · '+({mc:'Multiple choice',tf:'True or false',fill:'Fill in the blank',order:'Put in order'})[q.type]+'</div><p><b>'+esc(q.q)+'</b></p>';
      if(q.type==='order'){var ord=st?st.order:(RV.ord||(RV.ord=shuffle(q.items.map(function(_,j){return j;}))));
        h+=ord.map(function(j,p){return '<div class="ord-item"><span>'+(p+1)+'. '+esc(q.items[j])+'</span>'+(st?'':'<button data-up="'+p+'" aria-label="Move up">▲</button><button data-dn="'+p+'" aria-label="Move down">▼</button>')+'</div>';}).join('');
        h+=st?'':'<button class="btn btn-dark" id="ordCheck" style="margin-top:8px">✔️ CHECK MY ORDER</button>';
        if(st)h+='<div class="fb show">'+(st.ok?'✅ Correct! ':'❌ Not quite. ')+esc(q.e)+'</div>';}
      else{var opts=q.type==='tf'?['True','False']:q.o;var correct=q.type==='tf'?(q.a?0:1):q.a;
        h+=opts.map(function(o,j){var c='';if(st){if(j===correct)c=' right';else if(j===st.pick)c=' wrong';}return '<button class="opt'+c+'" data-q="'+k+'" data-o="'+j+'"'+(st?' disabled':'')+'>'+esc(o)+'</button>';}).join('');
        if(st)h+='<div class="fb show">'+(st.ok?'✅ Correct! ':'❌ Not quite. ')+esc(q.e)+'</div>';}
      h+='</div>';});
    h+='<div class="score">'+quizAnswered()+' of '+quizTotal()+' answered · '+quizRight()+' correct</div>'+(quizAnswered()?'<button class="chip" id="qReset">🔄 Try the quiz again</button>':'');}
  if(sec.k==='recall'){if(!RV.rc)newRecall();var r=RV.rc;h+='<p class="counter">Finish the line from memory, say it aloud, then reveal it. Challenges completed: '+RV.rcCount+'</p><div class="reveal-card'+(RV.rcOpen?' open':'')+'"><div class="qn" style="font-weight:800;color:var(--muted)">'+esc(r.label)+'</div><p class="prayer-text" style="font-size:1.25rem">'+esc(r.start)+' <span style="color:var(--ember)">…</span></p><div class="rc-a"><b>'+esc(r.full)+'</b></div>'+(RV.rcOpen?'':'<button class="btn btn-outline" id="rcReveal">👀 REVEAL</button>')+'</div><button class="btn btn-dark" id="rcNew">🎲 NEW CHALLENGE</button>';}
  if(sec.k==='reflect'){h+='<p class="counter">⏸️ Pause and reflect. Your answers stay on this phone only and are not sent anywhere.</p>'+R.reflect.map(function(q,k){return '<label><b>'+(k+1)+'. '+esc(q)+'</b><textarea class="ref" data-rf="'+k+'">'+esc(RV.refl[k]||'')+'</textarea></label>';}).join('');}
  if(sec.k==='apply'){h+='<p class="counter">🤔 What would you do? Choose, then see the explanation.</p>'+R.apply.map(function(q,k){var st=RV.quiz['a'+k];return '<div class="q"><p><b>'+esc(q.s)+'</b></p>'+q.o.map(function(o,j){var c='';if(st){if(j===q.a)c=' right';else if(j===st.pick)c=' wrong';}return '<button class="opt'+c+'" data-a="'+k+'" data-o="'+j+'"'+(st?' disabled':'')+'>'+esc(o)+'</button>';}).join('')+(st?'<div class="fb show">'+esc(q.e)+'</div>':'')+'</div>';}).join('');}
  if(sec.k==='discuss'){h+='<p class="counter">👨‍👩‍👧‍👦 For families, prayer partners and small groups.</p><ol>'+R.discuss.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ol>';}
  if(sec.k==='prayer'){var d=decls();h+='<p class="counter">🙏🏽 Pray together, using Pastor Kiki’s closing words from this direction.</p><div class="lesson">'+esc(d[27].text)+'</div><div class="lesson">'+esc(d[28].text)+'</div><div class="lesson"><b>Thank you Jesus</b></div><button class="chip" id="rvPray">🔊 Pray aloud with me</button>';}
  if(sec.k==='decl'){h+='<p class="counter">🔥 Declare again, hands-free.</p><div class="stack"><button class="btn btn-primary" id="rvFinal">🔁 FINAL DECLARATIONS (22–29)</button><button class="btn btn-outline" id="rvAll">🔥 ALL 29 DECLARATIONS</button></div>';}
  if(sec.k==='done'){var seen=RSEC.filter(function(x){return RV.seen[x.k];}).length;var all=seen>=RSEC.length&&quizAnswered()>=quizTotal();
    h+='<div class="trophy"><div class="t">'+(all?'🏆':'⏳')+'</div><p class="score">'+(all?'REVIEW COMPLETED':'Almost there')+'</p><p>Breaking Bloodline &amp; Family Curses<br>L137 Deliverance Ministry · Pastor Kiki Ocansey</p></div><ul class="checklist">'+RSEC.slice(0,-1).map(function(x){var ok=x.k==='quiz'?quizAnswered()>=quizTotal():RV.seen[x.k];return '<li>'+(ok?'✅':'⬜')+' '+x.ic+' '+x.t+(x.k==='quiz'?' ('+quizRight()+'/'+quizTotal()+' correct)':'')+'</li>';}).join('')+'</ul>'+(all?'<div class="thanks" style="font-size:1.8rem;text-align:center">THANK YOU JESUS 🙏🏽</div>':'<p class="counter">Visit each section and answer every quiz question to complete the review. Tap any icon above to jump there.</p>')+'<button class="btn btn-gold" data-go="share">📲 SHARE WITH SOMEONE</button>';}
  b.innerHTML=h;wireReview(sec.k);}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}if(a.every(function(v,i){return v===i;}))a.reverse();return a;}
function newRecall(){var d=decls();var pool=[];d.forEach(function(x){pool.push({label:'Finish declaration '+x.n,text:x.text});});C.scriptures.forEach(function(x){pool.push({label:'Finish '+x.ref,text:x.text});});
  var p=pool[Math.floor(Math.random()*pool.length)];var w=p.text.replace(/🙏🏽/g,'').trim().split(/\s+/);var cut=Math.max(3,Math.floor(w.length*0.5));RV.rc={label:p.label,start:w.slice(0,cut).join(' '),full:p.text};RV.rcOpen=false;}
function wireReview(k){var b=$('#rvBody');
  var say=$('#rvSay',b);if(say)say.onclick=function(){var t=k==='summary'?R.summary.join(' '):R.lessons.map(function(x){return x.t+'. '+x.d;}).join(' ');start('cardListen',S.step,{custom:sayOps(t)});};
  $$('[data-rcb]',b).forEach(function(x){x.onclick=function(){x.closest('[data-rc]').classList.add('open');x.remove();};});
  $$('[data-sv]',b).forEach(function(x){x.onclick=function(){var sc=C.scriptures[+x.dataset.sv];start('cardListen',S.step,{custom:sayOps(sc.text,sc.say)});};});
  var fl=$('#flip',b);if(fl){fl.onclick=function(){RV.flip=!RV.flip;fl.classList.toggle('on',RV.flip);};fl.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();fl.onclick();}};
    $('#flPrev').onclick=function(){RV.fl=(RV.fl-1+R.flash.length)%R.flash.length;RV.flip=false;renderReview();};$('#flNext').onclick=function(){RV.fl=(RV.fl+1)%R.flash.length;RV.flip=false;renderReview();};}
  $$('[data-q]',b).forEach(function(x){x.onclick=function(){var k2=+x.dataset.q,o=+x.dataset.o,q=R.quiz[k2];var correct=q.type==='tf'?(q.a?0:1):q.a;RV.quiz[k2]={pick:o,ok:o===correct};var y=window.scrollY;renderReview();window.scrollTo(0,y);};});
  $$('[data-up]',b).forEach(function(x){x.onclick=function(){var p=+x.dataset.up;if(p>0){var t=RV.ord[p-1];RV.ord[p-1]=RV.ord[p];RV.ord[p]=t;}var y=window.scrollY;renderReview();window.scrollTo(0,y);};});
  $$('[data-dn]',b).forEach(function(x){x.onclick=function(){var p=+x.dataset.dn;if(p<RV.ord.length-1){var t=RV.ord[p+1];RV.ord[p+1]=RV.ord[p];RV.ord[p]=t;}var y=window.scrollY;renderReview();window.scrollTo(0,y);};});
  var oc=$('#ordCheck',b);if(oc)oc.onclick=function(){var k2=R.quiz.findIndex(function(q){return q.type==='order';});RV.quiz[k2]={order:RV.ord.slice(),ok:RV.ord.every(function(v,i){return v===i;})};var y=window.scrollY;renderReview();window.scrollTo(0,y);};
  var qr=$('#qReset',b);if(qr)qr.onclick=function(){Object.keys(RV.quiz).forEach(function(k2){if(!/^a/.test(k2))delete RV.quiz[k2];});RV.ord=null;renderReview();};
  var rr=$('#rcReveal',b);if(rr)rr.onclick=function(){RV.rcOpen=true;RV.rcCount++;renderReview();};
  var rn=$('#rcNew',b);if(rn)rn.onclick=function(){newRecall();renderReview();};
  $$('[data-rf]',b).forEach(function(x){x.oninput=function(){RV.refl[x.dataset.rf]=x.value;};});
  $$('[data-a]',b).forEach(function(x){x.onclick=function(){var k2=+x.dataset.a,o=+x.dataset.o;RV.quiz['a'+k2]={pick:o,ok:o===R.apply[k2].a};var y=window.scrollY;renderReview();window.scrollTo(0,y);};});
  var rp=$('#rvPray',b);if(rp)rp.onclick=function(){var d=decls();start('cardListen',S.step,{custom:sayOps(d[27].speak+' '+d[28].speak+' Thank you Jesus.')});};
  var f1=$('#rvFinal',b);if(f1)f1.onclick=function(){show('hf');start('hf',firstFinal(),{end:N-1});};
  var f2=$('#rvAll',b);if(f2)f2.onclick=function(){var k2=STEPS.findIndex(function(x){return x.type==='declaration';});show('hf');start('hf',k2);};
  $$('[data-go]',b).forEach(function(x){x.onclick=function(){go(x.dataset.go);};});}
$('#rvPrev').onclick=function(){if(RV.i>0){RV.i--;renderReview();window.scrollTo(0,0);}};
$('#rvNext').onclick=function(){if(RV.i<RSEC.length-1){RV.i++;renderReview();window.scrollTo(0,0);}else go('home');};

/* ---------- settings ---------- */
function chips(sel,items,isOn,onPick){var box=$(sel);box.innerHTML='';items.forEach(function(it){var b=document.createElement('button');b.className='chip';b.textContent=it.l;b.setAttribute('aria-pressed',isOn(it));b.onclick=function(){onPick(it);save();renderSettings();};box.appendChild(b);});}
function renderSettings(){
  $$('[data-set="reps"]').forEach(function(){});
  chips('[data-set="reps"]',[1,3,5,7].map(function(n){return {v:n,l:n+'×'};}),function(it){return S.reps===it.v;},function(it){S.reps=it.v;toast('Each prayer will be said '+it.v+'× — from the next declaration');});
  chips('[data-set="pause"]',[{m:'auto',a:'short',l:'AUTO · Short'},{m:'auto',a:'normal',l:'AUTO · Normal'},{m:'auto',a:'long',l:'AUTO · Long'}].concat([5,10,15,20,30].map(function(s){return {m:'fixed',s:s,l:s+' seconds'};})),function(it){return it.m==='auto'?(S.pauseMode==='auto'&&S.autoLen===it.a):(S.pauseMode==='fixed'&&S.fixedSec===it.s);},function(it){S.pauseMode=it.m;if(it.a)S.autoLen=it.a;if(it.s)S.fixedSec=it.s;retime();toast('“Your turn” pause: '+it.l);});
  chips('[data-set="lr"]',[{v:true,l:'ON'},{v:false,l:'OFF'}],function(it){return S.lr===it.v;},function(it){S.lr=it.v;});
  chips('[data-set="rate"]',[.75,1,1.25,1.5].map(function(r){return {v:r,l:r+'×'};}),function(it){return S.rate===it.v;},function(it){S.rate=it.v;});
  chips('[data-set="ann"]',[{v:true,l:'ON'},{v:false,l:'OFF'}],function(it){return S.ann===it.v;},function(it){S.ann=it.v;});
  chips('[data-set="cues"]',[{v:true,l:'🔔 ON'},{v:false,l:'🔕 OFF'}],function(it){return S.cues===it.v;},function(it){S.cues=it.v;if(it.v){ac();playCue('turn');}});
  chips('[data-set="size"]',SIZES.map(function(s){return {v:s.k,l:s.l};}),function(it){return Math.abs(S.scale-it.v)<.01;},function(it){S.scale=it.v;document.documentElement.style.setProperty('--scale',S.scale);});
  /* quick controls shown on prayer + hands-free screens */
  $$('.quick').forEach(function(q){q.innerHTML='<div class="lbl" style="width:100%;font-weight:700;color:var(--muted);font-size:.88rem;text-align:center">⏳ Your-turn pause (change anytime)</div>';
    [{m:'auto',a:'short',l:'Short'},{m:'auto',a:'normal',l:'Normal'},{m:'auto',a:'long',l:'Long'}].forEach(function(it){var b=document.createElement('button');b.className='chip';b.textContent=it.l;b.setAttribute('aria-pressed',S.pauseMode==='auto'&&S.autoLen===it.a);b.onclick=function(){S.pauseMode='auto';S.autoLen=it.a;retime();save();renderSettings();toast('Your-turn pause: '+it.l);};q.appendChild(b);});
    var r=document.createElement('button');r.className='chip';r.textContent='🔁 Say '+S.reps+'×';r.onclick=function(){var arr=[1,3,5,7];S.reps=arr[(arr.indexOf(S.reps)+1)%4];save();renderSettings();toast('Each prayer: '+S.reps+'× (from the next declaration)');};q.appendChild(r);
    var m=document.createElement('button');m.className='chip';m.textContent='⚙️ More';m.onclick=openSheet;q.appendChild(m);});
}
function openSheet(){$('#sheet').classList.add('open');$('#sheetBg').classList.add('open');}
function closeSheet(){$('#sheet').classList.remove('open');$('#sheetBg').classList.remove('open');}
$('#settingsBtn').onclick=openSheet;$('#closeSheet').onclick=closeSheet;$('#sheetBg').onclick=closeSheet;
var ls=$('#langSel');ls.innerHTML=LANGS.map(function(l){return '<option value="'+l.code+'"'+(l.code!=='en'&&!window.L137_CONTENT[l.code]?' disabled':'')+(l.code===S.lang?' selected':'')+'>'+esc(l.name)+'</option>';}).join('');
ls.onchange=function(){if(window.L137_CONTENT[this.value]){S.lang=this.value;save();location.reload();}};
if(!C.original)$('#transFlag').classList.add('show');

/* ---------- share ---------- */
function shareUrl(){return location.href.split('#')[0].split('?')[0];}
function copy(t){if(navigator.clipboard&&window.isSecureContext){return navigator.clipboard.writeText(t).then(function(){toast('🔗 Link copied');},function(){fallbackCopy(t);});}fallbackCopy(t);}
function fallbackCopy(t){var a=document.createElement('textarea');a.value=t;a.setAttribute('readonly','');a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();try{document.execCommand('copy');toast('🔗 Link copied');}catch(e){toast(t);}document.body.removeChild(a);}
function share(){var url=shareUrl(),title='🛑 PROPHETIC DIRECTION · Breaking Bloodline & Family Curses',text='L137 Deliverance Ministry · Pastor Kiki Ocansey · Club House · Wednesday, October 7, 2026\n🛑 PROPHETIC DIRECTION 🛑\nBREAKING BLOODLINE & FAMILY CURSES\n🎧 Hands-free guided prayer:';
  var b=$('#resumeBanner');b.innerHTML='<div>📲 SHARE PROPHETIC DIRECTION</div><div style="word-break:break-all;font-weight:500;margin:8px 0">'+esc(url)+'</div><div class="stack"><button class="btn btn-primary" id="shNative">📲 SHARE</button><a class="btn btn-dark" id="shWa" style="text-decoration:none" target="_blank" rel="noopener">💬 SHARE ON WHATSAPP</a><button class="btn btn-outline" id="shCopy">🔗 COPY LINK</button><button class="btn btn-outline" id="shX">Close</button></div>';b.classList.add('show');window.scrollTo({top:0,behavior:'smooth'});
  $('#shWa').href='https://wa.me/?text='+encodeURIComponent(text+'\n'+url);
  $('#shNative').onclick=function(){if(navigator.share){navigator.share({title:title,text:text,url:url}).catch(function(){});}else{copy(url);}};
  $('#shCopy').onclick=function(){copy(url);};$('#shX').onclick=hideBanner;}

/* ---------- init ---------- */
applyTheme();document.documentElement.style.setProperty('--scale',S.scale);renderSettings();buildRead();buildScr();render();
if(!hasTTS)status('This browser has no built-in voice. Text will advance automatically.');

window.__L137={E:E,S:S,STEPS:STEPS,buildOps:buildOps,turnMs:turnMs,RV:RV};
})();
