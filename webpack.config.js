const path = require('path');
var webpack = require('webpack');
var DashboardPlugin = require('webpack-dashboard/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: 'src/index.html',
    filename: 'index.html',
    inject: 'body'
})

module.exports = {
    entry: ['babel-polyfill', './src/index.js'],
    output: {
        path: './build',
        filename: 'app.bundle.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    },
    devtool: 'source-map',
    devServer: {
        contentBase: './src',
        historyApiFallback: true,
        hot: true,
        inline: true,
        port: 8081
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin({
            multiStep: true
        }),
        new DashboardPlugin(),
        HtmlWebpackPluginConfig
    ]
};