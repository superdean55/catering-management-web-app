<template>
    <div class="felx flex-col w-full">
        <div>
            <label class="uppercase my-2 text-xs text-gray-600">{{ label }}</label>
        </div>
        <div>
            <select v-model="level" @change="$emit('selectedValue', level)" class="iniline-block bg-inherit">
                <option v-for="value in Object.values(CategoryLevel)" :key="value" :value="value" >
                    {{ value }}
                </option>
            </select>
        </div>
        
    </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { CategoryLevel } from '@/types/CategoryLevel.ts'
import { ref } from 'vue'

defineProps<{
  label: string,
}>();

const level = ref<string>(CategoryLevel.levelZero)
</script>
