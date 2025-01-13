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
      'Access-Control-Allow-Origin': '*',  
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 
      'Access-Control-Allow-Headers': 'Content-Type, Authorization', 
    },
    // port: 3001, 
    
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
        test: /.worker\.js$/, 
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
