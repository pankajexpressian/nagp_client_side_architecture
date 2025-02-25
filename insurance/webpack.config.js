const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");

module.exports = {
  entry: "./src/index",
  mode: "development",
  devServer: {
    static: path.join(__dirname, "dist"),
    port: 3002,
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
  ],
};
