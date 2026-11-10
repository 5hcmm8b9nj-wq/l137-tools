const scriptures = [
  {id:"ps95",ref:"Psalm 95:1–6",topic:"Praise and worship",url:"https://www.biblegateway.com/passage/?search=Psalm%2095%3A1-6&version=KJV",text:"O come, let us sing unto the LORD: let us make a joyful noise to the rock of our salvation. Let us come before his presence with thanksgiving, and make a joyful noise unto him with psalms. For the LORD is a great God, and a great King above all gods. In his hand are the deep places of the earth: the strength of the hills is his also. The sea is his, and he made it: and his hands formed the dry land. O come, let us worship and bow down: let us kneel before the LORD our maker."},
  {id:"ps100",ref:"Psalm 100:1–5",topic:"Thanksgiving",url:"https://www.biblegateway.com/passage/?search=Psalm%20100%3A1-5&version=KJV",text:"Make a joyful noise unto the LORD, all ye lands. Serve the LORD with gladness: come before his presence with singing. Know ye that the LORD he is God: it is he that hath made us, and not we ourselves; we are his people, and the sheep of his pasture. Enter into his gates with thanksgiving, and into his courts with praise: be thankful unto him, and bless his name. For the LORD is good; his mercy is everlasting; and his truth endureth to all generations."},
  {id:"rev12",ref:"Revelation 12:10–11",topic:"The blood and testimony",url:"https://www.biblegateway.com/passage/?search=Revelation%2012%3A10-11&version=KJV",text:"And I heard a loud voice saying in heaven, Now is come salvation, and strength, and the kingdom of our God, and the power of his Christ: for the accuser of our brethren is cast down, which accused them before our God day and night. And they overcame him by the blood of the Lamb, and by the word of their testimony; and they loved not their lives unto the death."},
  {id:"john1",ref:"1 John 1:8–9",topic:"Confession and cleansing",url:"https://www.biblegateway.com/passage/?search=1%20John%201%3A8-9&version=KJV",text:"If we say that we have no sin, we deceive ourselves, and the truth is not in us. If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness."},
  {id:"num23",ref:"Numbers 23:23–24",topic:"Victory over enchantment",url:"https://www.biblegateway.com/passage/?search=Numbers%2023%3A23-24&version=KJV",text:"Surely there is no enchantment against Jacob, neither is there any divination against Israel: according to this time it shall be said of Jacob and of Israel, What hath God wrought! Behold, the people shall rise up as a great lion, and lift up himself as a young lion: he shall not lie down until he eat of the prey, and drink the blood of the slain."},
  {id:"deut18",ref:"Deuteronomy 18:10–12",topic:"God’s prohibition",url:"https://www.biblegateway.com/passage/?search=Deuteronomy%2018%3A10-12&version=KJV",text:"There shall not be found among you any one that maketh his son or his daughter to pass through the fire, or that useth divination, or an observer of times, or an enchanter, or a witch. Or a charmer, or a consulter with familiar spirits, or a wizard, or a necromancer. For all that do these things are an abomination unto the LORD: and because of these abominations the LORD thy God doth drive them out from before thee."},
  {id:"acts8",ref:"Acts 8:9–11",topic:"Bewitchment and influence",url:"https://www.biblegateway.com/passage/?search=Acts%208%3A9-11&version=KJV",text:"But there was a certain man, called Simon, which beforetime in the same city used sorcery, and bewitched the people of Samaria, giving out that himself was some great one: To whom they all gave heed, from the least to the greatest, saying, This man is the great power of God. And to him they had regard, because that of long time he had bewitched them with sorceries."},
  {id:"cor4",ref:"2 Corinthians 4:4",topic:"Spiritual blindness",url:"https://www.biblegateway.com/passage/?search=2%20Corinthians%204%3A4&version=KJV",text:"In whom the god of this world hath blinded the minds of them which believe not, lest the light of the glorious gospel of Christ, who is the image of God, should shine unto them."},
  {id:"job5",ref:"Job 5:12",topic:"God frustrates evil devices",url:"https://www.biblegateway.com/passage/?search=Job%205%3A12&version=KJV",text:"He disappointeth the devices of the crafty, so that their hands cannot perform their enterprise."},
  {id:"ps107",ref:"Psalm 107:20",topic:"Healing and deliverance",url:"https://www.biblegateway.com/passage/?search=Psalm%20107%3A20&version=KJV",text:"He sent his word, and healed them, and delivered them from their destructions."},
  {id:"james5",ref:"James 5:14–15",topic:"Prayer of faith",url:"https://www.biblegateway.com/passage/?search=James%205%3A14-15&version=KJV",text:"Is any sick among you? let him call for the elders of the church; and let them pray over him, anointing him with oil in the name of the Lord: And the prayer of faith shall save the sick, and the Lord shall raise him up; and if he have committed sins, they shall be forgiven him."},
  {id:"john8",ref:"John 8:36",topic:"Freedom in Christ",url:"https://www.biblegateway.com/passage/?search=John%208%3A36&version=KJV",text:"If the Son therefore shall make you free, ye shall be free indeed."},
  {id:"num6",ref:"Numbers 6:24–26",topic:"Blessing and sealing",url:"https://www.biblegateway.com/passage/?search=Numbers%206%3A24-26&version=KJV",text:"The LORD bless thee, and keep thee: The LORD make his face shine upon thee, and be gracious unto thee: The LORD lift up his countenance upon thee, and give thee peace."}
];

