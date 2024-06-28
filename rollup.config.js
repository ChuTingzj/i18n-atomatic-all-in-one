import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default [
	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify
	// `file` and `format` for each target)
	{
		input: 'src/webpack-loader/vue2/index.ts',
		external: ['spark-md5','vue-template-compiler','webpack'],
		output: [
			{ file: 'dist/cjs/index.js', format: 'cjs',name:'auto-i18n-loader-v2' },
			{ file: 'dist/esm/index.js', format: 'es',name:'auto-i18n-loader-v2' }
		],
		plugins: [
			typescript({ compilerOptions: { module: 'CommonJS' } }),
			resolve(), // so Rollup can find `ms`
			commonjs({ extensions: ['.js', '.ts'] }) // so Rollup can convert `ms` to an ES module
		]
	}
];
