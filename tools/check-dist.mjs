// Size budget for the built game. Run after `npm run build`.
// Players load every image up front behind a progress bar, so download size is load time,
// most of all on a phone. The limits leave room to grow but stop a stray 20 MB PNG.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const DIST = "dist";
const MB = 1024 * 1024;
const TOTAL_LIMIT = 40 * MB;
const FILE_LIMIT = 3 * MB;

function walk(dir) {
    return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
        e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
    );
}

let files;
try {
    files = walk(DIST);
} catch {
    console.error(`No ${DIST}/ folder. Run "npm run build" first.`);
    process.exit(1);
}

const sized = files.map((f) => ({ f: relative(DIST, f), size: statSync(f).size })).sort((a, b) => b.size - a.size);
const total = sized.reduce((n, x) => n + x.size, 0);
const fmt = (n) => `${(n / MB).toFixed(2)} MB`;
const problems = [];

if (total > TOTAL_LIMIT) problems.push(`dist is ${fmt(total)}, over the ${fmt(TOTAL_LIMIT)} budget`);
for (const { f, size } of sized) if (size > FILE_LIMIT) problems.push(`${f} is ${fmt(size)}, over the ${fmt(FILE_LIMIT)} per-file limit`);

// The page must point at a script that was actually built.
const html = readFileSync(join(DIST, "index.html"), "utf8");
for (const m of html.matchAll(/src="\.?\/?([^"]+)"/g)) {
    if (!sized.some((x) => x.f === m[1])) problems.push(`index.html loads ${m[1]}, which is not in dist`);
}

console.log(`dist: ${sized.length} files, ${fmt(total)} (budget ${fmt(TOTAL_LIMIT)})`);
console.log("largest:");
for (const { f, size } of sized.slice(0, 5)) console.log(`  ${fmt(size).padStart(9)}  ${f}`);

if (process.env.GITHUB_STEP_SUMMARY) {
    const { appendFileSync } = await import("node:fs");
    appendFileSync(
        process.env.GITHUB_STEP_SUMMARY,
        `### Build size\n\n${sized.length} files, **${fmt(total)}** of ${fmt(TOTAL_LIMIT)} budget\n\n` +
            sized.slice(0, 5).map(({ f, size }) => `- ${fmt(size)} \`${f}\``).join("\n") +
            "\n",
    );
}

if (problems.length) {
    for (const p of problems) console.error(`::error::${p}`);
    process.exit(1);
}
