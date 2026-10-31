# Casebound: Framework Adventure Game Script

Oct 30, 2026

## Concept and core loop

Casebound is a text-box adventure where every case is a client you visit, and every framework is a puzzle you assemble out of cards. The player never memorizes a named framework. They build a custom issue tree for the client in front of them, which is exactly what the prep guide says interviewers reward.

**Premise.** Wren Abernathy, a first-week associate at the fictional firm Halvorsen & Pike, falls asleep at 3 a.m. over a stack of casebooks. She wakes up in the Undercase, a night city where every unsolved client problem has become a district. Looming over the skyline is The Blank Page, a giant empty whiteboard everyone in the city is afraid of. To get home, Wren has to crack one case in each district, earn her rank, and finally face The Blank Page.

**Design rules carried over from the research** (structure only, all characters and dialogue are original):

- Randomized paths: every district has three swappable slots with two options each, so each case has 8 versions and replays stay fresh.
- One-trait characters: each client is built around a single comic flaw, and that flaw is the case's trap.
- The hero is the hint system: Wren thinks out loud, and her thoughts escalate from nudge to near-answer.
- No failure states: wrong moves trigger a coaching moment, never a game over.
- Everything clickable talks back, and repeat clicks escalate.
- The final confrontation is solved by empathy, not by defeating anyone.

**The seven-beat case loop.** Every client visit runs the same loop, mapped to the opening routine in the prep guide.

1. **Hear the Prompt.** The client states the problem in character.
2. **Lock the Objective.** Assemble a one-sentence restatement from tiles: a goal verb, a metric, a timeframe. Missing metric or timeframe means you must ask for it.
3. **Spend Lanterns.** You hold 3 Question Lanterns. Six questions are on offer; three earn useful facts, three are questions the structure would answer anyway.
4. **Build the Board.** Pick 3 or 4 bucket cards (phrased as questions) from a deck of about 8, then hang 2 to 4 sub-point cards under each. Decoys include label-only buckets, overlapping buckets, generic sub-points, and off-topic ideas.
5. **Plant the Flag.** Choose which bucket to start in and pick a hypothesis.
6. **Drive the Case.** Two data cards arrive. For each, tag which bucket it updates and choose the "so what."
7. **Close.** Assemble an answer-first recommendation: the call, two reasons with numbers, the top risk, a next step. Then the client asks the Partner's Question, drawn from the bucket you deprioritized, so no branch of your board is ever safe to ignore.

## Cast

Every client is built around one comic trait, and that trait is the trap their case tests.

| Character | Where | Role | The one trait | The trap it teaches |
| --- | --- | --- | --- | --- |
| Wren Abernathy | Everywhere | Hero, first-week associate | Thinks out loud | Her thoughts are the hint system |
| Gus the Easel | Follows Wren | Guide, a talking flip-chart easel | Loves drawing boxes, any boxes | Boxes are not a structure until they answer the question |
| The Blank Page | Skyline | Final encounter | Terrified of being filled with a bad framework | Fear of the blank page is solved by a first good bucket |
| Barnaby Bunch | Margin Market | Grocery chain owner | Blames everything on the weather | Find where the decline is concentrated before naming a cause |
| Dr. Helga Sprocket | The Border Docks | Medical device maker | Already packed her suitcases | A big market is not the same as being able to win it |
| Captain Fen Sterling | Runway Row | Airline pricing chief | Flips a coin for every decision | Price moves need elasticity and competitor response |
| Juniper Sprout | The Greenhouse | SaaS founder | Says yes to every idea | Rank growth options by size, feasibility, fit |
| Duke Mergeworth | The Auction Hall | Conglomerate CEO | Wants to buy anything shiny | Synergies must beat the premium paid |
| Vera Multiple | The Vault | PE partner | Only ever asks "what's the exit?" | Standalone value, no buyer synergies |
| Professor Tally | Abacus Heights | Statistician | Refuses to round anything | Round early, state assumptions, sanity check |
| Foreman Rook | The Foundry | Aerospace fittings plant manager | Wants to cut the biggest cost, always | The biggest bucket is not always the most addressable |

**Clickpoint regulars** (no case, just reactions):

- **The Unspeakable Cabinet**, a filing cabinet that knows a certain four-letter acronym and is forbidden from saying it out loud.
- **Mug**, a coffee mug who rounds every number it hears to one significant figure.
- **The Vending Oracle**, a vending machine that answers every question with "It depends."
- **Exhibit A**, a chart on a wall that keeps asking people to read its title before they read its bars.

## Scoring, coaching and randomization

Each case scores the five things every firm tests, and a wrong move never ends the case: it opens a coaching moment that can still earn points.

**The five gauges** (0 to 5 stars each per case):

| Gauge | What earns it | Where it is scored |
| --- | --- | --- |
| Structure | 3 or 4 buckets, phrased as questions, no overlap, nothing critical missing | Beats 2 and 4 |
| Analytics | Correct math, insight stated before numbers | Beat 6 |
| Judgment | Industry-specific sub-points, sensible hypothesis, right starting bucket | Beats 4 and 5 |
| Communication | Answer-first close, "so what" after every data card | Beats 6 and 7 |
| Presence | Fixing a mistake after one hint, holding a correct position under pushback | Any coaching moment |

**Board scoring rules** for Beat 4:

- +1 Structure per critical bucket placed (each case has 3 or 4 critical buckets).
- -1 Structure for a fifth bucket, an overlapping bucket, or a label-only bucket ("Market" instead of "Is the market attractive?").
- +1 Judgment per industry-specific sub-point; 0 for generic ones ("fixed and variable costs").
- The Delete Test: after the board is built, Gus asks "If we answered every bucket, could we answer the client?" A missing bucket makes him wobble; a pointless bucket makes him shrug.

**Coaching moments.** When the player picks a decoy, the client reacts in character and Wren gets a chance to revise. Revising right away earns 1 Presence star ("coachable"). Pushback on a correct choice is also possible; holding firm with a reason earns Presence too.

**The hint ladder.** Clicking Wren's thought bubble climbs three levels. Each level used costs half a star in that beat.

1. Nudge: Wren restates the client's goal to herself.
2. Pointer: Wren names which bucket or tile is missing, without the answer.
3. Near-answer: Wren says what she would write, phrased as a question to herself.

**Randomization.** Each district has three slots with two options each, giving 8 versions of every case.

| Slot | What it swaps | Why it matters |
| --- | --- | --- |
| Industry | Which industry the client is in | Forces industry-specific sub-points |
| Twist | What the data reveals underneath | Prevents memorizing the answer |
| Data | Which bucket the first exhibit lands in | Forces driving from the board, not a script |

The Partner's Question at the close is always drawn from the bucket the player ranked last, so every bucket on the board has to hold up.

**Ranks.** Total stars across districts unlock titles: Analyst (start), Associate (40 stars), Engagement Manager (100), Partner (160, out of 200 possible across 8 districts).

## Prologue: The Vending Oracle

The prologue teaches all seven beats on a tiny case, so the player learns the loop before the districts randomize it.

**Scene 1: The office, 3 a.m.** Wren's desk, a stack of casebooks, a dying desk lamp.

**WREN:** One more case. Then sleep. Okay. Maybe two more cases.

*The lamp flickers out. The floor tilts. Wren slides through the carpet like it is a playground slide and lands in a pile of crumpled sticky notes.*

**GUS:** Oh good, a person! Hold still, I want to draw a box around you.

**WREN:** Who are you?

**GUS:** Gus. Easel. Professional box enthusiast. Welcome to the Undercase, where problems go when nobody solves them.

**WREN:** How do I get home?

**GUS:** Same way everyone does. Crack a case in every district, then go talk to *that.*

*Gus points a marker at the skyline. The Blank Page hangs there, enormous and white.*

**WREN:** It's just... empty.

**GUS:** Exactly. Terrifying, isn't it? Let's warm up first.

**Scene 2: The lobby.** A vending machine hums sadly.

**VENDING ORACLE:** My snack profits fell 20% this quarter. Why? It depends.

