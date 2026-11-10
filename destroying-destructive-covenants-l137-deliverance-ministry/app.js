/* =========================================================
   Atelier Course Dashboard — interactivity
   - Renders syllabus, milestones, grading, forum from data.js
   - Persists progress + posts in localStorage (per-device)
   - Theme toggle (system-preference default)
   ========================================================= */

(function () {
  "use strict";

  const data = window.COURSE_DATA;
  if (!data) return;

  // --------- In-memory store (this device, this session) ----------
  // The dashboard is sandboxed; persistent storage is not available.
  // Progress, posts, and theme persist for the duration of the page session only.
  function loadStore() {
    return { done: {}, posts: [], theme: null };
  }
  function saveStore(_s) { /* no-op: in-memory only */ }
  const store = loadStore();

  // ---------- Theme ----------
  const themeBtn = document.getElementById("theme-toggle");
  const SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
  const MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  function applyTheme(mode) {
    document.documentElement.setAttribute("data-theme", mode);
    themeBtn.innerHTML = mode === "dark" ? SUN : MOON;
    themeBtn.setAttribute("aria-label", mode === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }
  const initialTheme = store.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  applyTheme(initialTheme);
  themeBtn.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    store.theme = next; saveStore(store);
  });

  // ---------- Hero ----------
  document.getElementById("course-code").textContent = data.course.code;
  document.getElementById("course-term").textContent = data.course.term;
  const titleEl = document.getElementById("course-title");
  // Italicize the noun phrase after the em-dash for editorial feel
  const titleParts = data.course.title.split(" — ");
  titleEl.innerHTML = titleParts.length === 2
    ? `${escapeHtml(titleParts[0])} <span class="title-dash" aria-hidden="true">—</span> <em>${escapeHtml(titleParts[1])}</em>`
    : escapeHtml(data.course.title);
  document.getElementById("course-desc").textContent = data.course.description;

  const heroMeta = document.getElementById("hero-meta");
  heroMeta.innerHTML = `
    <div><dt>Teacher</dt><dd>${escapeHtml(data.course.instructor)}</dd></div>
    <div><dt>Series</dt><dd>${escapeHtml(data.course.credits)}</dd></div>
    <div><dt>Live On</dt><dd>${escapeHtml(data.course.meetingTime)}</dd></div>
    <div><dt>Connect</dt><dd>${escapeHtml(data.course.office)}</dd></div>
  `;

  // ---------- Filters ----------
  const themes = ["All", ...Array.from(new Set(data.weeks.map(w => w.theme)))];
  const filtersEl = document.getElementById("filters");
  let activeTheme = "All";
  filtersEl.innerHTML = themes.map(t => `
    <button class="chip${t === activeTheme ? " active" : ""}" data-theme="${escapeAttr(t)}">${escapeHtml(t)}</button>
  `).join("");
  filtersEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    activeTheme = btn.dataset.theme;
    filtersEl.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c.dataset.theme === activeTheme));
    renderWeeks();
  });

  // ---------- Weeks ----------
  const weekList = document.getElementById("week-list");
  let openWeeks = new Set();
  let allExpanded = false;

  function isWeekComplete(n) { return !!store.done["week-" + n]; }
  function isAssignmentComplete(n) { return !!store.done["assign-" + n]; }

  function renderWeeks() {
    const visible = activeTheme === "All" ? data.weeks : data.weeks.filter(w => w.theme === activeTheme);
    weekList.innerHTML = visible.map(w => weekHtml(w)).join("");
    // Wire up toggles
    weekList.querySelectorAll(".week-head").forEach(head => {
      head.addEventListener("click", (e) => {
        // Don't toggle if user clicked the "complete" button inside head
        if (e.target.closest(".complete-toggle")) return;
        const n = +head.dataset.week;
        if (openWeeks.has(n)) openWeeks.delete(n); else openWeeks.add(n);
        renderWeeks();
      });
    });
    weekList.querySelectorAll(".complete-toggle").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const key = btn.dataset.key;
        store.done[key] = !store.done[key];
        saveStore(store);
        renderWeeks();
        renderMilestones();
        updateProgress();
        toast(store.done[key] ? "Marked complete" : "Marked incomplete");
      });
    });
  }

  function weekHtml(w) {
    const open = openWeeks.has(w.n);
    const weekDone = isWeekComplete(w.n);
    const checkIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
    const chevron = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';

    return `
      <article class="week${open ? " is-open" : ""}${weekDone ? " is-complete" : ""}" data-week="${w.n}">
        <button class="week-head" data-week="${w.n}" aria-expanded="${open}">
          <div class="week-num">${pad(w.n)}</div>
          <div class="week-title-block">
            <div class="week-title">${escapeHtml(w.title)}</div>
            <div class="week-dates">Module ${w.n} <span>·</span> ${escapeHtml(w.dates)}</div>
          </div>
          <span class="week-theme">${escapeHtml(w.theme)}</span>
          <span class="week-toggle" aria-hidden="true">${chevron}</span>
        </button>

        <div class="week-body">
          <div>
            <div class="sub-heading">Learning Objectives</div>
            <ul class="objectives">
              ${w.objectives.map(o => `<li>${escapeHtml(o)}</li>`).join("")}
            </ul>

            <div class="sub-heading">Teaching Summary</div>
            <div class="lecture-summary">
              <span class="label">From the recording</span>
              ${escapeHtml(w.summary)}
            </div>
          </div>

          <div>
            <div class="sub-heading">Scripture & Readings</div>
            <div class="readings">
              ${w.readings.map(r => `
                <div class="reading${r.kjv ? " has-kjv" : ""}">
                  <span class="reading-type" data-type="${escapeAttr(r.type)}">${escapeHtml(r.type)}</span>
                  <div class="reading-body">
                    <span class="reading-title">${escapeHtml(r.title)}</span>
                    ${r.kjv ? `<blockquote class="reading-kjv"><span class="kjv-label">KJV</span>${escapeHtml(r.kjv)}</blockquote>` : ""}
                  </div>
                </div>
              `).join("")}
            </div>

            <div class="sub-heading">Practical Assignment</div>
            <div class="assignment-card">
              <div>
                <div class="assignment-meta">${w.assignment.points} pts</div>
                <div class="assignment-title">${escapeHtml(w.assignment.title)}</div>
                <div class="assignment-due">Due ${escapeHtml(w.assignment.due)}</div>
              </div>
              <button
                class="complete-toggle${isAssignmentComplete(w.n) ? " is-complete" : ""}"
                data-key="assign-${w.n}"
                aria-pressed="${isAssignmentComplete(w.n)}"
                title="Toggle assignment complete"
              >
                ${checkIcon}
                ${isAssignmentComplete(w.n) ? "Completed" : "Mark done"}
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  // Expand-all toggle
  const expandBtn = document.getElementById("expand-all");
  expandBtn.addEventListener("click", () => {
    allExpanded = !allExpanded;
    openWeeks = new Set(allExpanded ? data.weeks.map(w => w.n) : []);
    expandBtn.textContent = allExpanded ? "Collapse all" : "Expand all";
    renderWeeks();
  });

  // ---------- Milestones ----------
  const milestoneList = document.getElementById("milestone-list");
  function renderMilestones() {
    milestoneList.innerHTML = data.weeks.map(w => {
      const done = isAssignmentComplete(w.n);
      return `
        <button
          class="milestone${done ? " is-done" : ""}"
          data-key="assign-${w.n}"
          aria-pressed="${done}"
        >
          <span class="milestone-check${done ? " is-done" : ""}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </span>
          <span>
            <span class="milestone-title">${escapeHtml(w.assignment.title)}</span>
            <span class="milestone-week">Module ${w.n} · ${escapeHtml(w.title)}</span>
          </span>
          <span class="milestone-due">Due ${escapeHtml(w.assignment.due)}</span>
          <span class="milestone-points">${w.assignment.points} pts</span>
        </button>
      `;
    }).join("");

    milestoneList.querySelectorAll(".milestone").forEach(el => {
      el.addEventListener("click", () => {
        const key = el.dataset.key;
        store.done[key] = !store.done[key];
        saveStore(store);
        renderMilestones();
        renderWeeks();
        updateProgress();
        toast(store.done[key] ? "Milestone complete" : "Milestone reopened");
      });
    });
  }

  // ---------- Progress strip ----------
  function updateProgress() {
    const total = data.weeks.length;
    const done = data.weeks.filter(w => isAssignmentComplete(w.n)).length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    document.getElementById("progress-fill").style.width = pct + "%";
    document.getElementById("progress-stats").innerHTML =
      `<strong>${done}</strong> / ${total} assignments · <strong>${pct}%</strong> complete`;
  }

  // ---------- Grading ----------
  const gradeRows = document.getElementById("grade-rows");
  gradeRows.innerHTML = data.grading.map(g => `
    <div class="grade-row">
      <div>
        <strong>${escapeHtml(g.component)}</strong>
        <span class="desc">${escapeHtml(g.description)}</span>
      </div>
      <span class="weight">${g.weight}%</span>
    </div>
  `).join("");

  const scaleGrid = document.getElementById("scale-grid");
  scaleGrid.innerHTML = data.gradeScale.map(s => `
    <div class="scale-cell">
      <div class="letter">${escapeHtml(s.letter)}</div>
      <div class="range">${escapeHtml(s.range)}</div>
    </div>
  `).join("");

  // ---------- Forum ----------
  const weekSelect = document.getElementById("post-week");
  weekSelect.innerHTML = `<option value="general">General · not module-specific</option>` +
    data.weeks.map(w => `<option value="${w.n}">Module ${w.n} — ${escapeHtml(w.title)}</option>`).join("");

  const thread = document.getElementById("thread");
  function renderThread() {
    if (!store.posts.length) {
      thread.innerHTML = `
        <div class="thread-empty">
          <span class="label">No posts yet</span>
          Be the first to start the discussion. Posts you make appear instantly and persist on this device.
        </div>`;
      return;
    }
    thread.innerHTML = store.posts.slice().reverse().map(p => {
      const initials = p.name.split(/\s+/).map(x => x[0] || "").join("").slice(0, 2).toUpperCase() || "?";
      const weekTag = p.week === "general"
        ? `<span class="post-week-tag">General</span>`
        : `<span class="post-week-tag">Module ${escapeHtml(String(p.week))}</span>`;
      return `
        <article class="post">
          <div class="post-head">
            <span class="avatar" aria-hidden="true">${escapeHtml(initials)}</span>
            <div class="post-meta">
              <strong>${escapeHtml(p.name)}</strong>
              <span>${escapeHtml(p.title)} · ${escapeHtml(formatTime(p.t))}</span>
            </div>
            ${weekTag}
          </div>
          <div class="post-body">${formatBody(p.body)}</div>
        </article>
      `;
    }).join("");
  }

  document.getElementById("forum-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("post-name").value.trim();
    const week = document.getElementById("post-week").value;
    const title = document.getElementById("post-title").value.trim();
    const body = document.getElementById("post-body").value.trim();
    if (!name || !title || !body) { toast("Please complete all fields"); return; }
    store.posts.push({ name, week, title, body, t: Date.now() });
    saveStore(store);
    e.target.reset();
    renderThread();
    toast("Posted to the forum");
    document.getElementById("thread").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // ---------- Reset ----------
  document.getElementById("reset-progress").addEventListener("click", () => {
    if (!confirm("Reset all progress and forum posts on this device? This cannot be undone.")) return;
    store.done = {};
    store.posts = [];
    saveStore(store);
    renderWeeks(); renderMilestones(); renderThread(); updateProgress();
    toast("Progress reset");
  });

  // ---------- Helpers ----------
  function pad(n) { return String(n).padStart(2, "0"); }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
  function escapeAttr(s) { return escapeHtml(s); }
  function formatBody(s) {
    return escapeHtml(s).split(/\n{2,}/).map(p => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("");
  }
  function formatTime(t) {
    const d = new Date(t);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    return sameDay
      ? d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      : d.toLocaleDateString([], { month: "short", day: "numeric" }) + " · " +
        d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  let toastTimer;
  function toast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  }

  // ---------- Initial render ----------
  renderWeeks();
  renderMilestones();
  renderThread();
  updateProgress();
})();
