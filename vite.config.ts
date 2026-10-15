/// <reference types="vitest/config" />
import { defineConfig } from "vite";

// Application build + test configuration.
// `vite` serves index.html at the project root; `vite build` writes dist/.
// The chat server, see src/lib/chat-api.ts. In development, /api is proxied
// to it with the host it routes overwebs by; run the ruphin.net redbean
// locally with `sh ./redbean.com -p 8080`, or point API_PROXY elsewhere.
const apiProxy = process.env["API_PROXY"] ?? "http://localhost:8080";

export default defineConfig({
  server: {
    port: 5000,
    proxy: { "/api": { target: apiProxy, headers: { host: "overwatch.localhost" } } },
  },
  preview: { port: 5000 },
  build: {
    sourcemap: true,
  },
  test: {
    environment: "happy-dom",
    include: ["src/**/*.test.ts", "test/**/*.test.ts"],
  },
});
