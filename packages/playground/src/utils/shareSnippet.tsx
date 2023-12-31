import { compressSync, decompressSync, strFromU8, strToU8 } from "fflate";

import { fromUint8Array, toUint8Array, extendString } from "js-base64";

const constructUrl = async ({
  encoded,
  baseUrl,
}: {
  encoded: string;
  baseUrl: string;
}) => {
  await navigator.clipboard.writeText(`${baseUrl}?share=${encoded}`);
};

export const shareSnippet = async ({
  code,
  baseUrl,
}: {
  code: string;
  baseUrl?: string;
}) => {
  const codeBytes = strToU8(code);
  const compressed = compressSync(codeBytes);
  const base64 = fromUint8Array(compressed, true);
  if (baseUrl) {
    await constructUrl({ encoded: base64, baseUrl });
  }
};

export const decodeSnippet = ({ encoded }: { encoded: string }) => {
  extendString();
  const compressed = toUint8Array(encoded);
  const codeBytes = decompressSync(compressed);
  const code = strFromU8(codeBytes);
  return code;
};