**Beat 2, Lock the Objective.** Tiles appear.

| Tile set | Options | Correct |
| --- | --- | --- |
| Goal | figure out why profit fell and how to fix it / sell more snacks / beat the coffee cart | figure out why profit fell and how to fix it |
| Metric | quarterly profit / happiness / number of buttons | quarterly profit |
| Timeframe | this quarter vs last / forever / ? (ask) | this quarter vs last |

**WREN (on success):** So you want to know why quarterly profit dropped 20% versus last quarter, and what to do about it.

**VENDING ORACLE:** It depends. But yes.

**Beat 3, Spend Lanterns** (3 lanterns).

| Question | Useful? | Answer |
| --- | --- | --- |
| How do you make money: what do you sell, and to whom? | Yes | Chips and soda, mostly to the night cleaning crew. |
| Did prices or anything about the machine change this quarter? | Yes | The landlord raised my electricity rate. |
| Is the drop in revenue, costs, or both? | No | Coaching: "That's what your board is for, friend." |
| What does success look like? | Yes | Back to last quarter's profit within two quarters. |
| What color are you? | No | Coaching: "Beige. Next question." |
| Should I just guess? | No | Coaching: "It depends. Mostly no." |

**Beat 4, Build the Board.** Teaches the profit tree.

| Bucket card | Status |
| --- | --- |
| Did revenue fall: fewer buyers, fewer items each, or lower prices? | Critical |
| Did costs rise: stock, electricity, restocking? | Critical |
| Is it the lobby or just me (is the coffee cart down too)? | Critical |
| Revenue | Decoy, label only. Gus: "That's a word. I need a question." |
| Things | Decoy. Gus: "I love a box, but even I have standards." |

**Beat 5, Plant the Flag.** Correct start: costs, because the Oracle already admitted the electricity rate rose. Hypothesis: "Electricity cost jumped while sales held flat."

**Beat 6, Drive.** Data card: "Sales flat at 400 items. Electricity up from $40 to $120 a month." So what: "Revenue is fine. The whole drop is a cost problem, so the fix is on the cost side."

**Beat 7, Close.**

**WREN:** Profit fell because electricity tripled while sales held flat. Fix it with an energy-saving mode overnight and renegotiate the rate. The risk is the landlord says no, so next step is pricing a 10 cent increase as a backup.

**VENDING ORACLE:** It... does not depend. Thank you.

*Wren receives the Question Lantern, the Objective Compass and the Hypothesis Flag. Gus draws a box around all three, proudly.*

## Region 1: Margin Market (profitability decline)

The most common case type, so it is the first district: the trap is naming a cause before finding where the decline is concentrated.

**Variants**

| Slot | Option A | Option B |
| --- | --- | --- |
| Industry | Regional grocery chain, 60 stores | Chain of 25 urgent care clinics |
| Twist | Client is losing traffic to value competitors (client problem) | Whole market is squeezed by wage inflation (market problem) |
| Data | First exhibit lands in the revenue bucket | First exhibit lands in the client-vs-market bucket |

**Hear the Prompt**

*A market square under a permanent drizzle. Barnaby Bunch holds an umbrella over a wilting head of lettuce.*

**BARNABY:** Profits are down 15% over two years. It's the rain. It's always the rain.

**WREN:** It's been raining for two years?

**BARNABY:** In my heart, yes.

**Lock the Objective.** Correct: "Find why profit fell 15% over two years and recommend how to recover it." Decoy tile "stop the rain" triggers: **BARNABY:** "Finally, someone who gets it." **GUS:** "Wren. No."

**Spend Lanterns**

| Question | Useful? | Answer (A / B) |
| --- | --- | --- |
| How do you make money, and what changed in the business? | Yes | A: groceries, private label growing slowly. B: visits billed to insurers, mostly commercial. |
| Are competitors seeing the same decline? | Yes | A: "The discount chain across the street is thriving." B: "Everyone's complaining about payroll." |
| What does recovery look like, and by when? | Yes | Back to prior margin within 18 months. |
| Is it revenue or cost? | No | "You tell me, you're the consultant." |
| Have you tried an umbrella? | No | "I have eleven." |
| What should I recommend? | No | "Something sunny." |

**Build the Board**

| Bucket card | Status | Sub-point cards to hang (correct) | Decoy sub-points |
| --- | --- | --- | --- |
| Is the decline on the revenue side? | Critical | A: traffic vs basket size, mix of fresh vs center-store vs private label, price gap vs discounters. B: visit volume, payer mix, revenue per visit | "Sales" (label only) |
| Is it on the cost side? | Critical | A: cost of goods and vendor terms, labor hours per store, shrink, distribution. B: clinician wages, staffing agency spend, supplies, rent | "Fixed and variable" (generic) |
| Is it the market or the client? | Critical | Competitor margins, share trend, same-store comparison | "Weather" (Barnaby beams) |
| What levers would fix it? | Critical | A: private label push, promo discipline, SKU cuts, store closures. B: scheduling, agency reduction, payer renegotiation | "Buy more umbrellas" |
| Market | Decoy, label only | | |
| Is the rain bad? | Decoy, off-topic | | |
| Are revenues and sales down? | Decoy, overlaps the revenue bucket | | |

**Plant the Flag.** Best start: "Is it the market or the client?" because it changes everything downstream. Accepted with partial credit: revenue first.

| Hypothesis | Twist A | Twist B |
| --- | --- | --- |
| Traffic is leaking to value competitors | Correct | Coaching moment, pushback |
| Labor costs are squeezing the whole industry | Coaching moment | Correct |
| It's the rain | Barnaby applauds; Gus faints | Same |

**Drive the Case**

- Data A1 (revenue bucket): "Same-store sales down 6%. Transactions down 9%, average basket up 3%." So what: "It's traffic, not basket. Customers are leaving, not buying less."
- Data B1 (market bucket): "Client margin fell 3 points; competitor margins fell 3 points too." So what: "It's industry-wide, so look at the shared cost driver, not execution."
- Math card: "Profit was $40M. It's now $34M. What percent drop?" Answer: 15%.

**Close (model answer, Twist A)**

**WREN:** Profit fell because traffic dropped 9% as shoppers moved to discounters, while basket size held. I'd fight back on value: expand private label and tighten promotions to close the price gap. The risk is a price war we can't afford, so next step is testing price cuts on 50 key items in 5 stores.

**Partner's Question** (drawn from the lowest-ranked bucket, example): "Did you check whether shrink got worse? That would show up as cost, not traffic."

**Hint ladder**

1. "Barnaby wants profit back. Profit has two halves."
2. "I haven't checked if everyone else is hurting too."
3. "Is this the market or just Barnaby? That should be a bucket."

**Clickpoints**

- Lettuce (1) "I'm not wilting, I'm resting." (2) "Okay I'm a little wilted." (3) "Tell Barnaby the shrink numbers. I dare you."
- Umbrella stand (1) "Eleven umbrellas." (2) "Still eleven." (3) "Twelve! No wait, that's a mop."

## Region 2: The Border Docks (market entry)

The trap here is falling in love with a big market: the case is won by asking whether the client can actually win it.

**Variants**

| Slot | Option A | Option B |
| --- | --- | --- |
| Industry | European maker of a surgical robot entering the US | Japanese premium snack brand entering US grocery |
| Twist | Market is attractive but an entrenched incumbent blocks the client | Market is attractive but the obvious path (direct entry) is blocked; partnering wins |
| Data | First exhibit lands in market attractiveness | First exhibit lands in ability to win |

**Hear the Prompt**

*A dock stacked with luggage. Dr. Helga Sprocket sits on a suitcase that will not close.*

**HELGA:** We are entering America. The suitcases are packed. I just need you to agree.

**WREN:** What does success look like?

**HELGA:** Success looks like me, in America, with my suitcases.

**Lock the Objective.** Correct: "Decide whether to enter the US, where success is $100M revenue within three years at a positive margin." If the player skips the metric tile, Helga says "Success is a feeling!" and Wren must spend a Lantern to get the number.

**Spend Lanterns**

