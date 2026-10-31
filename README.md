# Casebound (humongous-style-game)

A Humongous-style point-and-click adventure (think Putt-Putt, Freddi Fish, Pajama Sam, Spy Fox) that runs in the
browser. TypeScript + Vite + Phaser 3, on a vendored copy of the [Caper](https://github.com/gandazgul/caper) engine.

Instead of voice acting, characters talk in a text box while their mouth flaps between three images
(closed / half / open), timed to the typewriter text.

## Run it

**In GitHub Codespaces (no installs):** Code → Codespaces → Create codespace on main. When it finishes setting up,
the dev server starts and the game opens in a preview tab. Edits reload instantly.

**Anywhere else with Node 22+:**

```bash
npm install
npm run dev        # play at http://localhost:5173
npm test           # unit tests + content checks (every case answerable, every image and speaker exists)
npm run build      # type check + production build into dist/
npm run e2e        # browser smoke test + full automated playthrough of dist/ (about 4 minutes)
npm run ci         # everything CI runs, in order
```

## Playing Casebound

Wren falls asleep over her casebooks and wakes up in the Undercase, a city where every unsolved case is a district.
Warm up with the Vending Oracle in the lobby, crack the eight district cases, then face the Blank Page.

- Click characters and objects to talk to them. Click (or Space / Enter) to advance dialogue.
- Each case runs the same seven beats: hear the prompt, lock the objective, spend 3 Question Lanterns, build the
  board, plant the flag, drive the case, close. Wrong picks get coaching and a retry; the Hint button helps for half a star.
- Extras: a hidden Framework Card in every area, Exhibit A's Driver Detective mystery after each case, and the doors'
  Case Quiz once four districts are cleared.
- **Shift+U** on the map unlocks everything, for testing. **Start over** in the top bar wipes the save.
- Test mode: add `?auto=12345` to the URL (any number) and every choice is picked at random from that seed and
  logged to `window.__cbLog`. The same number replays the same picks.

The full script is in `docs/casebound-case-framework-script.md`; the game's content lives in `src/casebound/content/`.

## Where things live

```
public/art/              all images. Replace a PNG with one of the same name to change the art.
  rooms/                 1280x720 backgrounds
  characters/<name>/     closed.png, half.png, open.png (mouth frames)
  items/                 inventory items
  ui/                    inventory bar and thought bubble
src/
  main.ts                boots Casebound
  casebound/             the game: content (cases, places, minigames), case loop, scenes, save, UI
                         (game/ and rooms/ below hold the original Pond / Meadow demo, kept as engine examples)
  game/assets.ts         every image and its texture key
  game/characters.ts     who talks: name, name-tag colour, mouth frames, typing speed
  game/state.ts          the save-game flags (metMayor, hasMarble, ...)
  game/rooms/            one file per room: walkable area, hotspots, NPCs, scripts
  rooms/GameRoom.ts      base class: talk(), stationary NPCs, run("script") hotspots
  dialogue/lipflap.ts    text -> reveal timing + mouth track (pure, tested)
  dialogue/TextBox.ts    the on-screen dialogue box
  dialogue/talk.ts       say() / conversation(): drives the text box and the mouth frames
engine/                  the Caper engine (MIT). See engine/UPSTREAM.md before changing it.
tools/make_placeholder_art.py   draws the placeholder art
```

## Swapping in your art

1. **Backgrounds:** 1280x720 PNG. Save over `public/art/rooms/pond.png` (or add a new file and a line in
   `src/game/assets.ts`).
2. **Characters:** transparent PNG, feet at the bottom edge, centred. The engine anchors characters at bottom-centre.
3. **Mouth frames:** three PNGs per character with **identical canvas size and position**; only the mouth changes.
   If the head shifts between frames, the character will wobble while talking.
4. Reload. Then press Shift+D to check the hotspots still line up with the new art, and Shift+E to fix them.

## Adding a character who talks

1. Put `closed.png`, `half.png`, `open.png` in `public/art/characters/<name>/` and add them to `src/game/assets.ts`.
2. Add a speaker in `src/game/characters.ts` with those three keys.
3. In a room's `setupRoom()`, call `this.addStationaryNpc({ ... })` with where they stand, their click box, where the
   player walks to (`approach`), and an `onTalk` script. See `src/game/rooms/Pond.ts`.

## Adding a room

Copy `src/game/rooms/Meadow.ts`, change the `key`, background, walkable polygon and props, then add the class to
`scene: [...]` and the key to `ROOMS` in `src/main.ts`. Exits are props with `onClick: [{ goToScene: "RoomKey" }]`.

## Writing dialogue

```ts
await room.talk([
    ["frog", "Ahem! Good morning, young citizen."],
    ["hero", "Hi! I'm Pip."],
]);
```

Branch with normal `if` statements on save flags (`store.get("metMayor")`), and set flags with `store.set(...)`.
Hotspots trigger scripts with `onClick: [run("scriptName")]`, defined in the room's `scripts`.

## How the lip flap works

`src/dialogue/lipflap.ts` turns a line into a reveal schedule (when each letter appears, with pauses after
punctuation) and a mouth track: vowels open the mouth, m/b/p close it, other letters half-open it. The track is cut
into 75 ms beats so the mouth changes about 6 to 13 times a second, like classic cartoon lip flap. It is the same idea
as the time-coded "talk state" track Humongous shipped with each voice clip, driven by text instead of audio.
Tune it per character with `cps` (typing speed) in `characters.ts`.

## CI/CD

`.github/workflows/ci.yml` runs on every push and pull request (changes that only touch `docs/` or Markdown skip it):

1. **Test and build**: content checks, typecheck, production build, size budget (40 MB total, 3 MB per file).
2. **Browser playthrough**: a real headless Chromium loads every image, clicks Start, then plays the whole game with
   seeded random answers. Screenshots and the log are saved on the run page under **Artifacts** as `e2e-output`.
3. **Publish to GitHub Pages**: only on `main`, only when 1 and 2 pass. The game lives at
   `https://<user>.github.io/humongous-style-game/`.

One-time setup: repo **Settings → Pages → Build and deployment → Source: GitHub Actions**. Until then the publish
step fails with that instruction. If it ever says "deploy from a branch", change Source to GitHub Actions.

When something goes red:

- **Test and build** failed: open the run and read the first error. Content mistakes name the case and field,
  for example `CASES.vault.start.options[2].reply[0]`.
- **Browser playthrough** failed: the log ends with `Replay this exact run with: E2E_SEED=... npm run e2e`.
  Download `e2e-output` from the run page for screenshots.
- **Roll back**: revert the bad commit on `main`, or open an older green run (within 30 days) and click
  **Re-run all jobs**.

To run the browser test in a Codespace, install Chromium once: `npx playwright install --with-deps chromium`.

Dependabot opens at most one grouped update a month for npm packages and one for the workflow's actions.
Major version jumps (Phaser 4, a new Vite major) are left for you to do on purpose.

## Credits

Engine: [Caper](https://github.com/gandazgul/caper) by Carlos Ravelo, MIT licence (`engine/LICENSE`).
