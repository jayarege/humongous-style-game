// End-to-end checks against the built game (dist/). Starts its own preview server.
//
//   npm run build && npm run e2e
//   E2E_SEED=12345 npm run e2e      (replay a run exactly; failures print their seed)
//
// 1. Smoke: normal mode. Every image loads, the title screen draws, and a real mouse click on
//    Start reaches the opening scene.
// 2. Playthrough: ?auto=SEED mode picks seeded random answers and closes panels by itself. Plays
//    the tutorial, every district (card, case, Driver Detective), the finale, the rank screen and
//    the quiz.
//
// Any page error, console error or failed request fails the run. Screenshots and the auto log are
// written to e2e-output/ (CI keeps them for a week).
import { mkdirSync, writeFileSync } from "node:fs";
import { createServer } from "node:net";
import { chromium } from "playwright";
import { preview } from "vite";

const OUT = "e2e-output";
mkdirSync(OUT, { recursive: true });

const SEED = Number.parseInt(process.env.E2E_SEED ?? "", 10) >>> 0 || Math.floor(Math.random() * 2 ** 31);

function freePort() {
    return new Promise((resolve, reject) => {
        const srv = createServer();
        srv.on("error", reject);
        srv.listen(0, "127.0.0.1", () => {
            const { port } = srv.address();
            srv.close(() => resolve(port));
        });
    });
}

/** Serves dist/ in this same process, so closing it can't leave a stray server holding the run open. */
async function startServer() {
    const port = await freePort();
    const server = await preview({ logLevel: "warn", preview: { host: "127.0.0.1", port, strictPort: true, open: false } });
    return { url: `http://127.0.0.1:${port}/`, stop: () => server.close() };
}

/** Collects every error the page reports. */
function watch(page) {
    const errors = [];
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
    page.on("console", (m) => m.type() === "error" && errors.push(`console: ${m.text()}`));
    page.on("requestfailed", (r) => errors.push(`request failed: ${r.url()} (${r.failure()?.errorText})`));
    page.on("response", (r) => r.status() >= 400 && errors.push(`HTTP ${r.status()}: ${r.url()}`));
    return errors;
}

async function waitFor(page, fn, label, ms = 60000, arg) {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) {
        if (await page.evaluate(fn, arg)) return;
        await page.waitForTimeout(200);
    }
    await page.screenshot({ path: `${OUT}/timeout.png` }).catch(() => {});
    throw new Error(`timed out waiting for: ${label}`);
}

const placeIdle = (id) => {
    const s = window.__game?.scene.getScene("Place");
    return !!s && s.scene.isActive() && s.place?.id === id && !s.busy;
};
const notBusy = () => !window.__game.scene.getScene("Place").busy;
const saved = () => JSON.parse(localStorage.getItem("casebound-save") || "{}");

