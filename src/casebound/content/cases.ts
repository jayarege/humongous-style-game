import type { CaseData } from "../types";

/**
 * Every case, written from docs/casebound-case-framework-script.md (Option A of each district).
 * Option B variants, sub-point cards and the second data card are not in this dry run yet.
 */

const prologue: CaseData = {
    id: "lobby",
    host: "oracle",
    title: "The Vending Oracle",
    caseType: "Warm-up",
    prompt: [["oracle", "My snack profits fell 20% this quarter. Why? It depends."]],
    tutorial: {
        objective: [
            ["gus", "Step one: lock the objective. A goal, a metric and a timeframe, one tile at a time."],
            ["gus", "If you ever get stuck, click Hint. Your own brain helps, but it costs half a star."],
        ],
        lanterns: [["gus", "You get three Question Lanterns. Spend them on things your board can't answer by itself."]],
        board: [["gus", "Now the board. Pick three or four buckets, and every bucket has to be a question."]],
        flag: [["gus", "Plant your flag: where do you start, and what do you expect to find?"]],
        drive: [["gus", "Data's coming. Don't just read it. Tell me the so what."]],
        close: [["gus", "Close it out: answer first, then your reasons, the risk and a next step."]],
    },
    objective: [
        {
            label: "Goal",
            options: [
                { text: "figure out why profit fell and how to fix it", ok: true },
                { text: "sell more snacks", reply: [["gus", "Maybe. But that's a fix, not the question."]] },
                { text: "beat the coffee cart", reply: [["oracle", "I do not want to fight the coffee cart."]] },
            ],
        },
        {
            label: "Metric",
            options: [
                { text: "quarterly profit", ok: true },
                { text: "happiness", reply: [["gus", "Lovely, but you can't measure it in snacks."]] },
                { text: "number of buttons", reply: [["oracle", "I have 24. It has not changed."]] },
            ],
        },
        {
            label: "Timeframe",
            options: [
                { text: "this quarter vs last", ok: true },
                { text: "forever", reply: [["gus", "Forever is a long time for a vending machine."]] },
                { text: "since the dawn of snacks", reply: [["oracle", "That depends."]] },
            ],
        },
    ],
    restate: [
        ["wren", "So you want to know why quarterly profit dropped 20% versus last quarter, and what to do about it."],
        ["oracle", "It depends. But yes."],
    ],
    lanterns: [
        { q: "How do you make money: what do you sell, and to whom?", useful: true, reply: [["oracle", "Chips and soda, mostly to the night cleaning crew."]] },
        { q: "Did prices or anything about the machine change this quarter?", useful: true, reply: [["oracle", "The landlord raised my electricity rate."]] },
        { q: "Is the drop in revenue, costs, or both?", useful: false, reply: [["gus", "That's what your board is for, friend."]] },
        { q: "What does success look like?", useful: true, reply: [["oracle", "Back to last quarter's profit within two quarters."]] },
        { q: "What color are you?", useful: false, reply: [["oracle", "Beige. Next question."]] },
        { q: "Should I just guess?", useful: false, reply: [["oracle", "It depends. Mostly no."]] },
    ],
    board: {
        title: "Build the Board",
        instruction: "Pick 3 or 4 buckets. Each one should be a question.",
        min: 3,
        max: 4,
        buckets: [
            { text: "Did revenue fall: fewer buyers, fewer items each, or lower prices?", critical: true },
            { text: "Did costs rise: stock, electricity, restocking?", critical: true },
            { text: "Is it the lobby or just me (is the coffee cart down too)?", critical: true },
            { text: "Revenue", critical: false, coach: [["gus", "That's a word. I need a question."]] },
            { text: "Things", critical: false, coach: [["gus", "I love a box, but even I have standards."]] },
        ],
    },
    start: {
        question: "Which bucket do you start with?",
        options: [
            { text: "Costs: the Oracle already said the electricity rate went up", ok: true },
            { text: "Revenue: always start with revenue", partial: true, reply: [["gus", "Not bad, but the Oracle already handed you a cost clue."]] },
            { text: "The coffee cart", partial: true, reply: [["gus", "Worth checking, but it's not where the clue points."]] },
        ],
    },
    hypothesis: {
        question: "What's your hypothesis?",
        options: [
            { text: "Electricity cost jumped while sales held flat", ok: true },
            { text: "Nobody likes the snacks anymore", reply: [["oracle", "The night crew loves my snacks."]] },
            { text: "The prices are too low", reply: [["gus", "Nothing in the clues points at price."]] },
        ],
    },
    data: {
        card: "Sales flat at 400 items. Electricity up from $40 to $120 a month.",
        options: [
            { text: "Revenue is fine. The whole drop is a cost problem, so the fix is on the cost side.", ok: true },
            { text: "Sales are flat, so the fix is to sell more snacks.", reply: [["gus", "Flat sales didn't cause the drop. Look at what moved."]] },
            { text: "Electricity is a small bill, so ignore it.", reply: [["gus", "It tripled. That's not small anymore."]] },
        ],
    },
    math: {
        q: "Electricity went from $40 to $120 a month. How much more does the Oracle pay each month?",
        options: [{ text: "$60" }, { text: "$80", ok: true }, { text: "$120" }],
    },
    close: {
        options: [
            {
                text: "Profit fell because electricity tripled while sales held flat. Use an overnight energy-saving mode and renegotiate the rate. If the landlord says no, price a 10 cent increase as a backup.",
                ok: true,
            },
            { text: "There are many factors, like revenue and costs, and I'd want a lot more data before saying anything.", reply: [["gus", "Answer first! Say what's going on, then why."]] },
            { text: "Raise every snack price by 50% right away.", reply: [["oracle", "The night crew would riot. It depends, but no."]] },
        ],
        after: [
            ["oracle", "It... does not depend. Thank you."],
            ["narrator", "You earned the Question Lanterns, the Objective tiles and the Hypothesis Flag."],
            ["gus", "And I'm drawing a box around all three. Proudly."],
        ],
    },
    partner: [["gus", "One more thing a partner would ask: did restocking costs change too? Always check the whole cost side."]],
    hints: [
        "The Oracle wants profit back. Profit has two halves: revenue and cost.",
        "The Oracle already told me something changed on the cost side.",
        "Costs, then: the electricity rate went up. That's where I'd start.",
    ],
};

