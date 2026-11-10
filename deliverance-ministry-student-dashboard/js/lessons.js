// L137 Deliverance Ministry — Lesson Data
// All scriptures KJV. Anchor: Luke 1:37 "For with God nothing shall be impossible."

const LESSONS = [
  {
    id: "hour1",
    number: "01",
    title: "Hour One — Foundations of Deliverance",
    tagline: "The starting altar. Who we are, why we war, how we receive.",
    color: "#7a5cff",
    duration: "60 min teaching · 21-day journal",
    summary: "The foundational hour of the L137 ministry: the believer's authority in Christ, the legal grounds for deliverance, and how to walk in continual freedom.",
    keyScriptures: ["Luke 1:37", "Luke 10:19", "Mark 16:17", "Colossians 2:14-15"],
    documents: [
      { label: "Hour 1 — Teaching Workbook", file: "Hour1_Workbook.pdf", kind: "workbook" },
      { label: "Hour 1 — Clean Transcript", file: "Hour1_Cleaned_Transcript.pdf", kind: "transcript" },
      { label: "Hour 1 — Discussion Guide", file: "Hour1_Discussion_Guide.pdf", kind: "guide" },
      { label: "Hour 1 — Listening Worksheet", file: "Hour1_Listening_Worksheet.pdf", kind: "worksheet" },
      { label: "Hour 1 — Declaration Cards", file: "Hour1_Declaration_Cards.pdf", kind: "declarations" },
      { label: "21-Day Prayer Journal", file: "Hour1_21Day_Journal.pdf", kind: "journal" }
    ]
  },
  {
    id: "storm",
    number: "02",
    title: "The Storm Is Over",
    tagline: "Speaking peace to every raging season.",
    color: "#3b8dff",
    duration: "Single session",
    summary: "Christ rebukes the storm — and the same authority is given to the saints. This lesson teaches how to declare an end to recurring storms over family, finances and health.",
    keyScriptures: ["Mark 4:39", "Psalm 107:29", "Isaiah 43:2", "Psalm 46:1-3"],
    documents: [
      { label: "Storm Is Over — Workbook", file: "L137_Storm_Is_Over_Workbook.pdf", kind: "workbook" },
      { label: "Storm Is Over — Clean Transcript", file: "L137_Storm_Is_Over_Clean_Transcript.pdf", kind: "transcript" },
      { label: "Storm Is Over — Declarations Card", file: "L137_Storm_Is_Over_Declarations_Card.pdf", kind: "declarations" },
      { label: "Storm Is Over — Recall Sheet", file: "L137_Storm_Is_Over_Recall_Sheet.pdf", kind: "worksheet" },
      { label: "Prophetic Directions", file: "L137_Storm_Is_Over_Prophetic_Directions.pdf", kind: "guide" }
    ]
  },
  {
    id: "covenants1",
    number: "03",
    title: "Destroying Destructive Covenants — Part 1",
    tagline: "Identifying and breaking unholy agreements.",
    color: "#d4574a",
    summary: "What an evil covenant is, how it gives the enemy legal access, and the courtroom-of-heaven principles for renouncing and revoking them — by the Blood of Jesus.",
    keyScriptures: ["Isaiah 28:18", "Hosea 2:18", "Galatians 3:13", "Colossians 2:14-15", "Hebrews 12:24"],
    documents: [
      { label: "Destroying Evil Covenants — Workbook", file: "L137_Destroying_Evil_Covenants_Workbook.pdf", kind: "workbook", featured: true },
      { label: "Part 1 — Clean Transcript", file: "L137_Destroying_Evil_Covenants_Pt1_Clean_Transcript.pdf", kind: "transcript" },
      { label: "Part 1 — Declarations Card", file: "L137_Destroying_Evil_Covenants_Pt1_Declarations_Card.pdf", kind: "declarations" },
      { label: "Part 1 — Recall Sheet", file: "L137_Destroying_Evil_Covenants_Pt1_Recall_Sheet.pdf", kind: "worksheet" },
      { label: "Part 1 — Prophetic Directions", file: "L137_Destroying_Evil_Covenants_Pt1_Prophetic_Directions.pdf", kind: "guide" }
    ]
  },
  {
    id: "covenants2",
    number: "04",
    title: "Destroying Destructive Covenants — Part 2",
    tagline: "Generational, marital and territorial covenants.",
    color: "#c43a76",
    summary: "Continuing the teaching — uprooting bloodline covenants, idol-covenants, and word-of-mouth covenants. Includes the full prayer of revocation and replacement with the covenant of the Lamb.",
    keyScriptures: ["Exodus 20:5", "Ezekiel 18:20", "Jeremiah 1:10", "Matthew 15:13", "Romans 8:1"],
    documents: [
      { label: "Destroying Evil Covenants — Workbook", file: "L137_Destroying_Evil_Covenants_Workbook.pdf", kind: "workbook" },
      { label: "Part 2 — Clean Transcript", file: "L137_Destroying_Evil_Covenants_Pt2_Clean_Transcript.pdf", kind: "transcript" },
      { label: "Part 2 — Declarations Card", file: "L137_Destroying_Evil_Covenants_Pt2_Declarations_Card.pdf", kind: "declarations" },
      { label: "Part 2 — Recall Sheet", file: "L137_Destroying_Evil_Covenants_Pt2_Recall_Sheet.pdf", kind: "worksheet" },
      { label: "Part 2 — Prophetic Directions", file: "L137_Destroying_Evil_Covenants_Pt2_Prophetic_Directions.pdf", kind: "guide" }
    ]
  },
  {
    id: "leviathan",
    number: "05",
    title: "Deliverance From Leviathan",
    tagline: "Breaking the spirit of pride, twisting and confusion.",
    color: "#0d7a6f",
    duration: "Multi-session · 7-day devotional",
    summary: "The serpent of the sea: how Leviathan operates through pride, slander, marital strife, twisting of words and family altars. Full prayer arsenal for total deliverance.",
    keyScriptures: ["Job 41:1-34", "Psalm 74:13-14", "Isaiah 27:1", "James 4:6-10"],
    featured: true,
    documents: [
      { label: "Leviathan — Workbook (Session 1)", file: "Leviathan_Workbook_Session1.pdf", kind: "workbook", featured: true },
      { label: "Leviathan — Workbook (Session 1 Part 2)", file: "Leviathan_Workbook_Session1_Part2.pdf", kind: "workbook" },
      { label: "Leviathan — Prayer Journal", file: "Leviathan_Prayer_Journal.pdf", kind: "journal" },
      { label: "Leviathan — Scripture Reference Card", file: "Leviathan_Scripture_Reference_Card.pdf", kind: "scripture", featured: true },
      { label: "Leviathan — Declaration Cards", file: "Leviathan_Declaration_Cards.pdf", kind: "declarations" },
      { label: "Leviathan — Declaration Cards Part 2", file: "Leviathan_Declaration_Cards_Part2.pdf", kind: "declarations" },
      { label: "Daily Warfare Checklist", file: "Leviathan_Daily_Warfare_Checklist.pdf", kind: "worksheet" },
      { label: "7-Day Devotional", file: "Leviathan_7Day_Devotional.pdf", kind: "journal" },
      { label: "Maintaining Your Deliverance", file: "Leviathan_Maintaining_Deliverance.pdf", kind: "guide" }
    ]
  },
  {
    id: "jezebel",
    number: "06",
    title: "Deliverance From the Spirit of Jezebel",
    tagline: "Manipulation, control and false authority broken.",
    color: "#a13d8f",
    summary: "Recognising the operations of Jezebel in homes, ministries and workplaces — and praying through to deliverance with Elijah's authority and the wind of the Spirit.",
    keyScriptures: ["1 Kings 18:36-40", "1 Kings 21:7-25", "2 Kings 9:30-37", "Revelation 2:20-23"],
    documents: [
      { label: "Deliverance from Jezebel — Full Guide", file: "Deliverance_from_the_Spirit_of_Jezebel.pdf", kind: "workbook", featured: true }
    ]
  },
  {
    id: "spirit-spouse",
    number: "07",
    title: "Deliverance From Spirit Spouse",
    tagline: "Severing every illegitimate marriage covenant.",
    color: "#b25a2a",
    summary: "Step-by-step prayer directions to renounce, sever and burn every spirit-husband or spirit-wife covenant — restoring fruitfulness, intimacy and peace.",
    keyScriptures: ["Hosea 2:2", "Isaiah 4:1", "Matthew 19:6", "Romans 7:2"],
    documents: [
      { label: "Spirit Spouse — Prayer Directions", file: "Deliverance_from_Spirit_Spouse_Directions.pdf", kind: "guide", featured: true }
    ]
  },
  {
    id: "tongue",
    number: "08",
    title: "Deliverance From the Sins of the Tongue",
    tagline: "Bridling the rudder that steers the soul.",
    color: "#5e6a82",
    summary: "Gossip, slander, complaint, cursing oneself — how the tongue creates altars, and how to dismantle every word-covenant that has gone forth against destiny.",
    keyScriptures: ["James 3:5-10", "Proverbs 18:21", "Matthew 12:36-37", "Psalm 141:3"],
    documents: [
      { label: "Sins of the Tongue — Workbook", file: "Deliverance_From_the_Sins_of_the_Tongue_Workbook.pdf", kind: "workbook", featured: true }
    ]
  },
  {
    id: "helpers",
    number: "09",
    title: "Calling Forth Divine Helpers",
    tagline: "Summoning ordained helpers of destiny.",
    color: "#c98a1f",
    summary: "Every assignment of God has helpers attached. This teaching calls every scattered helper home, by the order of God, in Jesus' name.",
    keyScriptures: ["Genesis 2:18", "Ecclesiastes 4:9-10", "Exodus 17:12", "1 Samuel 14:6-7"],
    documents: [
      { label: "Calling Forth Helpers — Booklet", file: "L137_Calling_Forth_Helpers_Booklet.pdf", kind: "workbook", featured: true }
    ]
  },
  {
    id: "strongman",
    number: "10",
    title: "Overcoming the Strong Man",
    tagline: "Binding, plundering and occupying.",
    color: "#2f4a6b",
    summary: "Identifying ruling strongmen over a life or a household, binding them by the finger of God, and recovering everything they have stolen.",
    keyScriptures: ["Matthew 12:29", "Luke 11:21-22", "Isaiah 49:24-25", "2 Corinthians 10:4-5"],
    documents: [
      { label: "Overcoming the Strong Man — Prayer Guide", file: "Overcoming_the_Strong_Man_Prayer_Guide.docx", kind: "guide", featured: true },
      { label: "Spiritual Warfare Journal", file: "Spiritual_Warfare_Journal.docx", kind: "journal" },
      { label: "Armor of God — Infographic", file: "Armor_of_God_Infographic.pdf", kind: "guide" },
      { label: "Armor of God — Visual Devotional", file: "Armor_of_God_Visual_Devotional.pdf", kind: "journal" },
      { label: "Declarations & Decrees Card Deck", file: "Declarations_Decrees_Card_Deck.pdf", kind: "declarations" },
      { label: "Scripture Memory Pack", file: "Scripture_Memory_Pack.pdf", kind: "scripture" },
      { label: "Pocket Prayer Card", file: "Pocket_Prayer_Card.pdf", kind: "declarations" }
    ]
  },
  {
    id: "altars",
    number: "11",
    title: "Pulling Down Evil Altars",
    tagline: "Dismantling ancestral and territorial altars.",
    color: "#7d2e2e",
    summary: "Every altar speaks. This lesson walks the student through silencing every altar of the father's house and raising the altar of Christ in its place.",
    keyScriptures: ["Judges 6:25-27", "Exodus 34:13", "Deuteronomy 7:5", "Hebrews 12:24"],
    documents: [
      { label: "Pulling Down Altars — Prayer Guide", file: "Pulling_Down_Altars_Prayer_Guide.docx", kind: "guide", featured: true },
      { label: "Intake Form (Printable)", file: "Intake_Form_Printable.pdf", kind: "worksheet" }
    ]
  }
];

