import Editor from "@monaco-editor/react";
import noirDefault from '../syntax/main.nr'
import React from "react"

import { ButtonContainer, EditorContainer, InnerButtonContainer, InputsContainer, StyledButton } from "./NoirEditor.styles";
import { generateProof } from "../utils/useGetProof"

import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { compileCode } from "../utils/useGetProof";
import { CompiledCircuit, ProofData } from "@noir-lang/types";
import { InputMap } from "@noir-lang/noirc_abi";
import { RenderInputs } from "./InputsBox";
import { prepareProveInputs, useProofParamBox } from "../utils/serializeParams";

function NoirEditor( { height } : { height : string }) {
    const [code, setCode] = useState<string | undefined>(noirDefault)
    const [proof, setProof] = useState<ProofData | null>(null)
    const [pending, setPending ] = useState<boolean>(false)

    const [compiledCode, setCompiledCode] = useState<CompiledCircuit | null>(null)
    const [inputs, setInputs] = useState<{ [key: string]: string }>({})

    const params = useProofParamBox({ compiledCode });

    const handleInput = (e : ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setInputs({...inputs, [e.target.name]: e.target.value});
    }

    const submit = async () => {
        setPending(true)

        const compileTO = new Promise((resolve, reject) => setTimeout(async () => {
            try {
                setPending(false);
                await compile(code)
                resolve(code)
            } catch(err) {
                reject(err)
            }
        }, 100));

        await toast.promise(compileTO, {
            pending: 'Compiling...',
            success: 'Compiled!',
            error: 'Error compiling',
        });
    }

    const compile = async (code: string | undefined) => {
        const compiledCode = await compileCode(code)
        setCompiledCode(compiledCode)
    }

    const prove = async () => {
        const inputMap = prepareProveInputs(params!, inputs)
        const proofData = await toast.promise(generateProof({circuit: compiledCode!, input: inputMap as InputMap}), {
            pending: 'Calculating proof...',
            success: 'Proof calculated!',
            error: 'Error calculating proof',
        });
        setProof(proofData)
        console.log(proof)
    }

    useEffect(() => {
        setCompiledCode(null)
    }, [code])

    return (
        <EditorContainer>
            <Editor
                height={height ? height : "300px"}
                defaultLanguage="noir"
                defaultValue={noirDefault}
                onChange={(value) => setCode(value)}
            />
            <ButtonContainer>
                <InnerButtonContainer>
                    <StyledButton onClick={() => submit()} disabled={pending}>Compile</StyledButton>
                </InnerButtonContainer>
                {params && <InputsContainer>
                    <RenderInputs params={params} inputs={inputs} handleInput={handleInput} />
                    <StyledButton onClick={() => prove()} disabled={pending}>Prove</StyledButton>
                </InputsContainer>}
            </ButtonContainer>
        </EditorContainer>
    )
}

export default NoirEditor;
