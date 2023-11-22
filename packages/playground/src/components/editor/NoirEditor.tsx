import Editor, { EditorProps } from "@monaco-editor/react";
import {
  ButtonContainer,
  EditorContainer,
  InnerButtonContainer,
  InputsContainer,
  StyledButton,
} from "./NoirEditor.styles";
import { generateProof } from "../../utils/generateProof";

import { ChangeEvent, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { compileCode } from "../../utils/generateProof";
import { CompiledCircuit, ProofData } from "@noir-lang/types";
import { InputMap } from "@noir-lang/noirc_abi";
import { RenderInputs } from "../inputs/inputs";
import { prepareInputs } from "../../utils/serializeParams";
import { LoadGrammar } from "../../hooks/loadGrammar";
import { useParams } from "../../hooks/useParams";

export interface NoirEditorProps extends EditorProps {
  threads?: number
}

function NoirEditor(props: NoirEditorProps) {
  const [defaultCode, setDefaultCode] = useState<string | undefined>(undefined)
  const [code, setCode] = useState<string | undefined>();
  const [proof, setProof] = useState<ProofData | null>(null);
  const [pending, setPending] = useState<boolean>(false);

  const [compiledCode, setCompiledCode] = useState<CompiledCircuit | null>(
    null,
  );
  const [inputs, setInputs] = useState<{ [key: string]: string }>({});

  const params = useParams({ compiledCode });

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    setPending(true);

    const compileTO = new Promise((resolve, reject) =>
      setTimeout(async () => {
        try {
          setPending(false);
          await compile(code);
          resolve(code);
        } catch (err) {
          reject(err);
        }
      }, 100),
    );

    await toast.promise(compileTO, {
      pending: "Compiling...",
      success: "Compiled!",
      error: "Error compiling",
    });
  };

  const compile = async (code: string | undefined) => {
    const compiledCode = await compileCode(code);
    setCompiledCode(compiledCode);
  };

  const prove = async () => {
    const inputMap = prepareInputs(params!, inputs);
    const proofData = await toast.promise(
      generateProof({ circuit: compiledCode!, input: inputMap as InputMap, threads: props.threads ?? navigator.hardwareConcurrency }),
      {
        pending: "Calculating proof...",
        success: "Proof calculated!",
        error: "Error calculating proof",
      },
    );
    setProof(proofData);
    console.log(proof);
  };

  useEffect(() => {
    setCompiledCode(null);
  }, [code]);

  useEffect(() => {
    if (!defaultCode) {
      (async () => fetch(new URL("./main.nr", import.meta.url)).then(res => res.text()).then(code => {
        setDefaultCode(code)
        setCode(code)
      }))()
    }
  }, [defaultCode])

  if (!defaultCode) return <div>Loading...</div>
  return (
    <EditorContainer>
      <LoadGrammar>
        <ToastContainer />
        <Editor
          {...props}
          defaultLanguage="noir"
          defaultValue={defaultCode}
          onChange={(value) => setCode(value)}
        />
        <ButtonContainer {...props}>
          <InnerButtonContainer>
            <StyledButton onClick={() => submit()} disabled={pending}>
              🔄 Compile
            </StyledButton>
          </InnerButtonContainer>
          {params && (
            <InputsContainer>
              <RenderInputs
                params={params}
                inputs={inputs}
                handleInput={handleInput}
              />
          <InnerButtonContainer>

              <StyledButton onClick={() => prove()} disabled={pending}>
                📜 Prove
              </StyledButton>
          </InnerButtonContainer>

            </InputsContainer>
          )}
        </ButtonContainer>
      </LoadGrammar>
    </EditorContainer>
  );
}

export default NoirEditor;
