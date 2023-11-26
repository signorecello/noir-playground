import { defineConfig } from "vite";
import glob from "fast-glob";
import * as fs from "fs";
import url from "url";
import path from "path";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    target: "esnext",
    // target: "es2020",
    // lib: {
    //   entry: path.resolve(__dirname, "src/index.ts"),
    //   formats: ["es"],
    //   name: "Noir Playground",
    //   fileName: "index",
    // },
    minify: false,

    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["react", "react-dom", "styled-components"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "styled-components": "styled",
        },
      },
    },
  },
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
    {
      // For the *-language-features extensions which use SharedArrayBuffer
      name: "configure-response-headers",
      apply: "serve",
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          if (_req.url?.endsWith(".wasm")) console.log(_req.url);
          if (_req.url?.endsWith(".json")) console.log(_req.url);

          res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
          next();
        });
      },
    },
    {
      name: "force-prevent-transform-assets",
      apply: "serve",
      configureServer(server) {
        return () => {
          server.middlewares.use(async (req, res, next) => {
            if (req.originalUrl != null) {
              const pathname = new URL(req.originalUrl, import.meta.url)
                .pathname;
              if (pathname.endsWith(".html")) {
                res.setHeader("Content-Type", "text/html");
                res.writeHead(200);
                res.write(fs.readFileSync(path.join(__dirname, pathname)));
                res.end();
              }
            }

            next();
          });
        };
      },
    },
  ],
  server: {
    port: 5173,
    host: "0.0.0.0",
    fs: {
      allow: ["../../"], // allow to load codicon.ttf from monaco-editor in the parent folder
    },
  },
  optimizeDeps: {
    // This is require because vite excludes local dependencies from being optimized
    // Monaco-vscode-api packages are local dependencies and the number of modules makes chrome hang
    include: [
      // These 2 lines prevent vite from reloading the whole page when starting a worker (so 2 times in a row after cleaning the vite cache - for the editor then the textmate workers)
      // it's mainly empirical and probably not the best way, fix me if you find a better way
      "monaco-editor/esm/vs/nls.js",
      "monaco-editor/esm/vs/editor/editor.worker.js",
      "vscode-textmate",
      "vscode-oniguruma",
      "@vscode/vscode-languagedetection",
      "vscode-semver",
      ...(await glob("monaco-editor/esm/vs/**/common/**/*.js", {
        cwd: path.resolve(__dirname, "../node_modules"),
      })),
    ],
    exclude: [],
    esbuildOptions: {
      plugins: [
        {
          name: "import.meta.url",
          setup({ onLoad }) {
            // Help vite that bundles/move files in dev mode without touching `import.meta.url` which breaks asset urls
            onLoad({ filter: /.*\.js/, namespace: "file" }, async (args) => {
              const code = fs.readFileSync(args.path, "utf8");

              const assetImportMetaUrlRE =
                /\bnew\s+URL\s*\(\s*('[^']+'|"[^"]+"|`[^`]+`)\s*,\s*import\.meta\.url\s*(?:,\s*)?\)/g;
              let i = 0;
              let newCode = "";
              for (
                let match = assetImportMetaUrlRE.exec(code);
                match != null;
                match = assetImportMetaUrlRE.exec(code)
              ) {
                newCode += code.slice(i, match.index);

                const path = match[1].slice(1, -1);
                const resolved = await import.meta.resolve!(
                  path,
                  url.pathToFileURL(args.path),
                );

                newCode += `new URL(${JSON.stringify(
                  url.fileURLToPath(resolved),
                )}, import.meta.url)`;

                i = assetImportMetaUrlRE.lastIndex;
              }
              newCode += code.slice(i);

              return { contents: newCode };
            });
          },
        },
      ],
    },
  },
  define: {
    rootDirectory: JSON.stringify(__dirname),
  },
  resolve: {
    dedupe: ["monaco-editor", "vscode"],
  },
  assetsInclude: ["**/*.wasm"],
});
