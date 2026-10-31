/// <reference types="node" />
/**
 * Content checks. The game is mostly data, and a typo in the data usually doesn't crash anything:
 * it just leaves a player stuck in a choice they can never get right, or talking to a missing sprite.
 * These tests catch that class of mistake before it ships.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { IMAGES } from "./assets";
import { CASES } from "./content/cases";
import { BLANK_PROMPTS, GAUGE_REPLAY, GUIDED_DOOR, MYSTERIES, OPEN_DOOR, QUIZ, SCAFFOLDS } from "./content/minigames";
import { DISTRICTS, PLACES } from "./content/places";
import { caseboundSpeakerDefs } from "./speakerDefs";
import type { Choice, L } from "./types";

/** Vitest runs from the repo root. */
const ROOT = process.cwd();
const SPEAKERS = new Set(Object.keys(caseboundSpeakerDefs()));

/** Keys whose values are lists of dialogue lines. */
const LINE_KEYS = new Set(["prompt", "restate", "reply", "coach", "after", "partner", "intro", "close", "doneLines"]);

/** Every dialogue line anywhere inside a content value, with a path for the error message. */
function linesIn(value: unknown, path: string, out: { path: string; line: L }[] = []): { path: string; line: L }[] {
    if (Array.isArray(value)) {
        value.forEach((v, i) => linesIn(v, `${path}[${i}]`, out));
    } else if (value && typeof value === "object") {
        for (const [k, v] of Object.entries(value)) {
            const p = `${path}.${k}`;
            if ((LINE_KEYS.has(k) || path.endsWith(".tutorial")) && Array.isArray(v) && v.every((x) => Array.isArray(x))) {
                (v as unknown as L[]).forEach((line, i) => out.push({ path: `${p}[${i}]`, line }));
                v.forEach((x, i) => linesIn(x, `${p}[${i}]`, out));
            } else {
                linesIn(v, p, out);
            }
        }
    }
    return out;
}

/** A choice list the game loops on until the player picks a right answer. */
function expectAnswerable(options: Choice[], where: string, allowPartial = true): void {
    const right = options.filter((o) => o.ok || (allowPartial && o.partial));
    expect(right.length, `${where}: no right answer, so the player could never finish it`).toBeGreaterThan(0);
    const best = options.filter((o) => o.ok);
    expect(best.length, `${where}: every option is fully right, so the choice teaches nothing`).toBeLessThan(options.length);
    for (const o of options) expect(o.text.trim().length, `${where}: empty option text`).toBeGreaterThan(0);
}

