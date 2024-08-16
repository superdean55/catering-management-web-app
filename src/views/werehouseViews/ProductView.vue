<template>
    <div class="w-full flex flex-col gap-2">
        
        <div class="flex flex-row gap-2">
            <div class="inline-block rounded-xl bg-gray-500 hover:bg-gray-800">
                <RouterLink :to="{ name: 'AddProduct' }">
                    <button class="py-1 px-2 text-white">Dodaj Proizvod</button>
                </RouterLink>
            </div>
            <div class="inline-block rounded-xl bg-gray-500 hover:bg-gray-800">
                <RouterLink :to="{ name: 'Products' }">
                    <button class="py-1 px-2 text-white">Svi Proizvodi</button>
                </RouterLink>
            </div>
        </div>
        
        <div class="w-full overflow-y-scroll scrollbar-hide" :style="{height: componentHeight + 'px'}">
            <RouterView name="product" ></RouterView>
        </div>
    </div> 
</template>

<script setup>
import { useScreenStore } from '@/stores/ScreenStore'
import { computed } from 'vue'

const screenStore = useScreenStore()

const componentHeight = computed(() => {
    return screenStore.screenHeight - 96
})
</script>