const prayers = [
  {id:"p1",title:"Opening prayer",text:"Father, in the name of Jesus, we thank You. We give You all the glory. We exalt Your name for this encounter. We commit this meeting into Your hands. We pray for the leadership and power of the Holy Ghost, for healing, deliverance, restoration, open doors, breakthroughs, and testimonies, in the mighty name of Jesus."},
  {id:"p2",title:"Confession prayer",text:"Father, we plead the blood of Jesus. Forgive us our sins. Let the blood of Jesus wash and cleanse us from all unrighteousness. Let the blood silence the voice of the accuser, in the name of Jesus."},
  {id:"p3",title:"Prayer for the mind",text:"Father, let the eyes of my understanding be enlightened. Let the light of the glorious gospel of Christ shine. I command the peace of God to fill my heart and my mind, in the name of Jesus Christ."},
  {id:"p4",title:"Prayer against crafty devices",text:"Father, disappoint the devices of the crafty so that their hands cannot perform their enterprise. Frustrate every evil scheme and bring me into the freedom of Jesus Christ."},
  {id:"p5",title:"Prayer of restoration",text:"Father, restore lost opportunities, strength, joy, and every blessing that belongs to me according to Your will. Let there be divine protection and covering through the blood of Jesus."},
  {id:"p6",title:"Sealing prayer",text:"Thank You, Lord Jesus Christ, for deliverance. We seal this deliverance by the blood of Jesus. Let the blood of Jesus speak, cover, protect, and preserve us. Help us walk in freedom, truth, and obedience, in Jesus’ name."}
];

const declarations = [
  {id:"d1",text:"Let every problem in my life that originated from witchcraft receive divine instant solution in the name of Jesus."},
  {id:"d2",text:"I command all the damages done to my life by witchcraft: let every blessing be released now, in the name of Jesus."},
  {id:"d3",text:"I command the peace of God to fill my heart and my mind, in the name of Jesus Christ."},
  {id:"d4",text:"I am no more under bondage of witchcraft, in the name of Jesus."},
  {id:"d5",text:"I loose myself from every power of witchcraft in the name of Jesus."},
  {id:"d6",text:"I break and loose myself from all evil curses, spells, and bewitchment, in the name of Jesus."},
  {id:"d7",text:"I retrieve my blessings out of the hands of household witchcraft, in the name of Jesus."},
  {id:"d8",text:"Any of my blessings traded out by household witches, be returned to me in the name of Jesus."},
  {id:"d9",text:"I break myself from every bondage of witchcraft covenant. I break, I break, I break, in the name of Jesus."},
  {id:"d10",text:"I loose my hands and my feet from any witchcraft, bewitchment, and bondage."},
  {id:"d11",text:"I declare, I am delivered in the name of Jesus Christ."},
  {id:"d12",text:"I declare an end to that torment. I declare an end to that battle. I declare an end to that evil."},
  {id:"d13",text:"I am blessed. I am delivered."}
];

