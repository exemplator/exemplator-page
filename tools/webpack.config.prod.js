var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: "./src/index.js",
    module: {
        loaders: [
            {test: /\.s?css$/, loader: "style-loader!css-loader"},
            {test: /\.less$/, loader: "style!css!less"},
            {test: /\.ttf$|\.otf$|\.eot$|\.woff$|\.woff2$/, loader: "url-loader?limit=100000"},
            {test: /\.jpe?g$|\.png$/, loader: "file-loader"},
            {test: /\.svg$/, loader: "svg-inline"},
            {test: /load-image/, loader: 'imports?define=>false'},
            {test: /\.json$/, loader: "json-loader"},
            {test: /\.jsx?$/, exclude: /(node_modules)/, loader: 'babel-loader'}
        ]
    },
    output: {
        path: "./build",
        filename: "bundle.min.js"
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({mangle: false, sourcemap: false})
    ]
};
