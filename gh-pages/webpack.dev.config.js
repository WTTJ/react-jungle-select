const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.css', '.json'],
    modules: [
      './',
      '../node_modules'
    ],
    alias: {
      ExampleList: './config/examples'
    }
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.NormalModuleReplacementPlugin(
      /^react-jungle-select$/,
      `${__dirname}/../src`
    ),
    new ExtractTextPlugin("bundle.css")
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['react-hot-loader/webpack', 'babel-loader', 'eslint-loader']
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['react-hot-loader/webpack', 'style-loader', 'css-loader'],
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.sass$/,
        exclude: /node_modules/,
        use: ['react-hot-loader/webpack', 'style-loader', 'css-loader?sourceMap&importLoaders=1', 'sass-loader?sourceMap'],
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "sass-loader"]
        })
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        use: ['react-hot-loader/webpack', 'babel-loader', 'json-loader']
      }
    ]
  }
}
