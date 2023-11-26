import { init } from "./setup";
import "monaco-editor/esm/vs/language/typescript/monaco.contribution";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

import { createConfiguredEditor } from "vscode/monaco";

init().then(async (vscodeApi) => {
  console.log("init done");

  const value = `function hello() {
    alert('Hello world!');
}`;

  monaco.languages.register({
    id: "typescript",
    extensions: [".ts"],
    aliases: ["TypeScript", "ts", "typescript"],
  });

  console.log(await vscodeApi.languages.getLanguages());
  console.log(monaco.languages.getLanguages());
  const model = monaco.editor.createModel(value, "typescript");

  const editor = createConfiguredEditor(
    document.getElementById("main-editor")!,
    {
      value,
      model,
    },
  );

  console.log(editor);
  console.log(editor.getModel()?.getLanguageId());
});
