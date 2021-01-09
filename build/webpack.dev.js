/**
 * webpack 前端开发配置文件
 */
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const config = require('../config.json');

module.exports = merge(common, {
    // entry: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&quiet=true', './server/index.ts'],
    entry: './pages/home/home.ts',
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, '../', config.staticPath),
        filename: '[name].[hash:8].js'
    },
    plugins : [
        // new webpack.WatchIgnorePlugin([/css\.d\.ts$/, /scss\.d\.ts$/]),
    ],
});