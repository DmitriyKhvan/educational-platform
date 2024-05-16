import { PluginOption, defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';
import envCompatible from 'vite-plugin-env-compatible';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import viteImageMin from 'vite-plugin-imagemin';
import eslint from 'vite-plugin-eslint';
import { splitVendorChunkPlugin } from 'vite';
const ENV_PREFIX = 'REACT_APP_';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint({
      useEslintrc: true,
    }),
    svgrPlugin(),
    envCompatible({ prefix: ENV_PREFIX }),
    viteCompression(),
    splitVendorChunkPlugin(),
    {
      ...visualizer({
        template: 'treemap',
        gzipSize: true,
        brotliSize: true,
        open: true,
      }),
      apply(this, config, { mode, command }) {
        return command === 'build' && mode === 'analyze' ? true : false;
      },
    } as unknown as PluginOption,
    viteImageMin(),
  ],

  build: {
    reportCompressedSize: true,
  },

  resolve: {
    alias: {
      src: '/src',
    },
  },
});
