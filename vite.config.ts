import path from "path";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { type PluginOption, defineConfig } from "vite";
import { splitVendorChunkPlugin } from "vite";
import viteCompression from "vite-plugin-compression";
import envCompatible from "vite-plugin-env-compatible";

import viteImageMin from "vite-plugin-imagemin";
import svgrPlugin from "vite-plugin-svgr";
const ENV_PREFIX = "REACT_APP_";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),

		svgrPlugin(),
		envCompatible({ prefix: ENV_PREFIX }),
		viteCompression(),
		splitVendorChunkPlugin(),
		{
			...visualizer({
				template: "treemap",
				gzipSize: true,
				brotliSize: true,
				open: true,
			}),
			apply(this, config, { mode, command }) {
				return command === "build" && mode === "analyze" ? true : false;
			},
		} as unknown as PluginOption,
		viteImageMin(),
	],

	build: {
		reportCompressedSize: true,
	},

	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
});
