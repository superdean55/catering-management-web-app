<template>
    <div class="grid grid-cols-3 gap-2 w-full">
        <div class="col-span-3">
            <div class="flex flex-row gap-2">
                <div class="inline-block rounded-xl bg-gray-500 hover:bg-gray-800">
                    <RouterLink :to="{ name: 'SuppliesPreview' }">
                        <button class="py-1 px-2 text-white">Trenutno stanje</button>
                    </RouterLink>
                </div>
                <div class="inline-block rounded-xl bg-gray-500 hover:bg-gray-800">
                    <RouterLink :to="{ name: 'SuppliesList' }">
                        <button class="py-1 px-2 text-white">Lista svih stanja</button>
                    </RouterLink>
                </div>
            </div>
        </div>
        <div class="col-span-3 flex flex-col gap-2">
            <RouterView name="supplies"></RouterView>
        </div>
    </div> 
</template>

<script setup lang="ts">


</script>