| Question | Useful? | Answer (A / B) |
| --- | --- | --- |
| What does success mean in numbers and time? | Yes | $100M revenue in 3 years, positive margin. |
| Who buys, and how do they decide? | Yes | A: hospital capital committees plus surgeons, 12 to 18 month sales cycles. B: grocery buyers who charge slotting fees for shelf space. |
| Any constraints on budget or approvals? | Yes | A: FDA clearance not yet filed. B: $20M launch budget. |
| Is America big? | No | "Very. That's why I packed so much." |
| What's in the suitcases? | No | "Optimism." |
| Should we go? | No | "Yes! Wait, that's your job." |

**Build the Board**

| Bucket card | Status | Correct sub-points (A / B) | Decoy sub-points |
| --- | --- | --- | --- |
| Is the US market attractive? | Critical | A: procedures per year, penetration, reimbursement. B: category size, growth, premium price tier | "It's America" |
| Can the client win? | Critical | A: clinical edge vs incumbent, switching costs, service footprint. B: brand awareness, shelf access, distributor reach | "Our robot is cool" |
| Do the economics work? | Critical | Upfront investment, unit economics, breakeven and payback | "Revenue and costs" (generic) |
| How should they enter, and what could go wrong? | Critical | Direct vs distributor vs partner vs acquire; regulatory delay, pricing pressure | "Pack lighter" |
| Competition | Decoy, label only | | |
| Will Helga be happy? | Decoy, off-topic | | |

**Plant the Flag.** Best start: "Can the client win?" Hypothesis A: "The market is big, but displacing the incumbent is the deciding question." Hypothesis B: "The market is big, but a partner's shelf access beats building our own."

**Drive the Case**

- Data A1: "Incumbent holds 80% of installed systems; hospitals keep systems 7 to 10 years." So what: "Most of the market is locked up for years, so we'd be fighting for new hospitals only."
- Data B1: "Slotting fees run $25k per SKU per chain; a US distributor partner already has 4,000 stores." So what: "Going direct burns the budget on shelf fees. Partnering gets reach on day one."
- Math card: "To hit $100M at $2M per robot including consumables, how many systems?" Answer: 50 systems.

**Close (model answer, Twist A)**

**WREN:** Enter, but not head-on. The market is large, yet 80% of hospitals are locked in for years, so a direct launch can't reach $100M in three years. Target the roughly 20% of hospitals with no robot yet, starting with ambulatory surgery centers. The main risk is FDA timing, so next step is filing for clearance before building a sales force.

**HELGA:** So I unpack... some suitcases?

**WREN:** Three of them.

**Hint ladder**

1. "Big market. But is it big *for her*?"
2. "I haven't asked who's already there."
3. "Can the client actually win? That's its own bucket."

**Clickpoints**

- Overstuffed suitcase (1) "Mmph." (2) "MMPH." (3) *Pops open. A tiny robot arm waves.*
- Customs sign (1) "Declare all frameworks." (2) "Especially the memorized ones."

## Region 3: Runway Row (pricing)

The trap is treating price as a coin flip: the player has to weigh cost floor, competitor reference and customer value, then segment.

**Variants**

| Slot | Option A | Option B |
| --- | --- | --- |
| Industry | Airline raising transcontinental fares 5% | Streaming service raising its monthly plan by $2 |
| Twist | Demand is inelastic in the business segment, so a targeted raise works | The main competitor won't follow, so a flat raise loses share; tiering wins |
| Data | First exhibit lands in demand response | First exhibit lands in competitor response |

**Hear the Prompt**

*A runway lit by blinking lights. Captain Fen Sterling flips a silver coin and catches it without looking.*

**FEN:** Heads, we raise prices 5%. Tails, we raise them anyway. I'd still like a second opinion.

**WREN:** What happens if it lands on its edge?

**FEN:** Then I'd need a consultant. Which is why you're here.

**Lock the Objective.** Correct: "Decide whether a 5% fare increase raises profit on these routes over the next year." Decoy tile "raise revenue" triggers Gus: "Revenue isn't the goal if we lose half the passengers."

**Spend Lanterns**

| Question | Useful? | Answer (A / B) |
| --- | --- | --- |
| Who are the customers, by segment? | Yes | A: 40% business travelers, 60% leisure. B: 70% on the basic plan, 30% premium. |
| How have competitors priced recently? | Yes | A: rivals raised fares last spring and held. B: the main rival just froze prices for a year. |
| How much of the cost changes with volume? | Yes | A: almost none in the short run. B: content costs are fixed; streaming costs are small. |
| Is 5% a lot? | No | "It's a nice round number." |
| Can I flip the coin? | No | "Absolutely not. It's mine." |
| What would you do? | No | *Flips coin.* "Tails." |

**Build the Board**

| Bucket card | Status | Correct sub-points (A / B) | Decoy sub-points |
| --- | --- | --- | --- |
| How will demand respond? | Critical | Elasticity by segment, share of price-sensitive buyers. A: business vs leisure. B: basic vs premium, churn risk | "People like planes" |
| What's the net revenue effect? | Critical | Price up times volume change. A: RASM and load factor. B: subscribers times ARPU | "Revenue goes up" (assumes the answer) |
| What's the cost effect? | Critical | Mostly fixed in the short run; small savings on variable costs | "Fixed and variable" (generic) |
| What are the alternatives and risks? | Critical | A: fare fencing, premium-only increase, ancillaries, fare war. B: new ad tier, annual plan, bundle | "Flip again" |
| Price | Decoy, label only | | |
| Do customers like us? | Decoy, overlaps demand response | | |

**Plant the Flag.** Best start: "How will demand respond?" Hypothesis A: "A raise on business-heavy routes is profitable because demand is inelastic and costs are fixed." Hypothesis B: "A flat raise loses too many basic subscribers if the rival holds; raise premium only."

**Drive the Case**

- Data A1: "Business demand drops 2% for a 5% price increase; leisure drops 10%." So what: "Business travelers barely react, so the raise should be aimed at them."
- Data B1: "When a rival held price last time, our basic plan lost 8% of subscribers in a quarter." So what: "Basic users will switch, so leave basic alone and raise premium."
- Math card: "Revenue is $100M. Price up 5%, volume down 4%. New revenue?" Answer: about $100.8M, roughly up 1%. Wren's line: "Up 5 and down 4 is roughly up 1."

**Close (model answer, Twist A)**

**WREN:** Raise fares, but only where business travelers dominate. Business demand barely moves for a 5% increase and costs are fixed, so that's nearly pure profit. Leisure demand drops 10%, so hold leisure fares. The risk is a competitor undercutting us, so next step is watching their fares for two weeks after launch.

**FEN:** *Pockets the coin.* I'll keep this for emergencies.

**Hint ladder**

1. "Revenue isn't profit. What does Fen actually want?"
2. "I'm treating all passengers like one group."
3. "How does demand respond, by segment? That's my first bucket."

**Clickpoints**

- Windsock (1) "Business is blowing steady." (2) "Leisure is gusty." (3) "I'm just a sock. Why are you asking me?"
- Departure board (1) "DELAYED." (2) "STILL DELAYED." (3) "DELAYED, BUT WITH CONFIDENCE."

## Region 4: The Greenhouse (growth strategy)

The trap is a list of ideas with no ranking: the player must sort options into core, adjacent and new, then size each against the target.

**Variants**

| Slot | Option A | Option B |
| --- | --- | --- |
| Industry | B2B scheduling software company, $50M ARR | Regional coffee chain, 120 cafes |
| Twist | The biggest lever is the core (expansion within existing customers) | The core is saturated; the biggest lever is an adjacent segment or channel |
| Data | First exhibit lands in the core bucket | First exhibit lands in the adjacent bucket |

**Hear the Prompt**

*A glass greenhouse where every pot holds a sprouting idea. Juniper Sprout waters all of them at once.*

**JUNIPER:** We need to double revenue in four years. Should we do AI? Yes. Europe? Yes. Dog food? Probably yes!

**WREN:** You sell scheduling software.

**JUNIPER:** Dogs have schedules!

