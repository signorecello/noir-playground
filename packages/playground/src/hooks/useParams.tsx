import { compileCode } from "../utils/generateProof";
import { useEffect, useState } from "react";
import { InputMap } from "@noir-lang/noirc_abi";

export function useParams({
  compiledCode,
}: {
  compiledCode: Awaited<ReturnType<typeof compileCode>> | null;
}) {
  const [params, setParams] = useState<{ name: string }[] | null>(null);

  useEffect(() => {
    if (!compiledCode) {
      setParams(null);
      return;
    }
    const params = compiledCode!.abi.parameters.map((param) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      function unroll(param: any) {
        if (param.type.kind !== "struct") {
          return {
            name: param.name,
            type: param.type,
          };
        } else {
          return {
            parent: param.name,
            children: [...param.type.fields.map((p: InputMap) => unroll(p))],
          };
        }
      }
      return unroll(param);
    });

    setParams(params as { name: string }[] | null);
  }, [compiledCode]);

  return params;
}
