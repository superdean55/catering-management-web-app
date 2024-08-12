<template>
    <div  v-if="selected"
        @click="onButtonClicked" 
        class="inline-block rounded-lg p-2 cursor-pointer bg-gray-300"
    >
        <div class="flex flex-row">
            <p class="font-bold text-orange-700">{{ label }}</p>
            <slot></slot>
        </div>
    </div>
    <div  v-else
        @click="onButtonClicked" 
        class="inline-block rounded-lg p-2 cursor-pointer bg-gray-800"
    >
        <div class="flex flex-row">
            <p class="font-bold text-orange-700">{{ label }}</p>
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    label: string,
    selected: boolean
}>()
const emit = defineEmits<{
    (e:'confirm'): void
}>()

const onButtonClicked = () => {
    emit('confirm')
}
</script>