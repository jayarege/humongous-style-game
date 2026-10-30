import { characters } from "@caper";
import { registerSpeakers } from "../dialogue/talk";

/**
 * Everyone who talks. `mouths` are the texture keys (see assets.ts) for the closed / half / open mouth frames.
 * "narrator" has no sprite, so it gets a text box with no flapping mouth.
 */
export function registerCharacters(): void {
    registerSpeakers({
        hero: {
            name: "Pip",
            color: "#ffd23f",
            mouths: { closed: "character_hero", half: "character_hero_half", open: "character_hero_open" },
        },
        frog: {
            name: "Mayor Croaksworth",
            color: "#8fe388",
            mouths: { closed: "frog_closed", half: "frog_half", open: "frog_open" },
            cps: 32, // a slow, important frog
        },
        narrator: { name: "", color: "#ffffff" },
    });

    // The playable character, as the engine sees it. spriteScale multiplies the engine's base scale (0.55).
    characters.register("hero", { spriteKey: "hero", playable: true, walkSpeed: 320, spriteScale: 1.6 });
}
