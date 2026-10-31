import type Phaser from "phaser";
import { type MouthState, mouthAt, revealedAt, timeLine } from "./lipflap";
import { TextBox } from "./TextBox";

/**
 * Who can talk, and how.
 *
 * `mouths` names three texture keys: the character drawn with the mouth closed, half open and open. All three
 * images must have the same canvas size and the character in the same spot, so swapping them only moves the mouth.
 * Leave `mouths` out for an off-screen narrator or a character with no mouth art; the text box still works.
 */
export interface SpeakerDef {
    name: string;
    /** Name tag colour, as "#rrggbb". */
    color: string;
    mouths?: Record<MouthState, string>;
    /** Typing speed in characters per second (default 38). Slower for big, slow characters. */
    cps?: number;
    /** For characters with only one frame: bob up and down while the line is typing, instead of flapping a mouth. */
    bob?: boolean;
}

/** One line of a conversation: [speaker id, text]. */
export type Line = readonly [speaker: string, text: string];

type Talkable = Phaser.GameObjects.Sprite | Phaser.GameObjects.Image;

const speakers = new Map<string, SpeakerDef>();
const bindings = new WeakMap<Phaser.Scene, Map<string, () => Talkable | undefined>>();
const openBoxes = new WeakMap<Phaser.Scene, TextBox>();

/** Register every speaking character once at boot. */
export function registerSpeakers(defs: Record<string, SpeakerDef>): void {
    for (const [id, def] of Object.entries(defs)) speakers.set(id, def);
}

/**
 * Tell a scene which sprite belongs to a speaker, so their mouth flaps while they talk.
 * Pass a getter (not the sprite) because sprites are created and destroyed with the room.
 */
export function bindSpeaker(scene: Phaser.Scene, id: string, sprite: () => Talkable | undefined): void {
    let map = bindings.get(scene);
    if (!map) {
        map = new Map();
        bindings.set(scene, map);
    }
    map.set(id, sprite);
}

/** True while a conversation is on screen in this scene. */
export function isTalking(scene: Phaser.Scene): boolean {
    return openBoxes.has(scene);
}

/** One line from one speaker. Resolves when the player advances past it. */
export function say(scene: Phaser.Scene, speaker: string, text: string): Promise<void> {
    return conversation(scene, [[speaker, text]]);
}

/**
 * A run of lines in one text box. The box stays open between lines and closes at the end.
 * Click / Space / Enter: the first press finishes typing the current line, the next press moves on.
 */
export async function conversation(scene: Phaser.Scene, lines: readonly Line[]): Promise<void> {
    if (lines.length === 0) return;
    if (openBoxes.has(scene)) {
        // Something else is already talking in this scene; queueing a second box on top would be confusing.
        console.warn("[talk] conversation ignored: another one is still open");
        return;
    }
    const box = new TextBox(scene);
    openBoxes.set(scene, box);
    try {
        for (const [speaker, text] of lines) {
            const finished = await playLine(scene, box, speaker, text);
            if (!finished) return; // scene shut down mid-conversation
        }
    } finally {
        openBoxes.delete(scene);
        box.destroy();
    }
}

/** Plays one line. Resolves true when the player advanced, false if the scene shut down first. */
function playLine(scene: Phaser.Scene, box: TextBox, speakerId: string, text: string): Promise<boolean> {
    const def = speakers.get(speakerId) ?? { name: speakerId, color: "#ffd23f" };
    const timing = timeLine(text, { cps: def.cps });
    box.setSpeaker(def.name, def.color);
    box.prepare(timing.text);

    const getSprite = bindings.get(scene)?.get(speakerId);
    const setMouth = (state: MouthState) => {
        if (!def.mouths || !getSprite) return;
        const sprite = getSprite();
        if (!sprite || !sprite.active) return;
        const key = def.mouths[state];
        if (sprite.texture.key !== key && scene.textures.exists(key)) sprite.setTexture(key);
    };

    const start = scene.time.now;
    let typed = false;

    // Characters with a single frame bob gently while they talk.
    let bobTween: Phaser.Tweens.Tween | null = null;
    let bobBase = 0;
    const bobSprite = def.bob && getSprite ? getSprite() : undefined;
    if (bobSprite && bobSprite.active) {
        bobBase = bobSprite.scaleY;
        bobTween = scene.tweens.add({ targets: bobSprite, scaleY: bobBase * 1.035, duration: 120, yoyo: true, repeat: -1 });
    }
    const stopBob = () => {
        if (!bobTween) return;
        bobTween.stop();
        bobTween = null;
        if (bobSprite && bobSprite.active) bobSprite.setScale(bobSprite.scaleX, bobBase);
    };

    return new Promise<boolean>((resolve) => {
        const finishTyping = () => {
            typed = true;
            box.reveal(timing.text.length);
            setMouth("closed");
            stopBob();
            box.showContinue(true);
        };
        const onUpdate = () => {
            if (typed) return;
            const ms = scene.time.now - start;
            box.reveal(revealedAt(timing, ms));
            setMouth(mouthAt(timing, ms));
            if (ms >= timing.duration) finishTyping();
        };
        const cleanup = () => {
            scene.events.off("update", onUpdate);
            scene.events.off("shutdown", onShutdown);
            box.onAdvance(null);
            box.showContinue(false);
            setMouth("closed");
            stopBob();
        };
        const onShutdown = () => {
            cleanup();
            resolve(false);
        };
        box.onAdvance(() => {
            // Ignore the press that ended the previous line or opened this one.
            if (scene.time.now - start < 150) return;
            if (!typed) {
                finishTyping();
                return;
            }
            cleanup();
            resolve(true);
        });
        scene.events.on("update", onUpdate);
        scene.events.once("shutdown", onShutdown);
    });
}
