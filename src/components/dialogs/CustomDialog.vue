<template>
    <div v-if="isVisible" class="fixed inset-0 flex flex-col items-center overflow-y-scroll justify-center bg-black bg-opacity-70 z-40" @click="handleOverlayClick">
      <div class="w-full flex flex-row justify-center">
        <div class="p-4 rounded-xl shadow-lg" @click.stop :class="backgroundColor == null ? 'bg-gray-500' : backgroundColor">
          <slot></slot>
        </div>
      </div>
    </div>
</template>
  
<script lang="ts" setup>
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps<{
  showDialog: boolean,
  backgroundColor?: string
}>()

const emit = defineEmits<{
  (e:'update', showDialog: boolean):void
}>()
const isVisible = ref(props.showDialog)

const handleOverlayClick = () => {
    isVisible.value = false
    emit('update', false)
}

watch(() => props.showDialog, (newValue) => {
    isVisible.value = newValue
})
</script>