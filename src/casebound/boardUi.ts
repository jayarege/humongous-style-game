import Phaser from "phaser";
import { rand, shuffledOrder } from "./rng";
import { AUTO, autoLog, FONT, INK, makeButton, makePanel } from "./ui";

export type Mark = "good" | "bad";

export interface BoardOptions {
    title: string;
    instruction: string;
    /** Every card on offer, right and wrong. */
    cards: string[];
    /** How many cards the framework takes. */
    min: number;
    max: number;
    /** Shows a Hint button. */
    onHint?: () => Promise<void>;
}

/** A framework board that stays open across tries, so cards can be marked, sent back and placed again. */
export interface BoardHandle {
    /** Lets the player drag cards and waits for Submit. Resolves with the placed card indexes. */
    submit(): Promise<number[]>;
    /** Colours placed cards: green cards lock in place, red ones wait to be sent back. */
    mark(marks: ReadonlyMap<number, Mark>): void;
    /** Sends these cards back to the pile, uncoloured. */
    unplace(indexes: readonly number[]): void;
    /** Shows the answer: exactly these cards on the board, all green. */
    show(indexes: readonly number[]): void;
    /** A line of feedback under the board. */
    status(text: string): void;
    /** Swaps Submit for a Continue button, waits for it, then closes the board. */
    finish(label?: string): Promise<void>;
}

const W_PANEL = 1180;
const CARD_W = 520;
const SLOT_H = 74;
const GREEN = { fill: 0xc6efb8, border: 0x2e8b3a };
const RED = { fill: 0xf8c1b8, border: 0xc0392b };
const PLAIN = { fill: 0xffffff, border: 0x3b2a5c };

/** Test mode: no panel, random picks, everything logged. */
function autoBoard(o: BoardOptions): BoardHandle {
    const placed = new Set<number>();
    const locked = new Set<number>();
    return {
        async submit() {
            const free = [...o.cards.keys()].filter((i) => !placed.has(i)).sort(() => rand() - 0.5);
            for (const i of free) if (placed.size < o.min) placed.add(i);
            const pick = [...placed].sort((a, b) => a - b);
            autoLog.push(`[board] ${o.title} -> ${pick.map((i) => o.cards[i]).join(" | ")}`);
            return pick;
        },
        mark(marks) {
            for (const [i, m] of marks) if (m === "good") locked.add(i);
            autoLog.push(`[board marks] ${[...marks].map(([i, m]) => `${m === "good" ? "green" : "red"}: ${o.cards[i]}`).join(" | ")}`);
        },
        unplace(indexes) {
            for (const i of indexes) if (!locked.has(i)) placed.delete(i);
        },
        show(indexes) {
            placed.clear();
            for (const i of indexes) placed.add(i);
        },
        status(text) {
            autoLog.push(`[board status] ${text}`);
        },
        finish() {
            return Promise.resolve();
        },
    };
}

/**
 * Drag cards from the pile into the framework slots (or click a card to place it, and click a placed card to send it
 * back). Submit checks the board; the caller decides what's right and colours the cards with `mark`.
 */