const marginMarket: CaseData = {
    id: "margin_market",
    host: "barnaby",
    title: "Margin Market",
    caseType: "Profitability",
    prompt: [
        ["barnaby", "Profits are down 15% over two years. It's the rain. It's always the rain."],
        ["wren", "It's been raining for two years?"],
        ["barnaby", "In my heart, yes."],
    ],
    objective: [
        {
            label: "Goal",
            options: [
                { text: "find why profit fell and how to recover it", ok: true },
                { text: "stop the rain", reply: [["barnaby", "Finally, someone who gets it."], ["gus", "Wren. No."]] },
                { text: "open more stores", reply: [["gus", "That's an answer before we know the question."]] },
            ],
        },
        {
            label: "Metric",
            options: [
                { text: "profit, down 15%", ok: true },
                { text: "number of umbrellas", reply: [["barnaby", "Eleven. It's not helping."]] },
                { text: "customer smiles", reply: [["gus", "Hard to put smiles in a spreadsheet."]] },
            ],
        },
        {
            label: "Timeframe",
            options: [
                { text: "down over two years; recover within 18 months", ok: true },
                { text: "until it stops raining", reply: [["barnaby", "So, never."]] },
                { text: "by this afternoon", reply: [["gus", "Ambitious. Unrealistic, but ambitious."]] },
            ],
        },
    ],
    restate: [
        ["wren", "So you want to know why profit fell 15% over two years, and how to recover it within 18 months."],
        ["barnaby", "That does sound better than 'it's the rain.'"],
    ],
    lanterns: [
        { q: "How do you make money, and what changed in the business?", useful: true, reply: [["barnaby", "Groceries. Private label is growing slowly. Not much else changed."]] },
        { q: "Are competitors seeing the same decline?", useful: true, reply: [["barnaby", "The discount chain across the street is thriving. Rain and all."]] },
        { q: "What does recovery look like, and by when?", useful: true, reply: [["barnaby", "Back to our old margin within 18 months."]] },
        { q: "Is it revenue or cost?", useful: false, reply: [["barnaby", "You tell me. You're the consultant."]] },
        { q: "Have you tried an umbrella?", useful: false, reply: [["barnaby", "I have eleven."]] },
        { q: "What should I recommend?", useful: false, reply: [["barnaby", "Something sunny."]] },
    ],
    board: {
        title: "Build the Board",
        instruction: "Pick 3 or 4 buckets. Each one should be a question.",
        min: 3,
        max: 4,
        buckets: [
            { text: "Is the decline on the revenue side? (traffic, basket size, price gap vs discounters)", critical: true },
            { text: "Is it on the cost side? (cost of goods, labor, shrink, distribution)", critical: true },
            { text: "Is it the market or the client? (are competitors down too?)", critical: true },
            { text: "What levers would fix it? (private label, promos, store closures)", critical: true },
            { text: "Market", critical: false, coach: [["gus", "That's a word, not a question."]] },
            { text: "Is the rain bad?", critical: false, coach: [["barnaby", "YES."], ["gus", "It's not a bucket, Barnaby."]] },
            { text: "Are revenues and sales down?", critical: false, coach: [["gus", "That overlaps your revenue bucket. Keep the buckets separate."]] },
        ],
    },
    start: {
        question: "Which bucket do you start with?",
        options: [
            { text: "Is it the market or the client?", ok: true },
            { text: "Is the decline on the revenue side?", partial: true, reply: [["gus", "Fine start. But whether it's the market or Barnaby changes everything downstream."]] },
            { text: "What levers would fix it?", reply: [["gus", "Fixes come after we know what's broken."]] },
        ],
    },
    hypothesis: {
        question: "What's your hypothesis?",
        options: [
            { text: "Traffic is leaking to value competitors", ok: true },
            { text: "Labor costs are squeezing the whole industry", reply: [["barnaby", "The discount chain across the street looks pretty unsqueezed to me."]] },
            { text: "It's the rain", reply: [["barnaby", "Bravo!"], ["narrator", "Gus faints. Then gets back up."], ["gus", "Try again."]] },
        ],
    },
    data: {
        card: "Same-store sales down 6%. Transactions down 9%. Average basket up 3%.",
        options: [
            { text: "It's traffic, not basket. Customers are leaving, not buying less.", ok: true },
            { text: "Baskets are bigger, so business is great.", reply: [["gus", "Bigger baskets, but a lot fewer of them."]] },
            { text: "Sales fell 6%, so raise prices to make it up.", reply: [["gus", "Raising prices could push even more shoppers across the street."]] },
        ],
    },
    math: {
        q: "Profit was $40M. It's now $34M. What percent drop is that?",
        options: [{ text: "6%" }, { text: "15%", ok: true }, { text: "18%" }],
    },
    close: {
        options: [
            {
                text: "Profit fell because traffic dropped 9% as shoppers moved to discounters, while baskets held. Fight back on value: expand private label and tighten promotions. The risk is a price war, so test price cuts on 50 key items in 5 stores first.",
                ok: true,
            },
            { text: "There are lots of factors here: revenue, costs, competitors and the weather. We should study all of them.", reply: [["gus", "Answer first. What's actually going on?"]] },
            { text: "The rain is hurting traffic, so invest in covered parking.", reply: [["barnaby", "Finally!"], ["gus", "The data says discounters, not drizzle."]] },
        ],
        after: [["barnaby", "So it's not the rain?"], ["wren", "It's the store across the street."], ["barnaby", "Huh. *Closes umbrella.* Sunny, actually."]],
    },
    partner: [["barnaby", "Wait. Did you check whether shrink got worse? That would show up as cost, not traffic."], ["wren", "Good catch. That's on my cost bucket. I'd check it next."]],
    hints: [
        "Barnaby wants profit back. Profit has two halves.",
        "I haven't checked if everyone else is hurting too.",
        "Is this the market or just Barnaby? That should be a bucket.",
    ],
};