**Lock the Objective.** Correct: "Find the growth options that double revenue in four years, ranked by size and feasibility." Decoy tile "try everything" triggers Juniper: "Yes! Finally!" and Gus quietly erases it.

**Spend Lanterns**

| Question | Useful? | Answer (A / B) |
| --- | --- | --- |
| Where does growth come from today? | Yes | A: net revenue retention 108%, new logos slowing. B: same-store sales flat, growth only from new cafes. |
| What capabilities and budget do you have? | Yes | A: strong product team, small sales team. B: strong brand, $15M for expansion. |
| What's off the table? | Yes | "Nothing! Okay, the board said no acquisitions this year." |
| Do you like growth? | No | "I LOVE growth." |
| What's your favorite idea? | No | "All of them equally, like children." |
| How big is the universe? | No | Gus: "Out of scope." |

**Build the Board**

| Bucket card | Status | Correct sub-points (A / B) | Decoy sub-points |
| --- | --- | --- | --- |
| How much more can the core deliver? | Critical | A: expansion revenue, pricing and packaging, churn reduction. B: traffic, ticket size, menu and daypart | "Do more" |
| Which adjacent moves are biggest? | Critical | A: new verticals (clinics, field service), mid-market. B: grocery packaged coffee, catering, new metros | "Dog food" (Juniper protests) |
| Are there new businesses worth it? | Critical | A: payments add-on, partnerships. B: franchising, licensing | "AI" alone, no use case |
| How do we rank and fund them? | Critical | Size vs target gap, feasibility, fit with capabilities, time to impact | "Pick the fun ones" |
| Growth | Decoy, label only | | |
| Should we grow? | Decoy, already decided | | |

**Plant the Flag.** Best start depends on the Twist, so the player must ask first. Hypothesis A: "Expansion within current customers closes most of the gap." Hypothesis B: "The core is saturated; grocery packaged coffee is the biggest adjacent lever."

**Drive the Case**

- Data A1: "Customers using 3+ modules expand 25% a year; only 30% of customers use 3+." So what: "Moving customers onto more modules is the biggest lever, and it's cheaper than new logos."
- Data B1: "Packaged coffee in grocery is a $4B regional category; branded share leaders grow 8% a year." So what: "It's large and growing, and it uses our brand, not new cafes."
- Math card: "$50M to $100M in 4 years. Required annual growth?" Answer: about 19%, using the shortcut that doubling in 4 years needs 72 divided by 4, so 18%.

**Close (model answer, Twist A)**

**WREN:** Grow the core first. Customers on three or more modules expand 25% a year, and only 30% are there today, so cross-selling closes about half the gap. Add one adjacent vertical, field service, for the rest. The risk is a small sales team, so next step is hiring customer success managers before expanding into new verticals.

**JUNIPER:** And the dog food?

**WREN:** Year five. Maybe.

**Hint ladder**

1. "Juniper has a lot of ideas and no ranking."
2. "Some ideas are core, some are adjacent, some are brand new."
3. "Which bucket gets us closest to double? That's where to start."

**Clickpoints**

- Watering can (1) "I water everything." (2) "Even the cactus." (3) "Especially the cactus. Nobody asked the cactus."
- Seed packet labeled AI (1) "Plant me!" (2) "Plant me somewhere specific!" (3) "Okay, plant me next to a real customer problem."

## Region 5: The Auction Hall (corporate M&A)

The trap is buying because the target looks good: the deal only works if synergies, net of the cost to get them, beat the premium paid.

**Variants**

| Slot | Option A | Option B |
| --- | --- | --- |
| Industry | Packaged food giant buying a fast-growing snack brand | Industrial parts distributor buying a regional competitor |
| Twist | Synergies fall short of the premium, so walk away or bid lower | Synergies cover the premium, but integration risk is the real issue |
| Data | First exhibit lands in synergies | First exhibit lands in standalone value |

**Hear the Prompt**

*An auction hall full of glittering lots. Duke Mergeworth raises his paddle at a lamp.*

**DUKE:** I've bid on this company. Also the lamp. Also that chandelier. Tell me the company was a good idea.

**WREN:** What's the asking price?

**DUKE:** A 40% premium. But look how it shines!

**Lock the Objective.** Correct: "Decide whether buying the target at a 40% premium creates value for the Duke's shareholders." Decoy tile "win the auction" triggers the auctioneer: "Sold! To the gentleman who didn't check the synergies!"

**Spend Lanterns**

| Question | Useful? | Answer (A / B) |
| --- | --- | --- |
| Why this target, strategically? | Yes | A: access to fast-growing snack aisle. B: fill gaps in our regional network. |
| What's the price, and the target's earnings? | Yes | $1.4B price; standalone value $1.0B. |
| How would we combine them? | Yes | A: shared distribution, sales force. B: shared warehouses, purchasing. |
| Is it shiny? | No | "Extremely." |
| Can we buy the lamp too? | No | "Already did." |
| Who else is bidding? | No | Gus: "Interesting, but your board answers it." |

**Build the Board**

| Bucket card | Status | Correct sub-points (A / B) | Decoy sub-points |
| --- | --- | --- | --- |
| Does the deal make strategic sense? | Critical | Fit with our strategy, alternatives (build, partner) | "It's shiny" |
| What is the target worth on its own? | Critical | Standalone growth, margins, quality of earnings | "Revenue" (label only) |
| What synergies are real, and what do they cost? | Critical | A: revenue synergies via distribution, cost synergies in sales. B: warehouse consolidation, purchasing. Timing and cost to achieve | "Synergies" (no detail) |
| Does price beat value, and can we integrate? | Critical | Premium vs synergy value, financing, culture, key talent retention | "Pay whatever" |
| Should we buy the chandelier? | Decoy, off-topic | | |
| Is the target good and valuable? | Decoy, overlaps standalone value | | |

**Plant the Flag.** Best start: synergies vs premium, because that decides the deal. Hypothesis A: "Synergies won't cover a 40% premium." Hypothesis B: "The math works; integration is the risk."

**Drive the Case**

- Data A1: "Cost synergies $20M a year from year 2; revenue synergies uncertain. Cost to achieve $50M." So what: "Even capitalized, cost synergies alone fall well short of the $400M premium."
- Data B1: "Synergies $60M a year at a 10x multiple; integration of 3 ERP systems planned over 2 years." So what: "Synergies are worth about $600M, so price is fine; the risk is the systems integration."
- Math card: "Price $1.4B, standalone $1.0B. Synergies $20M a year, valued at 10x, minus $50M cost to achieve. Value created?" Answer: $200M minus $50M is $150M, versus a $400M premium, so the Duke destroys $250M.

**Close (model answer, Twist A)**

**WREN:** Don't buy at this price. The premium is $400M, but net synergies are worth about $150M, so the deal destroys roughly $250M of value. If the strategic fit matters, bid no higher than a 15% premium. The risk is losing the target to a rival, so next step is checking whether a distribution partnership gets most of the benefit without buying.

**DUKE:** *Lowers paddle.* And the lamp?

**WREN:** Keep the lamp.

**Hint ladder**

1. "A good company and a good deal aren't the same thing."
2. "I need to compare what we pay above its value to what we gain."
3. "Do synergies, net of cost, beat the 40% premium? That decides it."

**Clickpoints**

- Auctioneer's gavel (1) "Going once." (2) "Going twice." (3) "Going to ask about synergies first, actually."
- Chandelier (1) "Sparkle." (2) "Sparkle, but with negative cash flow."

## Region 6: The Vault (PE due diligence)

The trap is reusing the M&A board: a PE buyer has no synergies, so value comes from standalone growth, margin, multiple and exit.

**Variants**

| Slot | Option A | Option B |
| --- | --- | --- |
| Industry | Chain of 40 physical therapy clinics | Residential HVAC services company, 30 branches |
| Twist | Reimbursement cuts threaten the base case, so price must come down | Strong asset; a buy-and-build plan drives the return |
| Data | First exhibit lands in market attractiveness | First exhibit lands in the value creation plan |

**Hear the Prompt**

