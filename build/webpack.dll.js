
const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin')

const config = require('../config.json');

/**
 * 通过webpack.DllPlugin 打包第三方资源库 节约打包时间
 */
// 生产环境ts要打包到dist 本地直接ts-node启动
const isProd = process.env.NODE_ENV == 'production';

// 第三方包单独打包成文件
const vendors = [
    'animejs',
    'axios',
    'classnames',
    'mobx',
    'mobx-react',
    'react',
    'react-dom',
    'react-hook-form',
    'react-router-dom',
    'react-transition-group',
    'react-zmage', // 图片查看器
];

module.exports = {
    output: {
        path: path.resolve(__dirname, isProd ? '../dist/' : '../', config.staticPath),
        filename: '[name].[hash:8].js',
        library: '[name]',
    },
    entry: {
        'vendors': vendors,
    },
    plugins: [
        new webpack.DllPlugin({
            context: path.resolve(__dirname, '../'),
            path: path.join(__dirname, '../manifest.json'),
            name: '[name]'
        }),
        new AssetsPlugin({
            filename: 'vendors-config.json'
        }),
        new CleanWebpackPlugin(),
    ],
};