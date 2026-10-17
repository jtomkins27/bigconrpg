# THE BIG CON — Gameplay Executive Summary (plan file)

**Request:** create an executive summary of the gameplay in "THE BIG CON", covering key characters, locations, and interactions.
**Source material:** `index.html` (single-file game engine: NODES, CHARS, CARDS, MOODS, showRules, turn engine), `docs/RULES_COPY_AUDIT.md`, `docs/CODE_LEVEL_TEST_PLAN.md`.
**Target output file (when out of Plan mode):** `docs/GAMEPLAY_SUMMARY.md`.

---

## Overview

A satirical, online-multiplayer (2–8 players) board game built as a single web page. Players are identities at a rigged financial-markets table, moving across a giant SVG "evidence board" collage of ~70 exhibits, buying/seizing nodes, planting bugs, and dodging regulators — racing to be first to hit a cash target **while holding one node of every type**.

## Win Condition

- Reach the host-set money target ($20–$999, default $100) **AND** hold at least one node of all seven types: BANK · REGULATOR · CHART · WILD · CORPORATE · COMMODITY · MEDIA.
- Only four REGULATORS exist on the whole board, so completing the set is a genuine race.
- Tagline: "No dice. The dice were rigged from the start."

## Key Characters

### Playable lobby faces (one per player, locks in a player colour)
Mark Watson, Tomkins, Jim Chalmers, Bessock, Calvin Athanasius, Denial Swan, Japsn Chen, Thousand Yard Wax — plus desktop-build extras: Alexander Lane ("The guy from Toktimer"), DJT ("QUITE FRANKLY"), The Big Ag, Seth Wegrzyn. Cosmetic identity + colour only; no per-character rule perks.

### Board "people" pins (WILD photo nodes) — the interactive cast
| Figure | What owning them does |
|---|---|
| Mark Watson, CEO of Coal | +$2/turn with COAL CORP HQ; deflects the CEO photo leak. Ironically, holding him triggers ACCC scrutiny |
| Michele Bullock, RBA Governor | Rate events never charge you; +1 Intel/turn |
| Jim Chalmers, "The Jim" | +$1/turn per REGULATOR owned |
| Anthony Albanese, The PM | Rivals pay $2 tolls to enter your nodes |
| Donald Trump, Tariff Man | Unlocks THE TWEET: drain a rival's Intel |
| Scott Bessent, "Big Bessent" | +$1/turn per BANK owned |
| James Bond, Citibank 007 | You pay no tolls anywhere |
| The Rock | Cook the books (−3 Cortisol); +$1 per distinct type owned |
| Brad Pitt (Big Short) | Pays on bond-market events |
| JTPortal | +1 Intel/turn, sees next event, once-per-game cancels a market event |

## Key Locations

Board is an 82-exhibit (now ~70) pin-up collage threaded with red string, re-laid-out every game. **Quikstop** (the servo) relocates to one of five neighbourhoods each session; everyone starts there with $15 and 2 Intel.

- **Banks:** Citi Tower, Commonwealth, NAB, ANZ, Westpac, The Bond Desk (collects BONDMAGEDDON tolls), The Hedge Fund (profits from every raid, including your own).
- **Regulators (4):** Reserve Bank (−1 Cortisol/turn, fixed-price takeovers), ASIC (unlocks Audit), ACCC (extra $2 fee on hostile takes of your nodes), Australian Government coat of arms (Budget Night).
- **Charts:** US/Japan/UK/Australia bond yields, Inflation Compensation (CPI-indexed salary), Cash-Rate chart, Stock-Market charts, and the central **10-Year Master Chart** (+$3 per other chart owned).
- **Commodities:** Crude Oil Pit ($8/turn), Tanker Fleet, Petronas, BHP, Coal Train + Coal Terminal, Gold Coins (Cortisol relief), The Forklift.
- **Corporates:** Coal Corp HQ, Quikstop (wandering servo), Marketplace Leichhardt, Formula 1 (Slipstream), **Qantas** (Fly the Jet teleport; unreachable turn 1), Bullet Train.
- **Media:** JTPortal Press Room (Spin), Fox Business, the Bond Revolt Leak, Herald Sun ("The Jim Reaper"), "Big Bessent" Breaking, "Insider Trading" graphic (free bugs), The Big Short cinema, WEF/Davos stage, the Newspapers, and **THE BIG CON** corkboard (+1 Intel per rival seizure).
- **Wild/backrooms:** Backroom Deals (pay seizures with Intel; lean on rivals), The Terminal (peek event deck), Golf Club (−$1 seizures), Whistleblower, Market Interface; fate/lore pins: St Andrew's Cathedral School, IB Diploma, Monetary Policy Competition trophy, Sisyphus Boulder (doubling pushes $10→$20→$40…), Outdoor Group Photo, Satellite, ASICS shoe, Toktimer, and the inscrutable purple **MADE (???)**.

