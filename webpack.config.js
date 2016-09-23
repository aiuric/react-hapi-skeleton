// Webpack config file
module.exports = {
  entry: './view/src/index.js',
  output: {
    path: __dirname + '/view/public',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  }
};