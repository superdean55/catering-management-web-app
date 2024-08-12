<template>
    <div class="w-full h-full font-merienda flex flex-col gap-2">
        <div class="flex flex-row justify-center">
                <p class="text-xs lg:text-xl">Narudžbe</p>
        </div>
        <div 
            class="w-full h-full flex flex-col gap-2 overflow-y-scroll scrollbar-hide"
        >
            
            <div 
            class="flex flex-row p-2 rounded-lg cursor-pointer bg-gray-200"
            v-for="order in orderStore.orders" :key="order.id"
            @click="onOrderClicked(order)"
            >
                <div class="w-full flex flex-col">
                    <TwoLabelAndDataTagInRow 
                        first-label="Kod narudžbe:" 
                        :first-data="order.code"
                        second-label="Datum:"
                        :second-data="order.date"
                    ></TwoLabelAndDataTagInRow>
                    <TwoLabelAndDataTagInRow 
                        first-label="Stol:" 
                        :first-data="getTableName(order.tableId)"
                        second-label="Vrijem:"
                        :second-data="order.time"
                    ></TwoLabelAndDataTagInRow>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { useOrderStore } from '@/stores/OrderStore'
import TwoLabelAndDataTagInRow from '../dataTags/TwoLabelAndDataTagInRow.vue'
import { useTableStore } from '@/stores/TableStore'
import type { Order } from '@/types/Order';

const orderStore = useOrderStore()
const tableStore = useTableStore()

const emit = defineEmits<{
    (e:'order', order: Order): void
}>()
const getTableName = (tableId: string): string => {
    const tableName = tableStore.getTableById(tableId)?.name
    if(tableName){
        return tableName
    }
    return 'error'
}
const onOrderClicked = (order: Order) => {
    emit('order', order)
}
</script>
