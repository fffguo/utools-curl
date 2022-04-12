var child_process = require("child_process");
var http = require('http');


var curl = ""


requestDemo = function (options) {
    let result
    var options = {
        host: "bugatti.dev.qianmi.com",
        port: "80",   //port
        path: "/ci/releases?projectId=1497&page=0&pageSize=10&version=&user=&tag=",   //get方式使用的地址
        method: "get", //get方式或post方式
        headers: {
            "Cookie": "SESSION=0b75cc03-d4be-4576-bd77-dd03fb46a0e4"
        },
    };
    let req = http.request(options, (res) => {
        console.log(res);
        console.log(res.read());
        result = res
    });

    var a = req.end()
    return result
}

window.exports = {
    "curl_local_debug": { // 注意：键对应的是 plugin.json 中的 features.code
        mode: "none",  // 用于无需 UI 显示，执行一些简单的代码
        args: {
            // 进入插件时调用
            enter: (action) => {

                //curl替换
                window.utools.setSubInput(function (arg) {
                    var copyText = action.payload.replace(new RegExp('(?<=https?://)[^/]+'), arg.text)
                    //复制
                    window.utools.copyText(copyText.toString());
                    curl = copyText.toString();
                }, "localhost:8080", true);
                //赋值默认值
                window.utools.setSubInputValue("localhost:8080")
            }
        }
    }
}

//回车退出
document.addEventListener('keydown', event => {
    var keyCode = window.event ? event.keyCode : event.which
    if (keyCode === 13) {
        window.utools.removeSubInput()
        window.utools.hideMainWindow()
        window.utools.outPlugin()


        // // 直接调用
        // child_process.exec("curl \"http://xcx-caigou.1000.com.test1.ck/api/market/unify/order/query\" \
        // -H 'Connection: keep-alive' \
        // -H 'reqId: 1a058460-b25b-11ec-a961-c11fb2209832' \
        // -H 'Accept: application/json' \
        // -H 'Platform-No: ' \
        // -H 'Platform: pc' \
        // -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36 Edg/99.0.1150.55' \
        // -H 'systemId: 0031' \
        // -H 'Content-Type: application/json' \
        // -H 'Origin: http://web.1000.com.test1.ck' \
        // -H 'Referer: http://web.1000.com.test1.ck/' \
        // -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6' \
        // -H 'Cookie: _ga=GA1.3.57335965.1642072151; _gid=GA1.3.533816500.1648798514; SSOTICKET=; SSOEXPIRES=; SSOTHRESHOLD=; a9a68f4fefd3b693f10be4a89799dc48=6fc756f8a8994635b8b61486de2278bd; qmuid=646025685; cxuid=1890023; sxuid=-758412648; gauserid=qm44273oog' \
        // --compressed \
        // --insecure", function (err, stdout, stderr) {
        //     console.log(stdout);
        //     console.log("==========================");
        //     console.log(err);
        //     console.log("==========================");
        //     console.log(stderr);
        // });
    }
})

