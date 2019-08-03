import Vue from 'vue'
import Vuex from 'vuex'
import common from './common'
import index from './pages/index'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    common,
    index
  }
})
