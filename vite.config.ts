/// <reference types="vitest/config" />
import { defineConfig } from "vite";

// Application build + test configuration.
// `vite` serves index.html at the project root; `vite build` writes dist/.
export default defineConfig({
  server: { port: 5000 },
  preview: { port: 5000 },
  build: {
    sourcemap: true,
  },
  test: {
    environment: "happy-dom",
    include: ["src/**/*.test.ts", "test/**/*.test.ts"],
  },
});
