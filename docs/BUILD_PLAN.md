# BIGCON RPG: BONDMAGEDDON — Build Plan

**Goal:** a full satirical combat RPG (single HTML file) about seizing control of the RBA and Australian Treasury to align monetary and fiscal policy, inspired by THE BIG CON board game (`bigcon-gameplay-summary.md` in this folder).

**Repo:** `C:\Users\wato0\Github\bigconrpg` — currently just README + `assets/characters/` portraits:
`aidan.png, Butler.png, Jason (1).png, Kiran.png, lane.png, Lucian.png, max.png, Simring.png, Swain.png, tan.png`

**Decisions locked with user:**
- Combat-heavy RPG, turn-based menu battles (classic JRPG)
- Single HTML file, no build step
- Cast: 10 portrait faces (Bessock cut). Michele Bullock = FINAL BOSS at the RBA, not playable (portrait added by user later — placeholder silhouette meanwhile)
- PC selectable from the 10; the rest recruitable via story, some become rivals/bosses by choice flags
- Party of 4 active in battle, bench swapping at zone hubs
- Win = Countdown crisis, **milestone-driven clock** (advances on story milestones, not per turn). Crisis verdict endings; NO hard game-over
- Full arc + localStorage autosave (~1–2 h play)
- Carry over from board game: Intel, Cortisol, refreshed market-event deck with Mood phases; MADE (???) kept as a lingering low-relevance mystery
- Standard RPG challenge tuning (bosses can wipe the unprepared; bench rotation matters)
- Title: **BIGCON RPG: BONDMAGEDDON**

---

## 1. Core fantasy & loop

Player is chosen from ten hopefuls of a Monetary Policy Competition as bond yields explode. Build a faction, fight through the apparatus, win BOTH the **Fiscal Mandate** (Treasury) and the **Monetary Mandate** (RBA), then trigger **THE ACCORD** in a finale vs Governor Michele Bullock.

Turn loop: **pick zone → scene/choices → battle or mission → manage resources → crisis rollover.**

## 2. Resources

| Resource | Gain | Spend | Notes |
|---|---|---|---|
| Cash 💰 | battles, missions, milestone salary | items, gear, bribes, tolls, lodging | |
| Intel 🛈 | battles, spy jobs; sellable $2 CALM / $3 FRENZY / $4 PANIC | Ops: peek next event, The Dossier (reveal enemy stats), pre-battle Bug debuffs, recruit favours, black-market gear | information economy |
| Cortisol 🔥 cap 9 | +1 per won battle, +extra on hard calls | Gold Coins item, servo meals, butler tea, Golf Club visit | at 7+ party starts battles Shaken; at 9 = REGULATOR RAID: forced ASIC ambush battle + lose ~30% cash, cortisol resets, next zone's income/encounters nerfed |

