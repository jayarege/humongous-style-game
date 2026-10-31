import type { SpeakerDef } from "../dialogue/talk";
import { PLACES } from "./content/places";

function three(c: string): SpeakerDef["mouths"] {
    return { closed: `char_${c}_closed`, half: `char_${c}_half`, open: `char_${c}_wide` };
}
function prop(p: string): SpeakerDef["mouths"] {
    return { closed: `talk_${p}_still`, half: `talk_${p}_talk`, open: `talk_${p}_talk` };
}

/**
 * Everyone who talks. Name tag colours are picked to read on the cream text box.
 * Kept free of Phaser so the content tests can check every line's speaker without a browser.
 */
export function caseboundSpeakerDefs(): Record<string, SpeakerDef> {
    const defs: Record<string, SpeakerDef> = {
        wren: { name: "Wren", color: "#ff9f4a", bob: true },
        gus: { name: "Gus", color: "#7fc8ff", bob: true },
        oracle: { name: "Vending Oracle", color: "#ff6b6b", mouths: prop("vending_oracle"), cps: 30 },
        barnaby: { name: "Barnaby Bunch", color: "#8fd16a", bob: true, cps: 30 },
        helga: { name: "Dr. Helga Sprocket", color: "#5fd3c6", bob: true, cps: 44 },
        tug: { name: "Tug", color: "#c58cff", mouths: three("tug") },
        quill: { name: "Quill", color: "#9ff0c8", mouths: three("quill"), cps: 46 },
        duke: { name: "Duke Mergeworth", color: "#b78cff", bob: true, cps: 32 },
        okafor: { name: "Okafor", color: "#6fd0a0", mouths: three("okafor"), cps: 34 },
        moss: { name: "Moss", color: "#ffb36b", mouths: three("moss") },
        fizz: { name: "Fizz", color: "#ffd84a", mouths: three("fizz") },
        blank: { name: "The Blank Page", color: "#dfe6ff", cps: 30 },
        guided: { name: "The Guided Door", color: "#e0a060" },
        open: { name: "The Open Door", color: "#6fd6d0" },
        exhibit: { name: "Exhibit A", color: "#ffcf6b", mouths: prop("exhibit_a") },
        mug: { name: "Mug", color: "#e8c9a0", mouths: prop("mug") },
        cabinet: { name: "The Unspeakable Cabinet", color: "#c0c8d0", mouths: prop("cabinet") },
        auctioneer: { name: "Auctioneer", color: "#ffd23f" },
        narrator: { name: "", color: "#ffffff" },
    };
    // Every clickable prop can talk under its own name.
    for (const place of Object.values(PLACES)) {
        for (const p of place.props) {
            if (!defs[`prop:${p.id}`]) defs[`prop:${p.id}`] = { name: p.name, color: "#ffd23f" };
        }
    }
    return defs;
}
