import Phaser from "phaser";
import { IMAGES } from "../assets";
import { resetSave, save } from "../save";
import { FONT, makeButton } from "../ui";

/** Loads every image, with a progress bar. */
export class BootScene extends Phaser.Scene {
    constructor() {
        super("Boot");
    }

    preload(): void {
        const { width, height } = this.scale;
        this.add.rectangle(width / 2, height / 2, 404, 20).setStrokeStyle(2, 0xffd23f);
        const bar = this.add.rectangle(width / 2 - 200, height / 2, 0, 14, 0xffd23f).setOrigin(0, 0.5);
        this.add.text(width / 2, height / 2 - 40, "Loading the Undercase...", { fontFamily: FONT, fontSize: "22px", color: "#fff6e0" }).setOrigin(0.5);
        this.load.on("progress", (p: number) => bar.setSize(400 * p, 14));
        for (const [key, url] of Object.entries(IMAGES)) this.load.image(key, url);
    }

    create(): void {
        this.scene.start("Title");
    }
}

/** Title screen: start or continue. */
export class TitleScene extends Phaser.Scene {
    constructor() {
        super("Title");
    }

    create(): void {
        const s = save();
        this.add.image(0, 0, "room_office_desk").setOrigin(0, 0).setDisplaySize(1280, 720);
        this.add.rectangle(0, 0, 1280, 720, 0x0b0820, 0.55).setOrigin(0, 0);
        this.add
            .text(640, 170, "CASEBOUND", { fontFamily: FONT, fontSize: "92px", fontStyle: "bold", color: "#ffd23f", stroke: "#3b1d08", strokeThickness: 10 })
            .setOrigin(0.5);
        this.add
            .text(640, 260, "A case interview adventure", { fontFamily: FONT, fontSize: "28px", color: "#fff6e0" })
            .setOrigin(0.5);
        this.add.image(330, 708, "char_wren_closed").setOrigin(0.5, 1).setScale(0.5);
        this.add.image(1010, 708, "char_gus_closed").setOrigin(0.5, 1).setScale(0.42);

        const ui = this.add.container(0, 0);
        const started = s.introDone;
        makeButton(this, ui, 520, 340, 240, started ? "Continue" : "Start", () => this.begin(), { center: true, fontSize: 26, fill: 0xffd23f });
        if (started) {
            makeButton(this, ui, 520, 410, 240, "New game", () => {
                resetSave();
                this.begin();
            }, { center: true, fontSize: 20 });
        }
        this.add
            .text(640, 478, "Click to talk and choose. Space or Enter also advances dialogue.", { fontFamily: FONT, fontSize: "18px", color: "#e8dcc0" })
            .setOrigin(0.5);
    }

    private begin(): void {
        const s = save();
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
            if (!s.introDone) this.scene.start("Place", { id: "office" });
            else if (!s.tutorialDone) this.scene.start("Place", { id: "lobby" });
            else this.scene.start("Hub");
        });
    }
}
