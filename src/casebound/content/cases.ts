import type { CaseData } from "../types";

/**
 * Every case, written from docs/casebound-case-framework-script.md (Option A of each district).
 * Option B variants, sub-point cards and the second data card are not in this dry run yet.
 *
 * Writing wrong answers: each one is a mistake real candidates make (solving before diagnosing, revenue
 * instead of profit, a generic framework, ignoring a stated constraint, a common math slip), about as long
 * and specific as the right answer. The jokes live in the hosts' replies, not in the options. The
 * tutorial (the lobby) is kept a little easier on purpose.
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
                { text: "sell more snacks to make up the gap", reply: [["gus", "That's a fix. We don't know what broke yet."]] },
                { text: "figure out why sales fell and win them back", reply: [["gus", "Did sales fall? The Oracle said profit. Sales might be fine."]] },
            ],
        },
        {
            label: "Metric",
            options: [
                { text: "quarterly profit", ok: true },
                { text: "quarterly revenue", reply: [["gus", "Revenue is only half of profit. The Oracle said profit."]] },
                { text: "snacks sold per night", reply: [["oracle", "That is a number. It is not the number."]] },
            ],
        },
        {
            label: "Timeframe",
            options: [
                { text: "this quarter vs last", ok: true },
                { text: "this year vs last year", reply: [["gus", "The drop is this quarter. Compare like with like."]] },
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
        { q: "What do you think I should recommend?", useful: false, reply: [["oracle", "It depends. That is your job."]] },
        { q: "How much does a bag of chips cost?", useful: false, reply: [["oracle", "One dollar."], ["gus", "Detail for later. Ask about what changed."]] },
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
            { text: "Did profit fall: revenue minus cost?", critical: false, coach: [["gus", "We know it fell. That's the question, not a bucket."]] },
            { text: "How do we cut costs: stock, electricity?", critical: false, coach: [["gus", "That's a fix. First find out whether costs rose."]] },
        ],
    },
    start: {
        question: "Which bucket do you start with?",
        options: [
            { text: "Costs, because the electricity rate changed", ok: true },
            { text: "Revenue, because that's the usual first check", partial: true, reply: [["gus", "Not bad, but the Oracle already handed you a cost clue."]] },
            { text: "The coffee cart, to rule out the whole lobby", partial: true, reply: [["gus", "Worth checking, but it's not where the clue points."]] },
        ],
    },
    hypothesis: {
        question: "What's your hypothesis?",
        options: [
            { text: "Electricity cost jumped while sales held flat", ok: true },
            { text: "The coffee cart is taking the night crew's business", reply: [["oracle", "The night crew still buys from me. Follow the clues, not the cart."]] },
            { text: "Stock costs rose and prices didn't keep up", reply: [["gus", "Nothing says stock costs rose. Only electricity did."]] },
        ],
    },
    data: {
        card: "Sales flat at 400 items. Electricity up from $40 to $120 a month.",
        options: [
            { text: "Revenue held, so the whole drop is on the cost side.", ok: true },
            { text: "Sales are flat, so the fix is to grow sales.", reply: [["gus", "Flat sales didn't cause the drop. Look at what moved."]] },
            { text: "Electricity tripled, so raise prices to cover it.", reply: [["gus", "Maybe later. First the so what: where did the drop come from?"]] },
        ],
    },
    math: {
        q: "Electricity went from $40 to $120 a month. How much more does the Oracle pay each month?",
        options: [{ text: "$60" }, { text: "$80", ok: true }, { text: "$120" }],
    },
    close: {
        options: [
            {
                text: "Profit fell because electricity tripled while sales held flat. Switch to an overnight energy-saving mode and renegotiate the rate, with a 10 cent price rise as the backup.",
                ok: true,
            },
            { text: "Profit fell because electricity tripled. Raise every snack price by 50% this week so the new bill is covered right away, and check sales after a month.", reply: [["oracle", "The night crew would riot. It depends, but no."]] },
            { text: "There are many factors here, like revenue and costs, so I'd want a lot more data before I give an answer.", reply: [["gus", "Answer first! Say what's going on, then why."]] },
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
                { text: "find why sales fell and win shoppers back", reply: [["gus", "Barnaby said profit. Sales may be only part of it."]] },
                { text: "find costs to cut back to the old margin", reply: [["gus", "That assumes it's a cost problem. We don't know that yet."]] },
            ],
        },
        {
            label: "Metric",
            options: [
                { text: "profit, down 15%", ok: true },
                { text: "same-store sales growth", reply: [["gus", "Useful later. But the problem he brought is profit."]] },
                { text: "market share vs discounters", reply: [["barnaby", "Share of what? Umbrellas?"], ["gus", "Share is a driver. Profit is the goal."]] },
            ],
        },
        {
            label: "Timeframe",
            options: [
                { text: "down over two years; recover within 18 months", ok: true },
                { text: "down this year; recover by next quarter", reply: [["barnaby", "It's been two years of drizzle. One quarter is a miracle."]] },
                { text: "down over two years; recover within 5 years", reply: [["gus", "He wants it back in 18 months. Use his clock."]] },
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
        { q: "Is the problem in revenue or in cost?", useful: false, reply: [["barnaby", "You tell me. You're the consultant."], ["gus", "Your board answers that one."]] },
        { q: "Should we close the weakest stores?", useful: false, reply: [["barnaby", "Close stores? In this weather?"], ["gus", "That's a recommendation dressed up as a question."]] },
        { q: "What do you think is causing it?", useful: false, reply: [["barnaby", "The rain."], ["gus", "We already had his theory. Ask for facts."]] },
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
            { text: "How attractive is the grocery market? (size, growth, trends)", critical: false, coach: [["gus", "That's a market-entry bucket. He's already in the market."]] },
            { text: "Are revenues and sales down? (traffic, basket)", critical: false, coach: [["gus", "That overlaps your revenue bucket. Keep the buckets separate."]] },
            { text: "How do we cut costs? (labor hours, shrink)", critical: false, coach: [["gus", "That's a fix, and it overlaps the cost bucket."]] },
        ],
    },
    start: {
        question: "Which bucket do you start with?",
        options: [
            { text: "Is it the market or the client?", ok: true },
            { text: "Is the decline on the revenue side?", partial: true, reply: [["gus", "Fine start. But whether it's the market or Barnaby changes everything downstream."]] },
            { text: "Is it on the cost side?", reply: [["gus", "Possible. But first check whether everyone's hurting. That changes where you look."]] },
        ],
    },
    hypothesis: {
        question: "What's your hypothesis?",
        options: [
            { text: "Traffic is leaking to value competitors", ok: true },
            { text: "Labor costs are squeezing the whole industry", reply: [["barnaby", "The discount chain across the street looks pretty unsqueezed to me."]] },
            { text: "Shoppers are buying less per trip as prices rise", reply: [["gus", "Then the discounter would be hurting too. It's thriving."]] },
        ],
    },
    data: {
        card: "Same-store sales down 6%. Transactions down 9%. Average basket up 3%.",
        options: [
            { text: "It's traffic, not basket: fewer shoppers, each spending a bit more.", ok: true },
            { text: "Baskets are up, so loyal shoppers are fine and it's really a cost problem.", reply: [["gus", "Sales fell 6%. That's revenue, and it's coming from fewer trips."]] },
            { text: "Shoppers are trading down to cheaper items, so push premium brands.", reply: [["gus", "Baskets went up, not down. Trading down would shrink them."]] },
        ],
    },
    math: {
        q: "Profit was $40M. It's now $34M. What percent drop is that?",
        options: [{ text: "6%" }, { text: "15%", ok: true }, { text: "18%" }],
    },
    close: {
        options: [
            {
                text: "Profit fell because traffic dropped 9% as shoppers moved to discounters, while baskets held. Compete on value: expand private label and sharpen promotions, tested on 50 key items in 5 stores to avoid a price war.",
                ok: true,
            },
            {
                text: "Profit fell because costs rose across the industry. Cut labor hours and renegotiate with suppliers to restore the old margin within 18 months. The risk is service slipping, so pilot the new schedules in 5 stores first.",
                reply: [["gus", "The discounter across the street is thriving. It's not the industry, and the data says traffic."]],
            },
            {
                text: "Profit fell because traffic dropped 9% as shoppers moved to discounters. Win them back by matching the discounter's price on every item from next month. The risk is margin, so fund it with cheaper store-brand sourcing.",
                reply: [["barnaby", "Every item?"], ["gus", "Right diagnosis. But matching every price starts a war you can't win. Pick your battles."]],
            },
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
                { text: "decide how to enter the US", reply: [["gus", "How comes after whether. She hasn't earned the yes yet."]] },
                { text: "estimate the size of the US market", reply: [["gus", "Size is one input. She needs a go or no-go."]] },
            ],
        },
        {
            label: "Metric",
            options: [
                {
                    text: "? (ask Helga for her target)",
                    ok: true,
                    costsLantern: true,
                    reply: [["helga", "Fine. $100M in revenue within three years, at a positive margin."], ["narrator", "That cost one Question Lantern."]],
                },
                { text: "US market share in year one", reply: [["helga", "Share is nice. Money is nicer."], ["gus", "When you don't know her target, ask for it."]] },
                { text: "number of hospitals signed", reply: [["gus", "A driver, not the goal. When you don't know her target, ask for it."]] },
            ],
        },
        {
            label: "Timeframe",
            options: [
                { text: "within three years", ok: true },
                { text: "within the first year", reply: [["gus", "She said three years. Hospital sales are slow anyway."]] },
                { text: "within ten years", reply: [["helga", "Ten years? My suitcases will be antiques."], ["gus", "She said three."]] },
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
        { q: "How big is the US market?", useful: false, reply: [["helga", "Very. That's why I packed so much."], ["gus", "Your first bucket answers that."]] },
        { q: "Which states should we launch in first?", useful: false, reply: [["gus", "That's an entry detail. Whether comes before where."]] },
        { q: "Do you think we should go?", useful: false, reply: [["helga", "Yes! Wait, that's your job."]] },
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
            { text: "Who are the competitors? (the incumbent, startups)", critical: false, coach: [["gus", "That fits inside 'can the client win.' Don't split it out."]] },
            { text: "What's the best marketing plan? (trade shows, surgeon training)", critical: false, coach: [["gus", "Too early, and it's part of how to enter."]] },
            { text: "Is the US better than Europe? (size, growth)", critical: false, coach: [["helga", "Europe is home."], ["gus", "She's deciding on the US. Comparing markets isn't the question."]] },
        ],
    },
    start: {
        question: "Which bucket do you start with?",
        options: [
            { text: "Can the client win?", ok: true },
            { text: "Is the US market attractive?", partial: true, reply: [["gus", "Fair, but everyone already agrees it's big. The open question is whether Helga can win it."]] },
            { text: "Do the economics work?", reply: [["gus", "The economics depend on how many hospitals she can win. Start there."]] },
        ],
    },
    hypothesis: {
        question: "What's your hypothesis?",
        options: [
            { text: "The market is big, but displacing the incumbent is the deciding question", ok: true },
            { text: "The market is big enough that even a small share of hospitals hits $100M", reply: [["gus", "Maybe. But that assumes hospitals will switch. Will they?"]] },
            { text: "FDA clearance is the deciding question: no clearance, no sales, whatever the competition", reply: [["gus", "It's a timing risk. Winning hospitals is what decides it."]] },
        ],
    },
    data: {
        card: "The incumbent holds 80% of installed systems. Hospitals keep a system 7 to 10 years.",
        options: [
            { text: "Most of the market is locked up for years, so near-term sales come from new hospitals.", ok: true },
            { text: "80% is taken, but the other 20% is open, so a head-on launch still works.", reply: [["gus", "Is 20% enough for $100M in three years? Check before cheering."]] },
            { text: "The incumbent is dominant, so the US is unattractive and she should stay home.", reply: [["gus", "Locked, not hopeless. New hospitals and surgery centers are still open."]] },
        ],
    },
    math: {
        q: "To hit $100M a year at $2M per robot (including consumables), how many systems?",
        options: [{ text: "5" }, { text: "50", ok: true }, { text: "500" }],
    },
    close: {
        options: [
            {
                text: "Enter, but not head-on. Hospitals keep systems 7 to 10 years, so target hospitals with no robot yet, starting with surgery centers. The risk is FDA timing, so file for clearance before hiring a sales force.",
                ok: true,
            },
            {
                text: "Don't enter. The incumbent holds 80% and hospitals keep systems 7 to 10 years, so $100M in three years isn't reachable. Revisit in three years, once FDA clearance is in hand and contracts start to expire.",
                reply: [["gus", "Not head-on, sure. But new hospitals are open. Don't walk away from them."]],
            },
            {
                text: "Enter head-on. The US is the biggest market, so hire a large sales force and offer steep discounts to pull hospitals off the incumbent. The risk is FDA timing, so file for clearance first.",
                reply: [["gus", "They keep systems 7 to 10 years. A discount won't beat a contract."]],
            },
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
                { text: "decide whether a 5% fare increase raises revenue", reply: [["gus", "Revenue can rise while profit falls. Tug cares about profit."]] },
                { text: "find the fare that sells the most tickets", reply: [["tug", "That's zero dollars."], ["gus", "Cheap fares sell the most tickets. Not the point."]] },
            ],
        },
        {
            label: "Metric",
            options: [
                { text: "profit on these routes", ok: true },
                { text: "revenue per seat on these routes", reply: [["gus", "Close, but it ignores costs."]] },
                { text: "load factor (share of seats filled)", reply: [["tug", "Full planes are nice. Profitable planes are nicer."]] },
            ],
        },
        {
            label: "Timeframe",
            options: [
                { text: "over the next year", ok: true },
                { text: "over the next month", reply: [["gus", "Too short. Rivals take weeks to react."]] },
                { text: "over the next five years", reply: [["gus", "A fare change gets judged in a year. Five is fleet planning."]] },
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
        { q: "What's the right price?", useful: false, reply: [["tug", "That's what I'm paying you for."]] },
        { q: "How many planes do you have?", useful: false, reply: [["tug", "Twelve."], ["gus", "Interesting, but it doesn't change the fare decision."]] },
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
            { text: "Where are our prices today? (vs competitors)", critical: false, coach: [["gus", "That's data for the demand bucket, not its own question."]] },
            { text: "Do customers like us? (loyalty, satisfaction)", critical: false, coach: [["gus", "That overlaps how demand responds."]] },
            { text: "How do we cut costs? (fuel, crew)", critical: false, coach: [["gus", "Off the question. This is about fares."]] },
        ],
    },
    start: {
        question: "Which bucket do you start with?",
        options: [
            { text: "How will demand respond?", ok: true },
            { text: "What's the cost effect?", partial: true, reply: [["gus", "Costs barely move here, so they won't decide it."]] },
            { text: "What's the net revenue effect?", reply: [["gus", "That depends on how demand responds. Start upstream."]] },
        ],
    },
    hypothesis: {
        question: "What's your hypothesis?",
        options: [
            { text: "A raise on business-heavy routes is profitable: demand is inelastic and costs are fixed", ok: true },
            { text: "Any raise loses money, because passengers switch to other airlines", reply: [["tug", "Rivals raised fares last spring and kept their passengers."]] },
            { text: "A raise on leisure routes is profitable, because there are more leisure travelers", reply: [["gus", "More of them, and the most price-sensitive. Squeeze the wrong group and they leave."]] },
        ],
    },
    data: {
        card: "Business demand drops 2% for a 5% price increase. Leisure demand drops 10%.",
        options: [
            { text: "Business travelers barely react, so aim the raise at them.", ok: true },
            { text: "Demand drops in both groups, so the raise loses money.", reply: [["gus", "A 2% drop for a 5% raise still makes money. Do the math."]] },
            { text: "Leisure is 60% of passengers, so start the raise there.", reply: [["gus", "Leisure travelers react the most. Wrong group to squeeze."]] },
        ],
    },
    math: {
        q: "Revenue is $100M. Price goes up 5% and volume goes down 4%. New revenue is about:",
        options: [{ text: "$99M" }, { text: "$101M", ok: true }, { text: "$105M" }],
    },
    close: {
        options: [
            {
                text: "Raise fares only on business-heavy routes. Business demand barely moves and costs are fixed, so it's nearly pure profit. Hold leisure fares, and watch rival fares for two weeks in case they undercut.",
                ok: true,
            },
            {
                text: "Raise all fares 5%. Revenue rises about 1% overall and costs are fixed, so it pays even after leisure passengers drop off. The risk is a rival undercutting us, so watch their fares for two weeks.",
                reply: [["gus", "It pays, but it's not the best answer. Segment it and keep the leisure travelers."]],
            },
            {
                text: "Hold fares. Leisure demand drops 10% and leisure is 60% of passengers, so the volume risk outweighs the price gain. Revisit next spring, and track rival fares in case they raise first.",
                reply: [["gus", "That's half the data. Business travelers barely react."]],
            },
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
                { text: "list every growth idea and estimate how big each one could be by year four", reply: [["quill", "Yes! All of them!"], ["gus", "Listing isn't choosing. She needs a ranking."]] },
                { text: "decide whether expanding into Europe can double revenue in four years", reply: [["gus", "That's one option. The goal is doubling, however we get there."]] },
            ],
        },
        {
            label: "Metric",
            options: [
                { text: "revenue, from $50M to $100M", ok: true },
                { text: "profit, from $10M to $20M", reply: [["gus", "She said double revenue. Don't change the target."]] },
                { text: "customers, from 2,000 to 4,000", reply: [["gus", "New customers are one path. Existing ones can grow too."]] },
            ],
        },
        {
            label: "Timeframe",
            options: [
                { text: "within four years", ok: true },
                { text: "within two years", reply: [["quill", "Ooh, faster!"], ["gus", "She said four. Don't add pressure she didn't ask for."]] },
                { text: "within ten years", reply: [["gus", "She said four."]] },
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
        { q: "How big is the scheduling software market?", useful: false, reply: [["gus", "Your board covers that. Ask what you can't look up."]] },
        { q: "Which of your ideas do you like best?", useful: false, reply: [["quill", "All of them equally, like children."]] },
        { q: "Should we do AI?", useful: false, reply: [["quill", "YES."], ["gus", "That's her idea, not a question about her business."]] },
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
            { text: "Organic or inorganic growth? (build vs buy)", critical: false, coach: [["gus", "A label pair, and 'buy' is off the table this year."]] },
            { text: "Should we acquire a competitor? (targets, price)", critical: false, coach: [["quill", "The board said no acquisitions this year."], ["gus", "Off the table."]] },
            { text: "How fast is the software market growing? (size, trends)", critical: false, coach: [["gus", "Context, not a path to $100M. It fits inside the core bucket."]] },
        ],
    },
    start: {
        question: "Which bucket do you start with?",
        options: [
            { text: "How much more can the core deliver?", ok: true },
            { text: "Which adjacent moves are biggest?", partial: true, reply: [["gus", "Fair, but existing customers are growing. Check the core first."]] },
            { text: "How do we rank and fund them?", reply: [["gus", "You can't rank options you haven't sized. Start with the core."]] },
        ],
    },
    hypothesis: {
        question: "What's your hypothesis?",
        options: [
            { text: "Expansion within current customers closes most of the gap", ok: true },
            { text: "New customers in a new vertical close most of the gap", reply: [["gus", "New customers are slowing. Existing ones are growing 8%."]] },
            { text: "A price increase on the core closes most of the gap", reply: [["gus", "Price helps, but doubling on price alone would drive customers away."]] },
        ],
    },
    data: {
        card: "Customers using 3+ modules expand 25% a year. Only 30% of customers use 3+ modules.",
        options: [
            { text: "Moving customers onto more modules is the biggest lever, and cheaper than new customers.", ok: true },
            { text: "Only 30% use 3+ modules, so most customers don't value them. Fix the product first.", reply: [["gus", "The ones who use them grow fast. That's room, not a flaw."]] },
            { text: "Heavy users already expand 25% a year, so the core is maxed out. Look elsewhere.", reply: [["gus", "Only 30% are heavy users. 70% haven't started."]] },
        ],
    },
    math: {
        q: "$50M to $100M in 4 years. About what yearly growth does that need?",
        options: [{ text: "About 15%" }, { text: "About 19%", ok: true }, { text: "About 25%" }],
    },
    close: {
        options: [
            {
                text: "Grow the core first. Customers on 3+ modules expand 25% a year and only 30% are there, so cross-selling closes about half the gap. Add one adjacent vertical for the rest, and hire customer success managers first.",
                ok: true,
            },
            {
                text: "Grow through new customers. Existing customers only grow 8% a year, so launch two new verticals and Europe in year one. The risk is a small sales team, so hire sales reps in each new market first.",
                reply: [["gus", "New customers are slowing, and the sales team is small. That's the hard road."]],
            },
            {
                text: "Grow the core by raising prices 20% across all modules, then add 5% a year. With no new spend, that nearly doubles revenue in four years. The risk is churn, so grandfather the biggest accounts.",
                reply: [["gus", "Price can't carry it alone. Customers would leave before you doubled."]],
            },
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
                { text: "decide how much to bid to win the auction", reply: [["auctioneer", "Sold! To the gentleman who didn't check the synergies!"], ["gus", "Winning isn't the goal. Winning at a good price is."]] },
                { text: "decide whether the target is a good company", reply: [["gus", "A good company and a good deal aren't the same thing."]] },
            ],
        },
        {
            label: "Metric",
            options: [
                { text: "value for the Duke's shareholders", ok: true },
                { text: "combined revenue after the deal", reply: [["duke", "Bigger!"], ["gus", "Bigger isn't better if you overpay."]] },
                { text: "the target's revenue growth rate", reply: [["duke", "It's growing!"], ["gus", "A driver, not the goal."]] },
            ],
        },
        {
            label: "Terms",
            options: [
                { text: "at today's price: a 40% premium", ok: true },
                { text: "at fair value, with no premium", reply: [["gus", "That's not the offer on the table. Judge the real price."]] },
                { text: "at whatever price wins the auction", reply: [["gus", "Price is the whole question."]] },
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
        { q: "Who else is bidding?", useful: false, reply: [["duke", "Rivals. Shinier rivals."], ["gus", "Interesting, but it doesn't change what the target is worth to you."]] },
        { q: "Is the target profitable?", useful: false, reply: [["gus", "Your board covers that. Ask about price and plans."]] },
        { q: "Should we buy it?", useful: false, reply: [["duke", "Yes!"], ["gus", "That's your job."]] },
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
            { text: "Is the target a good business? (brand, growth)", critical: false, coach: [["gus", "That overlaps 'worth on its own.'"]] },
            { text: "How big is the snack market? (size, growth)", critical: false, coach: [["gus", "It fits inside strategic sense. Don't make it its own bucket."]] },
            { text: "How will we pay? (cash, stock, debt)", critical: false, coach: [["gus", "Matters later. First, is it worth it at all?"]] },
        ],
    },
    start: {
        question: "Which bucket do you start with?",
        options: [
            { text: "What synergies are real, and what do they cost?", ok: true },
            { text: "Does the deal make strategic sense, and what are the alternatives?", partial: true, reply: [["gus", "Fine, but the premium is the sticking point. Synergies decide it."]] },
            { text: "What is the target worth on its own, before synergies?", reply: [["gus", "Useful, but it doesn't settle the premium. Synergies do."]] },
        ],
    },
    hypothesis: {
        question: "What's your hypothesis?",
        options: [
            { text: "Synergies won't cover a 40% premium", ok: true },
            { text: "Revenue synergies in the snack aisle will cover the premium", reply: [["gus", "Revenue synergies are the least reliable kind. Don't lean on them."]] },
            { text: "The target is worth more than the price because it's growing fast", reply: [["gus", "Its value on its own already counts the growth. That's $1.0B."]] },
        ],
    },
    data: {
        card: "Cost synergies: $20M a year from year 2. Revenue synergies uncertain. Cost to achieve: $50M.",
        options: [
            { text: "Even valued at 10x, cost synergies fall well short of the $400M premium.", ok: true },
            { text: "At 10x, $20M a year is worth $200M, so it covers half the premium. Close enough.", reply: [["gus", "Half isn't enough. And you forgot the $50M it costs to get there."]] },
            { text: "Cost synergies fall short, so revenue synergies have to make up the rest.", reply: [["gus", "The card says they're uncertain. Don't bet the deal on them."]] },
        ],
    },
    math: {
        q: "Price $1.4B, worth $1.0B on its own. Synergies $20M a year at 10x, minus $50M to achieve. Value created vs the premium?",
        options: [{ text: "Creates about $150M" }, { text: "Destroys about $250M", ok: true }, { text: "Destroys about $200M" }],
    },
    close: {
        options: [
            {
                text: "Don't buy at this price. The premium is $400M but net synergies are worth about $150M, so the deal destroys roughly $250M. Bid no more than a 15% premium, and check whether a distribution partnership gets most of the benefit.",
                ok: true,
            },
            {
                text: "Buy it. It opens the fast-growing snack aisle, and revenue synergies should close the $250M gap as the sales forces combine. The risk is integration, so name one leader for the merged sales team on day one.",
                reply: [["duke", "Hooray!"], ["gus", "Uncertain synergies don't fill a known hole."]],
            },
            {
                text: "Don't buy. The target is worth $1.0B on its own, so any premium above that destroys value for the Duke's shareholders. Offer $1.0B, and walk away if a rival bids higher.",
                reply: [["gus", "Too strict. Net synergies justify some premium, about $150M of it."]],
            },
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
                { text: "find synergies with the fund's other clinics", reply: [["narrator", "Okafor finally looks up."], ["okafor", "Whose synergies? We're a fund."]] },
                { text: "decide what the fund should bid to win the deal", reply: [["gus", "Close, but the question is whether 10x works, not how to win."]] },
            ],
        },
        {
            label: "Metric",
            options: [
                { text: "about 2.5x the fund's money", ok: true },
                { text: "EBITDA growth of 10% a year", reply: [["okafor", "Growth is a means. The return is the end."]] },
                { text: "a 10x exit multiple", reply: [["okafor", "That's an assumption, not a target."]] },
            ],
        },
        {
            label: "Timeframe",
            options: [
                { text: "over a five-year hold", ok: true },
                { text: "over a ten-year hold", reply: [["okafor", "Our fund has to give the money back. Five years."]] },
                { text: "over the first year", reply: [["okafor", "That's not private equity. That's a lottery."]] },
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
        { q: "Who are the competing clinic chains?", useful: false, reply: [["gus", "That's in the market bucket. Ask what you can't look up."]] },
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
            { text: "What's the exit? (who buys it, at what multiple)", critical: false, coach: [["okafor", "I like it."], ["gus", "Fold it into 'what's it worth.'"]] },
            { text: "What synergies with our other companies? (shared back office)", critical: false, coach: [["okafor", "We're a fund. No synergies."]] },
            { text: "How big is US healthcare? (spend, growth)", critical: false, coach: [["gus", "Too broad. Physical therapy and Medicare rates are what matter."]] },
        ],
    },
    start: {
        question: "Which bucket do you start with?",
        options: [
            { text: "Is the market attractive?", ok: true },
            { text: "What's the value creation plan?", partial: true, reply: [["okafor", "The plan assumes flat rates. Check that first."]] },
            { text: "What's it worth, and what could go wrong?", reply: [["okafor", "Valuation before the market? Bold. Wrong, but bold."]] },
        ],
    },
    hypothesis: {
        question: "What's your hypothesis?",
        options: [
            { text: "The plan assumes flat rates; a Medicare cut makes 10x too expensive", ok: true },
            { text: "Five new clinics a year will carry the deal to 2.5x, whatever happens to rates", reply: [["gus", "Only if each visit pays what the plan assumes. Does it?"]] },
            { text: "Therapist turnover is the biggest risk, since clinics can't run without them", reply: [["gus", "A real risk, but nothing points there yet. Medicare is 40% of revenue."]] },
        ],
    },
    data: {
        card: "Proposed Medicare cut: 3% a year. Medicare is 40% of revenue.",
        options: [
            { text: "Revenue growth slows sharply, so the plan's exit EBITDA is too high.", ok: true },
            { text: "That's only about 1% of revenue a year, so it barely moves the deal.", reply: [["okafor", "1.2% a year, compounding, on thin clinic margins, for five years. It moves."]] },
            { text: "Clinics can see more patients to make up the cut, so the plan holds.", reply: [["gus", "The plan already counts on new clinics. More visits per therapist is a stretch."]] },
        ],
    },
    math: {
        q: "Buy at $200M with $100M equity. Exit at $350M with debt paid down to $50M. Multiple on money?",
        options: [{ text: "2.5x" }, { text: "3.0x", ok: true }, { text: "3.5x" }],
    },
    close: {
        options: [
            {
                text: "Don't pay 10x. Medicare is 40% of revenue, and with a 3% yearly cut the downside returns about 1.7x, under the 2.5x target. At 8x the deal still works. Next step: diligence on payer contracts.",
                ok: true,
            },
            {
                text: "Buy at 10x. The base case returns 3.0x, above the 2.5x target, so the deal clears the bar. The risk is the Medicare cut, so add new clinics faster to grow out of it. Next step: payer diligence.",
                reply: [["okafor", "The base case assumes flat rates. The cut breaks it."]],
            },
            {
                text: "Walk away. Medicare is 40% of revenue and a 3% yearly cut is coming, so physical therapy clinics are a bad investment at any price. Look for a target with commercial payers instead.",
                reply: [["okafor", "At 8x the downside still works. Price fixes this."]],
            },
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
                { text: "estimate US annual spend on electric toothbrushes", reply: [["gus", "That includes the handles. Moss asked about heads."]] },
                { text: "estimate how many heads are sold each year", reply: [["gus", "Units are halfway there. He asked how large, in dollars."]] },
            ],
        },
        {
            label: "Precision",
            options: [
                { text: "dollars per year, within a reasonable range", ok: true },
                { text: "to the exact dollar", reply: [["moss", "Oh, joy!"], ["gus", "Oh, despair. We round here."]] },
                { text: "units per year, rounded to the nearest million", reply: [["gus", "Units are a step. The answer should be dollars."]] },
            ],
        },
        {
            label: "Time limit",
            options: [
                { text: "in under 5 minutes", ok: true },
                { text: "after a week of research", reply: [["moss", "Only a week?"], ["gus", "This is an estimate, not a study."]] },
                { text: "in under 30 seconds", reply: [["moss", "*Drops a bead.*"], ["gus", "Too rushed to show your method."]] },
            ],
        },
    ],
    restate: [["wren", "So you want US annual spend on replacement heads, within a reasonable range, in under 5 minutes."], ["moss", "A range? *Clutches abacus.* Fine."]],
    lanterns: [
        { q: "Annual spend in dollars, or units?", useful: true, reply: [["moss", "Dollars per year."]] },
        { q: "US only, consumers only?", useful: true, reply: [["moss", "US consumers only. No dentists."]] },
        { q: "Just replacement heads, not the handles?", useful: true, reply: [["moss", "Heads only."]] },
        { q: "Can I use exact census data?", useful: false, reply: [["moss", "*Weeps with joy.*"], ["gus", "We round here."]] },
        { q: "How many people live in the US?", useful: false, reply: [["gus", "You should know that one. Don't spend a lantern on it."]] },
        { q: "Roughly what's the answer?", useful: false, reply: [["moss", "I'll tell you in 2031."]] },
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
            { text: "US population: about 330M", critical: false, coach: [["gus", "Double count. The people are already inside the households."]] },
            { text: "Brushings per user per day: about 2", critical: false, coach: [["gus", "Wrong unit. We need heads per year, not brushings per day."]] },
            { text: "Share with a manual toothbrush: about 60%", critical: false, coach: [["gus", "Manual brushes don't take replacement heads. Wrong filter."]] },
        ],
    },
    start: {
        question: "Top-down or bottom-up?",
        options: [
            { text: "Top-down, from US households", ok: true },
            { text: "Bottom-up, from toothbrush factories", partial: true, reply: [["gus", "Possible, but you don't know factory output. Households are easier."]] },
            { text: "Top-down, from US toothpaste sales", reply: [["gus", "Toothpaste tells you nothing about brush heads."]] },
        ],
    },
    hypothesis: {
        question: "Ballpark before you multiply:",
        options: [
            { text: "Somewhere around $1 to $2 billion", ok: true },
            { text: "Somewhere around $100 to $200 million", reply: [["mug", "Too small. Round up."]] },
            { text: "Somewhere around $10 to $20 billion", reply: [["mug", "Too big. That's a lot of teeth."]] },
        ],
    },
    data: {
        card: "Sanity check: electric toothbrush category retail sales, all products, about $3B.",
        options: [
            { text: "Heads at roughly half the category is plausible, since heads are the recurring purchase.", ok: true },
            { text: "The category is $3B, so our $1.5B estimate is too low by half. Recheck the drivers.", reply: [["gus", "The category includes handles. Heads at half is reasonable."]] },
            { text: "Heads are bought more often than handles, so heads must be most of the $3B.", reply: [["gus", "More often, but much cheaper. One handle costs as much as many heads."]] },
        ],
    },
    math: {
        q: "130M households × 40% × 2 users × 3 heads × $5. About how much?",
        options: [{ text: "About $780M" }, { text: "About $1.5B", ok: true }, { text: "About $3B" }],
    },
    close: {
        options: [
            {
                text: "Roughly $1.5 billion a year: about 50 million households with an electric brush, two users each, three heads a year at $5. That's half the $3 billion category, which fits. The biggest swing is how often people replace heads.",
                ok: true,
            },
            {
                text: "Exactly $1,560,000,000 a year: 130 million households, 40% with an electric brush, two users each, three heads a year at $5. That's half the $3 billion category, which fits. The biggest swing is how often people replace heads.",
                reply: [["moss", "Oh, beautiful!"], ["gus", "Too precise for an estimate. Give a rounded number, or a range."]],
            },
            {
                text: "Roughly $3 billion a year. Heads are the recurring purchase, and the electric toothbrush category is about $3 billion, which confirms it. The biggest swing is price per head, so I'd check that first.",
                reply: [["gus", "That's the whole category, handles included. Your own math says about half."]],
            },
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
                { text: "cut 10% of plant cost this year, whatever it takes", reply: [["narrator", "A wrench clatters to the floor."], ["fizz", "Customers audit us. Quality stays."]] },
                { text: "cut 10% of plant cost by renegotiating materials with suppliers", reply: [["gus", "That's an answer before we know what can move."]] },
            ],
        },
        {
            label: "Metric",
            options: [
                { text: "plant cost, down 10%", ok: true },
                { text: "headcount, down 10%", reply: [["fizz", "Corporate said cost. Not people."]] },
                { text: "materials cost, down 10%", reply: [["gus", "Materials are one line. Corporate said total plant cost."]] },
            ],
        },
        {
            label: "Timeframe",
            options: [
                { text: "within 12 months", ok: true },
                { text: "within 3 months", reply: [["gus", "Corporate said 12. Rushing qualified processes is how quality slips."]] },
                { text: "within 3 years", reply: [["fizz", "Corporate will not wait three years. Or for lunch."], ["gus", "They said 12 months."]] },
            ],
        },
    ],
    restate: [["wren", "So you need to remove 10% of plant cost within 12 months without hurting quality or on-time delivery."], ["fizz", "Yes. And then lunch."]],
    lanterns: [
        { q: "What does the cost stack look like?", useful: true, reply: [["fizz", "Materials 50%, labor 25%, overhead 15%, scrap and rework 10%."]] },
        { q: "What can't change?", useful: true, reply: [["fizz", "Titanium and alloy prices are locked by contract through next year. Quality qualifications are fixed."]] },
        { q: "What's measured today?", useful: true, reply: [["fizz", "Scrap rate, and OEE. That's about 60% right now."]] },
        { q: "Are materials the biggest cost?", useful: false, reply: [["fizz", "Yes. I told you that."], ["gus", "Already answered. Don't spend a lantern on it."]] },
        { q: "Should we automate the line?", useful: false, reply: [["gus", "That's a lever. Ask for facts first."]] },
        { q: "What should we cut?", useful: false, reply: [["fizz", "Materials! ...That's what you're for, right?"]] },
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
            { text: "Is materials the biggest cost? (titanium, alloy)", critical: false, coach: [["fizz", "Yes. I told you that."], ["gus", "Already answered. Not a bucket."]] },
            { text: "How do we renegotiate materials? (suppliers, contracts)", critical: false, coach: [["fizz", "Locked through next year."], ["gus", "And it's a fix, not a question."]] },
            { text: "Are fixed or variable costs higher? (overhead vs labor)", critical: false, coach: [["gus", "A textbook split, but it doesn't tell you what can move this year."]] },
        ],
    },
    start: {
        question: "Which bucket do you start with?",
        options: [
            { text: "Where is the cost, and how much is addressable?", ok: true },
            { text: "Can we use less scrap, rework and material?", partial: true, reply: [["gus", "Good lever, but first find out what can actually move."]] },
            { text: "Should we change the structure, like make vs buy?", reply: [["gus", "That's the biggest, slowest lever. Start with the cost stack."]] },
        ],
    },
    hypothesis: {
        question: "What's your hypothesis?",
        options: [
            { text: "Materials are locked, so the 10% comes from scrap, yield and OEE", ok: true },
            { text: "Materials are half the cost, so the 10% has to come from materials", reply: [["fizz", "...They're locked by contract."], ["gus", "Biggest isn't the same as movable."]] },
            { text: "Labor is the next-biggest cost, so the 10% comes from cutting overtime", reply: [["gus", "Overtime helps, but it's a slice of labor. Scrap and OEE are bigger."]] },
        ],
    },
    data: {
        card: "Cost $100M. Materials $50M, locked. Scrap and rework $10M. Scrap rate 8% vs 3% best-in-class.",
        options: [
            { text: "Half the cost can't move this year, so 10% of the total means 20% of what's addressable.", ok: true },
            { text: "Scrap is only $10M, so even halving it saves just 5%. The real savings are elsewhere.", reply: [["gus", "5% is half the target from one lever. That's a lot."]] },
            { text: "Materials are locked, so 10% can't be done this year. Ask corporate for more time.", reply: [["gus", "Locked materials just means the other half does the work."]] },
        ],
    },
    math: {
        q: "Halving scrap saves half of $10M. Raising OEE from 60% to 70% saves about 14% of $40M in labor and overhead. Total savings?",
        options: [{ text: "About $9M" }, { text: "About $10.6M", ok: true }, { text: "About $15M" }],
    },
    close: {
        options: [
            {
                text: "We can hit 10% without touching materials. Cut scrap from 8% to 4%, worth $5M, and lift OEE from 60% to 70%, worth about $5.6M. Start with a scrap root-cause study on the top three part families.",
                ok: true,
            },
            {
                text: "We can hit 10% by reopening the materials contract early. Materials are half of cost, so a 20% price cut covers the whole target. The risk is supplier pushback, so offer a longer contract in return.",
                reply: [["fizz", "Locked. By contract."], ["gus", "Biggest isn't movable."]],
            },
            {
                text: "We can hit 10% by cutting 40% of labor. Labor is a quarter of cost, and a smaller crew also means less overtime. The risk is delivery, so start with the night shift and watch on-time rates.",
                reply: [["fizz", "And who runs the line?"], ["gus", "That hurts delivery, which was off-limits."]],
            },
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
