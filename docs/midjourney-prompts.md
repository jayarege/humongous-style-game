# Casebound: Midjourney prompts

Copy-paste prompts for every image on the script's art checklist. Filenames match the repo.

## Before you start

1. **Lock the style.** Every prompt below already ends with `--sref` and a link to one of your own pictures, so Midjourney copies that look. Characters point at your Okafor portrait; props and UI point at your Margin Market background. To use a different picture, swap the link for any URL in the reference table below.
2. **Plain backgrounds only.** Every prompt asks for a solid background so you can cut the subject out in the Editor (Smart Select, then Erase Background) and download a transparent PNG. The Blank Page is a white board, so it uses a green background instead of white.
3. **Mouth frames.** Generate the closed-mouth version first. Open it in the Editor, erase only the mouth, and regenerate that area with "mouth half open, mid-word". Do it again with "mouth wide open, excited". Keep the three images the same size so they line up in the game.
4. **Shared style line.** Every character prompt ends with the same style text. It is written out in full in each prompt below, so you can paste any line as is.

## Your reference pictures

These are your own images, stored in the repo so Midjourney can read them by link. Paste any link after `--sref` to use it as a style reference, or open it, save it and drag it into the prompt bar.

**Characters**

| Picture | Link |
| --- | --- |
| Fizz | https://raw.githubusercontent.com/jayarege/humongous-style-game/main/public/characters/fizz/fizz-closed.png |
| Moss | https://raw.githubusercontent.com/jayarege/humongous-style-game/main/public/characters/moss/moss-closed.png |
| Okafor | https://raw.githubusercontent.com/jayarege/humongous-style-game/main/public/characters/okafor/okafor-closed.png |
| Quill | https://raw.githubusercontent.com/jayarege/humongous-style-game/main/public/characters/quill/quill-closed.png |
| Tug | https://raw.githubusercontent.com/jayarege/humongous-style-game/main/public/characters/tug/tug-closed.png |

**Backgrounds**

| Picture | Link |
| --- | --- |
| Office Desk | https://raw.githubusercontent.com/jayarege/humongous-style-game/main/docs/references/office_desk.jpg |
| Sticky Note Landing | https://raw.githubusercontent.com/jayarege/humongous-style-game/main/docs/references/sticky_note_landing.jpg |
| Hotel Lobby | https://raw.githubusercontent.com/jayarege/humongous-style-game/main/docs/references/hotel_lobby.jpg |
| Margin Market | https://raw.githubusercontent.com/jayarege/humongous-style-game/main/docs/references/margin_market.jpg |
| Border Docks | https://raw.githubusercontent.com/jayarege/humongous-style-game/main/docs/references/border_docks.jpg |
| Runway Row | https://raw.githubusercontent.com/jayarege/humongous-style-game/main/docs/references/runway_row.jpg |
| Greenhouse | https://raw.githubusercontent.com/jayarege/humongous-style-game/main/docs/references/greenhouse.jpg |
| Auction Hall | https://raw.githubusercontent.com/jayarege/humongous-style-game/main/docs/references/auction_hall.jpg |
| Vault | https://raw.githubusercontent.com/jayarege/humongous-style-game/main/docs/references/vault.jpg |
| Abacus Heights | https://raw.githubusercontent.com/jayarege/humongous-style-game/main/docs/references/abacus_heights.jpg |
| Foundry | https://raw.githubusercontent.com/jayarege/humongous-style-game/main/docs/references/foundry.jpg |
| Skyline Base | https://raw.githubusercontent.com/jayarege/humongous-style-game/main/docs/references/skyline_base.jpg |
| Skyline Top | https://raw.githubusercontent.com/jayarege/humongous-style-game/main/docs/references/skyline_top.jpg |

## 1. New characters (closed-mouth frame first)

**Wren** → `public/characters/wren/wren-closed.png`

```
a friendly young woman cartoon character, first-week business consultant, rumpled navy blazer over a striped shirt, messy bun with a pencil stuck through it, sleepy but determined smile, holding a small spiral notepad, mouth closed, full body, standing, facing the viewer, hand-painted 2D cartoon, 1990s children's adventure game style, bold clean outlines, warm saturated colors, plain solid white background, no text --ar 2:3 --sref https://raw.githubusercontent.com/jayarege/humongous-style-game/main/public/characters/okafor/okafor-closed.png
```

