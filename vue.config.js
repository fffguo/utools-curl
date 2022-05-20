const {defineConfig} = require('@vue/cli-service')

module.exports = defineConfig({
    transpileDependencies: true,
    //排除.js.map
    productionSourceMap: process.env.NODE_ENV === 'development',
    configureWebpack: {
        plugins: [
            require('unplugin-element-plus/webpack')({
                // options
            }),
        ],
    },
    publicPath: './',
})
