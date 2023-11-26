import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { wasm } from "@rollup/plugin-wasm";

const wasmContentTypePlugin = {
  name: "wasm-content-type-plugin",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      console.log(req.url);
      if (req.url.endsWith(".wasm")) {
        res.setHeader("Content-Type", "application/wasm");
      }

      res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
      res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      next();
    });
  },
};

export default defineConfig(({ command }) => {
  if (command === "serve") {
    return {
      assetsInclude: ["**/*.ttf"],
      plugins: [
        react(),
        wasm(),
        command === "serve" ? wasmContentTypePlugin : [],
      ],
    };
  }

  return {};
});
