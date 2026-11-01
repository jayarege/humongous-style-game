import Phaser from "phaser";
import { rand, SEED, shuffledOrder } from "./rng";

/** Shared look for panels and buttons, matching the dialogue box. */
export const FONT = '"Trebuchet MS", "Verdana", "Arial Rounded MT Bold", sans-serif';
export const INK = "#2b1d3a";
const CREAM = 0xfff6e0;
const BORDER = 0x3b2a5c;
const PANEL_DEPTH = 15000;

/**
 * Test mode: open the game with ?auto=SEED in the URL and every choice is picked at random (retries included) and
 * every panel closes itself. The same seed replays the same picks. Used by the automated playthrough; players never
 * see it.
 */
export const AUTO = SEED !== null;
export const autoLog: string[] = AUTO ? [`[seed] ${SEED}`] : [];
if (AUTO) Object.assign(window, { __cbLog: autoLog, __cbSeed: SEED });

function randomEnabled(n: number, disabled?: ReadonlySet<number>): number {
    const pool = [...Array(n).keys()].filter((i) => !disabled?.has(i));
    return pool[Math.floor(rand() * pool.length)];
}

export interface ButtonState {
    selected?: boolean;
    disabled?: boolean;
}

export interface Button {
    height: number;
    zone: Phaser.GameObjects.Zone;
    set(state: ButtonState): void;
}

/** A rounded, word-wrapped button. Text is drawn inside `parent`; returns its height so callers can stack them. */
export function makeButton(
    scene: Phaser.Scene,
    parent: Phaser.GameObjects.Container,
    x: number,
    y: number,
    w: number,
    label: string,
    onClick: () => void,
    opts: { fontSize?: number; center?: boolean; fill?: number } = {},
): Button {
    const fontSize = opts.fontSize ?? 19;
    const pad = 10;
    const text = scene.add.text(x + pad + 2, y + pad, label, {
        fontFamily: FONT,
        fontSize: `${fontSize}px`,
        color: INK,
        wordWrap: { width: w - pad * 2 - 4 },
        lineSpacing: 2,
        align: opts.center ? "center" : "left",
    });
    if (opts.center) text.setX(x + w / 2).setOrigin(0.5, 0);
    const h = Math.max(42, text.height + pad * 2);
    const g = scene.add.graphics();
    let state: ButtonState = {};
    let hover = false;
    const draw = () => {
        g.clear();
        const fill = state.disabled ? 0xd9d2c3 : state.selected ? 0xffd23f : hover ? 0xffe9a8 : (opts.fill ?? 0xffffff);
        g.fillStyle(0x000000, 0.15).fillRoundedRect(x + 3, y + 4, w, h, 12);
        g.fillStyle(fill, 1).fillRoundedRect(x, y, w, h, 12);
        g.lineStyle(3, state.selected ? 0xb5651d : BORDER, state.disabled ? 0.35 : 1).strokeRoundedRect(x, y, w, h, 12);
        text.setAlpha(state.disabled ? 0.45 : 1);
    };
    draw();
    const zone = scene.add.zone(x, y, w, h).setOrigin(0, 0).setInteractive({ useHandCursor: true });
    zone.on("pointerover", () => {
        hover = true;
        draw();
    });
    zone.on("pointerout", () => {
        hover = false;
        draw();
    });
    zone.on("pointerup", () => {
        if (!state.disabled) onClick();
    });
    parent.add([g, text, zone]);
    return {
        height: h,
        zone,
        set(s: ButtonState) {
            state = { ...state, ...s };
            if (state.disabled) zone.disableInteractive();
            else zone.setInteractive({ useHandCursor: true });
            draw();
        },
    };
}

/** A modal panel: dims the room, swallows clicks, and draws a cream card. Call `layout(height)` once filled. */
export function makePanel(scene: Phaser.Scene, width = 640) {
    const W = scene.scale.width;
    const H = scene.scale.height;
    const x = (W - width) / 2;
    const top = 22;
    const root = scene.add.container(0, 0).setDepth(PANEL_DEPTH);
    const dim = scene.add.rectangle(0, 0, W, H, 0x0b0820, 0.35).setOrigin(0, 0).setInteractive();
    const bg = scene.add.graphics();
    root.add([dim, bg]);
    const content = scene.add.container(0, 0);
    root.add(content);
    return {
        root,
        content,
        x,
        top,
        width,
        layout(height: number) {
            const h = Math.min(height, H - top - 14);
            bg.clear();
            bg.fillStyle(0x000000, 0.3).fillRoundedRect(x + 6, top + 8, width, h, 22);
            bg.fillStyle(CREAM, 1).fillRoundedRect(x, top, width, h, 22);
            bg.lineStyle(5, BORDER, 1).strokeRoundedRect(x, top, width, h, 22);
        },
        destroy() {
            root.destroy(true);
        },
    };
}