const modules = [
  {
    title:"Enter His presence", subtitle:"Praise, thanksgiving, confession, forgiveness, and the Holy Spirit", scriptures:["ps95","ps100","john1"],
    intro:"Spiritual warfare does not begin with fear or fascination with darkness. The service begins by turning to God in worship, remembering His goodness, confessing sin, forgiving others, and depending on the Holy Spirit.",
    levels:{
      Simple:"Begin with God. Praise Him, thank Him, tell Him the truth about your sins, forgive others, and ask the Holy Spirit to help you.",
      Teen:"Preparation changes your focus. Instead of starting with fear, you begin with who God is and make sure your own heart is open, honest, and forgiving.",
      Adult:"The opening flow establishes dependence on God rather than self-confidence. Praise and thanksgiving orient the believer toward God’s character; confession receives cleansing; forgiveness removes bitterness; and prayer welcomes the Holy Spirit’s leadership.",
      Deeper:"Psalm 95 joins joyful praise with humble bowing. Psalm 100 grounds thanksgiving in God’s identity as Creator and Shepherd. First John 1:8–9 rejects self-deception and places cleansing in God’s faithfulness and justice."
    },
    key:"Preparation is not a formality. It brings the heart under God’s truth before the believer confronts spiritual opposition.",
    activity:{type:"order",prompt:"Put the opening preparation steps in the ministry’s correct order.",items:["Praise and worship","Thanksgiving","Confession of sins","Forgive others","Invite the Holy Spirit"]},
    flash:{front:"What should come before teaching and deliverance prayer?",back:"Praise and worship, thanksgiving, confession of sins, forgiving others, and inviting the Holy Spirit."},
    quiz:{type:"mc",prompt:"Which response best reflects the opening flow?",options:["Start by naming every enemy","Begin with praise, repentance, forgiveness, and dependence on the Holy Spirit","Skip directly to declarations"],answer:1,explain:"The service’s flow prepares the heart before teaching and deliverance prayer."},
    prayer:"Father, I come before You with thanksgiving. Forgive my sins and cleanse me from all unrighteousness. I choose to forgive those who have offended me. Holy Spirit, lead me in truth and prayer, in Jesus’ name.",
    declaration:"I enter His gates with thanksgiving, and into His courts with praise.",
    recall:"Name the five preparation movements before teaching."
  },
  {
    title:"Recognize bewitchment", subtitle:"Biblical warnings about sorcery, deception, and spiritual blindness", scriptures:["deut18","acts8","cor4"],
    intro:"The teaching describes bewitchment as spiritual deception and manipulation that can mislead minds and draw people away from truth. Scripture condemns sorcery and shows how influence can hold a community’s attention.",
    levels:{
      Simple:"Bewitchment tries to deceive and control. God tells His people not to practice witchcraft. We stay close to Jesus and His truth.",
      Teen:"Not every problem should be blamed on witchcraft, but Scripture does warn about deception, sorcery, and minds being blinded. Test influences by God’s Word and do not imitate forbidden practices.",
      Adult:"Deuteronomy 18 prohibits divination, enchantment, witchcraft, familiar spirits, and necromancy. Acts 8 portrays sorcery as sustained social influence. Second Corinthians 4:4 identifies spiritual blindness that resists the gospel’s light.",
      Deeper:"The texts distinguish the believer’s response from occult imitation. The Christian does not counter forbidden power with another forbidden power; the response is the gospel of Christ, repentance, prayer, truth, and the authority of Jesus."
    },
    key:"Discernment is not panic. It recognizes deception while remaining anchored in the light of Christ’s gospel.",
    activity:{type:"match",prompt:"Match each passage to its main emphasis.",pairs:[["Deuteronomy 18","God forbids occult practices"],["Acts 8","Sorcery bewitched a community"],["2 Corinthians 4","The gospel’s light answers spiritual blindness"]]},
    flash:{front:"What is the Christian answer to spiritual blindness?",back:"The light of the glorious gospel of Christ, together with truth, prayer, repentance, and faithful obedience."},
    quiz:{type:"tf",prompt:"True or false: Christians should imitate occult practices in order to defeat them.",answer:false,explain:"False. Deuteronomy 18 forbids these practices. The believer stands in Christ and His truth."},
    prayer:"Lord Jesus, keep me from deception. Let the light of Your glorious gospel shine in my mind. Give me discernment without fear and obedience without compromise.",
    declaration:"My mind belongs to Jesus Christ. The light of the glorious gospel of Christ shines in me.",
    recall:"What three forms of danger appear in Deuteronomy 18, Acts 8, and 2 Corinthians 4?"
  },
  {
    title:"Stand in Christ’s victory", subtitle:"The blood of the Lamb, testimony, Scripture, and God’s power", scriptures:["rev12","num23","job5"],
    intro:"The center of victory is not the believer’s strength. Revelation points to the blood of the Lamb and the word of testimony. Numbers declares that enchantment cannot overturn God’s purpose, and Job declares that God frustrates crafty devices.",
    levels:{
      Simple:"Jesus gives victory. Trust His blood, speak God’s truth, and remember that God can stop evil plans.",
      Teen:"Your confidence is not in loudness, objects, or fear. It is in what Jesus has done, what God has said, and faithful testimony.",
      Adult:"Revelation 12:11 locates overcoming in the blood of the Lamb and testimony. Numbers 23:23 rejects the power of enchantment to overturn God’s covenant purpose. Job 5:12 emphasizes God’s action against crafty schemes.",
      Deeper:"These passages establish a God-centered theology of victory: Christ’s atoning work is decisive, testimony bears witness, covenant purpose is not controlled by divination, and God actively frustrates malicious designs."
    },
    key:"The believer’s confidence rests in Jesus Christ and God’s Word, not in fear, superstition, or self-powered striving.",
    activity:{type:"scenario",prompt:"A believer becomes consumed with fear after a disturbing dream. Which response best follows this lesson?",options:["Search for an occult counter-ritual","Panic and accuse someone","Return to Scripture, pray in Christ’s authority, seek wise pastoral help, and refuse fear"],answer:2},
    flash:{front:"According to Revelation 12:11, how did they overcome?",back:"By the blood of the Lamb, and by the word of their testimony."},
    quiz:{type:"fill",prompt:"Complete Job 5:12: “He disappointeth the devices of the _____.”",answer:"crafty",explain:"God is able to frustrate plans so that evil hands cannot perform their enterprise."},
    prayer:"Father, thank You for the blood of the Lamb. Disappoint every device of the crafty. Let Your Word govern my thoughts, speech, and actions. I stand in the victory of Jesus Christ.",
    declaration:"I declare an end to that torment. I declare an end to that battle. I declare an end to that evil.",
    recall:"Name the three anchors of victory emphasized in Revelation 12, Numbers 23, and Job 5."
  },
  {
    title:"Pray for freedom and restoration", subtitle:"Corporate prayer, renewed thinking, healing, and restoration", scriptures:["ps107","john8","james5"],
    intro:"The service moves from teaching into corporate prayer for freedom, peace of mind, healing, restoration, and recovered blessing. Jesus is the One who makes free, and prayer remains in His name.",
    levels:{
      Simple:"Jesus makes people free. Ask Him for help, keep using His Word, and ask trusted church leaders to pray with you.",
      Teen:"Prayer and practical wisdom belong together. Seek Christ, talk with trusted leaders, and get qualified medical help when health or safety is involved.",
      Adult:"John 8:36 grounds freedom in the Son. Psalm 107:20 emphasizes God’s sent Word in healing and deliverance. James 5:14–15 places anointing with oil within prayer by church elders and explicitly says it is done in the name of the Lord.",
      Deeper:"Physical elements never operate independently of Christ. James locates the act within ecclesial prayer, the name of the Lord, and the prayer of faith. The object is not the source of power."
    },
    key:"Freedom and restoration are sought through Jesus, Scripture, prayer, Christian community, and responsible care, never through superstition.",
    activity:{type:"check",prompt:"Choose the Christ-centered responses that belong in ongoing care.",items:[["Read and meditate on Scripture",true],["Seek trusted pastoral prayer",true],["Treat an object as the source of power",false],["Use qualified medical care when needed",true],["Practice forgiveness and wise boundaries",true]]},
    flash:{front:"Who makes the believer free indeed?",back:"The Son, Jesus Christ. John 8:36."},
    quiz:{type:"mc",prompt:"How does James 5 frame anointing with oil?",options:["As an independent magical power","As prayer by church elders in the name of the Lord","As a private occult technique"],answer:1,explain:"The passage locates anointing within prayer, church leadership, faith, and the name of the Lord."},
    prayer:"Lord Jesus, send Your Word and bring healing and deliverance. Fill my heart and mind with Your peace. Restore what accords with Your will, and guide me to wise pastoral and medical care where needed.",
    declaration:"I declare, I am delivered in the name of Jesus Christ.",
    recall:"What four supports for ongoing care were named in this lesson?"
  },
  {
    title:"Seal and maintain freedom", subtitle:"Thanksgiving, covering, blessing, Scripture, and faithful continuation", scriptures:["num6","rev12","john8"],
    intro:"The service closes by thanking God, sealing deliverance by the blood of Jesus, blessing the people, and urging them to continue in faith. Maintenance is an ongoing walk of truth, gratitude, fellowship, forgiveness, and obedience.",
    levels:{
      Simple:"Thank God, keep reading the Bible, keep praying, forgive people, and stay close to believers who follow Jesus.",
      Teen:"A strong finish becomes a daily pattern. Keep your mind in Scripture, refuse fear, stay connected to healthy Christian community, and ask for help when you need it.",
      Adult:"Sealing emphasizes thanksgiving and continued dependence on Christ rather than repeated anxiety. Numbers 6:24–26 places protection, grace, and peace in the Lord’s blessing. John 8:36 keeps freedom centered in the Son.",
      Deeper:"The closing blessing is covenantal and relational: the Lord blesses, keeps, shines, shows grace, lifts His countenance, and gives peace. Maintenance is participation in faithful discipleship, not hypervigilance."
    },
    key:"Do not turn deliverance into constant fear. Walk forward in the Son’s freedom through ordinary, faithful Christian discipleship.",
    activity:{type:"plan",prompt:"Build your seven-day maintenance plan by selecting at least four practices.",items:["Thanksgiving","Full KJV Scripture reading","Prayer aloud","Forgiveness check","Christian fellowship","Wise pastoral support","Rest and responsible health care"]},
    flash:{front:"What is the closing posture after deliverance prayer?",back:"Thanksgiving, covering by the blood of Jesus, blessing, peace, and continued faithful discipleship."},
    quiz:{type:"free",prompt:"In one or two sentences, describe how you will replace fear with faithful discipleship.",explain:"A strong answer names practical habits such as Scripture, prayer, gratitude, forgiveness, fellowship, wise boundaries, and appropriate care."},
    prayer:"Father, thank You for freedom in Jesus Christ. Bless me and keep me. Make Your face shine upon me and give me peace. Let the blood of Jesus cover me, and help me continue in truth and obedience.",
    declaration:"I am blessed. I am delivered.",
    recall:"Name four practices that help maintain freedom without returning to fear."
  }
];

