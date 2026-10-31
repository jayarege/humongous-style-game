import type { CaseResult } from "./types";
import { rand } from "./rng";

/**
 * Casebound's progress, saved in this browser. Saving can fail (private windows, blocked storage);
 * the game keeps working from memory when it does.
 */
export interface SaveData {
    version: 1;
    introDone: boolean;
    tutorialDone: boolean;
    /** Best result per case id (districts only). */
    results: Record<string, CaseResult>;
    /** Card hunt: which places' cards were found. */
    cards: string[];
    /** 0 or 1 per place: which of the two hiding spots holds the card. */
    cardSpots: Record<string, 0 | 1>;
    detectives: string[];
    quizCorrect: string[];
    quizBest: number;
    finaleDone: boolean;
    unlockAll: boolean;
}

const KEY = "casebound-save";

function fresh(): SaveData {
    return {
        version: 1,
        introDone: false,
        tutorialDone: false,
        results: {},
        cards: [],
        cardSpots: {},
        detectives: [],
        quizCorrect: [],
        quizBest: 0,
        finaleDone: false,
        unlockAll: false,
    };
}

let data: SaveData = load();

function load(): SaveData {
    try {
        const raw = localStorage.getItem(KEY);
        if (raw) {
            const parsed = JSON.parse(raw) as SaveData;
            if (parsed && parsed.version === 1) return { ...fresh(), ...parsed };
        }
    } catch {
        // Storage unavailable: start fresh in memory.
    }
    return fresh();
}

export function save(): SaveData {
    return data;
}

export function commit(): void {
    try {
        localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
        // Ignore: progress stays in memory for this session.
    }
}

export function resetSave(): void {
    data = fresh();
    commit();
}

export function cardSpot(placeId: string): 0 | 1 {
    if (data.cardSpots[placeId] === undefined) {
        data.cardSpots[placeId] = rand() < 0.5 ? 0 : 1;
        commit();
    }
    return data.cardSpots[placeId];
}

export function clearedCount(): number {
    return Object.keys(data.results).length;
}
