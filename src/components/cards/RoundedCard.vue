<template>
    <div class="p-4  rounded-xl shadow-xl" :class="backgroundColor == null ? 'bg-slate-100' : backgroundColor">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    backgroundColor?: string
}>()
</script>