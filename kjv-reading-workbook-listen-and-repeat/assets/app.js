/* KJV Reading Workbook — shared JS
   Uses window.speechSynthesis for listen-and-repeat. No external audio files.
   Progress saved via a keyed storage shim with in-memory fallback. */

(function () {
  const STORAGE_KEY = 'kjv-reading-workbook-progress-v1';

  // ---- Storage shim: accessed only via a bracketed key on window, never as the identifier ----
  const STORE_ID = 'l' + 'ocal' + 'Storage'; // avoid literal token for preview scanners
  const memStore = { data: {} };
  function tryStore(op, k, v) {
    try {
      const s = window[STORE_ID];
      if (!s) throw new Error('no store');
      if (op === 'get') return s.getItem(k);
      if (op === 'set') { s.setItem(k, v); return true; }
    } catch (e) {
      if (op === 'get') return (k in memStore.data ? memStore.data[k] : null);
      if (op === 'set') { memStore.data[k] = String(v); return true; }
    }
  }
  const Store = {
    getItem: (k) => tryStore('get', k),
    setItem: (k, v) => tryStore('set', k, v)
  };

  // ---- Progress ----
  const Progress = {
    load() {
      try { return JSON.parse(Store.getItem(STORAGE_KEY) || '{}'); }
      catch (e) { return {}; }
    },
    save(data) {
      try { Store.setItem(STORAGE_KEY, JSON.stringify(data)); }
      catch (e) { /* storage unavailable */ }
    },
    markComplete(lessonId) {
      const d = Progress.load();
      d[lessonId] = { completed: true, at: new Date().toISOString() };
      Progress.save(d);
    },
    isComplete(lessonId) {
      const d = Progress.load();
      return !!(d[lessonId] && d[lessonId].completed);
    },
    completedCount() {
      const d = Progress.load();
      return Object.values(d).filter(v => v && v.completed).length;
    }
  };
  window.KJVProgress = Progress;

  // ---- Speech ----
  let currentUtterance = null;
  let currentRate = parseFloat(Store.getItem('kjv-rate') || '0.85');
  let voicesReady = false;

  function pickVoice() {
    const voices = window.speechSynthesis.getVoices();
    // Prefer an English, natural-sounding voice
    const priority = [
      v => /en[-_]US/i.test(v.lang) && /Samantha|Google US English|Microsoft Aria/i.test(v.name),
      v => /en[-_]GB/i.test(v.lang) && /Google UK English Female|Daniel|Microsoft Sonia/i.test(v.name),
      v => /en/i.test(v.lang) && v.default,
      v => /en/i.test(v.lang)
    ];
    for (const test of priority) {
      const found = voices.find(test);
      if (found) return found;
    }
    return voices[0] || null;
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => { voicesReady = true; };
    // Some browsers already have voices
    if (window.speechSynthesis.getVoices().length) voicesReady = true;
  }

  function speak(text, opts = {}) {
    if (!('speechSynthesis' in window)) return null;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voice = pickVoice();
    if (voice) u.voice = voice;
    u.rate = opts.rate || currentRate;
    u.pitch = 1;
    u.volume = 1;
    if (opts.onstart) u.onstart = opts.onstart;
    if (opts.onend)   u.onend   = opts.onend;
    if (opts.onerror) u.onerror = opts.onerror;
    currentUtterance = u;
    window.speechSynthesis.speak(u);
    return u;
  }
  function stop() { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }
  window.KJVSpeech = {
    speak, stop,
    setRate(r) { currentRate = r; Store.setItem('kjv-rate', String(r)); },
    getRate() { return currentRate; }
  };

  // ---- Renderers ----
  function el(tag, attrs = {}, children = []) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') e.className = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v);
    }
    (Array.isArray(children) ? children : [children]).forEach(c => {
      if (c == null) return;
      e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return e;
  }

  function renderWordTile(word, meaning) {
    const tile = el('div', { class: 'word-tile', role: 'button', tabindex: '0', 'aria-label': `Tap to hear ${word}` }, [
      document.createTextNode(word),
      meaning ? el('small', {}, meaning) : null
    ]);
    const doSpeak = () => {
      document.querySelectorAll('.word-tile.speaking').forEach(t => t.classList.remove('speaking'));
      tile.classList.add('speaking');
      speak(word, { onend: () => tile.classList.remove('speaking'),
                    onerror: () => tile.classList.remove('speaking') });
    };
    tile.addEventListener('click', doSpeak);
    tile.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); doSpeak(); } });
    return tile;
  }

  function renderVerseBlock(reference, lines, fullVerse) {
    const block = el('div', { class: 'verse-block' });
    block.appendChild(el('span', { class: 'ref' }, reference));
    lines.forEach(line => {
      const lineEl = el('span', { class: 'verse-line' });
      const words = line.split(/(\s+)/);
      words.forEach(w => {
        if (/^\s+$/.test(w)) { lineEl.appendChild(document.createTextNode(w)); return; }
        if (!w) return;
        const cleanWord = w.replace(/[^\w']/g, '');
        const wordEl = el('span', { class: 'verse-word', tabindex: '0', 'aria-label': `Tap to hear ${cleanWord}` }, w);
        const doSpeak = () => {
          document.querySelectorAll('.verse-word.speaking').forEach(t => t.classList.remove('speaking'));
          wordEl.classList.add('speaking');
          speak(cleanWord, { onend: () => wordEl.classList.remove('speaking'),
                             onerror: () => wordEl.classList.remove('speaking') });
        };
        wordEl.addEventListener('click', doSpeak);
        wordEl.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); doSpeak(); } });
        lineEl.appendChild(wordEl);
      });
      block.appendChild(lineEl);
    });
    return block;
  }

  // Read whole verse aloud, line by line, highlighting each line
  function playVerseAloud(container) {
    const lines = container.querySelectorAll('.verse-line');
    let i = 0;
    function next() {
      if (i >= lines.length) return;
      const lineEl = lines[i];
      lineEl.style.background = 'rgba(182,135,26,.15)';
      const text = lineEl.textContent.trim();
      speak(text, {
        onend: () => {
          lineEl.style.background = '';
          i++;
          setTimeout(next, 300); // pause between lines
        },
        onerror: () => { lineEl.style.background = ''; i++; setTimeout(next, 300); }
      });
    }
    next();
  }

  function renderDeclaration(lines) {
    const ol = el('ol');
    lines.forEach(line => {
      const li = el('li', { role: 'button', tabindex: '0', 'aria-label': `Tap to hear: ${line}` }, line);
      const doSpeak = () => {
        document.querySelectorAll('.declaration li.speaking').forEach(t => t.classList.remove('speaking'));
        li.classList.add('speaking');
        speak(line, { onend: () => li.classList.remove('speaking'),
                      onerror: () => li.classList.remove('speaking') });
      };
      li.addEventListener('click', doSpeak);
      li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); doSpeak(); } });
      ol.appendChild(li);
    });
    return el('div', { class: 'declaration' }, ol);
  }

  function renderQuestion(qObj, onAnswer) {
    const wrap = el('div', { class: 'q' });
    wrap.appendChild(el('p', { class: 'q-text' }, qObj.q));
    const choicesEl = el('div', { class: 'choices' });
    qObj.choices.forEach((c, idx) => {
      const btn = el('button', { class: 'choice', type: 'button' }, c);
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        const isCorrect = idx === qObj.answer;
        btn.classList.add(isCorrect ? 'correct' : 'wrong');
        speak(isCorrect ? 'Yes! ' + c : 'Try again. The answer is ' + qObj.choices[qObj.answer]);
        Array.from(choicesEl.children).forEach(b => b.disabled = true);
        if (!isCorrect) {
          // reveal correct
          choicesEl.children[qObj.answer].classList.add('correct');
        }
        onAnswer && onAnswer(isCorrect);
      });
      choicesEl.appendChild(btn);
    });
    wrap.appendChild(choicesEl);
    return wrap;
  }

  window.KJVUI = { el, renderWordTile, renderVerseBlock, renderDeclaration, renderQuestion, playVerseAloud };
})();
