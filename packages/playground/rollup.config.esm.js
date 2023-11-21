import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';
import { wasm } from '@rollup/plugin-wasm';
import url from '@rollup/plugin-url';

export default {
	input: 'src/index.ts',
	output: {
		dir: 'dist/esm'
	},
    plugins: [
        // url(),
        typescript({ compilerOptions: { outDir: 'dist/esm' }}),
        json(),
        wasm(),
        copy({
            targets: [
                { src: 'src/**/*.nr', dest: 'dist/esm' },
                { src: 'src/**/*.wasm', dest: 'dist/esm'}
            ]
        }),
    ]
};
