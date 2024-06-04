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
        <div class="max-w-4xl">
            <RouterView name="interface"></RouterView>
        </div>
    </div> 
</template>

<script setup lang="ts">

</script>

