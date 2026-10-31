/** A line of dialogue: [speaker id, text]. Speaker ids are registered in speakers.ts. */
export type L = readonly [string, string];

/** One option in a choice panel. */
export interface Choice {
    text: string;
    /** The best answer. */
    ok?: boolean;
    /** Acceptable but not best (half credit where it applies). */
    partial?: boolean;
    /** What happens when this option is picked. */
    reply?: L[];
    /** Objective only: picking this spends a Question Lantern to get the missing number. */
    costsLantern?: boolean;
}

export interface ObjectiveRow {
    label: string;
    options: Choice[];
}

export interface Lantern {
    q: string;
    useful: boolean;
    reply: L[];
}

export interface Bucket {
    text: string;
    critical: boolean;
    /** Coaching when this decoy ends up on the board. */
    coach?: L[];
}

export type Beat = "objective" | "lanterns" | "board" | "flag" | "drive" | "close";

export interface CaseData {
    id: string;
    host: string;
    title: string;
    caseType: string;
    prompt: L[];
    objective: ObjectiveRow[];
    restate: L[];
    lanterns: Lantern[];
    board: { title: string; instruction: string; buckets: Bucket[]; min: number; max: number };
    start: { question: string; options: Choice[] };
    hypothesis: { question: string; options: Choice[] };
    data: { card: string; options: Choice[] };
    math: { q: string; options: Choice[] };
    close: { options: Choice[]; after: L[] };
    partner: L[];
    hints: [string, string, string];
    /** Tutorial lines Gus says before each beat (prologue only). */
    tutorial?: Partial<Record<Beat, L[]>>;
}

export interface PropDef {
    id: string;
    /** Texture key. */
    key: string;
    x: number;
    y: number;
    scale: number;
    /** Name shown in the text box when the object talks. */
    name: string;
    /** Escalating lines; the last one repeats. Lines starting with "*" are narration. */
    lines: string[];
}

export interface CardSpot {
    x: number;
    y: number;
    label: string;
}

export interface PlaceDef {
    id: string;
    bg: string;
    title: string;
    wrenX: number;
    gusX?: number;
    host?: { speaker: string; key: string; x: number; y?: number; scale?: number };
    props: PropDef[];
    card?: { a: CardSpot; b: CardSpot; text: string };
    caseId?: string;
    /** Where Exhibit A appears after the case, for Driver Detective. */
    exhibit?: { x: number; y: number };
    /** Lines the host says when clicked after the case is solved. */
    doneLines?: L[];
}

export interface Gauges {
    structure: number;
    analytics: number;
    judgment: number;
    communication: number;
    presence: number;
}

export interface CaseResult extends Gauges {
    total: number;
    hints: number;
}
