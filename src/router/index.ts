import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { getAuth } from 'firebase/auth'


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
    },
    {
      path: '/werehouse',
      name: 'WerehouseView',
      component: () => import('../views/WerehouseView.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'articles',
          name: 'ArticleView',
          components: {
            werehouse:  () => import('../views/werehouseViews/ArticleView.vue')
          },children:[
            {
              path: 'add',
              name: 'AddArticle',
              components:{
                interface: () => import('../components/werehouseComponents/articleComponents/AddAndEditAtricle.vue'),
                articleList: () => import('../components/werehouseComponents/articleComponents/ArticleList.vue')
              }
            }
          ]
        },
        
        {
          path: 'categorys',
          name: 'CategoryView',
          components: {
            werehouse:  () => import('../views/werehouseViews/CategoryView.vue')
          },
          children:[
            {
              path: 'add',
              name: 'AddCategory',
              components:{
                interface: () => import('../components/werehouseComponents/categoryComponents/AddCategory.vue'),
                categoryList: () => import('../components/werehouseComponents/categoryComponents/CategoryList.vue')
              }
            },
            {
              path: 'preview/:id',
              name: 'CategoryPreview',
              components:{
                interface: () => import('../components/werehouseComponents/categoryComponents/CategoryPreview.vue'),
                categoryList: () => import('../components/werehouseComponents/categoryComponents/CategoryList.vue')
              }
            },
            {
              path: 'edit/:id',
              name: 'EditCategory',
              components:{
                interface: () => import('../components/werehouseComponents/categoryComponents/EditCategory.vue'),
                categoryList: () => import('../components/werehouseComponents/categoryComponents/CategoryList.vue')
              }
            }
          ]
        },
        {
          path: 'raw-materials',
          name: 'RawMaterialsView',
          components:{
            werehouse: () => import('../views/werehouseViews/RawMaterialView.vue')
          },
          children:[
            {
              path: 'add',
              name: 'AddRawMaterial',
              components:{
                interface: () => import('../components/werehouseComponents/RawMaterialComponents/AddRawMaterial.vue'),
                list: () => import('../components/werehouseComponents/RawMaterialComponents/RawMaterialsList.vue')
              }
            },
            {
              path: 'edit/:id',
              name: 'EditRawMaterial',
              components:{
                interface: () => import('../components/werehouseComponents/RawMaterialComponents/EditRawMaterial.vue'),
                list: () => import('../components/werehouseComponents/RawMaterialComponents/RawMaterialsList.vue')
              }
            }
          ]
        },
      ]
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
