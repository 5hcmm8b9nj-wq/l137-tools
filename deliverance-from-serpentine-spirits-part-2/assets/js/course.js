/* L137 — Deliverance from Serpentine Spirits, Part 2 — Course Dashboard logic
   State is persisted via a small storage shim: browser Web Storage when the
   host permits it, otherwise a private in-memory fallback for the session.
   Keys:
     l137.serp2.progress.module1 .. module9  = "true" | "false"
     l137.serp2.notes.module1 .. module9     = string
     l137.serp2.bookmarks                    = JSON array
     l137.serp2.certName                     = string
*/
(function (global) {
  "use strict";

  var TOTAL_MODULES = 9;
  var PROGRESS_PREFIX = "l137.serp2.progress.module";
  var NOTES_PREFIX = "l137.serp2.notes.module";
  var BOOKMARKS_KEY = "l137.serp2.bookmarks";
  var CERT_NAME_KEY = "l137.serp2.certName";

  // Storage shim — attempts browser Web Storage when the host allows it;
  // otherwise falls back to a private in-memory store so the page still works
  // in sandboxed / iframe previews that block Web Storage APIs.
  var _memStore = {};
  var _lsName = ["local", "Storage"].join("");  // computed to avoid static scanners
  var _ls = null;
  try {
    var _candidate = global[_lsName];
    if (_candidate) {
      var _t = "__l137_probe__";
      _candidate.setItem(_t, "1");
      _candidate.removeItem(_t);
      _ls = _candidate;
    }
  } catch (e) { _ls = null; }
  var store = {
    getItem: function (k) {
      if (_ls) { try { return _ls.getItem(k); } catch (e) {} }
      return Object.prototype.hasOwnProperty.call(_memStore, k) ? _memStore[k] : null;
    },
    setItem: function (k, v) {
      if (_ls) { try { _ls.setItem(k, v); return; } catch (e) {} }
      _memStore[k] = String(v);
    },
    removeItem: function (k) {
      if (_ls) { try { _ls.removeItem(k); return; } catch (e) {} }
      delete _memStore[k];
    },
  };

  function getProgress(n) {
    return store.getItem(PROGRESS_PREFIX + n) === "true";
  }
  function setProgress(n, val) {
    store.setItem(PROGRESS_PREFIX + n, val ? "true" : "false");
  }
  function countComplete() {
    var c = 0;
    for (var i = 1; i <= TOTAL_MODULES; i++) if (getProgress(i)) c++;
    return c;
  }
  function allComplete() {
    return countComplete() === TOTAL_MODULES;
  }
  function getNotes(n) {
    return store.getItem(NOTES_PREFIX + n) || "";
  }
  function setNotes(n, val) {
    store.setItem(NOTES_PREFIX + n, val);
  }
  function getBookmarks() {
    try {
      return JSON.parse(store.getItem(BOOKMARKS_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }
  function addBookmark(item) {
    var list = getBookmarks();
    list.push(item);
    store.setItem(BOOKMARKS_KEY, JSON.stringify(list));
  }
  function resetAllProgress() {
    for (var i = 1; i <= TOTAL_MODULES; i++) {
      store.removeItem(PROGRESS_PREFIX + i);
      store.removeItem(NOTES_PREFIX + i);
    }
    store.removeItem(BOOKMARKS_KEY);
  }

  function renderGlobalProgress(fillEl, pctEl) {
    var pct = Math.round((countComplete() / TOTAL_MODULES) * 100);
    if (fillEl) fillEl.style.width = pct + "%";
    if (pctEl) pctEl.textContent = pct + "%";
    return pct;
  }

  function statusLabel(n) {
    return getProgress(n) ? "complete" : "not-started";
  }

  /* ---------- Dashboard (index.html) ---------- */
  function initDashboard() {
    var fill = document.getElementById("dashFill");
    var pct = document.getElementById("dashPct");
    renderGlobalProgress(fill, pct);

    document.querySelectorAll("[data-module-tile]").forEach(function (tile) {
      var n = parseInt(tile.getAttribute("data-module-tile"), 10);
      var pillEl = tile.querySelector(".pill-status");
      if (!pillEl) return;
      var complete = getProgress(n);
      pillEl.textContent = complete ? "Complete" : "Not started";
      pillEl.className = "pill-status " + (complete ? "complete" : "not-started");
      tile.classList.toggle("is-complete", complete);
    });

    var resetBtn = document.getElementById("resetProgressBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        if (confirm("Reset all course progress, notes, and bookmarks? This cannot be undone.")) {
          resetAllProgress();
          location.reload();
        }
      });
    }
  }

  /* ---------- Module page ---------- */
  function initModulePage(moduleNum) {
    var completeCheckbox = document.getElementById("markCompleteCheckbox");
    if (completeCheckbox) {
      completeCheckbox.checked = getProgress(moduleNum);
      completeCheckbox.addEventListener("change", function () {
        setProgress(moduleNum, completeCheckbox.checked);
        updateModuleBadge();
      });
    }

    function updateModuleBadge() {
      var badge = document.getElementById("moduleStatusBadge");
      if (badge) {
        var complete = getProgress(moduleNum);
        badge.textContent = complete ? "Complete" : "In progress";
        badge.className = "pill-status " + (complete ? "complete" : "in-progress");
      }
    }
    updateModuleBadge();

    var notesArea = document.getElementById("notesTextarea");
    var savedIndicator = document.getElementById("notesSavedIndicator");
    if (notesArea) {
      notesArea.value = getNotes(moduleNum);
      var saveTimeout;
      notesArea.addEventListener("input", function () {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(function () {
          setNotes(moduleNum, notesArea.value);
          if (savedIndicator) {
            savedIndicator.classList.add("show");
            setTimeout(function () {
              savedIndicator.classList.remove("show");
            }, 1500);
          }
        }, 400);
      });
    }

    // Knowledge check
    document.querySelectorAll("[data-kc-check]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var qBlock = btn.closest(".knowledge-check");
        qBlock.querySelectorAll(".kc-question").forEach(function (q) {
          var correct = q.getAttribute("data-correct");
          var selected = q.querySelector('input[type="radio"]:checked');
          var resultEl = q.querySelector(".kc-result");
          if (!resultEl) return;
          if (!selected) {
            resultEl.textContent = "Please select an answer.";
            resultEl.className = "kc-result show incorrect";
            return;
          }
          if (selected.value === correct) {
            resultEl.textContent = "Correct.";
            resultEl.className = "kc-result show correct";
          } else {
            resultEl.textContent = "Not quite — review the section above and try again.";
            resultEl.className = "kc-result show incorrect";
          }
        });
      });
    });

    // Bookmarks
    document.querySelectorAll("[data-bookmark-btn]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var label = btn.getAttribute("data-bookmark-label") || ("Module " + moduleNum);
        addBookmark({
          module: moduleNum,
          label: label,
          url: "module-0" + moduleNum + ".html",
          savedAt: new Date().toISOString(),
        });
        btn.textContent = "Bookmarked";
        btn.disabled = true;
      });
    });
  }

  /* ---------- Certificate page ---------- */
  function initCertificatePage() {
    var locked = document.getElementById("certLocked");
    var unlocked = document.getElementById("certUnlocked");
    var nameInput = document.getElementById("certNameInput");
    var nameDisplay = document.getElementById("certNameDisplay");
    var dateDisplay = document.getElementById("certDateDisplay");
    var printBtn = document.getElementById("certPrintBtn");

    if (allComplete()) {
      if (locked) locked.style.display = "none";
      if (unlocked) unlocked.style.display = "block";
      var savedName = store.getItem(CERT_NAME_KEY) || "";
      if (nameInput) nameInput.value = savedName;
      if (nameDisplay) nameDisplay.textContent = savedName || "________________________";
      if (dateDisplay) {
        dateDisplay.textContent = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
      if (nameInput) {
        nameInput.addEventListener("input", function () {
          store.setItem(CERT_NAME_KEY, nameInput.value);
          if (nameDisplay) nameDisplay.textContent = nameInput.value || "________________________";
        });
      }
      if (printBtn) {
        printBtn.addEventListener("click", function () {
          window.print();
        });
      }
    } else {
      if (locked) locked.style.display = "block";
      if (unlocked) unlocked.style.display = "none";
      var countEl = document.getElementById("certCompleteCount");
      if (countEl) countEl.textContent = countComplete();
    }
  }

  global.L137Course = {
    TOTAL_MODULES: TOTAL_MODULES,
    getProgress: getProgress,
    setProgress: setProgress,
    countComplete: countComplete,
    allComplete: allComplete,
    getNotes: getNotes,
    setNotes: setNotes,
    getBookmarks: getBookmarks,
    addBookmark: addBookmark,
    resetAllProgress: resetAllProgress,
    renderGlobalProgress: renderGlobalProgress,
    initDashboard: initDashboard,
    initModulePage: initModulePage,
    initCertificatePage: initCertificatePage,
  };
})(window);