**Gus the Easel** → `public/characters/gus/gus-closed.png`

```
a cartoon flip-chart easel character with three wooden legs, a big paper pad as its body with a cheerful face drawn in black marker on the top sheet, two stubby wooden arms, one holding a fat marker, eager expression, mouth closed, full body, facing the viewer, hand-painted 2D cartoon, 1990s children's adventure game style, bold clean outlines, warm saturated colors, plain solid white background, no text --ar 2:3 --sref https://raw.githubusercontent.com/jayarege/humongous-style-game/main/public/characters/okafor/okafor-closed.png
```

**The Blank Page** → `public/characters/blank_page/` (one prompt, three glow states)

```
a giant floating whiteboard character with a thin silver frame and a marker tray along the bottom, small worried eyes and a wobbly nervous mouth drawn on its surface, {dim and gray, softly glowing white, radiant glowing gold}, hand-painted 2D cartoon, 1990s children's adventure game style, bold clean outlines, plain solid bright green background, no text --ar 4:5 --sref https://raw.githubusercontent.com/jayarege/humongous-style-game/main/public/characters/okafor/okafor-closed.png
```

Save them as `blank_page-dim.png`, `blank_page-glow.png` and `blank_page-gold.png`, then make the half-open and wide-open mouth frames from the dim one.

**Barnaby Bunch** → `public/characters/barnaby/barnaby-closed.png`

```
a plump gloomy grocer cartoon character in a green apron and yellow rain boots, holding a dripping umbrella over a wilting head of lettuce, droopy eyebrows, mouth closed, full body, standing, facing the viewer, hand-painted 2D cartoon, 1990s children's adventure game style, bold clean outlines, warm saturated colors, plain solid white background, no text --ar 2:3 --sref https://raw.githubusercontent.com/jayarege/humongous-style-game/main/public/characters/okafor/okafor-closed.png
```

**Dr. Helga Sprocket** → `public/characters/helga/helga-closed.png`

```
an energetic engineer woman cartoon character in a white lab coat with goggles pushed up on her forehead, sitting on an overstuffed suitcase covered in travel stickers that won't close, big confident grin, mouth closed, full body, facing the viewer, hand-painted 2D cartoon, 1990s children's adventure game style, bold clean outlines, warm saturated colors, plain solid white background, no text --ar 2:3 --sref https://raw.githubusercontent.com/jayarege/humongous-style-game/main/public/characters/okafor/okafor-closed.png
```

**Duke Mergeworth** → `public/characters/duke/duke-closed.png`

```
a pompous portly collector cartoon character in a purple velvet coat, gold rings and a monocle, proudly raising a numbered auction paddle, smug smile, mouth closed, full body, standing, facing the viewer, hand-painted 2D cartoon, 1990s children's adventure game style, bold clean outlines, warm saturated colors, plain solid white background, no text --ar 2:3 --sref https://raw.githubusercontent.com/jayarege/humongous-style-game/main/public/characters/okafor/okafor-closed.png
```

## 2. Optional: the five roles your existing characters could fill

Skip these if Tug, Fizz, Okafor, Quill and Moss take the roles. If you'd rather have new characters, paste the line below. It makes five jobs, one per role, which needs a Standard plan or higher (Basic allows 4 per prompt, so drop one and run it separately).

```
a cartoon character, {airline captain in a navy uniform flipping a silver coin, cheerful startup founder in a hoodie holding a watering can, calm investor in glasses reading a spreadsheet, fussy professor in a tweed jacket holding a single abacus bead, plant foreman in a hard hat tapping a clipboard with a wrench}, mouth closed, full body, standing, facing the viewer, hand-painted 2D cartoon, 1990s children's adventure game style, bold clean outlines, warm saturated colors, plain solid white background, no text --ar 2:3 --sref https://raw.githubusercontent.com/jayarege/humongous-style-game/main/public/characters/okafor/okafor-closed.png
```

## 3. Talking props (still frame first, then make the talking frame in the Editor)

