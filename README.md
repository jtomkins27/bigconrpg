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
| P1 | Sydney Act 1: first battles, shop, first recruits | next |
| P2 | Full combat engine (HP/MP/AGI, statuses, AI, boss scripts) | |
| P3 | Market events / mood / intel / cortisol loop | |
| P4 | Canberra: fiscal boss, Fiscal Mandate, THE ACCORD unlock | |
| P5 | Rivals, Bullock two-phase finale, endings, MADE secret | |
| P6 | Balance, audio, polish | |

Full build plan: `docs/BUILD_PLAN.md`.

## Dev console helpers

`window.BCRPG` in the address bar / devtools:
`BCRPG.G()`, `BCRPG.go('m1_tower')`, `BCRPG.give(100,10,-1)`, `BCRPG.flag('x')`,
`BCRPG.scenes()`, `BCRPG.save()`, `BCRPG.mute()`, `BCRPG.reset()`.

## Notes

- Portraits live in `assets/characters/` (10 playable + `bessock.png`, which is cut).
- Michele Bullock = final boss, not playable. Drop a `assets/characters/bullock.png` in and
  the silhouette replaces itself automatically.
