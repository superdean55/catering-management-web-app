<script setup lang="ts">
defineProps<{
    label: string
}>()
</script>

<template>
    <div  @click="$emit('confirm')" 
    class="inline-block text-orange-700 hover:text-orange-900  p-2 cursor-pointer">
        <div class="flex flex-row">
            <p class="font-bold">{{ label }}</p>
            <slot></slot>
        </div>
    </div>
</template>