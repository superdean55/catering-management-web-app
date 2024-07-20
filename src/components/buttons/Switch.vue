<template>
<div @click="change" class="flex items-center cursor-pointer">
    <label :class="{'text-gray-500': !isOn, 'text-blue-500': isOn}" class="mr-2">{{ label }}</label>
    <div :class="{'bg-gray-300': !isOn, 'bg-blue-500': isOn}" class="relative inline-block w-12 h-6 rounded-full transition-colors duration-300 ease-in-out">
        <span :class="{'translate-x-0': !isOn, 'translate-x-6': isOn}" class="absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300 ease-in-out"></span>
    </div>
</div>
</template>

<script setup lang="ts">

import { ref, watch } from 'vue'

const props = defineProps<{
    label: string
    value: boolean
}>()

const emit = defineEmits<{
    (e:'update', value: boolean): void
}>()

const isOn = ref<boolean>(props.value)

watch(() => props.value, (newValue) => {
    isOn.value = newValue
})

const change = () => {
    isOn.value = !isOn.value
    emit('update', isOn.value)
}
</script>
