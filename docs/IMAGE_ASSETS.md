# IMAGE ASSETS TRACKER — BIGCON RPG: BONDMAGEDDON

Where the game looks for images: **`assets/characters/`** (constants `A` and `PORTRAITS`
around line 296 of `index.html`). Any missing file automatically renders as a
silhouette placeholder, so nothing hard-crashes — but scenes read far better with
real portraits.

Filenames are **case-sensitive** (game is usually run from the local filesystem via
`file://`, and published on case-sensitive hosts).

---

## 1. Character portraits — WIRED into the engine

These are referenced in `PORTRAITS` and used for PC-select, the party strip,
Hub strip, and dialogue (`pid:` tag on `{t:'say'}` blocks).

| File (exact) | Character | Notes |
|---|---|---|
| `aidan.png` | Aidan — The Economist | ✅ present |
| **`Butler.png`** (capital B) | The Butler | ✅ present |
| `max.png` | Max — The Banker | ✅ present |
| `lane.png` | Lane — The Quant | ✅ present |
| **`Simring.png`** (capital S) | Simring — The Kingmaker | ✅ present |
| **`Swain.png`** (capital S) | Swain — The Bureaucrat | ✅ present |
| **`Kiran.png`** (capital K) | Kiran — The Undergrad | ✅ present |
| **`Jason (1).png`** (with space) | Jason — The Coal Baron | ✅ present — space is URL-encoded in code, preferred file if we want to rename: `jason.png` would need a code change too |
| **`Lucian.png`** (capital L) | Lucian — The Lobbyist | ✅ present |
| `tan.png` | Tan — The Trader | ✅ present |
| **`chalmers.png`** | THE SHADOW SPOKES-TREASURER (not playable) | ✅ present & wired in P4 (Parliament + Treasury boss scenes) |
| **`bullock.png`** | Governor Michele Bullock — FINAL BOSS | ✅ file now present in repo. Currently only silhouette lines exist (her dialogue arrives in P5); once P5 scenes use `pid:'bullock'` she'll show automatically. Consider **replacing with a better/authorised image** before the finale ships. |

## 2. Portraits ON DISK but NOT CURRENTLY WIRED

| File | Status | Suggested use |
|---|---|---|
| `bessock.png` | **Wired — P6** | Cameo in the Newsroom scene (`pid:'bessock'`, water-cooler pundit, 2 lines). No longer unwired. |

*(As of P4, `chalmers.png` has been wired to the Shadow Spokes-Treasurer boss
scenes — moved out of this table.)*

## 3. Coming in P5 — portraits the finale will need

Referenced by the plan (§3–4). Filenames below are the suggested drops; add them
to `PORTRAITS` + scene `pid:` tags when the scenes land:

- `bullock.png` — Phase 1 + Phase 2 finale dialogue (already on disk).
- Rival round-two rematch portraits — reuse existing rival face (no new file).
- Optional: one small **purple-door / MADE** visual if we ever want a flicker
  instead of pure text (low priority; MADE is deliberately text-only).

## 4. Optional art the plan mentions but the engine currently doesn't use

The engine is emoji-first (portraits + emoji glyphs only). If we ever add these,
they'd need new engine hooks — not just files:

- **Zone banners** for the ~13 zones (`martin_hub`, `b4_tower`, `hedge_fund`,
  `quickstop`, `backrooms`, `the_terminal`, `newsroom`, `coal_pent`,
  `qantas_lounge`, `parliament`, `press_club`, `treasury`, `rba_vault`).
- **Enemy emblems** — currently `ENEMIES` table uses emoji only (`🕴 🧾 🛩 🦡 🚔 🐦‍⬛ 👑 🦘 📺 🤖 🎭 🏗 💼 🐙 🏛 🔥`).
- **Item icons** — currently emoji only in `ITEMS`.

---

### Quick repo state check
Run `dir assets\characters` (or `ls assets/characters`) against the table above.

**Rule of thumb from the plan:** "Portraits referenced from `assets/characters/`
(Bullock: placeholder silhouette until user drops file in). Emoji glyphs for
💰🛈🔥 to match the board game's vibe."
