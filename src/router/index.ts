import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { getAuth } from 'firebase/auth'
import scrollBehavior from './scrollBehavior'
import { useLoadingStore } from '@/stores/LoadingStore'
import { Role } from '@/types/Role'
import { useUserStore } from '@/stores/UserStore'

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
      meta: { requiresAuth: true, requiresRole: [Role.admin , Role.manager] },
      children: [
        {
          path: 'product',
          name: 'ProductView',
          components: {
            werehouse:  () => import('../views/werehouseViews/ProductView.vue')
          },
          children:[
            {
              path: 'add',
              name: 'AddProduct',
              components:{
                product: () => import('../components/werehouseComponents/productComponents/AddProduct.vue'),
              }
            },
            {
              path: 'edit/:id',
              name: 'EditProduct',
              components:{
                product: () => import('../components/werehouseComponents/productComponents/EditProduct.vue'),
              }
            },
            {
              path: 'list',
              name: 'Products',
              components:{
                product: () => import('../components/werehouseComponents/productComponents/ProductsList.vue'),
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
              }
            },
            {
              path: 'preview/:id',
              name: 'CategoryPreview',
              components:{
                interface: () => import('../components/werehouseComponents/categoryComponents/CategoryPreview.vue'),
                
              }
            },
            {
              path: 'edit/:id',
              name: 'EditCategory',
              components:{
                interface: () => import('../components/werehouseComponents/categoryComponents/EditCategory.vue'),
                
              }
            },
            {
              path: 'categorys',
              name: 'Categorys',
              components:{
                interface: () => import('../components/werehouseComponents/categoryComponents/CategoryList.vue'),
                
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
        {
          path: 'receipt',
          name: 'ReceiptView',
          components: {
            werehouse: () => import('../views/werehouseViews/ReceiptView.vue')
          },
          children:[
            {
              path: 'add',
              name: 'AddReceipt',
              components:{
                receipt: () => import('../components/werehouseComponents/receiptComponents/ReceiptInterface.vue')
              }
            },
            {
              path: 'list',
              name: 'ReceiptList',
              components:{
                receipt: () => import('../components/werehouseComponents/receiptComponents/ReceiptsList.vue')
              }
            },
            {
              path: 'preview/:id',
              name: 'ReceiptPreview',
              components:{
                receipt: () => import('../components/werehouseComponents/receiptComponents/ReceiptPreview.vue')
              }
            }
          ]
        },
        {
          path: 'supplies',
          name: 'SuppliesView',
          components: {
            werehouse: () => import('../views/werehouseViews/SuppliesView.vue')
          },
          children:[
            {
              path: 'preview',
              name: 'SuppliesPreview',
              components:{
                supplies: () => import('../components/werehouseComponents/suppliesComponents/CurrentSupplies.vue')
              }
            },
            {
              path: 'list',
              name: 'SuppliesList',
              components:{
                supplies: () => import('../components/werehouseComponents/suppliesComponents/SuppliesList.vue')
              }
            }
          ]
        }
      ]
    },
    {
      path: '/paydesk',
      name: 'PaydeskView',
      component: () => import('../views/paydeskViews/PaydeskView.vue'),
      meta: { requiresAuth: true, requiresRole: [Role.admin, Role.manager, Role.staff] },
      children: [
        {
          path: 'bill',
          name: 'BillInterfaceView',
          components: {
            interface: () => import('../views/paydeskViews/BillInterfaceView.vue')
          }
        }
      ]
    },
    {
      path: '/tables',
      name: 'TablesView',
      component: () => import('../views/TablesView.vue'),
      meta: { requiresAuth: true, requiresRole: [Role.admin] }
    },
    {
      path: '/price_list',
      name: 'PriceListView',
      component: () => import('../views/PriceListView.vue'),
    },
    {
      path: '/employees',
      name: 'EmployeesView',
      component: () => import('../views/EmployeeManagementViews/EmployeesView.vue'),
      meta: { requiresAuth: true, requiresRole: [Role.admin] },
      children:[
        {
          path: '/add_new_employee',
          name: 'AddNewEmployeeView',
          components:{
            interface: () => import('../views/EmployeeManagementViews/AddNewEmployeeView.vue')
          }
        },
        {
          path: '/update_role',
          name: 'UpdateRoleView',
          components:{
            interface: () => import('../views/EmployeeManagementViews/UpdateRoleView.vue')
          }
        }
      ]
    },
    {
      path: '/management',
      name: 'RestaurantManagementView',
      component:() => import('../views/RestaurantManagement/RestaurantManagementView.vue'),
      meta: { requiresAuth: true, requiresRole: [Role.admin] },
      children: [
        {
          path: 'payDesk_management',
          name: 'PayDeskManagementView',
          components: {
            management:  () => import('../views/RestaurantManagement/PayDeskManagementView.vue')
          },
          children: [
            {
              path: 'dashboard',
              name: 'PayDeskDashboard',
              components: {
                interface: () => import('@/components/restaurantManagement/payDeskManagement/PayDeskDashboard.vue')
              }
            },
            {
              path: 'add',
              name: 'AddPayDesk',
              components: {
                interface: () => import('@/components/restaurantManagement/payDeskManagement/AddPayDesk.vue')
              }
            },
            {
              path: 'edit/:id',
              name: 'EditPayDesk',
              components: {
                interface: () => import('@/components/restaurantManagement/payDeskManagement/EditPayDesk.vue')
              }
            }
          ]
        }
      ]
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const loadingStore = useLoadingStore()
  loadingStore.setLoadingState(true)
  const auth = getAuth()
  console.log('router')
  await new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe()
      resolve(user)
    })
  })
  const currentUser = auth.currentUser;

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (currentUser) {
      if (to.matched.some(record => record.meta.requiresRole)) {
        const userStore = useUserStore()
        const userRole = userStore.user?.role
        const requiredRoles: Role[] = to.meta.requiresRole as Role[]

        if (requiredRoles.includes(userRole!)) {
          next()
        } else {
          next({ name: 'HomeView', query: { redirect: to.fullPath } })
        }
      } else {
        next();
      }
    } else {
      next({ name: 'HomeView', query: { redirect: to.fullPath } })
    }

  } else if(to.matched.some(record => record.meta.requiresNoAuth)){

    if (currentUser) {
      next({ name: 'HomeView', query: { redirect: to.fullPath } })
    } else {
      next()
    }

  } else {
    next()
  }
})

router.afterEach(() => {
  const loadingStore = useLoadingStore()
  loadingStore.setLoadingState(false)
})
export default router
