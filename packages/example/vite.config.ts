import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { wasm } from '@rollup/plugin-wasm';

import copy from 'rollup-plugin-copy';
// import fs from 'fs';
// import path from 'path';

const wasmContentTypePlugin = {
  name: 'wasm-content-type-plugin',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url.endsWith('.wasm')) {
        console.log(req.url)
        res.setHeader('Content-Type', 'application/wasm');
      }

      next();
    });
  },
};

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
      assetsInclude: ['**/*.ttf'],
      plugins: [
        react(),
        wasm(),
        command === 'serve' ? wasmContentTypePlugin : [],
      ],
    };
  }

  return {};
});
