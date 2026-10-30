/**
 * Every image the game loads, by texture key.
 *
 * To use your own art: drop a PNG into public/art/ with the same path and the game picks it up on reload.
 * To add new art: add a line here, then use the key in a room or character file.
 *
 * Paths are relative ("art/..."), so the game works both in dev and on GitHub Pages under /humongous-style-game/.
 */
export const IMAGES: Record<string, string> = {
    // Rooms (1280x720)
    room_pond: "art/rooms/pond.png",
    room_meadow: "art/rooms/meadow.png",

    // Player character. The engine prefixes playable sprite keys with "character_", so these keys must keep it.
    character_hero: "art/characters/hero/closed.png",
    character_hero_half: "art/characters/hero/half.png",
    character_hero_open: "art/characters/hero/open.png",

    // Mayor Croaksworth, the frog
    frog_closed: "art/characters/frog/closed.png",
    frog_half: "art/characters/frog/half.png",
    frog_open: "art/characters/frog/open.png",

    // Items (shown in the room and in the inventory bar)
    marble: "art/items/marble.png",

    // Engine UI
    "bg-inventory": "art/ui/inventory.png",
    bubble: "art/ui/bubble.png",
};
