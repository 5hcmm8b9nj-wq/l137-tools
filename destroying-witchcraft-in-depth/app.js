// Content embedded so no fetch is needed (works in preview iframe with restricted storage)
const CONTENT = window.__CONTENT__;

// ------- Render opening scriptures -------
function renderOpeningScriptures(){
  const el = document.getElementById('opening-scriptures');
  if(!el) return;
  el.innerHTML = CONTENT.opening_scriptures.map(s => `
    <details class="scripture-item">
      <summary class="scripture-summary">
        <span class="scripture-ref">${s.ref}</span>
        <span class="scripture-toggle">Tap to reveal</span>
      </summary>
      <div class="scripture-body">
        <div class="scripture-verse">${s.text}</div>
        <p class="scripture-explain">${s.explanation}</p>
      </div>
    </details>
  `).join('');
}

// ------- Render prayer points -------
function renderPrayers(){
  const list = document.getElementById('prayer-list');
  if(!list) return;
  list.innerHTML = CONTENT.prayers.map(p => `
    <details class="prayer-item" data-n="${p.n}">
      <summary class="prayer-summary">
        <span class="prayer-n">${p.n}</span>
        <span class="prayer-title">${p.text}</span>
        <span class="prayer-toggle">Explain</span>
      </summary>
      <div class="prayer-body">

        <div class="prayer-block">
          <div class="prayer-block-label">What it means</div>
          <div class="prayer-block-body"><p>${p.meaning}</p></div>
        </div>

        <div class="prayer-block">
          <div class="prayer-block-label">Scriptures (KJV)</div>
          <div class="prayer-scriptures">
            ${p.scriptures.map(s => `
              <div class="prayer-scripture">
                <div class="r">${s.ref}</div>
                <div class="t">${s.text}</div>
              </div>`).join('')}
          </div>
        </div>

        <div class="prayer-block">
          <div class="prayer-block-label">Real-life examples</div>
          <div class="prayer-block-body">
            <ul>${p.examples.map(e => `<li>${e}</li>`).join('')}</ul>
          </div>
        </div>

        <div class="prayer-block">
          <div class="prayer-block-label">How to pray it</div>
          <div class="prayer-block-body"><p>${p.how_to_pray}</p></div>
        </div>

        <div class="declaration-box">
          <div class="declaration-label">🔥 Declare</div>
          <p class="declaration-text">${p.declaration}</p>
        </div>

      </div>
    </details>
  `).join('');
}

// ------- Render direction + seal explanation -------
function renderStaticText(){
  const dir = document.getElementById('direction-explanation');
  if(dir) dir.textContent = CONTENT.prophetic_direction_explained;
  const seal = document.getElementById('seal-explanation');
  if(seal) seal.textContent = CONTENT.sealing.explanation;
}

// ------- Expand/collapse all -------
function bindExpandCollapse(){
  const list = document.getElementById('prayer-list');
  document.getElementById('expand-all')?.addEventListener('click', () => {
    list.querySelectorAll('details').forEach(d => d.open = true);
  });
  document.getElementById('collapse-all')?.addEventListener('click', () => {
    list.querySelectorAll('details').forEach(d => d.open = false);
  });
}

