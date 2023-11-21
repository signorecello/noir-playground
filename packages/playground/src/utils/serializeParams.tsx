import { ParamType } from "../types";

export function prepareInputs(
  params: ParamType[],
  inputs: { [key: string]: string },
) {
  const inputMap = {};
  params!.map((param) => {
    function aggregateParams(param: ParamType) {
      if (!param.children) {
        return { [param.name]: JSON.parse(inputs[param.name]) };
      } else if (param.children) {
        return {
          [param.parent!]: (() => {
            const children = {};
            param.children.map((param: ParamType) =>
              Object.assign(children, aggregateParams(param)),
            );
            return children;
          })(),
        };
      }
    }
    Object.assign(inputMap, aggregateParams(param));
  });
  return inputMap;
}