*A bank vault with a single desk. Vera Multiple does not look up from her spreadsheet.*

**VERA:** We're looking at buying this company. What's the exit?

**WREN:** We haven't bought it yet.

**VERA:** That's never stopped me from asking.

**Lock the Objective.** Correct: "Decide whether to buy at 10x EBITDA and whether it can return about 2.5x over five years." If the player picks a synergies tile, Vera finally looks up: "Whose synergies? We're a fund."

**Spend Lanterns**

| Question | Useful? | Answer (A / B) |
| --- | --- | --- |
| What return does the fund need, over what hold? | Yes | 2.5x MOIC over 5 years. |
| What's the price and current EBITDA? | Yes | $20M EBITDA at 10x, so $200M. |
| What does the management plan assume? | Yes | A: 5 new clinics a year, flat reimbursement. B: 4 tuck-in acquisitions a year at 5x. |
| What's the exit? | No | Vera, delighted: "Finally, someone asks." Then Gus: "That's a bucket, not a question." |
| Do you ever look up? | No | "Once. In 2019." |
| Should we buy it? | No | "What's the exit?" |

**Build the Board**

| Bucket card | Status | Correct sub-points (A / B) | Decoy sub-points |
| --- | --- | --- | --- |
| Is the market attractive? | Critical | A: aging population, outpatient shift, Medicare fee schedule, fragmentation. B: replacement cycles, weather exposure, fragmented local players | "Big market" |
| Is this a good asset? | Critical | A: same-clinic growth, therapist retention, referral sources. B: technician retention, service agreement mix, branch margins. Quality of earnings | "Nice offices" |
| What's the value creation plan? | Critical | Organic growth, buy-and-build at lower multiples, margin levers | "Synergies with our other companies" (wrong frame) |
| What's it worth, and what could go wrong? | Critical | Entry vs exit multiple, leverage, MOIC and IRR in base and downside, buyer universe | "Hope" |
| Exit | Decoy, label only | | |
| Do we like healthcare? | Decoy, off-topic | | |

**Plant the Flag.** Best start A: market attractiveness, because a reimbursement cut changes every number. Best start B: value creation plan. Hypothesis A: "The plan assumes flat rates; a cut makes 10x too expensive." Hypothesis B: "Buying tuck-ins at 5x and exiting at 10x creates most of the return."

**Drive the Case**

- Data A1: "Proposed Medicare cut of 3% a year; Medicare is 40% of revenue." So what: "Revenue growth slows sharply, so the exit EBITDA in the plan is too high."
- Data B1: "Tuck-ins available at 5x; platforms trade at 10 to 12x." So what: "Every tuck-in is worth twice what we pay once it joins the platform."
- Math card: "Buy at $200M with $100M equity. Exit at $350M, debt paid down to $50M. MOIC?" Answer: $300M equity divided by $100M is 3.0x, about 25% IRR over five years.

**Close (model answer, Twist A)**

**WREN:** Don't pay 10x. With 40% of revenue from Medicare and a proposed 3% annual cut, the downside case returns about 1.7x, well under the 2.5x target. At 8x the deal still works in the downside. Next step is diligence on payer contracts, starting with commercial rate renewals.

**VERA:** *Looks up.* And the exit?

**WREN:** A larger platform, at about 10x. If we buy at 8.

**VERA:** *Looks back down, satisfied.*

**Hint ladder**

1. "Vera isn't a company. She doesn't have synergies."
2. "Where does a fund's return come from?"
3. "Growth, margin, multiple, debt paydown. That's my value creation bucket."

**Clickpoints**

- Vault door (1) "Clunk." (2) "Clunk, but leveraged." (3) "Five years, then I open."
- Spreadsheet (1) "Tab 1: Assumptions." (2) "Tab 47: Assumptions_FINAL_v2." (3) "Tab 48: Please don't scroll down."

## Region 7: Abacus Heights (market sizing)

The trap is precision: the player wins by picking top-down or bottom-up, rounding early, stating assumptions out loud and sanity-checking the answer.

In this district the Board is an estimation tree instead of buckets: the player picks an approach card, then chains driver cards from the top down.

**Variants**

| Slot | Option A | Option B |
| --- | --- | --- |
| Industry | US annual market for electric toothbrush replacement heads (top-down from households) | US annual hospital spend on surgical gloves (bottom-up from hospitals) |
| Twist | One driver card is a sneaky double count | One driver card uses the wrong unit (per day vs per year) |
| Data | Sanity check against a known retail figure | Sanity check against a supplier's revenue |

**Hear the Prompt**

*A tower of stacked abacuses. Professor Tally slides beads with tremendous care.*

**TALLY:** How large is the US market for toothbrush heads? I need it to the dollar. I have been counting since Tuesday.

**WREN:** Which Tuesday?

**TALLY:** A Tuesday in 2019.

**MUG** *(from a nearby shelf)*: Call it 2020.

**Lock the Objective.** Correct: "Estimate US annual spend on replacement heads, within a reasonable range, in under 5 minutes." Tile "to the dollar" triggers Tally's joy and Gus's despair.

**Spend Lanterns**

| Question | Useful? | Answer |
| --- | --- | --- |
| Annual spend in dollars, or units? | Yes | Dollars per year. |
| US only, consumer only? | Yes | US consumers only, no dentists. |
| Just replacement heads, not the handles? | Yes | Heads only. |
| Can I use exact census data? | No | Tally weeps with joy. Gus: "We round here." |
| How many beads are on the abacus? | No | "4,812. No, 4,813." |
| What's the answer? | No | "I'll tell you in 2031." |

**Build the Tree (Option A, top-down)**

| Driver card | Status | Value to state out loud |
| --- | --- | --- |
| US households | Correct | About 130M |
| Share with an electric toothbrush user | Correct | About 40% |
| Electric users per household | Correct | About 2 |
| Heads per user per year | Correct | 4 (dentists say every 3 months; call it 3 in practice) |
| Price per head | Correct | About $5 |
| US population times households | Decoy, double count. Gus: "We already have people inside the households." | |
| Brushings per day | Decoy, wrong unit level | |

**Option B, bottom-up** chains: about 6,000 US hospitals, surgeries per hospital per year, pairs of gloves per surgery (team of 4, changes included, about 10 pairs), price per pair.

**Plant the Flag.** Here the flag is the approach choice. Top-down fits A because households are a clean starting number; bottom-up fits B because hospitals are countable units. Picking the other approach earns a coaching moment, not a penalty, if Wren explains why.

**Drive the Case**

- Math card A: 130M times 40% is about 50M households; times 2 users is 100M users; times 3 heads is 300M heads; times $5 is about $1.5B.
- Data A1, sanity check: "Electric toothbrush category retail sales, all products, about $3B." So what: "Heads at roughly half the category is plausible, since heads are the recurring purchase."
- Twist line, unit trap (B): a card reads "gloves per surgery per day." Wren: "Per day? A surgery isn't a day. Use per surgery."

**Close (model answer, Option A)**

**WREN:** Roughly $1.5 billion a year. That's 50 million households with an electric brush, two users each, three heads a year at $5. It's about half of the $3 billion category, which makes sense for the recurring product. The biggest swing is replacement frequency, so I'd check that first.

**TALLY:** *Holds a single bead.* One point five. It feels... wonderful.

**Hint ladder**

1. "Tally wants precision. The interviewer wants a method."
2. "Start from a number I know, then filter down."
3. "Households, then share, then users, then frequency, then price."

**Clickpoints**

- Mug (1) "Round it." (2) "Round it more." (3) "Everything is about 1 if you believe in yourself."
- Abacus (1) "Clack." (2) "Clack clack." (3) "Please, I'm begging you, use estimates."

## Region 8: The Foundry (operations and cost reduction)

The trap is cutting the biggest cost bucket: the player must find the most addressable bucket and apply the right lever (volume, rate, productivity, structure).

**Variants**

