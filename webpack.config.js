const path = require('path');

module.exports = {
  // this is the entry file for webpack
  entry: './src/main.js',
  // compiled/built output file
  output: {
    path: path.resolve(__dirname, 'public/javascripts'),
    filename: 'index.js',
    // this must be same as Express static use. 
    // Check ./app.js
    publicPath: '/javascripts/',
    // export itself to a global var
    libraryTarget: "var",
    // name of the global var: "mylib"
    library: "LocalLibraryUI"
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  resolve: {
    extensions: ['.js', '.jsx'] // Enable to leave off the extension when importing
  },
  externals: {
    react: 'React'
  },
  devServer: {
    contentBase: path.join(__dirname, 'public/javascripts'),
    compress: true
  },
  devtool: 'source-map' // to help debugging
};