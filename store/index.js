import {createStore} from 'vuex'
import {pd} from "pretty-data";

const CURLParser = require('parse-curl')

function parseBody(body) {
    let result = {
        body: body,
        mode: "ace/mode/text",
        contentType: "TEXT"
    }
    try {
        result.body = pd.json(body)
        result.mode = "ace/mode/json5"
        result.contentType = "JSON"
    } catch (e) {
        try {
            result.body = pd.xml(body)
            result.mode = "ace/mode/xml"
            result.contentType = "XML"
        } catch (e) {
            result.body = body
            result.mode = "ace/mode/text"
            result.contentType = "TEXT"
        }
    }
    return result
}

export default createStore({
    state: {
        //curl参数
        curl: {
            curlText: "",
            request: {
                url: "",
                method: "",
                headers: [],
                body: ""
            },
            response: {
                httpStatus: "",
                headers: [],
                body: "",
            }
        },
        //ace编辑器
        ace: {
            supportedLanguage: {
                json: "ace/mode/json5",
                xml: "ace/mode/xml",
                text: "ace/mode/text",
            },
            responseBodyEditor: undefined,
            requestBodyEditor: undefined,
            requestBodyContentType: "",
            responseBodyContentType: "",
            requestBodyMode: "",
        },
        //request dom节点
        dom: {
            loading: false,
            request: {
                startInit: false,
                activeTabName: "requestBody",
                requestHeaderTableRef: [],
                urlArgsTableRef: []
            },
            response: {
                show: false,
                activeTabName: "responseResult"
            }
        }

    },
    mutations: {
        setCurlText(state, text) {
            state.curl.curlText = text
        },
        setCurlRequest(state, curl) {
            state.curl.request.url = curl.url
            state.curl.request.headers = curl.header
            state.curl.request.method = curl.method
            state.curl.request.body = curl.body
            let result = parseBody(curl.body)
            state.ace.requestBodyEditor.setValue(result.body, 1)
            state.ace.requestBodyEditor.getSession().setMode(result.mode)
            state.ace.requestBodyContentType = result.contentType
            state.ace.requestBodyMode = result.mode
        },
        revertResponseTabActive(state) {
            state.dom.response.activeTabName = "responseResult"
        },
        showResponseTab(state) {
            state.dom.response.show = true
        },
        initByCurlText(state, curlText) {
            let curl = CURLParser(curlText);
            //构建request
            this.commit('setCurlRequest', curl)
            //初始化request
            state.dom.request.startInit = true
            //重设responseTab
            this.commit('revertResponseTabActive')
            //显示tab
            this.commit('showResponseTab')
        },
        //发送请求
        sendRequest(state, curlArgs) {
            state.dom.loading = true

            //请求失败回调
            let errorCallback = function (_error) {
                state.dom.loading = false
                state.curl.response.body = _error.toString()
                state.ace.responseBodyEditor.setValue(_error.toString(), 1)
                state.ace.responseBodyEditor.getSession().setMode("ace/mode/text")
            };

            window.sendRequest(curlArgs, function (response) {
                state.curl.response.httpStatus = response.statusCode
                state.curl.response.headers = response.headers
                //请求结束
                let body = ""
                response.on('end', () => {
                    state.dom.loading = false
                    state.curl.response.body = body
                    let result = parseBody(body)
                    state.ace.responseBodyEditor.setValue(result.body, 1)
                    state.ace.responseBodyEditor.getSession().setMode(result.mode)
                    state.ace.responseBodyContentType = result.contentType
                })
                //返回体,body过大会多次回调
                response.on('data', (data) => {
                    body += data.toString();
                })
                //失败
                response.on('error', errorCallback)
            }, errorCallback)
            // 挂载
            window.curlVuex = state
        },

        //取消发送请求
        cancelRequest(state) {
            state.dom.loading = false
            this.commit('revertResponseTabActive')
            this.commit('showResponseTab')
            state.ace.responseBodyEditor.setValue("", 1)
            state.ace.responseBodyEditor.getSession().setMode("ace/mode/json5")
        },

    },
    actions: {},
    getters: {},
    modules: {}
})
