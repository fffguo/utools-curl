const {defineConfig} = require('@vue/cli-service')

const CopyWebpackPlugin = require("copy-webpack-plugin")
module.exports = defineConfig({
    transpileDependencies: true,
    outputDir: "./dist",    //打包目录
    productionSourceMap: process.env.NODE_ENV === 'development',    //排除.js.map

    configureWebpack: {
        plugins: [
            require('unplugin-element-plus/webpack')({
                // options
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: './utools',
                        to: './'
                    },
                ]
            })
        ],
    },
    publicPath: './',
})
