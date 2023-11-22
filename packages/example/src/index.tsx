import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource-variable/inter";
import "./index.css";
import { NoirEditor } from "@signorecello/noir_playground";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="container">
      <h1>Noir Playground</h1>
      <p>This playground works entirely client-side. Enjoy!</p>
      <p>
        Visit the&nbsp;
        <a href="https://github.com/signorecello/noir-playground">
          Github Repo
        </a>
        &nbsp;to know more
      </p>
      <NoirEditor height="300px" />
    </div>
  </React.StrictMode>,
);