export function openBoard(scene: Phaser.Scene, o: BoardOptions): BoardHandle {
    if (AUTO) return autoBoard(o);

    const panel = makePanel(scene, W_PANEL);
    const { content, x, top } = panel;
    const poolX = x + 28;
    const slotX = x + W_PANEL - 28 - CARD_W - 16;
    const rowsY = top + 112;

    const label = (tx: number, ty: number, text: string, size: number, bold = false, w = 1100): Phaser.GameObjects.Text => {
        const t = scene.add.text(tx, ty, text, { fontFamily: FONT, fontSize: `${size}px`, fontStyle: bold ? "bold" : "normal", color: INK, wordWrap: { width: w } });
        content.add(t);
        return t;
    };
    label(x + 28, top + 20, o.title, 26, true);
    label(x + 28, top + 56, o.instruction, 19);
    label(poolX, rowsY - 28, "Cards (drag or click)", 17, true);
    if (o.onHint) {
        const onHint = o.onHint;
        const hint = makeButton(scene, content, x + W_PANEL - 28 - 92, top + 18, 92, "Hint", () => {
            hint.set({ disabled: true });
            void onHint().then(() => hint.set({ disabled: false }));
        }, { center: true, fontSize: 18, fill: 0xdcecff });
    }
    label(slotX, rowsY - 28, "Your framework", 17, true);

    // Slots: dashed outlines, numbered.
    const slotCount = o.max;
    const slotRects: Phaser.Geom.Rectangle[] = [];
    const slotGfx = scene.add.graphics();
    content.add(slotGfx);
    for (let s = 0; s < slotCount; s++) {
        const r = new Phaser.Geom.Rectangle(slotX, rowsY + s * (SLOT_H + 10), CARD_W + 16, SLOT_H);
        slotRects.push(r);
        label(r.x - 26, r.centerY - 12, `${s + 1}`, 20, true);
    }
    const drawSlots = (hover = -1) => {
        slotGfx.clear();
        slotRects.forEach((r, s) => {
            slotGfx.fillStyle(s === hover ? 0xffe9a8 : 0xf3e7c8, 1).fillRoundedRect(r.x, r.y, r.width, r.height, 12);
            slotGfx.lineStyle(2, 0x9a8a6a, 1);
            for (let dx = 0; dx < r.width; dx += 16) {
                slotGfx.lineBetween(r.x + dx, r.y, r.x + Math.min(dx + 8, r.width), r.y);
                slotGfx.lineBetween(r.x + dx, r.bottom, r.x + Math.min(dx + 8, r.width), r.bottom);
            }
            for (let dy = 0; dy < r.height; dy += 16) {
                slotGfx.lineBetween(r.x, r.y + dy, r.x, r.y + Math.min(dy + 8, r.height));
                slotGfx.lineBetween(r.right, r.y + dy, r.right, r.y + Math.min(dy + 8, r.height));
            }
        });
    };
    drawSlots();

    const statusText = label(slotX, rowsY + slotCount * (SLOT_H + 10) + 4, "", 18, false, CARD_W + 16);
    const counter = label(slotX, statusText.y + 44, "", 17);

    // Cards, shown in shuffled order so position gives nothing away.
    interface Card {
        c: Phaser.GameObjects.Container;
        bg: Phaser.GameObjects.Graphics;
        h: number;
        homeX: number;
        homeY: number;
        slot: number;
        mark: Mark | null;
        locked: boolean;
    }
    const cards: Card[] = [];
    let py = rowsY;
    const order = shuffledOrder(o.cards.length, o.cards.join("|"));
    const byIndex = new Map<number, Card>();
    for (const i of order) {
        const text = scene.add.text(-CARD_W / 2 + 14, 0, o.cards[i], {
            fontFamily: FONT,
            fontSize: "18px",
            color: INK,
            wordWrap: { width: CARD_W - 28 },
            lineSpacing: 2,
        });
        text.setOrigin(0, 0.5);
        const h = Math.min(SLOT_H - 6, Math.max(44, text.height + 16));
        const bg = scene.add.graphics();
        const c = scene.add.container(poolX + CARD_W / 2, py + h / 2, [bg, text]);
        c.setSize(CARD_W, h);
        const card: Card = { c, bg, h, homeX: c.x, homeY: c.y, slot: -1, mark: null, locked: false };
        cards.push(card);
        byIndex.set(i, card);
        content.add(c);
        py += h + 8;
    }

    const drawCard = (card: Card, hover = false) => {
        const col = card.mark === "good" ? GREEN : card.mark === "bad" ? RED : PLAIN;
        const { bg, h } = card;
        bg.clear();
        bg.fillStyle(0x000000, 0.15).fillRoundedRect(-CARD_W / 2 + 3, -h / 2 + 4, CARD_W, h, 12);
        bg.fillStyle(hover && !card.mark ? 0xffe9a8 : col.fill, 1).fillRoundedRect(-CARD_W / 2, -h / 2, CARD_W, h, 12);
        bg.lineStyle(card.mark ? 4 : 3, col.border, 1).strokeRoundedRect(-CARD_W / 2, -h / 2, CARD_W, h, 12);
    };
    cards.forEach((card) => drawCard(card));

    let active = false;
    let submitBtn: ReturnType<typeof makeButton> | null = null;
    const placedCount = () => cards.filter((k) => k.slot >= 0).length;
    const refresh = () => {
        const n = placedCount();
        const need = o.min === o.max ? `${o.min}` : `${o.min} to ${o.max}`;
        counter.setText(`${n} placed (need ${need})`);
        submitBtn?.set({ disabled: !active || n < o.min || n > o.max });
    };

    const moveTo = (card: Card, tx: number, ty: number) => {
        scene.tweens.add({ targets: card.c, x: tx, y: ty, duration: 160, ease: "Quad.easeOut" });
    };
    const sendHome = (card: Card) => {
        card.slot = -1;
        card.mark = null;
        drawCard(card);
        moveTo(card, card.homeX, card.homeY);
    };
    const placeIn = (card: Card, s: number) => {
        const occupant = cards.find((k) => k.slot === s && k !== card);
        if (occupant?.locked) return sendHome(card);
        if (occupant) sendHome(occupant);
        card.slot = s;
        const r = slotRects[s];
        moveTo(card, r.centerX, r.centerY);
    };
    const firstEmpty = () => slotRects.findIndex((_, s) => !cards.some((k) => k.slot === s));
    const slotAt = (px: number, py2: number) => slotRects.findIndex((r) => r.contains(px, py2));

    for (const card of cards) {
        card.c.setInteractive({ draggable: true, useHandCursor: true });
        let moved = false;
        let sx = 0;
        let sy = 0;
        card.c.on("pointerover", () => drawCard(card, active && !card.locked));
        card.c.on("pointerout", () => drawCard(card));
        card.c.on("dragstart", (p: Phaser.Input.Pointer) => {
            moved = false;
            sx = p.x;
            sy = p.y;
            if (active && !card.locked) content.bringToTop(card.c);
        });
        card.c.on("drag", (p: Phaser.Input.Pointer, dx: number, dy: number) => {
            if (!active || card.locked) return;
            if (Math.abs(p.x - sx) + Math.abs(p.y - sy) > 6) moved = true;
            card.c.setPosition(dx, dy);
            drawSlots(slotAt(p.x, p.y));
        });
        card.c.on("dragend", (p: Phaser.Input.Pointer) => {
            drawSlots();
            if (!active || card.locked) return;
            if (!moved) {
                // A plain click: place it, or send it back.
                if (card.slot >= 0) sendHome(card);
                else {
                    const s = firstEmpty();
                    if (s >= 0) placeIn(card, s);
                }
            } else {
                const s = slotAt(p.x, p.y);
                if (s >= 0) placeIn(card, s);
                else if (card.slot >= 0) sendHome(card);
                else moveTo(card, card.homeX, card.homeY);
            }
            refresh();
        });
    }

    let onSubmit: ((picked: number[]) => void) | null = null;
    submitBtn = makeButton(
        scene,
        content,
        slotX + CARD_W + 16 - 170,
        statusText.y + 34,
        170,
        "Submit",
        () => {
            if (!onSubmit) return;
            active = false;
            refresh();
            const picked = [...byIndex].filter(([, k]) => k.slot >= 0).map(([i]) => i).sort((a, b) => a - b);
            const done = onSubmit;
            onSubmit = null;
            done(picked);
        },
        { center: true, fill: 0xc9f0c0 },
    );
    panel.layout(Math.max(py, statusText.y + 34 + 50) - top + 18);
    refresh();

    return {
        submit() {
            active = true;
            refresh();
            return new Promise((resolve) => (onSubmit = resolve));
        },
        mark(marks) {
            for (const [i, m] of marks) {
                const card = byIndex.get(i);
                if (!card) continue;
                card.mark = m;
                card.locked = m === "good";
                drawCard(card);
                scene.tweens.add({ targets: card.c, scale: 1.04, duration: 110, yoyo: true });
            }
        },
        unplace(indexes) {
            for (const i of indexes) {
                const card = byIndex.get(i);
                if (card && !card.locked) sendHome(card);
            }
            refresh();
        },
        show(indexes) {
            for (const card of cards) if (card.slot >= 0 && ![...indexes].some((i) => byIndex.get(i) === card)) sendHome(card);
            const want = indexes.map((i) => byIndex.get(i)!).filter((k) => k.slot < 0);
            for (const card of want) {
                const s = firstEmpty();
                if (s >= 0) placeIn(card, s);
            }
            for (const i of indexes) {
                const card = byIndex.get(i)!;
                card.mark = "good";
                card.locked = true;
                drawCard(card);
            }
            refresh();
        },
        status(text) {
            statusText.setText(text);
        },
        finish(labelText = "Continue") {
            return new Promise((resolve) => {
                const btn = makeButton(scene, content, slotX + CARD_W + 16 - 170, statusText.y + 34, 170, labelText, () => {
                    panel.destroy();
                    resolve();
                }, { center: true, fill: 0xffd23f });
                submitBtn?.zone.destroy();
                void btn;
            });
        },
    };
}
