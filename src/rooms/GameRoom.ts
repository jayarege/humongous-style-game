import { AdventureScene, NPC, transitionIn } from "@caper";
import { bindSpeaker, conversation, type Line } from "../dialogue/talk";

type SceneConfig = ConstructorParameters<typeof AdventureScene>[0];

/** A script runs when a prop with `onClick: [run("id")]` is clicked, after the player has walked over. */
export type RoomScript = (room: GameRoom) => Promise<void> | void;

/** Effect for a prop's `onClick` list: run a script from the room's `scripts`. */
export function run(scriptId: string): { emit: string } {
    return { emit: `script:${scriptId}` };
}

export interface StationaryNpcConfig {
    /** Speaker id from characters.ts; also used as the NPC id. */
    id: string;
    name: string;
    /** Texture key of the closed-mouth frame. */
    texture: string;
    /** Where the NPC's feet are. */
    x: number;
    y: number;
    scale?: number;
    /** Clickable box, relative to the feet. */
    bounds: { x: number; y: number; w: number; h: number };
    /** Where the player walks to before talking, relative to the feet, and which way the player then faces. */
    approach: { x: number; y: number; facing: "up" | "down" | "left" | "right" };
    /** Runs after the player arrives and both face each other. */
    onTalk: RoomScript;
}

/**
 * Base class for every room. Adds, on top of Caper's AdventureScene:
 *  - the player's mouth flaps when "hero" talks,
 *  - `scripts`: named async functions props can trigger with `run("id")`,
 *  - `addStationaryNpc`: the Humongous "walk up to a character and talk" flow,
 *  - `talk([...lines])`: a conversation in the text box.
 */
export abstract class GameRoom extends AdventureScene {
    protected scripts: Record<string, RoomScript> = {};
    private busy = false;

    constructor(config: SceneConfig) {
        super({ diagnostics: "warn", ...config });
    }

    create(data?: unknown): void {
        super.create(data);
        bindSpeaker(this, "hero", () => this.walk?.sprite);
        for (const [id, script] of Object.entries(this.scripts)) {
            this.bus.on(`script:${id}`, () => void this.runScript(script));
        }
        this.setupRoom();
        transitionIn(this);
    }

    /** Rooms put their NPCs and one-off setup here. */
    protected setupRoom(): void {}

    /** Show a conversation in the text box. Lines are [speaker id, text]. */
    talk(lines: readonly Line[]): Promise<void> {
        return conversation(this, lines);
    }

    /** Place a character who stays put; clicking them walks the player over and starts `onTalk`. */
    addStationaryNpc(cfg: StationaryNpcConfig): NPC {
        const npc = new NPC(this as never, {
            id: cfg.id,
            name: cfg.name,
            texture: cfg.texture,
            x: cfg.x,
            y: cfg.y,
            scale: cfg.scale ?? 1,
            depth: cfg.y,
            boundsOffset: cfg.bounds,
            approachOffset: cfg.approach,
            onClick: () => {
                npc.facePlayer();
                void this.runScript(cfg.onTalk);
            },
        });
        bindSpeaker(this, cfg.id, () => npc.sprite);
        return npc;
    }

    /** Runs one script at a time; clicks during a running script are ignored. */
    private async runScript(script: RoomScript): Promise<void> {
        if (this.busy) return;
        this.busy = true;
        try {
            await script(this);
        } catch (error) {
            console.error("[room] script failed", error);
        } finally {
            this.busy = false;
        }
    }
}
