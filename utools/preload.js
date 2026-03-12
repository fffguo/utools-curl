const http = require('http');
const https = require('https');
require('url');

// 缓存进入插件内容
window.utools.onPluginEnter(({ code, type, payload }) => {
    window.utools.dbStorage.setItem("__enterPayload", {
        code: code,
        type: type,
        payload: payload
    });
})


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
// 从 rawHeaders 构建原始大小写的响应头对象
function buildRawHeaders(rawHeaders) {
    const headers = {};
    for (let i = 0; i < rawHeaders.length; i += 2) {
        const key = rawHeaders[i];
        const value = rawHeaders[i + 1];
        if (headers[key]) {
            if (Array.isArray(headers[key])) {
                headers[key].push(value);
            } else {
                headers[key] = [headers[key], value];
            }
        } else {
            headers[key] = value;
        }
    }
    return headers;
}

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
            rejectUnauthorized: false,
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
        // 当body过大时，只打印长度和部分内容
        let bodyLog = curl.body;
        if (bodyLog && bodyLog.length > 1000) {
            bodyLog = `${bodyLog.substring(0, 200)}... (${bodyLog.length} 字符)`;
        }
        console.log("body：", bodyLog);
        request.on('error', errorCallback);
        request.end();
    } catch (e) {
        console.log("sendRequest error:", e);
        errorCallback(e)
    }
}

let handleHeader = function (headers, body) {
    if (body && headers) {
        headers['content-length'] = Buffer.byteLength(body)
    }
};

// eslint-disable-next-line no-undef
newURL = function (url) {
    return new URL(url);
};

