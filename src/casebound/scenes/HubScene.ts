import Phaser from "phaser";
import { CASES } from "../content/cases";
import { DISTRICTS, PLACES } from "../content/places";
import { clearedCount, commit, save } from "../save";
import { addText, FONT, INK, makeButton, makePanel, toast } from "../ui";
import { finaleUnlocked, QUIZ_UNLOCK, quizUnlocked, rankTitle } from "./finale";

/** The island map's source art is 816 px wide; the game shows it 1280 wide and scrolls up and down. */
const SRC_W = 816;
const SRC_H = 1488;
const K = 1280 / SRC_W;
const MAP_H = Math.round(SRC_H * K);

/**
 * Each area of the island, traced in the source art's pixels: the outline that lights up on hover, and where its sign
 * hangs. Edit these numbers to move an area; they're scaled to the screen at runtime.
 */
const AREAS: Record<string, { label: [number, number]; outline: [number, number][]; what: string }> = {
    doors: {
        what: "the lighthouse",
        label: [305, 230],
        outline: [[255, 240], [355, 240], [365, 430], [520, 480], [520, 530], [380, 545], [260, 520], [195, 465], [235, 410]],
    },
    abacus_heights: {
        what: "the counting tower",
        label: [660, 400],
        outline: [[618, 410], [705, 410], [708, 560], [700, 640], [640, 655], [508, 642], [490, 602], [560, 572], [618, 540]],
    },
    margin_market: {
        what: "the hilltop market",
        label: [105, 415],
        outline: [[0, 430], [150, 420], [210, 500], [218, 640], [150, 665], [0, 665]],
    },
    auction_hall: {
        what: "the red auction houses",
        label: [350, 585],
        outline: [[235, 600], [330, 588], [420, 640], [475, 700], [460, 762], [315, 762], [300, 715], [235, 690]],
    },
    greenhouse: {
        what: "the domed glasshouse",
        label: [175, 675],
        outline: [[70, 700], [215, 665], [300, 715], [315, 762], [300, 822], [230, 842], [100, 832], [55, 775]],
    },
    vault: {
        what: "the cave in the cliff",
        label: [130, 860],
        outline: [[70, 880], [182, 868], [204, 940], [172, 992], [80, 994], [48, 940]],
    },
    border_docks: {
        what: "the docks",
        label: [330, 945],
        outline: [[225, 1000], [300, 978], [400, 958], [422, 1010], [432, 1080], [362, 1102], [290, 1102], [230, 1062]],
    },
    foundry: {
        what: "the old machine works",
        label: [80, 1025],
        outline: [[0, 1042], [110, 1030], [152, 1090], [152, 1182], [92, 1212], [0, 1202]],
    },
    lobby: {
        what: "the harbor hotel",
        label: [700, 790],
        outline: [[680, 822], [816, 780], [816, 1092], [740, 1102], [690, 1062], [676, 952]],
    },
    runway_row: {
        what: "the long boardwalk",
        label: [640, 1215],
        outline: [[620, 1232], [782, 1222], [792, 1292], [642, 1402], [472, 1488], [330, 1488], [420, 1420], [560, 1330]],
    },
};

/** Where the map was last scrolled to, so coming back from a district doesn't jump. */
let lastScroll: number | null = null;

const SIGN_W = 150;
const SIGN_H = 46;

/** The island map of the Undercase. Scroll (wheel, drag, arrow keys) and hover an area to light it up; click to go. */
export class HubScene extends Phaser.Scene {
    private dragged = 0;
    private albumOpen = false;
    private fixed?: Phaser.GameObjects.Container;
    private points = new Map<string, { x: number; y: number }>();

    constructor() {
        super("Hub");
    }

    create(): void {
        const s = save();
        this.add.image(0, 0, "room_island_map").setOrigin(0, 0).setDisplaySize(1280, MAP_H);
        const cam = this.cameras.main;
        cam.setBounds(0, 0, 1280, MAP_H);
        // First visit: open on the harbor around the Lobby. After that, pick up where you left the map.
        cam.scrollY = Phaser.Math.Clamp(lastScroll ?? AREAS.lobby.label[1] * K - 230, 0, MAP_H - 720);

        for (const id of DISTRICTS) {
            const r = s.results[id];
            const status = r ? `★ ${r.total} / 25${s.cards.includes(id) ? "  ·  card" : ""}` : CASES[id].caseType;
            this.area(id, PLACES[id].title, status, r ? 0xd9f5cf : 0xfff6e0);
        }
        this.area("lobby", "The Lobby", s.tutorialDone ? "Vending Oracle" : "Start here", 0xfff6e0);
        const doorsStatus = finaleUnlocked()
            ? s.finaleDone
                ? "Finale · play again"
                : "Finale is open!"
            : quizUnlocked()
              ? "Case Quiz is open"
              : `Quiz at ${QUIZ_UNLOCK} cleared`;
        this.area("doors", "The Two Doors", doorsStatus, finaleUnlocked() ? 0xffd23f : quizUnlocked() ? 0xdcecff : 0xe6e0d4);

        this.hud(s.cards.length);
        this.scrolling();

        this.input.keyboard?.on("keydown-U", (e: KeyboardEvent) => {
            if (!e.shiftKey) return;
            s.unlockAll = true;
            commit();
            toast(this, "Everything unlocked");
            this.time.delayedCall(700, () => this.scene.restart());
        });
        cam.fadeIn(300, 0, 0, 0);
    }

