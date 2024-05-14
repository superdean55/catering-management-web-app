<template>
    <div class="w-full pl-3">
        <LabelAndDataTag :label="label" :data="data"></LabelAndDataTag>
    </div>
</template>

<script setup lang="ts">
import LabelAndDataTag from '@/components/dataTags/LabelAndDataTag.vue'
const props = defineProps<{
    label: string | null,
    data: string | null
}>()
</script>
