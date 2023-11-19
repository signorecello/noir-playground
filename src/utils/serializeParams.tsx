import { ParamType } from "../components/editor/inputsBox";
import { compileCode } from "./useGetProof";
import { useEffect, useState } from "react";
import { InputMap } from "@noir-lang/noirc_abi";

export function prepareProveInputs(params : ParamType[], inputs : { [key: string]: string }) {
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
    return inputMap;
}

export function useProofParamBox({ compiledCode } : { compiledCode : ReturnType<typeof compileCode> | null }) {
    const [params, setParams] = useState<{ name: string }[] | null>(null)
    
    useEffect(() => {
        if (!compiledCode) return;
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
        
    }, [compiledCode])

    return params;
}
