import Phaser from "phaser";
import { resetSave } from "./casebound/save";
import { HubScene } from "./casebound/scenes/HubScene";
import { PlaceScene } from "./casebound/scenes/PlaceScene";
import { BootScene, TitleScene } from "./casebound/scenes/TitleScene";
import { registerCaseboundSpeakers } from "./casebound/speakers";

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

registerCaseboundSpeakers();

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: "game",
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: "#1b1530",
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [BootScene, TitleScene, HubScene, PlaceScene],
});

// Handy for debugging in the browser console: __game.scene.getScenes(true)
(window as unknown as { __game: Phaser.Game }).__game = game;

// Two-tap confirm instead of window.confirm, which some embedded viewers block.
const restart = document.querySelector<HTMLButtonElement>("#restart");
if (restart) {
    const label = restart.textContent ?? "Start over";
    let armed = false;
    let timer = 0;
    restart.addEventListener("click", () => {
        if (!armed) {
            armed = true;
            restart.textContent = "Tap again to erase progress";
            timer = window.setTimeout(() => {
                armed = false;
                restart.textContent = label;
            }, 4000);
            return;
        }
        window.clearTimeout(timer);
        armed = false;
        restart.textContent = label;
        for (const scene of game.scene.getScenes(true)) game.scene.stop(scene);
        resetSave();
        game.scene.start("Title");
    });
}
