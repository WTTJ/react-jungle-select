var webpack = require('webpack')
var path = require('path')

module.exports = {
  entry: './src/index.js',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  output: {
    path: path.resolve('./dist'),
    filename: 'index.js'
  }
}