const borderDocks: CaseData = {
    id: "border_docks",
    host: "helga",
    title: "The Border Docks",
    caseType: "Market entry",
    prompt: [
        ["helga", "We are entering America. The suitcases are packed. I just need you to agree."],
        ["wren", "What does success look like?"],
        ["helga", "Success looks like me, in America, with my suitcases."],
    ],
    objective: [
        {
            label: "Goal",
            options: [
                { text: "decide whether to enter the US", ok: true },
                { text: "pack more suitcases", reply: [["helga", "There is no more room. I checked."]] },
                { text: "beat every competitor", reply: [["gus", "Every one? Let's start with whether to go at all."]] },
            ],
        },
        {
            label: "Metric",
            options: [
                {
                    text: "? (ask Helga for a number)",
                    ok: true,
                    costsLantern: true,
                    reply: [["helga", "Fine. $100M in revenue within three years, at a positive margin."], ["narrator", "That cost one Question Lantern."]],
                },
                { text: "a feeling of success", reply: [["helga", "Success is a feeling!"], ["gus", "Not a measurable one."]] },
                { text: "number of suitcases", reply: [["helga", "Eleven. Twelve with the robot."]] },
            ],
        },
        {
            label: "Timeframe",
            options: [
                { text: "within three years", ok: true },
                { text: "by next Tuesday", reply: [["helga", "The boat is slow."]] },
                { text: "whenever the suitcases close", reply: [["gus", "So, never."]] },
            ],
        },
    ],
    restate: [
        ["wren", "So you want to decide whether to enter the US, where success is $100M in revenue within three years at a positive margin."],
        ["helga", "Yes. And with suitcases."],
    ],
    lanterns: [
        { q: "Who buys, and how do they decide?", useful: true, reply: [["helga", "Hospital capital committees, plus surgeons. Sales take 12 to 18 months."]] },
        { q: "Any constraints on budget or approvals?", useful: true, reply: [["helga", "We have not filed for FDA clearance yet."]] },
        { q: "Who's already there, and how strong are they?", useful: true, reply: [["helga", "One big incumbent. Everyone knows their robot."]] },
        { q: "Is America big?", useful: false, reply: [["helga", "Very. That's why I packed so much."]] },
        { q: "What's in the suitcases?", useful: false, reply: [["helga", "Optimism."]] },
        { q: "Should we go?", useful: false, reply: [["helga", "Yes! Wait, that's your job."]] },
    ],
    board: {
        title: "Build the Board",
        instruction: "Pick 3 or 4 buckets. Each one should be a question.",
        min: 3,
        max: 4,
        buckets: [
            { text: "Is the US market attractive? (procedures, penetration, reimbursement)", critical: true },
            { text: "Can the client win? (edge vs the incumbent, switching costs, service)", critical: true },
            { text: "Do the economics work? (investment, unit economics, payback)", critical: true },
            { text: "How should they enter, and what could go wrong?", critical: true },
            { text: "Competition", critical: false, coach: [["gus", "A label. Turn it into a question."]] },
            { text: "Will Helga be happy?", critical: false, coach: [["helga", "Very."], ["gus", "Not a bucket."]] },
        ],
    },
    start: {
        question: "Which bucket do you start with?",
        options: [
            { text: "Can the client win?", ok: true },
            { text: "Is the US market attractive?", partial: true, reply: [["gus", "Fair, but everyone already agrees it's big. The open question is whether Helga can win it."]] },
            { text: "How should they enter?", reply: [["gus", "How comes after whether."]] },
        ],
    },
    hypothesis: {
        question: "What's your hypothesis?",
        options: [
            { text: "The market is big, but displacing the incumbent is the deciding question", ok: true },
            { text: "The market is too small to bother", reply: [["helga", "Too small? It is America!"]] },
            { text: "Pack lighter and it will work out", reply: [["gus", "Cute. Not a hypothesis."]] },
        ],
    },
    data: {
        card: "The incumbent holds 80% of installed systems. Hospitals keep a system 7 to 10 years.",
        options: [
            { text: "Most of the market is locked up for years, so we'd be fighting for new hospitals only.", ok: true },
            { text: "80% is taken, so 20% is plenty. Go big.", reply: [["gus", "Is 20% enough to hit $100M in three years? Check before cheering."]] },
            { text: "Hospitals love robots, so demand is guaranteed.", reply: [["gus", "They love the robot they already have."]] },
        ],
    },
    math: {
        q: "To hit $100M a year at $2M per robot (including consumables), how many systems?",
        options: [{ text: "20" }, { text: "50", ok: true }, { text: "200" }],
    },
    close: {
        options: [
            {
                text: "Enter, but not head-on. 80% of hospitals are locked in for years, so a direct launch can't reach $100M in three years. Target the hospitals with no robot yet, starting with surgery centers. The risk is FDA timing, so file for clearance before building a sales force.",
                ok: true,
            },
            { text: "America is huge, so go everywhere at once with a big sales force.", reply: [["gus", "Big market, but can she win it? The data says not head-on."]] },
            { text: "It depends on a lot of things we'd have to research more.", reply: [["gus", "Answer first, Wren."]] },
        ],
        after: [["helga", "So I unpack... some suitcases?"], ["wren", "Three of them."]],
    },
    partner: [["helga", "And if a partner already sells into those hospitals?"], ["wren", "Then partnering could beat building our own sales force. That's my entry bucket."]],
    hints: ["Big market. But is it big for her?", "I haven't asked who's already there.", "Can the client actually win? That's its own bucket."],
};

