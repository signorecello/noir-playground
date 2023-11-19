import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '@fontsource-variable/inter';
import "./index.css"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import initNoirWasm from "@noir-lang/noir_wasm";

import { loadWASM } from 'onigasm'
import { loadGrammar } from './syntax/loadGrammar.tsx';
import * as monaco from "monaco-editor"
import { loader } from '@monaco-editor/react';

(async () => {
    loader.config({ monaco });
    await loadWASM('node_modules/.vite/dist/onigasm.wasm') // You can also pass ArrayBuffer of onigasm.wasm file
    await loadGrammar(monaco);
    await initNoirWasm();
})()



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastContainer />
    <App />
  </React.StrictMode>,
)
