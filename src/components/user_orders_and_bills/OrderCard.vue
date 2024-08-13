<template>
    <div class="w-full flex flex-col gap-2 font-merienda p-2 bg-gray-200 rounded-lg">
        <div class="w-full grid grid-cols-2 gap-2 items-center">
            <OneLabelAndDataTagInRow label="Datum:" :data="orderRef.date"></OneLabelAndDataTagInRow>
            <OneLabelAndDataTagInRow label="Vrijem:" :data="orderRef.time"></OneLabelAndDataTagInRow>
            
        </div>
        <div class="w-full grid grid-cols-3 gap-2 items-center">
            <OneLabelAndDataTagInRow label="Kod:" :data="orderRef.code"></OneLabelAndDataTagInRow>
            <OneLabelAndDataTagInRow label="Stol:" :data="tableName"></OneLabelAndDataTagInRow>
            <div>
                <OrderProgressBar :order="orderRef"></OrderProgressBar>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Order } from '@/types/Order'
import OneLabelAndDataTagInRow from '../dataTags/OneLabelAndDataTagInRow.vue'
import OrderProgressBar from './OrderProgressBar.vue'
import { computed, ref, watch } from 'vue'
import { useTableStore } from '@/stores/TableStore'

const props = defineProps<{
    order: Order
}>()

const tableStore = useTableStore()
const orderRef = ref<Order>(props.order)
watch(() => props.order, (newOrder) => {
    orderRef.value = newOrder
})

const tableName = computed(() => {
    return tableStore.getTableById(orderRef.value.tableId)?.name || ''
})
</script>
