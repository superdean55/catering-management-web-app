<template>
    
    
        <div class="w-full">
            <nav class="w-full m-2 fixed">
                <ul class="flex flex-row gap-2 w-full">
                    <li class="inline-block rounded-xl bg-gray-500 hover:bg-gray-800">
                        <RouterLink :to="{ name: 'AddNewEmployeeView' }">
                            <button class="py-1 px-2 text-white">Dodaj Zaposlenika</button>
                        </RouterLink>
                    </li>
                    <li class="inline-block rounded-xl bg-gray-500 hover:bg-gray-800">
                        <RouterLink :to="{ name: 'UpdateRoleView' }">
                            <button class="py-1 px-2 text-white">Ažuriraj ulogu</button>
                        </RouterLink>
                    </li>
                </ul>
            </nav>
            <div class="h-12"></div>
            <RouterView name="interface" class="w-full px-2 overflow-y-scroll scrollbar-hide" :style="{height: componentHeight + 'px'}"></RouterView>
        </div>
  
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/UserStore'

const userStore = useUserStore()
userStore.getUsers()
import { useScreenStore } from '@/stores/ScreenStore'
import { computed } from 'vue'

const screenStore = useScreenStore()

const componentHeight = computed(() => {
    return screenStore.screenHeight - 96
})
</script>
