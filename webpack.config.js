const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || "3003";

module.exports = {
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: "/",
    filename: "[name].js"
  },
  resolve: {
    // 加快搜索速度
    modules: [path.resolve(__dirname, "node_modules")],
    // es tree-shaking
    mainFields: ["jsnext:main", "browser", "main"]
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        // 提取出css
        loaders: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "sass-loader"]
        }),
        include: path.resolve(__dirname, "src")
      },
      {
        test: /\.css$/,
        // 提取出css
        loaders: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader"]
        })
      },
      {
        test: /\.(gif|png|jpe?g|eot|woff|ttf|svg|pdf)$/,
        loader: "base64-inline-loader"
      }
    ]
  },
  entry: {
    main: "./src/main.js"
  },
  devServer: {
    clientLogLevel: "warning",
    historyApiFallback: true,
    overlay: true,
    host: HOST,
    port: PORT,
    compress: true,
    open: true,
    publicPath: "/"
  },
  plugins: [
    new ExtractTextPlugin({
      filename: "[name].css"
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
      chunksSortMode: "dependency",
      inject: true // 使用自动插入JS脚本，默认为插入到body中，inject值为true
    })
  ],
  devtool: "source-map"
};