const runwayRow: CaseData = {
    id: "runway_row",
    host: "tug",
    title: "Runway Row",
    caseType: "Pricing",
    prompt: [
        ["tug", "Heads, we raise prices 5%. Tails, we raise them anyway. I'd still like a second opinion."],
        ["wren", "What happens if the coin lands on its edge?"],
        ["tug", "Then I'd need a consultant. Which is why you're here."],
    ],
    objective: [
        {
            label: "Goal",
            options: [
                { text: "decide whether a 5% fare increase raises profit", ok: true },
                { text: "raise revenue", reply: [["gus", "Revenue isn't the goal if we lose half the passengers."]] },
                { text: "flip the coin again", reply: [["tug", "Tempting."]] },
            ],
        },
        {
            label: "Metric",
            options: [
                { text: "profit on these routes", ok: true },
                { text: "number of tickets sold", reply: [["gus", "Selling more cheap tickets isn't the point."]] },
                { text: "coin flips won", reply: [["tug", "I'm undefeated, for the record."]] },
            ],
        },
        {
            label: "Timeframe",
            options: [
                { text: "over the next year", ok: true },
                { text: "today only", reply: [["tug", "Prices don't work like that. Probably."]] },
                { text: "until the coin lands on its edge", reply: [["gus", "That could be a while."]] },
            ],
        },
    ],
    restate: [
        ["wren", "So you want to know whether a 5% fare increase raises profit on these routes over the next year."],
        ["tug", "Put that way, it sounds less like a coin flip."],
    ],
    lanterns: [
        { q: "Who are the customers, by segment?", useful: true, reply: [["tug", "40% business travelers, 60% leisure."]] },
        { q: "How have competitors priced recently?", useful: true, reply: [["tug", "Rivals raised fares last spring and held them."]] },
        { q: "How much of the cost changes with volume?", useful: true, reply: [["tug", "Almost none in the short run. The planes fly either way."]] },
        { q: "Is 5% a lot?", useful: false, reply: [["tug", "It's a nice round number."]] },
        { q: "Can I flip the coin?", useful: false, reply: [["tug", "Absolutely not. It's mine."]] },
        { q: "What would you do?", useful: false, reply: [["narrator", "Tug flips the coin."], ["tug", "Tails."]] },
    ],
    board: {
        title: "Build the Board",
        instruction: "Pick 3 or 4 buckets. Each one should be a question.",
        min: 3,
        max: 4,
        buckets: [
            { text: "How will demand respond? (business vs leisure, price-sensitive share)", critical: true },
            { text: "What's the net revenue effect? (price up times volume change)", critical: true },
            { text: "What's the cost effect? (mostly fixed in the short run)", critical: true },
            { text: "What are the alternatives and risks? (fare rules, premium-only, fare war)", critical: true },
            { text: "Price", critical: false, coach: [["gus", "That's a label. What's the question?"]] },
            { text: "Do customers like us?", critical: false, coach: [["gus", "That overlaps how demand responds."]] },
        ],
    },
    start: {
        question: "Which bucket do you start with?",
        options: [
            { text: "How will demand respond?", ok: true },
            { text: "What's the cost effect?", partial: true, reply: [["gus", "Costs barely move here, so they won't decide it."]] },
            { text: "What are the alternatives?", reply: [["gus", "First see whether the plain raise works."]] },
        ],
    },
    hypothesis: {
        question: "What's your hypothesis?",
        options: [
            { text: "A raise on business-heavy routes is profitable: demand is inelastic and costs are fixed", ok: true },
            { text: "Any price increase will lose money", reply: [["tug", "Rivals raised fares last spring and they're fine."]] },
            { text: "Heads", reply: [["tug", "Ooh, I like you."], ["gus", "No coin flips. A real hypothesis."]] },
        ],
    },
    data: {
        card: "Business demand drops 2% for a 5% price increase. Leisure demand drops 10%.",
        options: [
            { text: "Business travelers barely react, so aim the raise at them.", ok: true },
            { text: "Demand drops either way, so don't raise anything.", reply: [["gus", "A 2% drop for a 5% raise still makes money."]] },
            { text: "Raise leisure fares most, since there are more leisure travelers.", reply: [["gus", "Leisure travelers react the most. Wrong group to squeeze."]] },
        ],
    },
    math: {
        q: "Revenue is $100M. Price goes up 5% and volume goes down 4%. New revenue is about:",
        options: [{ text: "$99M" }, { text: "$101M", ok: true }, { text: "$105M" }],
    },
    close: {
        options: [
            {
                text: "Raise fares, but only where business travelers dominate. Business demand barely moves for 5% and costs are fixed, so that's nearly pure profit. Hold leisure fares, since leisure demand drops 10%. The risk is a rival undercutting us, so watch their fares for two weeks after launch.",
                ok: true,
            },
            { text: "Raise all fares 5%. Revenue goes up.", reply: [["gus", "Leisure demand drops 10%. Segment it."]] },
            { text: "We should consider many angles on price before deciding.", reply: [["gus", "Answer first!"]] },
        ],
        after: [["narrator", "Tug pockets the coin."], ["tug", "I'll keep this for emergencies."]],
    },
    partner: [["tug", "What if a competitor doesn't follow?"], ["wren", "Then we watch business bookings closely and pull back if share drops. That's my risk bucket."]],
    hints: ["Revenue isn't profit. What does Tug actually want?", "I'm treating all passengers like one group.", "How does demand respond, by segment? That's my first bucket."],
};

