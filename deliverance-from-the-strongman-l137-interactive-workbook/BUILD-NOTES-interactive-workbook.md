# Interactive Workbook — build notes

**Project path:** `/home/user/workspace/deliverance-from-the-strongman/site/`
**Files:** `index.html`, `styles.css`, `app.js`, `content.js` (embedded `window.L137` = teaching + scriptures + declarations + study JSON), `assets/downloads/` (placeholders).

**Preview URL:** https://www.perplexity.ai/computer/a/deliverance-from-the-strongman-QTOIwQ3.Q5GD.Bz_LZJtoA

Parent agent: to surface the preview as a component in the main chat, call
`deploy_website(project_path="/home/user/workspace/deliverance-from-the-strongman/site", site_name="Deliverance From The Strongman — Interactive Workbook", entry_point="index.html")`.

## What is built (21 tabs, sticky scrollable nav, hash routing)
Home (hero, service flow, flow chart, LISTEN & PRAY ALOUD card, Bible characters) ·
Panel Reader (81 panels, arrows/keyboard/swipe, counter, resume) · 9 Modules (full text + full KJV in teal-barred panels + per-module study tick) ·
14 Faces (filterable grid) · Scripture Vault (40 verses by topic, recall/tap-to-reveal mode, copy buttons) ·
Cloze Drill (12 verses, inline inputs, case-insensitive, reveals full verse, score) ·
Flashcards (24, flip, Again/Good/Easy buckets 0/1/2/4/7/14/30 days, due-today count, shuffle, reset) ·
Match Game (8 pairs, lock green / shake wrong / reset) · Battle Order Sequencer (12 steps shuffled, up/down, check, solve) ·
Self-Exam (10 signs → personalised prayer list from the 12 prayer sections, printable, persisted) ·
Declarations (12 sets verbatim + full-screen teleprompter with kicker, line counter, tap/keys, 3–10s auto-advance) ·
Prayer Library (12 collapsible sections, persistent ticks) · 7-Day Bombardment (weekly assignment + streak) ·
Dream Watch Log (date/dream/symbol, delete, export .txt) · Quiz (12 Q, immediate `why`, score, retake) ·
Memory Verses (8 printable 2-up cut-out cards + verse of the day) · Search (client-side index across all content, highlighted, jump to section) ·
My Notes (13 areas + "Export all my work" .txt) · Progress + Certificate (23 items, bar, name input, print) ·
Prepare & Aftercare (preparation, checklist, aftercare, prophetic directions, key lessons, reflection with saved answers, misread guardrails in a quiet cream panel) ·
Download Pack (17 placeholder PDF links to `assets/downloads/`).

## Design
L137 palette exactly (ivory/cream/charcoal/teal/gold/ember/green), Source Serif 4 + DM Sans via Google Fonts, tabular numerals,
teal eyebrow + serif H2 + gold-tipped rule on every section, left colour bar on every panel. No dark theme. Custom inline SVG logo + favicon.

## Storage
All keys namespaced `l137_strongman_*`. Device storage is accessed through a guarded wrapper with an in-memory
fallback, because the `/computer/a` preview iframe runs on an opaque origin where device storage throws.
On real hosting and file:// everything persists across reload (verified).

## QA performed (Playwright, 390px mobile + 1280px desktop)
Zero console/page errors. No horizontal overflow on any of the 21 views at 390px. Verified: panel navigation,
vault reveal, cloze scoring, flashcard scheduling (24 → 23 due after one grade), all 8 matches, 12/12 order check,
prayer-list generation, teleprompter incl. auto-advance, full quiz run + result, dream save, bombardment streak,
prayer ticks, checklist/reflection saves, notes persistence across reload, 23/23 progress → certificate render,
search (80 hits, highlighted), 17 pack links. Screenshots: `/home/user/workspace/qa-*.png`.

Not published — private preview only.
