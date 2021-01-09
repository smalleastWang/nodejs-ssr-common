/**
 * webpack 前端生产配置文件
 */
const path = require('path');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const config = require('../config.json');

module.exports = merge(common, {
    entry: './src/index.tsx',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, '../dist', config.staticPath),
        filename: '[name].[hash:8].js'
    },
    plugins: [
        // new CleanWebpackPlugin(),
    ]
});