const greenhouse: CaseData = {
    id: "greenhouse",
    host: "quill",
    title: "The Greenhouse",
    caseType: "Growth strategy",
    prompt: [
        ["quill", "We need to double revenue in four years. Should we do AI? Yes. Europe? Yes. Dog food? Probably yes!"],
        ["wren", "You sell scheduling software."],
        ["quill", "Dogs have schedules!"],
    ],
    objective: [
        {
            label: "Goal",
            options: [
                { text: "find the growth options that double revenue, ranked by size and feasibility", ok: true },
                { text: "try everything", reply: [["quill", "Yes! Finally!"], ["narrator", "Gus quietly erases it."]] },
                { text: "do AI", reply: [["gus", "AI for what, though?"]] },
            ],
        },
        {
            label: "Metric",
            options: [
                { text: "revenue, from $50M to $100M", ok: true },
                { text: "number of ideas", reply: [["quill", "So many!"], ["gus", "Ideas aren't revenue."]] },
                { text: "number of pots", reply: [["quill", "Also many!"]] },
            ],
        },
        {
            label: "Timeframe",
            options: [
                { text: "within four years", ok: true },
                { text: "this weekend", reply: [["quill", "Ooh, a stretch goal."]] },
                { text: "eventually", reply: [["gus", "Eventually isn't a plan."]] },
            ],
        },
    ],
    restate: [
        ["wren", "So you want the growth options that take revenue from $50M to $100M within four years, ranked by size and feasibility."],
        ["quill", "Ranked? I love all my ideas equally."],
    ],
    lanterns: [
        { q: "Where does growth come from today?", useful: true, reply: [["quill", "Existing customers grow 8% a year. New customers are slowing down."]] },
        { q: "What capabilities and budget do you have?", useful: true, reply: [["quill", "A strong product team. A small sales team."]] },
        { q: "What's off the table?", useful: true, reply: [["quill", "Nothing! Okay, the board said no acquisitions this year."]] },
        { q: "Do you like growth?", useful: false, reply: [["quill", "I LOVE growth."]] },
        { q: "What's your favorite idea?", useful: false, reply: [["quill", "All of them equally, like children."]] },
        { q: "How big is the universe?", useful: false, reply: [["gus", "Out of scope."]] },
    ],
    board: {
        title: "Build the Board",
        instruction: "Pick 3 or 4 buckets. Each one should be a question.",
        min: 3,
        max: 4,
        buckets: [
            { text: "How much more can the core deliver? (expansion, pricing, churn)", critical: true },
            { text: "Which adjacent moves are biggest? (new verticals, mid-market)", critical: true },
            { text: "Are there new businesses worth it? (payments add-on, partnerships)", critical: true },
            { text: "How do we rank and fund them? (size, feasibility, fit, time)", critical: true },
            { text: "Growth", critical: false, coach: [["gus", "A label. Make it a question."]] },
            { text: "Should we grow?", critical: false, coach: [["quill", "YES."], ["gus", "Already decided. Not a bucket."]] },
        ],
    },
    start: {
        question: "Which bucket do you start with?",
        options: [
            { text: "How much more can the core deliver?", ok: true },
            { text: "Which adjacent moves are biggest?", partial: true, reply: [["gus", "Fair, but existing customers are growing. Check the core first."]] },
            { text: "Are there new businesses worth it?", reply: [["gus", "The farthest-out bucket is a risky place to start."]] },
        ],
    },
    hypothesis: {
        question: "What's your hypothesis?",
        options: [
            { text: "Expansion within current customers closes most of the gap", ok: true },
            { text: "Dog food is the biggest lever", reply: [["quill", "I knew it!"], ["gus", "You did not know it."]] },
            { text: "AI will double revenue by itself", reply: [["gus", "AI for which customer problem?"]] },
        ],
    },
    data: {
        card: "Customers using 3+ modules expand 25% a year. Only 30% of customers use 3+ modules.",
        options: [
            { text: "Moving customers onto more modules is the biggest lever, and it's cheaper than new customers.", ok: true },
            { text: "Only 30% use 3+ modules, so the product isn't working.", reply: [["gus", "The ones who do use it grow fast. That's room to grow."]] },
            { text: "Ignore the modules and focus on Europe.", reply: [["quill", "Europe!"], ["gus", "The data points at the core."]] },
        ],
    },
    math: {
        q: "$50M to $100M in 4 years. About what yearly growth does that need?",
        options: [{ text: "About 10%" }, { text: "About 19%", ok: true }, { text: "About 25%" }],
    },
    close: {
        options: [
            {
                text: "Grow the core first. Customers on three or more modules expand 25% a year and only 30% are there, so cross-selling closes about half the gap. Add one adjacent vertical for the rest. The risk is a small sales team, so hire customer success managers first.",
                ok: true,
            },
            { text: "Do all the ideas at once: AI, Europe and dog food.", reply: [["quill", "Yes!"], ["gus", "No. Rank them."]] },
            { text: "Growth has many drivers, and we'd need to look at each one.", reply: [["gus", "Answer first, please."]] },
        ],
        after: [["quill", "And the dog food?"], ["wren", "Year five. Maybe."]],
    },
    partner: [["quill", "What if customers don't want more modules?"], ["wren", "Then the adjacent vertical carries more of the load. That's why it's on the board."]],
    hints: ["Quill has a lot of ideas and no ranking.", "Some ideas are core, some are adjacent, some are brand new.", "Which bucket gets us closest to double? That's where to start."],
};

const auctionHall: CaseData = {
    id: "auction_hall",
    host: "duke",
    title: "The Auction Hall",
    caseType: "Corporate M&A",
    prompt: [
        ["duke", "I've bid on this company. Also the lamp. Also that chandelier. Tell me the company was a good idea."],
        ["wren", "What's the asking price?"],
        ["duke", "A 40% premium. But look how it shines!"],
    ],
    objective: [
        {
            label: "Goal",
            options: [
                { text: "decide whether buying the target creates value", ok: true },
                { text: "win the auction", reply: [["auctioneer", "Sold! To the gentleman who didn't check the synergies!"], ["gus", "Let's not."]] },
                { text: "buy the lamp", reply: [["duke", "Already did."]] },
            ],
        },
        {
            label: "Metric",
            options: [
                { text: "value for the Duke's shareholders", ok: true },
                { text: "how shiny it is", reply: [["duke", "Very."], ["gus", "Shine isn't value."]] },
                { text: "number of paddles raised", reply: [["duke", "I raised mine first!"]] },
            ],
        },
        {
            label: "Terms",
            options: [
                { text: "at today's price: a 40% premium", ok: true },
                { text: "at any price", reply: [["gus", "Price is the whole question."]] },
                { text: "after the chandelier", reply: [["duke", "The chandelier is separate."]] },
            ],
        },
    ],
    restate: [
        ["wren", "So you want to decide whether buying the target at a 40% premium creates value for your shareholders."],
        ["duke", "When you say it like that, it sounds like homework."],
    ],
    lanterns: [
        { q: "Why this target, strategically?", useful: true, reply: [["duke", "It gets us into the fast-growing snack aisle."]] },
        { q: "What's the price, and what's it worth on its own?", useful: true, reply: [["duke", "$1.4B price. On its own, it's worth about $1.0B."]] },
        { q: "How would we combine them?", useful: true, reply: [["duke", "Shared distribution and one sales force."]] },
        { q: "Is it shiny?", useful: false, reply: [["duke", "Extremely."]] },
        { q: "Can we buy the lamp too?", useful: false, reply: [["duke", "Already did."]] },
        { q: "Who else is bidding?", useful: false, reply: [["gus", "Interesting, but your board answers that."]] },
    ],
    board: {
        title: "Build the Board",
        instruction: "Pick 3 or 4 buckets. Each one should be a question.",
        min: 3,
        max: 4,
        buckets: [
            { text: "Does the deal make strategic sense? (fit, alternatives)", critical: true },
            { text: "What is the target worth on its own?", critical: true },
            { text: "What synergies are real, and what do they cost?", critical: true },
            { text: "Does price beat value, and can we integrate?", critical: true },
            { text: "Should we buy the chandelier?", critical: false, coach: [["duke", "Yes."], ["gus", "Off-topic."]] },
            { text: "Is the target good and valuable?", critical: false, coach: [["gus", "That overlaps 'worth on its own.'"]] },
        ],
    },
    start: {
        question: "Which bucket do you start with?",
        options: [
            { text: "What synergies are real, and what do they cost?", ok: true },
            { text: "Does the deal make strategic sense?", partial: true, reply: [["gus", "Fine, but the premium is the sticking point. Synergies decide it."]] },
            { text: "Should we buy the chandelier?", reply: [["duke", "Obviously."], ["gus", "Not a real bucket."]] },
        ],
    },
    hypothesis: {
        question: "What's your hypothesis?",
        options: [
            { text: "Synergies won't cover a 40% premium", ok: true },
            { text: "Any company this shiny is worth buying", reply: [["duke", "Exactly!"], ["gus", "A good company isn't automatically a good deal."]] },
            { text: "The premium doesn't matter if we're big", reply: [["gus", "The premium is the whole question."]] },
        ],
    },
    data: {
        card: "Cost synergies: $20M a year from year 2. Revenue synergies uncertain. Cost to achieve: $50M.",
        options: [
            { text: "Even valued at 10x, cost synergies fall well short of the $400M premium.", ok: true },
            { text: "$20M a year is a lot, so buy it.", reply: [["gus", "Compare it to the premium first."]] },
            { text: "Revenue synergies will cover the gap.", reply: [["gus", "The card says they're uncertain. Don't bet on them."]] },
        ],
    },
    math: {
        q: "Price $1.4B, worth $1.0B on its own. Synergies $20M a year at 10x, minus $50M to achieve. Value created vs the premium?",
        options: [{ text: "Creates about $150M" }, { text: "Destroys about $250M", ok: true }, { text: "Breaks even" }],
    },
    close: {
        options: [
            {
                text: "Don't buy at this price. The premium is $400M, but net synergies are worth about $150M, so the deal destroys roughly $250M. If the strategic fit matters, bid no more than a 15% premium. The risk is losing the target to a rival, so check whether a distribution partnership gets most of the benefit.",
                ok: true,
            },
            { text: "Buy it. It's a great company.", reply: [["duke", "Hooray!"], ["gus", "Great company, bad price."]] },
            { text: "Mergers are complex and we'd need to analyze many things.", reply: [["gus", "Answer first!"]] },
        ],
        after: [["narrator", "The Duke lowers his paddle."], ["duke", "And the lamp?"], ["wren", "Keep the lamp."]],
    },
    partner: [["duke", "What if a rival buys it instead?"], ["wren", "Then a distribution partnership might get most of the benefit. That's in my strategy bucket."]],
    hints: ["A good company and a good deal aren't the same thing.", "I need to compare what we pay above its value to what we gain.", "Do synergies, net of cost, beat the 40% premium? That decides it."],
};

