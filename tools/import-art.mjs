#!/usr/bin/env node
/**
 * Finishes Midjourney downloads and puts them in the game. No API, no cost.
 *
 *   npm run art:import -- props/gavel ~/Downloads/gavel.png
 *   npm run art:import -- mouth/wren:half wren-half.png mouth/wren:wide wren-wide.png
 *   npm run art:import -- --list                    what is still missing
 *
 * Pairs of <job name> <file>, job names from tools/asset-jobs.json. For each one:
 *   props  the background is removed (a flat Midjourney background is detected from the image's edges; a PNG you
 *          already cut out in Midjourney's Editor is kept as is), then the object is trimmed and fitted to the same
 *          canvas as the file it replaces, so it shows up at the same size in the room.
 *   mouth  the Editor result is scaled to the closed-mouth picture and only the oval around the mouth is blended in,
 *          so the rest of the character stays pixel-identical and never jitters. Use :half or :wide.
 *
 * Once both mouth frames of a character are in, that character lip-flaps in the game and characters.json is updated.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";
import {
    blendMouth,
    fitToCanvas,
    jobHash,
    keyOutBackground,
    loadConfig,
    loadManifest,
    saveManifest,
    writeMouthFramesFile,
} from "./generate-assets.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const abs = (p) => (path.isAbsolute(p) ? p : path.join(ROOT, p));

/** Looks at the outer edge of the picture. Returns null if it is already transparent, else the background colour. */
export async function detectBackground(png) {
    const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const { width: w, height: h } = info;
    const samples = [];
    let transparent = 0;
    const take = (x, y) => {
        const i = (y * w + x) * 4;
        if (data[i + 3] < 128) transparent++;
        else samples.push([data[i], data[i + 1], data[i + 2]]);
    };
    for (let x = 0; x < w; x += 2) {
        take(x, 0);
        take(x, h - 1);
    }
    for (let y = 0; y < h; y += 2) {
        take(0, y);
        take(w - 1, y);
    }
    if (transparent > samples.length) return null;
    const median = (c) => samples.map((s) => s[c]).sort((a, b) => a - b)[Math.floor(samples.length / 2)];
    return { r: median(0), g: median(1), b: median(2) };
}

async function importProp(job, file) {
    let png = fs.readFileSync(file);
    const bg = await detectBackground(png);
    if (bg) png = await keyOutBackground(png, bg);
    else png = await sharp(png).trim({ threshold: 1 }).png().toBuffer();
    if (job.fit) png = await fitToCanvas(png, job.fit);
    fs.mkdirSync(path.dirname(abs(job.out)), { recursive: true });
    fs.writeFileSync(abs(job.out), png);
    return [job.out];
}

async function importMouth(job, frameName, file) {
    const index = { half: 0, wide: 1 }[frameName];
    if (index === undefined || !job.frames[index]) throw new Error(`Use ${job.name}:half or ${job.name}:wide.`);
    const original = fs.readFileSync(abs(job.source));
    const { width, height } = await sharp(original).metadata();
    const blended = await blendMouth(original, fs.readFileSync(file), job.mouthBox, { left: 0, top: 0, width, height });
    fs.writeFileSync(abs(job.frames[index].out), blended);
    return [job.frames[index].out];
}

export async function run(args, log = console.log) {
    const cfg = loadConfig();
    cfg.model = cfg.model || "gpt-image-2";
    const manifest = loadManifest();

    if (args.includes("--list") || args.length === 0) {
        for (const job of cfg.jobs) {
            const outs = job.type === "mouth" ? job.frames.map((f) => f.out) : [job.out];
            const have = outs.filter((o) => manifest.jobs[job.name]?.outputs?.includes(o)).length;
            log(`${have === outs.length ? "done" : have ? "part" : "todo"}  ${job.name}${job.type === "mouth" ? "  (:half, :wide)" : ""}`);
        }
        if (args.length === 0) log("\nUsage: npm run art:import -- <job name> <file> [<job name> <file> ...]");
        return 0;
    }
    if (args.length % 2 !== 0) throw new Error("Give pairs of <job name> <file>.");

    let failed = 0;
    for (let i = 0; i < args.length; i += 2) {
        const [name, frame] = args[i].split(":");
        const file = path.resolve(args[i + 1]);
        try {
            const job = cfg.jobs.find((j) => j.name === name);
            if (!job) throw new Error(`No job named "${name}". See npm run art:import -- --list`);
            if (!fs.existsSync(file)) throw new Error(`Can't find ${args[i + 1]}`);
            const outputs = job.type === "mouth" ? await importMouth(job, frame, file) : await importProp(job, file);
            const prev = manifest.jobs[job.name]?.outputs || [];
            manifest.jobs[job.name] = {
                hash: jobHash(cfg, job),
                outputs: [...new Set([...prev, ...outputs])].sort(),
                at: new Date().toISOString(),
                source: "midjourney",
            };
            saveManifest(manifest);
            log(`ok    ${args[i]} -> ${outputs.join(", ")}`);
        } catch (err) {
            failed++;
            log(`FAIL  ${args[i]}: ${err.message}`);
        }
    }
    const ready = writeMouthFramesFile(cfg, manifest);
    if (ready.length) log(`Talking frames active for: ${ready.join(", ")}`);
    return failed;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
    run(process.argv.slice(2))
        .then((failed) => process.exit(failed ? 1 : 0))
        .catch((err) => {
            console.error(err.message);
            process.exit(1);
        });
}