describe("art", () => {
    it("every image the game loads exists in public/", () => {
        const missing = Object.entries(IMAGES).filter(([, url]) => !existsSync(join(ROOT, "public", url)));
        expect(missing, `missing files: ${missing.map(([k, u]) => `${k} -> public/${u}`).join(", ")}`).toEqual([]);
    });

    it("every texture key a place uses is loaded", () => {
        const bad: string[] = [];
        for (const p of Object.values(PLACES)) {
            if (!IMAGES[p.bg]) bad.push(`${p.id}.bg ${p.bg}`);
            if (p.host && !IMAGES[p.host.key]) bad.push(`${p.id}.host ${p.host.key}`);
            for (const prop of p.props) if (!IMAGES[prop.key]) bad.push(`${p.id}.${prop.id} ${prop.key}`);
        }
        expect(bad).toEqual([]);
    });

    it("every quoted texture key in the game code is loaded", () => {
        const dir = join(ROOT, "src", "casebound");
        const files = readdirSync(dir, { recursive: true, encoding: "utf8" }).filter((f: string) => f.endsWith(".ts") && !f.endsWith(".test.ts"));
        const bad: string[] = [];
        for (const f of files) {
            const src = readFileSync(join(dir, f), "utf8");
            for (const m of src.matchAll(/["'`]((?:room|char|prop|talk|ui|blank)_[a-z0-9_]+)["'`]/g)) {
                if (!IMAGES[m[1]]) bad.push(`${f}: ${m[1]}`);
            }
        }
        expect(bad).toEqual([]);
    });
});

describe("speakers", () => {
    it("every talking character's mouth pictures are loaded", () => {
        const bad: string[] = [];
        for (const [id, def] of Object.entries(caseboundSpeakerDefs())) {
            for (const [mouth, key] of Object.entries(def.mouths ?? {})) if (!IMAGES[key as string]) bad.push(`${id}.${mouth}: ${key}`);
        }
        expect(bad).toEqual([]);
    });
});

describe("dialogue", () => {
    it("every line has a registered speaker and some text", () => {
        const all = [
            ...linesIn(CASES, "CASES"),
            ...linesIn(PLACES, "PLACES"),
            ...linesIn({ GUIDED_DOOR, OPEN_DOOR }, "minigames"),
        ];
        expect(all.length).toBeGreaterThan(200);
        const bad = all.filter(({ line }) => !SPEAKERS.has(line[0]) || !line[1]?.trim()).map(({ path, line }) => `${path}: ${JSON.stringify(line)}`);
        expect(bad).toEqual([]);
    });

    it("every speaker written inline in the scene code is registered", () => {
        const dir = join(ROOT, "src", "casebound", "scenes");
        const bad: string[] = [];
        for (const f of readdirSync(dir).filter((x: string) => x.endsWith(".ts"))) {
            const src = readFileSync(join(dir, f), "utf8");
            // A dialogue tuple: ["speaker", "a line with at least one space"].
            for (const m of src.matchAll(/\[\s*"([a-z_]+)",\s*["`][^"`\n]* [^"`\n]*["`]\s*\]/g)) if (!SPEAKERS.has(m[1])) bad.push(`${f}: ${m[1]}`);
        }
        expect(bad).toEqual([]);
    });
});

describe("cases", () => {
    it("ids match their keys", () => {
        for (const [k, c] of Object.entries(CASES)) expect(c.id, k).toBe(k);
    });

    for (const c of Object.values(CASES)) {
        describe(c.id, () => {
            it("host is a registered speaker", () => expect(SPEAKERS.has(c.host), c.host).toBe(true));

            it("every objective row is answerable", () => {
                expect(c.objective.length).toBeGreaterThan(0);
                c.objective.forEach((row, i) => expectAnswerable(row.options, `objective[${i}] ${row.label}`));
            });

            it("has enough lanterns to spend and enough useful ones to earn full Judgment", () => {
                expect(c.lanterns.length).toBeGreaterThanOrEqual(3);
                expect(c.lanterns.filter((l) => l.useful).length).toBeGreaterThanOrEqual(2);
            });

            it("board can be completed exactly, and has decoys", () => {
                const critical = c.board.buckets.filter((b) => b.critical).length;
                expect(c.board.min).toBeLessThanOrEqual(c.board.max);
                expect(critical, "critical buckets must fit between min and max picks").toBeGreaterThanOrEqual(c.board.min);
                expect(critical).toBeLessThanOrEqual(c.board.max);
                expect(c.board.buckets.length, "no decoys").toBeGreaterThan(critical);
            });

            it("flag, data, math and close are answerable", () => {
                expectAnswerable(c.start.options, "start");
                expectAnswerable(c.hypothesis.options, "hypothesis");
                expectAnswerable(c.data.options, "data");
                expectAnswerable(c.math.options, "math");
                expectAnswerable(c.close.options, "close");
            });

            it("has three hint levels", () => {
                expect(c.hints).toHaveLength(3);
                for (const h of c.hints) expect(h.trim().length).toBeGreaterThan(0);
            });
        });
    }
});

describe("places", () => {
    it("ids match their keys", () => {
        for (const [k, p] of Object.entries(PLACES)) expect(p.id, k).toBe(k);
    });

    it("every district has a host, a case, a card and an Exhibit A spot", () => {
        for (const d of DISTRICTS) {
            const p = PLACES[d];
            expect(p, d).toBeDefined();
            expect(p.host, `${d} host`).toBeDefined();
            expect(SPEAKERS.has(p.host!.speaker), `${d} host speaker ${p.host!.speaker}`).toBe(true);
            expect(p.caseId && CASES[p.caseId], `${d} case ${p.caseId}`).toBeTruthy();
            expect(p.card, `${d} card`).toBeDefined();
            expect(p.exhibit, `${d} exhibit`).toBeDefined();
        }
    });

    it("nine Framework Cards in all (the album holds nine)", () => {
        expect(Object.values(PLACES).filter((p) => p.card).length).toBe(9);
    });

    it("everything sits on the 1280x720 screen", () => {
        const off: string[] = [];
        const check = (where: string, x: number, y: number) => {
            if (x < 0 || x > 1280 || y < 0 || y > 720) off.push(`${where} (${x}, ${y})`);
        };
        for (const p of Object.values(PLACES)) {
            check(`${p.id}.wren`, p.wrenX, 700);
            if (p.gusX !== undefined) check(`${p.id}.gus`, p.gusX, 700);
            if (p.host) check(`${p.id}.host`, p.host.x, p.host.y ?? 700);
            for (const prop of p.props) check(`${p.id}.${prop.id}`, prop.x, prop.y);
            if (p.card) {
                check(`${p.id}.card.a`, p.card.a.x, p.card.a.y);
                check(`${p.id}.card.b`, p.card.b.x, p.card.b.y);
            }
            if (p.exhibit) check(`${p.id}.exhibit`, p.exhibit.x, p.exhibit.y);
        }
        expect(off).toEqual([]);
    });

    it("every prop has at least one line", () => {
        for (const p of Object.values(PLACES)) for (const prop of p.props) expect(prop.lines.length, `${p.id}.${prop.id}`).toBeGreaterThan(0);
    });
});

describe("minigames", () => {
    it("Case Quiz has enough questions for a round, each with a valid answer", () => {
        expect(QUIZ.length).toBeGreaterThanOrEqual(4);
        expect(new Set(QUIZ.map((q) => q.id)).size).toBe(QUIZ.length);
        for (const q of QUIZ) {
            expect(q.answer, q.id).toBeGreaterThanOrEqual(0);
            expect(q.answer, q.id).toBeLessThan(q.options.length);
        }
    });

    it("Driver Detective proofs point at a real clue", () => {
        for (const m of MYSTERIES) expect(m.clues[m.proof], m.title).toBeDefined();
    });

    it("both finale doors are answerable (they need a fully right answer, not a partial)", () => {
        GUIDED_DOOR.steps.forEach((s) => expectAnswerable(s.options, `guided ${s.label}`, false));
        expectAnswerable(OPEN_DOOR.ask.options, "open ask", false);
        expectAnswerable(OPEN_DOOR.sowhat.options, "open so-what", false);
    });

    it("every Blank Page prompt has a valid scaffold and at least three good buckets", () => {
        for (const b of BLANK_PROMPTS) {
            expect(SCAFFOLDS[b.scaffold], b.prompt).toBeDefined();
            expect(b.buckets.filter((x) => x.good).length, b.prompt).toBeGreaterThanOrEqual(3);
        }
    });

    it("the rank screen's replay suggestions point at real districts", () => {
        for (const [gauge, id] of Object.entries(GAUGE_REPLAY)) expect(PLACES[id], `${gauge} -> ${id}`).toBeDefined();
    });
});
