import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

/**
 * Vitest configuration for frontend component tests.
 *
 * - `jsdom` provides a browser-like DOM for React components.
 * - The setup file registers jest-dom matchers.
 * - The `@` alias mirrors tsconfig so imports resolve the same way as in the app.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
    },
  },
});
