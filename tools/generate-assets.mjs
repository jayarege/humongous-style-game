#!/usr/bin/env node
/**
 * Generates game art with OpenAI's image API, matched to the existing Midjourney art.
 *
 *   npm run art:generate                  run every job in tools/asset-jobs.json that isn't done yet
 *   npm run art:generate -- --only gavel  only jobs whose name contains "gavel"
 *   npm run art:generate -- --force       redo jobs even if they are already done
 *   npm run art:generate -- --dry-run     print what would be sent, call nothing
 *   npm run art:generate -- --list        show every job and whether it is done
 *
 * Needs OPENAI_API_KEY (add it as a Codespaces secret; never commit it, the repo is public).
 *
 * Two kinds of job:
 *   "image"  a new picture (props, icons, UI). Saved straight over the file the game loads, fitted to the same
 *            canvas size so it shows up at the same size on screen. "transparent": true removes the background.
 *   "mouth"  talking frames for a character. Only a small area around the mouth is regenerated and blended back
 *            into the closed-mouth picture, so the rest of the character stays pixel-identical and never jitters.
 *
 * Finished jobs are recorded in tools/.asset-manifest.json. Editing a job's prompt makes it run again next time.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const JOBS_FILE = path.join(ROOT, process.env.ASSET_JOBS || "tools/asset-jobs.json");
const MANIFEST_FILE = path.join(ROOT, "tools/.asset-manifest.json");
const MOUTH_TS_FILE = path.join(ROOT, "src/casebound/mouthFrames.generated.ts");
const CHARACTERS_JSON = path.join(ROOT, "public/characters/characters.json");

// Background removal: the model paints the subject on magenta, which is then keyed out.
const KEY = { r: 255, g: 0, b: 255 };
const KEY_HARD = 70; // colour distance below this is fully transparent
const KEY_SOFT = 150; // between HARD and SOFT fades out, for smooth edges

// ─── Small helpers ──────────────────────────────────────────────────────────

const abs = (p) => (path.isAbsolute(p) ? p : path.join(ROOT, p));
const rel = (p) => path.relative(ROOT, p);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export function loadConfig(file = JOBS_FILE) {
    if (!fs.existsSync(file)) throw new Error(`Can't find ${rel(file)}.`);
    const cfg = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!Array.isArray(cfg.jobs) || cfg.jobs.length === 0) throw new Error(`${rel(file)} has no jobs.`);
    const names = new Set();
    for (const job of cfg.jobs) {
        if (!job.name) throw new Error("Every job needs a name.");
        if (names.has(job.name)) throw new Error(`Two jobs are both named "${job.name}".`);
        names.add(job.name);
    }
    return cfg;
}

function loadManifest() {
    try {
        return JSON.parse(fs.readFileSync(MANIFEST_FILE, "utf8"));
    } catch {
        return { jobs: {} };
    }
}

function saveManifest(manifest) {
    const sorted = Object.fromEntries(Object.entries(manifest.jobs).sort(([a], [b]) => a.localeCompare(b)));
    fs.writeFileSync(MANIFEST_FILE, JSON.stringify({ jobs: sorted }, null, 2) + "\n");
}

/** Changes whenever anything that affects the output changes, so edited jobs run again. */
export function jobHash(cfg, job) {
    const style = job.type === "mouth" ? cfg.mouthStylePrompt : cfg.stylePrompt;
    const refs = job.type === "mouth" ? [] : job.styleRefs || cfg.styleRefs || [];
    const payload = JSON.stringify({ job, style, refs, model: cfg.model });
    return crypto.createHash("sha256").update(payload).digest("hex").slice(0, 16);
}

/** Pictures sent to the API are flattened onto white: transparent pixels can be read as "edit here". */
async function uploadable(source, name, toFile) {
    const input = Buffer.isBuffer(source) ? source : fs.readFileSync(abs(source));
    const png = await sharp(input).flatten({ background: "#ffffff" }).png().toBuffer();
    return toFile(png, name, { type: "image/png" });
}

// ─── Image processing ───────────────────────────────────────────────────────

