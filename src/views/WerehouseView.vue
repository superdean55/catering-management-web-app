<template>
    <main class="w-full min-h-screen bg-slate-300 p-0">
    <div class="fixed top-0 z-50 w-12" v-if="screenStore.isSmallScreen" :class="isSubHamburgerOpen ? 'right-36' : 'right-0'">
            <div class="w-full flex flex-row justify-end pr-2 h-10 items-center">
                <Hamburger :is-open="isSubHamburgerOpen" @show="onChangeSubHamburgerVisibiliti" background-color="bg-orange-700"></Hamburger>
            </div>
    </div>
    <div class="h-10"></div>
            <div 
            :class="['fixed w-48 transition-transform duration-300', 
               screenStore.isSmallScreen ? 'top-10 right-0' : '']" 
            :style="{ transform: screenStore.isSmallScreen && !isSubHamburgerOpen ? 'translateX(100%)' : 'translateX(0)', 
                pointerEvents: screenStore.isSmallScreen && !isSubHamburgerOpen ? 'none' : 'auto' }"
                >
                <nav :class="{
                        'translate-x-full': screenStore.isSmallScreen && !isSubHamburgerOpen,
                        'translate-x-0': screenStore.isSmallScreen && isSubHamburgerOpen,
                        }">
                    <ul>
                        <li><div class="h-1 w-full bg-black" v-if="!screenStore.isSmallScreen"></div></li>
                        <li class="bg-orange-700 hover:bg-orange-800 text-white">
                            <RouterLink :to="{ name: 'AddProduct' }" class="flex items-center justify-center h-10 w-full" @click="changeHamburgerVisibiliti">Proivodi</RouterLink>
                        </li>
                        <li class="h-px w-full bg-slate-600"></li>
                        <li class="bg-orange-700 hover:bg-orange-800 text-white">
                            <RouterLink :to="{ name: 'AddCategory' }" class="flex items-center justify-center h-10 w-full" @click="changeHamburgerVisibiliti">Kategorije Proizvoda</RouterLink>
                        </li>
                        <li class="h-px w-full bg-slate-600"></li>
                        <li class="bg-orange-700 hover:bg-orange-800 text-white">
                            <RouterLink :to="{ name: 'AddRawMaterial' }" class="flex items-center justify-center h-10 w-full" @click="changeHamburgerVisibiliti">Sirovine</RouterLink>
                        </li>
                        <li class="h-px w-full bg-slate-600"></li>
                        <li class="bg-orange-700 hover:bg-orange-800 text-white">
                            <RouterLink :to="{ name: 'AddReceipt' }" class="flex items-center justify-center h-10 w-full" @click="changeHamburgerVisibiliti">Primka</RouterLink>
                        </li>
                        <li class="h-px w-full bg-slate-600"></li>
                        <li class="bg-orange-700 hover:bg-orange-800 text-white">
                            <RouterLink :to="{ name: 'SuppliesPreview' }" class="flex items-center justify-center h-10 w-full" @click="changeHamburgerVisibiliti">Zalihe</RouterLink>
                        </li>
                    </ul>
                </nav>
            </div>
        <div class="w-full flex flex-row gap-2" :style="{justifyContent: screenStore.isSmallScreen ? 'flex-end' : 'flex-start'}">
            <RouterView name="werehouse" class="pt-2" :class="screenStore.isSmallScreen ? 'px-2' : 'pl-48 ml-2'"></RouterView>
        </div>
  </main>
</template>

<script setup lang="ts">
import { useScreenStore } from '@/stores/ScreenStore'
import { ref } from 'vue'
import Hamburger from '@/components/buttons/Hamburger.vue'

const isSubHamburgerOpen = ref<boolean>(false)

const onChangeSubHamburgerVisibiliti = (isNavVisible: boolean) => {
  isSubHamburgerOpen.value = isNavVisible
}
const screenStore = useScreenStore()
const changeHamburgerVisibiliti = () => {
    isSubHamburgerOpen.value = false
}
</script>
