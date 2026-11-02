/**
 * Every image Casebound loads, by texture key. Paths are relative so the build works on GitHub Pages.
 * To swap art, replace the file at the same path.
 */
const ROOMS = [
    "office_desk",
    "sticky_note_landing",
    "hotel_lobby",
    "margin_market",
    "border_docks",
    "runway_row",
    "greenhouse",
    "auction_hall",
    "vault",
    "abacus_heights",
    "foundry",
    "skyline_base",
    "skyline_top",
    "town_map",
];

/** Characters with closed / half / wide mouth frames. */
const THREE_FRAME = ["fizz", "moss", "okafor", "quill", "tug"];
/** Characters with only a closed frame so far (they bob while talking). */
const ONE_FRAME = ["wren", "gus", "barnaby", "helga", "duke"];

const PROPS = [
    "abacus",
    "ai_seed_packet",
    "chandelier",
    "customs_sign",
    "departure_board",
    "desk_lamp_off",
    "desk_lamp_on",
    "dukes_paddle_lowered",
    "dukes_paddle_raised",
    "gavel",
    "lamp",
    "lettuce_fresh",
    "lettuce_wilted",
    "mop",
    "oee_gauge_60",
    "oee_gauge_70",
    "rooks_wrench",
    "scrap_bin",
    "single_bead",
    "spreadsheet",
    "suitcase_closed",
    "suitcase_open_robot",
    "umbrella_stand",
    "vault_door_closed",
    "vault_door_open",
    "watering_can",
    "windsock",
];

const TALKING_PROPS = ["vending_oracle", "mug", "cabinet", "exhibit_a"];

export const IMAGES: Record<string, string> = {};

for (const r of ROOMS) IMAGES[`room_${r}`] = `art/rooms/${r}.webp`;
for (const c of THREE_FRAME) {
    IMAGES[`char_${c}_closed`] = `characters/${c}/${c}-closed.png`;
    IMAGES[`char_${c}_half`] = `characters/${c}/${c}-half.png`;
    IMAGES[`char_${c}_wide`] = `characters/${c}/${c}-wide.png`;
}
for (const c of ONE_FRAME) IMAGES[`char_${c}_closed`] = `characters/${c}/${c}-closed.png`;
for (const s of ["dim", "glow", "gold"]) IMAGES[`blank_${s}`] = `characters/blank_page/blank_page-${s}.png`;
for (const p of PROPS) IMAGES[`prop_${p}`] = `art/props/${p}.png`;
for (const t of TALKING_PROPS) {
    IMAGES[`talk_${t}_still`] = `art/props/${t}_still.png`;
    IMAGES[`talk_${t}_talk`] = `art/props/${t}_talk.png`;
}
Object.assign(IMAGES, {
    ui_card: "art/props/framework_card.png",
    ui_card_plain: "art/props/framework_card_plain.png",
    ui_album: "art/ui/card_album.png",
    ui_quiz_button: "art/ui/quiz_button.png",
    ui_clue_card: "art/ui/clue_card.png",
    ui_suspect_back: "art/ui/suspect_back.png",
    ui_suspect_price: "art/ui/suspect_price.png",
    ui_suspect_volume: "art/ui/suspect_volume.png",
    ui_suspect_mix: "art/ui/suspect_mix.png",
    ui_suspect_cost: "art/ui/suspect_cost.png",
});

export { ONE_FRAME, THREE_FRAME };
