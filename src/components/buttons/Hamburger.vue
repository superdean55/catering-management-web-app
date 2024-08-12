<template>
    <div class="hamburger" @click="toggleMenu">
        <div :class="{ 'rotate-45': isOpen }"></div>
        <div :class="{ 'hidden': isOpen }"></div>
        <div :class="{ '-rotate-45': isOpen }"></div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
    (e:'show', isNavVisible: boolean): void
}>()

const isOpen = ref<boolean>(false)

function toggleMenu() {
  isOpen.value = !isOpen.value
  emit('show', isOpen.value)
}
</script>

<style scoped>
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  width: 40px;
  height: 30px;
  transition: all 0.3s ease-in-out;
}

.hamburger div {
  width: 100%;
  height: 4px;
  background-color: black;
  border-radius: 2px;
  transition: all 0.3s ease-in-out;
}

.rotate-45 {
  transform: rotate(45deg) translateY(18px);
  
}

.-rotate-45 {
  transform: rotate(-45deg) translateY(-18px);
}

.hidden {
  opacity: 0;
  transform: scaleX(0);
}

@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }
}
</style>