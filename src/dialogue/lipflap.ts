/**
 * Text-driven lip flap.
 *
 * Humongous games shipped a time-coded "talk state" track with every speech clip (the SBNG block) and the costume
 * picked mouth frames from it. We have no audio, so we build the same kind of track from the text itself: the
 * typewriter reveals one glyph at a time, and each glyph maps to one of three mouth images.
 *
 *   vowels (a e i o u y)           -> open
 *   lips together (m b p)          -> closed
 *   every other letter             -> half
 *   spaces                         -> half (a quick relaxed beat between words)
 *   punctuation                    -> closed, plus a reading pause
 *
 * At ~38 characters/second a glyph lasts ~26 ms, faster than an eye can read a mouth change. So the track is cut
 * into fixed "beats" of `minHoldMs` (75 ms by default). Each beat shows the most open shape among the glyphs that
 * appear during it; a beat with no new glyphs (a punctuation pause) is closed. Two open beats in a row become
 * open then half, so long vowel runs still visibly move. That lands at roughly 6 to 13 mouth changes per second,
 * the cadence of classic cartoon lip flap.
 *
 * Everything here is pure and deterministic (seeded from the text), so it is unit tested in lipflap.test.ts.
 */

export type MouthState = "closed" | "half" | "open";

export interface MouthSegment {
    /** Start time in ms from the start of the line. */
    t: number;
    state: MouthState;
}

export interface LineTiming {
    /** The text actually shown (whitespace collapsed). */
    text: string;
    /** `charTimes[i]` = ms after the line starts when character (code unit) i appears. */
    charTimes: number[];
    /** Mouth track, sorted by `t`, always starting at 0 and ending on `closed`. Consecutive states always differ. */
    mouth: MouthSegment[];
    /** Time (ms) when the last character has been shown and the mouth closes. */
    duration: number;
}

export interface TimingOptions {
    /** Characters revealed per second. 30 to 45 suits a kids' game. */
    cps?: number;
    /** Length of one mouth beat in ms: the shortest time a shape is held. 60 to 90 looks right. */
    minHoldMs?: number;
    /** +/- fraction of random variation on each character's duration, so speech does not look mechanical. */
    jitter?: number;
    /** Seed for the variation. Defaults to a hash of the text, so the same line always flaps the same way. */
    seed?: number;
}

const OPEN = new Set("aeiouyAEIOUY");
const CLOSED = new Set("mbpMBP");
/** Extra pause after punctuation, in ms. */
const PAUSES: Record<string, number> = {
    ".": 320,
    "!": 320,
    "?": 320,
    ",": 160,
    ";": 200,
    ":": 200,
    "…": 450,
    "-": 120,
};

const OPENNESS: Record<MouthState, number> = { closed: 0, half: 1, open: 2 };

/** Collapse runs of whitespace into single spaces and trim. The text box relies on this for wrapping. */
export function normalizeText(text: string): string {
    return text.replace(/\s+/g, " ").trim();
}

/** Mouth shape for one character, ignoring timing. */
export function mouthFor(ch: string): MouthState {
    if (ch === " ") return "half";
    if (PAUSES[ch] !== undefined) return "closed";
    if (CLOSED.has(ch)) return "closed";
    if (OPEN.has(ch)) return "open";
    if (/\p{L}|\p{N}/u.test(ch)) return "half";
    return "closed";
}

/** Small fast seeded PRNG (mulberry32). */
function rng(seed: number): () => number {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function hash(text: string): number {
    let h = 2166136261;
    for (let i = 0; i < text.length; i++) {
        h ^= text.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

/**
 * Build the reveal schedule and mouth track for one line of dialogue.
 */
export function timeLine(raw: string, opts: TimingOptions = {}): LineTiming {
    const text = normalizeText(raw);
    const cps = opts.cps ?? 38;
    const beat = opts.minHoldMs ?? 75;
    const jitter = opts.jitter ?? 0.15;
    const random = rng(opts.seed ?? hash(text));
    const base = 1000 / cps;

    // 1. Reveal schedule: when each glyph appears, plus its mouth shape.
    const glyphs: { start: number; state: MouthState }[] = [];
    const charTimes: number[] = [];
    let t = 0;
    for (const ch of text) {
        glyphs.push({ start: t, state: mouthFor(ch) });
        // Characters can be several code units (emoji); the text box indexes by code unit.
        for (let k = 0; k < ch.length; k++) charTimes.push(t);
        let dt = base * (1 + (random() * 2 - 1) * jitter);
        const pause = PAUSES[ch];
        if (pause !== undefined) dt += pause;
        t += dt;
    }
    const duration = t;

    // 2. Cut into beats. Each beat shows the most open shape among glyphs appearing in it; empty beats are closed.
    const beats: MouthState[] = [];
    const beatCount = Math.ceil(duration / beat);
    let g = 0;
    for (let k = 0; k < beatCount; k++) {
        const end = (k + 1) * beat;
        let state: MouthState | null = null;
        while (g < glyphs.length && glyphs[g].start < end) {
            const s = glyphs[g].state;
            if (state === null || OPENNESS[s] > OPENNESS[state]) state = s;
            g++;
        }
        beats.push(state ?? "closed");
    }

    // 3. Keep long vowel runs moving: open, open -> open, half.
    for (let k = 1; k < beats.length; k++) {
        if (beats[k] === "open" && beats[k - 1] === "open") beats[k] = "half";
    }

    // 4. Compress into segments where the state actually changes.
    const mouth: MouthSegment[] = [];
    for (let k = 0; k < beats.length; k++) {
        const last = mouth[mouth.length - 1];
        if (!last || last.state !== beats[k]) mouth.push({ t: k * beat, state: beats[k] });
    }
    if (mouth.length === 0) mouth.push({ t: 0, state: "closed" });

    // 5. The line ends with lips together.
    if (mouth[mouth.length - 1].state !== "closed") mouth.push({ t: Math.max(duration, mouth[mouth.length - 1].t + beat), state: "closed" });

    return { text, charTimes, mouth, duration };
}

/** Mouth shape at time `ms` into the line. */
export function mouthAt(timing: LineTiming, ms: number): MouthState {
    if (ms >= timing.duration) return "closed";
    const m = timing.mouth;
    let lo = 0;
    let hi = m.length - 1;
    while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (m[mid].t <= ms) lo = mid;
        else hi = mid - 1;
    }
    return m[lo].state;
}

/** Number of characters (code units) visible at time `ms` into the line. */
export function revealedAt(timing: LineTiming, ms: number): number {
    const times = timing.charTimes;
    let lo = 0;
    let hi = times.length;
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (times[mid] <= ms) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}
