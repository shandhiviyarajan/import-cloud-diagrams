const path = require("path");

module.exports = {
  entry: {
    "hava.designer": "./_build/hava.designer.js",
  },
  output: {
    filename: "[name].js",
    path: `${path.resolve(__dirname)}/dist`,
  },
  mode: "production",
  context: path.resolve(__dirname),
  // devtool: 'source-map',
  module: {
    rules: [
      {
        test: /hava.designer.*.js/,
        exclude: /(node_modules|src|bower_components)/,
        include: /(_build)/,
        use: {
          loader: "babel-loader?cacheDirectory",
          options: {
            presets: [
              [
                "@babel/env",
                {
                  useBuiltIns: "usage",
                  corejs: "3.4.0",
                },
              ],
            ],
            plugins: ["@babel/plugin-proposal-class-properties"],
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg|obj|png)$/,
        use: [
          {
            loader: "url-loader",
          },
        ],
      },
    ],
  },
  performance: { hints: false },
};
