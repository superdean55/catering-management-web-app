<template>
    <div class="flex flex-row justify-around">
        <div class="w-3/6 pl-3">
            <LabelAndDataTag :label="firstLabel" :data="firstData"></LabelAndDataTag>
        </div>
        <div class="flex flex-col justify-center">
            <div class="h-10 w-px bg-black"></div>
        </div>
        <div class="w-3/6 pl-3">
            <LabelAndDataTag :label="secondLabel" :data="secondData"></LabelAndDataTag>
        </div>
    </div>
</template>

<script setup lang="ts">
import LabelAndDataTag from '@/components/dataTags/LabelAndDataTag.vue'
defineProps<{
    firstLabel: string,
    firstData: string,
    secondLabel: string,
    secondData: string
}>()
</script>
