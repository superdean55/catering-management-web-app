<template>
    <main class="w-full min-h-screen bg-slate-300 p-0">
    <div class="h-10"></div>
        <div class="w-40 fixed">
            <div class="">
                <nav>
                    <ul>
                        <li><div class="h-1 w-full bg-black"></div></li>
                        <li class="bg-orange-700 hover:bg-orange-800 text-white">
                            <RouterLink :to="{ name: 'PayDeskDashboard' }" class="flex items-center justify-center h-10 w-full">Blagajna</RouterLink>
                        </li>
                        <li><div class="h-px w-full bg-gray-500"></div></li>
                    </ul>
                </nav>
            </div>
            
        </div>
        <div class="w-full grid grid-cols-1">
            <RouterView name="management" class="pl-40"></RouterView>
        </div>
  </main>
</template>

<script setup lang="ts">

</script>