    /** Scrolls so an area is on screen and returns where its sign is on screen (used by the automated playthrough). */
    focus(id: string): { x: number; y: number } | null {
        const p = this.points.get(id);
        if (!p) return null;
        const cam = this.cameras.main;
        cam.scrollY = Phaser.Math.Clamp(p.y - 360, 0, MAP_H - 720);
        return { x: p.x, y: p.y - cam.scrollY };
    }

    /** One clickable area: a traced outline that glows on hover, plus a sign with its name and progress. */
    private area(id: string, name: string, status: string, fill: number): void {
        const a = AREAS[id];
        const pts = a.outline.map(([x, y]) => new Phaser.Math.Vector2(x * K, y * K));
        const poly = new Phaser.Geom.Polygon(pts);

        // The glow: a brightened copy of the map, masked to this area's outline, faded in on hover.
        const maskShape = this.make.graphics({}, false);
        maskShape.fillStyle(0xffffff, 1).fillPoints(pts, true);
        const glow = this.add
            .image(0, 0, "room_island_map")
            .setOrigin(0, 0)
            .setDisplaySize(1280, MAP_H)
            .setBlendMode(Phaser.BlendModes.ADD)
            .setAlpha(0)
            .setDepth(2);
        glow.setMask(maskShape.createGeometryMask());
        const edge = this.add.graphics().setDepth(3).setAlpha(0);
        edge.lineStyle(10, 0xffd23f, 0.35).strokePoints(pts, true);
        edge.lineStyle(3, 0xfff1c9, 1).strokePoints(pts, true);

        // The sign.
        const [lx, ly] = a.label;
        const sx = Phaser.Math.Clamp(lx * K, SIGN_W / 2 + 8, 1280 - SIGN_W / 2 - 8);
        const sy = ly * K;
        this.points.set(id, { x: sx, y: sy });
        const c = this.add.container(sx, sy).setDepth(10);
        const g = this.add.graphics();
        const drawSign = (hover: boolean) => {
            g.clear();
            g.fillStyle(0x000000, 0.3).fillRoundedRect(-SIGN_W / 2 + 3, -SIGN_H / 2 + 4, SIGN_W, SIGN_H, 10);
            g.fillStyle(hover ? 0xffe9a8 : fill, 1).fillRoundedRect(-SIGN_W / 2, -SIGN_H / 2, SIGN_W, SIGN_H, 10);
            g.lineStyle(3, hover ? 0xb5651d : 0x3b2a5c, 1).strokeRoundedRect(-SIGN_W / 2, -SIGN_H / 2, SIGN_W, SIGN_H, 10);
        };
        drawSign(false);
        const title = this.add.text(0, -SIGN_H / 2 + 5, name, { fontFamily: FONT, fontSize: "15px", fontStyle: "bold", color: INK }).setOrigin(0.5, 0);
        if (title.width > SIGN_W - 12) title.setScale((SIGN_W - 12) / title.width);
        const sub = this.add.text(0, SIGN_H / 2 - 5, status, { fontFamily: FONT, fontSize: "12px", color: "#4a3a2a" }).setOrigin(0.5, 1);
        if (sub.width > SIGN_W - 12) sub.setScale((SIGN_W - 12) / sub.width);
        c.add([g, title, sub]);

        const light = (on: boolean) => {
            this.tweens.killTweensOf([glow, edge, c]);
            this.tweens.add({ targets: glow, alpha: on ? 0.38 : 0, duration: 140 });
            this.tweens.add({ targets: edge, alpha: on ? 1 : 0, duration: 140 });
            this.tweens.add({ targets: c, scale: on ? 1.08 : 1, duration: 140 });
            drawSign(on);
        };
        const go = () => {
            if (this.dragged > 8) return;
            this.go(id);
        };

        // Hover and click on the area itself, or on its sign.
        const hitArea = this.add.graphics().setDepth(4);
        hitArea.setInteractive(poly, Phaser.Geom.Polygon.Contains);
        const hitSign = this.add.zone(sx, sy, SIGN_W, SIGN_H).setInteractive({ useHandCursor: true }).setDepth(11);
        hitArea.input!.cursor = "pointer";
        for (const z of [hitArea, hitSign]) {
            z.setData("spot", id);
            z.on("pointerover", () => light(true));
            z.on("pointerout", () => light(false));
            z.on("pointerup", go);
        }
    }

