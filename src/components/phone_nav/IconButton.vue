<template>
<div
    @click="handleClick"
    :class="['w-16 h-16 rounded-lg flex flex-col items-center justify-center cursor-pointer', isSelected ? 'bg-gray-400' : 'bg-gray-200']"
>
    <span class="material-symbols-outlined text-5xl">{{ icon }}</span>
    <p class="text-xs font-bold">{{ title }}</p>
</div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
    icon: string
    title: string
    isSelected: boolean
}>()

const emit = defineEmits<{
    (e: 'icon-clicked', title: string): void
}>()

function handleClick() {
    emit('icon-clicked', props.title)
}
</script>