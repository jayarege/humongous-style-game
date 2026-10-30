import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
    // Relative base so the build works on GitHub Pages under /humongous-style-game/.
    base: "./",
    build: { assetsInlineLimit: 0, chunkSizeWarningLimit: 2000 },
    resolve: {
        alias: { "@caper": fileURLToPath(new URL("./engine/mod.js", import.meta.url)) },
        // The engine and the game must share one Phaser runtime.
        dedupe: ["phaser"],
    },
    server: { port: 5173 },
    test: { include: ["src/**/*.test.ts"] },
});
