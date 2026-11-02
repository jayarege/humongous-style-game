import type { Beat, CaseData, CaseResult, Choice, Gauges, L } from "./types";
import type { ChooseOptions } from "./ui";

/** What the case loop needs from the scene it runs in. */
export interface CaseCtx {
    talk(lines: readonly L[]): Promise<void>;
    choose(o: ChooseOptions): Promise<number[]>;
    notice(title: string, body: string, button?: string): Promise<void>;
}

const cap = (n: number) => Math.max(0, Math.min(5, Math.round(n * 2) / 2));

/**
 * The seven-beat case loop: prompt, objective, lanterns, board, flag, drive, close.
 * Wrong picks never end the case: they get a coaching reply and the option is greyed out for a retry.
 */
export async function runCase(ctx: CaseCtx, c: CaseData): Promise<CaseResult> {
    const g: Gauges = { structure: 0, analytics: 0, judgment: 0, communication: 0, presence: 0 };
    let mistakes = 0;
    let fixes = 0;
    let hintLevel = 0;

    const onHint = async () => {
        const line = c.hints[Math.min(hintLevel, 2)];
        if (hintLevel < 3) hintLevel += 1;
        await ctx.talk([["wren", `(thinking) ${line}`]]);
    };
    const tutorial = async (beat: Beat) => {
        const lines = c.tutorial?.[beat];
        if (lines) await ctx.talk(lines);
    };

    /** Asks until the player finds an ok (or partial) answer. Returns how it went. */
    const untilRight = async (
        base: Omit<ChooseOptions, "options" | "disabled">,
        options: Choice[],
        onPick?: (choice: Choice) => void,
    ): Promise<{ firstTry: boolean; partial: boolean; choice: Choice }> => {
        const disabled = new Set<number>();
        let first = true;
        for (let attempt = 0; ; attempt++) {
            const [i] = await ctx.choose({ ...base, options: options.map((o) => o.text), disabled, onHint });
            const choice = options[i];
            onPick?.(choice);
            if (choice.reply) await ctx.talk(choice.reply);
            if (choice.ok || choice.partial) {
                // Coachable: fixed right after the coaching.
                if (attempt === 1) fixes += 1;
                return { firstTry: first, partial: !choice.ok, choice };
            }
            if (!choice.reply) await ctx.talk([["gus", "Not quite. Try another one."]]);
            if (first) mistakes += 1;
            first = false;
            disabled.add(i);
        }
    };

    await ctx.notice(`Case: ${c.brief.company}`, c.brief.text, "Start the case");
    await ctx.talk(c.prompt);

    // 1. Lock the objective, one tile row at a time.
    await tutorial("objective");
    let lanterns = 3;
    for (const row of c.objective) {
        const r = await untilRight({ title: "Lock the Objective", prompt: `${row.label}: pick the tile that fits.`, card: c.brief.text }, row.options, (choice) => {
            if (choice.costsLantern) lanterns -= 1;
        });
        if (r.firstTry) g.structure += 1 / c.objective.length;
    }
    await ctx.talk(c.restate);

    // 2. Spend the Question Lanterns.
    await tutorial("lanterns");
    const asked = new Set<number>();
    let useful = 0;
    while (lanterns > 0) {
        const [i] = await ctx.choose({
            title: `Spend a Lantern (${lanterns} left)`,
            prompt: "Ask what the board can't answer by itself.",
            options: c.lanterns.map((l) => l.q),
            disabled: asked,
            onHint,
        });
        asked.add(i);
        lanterns -= 1;
        const lantern = c.lanterns[i];
        if (lantern.useful) useful += 1;
        await ctx.talk([["wren", lantern.q], ...lantern.reply]);
    }
    g.judgment += useful >= 2 ? 0 : -0.5;
    // Later steps lean on these facts, so the ones you skipped are handed over anyway, like an interviewer
    // filling you in. Asking for them yourself is what earns the Judgment star.
    const missed = c.lanterns.filter((l, i) => l.useful && !asked.has(i));
    if (missed.length) {
        await ctx.talk([
            ["gus", missed.length === 1 ? "You didn't ask this one, but you'll need it:" : "You didn't ask these, but you'll need them:"],
            ...missed.flatMap((l) => [["wren", l.q] as L, ...l.reply]),
        ]);
    }

    // 3. Build the board.
    await tutorial("board");
    const criticals = c.board.buckets.filter((b) => b.critical).length;
    let board: number[] = [];
    for (let attempt = 0; ; attempt++) {
        board = await ctx.choose({
            title: c.board.title,
            prompt: c.board.instruction,
            options: c.board.buckets.map((b) => b.text),
            multi: { min: c.board.min, max: c.board.max },
            onHint,
        });
        const got = board.filter((i) => c.board.buckets[i].critical).length;
        const decoys = board.filter((i) => !c.board.buckets[i].critical);
        if (attempt === 0) g.structure += Math.max(0, (4 * got) / criticals - decoys.length);
        if (decoys.length === 0 && got === criticals) {
            if (attempt > 0) fixes += 1;
            await ctx.talk([["gus", "If we answered every bucket, could we answer the question? ...Yes. Lovely board."]]);
            break;
        }
        if (attempt === 0) mistakes += 1;
        for (const i of decoys) {
            const coach = c.board.buckets[i].coach;
            if (coach) await ctx.talk(coach);
        }
        if (got < criticals) {
            await ctx.talk([["gus", "If we answered every bucket, could we answer the question? Something's still missing."]]);
        }
        if (attempt >= 1) {
            await ctx.talk([["gus", "Here's the board I'd use. Study it, then we keep going."]]);
            board = c.board.buckets.flatMap((b, i) => (b.critical ? [i] : []));
            break;
        }
        await ctx.talk([["gus", "Fix it up and submit again."]]);
    }
    await ctx.notice("Your board", board.map((i) => `•  ${c.board.buckets[i].text}`).join("\n"));

    // 4. Plant the flag: where to start, and the hypothesis.
    await tutorial("flag");
    const start = await untilRight({ title: "Plant the Flag", prompt: c.start.question }, c.start.options);
    if (start.firstTry) g.judgment += start.partial ? 1 : 2;
    const hyp = await untilRight({ title: "Plant the Flag", prompt: c.hypothesis.question }, c.hypothesis.options);
    if (hyp.firstTry) g.judgment += 3;
    await ctx.talk([["wren", `My hypothesis: ${hyp.choice.text}.`]]);

    // 5. Drive the case: a data card, then the math.
    await tutorial("drive");
    const data = await untilRight({ title: "Drive the Case", prompt: "New data. What's the so what?", card: c.data.card }, c.data.options);
    if (data.firstTry) {
        g.analytics += 2;
        g.communication += 2;
    }
    const math = await untilRight({ title: "Drive the Case", prompt: "Do the math.", card: c.math.q }, c.math.options);
    if (math.firstTry) g.analytics += 3;
    await ctx.talk([["wren", `That's ${math.choice.text}.`]]);

    // 6. Close: answer first.
    await tutorial("close");
    const close = await untilRight(
        { title: "Close the Case", prompt: "Pick the recommendation you'd give. Answer first.", width: 760 },
        c.close.options,
    );
    g.communication += close.firstTry ? 3 : 1;
    await ctx.talk([["wren", close.choice.text], ...c.close.after]);

    // 7. The Partner's Question.
    await ctx.talk(c.partner);

    // Presence: every mistake that wasn't fixed on the very next try costs a star.
    g.presence = 5 - (mistakes - fixes);
    const gauges: Gauges = {
        structure: cap(g.structure),
        analytics: cap(g.analytics),
        judgment: cap(g.judgment),
        communication: cap(g.communication),
        presence: cap(g.presence),
    };
    const hints = hintLevel;
    const total = Math.max(
        0,
        gauges.structure + gauges.analytics + gauges.judgment + gauges.communication + gauges.presence - hints * 0.5,
    );
    return { ...gauges, total, hints };
}
