# Art pipeline

All the art comes from Midjourney. The repo does the fiddly part after you download:

| Kind of art | Where to make it | What the repo does with it |
| --- | --- | --- |
| Rooms, new characters, talking props, cards | Midjourney ([prompts](midjourney-prompts.md)) | Nothing extra: save over the file the game loads. |
| Props that replace the placeholders | Midjourney, [section 6](midjourney-prompts.md#6-props-that-replace-the-placeholders) | `npm run art:import` removes the background and fits each prop to the size the room expects. |
| Talking (mouth) frames | Midjourney's Editor, [section 7](midjourney-prompts.md#7-talking-frames-for-wren-gus-barnaby-helga-and-duke) | `npm run art:import` blends in only the mouth, so the character never jitters, and switches on lip flap. |

The easiest route is to drop your Midjourney downloads into a chat with Claude, which runs the import and commits the
result. Doing it yourself in Codespaces:

```
npm run art:import -- --list                                   # what's done, what's left
npm run art:import -- props/gavel gavel.png                    # one prop
npm run art:import -- mouth/wren:half a.png mouth/wren:wide b.png
```

Job names and output paths are in `tools/asset-jobs.json`. Commit the new images with `tools/.asset-manifest.json`,
`src/casebound/mouthFrames.generated.ts` and `public/characters/characters.json`.

## Optional: generating instead of Midjourney (paid)

`npm run art:generate` can make the same assets with OpenAI's image API instead, which costs a few cents per image.
It isn't needed for anything above. If you ever want it:

### One-time setup

1. **Get an OpenAI API key** at [platform.openai.com/api-keys](https://platform.openai.com/api-keys) and add a payment method under Billing. Each image costs a few cents. If image calls are refused, verify your organization under Settings → Organization.
2. **Save the key as a Codespaces secret.** Go to [github.com/settings/codespaces](https://github.com/settings/codespaces), choose **New secret**, name it `OPENAI_API_KEY`, paste the key, and under repository access pick `humongous-style-game`. Never put the key in a file: this repo is public.
3. **Restart the codespace** (Codespaces menu → Stop current codespace, then reopen it) so it picks up the secret. If the codespace was created before this change, also run `npm ci` once.

### Making art

```
npm run art:generate -- --list       # what's done, what's left
npm run art:generate -- --only gavel # try one job first
npm run art:generate                 # everything that isn't done yet
```

Then run the game and look. If something looks wrong:

- **Redo one image:** `npm run art:generate -- --only gavel --force`
- **Change it:** edit that job's `prompt` in `tools/asset-jobs.json` and run again. Edited jobs rerun on their own.
- **Undo it:** `git checkout -- public/art/props/gavel.png` brings the old file back.

When you're happy, commit the new images along with `tools/.asset-manifest.json` (it records what's done) and
`src/casebound/mouthFrames.generated.ts` (it switches on lip flap for characters whose frames now exist).

### How the jobs work

Everything lives in `tools/asset-jobs.json`.

- **Props** (`"type"` left out) are drawn on magenta, which is then made transparent, and the result is fitted to the
  same 256×256 canvas as the file it replaces, so it appears at the same size in the room. `styleRefs` are the
  Midjourney props the model copies the look from.
- **`basedOn`** makes the second state of a prop (lamp off, suitcase open, gauge at 70) from the first one, so the pair
  matches. The first one has to be generated before the second.
- **Mouth jobs** take the closed-mouth picture, crop around `mouthBox` (`[left, top, right, bottom]` in pixels of the
  original image), ask for a half-open and a wide-open mouth, and blend only an oval around the mouth back in. If the
  oval cuts through the wrong place, adjust `mouthBox`.
- **`model`** at the top picks the OpenAI image model. Newer ones (for example `gpt-image-2.5-sunburst`) can be swapped
  in by changing that one line.

To add art for a new room, copy a job, give it a new `name` and `out` path, and run the script.

### Running it on GitHub instead of Codespaces

The **Generate art** workflow (Actions tab → Generate art → Run workflow) does the same run on GitHub's servers and
saves the new images to a branch named `art/run-<number>`, ready to review and merge. It needs the key saved once
as an Actions secret: repo Settings → Secrets and variables → Actions → New repository secret, named
`OPENAI_API_KEY`. Claude can start this workflow for you and review the results.

## Reusing the characters in another build

`public/characters/` is a self-contained character pack: each character's folder plus `characters.json`, which lists
every frame, the canvas size and where the feet anchor. The script keeps `characters.json` pointing at the generated
talking frames, so copying the whole `public/characters/` folder into a new build brings the cast, mouth frames
included. Generate the frames once here and every build gets them.

For a new build's backgrounds, use Midjourney with `--sref` pointing at one of this game's rooms (links in
[midjourney-prompts.md](midjourney-prompts.md)), so the new places still match the characters standing in them.
Backgrounds are 1280×720 and characters stand with their feet at y = 705.
