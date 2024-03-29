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
                        from: './utools/',
                        to: './',
                        //处理传输内容
                        transform(content, absoluteFrom) {
                            //plugin.json 替换属性
                            if (absoluteFrom.endsWith("/plugin.json")) {
                                let jsonContent = JSON.parse(content.toString());
                                //替换
                                let result = JSON.stringify(jsonContent, function (key, value) {
                                    if (key === 'main') {
                                        value = 'index.html';
                                    }
                                    return value;
                                });
                                return Buffer.from(result);
                            }
                            return content;
                        },
                    }
                ]
            })
        ],
    },
    publicPath: './',
})
