module.exports = {
    mode: 'production',
    target: 'node',
    module: {
        rules: [
            {
                test: /\.s?css$/,
                loader: 'null-loader',
            },
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
        extensions: ['.ts', 'scss'],
    },
};
