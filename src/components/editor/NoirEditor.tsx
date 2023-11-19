import Editor from "@monaco-editor/react";
import noirDefault from '../../../playground/src/main.nr?raw'

import { loadWASM } from 'onigasm'
import { loadGrammar } from './loadGrammar.tsx';
import * as monaco from "monaco-editor"
import { loader } from '@monaco-editor/react';
import { StyledButton } from "./NoirEditor.styles.tsx";
import styled from "styled-components";
import { generateProof } from "../../utils/useGetProof.tsx"

import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { compileCode } from "../../utils/useGetProof.tsx";
import { CompiledCircuit, ProofData } from "@noir-lang/types";
import { InputMap } from "@noir-lang/noirc_abi";
import initNoirWasm from "@noir-lang/noir_wasm";
import { ParamType, RenderInputs } from "./inputsBox.tsx";

(async () => {
    loader.config({ monaco });
    await loadWASM('node_modules/.vite/dist/onigasm.wasm') // You can also pass ArrayBuffer of onigasm.wasm file
    await loadGrammar(monaco);
    await initNoirWasm();
})()

const EditorContainer = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
`

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
`

const InnerButtonContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
`

const InputsContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-color: white;
    margin: 10px;
    padding: 0 2%;
`


function NoirEditor() {
    const [code, setCode] = useState<string | undefined>(noirDefault)
    const [proof, setProof] = useState<ProofData | null>(null)
    const [pending, setPending ] = useState<boolean>(false)
    const [compiledCode, setCompiledCode] = useState<CompiledCircuit | null>(null)

    const [params, setParams] = useState<{ name: string }[] | null>(null)
    const [inputs, setInputs] = useState<{ [key: string]: string }>({})

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

        const params = compiledCode!.abi.parameters.map((param : InputMap) => {
            console.log(param)

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            function unroll(param : any) {
                if (param.type.kind !== "struct") {
                    return {
                        name: param.name,
                        type: param.type
                    }
                } else {
                    return { parent: param.name, children: [...param.type.fields.map((p : InputMap) => unroll(p))]}
                }
            }
            return unroll(param)
        }) 

        console.log(params)
        setParams(params)
    }

    const prove = async () => {
        console.log(params)
        console.log(inputs)
        const inputMap = {};
        params!.map(param => {
            function aggregateParams(param : ParamType) {
                if (!param.children) {
                    return { [param.name]: JSON.parse(inputs[param.name]) }
                } else if (param.children) {
                    return {[param.parent!] : (() => {
                        const children = {};
                        param.children.map((param : ParamType) => Object.assign(children, aggregateParams(param)))
                        return children
                    })()}
                }
            }
            Object.assign(inputMap, aggregateParams(param));
        })
        console.log(inputMap)
        // console.log({ x: 1, y: 2 })
        const proofData = await toast.promise(generateProof({circuit: compiledCode!, input: inputMap as InputMap}), {
            pending: 'Calculating proof...',
            success: 'Proof calculated!',
            error: 'Error calculating proof',
        });
        console.log(proofData)
        setProof(proofData)
        console.log(proof)
    }

    useEffect(() => {
        setParams(null)
    }, [code])

    return (
        <EditorContainer>
            <Editor
                height="300px"
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
                    {compiledCode && <StyledButton onClick={() => prove()} disabled={pending}>Prove</StyledButton>}
                </InputsContainer>}
            </ButtonContainer>
        </EditorContainer>
    )
}

export default NoirEditor;
