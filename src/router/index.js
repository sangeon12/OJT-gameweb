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
      component: Main,
      meta: {
        isLogin:false
      }
    },
    {
      path: '/chating',
      name: 'Chating',
      component: Chating,
      meta: {
        isLogin:false,
        inRoom:false
      }
    },
    {
      path: '/endword',
      name: 'EndWord',
      component: EndWord,
      meta: {
        isLogin:false,
        inRoom:false
      } 
    }
  ]
});
export default router;

router.beforeEach( (to, from, next) => {
  if(to.fullPath !== "/"){

    if(document.readyState == 'loading'){
      next('/');
      return;
    } 

    if(to.meta.isLogin !== undefined){
      if(!to.meta.isLogin){
        alert('먼저 로그인을 해주세요.');
        return;
      }
    }else{
      alert('잘못된 URL주소입니다.');
      return;
    }

    if(to.meta.inRoom !== undefined){
      if(!to.meta.inRoom){
        alert('먼저 방에 들어가주세요.');
        return;
      }
    }
    
  }
  next();
});
