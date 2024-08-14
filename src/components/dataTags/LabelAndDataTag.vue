<template>
    <div class="felx flex-col">
        <p class="text-xs md:text-xs lg:text-sm">{{ label }}</p>
        <p class="text-xs md:text-sm lg:text-lg font-bold truncate">{{ data }}</p>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    label: string | null,
    data: string | null
}>()
</script>
