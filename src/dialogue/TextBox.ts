import Phaser from "phaser";

/**
 * The on-screen dialogue box: a panel along the bottom of the screen with the speaker's name on a coloured tag,
 * a typewriter text area, and a bouncing "continue" arrow once the line is fully shown.
 *
 * While open, a full-screen invisible blocker sits above the room and inventory, so a click advances the dialogue
 * instead of walking the player or using a hotspot. Space and Enter also advance.
 *
 * Text is word-wrapped once, before typing starts, by swapping chosen spaces for newlines. The wrapped string has
 * exactly the same length as the original, so "reveal n characters" is a simple slice and words never jump to the
 * next line halfway through typing.
 */

export interface TextBoxStyle {
    /** Gap between the panel and the screen edges, in px. */
    margin: number;
    height: number;
    padding: number;
    radius: number;
    fill: number;
    border: number;
    borderWidth: number;
    fontFamily: string;
    fontSize: number;
    textColor: string;
    nameFontSize: number;
    /** Depth above everything in the room, Caper's UI (9000) and its scene editor (9700). */
    depth: number;
}

export const DEFAULT_TEXTBOX_STYLE: TextBoxStyle = {
    margin: 24,
    height: 170,
    padding: 30,
    radius: 22,
    fill: 0xfff6e0,
    border: 0x3b2a5c,
    borderWidth: 5,
    fontFamily: '"Trebuchet MS", "Verdana", "Arial Rounded MT Bold", sans-serif',
    fontSize: 30,
    textColor: "#2b1d3a",
    nameFontSize: 24,
    depth: 20000,
};

export class TextBox {
    private readonly scene: Phaser.Scene;
    private readonly style: TextBoxStyle;
    private readonly container: Phaser.GameObjects.Container;
    private readonly blocker: Phaser.GameObjects.Zone;
    private readonly nameBg: Phaser.GameObjects.Graphics;
    private readonly nameText: Phaser.GameObjects.Text;
    private readonly body: Phaser.GameObjects.Text;
    private readonly measurer: Phaser.GameObjects.Text;
    private readonly arrow: Phaser.GameObjects.Triangle;
    private readonly arrowTween: Phaser.Tweens.Tween;
    private wrapped = "";
    private shown = -1;
    private advanceHandler: (() => void) | null = null;
    private destroyed = false;
    private readonly onShutdown = () => this.destroy();
    private readonly onKey = (event: KeyboardEvent) => {
        if (event.repeat) return;
        event.preventDefault();
        this.advanceHandler?.();
    };

    constructor(scene: Phaser.Scene, style: Partial<TextBoxStyle> = {}) {
        this.scene = scene;
        this.style = { ...DEFAULT_TEXTBOX_STYLE, ...style };
        const s = this.style;
        const { width: W, height: H } = scene.scale;
        const panelW = W - s.margin * 2;
        const panelX = s.margin;
        const panelY = H - s.margin - s.height;

        // Swallows every click while the box is open.
        this.blocker = scene.add
            .zone(0, 0, W, H)
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(s.depth - 1)
            .setInteractive();
        this.blocker.on("pointerdown", () => this.advanceHandler?.());

        const panel = scene.add.graphics();
        panel.fillStyle(0x000000, 0.25).fillRoundedRect(panelX + 6, panelY + 8, panelW, s.height, s.radius);
        panel.fillStyle(s.fill, 1).fillRoundedRect(panelX, panelY, panelW, s.height, s.radius);
        panel.lineStyle(s.borderWidth, s.border, 1).strokeRoundedRect(panelX, panelY, panelW, s.height, s.radius);

        this.nameBg = scene.add.graphics();
        this.nameText = scene.add
            .text(panelX + s.padding + 16, panelY, "", {
                fontFamily: s.fontFamily,
                fontSize: `${s.nameFontSize}px`,
                fontStyle: "bold",
                color: "#2b1d3a",
            })
            .setOrigin(0, 0.5);

        const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            fontFamily: s.fontFamily,
            fontSize: `${s.fontSize}px`,
            color: s.textColor,
            lineSpacing: 6,
        };
        this.body = scene.add.text(panelX + s.padding, panelY + s.padding + 4, "", textStyle);
        this.measurer = scene.add.text(0, 0, "", textStyle).setVisible(false);

