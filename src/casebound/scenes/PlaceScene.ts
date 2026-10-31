import Phaser from "phaser";
import { bindSpeaker, conversation } from "../../dialogue/talk";
import { runCase, type CaseCtx } from "../caseRunner";
import { CASES } from "../content/cases";
import { DISTRICTS, PLACES } from "../content/places";
import { MYSTERIES } from "../content/minigames";
import { commit, cardSpot, save } from "../save";
import type { CaseResult, L, PlaceDef } from "../types";
import { addText, AUTO, autoLog, choose, FONT, makeButton, makePanel, notice, stars, tablePanel, toast, type ChooseOptions } from "../ui";
import { runDoors, runRooftop, runEnding } from "./finale";
import { rand } from "../rng";

type Img = Phaser.GameObjects.Image;

const FEET = 708;

const HOST_NAMES: Record<string, string> = {
    barnaby: "Barnaby",
    helga: "Helga",
    tug: "Tug",
    quill: "Quill",
    duke: "the Duke",
    okafor: "Okafor",
    moss: "Moss",
    fizz: "Fizz",
};

/**
 * One scene class for every location. Started with `{ id }` from places.ts: draws the room, puts Wren, Gus and the
 * host in it, makes the props clickable, and runs that place's script.
 */
export class PlaceScene extends Phaser.Scene implements CaseCtx {
    place!: PlaceDef;
    wren?: Img;
    gus?: Img;
    host?: Img;
    blank?: Img;
    private busy = false;
    private clicks = new Map<string, number>();
    private propImages = new Map<string, Img>();
    private exhibit?: Img;
    private card?: Img;

    constructor() {
        super("Place");
    }

    create(data: { id: string }): void {
        this.place = PLACES[data.id] ?? PLACES.lobby;
        this.busy = false;
        this.clicks.clear();
        this.propImages.clear();
        this.exhibit = undefined;
        this.card = undefined;
        this.blank = undefined;
        const p = this.place;

        this.add.image(0, 0, p.bg).setOrigin(0, 0).setDisplaySize(1280, 720);

        for (const prop of p.props) {
            const img = this.add.image(prop.x, prop.y, prop.key).setScale(prop.scale).setDepth(2);
            img.setInteractive({ useHandCursor: true, pixelPerfect: true, alphaTolerance: 10 });
            img.on("pointerup", () => this.clickProp(prop.id));
            this.propImages.set(prop.id, img);
        }

        if (p.host) {
            this.host = this.add
                .image(p.host.x, p.host.y ?? FEET, p.host.key)
                .setOrigin(0.5, 1)
                .setScale(p.host.scale ?? 0.5)
                .setDepth(5)
                .setInteractive({ useHandCursor: true, pixelPerfect: true, alphaTolerance: 10 });
            this.host.on("pointerup", () => this.run(() => this.talkToHost()));
        } else {
            this.host = undefined;
        }
        this.wren = this.add.image(p.wrenX, FEET, "char_wren_closed").setOrigin(0.5, 1).setScale(0.5).setDepth(6);
        this.gus = p.gusX !== undefined ? this.add.image(p.gusX, FEET, "char_gus_closed").setOrigin(0.5, 1).setScale(0.36).setDepth(6) : undefined;

        // Every speaker gets a binding, so a stale sprite from the last room never flaps.
        bindSpeaker(this, "wren", () => this.wren);
        bindSpeaker(this, "gus", () => this.gus);
        for (const id of ["oracle", "barnaby", "helga", "tug", "quill", "duke", "okafor", "moss", "fizz"]) {
            bindSpeaker(this, id, () => (p.host?.speaker === id ? this.host : undefined));
        }
        bindSpeaker(this, "blank", () => this.blank);
        bindSpeaker(this, "exhibit", () => this.exhibit);
        bindSpeaker(this, "mug", () => this.propImages.get("mug"));
        bindSpeaker(this, "cabinet", () => this.propImages.get("cabinet"));

        this.placeCard();
        this.placeExhibit();
        this.topBar();
        this.cameras.main.fadeIn(350, 0, 0, 0);
        this.run(() => this.onEnter());
    }

    // ---------- CaseCtx ----------

