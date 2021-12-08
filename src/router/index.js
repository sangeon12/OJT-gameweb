import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Main from '@/components/Main'
import Chating from '@/components/Chating'
import EndWord from '@/components/EndWord'

Vue.use(Router)

const router = new Router({
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
      path: '/endword',
      name: 'EndWord',
      component: EndWord  
    }
  ]
});
export default router;

router.beforeEach( (to, from, next) => {
  console.log(from);
  next();
});
