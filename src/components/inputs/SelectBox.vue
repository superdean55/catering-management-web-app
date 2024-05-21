<template>
    <div class="felx flex-col w-full">
        <div>
            <label class=" my-2 text-xs text-gray-600">{{ label }}</label>
        </div>
        <div>
            <select v-model="option" @change="$emit('selectedValue', option)" class="iniline-block bg-inherit border-b border-slate-400">
                <option v-for="value in Object.values(object)" :key="value" :value="value">
                    {{ value }}
                </option>
            </select>
        </div>
        <div v-if="error?.length">
            <p class="text-red-600">{{ error }}</p>
        </div>
        
    </div>
</template>

<script setup lang="ts">

import { ref, watch, defineProps } from 'vue'

const props = defineProps<{
  label: string,
  error?: string,
  option: string
  object: Object
}>();

const option = ref<string>('')
option.value = props.option

watch(() => props.option, (newOption, oldOption) => {
  option.value = newOption
});

</script>
