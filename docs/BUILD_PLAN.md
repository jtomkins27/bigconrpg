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

**Build order:** P0 skeleton + PC select + scene engine + HUD + saves → P1 Sydney Act 1 + first battles + shop → P2 full combat engine → P3 events/mood/intel/cortisol → P4 Canberra + fiscal boss + Mandate → P5 rivals + Bullock finale + endings + MADE → P6 balance/audio/polish.
