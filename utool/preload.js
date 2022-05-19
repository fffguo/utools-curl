const http = require('http');
const https = require('https');
require('url');


/*
args 示例结构
{
    "url": "/ci/releases?projectId=1497&page=0&pageSize=10&version=&user=&tag=",
    "method": "get",
    "headers":{
        "Cookie": "SESSION=0b75cc03-d4be-4576-bd77-dd03fb46a0e4"
    }
}
callback参考：http://nodejs.cn/learn/the-nodejs-http-module#httpincomingmessage    http.IncomingMessage
*/
// eslint-disable-next-line no-undef
sendRequest = function (args, callback, errorCallback) {
    const myURL = new URL(args.url);
    const options = {
        hostname: myURL.hostname,
        port: myURL.port === "" ? '80' : myURL.port,
        path: myURL.pathname + myURL.search,
        method: args.method,
        headers: args.headers,
    };
    let request;
    if (args.url.startsWith('https')) {
        request = https.request(options, callback);
    } else {
        request = http.request(options, callback);
    }
    if (args.body !== undefined) {
        request.write(args.body);
    }
    console.log("sendRequest", options, args.body);
    request.on('error', errorCallback);
    request.end();

}

// eslint-disable-next-line no-undef
bufferToString = function (buffer) {
    return buffer.toString()
}

window.exports = {
    // "curl_local_request": { // 注意：键对应的是 plugin.json 中的 features.code
    //     mode: "none",  // 用于无需 UI 显示，执行一些简单的代码
    //     args: {
    //         // 进入插件时调用
    //         enter: (action) => {
    //
    //             //curl替换
    //             window.utools.setSubInput(function (arg) {
    //                 const copyText = action.payload.replace(new RegExp('(?<=https?://)[^/]+'), arg.text);
    //                 //复制
    //                 window.utools.copyText(copyText.toString());
    //                 curl = copyText.toString();
    //             }, "localhost:8080", true);
    //             //赋值默认值
    //             window.utools.setSubInputValue("localhost:8080")
    //         }
    //     }
    // }
}

//回车退出
// document.addEventListener('keydown', event => {
//     const keyCode = window.event ? event.keyCode : event.which;
//     if (keyCode === 13) {
//         window.utools.removeSubInput()
//         window.utools.hideMainWindow()
//         window.utools.outPlugin()
//     }
// })

