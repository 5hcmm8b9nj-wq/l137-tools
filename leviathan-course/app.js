/* =====================================================
   L137 Deliverance Ministries — Leviathan Session 1
   Interactive elements: Quiz, Flashcards, Diagnose,
   Memory, Renunciation, 9 Pillars, Tab switching
   ===================================================== */

/* ===== QUIZ ===== */
const QUIZ = [
  {
    q: "What kind of spirit is Leviathan, according to Pastor Kiki's teaching?",
    options: ["A territorial demon", "A marine spirit — a serpent spirit — a twisting power", "A familiar spirit only", "A spirit of poverty"],
    correct: 1,
    explanation: "Pastor Kiki teaches that Leviathan is a marine spirit, a serpent spirit, and a twisting power. He does not attack openly — he coils."
  },
  {
    q: "What is Pastor Kiki's principle for the first open door of your deliverance?",
    options: ["Loud prayer", "Fasting for 40 days", "Your understanding — diagnosing what is happening", "A pastor laying hands on you"],
    correct: 2,
    explanation: "'Your understanding is your first open door for your deliverance. As soon as you understand or diagnose what is happening, you know where your prayer points will go.'"
  },
  {
    q: "According to Zechariah 4:6, how is deliverance accomplished?",
    options: ["By might and power", "By human effort", "Not by might, nor by power, but by My Spirit", "By long prayers"],
    correct: 2,
    explanation: "'Not by might, nor by power, but by My Spirit, saith the Lord of hosts.' (Zechariah 4:6) Deliverance is the Holy Ghost's operation — without Him we can do nothing."
  },
  {
    q: "Which scripture says the Lord Himself will punish Leviathan with His sword?",
    options: ["Psalm 23", "Isaiah 27:1", "Romans 8:28", "Proverbs 3:5"],
    correct: 1,
    explanation: "Isaiah 27:1 — 'In that day the Lord with His sore and great and strong sword shall punish leviathan the piercing serpent... and He shall slay the dragon that is in the sea.'"
  },
  {
    q: "What does Pastor Kiki call the 'spiritual key' that opens God's presence?",
    options: ["Tithing", "Fasting", "Thanksgiving and gratitude", "Holy laughter"],
    correct: 2,
    explanation: "'Beloved, our thanksgiving is like our spiritual key. When we thank God, He activates His presence.' (Psalm 100:4)"
  },
  {
    q: "Which of these is NOT one of the scales of Leviathan named in Part 1?",
    options: ["Witchcraft", "Boasting", "Generosity", "Mockery"],
    correct: 2,
    explanation: "The scales of Leviathan named in Part 1 are: witchcraft, anger, rage, mockery, rebellion, shame, control, arrogance, boasting, cussing, lying, selfishness, unwillingness to apologize, and unforgiveness — and there are many more. Generosity is a fruit of the Spirit, not a scale of Leviathan."
  },
  {
    q: "How does Leviathan typically attack a marriage?",
    options: ["Openly and obviously", "By twisting communication so words are heard differently than spoken", "Only through unbelievers", "Through dreams only"],
    correct: 1,
    explanation: "Leviathan twists the meaning of words. Your husband says one thing, but the spirit twists it before it reaches your ear — causing arguments without cause."
  },
  {
    q: "What does the Blood of Jesus do for the believer, per 1 John 1:7?",
    options: ["Saves us once but cannot cleanse afterward", "Cleanses us from all sin as we walk in the light", "Only covers physical illness", "Was symbolic only"],
    correct: 1,
    explanation: "'But if we walk in the light, as He is in the light... the blood of Jesus Christ His Son cleanseth us from all sin.' (1 John 1:7)"
  },
  {
    q: "Which of these is a hindrance to receiving deliverance from Leviathan?",
    options: ["Asking for prayer", "Unforgiveness, sin, fear, and lack of knowledge", "Reading the Bible", "Attending church"],
    correct: 1,
    explanation: "Pastor Kiki names the hindrances: sin, ungodly soul ties, occultism, fear, embarrassment, unbelief, unforgiveness, lack of knowledge, and rejection."
  },
  {
    q: "According to Matthew 6:14–15, if we do not forgive others, what happens?",
    options: ["God still forgives us anyway", "Neither will the Father forgive our trespasses", "We must give a special offering", "We must fast 40 days"],
    correct: 1,
    explanation: "'If ye forgive not men their trespasses, neither will your Father forgive your trespasses.' Forgiveness closes the legal door to the enemy."
  },
  {
    q: "What does 2 Corinthians 3:17 promise about the Spirit of the Lord?",
    options: ["Where the Spirit of the Lord is, there is liberty", "The Spirit only comes once", "The Spirit only comes to pastors", "The Spirit is silent"],
    correct: 0,
    explanation: "'Where the Spirit of the Lord is, there is liberty.' When the Holy Ghost takes over, every yoke is destroyed and every chain is broken."
  },
  {
    q: "What ministry name and verse appears in every artifact?",
    options: ["GraceWorld / John 3:16", "L137 Deliverance Ministries International / Luke 1:37", "Faith Family / Hebrews 11:1", "Living Word / Psalm 23"],
    correct: 1,
    explanation: "L137 Deliverance Ministries International — Luke 1:37: 'For with God nothing shall be impossible.' Pastor Kiki, Founder."
  },
  /* ===== PART 2 QUESTIONS ===== */
  {
    q: "In the Squatters Parable, what do the demons do after you cast them out?",
    options: ["They are destroyed forever immediately", "They camp outside the house and wait, watching for a doorway back in", "They flee to another country", "They cannot return under any condition"],
    correct: 1,
    explanation: "Pastor Kiki teaches that demons act like squatters — once evicted, they camp outside your house and watch for any open door (sin, unforgiveness, ungodly soul ties) to come back. That is why maintenance is not optional."
  },
  {
    q: "In the Breath of the Holy Ghost exercise, how many cycles do you breathe in the Spirit and breathe out the unclean spirit?",
    options: ["3 cycles", "5 cycles", "7 cycles — completion in the Spirit", "12 cycles"],
    correct: 2,
    explanation: "Seven cycles. Anchored in Genesis 1:1–3 — the Spirit of God moved upon the face of the waters. You inhale the Holy Ghost and exhale every unclean spirit, seven times, until you are filled."
  },
  {
    q: "Which scripture is prayed in the 'King of Glory' prayer (Pillar 4) to open the gates of your life to Christ?",
    options: ["Psalm 23:1", "Psalm 24:7–8", "Psalm 91:1", "Psalm 121:1"],
    correct: 1,
    explanation: "Psalm 24:7–8 — 'Lift up your heads, O ye gates... and the King of glory shall come in. Who is this King of glory? The Lord strong and mighty, the Lord mighty in battle.'"
  },
  {
    q: "Which fruit of the Spirit list (Galatians 5:22–23) is named as a pillar of maintaining deliverance?",
    options: ["Faith, hope, love", "Love, joy, peace, longsuffering, gentleness, goodness, faith, meekness, temperance", "Wisdom, knowledge, understanding", "Mercy, grace, truth"],
    correct: 1,
    explanation: "Galatians 5:22–23 — 'But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, meekness, temperance: against such there is no law.' Walking in the fruit of the Spirit shuts the door to Leviathan."
  }
];

