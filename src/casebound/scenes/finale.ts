import { DISTRICTS } from "../content/places";
import { BLANK_PROMPTS, GAUGE_REPLAY, GUIDED_DOOR, OPEN_DOOR, QUIZ, SCAFFOLDS } from "../content/minigames";
import { PLACES } from "../content/places";
import { clearedCount, commit, save } from "../save";
import type { Choice, Gauges, L } from "../types";
import { makeButton, stars, tablePanel, toast } from "../ui";
import type { PlaceScene } from "./PlaceScene";
import { rand } from "../rng";

export const QUIZ_UNLOCK = 4;

export function quizUnlocked(): boolean {
    return save().unlockAll || clearedCount() >= QUIZ_UNLOCK;
}

export function finaleUnlocked(): boolean {
    return save().unlockAll || clearedCount() >= DISTRICTS.length;
}

/** Asks until right; returns whether it was right on the first try. */
async function untilRight(scene: PlaceScene, title: string, prompt: string, options: Choice[], card?: string): Promise<boolean> {
    const disabled = new Set<number>();
    let first = true;
    for (;;) {
        const [i] = await scene.choose({ title, prompt, options: options.map((o) => o.text), disabled, card });
        const o = options[i];
        if (o.reply) await scene.talk(o.reply);
        if (o.ok) return first;
        first = false;
        disabled.add(i);
    }
}

// ---------- The base of the skyline: Case Quiz and the Two Doors ----------

export async function runDoors(scene: PlaceScene): Promise<void> {
    const s = save();
    // The doors are painted into the background; these invisible zones make them clickable.
    const guided = scene.add.zone(260, 60, 320, 460).setOrigin(0, 0).setInteractive({ useHandCursor: true });
    const open = scene.add.zone(760, 260, 190, 300).setOrigin(0, 0).setInteractive({ useHandCursor: true });
    const doorClick = () => scene.run(() => doorsMenu(scene));
    guided.on("pointerup", doorClick);
    open.on("pointerup", doorClick);

    // The quiz plaque.
    const plaque = scene.add.container(0, 0).setDepth(8);
    const img = scene.add.image(640, 90, "ui_quiz_button").setScale(0.42);
    const label = scene.add
        .text(640, 90, quizUnlocked() ? "CASE QUIZ" : `CASE QUIZ\n(clear ${QUIZ_UNLOCK} districts)`, {
            fontFamily: '"Trebuchet MS", sans-serif',
            fontSize: quizUnlocked() ? "26px" : "18px",
            fontStyle: "bold",
            color: "#fff1c9",
            align: "center",
            stroke: "#3b1d08",
            strokeThickness: 4,
        })
        .setOrigin(0.5);
    plaque.add([img, label]);
    if (quizUnlocked()) {
        img.setInteractive({ useHandCursor: true });
        img.on("pointerup", () => scene.run(() => caseQuiz(scene)));
    }

    if (finaleUnlocked() && !s.finaleDone) {
        await finale(scene);
        return;
    }
    await scene.talk([
        ["narrator", "Two doors stand at the base of the skyline. One is grand and formal. One is plain and waiting."],
        finaleUnlocked()
            ? ["gus", "Click a door to run the finale again, or the plaque for a Case Quiz."]
            : quizUnlocked()
              ? ["gus", "The doors run a game show! Click the plaque. The finale opens once all eight districts are cleared."]
              : ["gus", `The doors open once all eight districts are cleared. The quiz opens after ${QUIZ_UNLOCK}.`],
    ]);
}

async function doorsMenu(scene: PlaceScene): Promise<void> {
    if (!finaleUnlocked()) {
        await scene.talk([
            ["guided", "Not yet. Clear every district first."],
            ["open", "..."],
            ["gus", `${DISTRICTS.length - clearedCount()} to go.`],
        ]);
        return;
    }
    await finale(scene);
}

