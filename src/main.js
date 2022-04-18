import {createApp} from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Ace from 'ace-builds'
import * as IconFont from './assets/iconfont/iconfont'
import './assets/iconfont/iconfont.css'
import store from './../store/index'

const app = createApp(App)

app.use(ElementPlus)
    .use(IconFont)
    .use(Ace)
    .use(store)
    .mount('#app')