## Key Interactions & Systems

- **Turn loop:** Income ($3 salary + holdings, synergies, mood) → Move (3 steps; +1 coal HQ, +1 train/bullet, +1 ASICS, +1 burned favor; $1 tolls, $2 if PM held, free with Bond) → One action + free intel ops → Market Event for the whole table.
- **Market Events (25 cards):** Every card resets board-wide **Mood** — CALM, BOOM (commodities +$1/turn), PANIC (banks −$1/turn, intel sells at $4), MEDIA FRENZY (media +$1, intel $3). Headliners: BONDMAGEDDON, Oil Spikes, Trump Tweeting Tariffs, CEO Photo Leaks, RBA Cash-Rate Decision, Quikstop Robbery, The Tapes Go Missing, Monetary Policy Finals, MADE payouts. Owning the right pins turns each event into a windfall.
- **Takeovers & tolls:** Seize where you stand (+1🔥). Hostile takeovers cost double (list price with the Dossier; MADE/Qantas/RBA never inflate); old owner pockets list price; +2🔥; +$2 ACCC fee if victim owns ACCC.
- **Intel economy (🛈):** Burn a favor (1🛈, +1 step), Spy on the deck (2🛈), The Dossier (3🛈, list-price takes), Bug sweep (2🛈), Mass panic (5🛈, all +2🔥), Divest MADE (5🛈, former owner refunded $7), Sell intel (fully global; $2 calm/boom, $3 frenzy, $4 panic).
- **Cortisol & raids (🔥, cap 9):** Stress is the clock. At 9 the regulators raid you before the whole table: two highest-income nodes seized, bugs pulled, fine $5 or 30% of cash (whichever larger), Intel burned to 1, fire resets, next turn = no income and one step. Hedge Fund pays $3 per raid; Group Photo pays Intel.
- **ACCC concentration checks:** Hold 3+ nodes in one tracked industry (banking, regulators, corporates, commodities, media, oil, education, JTPortal, Jim Chalmers, Big Bessent, monetary policy) → 33% chance per turn-start: 20% fine on cash AND Intel; divested nodes redistributed (max one per player). Charts exempt from type industries; **two charts count toward MONETARY POLICY**; **Mark Watson ownership is an always-suspect industry** (copy in the help modal contradicts this — see audit).
- **MADE (???):** Turn-start 33% chance: +$10/+1🛈 to owner; every rival with >2 nodes and ≥$50 pays 15% cash; takeovers stay list price; can be force-divested for 5🛈+$7. Deliberately unexplained.
- **Multiplayer plumbing:** PeerJS host/join rooms keyed by "jt portal buzzwords" (NESA, JAKE TOMKINS…), lobby chat ("The Wire"), in-game sidebar chat, per-seat secret prompts, Discord Rich Presence in the Electron desktop build (join invites from Discord), turn-alert notifications, and disconnected seats auto-playing "quiet" (still collect salary +$1; not the advertised "lay low" — see audit).

## Notes & Caveats

- Gameplay is essentially all encoded in `index.html` (~2,500-line single file); no separate JS modules.
- `docs/RULES_COPY_AUDIT.md` (ledger #11–#17) and `docs/CODE_LEVEL_TEST_PLAN.md` (ledger #1–#10) track copy-vs-engine divergences worth flagging in the summary: HORNSBY HEIGHTS buzzword doesn't exist, "Rumor Exchange" is fictional, Scrub/Real Yield is dead copy, away-seat autoplay isn't lay-low, Mark Watson exception is inverted, "Charts are exempt" fails for monetary policy.
- `REMOVED_NODE_IDS` shows an earlier board generation (notes, vault, ger, can, tv, real, etc.); help-modal copy still references a few of these.

## Rules-copy audit findings to cross-reference (from docs/RULES_COPY_AUDIT.md)

| # | Finding | Verdict |
|---|---|---|
| 11 | Help-modal collage names removed nodes (Germany/Davos, Canada/vault) | MISMATCH |
| 12 | Advertised room-code example HORNSBY HEIGHTS not in pool | MISMATCH |
| 13 | "Sell intel at the Rumor Exchange" — venue doesn't exist; rates are right ($2/$3/$4) | DEAD-COPY (venue) / MATCH (rates) |
| 14 | Away seats auto-play "quiet": salary + $1, never the lay-low choice | MISMATCH |
| 15 | "Scrub (Real Yield)" advertised; node `real` removed | DEAD-COPY |
| 16 | "Mark Watson is the named monopoly exception" — engine actually makes him an always-suspect industry | MISMATCH |
| 17 | "Charts are exempt" fails for MONETARY POLICY (cash + infl count) | COPY DRIFT |
