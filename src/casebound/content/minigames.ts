import type { Choice, L } from "../types";

/** Case Quiz: the two doors' game show. Each round draws 4 questions. */
export interface QuizQuestion {
    id: string;
    category: string;
    q: string;
    options: string[];
    answer: number;
    explain: string;
}

export const QUIZ: QuizQuestion[] = [
    { id: "o1", category: "Openings", q: "What two things should your restated objective always include?", options: ["A metric and a timeframe", "A framework name and a hypothesis", "The client's name and industry"], answer: 0, explain: "Without them you can't tell when you've answered the question." },
    { id: "o2", category: "Openings", q: "Which clarifying question wastes a lantern?", options: ["How does the client make money?", "How does the client define success?", "Is the problem revenue or cost?"], answer: 2, explain: "Your board answers that one. Ask what the board can't." },
    { id: "o3", category: "Openings", q: "After presenting your structure, what's the step people skip most?", options: ["Asking for data", "Prioritizing and stating a hypothesis", "Restating the prompt"], answer: 1, explain: "Say where you'd start and what you expect to find." },
    { id: "o4", category: "Openings", q: "How long should you take to write your structure?", options: ["10 seconds", "60 to 90 seconds", "5 minutes"], answer: 1, explain: "Long enough to think, short enough to keep the room." },
    { id: "b1", category: "Boards", q: "Which of these is a label, not a bucket?", options: ["\"Is the market attractive?\"", "\"Market\"", "\"Can the client win?\""], answer: 1, explain: "Buckets are questions, so each one ties back to the objective." },
    { id: "b2", category: "Boards", q: "How many top-level buckets is right?", options: ["Two", "Three or four", "Six or more"], answer: 1, explain: "Two feels thin; five or more is hard to hold in anyone's head." },
    { id: "b3", category: "Boards", q: "Best sub-points for an airline's cost bucket?", options: ["Fixed and variable", "Fuel, labor, aircraft ownership", "Things that cost money"], answer: 1, explain: "Industry-specific beats generic every time." },
    { id: "b4", category: "Boards", q: "Which bucket doesn't belong on a private equity board?", options: ["Value creation plan", "Synergies with the buyer", "Exit"], answer: 1, explain: "A fund owns no other business to combine with." },
    { id: "n1", category: "Numbers", q: "Price up 10%, volume down 5%. Revenue changes by about?", options: ["Up 5%", "Up 4.5%", "Down 5%"], answer: 1, explain: "1.10 times 0.95 is 1.045." },
    { id: "n2", category: "Numbers", q: "Doubling in 4 years needs about what yearly growth?", options: ["10%", "18%", "25%"], answer: 1, explain: "Rule of 72: 72 divided by 4." },
    { id: "n3", category: "Numbers", q: "Profit falls from $40M to $34M. What percent drop?", options: ["6%", "15%", "18%"], answer: 1, explain: "$6M lost out of the starting $40M." },
    { id: "n4", category: "Numbers", q: "2.5 times your money in 5 years is about what yearly return?", options: ["10%", "20%", "35%"], answer: 1, explain: "1.2 to the fifth power is about 2.5." },
];

/** Driver Detective: Exhibit A's mysteries. Each district draws one. */
export interface Mystery {
    title: string;
    clues: [string, string, string];
    culprit: "Price" | "Volume" | "Mix" | "Cost";
    proof: number;
}

export const MYSTERIES: Mystery[] = [
    { title: "A bakery's revenue fell 10%", clues: ["Loaves sold held flat at 2,000 a week", "Average price per loaf fell from $5.00 to $4.50", "A new bakery opened two blocks away"], culprit: "Price", proof: 1 },
    { title: "A gym's revenue fell 12%", clues: ["Monthly fee stayed at $50", "Members fell from 1,000 to 880", "The lobby was repainted"], culprit: "Volume", proof: 1 },
    { title: "A coffee cart's profit fell 20% on flat revenue", clues: ["Cups sold and prices both unchanged", "Milk cost per cup doubled, from $0.40 to $0.80", "The barista changed the playlist"], culprit: "Cost", proof: 1 },
    { title: "A bookstore's revenue fell 8%", clues: ["Books sold held flat, and no title changed price", "Hardcovers ($30) fell from half of sales to 30%, replaced by paperbacks ($20)", "Store hours didn't change"], culprit: "Mix", proof: 1 },
];