(function initQuiz(){
  const root = document.getElementById('quiz-app');
  if (!root) return;
  let i = 0, score = 0, answered = false;

  function render(){
    if (i >= QUIZ.length){
      renderResult();
      return;
    }
    const q = QUIZ[i];
    answered = false;
    root.innerHTML = `
      <div class="quiz-progress">
        <div class="quiz-progress-text">Question ${i+1} of ${QUIZ.length}</div>
        <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${(i/QUIZ.length)*100}%"></div></div>
      </div>
      <div class="quiz-question">${q.q}</div>
      <div class="quiz-options">
        ${q.options.map((opt,idx) => `<button class="quiz-option" data-idx="${idx}">${opt}</button>`).join('')}
      </div>
      <div id="quiz-feedback"></div>
    `;
    root.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => choose(parseInt(btn.dataset.idx)));
    });
  }

  function choose(idx){
    if (answered) return;
    answered = true;
    const q = QUIZ[i];
    const options = root.querySelectorAll('.quiz-option');
    options.forEach((btn, j) => {
      btn.disabled = true;
      if (j === q.correct) btn.classList.add('correct');
      if (j === idx && idx !== q.correct) btn.classList.add('incorrect');
    });
    const correct = idx === q.correct;
    if (correct) score++;
    const fb = document.getElementById('quiz-feedback');
    fb.innerHTML = `
      <div class="quiz-feedback ${correct ? 'correct' : 'incorrect'}">
        <strong>${correct ? '✓ Correct' : '✗ Not quite'}</strong>
        ${q.explanation}
      </div>
      <button class="quiz-next">${i === QUIZ.length-1 ? 'See Results' : 'Next Question →'}</button>
    `;
    fb.querySelector('.quiz-next').addEventListener('click', () => { i++; render(); });
  }

  function renderResult(){
    const pct = Math.round((score / QUIZ.length) * 100);
    let title, msg;
    if (pct >= 90) {
      title = "Well done, beloved";
      msg = "You have a deep grasp of this teaching. Walk in this understanding — it is your first open door for deliverance.";
    } else if (pct >= 70) {
      title = "Strong understanding";
      msg = "You are standing on solid ground. Review the workbook and listen to the teaching summary once more to seal what you have learned.";
    } else if (pct >= 50) {
      title = "Keep studying";
      msg = "Re-listen to the teaching audio and review the infographics. Understanding is the first open door — give yourself time.";
    } else {
      title = "Start with the audio";
      msg = "Begin by listening to the Teaching Summary audio. Then return to this quiz. The Holy Ghost will teach you all things.";
    }
    root.innerHTML = `
      <div class="quiz-result">
        <div class="quiz-result-score">${score}/${QUIZ.length}</div>
        <div class="quiz-result-title">${title}</div>
        <div class="quiz-result-message">${msg}</div>
        <button class="btn btn-primary" onclick="location.hash='#quiz';location.reload();">↻ Retake Quiz</button>
      </div>
    `;
  }

  render();
})();

