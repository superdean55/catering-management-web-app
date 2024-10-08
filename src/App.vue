<script setup lang="ts">
import { useUserStore } from '@/stores/UserStore'
import router from "@/router"
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useArticleStore } from '@/stores/ArticleStore'
import { useReceiptStore } from '@/stores/ReceiptStore'
import { useSuppliesStore } from '@/stores/SuppliesStore'
import { useProductStore } from '@/stores/ProductStore'
import { useCategoryStore } from '@/stores/CategoryStore'
import { useTableStore } from './stores/TableStore'
import LoadingSpiner from './components/loading/LoadingSpiner.vue'
import { useLoadingStore } from './stores/LoadingStore'
import { Role } from './types/Role'
import { usePayDeskStore } from './stores/payDeskStore'
import { useOrderStore } from './stores/OrderStore'
import Hamburger from './components/buttons/Hamburger.vue'
import { useScreenStore } from './stores/ScreenStore'

const userStore = useUserStore()
const articleStore = useArticleStore()
const receiptStore = useReceiptStore()
const suppliesStore = useSuppliesStore()
const productStore = useProductStore()
const categoryStore = useCategoryStore()
const tableStore = useTableStore()
const loadingStore = useLoadingStore()
const payDeskStore = usePayDeskStore()
const orderStore = useOrderStore()
const screenStore = useScreenStore()

articleStore.getRawMaterials()

suppliesStore.getSupplies()
productStore.getProducts()
categoryStore.getCategorys()
userStore.authState()
receiptStore.getReceipts()
tableStore.getTables()


const { user } = storeToRefs(userStore)
const userImage = ref<HTMLImageElement | null>(null)
if(userStore.user && 
  (userStore.user.role === Role.admin || userStore.user.role === Role.manager || userStore.user.role === Role.staff))
{
  console.log('getusers')
  userStore.getUsers()
}

watch(user,() =>{
  if(userImage.value != null && user.value && user.value.imageUrl && user.value.imageUrl != ''){
    userImage.value.src = user.value.imageUrl
  }
  if(userStore.user && 
  (userStore.user.role === Role.admin || userStore.user.role === Role.manager || userStore.user.role === Role.staff))
  {
    console.log('getusers')
    userStore.getUsers()
  }
  if(userStore.user && 
  (userStore.user.role === Role.admin || userStore.user.role === Role.manager || userStore.user.role === Role.staff || userStore.user.role === Role.user))
  {
    console.log('getusers')
    userStore.fetchUserOrders()
    userStore.fetchUserBills()
  }
})
watch(() => userStore.isLoading, (newValue) => {
    loadingStore.setLoadingState(newValue) 
})
watch(() => orderStore.isLoading, (newValue) => {
    loadingStore.setLoadingState(newValue) 
})
watch(() => payDeskStore.isLoading, (newValue) => {
    loadingStore.setLoadingState(newValue) 
})
watch(user, () => {
  if(user.value?.role === Role.admin || user.value?.role === Role.manager || user.value?.role === Role.staff){
    payDeskStore.fetchPayDesks()
  }
})
onMounted(() => {
  tableStore.startTracking()
})
const toUserAccount = () => {
  router.push({ name: 'UserAccount'})
  isHamburgerOpen.value = false
}
const isSmallScreen = computed(() => {
      return screenStore.screenWidth < 768
})

const isHamburgerOpen = ref<boolean>(false)

const onChangeHamburgerVisibiliti = (isNavVisible: boolean) => {
  isHamburgerOpen.value = isNavVisible
}
const changeHamburgerVisibiliti = () => {
    isHamburgerOpen.value = false
}
</script>

<template>
    <div class="fixed z-50 w-48" v-if="isSmallScreen">
          <div class="w-full flex flex-row pl-2 h-10 items-center" :style="{justifyContent: isHamburgerOpen ? 'flex-end': 'flex-start'}">
            <Hamburger @show="onChangeHamburgerVisibiliti" :isOpen="isHamburgerOpen" ></Hamburger>
          </div>
    </div>
    <header 
      class="fixed bg-orange-700 h-10 w-full z-40 transition-transform duration-300" 
      :style="{height: isSmallScreen ? '100%' : 40 + 'px', width: isSmallScreen ? 200 + 'px' : '100%'}"
      :class="{
          '-translate-x-full': isSmallScreen && !isHamburgerOpen,
          'translate-x-0': isSmallScreen && isHamburgerOpen,
        }"
    >
      <nav class="flex h-full px-5 text-white" :style="{flexDirection: isSmallScreen ? 'column' : 'row'}">
        <div class="h-12" v-if="isSmallScreen"></div>
        
        <div class="hover:bg-orange-800">
          <RouterLink :to="{ name: 'HomeView' }" class="flex items-center px-5 h-10" @click="changeHamburgerVisibiliti"><p>Početna</p></RouterLink>
        </div>
        <div v-if="userStore.loggedInVisibility && (userStore.user?.role === Role.admin || userStore.user?.role === Role.manager)" class="hover:bg-orange-800">
          <RouterLink :to="{ name: 'AddProduct'}" class="flex items-center px-5 h-10" @click="changeHamburgerVisibiliti">Skladište</RouterLink>
        </div>
        <div v-if="userStore.loggedInVisibility && (userStore.user?.role === Role.admin || userStore.user?.role === Role.manager || userStore.user?.role === Role.staff)" class="hover:bg-orange-800">
          <RouterLink :to="{ name: 'BillInterfaceView'}" class="flex items-center px-5 h-10" @click="changeHamburgerVisibiliti">Blagajna</RouterLink>
        </div>
        <div v-if="userStore.loggedInVisibility && (userStore.user?.role === Role.admin)" class="hover:bg-orange-800" @click="changeHamburgerVisibiliti">
          <RouterLink :to="{ name: 'PayDeskDashboard'}" class="flex items-center px-5 h-10">Upravljanje</RouterLink>
        </div>
        <div v-if="userStore.loggedInVisibility && (userStore.user?.role === Role.admin || userStore.user?.role === Role.manager || userStore.user?.role === Role.staff || userStore.user?.role === Role.user)" class="hover:bg-orange-800">
          <RouterLink :to="{ name: 'UserOrdersAndBillsView'}" class="flex items-center px-5 h-10" @click="changeHamburgerVisibiliti">Narudžbe i Računi</RouterLink>
        </div>
        <div class="hover:bg-orange-800">
          <RouterLink :to="{ name: 'AboutView'}" class="flex items-center px-5 h-10" @click="changeHamburgerVisibiliti">O Aplikaciji</RouterLink>
        </div>
        <div class="ml-auto"></div>
        <div v-if="userStore.notLoggedInVisibility" class="hover:bg-orange-800">
          <RouterLink :to="{ name: 'SignInView'}" class="flex items-center px-5 h-10" @click="changeHamburgerVisibiliti">Prijavi se</RouterLink>
        </div>
        <div v-if="userStore.loggedInVisibility" class="flex flex-row items-center justify-center h-10 w-10 ">
          <div class="w-8 h-8">
            <img ref="userImage" @click="toUserAccount" src="@/assets/blank_profile_picture.jpg" class="rounded-full h-full w-full object-fill overflow-hidden">
          </div>
        </div>
    
      </nav>
    </header>
    <RouterView />
    <LoadingSpiner :isLoading="loadingStore.isLoading"></LoadingSpiner>
</template>

