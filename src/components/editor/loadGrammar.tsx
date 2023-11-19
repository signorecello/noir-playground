import tmLanguage from "../../syntax/noir.tmLanguage.json";
// import configLanguage from "../syntax/noirConfigurations.json";
import { Registry } from 'monaco-textmate'
import { wireTmGrammars } from 'monaco-editor-textmate'

export async function loadGrammar(monaco: typeof import("monaco-editor")) {
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
