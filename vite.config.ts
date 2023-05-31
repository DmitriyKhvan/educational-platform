import { build, defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import envCompatible from 'vite-plugin-env-compatible';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import { splitVendorChunkPlugin } from 'vite';
const ENV_PREFIX = 'REACT_APP_';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteTsconfigPaths(),
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
      apply(config, { mode, command }) {
        return command === 'build' && mode === 'analyze' ? true : false;
      },
    },
  ],
  build: {
    reportCompressedSize: true,
  },
});
