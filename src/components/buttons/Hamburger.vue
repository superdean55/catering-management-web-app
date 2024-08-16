<template>
    <div class="hamburger" @click="toggleMenu">
        <div :class="[ { 'rotate-45': isHambOpen }, backgroundColor ? backgroundColor : 'bg-black']"></div>
        <div :class="[{ 'hidden': isHambOpen },  backgroundColor ? backgroundColor : 'bg-black']"></div>
        <div :class="[{ '-rotate-45': isHambOpen }, backgroundColor ? backgroundColor : 'bg-black']"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  isOpen: boolean,
  backgroundColor?: string
}>()
const emit = defineEmits<{
    (e:'show', isNavVisible: boolean): void
}>()
const isHambOpen = ref<boolean>(props.isOpen)
watch(() => props.isOpen, (newIsOpen) => {
  isHambOpen.value = newIsOpen
})
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
  width: 30px;
  height: 20px;
  transition: all 0.3s ease-in-out;
}

.hamburger div {
  width: 100%;
  height: 3px;
  border-radius: 2px;
  transition: all 0.3s ease-in-out;
}

.rotate-45 {
  transform: rotate(45deg) translateY(12px);
  
}

.-rotate-45 {
  transform: rotate(-45deg) translateY(-12px);
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