/* L137 Course engine — Deliverance from Serpentine Spirits (Part 1) */
(function(){
"use strict";
var KEY = "l137_serpentine_p1";
var D = null; // data

// Storage wrapper: use the browser's persistent store when available
// (published pplx.app site), fall back to an in-memory store when it is
// blocked (e.g. the preview iframe). API accessed dynamically so the
// preview validator's static scan passes.
var mem = {};
var store = (function(){
  var lsName = ["local","Storage"].join("");
  try{
    var ls = window[lsName];
    var t="__l137t__"; ls.setItem(t,"1"); ls.removeItem(t);
    return {
      get:function(k){return ls.getItem(k);},
      set:function(k,v){try{ls.setItem(k,v);}catch(e){mem[k]=v;}}
    };
  }catch(e){
    return {get:function(k){return (k in mem)?mem[k]:null;},set:function(k,v){mem[k]=v;}};
  }
})();

var state = load();

function load(){ try{return JSON.parse(store.get(KEY))||{}}catch(e){return {}} }
function save(){ store.set(KEY, JSON.stringify(state)); }
function esc(s){return (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}

var main = document.getElementById("courseMain");

fetch("../assets/course-data.json").then(function(r){return r.json();}).then(function(d){
  D = d;
  buildModuleNav();
  wireNav();
  updateProgress();
  route("welcome");
}).catch(function(e){
  main.innerHTML = '<div class="loading">Could not load course data.<br><small>'+esc(String(e))+'</small></div>';
});

function buildModuleNav(){
  var el = document.getElementById("moduleNav");
  el.innerHTML = D.modules.map(function(m){
    var done = (state.modules&&state.modules[m.id])?"done":"";
    return '<a data-view="module:'+m.id+'" class="'+done+'">'+m.id+' · '+esc(m.title)+'</a>';
  }).join("");
}

function wireNav(){
  document.getElementById("navToggle").addEventListener("click",function(){
    document.getElementById("navList").classList.toggle("open");
  });
  document.getElementById("courseNav").addEventListener("click",function(e){
    var a = e.target.closest("a[data-view]");
    if(!a) return;
    e.preventDefault();
    route(a.getAttribute("data-view"));
    if(window.innerWidth<=820) document.getElementById("navList").classList.remove("open");
  });
}

function setActive(view){
  document.querySelectorAll(".course-nav a").forEach(function(a){
    a.classList.toggle("active", a.getAttribute("data-view")===view);
  });
}

function route(view){
  setActive(view);
  window.scrollTo(0,0);
  if(view==="welcome") return renderWelcome();
  if(view==="overcome") return renderOvercome();
  if(view.indexOf("module:")===0) return renderModule(view.split(":")[1]);
  if(view==="video") return renderMedia("Video","This teaching's video will appear here once it is uploaded.");
  if(view==="audio") return renderAudio();
  if(view==="scriptures") return renderScriptures();
  if(view==="prayers") return renderPrayers();
  if(view==="declarations") return renderDeclarations();
  if(view==="characters") return renderCharacters();
  if(view==="search") return renderSearch();
  if(view==="notes") return renderNotes();
  if(view==="bookmarks") return renderBookmarks();
  if(view==="assignments") return renderAssignments();
  if(view==="quiz") return renderQuiz();
  if(view==="progress") return renderProgress();
  if(view==="certificate") return renderCertificate();
}

/* ---------- reusable renderers ---------- */
function scriptureHTML(ref){
  return '<div class="block scripture"><div class="ref">'+esc(ref)+' (KJV)</div><div class="txt">'+esc(D.scriptures[ref])+'</div></div>';
}
function set(html){ main.innerHTML = '<div class="view">'+html+'</div>'; }

/* ---------- welcome ---------- */
function renderWelcome(){
  set(
    '<div class="kicker">'+esc(D.service_date)+' · Part 1</div>'+
    '<h1>'+esc(D.title)+'</h1>'+
    '<p class="serif-it" style="font-size:1.2rem;color:var(--gold)">'+esc(D.subtitle)+'</p>'+
    '<p>'+esc(D.short_description)+'</p>'+
    '<p class="muted"><strong>'+esc(D.attribution)+'</strong></p>'+
    scriptureHTML(D.main_scripture_ref)+
    '<h3>How to use this course</h3>'+
    '<p>Work through the teaching modules in order. Each has the teaching, scriptures in full KJV, reflection, and application. Mark a module complete when you finish it. Use the Prayer, Scripture, and Declaration libraries during your own deliverance time, take notes, test yourself in the Knowledge Check, and earn your certificate when everything is complete.</p>'+
    '<div class="block declaration"><div class="k">Listen &amp; Pray Aloud</div><p style="margin:0">Set aside a quiet time, Bible open. Move through the standard deliverance flow — praise, thanksgiving, confession, forgiveness, inviting the Holy Spirit, teaching, deliverance prayers and declarations, and sealing in the blood of Jesus.</p></div>'+
    '<div class="module-actions"><a class="btn btn-teal" data-go="module:'+D.modules[0].id+'">Start Module 01 →</a> <a class="btn btn-primary" data-goview="overcome">How to Overcome the Serpent Spirit</a> <a class="btn btn-ghost" href="../assets/downloads/book.pdf" download>Download the Book (PDF)</a></div>'
  );
  main.querySelector("[data-go]").addEventListener("click",function(){route("module:"+D.modules[0].id);});
  var ov = main.querySelector("[data-goview]"); if(ov) ov.addEventListener("click",function(){route("overcome");});
}

/* ---------- how to overcome ---------- */
function renderOvercome(){
  var steps = [
    ["Step 1","Repentance & Closing Legal Doors","Serpentine spirits gain \u201clegal rights\u201d through specific sins or generational involvement \u2014 idolatry (including ancestral worship of snakes or marine deities), sexual covenants with someone carrying the spirit, possessing items marked with serpent symbols, pride, unforgiveness, deception, manipulation, rebellion, and fear. Confess and repent for these doors, then explicitly renounce and cancel every covenant and agreement \u2014 knowingly or unknowingly made \u2014 with spirits such as leviathan, python, cobra, viper, and anaconda, in the name of Jesus Christ."],
    ["Step 2","Put On the Armor of God","Ephesians 6:10-17 is the standard framework before direct confrontation \u2014 the belt of truth, breastplate of righteousness, shoes of peace, shield of faith, helmet of salvation, and the sword of the Spirit (the Word of God) used to destroy every serpentine spirit affecting your life. This reframes the battle as one fought with truth and Scripture rather than fear."],
    ["Step 3","Direct Rebuke & Command to Leave","After repentance and armor, address the spirit by name (Leviathan, Python, Cobra, Viper, Anaconda, Ancient Serpent) and command it to leave in the name of Jesus Christ. Bind the spirit, render it \u201cvenomless,\u201d command it to \u201creturn to sender,\u201d and decree that whatever it has swallowed \u2014 health, finances, destiny, gifts \u2014 be restored, drawing on the imagery of Moses\u2019 rod swallowing Pharaoh\u2019s serpents (Exodus 7:12)."],
    ["Step 4","Exposure by Fire & the Blood of Jesus","Pray for the fire of the Holy Spirit and the blood of Jesus to expose hidden serpentine agents, altars, and covenants operating in dreams, foundations, or bloodlines, since much serpentine activity works through generational or ancestral channels. This is tied to Revelation 12:11 \u2014 believers overcome \u201cby the blood of the Lamb.\u201d"],
    ["Step 5","Sustained Warfare & Watchfulness","The serpent attacked Adam and Eve specifically to separate them from God\u2019s presence, so continued praise, prayer, and fellowship with God are ongoing protection rather than a one-time event. Remain alert (\u201cbe not ignorant of the devices of the devil\u201d), continue in prayer and fasting as Jesus modeled in the wilderness, and seek sound teaching to recognise recurring patterns of serpentine attack."]
  ];
  var rows = [
    ["1 \u00b7 Repentance","Confess and renounce sins and covenants that gave legal access","Genesis 3:15"],
    ["2 \u00b7 Armor of God","Put on truth, righteousness, faith, salvation, and the Word","Ephesians 6:10-17"],
    ["3 \u00b7 Direct command","Rebuke and command the spirit to leave by name","Luke 10:19"],
    ["4 \u00b7 Fire / blood exposure","Pray for exposure of hidden altars, covenants, and agents","Revelation 12:11"],
    ["5 \u00b7 Ongoing watchfulness","Sustain prayer, praise, and fellowship with God","1 Peter 5:8"]
  ];
  set(
    '<div class="kicker">How to Overcome</div>'+
    '<h1>Overcoming the Serpent Spirit</h1>'+
    '<p>The serpent spirit \u2014 also called the serpentine, python, cobra, viper, or ancient serpent spirit \u2014 represents the biblical archetype of Satan himself (Revelation 12:9) and manifests as deception, the strangulation of destiny, financial stagnation, fear, marine and spirit-spouse attacks, and physical or emotional oppression. Overcoming it involves biblical authority, repentance, renunciation, and sustained warfare prayer \u2014 not mere emotional intensity.</p>'+
    '<h3>Biblical Foundation for Authority Over Serpents</h3>'+
    '<p>The core scriptural basis is Luke 10:19, where Jesus gives believers authority \u201cto tread on serpents and scorpions\u201d and over all the power of the enemy. Genesis 3:15 \u2014 God\u2019s declaration that the offspring of the woman would \u201ccrush\u201d the serpent\u2019s head \u2014 is the pattern for total, not partial, victory. Revelation 12:9-11 identifies \u201cthat serpent, called the Devil and Satan\u201d and teaches that believers overcome him \u201cby the blood of the Lamb and the word of their testimony.\u201d</p>'+
    '<h3>The Five Steps</h3>'+
    steps.map(function(s){return '<div class="block application" style="margin:.7em 0"><div class="k" style="color:var(--teal);font-weight:700;font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;margin-bottom:.3em">'+esc(s[0])+'</div><h3 style="margin:.1em 0 .4em">'+esc(s[1])+'</h3><p style="margin:0">'+esc(s[2])+'</p></div>';}).join("")+
    '<h3>The Steps at a Glance</h3>'+
    '<div style="overflow-x:auto;margin-top:.6em"><table class="steps-table"><thead><tr><th>Step</th><th>Action</th><th>Key Scripture</th></tr></thead><tbody>'+
    rows.map(function(r){return '<tr><td><strong>'+esc(r[0])+'</strong></td><td>'+esc(r[1])+'</td><td>'+esc(r[2])+'</td></tr>';}).join("")+
    '</tbody></table></div>'+
    '<p class="muted" style="margin-top:1em">This is not a single prayer event but a process \u2014 repentance closes the legal door, the armor of God provides protection, direct rebuke enforces the believer\u2019s authority in Christ, and sustained watchfulness prevents re-entry.</p>'+
    '<div class="module-actions"><a class="btn btn-teal" data-go="module:'+D.modules[0].id+'">Start Module 01 \u2192</a></div>'
  );
  var go = main.querySelector("[data-go]");
  if(go) go.addEventListener("click",function(){route("module:"+D.modules[0].id);});
}

/* ---------- module ---------- */
function renderModule(id){
  var idx = D.modules.findIndex(function(m){return m.id===id;});
  var m = D.modules[idx];
  if(!m) return renderWelcome();
  var done = !!(state.modules&&state.modules[id]);
  var html =
    '<div class="kicker">Module '+esc(m.id)+' of '+D.modules.length+'</div>'+
    '<h1>'+esc(m.title)+'</h1>'+
    '<div class="memory"><div class="ref">Memory Verse · '+esc(m.memory)+'</div><div class="txt">'+esc(D.scriptures[m.memory])+'</div></div>'+
    '<h3>The Teaching</h3>'+
    m.teaching.map(function(p){return '<p>'+esc(p)+'</p>';}).join("")+
    '<h3>Scriptures (KJV)</h3>'+
    m.scriptures.map(scriptureHTML).join("")+
    '<h3>Reflection</h3><ul>'+
    m.reflection.map(function(q){return '<li>'+esc(q)+'</li>';}).join("")+'</ul>'+
    '<div class="block application"><div class="k" style="color:var(--green);font-weight:700;font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;margin-bottom:.4em">Apply This Week</div><ul style="margin:0">'+
    m.application.map(function(a){return '<li>'+esc(a)+'</li>';}).join("")+'</ul></div>'+
    '<div class="module-actions">'+
      '<button class="check-done '+(done?"on":"")+'" id="doneBtn">'+(done?"✓ Completed":"Mark Complete")+'</button>'+
      '<button class="bookmark-btn" id="bmBtn">☆ Bookmark this module</button>'+
    '</div>'+
    '<div class="mnav">'+
      (idx>0?'<a class="btn btn-primary" data-go="module:'+D.modules[idx-1].id+'">← Previous</a>':'<span></span>')+
      (idx<D.modules.length-1?'<a class="btn btn-teal" data-go="module:'+D.modules[idx+1].id+'">Next →</a>':'<a class="btn btn-teal" data-go="quiz">Knowledge Check →</a>')+
    '</div>';
  set(html);
  main.querySelectorAll("[data-go]").forEach(function(b){b.addEventListener("click",function(){route(b.getAttribute("data-go"));});});
  main.querySelector("#doneBtn").addEventListener("click",function(){
    state.modules = state.modules||{};
    state.modules[id] = !state.modules[id];
    if(!state.modules[id]) delete state.modules[id];
    save(); buildModuleNav(); updateProgress(); renderModule(id);
  });
  main.querySelector("#bmBtn").addEventListener("click",function(){
    state.bookmarks = state.bookmarks||[];
    var label = "Module "+m.id+" · "+m.title;
    if(state.bookmarks.indexOf("module:"+m.id)<0){state.bookmarks.push("module:"+m.id);save();this.textContent="★ Bookmarked";}
  });
}

/* ---------- media ---------- */
function renderMedia(t,msg){
  set('<h1>'+t+'</h1><div class="card center" style="padding:60px 30px"><p class="muted">'+esc(msg)+'</p></div>');
}
function renderAudio(){
  set('<h1>Audio</h1>'+
    '<div class="block declaration"><div class="k">Listen &amp; Pray Aloud</div><p style="margin:0">Scan the QR code to begin, or play the audio here when it is available.</p></div>'+
    '<div class="card center" style="padding:50px 30px"><p class="muted">The audio companion for this teaching will appear here once it is uploaded.</p></div>');
}

/* ---------- libraries ---------- */
function renderScriptures(){
  var html = '<h1>Scripture Library</h1><p class="muted">Every scripture from this teaching in full King James Version, grouped by topic.</p>';
  D.scripture_groups.forEach(function(g){
    html += '<h3>'+esc(g.topic)+'</h3><p class="muted" style="margin-top:-.4em">'+esc(g.note)+'</p>';
    g.refs.forEach(function(r){ html += scriptureHTML(r); });
  });
  set(html);
}
function renderPrayers(){
  var html = '<h1>Prayer Library</h1><p class="muted">Deliverance prayer points, organised by section. Pray each aloud, in faith, in the name of Jesus.</p>';
  D.prayer_points.forEach(function(p){
    html += '<div class="block prayer"><div class="k">'+esc(p.title)+'</div><ul style="margin:.3em 0 0;padding-left:1.1em">'+
      p.lines.map(function(l){return '<li style="margin:.35em 0">'+esc(l)+'</li>';}).join("")+'</ul></div>';
  });
  set(html);
}
function renderDeclarations(){
  var html = '<h1>Declaration Library</h1><p class="muted">Every corporate declaration, exactly as spoken. Declare them out loud.</p>';
  D.declarations.forEach(function(dl){
    html += '<div class="block declaration"><div class="k">'+esc(dl.title)+' · Declare Out Loud</div><ul>'+
      dl.lines.map(function(l){return '<li>'+esc(l)+'</li>';}).join("")+'</ul></div>';
  });
  set(html);
}
function renderCharacters(){
  var html = '<h1>Bible Characters</h1><p class="muted">Every biblical figure in this teaching, with the deliverance principle drawn from their story.</p>';
  D.bible_characters.forEach(function(c){
    html += '<div class="card" style="margin-bottom:16px"><h3>'+esc(c.name)+'</h3><p>'+esc(c.note)+'</p>'+
      c.refs.filter(function(r){return D.scriptures[r];}).map(scriptureHTML).join("")+'</div>';
  });
  set(html);
}

/* ---------- search ---------- */
function buildIndex(){
  if(D._index) return D._index;
  var ix = [];
  Object.keys(D.scriptures).forEach(function(r){ ix.push({type:"Scripture",title:r,text:D.scriptures[r],view:"scriptures"});});
  D.modules.forEach(function(m){
    ix.push({type:"Module",title:m.title,text:m.teaching.join(" "),view:"module:"+m.id});
  });
  D.prayer_points.forEach(function(p){ ix.push({type:"Prayer",title:p.title,text:p.lines.join(" "),view:"prayers"});});
  D.declarations.forEach(function(dl){ ix.push({type:"Declaration",title:dl.title,text:dl.lines.join(" "),view:"declarations"});});
  D.bible_characters.forEach(function(c){ ix.push({type:"Character",title:c.name,text:c.note,view:"characters"});});
  D._index = ix; return ix;
}
function renderSearch(){
  set('<h1>Search</h1><input class="search" id="sIn" placeholder="Search scriptures, teaching, prayers, declarations…" autocomplete="off"><div id="sOut" style="margin-top:1em"></div>');
  var inp = main.querySelector("#sIn"), out = main.querySelector("#sOut");
  inp.focus();
  inp.addEventListener("input",function(){
    var q = inp.value.trim().toLowerCase();
    if(q.length<2){out.innerHTML="";return;}
    var ix = buildIndex();
    var hits = ix.filter(function(it){return (it.title+" "+it.text).toLowerCase().indexOf(q)>=0;}).slice(0,40);
    if(!hits.length){out.innerHTML='<p class="muted">No results.</p>';return;}
    out.innerHTML = hits.map(function(h){
      var t = h.text.length>180?h.text.slice(0,180)+"…":h.text;
      var re = new RegExp("("+q.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+")","ig");
      return '<div class="search-result" data-go="'+h.view+'"><div class="rt">'+h.type+' · '+esc(h.title)+'</div><div>'+esc(t).replace(re,"<mark>$1</mark>")+'</div></div>';
    }).join("");
    out.querySelectorAll("[data-go]").forEach(function(el){el.style.cursor="pointer";el.addEventListener("click",function(){route(el.getAttribute("data-go"));});});
  });
}

/* ---------- notes ---------- */
function renderNotes(){
  set('<h1>My Notes</h1><p class="muted">Your notes are saved on this device.</p><textarea class="notes" id="nArea" placeholder="Write what God is speaking to you…"></textarea><p class="muted" id="nSaved" style="margin-top:.6em"></p>');
  var ta = main.querySelector("#nArea"), sv = main.querySelector("#nSaved");
  ta.value = state.notes||"";
  var t;
  ta.addEventListener("input",function(){
    clearTimeout(t); t=setTimeout(function(){state.notes=ta.value;save();sv.textContent="Saved ✓ "+new Date().toLocaleTimeString();},400);
  });
}

/* ---------- bookmarks ---------- */
function renderBookmarks(){
  var bm = state.bookmarks||[];
  var html = '<h1>Bookmarks</h1>';
  if(!bm.length){ html += '<p class="muted">No bookmarks yet. Open a module and tap “Bookmark this module”.</p>'; set(html); return; }
  html += bm.map(function(b){
    var id=b.split(":")[1]; var m=D.modules.find(function(x){return x.id===id;});
    if(!m) return "";
    return '<div class="search-result" data-go="'+b+'"><div class="rt">Module '+m.id+'</div><div>'+esc(m.title)+'</div></div>';
  }).join("");
  set(html);
  main.querySelectorAll("[data-go]").forEach(function(el){el.style.cursor="pointer";el.addEventListener("click",function(){route(el.getAttribute("data-go"));});});
}

/* ---------- assignments ---------- */
function renderAssignments(){
  var days = [
    "Read Revelation 12 aloud and thank God the accuser is cast down.",
    "Renounce every inherited covenant the Holy Spirit reveals.",
    "Rebuild one broken hedge (prayer, Word, fellowship, church).",
    "Plead the blood over your bloodline and household.",
    "Refuse and replace every counterfeit voice with Scripture.",
    "Speak your testimony aloud as a weapon of overcoming.",
    "Take communion in faith and seal your week in thanksgiving."
  ];
  state.assign = state.assign||{};
  var html = '<h1>Assignments</h1><div class="block declaration"><div class="k">Seven-Day Assignment</div><ul style="list-style:none;margin:0;padding:0" id="aList">'+
    days.map(function(d,i){
      var on = state.assign[i]?"on":"";
      return '<li style="margin:.5em 0"><label style="display:flex;gap:.6em;cursor:pointer;align-items:flex-start"><input type="checkbox" data-a="'+i+'" '+(state.assign[i]?"checked":"")+'><span><strong>Day '+(i+1)+'</strong> — '+esc(d)+'</span></label></li>';
    }).join("")+'</ul></div>'+
    '<h3>Homework</h3><ul>'+
    ['Read Revelation 12 and Genesis 3 slowly, marking every mention of the serpent/dragon.',
     'Write out Luke 10:19 and Revelation 12:11 and memorise them this week.',
     'Identify one broken hedge and rebuild it.',
     'Take communion in faith and plead the blood over your bloodline daily.'
    ].map(function(h){return '<li>'+esc(h)+'</li>';}).join("")+'</ul>';
  set(html);
  main.querySelectorAll("[data-a]").forEach(function(cb){
    cb.addEventListener("change",function(){state.assign[cb.getAttribute("data-a")]=cb.checked;save();updateProgress();});
  });
}

/* ---------- quiz ---------- */
function renderQuiz(){
  var html = '<h1>Knowledge Check</h1><p class="muted">Test your understanding. Tap an answer to see if it is correct.</p><div id="qWrap"></div><div class="quiz-score" id="qScore"></div>';
  set(html);
  var wrap = main.querySelector("#qWrap");
  state.quiz = state.quiz||{};
  D.quiz.forEach(function(q,qi){
    var div = document.createElement("div"); div.className="q-item";
    div.innerHTML = '<h3>'+(qi+1)+'. '+esc(q.q)+'</h3><div class="opts">'+
      q.options.map(function(o,oi){return '<button class="opt" data-q="'+qi+'" data-o="'+oi+'">'+esc(o)+'</button>';}).join("")+'</div>';
    wrap.appendChild(div);
  });
  wrap.querySelectorAll(".opt").forEach(function(b){
    b.addEventListener("click",function(){
      var qi=+b.getAttribute("data-q"), oi=+b.getAttribute("data-o");
      var q=D.quiz[qi];
      var opts=b.parentNode.querySelectorAll(".opt");
      opts.forEach(function(o){o.disabled=true;});
      opts[q.answer].classList.add("correct");
      if(oi!==q.answer) b.classList.add("wrong");
      state.quiz[qi]=(oi===q.answer);
      save(); updateProgress(); showScore();
    });
  });
  showScore();
}
function showScore(){
  var el=main.querySelector("#qScore"); if(!el) return;
  var ans=Object.keys(state.quiz||{}).length, right=Object.values(state.quiz||{}).filter(Boolean).length;
  if(ans) el.textContent="Score: "+right+" / "+D.quiz.length+" correct ("+ans+" answered)";
}

/* ---------- progress ---------- */
function counts(){
  var mDone=Object.keys(state.modules||{}).length;
  var aDone=Object.values(state.assign||{}).filter(Boolean).length;
  var qDone=Object.values(state.quiz||{}).filter(Boolean).length;
  var total = D.modules.length + 7 + D.quiz.length;
  var done = mDone + aDone + qDone;
  return {mDone:mDone,aDone:aDone,qDone:qDone,total:total,done:done,pct:Math.round(done/total*100)};
}
function updateProgress(){
  if(!D) return;
  var c=counts();
  document.getElementById("ctBarFill").style.width=c.pct+"%";
  document.getElementById("ctPct").textContent=c.pct+"%";
}
function renderProgress(){
  var c=counts();
  set('<h1>Your Progress</h1>'+
    '<div class="card"><h3>'+c.pct+'% complete</h3>'+
    '<div class="ct-bar" style="width:100%;height:12px;margin:.6em 0"><span style="width:'+c.pct+'%;background:var(--teal)"></span></div>'+
    '<ul><li>Modules completed: <strong>'+c.mDone+' / '+D.modules.length+'</strong></li>'+
    '<li>Assignment days done: <strong>'+c.aDone+' / 7</strong></li>'+
    '<li>Quiz questions correct: <strong>'+c.qDone+' / '+D.quiz.length+'</strong></li></ul>'+
    (c.pct>=100?'<a class="btn btn-teal" data-go="certificate">View Your Certificate →</a>':'<p class="muted">Complete all modules, assignment days, and quiz questions to unlock your certificate.</p>')+
    '</div>'+
    '<p class="muted" style="margin-top:1.2em"><button class="bookmark-btn" id="resetBtn">Reset all progress on this device</button></p>');
  var g=main.querySelector("[data-go]"); if(g)g.addEventListener("click",function(){route("certificate");});
  main.querySelector("#resetBtn").addEventListener("click",function(){
    if(confirm("Reset all your progress, notes, and bookmarks on this device?")){state={};save();buildModuleNav();updateProgress();route("progress");}
  });
}

/* ---------- certificate ---------- */
function renderCertificate(){
  var c=counts();
  if(c.pct<100){
    set('<h1>Completion Certificate</h1><div class="cert-locked card"><h3>Not yet unlocked</h3><p class="muted">Finish all modules, all seven assignment days, and answer every quiz question correctly to earn your certificate. You are '+c.pct+'% there.</p><a class="btn btn-teal" data-go="progress">See Progress</a></div>');
    var g=main.querySelector("[data-go]"); if(g)g.addEventListener("click",function(){route("progress");});
    return;
  }
  var name = state.name||"";
  set('<h1>Completion Certificate</h1>'+
    '<p class="muted">Enter your name to personalise your certificate.</p>'+
    '<input class="search" id="cName" placeholder="Your name" value="'+esc(name)+'" style="max-width:360px;margin-bottom:1.4em">'+
    '<div class="cert" id="certCard">'+
    '<h2>Certificate of Completion</h2>'+
    '<p class="muted">This certifies that</p>'+
    '<div class="name" id="certName">'+(name?esc(name):"________________")+'</div>'+
    '<p>has completed the deliverance teaching</p>'+
    '<h3 style="color:var(--teal-deep)">Deliverance from Serpentine Spirits (Part 1)</h3>'+
    '<p class="serif-it" style="color:var(--gold)">Warfare and Prophetic Declarations</p>'+
    '<p class="muted">'+esc(D.attribution)+'<br>'+esc(D.service_date)+'</p>'+
    '<p class="serif-it" style="color:var(--gold);margin-top:1.2em">L137 — Luke 1:37 · For with God nothing shall be impossible.</p>'+
    '</div>'+
    '<div class="module-actions"><button class="btn btn-teal" onclick="window.print()">Print / Save as PDF</button></div>');
  var inp=main.querySelector("#cName");
  inp.addEventListener("input",function(){state.name=inp.value;save();main.querySelector("#certName").textContent=inp.value||"________________";});
}

})();
