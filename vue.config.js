const {defineConfig} = require('@vue/cli-service')

module.exports = defineConfig({
    transpileDependencies: true,
    configureWebpack: {
        plugins: [
            require('unplugin-vue-components/webpack')({ /* options */}),
            require('unplugin-auto-import/webpack')({ /* options */}),
        ],
        resolve: {
            fallback: {
                // "escalade/sync": require.resolve("escalade/sync"),
                // "y18n": require.resolve("y18n"),
                "fs": false,
                "path": false,
                // "url": false,
                // "url": require.resolve("url/"),
                "util": require.resolve("util/"),
                "assert": false,
                // "stream": require.resolve("stream-browserify"),
                // "constants": require.resolve("constants-browserify"),
                "process": false,
                "child_process": false,
            }
        }
    }
})
