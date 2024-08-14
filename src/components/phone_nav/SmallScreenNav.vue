<template>
    <div class="w-full pb-2 flex flex-row justify-around overflow-x-scroll scrollbar-hide">
    <IconButton
      v-for="(item, index) in icons"
      :key="index"
      :icon="item.icon"
      :title="item.title"
      :isSelected="selectedIcon === item.title"
      @icon-clicked="onIconClicked"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import IconButton from './IconButton.vue'
import type { NavIcon } from '@/types/NavIcon';

const props = defineProps<{
    icons: NavIcon []
}>()

const emit = defineEmits<{
    (e:'selected', selectedIcon: string): void
}>()

const selectedIcon = ref<string | null>(null)

function onIconClicked(title: string) {
  selectedIcon.value = title
  emit('selected', title)
}
</script>