/* ===== FLASHCARDS ===== */
const FLASHCARDS = [
  /* Part 1 */
  { ref: "Job 41:1", verse: "Canst thou draw out leviathan with an hook? or his tongue with a cord which thou lettest down?" },
  { ref: "Isaiah 27:1", verse: "In that day the Lord with His sore and great and strong sword shall punish leviathan the piercing serpent... and He shall slay the dragon that is in the sea." },
  { ref: "Psalm 100:4", verse: "Enter into His gates with thanksgiving, and into His courts with praise: be thankful unto Him, and bless His name." },
  { ref: "Psalm 103:1-2", verse: "Bless the Lord, O my soul: and all that is within me, bless His holy name. Bless the Lord, O my soul, and forget not all His benefits." },
  { ref: "Matthew 6:14-15", verse: "For if ye forgive men their trespasses, your heavenly Father will also forgive you: but if ye forgive not men their trespasses, neither will your Father forgive your trespasses." },
  { ref: "Isaiah 59:1-2", verse: "Behold, the Lord's hand is not shortened, that it cannot save... but your iniquities have separated between you and your God." },
  { ref: "Ephesians 4:31-32", verse: "Let all bitterness, and wrath, and anger, and clamour, and evil speaking, be put away from you, with all malice." },
  { ref: "Zechariah 4:6", verse: "Not by might, nor by power, but by My Spirit, saith the Lord of hosts." },
  { ref: "2 Corinthians 3:17", verse: "Now the Lord is that Spirit: and where the Spirit of the Lord is, there is liberty." },
  { ref: "Acts 10:38", verse: "How God anointed Jesus of Nazareth with the Holy Ghost and with power: who went about doing good, and healing all that were oppressed of the devil; for God was with Him." },
  { ref: "Psalm 104:25-26", verse: "So is this great and wide sea... there is that leviathan, whom Thou hast made to play therein." },
  { ref: "Proverbs 16:18", verse: "Pride goeth before destruction, and an haughty spirit before a fall." },
  { ref: "Revelation 12:11", verse: "And they overcame him by the blood of the Lamb, and by the word of their testimony; and they loved not their lives unto the death." },
  { ref: "1 John 1:7", verse: "But if we walk in the light, as He is in the light, we have fellowship one with another, and the blood of Jesus Christ His Son cleanseth us from all sin." },
  { ref: "Hebrews 9:22", verse: "And almost all things are by the law purged with blood; and without shedding of blood is no remission." },
  /* Part 2 */
  { ref: "Psalm 24:7-8", verse: "Lift up your heads, O ye gates; and be ye lift up, ye everlasting doors; and the King of glory shall come in. Who is this King of glory? The Lord strong and mighty, the Lord mighty in battle." },
  { ref: "Hebrews 1:14", verse: "Are they not all ministering spirits, sent forth to minister for them who shall be heirs of salvation?" },
  { ref: "Galatians 5:22-23", verse: "But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, meekness, temperance: against such there is no law." },
  { ref: "2 Corinthians 10:5", verse: "Casting down imaginations, and every high thing that exalteth itself against the knowledge of God, and bringing into captivity every thought to the obedience of Christ." },
  { ref: "Jeremiah 30:17", verse: "For I will restore health unto thee, and I will heal thee of thy wounds, saith the Lord." },
  { ref: "Isaiah 60:1-2", verse: "Arise, shine; for thy light is come, and the glory of the Lord is risen upon thee. For, behold, the darkness shall cover the earth, and gross darkness the people: but the Lord shall arise upon thee, and His glory shall be seen upon thee." },
  { ref: "Genesis 1:1-3", verse: "In the beginning God created the heaven and the earth... and the Spirit of God moved upon the face of the waters. And God said, Let there be light: and there was light." },
  { ref: "James 4:7", verse: "Submit yourselves therefore to God. Resist the devil, and he will flee from you." },
  { ref: "2 Timothy 1:7", verse: "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind." }
];

(function initFlashcards(){
  const root = document.getElementById('flashcard-app');
  if (!root) return;
  root.innerHTML = FLASHCARDS.map(c => `
    <div class="flashcard" tabindex="0" role="button" aria-label="Flip flashcard">
      <div class="flashcard-inner">
        <div class="flashcard-front">
          <div class="ref-label">Scripture</div>
          <div class="ref-text">${c.ref}</div>
          <div class="flip-hint">Click to reveal</div>
        </div>
        <div class="flashcard-back">
          <div class="verse-text">${c.verse}</div>
          <div class="verse-ref">— ${c.ref} (KJV)</div>
        </div>
      </div>
    </div>
  `).join('');
  root.querySelectorAll('.flashcard').forEach(card => {
    const flip = () => card.classList.toggle('flipped');
    card.addEventListener('click', flip);
    card.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){ e.preventDefault(); flip(); }});
  });
})();

/* ===== DIAGNOSE THE SPIRIT ===== */
const SIGNS = [
  { title: "Twisted communication", desc: "Words spoken to me are heard differently — I argue with my spouse or family over what was said." },
  { title: "Constant misunderstandings without cause", desc: "Even when I explain myself clearly, I am misunderstood again and again." },
  { title: "Marital strife or hardened heart", desc: "Accusations, distance, or division in my marriage I cannot trace to a clear cause." },
  { title: "Workplace conflict or finger-pointing", desc: "People at work treat me unfairly though I have done nothing wrong." },
  { title: "Pride I cannot shake", desc: "Pride rises up in me even when I am trying to be humble." },
  { title: "Uncontrollable anger or rage", desc: "I have lost control and acted in ways I later cannot explain." },
  { title: "Spiritual blockage", desc: "I cannot focus when I read the Bible, I cannot pray, or I fall asleep in church." },
  { title: "Hindered or repeated deliverance", desc: "I feel delivered then days later I am tormented again — the breakthrough does not hold." },
  { title: "Dream attacks", desc: "Serpent imagery in dreams, or sensations in my body I cannot explain." },
  { title: "Insomnia or loss of focus", desc: "I cannot sleep at night or cannot concentrate during the day." },
  { title: "Rejection of healing or deliverance", desc: "Something in me resists going to the place where I receive help." },
  { title: "Foundational / inherited patterns", desc: "The same problems repeat in my family across generations." }
];

