/* Shared UI rendering for the L137 Spiritual Warfare Toolkit */

(function() {
  const T = window.TOOLKIT;
  if (!T) return;

  window.renderNav = function(activeSlug, opts = {}) {
    const base = opts.base || './';
    return `
    <nav class="nav" aria-label="Primary">
      <div class="wrap">
        <a class="brand" href="${base}index.html" aria-label="Spiritual Warfare Toolkit home">
          <span class="brand-mark">L137</span>
          <span class="brand-text">Spiritual Warfare Toolkit<small>${T.ministry.name}</small></span>
        </a>
        <div class="nav-links">
          <a href="${base}categories/watchers-and-voices.html" ${activeSlug==='watchers-voices'?'class="active"':''}>Watchers &amp; Voices</a>
          <a href="${base}categories/serpents-and-waters.html" ${activeSlug==='serpents-waters'?'class="active"':''}>Serpents &amp; Waters</a>
          <a href="${base}categories/covenants-and-chains.html" ${activeSlug==='covenants-chains'?'class="active"':''}>Covenants &amp; Chains</a>
          <a href="${T.ministry.linktree}" target="_blank" rel="noopener">WhatsApp &amp; Ministry</a>
        </div>
      </div>
    </nav>`;
  };

  window.renderFooter = function(opts = {}) {
    const base = opts.base || './';
    return `
    <footer class="foot" role="contentinfo">
      <div class="wrap">
        <div>
          <div class="luke">${T.ministry.reference} — “${T.ministry.tagline}”</div>
          <p style="margin:0;font-size:14px">A permanent, extensible library of L137 Deliverance Ministry teachings by ${T.ministry.pastor}.</p>
        </div>
        <div>
          <h4>Categories</h4>
          <a href="${base}categories/watchers-and-voices.html">Watchers &amp; Voices</a>
          <a href="${base}categories/serpents-and-waters.html">Serpents &amp; Waters</a>
          <a href="${base}categories/covenants-and-chains.html">Covenants &amp; Chains</a>
        </div>
        <div>
          <h4>Ministry</h4>
          <a href="${T.ministry.linktree}" target="_blank" rel="noopener">WhatsApp platform</a>
          <a href="${T.ministry.linktree}" target="_blank" rel="noopener">Linktree</a>
        </div>
        <div class="fine">© ${new Date().getFullYear()} ${T.ministry.name}. All teachings by ${T.ministry.pastor}. Every scripture in full KJV. Preserved teaching · anonymized publishing · Christ alone.</div>
      </div>
    </footer>`;
  };

  window.renderTeachingCard = function(t, opts = {}) {
    const base = opts.base || './';
    const isLive = t.status === "flagship" || t.status === "live";
    const href = isLive ? (base + t.href) : "#";
    const pillLabel = t.status === "flagship" ? "Flagship" : (t.status === "live" ? "Live" : "Coming soon");
    const pillClass = t.status === "flagship" ? "status-flagship" : (t.status === "live" ? "status-live" : "status-coming");
    const cta = isLive ? "Open the study →" : "Coming soon";
    return `
    <a class="card ${!isLive ? 'card-coming' : ''}" href="${href}" ${!isLive ? 'aria-disabled="true" onclick="return false;"' : ''}>
      <span class="status-pill ${pillClass}">${pillLabel}</span>
      <div class="card-date">${t.dateDisplay}</div>
      <h3 class="card-title">${t.shortTitle || t.title}</h3>
      <p class="card-desc">${t.description}</p>
      <div class="card-cta">${cta}</div>
    </a>`;
  };

  window.renderCategoryCard = function(cat, opts = {}) {
    const base = opts.base || './';
    const total = T.countTotal(cat.id);
    const live = T.countLive(cat.id);
    return `
    <a class="card" href="${base}categories/${cat.slug}.html">
      <span class="status-pill status-live">Category ${cat.number}</span>
      <h3 class="card-title" style="font-size:24px">${cat.title}</h3>
      <div class="card-date" style="color:var(--teal)">${cat.subtitle}</div>
      <p class="card-desc" style="margin-top:12px">${cat.description}</p>
      <div class="card-cta">${live} live · ${total} teaching${total===1?'':'s'} in this category →</div>
    </a>`;
  };
})();
