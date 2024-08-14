<template>
    <div class="w-full pb-2 flex flex-row justify-around overflow-x-scroll scrollbar-hide">
    <IconButton
      v-for="(item, index) in navIconsRef"
      :key="index"
      :navIcon="item"
      :external-change="externalChange"
      @icon-clicked="onIconClicked"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import IconButton from './IconButton.vue'
import type { NavIcon } from '@/types/NavIcon'
import { watch } from 'vue';

const props = defineProps<{
    icons: NavIcon [],
    externalChange: number
}>()

const emit = defineEmits<{
    (e:'selected', selectedIcon: string): void
}>()

const navIconsRef = ref<NavIcon []>(props.icons)

watch(() => props.externalChange, () => {
  navIconsRef.value = props.icons
})


function onIconClicked(title: string) {
  changeSelection(title)
  emit('selected', title)
}

function changeSelection(title: string){
  navIconsRef.value.forEach(icon => {
    if(icon.title === title){
      icon.isSelected = true
    }else{
      icon.isSelected = false
    }
  })
}
</script>