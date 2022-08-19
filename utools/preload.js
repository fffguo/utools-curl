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
    try {
        const myURL = new URL(args.url);
        const options = {
            hostname: myURL.hostname,
            port: myURL.port === "" ? (args.url.startsWith('https') ? 443 : 80) : myURL.port,
            path: myURL.pathname + myURL.search,
            method: args.method,
            headers: handleHeader(args.headers, args.body),
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
        console.log("请求参数options：", options);
        console.log("body：", args.body);
        request.on('error', errorCallback);
        request.end();
    } catch (e) {
        console.log("sendRequest error:", e);
        errorCallback(e)
    }
}

let handleHeader = function (headers, body) {
    let newHeaders = {}
    for (const key in headers) {
        if ("Content-Type" === key && headers[key] === "application/x-www-form-urlencoded" && body !== undefined) {
            newHeaders['Content-Length'] = Buffer.byteLength(body)
        }
        if ("Accept-Encoding" !== key) {
            newHeaders[key] = headers[key];
        }
    }
    return newHeaders
};

// eslint-disable-next-line no-undef
newURL = function (url) {
    return new URL(url);
};

