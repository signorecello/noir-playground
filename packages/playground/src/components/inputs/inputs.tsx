import { ReactNode } from "react";
import { InputsBoxTypes, ParamType } from "../../types";
import { Label, InputSection } from "./inputs.styles";

export function RenderInputs({ params, inputs, handleInput }: InputsBoxTypes) {
  if (!params) return <></>;

  return params.map((p: ParamType) => {
    function unroll(param: ParamType): ReactNode {
      if (param.children) {
        return (
          <>
            <Label $isParent={true}>{param.parent}</Label>
            {param.children.map((p: ParamType) => unroll(p))}
          </>
        );
      }

      return (
        <InputSection $indent={!!param.children}>
          <Label $isParent={!!param.children}>{param.name}</Label>
          {param.name && (
            <input
              name={param.name}
              type="text"
              onChange={handleInput}
              value={inputs ? inputs[p.name] : ""}
            />
          )}
        </InputSection>
      );
    }
    return unroll(p as ParamType);
  });
}
