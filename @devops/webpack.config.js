const path = require('path');

module.exports = {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    transpileOnly: true,
                },
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', 'scss'],
        alias: {
            '@ambrozy/game': path.resolve(__dirname, '../packages/game/src/'),
            '@ambrozy/train': path.resolve(__dirname, '../packages/train/src/'),
        },
    },
};
