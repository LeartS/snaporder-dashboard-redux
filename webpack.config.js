const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'build.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {}
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'file-loader',
        options: {}
      },
    ]
  },
  devtool: 'eval-source-map',
  devServer: {
    contentBase: './dist',
    historyApiFallback: true,
    publicPath: '/'
  },
  plugins: [
    new CleanWebpackPlugin(['dist/*']),
    new CopyWebpackPlugin([
      {from: 'src/index.html'}
    ])
  ]
};
