import Phaser from "phaser";
import { CASES } from "../content/cases";
import { DISTRICTS, PLACES } from "../content/places";
import { clearedCount, commit, save } from "../save";
import { addText, FONT, makeButton, makePanel, toast } from "../ui";
import { finaleUnlocked, QUIZ_UNLOCK, quizUnlocked, rankTitle } from "./finale";

/** The map of the Undercase: every district, the doors, the lobby and the card album. */
export class HubScene extends Phaser.Scene {
    constructor() {
        super("Hub");
    }

    create(): void {
        const s = save();
        this.add.image(0, 0, "room_skyline_top").setOrigin(0, 0).setDisplaySize(1280, 720);
        this.add.rectangle(0, 0, 1280, 720, 0x0b0820, 0.45).setOrigin(0, 0);
        const total = Object.values(s.results).reduce((a, r) => a + r.total, 0);
        this.add
            .text(640, 40, "The Undercase", { fontFamily: FONT, fontSize: "44px", fontStyle: "bold", color: "#fff1c9", stroke: "#3b1d08", strokeThickness: 6 })
            .setOrigin(0.5, 0);
        this.add
            .text(640, 100, `${clearedCount()} of 8 districts cleared  ·  ${total} stars  ·  Rank: ${rankTitle(total)}`, {
                fontFamily: FONT,
                fontSize: "20px",
                color: "#fff6e0",
            })
            .setOrigin(0.5, 0);

        const ui = this.add.container(0, 0);
        const w = 285;
        const gap = 16;
        const x0 = (1280 - (w * 4 + gap * 3)) / 2;
        DISTRICTS.forEach((id, i) => {
            const c = CASES[id];
            const r = s.results[id];
            const x = x0 + (i % 4) * (w + gap);
            const y = 160 + Math.floor(i / 4) * 150;
            const label = `${PLACES[id].title}\n${c.caseType}\n${r ? `${r.total} / 25 stars` : "Not cleared yet"}${s.cards.includes(id) ? "  ·  card found" : ""}`;
            makeButton(this, ui, x, y, w, label, () => this.go(id), { center: true, fontSize: 19, fill: r ? 0xd9f5cf : 0xfff6e0 });
        });

        const row = 480;
        const bw = 285;
        makeButton(this, ui, x0, row, bw, "The Lobby\n(Vending Oracle)", () => this.go("lobby"), { center: true, fontSize: 19 });
        makeButton(
            this,
            ui,
            x0 + bw + gap,
            row,
            bw,
            quizUnlocked() ? "Case Quiz\n(the Two Doors)" : `Case Quiz\nclear ${QUIZ_UNLOCK} districts`,
            () => this.go("doors"),
            { center: true, fontSize: 19, fill: quizUnlocked() ? 0xdcecff : 0xe6e0d4 },
        );
        makeButton(
            this,
            ui,
            x0 + (bw + gap) * 2,
            row,
            bw,
            finaleUnlocked() ? (s.finaleDone ? "The Finale\n(play again)" : "The Finale\nThe Two Doors are open") : "The Finale\nclear all 8 districts",
            () => this.go("doors"),
            { center: true, fontSize: 19, fill: finaleUnlocked() ? 0xffd23f : 0xe6e0d4 },
        );
        makeButton(this, ui, x0 + (bw + gap) * 3, row, bw, `Card Album\n${s.cards.length} / 9 cards`, () => this.album(), {
            center: true,
            fontSize: 19,
        });

        this.add
            .text(640, 690, "Shift+U unlocks everything (for testing)", { fontFamily: FONT, fontSize: "14px", color: "#cfc6e8" })
            .setOrigin(0.5, 1)
            .setAlpha(0.7);
        this.input.keyboard?.on("keydown-U", (e: KeyboardEvent) => {
            if (!e.shiftKey) return;
            s.unlockAll = true;
            commit();
            toast(this, "Everything unlocked");
            this.time.delayedCall(700, () => this.scene.restart());
        });
        this.cameras.main.fadeIn(300, 0, 0, 0);
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
