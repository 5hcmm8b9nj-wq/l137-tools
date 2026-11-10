/* ============================================================
   L137 DELIVERANCE MINISTRY — INTERACTIVE WORKBOOK CONTENT
   Service: October 28, 2026 (Clubhouse) — Prophetic Direction:
   Destroying the Dreams of the Wicked. Built from the prophetic
   direction and prayer text supplied. Prayers kept word for word.
   Rules: KJV only, full verses. Never include the transcript.
   Never invent a quotation, revelation or prophetic word.
   ============================================================ */
window.WORKBOOK = {
  id: "l137-2026-10-28-dreams-of-the-wicked",
  ministry: {
    brand: "L137 Deliverance Ministry",
    speaker: "Pastor Kiky Ocansey",
    tagline: "L137 · Luke 1:37 — For with God nothing shall be impossible.",
    // Required L137 provenance line. Change only the platform word (Clubhouse / Zoom / WhatsApp Live / in-person service).
    openingLine: "The following is an interactive study following a service held on Clubhouse by Pastor Kiky Ocansey."
  },
  title: "Destroying the Dreams of the Wicked",
  serviceDate: "Wednesday, October 28, 2026 · Clubhouse",
  mainScripture: "Revelation 12:11 · Isaiah 54:17 · Job 33:14–18",
  heroImage: "hero.jpg",
  heroAlt: "A clay cup of red communion wine and an open Bible on a stone table among olive trees at night, under a beam of golden light",
  intro: "This is the prophetic direction from Pastor Kiky Ocansey for breaking the fast today. Get your communion wine, which represents the precious blood of Jesus Christ. Read the three Scriptures, mark your forehead with a little communion wine, pray the prophetic prayer with faith and authority, then drink the communion wine in remembrance of the blood of Jesus and thank God for your deliverance.",
  teachingLabel: "Prophetic direction",
  blankNamePhrase: "my loved ones",
  voice: { note: "Narration: natural AI sample voices. Part Two uses one teaching voice and a separate Scripture reader. To be replaced with VoicePrompt recordings." },

  // Balanced L137 palette. Day: warm cream, white cards, deep navy and gold. Night: deep navy with gold (switch with the sun/moon button).
  theme: {
    "bg": "#FAF7F0", "surface": "#FFFFFF", "ink": "#22242B", "ink-2": "#42454D", "muted": "#615D53", "heading": "#1C2233",
    "line": "#E9E3D6", "line-strong": "#D3C9B4", "shadow": "rgba(28,34,51,.10)",
    "primary": "#1E2A44", "primary-ink": "#1C2233", "primary-soft": "#EEF1F5", "on-primary": "#FFFFFF",
    "accent": "#9C7A2B", "accent-ink": "#7A5E1C", "accent-soft": "#FBF6E8", "on-accent": "#FFFFFF",
    "hot": "#56683A", "hot-ink": "#46562E", "hot-soft": "#EEF2E6",
    "ok": "#4F6E3A", "ok-soft": "#EEF2E6", "danger": "#A3322B", "danger-soft": "#FBEAE8",
    "warn": "#B8913A", "warn-soft": "#FFF7E3", "focus": "#C9A23F",
    "display-font": "'Cormorant Garamond', 'Georgia', serif", "body-font": "'Nunito Sans', 'Segoe UI', sans-serif", "display-weight": "700"
  },
  // Printable companion uses the day colours (paper is white).
  printTheme: {
    "primary": "#1E2A44", "accent-ink": "#7A5E1C", "hot-ink": "#46562E", "ink": "#22242B", "muted": "#615D53", "heading": "#1C2233",
    "line-strong": "#D3C9B4", "primary-soft": "#EEF1F5", "accent-soft": "#FBF6E8", "hot-soft": "#EEF2E6", "warn-soft": "#FFF7E3"
  },
  printable: "downloads/L137-2026-10-28-Printable.pdf",
  printFlow: true,

  openingAudio: "audio/00-welcome.mp3",
  sections: [
    {
      id: "s1", image: "images/s1.jpg", imageAlt: "Red communion wine poured from a clay pitcher into a clay cup beside an open Bible and a lit oil lamp at night", title: "Prepare to Break Your Fast",
      purpose: "Purpose: to get ready to follow the prophetic direction.",
      teaching: [
        "When you break your fast today, follow these prophetic directions.",
        "Get your communion wine. It represents the precious blood of Jesus Christ. Have your Bible open to Revelation 12:11, Isaiah 54:17 and Job 33:14–18."
      ],
      scripture: [
        { ref: "Revelation 12:11", text: "And they overcame him by the blood of the Lamb, and by the word of their testimony; and they loved not their lives unto the death." }
      ],
      activity: { type: "select", id: "ready", label: "Get ready", prompt: "Tick each item as you prepare.",
        options: ["My communion wine is ready", "My Bible is open to the three Scriptures", "I have a quiet place to pray", "I am ready to break my fast"],
        fields: [{ id: "p1", label: "What I am trusting the blood of Jesus to cover today" }] },
      audio: "audio/01-section.mp3"
    },
    {
      id: "s2", image: "images/s2.jpg", imageAlt: "An old bronze shield under a beam of light at night, with broken arrows and a snapped spear on the ground before it", title: "Marked by the Blood: No Weapon Shall Prosper",
      purpose: "Purpose: to declare your faith in the protection of the blood of Jesus.",
      teaching: [
        "Mark your forehead with a little communion wine, declaring your faith in the protection of the blood of Jesus.",
        "As you do, declare: \"As I mark myself by faith with the blood of Jesus, I declare that no weapon formed against me shall prosper.\""
      ],
      scripture: [
        { ref: "Isaiah 54:17", text: "No weapon that is formed against thee shall prosper; and every tongue that shall rise against thee in judgment thou shalt condemn. This is the heritage of the servants of the LORD, and their righteousness is of me, saith the LORD." }
      ],
      activity: { label: "Declare", prompt: "Write out Isaiah 54:17 in your own words as a personal declaration.",
        fields: [{ id: "w1", label: "My declaration" }, { id: "w2", label: "A weapon or tongue I am standing against", placeholder: "Write as much or as little as you wish." }] },
      audio: "audio/02-section.mp3"
    },
    {
      id: "s3", image: "images/s3.jpg", imageAlt: "A lit clay oil lamp, an open Bible and olive leaves on a stone window ledge under a starry night sky with a soft beam of light", title: "God Speaks in the Night",
      purpose: "Purpose: to take authority over your dream life.",
      teaching: [
        "Read Job 33:14–18. God speaks in a dream, in a vision of the night, and He keeps back the soul from the pit.",
        "Then pray with faith and authority. By the blood of Jesus, cancel every evil dream, nightmare and negative declaration concerning your life, your children, your family, your marriage, your health, your finances and your destiny."
      ],
      scripture: [
        { ref: "Job 33:14–18", text: "For God speaketh once, yea twice, yet man perceiveth it not. In a dream, in a vision of the night, when deep sleep falleth upon men, in slumberings upon the bed; Then he openeth the ears of men, and sealeth their instruction, That he may withdraw man from his purpose, and hide pride from man. He keepeth back his soul from the pit, and his life from perishing by the sword." }
      ],
      activity: { type: "select", id: "dreams", label: "Bring it before God", prompt: "Which kinds of evil dreams are you cancelling today? Tick all that apply. This stays private on this device.",
        options: ["Dreams of fear, confusion or delay", "Recurring bad dreams", "Dreams of marital problems", "Dreams of curses or evil covenant", "Dreams of debt, loss or unprofitable work", "Dreams of hopelessness and frustration"],
        fields: [{ id: "d1", label: "Anything else I am cancelling by the blood of Jesus" }] },
      audio: "audio/03-section.mp3"
    },
    {
      id: "s4", image: "images/s4.jpg", imageAlt: "Broken unleavened bread and a clay cup of red wine on a wooden table by lamplight at night", title: "Partake in Remembrance and Give Thanks",
      purpose: "Purpose: to receive the communion and thank God for your deliverance.",
      teaching: [
        "After praying, drink your communion wine in remembrance of the blood of Jesus Christ and thank God for your deliverance.",
        "Declare: \"As I partake of this communion, I declare that my life belongs to Jesus. My sleep shall be peaceful, my dreams shall not torment me, and my future is secured in God's hands.\""
      ],
      scripture: [
        { ref: "Psalm 118:17", text: "I shall not die, but live, and declare the works of the LORD." }
      ],
      activity: { label: "Give thanks", prompt: "Write a short prayer of thanks for your deliverance.",
        fields: [{ id: "g1", label: "Thank You, Jesus, for…" }, { id: "g2", label: "The joy and progress I am collecting back" }] },
      audio: "audio/04-section.mp3"
    }
  ],

  // Full service teaching — Part 1 then Part 2, placed after the prophetic direction and prayer. No names, stories or testimonies.
  services: [
   {
    "title": "Part 1 · Destroying the Dreams of the Wicked: Warfare and Declaration",
    "short": "Part 1: Warfare and Declaration",
    "intro": "The Part 1 service teaching, placed after the prophetic direction. It explains why dreams matter, the dreams named in the service, how to remember and rebuke them, and the declarations prayed together. Names, personal stories and testimonies have been left out.",
    "sections": [
     {
      "id": "p1-thanks",
      "title": "Open with Thanksgiving: Psalm 27",
      "image": "images/p1-1.jpg",
      "imageAlt": "A clay oil lamp glowing on a stone ledge beside an open Bible, under a calm starry night sky",
      "purpose": "Purpose: to begin by thanking God for what He has done behind the scenes.",
      "teaching": [
       "Part 1 began by handing the service over to the Lord and covering every heart, home and platform in the blood of Jesus, standing on the Word that no weapon formed against us shall prosper.",
       "The opening prayer led the family to Psalm 27:1–6. Psalm 27 shows what God does behind the scenes. He is our light, our salvation and the strength of our life. He protected our going in and our coming out, and He did not let the intentions of the enemy come to pass.",
       "So we give thanks always, for all things, in the name of our Lord Jesus Christ. We offer God thanksgiving as a sacrifice and praise Him for His goodness and His wonderful works."
      ],
      "scripture": [
       {
        "ref": "Psalm 27:1–6",
        "text": "The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid? When the wicked, even mine enemies and my foes, came upon me to eat up my flesh, they stumbled and fell. Though an host should encamp against me, my heart shall not fear: though war should rise against me, in this will I be confident. One thing have I desired of the LORD, that will I seek after; that I may dwell in the house of the LORD all the days of my life, to behold the beauty of the LORD, and to enquire in his temple. For in the time of trouble he shall hide me in his pavilion: in the secret of his tabernacle shall he hide me; he shall set me up upon a rock. And now shall mine head be lifted up above mine enemies round about me: therefore will I offer in his tabernacle sacrifices of joy; I will sing, yea, I will sing praises unto the LORD."
       },
       {
        "ref": "Ephesians 5:20",
        "text": "Giving thanks always for all things unto God and the Father in the name of our Lord Jesus Christ;"
       },
       {
        "ref": "Psalm 107:8",
        "text": "Oh that men would praise the LORD for his goodness, and for his wonderful works to the children of men!"
       },
       {
        "ref": "Psalm 50:14",
        "text": "Offer unto God thanksgiving; and pay thy vows unto the most High:"
       }
      ],
      "activity": {
       "label": "Give thanks",
       "prompt": "Write what God has protected you from, seen or unseen, this week.",
       "fields": [
        {
         "id": "t1",
         "label": "Lord, thank You for protecting me from…"
        }
       ]
      },
      "audio": "audio/p1-01.mp3"
     },
     {
      "id": "p1-forgive-fire",
      "title": "Forgiveness and Fresh Fire",
      "image": "images/p1-2.jpg",
      "imageAlt": "Clear water poured from a clay jar into a stone basin beside a small flame, in soft dawn light",
      "purpose": "Purpose: to clear the way for prayer and ask the Holy Spirit to take first place.",
      "teaching": [
       "Before warfare comes forgiveness. The opening prayer asked the Lord to forgive every sin, so that nothing would hinder our prayers. The Lord is merciful and gracious. He forgives all our iniquities and heals all our diseases, and He has not dealt with us after our sins.",
       "Then the family asked the Holy Spirit to fill us afresh. Acts 2 promises that in the last days God pours out His Spirit on all flesh. We asked Him to take preeminence in the meeting and in our lives, and to set us on fire again."
      ],
      "scripture": [
       {
        "ref": "Psalm 103:3",
        "text": "Who forgiveth all thine iniquities; who healeth all thy diseases;"
       },
       {
        "ref": "Psalm 103:8",
        "text": "The LORD is merciful and gracious, slow to anger, and plenteous in mercy."
       },
       {
        "ref": "Psalm 103:10",
        "text": "He hath not dealt with us after our sins; nor rewarded us according to our iniquities."
       },
       {
        "ref": "Acts 2:17",
        "text": "And it shall come to pass in the last days, saith God, I will pour out of my Spirit upon all flesh: and your sons and your daughters shall prophesy, and your young men shall see visions, and your old men shall dream dreams:"
       },
       {
        "ref": "Acts 2:4",
        "text": "And they were all filled with the Holy Ghost, and began to speak with other tongues, as the Spirit gave them utterance."
       }
      ],
      "activity": {
       "label": "Pray privately",
       "prompt": "Ask for forgiveness and invite the Holy Spirit. This stays private on this device.",
       "fields": [
        {
         "id": "f1",
         "label": "Lord, forgive me for…"
        },
        {
         "id": "f2",
         "label": "Holy Spirit, fill me afresh in…"
        }
       ]
      },
      "audio": "audio/p1-02.mp3"
     },
     {
      "id": "p1-terror",
      "title": "The Terror by Night",
      "image": "images/p1-3.jpg",
      "imageAlt": "A quiet stone house at night under a starry sky, with a single warm light in the window",
      "purpose": "Purpose: to understand that many night terrors happen in dreams, and that God also speaks in the night.",
      "teaching": [
       "Pastor Kiky Ocansey taught from Psalm 91:5: “Thou shalt not be afraid for the terror by night.” Many of the terrors of the night happen in our dreams. Nightmares are the terrors of the night.",
       "Job 33 shows that God speaks in a dream, in a vision of the night, when deep sleep falls on men. Through dreams He gives instruction, warning and correction. He turns us from pride, guides us and keeps us from destruction.",
       "But not every dream comes from God. The enemy also uses dreams, and evil dreams bring fear, confusion and sleepless nights. Some people wake up afraid and stay unsettled all day. Others have repeated nightmares.",
       "Colossians 1:13–14 reminds us that God has delivered us from the power of darkness. We are not powerless. We fight and pray, and we deliver ourselves from these dreams through Christ."
      ],
      "scripture": [
       {
        "ref": "Psalm 91:5",
        "text": "Thou shalt not be afraid for the terror by night; nor for the arrow that flieth by day;"
       },
       {
        "ref": "Job 33:14–20",
        "text": "For God speaketh once, yea twice, yet man perceiveth it not. In a dream, in a vision of the night, when deep sleep falleth upon men, in slumberings upon the bed; Then he openeth the ears of men, and sealeth their instruction, That he may withdraw man from his purpose, and hide pride from man. He keepeth back his soul from the pit, and his life from perishing by the sword. He is chastened also with pain upon his bed, and the multitude of his bones with strong pain: So that his life abhorreth bread, and his soul dainty meat."
       },
       {
        "ref": "Colossians 1:13–14",
        "text": "Who hath delivered us from the power of darkness, and hath translated us into the kingdom of his dear Son: In whom we have redemption through his blood, even the forgiveness of sins:"
       }
      ],
      "activity": {
       "type": "select",
       "id": "effects",
       "label": "Be honest",
       "prompt": "Which of these have you experienced after a dream? Tick any that apply. This stays private on this device.",
       "options": [
        "Fear or terror when I wake up",
        "Confusion through the day",
        "Sleepless nights",
        "The same nightmare coming back",
        "Feeling unsettled all day"
       ],
       "fields": [
        {
         "id": "e1",
         "label": "What I want God to deal with in my nights"
        }
       ]
      },
      "audio": "audio/p1-03.mp3"
     },
     {
      "id": "p1-dreamers",
      "title": "God Speaks Through Dreams Too",
      "image": "images/p1-4.jpg",
      "imageAlt": "Sheaves of wheat standing in a field under a starry sky and a bright moon, with a clay lamp on a stone ledge",
      "purpose": "Purpose: to see from Scripture how God has used dreams to guide, warn and protect His people.",
      "teaching": [
       "Pastor Kiky Ocansey taught that God has used dreams throughout Scripture. In Genesis 37, God showed Joseph his future in dreams. In Daniel 2, God gave Daniel understanding of the king's dream. In Matthew 2:13, the angel of the Lord appeared to Joseph in a dream and told him to flee into Egypt to protect the child.",
       "So your dream world is very important. When you are about to receive a breakthrough, it can come through a dream. When the wicked plan destruction, it can also come through the entrance of your dream.",
       "God gives warning before things happen, just as you see the clouds change and feel the breeze before it rains. If God wants to protect you, He brings the warning in your dream. If the devil wants to harm you, he also brings the attack through a dream."
      ],
      "scripture": [
       {
        "ref": "Genesis 37:5–11",
        "text": "And Joseph dreamed a dream, and he told it his brethren: and they hated him yet the more. And he said unto them, Hear, I pray you, this dream which I have dreamed: For, behold, we were binding sheaves in the field, and, lo, my sheaf arose, and also stood upright; and, behold, your sheaves stood round about, and made obeisance to my sheaf. And his brethren said to him, Shalt thou indeed reign over us? or shalt thou indeed have dominion over us? And they hated him yet the more for his dreams, and for his words. And he dreamed yet another dream, and told it his brethren, and said, Behold, I have dreamed a dream more; and, behold, the sun and the moon and the eleven stars made obeisance to me. And he told it to his father, and to his brethren: and his father rebuked him, and said unto him, What is this dream that thou hast dreamed? Shall I and thy mother and thy brethren indeed come to bow down ourselves to thee to the earth? And his brethren envied him; but his father observed the saying."
       },
       {
        "ref": "Daniel 2:19",
        "text": "Then was the secret revealed unto Daniel in a night vision. Then Daniel blessed the God of heaven."
       },
       {
        "ref": "Matthew 2:13",
        "text": "And when they were departed, behold, the angel of the Lord appeareth to Joseph in a dream, saying, Arise, and take the young child and his mother, and flee into Egypt, and be thou there until I bring thee word: for Herod will seek the young child to destroy him."
       }
      ],
      "activity": {
       "label": "Remember His guidance",
       "prompt": "Has God ever warned, guided or encouraged you through a dream? Write what you remember.",
       "fields": [
        {
         "id": "d1",
         "label": "A time God spoke to me in the night"
        }
       ]
      },
      "audio": "audio/p1-04.mp3"
     },
     {
      "id": "p1-why",
      "title": "Why the Enemy Uses Dreams",
      "image": "images/p1-5.jpg",
      "imageAlt": "A clay lamp on a stone wall beside a dark field at night, under a calm starry sky",
      "purpose": "Purpose: to understand why evil dreams must be resisted, not ignored.",
      "teaching": [
       "Matthew 13:25 says that while men slept, the enemy came and sowed tares. Pastor Kiky Ocansey taught that while we rest and mind our business, the enemy comes to throw destruction. When anyone wants to get to you spiritually, they use your dreams.",
       "Seeing something in a dream does not mean it happens instantly. You can rebuke it before it comes to the entrance of reality. Nightmares are not ordinary dreams, and they must not continue without resistance.",
       "Any regular dream should be given proper attention. If you are always eating in the dream or always having sexual contact in the dream, it may point to the root of a particular problem.",
       "Why the torment after prayer? Matthew 11:12 says the kingdom of heaven suffers violence. After we pray, the wicked sometimes attack in the night. We suffer violence, but we will not succumb. We rebuke whatever they are firing.",
       "Heaven does not endorse these disturbances. The battle is the Lord's. We confront darkness through Jesus, not because we are anointed in our own strength."
      ],
      "scripture": [
       {
        "ref": "Matthew 13:25",
        "text": "But while men slept, his enemy came and sowed tares among the wheat, and went his way."
       },
       {
        "ref": "Matthew 11:12",
        "text": "And from the days of John the Baptist until now the kingdom of heaven suffereth violence, and the violent take it by force."
       }
      ],
      "activity": {
       "label": "Resist it",
       "prompt": "Write one dream you have been ignoring that you will now rebuke.",
       "fields": [
        {
         "id": "w1",
         "label": "The dream I will no longer ignore"
        }
       ]
      },
      "audio": "audio/p1-05.mp3"
     },
     {
      "id": "p1-examples",
      "title": "Dreams Named in Part 1",
      "image": "images/p1-6.jpg",
      "imageAlt": "An open Bible and a clay oil lamp on a stone windowsill, with a starry night sky beyond",
      "purpose": "Purpose: to recognise the kinds of dreams named in Part 1, and how to pray about each one.",
      "teaching": [
       "These are the kinds of dreams named in Part 1. Under each one is what was taught and a prayer to pray. If you have had one of these dreams, do not stay silent. Rebuke it in the name of Jesus before it comes through your physical door."
      ],
      "examples": [
       {
        "dream": "Snakes in the dream",
        "meaning": "Named among the dreams that point to an attack of the wicked.",
        "pray": "Every serpent sent against me in my dreams, I rebuke you by the blood of Jesus. You shall not harm me."
       },
       {
        "dream": "Seeing dead relatives",
        "meaning": "Named among the dreams to be rebuked by the blood of Jesus.",
        "pray": "Every dream of the dead sent to my life, I cancel it by the blood of Jesus. I shall live and not die."
       },
       {
        "dream": "Eating strange food, or eating with bad people",
        "meaning": "Taught as a way the enemy feeds people in the night. If it is regular, give it proper attention.",
        "pray": "Holy Ghost, purge my intestines and my blood from any satanic food. Let every avenue of eating spiritual poison in my dreams be shut."
       },
       {
        "dream": "Being fed, or given something to drink",
        "meaning": "Named with eating in the dream. Drink the blood of Jesus when you wake and declare every point of contact destroyed.",
        "pray": "I reject every satanic food and drink given to me in my dreams. As I drink the blood of Jesus, every deposit comes out now."
       },
       {
        "dream": "Regular drinking of red liquid",
        "meaning": "Named among the dreams the devil and his agents are behind.",
        "pray": "I cannot drink the cup of the Lord and the cup of devils. I reject every cup of the wicked by the blood of Jesus."
       },
       {
        "dream": "Being injected in the dream, then sickness follows",
        "meaning": "Taught that some people are injected in a dream and then an affliction or sickness appears.",
        "pray": "I break every evil injection through dreams. Holy Ghost, purge my blood. I receive healing in the name of Jesus."
       },
       {
        "dream": "Attacks by vicious animals, insects or dogs",
        "meaning": "Named among the attacks of the wicked in dreams.",
        "pray": "Every creature sent against me in my dreams, I disconnect every link with you and command you to go by the blood of Jesus."
       },
       {
        "dream": "Returning to your childhood home",
        "meaning": "Named among the dreams the enemy uses to disturb your life.",
        "pray": "I refuse to go back. I move forward into what God has prepared for me in the name of Jesus."
       },
       {
        "dream": "Being trapped, imprisoned or unable to escape",
        "meaning": "Named among the terrors of the night.",
        "pray": "Ungodly powers, release me and let me go. Whom the Son sets free is free indeed."
       },
       {
        "dream": "Being chased by strange people",
        "meaning": "Named among the dreams that cause fear of going to bed.",
        "pray": "Every pursuer in my dreams, I rebuke you. Stumble and fall in the name of Jesus. I receive peace as I lie down."
       },
       {
        "dream": "Sex in the dream with unknown partners, or spiritual marriage",
        "meaning": "Taught as a sign of being married to a spirit. Mark yourself with the blood (Exodus 12:13).",
        "pray": "I break every evil covenant and every spiritual marriage. By the blood of Jesus, I divorce every spirit husband or wife."
       },
       {
        "dream": "Swimming in water, drowning, or unable to breathe",
        "meaning": "Named among the dreams the devil and his agents are behind.",
        "pray": "Every water spirit attacking me in my dreams, I disconnect from you by the blood of Jesus."
       },
       {
        "dream": "Leaving your body and meeting people",
        "meaning": "Named among the horrible and terrible experiences in dreams.",
        "pray": "My spirit, soul and body are covered by the blood of Jesus. I disconnect every conscious and unconscious link with demonic creatures."
       },
       {
        "dream": "Sitting on a throne with unknown faces, or bowing to an image",
        "meaning": "Named among the dreams the devil and his agents are behind.",
        "pray": "I bow to no image and sit in no evil assembly. I belong to the Lord Jesus Christ alone."
       },
       {
        "dream": "Being pressed down as you fall asleep",
        "meaning": "Taught as an attack that often comes at the start of sleep, as if the spirit is being pulled out.",
        "pray": "By the blood of Jesus, every power pressing me down, release me now. I lie down in peace and sleep in safety."
       },
       {
        "dream": "Confusion before a job interview or opportunity",
        "meaning": "Taught that certain dreams come to bring confusion and remove words from your mind before an interview.",
        "pray": "Every dream sent to confuse me and fight my destiny, I cancel it. I receive a sound mind and the right words."
       },
       {
        "dream": "A negative dream as soon as something good begins",
        "meaning": "Taught that attacks can come as soon as a new appointment, opportunity or relationship begins.",
        "pray": "Every attack sent against my new beginning, I cancel it by the blood of Jesus. What God has started shall be completed."
       },
       {
        "dream": "Seeing someone plotting against you",
        "meaning": "Taught that God sometimes shows you what is being planned so you can pray.",
        "pray": "Every evil imagination and plan that is not of God, be destroyed in the name of Jesus. I pray against the power, not the person."
       },
       {
        "dream": "A whirlwind",
        "meaning": "Taught as chaos and confusion coming against the family or community.",
        "pray": "Every whirlwind sent by the wicked against me, my family and my community, be scattered by the power of the Holy Ghost."
       },
       {
        "dream": "A sea full of filth or debt",
        "meaning": "Taught as troubles coming one after another.",
        "pray": "Every sea of trouble and debt sent against me, I cancel it by the blood of Jesus. I receive provision and peace."
       },
       {
        "dream": "Good dreams: a very large pot, a big house, travel, a car, a fruitful garden, counting money, healing or favour",
        "meaning": "Cooking in a very large pot was taught as a sign of a business being enlarged to feed many. Good dreams must be claimed so they come through your physical door.",
        "pray": "Father, every good dream You have shown me, let it come to pass. Let it come through my physical door in the name of Jesus."
       }
      ],
      "scripture": [
       {
        "ref": "Luke 10:19",
        "text": "Behold, I give unto you power to tread on serpents and scorpions, and over all the power of the enemy: and nothing shall by any means hurt you."
       }
      ],
      "activity": {
       "type": "select",
       "id": "seen",
       "label": "Name your dreams",
       "prompt": "Which of these dreams have you had? Tick any that apply. This stays private on this device.",
       "options": [
        "Snakes or attacking animals",
        "Eating, being fed or drinking",
        "Injection followed by sickness",
        "Sex or marriage in the dream",
        "Water, swimming or drowning",
        "Being chased, trapped or pressed down",
        "A good dream I need to claim"
       ],
       "fields": [
        {
         "id": "x1",
         "label": "A dream I am rebuking or claiming today"
        }
       ]
      },
      "audio": "audio/p1-06.mp3"
     },
     {
      "id": "p1-fire",
      "title": "Stay on Fire",
      "image": "images/p1-7.jpg",
      "imageAlt": "A strong flame burning in a clay lamp on a stone wall at night, with a city watchtower in the distance",
      "purpose": "Purpose: to understand why some dreams stop when you are spiritually fervent and return when you slow down.",
      "teaching": [
       "Pastor Kiky Ocansey read about uncleanness that comes by night (Deuteronomy 23:9–10). When the host goes forth against the enemy, keep yourself from every wicked thing.",
       "When you are on fire, there are certain dreams you will not see anymore. When you slow down in prayer, they come back. A prayerless life leaves you like a city without walls.",
       "Isaiah 52:1 says, “Awake, awake; put on thy strength.” The uncircumcised and the unclean shall no more come into you. We need to be spiritually awake, even when we are physically asleep."
      ],
      "scripture": [
       {
        "ref": "Deuteronomy 23:9–10",
        "text": "When the host goeth forth against thine enemies, then keep thee from every wicked thing. If there be among you any man, that is not clean by reason of uncleanness that chanceth him by night, then shall he go abroad out of the camp, he shall not come within the camp:"
       },
       {
        "ref": "Isaiah 52:1",
        "text": "Awake, awake; put on thy strength, O Zion; put on thy beautiful garments, O Jerusalem, the holy city: for henceforth there shall no more come into thee the uncircumcised and the unclean."
       }
      ],
      "activity": {
       "type": "select",
       "id": "fire",
       "label": "Keep the fire",
       "prompt": "What will you do this week to stay on fire? Tick all that apply.",
       "options": [
        "Pray before I sleep",
        "Read Scripture daily",
        "Pray in the night when I wake",
        "Pray as soon as I wake up",
        "Join the Wednesday fasting and prayer"
       ],
       "fields": [
        {
         "id": "r1",
         "label": "My plan to stay spiritually awake"
        }
       ]
      },
      "audio": "audio/p1-07.mp3"
     },
     {
      "id": "p1-remember",
      "title": "When You Cannot Remember Your Dreams",
      "image": "images/p1-8.jpg",
      "imageAlt": "A small notebook and reed pen beside a clay lamp on a wooden bedside table at night",
      "purpose": "Purpose: to recover dreams that are lost or stolen so you can pray about them.",
      "teaching": [
       "Some people say, “I don't dream.” Pastor Kiky Ocansey taught that this is a problem. Everyone dreams. If you cannot remember, your dreams may be stolen or lost. Job 20:8 speaks of a dream that flies away and is not found.",
       "Keep a notebook beside your bed. When you wake from a dream at two, three or four in the morning, do not go back to sleep without writing a few key words. If you saw a bug biting you, write “bug, biting.” If you walked in a fruitful land, write “apples, garden, fruits.” Daniel 7:1 shows that Daniel wrote down his dream.",
       "You need to remember every dream. The ones that are not good, rebuke. The ones that are good, receive. If you still cannot remember, ask the Holy Spirit. He brings all things to your remembrance."
      ],
      "scripture": [
       {
        "ref": "Job 20:8",
        "text": "He shall fly away as a dream, and shall not be found: yea, he shall be chased away as a vision of the night."
       },
       {
        "ref": "Daniel 7:1",
        "text": "In the first year of Belshazzar king of Babylon Daniel had a dream and visions of his head upon his bed: then he wrote the dream, and told the sum of the matters."
       },
       {
        "ref": "John 14:26",
        "text": "But the Comforter, which is the Holy Ghost, whom the Father will send in my name, he shall teach you all things, and bring all things to your remembrance, whatsoever I have said unto you."
       }
      ],
      "activity": {
       "label": "Start your dream notebook",
       "prompt": "Write the key words of any dream you remember from this week.",
       "fields": [
        {
         "id": "m1",
         "label": "Key words from my dreams",
         "placeholder": "For example: water, chased, garden, fruits…"
        }
       ]
      },
      "audio": "audio/p1-08.mp3"
     },
     {
      "id": "p1-door",
      "title": "Your Physical Door",
      "image": "images/p1-9.jpg",
      "imageAlt": "A heavy wooden door in an ancient stone wall at night, with golden light at the threshold",
      "purpose": "Purpose: to understand why we rebuke bad dreams and claim good ones.",
      "teaching": [
       "Pastor Kiky Ocansey taught that we all have physical doors. Anything that moves from the spiritual into the physical comes through an invisible door in your life.",
       "An attack you see in your dream is spiritual, but it is trying to come through your physical door. When you rebuke it, you shut it and destroy it spiritually before it comes through. What you do not allow through that door cannot come in.",
       "Good dreams also come through that door. If you saw yourself in a big house, travelling, with a new car, or in a fruitful garden, pray that it comes to pass and comes through your physical door by the power of the Holy Ghost.",
       "Whatever you bind on earth is bound in heaven. God has given you power over all the power of the enemy. The enemy does not have the final word. We overcome by the blood of the Lamb and by the word of our testimony."
      ],
      "scripture": [
       {
        "ref": "Matthew 18:18",
        "text": "Verily I say unto you, Whatsoever ye shall bind on earth shall be bound in heaven: and whatsoever ye shall loose on earth shall be loosed in heaven."
       },
       {
        "ref": "Luke 10:19",
        "text": "Behold, I give unto you power to tread on serpents and scorpions, and over all the power of the enemy: and nothing shall by any means hurt you."
       },
       {
        "ref": "Revelation 12:11",
        "text": "And they overcame him by the blood of the Lamb, and by the word of their testimony; and they loved not their lives unto the death."
       }
      ],
      "activity": {
       "label": "Guard your door",
       "prompt": "Write one thing you are shutting out and one good thing you are welcoming through your physical door.",
       "fields": [
        {
         "id": "g1",
         "label": "I shut my door to…"
        },
        {
         "id": "g2",
         "label": "I welcome through my door…"
        }
       ]
      },
      "audio": "audio/p1-09.mp3"
     },
     {
      "id": "p1-morning",
      "title": "The Two-Minute Prayer and the Blood",
      "image": "images/p1-10.jpg",
      "imageAlt": "A clay cup of red communion wine and a small flask of oil on a bedside table at dawn",
      "purpose": "Purpose: to know what to do the moment you wake from an evil dream.",
      "teaching": [
       "When you see negativity, do not relax and do not wait. You do not need to pray for an hour. Before you shower and get ready for work, you have two to five minutes to dismantle the works of the enemy.",
       "Drink the blood (your communion) or a little anointing oil and pray simply: “Whatever I have seen in this dream, I rebuke it in the name of Jesus. I nullify, I dismantle the works of the wicked in my life and in my destiny. I cancel this dream; it shall not be my reality.” Then go about your day. It is done.",
       "Do not be silent. When you are silent you allow the devices of the wicked to work, and the signs of the dream begin: you are not yourself, or bad news begins to come.",
       "Keep the blood by your bed. The blood of Jesus speaks better things than the blood of Abel. If you were fed in a dream, drink the blood and declare every point of contact destroyed. Where there was sex in the dream, mark yourself with the blood, including the belly button and private areas, and stand on Exodus 12:13: “When I see the blood, I will pass over you.” You cannot drink the cup of the Lord and the cup of devils."
      ],
      "scripture": [
       {
        "ref": "Hebrews 12:24",
        "text": "And to Jesus the mediator of the new covenant, and to the blood of sprinkling, that speaketh better things than that of Abel."
       },
       {
        "ref": "Exodus 12:13",
        "text": "And the blood shall be to you for a token upon the houses where ye are: and when I see the blood, I will pass over you, and the plague shall not be upon you to destroy you, when I smite the land of Egypt."
       },
       {
        "ref": "1 Corinthians 10:21",
        "text": "Ye cannot drink the cup of the Lord, and the cup of devils: ye cannot be partakers of the Lord’s table, and of the table of devils."
       },
       {
        "ref": "Psalm 27:1–2",
        "text": "The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid? When the wicked, even mine enemies and my foes, came upon me to eat up my flesh, they stumbled and fell."
       }
      ],
      "activity": {
       "label": "Your morning prayer",
       "prompt": "Write the short prayer you will pray the next morning you wake from an evil dream.",
       "fields": [
        {
         "id": "p1",
         "label": "My two-minute prayer",
         "placeholder": "I nullify, I dismantle the works of the wicked…"
        }
       ]
      },
      "audio": "audio/p1-10.mp3"
     },
     {
      "id": "p1-declare",
      "title": "Say It Aloud: The Part 1 Declarations",
      "image": "images/p1-11.jpg",
      "imageAlt": "An open Bible on a stone table under a starry sky, with a beam of golden light falling on its pages",
      "purpose": "Purpose: to pray the declarations led in Part 1.",
      "teaching": [
       "These are the declarations Pastor Kiky Ocansey led the family to say after her. They have been lightly tidied from the recording. Say each one aloud. For the declaration about evil plantations, lay your hand on your stomach."
      ],
      "say": [
       "By the power of the Holy Ghost, by the blood of Jesus, I reject every fear associated with dreams.",
       "As I drink the blood of Jesus, Holy Ghost, purge my intestines and my blood from any satanic food and injections.",
       "I break every evil covenant. I break every evil injection through dreams.",
       "Every evil imagination and plan that is not of God, be destroyed in the name of Jesus.",
       "Every doorway to satanic invasion in my life, be destroyed by the blood of Jesus.",
       "I loose myself from curses, spells and bewitchments directed against me through dreams.",
       "Ungodly powers, release me and let me go.",
       "Let all tests in the dream be converted to testimonies in my life.",
       "Let all failures in the dream be converted to my success.",
       "Let all weaknesses in the dream be converted to my strength, by the power of the Holy Ghost.",
       "Let all negativity in the dream be converted to positivity.",
       "I cancel every assignment of the wicked in my dreams.",
       "Every evil plantation in my life, come out with all your roots, in the name of Jesus.",
       "I disconnect every conscious and unconscious link with demonic creatures.",
       "Let every avenue of eating and drinking spiritual poison in my dreams be shut and closed.",
       "Father, let all negative materials in my bloodstream come out, in the name of Jesus.",
       "Father, I thank You for another moment like this. Grant me grace to be on fire at all times, so that every satanic attack against my dreams is cancelled.",
       "I decree a complete reversal of all satanic curses through my dreams. I destroy every work of the devil over my life.",
       "Father, every good dream You have given me, let it come to pass and come through my physical door.",
       "As I lie down to sleep, let the peace that passes all understanding keep my heart and mind, in the name of Jesus."
      ],
      "scripture": [
       {
        "ref": "Philippians 4:7",
        "text": "And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus."
       },
       {
        "ref": "Psalm 4:8",
        "text": "I will both lay me down in peace, and sleep: for thou, LORD, only makest me dwell in safety."
       }
      ],
      "activity": {
       "type": "select",
       "id": "said",
       "label": "Pray it through",
       "prompt": "Tick each step as you complete it.",
       "options": [
        "I said every declaration aloud",
        "I laid my hand on my stomach for the evil plantations",
        "I drank the blood (communion)",
        "I claimed my good dreams"
       ],
       "fields": [
        {
         "id": "y1",
         "label": "A declaration I will keep saying this week"
        }
       ]
      },
      "audio": "audio/p1-11.mp3"
     },
     {
      "id": "p1-prepare",
      "title": "Before You Sleep and Before Wednesday",
      "image": "images/p1-12.jpg",
      "imageAlt": "A quiet bedroom in a stone house at night, with a small flask of oil and a lamp by the bed and stars through the window",
      "purpose": "Purpose: to carry out the instructions given at the close of Part 1.",
      "teaching": [
       "Before the Wednesday fasting and prayer (Part 2), write down every dream you want to rebuke, especially the dreams that keep coming back.",
       "Before you go to bed, anoint your bedroom with oil. Send the presence of the Lord and the angels of the Lord to surround your bed, your room and your household.",
       "Faith without works is dead. Do your directions. Do not only hear the teaching. Act on it.",
       "The service closed with an invitation to receive Jesus Christ. If you want to give your life to Him, Romans 10:13 promises that whosoever shall call upon the name of the Lord shall be saved. Call on Him now in your own words."
      ],
      "scripture": [
       {
        "ref": "James 2:20",
        "text": "But wilt thou know, O vain man, that faith without works is dead?"
       },
       {
        "ref": "Romans 10:13",
        "text": "For whosoever shall call upon the name of the Lord shall be saved."
       }
      ],
      "activity": {
       "type": "select",
       "id": "prep",
       "label": "Get ready",
       "prompt": "Tick each step as you complete it.",
       "options": [
        "I wrote down the dreams I want to rebuke",
        "I anointed my bedroom with oil",
        "I prayed for angels to surround my bed, room and household",
        "I am preparing for the Wednesday fast"
       ],
       "fields": [
        {
         "id": "q1",
         "label": "Dreams I am bringing to the Wednesday fast"
        }
       ]
      },
      "audio": "audio/p1-12.mp3"
     }
    ]
   },
   {
    "title": "Destroying Dreams of the Wicked · Part Two",
    "short": "Part Two · October 28, 2026",
    "intro": "The full Part 2 service teaching, placed after the prophetic direction. It explains why we cancel evil dreams, the kinds of dreams named in the service, and what to do when you wake from one.",
    "sections": [
     {
      "id": "p2-thanks",
      "title": "Begin with Thanksgiving",
      "image": "images/p2-1.jpg",
      "imageAlt": "Morning light rising over quiet hills and olive trees, with a clay lamp and an open Bible on a stone wall",
      "purpose": "Purpose: to open the fast with gratitude for God's protection.",
      "teaching": [
       "The service opened with thanksgiving. Pastor Kiky Ocansey led the family to Psalm 30 and thanked God for protection through the night, for the breath of life, and for covering our families and children.",
       "She taught that in Psalm 30 David faced many enemies who threatened his life, yet God kept him alive through every trial and rescued him even from the brink of death. God has done the same for you, delivering you from trouble, sickness, affliction and many attacks of the wicked.",
       "We did not wake up by our own might or strength, but by the power of the Holy Spirit. So we give thanks in every circumstance, because this is God's will for us in Christ Jesus."
      ],
      "scripture": [
       {
        "ref": "Psalm 30:1–12",
        "text": "I will extol thee, O LORD; for thou hast lifted me up, and hast not made my foes to rejoice over me. O LORD my God, I cried unto thee, and thou hast healed me. O LORD, thou hast brought up my soul from the grave: thou hast kept me alive, that I should not go down to the pit. Sing unto the LORD, O ye saints of his, and give thanks at the remembrance of his holiness. For his anger endureth but a moment; in his favour is life: weeping may endure for a night, but joy cometh in the morning. And in my prosperity I said, I shall never be moved. LORD, by thy favour thou hast made my mountain to stand strong: thou didst hide thy face, and I was troubled. I cried to thee, O LORD; and unto the LORD I made supplication. What profit is there in my blood, when I go down to the pit? Shall the dust praise thee? shall it declare thy truth? Hear, O LORD, and have mercy upon me: LORD, be thou my helper. Thou hast turned for me my mourning into dancing: thou hast put off my sackcloth, and girded me with gladness; To the end that my glory may sing praise to thee, and not be silent. O LORD my God, I will give thanks unto thee for ever."
       },
       {
        "ref": "1 Thessalonians 5:18",
        "text": "In every thing give thanks: for this is the will of God in Christ Jesus concerning you."
       }
      ],
      "activity": {
       "label": "Give thanks",
       "prompt": "Write three things you are thanking God for this morning.",
       "fields": [
        {
         "id": "t1",
         "label": "Thank You, Lord, for…"
        }
       ]
      },
      "audio": "audio/p2v-01.mp3"
     },
     {
      "id": "p2-forgive",
      "title": "Ask for Forgiveness",
      "image": "images/p2-2.jpg",
      "imageAlt": "Clear water poured from a clay jar into a stone basin, with an open Bible and soft light at dawn",
      "purpose": "Purpose: to remove anything that could stand in the way of your breakthrough.",
      "teaching": [
       "Before warfare comes repentance. Pastor Kiky Ocansey taught that sin, even what seems small, can prevent your testimony, your breakthrough and your peace, so we ask the Lord to wash and cleanse us.",
       "Isaiah 55:7 shows that when we turn to the Lord, He will have mercy and abundantly pardon. We do not have to hide from God when we fall short. We come sincerely, confess, and turn from our ways.",
       "Ask forgiveness for the sins you know and the sins you do not know: at work, at home, in how you spoke to your husband, wife or family, and for every negative thought."
      ],
      "scripture": [
       {
        "ref": "Acts 3:19",
        "text": "Repent ye therefore, and be converted, that your sins may be blotted out, when the times of refreshing shall come from the presence of the Lord;"
       },
       {
        "ref": "Isaiah 55:7",
        "text": "Let the wicked forsake his way, and the unrighteous man his thoughts: and let him return unto the LORD, and he will have mercy upon him; and to our God, for he will abundantly pardon."
       },
       {
        "ref": "1 John 1:9",
        "text": "If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness."
       }
      ],
      "activity": {
       "label": "Pray privately",
       "prompt": "Talk to God honestly. This stays private on this device.",
       "fields": [
        {
         "id": "f1",
         "label": "Lord, forgive me and cleanse me from…"
        }
       ]
      },
      "audio": "audio/p2v-02.mp3"
     },
     {
      "id": "p2-spirit",
      "title": "Invite the Strength of the Holy Spirit",
      "image": "images/p2-3.jpg",
      "imageAlt": "Golden light streaming through clouds over a quiet road winding through olive groves",
      "purpose": "Purpose: to fast and pray in God's strength, not your own.",
      "teaching": [
       "We cannot do this in our own strength. Pastor Kiky Ocansey prayed for the strength of the Lord to arise, guide us, fight for us, and scatter our enemies as we fast and pray.",
       "Ask the Spirit of the Lord to dwell in you, in your home and in your surroundings: in the car with you and at your workplace with you.",
       "Ezekiel 36:27 carries a promise and a warning. God puts His Spirit within you and causes you to walk in His statutes, so be careful not to say or do anything contrary to the Word of God. The Holy Spirit within you will vindicate you."
      ],
      "scripture": [
       {
        "ref": "Ezekiel 36:27",
        "text": "And I will put my spirit within you, and cause you to walk in my statutes, and ye shall keep my judgments, and do them."
       },
       {
        "ref": "Psalm 68:1",
        "text": "Let God arise, let his enemies be scattered: let them also that hate him flee before him."
       }
      ],
      "activity": {
       "type": "select",
       "id": "where",
       "label": "Invite Him in",
       "prompt": "Where do you need the Holy Spirit with you today? Tick all that apply.",
       "options": [
        "In my home",
        "In the car or on the road",
        "At my workplace",
        "With my children and family",
        "In my sleep tonight"
       ],
       "fields": [
        {
         "id": "s1",
         "label": "Holy Spirit, strengthen me and fight for me in…"
        }
       ]
      },
      "audio": "audio/p2v-03.mp3"
     },
     {
      "id": "p2-why-dreams",
      "title": "Why Dreams Matter",
      "image": "images/p2-4.jpg",
      "imageAlt": "A simple bed by an open stone window under a calm starry night sky, with a soft beam of golden light",
      "purpose": "Purpose: to understand that the night is not only for the enemy. God also works while you sleep.",
      "teaching": [
       "Job 4:12–17 describes a vision of the night that brought fear and trembling. Pastor Kiky Ocansey taught that one clear sign a dream is trying to control your destiny is when you lack the spiritual power to control it. Some dreams need your fasting and prayer. You cannot simply ignore them.",
       "Job 33 shows the other side. In deep sleep God opens the ears of men and seals their instruction, giving wisdom and understanding. This is why rest is part of healing. Sleep is when God works on your mind, your ability and your strength. Sometimes you wake with an instruction, and the Holy Spirit tells you, “Do not go this way. Go the other way,” because He knows the traps the enemy has set.",
       "Your dream life can show whether you have a good or a bad foundation. A dream can be good or bad, so stop and look at your dreams. If it is of God, receive the instruction. If it is evil, do not allow it to be sealed inside you."
      ],
      "scripture": [
       {
        "ref": "Job 4:12–17",
        "text": "Now a thing was secretly brought to me, and mine ear received a little thereof. In thoughts from the visions of the night, when deep sleep falleth on men, Fear came upon me, and trembling, which made all my bones to shake. Then a spirit passed before my face; the hair of my flesh stood up: It stood still, but I could not discern the form thereof: an image was before mine eyes, there was silence, and I heard a voice, saying, Shall mortal man be more just than God? shall a man be more pure than his maker?"
       },
       {
        "ref": "Job 33:14–18",
        "text": "For God speaketh once, yea twice, yet man perceiveth it not. In a dream, in a vision of the night, when deep sleep falleth upon men, in slumberings upon the bed; Then he openeth the ears of men, and sealeth their instruction, That he may withdraw man from his purpose, and hide pride from man. He keepeth back his soul from the pit, and his life from perishing by the sword."
       }
      ],
      "activity": {
       "type": "select",
       "id": "signs",
       "label": "Look at your dreams",
       "prompt": "Which of these have you noticed? Tick any that apply. This stays private on this device.",
       "options": [
        "Waking up restless, unsettled or angry after a dream",
        "The same kind of dream coming back",
        "Feeling powerless inside a dream",
        "Waking up with a clear instruction or peace from God"
       ],
       "fields": [
        {
         "id": "w1",
         "label": "A dream I want to bring before God"
        }
       ]
      },
      "audio": "audio/p2v-04.mp3"
     },
     {
      "id": "p2-open-doors",
      "title": "How Evil Dreams Get In: Open Doors",
      "image": "images/p2-5.jpg",
      "imageAlt": "An old wooden door in a stone wall being closed at night, with lamplight inside and stars above",
      "purpose": "Purpose: to recognise and close the doors the enemy uses.",
      "teaching": [
       "Matthew 13:25 says that while men slept, the enemy came and sowed tares. Pastor Kiky Ocansey taught that evil manifestations in dreams come through an open door.",
       "The open door might come from your family or your foundation. It might even come from yourself: who you connected with that day, or something you ate or drank from an evil person, a point of contact.",
       "A spirit cannot just jump on you. It needs an open door, a legal right: an agreement, a close friendship, deep conversation, eating together, or sexual contact that forms a strong tie. Marine spirits often come as friends. They give gifts, eat with you and share things with you at work, and after that engagement you begin to see negative dreams of water and the beach.",
       "When you are in a place of prayer, pray. Do not come as a spectator, because a spectator who is not praying becomes vulnerable to attack."
      ],
      "scripture": [
       {
        "ref": "Matthew 13:25",
        "text": "But while men slept, his enemy came and sowed tares among the wheat, and went his way."
       }
      ],
      "activity": {
       "label": "Close the door",
       "prompt": "Ask the Holy Spirit to show you any door that needs closing, then pray over it by the blood of Jesus.",
       "fields": [
        {
         "id": "o1",
         "label": "A door I am closing by the blood of Jesus"
        }
       ]
      },
      "audio": "audio/p2v-05.mp3"
     },
     {
      "id": "p2-why-cancel",
      "title": "Why We Cancel Negative Dreams",
      "image": "images/p2-6.jpg",
      "imageAlt": "An old bronze shield resting against a stone wall under a starry sky, lit by a soft beam of light",
      "purpose": "Purpose: to understand why the prophetic direction tells you to cancel every evil dream.",
      "teaching": [
       "This page explains the step of the prophetic direction that says “cancel every evil dream, nightmare and negative declaration.” It was taught in the service and not explained in the written direction.",
       "Do not let it be sealed inside you. Pastor Kiky Ocansey taught that the enemy uses dreams to plant instructions of destruction. If you see someone punching you, a scary face, a dead relative or any negativity, do not allow those instructions to be sealed inside you.",
       "Dreams prepare you for what lies ahead. That is why you cancel every evil challenge ahead before it manifests. She taught that sorrow and tragedy come easily when we fail to use the blood of Jesus, the Word of God and the Holy Ghost against satanic nightmares.",
       "What is rebuked cannot enter your physical world. Bad dreams carry the expectations of the enemy for your life. When you cancel them in prayer, they cannot cross into your day.",
       "You can feel the difference. She taught that a day when everything goes wrong can be the enemy's instructions of destruction at work. A day when doors open, people smile at you, and there is peace, strength and joy in your heart is grace, peace and favour.",
       "God gave us the armoury. He did not leave us helpless. He gave us power to bind and loose, power over all the power of the enemy, and the blood of the Lamb."
      ],
      "scripture": [
       {
        "ref": "Matthew 18:18",
        "text": "Verily I say unto you, Whatsoever ye shall bind on earth shall be bound in heaven: and whatsoever ye shall loose on earth shall be loosed in heaven."
       },
       {
        "ref": "Luke 10:19",
        "text": "Behold, I give unto you power to tread on serpents and scorpions, and over all the power of the enemy: and nothing shall by any means hurt you."
       },
       {
        "ref": "Revelation 12:11",
        "text": "And they overcame him by the blood of the Lamb, and by the word of their testimony; and they loved not their lives unto the death."
       }
      ],
      "activity": {
       "label": "Take your authority",
       "prompt": "Write the dream or the expectation of the enemy you are refusing to let manifest.",
       "fields": [
        {
         "id": "c1",
         "label": "By the blood of Jesus, I refuse to let this manifest:"
        }
       ]
      },
      "audio": "audio/p2v-06.mp3"
     },
     {
      "id": "p2-examples",
      "title": "Examples of Evil Dreams to Cancel",
      "image": "images/p2-7.jpg",
      "imageAlt": "A clay oil lamp shining on an open Bible at night, with broken chains on the stone floor beside it",
      "purpose": "Purpose: to recognise the kinds of evil dreams Pastor Kiky Ocansey named, and how to pray against each one.",
      "teaching": [
       "These are the kinds of dreams named in the service. Under each one is what was taught about it and a prayer to pray. If you have had one of these dreams, pray against it. Do not allow it to manifest or take any stand in your life and destiny."
      ],
      "examples": [
       {
        "dream": "Being pressed or held down by faceless figures",
        "meaning": "The person often wakes restless, unsettled and disturbed all day, sometimes angry with everybody, just because of one dream.",
        "pray": "By the blood of Jesus, I reject every oppression in my sleep. My peace is restored, in Jesus name."
       },
       {
        "dream": "Someone punching you, a scary face, or a dead relative",
        "meaning": "These are instructions the enemy wants to seal inside you. Do not allow them to be sealed.",
        "pray": "I rebuke every satanic instruction placed in my dream. It shall not be sealed inside me, in Jesus name."
       },
       {
        "dream": "Being chased, or animals in the dream",
        "meaning": "Named among the dreams to cancel straight away.",
        "pray": "Whatever is chasing me in the dream, I cancel it by the power of the Holy Ghost, in Jesus name."
       },
       {
        "dream": "Snakes in the dream",
        "meaning": "Named in the prayers among dreams to be rebuked right away.",
        "pray": "Every serpent in my dream, I rebuke you now by the blood of Jesus."
       },
       {
        "dream": "Swimming in a river, or being in water or at the beach",
        "meaning": "Linked to marine spirits, which often first come as friends, give gifts or eat with you.",
        "pray": "Every marine attachment and every deposit placed in me through water dreams, I cancel it by the blood of Jesus."
       },
       {
        "dream": "Spiritual marriage or sexual contact in the dream",
        "meaning": "Taught as a deposit meant to destroy, weaken, bring sickness, and cause separation in marriage.",
        "pray": "Whatever deposit was placed inside me, I rebuke it. The assignment to destroy my life, weaken my life, bring sickness and separation in marriage, I cancel it, in Jesus name."
       },
       {
        "dream": "Being back at your old school or old home",
        "meaning": "A dream of stagnation and backwardness, meant to send you back to square one.",
        "pray": "I am moving forward in life by the power of the Holy Ghost. I will not go back. I will not be sent back, in Jesus name."
       },
       {
        "dream": "Being fed or eating in the dream",
        "meaning": "Named among the ways the enemy appears in dreams to upset and interrupt your life.",
        "pray": "Whoever desires to appear in my dream, fight in my dream or feed me in the dream, be silenced in the name of Jesus."
       },
       {
        "dream": "Giving money to someone in the dream",
        "meaning": "Prayed against as a dream of loss, where your money is wasted.",
        "pray": "My money will not be wasted. Every dream of loss over my finances, I cancel it, in Jesus name."
       },
       {
        "dream": "Something valuable stolen or carried away",
        "meaning": "No enemy and no entity can carry away anything that belongs to you.",
        "pray": "Every power stealing my progress in my dream world, return it now, in the name of Jesus."
       },
       {
        "dream": "Your vehicle set on fire or stopped on the road",
        "meaning": "A vehicle in a dream can symbolise your destiny, the thing that moves you forward. The enemy wants to stop you reaching your destination through affliction, sickness, weakness, distraction or disgrace.",
        "pray": "My vehicle of destiny will not break down. I cannot be stopped. I will reach my destination, in Jesus name."
       },
       {
        "dream": "Dreams of premature death",
        "meaning": "Cancelled with Psalm 118:17.",
        "pray": "I shall not die, but live, and declare the works of the LORD (Psalm 118:17). I cancel the dream of premature death, in Jesus name."
       },
       {
        "dream": "Dreams of shame, embarrassment, failure or rejection",
        "meaning": "Named in the service declarations against career, marriage and progress.",
        "pray": "I cancel every bad dream of shame, embarrassment, failure and rejection over my life, in Jesus name."
       },
       {
        "dream": "Dreams of confusion, suffering, hardship or endless hard labour",
        "meaning": "Named in the service declarations.",
        "pray": "I cancel the dreams of backwardness, confusion, stagnation, suffering and endless hard labour, in Jesus name."
       }
      ],
      "scripture": [
       {
        "ref": "Psalm 118:17",
        "text": "I shall not die, but live, and declare the works of the LORD."
       },
       {
        "ref": "Isaiah 54:17",
        "text": "No weapon that is formed against thee shall prosper; and every tongue that shall rise against thee in judgment thou shalt condemn. This is the heritage of the servants of the LORD, and their righteousness is of me, saith the LORD."
       }
      ],
      "activity": {
       "type": "select",
       "id": "mine",
       "label": "Bring yours before God",
       "prompt": "Which of these have you seen? Tick all that apply, then pray the prayer under each one. This stays private on this device.",
       "options": [
        "Pressed by faceless figures",
        "Punched, a scary face or a dead relative",
        "Chased, or animals",
        "Snakes",
        "Water, river or beach",
        "Spiritual marriage",
        "Old school or old home",
        "Fed in the dream",
        "Giving money away",
        "Something stolen",
        "Vehicle on fire or stopped",
        "Premature death",
        "Shame, failure or rejection",
        "Confusion, suffering or hard labour"
       ],
       "fields": [
        {
         "id": "e1",
         "label": "Any other dream I am cancelling by the blood of Jesus"
        }
       ]
      },
      "audio": "audio/p2v-07.mp3"
     },
     {
      "id": "p2-when-wake",
      "title": "What to Do When You Wake from a Dream",
      "image": "images/p2-8.jpg",
      "imageAlt": "A small clay flask of anointing oil and a cup of communion wine on a bedside ledge by a window under the stars",
      "purpose": "Purpose: to know exactly what to do in the moment you wake from an evil dream.",
      "teaching": [
       "Pray immediately. It is very good to pray against any evil dream at once, silently or aloud, the moment you wake.",
       "Keep the oil or the communion nearby. Anoint yourself and say, “I anoint myself from any satanic plans, any satanic instructions over my life and over my destiny. I rebuke the assignment of the wicked in the mighty name of Jesus.”",
       "You do not need to say much. Reject what the enemy is bringing, then go back to sleep. No matter how weak you feel in the night, make sure you cancel any bad dream you can remember.",
       "Stand on the Word. Scriptures can defeat the works of the enemy. Sometimes a Scripture comes to you as you wake, or you open the Bible and read it, and it cancels the dream immediately.",
       "If the dream is good, claim it. Do not leave a good dream. Begin to claim it for yourself by the power of the Holy Ghost."
      ],
      "scripture": [
       {
        "ref": "Psalm 35:1–3",
        "text": "Plead my cause, O LORD, with them that strive with me: fight against them that fight against me. Take hold of shield and buckler, and stand up for mine help. Draw out also the spear, and stop the way against them that persecute me: say unto my soul, I am thy salvation."
       },
       {
        "ref": "Psalm 94:1–2",
        "text": "O LORD God, to whom vengeance belongeth; O God, to whom vengeance belongeth, shew thyself. Lift up thyself, thou judge of the earth: render a reward to the proud."
       },
       {
        "ref": "2 Corinthians 10:4–5",
        "text": "(For the weapons of our warfare are not carnal, but mighty through God to the pulling down of strong holds;) Casting down imaginations, and every high thing that exalteth itself against the knowledge of God, and bringing into captivity every thought to the obedience of Christ;"
       }
      ],
      "activity": {
       "label": "Keep it by your bed",
       "prompt": "Write a short prayer you will pray the next time you wake from an evil dream.",
       "fields": [
        {
         "id": "k1",
         "label": "My bedside prayer",
         "placeholder": "By the blood of Jesus, I reject…"
        }
       ]
      },
      "audio": "audio/p2v-08.mp3"
     },
     {
      "id": "p2-not-people",
      "title": "The Battle Is Against Spirits, Not People",
      "image": "images/p2-9.jpg",
      "imageAlt": "Ancient stone city walls at night with a single watchtower lamp lit and a calm starry sky above",
      "purpose": "Purpose: to pray with understanding, without aiming your prayers at a person.",
      "teaching": [
       "During questions, Pastor Kiky Ocansey taught that when someone sends evil arrows, they are not using their own strength. They are working with a spirit, an entity. In warfare you are not killing the aunt or the uncle. You are making powerless the spirit and power they use, so it no longer works on you, and the arrow returns to that entity.",
       "God gives even the wicked a chance to return to Him (Isaiah 55:7). Yet God must come first, above father, mother, husband or wife. If He reveals something to protect you, do not put His revelation aside.",
       "When you pray and do warfare, do not have anybody in mind. It can be anybody. Pray a general prayer, because we wrestle not against flesh and blood.",
       "It is not by your own power. As a child of God you have the Holy Spirit with you and angels around you. The battle is won by the Spirit of the Lord."
      ],
      "scripture": [
       {
        "ref": "Ephesians 6:12",
        "text": "For we wrestle not against flesh and blood, but against principalities, against powers, against the rulers of the darkness of this world, against spiritual wickedness in high places."
       },
       {
        "ref": "Matthew 10:37",
        "text": "He that loveth father or mother more than me is not worthy of me: and he that loveth son or daughter more than me is not worthy of me."
       },
       {
        "ref": "Romans 8:31",
        "text": "What shall we then say to these things? If God be for us, who can be against us?"
       }
      ],
      "activity": {
       "label": "Pray a general prayer",
       "prompt": "Write a warfare prayer that names the power, not a person.",
       "fields": [
        {
         "id": "n1",
         "label": "Every power working against my life and destiny…"
        }
       ]
      },
      "audio": "audio/p2v-09.mp3"
     },
     {
      "id": "p2-promises",
      "title": "God Is With You: Scriptures for Today",
      "image": "images/p2-10.jpg",
      "imageAlt": "A lone olive tree on a hill at dawn, with golden light breaking over the horizon",
      "purpose": "Purpose: to stand on the promises declared over you in the service.",
      "teaching": [
       "After the declarations, Pastor Kiky Ocansey spoke these Scriptures over the family. When you fall, you shall arise. The handwriting against you is nailed to the cross. There is no enchantment against you. A thousand shall fall at your side, but it shall not come near you, as you sleep and as you wake.",
       "The Lord fights for you against your enemies. When the enemy comes in like a flood, the Spirit of the Lord lifts up a standard against him. They that be with us are more than they that be with them. Just because you cannot see the angels around you does not mean they are not there."
      ],
      "scripture": [
       {
        "ref": "Micah 7:8",
        "text": "Rejoice not against me, O mine enemy: when I fall, I shall arise; when I sit in darkness, the LORD shall be a light unto me."
       },
       {
        "ref": "Psalm 27:1–2",
        "text": "The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid? When the wicked, even mine enemies and my foes, came upon me to eat up my flesh, they stumbled and fell."
       },
       {
        "ref": "Colossians 2:14",
        "text": "Blotting out the handwriting of ordinances that was against us, which was contrary to us, and took it out of the way, nailing it to his cross;"
       },
       {
        "ref": "Numbers 23:23",
        "text": "Surely there is no enchantment against Jacob, neither is there any divination against Israel: according to this time it shall be said of Jacob and of Israel, What hath God wrought!"
       },
       {
        "ref": "Psalm 91:7",
        "text": "A thousand shall fall at thy side, and ten thousand at thy right hand; but it shall not come nigh thee."
       },
       {
        "ref": "Isaiah 41:10",
        "text": "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness."
       },
       {
        "ref": "Deuteronomy 20:4",
        "text": "For the LORD your God is he that goeth with you, to fight for you against your enemies, to save you."
       },
       {
        "ref": "Isaiah 59:19",
        "text": "So shall they fear the name of the LORD from the west, and his glory from the rising of the sun. When the enemy shall come in like a flood, the Spirit of the LORD shall lift up a standard against him."
       },
       {
        "ref": "2 Kings 6:16",
        "text": "And he answered, Fear not: for they that be with us are more than they that be with them."
       }
      ],
      "activity": {
       "label": "Make it personal",
       "prompt": "Choose one Scripture from this page and write it as your own declaration.",
       "fields": [
        {
         "id": "g1",
         "label": "My declaration for today"
        }
       ]
      },
      "audio": "audio/p2v-10.mp3"
     },
     {
      "id": "p2-grace",
      "title": "Carry the Grace: Romans 16:20",
      "image": "images/p2-11.jpg",
      "imageAlt": "A clay flask of anointing oil beside an open Bible on an olive-wood table in warm morning light",
      "purpose": "Purpose: to close the service by anointing with oil and carrying the grace of the Lord into your day.",
      "teaching": [
       "Pastor Kiky Ocansey taught that everything carries a spirit, and the grace of our Lord Jesus Christ is a spirit that goes with you. That is why people bring documents to be prayed over, so they carry the Holy Spirit. As you go about your day, this week and to the end of this year, carry the Spirit and grace of the Lord with you, your children, your workplace, your business and your career.",
       "Take your oil. Read Romans 16:20 aloud as your own: “And the God of peace shall bruise Satan under my feet shortly.” Then anoint yourself. The attacks of the wicked are already under your feet.",
       "Then follow the prophetic direction when you end your fast. Take your communion and read the Scriptures provided. Pray through the declarations, cancelling every evil dream and plan of the wicked by the blood of Jesus. Mark yourself, then drink the communion. We overcome by the blood of the Lamb and by the word of our testimony."
      ],
      "scripture": [
       {
        "ref": "Romans 16:20",
        "text": "And the God of peace shall bruise Satan under your feet shortly. The grace of our Lord Jesus Christ be with you. Amen."
       }
      ],
      "activity": {
       "type": "select",
       "id": "done",
       "label": "Finish well",
       "prompt": "Tick each step as you complete it.",
       "options": [
        "I read Romans 16:20 aloud as my own",
        "I anointed myself with oil",
        "I followed the prophetic direction when I ended my fast",
        "I prayed the declarations and drank the communion"
       ],
       "fields": [
        {
         "id": "z1",
         "label": "What I am carrying into this week"
        }
       ]
      },
      "audio": "audio/p2v-11.mp3"
     }
    ]
   }
  ],
  quiz: {
    image: "images/quiz.jpg", imageAlt: "An open Bible with a quill and clay ink pot by an oil lamp, with a starry night through a stone window",
    audio: "audio/05-quiz.mp3",
    beginner: [
      {"q": "In Part 1, what was taught about people who say “I don't dream”?", "options": ["They are more spiritual", "Their dreams may be stolen or lost", "They never need to pray"], "answer": 1, "explain": "Everyone dreams. If you cannot remember, your dreams may be stolen or lost (Job 20:8). Keep a notebook by your bed."},
      {"q": "Psalm 91:5 says, “Thou shalt not be afraid for the terror by…”", "options": ["Day", "Night", "Water"], "answer": 1, "explain": "“Thou shalt not be afraid for the terror by night; nor for the arrow that flieth by day.” Many night terrors happen in dreams."},
      { q: "What does the communion wine represent?", options: ["The precious blood of Jesus Christ", "A celebration meal", "The end of the fast only"], answer: 0, explain: "The prophetic direction says the communion wine represents the precious blood of Jesus Christ." },
      { q: "When were these prophetic directions to be followed?", options: ["Before starting the fast", "When breaking the fast today", "Only at midnight"], answer: 1, explain: "“When you break your fast today, follow these prophetic directions.”" },
      { q: "According to Revelation 12:11, how did they overcome?", options: ["By their own strength", "By the blood of the Lamb and by the word of their testimony", "By staying silent"], answer: 1, explain: "“And they overcame him by the blood of the Lamb, and by the word of their testimony.”" },
      { q: "Isaiah 54:17 says no weapon formed against thee shall…", options: ["Be seen", "Prosper", "Be remembered"], answer: 1, explain: "“No weapon that is formed against thee shall prosper.”" },
      {"q": "What did the Part 2 service begin with?", "options": ["Thanksgiving", "Silence", "An offering"], "answer": 0, "explain": "The service opened with thanksgiving, reading Psalm 30 and 1 Thessalonians 5:18: “In every thing give thanks.”"},
      {"q": "According to Matthew 13:25, when did the enemy sow tares among the wheat?", "options": ["While men slept", "At midday", "During the harvest"], "answer": 0, "explain": "“But while men slept, his enemy came and sowed tares among the wheat, and went his way.”"},
      {"q": "When should you pray against an evil dream?", "options": ["Next week", "Immediately, as soon as you wake", "Only if it happens three times"], "answer": 1, "explain": "It is very good to pray against any evil dream immediately, silently or aloud, then go back to sleep."}
    ],
    intermediate: [
      {"q": "Why do we rebuke a bad dream, according to the Part 1 teaching on the physical door?", "options": ["To shut it before it comes through your physical door", "Because every dream is from God", "So we can forget about it"], "answer": 0, "explain": "Anything that moves from the spiritual to the physical comes through an invisible door. Rebuking a dream shuts it before it comes through."},
      {"q": "What was taught about being “on fire” spiritually?", "options": ["It makes no difference to dreams", "Certain dreams stop when you are on fire and return when you slow down", "It is only needed on Sundays"], "answer": 1, "explain": "When you are on fire, there are certain dreams you will not see anymore. Isaiah 52:1: “Awake, awake; put on thy strength.”"},
      { q: "Where were you directed to mark yourself with a little communion wine?", options: ["On the forehead", "On the door", "On the hands"], answer: 0, explain: "Mark your forehead with a little communion wine, declaring your faith in the protection of the blood of Jesus." },
      { q: "What comes right after praying the declarations?", options: ["Going straight to sleep", "Drinking the communion wine in remembrance and thanking God", "Reading the Scriptures for the first time"], answer: 1, explain: "After praying, drink your communion wine in remembrance of the blood of Jesus Christ and thank God for your deliverance." },
      { q: "According to Job 33:15, when does God speak?", options: ["In a dream, in a vision of the night", "Only in the morning", "Never in dreams"], answer: 0, explain: "“In a dream, in a vision of the night, when deep sleep falleth upon men, in slumberings upon the bed.”" },
      { q: "Which Scripture is declared near the end of the prayer?", options: ["Psalm 118:17", "Genesis 1:28", "Luke 10:19"], answer: 0, explain: "“I shall not die, but live, and declare the works of the LORD.” (Psalm 118:17)" },
      {"q": "What was taught about a dream of being back at your old school or old home?", "options": ["It means promotion", "It is a dream of stagnation and backwardness, meant to send you back to square one", "It means nothing"], "answer": 1, "explain": "Declare: “I am moving forward in life. I will not go back. I will not be sent back.”"},
      {"q": "Why should you not let an evil dream go unaddressed?", "options": ["Because the enemy wants its instruction sealed inside you", "Because dreams are always true", "Because you must tell everyone about it"], "answer": 0, "explain": "Do not allow those instructions to be sealed inside you. What is rebuked cannot enter your physical world."},
      {"q": "What should you do with a good dream from God?", "options": ["Forget it", "Claim it by the power of the Holy Ghost", "Cancel it as well"], "answer": 1, "explain": "If the dream is good, do not leave it. Begin to claim it for yourself."}
    ],
    advanced: [
      {"q": "You wake from an evil dream and must leave for work in ten minutes. What did Part 1 teach?", "options": ["Wait until you have an hour to pray", "Take two to five minutes: drink the blood or a little oil, cancel the dream, then go about your day", "Say nothing and hope it passes"], "answer": 1, "explain": "You do not need an hour. “I nullify, I dismantle the works of the wicked… I cancel this dream; it shall not be my reality.” Do not be silent."},
      {"q": "You dreamed of cooking in a very large pot. How did Part 1 teach you to respond?", "options": ["Rebuke it as an attack", "Claim it as a good dream so it comes through your physical door", "Ignore it"], "answer": 1, "explain": "Cooking in a very large pot was taught as a sign of a business being enlarged. Good dreams must be claimed so they come to pass."},
      { q: "Someone keeps having the same bad dream. Which part of the prayer speaks directly to this?", options: ["“By the blood of Jesus I cancel every curse of having recurring bad dreams”", "“I cancel the dream of unprofitable investment”", "“Thank You Jesus”"], answer: 0, explain: "The prayer cancels every curse of having recurring bad dreams by the blood of Jesus." },
      { q: "What is the right order for following the direction?", options: ["Drink, read, mark, pray", "Get communion wine, read the Scriptures, mark the forehead, pray, then drink and give thanks", "Pray, then get communion wine later"], answer: 1, explain: "Get the communion wine, read Revelation 12:11, Isaiah 54:17 and Job 33:14–18, mark your forehead, pray the declarations, then drink the communion wine and thank God." },
      { q: "Job 33:18 says God keeps back man's soul from…", options: ["The pit", "Success", "Rest"], answer: 0, explain: "“He keepeth back his soul from the pit, and his life from perishing by the sword.”" },
      { q: "What does the prayer say you collect back as you drink the communion wine?", options: ["Old debts", "All my joy and sound progress stolen from my dream sleep", "Nothing"], answer: 1, explain: "“As I drink the blood I collect back all my joy, sound progress stolen from my dream sleep, in Jesus name.”" },
      {"q": "In a dream, a vehicle is set on fire. What can the vehicle symbolise?", "options": ["Your destiny, the thing that moves you forward", "Only your car", "Your house"], "answer": 0, "explain": "A vehicle can symbolise your destiny. Declare: “My vehicle of destiny will not break down.”"},
      {"q": "Someone fears that praying “back to sender” will harm a family member. What was taught?", "options": ["Never pray at all", "You are making powerless the spirit and power they use, not aiming at the person", "Name the person in every prayer"], "answer": 1, "explain": "Pray a general prayer and do not have anybody in mind. “We wrestle not against flesh and blood” (Ephesians 6:12)."},
      {"q": "Can a spirit just jump onto you in a prayer room?", "options": ["Yes, at any time", "No. It needs an open door or legal right, such as a close tie or agreement", "Only if you unmute"], "answer": 1, "explain": "A spirit needs an open door. In a place of prayer, pray rather than be a spectator."}
    ]
  },

  declarationsTitle: "The Prophetic Prayer",
  declarationsAudio: "audio/06-declarations.mp3",
  declarationsImage: "images/decl.jpg", declarationsImageAlt: "Broken iron chains on stone steps before an open prison doorway, with golden light pouring in from the night sky",
  declarations: [
    {"text": "Heavenly Father, in the mighty name of Jesus Christ, as I break my fast today, I come under the covering of the precious blood of Jesus."},
    {"text": "By the blood of Jesus, I cancel every evil dream, nightmare and negative declaration concerning my life, my children, my family, my marriage, my health, my finances and my destiny.", "ref": "Revelation 12:11"},
    {"text": "Every plan of darkness against my life, whether through dreams or otherwise, be destroyed in the mighty Name of Jesus."},
    {"text": "Every evil dream designed to bring fear, confusion, delay, disappointment, sickness, backwardness or destruction into my life, I declare you powerless now."},
    {"text": "As I mark myself by faith with the blood of Jesus, I declare that no weapon formed against me shall prosper.", "ref": "Isaiah 54:17"},
    {"text": "Every evil assignment against my destiny, be cancelled by the authority of Jesus Christ."},
    {"text": "As I partake of this communion, I declare that my life belongs to Jesus. My sleep shall be peaceful, my dreams shall not torment me, and my future is secured in God's hands."},
    {"text": "I cancel all dreams of hopelessness and frustrations, in Jesus name."},
    {"text": "With the blood of Jesus, let the seed of darkness planted in my dreams be erased, in Jesus name."},
    {"text": "By the blood of Jesus I cancel the hands of the wicked upon my dream life, in Jesus name."},
    {"text": "I cancel any dream of marital problems with my partner, in Jesus name."},
    {"text": "I cancel the dream of curses and evil covenant, in the name of Jesus."},
    {"text": "I neutralize the operation of foundational demons in my life, in Jesus name."},
    {"text": "By the blood of Jesus I cancel the dream of profitless hardworking and loss, in Jesus name."},
    {"text": "I cancel the dream of unprofitable investment, in Jesus name."},
    {"text": "I cancel the dream of financial debts and servitude, in Jesus name."},
    {"text": "By the blood of Jesus I cancel every curse of having recurring bad dreams, in Jesus name."},
    {"text": "I apply the blood of Jesus into my dream life from hence, in Jesus name."},
    {"text": "I command demons of yoke expanders to disappear from my territory, in Jesus name."},
    {"text": "By the blood of Jesus I cancel and nullify the dream of satanic bondage and manipulation, in Jesus name."},
    {"text": "I rebuke the dreams that is working against my glorious dreams, in Jesus name."},
    {"text": "As I drink the blood I collect back all my joy, sound progress stolen from my dream sleep, in Jesus name. Amen."},
    {"text": "I shall not die, but live, and declare the works of the LORD.", "ref": "Psalm 118:17"},
    {"text": "Every dream of the wicked concerning my life shall not come to pass, in Jesus name. Amen."},
    {"text": "For my loved ones: By the blood of Jesus, I cancel every evil dream, nightmare and negative declaration concerning {NAMES}, in Jesus name.", "ref": "Added so you can pray the same over your loved ones"},
    {"text": "Thank You, Jesus."}
  ],
  myWorkAudio: "audio/07-mywork.mp3",
  helpAudio: "audio/08-help.mp3",
  help: { contact: "" } // Add a real ministry contact only if supplied. Never invent one.
};

