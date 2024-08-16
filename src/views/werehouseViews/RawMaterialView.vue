<template>
    <div class="w-full max-w-4xl" :style="{height: componentHeight + 'px'}">
        <div class="grid gap-2 w-full" :class="screenStore.isSmallScreen ? 'grid-cols-1' : 'grid-cols-3'">
            <div class="flex flex-col gap-2" :class="screenStore.isSmallScreen ? 'col-span-1' : 'col-span-2'">
                <RouterView name="interface"></RouterView>
            </div>
            <div :class="screenStore.isSmallScreen ? 'col-span-1' : 'col-span-1'">
                <RouterView name="list"></RouterView>
            </div>
        </div>
    </div> 
</template>

<script setup lang="ts">
import { useScreenStore } from '@/stores/ScreenStore'
import { computed } from 'vue'

const screenStore = useScreenStore()

const componentHeight = computed(() => {
    return screenStore.screenHeight - 48
})
</script>

