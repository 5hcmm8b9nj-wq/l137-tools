/* ============================================================
   L137 DELIVERANCE MINISTRY — INTERACTIVE WORKBOOK CONTENT
   Template file. Duplicate this folder for each new teaching,
   then replace every [bracketed placeholder] and sample item.
   Rules: KJV only, full verses. Never include the transcript.
   Never invent a quotation, revelation or prophetic word.
   ============================================================ */
window.WORKBOOK = {
  id: "l137-template",                      // change per teaching, e.g. "l137-2026-07-13-hidden-enemies"
  ministry: {
    brand: "L137 Deliverance Ministry",
    speaker: "Pastor Kiky Ocansey",
    tagline: "L137 · Luke 1:37 — For with God nothing shall be impossible.",
    // Required L137 provenance line. Change only the platform word (Clubhouse / Zoom / WhatsApp Live / in-person service).
    openingLine: "The following is an interactive study following a service held on Clubhouse by Pastor Kiky Ocansey."
  },
  title: "With God Nothing Shall Be Impossible",
  serviceDate: "[Service date]",
  mainScripture: "Luke 1:37",
  heroImage: "hero.jpg",
  heroAlt: "A copper basin with a white towel, a perfume flask and a golden communion cup with white lilies, in soft golden light against a muted purple drape",
  intro: "This workbook helps you go back over the teaching at your own pace. Read each short section, meditate on the Scripture, and complete one simple activity. [Replace with a 2–3 sentence summary of the approved teaching.]",
  templateNotice: "TEMPLATE PREVIEW — highlighted [brackets] mark text to replace with the approved teaching. Sample narration uses a natural AI voice and must be replaced with VoicePrompt recordings before release.",
  teachingLabel: "The teaching",
  blankNamePhrase: "my loved ones",
  voice: { note: "Sample narration (natural AI voice). Replace with VoicePrompt recordings before release." },

  // Toned-down L137 poster palette: royal purple, warm gold and a touch of green on a light background.
  theme: {
    "bg": "#FAF8FC", "surface": "#FFFFFF", "ink": "#221A33", "ink-2": "#423A55", "muted": "#625A75", "heading": "#3E1F73",
    "line": "#E8E2F1", "line-strong": "#CFC5E0", "shadow": "rgba(62,31,115,.10)",
    "primary": "#4E2A8C", "primary-ink": "#3E1F73", "primary-soft": "#F0EBF8", "on-primary": "#FFFFFF",
    "accent": "#8F6B14", "accent-ink": "#735510", "accent-soft": "#FBF6E6", "on-accent": "#FFFFFF",
    "hot": "#3F7D5C", "hot-ink": "#2F6046", "hot-soft": "#EAF4EE",
    "ok": "#3F7D5C", "ok-soft": "#EAF4EE", "danger": "#A3322B", "danger-soft": "#FBEAE8",
    "warn": "#B8913A", "warn-soft": "#FFF7E3", "focus": "#C9A23F",
    "display-font": "'Playfair Display', 'Georgia', serif", "body-font": "'Nunito Sans', 'Segoe UI', sans-serif", "display-weight": "700"
  },
  // Light version of the same palette for the printable companion (paper is white).
  printTheme: {
    "primary": "#4E2A8C", "accent-ink": "#735510", "hot-ink": "#2F6046", "ink": "#221A33", "muted": "#625A75", "heading": "#3E1F73",
    "line-strong": "#CFC5E0", "primary-soft": "#F0EBF8", "accent-soft": "#FBF6E6", "hot-soft": "#EAF4EE", "warn-soft": "#FFF7E3"
  },
  printable: "downloads/L137-Workbook-Printable.pdf",


  openingAudio: "audio/00-welcome.mp3",
  sections: [
    {
      id: "s1", title: "Nothing Is Impossible With God",
      purpose: "Purpose: to anchor your faith in what God has said.",
      teaching: ["[Teaching point 1 — a concise summary of what Pastor Kiky taught, in plain language.]"],
      scripture: [{ ref: "Luke 1:37", text: "For with God nothing shall be impossible." }],
      activity: { label: "Reflect", prompt: "Which situation in your life are you bringing before God today?",
        fields: [{ id: "r1", label: "My situation", placeholder: "Write it in a few words…" }, { id: "r2", label: "What Luke 1:37 says to me about it" }] },
      audio: "audio/01-section.mp3"
    },
    {
      id: "s2", title: "Resisting the Enemy",
      purpose: "Purpose: to understand how to stand against the enemy.",
      teaching: ["[Teaching point 2 — summary of the teaching on standing against the enemy.]"],
      scripture: [
        { ref: "James 4:7", text: "Submit yourselves therefore to God. Resist the devil, and he will flee from you." },
        { ref: "Luke 10:19", text: "Behold, I give unto you power to tread on serpents and scorpions, and over all the power of the enemy: and nothing shall by any means hurt you." }
      ],
      activity: { type: "select", id: "steps", label: "Choose", prompt: "Which steps will you take this week? Tick all that apply.",
        options: ["Spend time in praise and worship", "Confess my sins to God", "Forgive the people who hurt me", "Read the Scriptures from this teaching aloud", "[Practical step from the teaching]"],
        fields: [{ id: "a1", label: "One thing I will do differently" }] },
      audio: "audio/02-section.mp3"
    },
    {
      id: "s3", title: "Protected and Covered",
      purpose: "Purpose: to rest in the protection God promises His servants.",
      teaching: ["[Teaching point 3 — summary of the teaching on God's protection and sealing with the blood of Jesus.]"],
      scripture: [
        { ref: "Isaiah 54:17", text: "No weapon that is formed against thee shall prosper; and every tongue that shall rise against thee in judgment thou shalt condemn. This is the heritage of the servants of the LORD, and their righteousness is of me, saith the LORD." },
        { ref: "Psalm 91:1-2", text: "He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty. I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust." }
      ],
      activity: { label: "Apply", prompt: "Write a short prayer of thanksgiving for God's protection.",
        fields: [{ id: "p1", label: "My prayer", placeholder: "Father, I thank You…" }] },
      audio: "audio/03-section.mp3"
    }
  ],

  quiz: {
    audio: "audio/04-quiz.mp3",
    beginner: [
      { q: "According to Luke 1:37, what shall be impossible with God?", options: ["Some things", "Nothing", "Only great things"], answer: 1, explain: "Luke 1:37 says, “For with God nothing shall be impossible.”" },
      { q: "James 4:7 says that when we resist the devil, he will…", options: ["Flee from you", "Argue with you", "Stay for a season"], answer: 0, explain: "“Resist the devil, and he will flee from you.” (James 4:7)" },
      { q: "In Isaiah 54:17, what happens to a weapon formed against the servants of the LORD?", options: ["It shall prosper for a time", "It shall not prosper", "It shall be hidden"], answer: 1, explain: "“No weapon that is formed against thee shall prosper.” (Isaiah 54:17)" }
    ],
    intermediate: [
      { q: "What must come first in James 4:7, before resisting the devil?", options: ["Fasting", "Submitting yourselves to God", "Naming the enemy"], answer: 1, explain: "The verse begins, “Submit yourselves therefore to God.” Resisting follows submission." },
      { q: "In Psalm 91:1, who abides under the shadow of the Almighty?", options: ["Everyone", "He that dwelleth in the secret place of the most High", "Only ministers"], answer: 1, explain: "The promise is to the one who dwells in the secret place of the most High." },
      { q: "[Intermediate question drawn from the teaching]", options: ["[Option A]", "[Option B]", "[Option C]"], answer: 0, explain: "[Explanation supported by the teaching or Scripture.]" }
    ],
    advanced: [
      { q: "A friend says, “My situation is too hard, even for God.” Which Scripture from this workbook answers this most directly?", options: ["Luke 1:37", "Psalm 91:2", "Isaiah 54:17"], answer: 0, explain: "Luke 1:37 speaks directly to impossibility: “For with God nothing shall be impossible.”" },
      { q: "Someone wants to resist the enemy but refuses to forgive. Based on the order in James 4:7, what is the first step?", options: ["Resist louder", "Submit to God, including obeying Him to forgive", "Wait for a sign"], answer: 1, explain: "James 4:7 places submission to God before resisting the devil. Obeying God includes forgiving others." },
      { q: "[Advanced scenario drawn from the teaching]", options: ["[Option A]", "[Option B]", "[Option C]"], answer: 0, explain: "[Explanation supported by the teaching or Scripture.]" }
    ]
  },

  // Keep declaration wording faithful to the service. {NAMES} is replaced with the user's loved ones.
  declarationsAudio: "audio/05-declarations.mp3",
  declarations: [
    { text: "In the name of Jesus, I declare that with God nothing shall be impossible for {NAMES}.", ref: "Luke 1:37" },
    { text: "In the name of Jesus, no weapon that is formed against {NAMES} shall prosper.", ref: "Isaiah 54:17" },
    { text: "In the name of Jesus, I cover {NAMES} with the blood of Jesus.", ref: "Sealing" },
    { text: "[Declaration exactly as spoken in the service. Write NAMES in braces where loved ones are named.]", ref: "[Reference]" }
  ],
  myWorkAudio: "audio/06-mywork.mp3",
  helpAudio: "audio/07-help.mp3",
  help: { contact: "" } // Add a real ministry contact only if supplied. Never invent one.
};
