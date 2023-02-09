const path = require("path");

const env = process.env.NODE_ENV;
const build_dir = env === "prod" ? "_build" : 'dist';

module.exports = {
  entry: {
    "hava.designer.three": "./three_build.js",
  },
  output: {
    filename: "[name].js",
    path: `${path.resolve(__dirname)}/${build_dir}`,
  },
  mode: "production",
  context: path.resolve(__dirname),
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "node_modules/three")
        ],
        use: {
          loader: "babel-loader?cacheDirectory",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage",
                  corejs: "3.4.0",
                },
              ],
            ],
            plugins: ["@babel/plugin-proposal-class-properties", "@babel/plugin-transform-block-scoping"],
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg|obj|png)$/,
        exclude: /(node_modules|src|bower_components)/,
        include: /(assets)/,
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
