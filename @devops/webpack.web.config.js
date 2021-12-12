const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');

const postCss = {
    loader: 'postcss-loader',
    options: {
        postcssOptions: {
            plugins: ['postcss-nested', 'autoprefixer'],
        },
    },
};

module.exports.getConfig = (basePath) => ({
    mode: 'development',
    entry: path.resolve(basePath, './src/index.ts'),
    output: {
        path: path.resolve(basePath, './build'),
        filename: 'index.bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.s?css$/,
                use: ['style-loader', 'css-loader', postCss],
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    // disable type checker - we will use it in fork plugin
                    transpileOnly: true,
                },
            },
            {
                test: /\.(gif|jpg|png|svg)$/,
                type: 'asset/resource',
            },
            {
                test: /\.(shader|glsl)$/,
                type: 'asset/source',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(basePath, './public/index.html'),
        }),
        new ESLintPlugin({
            context: path.resolve(basePath, './src'),
            extensions: ['js', 'ts'],
        }),
        new ForkTsCheckerWebpackPlugin(),
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', 'scss'],
        alias: {
            '@ambrozy/ai-agent': path.resolve(
                __dirname,
                '../packages/ai-agent/',
            ),
            '@ambrozy/game': path.resolve(__dirname, '../packages/game/'),
            '@ambrozy/train': path.resolve(__dirname, '../packages/train/'),
        },
    },
});
