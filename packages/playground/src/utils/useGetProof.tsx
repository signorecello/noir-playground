import { CompiledCircuit } from "@noir-lang/types";

import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import { Noir } from "@noir-lang/noir_js";
import { InputMap } from "@noir-lang/noirc_abi";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { initializeResolver } from "@noir-lang/source-resolver";
import { compile } from "@noir-lang/noir_wasm";

export const compileCode = (code: string | undefined) => {
  if (!code) return;
  initializeResolver(() => {
    return code;
  });

  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const compiled: any = compile("main");
  return compiled.program;
};

export async function generateProof({
  circuit,
  input,
}: {
  circuit: CompiledCircuit;
  input: InputMap;
}) {
  console.log(input);
  console.log(circuit);
  const backend = new BarretenbergBackend(
    circuit as unknown as CompiledCircuit,
    { threads: 8 },
  );
  const noir = new Noir(circuit as unknown as CompiledCircuit, backend);
  console.log("here");
  const proof = noir!.generateFinalProof(input);
  console.log(proof);
  return proof;
}