const memory = {};
let storageOK = false;
try {
  const k="l137-test"; localStorage.setItem(k,"1"); localStorage.removeItem(k); storageOK=true;
} catch(e) { storageOK=false; }
const store = {
  get(key,fallback){try{return storageOK ? JSON.parse(localStorage.getItem(key)) ?? fallback : (memory[key] ?? fallback)}catch(e){return fallback}},
  set(key,value){if(storageOK){try{localStorage.setItem(key,JSON.stringify(value));return}catch(e){storageOK=false}}memory[key]=value}
};

let state = store.get("l137CourseState",{completed:[],bookmarks:[],notes:{},assignments:[],finalQuiz:false});
let currentModule=0, currentLibrary="scriptures", searchTerm="";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const byId=id=>document.getElementById(id);
const getScripture=id=>scriptures.find(s=>s.id===id);

function save(){store.set("l137CourseState",state);updateProgress()}
function progress(){
  const modulePart=(state.completed.length/modules.length)*70;
  const assignmentPart=(state.assignments.length/7)*15;
  const quizPart=state.finalQuiz?15:0;
  return Math.round(modulePart+assignmentPart+quizPart);
}
function updateProgress(){
  const p=progress();
  byId("progressFill").style.width=p+"%"; byId("drawerBar").style.width=p+"%";
  ["drawerPercent","heroProgress","completionPercent"].forEach(id=>{const el=byId(id);if(el)el.textContent=p+"%"});
  if(byId("railProgress"))byId("railProgress").textContent=p+"% complete";
  const ring=byId("completionRing"); if(ring)ring.style.background=`conic-gradient(var(--green) ${p}%,rgba(79,122,46,.14) ${p}%)`;
  const unlocked=state.completed.length===modules.length&&state.assignments.length===7&&state.finalQuiz;
  const cert=byId("certificateButton");
  if(cert){cert.disabled=!unlocked;cert.textContent=unlocked?"Open my certificate":"Certificate locked"}
  if(byId("completionMessage"))byId("completionMessage").textContent=unlocked?"You completed the study. Your certificate is ready.":"Complete all five lessons, the weekly assignment, and the final quiz to unlock your certificate.";
}

function route(name,moduleIndex){
  $$(".view").forEach(v=>v.classList.remove("active"));
  const view=byId(name+"View"); if(!view)return;
  view.classList.add("active");
  $$("nav button").forEach(b=>b.classList.toggle("active",b.dataset.route===name));
  closeDrawer();
  if(name==="course"){if(moduleIndex!==undefined)currentModule=Number(moduleIndex);renderModule()}
  if(name==="library")renderLibrary();
  if(name==="review")renderReview();
  window.scrollTo({top:0,behavior:"auto"});
}

function openDrawer(){byId("drawer").classList.add("open");byId("drawer").setAttribute("aria-hidden","false");byId("scrim").hidden=false;byId("menuButton").setAttribute("aria-expanded","true")}
function closeDrawer(){byId("drawer").classList.remove("open");byId("drawer").setAttribute("aria-hidden","true");byId("scrim").hidden=true;byId("menuButton").setAttribute("aria-expanded","false")}

