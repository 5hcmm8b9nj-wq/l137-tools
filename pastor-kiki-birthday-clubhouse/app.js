// ===== Room timer =====
(function(){
  const clock = document.getElementById('clock');
  const startBtn = document.getElementById('startTimer');
  const pauseBtn = document.getElementById('pauseTimer');
  const resetBtn = document.getElementById('resetTimer');
  let seconds = 0, tick = null;

  function fmt(s){
    const m = Math.floor(s/60).toString().padStart(2,'0');
    const ss = (s%60).toString().padStart(2,'0');
    return `${m}:${ss}`;
  }
  function render(){ clock.textContent = fmt(seconds); }

  startBtn.addEventListener('click', ()=>{
    if(tick) return;
    tick = setInterval(()=>{ seconds++; render(); }, 1000);
    startBtn.textContent = '▶ Running…';
  });
  pauseBtn.addEventListener('click', ()=>{
    if(!tick) return;
    clearInterval(tick); tick = null;
    startBtn.textContent = '▶ Resume';
  });
  resetBtn.addEventListener('click', ()=>{
    clearInterval(tick); tick = null;
    seconds = 0; render();
    startBtn.textContent = '▶ Start Room Timer';
  });
  render();
})();

// ===== Reveal answer =====
document.querySelectorAll('.game-card .reveal').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const card = btn.closest('.game-card');
    card.classList.toggle('revealed');
    btn.textContent = card.classList.contains('revealed') ? 'Hide Answer' : 'Reveal Answer';
  });
});

// ===== Smooth scroll for nav chips =====
document.querySelectorAll('.segment-nav a').forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
  });
});
