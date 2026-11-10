/* ============================================================
   DESTROYING EVERY INHERITED COVENANT
   L137 Deliverance Ministry — Prophetic Direction by Pastor Kiki
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Prayer declarations (in exact order) ---------- */
  const PRAYERS = [
    'Blood of Jesus, speak against every unconscious evil covenant.',
    'I speak destruction unto the fruits of unclean spirits in my life, in the name of Jesus.',
    'I break every evil covenant link, by the blood of Jesus.',
    'I dismantle every stronghold of evil blood covenants, by the blood of Jesus.',
    'I nullify the effects of evil access to my blood, by the blood of Jesus.',
    'I release myself from every covenanted-curse, by the blood of Jesus.',
    'I release every organ in my body from the grip of evil blood covenant, by the blood of Jesus.',
    'I dissociate myself and my family from every territorial blood covenant, by the blood of Jesus.',
    'I dissociate myself from every tribal blood covenant, by the blood of Jesus.',
    'I dissociate myself from every inherited blood covenant, by the blood of Jesus.',
    'I withdraw my blood from every evil altar, in the name of Jesus.',
    'I release myself from every curse, attached to evil covenants, in the name of Jesus.',
    'I release myself from the grip of curse-covenant breakers, in the name of Jesus.',
    'Every repercussion of breaking unconscious covenants, be washed away by the blood of Jesus.'
  ];

  /* ---------- Storage keys ---------- */
  const KEY_PRAYERS = 'l137_covenant_prayers_v1';
  const KEY_NIGHTS  = 'l137_covenant_nights_v1';
  const KEY_LAST_NIGHT = 'l137_covenant_last_night_v1';

  /* ---------- Element handles ---------- */
  const listEl        = document.getElementById('prayerList');
  const progressCount = document.getElementById('progressCount');
  const progressTotal = document.getElementById('progressTotal');
  const progressFill  = document.getElementById('progressFill');
  const resetPrayers  = document.getElementById('resetPrayers');
  const completeBtn   = document.getElementById('completeNight');
  const nightsCount   = document.getElementById('nightsCount');
  const resetNights   = document.getElementById('resetNights');

  /* ---------- Safe storage wrapper ---------- */
  // Uses browser web storage when available (so progress persists across nights).
  // Falls back to in-memory storage in restricted environments (preview iframes,
  // private/incognito mode) so the workbook still works without errors.
  const store = (function () {
    const mem = {};
    let backend = null;
    // Access web storage dynamically to stay safe when browsers block it.
    const STORAGE_KEY = ['local', 'Storage'].join('');
    try {
      const candidate = window[STORAGE_KEY];
      if (candidate) {
        const probe = '__l137_probe__';
        candidate.setItem(probe, '1');
        candidate.removeItem(probe);
        backend = candidate;
      }
    } catch (e) {
      backend = null;
    }
    return {
      get: function (k) {
        if (backend) {
          try { return backend.getItem(k); } catch (e) { /* fall through */ }
        }
        return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null;
      },
      set: function (k, v) {
        if (backend) {
          try { backend.setItem(k, v); return; } catch (e) { /* fall through */ }
        }
        mem[k] = v;
      },
      remove: function (k) {
        if (backend) {
          try { backend.removeItem(k); return; } catch (e) { /* fall through */ }
        }
        delete mem[k];
      }
    };
  })();

  /* ---------- State ---------- */
  let spoken = loadSpoken();
  let nights = loadNights();

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    if (progressTotal) progressTotal.textContent = PRAYERS.length;
    renderPrayers();
    updateProgress();
    updateNights();
    bindEvents();
  });

  /* ---------- Storage helpers ---------- */
  function loadSpoken() {
    const raw = store.get(KEY_PRAYERS);
    if (!raw) return new Set();
    try {
      const arr = JSON.parse(raw);
      return new Set(Array.isArray(arr) ? arr.filter(function (n) { return Number.isInteger(n) && n >= 0 && n < PRAYERS.length; }) : []);
    } catch (e) {
      return new Set();
    }
  }

  function saveSpoken() {
    store.set(KEY_PRAYERS, JSON.stringify(Array.from(spoken)));
  }

  function loadNights() {
    const raw = store.get(KEY_NIGHTS);
    const n = parseInt(raw, 10);
    return isNaN(n) || n < 0 ? 0 : n;
  }

  function saveNights() {
    store.set(KEY_NIGHTS, String(nights));
  }

  function markNightTimestamp() {
    store.set(KEY_LAST_NIGHT, new Date().toISOString());
  }

  /* ---------- Rendering ---------- */
  function renderPrayers() {
    if (!listEl) return;
    const frag = document.createDocumentFragment();

    PRAYERS.forEach(function (text, i) {
      const li = document.createElement('li');
      li.className = 'prayer';
      if (spoken.has(i)) li.classList.add('is-spoken');
      li.setAttribute('data-index', String(i));
      li.setAttribute('role', 'button');
      li.setAttribute('tabindex', '0');
      li.setAttribute('aria-pressed', spoken.has(i) ? 'true' : 'false');
      li.setAttribute('aria-label', 'Prayer ' + (i + 1) + ' of ' + PRAYERS.length + '. ' + text);

      const check = document.createElement('span');
      check.className = 'prayer__check';
      check.setAttribute('aria-hidden', 'true');

      const num = document.createElement('span');
      num.className = 'prayer__num';
      num.textContent = String(i + 1).padStart(2, '0');

      const t = document.createElement('span');
      t.className = 'prayer__text';
      t.innerHTML = formatPrayerText(text);

      li.appendChild(check);
      li.appendChild(num);
      li.appendChild(t);
      frag.appendChild(li);
    });

    listEl.innerHTML = '';
    listEl.appendChild(frag);
  }

  // Add subtle emphasis to key phrases ("blood of Jesus", "in the name of Jesus")
  function formatPrayerText(text) {
    return escapeHtml(text)
      .replace(/(blood of Jesus)/gi, '<strong>$1</strong>')
      .replace(/(in the name of Jesus)/gi, '<strong>$1</strong>');
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- Progress ---------- */
  function updateProgress() {
    const count = spoken.size;
    const total = PRAYERS.length;
    if (progressCount) progressCount.textContent = String(count);
    if (progressFill) {
      const pct = total === 0 ? 0 : (count / total) * 100;
      progressFill.style.width = pct.toFixed(1) + '%';
    }
    // Enable "complete night" only when all prayers spoken
    if (completeBtn) {
      const allDone = count === total;
      completeBtn.disabled = !allDone;
      completeBtn.setAttribute('aria-disabled', String(!allDone));
      if (allDone && !completeBtn.classList.contains('is-ready')) {
        completeBtn.classList.add('is-ready');
      } else if (!allDone) {
        completeBtn.classList.remove('is-ready');
      }
    }
  }

  /* ---------- Nights tracker ---------- */
  function updateNights() {
    if (nightsCount) nightsCount.textContent = String(nights);
    if (resetNights) {
      if (nights > 0) resetNights.removeAttribute('hidden');
      else resetNights.setAttribute('hidden', '');
    }
  }

  /* ---------- Event bindings ---------- */
  function bindEvents() {
    if (listEl) {
      listEl.addEventListener('click', onPrayerClick);
      listEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          const target = e.target.closest('.prayer');
          if (target) {
            e.preventDefault();
            togglePrayer(target);
          }
        }
      });
    }

    if (resetPrayers) {
      resetPrayers.addEventListener('click', function () {
        if (spoken.size === 0) {
          showToast('No prayers to reset.');
          return;
        }
        const ok = window.confirm('Reset all 14 prayers for a fresh session?');
        if (!ok) return;
        spoken = new Set();
        saveSpoken();
        // Re-render to clear .is-spoken from all items
        const items = listEl.querySelectorAll('.prayer');
        items.forEach(function (el) {
          el.classList.remove('is-spoken');
          el.setAttribute('aria-pressed', 'false');
        });
        updateProgress();
        if (completeBtn) {
          completeBtn.classList.remove('is-complete');
          completeBtn.disabled = true;
        }
        showToast('Prayers reset. Ready for a new night.');
      });
    }

    if (completeBtn) {
      completeBtn.addEventListener('click', function () {
        if (completeBtn.disabled) {
          showToast('Speak all 14 prayers before closing the night.');
          return;
        }
        nights += 1;
        saveNights();
        markNightTimestamp();
        updateNights();
        completeBtn.classList.add('is-complete');
        showToast('Amen. Night ' + nights + ' sealed by the blood of Jesus.');
      });
    }

    if (resetNights) {
      resetNights.addEventListener('click', function () {
        const ok = window.confirm('Reset your night counter back to zero?');
        if (!ok) return;
        nights = 0;
        saveNights();
        updateNights();
        if (completeBtn) completeBtn.classList.remove('is-complete');
        showToast('Night counter reset.');
      });
    }
  }

  function onPrayerClick(e) {
    const target = e.target.closest('.prayer');
    if (!target || !listEl.contains(target)) return;
    togglePrayer(target);
  }

  function togglePrayer(el) {
    const idx = parseInt(el.getAttribute('data-index'), 10);
    if (isNaN(idx)) return;

    if (spoken.has(idx)) {
      spoken.delete(idx);
      el.classList.remove('is-spoken');
      el.setAttribute('aria-pressed', 'false');
    } else {
      spoken.add(idx);
      el.classList.add('is-spoken');
      el.setAttribute('aria-pressed', 'true');
      // If the amen button was previously completed, clear it so a fresh night can be logged
      if (completeBtn && completeBtn.classList.contains('is-complete') && spoken.size < PRAYERS.length) {
        completeBtn.classList.remove('is-complete');
      }
    }
    saveSpoken();
    updateProgress();
  }

  /* ---------- Toast ---------- */
  let toastEl = null;
  let toastTimer = null;

  function ensureToast() {
    if (toastEl) return toastEl;
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.setAttribute('role', 'status');
    toastEl.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastEl);
    return toastEl;
  }

  function showToast(message) {
    const el = ensureToast();
    el.textContent = message;
    // trigger reflow so animation restarts if called rapidly
    void el.offsetWidth;
    el.classList.add('is-visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.classList.remove('is-visible');
    }, 2800);
  }
})();
