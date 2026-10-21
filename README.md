# BIGCON RPG: BONDMAGEDDON

A satirical, combat-heavy RPG (single HTML file, no build step) about seizing control of the
RBA and Australian Treasury to align monetary and fiscal policy. Inspired by
**THE BIG CON** board game — see `docs/BIGCON_BOARDGAME_SUMMARY.md`.

## Run it

Open `index.html` in any browser. No server, no dependencies. Autosaves to localStorage.

## Status

| Phase | Scope | State |
|---|---|---|
| **P0** | Skeleton: PC select (10 faces), scene engine, HUD, milestone clock, autosave/continue, prologue (M0) | **✅ done** |
| **P1** | Sydney Act 1: M1 lobby chain + Security Chief, ally recruit, real Quikstop shop, zone travel vignettes, M2 Shadow Board chain with rival branch (recruit vs boss), bench swap | **✅ done** |
| **P2** | Full turn-based combat: HP/MP/AGI queue, 53 skills via data overlay, statuses, AI scripts with boss summons, persistent unit hp/mp, loss = retreat (no game over), `testBattle` QA API | **✅ done** |
| **P3** | Market event deck (12 cards), mood economy (CALM/BOOM/FRENZY/PANIC), intel ops (peek/bug/dossier/favor), cortisol regulator raids | **✅ done** |
| P4 | Canberra: fiscal boss, Fiscal Mandate, THE ACCORD unlock | next |
| P5 | Rivals, Bullock two-phase finale, endings, MADE secret | |
| P6 | Balance, audio, polish | |

Full build plan: `docs/BUILD_PLAN.md`.

## Tweaking the game (design-video notes)

Balance/event data is deliberately engine-free. Tables to edit, all in `index.html` under
`===TWEAK` banners: `TUNING` (damage/heal/economy knobs), `MOOD_MODS` (mood → shop prices,
intel rates, encounter difficulty, battlefield openings), `EVENTS` + `EVENT_SYN` (the 12-card
market deck + per-character synergy payouts), `SKILL_FX` (what every skill does), `ENEMY_STATS`
/ `ENEMY_AI` / `FOE_MOVES`, `RIVAL_ORDER`, and the milestone → zone unlock map.

## Dev console helpers

`window.BCRPG` in the address bar / devtools:
`BCRPG.G()`, `BCRPG.go(id)`, `BCRPG.give(cash,intel,cort)`, `BCRPG.flag(k,v)`,
`BCRPG.scenes()`, `BCRPG.save()`, `BCRPG.mute()`, `BCRPG.reset()`,
`BCRPG.setMood('PANIC')`, `BCRPG.drawEventCard('test')`,
`BCRPG.testBattle(['lane','butler'],'b4_chief',['attack'])` (scripted battle sim),
`BCRPG.battle()` (live battle introspection).

## Notes

- Portraits live in `assets/characters/` (10 playable + `bessock.png`, which is cut).
- Michele Bullock = final boss, not playable. Drop a `assets/characters/bullock.png` in and
  the silhouette replaces itself automatically.
