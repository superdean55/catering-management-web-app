<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HomeView from './views/HomeView.vue';
import AboutView from './views/AboutView.vue';
import SignInView from './views/SignInView.vue';
import { useUserStore } from '@/stores/UserStore'

const userStore = useUserStore()
userStore.authState()


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
      <div class="ml-auto"></div>
      <div v-if="userStore.notLoggedInVisibility" class="flex items-center hover:bg-orange-800 h-full px-5">
        <RouterLink :to="{ name: 'SignInView'}">Sign In</RouterLink>
      </div>
      <div v-if="userStore.loggedInVisibility" class="flex items-center h-full ">
        <img src="./assets/blank_profile_picture.jpg" class="rounded-full h-8">
        
      </div>
      
    </nav>
  </header>
  <RouterView />
</template>
