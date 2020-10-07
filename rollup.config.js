import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';

function entryPoint(inputFile, outputFile) {
  return {
    input: inputFile,
    output: { file: outputFile, format: 'cjs', indent: true },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [babel(), resolve()]
  };
}

export default [
  entryPoint('lib/fetcherino.js', pkg.main),
  entryPoint('lib/matchers.js', 'dist/matchers.js')
];