async function smoke(browser, url) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 760 } });
    const errors = watch(page);
    await page.goto(url);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await waitFor(page, () => window.__game?.scene.isActive("Title"), "title screen");
    const textures = await page.evaluate(() => window.__game.textures.getTextureKeys().length);
    if (textures < 60) throw new Error(`only ${textures} textures loaded`);
    await page.screenshot({ path: `${OUT}/smoke-title.png` });

    // Click Start the way a player would: find the button's label and click it on the canvas.
    const at = await page.evaluate(() => {
        const scene = window.__game.scene.getScene("Title");
        const find = (list) => {
            for (const o of list) {
                if (o.list) {
                    const r = find(o.list);
                    if (r) return r;
                } else if (o.type === "Text" && o.text === "Start") return o;
            }
        };
        const label = find(scene.children.list);
        if (!label) return null;
        const b = label.getBounds();
        const rect = window.__game.canvas.getBoundingClientRect();
        const k = rect.width / 1280;
        return { x: rect.left + b.centerX * k, y: rect.top + b.centerY * k };
    });
    if (!at) throw new Error("no Start button on the title screen");
    await page.mouse.click(at.x, at.y);
    await waitFor(page, () => window.__game.scene.isActive("Place") && window.__game.scene.getScene("Place").place?.id === "office", "office scene after Start", 15000);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${OUT}/smoke-office.png` });
    await page.close();
    return errors;
}

async function playthrough(browser, url) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 760 } });
    const errors = watch(page);
    await page.goto(`${url}?auto=${SEED}`);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await waitFor(page, () => window.__game?.scene.isActive("Title"), "title screen");
    const content = await page.evaluate(() => window.__cbContent);
    if (!content?.districts?.length) throw new Error("the game did not report its content in test mode");

    await page.evaluate(() => window.__game.scene.getScene("Title").begin());
    await waitFor(page, () => JSON.parse(localStorage.getItem("casebound-save") || "{}").introDone, "intro");
    await waitFor(page, placeIdle, "lobby", 60000, "lobby");
    await page.evaluate(() => {
        const s = window.__game.scene.getScene("Place");
        s.run(() => s.collectCard());
    });
    await waitFor(page, notBusy, "lobby card");
    await page.evaluate(() => {
        const s = window.__game.scene.getScene("Place");
        s.run(() => s.talkToHost());
    });
    await waitFor(page, () => JSON.parse(localStorage.getItem("casebound-save") || "{}").tutorialDone, "tutorial case", 120000);
    await waitFor(page, () => window.__game.scene.isActive("Hub"), "map after tutorial");
    await page.screenshot({ path: `${OUT}/auto-map.png` });

    const results = {};
    for (const id of content.districts) {
        await page.evaluate((id) => window.__game.scene.start("Place", { id }), id);
        await waitFor(page, placeIdle, `enter ${id}`, 60000, id);
        await page.evaluate(() => {
            const s = window.__game.scene.getScene("Place");
            s.run(() => s.collectCard());
        });
        await waitFor(page, notBusy, `card in ${id}`);
        await page.evaluate(() => {
            const s = window.__game.scene.getScene("Place");
            s.run(() => s.talkToHost());
        });
        await waitFor(page, (id) => !!JSON.parse(localStorage.getItem("casebound-save") || "{}").results?.[id], `case in ${id}`, 120000, id);
        await waitFor(page, notBusy, `idle after ${id}`);
        await page.evaluate(() => {
            const s = window.__game.scene.getScene("Place");
            s.run(() => s.detective());
        });
        await waitFor(page, (id) => JSON.parse(localStorage.getItem("casebound-save") || "{}").detectives?.includes(id), `Driver Detective in ${id}`, 60000, id);
        results[id] = (await page.evaluate(saved)).results[id];
        console.log(`  ${id.padEnd(16)} ${results[id].total} / 25`);
    }

    await page.evaluate(() => window.__game.scene.start("Place", { id: "doors" }));
    await waitFor(page, () => JSON.parse(localStorage.getItem("casebound-save") || "{}").finaleDone, "finale", 120000);
    await waitFor(page, placeIdle, "ending and rank screen", 60000, "ending");
    await page.screenshot({ path: `${OUT}/auto-ending.png` });

    await page.evaluate(() => window.__game.scene.start("Place", { id: "doors" }));
    await waitFor(page, placeIdle, "doors", 60000, "doors");
    await page.evaluate(() => {
        const s = window.__game.scene.getScene("Place");
        const find = (list) => {
            for (const o of list) {
                if (o.list) {
                    const r = find(o.list);
                    if (r) return r;
                } else if (o.texture?.key === "ui_quiz_button") return o;
            }
        };
        find(s.children.list).emit("pointerup");
    });
    await waitFor(page, () => JSON.parse(localStorage.getItem("casebound-save") || "{}").quizBest > 0, "Case Quiz");

    const s = await page.evaluate(saved);
    const log = await page.evaluate(() => window.__cbLog ?? []);
    writeFileSync(`${OUT}/auto-log.txt`, log.join("\n"));
    const checks = [
        [s.cards?.length === content.cards, `${content.cards} Framework Cards (got ${s.cards?.length})`],
        [s.detectives?.length === content.districts.length, `${content.districts.length} Driver Detective solves (got ${s.detectives?.length})`],
        [content.districts.every((id) => s.results?.[id]), `a saved result for every district (got ${Object.keys(s.results ?? {}).join(", ")})`],
        [s.finaleDone === true, "finale done"],
        [log.some((l) => l.startsWith("[table] Casebound: your rank")), "rank screen shown"],
    ];
    for (const r of Object.values(s.results ?? {})) checks.push([r.total >= 0 && r.total <= 25, `score in range (got ${r.total})`]);
    const failed = checks.filter(([ok]) => !ok).map(([, what]) => `expected ${what}`);
    await page.close();
    return [...errors, ...failed];
}

const server = await startServer();
const browser = await chromium.launch();
let failures = [];
try {
    console.log("smoke: title, images, Start click");
    failures.push(...(await smoke(browser, server.url)).map((e) => `[smoke] ${e}`));
    console.log(`playthrough: tutorial, every district, finale, quiz (seed ${SEED})`);
    const t0 = Date.now();
    failures.push(...(await playthrough(browser, server.url)).map((e) => `[playthrough] ${e}`));
    console.log(`playthrough took ${Math.round((Date.now() - t0) / 1000)}s`);
} catch (e) {
    failures.push(`crashed: ${e.message}`);
} finally {
    await browser.close().catch(() => {});
    await server.stop().catch(() => {});
}

if (failures.length) {
    console.error(`\n${failures.length} problem(s):`);
    for (const f of failures.slice(0, 40)) console.error(`  ${f}`);
    console.error(`\nReplay this exact run with: E2E_SEED=${SEED} npm run e2e`);
    process.exit(1);
}
console.log("\nall e2e checks passed");
// Exit explicitly: nothing left running should be able to keep CI waiting.
process.exit(0);