export async function caseQuiz(scene: PlaceScene): Promise<void> {
    const s = save();
    const pool = [...QUIZ].sort(() => rand() - 0.5).slice(0, 4);
    await scene.talk([
        ["guided", "Welcome to Case Quiz, the only game show where the prize is a better first sentence."],
        ["open", "I'm the co-host. I don't get a script."],
        ["guided", "You never wanted one."],
    ]);
    let score = 0;
    for (const [n, q] of pool.entries()) {
        const disabled = new Set<number>();
        for (let attempt = 0; ; attempt++) {
            const [i] = await scene.choose({ title: `Case Quiz: ${q.category} (${n + 1} of 4)`, prompt: q.q, options: q.options, disabled });
            if (i === q.answer) {
                score += attempt === 0 ? 1 : 0.5;
                if (attempt === 0 && !s.quizCorrect.includes(q.id)) s.quizCorrect.push(q.id);
                await scene.talk([attempt === 0 ? ["guided", "Correct. In exactly the order I expected."] : ["open", "Correct, and you got there yourself."]]);
                break;
            }
            disabled.add(i);
            await scene.talk([
                ["guided", `Not quite. ${q.explain}`],
                ["open", "Close. Want another swing?"],
            ]);
        }
    }
    s.quizBest = Math.max(s.quizBest, score);
    commit();
    await scene.talk([
        ["guided", `That's the round. ${score} out of 4.`],
        ["open", "Come back anytime. The door's open."],
        ["guided", "He's been waiting all night to say that."],
    ]);
    if (s.quizCorrect.length >= QUIZ.length) toast(scene, "Title earned: Game Show Champion");
}

async function finale(scene: PlaceScene): Promise<void> {
    await scene.talk([
        ["narrator", "Two doors stand at the base of the skyline."],
        ["gus", "The Guided Door asks the questions, in order. The Open Door just waits for you to lead."],
        ["gus", "Real interviews come in both flavors. You need both doors to reach the top."],
    ]);
    // Guided Door: interviewer-led.
    await scene.talk(GUIDED_DOOR.intro);
    for (const step of GUIDED_DOOR.steps) {
        const first = await untilRight(scene, `The Guided Door: ${step.label}`, step.q, step.options);
        if (step.explain) await scene.talk([["guided", step.explain]]);
        if (first && step.label === "Brainstorm") await scene.talk([["guided", "Very few people structure a brainstorm."]]);
    }
    await scene.talk([["guided", "Correct. In exactly the order I expected."], ["narrator", "The Guided Door creaks open."]]);
    // Open Door: candidate-led.
    await scene.talk(OPEN_DOOR.prompt);
    await untilRight(scene, "The Open Door", OPEN_DOOR.ask.q, OPEN_DOOR.ask.options);
    await untilRight(scene, "The Open Door", "Here's the data. What's the so what?", OPEN_DOOR.sowhat.options, OPEN_DOOR.data);
    await scene.talk(OPEN_DOOR.close);
    await scene.talk([["gus", "Both doors are open. Up we go."]]);
    scene.go("rooftop");
}

// ---------- The top of the skyline: The Blank Page ----------

export async function runRooftop(scene: PlaceScene): Promise<void> {
    const blank = scene.addBlank();
    const shake = () => scene.tweens.add({ targets: blank, x: blank.x + 8, duration: 60, yoyo: true, repeat: 3 });
    await scene.talk([
        ["blank", "Don't come closer. Everyone who comes up here writes a framework on me."],
        ["blank", "Profit equals revenue minus cost. Market, competition, customers. The same boxes, over and over."],
        ["blank", "Then they leave, and I'm full of boxes that don't answer anything."],
        ["wren", "That's why you're blank?"],
        ["blank", "I erase myself. It's safer than being wrong."],
        ["gus", "I've drawn a lot of wrong boxes too."],
        ["wren", "What if we don't start with boxes? What if we start with the question?"],
        ["blank", "I don't have one."],
        ["wren", "Then tell me what's bothering you, in one sentence. That's always the first step."],
    ]);
    const bp = BLANK_PROMPTS[Math.floor(rand() * BLANK_PROMPTS.length)];
    await scene.talk([["blank", bp.prompt]]);
    await untilRight(
        scene,
        "The Last Case",
        `"${bp.prompt}" No deck this time. First, pick a scaffold.`,
        SCAFFOLDS.map((text, i) => ({
            text,
            ok: i === bp.scaffold,
            reply: i === bp.scaffold ? undefined : ([["blank", "Hmm. That doesn't quite fit me."]] as L[]),
        })),
    );
    let good = 0;
    const used = new Set<number>();
    while (good < 3) {
        const [i] = await scene.choose({
            title: `The Last Case: bucket ${good + 1} of 3`,
            prompt: `"${bp.prompt}" Pick a bucket, phrased as a question that fits this problem.`,
            options: bp.buckets.map((b) => b.text),
            disabled: used,
        });
        used.add(i);
        if (bp.buckets[i].good) {
            good += 1;
            scene.setBlank(good === 3 ? "gold" : "glow");
            if (good === 2) blank.setScale(0.58);
            await scene.talk([["blank", good === 1 ? "Oh. That one fits me." : good === 2 ? "And that one. I feel... less empty." : "I'm not blank anymore. And I'm not just boxes, either."]]);
        } else {
            shake();
            await scene.talk([["blank", "*Flinches.* That's one of the old boxes. It doesn't answer my question."]]);
        }
    }
    await scene.talk([
        ["wren", "You're a structure."],
        ["blank", "Will you come back?"],
        ["wren", "Every time I get a new case."],
    ]);
    if (save().cards.length >= 9) {
        await scene.talk([
            ["blank", "Is that... an album? With all nine cards?"],
            ["gus", "My best work."],
            ["blank", "May I keep the first one? So I always remember how to start."],
            ["narrator", "Wren hands over the first card: \"Restate the goal with a metric and a timeframe.\""],
        ]);
    }
    const s = save();
    s.finaleDone = true;
    commit();
    scene.go("ending");
}

