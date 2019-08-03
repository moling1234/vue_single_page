import Vue from 'vue'
import request from './request'

function install () {
  Vue.use(request)
}

export default {
  install
}
