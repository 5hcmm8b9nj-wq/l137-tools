// KJV Reading Workbook — Lesson Data
// Each lesson: warmUp (5 short words), newWords (word + meaning), verse (KJV, split into lines),
// declaration (repeat-after-me), remember (3 questions), prayer.

window.LESSONS = [
  {
    id: 1,
    title: "God is Love",
    reference: "1 John 4:8",
    warmUp: ["God", "is", "he", "not", "know"],
    newWords: [
      { word: "God",  meaning: "Our Father in heaven." },
      { word: "is",   meaning: "A word that means: this is what it is." },
      { word: "love", meaning: "The kind heart of God toward us." },
      { word: "he",   meaning: "A word for a man — here, for God." },
      { word: "that", meaning: "Points to a thing already spoken." },
      { word: "not",  meaning: "Means: no, it is not so." },
      { word: "know", meaning: "To be sure of something in your heart." },
      { word: "for",  meaning: "Tells us the reason why." }
    ],
    verse: [
      "He that loveth not knoweth not God;",
      "for God is love."
    ],
    fullVerse: "He that loveth not knoweth not God; for God is love.",
    declaration: [
      "God is love.",
      "God loves me.",
      "I know God because I love."
    ],
    remember: [
      { q: "What is God?",              choices: ["Far", "Love", "Angry"], answer: 1 },
      { q: "Who loves us?",             choices: ["God", "Fear", "No one"], answer: 0 },
      { q: "How do we know God?",       choices: ["By hate", "By love", "By fear"], answer: 1 }
    ],
    prayer: "Father, thank You that You are love. Teach me to know You and to love. In Jesus' name, Amen."
  },
  {
    id: 2,
    title: "The Lord is My Shepherd",
    reference: "Psalm 23:1",
    warmUp: ["Lord", "my", "is", "not", "want"],
    newWords: [
      { word: "the",      meaning: "Points to one special thing." },
      { word: "Lord",     meaning: "A name for God — our Master." },
      { word: "is",       meaning: "Means: this is what he is." },
      { word: "my",       meaning: "Belongs to me." },
      { word: "shepherd", meaning: "One who cares for the sheep — God cares for me." },
      { word: "I",        meaning: "The person speaking — me." },
      { word: "shall",    meaning: "Will surely happen." },
      { word: "not",      meaning: "Means: no, it is not so." },
      { word: "want",     meaning: "To lack or be without." }
    ],
    verse: [
      "The Lord is my shepherd;",
      "I shall not want."
    ],
    fullVerse: "The Lord is my shepherd; I shall not want.",
    declaration: [
      "The Lord is my shepherd.",
      "He takes care of me.",
      "I shall not want."
    ],
    remember: [
      { q: "Who is my shepherd?", choices: ["A man", "The Lord", "No one"], answer: 1 },
      { q: "What shall I not do?", choices: ["Want", "Sing", "Run"], answer: 0 },
      { q: "Who takes care of me?", choices: ["The Lord", "Fear", "The world"], answer: 0 }
    ],
    prayer: "Lord, thank You for being my Shepherd. You take care of me. I shall not want. In Jesus' name, Amen."
  },
  {
    id: 3,
    title: "I Am the Light of the World",
    reference: "John 8:12",
    warmUp: ["I", "am", "of", "the", "life"],
    newWords: [
      { word: "I",        meaning: "The person speaking — here, Jesus." },
      { word: "am",       meaning: "Means: this is who I am." },
      { word: "the",      meaning: "Points to one special thing." },
      { word: "light",    meaning: "What takes away the dark." },
      { word: "of",       meaning: "Tells whose it is." },
      { word: "world",    meaning: "All the earth and all people." },
      { word: "follow",   meaning: "To walk after someone." },
      { word: "not",      meaning: "Means: no, it is not so." },
      { word: "walk",     meaning: "To go step by step." },
      { word: "darkness", meaning: "When there is no light." }
    ],
    verse: [
      "I am the light of the world:",
      "he that followeth me shall not walk in darkness,",
      "but shall have the light of life."
    ],
    fullVerse: "I am the light of the world: he that followeth me shall not walk in darkness, but shall have the light of life.",
    declaration: [
      "Jesus is the light of the world.",
      "I follow Jesus.",
      "I do not walk in darkness.",
      "I have the light of life."
    ],
    remember: [
      { q: "Who is the light?", choices: ["The sun", "Jesus", "A man"], answer: 1 },
      { q: "If I follow Jesus, I do not walk in…", choices: ["Light", "Darkness", "Peace"], answer: 1 },
      { q: "What do I have?", choices: ["The light of life", "Fear", "Nothing"], answer: 0 }
    ],
    prayer: "Jesus, You are the Light of the world. I follow You. I will not walk in darkness. Fill me with Your light. Amen."
  },
  {
    id: 4,
    title: "The Lord is My Rock",
    reference: "Psalm 18:2",
    warmUp: ["Lord", "my", "rock", "God", "trust"],
    newWords: [
      { word: "Lord",     meaning: "A name for God — our Master." },
      { word: "rock",     meaning: "A strong stone that does not move." },
      { word: "fortress", meaning: "A strong safe place." },
      { word: "deliverer",meaning: "One who saves us." },
      { word: "God",      meaning: "Our Father in heaven." },
      { word: "strength", meaning: "Power to stand strong." },
      { word: "trust",    meaning: "To lean on with your whole heart." },
      { word: "in",       meaning: "Inside of, resting on." }
    ],
    verse: [
      "The Lord is my rock,",
      "and my fortress, and my deliverer;",
      "my God, my strength,",
      "in whom I will trust."
    ],
    fullVerse: "The Lord is my rock, and my fortress, and my deliverer; my God, my strength, in whom I will trust.",
    declaration: [
      "The Lord is my rock.",
      "The Lord is my fortress.",
      "The Lord is my deliverer.",
      "In Him I will trust."
    ],
    remember: [
      { q: "What is the Lord to me?", choices: ["A rock", "A cloud", "A leaf"], answer: 0 },
      { q: "Who is my deliverer?", choices: ["A friend", "The Lord", "Money"], answer: 1 },
      { q: "In whom will I trust?", choices: ["The Lord", "Myself", "The world"], answer: 0 }
    ],
    prayer: "Lord, You are my Rock, my Fortress, my Deliverer. I trust in You. In Jesus' name, Amen."
  },
  {
    id: 5,
    title: "With God Nothing Shall Be Impossible",
    reference: "Luke 1:37",
    warmUp: ["for", "with", "God", "shall", "be"],
    newWords: [
      { word: "for",         meaning: "Tells us the reason why." },
      { word: "with",        meaning: "Together — by the side of." },
      { word: "God",         meaning: "Our Father in heaven." },
      { word: "nothing",     meaning: "Not one thing." },
      { word: "shall",       meaning: "Will surely happen." },
      { word: "be",          meaning: "To exist, to happen." },
      { word: "impossible",  meaning: "Cannot be done." }
    ],
    verse: [
      "For with God",
      "nothing shall be impossible."
    ],
    fullVerse: "For with God nothing shall be impossible.",
    declaration: [
      "With God, nothing is impossible.",
      "God is with me.",
      "Nothing shall stop me."
    ],
    remember: [
      { q: "With God, what is impossible?", choices: ["Everything", "Nothing", "Some things"], answer: 1 },
      { q: "Who is with me?", choices: ["No one", "God", "Fear"], answer: 1 },
      { q: "What shall be?", choices: ["Impossible", "Possible", "Nothing"], answer: 2 }
    ],
    prayer: "Father, thank You that with You nothing shall be impossible. I trust You today. In Jesus' name, Amen."
  },
  {
    id: 6,
    title: "By His Stripes I Am Healed",
    reference: "Isaiah 53:5",
    warmUp: ["he", "was", "for", "our", "with"],
    newWords: [
      { word: "he",       meaning: "A word for a man — here, Jesus." },
      { word: "was",      meaning: "Happened in the past." },
      { word: "wounded",  meaning: "Hurt in the body." },
      { word: "our",      meaning: "Belongs to us all." },
      { word: "sins",     meaning: "Wrong things we have done." },
      { word: "with",     meaning: "By, together with." },
      { word: "stripes",  meaning: "Marks from a whip on the back." },
      { word: "we",       meaning: "Me and others together." },
      { word: "are",      meaning: "Right now, this is so." },
      { word: "healed",   meaning: "Made well and whole." }
    ],
    verse: [
      "He was wounded for our transgressions,",
      "he was bruised for our iniquities:",
      "the chastisement of our peace was upon him;",
      "and with his stripes we are healed."
    ],
    fullVerse: "He was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed.",
    declaration: [
      "Jesus was wounded for me.",
      "By His stripes I am healed.",
      "I receive my healing now."
    ],
    remember: [
      { q: "Why was Jesus wounded?", choices: ["For our sins", "For fun", "For nothing"], answer: 0 },
      { q: "By His stripes we are…", choices: ["Hurt", "Healed", "Alone"], answer: 1 },
      { q: "Who took our sins?", choices: ["Jesus", "We did", "No one"], answer: 0 }
    ],
    prayer: "Jesus, thank You that You were wounded for me. By Your stripes I am healed. I receive my healing now. Amen."
  },
  {
    id: 7,
    title: "I Can Do All Things Through Christ",
    reference: "Philippians 4:13",
    warmUp: ["I", "can", "do", "all", "me"],
    newWords: [
      { word: "I",          meaning: "The person speaking — me." },
      { word: "can",        meaning: "Am able to." },
      { word: "do",         meaning: "To carry out, to make happen." },
      { word: "all",        meaning: "Every one, without leaving any." },
      { word: "things",     meaning: "The tasks or matters before me." },
      { word: "through",    meaning: "By the help of." },
      { word: "Christ",     meaning: "Jesus, our Saviour and King." },
      { word: "which",      meaning: "The one who." },
      { word: "strengtheneth", meaning: "Gives me strength." },
      { word: "me",         meaning: "The person speaking — myself." }
    ],
    verse: [
      "I can do all things",
      "through Christ",
      "which strengtheneth me."
    ],
    fullVerse: "I can do all things through Christ which strengtheneth me.",
    declaration: [
      "I can do all things.",
      "Christ strengthens me.",
      "I am not weak — I am strong in Him."
    ],
    remember: [
      { q: "How many things can I do?", choices: ["All", "None", "A few"], answer: 0 },
      { q: "Through whom?", choices: ["Christ", "Myself", "Others"], answer: 0 },
      { q: "Who strengthens me?", choices: ["Christ", "No one", "The world"], answer: 0 }
    ],
    prayer: "Lord Jesus, You strengthen me. I can do all things through You. Thank You for Your strength today. Amen."
  },
  {
    id: 8,
    title: "The Lord is My Helper",
    reference: "Hebrews 13:6",
    warmUp: ["Lord", "is", "my", "will", "not"],
    newWords: [
      { word: "Lord",     meaning: "A name for God — our Master." },
      { word: "is",       meaning: "This is what He is." },
      { word: "my",       meaning: "Belongs to me." },
      { word: "helper",   meaning: "One who helps me." },
      { word: "I",        meaning: "The person speaking — me." },
      { word: "will",     meaning: "I choose to." },
      { word: "not",      meaning: "Means: no, it is not so." },
      { word: "fear",     meaning: "To be afraid." },
      { word: "what",     meaning: "Which thing." },
      { word: "man",      meaning: "A person on earth." }
    ],
    verse: [
      "The Lord is my helper,",
      "and I will not fear",
      "what man shall do unto me."
    ],
    fullVerse: "The Lord is my helper, and I will not fear what man shall do unto me.",
    declaration: [
      "The Lord is my helper.",
      "I will not fear.",
      "No man can harm me — the Lord is with me."
    ],
    remember: [
      { q: "Who is my helper?", choices: ["A man", "The Lord", "No one"], answer: 1 },
      { q: "What will I not do?", choices: ["Fear", "Sing", "Pray"], answer: 0 },
      { q: "Who has real power over me?", choices: ["Man", "The Lord", "Fear"], answer: 1 }
    ],
    prayer: "Lord, You are my Helper. I will not fear. Thank You for being with me today. In Jesus' name, Amen."
  },
  {
    id: 9,
    title: "The Joy of the Lord is My Strength",
    reference: "Nehemiah 8:10",
    warmUp: ["for", "the", "joy", "of", "is"],
    newWords: [
      { word: "for",      meaning: "Tells us the reason why." },
      { word: "the",      meaning: "Points to one special thing." },
      { word: "joy",      meaning: "Deep gladness inside." },
      { word: "of",       meaning: "Tells whose it is." },
      { word: "Lord",     meaning: "A name for God — our Master." },
      { word: "is",       meaning: "This is what it is." },
      { word: "your",     meaning: "Belongs to you." },
      { word: "strength", meaning: "Power to stand strong." },
      { word: "neither",  meaning: "And also not." },
      { word: "sorry",    meaning: "Sad in the heart." }
    ],
    verse: [
      "Neither be ye sorry;",
      "for the joy of the Lord",
      "is your strength."
    ],
    fullVerse: "Neither be ye sorry; for the joy of the Lord is your strength.",
    declaration: [
      "The joy of the Lord is my strength.",
      "I will not be sorry.",
      "I am strong in the Lord."
    ],
    remember: [
      { q: "What is my strength?", choices: ["The joy of the Lord", "My money", "My work"], answer: 0 },
      { q: "What should I not be?", choices: ["Sorry", "Glad", "Strong"], answer: 0 },
      { q: "Whose joy?", choices: ["The Lord's", "The world's", "Mine alone"], answer: 0 }
    ],
    prayer: "Father, Your joy is my strength. I will not be sorry. I choose joy in You today. In Jesus' name, Amen."
  },
  {
    id: 10,
    title: "Jesus Christ the Same Yesterday, Today, and Forever",
    reference: "Hebrews 13:8",
    warmUp: ["Jesus", "the", "same", "and", "for"],
    newWords: [
      { word: "Jesus",     meaning: "Our Saviour, the Son of God." },
      { word: "Christ",    meaning: "The Anointed One, our King." },
      { word: "the",       meaning: "Points to one special thing." },
      { word: "same",      meaning: "Not changed — still the very one." },
      { word: "yesterday", meaning: "The day before today." },
      { word: "today",     meaning: "This day now." },
      { word: "and",       meaning: "Joins two things together." },
      { word: "for",       meaning: "Toward, going on to." },
      { word: "ever",      meaning: "Always, without end." }
    ],
    verse: [
      "Jesus Christ",
      "the same yesterday,",
      "and to day,",
      "and for ever."
    ],
    fullVerse: "Jesus Christ the same yesterday, and to day, and for ever.",
    declaration: [
      "Jesus Christ is the same.",
      "The Jesus of yesterday is the Jesus of today.",
      "He is the same for ever.",
      "He will never change on me."
    ],
    remember: [
      { q: "How is Jesus today?", choices: ["Different", "The same", "Gone"], answer: 1 },
      { q: "For how long is He the same?", choices: ["A week", "For ever", "One year"], answer: 1 },
      { q: "Who is the same yesterday, today, and for ever?", choices: ["Jesus Christ", "Man", "The world"], answer: 0 }
    ],
    prayer: "Jesus, You are the same yesterday, today, and for ever. You will never change on me. I trust You always. Amen."
  }
];