```
{a sad vending machine with a face in its glass display window, a chipped coffee mug with a cheeky face and steam curling up, a gray metal filing cabinet with a face whose top drawer is clamped shut like a mouth, a framed bar chart with a face in its title area}, hand-painted 2D cartoon prop, 1990s children's adventure game style, bold clean outlines, warm saturated colors, plain solid white background, no text --ar 1:1 --sref https://raw.githubusercontent.com/jayarege/humongous-style-game/main/docs/references/margin_market.jpg
```

Save as `vending_oracle_still.png`, `mug_still.png`, `cabinet_still.png` and `exhibit_a_still.png` in `public/art/props/`. For each `_talk.png`, erase the mouth in the Editor and regenerate it "open mid-word".

## 4. Minigame art

**Framework Card** → `public/art/props/framework_card.png`

```
a small glowing collectible card with a simple icon of three boxes connected by arrows, gold border, soft magical sparkle, hand-painted 2D cartoon game item, bold clean outlines, plain solid white background, no text --ar 2:3 --sref https://raw.githubusercontent.com/jayarege/humongous-style-game/main/docs/references/margin_market.jpg
```

**Card album** → `public/art/ui/card_album.png`

```
an open scrapbook album seen from above with nine empty card slots arranged in a three by three grid, worn leather cover, little paper corners on each slot, hand-painted 2D cartoon game interface, bold clean outlines, warm colors, plain solid white background, no text --ar 4:3 --sref https://raw.githubusercontent.com/jayarege/humongous-style-game/main/docs/references/margin_market.jpg
```

**Quiz answer button** → `public/art/ui/quiz_button.png`

```
a blank rounded wooden plaque sign with a brass trim border, wide horizontal shape for text, hand-painted 2D cartoon game interface element, bold clean outlines, plain solid white background, no text --ar 4:1 --sref https://raw.githubusercontent.com/jayarege/humongous-style-game/main/docs/references/margin_market.jpg
```

**Suspect cards** (one prompt, four jobs; works on every plan)

```
a "wanted poster" style playing card with a torn paper edge and a big bold illustration of {a price tag, a stack of cardboard boxes, a pie chart, a coin purse} in the center, empty banner across the bottom, hand-painted 2D cartoon game card, bold clean outlines, warm saturated colors, plain solid white background, no text --ar 2:3 --sref https://raw.githubusercontent.com/jayarege/humongous-style-game/main/docs/references/margin_market.jpg
```

Save as `suspect_price.png`, `suspect_volume.png`, `suspect_mix.png` and `suspect_cost.png` in `public/art/ui/`. The game writes the word on the banner, so leave it blank.

**Clue card** → `public/art/ui/clue_card.png`

```
a blank lined index card pinned with a red thumbtack, slightly curled corner, hand-painted 2D cartoon game interface element, bold clean outlines, plain solid white background, no text --ar 3:2 --sref https://raw.githubusercontent.com/jayarege/humongous-style-game/main/docs/references/margin_market.jpg
```

## 5. Case-loop UI (optional; these can also be drawn in code)

```
{a small brass lantern with a warm glowing flame, the same small brass lantern unlit and dark, a little triangular pennant flag on a pin, a blank cream-colored note card with a tape strip on top}, hand-painted 2D cartoon game interface element, bold clean outlines, warm colors, plain solid white background, no text --ar 1:1 --sref https://raw.githubusercontent.com/jayarege/humongous-style-game/main/docs/references/margin_market.jpg
```

Save as `lantern_lit.png`, `lantern_out.png`, `hypothesis_flag.png` and `bucket_card.png` in `public/art/ui/`. For `subpoint_card.png`, shrink the bucket card.

## Tips

- If a result shows text or letters, add `--no text, letters, words` to the end.
- If a character comes out in a different art style than your existing cast, raise the style reference strength with `--sw 200`.
- If you get a character you love, save it as a reference image. Reusing it keeps their look the same if you ever need extra poses.

## 6. Props that replace the placeholders

These replace the flat code-drawn props in the rooms. Each prompt makes 4 jobs, so it works on every plan. Pick the best of each grid and download it. **Don't cut out the background**: keep the magenta, and Claude (or `npm run art:import`) removes it and sizes the prop.

