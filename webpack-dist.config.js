const fs = require("fs");
const path = require("path");
// const { spawnSync } = require('child_process');
// const findChrome = require('chrome-finder');
const UglifyJsPlugin = require("webpack/lib/optimize/UglifyJsPlugin");
const DefinePlugin = require("webpack/lib/DefinePlugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const EndWebpackPlugin = require("end-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ghpages = require("gh-pages");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const pdf = require("phantom-html2pdf");

const outputPath = path.resolve(__dirname, "dist");
function publishGhPages() {
  return new Promise((resolve, reject) => {
    ghpages.publish(outputPath, { dotfiles: true }, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  output: {
    path: outputPath,
    publicPath: "",
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
          // 压缩css
          use: ["css-loader?minimize", "postcss-loader", "sass-loader"]
        }),
        include: path.resolve(__dirname, "src")
      },
      {
        test: /\.css$/,
        // 提取出css
        loaders: ExtractTextPlugin.extract({
          fallback: "style-loader",
          // 压缩css
          use: ["css-loader?minimize", "postcss-loader"]
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
  plugins: [
    new DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
    new UglifyJsPlugin({
      // 最紧凑的输出
      beautify: false,
      // 删除所有的注释
      comments: false,
      compress: {
        // 在UglifyJs删除没有用到的代码时不输出警告
        warnings: false,
        // 删除所有的 `console` 语句，可以兼容ie浏览器
        drop_console: true,
        // 内嵌定义了但是只用到一次的变量
        collapse_vars: true,
        // 提取出出现多次但是没有定义成变量去引用的静态值
        reduce_vars: true
      }
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
      chunksSortMode: "dependency",
      inject: true // 使用自动插入JS脚本，默认为插入到body中，inject值为true
    }),
    new ExtractTextPlugin({
      filename: "[name].css",
      allChunks: true
    }),
    new CleanWebpackPlugin(["dist"], {
      root: path.resolve(__dirname)
    }),
    new EndWebpackPlugin(async () => {
      // 自定义域名 转发 CNAME
      // fs.writeFileSync(path.resolve(outputPath, 'CNAME'), 'resume.wuhaolin.cn');

      pdf.convert(
        {
          html: "dist/index.html",
          css: "dist/main.css",
          paperSize: { format: "A4", orientation: "portrait", border: "0cm" }
        },
        function(err, result) {
          result.toBuffer(function(returnedBuffer) {});
          var stream = result.toStream();
          var tmpPath = result.getTmpPath();
          result.toFile("./dist/resume.pdf", async function() {
            // 发布到 ghpages
            // await publishGhPages();
          });
        }
      );
    })
  ]
};
