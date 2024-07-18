<script setup lang="ts">
import { useUserStore } from '@/stores/UserStore'
import router from "@/router"
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useArticleStore } from '@/stores/ArticleStor'
import { useReceiptStore } from '@/stores/ReceiptStore'
import { useSuppliesStore } from '@/stores/SuppliesStore'
import { useProductStore } from '@/stores/ProductStore'
import { useCategoryStore } from '@/stores/CategoryStore'
import { useTableStore } from './stores/TableStore'
import LoadingSpiner from './components/loading/LoadingSpiner.vue'
import { useLoadingStore } from './stores/LoadingStore'
import { Role } from './types/Role'

const userStore = useUserStore()
const articleStore = useArticleStore()
const receiptStore = useReceiptStore()
const suppliesStore = useSuppliesStore()
const productStore = useProductStore()
const categoryStore = useCategoryStore()
const tableStore = useTableStore()
const loadingStore = useLoadingStore()

articleStore.getRawMaterials()

suppliesStore.getSupplies()
productStore.getProducts()
categoryStore.getCategorys()
userStore.authState()
receiptStore.getReceipts()
tableStore.getTables()

const { user } = storeToRefs(userStore)
const userImage = ref<HTMLImageElement | null>(null)

watch(user,() =>{
  if(userImage.value != null && user.value && user.value.imageUrl && user.value.imageUrl != ''){
    userImage.value.src = user.value.imageUrl
  }
})
watch(() => userStore.isLoading, (newValue) => {
    loadingStore.setLoadingState(newValue) 
})

const toUserAccount = () => {
  router.push({ name: 'UserAccount'})
}

</script>

<template>
  
    <header class="fixed bg-orange-700 h-10 w-full">
      <nav class=" flex flex-row h-full px-5 text-white">
        <div class="flex items-center hover:bg-orange-800 h-full px-5">
          <RouterLink :to="{ name: 'HomeView' }" >Home</RouterLink>
        </div>
        <div class="flex items-center hover:bg-orange-800 h-full px-5">
          <RouterLink :to="{ name: 'AboutView'}">About</RouterLink>
        </div>
        <div v-if="userStore.loggedInVisibility && (userStore.user?.role === Role.admin || userStore.user?.role === Role.manager)" class="flex items-center hover:bg-orange-800 h-full px-5">
          <RouterLink :to="{ name: 'AddProduct'}">Skladište</RouterLink>
        </div>
        <div v-if="userStore.loggedInVisibility && (userStore.user?.role === Role.admin || userStore.user?.role === Role.manager || userStore.user?.role === Role.staff)" class="flex items-center hover:bg-orange-800 h-full px-5">
          <RouterLink :to="{ name: 'BillInterfaceView'}">Blagajna</RouterLink>
        </div>
        <div v-if="userStore.loggedInVisibility && (userStore.user?.role === Role.admin)" class="flex items-center hover:bg-orange-800 h-full px-5">
          <RouterLink :to="{ name: 'TablesView'}">Stolovi</RouterLink>
        </div>
        <div v-if="userStore.loggedInVisibility && (userStore.user?.role === Role.admin)" class="flex items-center hover:bg-orange-800 h-full px-5">
          <RouterLink :to="{ name: 'AddNewEmployeeView'}">Zaposlenici</RouterLink>
        </div>
        <div v-if="userStore.loggedInVisibility && (userStore.user?.role === Role.admin)" class="flex items-center hover:bg-orange-800 h-full px-5">
          <RouterLink :to="{ name: 'RestaurantManagementView'}">Upravljanje</RouterLink>
        </div>
        <div class="ml-auto"></div>
        <div v-if="userStore.notLoggedInVisibility" class="flex items-center hover:bg-orange-800 h-full px-5">
          <RouterLink :to="{ name: 'SignInView'}">Sign In</RouterLink>
        </div>
        <div v-if="userStore.loggedInVisibility" class="flex items-center h-full ">
          <img ref="userImage" @click="toUserAccount" src="@/assets/blank_profile_picture.jpg" class="rounded-full h-8">
        </div>
    
      </nav>
    </header>
    <RouterView />
    <LoadingSpiner :isLoading="loadingStore.isLoading"></LoadingSpiner>
</template>

