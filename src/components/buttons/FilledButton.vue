<template>
    <div  
        v-if="!disabled"
        @click="onButtonClicked" 
        :class="[
            'inline-block rounded-lg p-2 cursor-pointer',
            backgroundColor ? backgroundColor : 'bg-green-500',
            hoverColor ? hoverColor : 'hover:bg-red-500',
            textColor ? textColor : '',
            
        ]"
    >
        <div class="flex flex-row">
            <p class="font-bold">{{ label }}</p>
            <slot></slot>
        </div>
    </div>
    <div  
        v-else
        :class="[
            'inline-block rounded-lg p-2 bg-gray-400',
        ]"
    >
        <div class="flex flex-row">
            <p class="font-bold">{{ label }}</p>
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    label: string,
    backgroundColor?: string,
    hoverColor?: string,
    textColor?: string,
    disabled?: boolean
}>()
const emit = defineEmits<{
    (e:'confirm'): void
}>()

const onButtonClicked = () => {
    emit('confirm')
}
</script>