function moduleNav(){
  const html=modules.map((m,i)=>`<button class="rail-link ${i===currentModule?"active":""}" data-module-nav="${i}"><span>${String(i+1).padStart(2,"0")}</span><b>${m.title}${state.completed.includes(i)?" ✓":""}</b></button>`).join("");
  byId("moduleNav").innerHTML=html;
  byId("drawerLinks").innerHTML=`<button data-route="home">Course home</button>`+modules.map((m,i)=>`<button data-route="course" data-module="${i}">Lesson ${i+1}: ${m.title}${state.completed.includes(i)?" ✓":""}</button>`).join("")+`<button data-route="library">Study libraries</button><button data-route="review">Final review</button>`;
  $$("[data-module-nav]").forEach(b=>b.onclick=()=>{currentModule=Number(b.dataset.moduleNav);renderModule();window.scrollTo(0,0)});
  $$("#drawerLinks [data-route]").forEach(b=>b.onclick=()=>route(b.dataset.route,b.dataset.module));
}

function renderScriptureCard(s){
  return `<div class="scripture-card" id="scripture-${s.id}">
    <p class="label">${s.topic}</p><blockquote>${s.text}</blockquote><cite>${s.ref} · King James Version</cite>
    <div class="scripture-actions"><button class="listen-button dark" data-speak="#scripture-${s.id} blockquote">Listen</button><a href="${s.url}" target="_blank" rel="noopener">Verify passage</a></div>
  </div>`;
}
function renderActivity(a,idx){
  if(a.type==="order") return `<div class="activity-card"><p class="label">PUT IN ORDER</p><h3>${a.prompt}</h3><div class="sort-list" data-order>${[...a.items].reverse().map((x,i)=>`<div class="sort-item"><span>${x}</span><span class="sort-controls"><button aria-label="Move ${x} up" data-move="up">↑</button><button aria-label="Move ${x} down" data-move="down">↓</button></span></div>`).join("")}</div><button class="small-button" data-check-order="${idx}">Check order</button><div class="feedback"></div></div>`;
  if(a.type==="match") return `<div class="activity-card"><p class="label">MATCHING</p><h3>${a.prompt}</h3>${a.pairs.map((p,i)=>`<label class="journal-label">${p[0]}<select data-match="${i}"><option value="">Choose an emphasis</option>${a.pairs.map(q=>`<option>${q[1]}</option>`).join("")}</select></label>`).join("")}<button class="small-button" data-check-match="${idx}">Check matches</button><div class="feedback"></div></div>`;
  if(a.type==="scenario") return `<div class="activity-card"><p class="label">WHAT WOULD YOU DO?</p><h3>${a.prompt}</h3><div class="question-options">${a.options.map((o,i)=>`<button class="option" data-scenario="${i}">${o}</button>`).join("")}</div><div class="feedback">The Scripture-led response refuses occult imitation and panic. It returns to Christ, truth, prayer, and wise Christian care.</div></div>`;
  if(a.type==="check") return `<div class="activity-card"><p class="label">CHOOSE WISE RESPONSES</p><h3>${a.prompt}</h3><div class="checklist">${a.items.map((x,i)=>`<label class="check-item"><input type="checkbox" data-care="${i}"><span>${x[0]}</span></label>`).join("")}</div><button class="small-button" data-check-care="${idx}">Check choices</button><div class="feedback"></div></div>`;
  return `<div class="activity-card"><p class="label">BUILD A PLAN</p><h3>${a.prompt}</h3><div class="checklist">${a.items.map((x,i)=>`<label class="check-item"><input type="checkbox" data-plan="${i}"><span>${x}</span></label>`).join("")}</div><div class="feedback">Choose at least four realistic practices you can continue this week.</div></div>`;
}
function renderQuiz(q,idx){
  if(q.type==="mc")return `<div class="quiz-card"><p class="label">KNOWLEDGE CHECK</p><h3>${q.prompt}</h3><div class="question-options">${q.options.map((o,i)=>`<button class="option" data-mcq="${i}">${o}</button>`).join("")}</div><div class="feedback">${q.explain}</div></div>`;
  if(q.type==="tf")return `<div class="quiz-card"><p class="label">TRUE OR FALSE</p><h3>${q.prompt}</h3><div class="question-options"><button class="option" data-tf="true">True</button><button class="option" data-tf="false">False</button></div><div class="feedback">${q.explain}</div></div>`;
  if(q.type==="fill")return `<div class="quiz-card"><p class="label">FILL IN THE BLANK</p><h3>${q.prompt}</h3><div class="quiz-input"><label class="sr-only" for="fill-${idx}">Your answer</label><input id="fill-${idx}" data-fill placeholder="Type your answer"><button class="small-button" data-check-fill>Check</button></div><div class="feedback">${q.explain}</div></div>`;
  return `<div class="quiz-card"><p class="label">FREE RESPONSE</p><h3>${q.prompt}</h3><textarea data-free placeholder="Write before revealing the guidance..."></textarea><button class="small-button" data-reveal-free>Reveal guidance</button><div class="feedback">${q.explain}</div></div>`;
}

