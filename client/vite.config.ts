// import { defineConfig, UserConfig } from "vite";
import { UserConfig } from "vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom",
		setupFiles: "./setupTests.ts",
		css: false, // Speeds up tests by not loading CSS
	},
}) satisfies UserConfig;
