import { InputMap } from "@noir-lang/noirc_abi";
import { ReactNode } from "react";
import styled from "styled-components";

type InputsBoxTypes = {
  params: InputMap[] & { name: string }[];
  inputs: { [key: string]: string };
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputSection = styled.div<{ $indent: boolean }>`
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  padding-left: ${(props) => props.$indent && "2%"};
`;

const Label = styled.label<{ $isParent?: boolean }>`
  align-self: flex-start;
  font-size: ${(props) => (props.$isParent ? "2em" : "1em")};
`;

export type ParamType = {
  name: string;
  parent?: string;
  children?: ParamType[];
};

export function RenderInputs({ params, inputs, handleInput }: InputsBoxTypes) {
  if (!params) return <></>;

  return params.map((p: ParamType) => {
    function unroll(param: ParamType): ReactNode {
      if (param.children) {
        return (
          <>
            <br />
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