(function initDiagnose(){
  const root = document.getElementById('diagnose-app');
  if (!root) return;
  const state = new Set();

  function render(){
    const count = state.size;
    let message;
    if (count === 0) message = "No signs checked yet. Go through each one slowly and ask the Holy Spirit to show you the truth.";
    else if (count <= 3) message = "A few signs are present. Use the prayer points in the workbook and pray specifically against these areas in the name of Jesus.";
    else if (count <= 6) message = "Several signs are showing. The Leviathan spirit may be operating in clear ways. Walk through the full Guided Prayer of Deliverance and follow up with the 7-Day Devotional.";
    else message = "Many signs are present. The Holy Spirit is exposing a stronghold. Begin the Guided Prayer of Deliverance, the 7-Day Devotional, and walk daily with the Declaration Cards. By the Blood of Jesus, you are free.";

    root.innerHTML = `
      <div class="diagnose-intro">"Your first open door for your deliverance is your understanding." — Pastor Kiki</div>
      ${SIGNS.map((s, idx) => `
        <div class="diagnose-item ${state.has(idx) ? 'checked' : ''}" data-idx="${idx}">
          <div class="diagnose-checkbox"></div>
          <div class="diagnose-text">
            <div class="diagnose-title">${s.title}</div>
            <div class="diagnose-desc">${s.desc}</div>
          </div>
        </div>
      `).join('')}
      <div class="diagnose-results">
        <h3>Signs identified:</h3>
        <div class="diagnose-count">${count} of ${SIGNS.length}</div>
        <div class="diagnose-message">${message}</div>
      </div>
    `;
    root.querySelectorAll('.diagnose-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.idx);
        if (state.has(idx)) state.delete(idx);
        else state.add(idx);
        render();
      });
    });
  }
  render();
})();

/* ===== SCRIPTURE MEMORY ===== */
const MEMORY_VERSES = [
  { ref: "Luke 1:37", parts: ["For with God ", null, " shall be impossible."], answers: ["nothing"] },
  { ref: "Zechariah 4:6", parts: ["Not by ", null, ", nor by ", null, ", but by My Spirit, saith the Lord."], answers: ["might", "power"] },
  { ref: "2 Corinthians 3:17", parts: ["Where the Spirit of the Lord is, there is ", null, "."], answers: ["liberty"] },
  { ref: "Revelation 12:11", parts: ["They overcame him by the ", null, " of the Lamb, and by the word of their ", null, "."], answers: ["blood", "testimony"] },
  { ref: "Psalm 100:4", parts: ["Enter into His gates with ", null, ", and into His courts with ", null, "."], answers: ["thanksgiving", "praise"] },
  { ref: "1 John 1:7", parts: ["The blood of Jesus Christ His Son ", null, " us from all sin."], answers: ["cleanseth"] },
  { ref: "Isaiah 27:1", parts: ["The Lord with His sore and great and strong ", null, " shall punish leviathan the piercing ", null, "."], answers: ["sword", "serpent"] },
  { ref: "Proverbs 16:18", parts: [null, " goeth before destruction, and an haughty spirit before a ", null, "."], answers: ["Pride", "fall"] },
  { ref: "Psalm 24:7", parts: ["Lift up your heads, O ye ", null, "; and be ye lift up, ye everlasting doors; and the King of ", null, " shall come in."], answers: ["gates", "glory"] },
  { ref: "Galatians 5:22", parts: ["But the fruit of the Spirit is ", null, ", joy, peace, longsuffering..."], answers: ["love"] },
  { ref: "James 4:7", parts: ["Submit yourselves therefore to God. Resist the ", null, ", and he will ", null, " from you."], answers: ["devil", "flee"] },
  { ref: "2 Timothy 1:7", parts: ["For God hath not given us the spirit of ", null, "; but of power, and of love, and of a sound ", null, "."], answers: ["fear", "mind"] }
];

