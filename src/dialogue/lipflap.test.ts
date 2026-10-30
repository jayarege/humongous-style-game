import { describe, expect, it } from "vitest";
import { mouthAt, mouthFor, normalizeText, revealedAt, timeLine } from "./lipflap";

describe("mouthFor", () => {
    it("maps vowels, lip consonants, other letters and punctuation", () => {
        expect(mouthFor("a")).toBe("open");
        expect(mouthFor("O")).toBe("open");
        expect(mouthFor("m")).toBe("closed");
        expect(mouthFor("B")).toBe("closed");
        expect(mouthFor("t")).toBe("half");
        expect(mouthFor(" ")).toBe("half");
        expect(mouthFor(".")).toBe("closed");
        expect(mouthFor("!")).toBe("closed");
    });
});

describe("timeLine", () => {
    const line = timeLine("Mmm, a bubble pop!");

    it("collapses whitespace", () => {
        expect(normalizeText("  Hi   there \n friend ")).toBe("Hi there friend");
        expect(timeLine("Hi   there").text).toBe("Hi there");
    });

    it("gives every character a non-decreasing reveal time starting at 0", () => {
        expect(line.charTimes.length).toBe(line.text.length);
        expect(line.charTimes[0]).toBe(0);
        for (let i = 1; i < line.charTimes.length; i++) {
            expect(line.charTimes[i]).toBeGreaterThanOrEqual(line.charTimes[i - 1]);
        }
        expect(line.duration).toBeGreaterThan(line.charTimes[line.charTimes.length - 1]);
    });

    it("starts closed on M and ends closed", () => {
        expect(line.mouth[0]).toEqual({ t: 0, state: "closed" });
        expect(line.mouth[line.mouth.length - 1].state).toBe("closed");
        expect(mouthAt(line, line.duration + 10)).toBe("closed");
    });

    it("actually flaps: uses more than one shape and opens at some point", () => {
        const states = new Set(line.mouth.map((s) => s.state));
        expect(states.has("open")).toBe(true);
        expect(states.size).toBeGreaterThan(1);
    });

    it("never holds a shape shorter than minHold, except the final close", () => {
        const minHold = 75;
        const m = timeLine("Hello there, little friend. Have you seen my shiny blue marble?", { minHoldMs: minHold });
        for (let i = 0; i < m.mouth.length - 2; i++) {
            expect(m.mouth[i + 1].t - m.mouth[i].t).toBeGreaterThanOrEqual(minHold - 0.001);
        }
    });

    it("never repeats the same shape in consecutive segments", () => {
        const m = timeLine("Ooo, aaa, eee! Wheee, what a day.");
        for (let i = 1; i < m.mouth.length; i++) {
            expect(m.mouth[i].state).not.toBe(m.mouth[i - 1].state);
        }
    });

    it("flaps at a cartoon rate (roughly 6 to 16 changes per second)", () => {
        const m = timeLine("Hello there, little friend. Have you seen my shiny blue marble anywhere around here?");
        const perSecond = m.mouth.length / (m.duration / 1000);
        expect(perSecond).toBeGreaterThan(6);
        expect(perSecond).toBeLessThan(16);
    });

    it("pauses after punctuation", () => {
        const m = timeLine("Hi. Yo", { jitter: 0 });
        const gapAfterDot = m.charTimes[3] - m.charTimes[2];
        const gapNormal = m.charTimes[1] - m.charTimes[0];
        expect(gapAfterDot).toBeGreaterThan(gapNormal * 3);
    });

    it("is deterministic for the same text", () => {
        expect(timeLine("Same line twice.")).toEqual(timeLine("Same line twice."));
    });

    it("reveals characters over time", () => {
        expect(revealedAt(line, -1)).toBe(0);
        expect(revealedAt(line, 0)).toBe(1);
        expect(revealedAt(line, line.duration)).toBe(line.text.length);
    });

    it("handles empty text", () => {
        const m = timeLine("   ");
        expect(m.text).toBe("");
        expect(m.duration).toBe(0);
        expect(mouthAt(m, 0)).toBe("closed");
    });
});
