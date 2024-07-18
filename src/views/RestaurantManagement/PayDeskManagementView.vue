<template>
    <div class="w-full flex flex-col">
        <div class="w-full p-2 flex flex-row gap-2 justify-start">
            <div class="inline-block rounded-xl bg-gray-500 hover:bg-gray-800">
                <RouterLink :to="{ name: 'PayDeskList' }">
                    <button class="py-1 px-2 text-white">Popis blagajni</button>
                </RouterLink>
            </div>
            <div class="inline-block rounded-xl bg-gray-500 hover:bg-gray-800">
                <RouterLink :to="{ name: 'AddPayDesk' }">
                    <button class="py-1 px-2 text-white">Kreiraj blagajnu</button>
                </RouterLink>
            </div>
        </div>
        <div class="w-full pl-2">
            <RouterView name="interface"></RouterView>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>
