// ---------- SAFE STORAGE SHIM ----------
// In-memory only — preview iframes may block persistent browser storage.
const __mem = {};
const safeStore = {
  getItem(k){ return k in __mem ? __mem[k] : null; },
  setItem(k,v){ __mem[k] = String(v); },
  removeItem(k){ delete __mem[k]; }
};

// ---------- START HERE PROGRESS ----------
const startChecks = document.querySelectorAll('[data-startcheck]');
const startBar = document.getElementById('startBar');
const startLabel = document.getElementById('startLabel');
function updateStart(){
  let done = 0;
  startChecks.forEach(c => {
    const stop = c.closest('.stop');
    if (c.checked){ done++; stop.classList.add('done'); }
    else stop.classList.remove('done');
  });
  const pct = Math.round(done / startChecks.length * 100);
  if (startBar) startBar.style.width = pct + '%';
  if (startLabel) startLabel.textContent = `${done} of ${startChecks.length} stops complete`;
  safeStore.setItem('victory:start', JSON.stringify(Array.from(startChecks).map(c=>c.checked)));
}
startChecks.forEach(c => c.addEventListener('change', updateStart));
try {
  const savedStart = JSON.parse(safeStore.getItem('victory:start')||'[]');
  savedStart.forEach((v,i)=>{ if(startChecks[i]) startChecks[i].checked=v; });
} catch(e){}
updateStart();

// ---------- SCRIPTURES ----------
const scrList = document.getElementById('scriptureList');
const scrTabs = document.getElementById('scriptureTabs');
function splitVerse(text){
  // Break long verses into short readable lines at sentence boundaries.
  const parts = text.split(/(?<=\.)\s+(?=[A-Z“])/g);
  return parts.map(p => `<p>“${p.replace(/^“/,'').replace(/”$/,'')}”</p>`).join('');
}
function renderScriptures(cat){
  scrList.innerHTML = '';
  window.SCRIPTURES
    .filter(s => cat==='all' || s.cat===cat)
    .forEach(s => {
      const el = document.createElement('div');
      el.className = 'scr';
      const body = s.text.length > 220 ? splitVerse(s.text) : `<p class="scr-text">“${s.text}”</p>`;
      el.innerHTML = `
        <div class="scr-ref">${s.ref} · KJV</div>
        <div class="scr-body">${body}</div>
        <div class="scr-actions">
          <button class="chip-btn" data-copy="${encodeURIComponent(s.ref+' KJV — '+s.text)}">Copy</button>
          <button class="chip-btn" data-share="${encodeURIComponent(s.ref+' KJV — '+s.text)}">Share</button>
        </div>`;
      scrList.appendChild(el);
    });
}
renderScriptures('all');
scrTabs.addEventListener('click', e => {
  if (!e.target.matches('.tab')) return;
  scrTabs.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  e.target.classList.add('active');
  renderScriptures(e.target.dataset.tab);
});

document.addEventListener('click', e => {
  const c = e.target.closest('[data-copy]');
  const s = e.target.closest('[data-share]');
  if (c){ navigator.clipboard.writeText(decodeURIComponent(c.dataset.copy)); flash(c,'Copied'); }
  if (s){ window.open('https://wa.me/?text='+s.dataset.share,'_blank'); }
});
function flash(btn, msg){ const t=btn.textContent; btn.textContent=msg; setTimeout(()=>btn.textContent=t,1200); }

// ---------- PRAYERS ----------
const prayerGrid = document.getElementById('prayerGrid');
window.PRAYERS.forEach(p => {
  const el = document.createElement('div');
  el.className = 'prayer';
  el.innerHTML = `<h4>${p.title}</h4><ul>${p.items.map(i=>`<li>${i}</li>`).join('')}</ul>`;
  prayerGrid.appendChild(el);
});

