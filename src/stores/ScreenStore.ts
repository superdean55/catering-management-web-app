import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useScreenStore = defineStore('screen', () => {
  const screenHeight = ref(window.innerHeight)
  const screenWidth = ref(window.innerWidth)

  function updateScreenHeight() {
    screenHeight.value = window.innerHeight
    screenWidth.value = window.innerWidth
  }

  window.addEventListener('resize', updateScreenHeight)

  return { screenHeight, screenWidth }
})