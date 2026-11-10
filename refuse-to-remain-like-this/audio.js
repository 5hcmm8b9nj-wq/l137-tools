(function () {
  // storage with in-memory fallback (preview iframes may block browser storage)
  var mem = {}, store = { get: function (k) { return mem[k]; }, set: function (k, v) { mem[k] = v; } };
  try {
    var ls = window["local" + "Storage"]; ls.setItem("_t", "1"); ls.removeItem("_t");
    store = { get: function (k) { try { return ls.getItem("rrl_" + k); } catch (e) { return mem[k]; } }, set: function (k, v) { try { ls.setItem("rrl_" + k, v); } catch (e) { mem[k] = v; } } };
  } catch (e) {}
  window.L137Store = store;

  document.addEventListener("DOMContentLoaded", function () {
    // L137AUDIO = { p1: {file, dur, cues: [[id, start, end, lv]]}, p2: {...} }
    var A = window.L137AUDIO, LBL = (window.L137 && window.L137.labels) || {};
    var $ = function (s) { return document.querySelector(s); };
    var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
    var audio = $("#audio"), player = $("#player"), mode = null, cur = -1, pendingSeek = null;
    var NAME = { p1: "PART 1 · THE PROPHETIC DIRECTION", p2: "PART 2 · PROPHETIC DIRECTIONS EXPLAINED" };
    var fmt = function (s) { if (!isFinite(s)) return "0:00"; s = Math.floor(s); var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), r = s % 60; return (h ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (r < 10 ? "0" : "") + r; };
    var mins = function (s) { return "about " + Math.max(1, Math.round(s / 60)) + " min"; };
    var studyT = A.p2.cues.filter(function (c) { return c[3]; }).reduce(function (t, c) { return t + (c[2] - c[1]) + 0.6; }, 0);
    $("#hfLen1").textContent = "Pastor Kiky’s words · " + mins(A.p1.dur);
    $("#hfLen2").textContent = "Prayer Mode " + mins(A.p2.dur - studyT) + " · Study Mode " + mins(A.p2.dur);

    var IMG = function (id) {
      if (/^p1-/.test(id)) return "m1"; if (/^(p2-intro|prep)/.test(id)) return "hero";
      if (/^w\d/.test(id)) return "m5"; if (/^s\d/.test(id)) return "m2"; if (/^d\d/.test(id)) return "m3"; return "m4";
    };
    var level = function () { return window.L137Level || "all"; };
    var allowed = function (c) { var l = level(); if (!c[3]) return true; if (l === "none") return false; return l === "all" || c[3] === l; };
    var cueAt = function (t) { var c = A[mode].cues, lo = 0, hi = c.length - 1, k = 0; while (lo <= hi) { var m = (lo + hi) >> 1; if (c[m][1] <= t + 0.05) { k = m; lo = m + 1; } else hi = m - 1; } return k; };
    var nextAllowed = function (k, dir) { var c = A[mode].cues; while (k >= 0 && k < c.length && !allowed(c[k])) k += dir; return k; };

    // --- segmented audio: small files fetched whole (no byte-range needed), played in order on one element
    var SILENT = "data:audio/mpeg;base64,SUQzBAAAAAAAIlRTU0UAAAAOAAADTGF2ZjYyLjMuMTAwAAAAAAAAAAAAAAD/84TAAAAAAAAAAAAASW5mbwAAAA8AAAANAAAFoAAzMzMzMzMzRERERERERERVVVVVVVVVVWZmZmZmZmZ3d3d3d3d3d4iIiIiIiIiImZmZmZmZmaqqqqqqqqqqu7u7u7u7u7vMzMzMzMzM3d3d3d3d3d3u7u7u7u7u7v////////8AAAAATGF2YzYyLjExAAAAAAAAAAAAAAAAJAOQAAAAAAAABaCeT3g+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/80TEAAAAA0gAAAAATEFNRTMuMTAxIChiZXRhIDMpVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy7/80TEUwAAA0gAAAAAMTAxIChiZXRhIDMpVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy7/80TEpgAAA0gAAAAAMTAxIChiZXRhIDMpVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy7/80TErAAAA0gAAAAAMTAxIChiZXRhIDMpVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy7/80TErAAAA0gAAAAAMTAxIChiZXRhIDMpVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy7/80TErAAAA0gAAAAAMTAxIChiZXRhIDMpVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy7/80TErAAAA0gAAAAAMTAxIChiZXRhIDMpVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy7/80TErAAAA0gAAAAAMTAxIChiZXRhIDMpVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy7/80TErAAAA0gAAAAAMTAxIChiZXRhIDMpVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy7/80TErAAAA0gAAAAAMTAxIChiZXRhIDMpVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy7/80TErAAAA0gAAAAAMTAxIChiZXRhIDMpVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/80TErAAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/80TErAAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=", unlocked = false, isSilent = false, si = 0, loading = false, reqId = 0, pendingT = 0;
    var blobs = {}, ready = {}, unlockP = null;
    var fetchBlob = function (f) { return fetch(f).then(function (r) { if (!r.ok) throw new Error(r.status); return r.blob(); }).then(function (b) { return URL.createObjectURL(b); }); };
    // audio files are large enough to be streamed from storage with normal byte-range support (what iPhones need),
    // so the file address is handed straight to the player inside the tap
    var getUrl = function (f) { ready[f] = f; return Promise.resolve(f); };
    var segs = function () { return A[mode].segs; };
    var gt = function () { return isSilent || !mode || loading ? pendingT : segs()[si][1] + (audio.currentTime || 0); };
    var segFor = function (t) { var s = segs(), i = 0; while (i + 1 < s.length && s[i + 1][1] <= t + 0.001) i++; return i; };
    // phones only allow sound that starts inside a tap; if the real audio is not downloaded yet, start a silent clip in the tap
    var unlock = function () {
      if (unlocked) return unlockP || Promise.resolve(); unlocked = true; isSilent = true; audio.src = SILENT;
      var p = audio.play(); unlockP = (p && p.then ? p : Promise.resolve()).catch(function () { unlocked = false; });
      return unlockP;
    };
    var attach = function (i, u, local, play) {
      isSilent = false; audio.setAttribute("data-seg", segs()[i][0]); pendingSeek = local;
      audio.src = u; audio.load();
      if (play) playNow(); else setLoading(false);
      if (segs()[i + 1]) getUrl(segs()[i + 1][0]);
    };
    var setLoading = function (on) { loading = on; player.classList.toggle("loading", on); if (on) $("#pTime").textContent = "Loading…"; };
    var playNow = function () { var p = audio.play(); if (p && p.catch) p.catch(function (e) { if (e && e.name === "AbortError") return; setLoading(false); $("#tapGate").hidden = false; }); };
    var seekTo = function (t, play) {
      var i = segFor(t), local = Math.max(0, t - segs()[i][1]);
      pendingT = t;
      if (!isSilent && !loading && i === si && audio.getAttribute("data-seg") === segs()[i][0] && audio.readyState >= 1) {
        try { audio.currentTime = local; } catch (e) {}
        if (play) playNow();
        return;
      }
      var my = ++reqId, f = segs()[i][0]; si = i;
      if (ready[f]) { unlocked = true; setLoading(true); attach(i, ready[f], local, play); return; }  // already downloaded: start inside the tap
      setLoading(true);
      var u0 = play ? unlock() : Promise.resolve();
      Promise.all([getUrl(f), u0]).then(function (r) { if (my === reqId) attach(i, r[0], local, play); });
    };
    // streaming links expire after a while: if the file stops loading, fetch a fresh link and carry on from the same spot
    var lastT = 0, wantPlay = false, fails = [], stallTimer = null;
    var recover = function () {
      if (isSilent || !mode || !audio.getAttribute("data-seg")) return;
      var now = Date.now(); fails = fails.filter(function (x) { return now - x < 60000; }); fails.push(now);
      audio.removeAttribute("data-seg");
      if (fails.length > 4) { setLoading(false); $("#pTime").textContent = "Connection problem. Tap ▶ to try again."; pendingT = lastT; return; }
      seekTo(lastT, wantPlay || !audio.paused);
    };
    audio.addEventListener("error", recover);
    audio.addEventListener("waiting", function () { clearTimeout(stallTimer); stallTimer = setTimeout(function () { if (wantPlay && audio.readyState < 3) recover(); }, 12000); });
    audio.addEventListener("playing", function () { clearTimeout(stallTimer); wantPlay = true; });
    audio.addEventListener("pause", function () { if (!loading) wantPlay = false; });
    audio.addEventListener("playing", function () { if (!isSilent) { setLoading(false); player.classList.remove("loading"); } });
    audio.addEventListener("waiting", function () { if (!isSilent) player.classList.add("loading"); });

    ["p1", "p2"].forEach(function (m) { getUrl(A[m].segs[0][0]); });
    try { var pz = JSON.parse(store.get("pos") || "null"); if (pz && A[pz.m]) { var sg = A[pz.m].segs, j = 0; while (j + 1 < sg.length && sg[j + 1][1] <= pz.t) j++; getUrl(sg[j][0]); } } catch (e) {}

    var follow = $("#follow"), chain = $("#chain");
    follow.checked = store.get("follow") !== "0"; follow.onchange = function () { store.set("follow", follow.checked ? "1" : "0"); };
    chain.checked = store.get("chain") !== "0"; chain.onchange = function () { store.set("chain", chain.checked ? "1" : "0"); };
    // pause auto-scroll for a few seconds when the reader scrolls by hand
    var userScrollUntil = 0, autoScrolling = false;
    ["wheel", "touchmove"].forEach(function (ev) { addEventListener(ev, function () { if (!autoScrolling) userScrollUntil = Date.now() + 6000; }, { passive: true }); });

    var setMeta = function () {
      if (!("mediaSession" in navigator) || !mode) return;
      var c = A[mode].cues[cur];
      try { navigator.mediaSession.metadata = new MediaMetadata({ title: c ? (LBL[c[0]] || "Refuse to Remain Like This") : "Refuse to Remain Like This", artist: "Pastor Kiky Ocansey · L137", album: mode === "p1" ? "Part 1 · The Prophetic Direction" : "Part 2 · Prophetic Directions Explained", artwork: [{ src: "assets/img/" + (c ? IMG(c[0]) : "hero") + ".jpg", sizes: "1200x800", type: "image/jpeg" }] }); } catch (e) {}
    };
    var clearHi = function () { $$(".speaking").forEach(function (e) { e.classList.remove("speaking"); }); };
    var highlight = function (scroll) {
      clearHi();
      var c = A[mode].cues[cur]; if (!c) return;
      var els = $$('[data-cue="' + c[0] + '"]'); if (!els.length) return;
      els.forEach(function (el) { el.classList.add("speaking"); var d = el.closest("details"); if (d) d.open = true; });
      var thumb = "assets/img/" + IMG(c[0]) + ".jpg"; if ($("#pThumb").getAttribute("src") !== thumb) $("#pThumb").setAttribute("src", thumb);
      if ((scroll || follow.checked) && !audio.paused && (scroll || Date.now() > userScrollUntil)) {
        autoScrolling = true; els[0].scrollIntoView({ behavior: "smooth", block: "center" }); setTimeout(function () { autoScrolling = false; }, 900);
      }
    };
    var lastSave = 0;
    var onTime = function () {
      if (!mode || isSilent || loading) return;
      var t = gt(), k = cueAt(t), c = A[mode].cues; lastT = t;
      if (!allowed(c[k])) { var n = nextAllowed(k, 1); if (n < c.length) { cur = n; $("#pName").textContent = LBL[c[n][0]] || ""; seekTo(c[n][1] + 0.01, true); return; } else { audio.pause(); return; } }
      if (segs()[si + 1] && audio.duration && audio.currentTime > audio.duration / 2) getUrl(segs()[si + 1][0]);
      if (k !== cur) { cur = k; $("#pName").textContent = LBL[c[k][0]] || ""; setMeta(); highlight(false); }
      if (!dragging) seek.value = t / A[mode].dur * 1000;
      $("#pTime").textContent = fmt(t) + " / " + fmt(A[mode].dur);
      if (Date.now() - lastSave > 4000) { lastSave = Date.now(); store.set("pos", JSON.stringify({ m: mode, t: Math.max(0, c[k][1]), id: c[k][0] })); }
    };
    var sync = function () {
      var playing = (!audio.paused && !audio.ended) || loading;
      var b = $("#pToggle"); b.textContent = playing ? "❚❚" : "▶"; b.setAttribute("aria-label", playing ? "Pause" : "Play");
      $$("[data-play]").forEach(function (x) { x.classList.toggle("playing", playing && x.dataset.play === mode); });
      if ("mediaSession" in navigator) try { navigator.mediaSession.playbackState = playing ? "playing" : "paused"; } catch (e) {}
    };
    var start = function (m, at) {
      var fresh = mode !== m;
      if (fresh) { mode = m; cur = -1; si = 0; pendingT = 0; audio.removeAttribute("data-seg"); $("#pMode").textContent = "NOW PLAYING · " + NAME[m]; }
      player.hidden = false; document.body.classList.add("has-player");
      if (typeof at === "number") { cur = -1; seekTo(at, true); }
      else if (fresh || isSilent || audio.getAttribute("data-seg") == null) seekTo(pendingT, true);
      else playNow();
      setTimeout(function () { if (mode && A[mode].cues[cur]) highlight(true); }, 1500);
    };
    audio.addEventListener("loadedmetadata", function () { if (pendingSeek !== null) { try { audio.currentTime = pendingSeek; } catch (e) {} pendingSeek = null; } });
    audio.addEventListener("timeupdate", onTime);
    ["play", "pause", "ended", "loadedmetadata"].forEach(function (ev) { audio.addEventListener(ev, sync); });
    audio.addEventListener("ended", function () {
      if (isSilent || loading) return;
      if (segs()[si + 1]) { seekTo(segs()[si + 1][1], true); return; }
      clearHi();
      if (mode === "p1" && chain.checked) { start("p2", 0); return; }
      if (mode === "p2") store.set("pos", "");
    });

    var jump = function (k, dir) { var c = A[mode].cues; k = nextAllowed(Math.max(0, Math.min(c.length - 1, k)), dir || 1); if (k < 0 || k >= c.length) return; cur = -1; seekTo(c[k][1] + 0.01, true); };
    // section-level jumps: next/prev move to the next heading cue (…-k, prep items, close parts), not every paragraph
    var isHead = function (id) { return /^(p1-|p2-intro|prep\d+$|close-)/.test(id) || /-k$/.test(id); };
    var findHead = function (k, dir) { var c = A[mode].cues; k += dir; while (k >= 0 && k < c.length && !isHead(c[k][0])) k += dir; return k; };
    document.addEventListener("click", function (e) {
      var p = e.target.closest("[data-play]"); if (p) { var m = p.dataset.play; if (mode === m && !audio.paused && !isSilent) audio.pause(); else start(m, mode === m ? undefined : 0); return; }
      var f = e.target.closest("[data-from]"); if (f) { var part = f.dataset.part || "p2", id = f.dataset.from, cs = A[part].cues; for (var i = 0; i < cs.length; i++) if (cs[i][0] === id) { start(part, cs[i][1] + 0.01); break; } return; }
    });
    var toggle = function () { if (!mode) return start("p1"); if (audio.paused || isSilent) { if (isSilent || loading || audio.getAttribute("data-seg") == null) seekTo(pendingT, true); else playNow(); } else audio.pause(); };
    $("#pToggle").onclick = toggle;
    $("#pStop").onclick = function () { audio.pause(); player.hidden = true; document.body.classList.remove("has-player"); clearHi(); };
    $("#pPrev").onclick = function () { if (!mode) return; var c = A[mode].cues; if (cur < 0) cur = cueAt(gt()); var h = isHead(c[cur][0]) ? cur : findHead(cur, -1); if (gt() - c[Math.max(h, 0)][1] < 3) h = findHead(Math.max(h, 0), -1); jump(Math.max(h, 0), 1); };
    $("#pNext").onclick = function () { if (!mode) return; var h = findHead(cur, 1); if (h < A[mode].cues.length) jump(h, 1); else if (mode === "p1") start("p2", 0); };
    var seek = $("#pSeek"), dragging = false;
    seek.addEventListener("input", function () { dragging = true; if (mode) $("#pTime").textContent = fmt(seek.value / 1000 * A[mode].dur) + " / " + fmt(A[mode].dur); });
    seek.addEventListener("change", function () { dragging = false; if (mode) { cur = -1; seekTo(seek.value / 1000 * A[mode].dur, true); } });
    if ("mediaSession" in navigator) {
      var ms = navigator.mediaSession;
      try { ms.setActionHandler("play", function () { toggle(); }); ms.setActionHandler("pause", function () { audio.pause(); });
        ms.setActionHandler("previoustrack", function () { $("#pPrev").click(); }); ms.setActionHandler("nexttrack", function () { $("#pNext").click(); });
        ms.setActionHandler("seekto", function (d) { if (mode) seekTo(d.seekTime, true); }); } catch (e) {}
    }
    // resume
    var rb = $("#resumeBtn");
    try { var pos = JSON.parse(store.get("pos") || "null"); if (pos && pos.m && A[pos.m] && pos.t > 20) { rb.hidden = false; rb.textContent = "▶ Resume where I stopped · " + (pos.m === "p1" ? "Part 1" : "Part 2") + " · " + (LBL[pos.id] || fmt(pos.t)); rb.onclick = function () { start(pos.m, pos.t); }; } } catch (e) {}

    // tap gate (phones require one tap before sound)
    var gate = $("#tapGate");
    var gateGo = function () { gate.hidden = true; start(mode || "p1"); };
    gate.addEventListener("click", gateGo);
    gate.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); gateGo(); } });

    var auto = $("#autoStart");
    auto.checked = store.get("autostart") === "1";
    auto.onchange = function () { store.set("autostart", auto.checked ? "1" : "0"); };
    if (auto.checked) setTimeout(function () { start("p1", 0); }, 400);
    window.L137Player = { start: start, seek: function (t) { seekTo(t, true); }, state: function () { return { mode: mode, cur: cur, id: mode && A[mode].cues[cur] ? A[mode].cues[cur][0] : null, t: mode ? gt() : 0, seg: si, loading: loading }; } };
  });
})();