const vault: CaseData = {
    id: "vault",
    host: "okafor",
    title: "The Vault",
    caseType: "PE due diligence",
    prompt: [
        ["okafor", "We're looking at buying this company. What's the exit?"],
        ["wren", "We haven't bought it yet."],
        ["okafor", "That's never stopped me from asking."],
    ],
    objective: [
        {
            label: "Goal",
            options: [
                { text: "decide whether the fund should buy at 10x EBITDA", ok: true },
                { text: "find synergies", reply: [["narrator", "Okafor finally looks up."], ["okafor", "Whose synergies? We're a fund."]] },
                { text: "plan the exit party", reply: [["okafor", "...Tempting. No."]] },
            ],
        },
        {
            label: "Metric",
            options: [
                { text: "about 2.5x the fund's money", ok: true },
                { text: "synergies captured", reply: [["okafor", "Still a fund. Still no synergies."]] },
                { text: "number of spreadsheet tabs", reply: [["okafor", "48. Don't scroll down."]] },
            ],
        },
        {
            label: "Timeframe",
            options: [
                { text: "over a five-year hold", ok: true },
                { text: "overnight", reply: [["okafor", "That's not private equity. That's a lottery."]] },
                { text: "forever", reply: [["okafor", "Forever has no exit."]] },
            ],
        },
    ],
    restate: [
        ["wren", "So the fund wants to know whether to buy at 10x EBITDA, and whether it can return about 2.5x over five years."],
        ["okafor", "And the exit. Always the exit."],
    ],
    lanterns: [
        { q: "What's the price and current EBITDA?", useful: true, reply: [["okafor", "$20M EBITDA at 10x. So $200M."]] },
        { q: "What does the management plan assume?", useful: true, reply: [["okafor", "Five new clinics a year. Flat reimbursement."]] },
        { q: "Where does revenue come from?", useful: true, reply: [["okafor", "Physical therapy visits. About 40% are paid by Medicare."]] },
        { q: "What's the exit?", useful: false, reply: [["okafor", "Finally, someone asks."], ["gus", "That's a bucket, not a question."]] },
        { q: "Do you ever look up?", useful: false, reply: [["okafor", "Once. In 2019."]] },
        { q: "Should we buy it?", useful: false, reply: [["okafor", "What's the exit?"]] },
    ],
    board: {
        title: "Build the Board",
        instruction: "Pick 3 or 4 buckets. Each one should be a question.",
        min: 3,
        max: 4,
        buckets: [
            { text: "Is the market attractive? (aging population, Medicare rates, fragmentation)", critical: true },
            { text: "Is this a good asset? (clinic growth, therapist retention, quality of earnings)", critical: true },
            { text: "What's the value creation plan? (organic growth, buy-and-build, margin)", critical: true },
            { text: "What's it worth, and what could go wrong? (entry vs exit multiple, downside)", critical: true },
            { text: "Exit", critical: false, coach: [["okafor", "I like it."], ["gus", "It's a label. Fold it into 'what's it worth.'"]] },
            { text: "Synergies with our other companies", critical: false, coach: [["okafor", "We're a fund. No synergies."]] },
        ],
    },
    start: {
        question: "Which bucket do you start with?",
        options: [
            { text: "Is the market attractive? (a Medicare cut changes every number)", ok: true },
            { text: "What's the value creation plan?", partial: true, reply: [["okafor", "The plan assumes flat rates. Check that first."]] },
            { text: "Exit", reply: [["okafor", "My favorite word. Still not a starting point."]] },
        ],
    },
    hypothesis: {
        question: "What's your hypothesis?",
        options: [
            { text: "The plan assumes flat rates; a Medicare cut makes 10x too expensive", ok: true },
            { text: "Synergies will carry the deal", reply: [["okafor", "Whose synergies?"]] },
            { text: "Healthcare always goes up", reply: [["gus", "Reimbursement can go down. Check it."]] },
        ],
    },
    data: {
        card: "Proposed Medicare cut: 3% a year. Medicare is 40% of revenue.",
        options: [
            { text: "Revenue growth slows sharply, so the plan's exit EBITDA is too high.", ok: true },
            { text: "3% is small, so ignore it.", reply: [["okafor", "3% a year, on 40% of revenue, for five years. Not small."]] },
            { text: "Medicare cuts help, because clinics get busier.", reply: [["gus", "Lower rates mean less money per visit."]] },
        ],
    },
    math: {
        q: "Buy at $200M with $100M equity. Exit at $350M with debt paid down to $50M. Multiple on money?",
        options: [{ text: "1.75x" }, { text: "3.0x", ok: true }, { text: "3.5x" }],
    },
    close: {
        options: [
            {
                text: "Don't pay 10x. With 40% of revenue from Medicare and a proposed 3% yearly cut, the downside returns about 1.7x, under the 2.5x target. At 8x the deal still works in the downside. Next step: diligence on payer contracts.",
                ok: true,
            },
            { text: "Buy it. Healthcare is a good market.", reply: [["okafor", "Good market, wrong price."]] },
            { text: "We need more information on many factors before deciding.", reply: [["okafor", "What's the exit? Answer first."]] },
        ],
        after: [["narrator", "Okafor looks up."], ["okafor", "And the exit?"], ["wren", "A larger platform, at about 10x. If we buy at 8."], ["narrator", "Okafor looks back down, satisfied."]],
    },
    partner: [["okafor", "What if commercial payers cut rates too?"], ["wren", "Then the downside gets worse, so I'd check commercial contracts next. That's the market bucket."]],
    hints: ["Okafor runs a fund. A fund doesn't have synergies.", "Where does a fund's return come from?", "Growth, margin, multiple, paying down debt. That's my value creation bucket."],
};

