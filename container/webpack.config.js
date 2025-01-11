const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");

module.exports = {
  entry: "./src/index",
  mode: "development",
  devServer: {
    static: path.join(__dirname, "dist"),
    port: 3000,
    historyApiFallback: true,
    proxy: [
      {
        context: ['/src_worker_js.js'], // Proxy the worker script
        target: 'http://localhost:3001', // MFE app server
        changeOrigin: true,              // Ensure origin is set correctly for the target
        secure: false,                   // Disable SSL verification if using HTTP
      },
    ],
  },
  output: {
    publicPath: "auto",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"],
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/i,
        use: [
          "style-loader", // Inject styles into the DOM
          "css-loader",   // Resolves CSS imports
          "sass-loader",  // Compiles Sass to CSS
        ],
      },
      {
        test: /worker\.js$/,  // Ensure worker files are bundled
        use: {
          loader: 'worker-loader',  // Use worker-loader to handle worker scripts
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "shellapp",
      remotes: {
        userdetails: 'userdetails@http://localhost:3001/remoteEntry.js',
        insurancedetails: 'insurancedetails@http://localhost:3002/remoteEntry.js',
      },
      shared: { 'react': { singleton: true }, "react-dom": { singleton: true } },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
