import Vue from 'vue'
import Router from 'vue-router'

const Index = () => import(/* webpackChunkName: "index" */ '@/views/Index/main.vue')

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'sti',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      meta: {
        keepAlive: true
      },
      component: Index
    }
  ]
})