// ---------- DECLARATIONS ----------
const declList = document.getElementById('declList');
window.DECLARATIONS.forEach(d => {
  const li = document.createElement('li');
  li.textContent = d;
  declList.appendChild(li);
});
const declText = document.getElementById('declText');
document.getElementById('declDraw').addEventListener('click', () => {
  const d = window.DECLARATIONS[Math.floor(Math.random()*window.DECLARATIONS.length)];
  declText.textContent = d;
});
document.getElementById('declCopy').addEventListener('click', () => {
  const t = declText.textContent;
  if (t && !t.startsWith('Press')) { navigator.clipboard.writeText(t); flash(document.getElementById('declCopy'),'Copied'); }
});
document.getElementById('declShare').addEventListener('click', () => {
  const t = declText.textContent;
  if (t && !t.startsWith('Press')) window.open('https://wa.me/?text='+encodeURIComponent(t),'_blank');
});

// ---------- MODULES: expand / collapse + progress ----------
const modules = document.querySelectorAll('.module');
modules.forEach((m,i) => {
  const head = m.querySelector('.module-head');
  head.addEventListener('click', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'LABEL') return;
    m.classList.toggle('open');
  });
  if (i===0) m.classList.add('open');
});
const checks = document.querySelectorAll('[data-check]');
const bar = document.getElementById('progressBar');
const label = document.getElementById('progressLabel');
function updateProgress(){
  const done = Array.from(checks).filter(c=>c.checked).length;
  const pct = Math.round(done/checks.length*100);
  bar.style.width = pct+'%';
  label.textContent = pct+'% complete';
  safeStore.setItem('victory:progress', JSON.stringify(Array.from(checks).map(c=>c.checked)));
}
checks.forEach((c,i)=>{
  c.addEventListener('change', updateProgress);
});
try {
  const saved = JSON.parse(safeStore.getItem('victory:progress')||'[]');
  saved.forEach((v,i)=>{ if(checks[i]) checks[i].checked=v; });
} catch(e){}
updateProgress();

// ---------- QUIZ ----------
const quizRoot = document.getElementById('quiz');
window.QUIZ.forEach((item, i) => {
  const q = document.createElement('div');
  q.className = 'q';
  q.innerHTML = `
    <p class="q-title">${i+1}. ${item.q}</p>
    <div class="q-opts">
      ${item.opts.map((o,j)=>`
        <label><input type="radio" name="q${i}" value="${j}"/> <span>${o}</span></label>
      `).join('')}
    </div>
    <div class="q-feedback" data-fb></div>`;
  quizRoot.appendChild(q);
});
const qActions = document.createElement('div');
qActions.className = 'quiz-actions';
qActions.innerHTML = `<button class="btn primary" id="quizCheck">Check answers</button>
  <button class="btn ghost" id="quizReset">Reset</button>
  <span class="quiz-score" id="quizScore"></span>`;
quizRoot.appendChild(qActions);
document.getElementById('quizCheck').addEventListener('click', () => {
  let score = 0;
  window.QUIZ.forEach((item,i) => {
    const q = quizRoot.children[i];
    const chosen = q.querySelector(`input[name="q${i}"]:checked`);
    const fb = q.querySelector('[data-fb]');
    q.classList.remove('correct','wrong');
    if (!chosen){ fb.textContent='(no answer)'; fb.className='q-feedback no'; return; }
    if (parseInt(chosen.value,10)===item.a){
      q.classList.add('correct'); fb.textContent='Correct.'; fb.className='q-feedback ok'; score++;
    } else {
      q.classList.add('wrong');
      fb.textContent = 'Answer: '+item.opts[item.a];
      fb.className = 'q-feedback no';
    }
  });
  document.getElementById('quizScore').textContent = `Score: ${score} / ${window.QUIZ.length}`;
});
document.getElementById('quizReset').addEventListener('click', () => {
  quizRoot.querySelectorAll('input[type=radio]').forEach(r=>r.checked=false);
  quizRoot.querySelectorAll('.q').forEach(q=>q.classList.remove('correct','wrong'));
  quizRoot.querySelectorAll('[data-fb]').forEach(f=>{f.textContent='';f.className='q-feedback'});
  document.getElementById('quizScore').textContent='';
});

