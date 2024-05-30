<template>
    <div class="grid grid-cols-3 gap-2 w-full">
        <div class="col-span-3">
            <div class="flex flex-row gap-2">
                <div class="inline-block rounded-xl bg-gray-500 hover:bg-gray-800">
                    <RouterLink :to="{ name: 'AddReceipt' }">
                        <button class="py-1 px-2 text-white">Nova Primka</button>
                    </RouterLink>
                </div>
                <div class="inline-block rounded-xl bg-gray-500 hover:bg-gray-800">
                    <RouterLink :to="{ name: 'ReceiptList' }">
                        <button class="py-1 px-2 text-white">Primke</button>
                    </RouterLink>
                </div>
            </div>
        </div>
        <div class="col-span-3 flex flex-col gap-2">
            <RouterView name="receipt"></RouterView>
        </div>
    </div> 
</template>

<script setup lang="ts">
import ConfirmButton from '@/components/buttons/ConfirmButton.vue';

</script>

