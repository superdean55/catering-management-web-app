<template>
    <div class="felx flex-col w-full">
        <div>
            <label class="inline-block my-1 text-xs text-gray-600">{{ label }}</label>
        </div>
        <div>
            <select :disabled="disabled" v-model="option" @change="$emit('selectedValue', option)" class="iniline-block bg-inherit border-b border-slate-400">
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
  option: string,
  object: Object,
  disabled?: boolean
}>();

const option = ref<string>('')
option.value = props.option

watch(() => props.option, (newOption, oldOption) => {
  option.value = newOption
})

</script>
