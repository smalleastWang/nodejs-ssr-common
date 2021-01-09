/**
 * webpack 前端公共配置文件
 */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MinCssExtractPlugin = require('mini-css-extract-plugin');    // css模块资源优化插件
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin'); // css 代码压缩
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const vendorsConfig = require('../vendors-config.json');

/// css loaders 处理
function getStyleLoaders(styleType = 'global') {
    const loaders = [
        // 'style-loader',
        {
            // 将处理后的CSS代码提取为独立的CSS文件，可以只在生产环境中配置，但我喜欢保持开发环境与生产环境尽量一致
            loader: MinCssExtractPlugin.loader,
        },
        { loader: 'css-loader',},
        {
            loader: 'postcss-loader',
            options: { plugins: [require('autoprefixer')] },
        },
        // { loader: require.resolve('resolve-url-loader') },
        { loader: 'sass-loader' }
    ];
    
    return loaders
};

module.exports = {
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', 'css', 'scss']
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                include: [
                    // path.resolve(__dirname, '../src/'),
                    // path.resolve(__dirname, '../common/'),
                ],
                exclude: [
                    path.resolve(__dirname, '../node_modules/'),
                ],
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            happyPackMode: true,
                            // 指定配置文件
                            configFile: path.resolve(__dirname, '../tsconfig.front.json'),
                        }
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                },
            },
            {
                oneOf: [
                    // css module
                    {
                        test: /\.module\.((c|sa|sc)ss)$/,
                        include: [
                            // path.resolve(__dirname, '../src/')
                        ],
                        exclude: [
                            path.resolve(__dirname, '../node_modules/'),
                        ],
                        use: getStyleLoaders('module')
                    },
                    // 全局样式 path: /src/styles
                    {
                        test: /\.((c|sa|sc)ss)$/i,
                        include: [
                            path.resolve(__dirname, '../src/')
                        ],
                        exclude: [
                            path.resolve(__dirname, '../node_modules/'),
                        ],
                        use: getStyleLoaders(),
                    },
                    
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            // template: path.resolve(__dirname, '../templates/layout.hbs'),
            template: path.resolve(__dirname, '../pages/home/home.hbs'),
            filename: path.resolve(__dirname, '../views/home.hbs'),
            // 自定义参数 在index.htmll里面接收
            // vendorsJsName: vendorsConfig.vendors.js
        }),
        new webpack.HotModuleReplacementPlugin(),
        new MinCssExtractPlugin({
            //为抽取出的独立的CSS文件设置配置参数
            filename: '[name].[hash:8].css'
        }),
        // 关联抽离的公共插件
        // new webpack.DllReferencePlugin({
        //     context: path.resolve(__dirname, '../'),
        //     manifest: require('../manifest.json'),
        // }),
    ],
    optimization: {
        minimizer: [
            //对生成的CSS文件进行代码压缩 mode='production'时生效
            new OptimizeCssAssetsWebpackPlugin(),
            // js 压缩
            new UglifyJsPlugin({
                include: /\.js$/,
                parallel: true, // 多线程
                uglifyOptions: {
                    output: {
                        comments: false, // 注释
                    },
                }
            })
        ],
    },
    
};