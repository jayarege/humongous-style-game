/**
 * The game's random numbers. Normal play uses Math.random. In test mode (?auto=SEED) every random pick comes from a
 * seeded generator, so a failing automated playthrough can be replayed exactly with the same seed.
 */
const params = typeof location !== "undefined" ? new URLSearchParams(location.search) : null;
const autoParam = params?.get("auto") ?? null;

/** The seed for this test run, or null in normal play. ?auto with no value picks one from the clock. */
export const SEED: number | null =
    autoParam === null ? null : autoParam === "" ? Date.now() >>> 0 : Number.parseInt(autoParam, 10) >>> 0;

/** mulberry32: a tiny, fast 32-bit generator. Plenty for picking answers; not for anything secret. */
function mulberry32(seed: number): () => number {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/** A number in [0, 1). */
export const rand: () => number = SEED === null ? Math.random : mulberry32(SEED);