export function addText(
    scene: Phaser.Scene,
    parent: Phaser.GameObjects.Container,
    x: number,
    y: number,
    w: number,
    text: string,
    size = 20,
    bold = false,
    color = INK,
): Phaser.GameObjects.Text {
    const t = scene.add.text(x, y, text, {
        fontFamily: FONT,
        fontSize: `${size}px`,
        fontStyle: bold ? "bold" : "normal",
        color,
        wordWrap: { width: w },
        lineSpacing: 3,
    });
    parent.add(t);
    return t;
}

export interface ChooseOptions {
    title: string;
    prompt?: string;
    /** A data card shown above the options. */
    card?: string;
    options: string[];
    disabled?: ReadonlySet<number>;
    /** Pick several: Submit is enabled once between min and max are selected. */
    multi?: { min: number; max: number };
    /** Shows a Hint button. */
    onHint?: () => Promise<void>;
    width?: number;
    /** Show options in the order given instead of shuffled (for lists where order means something). */
    keepOrder?: boolean;
}

/** Shows a choice panel. Resolves with the picked option indexes (one, unless `multi`). */
export function choose(scene: Phaser.Scene, o: ChooseOptions): Promise<number[]> {
    if (AUTO) {
        let pick: number[];
        if (o.multi) {
            const all = [...Array(o.options.length).keys()].sort(() => rand() - 0.5);
            pick = all.slice(0, o.multi.min).sort((a, b) => a - b);
        } else {
            pick = [randomEnabled(o.options.length, o.disabled)];
        }
        autoLog.push(`[choose] ${o.title} -> ${pick.map((i) => o.options[i]).join(" | ")}`);
        return new Promise((r) => scene.time.delayedCall(1, () => r(pick)));
    }
    return new Promise((resolve) => {
        const panel = makePanel(scene, o.width ?? 680);
        const { content, x, top, width } = panel;
        const inner = width - 56;
        let y = top + 22;
        const title = addText(scene, content, x + 28, y, inner - 90, o.title, 26, true);
        y += title.height + 8;
        if (o.prompt) {
            const p = addText(scene, content, x + 28, y, inner, o.prompt, 20);
            y += p.height + 12;
        }
        if (o.card) {
            const cardText = scene.add.text(x + 46, y + 14, o.card, {
                fontFamily: FONT,
                fontSize: "20px",
                fontStyle: "bold",
                color: "#3a2410",
                wordWrap: { width: inner - 40 },
                lineSpacing: 3,
            });
            const ch = cardText.height + 28;
            const g = scene.add.graphics();
            g.fillStyle(0xf3dfae, 1).fillRoundedRect(x + 28, y, inner, ch, 10);
            g.lineStyle(3, 0xb5651d, 1).strokeRoundedRect(x + 28, y, inner, ch, 10);
            content.add([g, cardText]);
            y += ch + 14;
        }
        const picked = new Set<number>();
        const buttons: Button[] = [];
        let submit: Button | null = null;
        let counter: Phaser.GameObjects.Text | null = null;
        const finish = (result: number[]) => {
            panel.destroy();
            resolve(result);
        };
        const refresh = () => {
            if (!o.multi || !submit || !counter) return;
            const n = picked.size;
            counter.setText(`Picked ${n} (need ${o.multi.min === o.multi.max ? o.multi.min : `${o.multi.min} to ${o.multi.max}`})`);
            submit.set({ disabled: n < o.multi.min || n > o.multi.max });
        };
        // Shown in shuffled order; picks still report each option's original index.
        const order = o.keepOrder ? [...o.options.keys()] : shuffledOrder(o.options.length, o.options.join("|"));
        order.forEach((i) => {
            const label = o.options[i];
            const b = makeButton(scene, content, x + 28, y, inner, label, () => {
                if (!o.multi) return finish([i]);
                if (picked.has(i)) picked.delete(i);
                else if (picked.size < o.multi.max) picked.add(i);
                b.set({ selected: picked.has(i) });
                refresh();
            });
            if (o.disabled?.has(i)) b.set({ disabled: true });
            buttons.push(b);
            y += b.height + 8;
        });
        if (o.multi) {
            y += 4;
            counter = addText(scene, content, x + 28, y + 10, inner - 200, "", 18);
            submit = makeButton(scene, content, x + width - 28 - 170, y, 170, "Submit", () => finish([...picked].sort((a, b) => a - b)), {
                center: true,
                fill: 0xc9f0c0,
            });
            y += submit.height + 6;
            refresh();
        }
        if (o.onHint) {
            const onHint = o.onHint;
            const hint = makeButton(scene, content, x + width - 28 - 92, top + 18, 92, "Hint", () => {
                hint.set({ disabled: true });
                void onHint().then(() => hint.set({ disabled: false }));
            }, { center: true, fontSize: 18, fill: 0xdcecff });
        }
        panel.layout(y - top + 18);
    });
}

