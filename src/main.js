import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router/index'
import store from '@/store/index'
import '@/utils/rem'
import plugin from '@/plugin/index'
import vant from '@/libs/vant'

import './styles/reset.scss'
import 'vant/lib/index.css'

plugin.install()
Vue.use(vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
