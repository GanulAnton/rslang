const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');
const isDevelopment = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
        {
            test: /\.js$/,
            use: 'babel-loader',
            exclude: [
              /node_modules/
            ]
          },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: { minimize: !isDevelopment }
            }
          ]
        },
        {
            test: /\.(css|sass|scss)$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader"
            }, {
                loader: "sass-loader"
            }]
          },
          {
            test: /\.(png|svg|jpe?g|gif|mp3)$/i,
            use: [
              {
                loader: 'file-loader',
              },
            ],
          }
      ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html'
    }),
    new WriteFilePlugin(),
    new CopyPlugin([
      { from: './src/assets', to: './assets' },
    ])
  ],
  devServer: {
    contentBase: './assets',
    port: 3000,
  }
};