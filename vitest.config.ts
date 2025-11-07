import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom",
    coverage: {
      reporter: ["text", "lcov"],
      provider: "v8"
    },
    globals: true,
    setupFiles: ["./vitest.setup.ts"]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, ".")
    }
  },
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react"
  }
});
