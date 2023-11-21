import { InputMap } from "@noir-lang/noirc_abi";

export type ParamType = {
  name: string;
  parent?: string;
  children?: ParamType[];
};

export type InputsBoxTypes = {
  params: InputMap[] & { name: string }[];
  inputs: { [key: string]: string };
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
