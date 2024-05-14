import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { getAuth } from 'firebase/auth';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomeView',
      component: HomeView
    },
    {
      path: '/about',
      name: 'AboutView',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/sign_in',
      name: 'SignInView',
      component: () => import('../views/SignInView.vue'),
      meta: { requiresNoAuth: true }
    },
    {
      path: '/sign_up',
      name: 'SignUpView',
      component: () => import('../views/SignUpView.vue'),
      meta: { requiresNoAuth: true }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const auth = getAuth();

  await new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user); 
    });
  });
  const currentUser = auth.currentUser;

  if (to.matched.some(record => record.meta.requiresAuth)) {

    if (currentUser) {
      console.log(`router reqAuth current user: ${currentUser}`)
      next();
    } else {
      console.log(`router reqAuth current user: ${currentUser} else`)
      next({ name: 'HomeView', query: { redirect: to.fullPath } });
    }

  } else if(to.matched.some(record => record.meta.requiresNoAuth)){

    if (currentUser) {
      console.log(`router reqNOAuth current user: ${currentUser}`)
      next({ name: 'HomeView', query: { redirect: to.fullPath } });
    } else {
      console.log(`router reqNOAuth current user: ${currentUser}`)
      next();
    }

  } else {
  
    next();

  }
});
export default router
