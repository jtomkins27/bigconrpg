# BIGCON RPG — Real-Browser Multiplayer Smoke Test

The automated harnesses (`dev/mp_test.js`, `dev/soak.ps1`) run the multiplayer
state machine over an in-memory FakePeer bus. This checklist exercises what
they physically cannot: the **live PeerJS CDN load, the cloud broker, real
WebRTC/ICE, and two real browser tabs.** Budget ~15 minutes.

## Setup

1. Serve the game over `http://` (PeerJS + some WebRTC APIs need a *secure or
   localhost* context; plain `file://` can be flaky for WebRTC):

   ```
   npx http-server -p 8080 -o
   ```
   (from the repo root; any static server works, incl. GitHub Pages preview
   via `npx gh-pages` style deployments).

2. Open **two tabs side by side**: Tab A (host), Tab B (joiner).

## Checklist

**A. Kit load (both tabs)**
- [ ] No console error from `https://unpkg.com/peerjs@1.5.5/dist/peerjs.min.js`
      (Network tab: status 200; if blocked, both HOST and JOIN show the
      "PeerJS did not load (are we offline?)… solo campaign still works"
      message instead of hanging — verify by blocking the CDN once in devtools).

**B. Host + join handshake**
- [ ] Tab A: `◉ HOST A CREW` → lobby shows your row, status reaches
      `LIVE. Hand out the code: XXXXX`.
- [ ] Tab B: enter the 5-char code + a display name, `JOIN`.
- [ ] Tab B sees the lobby + seat grid; after picking a character the **host
      tab updates within a second** (roster row appears).
- [ ] Wrong code deliberately: Tab B against a nonexistent code shows
      `Nobody hosting code XXXXX. Check it and retry.` — no hang.
- [ ] Host re-HOST twice: if the code is reused and the broker still holds
      it, the host silently retries with a new code (`unavailable-id` path).
- [ ] Third tab joins the same code (4-player max): all seat picks agree.

**C. Crew session (core)**
- [ ] `LOCK IN THE CREW — START` → **both tabs** land in the world, each
      player controlling their picked character on the HUD.
- [ ] Play through the prologue together: host clicks, Tab B mirrors every
      dialogue beat (no duplicated or missing lines).
- [ ] At the first battle: each player sees ONE targeting menu and only for
      their own unit; the other player's panel shows the `⏳ …is deciding`
      waiter. Resolve a full round together.
- [ ] Fast-turn spam: both players clicking options rapidly — no stuck turn,
      no duplicate actions (beat-serial `skip` debounce).
- [ ] Enemy turn: HP/status pops render identically in both tabs (live
      bars, boss banner gold).

**D. Disconnect takeover**
- [ ] Mid-battle, close Tab B. Tab A shows the dropped-player status and the
      host **takes over that unit's turns** (ownerOf fallback) rather than
      stalling. Then Tab B re-JOINs the same code → `resume` replays beats
      and the crew continues (`Caught up with the committee.`).

**E. Solo regression on the same load**
- [ ] In a fresh tab with no HOST/JOIN: NEW GAME plays identically to the
      screen builds — difficulty chips on the title screen set the note line,
      a standard campaign reaches the verdict screen.

## Known-good reference behaviours
All of B–D above are exercised logically by `node dev/mp_test.js`
(~1,400 campaigns, 0 desyncs) — if a manual step contradicts the harness,
file the discrepancy; it's a broker/ICE surprise, not game logic.
