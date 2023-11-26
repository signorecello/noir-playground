import {
  LogLevel,
  initialize as initializeMonacoService,
} from "vscode/services";
// import "@codingame/monaco-vscode-javascript-default-extension";
// import { initialize } from "vscode/extensions";
// // import getDialogsServiceOverride from "@codingame/monaco-vscode-dialogs-service-override";

// import getConfigurationServiceOverride, {
//   updateUserConfiguration,
//   configurationRegistry,
// } from "@codingame/monaco-vscode-configuration-service-override";

// import getLanguageServiceOverride from "@codingame/monaco-vscode-languages-service-override";
// import getLanguagesServiceOverride from "@codingame/monaco-vscode-languages-service-override";

// import getExtensionServiceOverride from "@codingame/monaco-vscode-extensions-service-override";
// import getEnvironmentServiceOverride from "@codingame/monaco-vscode-environment-service-override";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker.js?worker";
import TextMateWorker from "@codingame/monaco-vscode-textmate-service-override/worker?worker";
import TypescriptWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

// import { initFile } from "@codingame/monaco-vscode-files-service-override";
// import ExtensionHostWorker from "vscode/workers/extensionHost.worker?worker";
// import * as monaco from "monaco-editor";
import { toCrossOriginWorker } from "./tools/workers";
import {
  registerExtension,
  initialize as initializeVscodeExtensions,
  ExtensionHostKind,
} from "vscode/extensions";
import getDialogsServiceOverride from "@codingame/monaco-vscode-dialogs-service-override";
import getConfigurationServiceOverride from "@codingame/monaco-vscode-configuration-service-override";
import getTextmateServiceOverride from "@codingame/monaco-vscode-textmate-service-override";
import getThemeServiceOverride from "@codingame/monaco-vscode-theme-service-override";
import getLanguagesServiceOverride from "@codingame/monaco-vscode-languages-service-override";

import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
// import defaultConfiguration from "./user/configuration.json?raw";
// import { initFile } from "@codingame/monaco-vscode-files-service-override";
// // import * as vscode from "vscode";
// import * as monaco from "monaco-editor";

// import getEditorServiceOverride from "@codingame/monaco-vscode-editor-service-override";
// Workers
export type WorkerLoader = () => Worker;
const workerLoaders: Partial<Record<string, WorkerLoader>> = {
  editorWorkerService: () => new (toCrossOriginWorker(EditorWorker))(),
  textMateWorker: () => new (toCrossOriginWorker(TextMateWorker))(),
  typescript: () => new (toCrossOriginWorker(TypescriptWorker))(),
};

window.MonacoEnvironment = {
  getWorker: function (moduleId, label) {
    console.log("getWorker", moduleId, label);
    const workerFactory = workerLoaders[label];
    if (workerFactory != null) {
      return workerFactory();
    }
    throw new Error(`Unimplemented worker ${label} (${moduleId})`);
  },
};

// await initialize();

// await Promise.all([initUserConfiguration(defaultConfiguration)]);

// Override services
export const init = async () => {
  await initializeMonacoService(
    {
      ...getDialogsServiceOverride(),
      ...getConfigurationServiceOverride(),
      ...getTextmateServiceOverride(),
      ...getThemeServiceOverride(),
      ...getLanguagesServiceOverride(),
    },
    document.body,
    {
      developmentOptions: {
        logLevel: LogLevel.Trace, // Default value
      },
    },
  );
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
          path: "../../syntax/nightOwl.json",
        },
      ],
    },
  };

  const { registerFileUrl: registerDefaultThemeExtensionFile } =
    registerExtension(defaultThemesExtensions, ExtensionHostKind.LocalProcess);

  registerDefaultThemeExtensionFile(
    "../../syntax/nightOwl.json",
    new URL("../../syntax/nightOwl.json", import.meta.url).toString(),
  );

  monaco.editor.setTheme("Next Monaco");

  const extension = {
    name: "grammars",
    id: "grammars",
    publisher: "next-monaco",
    version: "0.0.0",
    engines: {
      vscode: "*",
    },
    contributes: {
      languages: [
        {
          id: "typescript",
          extensions: [".ts", ".tsx"],
          aliases: ["TypeScript", "ts", "typescript"],
        },
      ],
      grammars: [
        {
          language: "typescript",
          scopeName: "source.ts",
          path: "../../syntax/TypeScript.tmLanguage.json",
        },
      ],
    },
  };

  const { registerFileUrl: registerExtensionFile, getApi } = registerExtension(
    extension,
    ExtensionHostKind.LocalProcess,
  );

  registerExtensionFile(
    "../../syntax/TypeScript.tmLanguage.json",
    new URL(
      "../../syntax/TypeScript.tmLanguage.json",
      import.meta.url,
    ).toString(),
  );
  console.log((await getApi()).extensions);

  console.log("init");
  return await getApi();
};
