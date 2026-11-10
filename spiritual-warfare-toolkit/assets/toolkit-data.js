/*
  L137 Spiritual Warfare Toolkit — Teachings Registry
  ==================================================
  This is the single source of truth for every teaching in the toolkit.
  To add a new teaching:
    1. Add an entry to `teachings` with the right categoryId
    2. If the teaching has a full course + pack built, set status: "live" and add the paths
    3. Otherwise leave status: "coming" — the card renders as a placeholder
  Categories are defined at the bottom.
*/

window.TOOLKIT = {
  ministry: {
    name: "L137 Deliverance Ministry International",
    pastor: "Pastor Kiky Ocansey",
    tagline: "For with God nothing shall be impossible.",
    reference: "Luke 1:37",
    linktree: "https://linktr.ee/Pastor_kiki"
  },

  categories: [
    {
      id: "watchers-voices",
      number: "01",
      slug: "watchers-and-voices",
      title: "Watchers & Voices",
      subtitle: "Monitoring Spirits · Familiar Spirits",
      description: "Spirits that watch, monitor, and speak into a life without permission. This category exposes and destroys the eyes that spy on your destiny and the voices that speak against it.",
      icon: "eye"
    },
    {
      id: "serpents-waters",
      number: "02",
      slug: "serpents-and-waters",
      title: "Serpents & Waters",
      subtitle: "Leviathan · Serpentine Spirits · Marine & Water Spirits",
      description: "The kingdoms of the sea and the coiling spirits that twist marriages, finances, and destiny. This category breaks the covenants and altars established under water and in serpent-shaped bondage.",
      icon: "wave"
    },
    {
      id: "covenants-chains",
      number: "03",
      slug: "covenants-and-chains",
      title: "Covenants & Chains",
      subtitle: "Destructive Covenants · Blood Covenants · Generational Bondage",
      description: "Every deliverance stands or falls on covenant-breaking. This category renounces the agreements, contracts, and inherited chains that give the enemy legal ground.",
      icon: "chain"
    }
  ],

  teachings: [
    // ── Category 3: Covenants & Chains ───────────────────
    {
      id: "breaking-destructive-covenants",
      categoryId: "covenants-chains",
      title: "Breaking Destructive Covenants Through Prayer and Deliverance",
      shortTitle: "Breaking Destructive Covenants",
      date: "2026-05-23",
      dateDisplay: "May 23, 2026",
      mainScripture: "Isaiah 28:18",
      description: "A deep deliverance service on breaking every destructive covenant, evil agreement, and ancestral contract giving the enemy legal ground. Grounded in the blood of Jesus, the Holy Ghost fire, and the finished work of the cross.",
      status: "flagship",
      hasSeries: true,
      seriesNote: "Part 1 of 2 — Part 2 material comes in a follow-up teaching",
      href: "teachings/breaking-destructive-covenants/",
      coursePath: "teachings/breaking-destructive-covenants/course/",
      downloadPath: "teachings/breaking-destructive-covenants/download/"
    },
    {
      id: "pk-deliverance-2024",
      categoryId: "covenants-chains",
      title: "PK Deliverance (November 2024)",
      shortTitle: "PK Deliverance",
      date: "2024-11-21",
      dateDisplay: "November 21, 2024",
      mainScripture: "TBD — extracted from Master Transcript",
      description: "An earlier PK Deliverance service. Extraction and category placement to be confirmed in a follow-up session.",
      status: "coming",
      href: "#"
    },

    // ── Category 2: Serpents & Waters ────────────────────
    {
      id: "leviathan",
      categoryId: "serpents-waters",
      title: "Deliverance from the Spirit of Leviathan",
      shortTitle: "Spirit of Leviathan",
      date: "2026-04-11",
      dateDisplay: "April 11, 2026",
      mainScripture: "Isaiah 27:1",
      description: "A deliverance teaching against the spirit of Leviathan — pride, twisting, contention, and the crooked serpent that fights marriages, families, and covenants.",
      status: "coming",
      href: "#"
    },
    {
      id: "marine-spirits-07-06",
      categoryId: "serpents-waters",
      title: "Deliverance from Marine Spirits",
      shortTitle: "Marine Spirits",
      date: "2026-07-06",
      dateDisplay: "July 6, 2026",
      mainScripture: "TBD",
      description: "A deliverance service exposing and breaking the operations of marine spirits over destinies, marriages, and finances.",
      status: "coming",
      href: "#"
    },
    {
      id: "marine-and-water-spirits",
      categoryId: "serpents-waters",
      title: "Deliverance from Marine and Water Spirits",
      shortTitle: "Marine & Water Spirits",
      date: "2026-07-08",
      dateDisplay: "July 8, 2026",
      mainScripture: "TBD",
      description: "Continued teaching on marine and water spirit systems — covenants under water, altars in the deep, and the deliverance of those bound by them.",
      status: "coming",
      href: "#"
    },
    {
      id: "serpentine-part-1",
      categoryId: "serpents-waters",
      title: "Deliverance from Serpentine Spirits — Part 1",
      shortTitle: "Serpentine Spirits — Part 1",
      date: "2026-07-22",
      dateDisplay: "July 22, 2026",
      mainScripture: "TBD",
      description: "Part 1 of the serpentine spirits deliverance — the crooked serpent, the coiling spirit, and their attacks on life and destiny.",
      status: "coming",
      href: "#"
    },
    {
      id: "serpentine-part-2",
      categoryId: "serpents-waters",
      title: "Deliverance from Serpentine Spirits — Part 2",
      shortTitle: "Serpentine Spirits — Part 2",
      date: "2026-07-27",
      dateDisplay: "July 27, 2026",
      mainScripture: "TBD",
      description: "Part 2 of the serpentine spirits deliverance — continuing the breaking of every serpent-shaped covenant, altar, and monitoring in the life of the believer.",
      status: "coming",
      href: "#"
    },

    // ── Category 1: Watchers & Voices ────────────────────
    {
      id: "monitoring-spirits-05-10",
      categoryId: "watchers-voices",
      title: "Deliverance from Monitoring Spirits",
      shortTitle: "Monitoring Spirits",
      date: "2026-05-10",
      dateDisplay: "May 10, 2026",
      mainScripture: "TBD",
      description: "Exposing and blinding the evil watchers that monitor the believer's life to bring accusation, delay, and attack.",
      status: "coming",
      href: "#"
    },
    {
      id: "familiar-spirits",
      categoryId: "watchers-voices",
      title: "Deliverance from Familiar Spirits",
      shortTitle: "Familiar Spirits",
      date: "2026-05-11",
      dateDisplay: "May 11, 2026",
      mainScripture: "TBD",
      description: "Breaking the influence of familiar spirits — those that impersonate, familiarize themselves with families, and speak lies as though they were truth.",
      status: "coming",
      href: "#"
    },
    {
      id: "monitoring-attacks-06-17",
      categoryId: "watchers-voices",
      title: "Destroying the Attacks of Monitoring Spirits",
      shortTitle: "Attacks of Monitoring Spirits",
      date: "2026-06-17",
      dateDisplay: "June 17, 2026",
      mainScripture: "TBD",
      description: "Continued deliverance from monitoring spirits — specifically destroying their attacks against the believer's peace, dreams, and progress.",
      status: "coming",
      href: "#"
    }
  ]
};

/* Convenience helpers */
window.TOOLKIT.byCategory = function(catId) {
  return this.teachings
    .filter(t => t.categoryId === catId)
    .sort((a, b) => a.date.localeCompare(b.date));
};
window.TOOLKIT.getCategory = function(catId) {
  return this.categories.find(c => c.id === catId);
};
window.TOOLKIT.countLive = function(catId) {
  return this.teachings.filter(t => t.categoryId === catId && (t.status === "live" || t.status === "flagship")).length;
};
window.TOOLKIT.countTotal = function(catId) {
  return this.teachings.filter(t => t.categoryId === catId).length;
};
