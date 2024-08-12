<template>
    <div class="felx flex-col">
        <p class="text-xs lg:text-sm">{{ label }}</p>
        <p class="text-sm lg:text-xl font-bold truncate">{{ data }}</p>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    label: string | null,
    data: string | null
}>()
</script>
