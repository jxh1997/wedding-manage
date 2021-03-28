import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import ElementUI from 'element-ui'
Vue.use(ElementUI, { size: 'mini'});
import('element-ui/lib/theme-chalk/index.css')


// 解决跨域：1. 配置BaseUrl
import axios from 'axios'
Vue.prototype.$axios = axios
axios.defaults.baseURL = '/test'  //关键代码
Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
