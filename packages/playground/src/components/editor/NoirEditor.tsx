import "../../utils/monacoSetup/index";

import React, { useRef } from "react";
import { EditorContainer } from "./NoirEditor.styles";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
// import { useMonaco } from "../../hooks/loadGrammar";
import { decodeSnippet } from "../../utils/shareSnippet";
import examples from "../../syntax/examples.json";
import { ActionsBox } from "../actionsBox/actions";
import { NoirEditorProps } from "../../types";
import { ProofData } from "@noir-lang/types";
import { ResultBox } from "../resultBox/result";
import { editor } from "monaco-editor";
import { createConfiguredEditor } from "vscode/monaco";

import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

function NoirEditor(props: NoirEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // const { monaco, loaded } = useMonaco();

  const [monacoEditor, setMonacoEditor] =
    useState<editor.IStandaloneCodeEditor | null>(null); // To track the editor instance
  const [code, setCode] = useState<string | undefined>();
  const [proof, setProof] = useState<ProofData | null>(null);

  useEffect(() => {
    const code = decodeSnippet({
      encoded: props.initialCode || examples.default,
    });
    setCode(code);

    async function load() {
      if (monaco && editorRef.current && !monacoEditor) {
        if (editorRef.current.hasChildNodes())
          editorRef.current.removeChild(editorRef.current.firstChild!);

        // const monacoProperties = {
        //   value: code,
        //   fontSize: 18,
        //   language: "noir",
        //   fontFamily: "Fira Code Variable",
        //   roundedSelection: false,
        //   automaticLayout: true,
        //   lineNumbers: "off",
        //   scrollBeyondLastLine: false,
        //   minimap: { enabled: false },
        // };
        // const editor = monaco.editor.create(
        //   editorRef.current!,
        //   // @ts-expect-error - monaco types are not up to date
        //   monacoProperties,
        // );

        const language = "noir";

        const model = monaco.editor.createModel(
          code,
          language,
          monaco.Uri.file("main.nr"),
        );
        const editor = createConfiguredEditor(editorRef.current!, {
          model,
          fontFamily: "monospace",
          fontSize: 14,
          lineNumbers: "off",
          folding: false,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          renderLineHighlightOnlyWhenFocus: true,
          guides: { indentation: false },
          contextmenu: false,
          formatOnPaste: true,
          formatOnType: true,
          minimap: { enabled: false },
        });
        console.log(editor.getModel()?.getLanguageId());

        setMonacoEditor(editor);
      }
    }

    load();
  }, [monaco, monacoEditor, props.initialCode]);

  useEffect(() => {
    if (monacoEditor)
      monacoEditor.getModel()?.onDidChangeContent(() => {
        setCode(monacoEditor.getValue());
      });
  }, [monacoEditor]);

  return (
    <EditorContainer id="main">
      <ToastContainer />
      <div
        ref={editorRef}
        style={{ width: props.width || "100%", height: props.height || "100%" }}
      ></div>
      {!proof && code && (
        <ActionsBox code={code} props={props} setProof={setProof} />
      )}
      {proof && <ResultBox proof={proof} setProof={setProof} />}
    </EditorContainer>
  );
}

export default NoirEditor;