// ---- Foundational prayer sheets always available ----
const FOUNDATIONAL_SHEETS = [
  { label: "Daily Self-Deliverance Guide", file: "Daily_Self_Deliverance_Guide.pdf", description: "Morning prayer arsenal for personal deliverance." },
  { label: "Confession, Repentance & Renunciation Prayer Guide", file: "Confession_Repentance_Renunciation_Prayer_Guide.pdf", description: "The foundational three-step prayer used in every L137 deliverance session." },
  { label: "Pocket Prayer Card", file: "Pocket_Prayer_Card.pdf", description: "Carry-with-you declarations for spiritual warfare." },
  { label: "Scripture Memory Pack", file: "Scripture_Memory_Pack.pdf", description: "21 KJV scriptures every intercessor should know by heart." },
  { label: "Armor of God — Infographic", file: "Armor_of_God_Infographic.pdf", description: "Ephesians 6 visual reference for daily covering." },
  { label: "Declarations & Decrees Card Deck", file: "Declarations_Decrees_Card_Deck.pdf", description: "Printable card deck for spoken authority." }
];

// ---- Scripture library (KJV) used across lessons ----
const SCRIPTURE_LIBRARY = [
  {
    category: "The Ministry Anchor",
    verses: [
      { ref: "Luke 1:37", text: "For with God nothing shall be impossible." }
    ]
  },
  {
    category: "Authority of the Believer",
    verses: [
      { ref: "Luke 10:19", text: "Behold, I give unto you power to tread on serpents and scorpions, and over all the power of the enemy: and nothing shall by any means hurt you." },
      { ref: "Mark 16:17", text: "And these signs shall follow them that believe; In my name shall they cast out devils; they shall speak with new tongues." },
      { ref: "Matthew 18:18", text: "Verily I say unto you, Whatsoever ye shall bind on earth shall be bound in heaven: and whatsoever ye shall loose on earth shall be loosed in heaven." },
      { ref: "James 4:7", text: "Submit yourselves therefore to God. Resist the devil, and he will flee from you." }
    ]
  },
  {
    category: "Destroying Destructive Covenants",
    verses: [
      { ref: "Isaiah 28:18", text: "And your covenant with death shall be disannulled, and your agreement with hell shall not stand; when the overflowing scourge shall pass through, then ye shall be trodden down by it." },
      { ref: "Hosea 2:18", text: "And in that day will I make a covenant for them with the beasts of the field, and with the fowls of heaven, and with the creeping things of the ground: and I will break the bow and the sword and the battle out of the earth, and will make them to lie down safely." },
      { ref: "Galatians 3:13", text: "Christ hath redeemed us from the curse of the law, being made a curse for us: for it is written, Cursed is every one that hangeth on a tree." },
      { ref: "Colossians 2:14-15", text: "Blotting out the handwriting of ordinances that was against us, which was contrary to us, and took it out of the way, nailing it to his cross; And having spoiled principalities and powers, he made a shew of them openly, triumphing over them in it." },
      { ref: "Hebrews 12:24", text: "And to Jesus the mediator of the new covenant, and to the blood of sprinkling, that speaketh better things than that of Abel." },
      { ref: "Hebrews 9:14", text: "How much more shall the blood of Christ, who through the eternal Spirit offered himself without spot to God, purge your conscience from dead works to serve the living God?" }
    ]
  },
  {
    category: "Leviathan & the Spirit of Pride",
    verses: [
      { ref: "Job 41:1-2", text: "Canst thou draw out leviathan with an hook? or his tongue with a cord which thou lettest down? Canst thou put an hook into his nose? or bore his jaw through with a thorn?" },
      { ref: "Psalm 74:13-14", text: "Thou didst divide the sea by thy strength: thou brakest the heads of the dragons in the waters. Thou brakest the heads of leviathan in pieces, and gavest him to be meat to the people inhabiting the wilderness." },
      { ref: "Isaiah 27:1", text: "In that day the LORD with his sore and great and strong sword shall punish leviathan the piercing serpent, even leviathan that crooked serpent; and he shall slay the dragon that is in the sea." },
      { ref: "James 4:6", text: "But he giveth more grace. Wherefore he saith, God resisteth the proud, but giveth grace unto the humble." },
      { ref: "Proverbs 16:18", text: "Pride goeth before destruction, and an haughty spirit before a fall." }
    ]
  },
  {
    category: "The Blood of Jesus",
    verses: [
      { ref: "Revelation 12:11", text: "And they overcame him by the blood of the Lamb, and by the word of their testimony; and they loved not their lives unto the death." },
      { ref: "1 John 1:7", text: "But if we walk in the light, as he is in the light, we have fellowship one with another, and the blood of Jesus Christ his Son cleanseth us from all sin." },
      { ref: "Ephesians 1:7", text: "In whom we have redemption through his blood, the forgiveness of sins, according to the riches of his grace." }
    ]
  },
  {
    category: "Pulling Down Strongholds",
    verses: [
      { ref: "2 Corinthians 10:4-5", text: "(For the weapons of our warfare are not carnal, but mighty through God to the pulling down of strong holds;) Casting down imaginations, and every high thing that exalteth itself against the knowledge of God, and bringing into captivity every thought to the obedience of Christ." },
      { ref: "Jeremiah 1:10", text: "See, I have this day set thee over the nations and over the kingdoms, to root out, and to pull down, and to destroy, and to throw down, to build, and to plant." },
      { ref: "Matthew 15:13", text: "But he answered and said, Every plant, which my heavenly Father hath not planted, shall be rooted up." }
    ]
  }
];