**Margin Market and Border Docks**

```
{a sad wilted head of lettuce with droopy limp leaves, a tall brass umbrella stand crammed with colorful closed umbrellas, an overstuffed brown travel suitcase covered in travel stickers straining at its latches, a dented green metal watering can with a long spout}, single object, hand-painted 2D cartoon prop, 1990s children's adventure game style, bold clean outlines, warm saturated colors, plain solid flat magenta background, no shadow, no text --ar 1:1 --sref https://raw.githubusercontent.com/jayarege/humongous-style-game/main/docs/references/margin_market.jpg
```

**Runway Row, Auction Hall and the Vault**

```
{an orange and white striped airport windsock on a short pole blowing sideways, a polished wooden auctioneer's gavel resting on its round sound block, an extravagant crystal chandelier with curly gold arms and lit candles, a round steel bank vault door with a big spoked wheel handle}, single object, hand-painted 2D cartoon prop, 1990s children's adventure game style, bold clean outlines, warm saturated colors, plain solid flat magenta background, no shadow, no text --ar 1:1 --sref https://raw.githubusercontent.com/jayarege/humongous-style-game/main/docs/references/margin_market.jpg
```

**The office, Abacus Heights and the Foundry**

```
{a green-shaded brass banker's desk lamp switched on and glowing warmly, a sturdy wooden abacus with red and blue beads, a single shiny red abacus bead, a dented metal factory scrap bin overflowing with bent bolts and broken gears}, single object, hand-painted 2D cartoon prop, 1990s children's adventure game style, bold clean outlines, warm saturated colors, plain solid flat magenta background, no shadow, no text --ar 1:1 --sref https://raw.githubusercontent.com/jayarege/humongous-style-game/main/docs/references/margin_market.jpg
```

**Props with words on them**

```
{a hanging wooden sign on two chains that reads "CUSTOMS", an old split-flap airport board on a stand with a header that reads "DEPARTURES" and rows of yellow letters, a paper seed packet with a sprout drawing and big letters "AI" on the front, a round industrial dial gauge with a red yellow and green arc and the needle pointing at 60 percent and a small label that reads "OEE"}, single object, hand-painted 2D cartoon prop, 1990s children's adventure game style, bold clean outlines, warm saturated colors, plain solid flat magenta background, no shadow --ar 1:1 --sref https://raw.githubusercontent.com/jayarege/humongous-style-game/main/docs/references/margin_market.jpg
```

**The spreadsheet**

```
a ridiculously long printed spreadsheet unrolling off a clipboard in loops, a grid of tiny unreadable numbers, single object, hand-painted 2D cartoon prop, 1990s children's adventure game style, bold clean outlines, warm saturated colors, plain solid flat magenta background, no shadow, no text --ar 1:1 --sref https://raw.githubusercontent.com/jayarege/humongous-style-game/main/docs/references/margin_market.jpg
```

**Second states (in the Editor).** Open your chosen image in the Editor, erase only the part that changes, and use the prompt:

| Start from | Erase | Editor prompt |
| --- | --- | --- |
| Desk lamp | the bulb and the glow | the same desk lamp switched off and dark, no glow |
| Suitcase | the lid and the top half | the suitcase has popped open with clothes spilling out and a tiny silver robot arm waving |
| OEE gauge | the needle | the needle pointing at 70 percent |

## 7. Talking frames for Wren, Gus, Barnaby, Helga and Duke

For each character, open their closed-mouth picture in the Editor (save it from the link in the table at the top, or from `public/characters/<name>/<name>-closed.png`). Erase **only the mouth**, then run:

- `mouth half open, mid-word`
- `mouth wide open, excited`

Download both. You don't need to cut out the background or match the size: the import scales them back and blends in only the mouth, so the rest of the character can't shift. That's 10 Editor runs in total.

## Getting the downloads into the game

Drop the downloaded images into the chat with Claude and say which is which (or just drop them, and Claude will tell them apart). If you're working in Codespaces yourself instead:

```
npm run art:import -- props/gavel gavel.png mouth/wren:half wren-half.png
npm run art:import -- --list
```
