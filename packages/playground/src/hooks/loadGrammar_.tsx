// import tmLanguage from "../syntax/noir.tmLanguage.json";
// import {
//   Registry,
//   parseRawGrammar,
//   INITIAL,
//   StateStack,
// } from "vscode-textmate";

// import initNoirWasm from "@noir-lang/noir_wasm";
// import initNoirC from "@noir-lang/noirc_abi";
// import initACVM from "@noir-lang/acvm_js";
// import {
//   createOnigScanner,
//   createOnigString,
//   loadWASM,
// } from "vscode-oniguruma";
// import loader from "@monaco-editor/loader";
// import lightTheme from "../syntax/lightTheme.json";
// import { useEffect, useState } from "react";
// import { languages } from "monaco-editor";

// // @ts-expect-error hey
// import { Color } from "monaco-editor/esm/vs/base/common/color.js";

// // @ts-expect-error hey
// import { TokenizationRegistry } from "monaco-editor/esm/vs/editor/common/modes.js";

// // @ts-expect-error hey
// import { generateTokensCSSForColorMap } from "monaco-editor/esm/vs/editor/common/modes/supports/tokenization.js";

// type MonacoType = typeof import("monaco-editor");

// type LanguageInfo = {
//   tokensProvider: languages.EncodedTokensProvider | null;
//   configuration: languages.LanguageConfiguration | null;
// };

// async function loadVSCodeOnigurumWASM(): Promise<Response | ArrayBuffer> {
//   const url = new URL(
//     "vscode-oniguruma/release/onig.wasm",
//     import.meta.url,
//   ).toString();
//   const response = await fetch(url);
//   const contentType = response.headers.get("content-type");
//   if (contentType === "application/wasm") {
//     return response;
//   }

//   // Using the response directly only works if the server sets the MIME type 'application/wasm'.
//   // Otherwise, a TypeError is thrown when using the streaming compiler.
//   // We therefore use the non-streaming compiler :(.
//   return await response.arrayBuffer();
// }

// const REGEXP_PROPERTIES = [
//   // indentation
//   "indentationRules.decreaseIndentPattern",
//   "indentationRules.increaseIndentPattern",
//   "indentationRules.indentNextLinePattern",
//   "indentationRules.unIndentedLinePattern",

//   // code folding
//   "folding.markers.start",
//   "folding.markers.end",

//   // language's "word definition"
//   "wordPattern",
// ];

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// function getProp(obj: { string: any }, selector: string): any {
//   const components = selector.split(".");

//   // @ts-expect-error hey
//   return components.reduce((acc, cur) => (acc != null ? acc[cur] : null), obj);
// }

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// function setProp(obj: { string: any }, selector: string, value: RegExp): void {
//   const components = selector.split(".");
//   const indexToSet = components.length - 1;
//   components.reduce((acc, cur, index) => {
//     if (acc == null) {
//       return acc;
//     }

//     if (index === indexToSet) {
//       // @ts-expect-error hey
//       acc[cur] = value;
//       return null;
//     } else {
//       // @ts-expect-error hey
//       return acc[cur];
//     }
//   }, obj);
// }

// export function rehydrateRegexps(
//   rawConfiguration: string,
// ): languages.LanguageConfiguration {
//   const out = JSON.parse(rawConfiguration);
//   for (const property of REGEXP_PROPERTIES) {
//     const value = getProp(out, property);
//     if (typeof value === "string") {
//       setProp(out, property, new RegExp(value));
//     }
//   }
//   return out;
// }

// const fetchConfiguration =
//   async (): Promise<languages.LanguageConfiguration> => {
//     const rawConfiguration = JSON.stringify(tmLanguage);
//     return rehydrateRegexps(rawConfiguration);
//   };

// async function fetchLanguageInfo(
//   registry: Registry,
//   monaco: MonacoType,
// ): Promise<LanguageInfo> {
//   const [tokensProvider, configuration] = await Promise.all([
//     getTokensProviderForLanguage(registry, monaco),
//     fetchConfiguration(),
//   ]);
//   return { tokensProvider, configuration };
// }

// function registerLanguages(registry: Registry, monaco: MonacoType) {
//   const id = "noir";
//   monaco.languages.register({ id });

//   // Lazy-load the tokens provider and configuration data.
//   monaco.languages.onLanguage(id, async () => {
//     const { tokensProvider, configuration } = await fetchLanguageInfo(
//       registry,
//       monaco,
//     );

//     if (tokensProvider != null) {
//       monaco.languages.setTokensProvider(id, tokensProvider);
//     }

