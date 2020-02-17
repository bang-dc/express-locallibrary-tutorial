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
  externals: {
    react: 'React'
  },
  devServer: {
    contentBase: "./",
    inline: true,
    port: 8080,
    proxy: {
      // redirect request to port 3000 
      // which is node.js server's port. Check ./bin/www file
      '/': 'http://localhost:3000'
    }
  }
};