| Slot | Option A | Option B |
| --- | --- | --- |
| Industry | Aerospace fluid fittings plant | Regional parcel distribution center |
| Twist | Materials are the biggest cost but locked under long-term contracts; scrap and yield are the real lever | Labor is the biggest cost and is addressable through scheduling |
| Data | First exhibit is the cost stack | First exhibit is a process step (yield or throughput) |

**Hear the Prompt**

*A foundry floor glowing orange. Foreman Rook taps a clipboard with a wrench.*

**ROOK:** Corporate wants 10% out of plant cost in 12 months. Materials are 50% of cost. So we cut materials. Done. Lunch?

**WREN:** Can we cut materials?

**ROOK:** ...Define "cut."

**Lock the Objective.** Correct: "Find 10% of plant cost to remove within 12 months without hurting quality or on-time delivery." A tile without the quality constraint triggers a falling-wrench sound and Rook: "Customers audit us. Quality stays."

**Spend Lanterns**

| Question | Useful? | Answer (A / B) |
| --- | --- | --- |
| What does the cost stack look like? | Yes | A: materials 50%, labor 25%, overhead 15%, scrap and rework 10%. B: labor 55%, transport 25%, facility 20%. |
| What can't change? | Yes | A: titanium and alloy prices locked by contract through next year; quality qualifications fixed. B: delivery promises fixed. |
| What's measured today? | Yes | A: scrap rate, OEE around 60%. B: packages per labor hour, overtime hours. |
| Is cost bad? | No | "Generally." |
| What's for lunch? | No | "Sandwiches. Cut in half. Efficient." |
| Can we just close the plant? | No | Rook stares. Gus: "Let's go back to the board." |

**Build the Board**

| Bucket card | Status | Correct sub-points (A / B) | Decoy sub-points |
| --- | --- | --- | --- |
| Where is the cost, and how much is addressable? | Critical | Cost stack by bucket, share locked by contract or regulation | "Costs" (label only) |
| Can we use less (volume)? | Critical | A: scrap and rework, yield, material utilization. B: re-handling, empty miles | "Use less stuff" |
| Can we pay less (rate) or do it faster (productivity)? | Critical | A: OEE, changeover time, overtime. B: shift scheduling, overtime, route density | "Work harder" |
| Should we change the structure? | Critical | Make vs buy, consolidate lines or shifts, nearshore, automation payback | "Fire everyone" (Rook drops his wrench) |
| Is materials the biggest cost? | Decoy, already answered | | |
| Are costs high and expensive? | Decoy, overlaps | | |

**Plant the Flag.** Best start: "Where is the cost, and how much is addressable?" Hypothesis A: "Materials are locked, so the 10% comes from scrap, yield and OEE." Hypothesis B: "Overtime from poor scheduling is the biggest addressable bucket."

**Drive the Case**

- Data A1: "Cost $100M. Materials $50M, locked. Scrap and rework $10M, scrap rate 8% vs 3% best-in-class." So what: "Half the cost can't move this year, so 10% of total means 20% of what's addressable."
- Data B1: "Overtime is 18% of labor hours; volume peaks are predictable on Mondays." So what: "Overtime is a scheduling problem, so shift staffing to Mondays."
- Math card A: "Cutting scrap from 8% to 4% saves half of $10M. Raising OEE from 60% to 70% cuts labor and overhead per unit about 14%. Savings?" Answer: $5M plus roughly 14% of $40M, about $5.6M, total about $10.6M, just over the 10% target.

**Close (model answer, Twist A)**

**WREN:** We can hit 10% without touching materials. Materials are half the cost but locked by contract, so the savings come from cutting scrap from 8% to 4%, worth $5M, and lifting OEE from 60% to 70%, worth about $5.6M. The risk is disrupting qualified processes, so next step is a scrap root-cause study on the top three part families.

**ROOK:** So... not materials.

**WREN:** Not this year.

**ROOK:** *Puts the wrench down gently.* Lunch, then.

**Hint ladder**

1. "Biggest isn't the same as movable."
2. "How much of each bucket can actually change in 12 months?"
3. "Find the addressable base first, then pick levers: volume, rate, productivity, structure."

**Clickpoints**

- Scrap bin (1) "Clang." (2) "Clang, clang." (3) "Every clang is a dollar, by the way."
- OEE gauge (1) "60%." (2) "Still 60%." (3) "I could be 70% if someone fixed changeovers. Just saying."

## Finale: The Two Doors and The Blank Page

The finale tests both interview formats, then ends with a case nobody has seen before, solved by building the first bucket together rather than defeating anyone.

**Scene 1: The Two Doors.** *Unlocked after all 8 districts. Two doors stand at the base of the skyline.*

| Door | Format | How it plays | What it tests |
| --- | --- | --- | --- |
| The Guided Door | Interviewer-led | The door asks five fixed questions in order: structure, a brainstorm, an exhibit, a math problem, a synthesis. Wren cannot steer. | Depth on each piece; structuring a brainstorm before speaking |
| The Open Door | Candidate-led | The door says only the prompt, then waits. Wren must ask for data and drive from her board. | Driving the case, prioritizing, asking for the right data |

Each door draws a random district case at a new Industry option not seen before (for example, a hospital, a telecom carrier, a utility, a chemical maker), so tailoring is tested on unfamiliar ground.

**THE GUIDED DOOR:** What factors would you consider?

**WREN:** Let me give you two groups, then three ideas in each.

**THE GUIDED DOOR:** *Creaks approvingly.* Nobody structures a brainstorm.

**THE OPEN DOOR:** ...

**WREN:** May I see data on margins by segment?

**THE OPEN DOOR:** *Swings open one inch.* Better.

**Scene 2: The Blank Page.** *The top of the skyline. The Blank Page fills the whole screen, white and trembling.*

**THE BLANK PAGE:** Don't come closer. Everyone who comes up here writes a framework on me. Profit equals revenue minus cost. Market, competition, customers. The same boxes, over and over. Then they leave, and I'm full of boxes that don't answer anything.

**WREN:** That's why you're blank?

**THE BLANK PAGE:** I erase myself. It's safer than being wrong.

**GUS:** *Quietly.* I've drawn a lot of wrong boxes too.

**WREN:** What if we don't start with boxes? What if we start with the question?

**THE BLANK PAGE:** I don't have one.

**WREN:** Then tell me what's bothering you, in one sentence. That's always the first step.

*The final case is a non-standard prompt drawn from a pool (examples: "A city wants to cut ER wait times in half"; "A museum's attendance fell after it went free"; "A water utility must cut emissions 30% by 2030"). No bucket deck is offered. The player must choose a scaffold card first:*

| Scaffold card | Fits prompts like |
| --- | --- |
| Objective, options, criteria | Any decision with several paths |
| Stakeholders or value chain walk | Public sector, healthcare, multi-party problems |
| Drivers tree | A single metric to move (wait time, emissions, attendance) |

Then the player writes 3 buckets as questions from a free word bank. The Blank Page scores itself: each good bucket makes it glow a little; a recited, generic bucket makes it flinch.

**THE BLANK PAGE** *(after the first good bucket)*: Oh. That one fits me.

**THE BLANK PAGE** *(after the third)*: I'm not blank anymore. And I'm not just boxes, either.

**WREN:** You're a structure.

**THE BLANK PAGE:** Will you come back?

**WREN:** Every time I get a new case.

**Ending.** *The page glows white and gold. Wren wakes at her desk at 6 a.m. The casebook is open to a blank sheet. She writes one line, the objective, and smiles.*

**Rank screen.** Shows the five gauges across all districts, the weakest gauge, and a suggested replay district for it (for example, low Communication suggests Runway Row, where answer-first closes are hardest).

## Minigames

Three optional minigames turn the most common side games in classic kids' adventure games (a quiz show, a hidden-collectible hunt and a whodunit) into case practice. None of them can fail you, and none blocks the main path.

| Minigame | Host | Where | Unlocks | Practices |
| --- | --- | --- | --- | --- |
| Case Quiz | The Guided Door and The Open Door | Base of the skyline, open after 4 districts, replayable | Stars and the "Game Show Champion" title | Opening routine, board rules, case math |
| Framework Card hunt | Gus, who keeps the album | One hidden card in the lobby and in each district (9 total) | All 9 unlock a bonus ending | Remembering one rule per case type |
| Driver Detective | Exhibit A, the talking wall chart | Every district, after its case is closed | Analytics stars | Finding where a change is concentrated |

