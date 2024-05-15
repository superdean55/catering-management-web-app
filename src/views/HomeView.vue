<script setup lang="ts">
import InputLabel from '../components/inputs/InputLabel.vue'
import {ref } from 'vue'
import { useUserStore } from '@/stores/UserStore';
const email = ref('')
const userStore = useUserStore()
const activateImageUpload = () => {
  const inputElement = document.getElementById('imageUpload');
      if (inputElement) {
        inputElement.click();
      }
}
</script>

<template>
  <main class="w-full h-screen bg-slate-300 p-0">
    <div class="h-10"></div>
    <h1>Home</h1>
    <input type="file" accept="image/*" id="imageUpload" name="imageUpload" style="display: none;">
    <button @click="activateImageUpload">Odaberi sliku</button>
    
  </main>
</template>