function renderModule(){
  moduleNav(); const m=modules[currentModule]; const bookmarked=state.bookmarks.includes(currentModule); const done=state.completed.includes(currentModule);
  byId("moduleContent").innerHTML=`
    <div class="module-kicker"><span>LESSON ${currentModule+1} OF ${modules.length}</span><button class="bookmark-button ${bookmarked?"saved":""}" data-bookmark>${bookmarked?"Saved to bookmarks":"Save lesson"}</button></div>
    <h1>${m.title}</h1><p class="module-intro">${m.subtitle}. ${m.intro}</p>
    <div class="button-row"><button class="listen-button dark" data-speak=".module-intro">Listen to overview</button></div>
    <section class="module-section"><p class="label">READ IT · HEAR IT</p><h2>Scripture foundation</h2>${m.scriptures.map(id=>renderScriptureCard(getScripture(id))).join("")}</section>
    <section class="module-section"><p class="label">UNDERSTAND IT</p><h2>Choose your learning level</h2><div class="levels"><div class="level-tabs">${Object.keys(m.levels).map(k=>`<button data-level="${k}" class="${k==="Adult"?"active":""}">${k}</button>`).join("")}</div><div class="level-panel">${m.levels.Adult}</div></div></section>
    <section class="module-section"><p class="label">SEE IT</p><h2>A visual truth path</h2><div class="concept-map"><div class="concept-node"><small>Pressure or deception</small><strong>Recognize</strong></div><div class="concept-arrow">→</div><div class="concept-node"><small>Scripture and Christ</small><strong>Respond</strong></div></div><div class="teaching-card"><p class="label">KEY POINT</p><p>${m.key}</p></div></section>
    <section class="module-section"><p class="label">INTERACT WITH IT</p><h2>Practice the lesson</h2>${renderActivity(m.activity,currentModule)}</section>
    <section class="module-section"><p class="label">REMEMBER IT</p><h2>Turn the flashcard</h2><div class="flip-card" tabindex="0" role="button" aria-label="Reveal flashcard answer"><div class="flip-inner"><div class="flip-face">${m.flash.front}<small>Tap to reveal</small></div><div class="flip-face flip-back">${m.flash.back}</div></div></div></section>
    <section class="module-section"><p class="label">TEST IT</p><h2>Knowledge check</h2>${renderQuiz(m.quiz,currentModule)}</section>
    <section class="module-section"><div class="prayer-card"><p class="label">PRAY ALOUD</p><p id="modulePrayer">${m.prayer}</p><button class="listen-button dark" data-speak="#modulePrayer">Listen and pray</button></div><div class="declaration-card"><p class="label">REPEAT AFTER ME</p><p id="moduleDeclaration">“${m.declaration}”</p><button class="listen-button dark" data-speak="#moduleDeclaration">Listen and declare</button></div></section>
    <section class="module-section"><div class="notes-card"><p class="label">PAUSE AND REFLECT</p><label class="journal-label" for="moduleNote">What is the Lord bringing to your attention?</label><textarea id="moduleNote" data-note="module-${currentModule}" placeholder="Write a private note...">${state.notes["module-"+currentModule]||""}</textarea><p class="label" style="margin-top:1rem">QUICK RECALL</p><p>${m.recall}</p></div></section>
    <div class="module-footer"><button class="button secondary" data-prev ${currentModule===0?"disabled":""}>Previous lesson</button><button class="button primary complete-button ${done?"done":""}" data-complete>${done?"Lesson complete ✓":"Mark lesson complete"}</button><button class="button secondary" data-next>${currentModule===modules.length-1?"Final review":"Next lesson"}</button></div>`;
  bindDynamic(); byId("moduleContent").focus({preventScroll:true}); updateProgress();
}

