# Engine: vendored Caper

This folder is a copy of the [Caper](https://github.com/gandazgul/caper) point-and-click engine (MIT, see `LICENSE`),
built on Phaser 3. It lives in this repo so we own it: edit it freely, and it keeps working even if upstream stops.

- Upstream: https://github.com/gandazgul/caper
- Copied from commit `a909489959a0beabb5a2e6d70dfacb9355a80814` (2026-10-25), version 0.5.1
- Unit tests (`*.test.js`), work records and plans were left out; `docs/` is kept as reference.

## What changed from upstream

Nothing yet. Record every change to files in this folder here, so pulling a newer upstream later is a clear diff.

## Pulling upstream changes later

1. Clone upstream next to this repo.
2. Diff `upstream/src` against `engine/src` and `upstream/mod.js` / `mod.d.ts` against ours.
3. Copy over what you want, re-apply anything listed under "What changed from upstream", and update the commit above.

## How the game talks to it

Game code imports everything from `@caper` (a Vite + TypeScript alias for `engine/mod.js`, typed by `engine/mod.d.ts`).
Start with `docs/index.md`, then `docs/props.md`, `docs/npc-and-cast.md` and `docs/hints-and-speech.md`.
