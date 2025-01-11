const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");
const CopyPlugin =require('copy-webpack-plugin');

module.exports = {
  entry: "./src/index",
  mode: "development",
  devServer: {
    static: path.join(__dirname, "dist"),
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',  // Allow requests only from localhost:3000
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // Allow necessary methods
      'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Allow necessary headers
    },
    port: 3001, // Your MFE app running on this port
    // You can add a proxy rule if necessary, but this should handle CORS directly.
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
        test: /.worker\.js$/, // Ensure worker.js is handled by worker-loader
        use: { loader: 'worker-loader' },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'userdetails',
      filename: 'remoteEntry.js',
      exposes: {
        './UserDetails': './src/UserDetails',
      },
      shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new CopyPlugin({
      patterns:[{from:'./src/worker.js', to: 'worker.js'}]
    })
  ],
};
