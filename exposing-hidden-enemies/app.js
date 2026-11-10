/* Interactive Course Dashboard — in-memory progress (preview-safe) */

let progressState = {};

function updateSummary(total) {
  const done = Object.values(progressState).filter(Boolean).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const bar = document.querySelector(".progress-bar__fill");
  const stat = document.querySelector(".progress-stats__done");
  const pctEl = document.querySelector(".progress-stats__pct");
  if (bar) bar.style.width = pct + "%";
  if (stat) stat.textContent = done + " / " + total;
  if (pctEl) pctEl.textContent = pct + "%";
}

function initCourse() {
  const items = document.querySelectorAll(".module-item");
  const total = items.length;

  items.forEach((item) => {
    const key = item.dataset.moduleKey;
    const check = item.querySelector(".module-item__check");
    if (check) {
      check.addEventListener("click", () => {
        progressState[key] = !progressState[key];
        item.classList.toggle("done", progressState[key]);
        updateSummary(total);
      });
    }
  });

  updateSummary(total);

  const reset = document.querySelector(".reset-btn");
  if (reset) {
    reset.addEventListener("click", () => {
      progressState = {};
      items.forEach((i) => i.classList.remove("done"));
      updateSummary(total);
    });
  }
}

if (document.readyState !== "loading") initCourse();
else document.addEventListener("DOMContentLoaded", initCourse);

/* ================================================================
   L137 Interactive Quiz System — in-memory only (preview-safe)
   ================================================================ */

function norm(s) {
  return (s || "").trim().toLowerCase().replace(/[^a-z]/g, "");
}

/* A. Knowledge Check (multiple choice) */
function initQuiz() {
  document.querySelectorAll('.quiz-block[data-quiz="knowledge"] .quiz-question').forEach((q) => {
    const correct = parseInt(q.dataset.correct, 10);
    const opts = q.querySelectorAll(".quiz-option");
    const fb = q.querySelector(".quiz-feedback");
    opts.forEach((opt, i) => {
      opt.addEventListener("click", () => {
        if (q.dataset.locked === "1") return;
        if (i === correct) {
          opts.forEach((o) => o.classList.remove("quiz-option--wrong"));
          opt.classList.add("quiz-option--correct");
          q.dataset.locked = "1";
          if (fb) { fb.textContent = "Correct."; fb.className = "quiz-feedback quiz-feedback--ok"; }
        } else {
          opt.classList.add("quiz-option--wrong");
          if (fb) { fb.textContent = "Try again."; fb.className = "quiz-feedback quiz-feedback--try"; }
        }
      });
    });
  });
}

/* B. Scripture Matching */
function initMatching() {
  document.querySelectorAll('.quiz-block[data-quiz="matching"]').forEach((block) => {
    let selected = null;
    const fb = block.querySelector(".quiz-feedback");
    const pairs = block.querySelectorAll(".match-pair");
    pairs.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.classList.contains("matched")) return;
        // clicking same column resets selection to the new one
        if (!selected) {
          selected = btn;
          btn.classList.add("selected");
          return;
        }
        if (selected === btn) {
          btn.classList.remove("selected");
          selected = null;
          return;
        }
        // require different columns: one from refs, one from phrases
        const selCol = selected.closest(".match-col");
        const curCol = btn.closest(".match-col");
        if (selCol === curCol) {
          selected.classList.remove("selected");
          selected = btn;
          btn.classList.add("selected");
          return;
        }
        if (selected.dataset.key === btn.dataset.key) {
          selected.classList.add("matched");
          btn.classList.add("matched");
          selected.classList.remove("selected");
          selected = null;
          const remaining = block.querySelectorAll(".match-pair:not(.matched)").length;
          if (fb) {
            if (remaining === 0) { fb.textContent = "All matched. Well done."; fb.className = "quiz-feedback quiz-feedback--ok"; }
            else { fb.textContent = "Matched."; fb.className = "quiz-feedback quiz-feedback--ok"; }
          }
        } else {
          const a = selected, b = btn;
          a.classList.remove("selected");
          if (fb) { fb.textContent = "Not a match \u2014 both reset."; fb.className = "quiz-feedback quiz-feedback--try"; }
          selected = null;
        }
      });
    });
  });
}

/* C. Discernment / Suspicion scenarios */
function initScenarios() {
  document.querySelectorAll('.quiz-block[data-quiz="scenarios"] .scenario-block').forEach((sc) => {
    const answer = sc.dataset.answer;
    const btns = sc.querySelectorAll(".scenario-btn");
    const ans = sc.querySelector(".scenario-answer");
    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        btns.forEach((b) => b.classList.remove("chosen"));
        btn.classList.add("chosen");
        if (ans) ans.classList.add("show");
      });
    });
  });
}

