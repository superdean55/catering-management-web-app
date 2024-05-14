<template>
    <div class="w-full bg-white">
        <label class="inline-block uppercase my-2 text-xs text-gray-600">{{ name }}</label>
        <input  
        class="block w-full py-1 px-2 box-border border-b border-slate-300"
        :type="type"
        :value="value"
        @input="$emit('update:value', ($event.target as HTMLInputElement).value)">
        <div v-if="error?.length">
            <p class="text-red-600">{{ error }}</p>
        </div>
        
    </div>
</template>

<script setup lang="ts">
import { onUpdated, ref, defineProps } from "vue";

defineProps<{
  value: string,
  name: string,
  type: string,
  error?: string
}>();
defineEmits(["update:value"]);

</script>