// ------- Quiz -------
const QUIZ = [
  {
    q: "According to Micah 5:12, WHO cuts off witchcraft?",
    opts: ["The believer, by fasting", "God Himself", "The angels of Michael", "The prayer leader"],
    a: 1,
    e: "Micah 5:12 KJV — 'And I will cut off witchcrafts out of thine hand.' God Himself, not our effort, is the one who cuts off witchcraft. Our prayer is agreement with what He has already declared."
  },
  {
    q: "In Revelation 12:11, what three things overcome the accuser?",
    opts: [
      "Fasting, prayer, and giving",
      "The blood of the Lamb, the word of testimony, and surrendered life",
      "Anointing oil, communion, and salt",
      "Faith, hope, and love"
    ],
    a: 1,
    e: "Revelation 12:11 KJV — 'And they overcame him by the blood of the Lamb, and by the word of their testimony; and they loved not their lives unto the death.' All three ingredients are needed, and the middle one (speaking) is why we pray aloud."
  },
  {
    q: "What is the difference between the blood of Abel and the blood of Jesus (Hebrews 12:24)?",
    opts: [
      "Abel's blood was on wood; Jesus' blood was on stone",
      "Abel's blood cried for vengeance; Jesus' blood speaks mercy and redemption",
      "Abel's blood was a symbol; Jesus' blood was literal",
      "There is no difference"
    ],
    a: 1,
    e: "Genesis 4:10 says Abel's blood cried from the ground FOR VENGEANCE. Hebrews 12:24 says Jesus' blood speaks BETTER things — mercy, cleansing, and the new covenant. When you pour on the ground, this is why."
  },
  {
    q: "What is a 'territorial spirit'?",
    opts: [
      "A demon assigned to a country of birth or geographic area",
      "A generic term for any demon",
      "The devil himself",
      "A helpful spirit sent by God"
    ],
    a: 0,
    e: "Ephesians 6:12 and Daniel 10:13 show that principalities are assigned over regions. Prayer 1 cuts you off from every such spirit."
  },
  {
    q: "In Prayer 20, why do we NAME each load individually (sickness, poverty, sorrow, etc.)?",
    opts: [
      "So the enemy is impressed",
      "So we do not forget any",
      "Because naming disconnects the load from us and specifies what must go back",
      "It is optional and does not matter"
    ],
    a: 2,
    e: "Naming is legal. It tells the enemy exactly what package he must take back, and it removes ambiguity from your prayer. Isaiah 10:27 promises the yoke is destroyed."
  },
  {
    q: "What does Psalm 94:1 do as the sealing prayer?",
    opts: [
      "It curses the enemy in return",
      "It hands vengeance back to God who alone has the right to it",
      "It is only a poetic ending",
      "It cancels the previous 21 prayers"
    ],
    a: 1,
    e: "Psalm 94:1 KJV — 'O LORD God, to whom vengeance belongeth… shew thyself.' You are legally handing the case to the Judge, resting in Him. Romans 12:19 — 'Vengeance is mine; I will repay, saith the Lord.'"
  }
];

function renderQuiz(){
  const el = document.getElementById('quiz-list');
  if(!el) return;
  el.innerHTML = QUIZ.map((q,i) => `
    <div class="quiz-item" data-i="${i}">
      <p class="quiz-q">${i+1}. ${q.q}</p>
      <div class="quiz-opts">
        ${q.opts.map((o,j) => `<button class="quiz-opt" data-j="${j}">${o}</button>`).join('')}
      </div>
      <button class="quiz-reveal">Reveal answer</button>
      <div class="quiz-explain"></div>
    </div>
  `).join('');

  el.querySelectorAll('.quiz-item').forEach(item => {
    const i = +item.dataset.i;
    const q = QUIZ[i];
    let chosen = null;
    item.querySelectorAll('.quiz-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        chosen = +btn.dataset.j;
        item.querySelectorAll('.quiz-opt').forEach(b => b.classList.remove('chosen'));
        btn.classList.add('chosen');
      });
    });
    item.querySelector('.quiz-reveal').addEventListener('click', () => {
      item.querySelectorAll('.quiz-opt').forEach((b,j) => {
        b.classList.remove('chosen');
        if(j === q.a) b.classList.add('correct');
        else if(j === chosen) b.classList.add('wrong');
      });
      const ex = item.querySelector('.quiz-explain');
      ex.textContent = q.e;
      ex.classList.add('show');
    });
  });
}

// ------- Init -------
document.addEventListener('DOMContentLoaded', () => {
  renderOpeningScriptures();
  renderPrayers();
  renderStaticText();
  bindExpandCollapse();
  renderQuiz();
});
