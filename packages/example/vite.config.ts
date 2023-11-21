import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

import copy from 'rollup-plugin-copy';
import fs from 'fs';
import path from 'path';

const wasmContentTypePlugin = {
  name: 'wasm-content-type-plugin',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url.endsWith('.wasm')) {
        res.setHeader('Content-Type', 'application/wasm');
        const fileName = req.url.split('/')[req.url.split('/').length - 1];
        const targetPath = path.join("./node_modules/.vite/dist", fileName);
        console.log(targetPath)
        const wasmContent = fs.readFileSync(targetPath);
        return res.end(wasmContent);
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
        copy({
          targets: [{ src: '**/*.wasm', dest: 'node_modules/.vite/dist' }],
          copySync: true,
          hook: 'buildStart',
        }),
        command === 'serve' ? wasmContentTypePlugin : [],
      ],
    };
  }

  return {};
});
