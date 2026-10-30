import { store } from "@caper";

/**
 * All game progress lives in one store, saved to the browser automatically.
 * Add a flag here first, then read it in rooms with `store.get("name")` or in prop conditions with `{ name: true }`.
 * Bump `saveVersion` when you rename or remove flags, so old saves start fresh instead of breaking.
 */
export const FRESH_STATE = {
    chapter: "intro",
    activeCharacter: "hero",
    metMayor: false,
    hasMarble: false,
    gaveMarble: false,
};

export function configureState(): void {
    store.configure({
        saveKey: "humongous-style-game",
        saveVersion: 1,
        migrateSave: (saved, from) => (from === 1 ? saved : null),
        createFreshState: () => ({ values: { ...FRESH_STATE }, collections: {}, items: {} }),
    });
}
