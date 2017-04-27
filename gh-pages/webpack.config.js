const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  entry: './index.js',
  output: {
    path: __dirname + '/../docs',
    filename: 'bundle.js'
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
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: true
      },
      compressor: {
        warnings: false
      },
      comments: false
    }),
    new ExtractTextPlugin("bundle.css")
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.sass$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "sass-loader"]
        })
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'json-loader']
      }
    ]
  }
}
