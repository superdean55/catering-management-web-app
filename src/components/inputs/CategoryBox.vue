<template>
    <div class="flex flex-col w-full">
        <div>
            <label class="uppercase my-2 text-xs text-gray-600">{{ label }}</label>
        </div>
        <div>
            <select :disabled="disabled" v-model="option" @change="$emit('selectedValue', option)" class="py-1 iniline-block bg-inherit border-b border-slate-400 truncate">
                <option v-for="value in Object.values(object)" :key="value.id" :value="value.id" class="truncate" >
                    {{ value.name }}
                </option>
            </select>
        </div>
        <div v-if="error?.length">
            <p class="text-red-600">{{ error }}</p>
        </div>
        
    </div>
</template>

<script setup lang="ts">
import { ref,defineProps, watch } from 'vue'

const props = defineProps<{
  label: string,
  error?: string,
  option: string,
  object: Object,
  disabled?: boolean
}>()
const option = ref<string>('')
option.value = props.option

watch(() => props.option, (newOption, oldOption) => {
  option.value = newOption
})
</script>
