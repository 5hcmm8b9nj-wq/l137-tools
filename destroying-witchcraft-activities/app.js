// Destroying Witchcraft Activities — interactive study logic
(function(){
  "use strict";

  /* ---------- storage (in-memory session store; kept in memory for the
     current visit rather than relying on persistent browser storage) ---------- */
  var memStore = {};
  var storageOK = false;

  function getItem(k){ return memStore[k] || null; }
  function setItem(k,v){ memStore[k] = v; }

  /* ---------- progress tracking ---------- */
  var progress = { read:0, say:0, quiz:0, notes:0 };
  try { var saved = getItem("l137_witchcraft_progress"); if(saved) progress = JSON.parse(saved); } catch(e){}

  function saveProgress(){ setItem("l137_witchcraft_progress", JSON.stringify(progress)); updateProgressBar(); }
  function updateProgressBar(){
    var total = 4 + 20 + 1; // 4 scriptures + 20 prayers + quiz completion
    var done = Math.min(progress.read,4) + Math.min(progress.say,20) + (progress.quiz ? 1 : 0);
    var pct = Math.round((done/total)*100);
    var fill = document.getElementById("progressFill");
    var lab = document.getElementById("progressPct");
    if(fill) fill.style.width = pct + "%";
    if(lab) lab.textContent = pct + "%";
  }

  /* ---------- nav ---------- */
  document.querySelectorAll("[data-goto]").forEach(function(btn){
    btn.addEventListener("click", function(){
      var id = btn.getAttribute("data-goto");
      var target = document.getElementById(id) || document.getElementById(
        id === "home" ? "home" : id
      );
      if(target) target.scrollIntoView({behavior:"smooth", block:"start"});
    });
  });

  /* ---------- text to speech (LISTEN / STOP) ---------- */
  // Pre-warm the speech engine so the first tap isn't silent while voices load.
  if("speechSynthesis" in window){
    try { window.speechSynthesis.getVoices(); } catch(e){}
    window.speechSynthesis.addEventListener && window.speechSynthesis.addEventListener("voiceschanged", function(){ try { window.speechSynthesis.getVoices(); } catch(e){} });
  }

  var allAudioGroups = [];

  function setGroupState(group, playing){
    group.playBtn.classList.toggle("is-playing", playing);
    group.stopBtn.disabled = !playing;
    group.playBtn.textContent = playing ? "▶ Playing…" : "▶ " + group.playLabel;
  }

  function stopAllAudio(){
    if("speechSynthesis" in window) window.speechSynthesis.cancel();
    allAudioGroups.forEach(function(g){ setGroupState(g, false); });
  }

  function speak(text, group){
    if(!("speechSynthesis" in window)){
      alert("Listen aloud isn't supported in this browser. Please read the text aloud yourself.");
      return;
    }
    stopAllAudio();
    var utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.92;
    setGroupState(group, true);
    utter.onend = function(){ setGroupState(group, false); };
    utter.onerror = function(){ setGroupState(group, false); };
    window.speechSynthesis.speak(utter);
  }

  /* Returns a <div class="audio-controls"> with a big, clearly-labeled
     ▶ Play button and a separate ⏹ Stop button (never a single toggling
     button — that was too easy to miss). */
  function listenBtn(text, label){
    label = label || "Listen";
    var wrap = document.createElement("div");
    wrap.className = "audio-controls";

    var playBtn = document.createElement("button");
    playBtn.type = "button";
    playBtn.className = "btn-listen btn-play";
    playBtn.textContent = "▶ " + label;

    var stopBtn = document.createElement("button");
    stopBtn.type = "button";
    stopBtn.className = "btn-listen btn-stop";
    stopBtn.textContent = "⏹ Stop";
    stopBtn.disabled = true;

    var group = { playBtn: playBtn, stopBtn: stopBtn, playLabel: label };
    allAudioGroups.push(group);

    playBtn.addEventListener("click", function(e){ e.stopPropagation(); speak(text, group); });
    stopBtn.addEventListener("click", function(e){ e.stopPropagation(); stopAllAudio(); });

    wrap.appendChild(playBtn);
    wrap.appendChild(stopBtn);
    return wrap;
  }

  /* ================= SCRIPTURE CARDS ================= */
  var readSeen = {};
  function buildScriptureCards(){
    var host = document.getElementById("scriptureCards");
    SCRIPTURES.forEach(function(s, idx){
      var card = document.createElement("div");
      card.className = "scripture-card";

      var refEl = document.createElement("div");
      refEl.className = "scripture-ref"; refEl.textContent = s.ref + " · KJV";
      card.appendChild(refEl);

      var textEl = document.createElement("div");
      textEl.className = "scripture-text"; textEl.textContent = "“" + s.kjv + "”";
      card.appendChild(textEl);

      card.appendChild(listenBtn(s.ref + ". " + s.kjv, "Listen"));

      var cmd = document.createElement("p");
      cmd.style.marginTop = "12px"; cmd.style.fontSize = "14.5px"; cmd.style.color = "var(--charcoal-mu)";
      cmd.textContent = s.command;
      card.appendChild(cmd);

      var tabsWrap = document.createElement("div");
      tabsWrap.className = "card-tabs";
      var tabDefs = [
        {key:"word", label:"Word Study"},
        {key:"parallel", label:"Biblical Parallel"},
        {key:"commentary", label:"Commentary"},
        {key:"warning", label:"The Warning"},
        {key:"apply", label:"Apply It Today"},
        {key:"teacher", label:"Teacher's Note"}
      ];
      var panesWrap = document.createElement("div");

      tabDefs.forEach(function(td, ti){
        var tabBtn = document.createElement("button");
        tabBtn.className = "card-tab" + (ti===0 ? " active" : "");
        tabBtn.textContent = td.label;
        tabBtn.addEventListener("click", function(){
          tabsWrap.querySelectorAll(".card-tab").forEach(function(t){ t.classList.remove("active"); });
          tabBtn.classList.add("active");
          panesWrap.querySelectorAll(".card-pane").forEach(function(p){ p.classList.remove("active"); });
          var pane = panesWrap.querySelector('[data-pane="'+td.key+'"]');
          if(pane) pane.classList.add("active");
          markScriptureRead(idx);
        });
        tabsWrap.appendChild(tabBtn);
      });
      card.appendChild(tabsWrap);

      // word study pane — plain-English meaning first, original-language
      // spelling shown only as a small Latin-letter citation (no Hebrew/
      // Greek script on screen — that was distracting, not helpful).
      var wordPane = document.createElement("div");
      wordPane.className = "card-pane active"; wordPane.dataset.pane = "word";
      var lexGrid = document.createElement("div"); lexGrid.className = "lex-grid";
      s.lexicon.forEach(function(l){
        var item = document.createElement("div"); item.className = "lex-item";
        item.innerHTML = '<div class="lex-gloss">'+esc(l.gloss)+'</div>' +
          '<div class="lex-cite">' + esc(l.original) + (l.strongs && l.strongs !== "—" ? ' &middot; ' + esc(l.strongs) : '') + '</div>' +
          '<div class="lex-def">'+esc(l.note)+'</div>';
        lexGrid.appendChild(item);
      });
      wordPane.appendChild(lexGrid);
      var ctx = document.createElement("p"); ctx.className = "source-note"; ctx.style.marginTop = "14px";
      ctx.style.fontSize = "14px"; ctx.style.color = "var(--charcoal-mu)";
      ctx.innerHTML = '<strong style="color:var(--charcoal)">When and to whom this was first spoken:</strong> ' + esc(s.context);
      wordPane.appendChild(ctx);
      var srcNote = document.createElement("p"); srcNote.className = "source-note";
      srcNote.innerHTML = "Sources: " + s.lexicon.map(function(l){ return '<a href="'+l.url+'" target="_blank" rel="noopener">'+esc(l.strongs !== "—" ? l.strongs : l.original)+'</a>'; }).join(" · ");
      wordPane.appendChild(srcNote);
      panesWrap.appendChild(wordPane);

      // parallel pane
      var parPane = document.createElement("div"); parPane.className = "card-pane"; parPane.dataset.pane = "parallel";
      parPane.innerHTML = '<div class="panel gold"><div class="panel-kicker">Biblical Parallel</div><p style="margin:0">'+esc(s.parallel)+'</p></div>';
      panesWrap.appendChild(parPane);

      // commentary pane
      var comPane = document.createElement("div"); comPane.className = "card-pane"; comPane.dataset.pane = "commentary";
      s.commentary.forEach(function(c){
        var cdiv = document.createElement("div"); cdiv.className = "panel teal";
        cdiv.innerHTML = '<div class="panel-kicker">'+esc(c.author)+'</div><p style="margin:0 0 8px">“'+esc(c.text)+'”</p><p class="source-note" style="margin:0"><a href="'+c.url+'" target="_blank" rel="noopener">Read source</a></p>';
        comPane.appendChild(cdiv);
      });
      panesWrap.appendChild(comPane);

      // warning pane
      var warnPane = document.createElement("div"); warnPane.className = "card-pane"; warnPane.dataset.pane = "warning";
      warnPane.innerHTML = '<div class="panel ember"><div class="panel-kicker ember-t">⚠ Not A Formula</div><p style="margin:0">'+esc(s.warning)+'</p></div>';
      panesWrap.appendChild(warnPane);

      // apply pane
      var applyPane = document.createElement("div"); applyPane.className = "card-pane"; applyPane.dataset.pane = "apply";
      applyPane.innerHTML = '<div class="panel green"><div class="panel-kicker">Apply It Today</div><p style="margin:0">'+esc(s.apply)+'</p></div>';
      panesWrap.appendChild(applyPane);

      // teacher pane
      var teachPane = document.createElement("div"); teachPane.className = "card-pane"; teachPane.dataset.pane = "teacher";
      teachPane.innerHTML = '<div class="teacher-card"><h4>Teacher\'s Note</h4><p style="margin:0">'+esc(s.teacher)+'</p></div>';
      panesWrap.appendChild(teachPane);

      card.appendChild(panesWrap);
      host.appendChild(card);
    });
  }
  function markScriptureRead(idx){
    if(!readSeen[idx]){ readSeen[idx] = true; progress.read = Object.keys(readSeen).length; saveProgress(); }
  }

  /* ================= PRAYER ACCORDION ================= */
  var saySeen = {};
  function buildPrayerList(){
    var host = document.getElementById("prayerList");
    PRAYERS.forEach(function(p, idx){
      var item = document.createElement("div");
      item.className = "prayer-item";

      var head = document.createElement("button");
      head.className = "prayer-head";
      head.innerHTML = '<span class="prayer-num">'+p.n+'</span><span class="prayer-quote">“'+esc(p.text)+'”</span><span class="prayer-chevron">▾</span>';
      head.addEventListener("click", function(){
        item.classList.toggle("open");
        if(item.classList.contains("open")){
          if(!saySeen[idx]){ saySeen[idx] = true; progress.say = Object.keys(saySeen).length; saveProgress(); }
        }
      });
      item.appendChild(head);

      var body = document.createElement("div");
      body.className = "prayer-body";

      var repeatWrap = document.createElement("div");
      repeatWrap.className = "repeat-block";
      var repeatLabel = document.createElement("div");
      repeatLabel.className = "prayer-label";
      repeatLabel.textContent = "🔁 Say This Three Times";
      repeatWrap.appendChild(repeatLabel);
      ["1st time","2nd time","3rd time"].forEach(function(tag){
        var line = document.createElement("div");
        line.className = "repeat-line";
        line.innerHTML = '<span class="repeat-tag">'+tag+'</span><span class="repeat-text">“'+esc(p.text)+'”</span>';
        repeatWrap.appendChild(line);
      });
      var audioMount = document.createElement("div");
      audioMount.style.marginTop = "10px";
      audioMount.appendChild(listenBtn(p.text + ". " + p.text + ". " + p.text + ".", "Listen & Repeat 3x"));
      repeatWrap.appendChild(audioMount);
      body.appendChild(repeatWrap);

      var meaningWrap = document.createElement("div");
      meaningWrap.innerHTML =
        '<div class="prayer-label">💡 Meaning</div><p style="margin:0 0 8px">'+esc(p.meaning)+'</p>' +
        '<div class="prayer-label">📖 Scripture — '+esc(p.verseRef)+'</div>' +
        '<p style="margin:0 0 8px;font-family:var(--serif);font-style:italic">“'+esc(p.verseText)+'”</p>';
      body.appendChild(meaningWrap);

      var exWrap = document.createElement("div");
      var exLabel = document.createElement("div");
      exLabel.className = "prayer-label ex";
      exLabel.textContent = "❤️ Real-Life Examples";
      exWrap.appendChild(exLabel);
      (p.examples || []).forEach(function(ex){
        var exP = document.createElement("p");
        exP.className = "example-item";
        exP.textContent = ex;
        exWrap.appendChild(exP);
      });
      body.appendChild(exWrap);

      item.appendChild(body);
      host.appendChild(item);
    });
  }

  /* ================= SEALING ================= */
  function buildSealing(){
    var host = document.getElementById("sealingCard");
    var card = document.createElement("div");
    card.className = "scripture-card";
    card.innerHTML =
      '<div class="scripture-ref">SEALING PRAYER</div>' +
      '<div class="scripture-text">“'+esc(SEALING.text)+'”</div>';
    card.appendChild(listenBtn(SEALING.text + " " + SEALING.text + " " + SEALING.text, "Listen & Repeat 3x"));
    var rest = document.createElement("div");
    rest.style.marginTop = "14px";
    var exampleHtml = (SEALING.examples || []).map(function(ex){ return '<p class="example-item">'+esc(ex)+'</p>'; }).join("");
    rest.innerHTML =
      '<p style="font-weight:700;color:var(--ember-deep)">'+esc(SEALING.next)+'</p>' +
      '<div class="prayer-label">💡 Meaning</div><p style="margin:0 0 8px">'+esc(SEALING.meaning)+'</p>' +
      '<div class="prayer-label">📖 Scripture — '+esc(SEALING.verseRef)+'</div>' +
      '<p style="margin:0 0 8px;font-family:var(--serif);font-style:italic">“'+esc(SEALING.verseText)+'”</p>' +
      '<div class="prayer-label ex">❤️ Real-Life Examples</div>' + exampleHtml;
    card.appendChild(rest);
    host.appendChild(card);
  }

  /* ================= TEACHER'S CORNER ================= */
  function buildTeacher(){
    var host = document.getElementById("teacherCards");
    TEACHER.forEach(function(t){
      var card = document.createElement("div");
      card.className = "teacher-card";
      card.innerHTML =
        '<h4>'+esc(t.icon)+' '+esc(t.title)+'</h4>' +
        '<p style="margin:0 0 10px">'+esc(t.scenario)+'</p>' +
        '<div class="prayer-label">Pray</div><p style="margin:0 0 6px">'+esc(t.link)+'</p>' +
        '<div class="prayer-label">Scripture Basis</div><p style="margin:0 0 6px">'+esc(t.verse)+'</p>' +
        '<p class="also">'+esc(t.balance)+'</p>';
      card.querySelector("h4").style.fontSize = "18px";
      host.appendChild(card);
    });
  }

  /* ================= FLASHCARDS ================= */
  function buildFlashcards(){
    var host = document.getElementById("flashGrid");
    var cards = [];
    SCRIPTURES.forEach(function(s){
      cards.push({front:s.ref, back:s.kjv, tag:"Scripture"});
      s.lexicon.slice(0,2).forEach(function(l){
        cards.push({front:l.gloss, back:l.note + " (" + l.original + (l.strongs!=="—" ? ", "+l.strongs : "") + ")", tag:"Word Study"});
      });
    });
    cards.forEach(function(c){
      var fc = document.createElement("div"); fc.className = "flashcard";
      fc.innerHTML =
        '<div class="flashcard-inner">' +
          '<div class="flashcard-face flashcard-front"><div class="flashcard-tag">'+esc(c.tag)+'</div><div class="flashcard-main">'+esc(c.front)+'</div><div class="flashcard-hint">Tap to reveal</div></div>' +
          '<div class="flashcard-face flashcard-back"><div class="flashcard-tag">'+esc(c.tag)+'</div><div class="flashcard-main" style="font-size:15px">'+esc(c.back)+'</div></div>' +
        '</div>';
      fc.addEventListener("click", function(){ fc.classList.toggle("flipped"); });
      host.appendChild(fc);
    });
  }

  /* ================= QUIZ ================= */
  var quizScore = { correct:0, total:0 };
  function buildQuiz(){
    var host = document.getElementById("quizArea");
    var scoreBar = document.createElement("div");
    scoreBar.className = "quiz-score"; scoreBar.style.marginBottom = "16px";
    scoreBar.textContent = "Score: 0 / " + countScorable();
    scoreBar.id = "quizScoreBar";
    host.appendChild(scoreBar);

    QUIZ.forEach(function(q, qi){
      var card = document.createElement("div"); card.className = "quiz-card";
      var qEl = document.createElement("div"); qEl.className = "quiz-q"; qEl.textContent = (qi+1) + ". " + q.q;
      card.appendChild(qEl);

      if(q.type === "mc" || q.type === "scenario"){
        var opts = document.createElement("div"); opts.className = "quiz-opts";
        q.opts.forEach(function(opt, oi){
          var b = document.createElement("button"); b.className = "quiz-opt"; b.textContent = opt;
          b.addEventListener("click", function(){
            if(b.disabled) return;
            opts.querySelectorAll("button").forEach(function(x){ x.disabled = true; });
            if(oi === q.correct){ b.classList.add("correct"); registerScore(true); }
            else { b.classList.add("wrong"); if(opts.children[q.correct]) opts.children[q.correct].classList.add("correct"); registerScore(false); }
            showExplain(card, q.explain);
          });
          opts.appendChild(b);
        });
        card.appendChild(opts);
      } else if(q.type === "tf"){
        var opts2 = document.createElement("div"); opts2.className = "quiz-opts";
        [true,false].forEach(function(val){
          var b = document.createElement("button"); b.className = "quiz-opt"; b.textContent = val ? "True" : "False";
          b.addEventListener("click", function(){
            if(b.disabled) return;
            opts2.querySelectorAll("button").forEach(function(x){ x.disabled = true; });
            if(val === q.correct){ b.classList.add("correct"); registerScore(true); }
            else {
              b.classList.add("wrong");
              Array.from(opts2.children).forEach(function(c,i){ if((i===0)===q.correct) c.classList.add("correct"); });
              registerScore(false);
            }
            showExplain(card, q.explain);
          });
          opts2.appendChild(b);
        });
        card.appendChild(opts2);
      } else if(q.type === "fillblank"){
        var inp = document.createElement("input"); inp.type = "text"; inp.className = "quiz-fillblank"; inp.placeholder = "Type your answer…";
        var checkBtn = document.createElement("button"); checkBtn.className = "btn btn-teal"; checkBtn.style.marginTop = "10px"; checkBtn.textContent = "Check Answer";
        checkBtn.addEventListener("click", function(){
          if(checkBtn.disabled) return;
          checkBtn.disabled = true; inp.disabled = true;
          var ok = inp.value.trim().toLowerCase() === q.answer.toLowerCase();
          inp.style.borderColor = ok ? "var(--green)" : "var(--ember)";
          registerScore(ok);
          showExplain(card, (ok ? "Correct — " : "The answer is \u201c" + q.answer + "\u201d. — ") + q.explain);
        });
        card.appendChild(inp); card.appendChild(checkBtn);
      } else if(q.type === "matching"){
        var mgrid = document.createElement("div"); mgrid.style.display = "grid"; mgrid.style.gap = "8px";
        var rightVals = q.pairs.map(function(p){ return p.right; });
        q.pairs.forEach(function(pair, pi){
          var row = document.createElement("div"); row.style.display = "flex"; row.style.gap = "10px"; row.style.alignItems = "center"; row.style.flexWrap = "wrap";
          var label = document.createElement("span"); label.style.flex = "1 1 220px"; label.style.fontSize = "14.5px"; label.textContent = pair.left;
          var sel = document.createElement("select"); sel.style.padding = "8px"; sel.style.borderRadius = "8px"; sel.style.border = "1px solid var(--line)"; sel.style.maxWidth = "100%"; sel.style.width = "100%"; sel.style.flex = "1 1 100%"; sel.style.boxSizing = "border-box";
          var blank = document.createElement("option"); blank.value = ""; blank.textContent = "Choose scripture…"; sel.appendChild(blank);
          rightVals.forEach(function(rv){ var o = document.createElement("option"); o.value = rv; o.textContent = rv; sel.appendChild(o); });
          row.appendChild(label); row.appendChild(sel);
          mgrid.appendChild(row);
        });
        var checkM = document.createElement("button"); checkM.className = "btn btn-teal"; checkM.style.marginTop = "10px"; checkM.textContent = "Check Matches";
        checkM.addEventListener("click", function(){
          if(checkM.disabled) return;
          checkM.disabled = true;
          var selects = mgrid.querySelectorAll("select");
          var allCorrect = true;
          selects.forEach(function(s, i){ s.disabled = true; if(s.value !== q.pairs[i].right){ allCorrect = false; s.style.borderColor = "var(--ember)"; } else { s.style.borderColor = "var(--green)"; } });
          registerScore(allCorrect);
          showExplain(card, allCorrect ? "All matched correctly." : "Some matches were incorrect — correct pairs are now shown in green.");
        });
        card.appendChild(mgrid); card.appendChild(checkM);
      } else if(q.type === "order"){
        var list = document.createElement("ol"); list.style.paddingLeft = "20px";
        var shuffled = q.items.slice().sort(function(){ return Math.random()-0.5; });
        shuffled.forEach(function(it){
          var li = document.createElement("li"); li.style.marginBottom = "8px"; li.style.display = "flex"; li.style.gap = "8px"; li.style.alignItems = "center";
          var sel = document.createElement("select"); sel.style.padding = "6px"; sel.style.borderRadius = "6px"; sel.style.border = "1px solid var(--line)";
          for(var i=1;i<=q.items.length;i++){ var o = document.createElement("option"); o.value = i; o.textContent = i; sel.appendChild(o); }
          var span = document.createElement("span"); span.textContent = it; span.dataset.item = it;
          li.appendChild(sel); li.appendChild(span);
          list.appendChild(li);
        });
        var checkO = document.createElement("button"); checkO.className = "btn btn-teal"; checkO.style.marginTop = "10px"; checkO.textContent = "Check Order";
        checkO.addEventListener("click", function(){
          if(checkO.disabled) return;
          checkO.disabled = true;
          var rows = Array.from(list.children);
          var ok = true;
          rows.forEach(function(row){
            var sel = row.querySelector("select"); var span = row.querySelector("span");
            sel.disabled = true;
            var correctPos = q.items.indexOf(span.dataset.item) + 1;
            if(parseInt(sel.value,10) === correctPos){ sel.style.borderColor = "var(--green)"; }
            else { sel.style.borderColor = "var(--ember)"; ok = false; }
          });
          registerScore(ok);
          showExplain(card, ok ? "Correct order." : "The correct order is: " + q.items.join(" → "));
        });
        card.appendChild(list); card.appendChild(checkO);
      } else if(q.type === "free"){
        var ta = document.createElement("textarea"); ta.className = "notes-area"; ta.style.minHeight = "80px"; ta.placeholder = "Write your answer here…";
        var revealBtn = document.createElement("button"); revealBtn.className = "btn btn-teal"; revealBtn.style.marginTop = "10px"; revealBtn.textContent = "Reveal Model Answer";
        revealBtn.addEventListener("click", function(){ showExplain(card, "Model answer: " + (q.model || q.modelAnswer)); });
        card.appendChild(ta); card.appendChild(revealBtn);
      }

      var explainDiv = document.createElement("div"); explainDiv.className = "quiz-explain";
      card.appendChild(explainDiv);
      host.appendChild(card);
    });
  }
  function countScorable(){ return QUIZ.filter(function(q){ return q.type !== "free"; }).length; }
  function registerScore(correct){
    quizScore.total++;
    if(correct) quizScore.correct++;
    var bar = document.getElementById("quizScoreBar");
    if(bar) bar.textContent = "Score: " + quizScore.correct + " / " + countScorable();
    if(quizScore.total >= countScorable()){ progress.quiz = 1; saveProgress(); }
  }
  function showExplain(card, text){
    var d = card.querySelector(".quiz-explain");
    d.textContent = text; d.classList.add("show");
  }

  /* ================= LIBRARY / SEARCH ================= */
  function buildLibrary(){
    var results = document.getElementById("libraryResults");
    var searchInput = document.getElementById("librarySearch");
    var entries = [];
    SCRIPTURES.forEach(function(s){ entries.push({tag:"SCRIPTURE — "+s.ref, text:s.kjv, cls:""}); });
    PRAYERS.forEach(function(p){ entries.push({tag:"PRAYER "+p.n+" — DECLARE ALOUD", text:p.text, cls:"declare"}); });
    entries.push({tag:"SEALING PRAYER — DECLARE ALOUD", text:SEALING.text, cls:"declare"});

    function render(filter){
      results.innerHTML = "";
      var f = (filter||"").toLowerCase();
      entries.filter(function(e){ return !f || e.text.toLowerCase().indexOf(f) > -1 || e.tag.toLowerCase().indexOf(f) > -1; })
        .forEach(function(e){
          var div = document.createElement("div"); div.className = "lib-item" + (e.cls ? " "+e.cls : "");
          div.innerHTML = '<div class="lib-tag">'+esc(e.tag)+'</div><div>“'+esc(e.text)+'”</div>';
          results.appendChild(div);
        });
      if(results.children.length === 0){ results.innerHTML = '<p class="small">No matches found.</p>'; }
    }
    render("");
    searchInput.addEventListener("input", function(){ render(searchInput.value); });
  }

  /* ================= RECALL CHALLENGE ================= */
  function buildRecall(){
    var btn = document.getElementById("drawRecall");
    var host = document.getElementById("recallCard");
    var pool = [];
    SCRIPTURES.forEach(function(s){ pool.push({type:"Scripture", q:s.ref+" — what does this verse mean, and what is the warning against misusing it?", a:s.apply + " " + s.warning}); });
    PRAYERS.forEach(function(p){ pool.push({type:"Prayer "+p.n, q:"\u201c"+p.text+"\u201d — what is the meaning and a real-life example?", a:p.meaning + " Example: " + ((p.examples && p.examples[0]) || "")}); });
    btn.addEventListener("click", function(){
      var pick = pool[Math.floor(Math.random()*pool.length)];
      host.innerHTML =
        '<div class="quiz-card"><div class="panel-kicker">'+esc(pick.type)+'</div>' +
        '<p style="font-family:var(--serif);font-style:italic;font-size:17px">'+esc(pick.q)+'</p>' +
        '<button class="btn btn-ghost" style="border-color:var(--teal);color:var(--teal-deep)" id="revealRecall">Reveal Answer</button>' +
        '<div class="quiz-explain" id="recallAnswer">'+esc(pick.a)+'</div></div>';
      document.getElementById("revealRecall").addEventListener("click", function(){
        document.getElementById("recallAnswer").classList.add("show");
      });
    });
  }

  /* ================= NOTES ================= */
  function buildNotes(){
    var area = document.getElementById("notesArea");
    var saveNote = document.getElementById("saveNote");
    var existing = getItem("l137_witchcraft_notes");
    if(existing) area.value = existing;
    var timer = null;
    area.addEventListener("input", function(){
      clearTimeout(timer);
      saveNote.textContent = "Saving…";
      timer = setTimeout(function(){
        setItem("l137_witchcraft_notes", area.value);
        progress.notes = area.value.length > 0 ? 1 : 0;
        saveProgress();
        saveNote.textContent = storageOK ? "Saved automatically in this browser." : "Saved for this session (this preview does not persist between visits).";
      }, 500);
    });
  }

  /* ================= COMPLETION ================= */
  function wireCompletion(){
    document.getElementById("checkCompletion").addEventListener("click", function(){
      var badge = document.getElementById("completionBadge");
      var done = progress.read >= 4 && progress.say >= 20 && progress.quiz >= 1;
      if(done){
        badge.classList.add("show");
      } else {
        var missing = [];
        if(progress.read < 4) missing.push((4-progress.read)+" scripture card(s) in Read");
        if(progress.say < 20) missing.push((20-progress.say)+" prayer(s) in Say");
        if(progress.quiz < 1) missing.push("the Knowledge Check");
        alert("Almost there — you still have: " + missing.join(", ") + ".");
      }
    });
  }

  /* ---------- helpers ---------- */
  function esc(str){
    var div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  /* ---------- active nav highlight ---------- */
  function wireScrollSpy(){
    var sections = ["home","how","read","say","seal","teacher","flash","quiz","library","notes","review"];
    var links = {};
    document.querySelectorAll(".navlink").forEach(function(l){ links[l.getAttribute("data-goto")] = l; });
    window.addEventListener("scroll", function(){
      var y = window.scrollY + 120;
      var current = sections[0];
      sections.forEach(function(id){
        var el = document.getElementById(id);
        if(el && el.offsetTop <= y) current = id;
      });
      Object.keys(links).forEach(function(k){ links[k].classList.toggle("active", k === current); });
    }, {passive:true});
  }

  /* ---------- init ---------- */
  buildScriptureCards();
  buildPrayerList();
  buildSealing();
  buildTeacher();
  buildFlashcards();
  buildQuiz();
  buildLibrary();
  buildRecall();
  buildNotes();
  wireCompletion();
  wireScrollSpy();
  updateProgressBar();
})();