/** Makes the magenta background transparent, with soft edges and the pink fringe removed. */
export async function keyOutBackground(png) {
    const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const dist = Math.hypot(r - KEY.r, g - KEY.g, b - KEY.b);
        if (dist < KEY_HARD) {
            data[i + 3] = 0;
        } else if (dist < KEY_SOFT) {
            const t = (dist - KEY_HARD) / (KEY_SOFT - KEY_HARD);
            data[i + 3] = Math.round(data[i + 3] * t);
            const spill = Math.max(0, Math.min(r, b) - g);
            data[i] = Math.max(0, r - spill);
            data[i + 2] = Math.max(0, b - spill);
        }
    }
    return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
        .trim({ threshold: 1 })
        .png()
        .toBuffer();
}

/** Scales the picture to fit inside a fixed canvas, centred, so it replaces the old file at the same size. */
export async function fitToCanvas(png, { width, height, padding = 0, align = "center" }) {
    const inner = await sharp(png)
        .resize(width - padding * 2, height - padding * 2, { fit: "inside" })
        .png()
        .toBuffer();
    const meta = await sharp(inner).metadata();
    const left = Math.round((width - meta.width) / 2);
    const top = align === "bottom" ? height - padding - meta.height : Math.round((height - meta.height) / 2);
    return sharp({ create: { width, height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
        .composite([{ input: inner, left, top }])
        .png({ compressionLevel: 9 })
        .toBuffer();
}

/** The square around the mouth that gets sent to the model. */
export function mouthCrop(box, imgW, imgH) {
    const [x0, y0, x1, y1] = box;
    const bw = x1 - x0;
    const bh = y1 - y0;
    const side = clamp(Math.round(Math.max(bw, bh) * 2.4), 160, Math.min(imgW, imgH));
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    return {
        left: clamp(Math.round(cx - side / 2), 0, imgW - side),
        top: clamp(Math.round(cy - side / 2), 0, imgH - side),
        size: side,
    };
}

/**
 * Blends the regenerated crop back into the original, but only inside a soft oval around the mouth.
 * The original's transparency is kept, so the character's outline never changes.
 */
export async function blendMouth(originalPng, generatedPng, box, crop) {
    const orig = await sharp(originalPng).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const gen = await sharp(generatedPng)
        .resize(crop.size, crop.size, { fit: "fill" })
        .ensureAlpha()
        .raw()
        .toBuffer();
    const W = orig.info.width;
    const out = Buffer.from(orig.data);
    const [x0, y0, x1, y1] = box;
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2 + (y1 - y0) * 0.1; // open mouths grow downwards
    const rx = ((x1 - x0) / 2) * 1.3;
    const ry = ((y1 - y0) / 2) * 1.5;
    for (let y = crop.top; y < crop.top + crop.size; y++) {
        for (let x = crop.left; x < crop.left + crop.size; x++) {
            const d = Math.hypot((x - cx) / rx, (y - cy) / ry);
            if (d >= 1) continue;
            const t = clamp((1 - d) / 0.3, 0, 1); // feather the outer 30% of the oval
            const m = t * t * (3 - 2 * t);
            const oi = (y * W + x) * 4;
            const gi = ((y - crop.top) * crop.size + (x - crop.left)) * 4;
            for (let c = 0; c < 3; c++) out[oi + c] = Math.round(orig.data[oi + c] * (1 - m) + gen[gi + c] * m);
        }
    }
    return sharp(out, { raw: { width: W, height: orig.info.height, channels: 4 } })
        .png({ compressionLevel: 9 })
        .toBuffer();
}

// ─── Prompts ────────────────────────────────────────────────────────────────

export function imagePrompt(cfg, job, basedOn) {
    const parts = [cfg.stylePrompt, job.prompt];
    if (basedOn) parts.push("The LAST reference image is this exact object. Draw the same object, same design and colours, with only this change.");
    if (job.transparent) {
        parts.push(
            "Show only this one object, whole and centred, on a perfectly flat solid magenta (#FF00FF) background. " +
                "No shadow, no floor, no gradient, no other objects, no text unless asked. Do not use magenta on the object.",
        );
    }
    return parts.filter(Boolean).join("\n\n");
}

export function mouthPrompt(cfg, job, frame) {
    return [cfg.mouthStylePrompt, job.describe ? `The character: ${job.describe}.` : "", `Change ONLY the mouth: ${frame.prompt}.`]
        .filter(Boolean)
        .join("\n\n");
}

// ─── Jobs ───────────────────────────────────────────────────────────────────

async function runImageJob(ctx, job) {
    const { cfg, client, toFile, manifest, dryRun } = ctx;
    const refs = [...(job.styleRefs || cfg.styleRefs || [])];
    let basedOn = null;
    if (job.basedOn) {
        const parent = cfg.jobs.find((j) => j.name === job.basedOn);
        if (!parent) throw new Error(`basedOn "${job.basedOn}" is not a job name.`);
        if (!dryRun && !manifest.jobs[parent.name]) return { skipped: `waiting for "${parent.name}" to be generated first` };
        basedOn = parent.out;
        refs.push(parent.out);
    }
    const prompt = imagePrompt(cfg, job, basedOn);
    const size = job.size || "1024x1024";
    if (dryRun) return { dry: { refs, size, prompt } };

    const res = refs.length
        ? await client.images.edit({
              model: cfg.model,
              image: await Promise.all(refs.map((r, i) => uploadable(r, `ref${i}.png`, toFile))),
              prompt,
              size,
              ...(job.quality ? { quality: job.quality } : {}),
          })
        : await client.images.generate({ model: cfg.model, prompt, size, ...(job.quality ? { quality: job.quality } : {}) });

    let png = Buffer.from(res.data[0].b64_json, "base64");
    if (job.transparent) png = await keyOutBackground(png);
    if (job.fit) png = await fitToCanvas(png, job.fit);
    fs.mkdirSync(path.dirname(abs(job.out)), { recursive: true });
    fs.writeFileSync(abs(job.out), png);
    return { outputs: [job.out] };
}

async function runMouthJob(ctx, job) {
    const { cfg, client, toFile, dryRun } = ctx;
    const original = fs.readFileSync(abs(job.source));
    const meta = await sharp(original).metadata();
    const crop = mouthCrop(job.mouthBox, meta.width, meta.height);
    if (dryRun) {
        return { dry: { crop, frames: job.frames.map((f) => ({ out: f.out, prompt: mouthPrompt(cfg, job, f) })) } };
    }
    const cropPng = await sharp(original)
        .extract({ left: crop.left, top: crop.top, width: crop.size, height: crop.size })
        .flatten({ background: "#ffffff" })
        .resize(1024, 1024)
        .png()
        .toBuffer();

    const outputs = [];
    for (const frame of job.frames) {
        const res = await client.images.edit({
            model: cfg.model,
            image: [await uploadable(cropPng, "face.png", toFile)],
            prompt: mouthPrompt(cfg, job, frame),
            size: "1024x1024",
            ...(job.quality ? { quality: job.quality } : {}),
        });
        const generated = Buffer.from(res.data[0].b64_json, "base64");
        const blended = await blendMouth(original, generated, job.mouthBox, crop);
        fs.writeFileSync(abs(frame.out), blended);
        outputs.push(frame.out);
    }
    return { outputs };
}

/** Rewrites the list of characters whose talking frames exist, which the game reads to switch on lip flap. */
export function writeMouthFramesFile(cfg, manifest) {
    const ready = cfg.jobs
        .filter((j) => j.type === "mouth" && manifest.jobs[j.name] && j.frames.every((f) => fs.existsSync(abs(f.out))))
        .map((j) => j.character)
        .sort();
    const body =
        "// Written by tools/generate-assets.mjs. Do not edit by hand.\n" +
        "// Characters listed here have generated half and wide mouth frames, so they lip-flap instead of bobbing.\n" +
        `export const GENERATED_MOUTH_FRAMES: readonly string[] = ${JSON.stringify(ready)};\n`;
    const current = fs.existsSync(MOUTH_TS_FILE) ? fs.readFileSync(MOUTH_TS_FILE, "utf8") : "";
    if (current !== body) fs.writeFileSync(MOUTH_TS_FILE, body);
    updateCharacterPack(cfg, ready);
    return ready;
}

/**
 * Keeps public/characters/characters.json pointing at the real talking frames. That file plus the character folders
 * is the reusable character pack: copy public/characters/ into another build and the frames come with it.
 */
function updateCharacterPack(cfg, ready) {
    if (!fs.existsSync(CHARACTERS_JSON)) return;
    const pack = JSON.parse(fs.readFileSync(CHARACTERS_JSON, "utf8"));
    let changed = false;
    for (const job of cfg.jobs) {
        if (job.type !== "mouth" || !ready.includes(job.character)) continue;
        const entry = pack.characters?.[job.character];
        if (!entry?.frames) continue;
        const toPackPath = (p) => path.relative(path.dirname(CHARACTERS_JSON), abs(p)).split(path.sep).join("/");
        for (const [slot, frame] of [["half", job.frames[0]], ["wide", job.frames[1]]]) {
            if (!frame) continue;
            const want = `characters/${toPackPath(frame.out)}`;
            if (entry.frames[slot] !== want) {
                entry.frames[slot] = want;
                changed = true;
            }
        }
    }
    if (changed) fs.writeFileSync(CHARACTERS_JSON, JSON.stringify(pack, null, 2) + "\n");
}

// ─── Main ───────────────────────────────────────────────────────────────────

export async function run({ args = [], client = null, toFile = null, log = console.log } = {}) {
    const dryRun = args.includes("--dry-run");
    const force = args.includes("--force");
    const list = args.includes("--list");
    const onlyIdx = args.indexOf("--only");
    const only = onlyIdx >= 0 ? args[onlyIdx + 1] : null;

    const cfg = loadConfig();
    cfg.model = cfg.model || process.env.IMAGE_MODEL || "gpt-image-2";
    const manifest = loadManifest();
    const jobs = only ? cfg.jobs.filter((j) => j.name.includes(only)) : cfg.jobs;

    if (list) {
        for (const job of cfg.jobs) {
            const entry = manifest.jobs[job.name];
            const state = !entry ? "todo   " : entry.hash === jobHash(cfg, job) ? "done   " : "changed";
            log(`${state}  ${job.name}`);
        }
        return { made: 0, skipped: 0, failed: 0 };
    }
    if (jobs.length === 0) {
        log(`No jobs match "${only}".`);
        return { made: 0, skipped: 0, failed: 0 };
    }

    if (!dryRun && !client) {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error(
                "OPENAI_API_KEY is not set. Add it as a Codespaces secret (github.com/settings/codespaces), " +
                    "give it access to this repo, then stop and restart the codespace.",
            );
        }
        const openai = await import("openai");
        client = new openai.default();
        toFile = openai.toFile;
    }

    const ctx = { cfg, client, toFile, manifest, dryRun };
    let made = 0;
    let skipped = 0;
    let failed = 0;

    for (const job of jobs) {
        const hash = jobHash(cfg, job);
        if (!force && !dryRun && manifest.jobs[job.name]?.hash === hash) {
            skipped++;
            continue;
        }
        try {
            if (!dryRun) log(`make  ${job.name}`);
            const result = job.type === "mouth" ? await runMouthJob(ctx, job) : await runImageJob(ctx, job);
            if (result.dry) {
                log(`\n=== ${job.name} ===\n${JSON.stringify(result.dry, null, 2)}`);
            } else if (result.skipped) {
                skipped++;
                log(`skip  ${job.name}: ${result.skipped}`);
            } else {
                made++;
                manifest.jobs[job.name] = { hash, outputs: result.outputs, at: new Date().toISOString() };
                saveManifest(manifest);
                for (const o of result.outputs) log(`      saved ${o}`);
            }
        } catch (err) {
            failed++;
            log(`FAIL  ${job.name}: ${err?.message || err}`);
            if (err?.status === 401) throw new Error("The API key was rejected. Check the OPENAI_API_KEY secret.");
            if (err?.status === 403) {
                throw new Error(
                    "OpenAI refused image access for this account. Image models can require verifying your " +
                        "organization at platform.openai.com/settings/organization/general.",
                );
            }
        }
    }

    if (!dryRun) {
        const ready = writeMouthFramesFile(cfg, manifest);
        log(`\nDone. ${made} made, ${skipped} skipped, ${failed} failed.`);
        if (ready.length) log(`Talking frames active for: ${ready.join(", ")}`);
        if (made) log("Run `npm run dev` and check the new art in the game. Commit when you're happy.");
    }
    return { made, skipped, failed };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
    run({ args: process.argv.slice(2) })
        .then(({ failed }) => process.exit(failed ? 1 : 0))
        .catch((err) => {
            console.error(`\n${err.message}`);
            process.exit(1);
        });
}
