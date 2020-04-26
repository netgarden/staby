var path = require('path');
var debug = process.env.NODE_ENV !== "production";
var variant = process.env.VARIANT || (debug ? 'full' : '');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var pkg = require("./package.json");

process.deprecated = false;
// process.traceDeprecation = true;


var banner = `
   ${pkg.name} - ${pkg.description}
   Author: ${pkg.author}
   Version: v${pkg.version}
   Url: ${pkg.homepage}
   License(s): ${pkg.license}
`;

var loaders = [
    {
        loader: 'css-loader',
        options: {
            sourceMap: true,
            importLoaders: 1
        }
    },
    {
        loader: 'clean-css-loader'
    },
    {
        loader: 'postcss-loader',
        options: {
            sourceMap: true,
            plugins: () => {
                return [
                    require('precss'),
                    require('autoprefixer')
                ];
            }
        }
    },
    {
        loader: 'less-loader',
        options: {
            sourceMap: true
        }
    },
];

if (debug) {
    loaders.splice(1, 1);
}

module.exports = {
    cache: true,
    context: __dirname,
    devtool: debug ? "inline-sourcemap" : false,
    entry: debug ? [
        'webpack-dev-server/client?http://localhost:3000',// bundle the client for webpack-dev-server and connect to the provided endpoint
        'webpack/hot/only-dev-server', // bundle the client for hot reloading, only- means to only hot reload for successful updates
        './src/index'
    ] : './src/index',

    resolve: {
        extensions: ['.webpack.js', '.web.js', ".ts", ".tsx", ".js", ".json", ".less"]
    },

    output: {
        path: path.join(__dirname, 'build'),
        filename: 'calendar.' + (variant ? variant + '.': '') + 'min.js',
        publicPath: '/build/',
        libraryTarget: "umd",
        // name of the global var: "Foo"
        library: "CalendarPopup"
    },


    module: {
        rules: [
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: loaders
                })
            },
            {
                test: /\.(ts|tsx)$/,
                loader: 'awesome-typescript-loader',
                include: path.join(__dirname, 'src'),
                exclude: /(node_modules|bower_components)/,
            },
            {
                test: /\.(svg)$/i,
                include: [
                    path.resolve(__dirname, "src/styles/icons"),
                ],
                use: [
                    {
                        loader: 'svg-inline-loader',
                        options: {
                            removeTags: ['?xml', 'title', 'desc', 'defs', 'style'],
                            removingTagAttrs: ['id', 'version', 'xmlns', 'xmlns:xlink', 'width', 'height'],
                            removeSVGTagAttrs: ['id', 'version', 'xmlns', 'xmlns:xlink', 'width', 'height'],
                            name: '[path][name].[ext]',
                            limit: 4096
                        }
                    }
                ]
            },
        ]
    },

    plugins: debug ? [
        new webpack.DefinePlugin({
            'appVersion': JSON.stringify(pkg.version),
            'process.env': {
                'NODE_ENV': '"developer"',
                'VARIANT': JSON.stringify(variant)
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
    ] : [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            appVersion: JSON.stringify(pkg.version),
            'process.env': {
                'NODE_ENV': '"production"',
                'VARIANT': JSON.stringify(variant)
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            ie8: false,
            mangle: { reserved: ['Jodit'] },
            compress: {
                if_return: true,
                unused: true,
                booleans: true,
                properties: true,
                dead_code: true,
                warnings: false, // Suppress uglification warnings
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                screw_ie8: true,
                drop_console: true,
                passes: 2
            },
            output: {
                comments: false,
                beautify: false,
            },
            minimize: true
        }),
        new webpack.BannerPlugin( banner ),
    ],
    node: {
        global: true,
        crypto: 'empty',
        process: false,
        module: false,
        clearImmediate: false,
        setImmediate: false
    },

    devServer: {
        host: 'localhost',
        port: 3000,

        historyApiFallback: true,
        // respond to 404s with index.html

        hot: true,
        // enable HMR on the server
    },
}

if (!variant && !debug) {
    // module.exports.plugins.push(new webpack.IgnorePlugin(/moment/));
    module.exports.plugins.push(new webpack.ProvidePlugin({
        "window.moment": "moment",
        "moment": "moment",
    }));
    // module.exports.externals = {
    //     "window.moment": "moment",
    //     "moment": "moment",
    // };
}

module.exports.plugins.push(new ExtractTextPlugin({
    disable: debug,
    filename: 'calendar.css',
    allChunks: true
}));