//     if (configuration != null) {
//       monaco.languages.setLanguageConfiguration(id, configuration);
//     }
//   });
// }

// async function getTokensProviderForLanguage(
//   registry: Registry,
//   monaco: MonacoType,
// ): Promise<languages.EncodedTokensProvider | null> {
//   // Ensure the result of createEncodedTokensProvider() is resolved before
//   // setting the language configuration.
//   const encodedLanguageId = monaco.languages.getEncodedLanguageId("noir");

//   const grammar = await registry.loadGrammarWithConfiguration(
//     "noir",
//     encodedLanguageId,
//     {},
//   );

//   return {
//     getInitialState: () => {
//       return INITIAL;
//     },
//     tokenizeEncoded: (line, state): languages.IEncodedLineTokens => {
//       const tokenizeLineResult2 = grammar!.tokenizeLine2(
//         line,
//         state as StateStack,
//       );
//       const { tokens, ruleStack: endState } = tokenizeLineResult2;
//       return { tokens, endState };
//     },
//   };
// }

// function createStyleElementForColorsCSS(): HTMLStyleElement {
//   // We want to ensure that our <style> element appears after Monaco's so that
//   // we can override some styles it inserted for the default theme.
//   const style = document.createElement("style");

//   // We expect the styles we need to override to be in an element with the class
//   // name 'monaco-colors' based on:
//   // https://github.com/microsoft/vscode/blob/f78d84606cd16d75549c82c68888de91d8bdec9f/src/vs/editor/standalone/browser/standaloneThemeServiceImpl.ts#L206-L214
//   const monacoColors = document.getElementsByClassName("monaco-colors")[0];
//   if (monacoColors) {
//     monacoColors.parentElement?.insertBefore(style, monacoColors.nextSibling);
//   } else {
//     // Though if we cannot find it, just append to <head>.
//     let { head } = document;
//     if (head == null) {
//       head = document.getElementsByTagName("head")[0];
//     }
//     head?.appendChild(style);
//   }
//   return style;
// }

// export const useMonaco = () => {
//   const [monaco, setMonaco] = useState<typeof import("monaco-editor")>();
//   const [loaded, setLoaded] = useState(false);
//   const [promises, setPromises] = useState<Promise<unknown>[]>([]);

//   useEffect(() => {
//     if (promises.length) return;

//     const promArray = [];
//     promArray.push(
//       initNoirWasm(
//         new URL(
//           "@noir-lang/noir_wasm/web/noir_wasm_bg.wasm",
//           import.meta.url,
//         ).toString(),
//       ),
//     );
//     promArray.push(
//       initNoirC(
//         new URL(
//           "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm",
//           import.meta.url,
//         ).toString(),
//       ),
//     );
//     promArray.push(
//       initACVM(
//         new URL(
//           "@noir-lang/acvm_js/web/acvm_js_bg.wasm",
//           import.meta.url,
//         ).toString(),
//       ),
//     );
//     promArray.push(
//       loader.init().then((monaco) => {
//         setMonaco(monaco);
//       }),
//     );
//     setPromises(promArray);
//   }, [promises]);

//   useEffect(() => {
//     if (!monaco || loaded || !promises) return;

//     const loadGrammar = async () => {
//       const onigData: ArrayBuffer | Response = await loadVSCodeOnigurumWASM();

//       await loadWASM(onigData);
//       const onigLib = Promise.resolve({
//         createOnigScanner,
//         createOnigString,
//       });

//       const registry = new Registry({
//         onigLib,
//         loadGrammar: async () => {
//           const grammar = await Promise.resolve(JSON.stringify(tmLanguage));
//           return parseRawGrammar(grammar, "noir.tmLanguage.json");
//         },
//       });

//       const grammars = new Map();
//       grammars.set("noir", "main.nr");
//       registerLanguages(registry, monaco);

//       const cssColors = registry.getColorMap();
//       const colorMap = cssColors.map(Color.Format.CSS.parseHex);
//       // This is needed to ensure the minimap gets the right colors.
//       TokenizationRegistry.setColorMap(colorMap);
//       const css = generateTokensCSSForColorMap(colorMap);
//       const style = createStyleElementForColorsCSS();
//       style.innerHTML = css;

//       monaco.editor.defineTheme("noirLight", {
//         base: "vs",
//         inherit: true,
//         colors: lightTheme.colors,
//         rules: lightTheme.rules,
//       });
//       monaco.languages.register({ id: "noir" });
//       monaco.editor.setTheme("noirLight");
//     };

//     Promise.all([...promises, loadGrammar]).then(() => setLoaded(true));
//   }, [monaco, promises]);

//   return { monaco, loaded };
// };