(function initMemory(){
  const root = document.getElementById('memory-app');
  if (!root) return;

  root.innerHTML = MEMORY_VERSES.map((v, vIdx) => {
    let html = `<div class="memory-card" data-vidx="${vIdx}">
      <div class="memory-ref">${v.ref} (KJV)</div>
      <div class="memory-text">`;
    let blankIdx = 0;
    v.parts.forEach(part => {
      if (part === null) {
        const ans = v.answers[blankIdx];
        const w = Math.max(80, ans.length * 13);
        html += `<input class="memory-input" data-aidx="${blankIdx}" data-answer="${ans.toLowerCase()}" style="width:${w}px" autocomplete="off" spellcheck="false">`;
        blankIdx++;
      } else {
        html += part;
      }
    });
    html += `</div>
      <button class="memory-check-btn">Check Answer</button>
      <div class="memory-feedback"></div>
    </div>`;
    return html;
  }).join('');

  root.querySelectorAll('.memory-card').forEach(card => {
    const inputs = card.querySelectorAll('.memory-input');
    const btn = card.querySelector('.memory-check-btn');
    const fb = card.querySelector('.memory-feedback');
    btn.addEventListener('click', () => {
      let allCorrect = true;
      inputs.forEach(input => {
        const user = input.value.trim().toLowerCase();
        const ans = input.dataset.answer.toLowerCase();
        input.classList.remove('correct', 'incorrect');
        if (user === ans) input.classList.add('correct');
        else { input.classList.add('incorrect'); allCorrect = false; }
      });
      fb.classList.remove('correct', 'incorrect');
      if (allCorrect) {
        fb.textContent = "✓ Correct — speak it out loud one more time.";
        fb.classList.add('correct');
      } else {
        fb.textContent = "✗ Try again — the answer is highlighted in red.";
        fb.classList.add('incorrect');
      }
    });
    inputs.forEach(input => {
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); btn.click(); }
      });
    });
  });
})();

/* ===== RENUNCIATION PRAYER TOOL ===== */
const RENUNCIATIONS = [
  "I renounce the spirit of pride and arrogance",
  "I renounce self-centeredness and self-righteousness",
  "I renounce every spirit of rejection",
  "I renounce every lying spirit",
  "I renounce anger from my life",
  "I renounce rebellion from my life",
  "I renounce heaviness from my life",
  "I renounce the spirit of lust",
  "I renounce witchcraft and anger",
  "I renounce manipulation and rage",
  "I renounce every hard-heartedness",
  "I renounce mockery and rebellion",
  "I renounce shame and arrogance",
  "I renounce control and disobedience",
  "I renounce every boasting spirit",
  "I renounce every cussing and unclean speech",
  "I renounce every stubbornness",
  "I renounce unwillingness to apologize",
  "I renounce unforgiveness from my heart",
  "I cast out every spirit from my eyes, ears, nose, mind, mouth, skin",
  "By air or liquid — every unclean spirit, come out of me, in Jesus' name",
  "I shut every doorway by the Blood of Jesus",
  "I plead the Blood of Jesus over my whole life",
  "I receive the fullness of the Holy Ghost — I am free, in Jesus' name"
];

(function initRenounce(){
  const root = document.getElementById('renounce-app');
  if (!root) return;
  const state = new Set();

  function render(){
    const count = state.size;
    const total = RENUNCIATIONS.length;
    const pct = Math.round((count / total) * 100);
    const allDone = count === total;

    root.innerHTML = `
      <div class="renounce-intro">
        Pray each line out loud, slowly, by the Name of Jesus, the Blood of Jesus, and the power of the Holy Ghost. Tap each declaration when you have prayed it. Do not rush.
      </div>
      <div class="renounce-progress">
        <div class="renounce-progress-text">${count} of ${total} prayed</div>
        <div class="renounce-progress-bar"><div class="renounce-progress-fill" style="width:${pct}%"></div></div>
      </div>
      ${RENUNCIATIONS.map((line, idx) => `
        <div class="renounce-item ${state.has(idx) ? 'checked' : ''}" data-idx="${idx}">
          <div class="renounce-checkbox"></div>
          <div class="renounce-text">${line}</div>
        </div>
      `).join('')}
      ${allDone ? `
        <div class="renounce-complete">
          <div class="renounce-complete-title">By the power of the Holy Ghost — you are free</div>
          <div class="renounce-complete-body">
            Drink the Blood of Jesus. Breathe in the Holy Ghost. Receive your deliverance.<br><br>
            <em>"Where the Spirit of the Lord is, there is liberty." — 2 Corinthians 3:17 (KJV)</em><br><br>
            Now move to the Breath of the Holy Ghost audio, then the 9 Pillars of Maintaining Your Deliverance. Do not let what God has done go unguarded.
          </div>
          <button class="btn btn-outline" id="renounce-reset">↻ Pray again</button>
        </div>
      ` : ''}
    `;
    root.querySelectorAll('.renounce-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.idx);
        if (state.has(idx)) state.delete(idx);
        else state.add(idx);
        render();
      });
    });
    const resetBtn = root.querySelector('#renounce-reset');
    if (resetBtn) resetBtn.addEventListener('click', () => { state.clear(); render(); });
  }
  render();
})();

/* ===== 9 PILLARS GRID ===== */
const PILLARS = [
  { num: "01", title: "Read Your Bible Daily", desc: "The Word is your sword. Feed on it daily — Leviathan cannot survive where the Word of God dwells richly." },
  { num: "02", title: "Be Active In A Christ-Centered Church", desc: "Iron sharpens iron. Submit to a Bible-believing local church where the Blood of Jesus and the Holy Ghost are honored." },
  { num: "03", title: "The Squatters Parable — Be Persistent", desc: "Demons are squatters. Once cast out, they camp outside watching for an open door. Keep every door of your life shut by the Blood." },
  { num: "04", title: "The King Of Glory Prayer", desc: "Pray Psalm 24:7–8 daily. Lift up the gates of your eyes, ears, mouth, mind, and heart — and let the King of glory come in." },
  { num: "05", title: "Bombard With The Blood Of Jesus", desc: "Apply the Blood of Jesus over your home, family, work, and dreams. The Blood speaks better things and silences every accuser." },
  { num: "06", title: "Renew Your Mind Daily", desc: "2 Corinthians 10:5 — Cast down every imagination and bring every thought captive to the obedience of Christ." },
  { num: "07", title: "Activate The Angels", desc: "Hebrews 1:14 — Speak the Word out loud. Angels are ministering spirits who hearken to the voice of His Word in your mouth." },
  { num: "08", title: "Walk In The Fruit Of The Spirit", desc: "Galatians 5:22–23 — love, joy, peace, longsuffering, gentleness, goodness, faith, meekness, temperance. Against such there is no law." },
  { num: "09", title: "Be Careful Who You Share Your Life With", desc: "Guard your inner circle. Ungodly soul ties and counsel re-open doors. Walk with those who walk in the Spirit." }
];

