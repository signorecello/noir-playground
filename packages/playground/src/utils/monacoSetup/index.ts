import "monaco-editor/esm/vs/editor/editor.all";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

import { initialize as initializeMonacoService } from "vscode/services";
import {
  registerExtension,
  initialize as initializeVscodeExtensions,
  ExtensionHostKind,
} from "vscode/extensions";

import { toCrossOriginWorker, toWorkerConfig } from "./workers";

// import ExtensionHostWorker from "vscode/workers/extensionHostWorker.worker";

import getDialogsServiceOverride from "@codingame/monaco-vscode-dialogs-service-override";
import getConfigurationServiceOverride from "@codingame/monaco-vscode-configuration-service-override";
import getTextmateServiceOverride from "@codingame/monaco-vscode-textmate-service-override";
import getThemeServiceOverride from "@codingame/monaco-vscode-theme-service-override";
import getLanguagesServiceOverride from "@codingame/monaco-vscode-languages-service-override";
import getExtensionServiceOverride from "@codingame/monaco-vscode-extensions-service-override";

import EditorWorker from "web-worker:monaco-editor/esm/vs/editor/editor.worker.js";
import TextMateWorker from "web-worker:@codingame/monaco-vscode-textmate-service-override/worker";
import ExtensionHostWorker from "web-worker:@codingame/monaco-vscode-extensions-service-override";

export type WorkerLoader = () => Worker;
const workerLoaders: Partial<Record<string, WorkerLoader>> = {
  editorWorkerService: () => new (toCrossOriginWorker(EditorWorker))(),
  textMateWorker: () => new (toCrossOriginWorker(TextMateWorker))(),
};

window.MonacoEnvironment = {
  getWorker: function (moduleId, label) {
    const workerFactory = workerLoaders[label];
    if (workerFactory != null) {
      console.log(workerFactory);
      return workerFactory();
    }
    throw new Error(`Unimplemented worker ${label} (${moduleId})`);
  },
};

initializeMonacoService({
  ...getExtensionServiceOverride(toWorkerConfig(ExtensionHostWorker)),
  ...getDialogsServiceOverride(),
  ...getConfigurationServiceOverride(monaco.Uri.file("/") as any),
  ...getTextmateServiceOverride(),
  ...getThemeServiceOverride(),
  ...getLanguagesServiceOverride(),
}).then(async () => {
  await initializeVscodeExtensions();

  const defaultThemesExtensions = {
    name: "themes",
    publisher: "next-monaco",
    version: "0.0.0",
    engines: {
      vscode: "*",
    },
    contributes: {
      themes: [
        {
          id: "Next Monaco",
          label: "Next Monaco",
          uiTheme: "vs-dark",
          path: "lightTheme.json",
        },
      ],
    },
  };

  const { registerFileUrl } = registerExtension(defaultThemesExtensions);

  console.log(new URL("./lightTheme.json", import.meta.url).toString());
  registerFileUrl(
    "./lightTheme.json",
    new URL("./lightTheme.json", import.meta.url).toString(),
  );

  // JSON.stringify((await import("./lightTheme.json")).default as any);
  // JSON.stringify((await import("./css.tmLanguage.json")).default as any);
  // registerFileUrl(
  //   "./noir.tmLanguage.json",
  //   new URL("./noir.tmLanguage.json", import.meta.url).toString(),
  // );

  monaco.editor.setTheme("Next Monaco");

  const extension = {
    name: "grammars",
    publisher: "next-monaco",
    version: "0.0.0",
    engines: {
      vscode: "*",
    },
    contributes: {
      languages: [
        {
          id: "noir",
          extensions: [".nr"],
          aliases: ["noir"],
        },
      ],
      grammars: [
        {
          language: "noir",
          scopeName: "source.nr",
          path: "./noir.tmLanguage.json",
        },
      ],
    },
  };

  const { registerFileUrl: registerFileUrlLanguage } = registerExtension(
    extension,
    ExtensionHostKind.LocalProcess,
  );
  registerFileUrlLanguage(
    "./noir.tmLanguage.json",
    new URL("./noir.tmLanguage.json", import.meta.url).toString(),
  );

  // console.log(new URL("./lightTheme.json", import.meta.url).toString());
  // registerFileUrl(
  //   "./lightTheme.json",
  //   new URL("./lightTheme.json", import.meta.url).toString(),
  // );

  // const onigData: ArrayBuffer | Response = await loadVSCodeOnigurumWASM();

  // await loadWASM(onigData);
});