### 1. Case Quiz (quiz show)

The two doors at the base of the skyline run a game show. It opens after 4 districts as a mid-game break, so the doors are familiar before the finale. Each round draws 4 questions from the pool below, one or two per category. A wrong answer gets an explanation and one retry for half credit.

**Opening**

**THE GUIDED DOOR:** Welcome to Case Quiz, the only game show where the prize is a better first sentence.

**THE OPEN DOOR:** I'm the co-host. I don't get a script.

**THE GUIDED DOOR:** You never wanted one.

**THE OPEN DOOR:** Pick a category. Any category. I'll wait. I'm good at waiting.

**Reactions** (rotate)

- Correct, Guided Door: "Correct. In exactly the order I expected."
- Correct, Open Door: "Correct, and you got there yourself."
- Wrong, Guided Door: "Not quite." *Then reads the explanation from the table.*
- Wrong, Open Door: "Close. Want another swing?"

**Sign-off**

**THE GUIDED DOOR:** That's the round.

**THE OPEN DOOR:** Come back anytime. The door's open.

**THE GUIDED DOOR:** *Sighs.* He's been waiting all night to say that.

**Question pool**

| Category | Question | Options | Answer | Explanation |
| --- | --- | --- | --- | --- |
| Openings | What two things should your restated objective always include? | A metric and a timeframe / A framework name and a hypothesis / The client's name and industry | A metric and a timeframe | Without them you can't tell when you've answered the question. |
| Openings | Which clarifying question wastes a lantern? | How does the client make money? / How does the client define success? / Is the problem revenue or cost? | Is the problem revenue or cost? | Your board answers that one. Ask what the board can't. |
| Openings | After presenting your structure, what's the step people skip most? | Asking for data / Prioritizing and stating a hypothesis / Restating the prompt | Prioritizing and stating a hypothesis | Say where you'd start and what you expect to find. |
| Openings | How long should you take to write your structure? | 10 seconds / 60 to 90 seconds / 5 minutes | 60 to 90 seconds | Long enough to think, short enough to keep the room. |
| Boards | Which of these is a label, not a bucket? | "Is the market attractive?" / "Market" / "Can the client win?" | "Market" | Buckets are questions, so each one ties back to the objective. |
| Boards | How many top-level buckets is right? | Two / Three or four / Six or more | Three or four | Two feels thin; five or more is hard to hold in anyone's head. |
| Boards | Best sub-points for an airline's cost bucket? | Fixed and variable / Fuel, labor, aircraft ownership / Things that cost money | Fuel, labor, aircraft ownership | Industry-specific beats generic every time. |
| Boards | Which bucket doesn't belong on a private equity board? | Value creation plan / Synergies with the buyer / Exit | Synergies with the buyer | A fund owns no other business to combine with. |
| Numbers | Price up 10%, volume down 5%. Revenue changes by about? | Up 5% / Up 4.5% / Down 5% | Up 4.5% | 1.10 times 0.95 is 1.045. |
| Numbers | Doubling in 4 years needs about what yearly growth? | 10% / 18% / 25% | 18% | Rule of 72: 72 divided by 4. |
| Numbers | Profit falls from $40M to $34M. What percent drop? | 6% / 15% / 18% | 15% | $6M lost out of the starting $40M. |
| Numbers | 2.5 times your money in 5 years is about what yearly return? | 10% / 20% / 35% | 20% | 1.2 to the fifth power is about 2.5. |

**Scoring.** 1 star per first-try answer, half a star on a retry. A perfect 12 across rounds adds "Game Show Champion" to the rank screen.

### 2. Framework Card hunt (collectibles)

Nine Framework Cards are hidden around the Undercase: one in the prologue lobby and one in each district. Each card sits in one of two spots, picked by the variant seed, so replays move them. Clicking a card sends it to Gus's album, and he reads it out.

| Location | Hiding spot A | Hiding spot B | Card text |
| --- | --- | --- | --- |
| Prologue lobby | In the vending machine's tray | Behind the potted palm | Restate the goal with a metric and a timeframe. |
| Margin Market | Under the lettuce | In the umbrella stand | Find where the change is concentrated before you name a cause. |
| The Border Docks | Inside the suitcase | Behind the customs sign | A big market isn't a winnable one. Ask who's already there. |
| Runway Row | Tucked in the windsock | Stuck to the departure board | Segment before you set a price. |
| The Greenhouse | In the watering can | Inside the AI seed packet | Sort ideas into core, adjacent and new, then rank them. |
| The Auction Hall | Under the gavel | Hanging from the chandelier | A deal works only if net synergies beat the premium. |
| The Vault | Between spreadsheet pages | Behind the vault door | A fund has no synergies: growth, margin, multiple, debt. |
| Abacus Heights | On the abacus | Next to the single bead | Round early and say your assumptions out loud. |
| The Foundry | In the scrap bin | Behind the OEE gauge | Biggest isn't the same as addressable. Find what can move. |

**Gus lines**

- First card: "Ooh, a card! Hold still, I'm putting a box around it."
- Cards 2 to 8: "Another one for the album." *Then reads the card.*
- Ninth card: "A full album. Nine boxes. My best work."

**Reward.** With all nine, the finale gains a short bonus scene. After the last bucket, The Blank Page asks to see the album and keeps the first card: "So I always remember how to start." The 6 a.m. ending then shows the album open on Wren's desk.

### 3. Driver Detective (whodunit)

Once a district's case is closed, Exhibit A, a chart on the wall, offers a quick mystery. Three clue cards appear, one of them a red herring, plus four suspect cards: **Price**, **Volume**, **Mix** and **Cost**. You accuse a suspect, then pick the clue that proves it. The right suspect with the right clue earns an Analytics star; the right suspect with the wrong clue earns half a star and an explanation.

**EXHIBIT A:** Something moved my numbers. Read my title first. Then my axes. Then tell me who did it.

- Correct: "Case closed. And you read my title. Nobody reads my title."
- Wrong suspect: "Interesting theory. Look at clue two again."
- Herring picked as proof: "Right suspect, wrong evidence. That clue would be true either way."

**Puzzle pool** (each district draws one)

| Mystery | Clue 1 | Clue 2 | Clue 3 | Culprit | Proof |
| --- | --- | --- | --- | --- | --- |
| A bakery's revenue fell 10% | Loaves sold held flat at 2,000 a week | Average price per loaf fell from $5.00 to $4.50 | A new bakery opened two blocks away | Price | Clue 2 |
| A gym's revenue fell 12% | Monthly fee stayed at $50 | Members fell from 1,000 to 880 | The lobby was repainted | Volume | Clue 2 |
| A coffee cart's profit fell 20% on flat revenue | Cups sold and prices both unchanged | Milk cost per cup doubled, from $0.40 to $0.80 | The barista changed the playlist | Cost | Clue 2 |
| A bookstore's revenue fell 8% | Books sold held flat, and no title changed price | Hardcovers ($30) fell from half of sales to 30%, replaced by paperbacks ($20) | Store hours didn't change | Mix | Clue 2 |

Shuffle the clue order on screen so the proof isn't always in the same slot. Add new mysteries to the pool in the same format.

### Minigame flags

| Flag | Set when | Used for |
| --- | --- | --- |
| `quiz_unlocked` | 4 districts cleared | Opens Case Quiz at the base of the skyline |
| `quiz_best_score` | A quiz round ends | Rank screen title at 12 |
| `card_spot_seed` | New game starts | Picks spot A or B for each card |
| `cards_found[]` | A card is clicked | Album count; bonus finale scene at 9 |
| `detective_solved[district]` | Driver Detective solved | Analytics stars; hides the chart's prompt afterward |

## Art checklist