(function initPillars(){
  const root = document.getElementById('pillars-grid');
  if (!root) return;
  root.innerHTML = PILLARS.map(p => `
    <div class="tool-card pillar-card">
      <div class="tool-num">${p.num}</div>
      <div class="tool-title">${p.title}</div>
      <div class="tool-desc">${p.desc}</div>
    </div>
  `).join('');
})();

/* ===== PART TABS (Audio + Infographics) ===== */
(function initPartTabs(){
  document.querySelectorAll('.part-tabs').forEach(group => {
    const tabs = group.querySelectorAll('.part-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        const prefix = target.split('-')[0]; // "audio" or "info"
        tabs.forEach(t => t.classList.toggle('active', t === tab));
        document.querySelectorAll('[data-tab-panel]').forEach(panel => {
          const name = panel.dataset.tabPanel;
          if (!name.startsWith(prefix)) return;
          panel.style.display = (name === target) ? '' : 'none';
        });
      });
    });
  });
})();

/* ===== TAP THE SCALES ===== */
const SCALES = [
  { name: "Witchcraft", looks_like: "Control through manipulation, intimidation, or domination — bending another's will against the Spirit of God.", breaking_prayer: "I renounce every witchcraft spirit operating through me or against me. By the Blood of Jesus, every witchcraft assignment is broken — in Jesus' name." },
  { name: "Anger", looks_like: "Sudden, uncontrollable bursts I later cannot explain. A short fuse over small things.", breaking_prayer: "I renounce the spirit of anger. I cast it out by the Blood of Jesus. Holy Spirit, give me Your peace and Your self-control." },
  { name: "Rage", looks_like: "Anger I cannot pull back from — words and actions I regret afterward.", breaking_prayer: "I renounce every spirit of rage. I bind it now in the name of Jesus and command it to leave me forever." },
  { name: "Mockery", looks_like: "Tearing others down with words. Sarcasm dressed as humor. Belittling.", breaking_prayer: "I renounce mockery. Lord, set a watch over my mouth — let my words minister grace." },
  { name: "Rebellion", looks_like: "Resisting godly authority. Refusing to submit even when I know I am wrong.", breaking_prayer: "I renounce rebellion. I submit my will to the Lord Jesus Christ. I receive a teachable spirit." },
  { name: "Shame", looks_like: "Hiding from God. Believing the lie that I am too dirty to be loved.", breaking_prayer: "I renounce shame. The Blood of Jesus has washed me whiter than snow. I am a child of God." },
  { name: "Control", looks_like: "Needing to manage every outcome. Anxiety when I cannot.", breaking_prayer: "I renounce the spirit of control. I surrender every plan to Jesus. He is Lord — not me." },
  { name: "Arrogance", looks_like: "Believing I am above correction, above instruction, above others.", breaking_prayer: "I renounce arrogance. Lord, clothe me with humility. Pride goes before destruction." },
  { name: "Boasting", looks_like: "Drawing attention to myself, my works, my accomplishments.", breaking_prayer: "I renounce boasting. Let my boast be in the Lord alone — He is my glory and the lifter of my head." },
  { name: "Cussing", looks_like: "Words that defile my mouth and grieve the Holy Spirit.", breaking_prayer: "I renounce every unclean word. Lord, sanctify my tongue. Let the words of my mouth be acceptable to You." },
  { name: "Lying", looks_like: "Distorting truth — even small lies to look better or avoid trouble.", breaking_prayer: "I renounce every lying spirit. Jesus, You are Truth. Let truth dwell in my inward parts." },
  { name: "Selfishness", looks_like: "Putting my needs above everyone — even those God called me to love.", breaking_prayer: "I renounce selfishness. Lord, give me Your heart for others. Crucify the flesh in me." },
  { name: "Unwillingness to Apologize", looks_like: "A hard heart that will not say 'I was wrong' even when convicted.", breaking_prayer: "I renounce the hardness of my heart. Lord, give me a humble and contrite spirit. I will say the words." },
  { name: "Unforgiveness", looks_like: "Holding offense in my heart. Replaying what they did to me.", breaking_prayer: "I forgive — by an act of my will — every person who has wounded me. I release them to You, Lord. Now release me." },
  { name: "Pride", looks_like: "The root of every other scale. The throne of self that resists God.", breaking_prayer: "I renounce pride. I bow my heart before the King of Glory. Lord, You alone are exalted in my life." }
];

