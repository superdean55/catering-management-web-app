<template>
    <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50" @click="handleOverlayClick">
        <div 
            class="p-4 rounded-xl shadow-lg max-w-sm flex flex-col items-center gap-4" 
            @click.stop 
            :class="backgroundColor == null ? 'bg-gray-500' : backgroundColor"
        >
            <p class="text-2xl">{{ title }}</p>
            <p>{{ message }}</p>
            <div class="w-full h-4"></div>
            <div class="w-full flex flex-row justify-between">
                <FilledButton 
                    label="Da"
                    backgroundColor="bg-red-500"
                    hoverColor="hover:bg-green-500"
                    @confirm="onConfirm"
                ></FilledButton>
                <FilledButton 
                    label="Ne"
                    @confirm="onReject"
                ></FilledButton>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import FilledButton from '../buttons/FilledButton.vue'

const props = defineProps<{
    title?: string,
    message: string,
    showDialog: boolean,
    backgroundColor?: string
}>()

const emit = defineEmits<{
  (e:'confirm'): void,
  (e:'reject'): void
}>()
const isVisible = ref(props.showDialog)

const handleOverlayClick = () => {
    isVisible.value = false
    emit('reject')
}

watch(() => props.showDialog, (newValue) => {
    isVisible.value = newValue
})

const onConfirm = () => {
    emit('confirm')
}
const onReject = () => {
    emit('reject')
    isVisible.value = false
}
</script>