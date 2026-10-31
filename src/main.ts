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

document.querySelector("#restart")?.addEventListener("click", () => {
    if (!window.confirm("Start over? This erases your progress.")) return;
    for (const scene of game.scene.getScenes(true)) game.scene.stop(scene);
    resetSave();
    game.scene.start("Title");
});
