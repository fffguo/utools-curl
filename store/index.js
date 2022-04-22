import {createStore} from 'vuex'
import {pd} from "pretty-data";

const CURLParser = require('parse-curl')


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
            responseBodyEditor: undefined,
            requestBodyEditor: undefined
        },
        //request dom节点
        dom: {
            loading: false,
            request: {
                startInit: false,
                activeTabName: "requestBody"
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
            state.ace.requestBodyEditor.setValue(pd.json(curl.body), 1)
            state.ace.requestBodyEditor.getSession().setMode("ace/mode/json5")
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
        sendRequest(state) {
            state.dom.loading = true

            let curlArgs = {
                url: state.curl.request.url,
                method: state.curl.request.method,
                headers: state.curl.request.headers,
                body: state.curl.request.body
            }
            window.sendRequest(curlArgs, function (response) {
                state.curl.response.httpStatus = response.statusCode
                state.curl.response.headers = response.headers
                //请求结束
                let body = ""
                response.on('end', () => {
                    state.dom.loading = false
                    state.curl.response.body = body
                    state.ace.responseBodyEditor.setValue(pd.json(body), 1)
                    state.ace.responseBodyEditor.getSession().setMode("ace/mode/json5")
                })
                //返回体,body过大会多次回调
                response.on('data', (data) => {
                    body += data.toString();
                })
                //失败
                response.on('error', error => {
                    state.dom.loading = false
                    state.curl.response.body = error.toString()
                    state.ace.responseBodyEditor.setValue(error.toString(), 1)
                    state.ace.responseBodyEditor.getSession().setMode("ace/mode/text")
                })
            })
            //todo 挂载
            window.curl = state.curl
            window.aceEdit = state.ace.responseBodyEditor
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
