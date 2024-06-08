<template>
    <div class="w-full">
        <label class="inline-block my-1 text-xs text-gray-600">{{ label }}</label>
        <input  
            v-if="type"
            class="block w-full py-0 px-2 box-border border rounded-md border-slate-400 bg-inherit"
            :type="type"
            :value="value"
            @input="onValueChange"
            :disabled="disabled"
            >
        <div v-if="error?.length">
            <p class="text-red-600">{{ error }}</p>
        </div>
        
    </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const emit = defineEmits(['update'])
defineProps<{
  value: string,
  label: string,
  type: string,
  error?: string
  disabled?: boolean
}>()
const onValueChange = (e: any) => {
    emit('update', e.target.value as string)
}

</script>