/* Part Two listening: sentence timings measured from the actual audio (speech recognition word times).
   Used only to highlight the sentence being read; the voice always leads. */
(function () {
  var W = window.WORKBOOK, sv = W.services[1], T = {"p2-thanks":{"dur":160.6,"segs":[{"kind":"teach","i":0,"voice":"charon","chap":"Teaching","lines":[{"f":"title","t":"Begin with Thanksgiving.","s":0.0,"e":1.46},{"f":"text","t":"The service opened with thanksgiving.","s":1.46,"e":4.3},{"f":"text","t":"Pastor Kiky Ocansey led the family to Psalm 30 and thanked God for protection through the night, for the breath of life, and for covering our families and children.","s":4.3,"e":16.05}]},{"kind":"teach","i":1,"voice":"charon","chap":"Teaching","lines":[{"f":"text","t":"She taught that in Psalm 30 David faced many enemies who threatened his life, yet God kept him alive through every trial and rescued him even from the brink of death.","s":16.75,"e":28.31},{"f":"text","t":"God has done the same for you, delivering you from trouble, sickness, affliction and many attacks of the wicked.","s":28.31,"e":36.32}]},{"kind":"teach","i":2,"voice":"charon","chap":"Teaching","lines":[{"f":"text","t":"We did not wake up by our own might or strength, but by the power of the Holy Spirit.","s":37.02,"e":44.36},{"f":"text","t":"So we give thanks in every circumstance, because this is God's will for us in Christ Jesus.","s":44.36,"e":51.95}]},{"kind":"scripture","i":0,"voice":"iapetus","chap":"Scripture · Psalm 30:1–12","lines":[{"f":"ref","t":"Psalm 30, verses 1 to 12.","s":53.15,"e":57.03},{"f":"text","t":"I will extol thee, O LORD; for thou hast lifted me up, and hast not made my foes to rejoice over me.","s":57.03,"e":65.47},{"f":"text","t":"O LORD my God, I cried unto thee, and thou hast healed me.","s":65.47,"e":70.53},{"f":"text","t":"O LORD, thou hast brought up my soul from the grave: thou hast kept me alive, that I should not go down to the pit.","s":70.53,"e":78.99},{"f":"text","t":"Sing unto the LORD, O ye saints of his, and give thanks at the remembrance of his holiness.","s":78.99,"e":85.33},{"f":"text","t":"For his anger endureth but a moment; in his favour is life: weeping may endure for a night, but joy cometh in the morning.","s":85.33,"e":96.41},{"f":"text","t":"And in my prosperity I said, I shall never be moved.","s":96.41,"e":101.05},{"f":"text","t":"LORD, by thy favour thou hast made my mountain to stand strong: thou didst hide thy face, and I was troubled.","s":101.05,"e":110.03},{"f":"text","t":"I cried to thee, O LORD; and unto the LORD I made supplication.","s":110.03,"e":115.25},{"f":"text","t":"What profit is there in my blood, when I go down to the pit?","s":115.25,"e":119.59},{"f":"text","t":"Shall the dust praise thee? shall it declare thy truth?","s":119.59,"e":124.35},{"f":"text","t":"Hear, O LORD, and have mercy upon me: LORD, be thou my helper.","s":124.35,"e":130.43},{"f":"text","t":"Thou hast turned for me my mourning into dancing: thou hast put off my sackcloth, and girded me with gladness; To the end that my glory may sing praise to thee, and not be silent.","s":130.43,"e":144.87},{"f":"text","t":"O LORD my God, I will give thanks unto thee for ever.","s":144.87,"e":149.08}]},{"kind":"scripture","i":1,"voice":"iapetus","chap":"Scripture · 1 Thessalonians 5:18","lines":[{"f":"ref","t":"1 Thessalonians 5, verse 18.","s":149.78,"e":153.95},{"f":"text","t":"In every thing give thanks: for this is the will of God in Christ Jesus concerning you.","s":153.95,"e":160.6}]}]},"p2-forgive":{"dur":94.03,"segs":[{"kind":"teach","i":0,"voice":"charon","chap":"Teaching","lines":[{"f":"title","t":"Ask for Forgiveness.","s":0.0,"e":2.5},{"f":"text","t":"Before warfare comes repentance.","s":2.5,"e":5.0},{"f":"text","t":"Pastor Kiky Ocansey taught that sin, even what seems small, can prevent your testimony, your breakthrough and your peace, so we ask the Lord to wash and cleanse us.","s":5.0,"e":16.61}]},{"kind":"teach","i":1,"voice":"charon","chap":"Teaching","lines":[{"f":"text","t":"Isaiah 55:7 shows that when we turn to the Lord, He will have mercy and abundantly pardon.","s":17.31,"e":25.83},{"f":"text","t":"We do not have to hide from God when we fall short.","s":25.83,"e":28.77},{"f":"text","t":"We come sincerely, confess, and turn from our ways.","s":28.77,"e":33.84}]},{"kind":"teach","i":2,"voice":"charon","chap":"Teaching","lines":[{"f":"text","t":"Ask forgiveness for the sins you know and the sins you do not know: at work, at home, in how you spoke to your husband, wife or family, and for every negative thought.","s":34.54,"e":45.11}]},{"kind":"scripture","i":0,"voice":"iapetus","chap":"Scripture · Acts 3:19","lines":[{"f":"ref","t":"Acts 3, verse 19.","s":46.31,"e":49.71},{"f":"text","t":"Repent ye therefore, and be converted, that your sins may be blotted out, when the times of refreshing shall come from the presence of the Lord;","s":49.71,"e":62.04}]},{"kind":"scripture","i":1,"voice":"iapetus","chap":"Scripture · Isaiah 55:7","lines":[{"f":"ref","t":"Isaiah 55, verse 7.","s":62.74,"e":66.6},{"f":"text","t":"Let the wicked forsake his way, and the unrighteous man his thoughts: and let him return unto the LORD, and he will have mercy upon him; and to our God, for he will abundantly pardon.","s":66.6,"e":82.11}]},{"kind":"scripture","i":2,"voice":"iapetus","chap":"Scripture · 1 John 1:9","lines":[{"f":"ref","t":"1 John 1, verse 9.","s":82.81,"e":85.51},{"f":"text","t":"If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.","s":85.51,"e":94.03}]}]},"p2-spirit":{"dur":75.92,"segs":[{"kind":"teach","i":0,"voice":"charon","chap":"Teaching","lines":[{"f":"title","t":"Invite the Strength of the Holy Spirit.","s":0.0,"e":3.66},{"f":"text","t":"We cannot do this in our own strength.","s":3.66,"e":7.64},{"f":"text","t":"Pastor Kiky Ocansey prayed for the strength of the Lord to arise, guide us, fight for us, and scatter our enemies as we fast and pray.","s":7.64,"e":18.21}]},{"kind":"teach","i":1,"voice":"charon","chap":"Teaching","lines":[{"f":"text","t":"Ask the Spirit of the Lord to dwell in you, in your home and in your surroundings: in the car with you and at your workplace with you.","s":18.91,"e":28.64}]},{"kind":"teach","i":2,"voice":"charon","chap":"Teaching","lines":[{"f":"text","t":"Ezekiel 36:27 carries a promise and a warning.","s":29.34,"e":35.36},{"f":"text","t":"God puts His Spirit within you and causes you to walk in His statutes, so be careful not to say or do anything contrary to the Word of God.","s":35.36,"e":47.62},{"f":"text","t":"The Holy Spirit within you will vindicate you.","s":47.62,"e":51.03}]},{"kind":"scripture","i":0,"voice":"iapetus","chap":"Scripture · Ezekiel 36:27","lines":[{"f":"ref","t":"Ezekiel 36, verse 27.","s":52.23,"e":55.51},{"f":"text","t":"And I will put my spirit within you, and cause you to walk in my statutes, and ye shall keep my judgments, and do them.","s":55.51,"e":64.48}]},{"kind":"scripture","i":1,"voice":"iapetus","chap":"Scripture · Psalm 68:1","lines":[{"f":"ref","t":"Psalm 68, verse 1.","s":65.18,"e":67.99},{"f":"text","t":"Let God arise, let his enemies be scattered: let them also that hate him flee before him.","s":67.99,"e":75.92}]}]},"p2-why-dreams":{"dur":153.8,"segs":[{"kind":"teach","i":0,"voice":"charon","chap":"Teaching","lines":[{"f":"title","t":"Why Dreams Matter.","s":0.0,"e":1.32},{"f":"text","t":"Job 4:12–17 describes a vision of the night that brought fear and trembling.","s":1.32,"e":9.34},{"f":"text","t":"Pastor Kiky Ocansey taught that one clear sign a dream is trying to control your destiny is when you lack the spiritual power to control it.","s":9.34,"e":18.5},{"f":"text","t":"Some dreams need your fasting and prayer.","s":18.5,"e":21.44},{"f":"text","t":"You cannot simply ignore them.","s":21.44,"e":23.33}]},{"kind":"teach","i":1,"voice":"charon","chap":"Teaching","lines":[{"f":"text","t":"Job 33 shows the other side.","s":24.03,"e":26.45},{"f":"text","t":"In deep sleep God opens the ears of men and seals their instruction, giving wisdom and understanding.","s":26.45,"e":33.87},{"f":"text","t":"This is why rest is part of healing.","s":33.87,"e":36.91},{"f":"text","t":"Sleep is when God works on your mind, your ability and your strength.","s":36.91,"e":41.55},{"f":"text","t":"Sometimes you wake with an instruction, and the Holy Spirit tells you, “Do not go this way.","s":41.55,"e":46.99},{"f":"text","t":"Go the other way,” because He knows the traps the enemy has set.","s":46.99,"e":51.2}]},{"kind":"teach","i":2,"voice":"charon","chap":"Teaching","lines":[{"f":"text","t":"Your dream life can show whether you have a good or a bad foundation.","s":51.9,"e":57.52},{"f":"text","t":"A dream can be good or bad, so stop and look at your dreams.","s":57.52,"e":62.94},{"f":"text","t":"If it is of God, receive the instruction.","s":62.94,"e":66.52},{"f":"text","t":"If it is evil, do not allow it to be sealed inside you.","s":66.52,"e":71.03}]},{"kind":"scripture","i":0,"voice":"iapetus","chap":"Scripture · Job 4:12–17","lines":[{"f":"ref","t":"Job 4, verses 12 to 17.","s":72.23,"e":76.51},{"f":"text","t":"Now a thing was secretly brought to me, and mine ear received a little thereof.","s":76.51,"e":83.43},{"f":"text","t":"In thoughts from the visions of the night, when deep sleep falleth on men, Fear came upon me, and trembling, which made all my bones to shake.","s":83.43,"e":94.75},{"f":"text","t":"Then a spirit passed before my face; the hair of my flesh stood up: It stood still, but I could not discern the form thereof: an image was before mine eyes, there was silence, and I heard a voice, saying, Shall mortal man be more just than God? shall a man be more pure than his maker?","s":94.75,"e":117.44}]},{"kind":"scripture","i":1,"voice":"iapetus","chap":"Scripture · Job 33:14–18","lines":[{"f":"ref","t":"Job 33, verses 14 to 18.","s":118.14,"e":123.19},{"f":"text","t":"For God speaketh once, yea twice, yet man perceiveth it not.","s":123.19,"e":129.07},{"f":"text","t":"In a dream, in a vision of the night, when deep sleep falleth upon men, in slumberings upon the bed; Then he openeth the ears of men, and sealeth their instruction, That he may withdraw man from his purpose, and hide pride from man.","s":129.07,"e":147.97},{"f":"text","t":"He keepeth back his soul from the pit, and his life from perishing by the sword.","s":147.97,"e":153.8}]}]},"p2-open-doors":{"dur":79.83,"segs":[{"kind":"teach","i":0,"voice":"charon","chap":"Teaching","lines":[{"f":"title","t":"How Evil Dreams Get In: Open Doors.","s":0.0,"e":4.26},{"f":"text","t":"Matthew 13:25 says that while men slept, the enemy came and sowed tares.","s":4.26,"e":12.08},{"f":"text","t":"Pastor Kiky Ocansey taught that evil manifestations in dreams come through an open door.","s":12.08,"e":18.29}]},{"kind":"teach","i":1,"voice":"charon","chap":"Teaching","lines":[{"f":"text","t":"The open door might come from your family or your foundation.","s":18.99,"e":23.17},{"f":"text","t":"It might even come from yourself: who you connected with that day, or something you ate or drank from an evil person, a point of contact.","s":23.17,"e":32.2}]},{"kind":"teach","i":2,"voice":"charon","chap":"Teaching","lines":[{"f":"text","t":"A spirit cannot just jump on you.","s":32.9,"e":35.34},{"f":"text","t":"It needs an open door, a legal right: an agreement, a close friendship, deep conversation, eating together, or sexual contact that forms a strong tie.","s":35.34,"e":47.92},{"f":"text","t":"Marine spirits often come as friends.","s":47.92,"e":50.4},{"f":"text","t":"They give gifts, eat with you and share things with you at work, and after that engagement you begin to see negative dreams of water and the beach.","s":50.4,"e":59.59}]},{"kind":"teach","i":3,"voice":"charon","chap":"Teaching","lines":[{"f":"text","t":"When you are in a place of prayer, pray.","s":60.29,"e":63.45},{"f":"text","t":"Do not come as a spectator, because a spectator who is not praying becomes vulnerable to attack.","s":63.45,"e":69.9}]},{"kind":"scripture","i":0,"voice":"iapetus","chap":"Scripture · Matthew 13:25","lines":[{"f":"ref","t":"Matthew 13, verse 25.","s":71.1,"e":73.56},{"f":"text","t":"But while men slept, his enemy came and sowed tares among the wheat, and went his way.","s":73.56,"e":79.83}]}]},"p2-why-cancel":{"dur":136.37,"segs":[{"kind":"teach","i":1,"voice":"charon","chap":"Teaching","lines":[{"f":"title","t":"Why We Cancel Negative Dreams.","s":0.0,"e":2.88},{"f":"text","t":"Do not let it be sealed inside you.","s":2.88,"e":5.76},{"f":"text","t":"Pastor Kiky Ocansey taught that the enemy uses dreams to plant instructions of destruction.","s":5.76,"e":13.08},{"f":"text","t":"If you see someone punching you, a scary face, a dead relative or any negativity, do not allow those instructions to be sealed inside you.","s":13.08,"e":23.45}]},{"kind":"teach","i":2,"voice":"charon","chap":"Teaching","lines":[{"f":"text","t":"Dreams prepare you for what lies ahead.","s":24.15,"e":27.67},{"f":"text","t":"That is why you cancel every evil challenge ahead before it manifests.","s":27.67,"e":34.55},{"f":"text","t":"She taught that sorrow and tragedy come easily when we fail to use the blood of Jesus, the Word of God and the Holy Ghost against satanic nightmares.","s":34.55,"e":46.0}]},{"kind":"teach","i":3,"voice":"charon","chap":"Teaching","lines":[{"f":"text","t":"What is rebuked cannot enter your physical world.","s":46.7,"e":51.3},{"f":"text","t":"Bad dreams carry the expectations of the enemy for your life.","s":51.3,"e":56.2},{"f":"text","t":"When you cancel them in prayer, they cannot cross into your day.","s":56.2,"e":60.55}]},{"kind":"teach","i":4,"voice":"charon","chap":"Teaching","lines":[{"f":"text","t":"You can feel the difference.","s":61.25,"e":63.67},{"f":"text","t":"She taught that a day when everything goes wrong can be the enemy's instructions of destruction at work.","s":63.67,"e":71.01},{"f":"text","t":"A day when doors open, people smile at you, and there is peace, strength and joy in your heart is grace, peace and favour.","s":71.01,"e":81.1}]},{"kind":"teach","i":5,"voice":"charon","chap":"Teaching","lines":[{"f":"text","t":"God gave us the armoury.","s":81.8,"e":83.28},{"f":"text","t":"He did not leave us helpless.","s":83.28,"e":85.2},{"f":"text","t":"He gave us power to bind and loose, power over all the power of the enemy, and the blood of the Lamb.","s":85.2,"e":92.41}]},{"kind":"scripture","i":0,"voice":"iapetus","chap":"Scripture · Matthew 18:18","lines":[{"f":"ref","t":"Matthew 18, verse 18.","s":93.61,"e":96.26},{"f":"text","t":"Verily I say unto you, Whatsoever ye shall bind on earth shall be bound in heaven: and whatsoever ye shall loose on earth shall be loosed in heaven.","s":96.26,"e":108.15}]},{"kind":"scripture","i":1,"voice":"iapetus","chap":"Scripture · Luke 10:19","lines":[{"f":"ref","t":"Luke 10, verse 19.","s":108.85,"e":111.57},{"f":"text","t":"Behold, I give unto you power to tread on serpents and scorpions, and over all the power of the enemy: and nothing shall by any means hurt you.","s":111.57,"e":123.82}]},{"kind":"scripture","i":2,"voice":"iapetus","chap":"Scripture · Revelation 12:11","lines":[{"f":"ref","t":"Revelation 12, verse 11.","s":124.52,"e":127.94},{"f":"text","t":"And they overcame him by the blood of the Lamb, and by the word of their testimony; and they loved not their lives unto the death.","s":127.94,"e":136.37}]}]},"p2-examples":{"dur":366.82,"segs":[{"kind":"example","i":0,"voice":"charon","chap":"Dream 1 of 14","lines":[{"f":"dream","t":"Dream 1. Being pressed or held down by faceless figures.","s":0.0,"e":6.3},{"f":"meaning","t":"What was taught.","s":6.3,"e":8.1},{"f":"meaning","t":"The person often wakes restless, unsettled and disturbed all day, sometimes angry with everybody, just because of one dream.","s":8.1,"e":18.18},{"f":"pray","t":"Pray.","s":18.18,"e":19.4},{"f":"pray","t":"By the blood of Jesus, I reject every oppression in my sleep.","s":19.4,"e":23.9},{"f":"pray","t":"My peace is restored, in Jesus name.","s":23.9,"e":27.05}]},{"kind":"example","i":1,"voice":"charon","chap":"Dream 2 of 14","lines":[{"f":"dream","t":"Dream 2. Someone punching you, a scary face, or a dead relative.","s":27.95,"e":34.83},{"f":"meaning","t":"What was taught.","s":34.83,"e":36.65},{"f":"meaning","t":"These are instructions the enemy wants to seal inside you.","s":36.65,"e":40.53},{"f":"meaning","t":"Do not allow them to be sealed.","s":40.53,"e":43.13},{"f":"pray","t":"Pray.","s":43.13,"e":44.41},{"f":"pray","t":"I rebuke every satanic instruction placed in my dream.","s":44.41,"e":48.77},{"f":"pray","t":"It shall not be sealed inside me, in Jesus name.","s":48.77,"e":52.92}]},{"kind":"example","i":2,"voice":"charon","chap":"Dream 3 of 14","lines":[{"f":"dream","t":"Dream 3. Being chased, or animals in the dream.","s":53.82,"e":58.52},{"f":"meaning","t":"What was taught.","s":58.52,"e":60.12},{"f":"meaning","t":"Named among the dreams to cancel straight away.","s":60.12,"e":63.7},{"f":"pray","t":"Pray.","s":63.7,"e":64.4},{"f":"pray","t":"Whatever is chasing me in the dream, I cancel it by the power of the Holy Ghost, in Jesus name.","s":64.4,"e":71.15}]},{"kind":"example","i":3,"voice":"charon","chap":"Dream 4 of 14","lines":[{"f":"dream","t":"Dream 4. Snakes in the dream.","s":72.05,"e":76.31},{"f":"meaning","t":"What was taught.","s":76.31,"e":77.85},{"f":"meaning","t":"Named in the prayers among dreams to be rebuked right away.","s":77.85,"e":82.65},{"f":"pray","t":"Pray.","s":82.65,"e":83.87},{"f":"pray","t":"Every serpent in my dream, I rebuke you now by the blood of Jesus.","s":83.87,"e":90.18}]},{"kind":"example","i":4,"voice":"charon","chap":"Dream 5 of 14","lines":[{"f":"dream","t":"Dream 5. Swimming in a river, or being in water or at the beach.","s":91.08,"e":97.14},{"f":"meaning","t":"What was taught.","s":97.14,"e":98.62},{"f":"meaning","t":"Linked to marine spirits, which often first come as friends, give gifts or eat with you.","s":98.62,"e":105.5},{"f":"pray","t":"Pray.","s":105.5,"e":106.92},{"f":"pray","t":"Every marine attachment and every deposit placed in me through water dreams, I cancel it by the blood of Jesus.","s":106.92,"e":114.93}]},{"kind":"example","i":5,"voice":"charon","chap":"Dream 6 of 14","lines":[{"f":"dream","t":"Dream 6. Spiritual marriage or sexual contact in the dream.","s":115.83,"e":120.99},{"f":"meaning","t":"What was taught.","s":120.99,"e":122.23},{"f":"meaning","t":"Taught as a deposit meant to destroy, weaken, bring sickness, and cause separation in marriage.","s":122.23,"e":129.67},{"f":"pray","t":"Pray.","s":129.67,"e":131.03},{"f":"pray","t":"Whatever deposit was placed inside me, I rebuke it.","s":131.03,"e":134.49},{"f":"pray","t":"The assignment to destroy my life, weaken my life, bring sickness and separation in marriage, I cancel it, in Jesus name.","s":134.49,"e":143.01}]},{"kind":"example","i":6,"voice":"charon","chap":"Dream 7 of 14","lines":[{"f":"dream","t":"Dream 7. Being back at your old school or old home.","s":143.91,"e":150.21},{"f":"meaning","t":"What was taught.","s":150.21,"e":152.07},{"f":"meaning","t":"A dream of stagnation and backwardness, meant to send you back to square one.","s":152.07,"e":158.91},{"f":"pray","t":"Pray.","s":158.91,"e":159.85},{"f":"pray","t":"I am moving forward in life by the power of the Holy Ghost.","s":159.85,"e":164.63},{"f":"pray","t":"I will not go back.","s":164.63,"e":166.35},{"f":"pray","t":"I will not be sent back, in Jesus name.","s":166.35,"e":170.24}]},{"kind":"example","i":7,"voice":"charon","chap":"Dream 8 of 14","lines":[{"f":"dream","t":"Dream 8. Being fed or eating in the dream.","s":171.14,"e":175.98},{"f":"meaning","t":"What was taught.","s":175.98,"e":177.6},{"f":"meaning","t":"Named among the ways the enemy appears in dreams to upset and interrupt your life.","s":177.6,"e":183.6},{"f":"pray","t":"Pray.","s":183.6,"e":184.9},{"f":"pray","t":"Whoever desires to appear in my dream, fight in my dream or feed me in the dream, be silenced in the name of Jesus.","s":184.9,"e":192.99}]},{"kind":"example","i":8,"voice":"charon","chap":"Dream 9 of 14","lines":[{"f":"dream","t":"Dream 9. Giving money to someone in the dream.","s":193.89,"e":198.17},{"f":"meaning","t":"What was taught.","s":198.17,"e":199.81},{"f":"meaning","t":"Prayed against as a dream of loss, where your money is wasted.","s":199.81,"e":204.07},{"f":"pray","t":"Pray.","s":204.07,"e":205.27},{"f":"pray","t":"My money will not be wasted.","s":205.27,"e":207.69},{"f":"pray","t":"Every dream of loss over my finances, I cancel it, in Jesus name.","s":207.69,"e":212.86}]},{"kind":"example","i":9,"voice":"charon","chap":"Dream 10 of 14","lines":[{"f":"dream","t":"Dream 10. Something valuable stolen or carried away.","s":213.76,"e":218.82},{"f":"meaning","t":"What was taught.","s":218.82,"e":220.42},{"f":"meaning","t":"No enemy and no entity can carry away anything that belongs to you.","s":220.42,"e":225.62},{"f":"pray","t":"Pray.","s":225.62,"e":227.02},{"f":"pray","t":"Every power stealing my progress in my dream world, return it now, in the name of Jesus.","s":227.02,"e":232.81}]},{"kind":"example","i":10,"voice":"charon","chap":"Dream 11 of 14","lines":[{"f":"dream","t":"Dream 11. Your vehicle set on fire or stopped on the road.","s":233.71,"e":239.97},{"f":"meaning","t":"What was taught.","s":239.97,"e":241.81},{"f":"meaning","t":"A vehicle in a dream can symbolise your destiny, the thing that moves you forward.","s":241.81,"e":247.95},{"f":"meaning","t":"The enemy wants to stop you reaching your destination through affliction, sickness, weakness, distraction or disgrace.","s":247.95,"e":256.47},{"f":"pray","t":"Pray.","s":256.47,"e":257.71},{"f":"pray","t":"My vehicle of destiny will not break down.","s":257.71,"e":261.15},{"f":"pray","t":"I cannot be stopped.","s":261.15,"e":263.13},{"f":"pray","t":"I will reach my destination, in Jesus name.","s":263.13,"e":267.24}]},{"kind":"example","i":11,"voice":"charon","chap":"Dream 12 of 14","lines":[{"f":"dream","t":"Dream 12. Dreams of premature death.","s":268.14,"e":272.4},{"f":"meaning","t":"What was taught.","s":272.4,"e":274.04},{"f":"meaning","t":"Cancelled with Psalm 118:17.","s":274.04,"e":278.44},{"f":"pray","t":"Pray.","s":278.44,"e":279.4},{"f":"pray","t":"I shall not die, but live, and declare the works of the LORD (Psalm 118:17).","s":279.4,"e":287.42},{"f":"pray","t":"I cancel the dream of premature death, in Jesus name.","s":287.42,"e":292.27}]},{"kind":"example","i":12,"voice":"charon","chap":"Dream 13 of 14","lines":[{"f":"dream","t":"Dream 13. Dreams of shame, embarrassment, failure or rejection.","s":293.17,"e":299.79},{"f":"meaning","t":"What was taught.","s":299.79,"e":301.23},{"f":"meaning","t":"Named in the service declarations against career, marriage and progress.","s":301.23,"e":306.53},{"f":"pray","t":"Pray.","s":306.53,"e":307.67},{"f":"pray","t":"I cancel every bad dream of shame, embarrassment, failure and rejection over my life, in Jesus name.","s":307.67,"e":315.5}]},{"kind":"example","i":13,"voice":"charon","chap":"Dream 14 of 14","lines":[{"f":"dream","t":"Dream 14. Dreams of confusion, suffering, hardship or endless hard labour.","s":316.4,"e":324.72},{"f":"meaning","t":"What was taught.","s":324.72,"e":326.54},{"f":"meaning","t":"Named in the service declarations.","s":326.54,"e":329.12},{"f":"pray","t":"Pray.","s":329.12,"e":330.5},{"f":"pray","t":"I cancel the dreams of backwardness, confusion, stagnation, suffering and endless hard labour, in Jesus name.","s":330.5,"e":339.61}]},{"kind":"scripture","i":0,"voice":"iapetus","chap":"Scripture · Psalm 118:17","lines":[{"f":"ref","t":"Psalm 118, verse 17.","s":340.81,"e":343.91},{"f":"text","t":"I shall not die, but live, and declare the works of the LORD.","s":343.91,"e":348.66}]},{"kind":"scripture","i":1,"voice":"iapetus","chap":"Scripture · Isaiah 54:17","lines":[{"f":"ref","t":"Isaiah 54, verse 17.","s":349.36,"e":351.08},{"f":"text","t":"No weapon that is formed against thee shall prosper; and every tongue that shall rise against thee in judgment thou shalt condemn.","s":351.08,"e":360.56},{"f":"text","t":"This is the heritage of the servants of the LORD, and their righteousness is of me, saith the LORD.","s":360.56,"e":366.82}]}]},"p2-when-wake":{"dur":134.33,"segs":[{"kind":"teach","i":0,"voice":"charon","chap":"Teaching","lines":[{"f":"title","t":"What to Do When You Wake from a Dream.","s":0.0,"e":2.64},{"f":"text","t":"Pray immediately.","s":2.64,"e":4.5},{"f":"text","t":"It is very good to pray against any evil dream at once, silently or aloud, the moment you wake.","s":4.5,"e":10.81}]},{"kind":"teach","i":1,"voice":"charon","chap":"Teaching","lines":[{"f":"text","t":"Keep the oil or the communion nearby.","s":11.51,"e":14.73},{"f":"text","t":"Anoint yourself and say, “I anoint myself from any satanic plans, any satanic instructions over my life and over my destiny.","s":14.73,"e":24.75},{"f":"text","t":"I rebuke the assignment of the wicked in the mighty name of Jesus.”","s":24.75,"e":29.36}]},{"kind":"teach","i":2,"voice":"charon","chap":"Teaching","lines":[{"f":"text","t":"You do not need to say much.","s":30.06,"e":32.54},{"f":"text","t":"Reject what the enemy is bringing, then go back to sleep.","s":32.54,"e":36.48},{"f":"text","t":"No matter how weak you feel in the night, make sure you cancel any bad dream you can remember.","s":36.48,"e":43.67}]},{"kind":"teach","i":3,"voice":"charon","chap":"Teaching","lines":[{"f":"text","t":"Stand on the Word.","s":44.37,"e":46.61},{"f":"text","t":"Scriptures can defeat the works of the enemy.","s":46.61,"e":49.55},{"f":"text","t":"Sometimes a Scripture comes to you as you wake, or you open the Bible and read it, and it cancels the dream immediately.","s":49.55,"e":56.1}]},{"kind":"teach","i":4,"voice":"charon","chap":"Teaching","lines":[{"f":"text","t":"If the dream is good, claim it.","s":56.8,"e":59.8},{"f":"text","t":"Do not leave a good dream.","s":59.8,"e":62.44},{"f":"text","t":"Begin to claim it for yourself by the power of the Holy Ghost.","s":62.44,"e":65.93}]},{"kind":"scripture","i":0,"voice":"iapetus","chap":"Scripture · Psalm 35:1–3","lines":[{"f":"ref","t":"Psalm 35, verses 1 to 3.","s":67.13,"e":70.86},{"f":"text","t":"Plead my cause, O LORD, with them that strive with me: fight against them that fight against me.","s":70.86,"e":77.92},{"f":"text","t":"Take hold of shield and buckler, and stand up for mine help.","s":77.92,"e":82.66},{"f":"text","t":"Draw out also the spear, and stop the way against them that persecute me: say unto my soul, I am thy salvation.","s":82.66,"e":91.99}]},{"kind":"scripture","i":1,"voice":"iapetus","chap":"Scripture · Psalm 94:1–2","lines":[{"f":"ref","t":"Psalm 94, verses 1 to 2.","s":92.69,"e":95.73},{"f":"text","t":"O LORD God, to whom vengeance belongeth; O God, to whom vengeance belongeth, shew thyself.","s":95.73,"e":103.83},{"f":"text","t":"Lift up thyself, thou judge of the earth: render a reward to the proud.","s":103.83,"e":109.98}]},{"kind":"scripture","i":2,"voice":"iapetus","chap":"Scripture · 2 Corinthians 10:4–5","lines":[{"f":"ref","t":"2 Corinthians 10, verses 4 to 5.","s":110.68,"e":115.0},{"f":"text","t":"(For the weapons of our warfare are not carnal, but mighty through God to the pulling down of strong holds;) Casting down imaginations, and every high thing that exalteth itself against the knowledge of God, and bringing into captivity every thought to the obedience of Christ;","s":115.0,"e":134.33}]}]},"p2-not-people":{"dur":105.06,"segs":[{"kind":"teach","i":0,"voice":"charon","chap":"Teaching","lines":[{"f":"title","t":"The Battle Is Against Spirits, Not People.","s":0.0,"e":3.56},{"f":"text","t":"During questions, Pastor Kiky Ocansey taught that when someone sends evil arrows, they are not using their own strength.","s":3.56,"e":12.14},{"f":"text","t":"They are working with a spirit, an entity.","s":12.14,"e":15.7},{"f":"text","t":"In warfare you are not killing the aunt or the uncle.","s":15.7,"e":19.06},{"f":"text","t":"You are making powerless the spirit and power they use, so it no longer works on you, and the arrow returns to that entity.","s":19.06,"e":27.33}]},{"kind":"teach","i":1,"voice":"charon","chap":"Teaching","lines":[{"f":"text","t":"God gives even the wicked a chance to return to Him (Isaiah 55:7).","s":28.03,"e":33.53},{"f":"text","t":"Yet God must come first, above father, mother, husband or wife.","s":33.53,"e":38.95},{"f":"text","t":"If He reveals something to protect you, do not put His revelation aside.","s":38.95,"e":43.6}]},{"kind":"teach","i":2,"voice":"charon","chap":"Teaching","lines":[{"f":"text","t":"When you pray and do warfare, do not have anybody in mind.","s":44.3,"e":47.98},{"f":"text","t":"It can be anybody.","s":47.98,"e":49.36},{"f":"text","t":"Pray a general prayer, because we wrestle not against flesh and blood.","s":49.36,"e":53.23}]},{"kind":"teach","i":3,"voice":"charon","chap":"Teaching","lines":[{"f":"text","t":"It is not by your own power.","s":53.93,"e":56.43},{"f":"text","t":"As a child of God you have the Holy Spirit with you and angels around you.","s":56.43,"e":61.97},{"f":"text","t":"The battle is won by the Spirit of the Lord.","s":61.97,"e":65.22}]},{"kind":"scripture","i":0,"voice":"iapetus","chap":"Scripture · Ephesians 6:12","lines":[{"f":"ref","t":"Ephesians 6, verse 12.","s":66.42,"e":69.42},{"f":"text","t":"For we wrestle not against flesh and blood, but against principalities, against powers, against the rulers of the darkness of this world, against spiritual wickedness in high places.","s":69.42,"e":81.92}]},{"kind":"scripture","i":1,"voice":"iapetus","chap":"Scripture · Matthew 10:37","lines":[{"f":"ref","t":"Matthew 10, verse 37.","s":82.62,"e":85.76},{"f":"text","t":"He that loveth father or mother more than me is not worthy of me: and he that loveth son or daughter more than me is not worthy of me.","s":85.76,"e":96.63}]},{"kind":"scripture","i":2,"voice":"iapetus","chap":"Scripture · Romans 8:31","lines":[{"f":"ref","t":"Romans 8, verse 31.","s":97.33,"e":99.69},{"f":"text","t":"What shall we then say to these things?","s":99.69,"e":102.09},{"f":"text","t":"If God be for us, who can be against us?","s":102.09,"e":105.06}]}]},"p2-promises":{"dur":187.23,"segs":[{"kind":"teach","i":0,"voice":"charon","chap":"Teaching","lines":[{"f":"title","t":"God Is With You: Scriptures for Today.","s":0.0,"e":4.96},{"f":"text","t":"After the declarations, Pastor Kiky Ocansey spoke these Scriptures over the family.","s":4.96,"e":11.6},{"f":"text","t":"When you fall, you shall arise.","s":11.6,"e":14.56},{"f":"text","t":"The handwriting against you is nailed to the cross.","s":14.56,"e":18.46},{"f":"text","t":"There is no enchantment against you.","s":18.46,"e":21.26},{"f":"text","t":"A thousand shall fall at your side, but it shall not come near you, as you sleep and as you wake.","s":21.26,"e":28.29}]},{"kind":"teach","i":1,"voice":"charon","chap":"Teaching","lines":[{"f":"text","t":"The Lord fights for you against your enemies.","s":28.99,"e":32.61},{"f":"text","t":"When the enemy comes in like a flood, the Spirit of the Lord lifts up a standard against him.","s":32.61,"e":38.95},{"f":"text","t":"They that be with us are more than they that be with them.","s":38.95,"e":43.07},{"f":"text","t":"Just because you cannot see the angels around you does not mean they are not there.","s":43.07,"e":48.2}]},{"kind":"scripture","i":0,"voice":"iapetus","chap":"Scripture · Micah 7:8","lines":[{"f":"ref","t":"Micah 7, verse 8.","s":49.4,"e":52.36},{"f":"text","t":"Rejoice not against me, O mine enemy: when I fall, I shall arise; when I sit in darkness, the LORD shall be a light unto me.","s":52.36,"e":64.61}]},{"kind":"scripture","i":1,"voice":"iapetus","chap":"Scripture · Psalm 27:1–2","lines":[{"f":"ref","t":"Psalm 27, verses 1 to 2.","s":65.31,"e":68.67},{"f":"text","t":"The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?","s":68.67,"e":77.99},{"f":"text","t":"When the wicked, even mine enemies and my foes, came upon me to eat up my flesh, they stumbled and fell.","s":77.99,"e":85.65}]},{"kind":"scripture","i":2,"voice":"iapetus","chap":"Scripture · Colossians 2:14","lines":[{"f":"ref","t":"Colossians 2, verse 14.","s":86.35,"e":88.87},{"f":"text","t":"Blotting out the handwriting of ordinances that was against us, which was contrary to us, and took it out of the way, nailing it to his cross;","s":88.87,"e":99.44}]},{"kind":"scripture","i":3,"voice":"iapetus","chap":"Scripture · Numbers 23:23","lines":[{"f":"ref","t":"Numbers 23, verse 23.","s":100.14,"e":103.76},{"f":"text","t":"Surely there is no enchantment against Jacob, neither is there any divination against Israel: according to this time it shall be said of Jacob and of Israel, What hath God wrought!","s":103.76,"e":116.99}]},{"kind":"scripture","i":4,"voice":"iapetus","chap":"Scripture · Psalm 91:7","lines":[{"f":"ref","t":"Psalm 91, verse 7.","s":117.69,"e":120.05},{"f":"text","t":"A thousand shall fall at thy side, and ten thousand at thy right hand; but it shall not come nigh thee.","s":120.05,"e":126.38}]},{"kind":"scripture","i":5,"voice":"iapetus","chap":"Scripture · Isaiah 41:10","lines":[{"f":"ref","t":"Isaiah 41, verse 10.","s":127.08,"e":130.66},{"f":"text","t":"Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.","s":130.66,"e":147.73}]},{"kind":"scripture","i":6,"voice":"iapetus","chap":"Scripture · Deuteronomy 20:4","lines":[{"f":"ref","t":"Deuteronomy 20, verse 4.","s":148.43,"e":151.51},{"f":"text","t":"For the LORD your God is he that goeth with you, to fight for you against your enemies, to save you.","s":151.51,"e":158.64}]},{"kind":"scripture","i":7,"voice":"iapetus","chap":"Scripture · Isaiah 59:19","lines":[{"f":"ref","t":"Isaiah 59, verse 19.","s":159.34,"e":161.92},{"f":"text","t":"So shall they fear the name of the LORD from the west, and his glory from the rising of the sun.","s":161.92,"e":170.34},{"f":"text","t":"When the enemy shall come in like a flood, the Spirit of the LORD shall lift up a standard against him.","s":170.34,"e":176.19}]},{"kind":"scripture","i":8,"voice":"iapetus","chap":"Scripture · 2 Kings 6:16","lines":[{"f":"ref","t":"2 Kings 6, verse 16.","s":176.89,"e":179.61},{"f":"text","t":"And he answered, Fear not: for they that be with us are more than they that be with them.","s":179.61,"e":187.23}]}]},"p2-grace":{"dur":89.52,"segs":[{"kind":"teach","i":0,"voice":"charon","chap":"Teaching","lines":[{"f":"title","t":"Carry the Grace: Romans 16:20.","s":0.0,"e":4.1},{"f":"text","t":"Pastor Kiky Ocansey taught that everything carries a spirit, and the grace of our Lord Jesus Christ is a spirit that goes with you.","s":4.1,"e":14.24},{"f":"text","t":"That is why people bring documents to be prayed over, so they carry the Holy Spirit.","s":14.24,"e":20.14},{"f":"text","t":"As you go about your day, this week and to the end of this year, carry the Spirit and grace of the Lord with you, your children, your workplace, your business and your career.","s":20.14,"e":33.09}]},{"kind":"teach","i":1,"voice":"charon","chap":"Teaching","lines":[{"f":"text","t":"Take your oil.","s":33.79,"e":35.91},{"f":"text","t":"Read Romans 16:20 aloud as your own: “And the God of peace shall bruise Satan under my feet shortly.”","s":35.91,"e":46.11},{"f":"text","t":"Then anoint yourself.","s":46.11,"e":47.79},{"f":"text","t":"The attacks of the wicked are already under your feet.","s":47.79,"e":51.28}]},{"kind":"teach","i":2,"voice":"charon","chap":"Teaching","lines":[{"f":"text","t":"Then follow the prophetic direction when you end your fast.","s":51.98,"e":56.36},{"f":"text","t":"Take your communion and read the Scriptures provided.","s":56.36,"e":60.24},{"f":"text","t":"Pray through the declarations, cancelling every evil dream and plan of the wicked by the blood of Jesus.","s":60.24,"e":67.9},{"f":"text","t":"Mark yourself, then drink the communion.","s":67.9,"e":71.28},{"f":"text","t":"We overcome by the blood of the Lamb and by the word of our testimony.","s":71.28,"e":76.19}]},{"kind":"scripture","i":0,"voice":"iapetus","chap":"Scripture · Romans 16:20","lines":[{"f":"ref","t":"Romans 16, verse 20.","s":77.39,"e":80.33},{"f":"text","t":"And the God of peace shall bruise Satan under your feet shortly.","s":80.33,"e":85.39},{"f":"text","t":"The grace of our Lord Jesus Christ be with you.","s":85.39,"e":88.77},{"f":"text","t":"Amen.","s":88.77,"e":89.52}]}]}};
  sv.sections.forEach(function (x) { if (T[x.id]) x.sync = T[x.id]; });
  W.docTitle = "Destroying Dreams of the Wicked · Part Two";
  W.partBanner = { title: "DESTROYING DREAMS OF THE WICKED", part: "PART TWO", ministry: "L137 Deliverance Ministry", date: "October 28, 2026 · Clubhouse", service: 1 };
  W.quizLabel = "Quiz · Part Two · October 28, 2026";
  W.heroImage = "images/p2-hero.jpg";
  W.heroAlt = "A stone gateway lit by a lamp under a starry navy night sky with a gold horizon";
})();

