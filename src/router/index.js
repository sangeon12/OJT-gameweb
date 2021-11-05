import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Main from '@/components/Main'
import Chating from '@/components/Chating'
import EndWordWait from '@/components/EndWordWait'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/main',
      name: 'Main',
      component: Main
    },
    {
      path: '/chating',
      name: 'Chating',
      component: Chating
    },
    {
      path: '/endwordwait',
      name: 'EndWordWait',
      component: EndWordWait
    }
  ]
})
