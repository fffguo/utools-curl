import {createStore} from 'vuex'

export default createStore({
    state: {
        curl: {
            curlText: "",
            request: {
                headers: [],
                body: ""
            },
            response: {
                httpStatus: "",
                headers: [],
                body: "",
            }
        },
        ace: {
            bodyEdit: undefined
        }
    },
    mutations: {},
    actions: {},
    getters: {},
    modules: {}
})
