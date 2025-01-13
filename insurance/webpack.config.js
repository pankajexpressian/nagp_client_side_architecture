const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const CopyPlugin = require('copy-webpack-plugin');
const path = require("path");

module.exports = {
  entry: "./src/index",
  mode: "development",
  devServer: {
    static: path.join(__dirname, "dist"),
    headers: {
      'Access-Control-Allow-Origin': '*',  
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 
      'Access-Control-Allow-Headers': 'Content-Type, Authorization', 
    }
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
          "style-loader", 
          "css-loader",   
          "sass-loader",  
        ],
      },
      {
        // Consolidated rule for handling worker.js files
        test: /worker\.js$/, 
        use: { loader: 'worker-loader' },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'insurancedetails',
      filename: 'remoteEntry.js',
      exposes: {
        './InsuranceDetails': './src/InsuranceDetails', 
      },
      shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    // Copy worker.js from src to dist folder
    new CopyPlugin({
      patterns: [
        { from: './src/worker.js', to: 'worker.js' }
      ]
    })
  ],
};
