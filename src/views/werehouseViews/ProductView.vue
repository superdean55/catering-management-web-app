<template>
    <div class="grid grid-cols-1 gap-2 w-full">
        <div class="col-span-1">
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
        </div>
        <div class="col-span-1 flex flex-col gap-2">
            <RouterView name="product"></RouterView>
        </div>
    </div> 
</template>

<script setup>

</script>
