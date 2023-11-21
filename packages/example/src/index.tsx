import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource-variable/inter';
import "./index.css"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { LoadGrammar, NoirEditor } from '@signorecello/noir_playground';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LoadGrammar>
      <ToastContainer />
      <div className="container">
        <h1>Noir Playground</h1>
        <NoirEditor height="300px" />
      </div>
    </LoadGrammar>
  </React.StrictMode>,
)


