<script setup lang="ts">
defineProps<{
    label: string
}>()
</script>

<template>
    <div  @click="$emit('confirm')" 
    class="inline-block bg-orange-700 rounded-sm hover:bg-orange-800 text-white p-2 cursor-pointer">
        <div class="flex flex-row">
            <p>{{ label }}</p>
            <slot></slot>
        </div>
    </div>
</template>