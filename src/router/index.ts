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
    },
    {
      path: '/user_account',
      name: 'UserAccount',
      component: () => import('../views/UserAccount.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/edit_user',
      name: 'EditUserView',
      component: () => import('../views/EditUserView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const auth = getAuth();
  console.log('router')
  await new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user); 
    });
  });
  const currentUser = auth.currentUser;

  if (to.matched.some(record => record.meta.requiresAuth)) {

    if (currentUser) {
      next();
    } else {
      next({ name: 'HomeView', query: { redirect: to.fullPath } });
    }

  } else if(to.matched.some(record => record.meta.requiresNoAuth)){

    if (currentUser) {
      next({ name: 'HomeView', query: { redirect: to.fullPath } });
    } else {
      next();
    }

  } else {
  
    next();

  }
});
export default router