/* ---- Separate link: Part Two ---- */
(function () {
  var W = window.WORKBOOK, O = {"quiz": {"beginner": [{"q": "What did the Part 2 service begin with?", "options": ["Thanksgiving", "Silence", "An offering"], "answer": 0, "explain": "The service opened with thanksgiving, reading Psalm 30 and 1 Thessalonians 5:18: “In every thing give thanks.”", "audioQ": "audio/quiz/qz-p2-b1-q.mp3", "audioA": "audio/quiz/qz-p2-b1-a.mp3"}, {"q": "According to Matthew 13:25, when did the enemy sow tares among the wheat?", "options": ["While men slept", "At midday", "During the harvest"], "answer": 0, "explain": "“But while men slept, his enemy came and sowed tares among the wheat, and went his way.”", "audioQ": "audio/quiz/qz-p2-b2-q.mp3", "audioA": "audio/quiz/qz-p2-b2-a.mp3"}, {"q": "When should you pray against an evil dream?", "options": ["Next week", "Immediately, as soon as you wake", "Only if it happens three times"], "answer": 1, "explain": "It is very good to pray against any evil dream immediately, silently or aloud, then go back to sleep.", "audioQ": "audio/quiz/qz-p2-b3-q.mp3", "audioA": "audio/quiz/qz-p2-b3-a.mp3"}], "intermediate": [{"q": "What was taught about a dream of being back at your old school or old home?", "options": ["It means promotion", "It is a dream of stagnation and backwardness, meant to send you back to square one", "It means nothing"], "answer": 1, "explain": "Declare: “I am moving forward in life. I will not go back. I will not be sent back.”", "audioQ": "audio/quiz/qz-p2-i1-q.mp3", "audioA": "audio/quiz/qz-p2-i1-a.mp3"}, {"q": "Why should you not let an evil dream go unaddressed?", "options": ["Because the enemy wants its instruction sealed inside you", "Because dreams are always true", "Because you must tell everyone about it"], "answer": 0, "explain": "Do not allow those instructions to be sealed inside you. What is rebuked cannot enter your physical world.", "audioQ": "audio/quiz/qz-p2-i2-q.mp3", "audioA": "audio/quiz/qz-p2-i2-a.mp3"}, {"q": "What should you do with a good dream from God?", "options": ["Forget it", "Claim it by the power of the Holy Ghost", "Cancel it as well"], "answer": 1, "explain": "If the dream is good, do not leave it. Begin to claim it for yourself.", "audioQ": "audio/quiz/qz-p2-i3-q.mp3", "audioA": "audio/quiz/qz-p2-i3-a.mp3"}], "advanced": [{"q": "In a dream, a vehicle is set on fire. What can the vehicle symbolise?", "options": ["Your destiny, the thing that moves you forward", "Only your car", "Your house"], "answer": 0, "explain": "A vehicle can symbolise your destiny. Declare: “My vehicle of destiny will not break down.”", "audioQ": "audio/quiz/qz-p2-a1-q.mp3", "audioA": "audio/quiz/qz-p2-a1-a.mp3"}, {"q": "Someone fears that praying “back to sender” will harm a family member. What was taught?", "options": ["Never pray at all", "You are making powerless the spirit and power they use, not aiming at the person", "Name the person in every prayer"], "answer": 1, "explain": "Pray a general prayer and do not have anybody in mind. “We wrestle not against flesh and blood” (Ephesians 6:12).", "audioQ": "audio/quiz/qz-p2-a2-q.mp3", "audioA": "audio/quiz/qz-p2-a2-a.mp3"}, {"q": "Can a spirit just jump onto you in a prayer room?", "options": ["Yes, at any time", "No. It needs an open door or legal right, such as a close tie or agreement", "Only if you unmute"], "answer": 1, "explain": "A spirit needs an open door. In a place of prayer, pray rather than be a spectator.", "audioQ": "audio/quiz/qz-p2-a3-q.mp3", "audioA": "audio/quiz/qz-p2-a3-a.mp3"}]}, "banner": {"title": "DESTROYING DREAMS OF THE WICKED", "part": "PART TWO", "label": "Part Two", "ministry": "L137 Deliverance Ministry", "date": "October 28, 2026 · Clubhouse", "service": 0}, "title": "Destroying Dreams of the Wicked · Part Two", "quizLabel": "Quiz · Part Two · October 28, 2026", "hero": "images/p2-hero.jpg", "siblings": [{"label": "Prophetic Direction", "sub": "Pastor Kiky Ocansey · October 28, 2026", "url": "https://l137-dreams-of-the-wicked-prophetic-direction.pplx.app", "current": false}, {"label": "Part One", "sub": "October 26, 2026 · Clubhouse", "url": "https://l137-dreams-of-the-wicked-part-one.pplx.app", "current": false}, {"label": "Part Two", "sub": "October 28, 2026 · Clubhouse", "url": "https://l137-destroying-dreams-of-the-wicked-2026-10-28.pplx.app", "current": true}]};
  var keep = ["p2"];
  W.services = W.services.filter(function (s, i) { return keep.indexOf(i === 0 ? "p1" : "p2") >= 0; });
  W.sections = []; W.declarations = [];
  W.intro = W.services[0].intro; W.mainScripture = "";
  W.serviceDate = "Wednesday, October 28, 2026 \u00b7 Clubhouse";
  W.openingAudio = "audio/p2-welcome.mp3"; W.quiz.audio = "audio/p2-quiz.mp3"; W.helpAudio = "audio/p2-help.mp3";
  W.services[0].intro = W.services[0].intro.replace(", placed after the prophetic direction", "");
  W.intro = W.services[0].intro;
  ["beginner","intermediate","advanced"].forEach(function (L) { W.quiz[L] = O.quiz[L]; });
  W.partBanner = O.banner; W.docTitle = O.title; W.title = O.title; W.quizLabel = O.quizLabel; if (O.hero && !/p1-1/.test(O.hero)) W.heroImage = O.hero;
  W.printable = "downloads/L137-Dreams-of-the-Wicked-Part-Two-Printable.pdf";
  W.voice = {note: "Narration: natural AI sample voices. Part Two uses one teaching voice and a separate Scripture reader. To be replaced with VoicePrompt recordings."};
  W.siblings = O.siblings; W.siblingsTitle = "This teaching has three links";
})();
