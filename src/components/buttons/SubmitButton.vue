<script setup lang="ts">
defineProps<{
    label: string
}>()
</script>

<template>
    <button class="px-3 py-2 bg-orange-700 rounded-xl hover:bg-orange-800 text-white" @click="$emit('submit')">{{ label }}</button>
</template>