<template>
    <div class="w-full flex flex-col gap-2">
        <div class="w-full flex flex-row gap-2">
            <div class="inline-block rounded-xl bg-gray-500 hover:bg-gray-800">
                <RouterLink :to="{ name: 'AddCategory' }">
                    <button class="py-1 px-2 text-white">Dodaj Kategoriju</button>
                </RouterLink>
            </div>
            <div class="inline-block rounded-xl bg-gray-500 hover:bg-gray-800">
                <RouterLink :to="{ name: 'Categorys' }">
                    <button class="py-1 px-2 text-white">Kategorije</button>
                </RouterLink>
            </div>
        </div>
        <div class="w-full overflow-y-scroll scrollbar-hide" :style="{height: componentHeight + 'px'}">
            <RouterView name="interface"></RouterView>
        </div>
    </div> 
</template>

<script setup lang="ts">
import { useScreenStore } from '@/stores/ScreenStore'
import { computed } from 'vue'

const screenStore = useScreenStore()

const componentHeight = computed(() => {
    return screenStore.screenHeight - 96
})
</script>

