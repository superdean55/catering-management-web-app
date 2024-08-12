<template>
    <main class="w-full min-h-screen bg-slate-300 p-0">
        <div class="w-full h-10"></div>
        <div class="w-full p-2 flex flex-row justify-start gap-2">
            <div class="inline-block rounded-xl bg-gray-500 hover:bg-gray-800">
                <RouterLink :to="{ name: 'BillInterfaceView' }">
                    <button class="py-1 px-2 text-white">Blagajna</button>
                </RouterLink>
            </div>
            <div class="inline-block rounded-xl bg-gray-500 hover:bg-gray-800">
                <RouterLink :to="{ name: 'BillListView' }">
                    <button class="py-1 px-2 text-white">Računi</button>
                </RouterLink>
            </div>
            <div class="inline-block rounded-xl bg-gray-500 hover:bg-gray-800">
                <RouterLink :to="{ name: 'ConclusionList' }">
                    <button class="py-1 px-2 text-white">Zaključci</button>
                </RouterLink>
            </div>
        </div>
        <div class="w-full px-2 pb-2">
            <RouterView name="interface"></RouterView>
        </div>
    </main>
</template>

<script setup lang="ts">

</script>
