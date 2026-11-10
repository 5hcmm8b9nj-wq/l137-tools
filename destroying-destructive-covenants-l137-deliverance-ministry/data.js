// Course data — built directly from the transcript of Pastor Kiki's
// teaching at L137 Deliverance Ministry (Luke 1:37 — "For with God nothing shall be impossible")
// Session: "Destroying Destructive Covenants — Part 1"
// Each module corresponds to a movement of the live session.

window.COURSE_DATA = {
  course: {
    code: "L137",
    title: "Destroying Destructive Covenants — A Deliverance Course",
    term: "Part 1 · Live Teaching · ~2h 43m",
    instructor: "Pastor Kiki · L137 Deliverance Ministry",
    credits: "Part 1 of 2",
    description:
      "A faithful study guide built from Pastor Kiki's live Clubhouse teaching on breaking destructive covenants. The session moves from thanksgiving and repentance, through the doctrine of covenants (physical, spiritual, godly and evil), into corporate renunciation, anointing, and post-session homework. Use this dashboard to revisit each movement, study the scriptures cited live, and track the practical assignments Pastor Kiki gave the cohort.",
    meetingTime: "Mon · Wed · Sat — 12:00 AM GMT / 7:00 PM EST",
    office: "Connect via L137 WhatsApp · Clubhouse: L137 Deliverance Ministry",
    motto: "Luke 1:37 — For with God nothing shall be impossible.",
  },

  // The transcript itself implicitly establishes "grading" as engagement criteria
  // for the deliverance journey rather than academic marks.
  grading: [
    {
      component: "Live Participation",
      weight: 20,
      description: "Attend Part 1 (Saturday) and Part 2 (Monday) live on Clubhouse with mic unmuted to declare prayer points aloud.",
    },
    {
      component: "Renunciation List (Homework)",
      weight: 25,
      description: "Write down names of partners, ex-spouses, persons you sent money to, and altars you were taken to — knowingly or unknowingly. Renounce each by name (00:19:25 marker).",
    },
    {
      component: "Daily Thanksgiving Practice",
      weight: 15,
      description: "Make thanksgiving a habit — Psalm 92:1. Open every personal prayer with gratitude before petition.",
    },
    {
      component: "Scripture Internalisation",
      weight: 15,
      description: "Meditate on the eight anchor scriptures cited in the teaching. Be able to recite at least three from memory.",
    },
    {
      component: "Dream Journal",
      weight: 10,
      description: "Record any dreams in which the Lord reveals a hidden covenant or unresolved soul tie (Pastor Kiki: 'The Lord will show you Himself in your dream' — 02:21:51).",
    },
    {
      component: "Salvation / Re-dedication",
      weight: 15,
      description: "If not yet born again, pray the salvation prayer from 02:32:28. Mark the date in your Bible as the day of new beginnings.",
    },
  ],

  // "Grading scale" reframed as a self-assessment of spiritual posture
  gradeScale: [
    { letter: "Free",       range: "All chains broken",   gpa: "Walking in victory" },
    { letter: "Released",   range: "Major covenants renounced", gpa: "Steady progress" },
    { letter: "Engaged",    range: "Actively praying",     gpa: "In the battle" },
    { letter: "Awakening",  range: "Beginning the work",   gpa: "First steps" },
    { letter: "Inquiring",  range: "Seeking understanding", gpa: "Open heart" },
    { letter: "New",        range: "Just born again",      gpa: "Clean slate" },
  ],

  // Each "week" is actually a movement / module of the live session.
  // dates field = the timestamp range in the recording so students can scrub to it.
  weeks: [
    {
      n: 1,
      title: "Opening Thanksgiving & Activating God's Presence",
      dates: "00:00 – 00:18 · Praise & Gratitude",
      theme: "Thanksgiving",
      objectives: [
        "Enter prayer through the gate of thanksgiving (Psalm 100:4) before making any petition.",
        "Read and meditate on Psalm 92:1–15 — 'It is a good thing to give thanks unto the Lord.'",
        "Focus thanksgiving on five specific things: being alive, breath, sight, movement, family.",
        "Activate the Lord's presence in your atmosphere — home, workplace, car — wherever you are.",
      ],
      readings: [
        { title: "Psalm 100:4", type: "Scripture", kjv: "Enter into his gates with thanksgiving, and into his courts with praise: be thankful unto him, and bless his name." },
        { title: "Psalm 92:1–5", type: "Scripture", kjv: "It is a good thing to give thanks unto the Lord, and to sing praises unto thy name, O most High: To shew forth thy lovingkindness in the morning, and thy faithfulness every night, Upon an instrument of ten strings, and upon the psaltery; upon the harp with a solemn sound. For thou, Lord, hast made me glad through thy work: I will triumph in the works of thy hands. O Lord, how great are thy works! and thy thoughts are very deep." },
        { title: "Read the Psalm aloud with your mic unmuted", type: "Practice" },
      ],
      assignment: {
        title: "Begin tomorrow with five minutes of thanksgiving before any petition",
        due: "Daily habit",
        points: 50,
      },
      summary:
        "Pastor Kiki opens the session by establishing thanksgiving as the prerequisite to deliverance prayer. Quoting Psalm 100:4, she insists the congregation 'enter His gates with thanksgiving' before any battle is engaged. She turns to Psalm 92 and walks through its declaration that the righteous 'shall be planted in the house of the Lord' and 'flourish in the courts of our God' — even bringing forth fruit in old age. Her pastoral exhortation: 'Those that take thanksgiving as their habit will continuously see the hand of the Lord upon their life and upon their destiny.' She instructs participants to unmute and thank God specifically for life, family, provision, and protection. This is not preliminary warm-up — it is doctrinally the doorway into everything that follows.",
    },
    {
      n: 2,
      title: "Repentance — Removing the Enemy's Legal Ground",
      dates: "00:19 – 00:24 · Confession & Cleansing",
      theme: "Repentance",
      objectives: [
        "Confess sin so no barrier remains between you and the deliverance to come.",
        "Cast off bitterness, wrath, anger, and evil-speaking (Ephesians 4:31–32).",
        "Trust the promise of cleansing — God casts sin into the depths of the sea (Micah 7:19).",
        "Recognise that unconfessed sin gives the enemy legal ground to accuse.",
      ],
      readings: [
        { title: "Psalm 32:1–2", type: "Scripture", kjv: "Blessed is he whose transgression is forgiven, whose sin is covered. Blessed is the man unto whom the Lord imputeth not iniquity, and in whose spirit there is no guile." },
        { title: "Ephesians 4:31–32", type: "Scripture", kjv: "Let all bitterness, and wrath, and anger, and clamour, and evil speaking, be put away from you, with all malice: And be ye kind one to another, tenderhearted, forgiving one another, even as God for Christ's sake hath forgiven you." },
        { title: "Micah 7:19", type: "Scripture", kjv: "He will turn again, he will have compassion upon us; he will subdue our iniquities; and thou wilt cast all their sins into the depths of the sea." },
        { title: "1 John 1:9", type: "Scripture", kjv: "If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness." },
      ],
      assignment: {
        title: "Aloud confession of every known sin, especially bitterness and unforgiveness",
        due: "Before Part 2",
        points: 75,
      },
      summary:
        "Before warfare can begin, Pastor Kiki leads the congregation through corporate repentance. She frames sin as legal ground that the enemy uses to accuse, and quotes Ephesians 4:31–32 to specifically name bitterness, wrath, anger, and evil-speaking as the postures that 'will hinder my prayers and my open heavens.' Citing Micah 7:19, she reassures: 'He will cast all our sins into the depths of the sea.' Participants are instructed to unmute and acknowledge sin aloud — 'Father, forgive me of every sin that I've committed, O Lord. Every hidden sin, O Lord, let it be wiped off.' The cleansing is corporate but the confession is personal.",
    },
    {
      n: 3,
      title: "Inviting the Holy Ghost — Baptism of Fire",
      dates: "00:25 – 00:31 · Holy Spirit Invocation",
      theme: "Invocation",
      objectives: [
        "Invite the Holy Spirit to go ahead of you and prepare the ground.",
        "Receive the baptism of fire that destroys the yokes of the wicked (Matthew 3:11).",
        "Pray in tongues if you have the gift; otherwise call on the Spirit in your own words.",
        "Ask the Spirit to reveal covenants you have forgotten or never knew existed.",
      ],
      readings: [
        { title: "Matthew 3:11", type: "Scripture", kjv: "I indeed baptize you with water unto repentance: but he that cometh after me is mightier than I, whose shoes I am not worthy to bear: he shall baptize you with the Holy Ghost, and with fire." },
        { title: "Acts 2:1–4", type: "Scripture", kjv: "And when the day of Pentecost was fully come, they were all with one accord in one place. And suddenly there came a sound from heaven as of a rushing mighty wind, and it filled all the house where they were sitting. And there appeared unto them cloven tongues like as of fire, and it sat upon each of them. And they were all filled with the Holy Ghost, and began to speak with other tongues, as the Spirit gave them utterance." },
      ],
      assignment: {
        title: "Spend 10 minutes in tongues or Spirit-led prayer asking for revelation",
        due: "Before next module",
        points: 50,
      },
      summary:
        "The third movement of the session invokes the Holy Ghost as the agent of deliverance. Pastor Kiki anchors this in Matthew 3:11 — 'He shall baptize you with the Holy Ghost and with fire' — and explains that 'Holy Ghost fire is the anointing of the Lord to destroy the yokes of the wicked.' She asks the Spirit specifically to do three things: go ahead of the congregation, destroy every barrier and hindrance, and reveal forgotten covenants. The room is led into tongues. This is the pivot — from preparation (thanks, repentance) into engagement (revelation, renunciation).",
    },
    {
      n: 4,
      title: "What Are Destructive Covenants? — Doctrine & Definition",
      dates: "00:31 – 00:38 · Teaching",
      theme: "Doctrine",
      objectives: [
        "Define a covenant: an agreement or contract between two or more parties, with a condition attached.",
        "Distinguish godly covenants (with God) from evil covenants (with darkness, knowingly or unknowingly).",
        "Understand that every covenant carries a binding condition — break the condition without authority and the penalty falls on you.",
        "Recognise that evil covenants release demons to enforce the contract terms.",
      ],
      readings: [
        { title: "Colossians 2:14–15", type: "Scripture", kjv: "Blotting out the handwriting of ordinances that was against us, which was contrary to us, and took it out of the way, nailing it to his cross; And having spoiled principalities and powers, he made a shew of them openly, triumphing over them in it." },
        { title: "Galatians 3:13–14", type: "Scripture", kjv: "Christ hath redeemed us from the curse of the law, being made a curse for us: for it is written, Cursed is every one that hangeth on a tree: That the blessing of Abraham might come on the Gentiles through Jesus Christ; that we might receive the promise of the Spirit through faith." },
        { title: "Genesis 31:44", type: "Scripture", kjv: "Now therefore come thou, let us make a covenant, I and thou; and let it be for a witness between me and thee." },
      ],
      assignment: {
        title: "Reflection: Write a one-page personal definition of 'destructive covenant' in your own words",
        due: "Before Part 2",
        points: 75,
      },
      summary:
        "This is the doctrinal core of the teaching. Pastor Kiki defines a covenant as 'an agreement or contract between two or more people to fulfil some task with a condition attached to it.' She uses the example of two lovers who cut themselves with a blade, mix blood, and vow 'so long as we live, we're going to stay together — if you leave me may you never find anybody to marry.' That, she teaches, is a binding covenant whether the parties remember it or not. Citing Colossians 2:14–15, she preaches that Christ 'blotted out the handwriting of ordinances against us, nailing it to the cross.' The lecture distinguishes physical covenants (with people) from spiritual covenants (with God or with darkness) and warns that 'demons are released to ensure you keep to the terms of the covenant.'",
    },
    {
      n: 5,
      title: "How Covenants Enter Our Lives — The Entry Points",
      dates: "00:33 – 00:35 · Diagnosis",
      theme: "Diagnosis",
      objectives: [
        "Identify the seven primary entry points: ancestry, sex, friendship vows, dreams, evil dedication, blood sacrifices, repeated sinful patterns.",
        "Understand sexually-transmitted demons — words spoken during sexual contact create covenants.",
        "Examine your family line for inherited contracts you never personally signed.",
        "Be aware that 'covenants can come through dream transactions' — what you ate, where you went, what you accepted.",
      ],
      readings: [
        { title: "Exodus 20:5", type: "Scripture", kjv: "Thou shalt not bow down thyself to them, nor serve them: for I the Lord thy God am a jealous God, visiting the iniquity of the fathers upon the children unto the third and fourth generation of them that hate me." },
        { title: "Personal genogram — map your family line", type: "Practice" },
      ],
      assignment: {
        title: "Map a personal genogram — list known spiritual practices on both sides of your family",
        due: "Before Part 2",
        points: 100,
      },
      summary:
        "Pastor Kiki lists, one by one, the doorways through which destructive covenants enter a life. First, sexual contact: 'You are actually having sexual contact with somebody and in the sexual contact, you were saying some words — I will be with you forever — in that sexual contact you are creating a covenant.' She coins the phrase 'sexually transmitted demons' to parallel sexually transmitted diseases. Second, ancestry: she paints the picture of a great-grandfather who killed a chicken every Thursday in covenant with a family idol — when the practice stops, the conditions of the contract fall on the male children. Third, dream transactions, evil dedications, blood sacrifices, repeated sin patterns, and ungodly soul ties. The lecture warns: 'Some of the covenants that you know of, and others that you are very innocent of — as long as they are destructive, you must release yourself.'",
    },
    {
      n: 6,
      title: "Covenants Made On Your Behalf — The Hidden Danger",
      dates: "00:51 – 01:05 · Case Study",
      theme: "Case Study",
      objectives: [
        "Understand that someone with authority over you (parent, spouse, sent agent) can enter a covenant in your name.",
        "Recognise the warning signs: a friend or relative who 'knows a man' who can solve your problem.",
        "Discern between a genuine pastor and a 'spiritual doctor' / native doctor / witch doctor.",
        "Inventory: who have you sent money to, on your behalf, to pray at an altar you have never seen?",
      ],
      readings: [
        { title: "Genesis 6:18", type: "Scripture", kjv: "But with thee will I establish my covenant; and thou shalt come into the ark, thou, and thy sons, and thy wife, and thy sons' wives with thee." },
        { title: "1 Samuel 18:3", type: "Scripture", kjv: "Then Jonathan and David made a covenant, because he loved him as his own soul." },
        { title: "Jeremiah 22:30", type: "Scripture", kjv: "Thus saith the Lord, Write ye this man childless, a man that shall not prosper in his days: for no man of his seed shall prosper, sitting upon the throne of David, and ruling any more in Judah." },
      ],
      assignment: {
        title: "List every person you sent money to, or who prayed on your behalf at an altar — known or unknown",
        due: "Bring to Part 2",
        points: 100,
      },
      summary:
        "Pastor Kiki delivers the most concrete case study of the session: a Ghanaian man in England with a thriving minicab business. His mother visits, requests specific banknotes and an amount of his money, takes it back to Ghana, and presents it not to a pastor but to a 'spiritual doctor' for the protection of her son's business. After the mother returns, the man begins to lose everything — his cars get into accidents, the business collapses, and ultimately he loses his life. The lesson: covenants entered on your behalf bind you even when you never stood at the altar yourself. She tells a second story about an oil 'from a pastor' that was actually from another source — and how the smell preserved her from using it. The pastoral instruction: be discerning about every person you give a prayer-message or money to.",
    },
    {
      n: 7,
      title: "Symptoms of an Operating Destructive Covenant",
      dates: "01:09 – 01:12 · Diagnosis",
      theme: "Diagnosis",
      objectives: [
        "Recognise the diagnostic symptoms: rising-and-falling, near-success syndrome, repeated marital conflict, delay in marriage, persistent financial hardship.",
        "Identify constant nightmares and unexplained spiritual oppression as warning signs.",
        "Understand 'I will have all my children with you alone' — a sexual covenant that closes the womb to subsequent partners.",
        "Stop praying generic prayers — name the covenant, then renounce the covenant.",
      ],
      readings: [
        { title: "Personal symptom inventory — see assignment", type: "Practice" },
        { title: "Re-read Module 4 doctrine before this diagnosis", type: "Review" },
      ],
      assignment: {
        title: "Symptom inventory — write down every recurring pattern of attack in your life this past year",
        due: "Before Part 2",
        points: 75,
      },
      summary:
        "Pastor Kiki teaches diagnostic discernment: how to tell whether a destructive covenant is actually operating in your life. The signs include 'repeated setbacks, constant nightmares, rising and falling, conflict in the marriage, no understanding in the marriage, near-success syndrome, delay in marriage, financial hardship, repeated disappointments, persistent oppression.' She offers a piercing example: a woman trying to conceive who cannot, because in a former relationship she vowed 'I will have all my children with you alone.' That sexual covenant, never broken, now contests every IVF cycle. The principle: 'You are praying all kinds of prayer but you're not renouncing the solution or the problem.'",
    },
    {
      n: 8,
      title: "The Blood of Jesus — Our Counter-Covenant",
      dates: "01:07 – 01:09 · Theology",
      theme: "Doctrine",
      objectives: [
        "Understand the blood of Jesus as the new covenant that cancels every prior evil covenant.",
        "Receive the blood as the cleansing agent for spiritual contamination.",
        "Stand on Colossians 2:14 — every handwriting of ordinances was nailed to the cross.",
        "Prepare communion (wine, juice, or water as a representation) for the renunciation prayer.",
      ],
      readings: [
        { title: "Matthew 26:28", type: "Scripture", kjv: "For this is my blood of the new testament, which is shed for many for the remission of sins." },
        { title: "Hebrews 9:14", type: "Scripture", kjv: "How much more shall the blood of Christ, who through the eternal Spirit offered himself without spot to God, purge your conscience from dead works to serve the living God?" },
        { title: "Isaiah 28:18", type: "Scripture", kjv: "And your covenant with death shall be disannulled, and your agreement with hell shall not stand; when the overflowing scourge shall pass through, then ye shall be trodden down by it." },
      ],
      assignment: {
        title: "Prepare communion elements for Module 9 — wine, grape juice, or water + oil",
        due: "Before Module 9",
        points: 50,
      },
      summary:
        "Before leading the renunciation prayer, Pastor Kiki pauses to teach the theology of the blood. 'When Jesus died on the cross, every evil handwriting against your life was nailed to the cross with the blood. Jesus knew why He brought us the blood because He sees that in negative covenants — old covenants that we have entered into that is destructive — the enemy may claim ownership through evil covenants, but the blood of Jesus Christ declares you belong to God.' She contrasts the blood of animals shed at evil altars (a goat, a chicken, a pigeon) with the once-for-all blood of Christ. Standing on Isaiah 28:18, she declares: 'Your covenant with death shall be disannulled, and your agreement with hell shall not stand.'",
    },
    {
      n: 9,
      title: "The Renunciation Prayer — Drinking the Blood",
      dates: "01:33 – 01:51 · Corporate Prayer",
      theme: "Practice",
      objectives: [
        "Hold a cup of communion wine, grape juice, or water representing the blood of Jesus.",
        "Speak the renunciation directly into the cup before drinking.",
        "Renounce every covenant — known and unknown, ancestral, sexual, dream-related, soul-tie.",
        "Cancel every evil oath, vow, agreement, and contract by the blood of Jesus.",
      ],
      readings: [
        { title: "Isaiah 28:18", type: "Scripture", kjv: "And your covenant with death shall be disannulled, and your agreement with hell shall not stand; when the overflowing scourge shall pass through, then ye shall be trodden down by it." },
        { title: "Matthew 26:27–28", type: "Scripture", kjv: "And he took the cup, and gave thanks, and gave it to them, saying, Drink ye all of it; For this is my blood of the new testament, which is shed for many for the remission of sins." },
        { title: "Renunciation prayer transcript — Module 9 summary", type: "Liturgy" },
      ],
      assignment: {
        title: "Pray the renunciation prayer aloud with communion in hand",
        due: "Live with the session",
        points: 200,
      },
      summary:
        "This is the spine of the entire session. Pastor Kiki instructs every participant to lift communion (or water in its place) and pray verbatim: 'As I drink the blood of Jesus, I call upon the power of the Holy Ghost. I call upon the power in the blood of Jesus. And I take back all the grounds I might have given access to Satan. By the blood of Jesus Christ, I break every covenant that is not ordained by God in my life, in my family's life, and in my children's lives.' She then leads the room through breaking specific covenants by name: covenants of failure, disappointment, inherited bondage, problems from the mother's womb, demonic marriage, demonic incisions, laying on of evil hands, wrong/expose sex, fellowship with local idols, evil dedication, inherited infirmity, demonic blood transfusion, dream pollution, demonic possession, demonic initiation. Each is met with the shout: 'Break by fire!'",
    },
    {
      n: 10,
      title: "The Anointing — Sealing the Deliverance",
      dates: "01:59 – 02:06 · Anointing",
      theme: "Practice",
      objectives: [
        "Take consecrated oil and anoint yourself after the renunciation.",
        "Pronounce blessings to replace what has been cast out: 'no more poverty, no more sickness, no more evil dedication.'",
        "Break specifically: witchcraft in the family, remote-control power, manipulation, evil authority.",
        "Disconnect from every person who carried out an evil assignment in your name.",
      ],
      readings: [
        { title: "James 5:14", type: "Scripture", kjv: "Is any sick among you? let him call for the elders of the church; and let them pray over him, anointing him with oil in the name of the Lord." },
        { title: "1 Samuel 16:13", type: "Scripture", kjv: "Then Samuel took the horn of oil, and anointed him in the midst of his brethren: and the Spirit of the Lord came upon David from that day forward. So Samuel rose up, and went to Ramah." },
      ],
      assignment: {
        title: "Anoint yourself with oil and pronounce three replacement blessings aloud",
        due: "Live with the session",
        points: 100,
      },
      summary:
        "After the renunciation, Pastor Kiki shifts from breaking to building. 'Now take your oil — you now place blessings on yourself in the name of Jesus.' The anointing is presented as the seal: cancelling demonic dedication, breaking witchcraft of family-spirits, destroying remote-control power and manipulation. She is careful to break the connection to every messenger — 'whoever you give money to, whatever you give an assignment to, and they went to evil altars and these people operate against your life, I disconnect you now.' Then comes the positive declaration: every blessing pronounced aloud over one's own life.",
    },
    {
      n: 11,
      title: "Homework — The Renunciation List",
      dates: "02:19 – 02:24 · Assignment",
      theme: "Assignment",
      objectives: [
        "Take paper and pen. Write the names of old partners, ex-husbands, ex-wives, ex-boyfriends, ex-girlfriends.",
        "Add the names of every person you sent money to who prayed on your behalf at an altar.",
        "Add the names of family members (mother, father) you suspect entered covenants on your behalf.",
        "Renounce each name aloud, one by one — and pay attention to dreams in the coming nights.",
      ],
      readings: [
        { title: "Hosea 4:6", type: "Scripture", kjv: "My people are destroyed for lack of knowledge: because thou hast rejected knowledge, I will also reject thee, that thou shalt be no priest to me: seeing thou hast forgotten the law of thy God, I will also forget thy children." },
        { title: "Personal renunciation list — see assignment", type: "Practice" },
      ],
      assignment: {
        title: "Written renunciation list — bring to Part 2 (Monday)",
        due: "Mon · Part 2",
        points: 150,
      },
      summary:
        "Pastor Kiki gives the homework with unusual specificity: 'When you leave here tonight, take a piece of paper and write down certain names — partners, old husbands, old boyfriends, old girlfriends, and the ones that you asked, and you sent money for them to go and do certain things for.' She tells a story of a previous attendee who renounced everyone on her list but kept seeing one particular man in her dreams — Pastor Kiki instructed her to renounce that one again specifically. The principle: 'The Lord will show you Himself in your dream' which lingering tie still needs to be cut. She closes the homework with Hosea: 'Lack of knowledge make my people perish — just a little knowledge God might give you might set you free from years of battle.'",
    },
    {
      n: 12,
      title: "Salvation, Sowing & Community — Closing",
      dates: "02:27 – 02:43 · Closing",
      theme: "Community",
      objectives: [
        "If not yet born again, pray the salvation prayer (Romans 10:13).",
        "Sow a seed on God's altar — cancelling every demonic seed that was sown on your behalf.",
        "Join the L137 WhatsApp community and follow the house on Clubhouse.",
        "Show up for Part 2 with your renunciation list in hand.",
      ],
      readings: [
        { title: "Romans 10:13", type: "Scripture", kjv: "For whosoever shall call upon the name of the Lord shall be saved." },
        { title: "2 Corinthians 13:14", type: "Scripture", kjv: "The grace of the Lord Jesus Christ, and the love of God, and the communion of the Holy Ghost, be with you all. Amen." },
        { title: "Luke 1:37 — House motto", type: "Scripture", kjv: "For with God nothing shall be impossible." },
      ],
      assignment: {
        title: "Show up for Part 2 — Mon 12:00 AM GMT / 7:00 PM EST",
        due: "Mon · Part 2",
        points: 100,
      },
      summary:
        "The session closes with three movements. First, the seed: 'Now place a seed on the altar of God and cancel every demonic seed that was placed on your behalf to create a destructive covenant.' Second, the salvation prayer for anyone new or re-dedicating — 'Lord Jesus, I repent of my sins and surrender my life to Christ. Wash me clean.' Third, the community call — join the L137 WhatsApp, follow the house on Clubhouse, and bring your written renunciation list to Part 2 on Monday. Pastor Kiki dismisses the room with the apostolic benediction: 'May the grace of the Lord Jesus Christ, the love of God, and the sweet fellowship of the Holy Spirit be with us now and always.'",
    },
  ],
};
