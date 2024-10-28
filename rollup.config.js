import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  plugins: [
    nodeResolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    terser(),
  ],
};