const abacusHeights: CaseData = {
    id: "abacus_heights",
    host: "moss",
    title: "Abacus Heights",
    caseType: "Market sizing",
    prompt: [
        ["moss", "How large is the US market for electric toothbrush heads? I need it to the dollar. I have been counting since Tuesday."],
        ["wren", "Which Tuesday?"],
        ["moss", "A Tuesday in 2019."],
        ["mug", "Call it 2020."],
    ],
    objective: [
        {
            label: "Goal",
            options: [
                { text: "estimate US annual spend on replacement heads", ok: true },
                { text: "count every toothbrush head", reply: [["moss", "Yes! One by one!"], ["gus", "We'd be here until 2031."]] },
                { text: "sell toothbrushes", reply: [["gus", "We're sizing, not selling."]] },
            ],
        },
        {
            label: "Precision",
            options: [
                { text: "dollars per year, within a reasonable range", ok: true },
                { text: "to the exact dollar", reply: [["moss", "Oh, joy!"], ["gus", "Oh, despair. We round here."]] },
                { text: "number of beads", reply: [["moss", "4,812. No, 4,813."]] },
            ],
        },
        {
            label: "Time limit",
            options: [
                { text: "in under 5 minutes", ok: true },
                { text: "since Tuesday", reply: [["moss", "That's how long I've been at it."]] },
                { text: "by 2031", reply: [["gus", "Way too long."]] },
            ],
        },
    ],
    restate: [["wren", "So you want US annual spend on replacement heads, within a reasonable range, in under 5 minutes."], ["moss", "A range? *Clutches abacus.* Fine."]],
    lanterns: [
        { q: "Annual spend in dollars, or units?", useful: true, reply: [["moss", "Dollars per year."]] },
        { q: "US only, consumers only?", useful: true, reply: [["moss", "US consumers only. No dentists."]] },
        { q: "Just replacement heads, not the handles?", useful: true, reply: [["moss", "Heads only."]] },
        { q: "Can I use exact census data?", useful: false, reply: [["moss", "*Weeps with joy.*"], ["gus", "We round here."]] },
        { q: "How many beads are on the abacus?", useful: false, reply: [["moss", "4,812. No, 4,813."]] },
        { q: "What's the answer?", useful: false, reply: [["moss", "I'll tell you in 2031."]] },
    ],
    board: {
        title: "Build the Estimation Tree",
        instruction: "Pick the 5 driver cards that chain from households to dollars.",
        min: 5,
        max: 5,
        buckets: [
            { text: "US households: about 130M", critical: true },
            { text: "Share with an electric toothbrush user: about 40%", critical: true },
            { text: "Electric users per household: about 2", critical: true },
            { text: "Heads per user per year: about 3", critical: true },
            { text: "Price per head: about $5", critical: true },
            { text: "US population times households", critical: false, coach: [["gus", "Double count. The people are already inside the households."]] },
            { text: "Brushings per day", critical: false, coach: [["gus", "Wrong unit. We need heads per year, not brushings per day."]] },
        ],
    },
    start: {
        question: "Top-down or bottom-up?",
        options: [
            { text: "Top-down, from households: it's a clean starting number", ok: true },
            { text: "Bottom-up, from toothbrush factories", partial: true, reply: [["gus", "Possible, but you don't know factory output. Households are easier."]] },
            { text: "Just guess a big number", reply: [["moss", "Guessing! *Faints.*"]] },
        ],
    },
    hypothesis: {
        question: "Ballpark before you multiply:",
        options: [
            { text: "Somewhere around $1 to $2 billion", ok: true },
            { text: "About $50,000", reply: [["mug", "Too small. Round up. Way up."]] },
            { text: "About $1 trillion", reply: [["mug", "Too big. That's a lot of teeth."]] },
        ],
    },
    data: {
        card: "Sanity check: electric toothbrush category retail sales, all products, about $3B.",
        options: [
            { text: "Heads at roughly half the category is plausible, since heads are the recurring purchase.", ok: true },
            { text: "$3B is the answer.", reply: [["gus", "That's the whole category, not just heads."]] },
            { text: "Our estimate must be wrong because it isn't exactly $3B.", reply: [["gus", "A sanity check isn't supposed to match. It's supposed to make sense."]] },
        ],
    },
    math: {
        q: "130M households × 40% × 2 users × 3 heads × $5. About how much?",
        options: [{ text: "About $150M" }, { text: "About $1.5B", ok: true }, { text: "About $15B" }],
    },
    close: {
        options: [
            {
                text: "Roughly $1.5 billion a year: 50 million households with an electric brush, two users each, three heads a year at $5. It's about half the $3 billion category, which makes sense. The biggest swing is replacement frequency, so I'd check that first.",
                ok: true,
            },
            { text: "Exactly $1,560,000,000.", reply: [["moss", "Oh, beautiful!"], ["gus", "Too precise. Round it and give the range."]] },
            { text: "It's hard to say without exact data.", reply: [["gus", "Estimate! Answer first."]] },
        ],
        after: [["narrator", "Moss holds up a single bead."], ["moss", "One point five. It feels... wonderful."]],
    },
    partner: [["moss", "What if people replace heads less often than dentists say?"], ["wren", "Then it's closer to $1 billion. Frequency is the biggest swing."]],
    hints: ["Moss wants precision. The interviewer wants a method.", "Start from a number I know, then filter down.", "Households, then share, then users, then frequency, then price."],
};