    talk(lines: readonly L[]): Promise<void> {
        const clean = lines.map(([s, t]) => [s, t.replace(/\*/g, "")] as const);
        if (AUTO) {
            for (const [sp, t] of clean) autoLog.push(`${sp}: ${t}`);
            return new Promise((r) => this.time.delayedCall(1, r));
        }
        return conversation(this, clean);
    }

    choose(o: ChooseOptions): Promise<number[]> {
        return choose(this, o);
    }

    notice(title: string, body: string, button?: string): Promise<void> {
        return notice(this, title, body, button);
    }

    // ---------- flow helpers ----------

    /** Runs one script at a time; clicks while busy are ignored. */
    run(fn: () => Promise<void>): void {
        if (this.busy) return;
        this.busy = true;
        fn()
            .catch((e) => console.error("[casebound] script failed", e))
            .finally(() => {
                this.busy = false;
            });
    }

    go(id: string): void {
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => this.scene.restart({ id }));
    }

    toMap(): void {
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => this.scene.start("Hub"));
    }

    private topBar(): void {
        const s = save();
        const title = this.add
            .text(20, 16, this.place.title, {
                fontFamily: FONT,
                fontSize: "22px",
                fontStyle: "bold",
                color: "#fff6e0",
                backgroundColor: "#3b2a5ccc",
                padding: { x: 12, y: 6 },
            })
            .setDepth(9000);
        const canMap = s.tutorialDone && !["office", "landing", "rooftop", "ending"].includes(this.place.id);
        if (canMap) {
            const bar = this.add.container(0, 0).setDepth(9000);
            makeButton(this, bar, 20 + title.width + 12, 12, 110, "Map", () => {
                if (!this.busy) this.toMap();
            }, { center: true, fontSize: 18, fill: 0xffd23f });
        }
    }

    // ---------- props, cards, Exhibit A ----------

    private clickProp(id: string): void {
        this.run(async () => {
            const prop = this.place.props.find((x) => x.id === id);
            if (!prop) return;
            const n = this.clicks.get(id) ?? 0;
            this.clicks.set(id, n + 1);
            const line = prop.lines[Math.min(n, prop.lines.length - 1)];
            const speaker = id === "mug" || id === "cabinet" ? id : `prop:${id}`;
            if (line.startsWith("*")) {
                if (id === "suitcase") this.propImages.get(id)?.setTexture("prop_suitcase_open_robot");
                await this.talk([["narrator", line]]);
            } else {
                await this.talk([[speaker, line]]);
            }
        });
    }

    private placeCard(): void {
        const c = this.place.card;
        if (!c || save().cards.includes(this.place.id)) return;
        const spot = cardSpot(this.place.id) === 0 ? c.a : c.b;
        this.card = this.add.image(spot.x, spot.y, "ui_card_plain").setScale(0.09).setAngle(-12).setDepth(4);
        this.card.setInteractive({ useHandCursor: true });
        this.tweens.add({ targets: this.card, angle: 8, duration: 900, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
        this.card.on("pointerup", () => this.run(() => this.collectCard()));
    }

    private async collectCard(): Promise<void> {
        const c = this.place.card;
        if (!c || !this.card) return;
        const s = save();
        this.card.destroy();
        this.card = undefined;
        s.cards.push(this.place.id);
        commit();
        const n = s.cards.length;
        const intro: L =
            n === 1
                ? ["gus", "Ooh, a card! Hold still, I'm putting a box around it."]
                : n === 9
                  ? ["gus", "A full album. Nine boxes. My best work."]
                  : ["gus", "Another one for the album."];
        if (this.gus) await this.talk([intro, ["gus", `It says: "${c.text}"`]]);
        else await this.talk([["narrator", `Framework Card ${n} of 9: "${c.text}"`]]);
        toast(this, `Framework Cards: ${n} / 9`);
    }

    private placeExhibit(): void {
        const p = this.place;
        if (!p.exhibit || !save().results[p.id] || save().detectives.includes(p.id)) return;
        this.exhibit = this.add.image(p.exhibit.x, p.exhibit.y, "talk_exhibit_a_still").setScale(0.26).setDepth(3);
        this.exhibit.setInteractive({ useHandCursor: true });
        this.tweens.add({ targets: this.exhibit, y: p.exhibit.y - 6, duration: 1100, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
        this.exhibit.on("pointerup", () => this.run(() => this.detective()));
    }

    private async detective(): Promise<void> {
        const idx = DISTRICTS.indexOf(this.place.id as (typeof DISTRICTS)[number]);
        const m = MYSTERIES[Math.max(0, idx) % MYSTERIES.length];
        const order = [0, 1, 2].sort(() => rand() - 0.5);
        const clues = order.map((i) => m.clues[i]);
        await this.talk([["exhibit", "Something moved my numbers. Read my title first. Then my axes. Then tell me who did it."]]);
        const clueText = clues.map((c, i) => `Clue ${i + 1}: ${c}`).join("\n");
        let firstTry = true;
        const tried = new Set<string>();
        for (;;) {
            const suspect = await this.pickSuspect(m.title, clueText, tried);
            if (suspect === m.culprit) break;
            firstTry = false;
            tried.add(suspect);
            await this.talk([["exhibit", "Interesting theory. Read the clues again."]]);
        }
        const [proof] = await this.choose({ title: `Who did it? ${m.culprit}.`, prompt: "Which clue proves it?", options: clues });
        const right = order[proof] === m.proof;
        if (right && firstTry) {
            await this.talk([["exhibit", "Case closed. And you read my title. Nobody reads my title."]]);
        } else if (right) {
            await this.talk([["exhibit", "Got there in the end. Case closed."]]);
        } else {
            await this.talk([["exhibit", "Right suspect, wrong evidence. That clue would be true either way."]]);
        }
        const s = save();
        s.detectives.push(this.place.id);
        commit();
        this.exhibit?.destroy();
        this.exhibit = undefined;
        toast(this, `Driver Detective solved (${s.detectives.length} / 8)`);
    }

    /** Four suspect cards in a row; click one. */
    private pickSuspect(title: string, clueText: string, tried: Set<string>): Promise<string> {
        if (AUTO) {
            const left = ["Price", "Volume", "Mix", "Cost"].filter((n) => !tried.has(n));
            const n = left[Math.floor(rand() * left.length)];
            autoLog.push(`[suspect] ${title} -> ${n}`);
            return Promise.resolve(n);
        }
        return new Promise((resolve) => {
            const panel = makePanel(this, 860);
            const { content, x, top, width } = panel;
            let y = top + 20;
            y += addText(this, content, x + 28, y, width - 56, `Driver Detective: ${title}`, 26, true).height + 8;
            y += addText(this, content, x + 28, y, width - 56, clueText, 19).height + 10;
            y += addText(this, content, x + 28, y, width - 56, "Who did it? Click a suspect.", 20, true).height + 8;
            const names = ["Price", "Volume", "Mix", "Cost"];
            const cw = 150;
            const gap = (width - 56 - cw * 4) / 3;
            names.forEach((n, i) => {
                const cx = x + 28 + i * (cw + gap) + cw / 2;
                const img = this.add.image(cx, y, `ui_suspect_${n.toLowerCase()}`).setOrigin(0.5, 0);
                img.setScale(cw / img.width);
                const label = this.add
                    .text(cx, y + img.displayHeight - 46, n.toUpperCase(), { fontFamily: FONT, fontSize: "20px", fontStyle: "bold", color: "#5a2a10" })
                    .setOrigin(0.5, 0.5);
                content.add([img, label]);
                if (tried.has(n)) {
                    img.setAlpha(0.35);
                    label.setAlpha(0.35);
                } else {
                    img.setInteractive({ useHandCursor: true });
                    img.on("pointerover", () => img.setScale((cw / img.width) * 1.05));
                    img.on("pointerout", () => img.setScale(cw / img.width));
                    img.on("pointerup", () => {
                        panel.destroy();
                        resolve(n);
                    });
                }
            });
            y += (cw / 512) * 790 + 16;
            panel.layout(y - top + 10);
        });
    }

    // ---------- hosts and cases ----------

    private async talkToHost(): Promise<void> {
        const p = this.place;
        const c = p.caseId ? CASES[p.caseId] : undefined;
        if (!c) return;
        const s = save();
        const done = p.id === "lobby" ? s.tutorialDone : !!s.results[p.id];
        if (done) {
            if (p.doneLines) await this.talk(p.doneLines);
            const [again] = await this.choose({ title: c.title, prompt: "Play this case again for a better score?", options: ["Yes, run it again", "Not now"] });
            if (again !== 0) return;
        }
        const result = await runCase(this, c);
        await this.showResult(c.title, result);
        if (p.id === "lobby") {
            s.tutorialDone = true;
            commit();
            await this.talk([
                ["gus", "That's the whole loop! Every district out there has a client with a problem just like that."],
                ["gus", "Crack all eight and we go talk to the Blank Page. Oh, and keep an eye out for Framework Cards. They're hidden everywhere."],
            ]);
            this.toMap();
            return;
        }
        const best = s.results[p.id];
        if (!best || result.total > best.total) s.results[p.id] = result;
        commit();
        if (p.id === "foundry") this.propImages.get("oee_gauge")?.setTexture("prop_oee_gauge_70");
        this.placeExhibit();
        if (this.exhibit) await this.talk([["gus", "Psst. Exhibit A showed up on the wall. It's got a mystery for you, if you want it."]]);
    }

    async showResult(title: string, r: CaseResult): Promise<void> {
        await tablePanel(
            this,
            `Case closed: ${title}`,
            `${r.total} of 25 stars`,
            [
                ["Structure", stars(r.structure)],
                ["Analytics", stars(r.analytics)],
                ["Judgment", stars(r.judgment)],
                ["Communication", stars(r.communication)],
                ["Presence", stars(r.presence)],
            ],
            r.hints ? `Hints used: ${r.hints} (minus ${r.hints * 0.5} stars)` : "No hints used.",
        );
    }

    // ---------- place scripts ----------

    private async onEnter(): Promise<void> {
        const p = this.place;
        const s = save();
        switch (p.id) {
            case "office":
                return this.officeIntro();
            case "landing":
                return this.landing();
            case "lobby":
                if (!s.tutorialDone) {
                    await this.talk([
                        ["oracle", "Mmmmhm. *A sad vending machine hum.*"],
                        ["gus", "Let's warm up first. That vending machine looks like it has a problem."],
                        ["gus", "Click on things to talk to them. Try the vending machine."],
                    ]);
                }
                return;
            case "doors":
                return runDoors(this);
            case "rooftop":
                return runRooftop(this);
            case "ending":
                return runEnding(this);
            default:
                if (!s.results[p.id] && p.host) {
                    const name = HOST_NAMES[p.host.speaker] ?? "the client";
                    await this.talk([["gus", `That must be the client. Click on ${name} to hear the problem.`]]);
                }
        }
    }

    private async officeIntro(): Promise<void> {
        await this.talk([["wren", "One more case. Then sleep. Okay. Maybe two more cases."]]);
        await new Promise((r) => this.time.delayedCall(500, r));
        this.propImages.get("desk_lamp")?.setTexture("prop_desk_lamp_off");
        this.cameras.main.shake(400, 0.006);
        await this.talk([
            ["narrator", "The lamp flickers out. The floor tilts."],
            ["narrator", "Wren slides through the carpet like it's a playground slide, and lands in a pile of crumpled sticky notes."],
        ]);
        this.go("landing");
    }

    private async landing(): Promise<void> {
        await this.talk([
            ["gus", "Oh good, a person! Hold still, I want to draw a box around you."],
            ["wren", "Who are you?"],
            ["gus", "Gus. Easel. Professional box enthusiast. Welcome to the Undercase, where problems go when nobody solves them."],
            ["wren", "How do I get home?"],
            ["gus", "Same way everyone does. Crack a case in every district, then go talk to the Blank Page."],
            ["gus", "It's a giant empty whiteboard at the top of the city. Everyone's afraid of it."],
            ["wren", "It's just... empty?"],
            ["gus", "Exactly. Terrifying. Let's warm up first."],
        ]);
        save().introDone = true;
        commit();
        this.go("lobby");
    }

    /** Swaps the Blank Page between its dim, glow and gold states. */
    setBlank(state: "dim" | "glow" | "gold"): void {
        this.blank?.setTexture(`blank_${state}`);
    }

    addBlank(): Img {
        this.blank = this.add.image(800, 640, "blank_dim").setOrigin(0.5, 1).setScale(0.55).setDepth(5);
        this.tweens.add({ targets: this.blank, y: 625, duration: 1600, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
        return this.blank;
    }

    get panelHelpers() {
        return { makePanel, addText, makeButton };
    }
}