(function initScales(){
  const root = document.getElementById('scales-app');
  if (!root) return;
  root.innerHTML = `
    <div class="scales-grid">
      ${SCALES.map((s, idx) => `
        <button class="scale-card" data-idx="${idx}" aria-expanded="false">
          <div class="scale-num">${String(idx+1).padStart(2,'0')}</div>
          <div class="scale-name">${s.name}</div>
          <div class="scale-hint">Tap to reveal</div>
          <div class="scale-reveal">
            <div class="scale-section-label">What it looks like</div>
            <div class="scale-looks">${s.looks_like}</div>
            <div class="scale-section-label">Breaking prayer</div>
            <div class="scale-prayer">${s.breaking_prayer}</div>
          </div>
        </button>
      `).join('')}
    </div>
  `;
  root.querySelectorAll('.scale-card').forEach(card => {
    card.addEventListener('click', () => {
      const open = card.classList.toggle('open');
      card.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
})();

/* ===== TAP THE DOORWAYS ===== */
const DOORWAYS = [
  { icon: "👁", name: "Eyes", enters: "Images, pornography, witchcraft visuals, false light — what I behold I become.", prayer: "Father, I close the gate of my eyes. By the Blood of Jesus, every unclean image, every witchcraft sight — come out by air or liquid in Jesus' name. I cover my eyes with the Blood of Jesus." },
  { icon: "👂", name: "Ears", enters: "Ungodly music, gossip, words of curse, occult teachings.", prayer: "Father, I close the gate of my ears. Every word of curse, every defiling sound — come out by air or liquid in Jesus' name. I receive only what comes from the Holy Spirit." },
  { icon: "👃", name: "Nose", enters: "Unclean spirits that ride on the breath, demonic smells from rituals.", prayer: "Father, I close the gate of my nose. By the Blood of Jesus, every unclean spirit — come out by air or liquid in Jesus' name. I breathe in only the Holy Ghost." },
  { icon: "👄", name: "Mouth", enters: "Words I have spoken in agreement with the enemy, oaths, curses, unclean speech, unclean food offered to idols.", prayer: "Father, I close the gate of my mouth. I cancel every word I spoke against Your will. Every spirit that entered through my mouth — come out by air or liquid in Jesus' name." },
  { icon: "🧠", name: "Mind", enters: "Imaginations, fantasies, fear, intrusive thoughts, vain reasonings.", prayer: "Father, I close the gate of my mind. Every imagination exalting itself against the knowledge of God, I cast down. Every tormenting thought — come out in Jesus' name. I receive the mind of Christ." },
  { icon: "✋", name: "Skin", enters: "Cursed objects touched, ungodly anointing oils, tattoos with occult symbols, transferred spirits through laying on of unclean hands.", prayer: "Father, I close the gate of my skin. I renounce every cursed object I have touched, every defiling contact. By the Blood of Jesus — come out in Jesus' name." },
  { icon: "🔒", name: "Private parts", enters: "Sexual sin, ungodly soul ties, generational lust, every defiling intimacy.", prayer: "Father, I close the gate of my private parts. I renounce every ungodly soul tie. By the Blood of Jesus, every spirit of lust, every defilement — come out by air or liquid in Jesus' name. I dedicate my body to You as a living sacrifice." }
];

(function initDoorways(){
  const root = document.getElementById('doorways-app');
  if (!root) return;
  root.innerHTML = `
    <div class="doorways-grid">
      ${DOORWAYS.map((d, idx) => `
        <button class="doorway-card" data-idx="${idx}" aria-expanded="false">
          <div class="doorway-icon">${d.icon}</div>
          <div class="doorway-name">${d.name}</div>
          <div class="doorway-hint">Tap to open</div>
          <div class="doorway-reveal">
            <div class="doorway-section-label">What enters here</div>
            <div class="doorway-enters">${d.enters}</div>
            <div class="doorway-section-label">Closing prayer</div>
            <div class="doorway-prayer">${d.prayer}</div>
          </div>
        </button>
      `).join('')}
    </div>
    <div class="doorways-foot">After praying through each doorway, declare: <strong>"By the Blood of Jesus, every gate of my life is sealed. I belong to Jesus. I am free."</strong></div>
  `;
  root.querySelectorAll('.doorway-card').forEach(card => {
    card.addEventListener('click', () => {
      const open = card.classList.toggle('open');
      card.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
})();

/* ===== BREATH OF THE HOLY GHOST ===== */
(function initBreath(){
  const root = document.getElementById('breath-app');
  if (!root) return;
  const TOTAL_CYCLES = 7;
  const INHALE_MS = 4000;
  const EXHALE_MS = 4000;
  let running = false;
  let cycle = 0;
  let phase = 'idle'; // 'inhale' | 'exhale' | 'idle' | 'done'
  let timer = null;

  function render(){
    let phaseLabel, phaseSub, btnLabel;
    if (phase === 'idle') {
      phaseLabel = 'Ready';
      phaseSub = 'Press Begin. Seven breaths. Inhale the Holy Ghost. Exhale every unclean spirit.';
      btnLabel = '▶ Begin';
    } else if (phase === 'inhale') {
      phaseLabel = 'Breathe IN';
      phaseSub = 'Inhale the Holy Ghost slowly. Receive Him.';
      btnLabel = '⏸ Pause';
    } else if (phase === 'exhale') {
      phaseLabel = 'Breathe OUT';
      phaseSub = 'Release every unclean spirit. Let it go.';
      btnLabel = '⏸ Pause';
    } else {
      phaseLabel = 'It is finished';
      phaseSub = 'You are filled with the Holy Ghost. Walk in Him.';
      btnLabel = '↻ Begin again';
    }
    const showAnchor = phase === 'inhale' || phase === 'exhale';
    root.innerHTML = `
      <div class="breath-stage">
        <div class="breath-circle ${phase}"></div>
        <div class="breath-label">${phaseLabel}</div>
        <div class="breath-sub">${phaseSub}</div>
        <div class="breath-counter">${phase === 'done' ? `${TOTAL_CYCLES} of ${TOTAL_CYCLES}` : `Cycle ${Math.min(cycle+1, TOTAL_CYCLES)} of ${TOTAL_CYCLES}`}</div>
        <button class="btn btn-primary breath-btn">${btnLabel}</button>
      </div>
      <div class="breath-anchor ${showAnchor ? 'visible' : ''}">
        <div class="breath-anchor-ref">Genesis 1:1–3 (KJV)</div>
        <div class="breath-anchor-text">"In the beginning God created the heaven and the earth. And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters. And God said, Let there be light: and there was light."</div>
      </div>
    `;
    root.querySelector('.breath-btn').addEventListener('click', toggle);
  }

  function step(){
    if (!running) return;
    if (phase === 'inhale') {
      phase = 'exhale';
      render();
      timer = setTimeout(step, EXHALE_MS);
    } else if (phase === 'exhale') {
      cycle++;
      if (cycle >= TOTAL_CYCLES) {
        phase = 'done';
        running = false;
        render();
        return;
      }
      phase = 'inhale';
      render();
      timer = setTimeout(step, INHALE_MS);
    }
  }

  function toggle(){
    if (phase === 'done' || phase === 'idle') {
      cycle = 0;
      phase = 'inhale';
      running = true;
      render();
      timer = setTimeout(step, INHALE_MS);
    } else {
      // pause toggles
      if (running) {
        running = false;
        if (timer) clearTimeout(timer);
        render();
        // restore label
        const btn = root.querySelector('.breath-btn');
        if (btn) btn.textContent = '▶ Resume';
      } else {
        running = true;
        render();
        timer = setTimeout(step, phase === 'inhale' ? INHALE_MS : EXHALE_MS);
      }
    }
  }

  render();
})();

/* ===== SQUATTERS PARABLE ===== */
const SQUATTERS = [
  {
    title: "Card 1 · The Long-Stayed Squatter",
    front: "🏚️",
    front_label: "They lived here 10, 20 years",
    back: "Pastor Kiki teaches: demons that have lived in your house for years did not pay rent — but they grew comfortable. They believe the house is theirs. When the eviction notice comes by the Blood of Jesus, they do not understand to leave at once. Do not be discouraged. Persistence is your portion."
  },
  {
    title: "Card 2 · Camped Outside",
    front: "👁",
    front_label: "Watching for an open door",
    back: "Once you cast them out, the squatters do not flee far. They camp outside your house. They peek through the windows of your eyes, your ears, your thoughts. They watch for one cracked door — one unforgiveness, one secret sin, one ungodly soul tie — to come back in. Keep every door shut by the Blood."
  },
  {
    title: "Card 3 · The King of Glory Comes",
    front: "👑",
    front_label: "Psalm 24:7–8",
    back: "\"Lift up your heads, O ye gates; and be ye lift up, ye everlasting doors; and the King of glory shall come in. Who is this King of glory? The Lord strong and mighty, the Lord mighty in battle.\" When the King of Glory enters your house — every squatter scatters. Pray this scripture daily over your home, your body, your mind."
  },
  {
    title: "Card 4 · Evicted by Persistence",
    front: "🚪",
    front_label: "They go — eventually",
    back: "When you keep coming with the King of Glory — when you read your Bible daily, walk in the fruit of the Spirit, bombard with the Blood, renew your mind, activate the angels — the squatters cannot stay. They go. Maintaining your deliverance is not optional. It is the daily eviction of every squatter that tried to return."
  }
];

(function initSquatters(){
  const root = document.getElementById('squatters-app');
  if (!root) return;
  root.innerHTML = `
    <div class="squatters-grid">
      ${SQUATTERS.map((s, idx) => `
        <div class="squatter-card" tabindex="0" role="button" data-idx="${idx}" aria-label="Flip card">
          <div class="squatter-inner">
            <div class="squatter-front">
              <div class="squatter-num">${String(idx+1).padStart(2,'0')}</div>
              <div class="squatter-icon">${s.front}</div>
              <div class="squatter-title">${s.title}</div>
              <div class="squatter-front-label">${s.front_label}</div>
              <div class="squatter-flip-hint">Tap to read</div>
            </div>
            <div class="squatter-back">
              <div class="squatter-back-title">${s.title}</div>
              <div class="squatter-back-text">${s.back}</div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="squatters-foot">Declare now: <strong>"Lift up your heads, O ye gates of my life — and let the King of glory come in. Every squatter — out, in Jesus' name."</strong></div>
  `;
  root.querySelectorAll('.squatter-card').forEach(card => {
    const flip = () => card.classList.toggle('flipped');
    card.addEventListener('click', flip);
    card.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){ e.preventDefault(); flip(); }});
  });
})();
