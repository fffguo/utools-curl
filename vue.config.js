const {defineConfig} = require('@vue/cli-service')
const path = require("path");


module.exports = defineConfig({
    transpileDependencies: true,
    configureWebpack: {
        plugins: [
            require('unplugin-vue-components/webpack')({ /* options */}),
            require('unplugin-auto-import/webpack')({ /* options */}),
        ],
        resolve: {
            fallback: {
                "escalade/sync": require.resolve("escalade/sync"),
                "y18n": require.resolve("y18n"),
                "fs": false,
                "path": require.resolve("path-browserify"),
                // "url": false,
                "url": require.resolve("url/"),
                "util": require.resolve("util/"),
                "assert": require.resolve("assert"),
                "stream": require.resolve("stream-browserify"),
                "constants": require.resolve("constants-browserify"),
                "process": require.resolve("process"),
            }
        }
    }
})