/** A simple message panel with a button. */
export function notice(scene: Phaser.Scene, title: string, body: string, button = "Continue", width = 640): Promise<void> {
    if (AUTO) {
        autoLog.push(`[notice] ${title}: ${body.replace(/\n/g, " / ")}`);
        return Promise.resolve();
    }
    return new Promise((resolve) => {
        const panel = makePanel(scene, width);
        const { content, x, top } = panel;
        let y = top + 22;
        const t = addText(scene, content, x + 28, y, width - 56, title, 26, true);
        y += t.height + 10;
        const b = addText(scene, content, x + 28, y, width - 56, body, 20);
        y += b.height + 18;
        const btn = makeButton(scene, content, x + width / 2 - 100, y, 200, button, () => {
            panel.destroy();
            resolve();
        }, { center: true, fill: 0xc9f0c0 });
        y += btn.height;
        panel.layout(y - top + 22);
    });
}

/** A results panel: a header line, a two-column table (label, value), a footer and one or two buttons. */
export function tablePanel(
    scene: Phaser.Scene,
    title: string,
    header: string,
    rows: [string, string][],
    footer: string,
    buttons: { label: string; onClick?: () => void }[] = [{ label: "Continue" }],
    width = 660,
): Promise<void> {
    if (AUTO) {
        autoLog.push(`[table] ${title}: ${header} / ${rows.map((r) => r.join(" ")).join(" / ")} / ${footer.replace(/\n/g, " / ")}`);
        return Promise.resolve();
    }
    return new Promise((resolve) => {
        const panel = makePanel(scene, width);
        const { content, x, top } = panel;
        let y = top + 22;
        y += addText(scene, content, x + 28, y, width - 56, title, 26, true).height + 8;
        if (header) y += addText(scene, content, x + 28, y, width - 56, header, 21, true).height + 10;
        for (const [label, value] of rows) {
            const a = addText(scene, content, x + 40, y, 210, label, 21);
            addText(scene, content, x + 250, y, width - 280, value, 21, false, "#7a4a00");
            y += a.height + 6;
        }
        y += 8;
        if (footer) y += addText(scene, content, x + 28, y, width - 56, footer, 19).height + 16;
        const bw = (width - 56 - (buttons.length - 1) * 14) / buttons.length;
        let bh = 0;
        buttons.forEach((b, i) => {
            const btn = makeButton(scene, content, x + 28 + i * (bw + 14), y, bw, b.label, () => {
                panel.destroy();
                resolve();
                b.onClick?.();
            }, { center: true, fill: i === 0 ? 0xc9f0c0 : 0xffffff });
            bh = Math.max(bh, btn.height);
        });
        y += bh;
        panel.layout(y - top + 22);
    });
}

/** Stars for a 0 to 5 score, in half steps. */
export function stars(score: number): string {
    const s = Math.round(score * 2) / 2;
    const full = Math.floor(s);
    const half = s - full >= 0.5;
    return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(5 - full - (half ? 1 : 0));
}

/** A short message that fades out at the top of the screen. */
export function toast(scene: Phaser.Scene, text: string): void {
    const t = scene.add
        .text(scene.scale.width / 2, 70, text, {
            fontFamily: FONT,
            fontSize: "22px",
            fontStyle: "bold",
            color: "#fff6e0",
            backgroundColor: "#3b2a5c",
            padding: { x: 16, y: 8 },
        })
        .setOrigin(0.5)
        .setDepth(30000);
    scene.tweens.add({ targets: t, alpha: 0, delay: 1600, duration: 500, onComplete: () => t.destroy() });
}
