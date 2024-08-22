<template>
    <div class="w-full flex flex-col">
        <div class="w-full p-2 flex flex-row gap-2 justify-start">
            <div class="inline-block rounded-xl bg-gray-500 hover:bg-gray-800">
                <RouterLink :to="{ name: 'PayDeskDashboard' }">
                    <button class="py-1 px-2 text-white">Upravljačka ploča</button>
                </RouterLink>
            </div>
            <div class="inline-block rounded-xl bg-gray-500 hover:bg-gray-800">
                <RouterLink :to="{ name: 'AddPayDesk' }">
                    <button class="py-1 px-2 text-white">Kreiraj blagajnu</button>
                </RouterLink>
            </div>
        </div>
        <div class="w-full px-2 overflow-y-scroll scrollbar-hide" :style="{ height: componentHeight + 'px'}">
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