/** The finale's Guided Door: five fixed questions on one new case. */
export const GUIDED_DOOR: { intro: L[]; steps: { label: string; q: string; options: Choice[]; explain: string }[] } = {
    intro: [
        ["guided", "A city hospital's profit fell 10% this year. I'll ask. You answer. In order."],
    ],
    steps: [
        {
            label: "Structure",
            q: "How would you structure it?",
            options: [
                { text: "Is it revenue (visits, payer mix, price per visit), cost (staff, supplies), and is it the hospital or the whole region?", ok: true },
                { text: "Market, competition, customers, product", reply: [["guided", "A recited framework. Tailor it to the hospital."]] },
                { text: "Revenue. Cost.", reply: [["guided", "Labels, not questions."]] },
            ],
            explain: "",
        },
        {
            label: "Brainstorm",
            q: "What could make staff costs rise?",
            options: [
                { text: "Two groups: more hours (overtime, agency nurses, longer stays) and higher pay (wage inflation, bonuses, new contracts)", ok: true },
                { text: "Overtime, bonuses, longer stays, agency nurses, contracts, wages", reply: [["guided", "Good ideas, no order. Group them first."]] },
                { text: "People cost money", reply: [["guided", "True, and not useful."]] },
            ],
            explain: "",
        },
        {
            label: "Exhibit",
            q: "The chart shows patient visits flat, while agency nurse spending tripled. What do you say first?",
            options: [
                { text: "Volume isn't the problem. Agency staffing is, so the fix is on the cost side.", ok: true },
                { text: "The chart has two lines and a blue legend.", reply: [["guided", "Insight first, then the details."]] },
                { text: "Visits are flat, so we need more patients.", reply: [["guided", "Visits didn't cause the drop."]] },
            ],
            explain: "",
        },
        {
            label: "Math",
            q: "Agency spending went from $5M to $15M. Profit was $100M and fell 10%. How much of the drop does agency spending explain?",
            options: [{ text: "About half" }, { text: "All of it", ok: true }, { text: "None of it" }],
            explain: "$10M more on agency nurses, and profit fell $10M.",
        },
        {
            label: "Synthesis",
            q: "Your recommendation?",
            options: [
                { text: "Profit fell because agency nurse spending rose $10M, which explains the whole drop. Hire permanent nurses to replace agency shifts. The risk is the hiring timeline, so start with the units that use the most agency hours.", ok: true },
                { text: "Hospitals are complicated, so I'd keep studying.", reply: [["guided", "Answer first."]] },
                { text: "Cut nurses.", reply: [["guided", "That would hurt care. Replace agency with permanent staff instead."]] },
            ],
            explain: "",
        },
    ],
};

/** The finale's Open Door: you lead. */
export const OPEN_DOOR: { prompt: L[]; ask: { q: string; options: Choice[] }; data: string; sowhat: { options: Choice[] }; close: L[] } = {
    prompt: [["open", "A museum's attendance fell 20% after it made entry free."], ["open", "..."], ["gus", "That's all you get. Lead it."]],
    ask: {
        q: "What data do you ask for first?",
        options: [
            { text: "Visitors by group (members, tourists, school trips), before and after", ok: true },
            { text: "The museum's logo", reply: [["open", "..."], ["gus", "The door is unimpressed."]] },
            { text: "Everything you have", reply: [["open", "That's not leading. That's waiting."]] },
        ],
    },
    data: "Tourists up 10%. Members down 60%: with free entry, a membership no longer gets them anything.",
    sowhat: {
        options: [
            { text: "Free entry broke the membership deal, so members left. Give members something worth paying for again.", ok: true },
            { text: "Tourists are up, so everything's fine.", reply: [["open", "Members are down 60%. Not fine."]] },
            { text: "Bring back the entry fee for tourists.", reply: [["open", "Tourists are the part that's working."]] },
        ],
    },
    close: [["open", "You asked for what you needed instead of waiting for it."], ["narrator", "The Open Door swings all the way open."]],
};

/** The Blank Page: the last case. One prompt is drawn at random. */
export interface BlankPrompt {
    prompt: string;
    scaffold: number;
    buckets: { text: string; good: boolean }[];
}

export const SCAFFOLDS = [
    "Objective, options, criteria (any decision with several paths)",
    "Stakeholders or value chain walk (public sector, healthcare, many parties)",
    "Drivers tree (one metric to move)",
];

export const BLANK_PROMPTS: BlankPrompt[] = [
    {
        prompt: "A city wants to cut ER wait times in half.",
        scaffold: 2,
        buckets: [
            { text: "Are more patients arriving, or arriving at different times?", good: true },
            { text: "Are there enough staff and beds when they arrive?", good: true },
            { text: "Where inside the ER do patients wait longest?", good: true },
            { text: "Market", good: false },
            { text: "Revenue and costs", good: false },
            { text: "Competition", good: false },
        ],
    },
    {
        prompt: "A water utility must cut emissions 30% by 2030.",
        scaffold: 2,
        buckets: [
            { text: "Which activities create the most emissions?", good: true },
            { text: "How can each activity use less energy?", good: true },
            { text: "Can the energy itself come from cleaner sources?", good: true },
            { text: "Customers", good: false },
            { text: "Price, product, place, promotion", good: false },
            { text: "Profit equals revenue minus cost", good: false },
        ],
    },
    {
        prompt: "A school district wants more students to finish high school.",
        scaffold: 1,
        buckets: [
            { text: "Which students are leaving, and at what grade?", good: true },
            { text: "What do teachers, families and students say is the cause?", good: true },
            { text: "What has worked in similar districts, and what would it cost?", good: true },
            { text: "Market size", good: false },
            { text: "Synergies", good: false },
            { text: "Competition", good: false },
        ],
    },
];

export const GAUGE_REPLAY: Record<string, string> = {
    structure: "margin_market",
    analytics: "abacus_heights",
    judgment: "vault",
    communication: "runway_row",
    presence: "border_docks",
};