/* D. Fill in the blank */
function initFillBlanks() {
  document.querySelectorAll('.quiz-block[data-quiz="fill"] .fill-item').forEach((item) => {
    const answer = norm(item.dataset.answer);
    const input = item.querySelector(".fill-input");
    const btn = item.querySelector(".fill-btn");
    const verse = item.querySelector(".fill-verse");
    function check() {
      if (norm(input.value) === answer) {
        input.classList.add("correct");
        if (verse) verse.classList.add("show");
      } else {
        input.classList.remove("correct");
        if (verse) verse.classList.remove("show");
        input.focus();
      }
    }
    if (btn) btn.addEventListener("click", check);
    if (input) input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); check(); } });
  });
}

/* E. Reflection boxes (in-memory) */
const reflectionState = {};
function initReflection() {
  document.querySelectorAll('.quiz-block[data-quiz="reflection"] textarea').forEach((ta, i) => {
    ta.addEventListener("input", () => { reflectionState[i] = ta.value; });
  });
}

/* F. Final Review Quiz */
function initFinalQuiz() {
  const block = document.querySelector('.quiz-block[data-quiz="final"]');
  if (!block) return;
  const qs = block.querySelectorAll(".final-q");
  const total = qs.length;
  const answered = {};
  const correctSet = {};
  const bar = block.querySelector(".final-quiz__progress .progress-bar__fill");
  const result = block.querySelector(".final-result");
  const scoreEl = block.querySelector(".final-result__score");
  const msgEl = block.querySelector(".final-result__msg");

  function refresh(idx, isCorrect) {
    answered[idx] = true;
    correctSet[idx] = isCorrect;
    const done = Object.keys(answered).length;
    if (bar) bar.style.width = Math.round((done / total) * 100) + "%";
    if (done === total) finish();
  }

  function finish() {
    const score = Object.values(correctSet).filter(Boolean).length;
    if (scoreEl) scoreEl.textContent = score + " / " + total;
    if (msgEl) {
      msgEl.textContent = score >= 6
        ? "Well walked. You may print your completion certificate below."
        : "Take another walk through the modules and try again.";
    }
    if (result) result.classList.add("show");
    const certBtn = block.querySelector(".final-cert-btn");
    if (certBtn) certBtn.style.display = score >= 6 ? "" : "none";
  }

  qs.forEach((q, idx) => {
    const type = q.dataset.type;
    if (type === "mc") {
      const correct = parseInt(q.dataset.correct, 10);
      const opts = q.querySelectorAll(".quiz-option");
      opts.forEach((opt, i) => {
        opt.addEventListener("click", () => {
          if (q.dataset.locked === "1") return;
          q.dataset.locked = "1";
          opts.forEach((o) => (o.style.pointerEvents = "none"));
          if (i === correct) opt.classList.add("quiz-option--correct");
          else { opt.classList.add("quiz-option--wrong"); opts[correct].classList.add("quiz-option--correct"); }
          refresh(idx, i === correct);
        });
      });
    } else if (type === "fill") {
      const answer = norm(q.dataset.answer);
      const input = q.querySelector(".fill-input");
      const btn = q.querySelector(".fill-btn");
      function check() {
        if (q.dataset.locked === "1") return;
        const ok = norm(input.value) === answer;
        if (ok) { input.classList.add("correct"); q.dataset.locked = "1"; input.disabled = true; refresh(idx, true); }
        else { refresh(idx, false); q.dataset.locked = "1"; input.disabled = true; }
      }
      if (btn) btn.addEventListener("click", check);
      if (input) input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); check(); } });
    } else if (type === "scenario") {
      const answer = q.dataset.answer;
      const btns = q.querySelectorAll(".scenario-btn");
      btns.forEach((btn) => {
        btn.addEventListener("click", () => {
          if (q.dataset.locked === "1") return;
          q.dataset.locked = "1";
          btns.forEach((b) => (b.style.pointerEvents = "none"));
          btn.classList.add("chosen");
          refresh(idx, btn.dataset.choice === answer);
        });
      });
    }
  });
}