Every image the game still needs, with a filename that matches the repo. Backgrounds are done: all 13 are in `public/art/rooms` at 1920x1080. Portraits use the same three mouth frames as the characters already in `public/characters` (closed, half open, wide open), on a transparent background, about 768 pixels tall.

**Portraits** (3 frames each)

| Role | Folder | Description to generate | Existing character that could fill it |
| --- | --- | --- | --- |
| Wren, the hero | `public/characters/wren/` | First-week associate, rumpled blazer, sleepy but determined, carrying a notepad | |
| Gus the Easel | `public/characters/gus/` | A flip-chart easel with a face drawn on the top sheet and a marker in one stubby hand | |
| The Blank Page | `public/characters/blank_page/` | A huge, nervous floating whiteboard; extra frames: dim, half-glowing, fully glowing gold | |
| Barnaby Bunch | `public/characters/barnaby/` | Grocer in an apron holding an umbrella over a head of lettuce | |
| Dr. Helga Sprocket | `public/characters/helga/` | Engineer in a lab coat sitting on a bulging suitcase | |
| Captain Fen Sterling | `public/characters/fen/` | Airline captain flipping a silver coin | Tug |
| Juniper Sprout | `public/characters/juniper/` | Cheerful founder holding a watering can | Fizz |
| Duke Mergeworth | `public/characters/duke/` | Pompous collector in a velvet coat, bidding paddle raised | |
| Vera Multiple | `public/characters/vera/` | Unflappable investor, glasses, eyes on a spreadsheet | Okafor |
| Professor Tally | `public/characters/tally/` | Fussy professor holding a single abacus bead | Quill |
| Foreman Rook | `public/characters/rook/` | Plant foreman in a hard hat tapping a clipboard with a wrench | Moss |

If you use the five existing characters as suggested, only Wren, Gus, The Blank Page, Barnaby, Helga and the Duke are new: 6 characters, about 20 images including The Blank Page's glow frames.

**Talking props** (2 frames each: still and talking, transparent PNG)

| Prop | File | Description |
| --- | --- | --- |
| Vending Oracle | `public/art/props/vending_oracle_still.png`, `vending_oracle_talk.png` | Sad vending machine with a face in the display window |
| Mug | `public/art/props/mug_still.png`, `mug_talk.png` | Chipped coffee mug with a face, steam curling up |
| The Unspeakable Cabinet | `public/art/props/cabinet_still.png`, `cabinet_talk.png` | Filing cabinet with a drawer for a mouth, clamped shut in the still frame |
| Exhibit A | `public/art/props/exhibit_a_still.png`, `exhibit_a_talk.png` | Bar chart in a frame with a face in the title area; needed for Driver Detective |

**Minigame art**

| Item | File | Description |
| --- | --- | --- |
| Framework Card | `public/art/props/framework_card.png` | Small glowing card with a box-and-arrows icon, readable at 64 pixels |
| Card album | `public/art/ui/card_album.png` | Open scrapbook with 9 empty card slots in a 3x3 grid |
| Quiz answer button | `public/art/ui/quiz_button.png` | Rounded wooden plaque that text can sit on |
| Suspect cards | `public/art/ui/suspect_price.png`, `suspect_volume.png`, `suspect_mix.png`, `suspect_cost.png` | Four "wanted poster" cards: a price tag, a stack of boxes, a pie chart and a coin purse |
| Clue card | `public/art/ui/clue_card.png` | Blank index card that clue text sits on |

**Case-loop UI** (can be plain styled panels in code instead of art)

| Item | File | Description |
| --- | --- | --- |
| Question Lantern | `public/art/ui/lantern_lit.png`, `lantern_out.png` | Small lantern, lit and spent |
| Hypothesis Flag | `public/art/ui/hypothesis_flag.png` | Little pennant on a pin, for planting on a bucket |
| Bucket card | `public/art/ui/bucket_card.png` | Blank card for bucket text |
| Sub-point card | `public/art/ui/subpoint_card.png` | Smaller blank card |
| Thought bubble | already in the repo as `public/art/ui/bubble.png` | Used for the hint ladder |

## Implementation notes

Every district shares one data shape, so the script above can be loaded as content files and the engine only needs one case loop.

**Case file schema** (one file per district):

```yaml
id: margin_market
case_type: profitability
client: { name: Barnaby Bunch, trait: blames_weather }
variants:
  industry: [grocery_chain, urgent_care]
  twist: [client_problem, market_problem]
  data: [revenue_first, market_first]
beats:
  objective:
    tiles: { goal: [...], metric: [...], timeframe: [...] }
    correct: { goal: 0, metric: 0, timeframe: 0 }
  lanterns:
    max: 3
    questions:
      - text: "Are competitors seeing the same decline?"
        useful: true
        answer: { grocery_chain: "...", urgent_care: "..." }
  board:
    buckets:
      - text: "Is it the market or the client?"
        status: critical
        subpoints_correct: { grocery_chain: [...], urgent_care: [...] }
        subpoints_decoy: ["Weather"]
      - text: "Market"
        status: decoy_label
        coach_line: "That's a word. I need a question."
  flag:
    best_start: market_or_client
    hypotheses: { client_problem: 0, market_problem: 1 }
  data_cards: [...]
  math_cards: [...]
  close:
    slots: [recommendation, reason_1, reason_2, risk, next_step]
  partner_question: from_lowest_ranked_bucket
hints: ["nudge", "pointer", "near_answer"]
clickpoints:
  - object: lettuce
    lines: ["...", "...", "..."]
    after_last: repeat_last
```

**State flags**

| Flag | Set when | Used for |
| --- | --- | --- |
| `variant_seed` | District entered | Picks industry, twist, data options (8 combos) |
| `bucket_rank[]` | Flag planted and buckets ordered | Drawing the Partner's Question from the lowest-ranked bucket |
| `hints_used[beat]` | Thought bubble clicked | Half-star deduction per level |
| `coached[beat]` | Decoy picked, then fixed | Presence star if fixed on the next try |
| `seen_variants[district]` | Case closed | Replay prefers unseen combos first |
| `district_cleared[]` | Close completed | Unlocks the Two Doors after 8 |
| `click_count[object]` | Clickpoint clicked | Escalating line index |

**Variant selection rule.** On first visit, use Option A for all three slots so the first play is the cleanest version. On replay, draw randomly from combos not yet seen.

**Clickpoint library rule.** Every object gets 2 to 4 lines. Line 1 is plain, line 2 is the same joke escalated, the last line either breaks the fourth wall or slips in a real case tip. After the last line, repeat it.

**Text-box notes.** All dialogue is written for text boxes with no voice, short enough to fit two lines. Stage directions in italics are animation cues (a character action or a mouth-frame change), not displayed text.

**Art already in the repo.**

| Scene | Background file |
| --- | --- |
| Prologue Scene 1, the office (and the 6 a.m. ending) | `public/art/rooms/office_desk.webp` |
| Prologue Scene 1, the sticky-note landing | `public/art/rooms/sticky_note_landing.webp` |
| Prologue Scene 2, the lobby | `public/art/rooms/hotel_lobby.webp` |
| Region 1, Margin Market | `public/art/rooms/margin_market.webp` |
| Region 2, The Border Docks | `public/art/rooms/border_docks.webp` |
| Region 3, Runway Row | `public/art/rooms/runway_row.webp` |
| Region 4, The Greenhouse | `public/art/rooms/greenhouse.webp` |
| Region 5, The Auction Hall | `public/art/rooms/auction_hall.webp` |
| Region 6, The Vault | `public/art/rooms/vault.webp` |
| Region 7, Abacus Heights | `public/art/rooms/abacus_heights.webp` |
| Region 8, The Foundry | `public/art/rooms/foundry.webp` |
| Finale Scene 1, the Two Doors | `public/art/rooms/skyline_base.webp` |
| Finale Scene 2, The Blank Page | `public/art/rooms/skyline_top.webp` |

Every scene now has a background. Clickable props are in `public/art/props`. Still needed: portraits for the clients, Gus, Wren and The Blank Page.

**Content to add next**, in order of interview frequency: new product launch, competitive response, and make vs buy, each using the same schema.