// ---------- The ending and the rank screen ----------

export async function runEnding(scene: PlaceScene): Promise<void> {
    await scene.talk([
        ["narrator", "The page glows white and gold. And then..."],
        ["narrator", "Wren wakes at her desk at 6 a.m. The casebook is open to a blank sheet."],
        ["wren", "One line first. The objective."],
        ["narrator", "She writes it down, and smiles."],
    ]);
    await rankScreen(scene);
}

const GAUGE_NAMES: Record<keyof Gauges, string> = {
    structure: "Structure",
    analytics: "Analytics",
    judgment: "Judgment",
    communication: "Communication",
    presence: "Presence",
};

export function rankTitle(total: number): string {
    if (total >= 160) return "Partner";
    if (total >= 100) return "Engagement Manager";
    if (total >= 40) return "Associate";
    return "Analyst";
}

async function rankScreen(scene: PlaceScene): Promise<void> {
    const s = save();
    const results = Object.values(s.results);
    const sums: Gauges = { structure: 0, analytics: 0, judgment: 0, communication: 0, presence: 0 };
    let total = 0;
    for (const r of results) {
        for (const k of Object.keys(sums) as (keyof Gauges)[]) sums[k] += r[k];
        total += r.total;
    }
    const keys = Object.keys(sums) as (keyof Gauges)[];
    const weakest = [...keys].sort((a, b) => sums[a] - sums[b])[0];
    const max = results.length * 5 || 5;
    const footer = [
        `Weakest: ${GAUGE_NAMES[weakest]}. Try ${PLACES[GAUGE_REPLAY[weakest]].title} again.`,
        `Framework Cards: ${s.cards.length} / 9    Driver Detective: ${s.detectives.length} / 8`,
        s.quizCorrect.length >= 12 ? "Title: Game Show Champion" : `Case Quiz best: ${s.quizBest} / 4`,
    ].join("\n");
    let toMap = false;
    await tablePanel(
        scene,
        "Casebound: your rank",
        `${rankTitle(total)}  ·  ${total} of 200 stars`,
        keys.map((k) => [GAUGE_NAMES[k], `${stars((sums[k] / max) * 5)}   ${sums[k]} / ${max}`] as [string, string]),
        footer,
        [{ label: "Back to the map", onClick: () => (toMap = true) }, { label: "Watch the sunrise" }],
        720,
    );
    if (toMap) {
        scene.toMap();
        return;
    }
    // Watching the sunrise: a quiet moment, then a way back so the ending is never a dead end.
    await scene.talk([["narrator", "The sun comes up over the hills. Somewhere, a vending machine hums happily."]]);
    const bar = scene.add.container(0, 0).setDepth(9000);
    makeButton(scene, bar, 640 - 120, 640, 240, "Back to the map", () => scene.toMap(), { center: true, fontSize: 20, fill: 0xffd23f });
    makeButton(scene, bar, 640 - 120, 580, 240, "See my rank again", () => scene.run(() => rankScreen(scene)), { center: true, fontSize: 18 });
}