/* G. Certificate */
function initCertificate() {
  const cert = document.getElementById("certificate");
  const certBtn = document.querySelector(".final-cert-btn");
  const printBtn = document.querySelector(".cert-print-btn");
  if (certBtn && cert) {
    certBtn.addEventListener("click", () => {
      cert.classList.add("earned");
      cert.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  if (printBtn) printBtn.addEventListener("click", () => window.print());
}

function initInteractive() {
  initQuiz();
  initMatching();
  initScenarios();
  initFillBlanks();
  initReflection();
  initFinalQuiz();
  initCertificate();
}

if (document.readyState !== "loading") initInteractive();
else document.addEventListener("DOMContentLoaded", initInteractive);



/* ================================================================
   Post-launch upgrade: saved progress, sticky progress bar,
   per-chapter knowledge checks, and Scripture search.
   Additive only — does not modify existing functions above.
   ================================================================ */
(function () {
  "use strict";

  /* --- storage keys are page-scoped so the two books never collide --- */
  var PAGE_ID = (document.body && document.body.dataset && document.body.dataset.course)
    ? document.body.dataset.course
    : (location.pathname.indexOf("book2") > -1 ? "hidden-enemies-book2" : "hidden-enemies-book1");
  var K_PROGRESS = "l137:" + PAGE_ID + ":progress";
  var K_KC = "l137:" + PAGE_ID + ":kc";

  /* Access the browser storage indirectly so it degrades gracefully where it is
     unavailable (e.g. sandboxed preview iframes) and never throws. */
  function store() {
    try { return window[["local", "Storage"].join("")] || null; }
    catch (e) { return null; }
  }
  function loadJSON(key) {
    var s = store();
    if (!s) return {};
    try { return JSON.parse(s.getItem(key) || "{}") || {}; }
    catch (e) { return {}; }
  }
  function saveJSON(key, obj) {
    var s = store();
    if (!s) return;
    try { s.setItem(key, JSON.stringify(obj)); } catch (e) {}
  }

  /* ---------- 1. Chapter progress: saved state + sticky bar ---------- */
  function initProgressUpgrade() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".module-item"));
    if (!items.length) return;
    var total = items.length;
    var saved = loadJSON(K_PROGRESS);

    var barFill = document.querySelector(".course-progress__fill");
    var barLabel = document.querySelector(".course-progress__label");
    var barWrap = document.querySelector(".course-progress");

    function syncSticky() {
      var done = document.querySelectorAll(".module-item.done").length;
      var pct = total ? Math.round((done / total) * 100) : 0;
      if (barFill) barFill.style.width = pct + "%";
      if (barLabel) {
        barLabel.innerHTML = "You have completed <strong>" + done + " of " + total +
          " chapters</strong> \u00b7 " + pct + "%";
      }
      if (barWrap) barWrap.classList.toggle("is-complete", done === total && total > 0);
    }

    // Restore saved chapter completion on load (also mirror into in-memory state).
    items.forEach(function (item) {
      var key = item.dataset.moduleKey;
      if (key && saved[key]) {
        item.classList.add("done");
        if (typeof progressState !== "undefined") progressState[key] = true;
      }
    });
    if (typeof updateSummary === "function") updateSummary(total);

    // Persist on any check click (existing handler toggles the class first).
    items.forEach(function (item) {
      var key = item.dataset.moduleKey;
      var check = item.querySelector(".module-item__check");
      if (!check) return;
      check.addEventListener("click", function () {
        // Read the class AFTER the existing handler runs.
        setTimeout(function () {
          var isDone = item.classList.contains("done");
          var store = loadJSON(K_PROGRESS);
          if (isDone) store[key] = true; else delete store[key];
          saveJSON(K_PROGRESS, store);
          syncSticky();
        }, 0);
      });
    });

    // Reset button should also clear saved state.
    var reset = document.querySelector(".reset-btn");
    if (reset) {
      reset.addEventListener("click", function () {
        setTimeout(function () {
          saveJSON(K_PROGRESS, {});
          syncSticky();
        }, 0);
      });
    }

    // "Course complete" pill scrolls to the certificate section.
    var complete = document.querySelector(".course-progress__complete");
    if (complete) {
      complete.addEventListener("click", function (e) {
        e.preventDefault();
        var cert = document.getElementById("certificate");
        if (cert) cert.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    syncSticky();
  }

  /* ---------- 2. Per-chapter knowledge checks ---------- */
  function initKnowledgeChecks() {
    var blocks = Array.prototype.slice.call(document.querySelectorAll(".kc-block"));
    if (!blocks.length) return;
    var saved = loadJSON(K_KC);

    blocks.forEach(function (block) {
      var kcKey = block.dataset.kc;
      var questions = Array.prototype.slice.call(block.querySelectorAll(".kc-q"));
      var passedState = (saved[kcKey] && saved[kcKey].passed) || {}; // { qIndex: true }

      function markBlockIfComplete() {
        var allPassed = questions.every(function (_, i) { return passedState[i]; });
        if (allPassed && questions.length) {
          block.classList.add("is-passed");
          var moduleItem = document.querySelector('.module-item[data-module-key="' + kcKey + '"]');
          if (moduleItem) moduleItem.classList.add("kc-passed");
        }
      }

      questions.forEach(function (q, qi) {
        var correct = parseInt(q.dataset.correct, 10);
        var hint = q.dataset.hint || "";
        var opts = Array.prototype.slice.call(q.querySelectorAll(".kc-option"));
        var fb = q.querySelector(".kc-feedback");

        function lockCorrect(chosenIdx) {
          q.dataset.locked = "1";
          opts.forEach(function (o) { o.classList.remove("kc-option--wrong"); });
          opts[correct].classList.add("kc-option--correct");
          if (fb) { fb.textContent = "\u2713 Correct"; fb.className = "kc-feedback kc-feedback--ok"; }
        }

        // Restore a previously-passed question.
        if (passedState[qi]) {
          lockCorrect(correct);
        }

        opts.forEach(function (opt, i) {
          opt.addEventListener("click", function () {
            if (q.dataset.locked === "1") return;
            if (i === correct) {
              lockCorrect(i);
              passedState[qi] = true;
              saved[kcKey] = { passed: passedState };
              saveJSON(K_KC, saved);
              markBlockIfComplete();
            } else {
              opt.classList.add("kc-option--wrong");
              if (fb) {
                fb.className = "kc-feedback kc-feedback--try";
                fb.innerHTML = "\u2717 Try again" +
                  (hint ? '<span class="kc-hint">' + hint + "</span>" : "");
              }
            }
          });
        });
      });

      markBlockIfComplete();
    });
  }

  /* ---------- 3. Scripture search ---------- */
  function initScriptureSearch() {
    var box = document.querySelector(".scripture-search");
    if (!box) return;
    var input = box.querySelector(".scripture-search__input");
    var results = box.querySelector(".scripture-search__results");
    if (!input || !results) return;

    // Resolve the index path relative to this page (course/ and download/ are one level deep).
    var indexUrl = "../assets/scripture-index.json";
    var VERSES = [];
    var loaded = false;

    fetch(indexUrl)
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (data) { VERSES = Array.isArray(data) ? data : []; loaded = true; render(input.value); })
      .catch(function () { VERSES = []; loaded = true; });

    function esc(s) {
      return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function render(term) {
      term = (term || "").trim().toLowerCase();
      if (!term) {
        results.classList.remove("show");
        results.innerHTML = "";
        return;
      }
      var matches = VERSES.filter(function (v) {
        return v.reference.toLowerCase().indexOf(term) > -1 ||
               v.text.toLowerCase().indexOf(term) > -1;
      });
      var html = '<p class="scripture-search__count">' +
        matches.length + (matches.length === 1 ? " verse" : " verses") + " found</p>";
      matches.forEach(function (v) {
        html += '<div class="scripture-card">' +
          '<span class="scripture-card__ref">' + esc(v.reference) + "</span>" +
          '<p class="scripture-card__text">' + esc(v.text) + "</p>" +
          '<button class="scripture-card__copy" type="button" data-copy="' +
            esc(v.text + " \u2014 " + v.reference) + '">Copy</button>' +
          "</div>";
      });
      results.innerHTML = html;
      results.classList.add("show");
    }

    // Debounce 200ms.
    var t = null;
    input.addEventListener("input", function () {
      clearTimeout(t);
      var val = input.value;
      t = setTimeout(function () { render(val); }, 200);
    });

    // Copy buttons (event delegation).
    results.addEventListener("click", function (e) {
      var btn = e.target.closest(".scripture-card__copy");
      if (!btn) return;
      var text = btn.getAttribute("data-copy") || "";
      function done() {
        var original = "Copy";
        btn.textContent = "Copied \u2713";
        btn.classList.add("copied");
        setTimeout(function () { btn.textContent = original; btn.classList.remove("copied"); }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
      } else {
        fallbackCopy(text); done();
      }
    });

    function fallbackCopy(text) {
      try {
        var ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      } catch (e) {}
    }
  }

  function boot() {
    initProgressUpgrade();
    initKnowledgeChecks();
    initScriptureSearch();
  }
  if (document.readyState !== "loading") boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();