// ---------- FLASHCARDS ----------
let fi = 0;
const flashcard = document.getElementById('flashcard');
const flashRef = document.getElementById('flashRef');
const flashText = document.getElementById('flashText');
const flashCount = document.getElementById('flashCount');
function renderFlash(){
  const c = window.FLASHCARDS[fi];
  flashRef.textContent = c.ref;
  flashText.textContent = '“'+c.text+'”';
  flashCount.textContent = `${fi+1} / ${window.FLASHCARDS.length}`;
  flashcard.classList.remove('flipped');
}
flashcard.addEventListener('click', ()=> flashcard.classList.toggle('flipped'));
document.getElementById('flashPrev').addEventListener('click', ()=>{ fi=(fi-1+window.FLASHCARDS.length)%window.FLASHCARDS.length; renderFlash(); });
document.getElementById('flashNext').addEventListener('click', ()=>{ fi=(fi+1)%window.FLASHCARDS.length; renderFlash(); });
renderFlash();

// ---------- JOURNAL ----------
const journal = document.getElementById('journal');
const jStatus = document.getElementById('journalStatus');
journal.value = safeStore.getItem('victory:journal') || '';
document.getElementById('journalSave').addEventListener('click', () => {
  safeStore.setItem('victory:journal', journal.value);
  jStatus.textContent = 'Saved to this device';
  setTimeout(()=>jStatus.textContent='', 1600);
});
document.getElementById('journalClear').addEventListener('click', () => {
  if (confirm('Clear your journal on this device?')){ journal.value=''; safeStore.removeItem('victory:journal'); }
});

// ---------- ACCESSIBILITY ----------
const AA = ['','aa-lg','aa-xl'];
let aaIdx = parseInt(safeStore.getItem('victory:aa')||'0',10);
function applyAA(){ document.body.classList.remove('aa-lg','aa-xl'); if(AA[aaIdx]) document.body.classList.add(AA[aaIdx]); safeStore.setItem('victory:aa', aaIdx); }
applyAA();
document.getElementById('btnAA').addEventListener('click', ()=>{ aaIdx=(aaIdx+1)%AA.length; applyAA(); });

const contrastOn = safeStore.getItem('victory:contrast')==='1';
if (contrastOn) document.body.classList.add('contrast');
document.getElementById('btnContrast').addEventListener('click', ()=>{
  document.body.classList.toggle('contrast');
  safeStore.setItem('victory:contrast', document.body.classList.contains('contrast')?'1':'0');
});

// ---------- READ ALOUD ----------
let utterance = null;
document.getElementById('btnRead').addEventListener('click', () => {
  if (utterance && speechSynthesis.speaking){ speechSynthesis.cancel(); return; }
  const openMod = document.querySelector('.module.open .module-body') || document.querySelector('.module .module-body');
  const txt = openMod ? openMod.innerText : document.querySelector('.hero').innerText;
  utterance = new SpeechSynthesisUtterance(txt);
  utterance.rate = 0.95;
  speechSynthesis.speak(utterance);
});

// ---------- SHARE ----------
document.getElementById('shareWhats').addEventListener('click', () => {
  const t = `Receive Victory Over Battles in Christ Jesus — a teaching by Pastor Kiky Ocansey, L137 Deliverance Ministry (08.17.26). ${location.href}`;
  window.open('https://wa.me/?text='+encodeURIComponent(t),'_blank');
});
document.getElementById('shareCopy').addEventListener('click', () => {
  navigator.clipboard.writeText(location.href);
  flash(document.getElementById('shareCopy'),'Copied');
});
document.getElementById('printBtn').addEventListener('click', () => window.print());
