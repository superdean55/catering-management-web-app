<template>
<div
    @click="handleClick"
    :class="['w-16 h-16 rounded-lg flex flex-col items-center justify-center cursor-pointer', navIconRef.isSelected ? 'bg-gray-400' : 'bg-gray-200']"
>
    <span class="material-symbols-outlined text-5xl">{{ navIconRef.icon }}</span>
    <p class="text-xs font-bold">{{ navIconRef.title }}</p>
</div>
</template>

<script setup lang="ts">
import type { NavIcon } from '@/types/NavIcon';
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps<{
    navIcon: NavIcon,
    externalChange: number
}>()

const emit = defineEmits<{
    (e: 'icon-clicked', title: string): void
}>()

const navIconRef = ref<NavIcon>(props.navIcon)

watch(() => props.externalChange, () => {
    navIconRef.value = props.navIcon
    if(props.navIcon.isSelected){
        emit('icon-clicked', props.navIcon.title)
    }
})

function handleClick() {
    emit('icon-clicked', props.navIcon.title)
}
</script>