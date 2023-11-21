import tmLanguage from "./noir.tmLanguage.json";
// import configLanguage from "../syntax/noirConfigurations.json";
import React from "react";
import { Registry } from 'monaco-textmate'
import { wireTmGrammars } from 'monaco-editor-textmate'

import initNoirWasm from "@noir-lang/noir_wasm";
// import noir_wasm_bg from "@noir-lang/noir_wasm/web/noir_wasm_bg.wasm";

import { loadWASM } from 'onigasm'
import * as monaco from "monaco-editor"
import { loader } from '@monaco-editor/react';
import { useEffect, useState } from "react";
import onigasmUrl from "./onigasm.wasm";


export const LoadGrammar = ({ children }: { children: React.ReactNode }) => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        (async () => await loadGrammar())();
        setLoaded(true);
    }, []);
    if (loaded) return <>{children}</>;
};

async function loadGrammar() {

    loader.config({ monaco });
    const wasmBin = await (await fetch(onigasmUrl)).arrayBuffer()
    await loadWASM(wasmBin) // You can also pass ArrayBuffer of onigasm.wasm file
    await initNoirWasm();

    console.log('loading grammar')
    // Create a registry that can create a grammar from a scope name.
    const registry = new Registry({
        getGrammarDefinition: async () => {
            return {
                format: 'json', // can also be `plist`
                content: tmLanguage // when format is 'json', parsed JSON also works
            }
        }
    });

    const grammars = new Map()
    grammars.set('noir', 'main.nr')
    monaco.languages.register({ id: 'noir' });
    await wireTmGrammars(monaco, registry, grammars)

    // monaco.editor.defineTheme('vs-code-theme-converted', {
    //     // ... use `monaco-vscode-textmate-theme-converter` to convert vs code theme and pass the parsed object here
    // });
}
