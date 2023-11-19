import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.js'
import '@fontsource-variable/inter';
import "./index.css"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { LoadGrammar } from '../../src/syntax/loadGrammar.jsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LoadGrammar>
      <ToastContainer />
      <App />
    </LoadGrammar>
  </React.StrictMode>,
)


