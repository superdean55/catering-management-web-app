<template>
    <div  
        @click="$emit('confirm')" 
        :class="[
            'inline-block rounded-lg p-2 cursor-pointer',
            backgroundColor ? backgroundColor : 'bg-green-500',
            hoverColor ? hoverColor : 'hover:bg-red-500',
            textColor ? textColor : ''
        ]"
    >
        <div class="flex flex-row">
            <p class="font-bold">{{ label }}</p>
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    label: string,
    backgroundColor?: string,
    hoverColor?: string,
    textColor?: string,
}>()
</script>