function bindSpeech(){
  $$("[data-speak]").forEach(btn=>btn.onclick=()=>{
    if(!("speechSynthesis" in window)){btn.textContent="Audio is not supported in this browser";return}
    if(speechSynthesis.speaking){speechSynthesis.cancel();$$(".speaking").forEach(x=>x.classList.remove("speaking"));return}
    const text=btn.dataset.speak.split(",").map(sel=>$(sel)?.innerText||"").join(". ");
    const utter=new SpeechSynthesisUtterance(text);utter.rate=.9;utter.onend=()=>btn.classList.remove("speaking");btn.classList.add("speaking");speechSynthesis.speak(utter);
  });
}
function bindDynamic(){
  bindSpeech();
  $$("[data-level]").forEach(b=>b.onclick=()=>{const m=modules[currentModule];$$("[data-level]").forEach(x=>x.classList.remove("active"));b.classList.add("active");$(".level-panel").textContent=m.levels[b.dataset.level]});
  const flip=$(".flip-card"); if(flip){const toggle=()=>flip.classList.toggle("flipped");flip.onclick=toggle;flip.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();toggle()}}}
  $("[data-bookmark]").onclick=()=>{const i=state.bookmarks.indexOf(currentModule);if(i>=0)state.bookmarks.splice(i,1);else state.bookmarks.push(currentModule);save();renderModule()};
  $$("[data-move]").forEach(b=>b.onclick=()=>{const item=b.closest(".sort-item"),list=item.parentElement;if(b.dataset.move==="up"&&item.previousElementSibling)list.insertBefore(item,item.previousElementSibling);if(b.dataset.move==="down"&&item.nextElementSibling)list.insertBefore(item.nextElementSibling,item)});
  const orderBtn=$("[data-check-order]");if(orderBtn)orderBtn.onclick=()=>{const got=$$("[data-order] .sort-item span:first-child").map(x=>x.textContent),ok=got.join("|")===modules[currentModule].activity.items.join("|"),f=orderBtn.nextElementSibling;f.textContent=ok?"Correct. The preparation follows the ministry’s required flow.":"Not yet. Begin with praise and worship, then thanksgiving, confession, forgiveness, and inviting the Holy Spirit.";f.classList.add("show")};
  const matchBtn=$("[data-check-match]");if(matchBtn)matchBtn.onclick=()=>{const a=modules[currentModule].activity.pairs,ok=$$("[data-match]").every((x,i)=>x.value===a[i][1]),f=matchBtn.nextElementSibling;f.textContent=ok?"All three matches are correct.":"Review the passages and try again. Each emphasis appears directly in its passage.";f.classList.add("show")};
  $$("[data-scenario]").forEach(b=>b.onclick=()=>{const answer=modules[currentModule].activity.answer;$$("[data-scenario]").forEach(x=>x.classList.remove("correct","incorrect"));b.classList.add(Number(b.dataset.scenario)===answer?"correct":"incorrect");$(".activity-card .feedback").classList.add("show")});
  const careBtn=$("[data-check-care]");if(careBtn)careBtn.onclick=()=>{const a=modules[currentModule].activity.items,ok=$$("[data-care]").every((x,i)=>x.checked===a[i][1]),f=careBtn.nextElementSibling;f.textContent=ok?"Correct. These choices keep care Christ-centered, communal, and responsible.":"Review your choices. An object must never be treated as the source of power.";f.classList.add("show")};
  $$("[data-plan]").forEach(x=>x.onchange=()=>{const f=$(".activity-card .feedback");f.classList.toggle("show",$$("[data-plan]:checked").length>=4)});
  $$("[data-mcq]").forEach(b=>b.onclick=()=>answerChoice(b,"mcq",modules[currentModule].quiz.answer));
  $$("[data-tf]").forEach(b=>b.onclick=()=>answerChoice(b,"tf",String(modules[currentModule].quiz.answer)));
  const fill=$("[data-check-fill]");if(fill)fill.onclick=()=>{const input=$("[data-fill]"),ok=input.value.trim().toLowerCase()===modules[currentModule].quiz.answer,inputF=fill.parentElement.nextElementSibling;input.style.borderColor=ok?"var(--green)":"var(--ember)";inputF.classList.add("show")};
  const free=$("[data-reveal-free]");if(free)free.onclick=()=>{if($("[data-free]").value.trim().length<5){$("[data-free]").focus();return}free.nextElementSibling.classList.add("show")};
  $$("[data-note]").forEach(t=>t.oninput=()=>{state.notes[t.dataset.note]=t.value;save()});
  $("[data-complete]").onclick=()=>{if(!state.completed.includes(currentModule))state.completed.push(currentModule);save();renderModule()};
  $("[data-prev]").onclick=()=>{if(currentModule>0){currentModule--;renderModule();window.scrollTo(0,0)}};
  $("[data-next]").onclick=()=>{if(currentModule<modules.length-1){currentModule++;renderModule();window.scrollTo(0,0)}else route("review")};
}
function answerChoice(button,type,answer){
  $$(`[data-${type}]`).forEach(x=>x.classList.remove("correct","incorrect"));
  const ok=button.dataset[type]==answer;button.classList.add(ok?"correct":"incorrect");
  button.closest(".quiz-card").querySelector(".feedback").classList.add("show");
}

function libraryData(){
  if(currentLibrary==="scriptures")return scriptures.map(s=>({title:s.ref,text:s.text,meta:s.topic,url:s.url}));
  if(currentLibrary==="prayers")return prayers.map(p=>({title:p.title,text:p.text,meta:"Corporate prayer"}));
  if(currentLibrary==="declarations")return declarations.map(d=>({title:"Repeat after me",text:d.text,meta:"Preserved public declaration"}));
  if(currentLibrary==="bookmarks")return state.bookmarks.map(i=>({title:`Lesson ${i+1}: ${modules[i].title}`,text:modules[i].key,meta:"Saved lesson",module:i}));
  return Object.entries(state.notes).filter(([,v])=>v.trim()).map(([k,v])=>({title:k.startsWith("module-")?`Lesson ${Number(k.split("-")[1])+1} note`:k==="assignment"?"Assignment reflection":"Final reflection",text:v,meta:"Private note on this device"}));
}
function renderLibrary(){
  const data=libraryData().filter(x=>(x.title+" "+x.text+" "+x.meta).toLowerCase().includes(searchTerm.toLowerCase()));
  byId("searchCount").textContent=`${data.length} ${data.length===1?"result":"results"}`;
  $$(".tabs [data-library]").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.library===currentLibrary)));
  byId("libraryContent").innerHTML=data.length?data.map((x,i)=>`<article class="library-card"><h3>${x.title}</h3><blockquote>${x.text}</blockquote><p class="meta">${x.meta}</p><div class="scripture-actions"><button class="listen-button dark" data-speak="#library-item-${i}">Listen</button>${x.url?`<a href="${x.url}" target="_blank" rel="noopener">Verify passage</a>`:""}${x.module!==undefined?`<button class="text-button" data-route="course" data-module="${x.module}">Open lesson</button>`:""}</div><span id="library-item-${i}" hidden>${x.title}. ${x.text}</span></article>`).join(""):`<div class="empty"><h3>Nothing here yet</h3><p>${currentLibrary==="bookmarks"?"Save a lesson and it will appear here.":currentLibrary==="notes"?"Write a reflection in any lesson and it will appear here.":"Try a different search word."}</p></div>`;
  bindSpeech();bindRoutes();
}

