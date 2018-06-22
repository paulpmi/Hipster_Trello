const webpack = require("webpack");
const path = require("path");

module.exports = {
    context: path.join(__dirname, "src"),
    entry: {
        app: "./index.js"
    },
    resolve: {
        modules: [
            path.resolve("./src"),
            "node_modules",
        ],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
            },
        ],
    },
    output: {
        path: path.resolve(__dirname, "bundle"),
        filename: "bundle.js",
    }
};
