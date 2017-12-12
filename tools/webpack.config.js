const webpack = require('webpack');
const path = require('path');

module.exports = {
  context: path.join(__dirname, ''),
  devtool: "source-map", 
  output: {
    filename: '[name].min.js'
  }, 
  module: {
    loaders: [
      {
        test: /\.js$/, 
        exclude: /node_modules/, 
        loader: "babel"
     }, 
     {
        test: /\.css?$/, 
        loaders: ['style', 'raw'], 
        include: __dirname
      }
    ]
  }, 
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      minimize: true, 
      compress: {
        warnings: false
      }, 
      mangle: {
        except: ['$super', '$', 'exports', 'require']
      },
    }), 
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }), 
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};