const foundry: CaseData = {
    id: "foundry",
    host: "fizz",
    title: "The Foundry",
    caseType: "Operations and cost",
    prompt: [
        ["fizz", "Corporate wants 10% out of plant cost in 12 months. Materials are 50% of cost. So we cut materials. Done. Lunch?"],
        ["wren", "Can we cut materials?"],
        ["fizz", "...Define 'cut.'"],
    ],
    objective: [
        {
            label: "Goal",
            options: [
                { text: "find 10% of plant cost to remove without hurting quality or delivery", ok: true },
                { text: "cut 10% of cost, whatever it takes", reply: [["narrator", "A wrench clatters to the floor."], ["fizz", "Customers audit us. Quality stays."]] },
                { text: "cut materials", reply: [["gus", "That's an answer, not the goal."]] },
            ],
        },
        {
            label: "Metric",
            options: [
                { text: "plant cost, down 10%", ok: true },
                { text: "number of wrenches", reply: [["fizz", "I only have the one."]] },
                { text: "lunch", reply: [["fizz", "Lunch is a separate project."]] },
            ],
        },
        {
            label: "Timeframe",
            options: [
                { text: "within 12 months", ok: true },
                { text: "by lunch", reply: [["fizz", "I wish."]] },
                { text: "someday", reply: [["gus", "Corporate said 12 months."]] },
            ],
        },
    ],
    restate: [["wren", "So you need to remove 10% of plant cost within 12 months without hurting quality or on-time delivery."], ["fizz", "Yes. And then lunch."]],
    lanterns: [
        { q: "What does the cost stack look like?", useful: true, reply: [["fizz", "Materials 50%, labor 25%, overhead 15%, scrap and rework 10%."]] },
        { q: "What can't change?", useful: true, reply: [["fizz", "Titanium and alloy prices are locked by contract through next year. Quality qualifications are fixed."]] },
        { q: "What's measured today?", useful: true, reply: [["fizz", "Scrap rate, and OEE. That's about 60% right now."]] },
        { q: "Is cost bad?", useful: false, reply: [["fizz", "Generally."]] },
        { q: "What's for lunch?", useful: false, reply: [["fizz", "Sandwiches. Cut in half. Efficient."]] },
        { q: "Can we just close the plant?", useful: false, reply: [["narrator", "Fizz stares."], ["gus", "Let's go back to the board."]] },
    ],
    board: {
        title: "Build the Board",
        instruction: "Pick 3 or 4 buckets. Each one should be a question.",
        min: 3,
        max: 4,
        buckets: [
            { text: "Where is the cost, and how much is addressable?", critical: true },
            { text: "Can we use less? (scrap, rework, yield)", critical: true },
            { text: "Can we pay less or do it faster? (OEE, changeovers, overtime)", critical: true },
            { text: "Should we change the structure? (make vs buy, consolidate, automate)", critical: true },
            { text: "Is materials the biggest cost?", critical: false, coach: [["fizz", "Yes. I told you that."], ["gus", "Already answered. Not a bucket."]] },
            { text: "Are costs high and expensive?", critical: false, coach: [["gus", "That says the same thing twice."]] },
        ],
    },
    start: {
        question: "Which bucket do you start with?",
        options: [
            { text: "Where is the cost, and how much is addressable?", ok: true },
            { text: "Can we use less?", partial: true, reply: [["gus", "Good lever, but first find out what can actually move."]] },
            { text: "Should we change the structure?", reply: [["gus", "That's the biggest, slowest lever. Start with the cost stack."]] },
        ],
    },
    hypothesis: {
        question: "What's your hypothesis?",
        options: [
            { text: "Materials are locked, so the 10% comes from scrap, yield and OEE", ok: true },
            { text: "Cut materials, since they're half the cost", reply: [["fizz", "...They're locked by contract."], ["gus", "Biggest isn't the same as movable."]] },
            { text: "Fire half the team", reply: [["narrator", "Fizz drops the wrench."], ["gus", "Try again."]] },
        ],
    },
    data: {
        card: "Cost $100M. Materials $50M, locked. Scrap and rework $10M. Scrap rate 8% vs 3% best-in-class.",
        options: [
            { text: "Half the cost can't move this year, so 10% of the total means 20% of what's addressable.", ok: true },
            { text: "Scrap is only 10%, so it doesn't matter.", reply: [["gus", "Scrap at 8% vs 3% is a big gap on the part that can move."]] },
            { text: "Materials are biggest, so renegotiate the contract now.", reply: [["fizz", "It's locked through next year."]] },
        ],
    },
    math: {
        q: "Halving scrap saves half of $10M. Raising OEE from 60% to 70% saves about 14% of $40M in labor and overhead. Total savings?",
        options: [{ text: "About $5M" }, { text: "About $10.6M", ok: true }, { text: "About $20M" }],
    },
    close: {
        options: [
            {
                text: "We can hit 10% without touching materials. Materials are half the cost but locked by contract, so cut scrap from 8% to 4%, worth $5M, and lift OEE from 60% to 70%, worth about $5.6M. The risk is disrupting qualified processes, so start with a scrap root-cause study on the top three part families.",
                ok: true,
            },
            { text: "Cut materials by 20%.", reply: [["fizz", "Locked. By contract."], ["gus", "Biggest isn't movable."]] },
            { text: "Costs come from many places, so we should look at all of them.", reply: [["gus", "Answer first!"]] },
        ],
        after: [["fizz", "So... not materials."], ["wren", "Not this year."], ["narrator", "Fizz puts the wrench down gently."], ["fizz", "Lunch, then."]],
    },
    partner: [["fizz", "What about overtime on the night shift?"], ["wren", "That's in my pay-less bucket. I'd look at it right after scrap."]],
    hints: ["Biggest isn't the same as movable.", "How much of each bucket can actually change in 12 months?", "Find the addressable base first, then pick levers: volume, rate, productivity, structure."],
};

export const CASES: Record<string, CaseData> = {
    lobby: prologue,
    margin_market: marginMarket,
    border_docks: borderDocks,
    runway_row: runwayRow,
    greenhouse,
    auction_hall: auctionHall,
    vault,
    abacus_heights: abacusHeights,
    foundry,
};
