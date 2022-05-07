import {createApp} from 'vue'
import App from './App.vue'
//elementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//ace编辑器
import Ace from 'ace-builds'
//vuex
import store from './../store/index'
// iconfont
import * as IconFont from './assets/iconfont/iconfont'
import './assets/iconfont/iconfont.css'

const app = createApp(App)

app.use(ElementPlus)
    .use(IconFont)
    .use(Ace)
    .use(store)
    .mount('#app')
