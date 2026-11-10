/* L137 Deliverance Ministry International — Daily Scripture & Teaching
 * Fetches today's reading from the L137 admin backend.
 * Pastor Kiki posts the reading via /admin.html and it appears here.
 */
(function () {
  "use strict";

  var API = "__PORT_8000__".startsWith("__") ? "http://localhost:8000" : "__PORT_8000__";

  var els = {
    date: document.getElementById("dev-date"),
    title: document.getElementById("dev-title"),
    ref: document.getElementById("dev-ref"),
    verse: document.getElementById("dev-verse"),
    teaching: document.getElementById("dev-teaching"),
    teachingLabel: document.getElementById("dev-teaching-label"),
    prayer: document.getElementById("dev-prayer"),
    prayerLabel: document.getElementById("dev-prayer-label"),
    amen: document.getElementById("dev-amen"),
    empty: document.getElementById("daily-empty"),
    posted: document.getElementById("daily-posted"),
    postedWrap: document.getElementById("daily-meta"),
    archiveWrap: document.getElementById("daily-archive"),
    archiveList: document.getElementById("daily-archive-list"),
    archiveEmpty: document.getElementById("daily-archive-empty")
  };

  function formatLongDate(isoOrYmd) {
    if (!isoOrYmd) return "";
    try {
      // YYYY-MM-DD dates: anchor to mid-day to avoid timezone day-offset bugs
      var d = /^\d{4}-\d{2}-\d{2}$/.test(isoOrYmd)
        ? new Date(isoOrYmd + "T12:00:00")
        : new Date(isoOrYmd);
      return d.toLocaleDateString(undefined, {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
      });
    } catch (e) {
      return "";
    }
  }

  function formatShortDate(isoOrYmd) {
    if (!isoOrYmd) return "";
    try {
      var d = /^\d{4}-\d{2}-\d{2}$/.test(isoOrYmd)
        ? new Date(isoOrYmd + "T12:00:00")
        : new Date(isoOrYmd);
      return d.toLocaleDateString(undefined, {
        weekday: "short", month: "short", day: "numeric"
      });
    } catch (e) {
      return "";
    }
  }

  function todayYMD() {
    var d = new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

  function dateLabel(reading) {
    var ymd = reading && reading.reading_date ? reading.reading_date : null;
    var today = todayYMD();
    if (!ymd) {
      return "Today \u00b7 " + formatLongDate(today);
    }
    if (ymd === today) {
      return "Today \u00b7 " + formatLongDate(ymd);
    }
    return formatLongDate(ymd);
  }

  function showEmpty() {
    if (els.title) els.title.textContent = "Awaiting today\u2019s reading";
    if (els.ref) { els.ref.textContent = ""; els.ref.hidden = true; }
    if (els.verse) { els.verse.textContent = ""; els.verse.hidden = true; }
    if (els.teaching) els.teaching.innerHTML = "";
    if (els.teachingLabel) els.teachingLabel.hidden = true;
    if (els.prayer) { els.prayer.textContent = ""; els.prayer.hidden = true; }
    if (els.prayerLabel) els.prayerLabel.hidden = true;
    if (els.amen) els.amen.hidden = true;
    if (els.empty) els.empty.style.display = "";
    if (els.date) els.date.textContent = "Today \u00b7 " + formatLongDate(todayYMD());
    if (els.postedWrap) els.postedWrap.hidden = true;
  }

  function render(reading) {
    if (!reading || !reading.title) {
      showEmpty();
      return;
    }

    if (els.empty) els.empty.style.display = "none";

    if (els.date) {
      els.date.textContent = dateLabel(reading);
    }

    if (els.title) els.title.textContent = reading.title || "";
    if (els.ref) {
      els.ref.textContent = reading.ref || "";
      els.ref.hidden = !reading.ref;
    }
    if (els.verse) {
      els.verse.textContent = reading.verse ? "\u201C" + reading.verse + "\u201D" : "";
      els.verse.hidden = !reading.verse;
    }

    if (els.teaching) {
      els.teaching.innerHTML = "";
      var teachingText = (reading.teaching || "").trim();
      if (teachingText) {
        if (els.teachingLabel) els.teachingLabel.hidden = false;
        // Split on blank lines into paragraphs; preserve single line breaks
        teachingText.split(/\n\s*\n/).forEach(function (chunk) {
          var p = document.createElement("p");
          p.textContent = chunk.trim();
          els.teaching.appendChild(p);
        });
      } else {
        if (els.teachingLabel) els.teachingLabel.hidden = true;
      }
    }

    if (els.prayer) {
      var prayerText = (reading.prayer || "").trim();
      els.prayer.textContent = prayerText;
      els.prayer.hidden = !prayerText;
      if (els.prayerLabel) els.prayerLabel.hidden = !prayerText;
      if (els.amen) els.amen.hidden = !prayerText;
    }

    if (els.postedWrap && els.posted) {
      var stamp = reading.reading_date || reading.posted_at;
      if (stamp) {
        els.posted.textContent = "Posted " + formatLongDate(stamp);
        els.postedWrap.hidden = false;
      } else {
        els.postedWrap.hidden = true;
      }
    }
  }

  function escapeHTML(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function buildArchiveCard(reading, index) {
    var details = document.createElement("details");
    details.className = "archive-item";
    if (index === 0) details.open = false;

    var summary = document.createElement("summary");
    summary.className = "archive-summary";
    var dateStr = reading.reading_date || reading.posted_at || "";
    summary.innerHTML =
      '<span class="archive-date">' + escapeHTML(formatShortDate(dateStr)) + '</span>' +
      '<span class="archive-title">' + escapeHTML(reading.title || "(untitled)") + '</span>' +
      (reading.ref ? '<span class="archive-ref">' + escapeHTML(reading.ref) + '</span>' : '') +
      '<span class="archive-chevron" aria-hidden="true">+</span>';
    details.appendChild(summary);

    var body = document.createElement("div");
    body.className = "archive-body";

    if (reading.verse) {
      var bq = document.createElement("blockquote");
      bq.className = "archive-verse";
      bq.textContent = "\u201C" + reading.verse + "\u201D";
      body.appendChild(bq);
    }

    if (reading.teaching) {
      var teachWrap = document.createElement("div");
      teachWrap.className = "archive-teaching";
      String(reading.teaching).trim().split(/\n\s*\n/).forEach(function (chunk) {
        var p = document.createElement("p");
        p.textContent = chunk.trim();
        teachWrap.appendChild(p);
      });
      body.appendChild(teachWrap);
    }

    if (reading.prayer) {
      var prayerLabel = document.createElement("h5");
      prayerLabel.className = "archive-section-label";
      prayerLabel.textContent = "A personal prayer";
      body.appendChild(prayerLabel);

      var p = document.createElement("p");
      p.className = "archive-prayer";
      p.textContent = String(reading.prayer).trim();
      body.appendChild(p);

      var amen = document.createElement("p");
      amen.className = "archive-amen";
      amen.textContent = "In Jesus\u2019 name. Amen.";
      body.appendChild(amen);
    }

    details.appendChild(body);
    return details;
  }

  function renderArchive(items, currentId) {
    if (!els.archiveList) return;
    els.archiveList.innerHTML = "";

    // Filter out the current reading so it's not duplicated below the main card.
    var rest = (items || []).filter(function (r) {
      return r && r.id !== currentId;
    });

    if (!rest.length) {
      if (els.archiveEmpty) els.archiveEmpty.hidden = false;
      if (els.archiveWrap) els.archiveWrap.hidden = false;
      return;
    }

    if (els.archiveEmpty) els.archiveEmpty.hidden = true;
    if (els.archiveWrap) els.archiveWrap.hidden = false;

    rest.forEach(function (reading, i) {
      els.archiveList.appendChild(buildArchiveCard(reading, i));
    });
  }

  function load() {
    var current = null;
    fetch(API + "/api/daily", { cache: "no-store" })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (data) {
        current = data;
        render(data);
        return fetch(API + "/api/daily/archive?limit=14", { cache: "no-store" });
      })
      .then(function (res) { return res && res.ok ? res.json() : []; })
      .then(function (items) {
        renderArchive(items, current && current.id);
      })
      .catch(function () { showEmpty(); });
  }

  // Initial render
  showEmpty();
  load();

  // Refresh if the tab regains focus (in case Pastor Kiki posts mid-session)
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") load();
  });
})();
