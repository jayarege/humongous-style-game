import Phaser from "phaser";
import { CASES } from "../content/cases";
import { DISTRICTS, PLACES } from "../content/places";
import { clearedCount, commit, save } from "../save";
import { addText, FONT, INK, makeButton, makePanel, toast } from "../ui";
import { finaleUnlocked, QUIZ_UNLOCK, quizUnlocked, rankTitle } from "./finale";

/**
 * Where each spot sits on the town map (1280x720 game screen). `x, y` is the point on the building the sign's pin
 * touches; the sign hangs just above it.
 */
const SPOTS: Record<string, { x: number; y: number; building: string }> = {
    margin_market: { x: 150, y: 430, building: "the grocer's big shop window" },
    border_docks: { x: 285, y: 575, building: "the crates and cart" },
    abacus_heights: { x: 340, y: 235, building: "the clock tower" },
    runway_row: { x: 500, y: 270, building: "the signal mast" },
    lobby: { x: 592, y: 330, building: "the little cottage" },
    doors: { x: 762, y: 300, building: "the grand arched door" },
    auction_hall: { x: 860, y: 395, building: "the house with the hanging signs" },
    vault: { x: 1065, y: 470, building: "the shop full of coins" },
    foundry: { x: 1005, y: 170, building: "the smokestack" },
    greenhouse: { x: 1170, y: 150, building: "the glass dome" },
};

const SIGN_W = 156;
const SIGN_H = 50;

/** The town map of the Undercase: every district as a sign on its building, plus the doors, the lobby and the album. */
export class HubScene extends Phaser.Scene {
    constructor() {
        super("Hub");
    }

    create(): void {
        const s = save();
        this.add.image(0, 0, "room_town_map").setOrigin(0, 0).setDisplaySize(1280, 720);

        // Title strip across the sky.
        const total = Object.values(s.results).reduce((a, r) => a + r.total, 0);
        const strip = this.add.graphics();
        strip.fillStyle(0x0b0820, 0.55).fillRoundedRect(380, 10, 520, 74, 16);
        this.add
            .text(640, 16, "The Undercase", { fontFamily: FONT, fontSize: "32px", fontStyle: "bold", color: "#fff1c9", stroke: "#3b1d08", strokeThickness: 5 })
            .setOrigin(0.5, 0);
        this.add
            .text(640, 56, `${clearedCount()} of 8 cleared  ·  ${total} stars  ·  ${rankTitle(total)}`, { fontFamily: FONT, fontSize: "17px", color: "#fff6e0" })
            .setOrigin(0.5, 0);

        for (const id of DISTRICTS) {
            const r = s.results[id];
            const status = r ? `★ ${r.total} / 25${s.cards.includes(id) ? "  ·  card" : ""}` : CASES[id].caseType;
            this.sign(id, PLACES[id].title, status, r ? 0xd9f5cf : 0xfff6e0, () => this.go(id));
        }
        this.sign("lobby", "The Lobby", s.tutorialDone ? "Vending Oracle" : "Start here", 0xfff6e0, () => this.go("lobby"));
        const doorsStatus = finaleUnlocked()
            ? s.finaleDone
                ? "Finale · play again"
                : "Finale is open!"
            : quizUnlocked()
              ? "Case Quiz is open"
              : `Quiz at ${QUIZ_UNLOCK} cleared`;
        this.sign("doors", "The Two Doors", doorsStatus, finaleUnlocked() ? 0xffd23f : quizUnlocked() ? 0xdcecff : 0xe6e0d4, () => this.go("doors"));

        const ui = this.add.container(0, 0).setDepth(50);
        makeButton(this, ui, 1280 - 20 - 190, 720 - 20 - 46, 190, `Card Album  ${s.cards.length} / 9`, () => this.album(), {
            center: true,
            fontSize: 18,
            fill: 0xffd23f,
        });

        this.add
            .text(16, 704, "Shift+U unlocks everything (for testing)", { fontFamily: FONT, fontSize: "13px", color: "#cfc6e8" })
            .setOrigin(0, 1)
            .setAlpha(0.65);
        this.input.keyboard?.on("keydown-U", (e: KeyboardEvent) => {
            if (!e.shiftKey) return;
            s.unlockAll = true;
            commit();
            toast(this, "Everything unlocked");
            this.time.delayedCall(700, () => this.scene.restart());
        });
        this.cameras.main.fadeIn(300, 0, 0, 0);
    }

