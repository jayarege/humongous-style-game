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

/** Changes every page load (or per seed in test mode), so answer positions differ from one play to the next. */
const ORDER_SALT = SEED ?? Math.floor(Math.random() * 2 ** 32);

/** FNV-1a: a small string hash. */
function hash(s: string): number {
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
    return h >>> 0;
}

/**
 * The order to show a question's options in. Shuffled so the right answer's position gives nothing away, but stable for
 * the same question within one play, so a retry after a wrong pick keeps every option where it was.
 */
export function shuffledOrder(n: number, key: string, salt: number = ORDER_SALT): number[] {
    const next = mulberry32(hash(key) ^ salt);
    const order = [...Array(n).keys()];
    for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
}