**Mood phases** from event deck (~12 cards) fire between milestones/zone transitions: BONDMAGEDDON warning, Oil Spikes, Trump Tweets Tariffs, CEO Photo Leak, RBA Rate Decision (Bullock foreshadowing), Quikstop Robbery, Davos Panel, etc. Each sets **CALM / BOOM / PANIC / FRENZY**: modifies shop prices, intel rates, encounter difficulty, battle openings. Certain party members get event-driven bonuses (nod to the board game's synergy pins).

**MADE:** purple door in the Backrooms; one cryptic line per visit; 3 visits across the game = secret credit sticker. Never explained.

## 3. Cast (10 playable + final boss)

| Face | Class | Style | Signature skills |
|---|---|---|---|
| Butler | The Butler | Healer/support | Tea & Bickies (heal), Silver Service (cleanse) |
| Max | The Banker | Cash-tank | Wallet Wall, Term Deposit (delayed nuke) — default RIVAL (Hedge Fund crown) |
| Aidan | The Economist | Policy nuker | Rate Hike (ATK down), Quantitative Easing (party regen) |
| Lane | The Quant | Debuffer/tech | Toktimer (perfect-timing crits), Plant Bug, The Dossier |
| Simring | The Kingmaker | Buffer/politics | Media Spin, Question Time — default RIVAL (media chaos lord) |
| Swain | The Bureaucrat | Tank | Red Tape (enemy skips), Form 47BP shield |
| Kiran | The Undergrad | Wildcard RNG | Dice effects, All-Nighter (revive) |
| Jason | The Coal Baron | Heavy hitter | Cook the Books, Cash Backer; owning him invites ACCC (extra encounters) |
| Lucian | The Lobbyist | Charm/debuffer | Power Lunch (charm), The Long Lunch (stun) |
| Tan | The Trader | Burst/high AGI | Short Squeeze, Insider Sprint |
| **Bullock** | FINAL BOSS | — | Cash Rate Hike (drains party cash to power her attacks), Yield Curve Control (locks skill costs), Forward Guidance (confusion), summons Shadow Board scaffolds. Two phases + script twist: can be won over with the Aligned Budget… or not |

Recruit math: of 9 non-PC faces → 6 join via story (2 early Act 1, 2 late Act 1, 2 in Canberra), 2 become rivals/bosses via dialogue choice flags (defaults Max & Simring; substitutes if already recruited), 1 secret optional recruit via Backrooms.

~40 skills: 5–6 per character by level + shared policy spells learned from missions + one shared ultimate **THE ACCORD** (unlocks after Fiscal Mandate; full-party heal + "Aligned" buff).

## 4. Story: milestone-driven crisis clock

Clock advances ONLY when a major milestone completes. Each advance ratchets the world permanently: harder encounters, worse shop prices, better intel rates. Side content lives between milestones at the player's chosen pace. Expiration = judged ending, never a fail screen.

| M | Chapter | Post-phase |
|---|---|---|
| M0 | Prologue: competition win; yields spike on live TV; PM announces Inquiry; Butler recruits the PC | 1 Grumbling Yields |
| M1 | Form the Faction; Big Four Tower lobby; boss: Big Four Security Chief | 2 Vigilantes Circle |
| M2 | Follow the Money; expose Shadow Board; first rival boss; side quests open (Coal Penthouse, Backrooms, Newsroom, Hedge Fund) | 2 |
| M3 | Fly North (Qantas Jet); Parliament Question Time; Treasury infiltration | 3 The Spasm |
| M4 | Budget Coup; fiscal boss **The Shadow Spokes-Treasurer**; win Fiscal Mandate; unlock THE ACCORD | 4 BONDMAGEDDON countdown (delay = brutal encounters + shop inflation) |
| M5 | Accord Summit: RBA Boardroom gauntlet (3 fights) → Bullock two-phase finale | Verdict |

Endings scored from mandates, cortisol, cash, intel, roster, choices, MADE secret:
1. The Second Accord (best) 2. The Uneasy Truce 3. The Iron Ledger 4. Helicopter Money (chaos meme) + MADE sticker.

## 5. Zones (~13)

- **Sydney (Act 1):** Martin Place hub · Big Four Tower lobby · Hedge Fund floor · Quikstop shop · Backrooms (+ MADE door) · The Terminal (forecast shop) · Newsroom · Coal Corp Penthouse (optional boss)
- **Canberra (Act 2):** Qantas Lounge · Parliament House · Press Club (optional) · Treasury dungeon (fiscal boss)
- **Act 3:** RBA Boardroom Vault (the Martin Place building from Act 1)

## 6. Combat spec

- Order by AGI; 4 vs 2–5 enemies; menu: Attack / Skill / Item / Defend (no flee vs bosses); MP = "Mandate Points" (joke naming, decide in build)
- Statuses: Shaken, Charmed, Audited, Bearish, Bullish, Hedged, Red-Taped
- Mood modifiers on battle HUD
- ~14 enemy types, Australian flavour: Suit Security, ASIC Audit Drones, Quant Wombats, Income Police, Inflation Ibises, Margin Call Kangaroo
- Standard-RPG-challenge tuning: early fights small, bosses capable of wiping an unprepared party, no grinding requirement, bench rotation matters
- Battles award cash + intel + cortisol

## 7. Architecture

`index.html` single file, ~6–8k lines, data-driven. Sections:

1. **CSS** — dark "evidence-board" skin: mono headers, red-string motif, faction colour chips, spreadsheet-shell HUD
2. **DATA** — CHARS, SKILLS, ENEMIES, ITEMS, ZONES, SCENES (scene = block array: line/choice/battle/+resource/flag/unlock), EVENT deck, endings table
3. **ENGINE** — state, flags, milestone clock, autosave (localStorage; save after every scene & battle; Continue on load)
4. **UI** — scene renderer, dialogue w/ portraits, choices, HUD, shop, bench swap, intel ops panel
5. **COMBAT** — turn engine, statuses, AI, boss scripts
6. **AUDIO** — tiny WebAudio bleeps, mute button, no external assets

Portraits referenced from `assets/characters/` (Bullock: placeholder silhouette until user drops file in). Emoji glyphs for 💰🛈🔥 to match the board game's vibe.

**→ Asset checklist:** see `docs/IMAGE_ASSETS.md` for the full, current list of
portrait/zone/enemy image files — what's on disk, what's wired into scenes, and
exact required filenames (case-sensitive).

**Build order:** P0 skeleton + PC select + scene engine + HUD + saves → P1 Sydney Act 1 + first battles + shop → P2 full combat engine → P3 events/mood/intel/cortisol → P4 Canberra + fiscal boss + Mandate → P5 rivals + Bullock finale + endings + MADE → P6 balance/audio/polish.

---

## Build progress log (updated as phases land)

- **P0–P3:** done (skeleton, Act 1, combat engine, market deck/mood/intel/cortisol).
- **P4:** done — `m3_flynorth`, real Parliament House / Press Club / Qantas / Treasury scenes,
  Shadow Spokes-Treasurer boss (scaffold summon), Fiscal Mandate → **THE ACCORD** unlocks,
  M4 → phase 4 BONDMAGEDDON COUNTDOWN (market pinned to PANIC reactions at M5-adjacent draws),
  out-of-battle consumables (POCKETS in Intel Ops).
- **P5:** done —
  - Coal Corp optional boss (Acting CEO, floor 4B).
  - Recruit math completed per plan: 2 early Act 1 (m1 lobby + tower revisit),
    2 late Act 1 (newsroom + hedge fund), 2 Canberra (jet + Question Time),
    rival-of-record joins after the gauntlet rematch, secret recruit via the
    3rd purple-door visit (MADE — sticker + recruit if a face remains unclaimed).
  - **M5 ACCORD SUMMIT:** RBA gauntlet (Shadow Ops → rival rematch → Dark Pool Kraken),
    Bullock two-phase finale with Cash Rate Hike (drains party cash, powers her up)
    and Yield Curve Control (+1 MP all skills in phase 2), then the script twist:
    Offer THE ACCORD / Crush / Helicopter Money.
  - **Verdicts:** Second Accord / Uneasy Truce / Iron Ledger / Helicopter Money (+ MADE
    sticker), plan-scored out of 123, shown on the verdict overlay (ESC/Enter = credits).
- **P6 (remaining):** full balance pass against real playtesting, more audio kit /
  music selection, visual polish, title-screen difficulty options.

### Session: multiplayer (P5.5) — static-site 4-player crews over WebRTC

- **Architecture (host-authoritative):** the host runs the whole engine
  (scenes, battles, economy, Autosave truth); clients render broadcast
  beats and send intents. Solo play is untouched: `NET.role==='solo'`,
  zero networking, all MP guards are no-ops.
- **Transport:** PeerJS 1.5.5 (CDN), ids `bcrpg-online-v1-<5-char code>`;
  lobby with name + candidate pick per player; `{t:'start'}` per-conn
  handshake, then mirrored `{t:'g'}` full-state sync (debounced 120 ms;
  also hooked into `renderHUD`/`battleBeat`/`nextTurn` so mid-battle
  drains/cash shredders stay live on client HUDs).
- **Message contract** (host→client): `scene/k/say/choice/menu/newbox/box/
  rbeat/made/ms/ev/ending/toast/g/lobby/start/resume/bye/trap`;
  (client→host): `hello/pcpick/pick/skip/menuPick/cont`. Beats carry a
  monotonic serial `bs`; client skips send `{t:'skip', bs}` and the host
  accepts only `bs > NET._skipProc` — a laggy client can never
  double-advance the story.
- **Ownership:** `G.mpSeats`/`G.mpNames` persist in the save. Clients only
  act on menus for units they own (`menuPick` validated by seq + owner);
  everyone else's menu renders as a `⏳ … is deciding their move…` waiter.
  Story choices: first click wins (`NET.CHOICE` ctx). Battle result
  CONTINUE: host-executed (`NET.CONT`). Host-only utilities (shop, bench
  swap, ops, pockets, zones) are `NET.uiGate()`-guarded.
- **Disconnects:** the disconnecting player's character becomes
  host-controlled; bench-swap refuses to bench player characters, and the
  `→ LINEUP` pop-path now replaces the last NPC slot instead of popping
  (a 4/4 crew could otherwise silently bench a seat). Late joiners replay
  the scene buffer (`{t:'resume'}`) or spectate.
- **MP balance inside the committee:**
  - `joinChar` auto-swing (host campaigns only): when seats fill two of
    four slots, strong recruits swap in over the weakest non-seat NPC
    (solo keeps its original fill order).
  - Withdrawal fee halved in MP — "the committee splits the tab" — so a
    broke crew cannot fall into an unbuyable death spiral (the door is
    what killed runs where meals cost more than the treasury).
- **Menu refactor for MP:** all battle menus are now built as data
  (`menuOpen(kind,u,prompt,opts)` → `{k0,x,sub,dis,mpc,rhp}` payloads)
  with a single `menuDo(kind,u,i)` executor; solo labels/behaviour are
  byte-identical (re-verified post-refactor). Heal/revive kit options are
  marked `♥` in the skill menu.
- **`dev/mp_test.js` (new):** two fake-DOM sandboxes over a synchronous
  FakePeer bus; plays FULL 2-player campaigns (client drives dialogue
  skips end-to-end through the bs guard; client-owned battle turns via
  `menuPick`; desync detector host-vs-client state persists), plus a
  disconnect mid-campaign test. Results: 8/8 crews reach a synced verdict;
  zero crash/stall/desync findings across batches.
- **Pilot upgrades (both harnesses):** they now shop meals, bench-swamp
  fresh substitutes, and seek `♥` heal/revive options when a teammate is
  down or the actor is under 40% HP. With those, `dev/playtest.js` is
  14/14 clean again — the earlier treasury grind was the pilot starving
  (closing the shop without buying) on BOTH solo and crews.
- **Known balance niche (deferred to P6):** a 2-crew with unlucky mood
  draws (FRENZY×1.18) can still drop the scripted 4-operative fights
  repeatedly before clawing back; real players have ACCORD/bench/ops and
  won't grind like a random script.

> **Status P4+P5+P5.5:** all of the above is committed & pushed to
> `origin/main` as `0463be9` (2026-10-18). `dev/mp_test.js` battery:
> 12/12 crews to synced verdicts, disconnect test green, desync-free.
> Solo: `dev/playtest.js` 14/14 + `bcrpg_test`/`bcrpg_p5` harnesses green.
> **Still manual:** one real-browser smoke of the PeerJS cloud broker
> (open `index.html` twice → HOST + JOIN with the same 5-char code) —
> the harness covers logic over a fake bus, not the live CDN path.

### Next up — P6, in batches

1. **Difficulty select on the title screen** (EASY / STANDARD / HARD):
   a `diff` field in the save scales foe stats + encounter mood spikes at
   the mkUnit choke point and nudges rewards; backfill old saves to
   `st` (standard). Difficulty is engine-global so MP crews inherit
   whatever the host picked (auto-syncs via `{t:'g'}`).
2. **Balance smoother (P6 pass 1):** damp the FRENZY encounter multiplier
   that makes the scripted 4-operative fights coin-flips for thin
   parties; re-validate with both harnesses.
3. **Richer audio beyond `beep()`:** small WebAudio stingers (battle
   win/loss, milestone, verdict fanfare) — no external assets.
4. **`bessock.png` cameo** (last cut-cast asset): one cameo block in the
   Newsroom scene; unwired files stay silhouette-safe by design.
5. Final: full battery re-run + commit/push.

### Session: P6 batch 1 — difficulty, smoother, stingers, Bessock cameo

- **Title-screen difficulty (EASY / STANDARD / HARD):**
  - `DIFFS` TWEAK table: foe HP+ATK ×0.85 / ×1 / ×1.15, encounter-curve
    ×0.9 / 1 / 1.15, retreat-fee ×0.75 / 1 / 1.15, win-cash ×1.2 / 1 / 0.85.
  - Pick persists pre-game in `localStorage['bcrpg_diff']` (survives
    reloads), lands in `G.diff` at `startGame` via `freshState`, backfilled
    to `st` for saves older than the feature (`continueGame`).
  - Single choke points: `mkFoeUnit` (`dh.foe` rides the existing
    `sc()` line) and `ECON.enc()` (multiplies the mood `enc` modifier);
    win-cash and the withdrawal fee read `dh.reward`/`dh.loss` in
    `endBattle`.
  - Title chips + one-line note under the rule row; MP crews inherit the
    host's pick for free through the `{t:'g'}` full-state sync.
  - New dev hook: `BCRPG.mkFoe(eid)` (foe factory for stat tests).
- **Balance smoother:** FRENZY encounter multiplier 1.10 → 1.06 (thin
  crews kept coin-flipping the scripted 4-operative fights). PANIC left
  at 1.18 — by then the party should be levelled and rostered.
- **Audio stingers:** `stinger(name)` — 3–4-note square-wave WebAudio
  cues, no assets: `win` (site secured), `lose` (withdrawal fee),
  `mile` (crisis advances, replaces the flat error beep, host + client
  `{t:'ms'}`), `verdict` (ending fanfare, fires in `showEnding` for host
  and client; the client path needed no extra message since it funnels
  through the same function).
- **Bessock cameo:** BESSOCK is a water-cooler pundit in the Newsroom
  scene (2 lines, `pid:'bessock'`); PORTRAITS wired to
  `assets/characters/bessock.png`. The last unwired portrait is now used.
- **Verification (all green):**
  - `dev/playtest.js` 14/14 verdicts, 0 findings, 165/165 battles won.
  - `dev/mp_test.js` 8/8 crews reach synced verdicts, 0 errors.
  - New `dev/diff_test.js`: 15/15 — fresh-save default `st`,
    `ECON.enc()` per diff, foe maxhp/atk monotone across diffs, fee/reward
    curve in table, chip UI wiring, FRENZY 1.06 / PANIC 1.18.
  - Parse OK, scene refs OK, CJK clean.


### Session: automated playtester + first findings

- **`dev/playtest.js` built and battle-hardened:** 14/14 headless runs now
  finish at the verdict screen with zero errors/warnings; per-enemy
  `testBattle` sweep clean (all winnable at lv6 × 4-party).
- **Real engine fix 1 — battle menu Back buttons:** entering the Skill menu
  with insufficient MP for every kit skill soft-locked the unit (no
  cancel existed). Added `← Back` to the Skill / Item / target menus
  (returns to the unit's main move menu).
- **Real engine fix 2 — `joinChar` benched-member guard:** a character
  already on the bench could be joined a second time (e.g. bench-Lucian
  then the `joinrival` block) — roster dedupe now checks both arrays.

## Automated playtesting

Run `node dev/playtest.js [runs]` (or `node dev/playtest.js sweep` for a
battle-tuning sweep only). It boots the game headlessly with a fake DOM, plays
the WHOLE story to the verdict screen by clicking the real scene engine
(12 random-candidate runs by default, choice-diverse so rivals/branches vary),
sweeps every enemy through `testBattle` with a level-6 four-person party for
win-rate outliers, and reports any crash, stall, NaN/negative resources, roster
overflow, or unreachable-scene finding. Exit code 1 on errors — wire it into a
pre-release check. Findings it surfaces get fixed in `index.html` directly.