    /** A hanging sign pinned to a building: name on top, progress underneath. The sign and the building spot both click. */
    private sign(id: string, name: string, status: string, fill: number, onClick: () => void): void {
        const spot = SPOTS[id];
        const sx = Phaser.Math.Clamp(spot.x, SIGN_W / 2 + 8, 1280 - SIGN_W / 2 - 8);
        const sy = spot.y - 26 - SIGN_H / 2;
        const c = this.add.container(sx, sy).setDepth(10);
        const g = this.add.graphics();
        const draw = (hover: boolean) => {
            g.clear();
            // The pin: a short post down to the building, with a glowing dot.
            g.lineStyle(3, 0x3b2a5c, 1).lineBetween(spot.x - sx, SIGN_H / 2, spot.x - sx, spot.y - sy - 6);
            g.fillStyle(hover ? 0xffd23f : 0xfff1c9, 1).fillCircle(spot.x - sx, spot.y - sy, 6);
            g.lineStyle(2, 0x3b2a5c, 1).strokeCircle(spot.x - sx, spot.y - sy, 6);
            g.fillStyle(0x000000, 0.3).fillRoundedRect(-SIGN_W / 2 + 3, -SIGN_H / 2 + 4, SIGN_W, SIGN_H, 10);
            g.fillStyle(hover ? 0xffe9a8 : fill, 1).fillRoundedRect(-SIGN_W / 2, -SIGN_H / 2, SIGN_W, SIGN_H, 10);
            g.lineStyle(3, 0x3b2a5c, 1).strokeRoundedRect(-SIGN_W / 2, -SIGN_H / 2, SIGN_W, SIGN_H, 10);
        };
        draw(false);
        const title = this.add
            .text(0, -SIGN_H / 2 + 6, name, { fontFamily: FONT, fontSize: "16px", fontStyle: "bold", color: INK })
            .setOrigin(0.5, 0);
        if (title.width > SIGN_W - 12) title.setScale((SIGN_W - 12) / title.width);
        const sub = this.add.text(0, SIGN_H / 2 - 6, status, { fontFamily: FONT, fontSize: "13px", color: "#4a3a2a" }).setOrigin(0.5, 1);
        if (sub.width > SIGN_W - 12) sub.setScale((SIGN_W - 12) / sub.width);
        c.add([g, title, sub]);

        // Click targets: the sign itself, and a generous circle around the building spot.
        const hitSign = this.add.zone(sx, sy, SIGN_W, SIGN_H).setInteractive({ useHandCursor: true }).setDepth(11);
        const hitSpot = this.add.zone(spot.x, spot.y, 70, 70).setInteractive({ useHandCursor: true }).setDepth(11).setData("spot", id);
        for (const z of [hitSign, hitSpot]) {
            z.on("pointerover", () => {
                draw(true);
                this.tweens.add({ targets: c, scale: 1.06, duration: 120 });
            });
            z.on("pointerout", () => {
                draw(false);
                this.tweens.add({ targets: c, scale: 1, duration: 120 });
            });
            z.on("pointerup", onClick);
        }
    }

    private go(id: string): void {
        this.cameras.main.fadeOut(250, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => this.scene.start("Place", { id }));
    }

    private album(): void {
        const s = save();
        const panel = makePanel(this, 860);
        const { content, x, top, width } = panel;
        let y = top + 20;
        y += addText(this, content, x + 28, y, width - 56, `Gus's Card Album: ${s.cards.length} of 9`, 26, true).height + 10;
        const img = this.add.image(x + 28, y, "ui_album").setOrigin(0, 0);
        img.setScale(300 / img.width);
        content.add(img);
        const order = ["lobby", ...DISTRICTS];
        const lines = order.map((id) => {
            const place = PLACES[id];
            return s.cards.includes(id) && place.card ? `★ ${place.title}: ${place.card.text}` : `☆ ${place.title}: not found yet`;
        });
        const t = addText(this, content, x + 350, y, width - 380, lines.join("\n"), 17);
        y += Math.max(img.displayHeight, t.height) + 16;
        const b = makeButton(this, content, x + width / 2 - 100, y, 200, "Close", () => panel.destroy(), { center: true, fill: 0xc9f0c0 });
        y += b.height;
        panel.layout(y - top + 22);
    }
}
