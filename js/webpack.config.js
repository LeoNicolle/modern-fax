const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const nodeModules = {};
fs.readdirSync(path.resolve(__dirname, 'node_modules'))
.filter(x => ['.bin'].indexOf(x) === -1)
.forEach(mod => { nodeModules[mod] = `commonjs ${mod}`; });

module.exports = {
  name: 'server',
  target: 'node',
  entry: './server.js',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js'
  },
  externals: nodeModules,
  module: {
    // loader: [
    //   {
    //     test: /\.json$/, loader: 'json-loader'
    //   }
    // ]
  }
}
