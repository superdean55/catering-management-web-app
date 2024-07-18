<template>
    <main class="w-full min-h-screen bg-slate-300 p-0">
    <div class="h-10"></div>
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
            <div class="h-20"></div>
            <RouterView name="interface" class="w-full"></RouterView>
        </div>
  </main>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/UserStore'

const userStore = useUserStore()
userStore.getUsers()
</script>
