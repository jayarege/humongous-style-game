import { GameRoom, run } from "../../rooms/GameRoom";

/** The meadow, where the Mayor's marble is sitting on a tree stump. */
export class Meadow extends GameRoom {
    constructor() {
        super({
            key: "Meadow",
            backgroundsByChapter: { intro: "room_meadow" },
            // Grass, with a notch so the player walks around the stump instead of through it.
            walkable: [
                { x: 20, y: 480 },
                { x: 500, y: 480 },
                { x: 500, y: 580 },
                { x: 720, y: 580 },
                { x: 720, y: 480 },
                { x: 1260, y: 480 },
                { x: 1260, y: 712 },
                { x: 20, y: 712 },
            ],
            activeCharacter: { startPosition: { x: 1080, y: 620 } },
            props: [
                {
                    id: "marble",
                    atlas: "marble",
                    x: 610,
                    y: 452,
                    approach: { x: 610, y: 610, facing: "up" },
                    states: [
                        {
                            when: { hasMarble: false, gaveMarble: false },
                            frame: "__BASE",
                            cursor: "pickup",
                            onClick: [{ pickup: "marble" }, { set: { hasMarble: true } }, run("gotMarble")],
                        },
                    ],
                },
                {
                    id: "stump",
                    bounds: { x: 515, y: 470, w: 190, h: 90 },
                    approach: { x: 610, y: 610, facing: "up" },
                    states: [{ cursor: "look", onClick: [run("stump")] }],
                },
                {
                    id: "toPond",
                    bounds: { x: 1100, y: 500, w: 180, h: 220 },
                    approach: { x: 1210, y: 640, facing: "right" },
                    states: [{ cursor: "exit", onClick: [{ goToScene: "Pond" }] }],
                },
            ],
        });
    }

    protected scripts = {
        gotMarble: async (room: GameRoom) => {
            await room.talk([["hero", "A shiny blue marble! This must be the Mayor's. I'd better take it back."]]);
        },
        stump: async (room: GameRoom) => {
            await room.talk([["hero", "An old tree stump. I count about a hundred rings. That's one old tree!"]]);
        },
    };
}
