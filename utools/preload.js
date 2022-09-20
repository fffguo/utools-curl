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
sendRequest = function (curl, callback, errorCallback) {
    try {
        console.log("原始请求curl：", curl);
        const myURL = new URL(curl.url);
        handleHeader(curl.headers, curl.body);
        const options = {
            hostname: myURL.hostname,
            port: myURL.port === "" ? (curl.url.startsWith('https') ? 443 : 80) : myURL.port,
            path: myURL.pathname + myURL.search,
            method: curl.method,
            headers: curl.headers,
        };
        let request;
        if (curl.url.startsWith('https')) {
            request = https.request(options, callback);
        } else {
            request = http.request(options, callback);
        }
        if (curl.body !== undefined) {
            request.write(curl.body);
        }
        console.log("请求参数options：", options);
        console.log("body：", curl.body);
        request.on('error', errorCallback);
        request.end();
    } catch (e) {
        console.log("sendRequest error:", e);
        errorCallback(e)
    }
}

let handleHeader = function (headers, body) {
    if (body) {
        headers['content-length'] = Buffer.byteLength(body)
    }
};

// eslint-disable-next-line no-undef
newURL = function (url) {
    return new URL(url);
};

