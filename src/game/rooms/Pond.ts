import { store } from "@caper";
import { GameRoom, run } from "../../rooms/GameRoom";

/**
 * The Mayor's pond. Mayor Croaksworth sits on his rock and wants his lucky marble back.
 *
 * Coordinates are in the 1280x720 background's pixels. Press Shift+D in the game to see walkable areas and hotspots,
 * Shift+E to drag them around and copy the new numbers back here.
 */
export class Pond extends GameRoom {
    constructor() {
        super({
            key: "Pond",
            backgroundsByChapter: { intro: "room_pond" },
            // Where the player can walk: the grass, not the pond.
            walkable: [
                { x: 20, y: 470 },
                { x: 740, y: 455 },
                { x: 770, y: 520 },
                { x: 740, y: 610 },
                { x: 700, y: 712 },
                { x: 20, y: 712 },
            ],
            activeCharacter: { startPosition: { x: 260, y: 600 } },
            props: [
                {
                    id: "sign",
                    bounds: { x: 410, y: 355, w: 175, h: 165 },
                    approach: { x: 520, y: 560, facing: "up" },
                    states: [{ cursor: "look", onClick: [run("sign")] }],
                },
                {
                    id: "toMeadow",
                    bounds: { x: 0, y: 500, w: 200, h: 220 },
                    approach: { x: 70, y: 640, facing: "left" },
                    states: [{ cursor: "exit", onClick: [{ goToScene: "Meadow" }] }],
                },
                {
                    id: "pond",
                    bounds: { x: 800, y: 580, w: 470, h: 120 },
                    approach: { x: 720, y: 640, facing: "right" },
                    states: [{ cursor: "look", onClick: [run("pond")] }],
                },
            ],
        });
    }

    protected scripts = {
        sign: async (room: GameRoom) => {
            await room.talk([["hero", "It says: Mayor's Pond. Meadow, this way. The arrow points left."]]);
        },
        pond: async (room: GameRoom) => {
            await room.talk([["hero", "The water is so clear I can see tadpoles doing the backstroke!"]]);
        },
    };

    protected setupRoom(): void {
        this.addStationaryNpc({
            id: "frog",
            name: "Mayor Croaksworth",
            texture: "frog_closed",
            x: 1000,
            y: 515,
            bounds: { x: -110, y: -225, w: 220, h: 225 },
            approach: { x: -250, y: 50, facing: "right" },
            onTalk: (room) => mayorTalk(room),
        });
    }
}

async function mayorTalk(room: GameRoom): Promise<void> {
    if (store.get("gaveMarble")) {
        await room.talk([
            ["frog", "Ribbit! Thanks again, Pip. The pond has never been luckier."],
            ["hero", "Anytime, Mr. Mayor!"],
        ]);
        return;
    }

    if (store.get("hasMarble")) {
        store.removeFromInventory("marble");
        room.inventory?.refresh();
        store.set("hasMarble", false);
        store.set("gaveMarble", true);
        await room.talk([
            ["hero", "Mr. Mayor! Is this the marble you lost?"],
            ["frog", "My lucky marble! Oh, happy day! Hop hooray!"],
            ["frog", "By the power vested in me by this pond, I name you Honorary Lily Pad Inspector!"],
            ["hero", "Wow. I don't know what that means, but it sounds important."],
            ["narrator", "You did it! That's the end of the demo. Now swap in your own art and story."],
        ]);
        return;
    }

    if (!store.get("metMayor")) {
        store.set("metMayor", true);
        await room.talk([
            ["frog", "Ahem! Good morning, young citizen. I am Mayor Croaksworth, of this very pond."],
            ["hero", "Hi! I'm Pip. Why do you look so sad, Mr. Mayor?"],
            ["frog", "I have lost my lucky blue marble. Without it, the lily pads simply refuse to float properly."],
            ["frog", "I last saw it in the meadow, down the path to the left. Would you be a dear and look?"],
            ["hero", "Leave it to me!"],
        ]);
        return;
    }

    await room.talk([
        ["frog", "Any luck with my marble? The meadow is just down the path to the left."],
    ]);
}
