import Phaser from "phaser";
import { content, createAdventureGame, DialogueBubble, engineAssets, store } from "@caper";
import { IMAGES } from "./game/assets";
import { registerCharacters } from "./game/characters";
import { Meadow } from "./game/rooms/Meadow";
import { Pond } from "./game/rooms/Pond";
import { configureState } from "./game/state";

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
const ROOMS = ["Pond", "Meadow"];
const FIRST_ROOM = "Pond";

/** Runs once before Phaser starts: fills the engine's registries with this game's content. */
function register(): void {
    configureState();
    registerCharacters();
    content.registerItems({ marble: { atlas: "marble", frame: "__BASE", scale: 0.9 } });
    DialogueBubble.registerIconType("item", (scene, id, scale) => {
        const item = content.getItem(id);
        return item ? scene.add.image(0, 0, item.atlas, item.frame).setScale(scale) : null;
    });
    engineAssets.configure({
        thoughtBubble: { atlas: "bubble", frame: "__BASE", scale: 0.65 },
        speechBubble: { atlas: "bubble", frame: "__BASE" },
        inventoryAtlas: "marble",
        cursors: { pickup: "grab", "use-with": "grab", look: "help", exit: "pointer" },
    });
}

/** Loads every image up front (the demo is small), then resumes in the saved room. */
class Boot extends Phaser.Scene {
    constructor() {
        super("Boot");
    }

    preload(): void {
        const { width, height } = this.scale;
        const bar = this.add.rectangle(width / 2 - 200, height / 2, 0, 16, 0xffd23f).setOrigin(0, 0.5);
        this.load.on("progress", (p: number) => bar.setSize(400 * p, 16));
        this.load.on("loaderror", (file: Phaser.Loader.File) => setStatus(`Could not load ${file.key}. Reload to retry.`));
        for (const [key, url] of Object.entries(IMAGES)) this.load.image(key, url);
    }

    create(): void {
        const resume = store.getCurrentScene();
        this.scene.start(resume && ROOMS.includes(resume) ? resume : FIRST_ROOM);
    }
}

function setStatus(text: string): void {
    const el = document.querySelector("#status");
    if (el) el.textContent = text;
}

const game = createAdventureGame({
    register,
    config: {
        type: Phaser.AUTO,
        parent: "game",
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        backgroundColor: "#1b1530",
        scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
        scene: [Boot, Pond, Meadow],
    },
});

// Handy for debugging in the browser console: __game.scene.getScenes(true)
(window as unknown as { __game: Phaser.Game }).__game = game;

document.querySelector("#restart")?.addEventListener("click", () => {
    for (const scene of game.scene.getScenes(true)) game.scene.stop(scene);
    store.reset();
    game.scene.start(FIRST_ROOM);
});

store.onSaveStatusChange((status) => {
    if (status.state === "unavailable" || status.state === "invalid" || status.state === "incompatible") {
        setStatus(status.message ?? "Saving is unavailable.");
    } else {
        setStatus("Click things. Progress saves automatically.");
    }
});
