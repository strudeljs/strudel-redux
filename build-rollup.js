const path = require('path');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const filesize = require("rollup-plugin-filesize")
const commonjs = require("rollup-plugin-commonjs")
const resolve = require('rollup-plugin-node-resolve')

const externals = ['strudel'];

const builds = [{
  mode: 'umd',
  filename: 'index.js'
}];

const plugins = [
  babel({
    exclude: 'node_modules/**',
  }),
  resolve({
    module: true,
    main: true
  }),
  commonjs()
];

plugins.push(filesize());

builds.forEach((config) => {
  rollup.rollup({
      input: 'src/subscribe.js',
      external: externals,
      plugins: plugins
    })
    .then((bundle) => {
      var options = {
        file: path.resolve(__dirname, config.filename),
        format: config.mode.endsWith('.min') ? config.mode.slice(0, -'.min'.length) : config.mode,
        name: 'strudelRedux',
        exports: 'named',
        globals: {
          strudel: 'strudel',
        }
      }

      return bundle.write(options);
    }).catch(function (reason) {
      console.error(reason)
      process.exit(-1)
    });
});
