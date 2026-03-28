const path = require('path');


module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ],
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    target: 'node',
    externals: [
        { fs: "commonjs fs" },
        { sharp: "commonjs sharp" },
        { "probe-image-size": "commonjs probe-image-size" },
        { "node-fetch": "commonjs node-fetch" }
    ],
    output: {
        library: 'QRCodeGenerator',
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};
