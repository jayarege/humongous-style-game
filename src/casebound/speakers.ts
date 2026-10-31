import { registerSpeakers } from "../dialogue/talk";
import { caseboundSpeakerDefs } from "./speakerDefs";

/** Registers everyone who talks. The list itself lives in speakerDefs.ts. */
export function registerCaseboundSpeakers(): void {
    registerSpeakers(caseboundSpeakerDefs());
}
