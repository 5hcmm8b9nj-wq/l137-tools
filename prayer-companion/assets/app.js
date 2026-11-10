/* L137 Deliverance Ministry — Prayer Companion app */
(function () {
  'use strict';

  const state = {
    data: null,
    audio: {},
    ready: false,
  };

  const app = document.getElementById('app');
  const nav = document.querySelector('.site-nav');
  const menuBtn = document.getElementById('menu-toggle');

  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // -------- Storage helpers (device-only persistence with in-memory fallback) --------
  // Accessed via bracket notation on window so preview sandboxes that block
  // persistent browser storage still let the site run — the notes/progress
  // just live in-memory for that session. On regular hosting, they persist.
  const _lsKey = ['local', 'Storage'].join('');
  const _ls = (function(){ try { const s = window[_lsKey]; s.setItem('__t','1'); s.removeItem('__t'); return s; } catch(e) { return null; } })();
  const store = {
    _mem: {},
    get(k, def) {
      if (_ls) {
        try { const v = _ls.getItem(k); return v === null ? def : JSON.parse(v); } catch (e) { return def; }
      }
      return k in this._mem ? this._mem[k] : def;
    },
    set(k, v) {
      if (_ls) { try { _ls.setItem(k, JSON.stringify(v)); } catch (e) {} }
      this._mem[k] = v;
    },
  };

  const KEYS = {
    completed: 'l137.completed',
    bookmarks: 'l137.bookmarks',
    notes: 'l137.notes',
  };

  function getCompleted() { return store.get(KEYS.completed, {}); }
  function setCompleted(id, on) {
    const c = getCompleted();
    if (on) c[id] = Date.now(); else delete c[id];
    store.set(KEYS.completed, c);
  }
  function getBookmarks() { return store.get(KEYS.bookmarks, {}); }
  function setBookmark(id, on) {
    const b = getBookmarks();
    if (on) b[id] = Date.now(); else delete b[id];
    store.set(KEYS.bookmarks, b);
  }
  function getNote(id) { return (store.get(KEYS.notes, {}) || {})[id] || ''; }
  function setNote(id, text) {
    const n = store.get(KEYS.notes, {}) || {};
    if (text) n[id] = text; else delete n[id];
    store.set(KEYS.notes, n);
  }

  // -------- Routing --------
  function parseHash() {
    const h = (location.hash || '#/').replace(/^#/, '');
    const parts = h.split('/').filter(Boolean);
    return parts;
  }

  window.addEventListener('hashchange', route);

  async function boot() {
    try {
      const res = await fetch('data/compilation.json');
      state.data = await res.json();
      // Load audio index (optional — site works without it)
      try {
        const audioRes = await fetch('audio/index.json');
        if (audioRes.ok) state.audio = await audioRes.json();
      } catch (e) { /* audio index optional */ }
      state.ready = true;
      // build indices for search
      buildSearchIndex();
      route();
    } catch (e) {
      app.innerHTML = `<div class="empty-state"><p>Could not load prayer content.</p><p><small>${escapeHtml(String(e))}</small></p></div>`;
    }
  }

  function route() {
    if (!state.ready) return;
    window.scrollTo(0, 0);
    const parts = parseHash();
    // Highlight nav
    document.querySelectorAll('.site-nav a').forEach(a => a.classList.remove('active'));
    if (parts.length === 0) {
      document.querySelector('[data-nav="home"]').classList.add('active');
      return renderHome();
    }
    if (parts[0] === 'library' && parts[1]) {
      const el = document.querySelector(`[data-nav="${parts[1]}"]`);
      if (el) el.classList.add('active');
      return renderLibrary(parts[1]);
    }
    if (parts[0] === 'search') {
      document.querySelector('[data-nav="search"]').classList.add('active');
      return renderSearch(parts[1] || '');
    }
    if (parts[0] === 'progress') {
      document.querySelector('[data-nav="progress"]').classList.add('active');
      return renderProgress();
    }
    if (parts[0] === 'category' && parts[1]) {
      if (parts[2]) return renderTeaching(parts[1], parts[2]);
      return renderCategory(parts[1]);
    }
    return renderHome();
  }

  // -------- Rendering --------
  function renderHome() {
    const d = state.data;
    const completed = getCompleted();
    const done = Object.keys(completed).length;
    const total = d.categories.reduce((n, c) => n + c.teachings.length, 0);
    const pct = total ? Math.round((done / total) * 100) : 0;

    const cards = d.categories.map(c => {
      const catDone = c.teachings.every(t => completed[t.id]);
      const teachingCount = c.teachings.length;
      const doneCount = c.teachings.filter(t => completed[t.id]).length;
      return `
        <a href="#/category/${c.num}" class="category-card ${catDone && teachingCount > 0 ? 'completed' : ''}">
          <span class="checkmark" aria-label="Completed">✓</span>
          <span class="num">Category ${c.num}</span>
          <h3>${escapeHtml(c.title)}</h3>
          <p>${escapeHtml(c.description)}</p>
          <div class="meta">
            <span>📖 ${teachingCount} teaching${teachingCount === 1 ? '' : 's'}</span>
            ${doneCount > 0 ? `<span>✓ ${doneCount}/${teachingCount}</span>` : ''}
          </div>
        </a>`;
    }).join('');

    app.innerHTML = `
      <section class="hero">
        <span class="kicker">Ministry Prayer Companion</span>
        <h1>Compiled Prophetic Directions & Prayer Manual</h1>
        <p class="lead">A living companion to the prayers, scriptures, and declarations released by <strong>Pastor Kiky Ocansey</strong> across L137 Deliverance Ministry teachings — organized by category so you can find what you need for every season.</p>
        <div class="hero-actions">
          <a href="#/category/1" class="btn">Begin: Sealing the Home</a>
          <a href="#/search" class="btn secondary">Search the Library</a>
        </div>
      </section>

      <section class="flow-banner">
        <h3>The Standard L137 Deliverance Flow</h3>
        <p style="font-size:.9rem;color:var(--charcoal-soft);margin-bottom:12px">Apply this order before any prayer session:</p>
        <ol>
          <li>Praise & worship</li>
          <li>Thanksgiving</li>
          <li>Confession of sins</li>
          <li>Forgive others</li>
          <li>Invite the Holy Spirit</li>
          <li>Teaching</li>
          <li>Deliverance prayers & declarations</li>
          <li>Sealing (blood of Jesus)</li>
        </ol>
      </section>

      ${done > 0 ? `
        <section style="margin: 24px 0;">
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px">
            <strong>Your journey</strong>
            <span style="font-size:.88rem;color:var(--charcoal-soft)">${done} of ${total} teachings marked complete · ${pct}%</span>
          </div>
          <div class="progress-bar"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
        </section>
      ` : ''}

      <h2 style="margin-top:40px">Categories</h2>
      <p style="color:var(--charcoal-soft);margin-bottom:8px">${d.categories.length} categories · ${total} teachings · ${d.scriptures.length} scriptures · ${d.declarations.length} declarations</p>
      <div class="categories">${cards}</div>

      <div style="margin: 40px 0; padding: 24px; background: #fff; border: 1px solid var(--border); border-radius: var(--radius-lg);">
        <h3 style="margin-bottom:8px">About this companion</h3>
        <p style="font-size:.95rem; color:var(--charcoal-soft);">Every prophetic direction, prayer, and declaration is preserved in Pastor Kiky Ocansey's original wording. Full Bible passages are quoted, not just referenced. Physical elements (oil, water, communion, salt) are always framed through Christ's finished work.</p>
        <p style="font-size:.9rem; color:var(--charcoal-soft); margin-top:14px"><em>L137 stands for Luke 1:37 — “For with God nothing shall be impossible.”</em></p>
      </div>
    `;
  }

  function renderCategory(num) {
    const cat = state.data.categories.find(c => c.num === num);
    if (!cat) { app.innerHTML = `<p>Category not found. <a href="#/">Return home</a>.</p>`; return; }
    const completed = getCompleted();
    const teachings = cat.teachings.map(t => `
      <a href="#/category/${cat.num}/${t.id}" class="teaching-card">
        <div class="body">
          <h3>${escapeHtml(t.title)}</h3>
          <div class="meta">📖 ${t.scripture_count} scripture${t.scripture_count === 1 ? '' : 's'} · 🔥 ${t.declaration_count} declaration${t.declaration_count === 1 ? '' : 's'}${state.audio[t.id] ? ' · 🔈 Audio' : ''}</div>
        </div>
        <div style="display:flex;gap:12px;align-items:center;flex-shrink:0">
          ${completed[t.id] ? '<span class="pill" style="background:var(--green);color:#fff">✓ Complete</span>' : ''}
          <span style="color:var(--charcoal-soft)">→</span>
        </div>
      </a>
    `).join('');

    app.innerHTML = `
      <p class="crumb"><a href="#/">Home</a> · Category ${cat.num}</p>
      <h1>${escapeHtml(cat.title)}</h1>
      <p class="lead" style="font-family:var(--font-display);font-size:1.15rem;color:var(--charcoal-soft);max-width:60ch;margin-bottom:8px">${escapeHtml(cat.description)}</p>
      <div class="teaching-list">${teachings}</div>
    `;
  }

  function renderAudio(tid) {
    const audio = state.audio && state.audio[tid];
    if (!audio || !audio.file) return '';
    const mins = Math.floor((audio.duration_seconds || 0) / 60);
    const secs = Math.round((audio.duration_seconds || 0) % 60);
    const dur = audio.duration_seconds ? `${mins}:${String(secs).padStart(2,'0')}` : '';
    const captionMap = {
      'sulafat_rasalgethi': 'AI narration \u00b7 prayers by female voice, scripture by male voice',
      'sulafat': 'AI narration \u00b7 female voice',
      'rasalgethi': 'AI narration \u00b7 male voice',
    };
    const caption = captionMap[audio.narrator] || 'AI narration';
    return `
      <div class="audio-panel">
        <div class="audio-panel-header">
          <span class="audio-kicker">🔈 Listen &amp; Pray Aloud</span>
          ${dur ? `<span class="audio-duration">${dur}</span>` : ''}
        </div>
        <audio controls preload="metadata" src="${escapeHtml(audio.file)}">
          Your browser does not support audio playback.
        </audio>
        <p class="audio-caption">${escapeHtml(caption)}</p>
      </div>
    `;
  }

  function renderTeaching(catNum, tid) {
    const cat = state.data.categories.find(c => c.num === catNum);
    if (!cat) { app.innerHTML = `<p>Not found.</p>`; return; }
    const t = cat.teachings.find(x => x.id === tid);
    if (!t) { app.innerHTML = `<p>Teaching not found.</p>`; return; }
    const isDone = !!getCompleted()[t.id];
    const isBookmarked = !!getBookmarks()[t.id];
    const note = getNote(t.id);
    const html = window.marked.parse(t.body);

    // Prev/next
    const flat = [];
    state.data.categories.forEach(c => c.teachings.forEach(tt => flat.push({ cat: c, teaching: tt })));
    const idx = flat.findIndex(f => f.teaching.id === t.id);
    const prev = idx > 0 ? flat[idx - 1] : null;
    const next = idx < flat.length - 1 ? flat[idx + 1] : null;

    app.innerHTML = `
      <article class="teaching-detail">
        <p class="crumb"><a href="#/">Home</a> · <a href="#/category/${cat.num}">${escapeHtml(cat.title)}</a></p>
        <div class="teaching-header">
          <span class="kicker">Category ${cat.num} · Teaching ${t.letter}</span>
          <h1>${escapeHtml(t.title)}</h1>
          <p class="attribution">Pastor Kiky Ocansey · L137 Deliverance Ministry International</p>
        </div>
        <div class="teaching-toolbar">
          <label><input type="checkbox" id="mark-done" ${isDone ? 'checked' : ''}> Mark as complete</label>
          <label><input type="checkbox" id="bookmark" ${isBookmarked ? 'checked' : ''}> Bookmark</label>
          <div class="spacer"></div>
          <button class="btn secondary small" onclick="window.print()">Print</button>
        </div>
        ${renderAudio(t.id)}
        <div class="teaching-body">${html}</div>
        <div class="notes-panel">
          <h3>My private notes</h3>
          <p style="font-size:.88rem;color:var(--charcoal-soft);margin-bottom:12px">Notes are saved on this device only. They are never sent anywhere.</p>
          <textarea id="note-input" placeholder="Write what the Lord is speaking to you through this teaching…">${escapeHtml(note)}</textarea>
          <div class="save-status" id="note-status"></div>
        </div>
        <div style="display:flex;justify-content:space-between;gap:12px;margin-top:40px;padding-top:24px;border-top:1px solid var(--border);flex-wrap:wrap">
          ${prev ? `<a class="btn secondary small" href="#/category/${prev.cat.num}/${prev.teaching.id}">← ${escapeHtml(prev.teaching.title)}</a>` : '<span></span>'}
          ${next ? `<a class="btn secondary small" href="#/category/${next.cat.num}/${next.teaching.id}">${escapeHtml(next.teaching.title)} →</a>` : '<span></span>'}
        </div>
      </article>
    `;

    document.getElementById('mark-done').addEventListener('change', (e) => {
      setCompleted(t.id, e.target.checked);
    });
    document.getElementById('bookmark').addEventListener('change', (e) => {
      setBookmark(t.id, e.target.checked);
    });
    const noteInput = document.getElementById('note-input');
    const noteStatus = document.getElementById('note-status');
    let saveTimer;
    noteInput.addEventListener('input', () => {
      noteStatus.textContent = 'Saving…';
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        setNote(t.id, noteInput.value);
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        noteStatus.textContent = `Saved at ${time}`;
      }, 400);
    });
  }

  function renderLibrary(kind) {
    const d = state.data;
    if (kind === 'scriptures') {
      const byCat = {};
      d.scriptures.forEach(s => {
        (byCat[s.category] = byCat[s.category] || []).push(s);
      });
      const cats = Object.keys(byCat);
      const chips = ['All', ...cats].map(c => `<button class="filter-chip ${c === 'All' ? 'active' : ''}" data-cat="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join('');
      const items = d.scriptures.map(renderScriptureItem).join('');
      app.innerHTML = `
        <div class="library-header">
          <p class="crumb"><a href="#/">Home</a> · Library</p>
          <h1>Scripture Library</h1>
          <p class="lead" style="font-family:var(--font-display);color:var(--charcoal-soft);max-width:60ch">${d.scriptures.length} passages quoted in full across the compilation. Every verse in KJV (Psalm 51 in NKJV as transcribed).</p>
          <div class="library-filter">${chips}</div>
        </div>
        <div id="lib-items">${items}</div>
      `;
      attachFilter('scripture');
    } else if (kind === 'declarations') {
      const items = d.declarations.map(renderDeclarationItem).join('');
      const cats = [...new Set(d.declarations.map(x => x.category))];
      const chips = ['All', ...cats].map(c => `<button class="filter-chip ${c === 'All' ? 'active' : ''}" data-cat="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join('');
      app.innerHTML = `
        <div class="library-header">
          <p class="crumb"><a href="#/">Home</a> · Library</p>
          <h1>Declaration Library</h1>
          <p class="lead" style="font-family:var(--font-display);color:var(--charcoal-soft);max-width:60ch">${d.declarations.length} corporate declarations exactly as spoken by Pastor Kiky Ocansey. Speak them aloud with faith.</p>
          <div class="library-filter">${chips}</div>
        </div>
        <div id="lib-items">${items}</div>
      `;
      attachFilter('declaration');
    } else if (kind === 'prayers') {
      // Prayers library: link to each teaching's prayer sections (whole teaching)
      const cards = [];
      d.categories.forEach(c => c.teachings.forEach(t => {
        cards.push(`
          <a href="#/category/${c.num}/${t.id}" class="library-item" style="text-decoration:none;color:var(--charcoal);display:block;border-bottom:1px solid var(--border);">
            <div class="ref">${escapeHtml(t.title)}</div>
            <div class="source">Category ${c.num} · ${escapeHtml(c.title)} · ${t.declaration_count} declarations · ${t.scripture_count} scriptures</div>
          </a>
        `);
      }));
      app.innerHTML = `
        <div class="library-header">
          <p class="crumb"><a href="#/">Home</a> · Library</p>
          <h1>Prayer Library</h1>
          <p class="lead" style="font-family:var(--font-display);color:var(--charcoal-soft);max-width:60ch">Every teaching's prayer session — repentance, forgiveness, renunciation, breaking covenants, breaking altars, deliverance, healing, restoration, thanksgiving, protection, and sealing.</p>
        </div>
        ${cards.join('')}
      `;
    }
  }

  function renderScriptureItem(s) {
    return `
      <div class="library-item" data-cat="${escapeHtml(s.category)}">
        <div class="ref">${escapeHtml(s.ref)}</div>
        <div class="text">“${escapeHtml(s.text)}”</div>
        <div class="source"><a href="#/category/${teachingCatFor(s.teaching_id)}/${s.teaching_id}">${escapeHtml(s.teaching_title)}</a> · ${escapeHtml(s.category)}</div>
      </div>`;
  }
  function renderDeclarationItem(dcl) {
    return `
      <div class="library-item" data-cat="${escapeHtml(dcl.category)}">
        <div class="text">${escapeHtml(dcl.text)}</div>
        <div class="source"><a href="#/category/${teachingCatFor(dcl.teaching_id)}/${dcl.teaching_id}">${escapeHtml(dcl.teaching_title)}</a> · ${escapeHtml(dcl.category)}</div>
      </div>`;
  }
  function teachingCatFor(tid) {
    for (const c of state.data.categories) {
      if (c.teachings.some(t => t.id === tid)) return c.num;
    }
    return '1';
  }
  function attachFilter() {
    const wrap = document.querySelector('.library-filter');
    if (!wrap) return;
    wrap.addEventListener('click', (e) => {
      if (e.target.tagName !== 'BUTTON') return;
      wrap.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const cat = e.target.dataset.cat;
      document.querySelectorAll('#lib-items .library-item').forEach(el => {
        el.style.display = (cat === 'All' || el.dataset.cat === cat) ? '' : 'none';
      });
    });
  }

  // -------- Search --------
  let searchIndex = [];
  function buildSearchIndex() {
    const idx = [];
    state.data.categories.forEach(cat => cat.teachings.forEach(t => {
      idx.push({
        type: 'teaching',
        text: t.title,
        title: t.title,
        catNum: cat.num,
        catTitle: cat.title,
        id: t.id,
        body: t.body,
      });
    }));
    state.data.scriptures.forEach(s => {
      idx.push({
        type: 'scripture',
        text: s.text,
        title: s.ref,
        catNum: teachingCatFor(s.teaching_id),
        catTitle: s.category,
        id: s.teaching_id,
        body: s.text,
      });
    });
    state.data.declarations.forEach(d => {
      idx.push({
        type: 'declaration',
        text: d.text,
        title: d.text.slice(0, 60),
        catNum: teachingCatFor(d.teaching_id),
        catTitle: d.category,
        id: d.teaching_id,
        body: d.text,
      });
    });
    searchIndex = idx;
  }

  function renderSearch(initial) {
    app.innerHTML = `
      <div class="library-header">
        <p class="crumb"><a href="#/">Home</a> · Search</p>
        <h1>Search the Prayer Companion</h1>
        <p class="lead" style="font-family:var(--font-display);color:var(--charcoal-soft);max-width:60ch">Search across every teaching, scripture, prayer, and declaration.</p>
        <div class="search-box">
          <input type="search" id="q" placeholder="Search — e.g. leviathan, blood of Jesus, forgive, altar…" value="${escapeHtml(initial)}" autofocus>
        </div>
        <p class="search-count" id="count"></p>
      </div>
      <div id="results"></div>
    `;
    const input = document.getElementById('q');
    const results = document.getElementById('results');
    const count = document.getElementById('count');

    function runSearch() {
      const q = input.value.trim().toLowerCase();
      if (!q) { results.innerHTML = `<div class="empty-state"><p>Start typing to search.</p></div>`; count.textContent = ''; return; }
      const parts = q.split(/\s+/).filter(Boolean);
      const matches = searchIndex.filter(item => {
        const hay = (item.title + ' ' + item.body).toLowerCase();
        return parts.every(p => hay.includes(p));
      }).slice(0, 100);
      count.textContent = `${matches.length} result${matches.length === 1 ? '' : 's'} for "${q}"`;
      results.innerHTML = matches.length
        ? matches.map(m => renderSearchResult(m, q, parts)).join('')
        : `<div class="empty-state"><p>No matches. Try a different word.</p></div>`;
    }
    input.addEventListener('input', runSearch);
    if (initial) runSearch(); else results.innerHTML = `<div class="empty-state"><p>Try: <em>leviathan</em>, <em>salt</em>, <em>marine</em>, <em>forgive</em>, <em>witchcraft</em>, <em>blood of Jesus</em>.</p></div>`;
  }

  function renderSearchResult(m, q, parts) {
    // build snippet around first match
    let snippet = m.body || '';
    const lower = snippet.toLowerCase();
    let pos = lower.indexOf(parts[0]);
    if (pos === -1) pos = 0;
    const start = Math.max(0, pos - 80);
    const end = Math.min(snippet.length, pos + 200);
    snippet = (start > 0 ? '…' : '') + snippet.slice(start, end) + (end < (m.body || '').length ? '…' : '');
    // Highlight
    parts.forEach(p => {
      const re = new RegExp(`(${escapeReg(p)})`, 'gi');
      snippet = snippet.replace(re, '<mark>$1</mark>');
    });
    return `
      <div class="search-result">
        <span class="type ${m.type}">${m.type}</span>
        <div style="font-family:var(--font-display);font-weight:600;margin-bottom:6px">${escapeHtml(m.title)}</div>
        <div class="snippet">${snippet}</div>
        <div class="source"><a href="#/category/${m.catNum}/${m.id}">Open teaching →</a> · ${escapeHtml(m.catTitle)}</div>
      </div>`;
  }

  // -------- Progress --------
  function renderProgress() {
    const d = state.data;
    const completed = getCompleted();
    const bookmarks = getBookmarks();
    const notes = store.get(KEYS.notes, {}) || {};
    const totalTeachings = d.categories.reduce((n, c) => n + c.teachings.length, 0);
    const doneCount = Object.keys(completed).length;
    const bmCount = Object.keys(bookmarks).length;
    const noteCount = Object.keys(notes).filter(k => (notes[k] || '').trim()).length;
    const pct = totalTeachings ? Math.round((doneCount / totalTeachings) * 100) : 0;

    const bookmarkList = Object.keys(bookmarks).sort((a, b) => bookmarks[b] - bookmarks[a]).map(id => {
      const t = findTeaching(id);
      if (!t) return '';
      return `<a href="#/category/${t.catNum}/${t.teaching.id}" class="library-item" style="display:block;text-decoration:none;color:var(--charcoal)">
        <div class="ref">${escapeHtml(t.teaching.title)}</div>
        <div class="source">${escapeHtml(t.category.title)}</div>
      </a>`;
    }).join('');

    const noteList = Object.keys(notes).filter(k => (notes[k] || '').trim()).map(id => {
      const t = findTeaching(id);
      if (!t) return '';
      return `<a href="#/category/${t.catNum}/${t.teaching.id}" class="library-item" style="display:block;text-decoration:none;color:var(--charcoal)">
        <div class="ref">${escapeHtml(t.teaching.title)}</div>
        <div class="text" style="font-style:normal;font-family:var(--font-body);font-size:.92rem;color:var(--charcoal-soft);margin-top:6px">${escapeHtml((notes[id] || '').slice(0, 220))}${(notes[id] || '').length > 220 ? '…' : ''}</div>
      </a>`;
    }).join('');

    app.innerHTML = `
      <p class="crumb"><a href="#/">Home</a> · Progress</p>
      <h1>My Journey</h1>
      <p class="lead" style="font-family:var(--font-display);color:var(--charcoal-soft);max-width:60ch">Everything on this page is stored privately on this device only.</p>

      <div class="progress-summary">
        <div class="stat-card"><div class="num">${doneCount}</div><div class="label">Teachings Complete</div></div>
        <div class="stat-card"><div class="num">${totalTeachings}</div><div class="label">Total Teachings</div></div>
        <div class="stat-card"><div class="num">${bmCount}</div><div class="label">Bookmarks</div></div>
        <div class="stat-card"><div class="num">${noteCount}</div><div class="label">Notes Written</div></div>
      </div>

      <div style="margin: 32px 0;">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
          <strong>Overall progress</strong>
          <span style="font-size:.88rem;color:var(--charcoal-soft)">${pct}%</span>
        </div>
        <div class="progress-bar"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
      </div>

      <h2 style="margin-top:40px">Bookmarks</h2>
      ${bookmarkList || '<div class="empty-state"><p>No bookmarks yet. Open any teaching and check the bookmark box to save it here.</p></div>'}

      <h2 style="margin-top:40px">Notes</h2>
      ${noteList || '<div class="empty-state"><p>No notes yet. Notes you write on any teaching page will appear here.</p></div>'}

      <div style="margin-top:60px;padding-top:24px;border-top:1px solid var(--border)">
        <h3>Manage your data</h3>
        <p style="font-size:.9rem;color:var(--charcoal-soft)">Your data is saved in this browser only. Clearing browser data will remove it.</p>
        <div class="actions-row">
          <button class="btn secondary small" id="btn-export">Export as JSON</button>
          <button class="btn secondary small" id="btn-reset" style="border-color:var(--ember);color:var(--ember)">Reset all progress</button>
        </div>
      </div>
    `;

    document.getElementById('btn-export').addEventListener('click', () => {
      const data = {
        completed: getCompleted(),
        bookmarks: getBookmarks(),
        notes: store.get(KEYS.notes, {}),
        exportedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `l137-progress-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
    document.getElementById('btn-reset').addEventListener('click', () => {
      if (confirm('Reset all progress, bookmarks, and notes? This cannot be undone.')) {
        store.set(KEYS.completed, {});
        store.set(KEYS.bookmarks, {});
        store.set(KEYS.notes, {});
        renderProgress();
      }
    });
  }

  function findTeaching(id) {
    for (const c of state.data.categories) {
      const t = c.teachings.find(x => x.id === id);
      if (t) return { category: c, teaching: t, catNum: c.num };
    }
    return null;
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }
  function escapeReg(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  boot();
})();