        this.arrow = scene.add
            .triangle(panelX + panelW - s.padding, panelY + s.height - s.padding + 4, 0, 0, 24, 0, 12, 16, s.border)
            .setOrigin(0.5, 0.5)
            .setVisible(false);
        this.arrowTween = scene.tweens.add({
            targets: this.arrow,
            y: this.arrow.y - 8,
            duration: 420,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
            paused: true,
        });

        this.container = scene.add
            .container(0, 0, [panel, this.nameBg, this.nameText, this.body, this.arrow])
            .setScrollFactor(0)
            .setDepth(s.depth);

        scene.input.keyboard?.on("keydown-SPACE", this.onKey);
        scene.input.keyboard?.on("keydown-ENTER", this.onKey);
        scene.events.once("shutdown", this.onShutdown);
    }

    /** Show the speaker's name on a tag in their colour. */
    setSpeaker(name: string, color: string): void {
        const s = this.style;
        const { height: H } = this.scene.scale;
        const panelY = H - s.margin - s.height;
        this.nameText.setText(name);
        const tagX = s.margin + s.padding;
        const tagW = this.nameText.width + 32;
        const tagH = s.nameFontSize + 18;
        this.nameBg.clear();
        this.nameBg.fillStyle(Phaser.Display.Color.HexStringToColor(color).color, 1);
        this.nameBg.fillRoundedRect(tagX, panelY - tagH / 2, tagW, tagH, tagH / 2);
        this.nameBg.lineStyle(4, s.border, 1).strokeRoundedRect(tagX, panelY - tagH / 2, tagW, tagH, tagH / 2);
        this.nameText.setPosition(tagX + 16, panelY);
        const hasName = name.length > 0;
        this.nameBg.setVisible(hasName);
        this.nameText.setVisible(hasName);
    }

    /** Wrap a new line of text (already whitespace-normalized) and clear the box, ready to type it out. */
    prepare(text: string): void {
        this.wrapped = this.wrap(text);
        this.shown = -1;
        this.reveal(0);
        this.showContinue(false);
    }

    /** Show the first `count` characters of the prepared line. */
    reveal(count: number): void {
        const n = Math.max(0, Math.min(count, this.wrapped.length));
        if (n === this.shown) return;
        this.shown = n;
        this.body.setText(this.wrapped.slice(0, n));
    }

    showContinue(visible: boolean): void {
        this.arrow.setVisible(visible);
        if (visible) this.arrowTween.resume();
        else this.arrowTween.pause();
    }

    /** Called on click / Space / Enter while the box is open. Pass null to stop listening. */
    onAdvance(handler: (() => void) | null): void {
        this.advanceHandler = handler;
    }

    destroy(): void {
        if (this.destroyed) return;
        this.destroyed = true;
        this.scene.events.off("shutdown", this.onShutdown);
        this.advanceHandler = null;
        this.scene.input.keyboard?.off("keydown-SPACE", this.onKey);
        this.scene.input.keyboard?.off("keydown-ENTER", this.onKey);
        this.arrowTween.remove();
        this.blocker.destroy();
        this.measurer.destroy();
        this.container.destroy();
    }

    /** Greedy word wrap that only replaces spaces with newlines, so the result has the same length as the input. */
    private wrap(text: string): string {
        const s = this.style;
        const maxWidth = this.scene.scale.width - s.margin * 2 - s.padding * 2 - 30;
        const words = text.split(" ");
        let out = "";
        let line = "";
        for (const word of words) {
            const candidate = line.length === 0 ? word : `${line} ${word}`;
            if (line.length > 0 && this.measurer.setText(candidate).width > maxWidth) {
                out += (out.length > 0 ? "\n" : "") + line;
                line = word;
            } else {
                line = candidate;
            }
        }
        out += (out.length > 0 ? "\n" : "") + line;
        return out;
    }
}
