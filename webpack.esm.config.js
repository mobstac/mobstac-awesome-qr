const path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
        libraryTarget: 'module',
        filename: 'index.esm.js',
        path: path.resolve(__dirname, 'lib'),
    },
    target: 'node',
    externals: [nodeExternals(), { fs: "commonjs fs" }],
};