const assignmentItems=[
  "Read Psalm 95:1–6 aloud and begin with worship.",
  "Read Psalm 100:1–5 and write three reasons to thank God.",
  "Pray through 1 John 1:8–9 and practice forgiveness.",
  "Read Deuteronomy 18:10–12 and reaffirm your separation from occult practices.",
  "Read Revelation 12:10–11 and thank Jesus for the blood of the Lamb.",
  "Read Job 5:12 and pray against crafty devices without naming or accusing people.",
  "Read Numbers 6:24–26 and close the week with blessing and peace."
];
const finalQuestions=[
  {q:"What comes first in the ministry’s prayer flow?",o:["Deliverance declarations","Praise and worship","Searching for an enemy"],a:1,e:"Praise and worship comes first."},
  {q:"According to Revelation 12:11, what two anchors are named for overcoming?",o:["Objects and rituals","The blood of the Lamb and the word of testimony","Fear and accusation"],a:1,e:"The passage names the blood of the Lamb and the word of testimony."},
  {q:"What should a physical element never become?",o:["A reminder used in prayer","The independent source of spiritual power","Something used in the name of the Lord"],a:1,e:"Power belongs to God. The believer’s faith is in Jesus Christ."},
  {q:"Which response best maintains freedom?",o:["Constant fear","Scripture, prayer, forgiveness, fellowship, and wise care","Isolation and accusation"],a:1,e:"Ongoing discipleship replaces fear-driven hypervigilance."}
];
const recallQuestions=[
  ["Recite the central phrase of Numbers 23:23.","“Surely there is no enchantment against Jacob, neither is there any divination against Israel.”"],
  ["What does Job 5:12 say God does?","He disappointeth the devices of the crafty, so that their hands cannot perform their enterprise."],
  ["Who makes the believer free indeed?","The Son, Jesus Christ."],
  ["Name the five preparation movements.","Praise and worship, thanksgiving, confession of sins, forgiving others, and inviting the Holy Spirit."],
  ["Name three practices for maintaining freedom.","Examples include Scripture, prayer, thanksgiving, forgiveness, Christian fellowship, wise pastoral support, and responsible health care."]
];
function renderReview(){
  byId("assignmentList").innerHTML=assignmentItems.map((x,i)=>`<label class="check-item"><input type="checkbox" data-assignment="${i}" ${state.assignments.includes(i)?"checked":""}><span>${x}</span></label>`).join("");
  byId("assignmentReflection").value=state.notes.assignment||"";byId("finalReflection").value=state.notes.final||"";
  byId("finalQuiz").innerHTML=finalQuestions.map((q,qi)=>`<div class="quiz-card" data-final-question="${qi}"><h3>${qi+1}. ${q.q}</h3><div class="question-options">${q.o.map((o,oi)=>`<button class="option" data-final-option="${oi}">${o}</button>`).join("")}</div><div class="feedback">${q.e}</div></div>`).join("")+`<button class="button primary" id="submitFinal" data-testid="button-submit-final">Check final quiz</button><p id="finalScore" aria-live="polite"></p>`;
  $$("[data-assignment]").forEach(x=>x.onchange=()=>{const i=Number(x.dataset.assignment);if(x.checked&&!state.assignments.includes(i))state.assignments.push(i);if(!x.checked)state.assignments=state.assignments.filter(n=>n!==i);save()});
  $$("[data-final-option]").forEach(b=>b.onclick=()=>{const card=b.closest("[data-final-question]");card.querySelectorAll(".option").forEach(x=>x.classList.remove("selected"));b.classList.add("selected")});
  byId("submitFinal").onclick=()=>{let correct=0,answered=0;$$("[data-final-question]").forEach((card,i)=>{const chosen=card.querySelector(".selected");if(chosen){answered++;const ok=Number(chosen.dataset.finalOption)===finalQuestions[i].a;chosen.classList.add(ok?"correct":"incorrect");if(ok)correct++;card.querySelector(".feedback").classList.add("show")}});byId("finalScore").textContent=answered<finalQuestions.length?"Please answer every question before finishing.":`You answered ${correct} of ${finalQuestions.length} correctly.`;if(answered===finalQuestions.length&&correct>=3){state.finalQuiz=true;save()}};
  $$("[data-note]").forEach(t=>t.oninput=()=>{state.notes[t.dataset.note]=t.value;save()});
  newRecall();updateProgress();bindSpeech();
}
function newRecall(){
  const q=recallQuestions[Math.floor(Math.random()*recallQuestions.length)];
  byId("recallCard").innerHTML=`<strong>${q[0]}</strong><button class="text-button" data-reveal-recall>Reveal answer</button><p class="recall-answer">${q[1]}</p>`;
  $("[data-reveal-recall]").onclick=()=>$(".recall-answer").classList.add("show");
}

function bindRoutes(){
  $$("[data-route]").forEach(b=>b.onclick=()=>route(b.dataset.route,b.dataset.module));
  $$("[data-module-nav]").forEach(b=>b.onclick=()=>{currentModule=Number(b.dataset.moduleNav);renderModule();window.scrollTo(0,0)});
}

function init(){
  moduleNav();updateProgress();bindRoutes();bindSpeech();
  byId("startCourse").onclick=()=>route("course",0);
  byId("menuButton").onclick=openDrawer;byId("closeMenu").onclick=closeDrawer;byId("scrim").onclick=closeDrawer;
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeDrawer();if(byId("certificateDialog").open)byId("certificateDialog").close()}});
  $$(".tabs [data-library]").forEach(b=>b.onclick=()=>{currentLibrary=b.dataset.library;renderLibrary()});
  byId("librarySearch").oninput=e=>{searchTerm=e.target.value;renderLibrary()};
  byId("clearSearch").onclick=()=>{searchTerm="";byId("librarySearch").value="";renderLibrary()};
  byId("newRecall").onclick=newRecall;
  byId("certificateButton").onclick=()=>byId("certificateDialog").showModal();
  $(".dialog-close").onclick=()=>byId("certificateDialog").close();
  byId("printCertificate").onclick=()=>window.print();
  byId("resetProgress").onclick=()=>{if(confirm("Reset all course progress, notes, bookmarks, and assignments on this device?")){state={completed:[],bookmarks:[],notes:{},assignments:[],finalQuiz:false};save();renderReview();moduleNav()}};
}
document.addEventListener("DOMContentLoaded",init);