    /** Title, progress, album button and scroll arrows, pinned to the screen. */
    private hud(cards: number): void {
        const s = save();
        const total = Object.values(s.results).reduce((a, r) => a + r.total, 0);
        const fixed = this.add.container(0, 0).setDepth(50);
        const strip = this.add.graphics();
        strip.fillStyle(0x0b0820, 0.6).fillRoundedRect(380, 10, 520, 70, 16);
        fixed.add(strip);
        fixed.add(
            this.add
                .text(640, 14, "The Undercase", { fontFamily: FONT, fontSize: "30px", fontStyle: "bold", color: "#fff1c9", stroke: "#3b1d08", strokeThickness: 5 })
                .setOrigin(0.5, 0),
        );
        fixed.add(
            this.add
                .text(640, 52, `${clearedCount()} of 8 cleared  ·  ${total} stars  ·  ${rankTitle(total)}`, { fontFamily: FONT, fontSize: "16px", color: "#fff6e0" })
                .setOrigin(0.5, 0),
        );
        makeButton(this, fixed, 1280 - 20 - 190, 720 - 20 - 46, 190, `Card Album  ${cards} / 9`, () => this.album(), { center: true, fontSize: 18, fill: 0xffd23f });
        makeButton(this, fixed, 1280 - 20 - 56, 540, 56, "▲", () => this.scrollBy(-360), { center: true, fontSize: 22, fill: 0xfff6e0 });
        makeButton(this, fixed, 1280 - 20 - 56, 598, 56, "▼", () => this.scrollBy(360), { center: true, fontSize: 22, fill: 0xfff6e0 });
        fixed.add(
            this.add
                .text(16, 704, "Scroll, drag or use the arrow keys to explore  ·  Shift+U unlocks everything", { fontFamily: FONT, fontSize: "13px", color: "#e8e0ff" })
                .setOrigin(0, 1)
                .setAlpha(0.8),
        );
        this.fixed = fixed;
    }

    /** The HUD rides along with the camera (moved each frame rather than scroll-factor 0, so its buttons stay clickable). */
    update(): void {
        if (this.fixed) this.fixed.y = this.cameras.main.scrollY;
        lastScroll = this.cameras.main.scrollY;
    }

    private scrollBy(dy: number): void {
        if (this.albumOpen) return;
        const cam = this.cameras.main;
        const to = Phaser.Math.Clamp(cam.scrollY + dy, 0, MAP_H - 720);
        this.tweens.add({ targets: cam, scrollY: to, duration: 260, ease: "Quad.easeOut" });
    }

    /** Wheel, drag and arrow keys move the camera up and down the island. */
    private scrolling(): void {
        const cam = this.cameras.main;
        const clamp = (y: number) => Phaser.Math.Clamp(y, 0, MAP_H - 720);
        this.input.on("wheel", (_p: Phaser.Input.Pointer, _o: unknown, _dx: number, dy: number) => {
            if (!this.albumOpen) cam.scrollY = clamp(cam.scrollY + dy * 0.8);
        });
        this.input.on("pointerdown", () => (this.dragged = 0));
        this.input.on("pointermove", (p: Phaser.Input.Pointer) => {
            if (!p.isDown || this.albumOpen) return;
            const dy = p.y - p.prevPosition.y;
            this.dragged += Math.abs(dy);
            cam.scrollY = clamp(cam.scrollY - dy);
        });
        this.input.keyboard?.on("keydown-UP", () => this.scrollBy(-200));
        this.input.keyboard?.on("keydown-DOWN", () => this.scrollBy(200));
        this.input.keyboard?.on("keydown-W", () => this.scrollBy(-200));
        this.input.keyboard?.on("keydown-S", () => this.scrollBy(200));
    }

    private go(id: string): void {
        this.cameras.main.fadeOut(250, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => this.scene.start("Place", { id }));
    }

    private album(): void {
        const s = save();
        const panel = makePanel(this, 860);
        // Open the album over whatever part of the island is on screen.
        panel.root.setY(this.cameras.main.scrollY);
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
        this.albumOpen = true;
        const b = makeButton(this, content, x + width / 2 - 100, y, 200, "Close", () => {
            this.albumOpen = false;
            panel.destroy();
        }, { center: true, fill: 0xc9f0c0 });
        y += b.height;
        panel.layout(y - top + 22);
    }
}
