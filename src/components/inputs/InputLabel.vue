<template>
    <div class="w-full">
        <label class="inline-block uppercase my-2 text-xs text-gray-600">{{ name }}</label>
        <input  v-if="type"
            class="block w-full py-1 px-2 box-border border-b border-slate-300 bg-inherit"
            :type="type"
            :value="value"
            @input="onValueChange"
            :required="required"
        >
        <div v-if="error?.length">
            <p class="text-red-600 text-xs">{{ error }}</p>
        </div>
        
    </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from "vue";

defineProps<{
  value: string,
  name: string,
  type: string,
  error?: string,
  required?: boolean
}>()

const emit = defineEmits<{
    (e:'update', value: string): void
}>()
const onValueChange = (e: any) => {
    emit('update', e.target.value as string)
}
</script>
