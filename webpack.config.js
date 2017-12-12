var path = require('path');

var config = {
  entry: {
    admin: './admin/index.js',
    consumer: './consumer/index.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: '[name].bundle.js'
  },
  module: {
    noParse: [/jquery/],
    loaders: [{
      test: /\.(png|jpg|gif|svg)$/,
      loader: 'file'
    }, {
      test: /\/icons\//,
      loader: "url?limit=50000"
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel'
    }, {
      test: /\.scss$/,
      loader: 'style!css!sass'
    }]
  }
};

module.exports = config;