<template>
    <div class="w-full flex flex-col gap-2 font-merienda" :style="{height: componentHeight + 'px'}">
        <div class="w-full flex flex-row justify-center">
            <p class="text-xs md:text-xl font-bold">Narudžba</p>
        </div>
        <div class="w-full flex flex-col gap-2 overflow-y-scroll scrollbar-hide">
            <div class="w-full grid grid-cols-2">
                <OneLabelAndDataTagInRow label="Kod" :data="orderRef.code"></OneLabelAndDataTagInRow>
                <OneLabelAndDataTagInRow label="Blagajna:" :data="payDeskName"></OneLabelAndDataTagInRow>
            </div>
            <div class="w-full grid grid-cols-2">
                <OneLabelAndDataTagInRow label="Datum:" :data="orderRef.date"></OneLabelAndDataTagInRow>
                <OneLabelAndDataTagInRow label="Vrijeme:" :data="orderRef.time"></OneLabelAndDataTagInRow>
            </div>
            <div class="w-full grid grid-cols-2">
                <OneLabelAndDataTagInRow label="Stol:" :data="tableName"></OneLabelAndDataTagInRow>
            </div>
            <div class="w-full grid grid-cols-2">
                <OneLabelAndDataTagInRow label="Narudžba zaprimljena:" :data="orderRef.isApproved ? 'Da' : 'Ne'"></OneLabelAndDataTagInRow>
                <OneLabelAndDataTagInRow label="Narudžba izvršena:" :data="orderRef.isCompleted ? 'Da' : 'Ne'"></OneLabelAndDataTagInRow>
            </div>
            
            <p class="text-xs md:text-sm lg:text-lg font-bold">Proizvodi:</p>
            <table class=" mx-2 border-collapse">
                <thead>
                <tr class="bg-gray-200">
                    <th class="border border-gray-300 p-2"><p class="text-xs lg:text-sm font-bold">Proizvod</p></th>
                    <th class="border border-gray-300 p-2"><p class="text-xs lg:text-sm font-bold">Količina</p></th>
                    <th class="border border-gray-300 p-2"><p class="text-xs lg:text-sm font-bold">Cijena</p></th>
                    <th class="border border-gray-300 p-2"><p class="text-xs lg:text-sm font-bold">Iznos</p></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in orderRef.billItems" :key="item.id">
                    <td class="border border-gray-300 p-2"><p class="text-xs lg:text-sm">{{ item.productName }}</p></td>
                    <td class="border border-gray-300 p-2"><p class="text-xs lg:text-sm">{{ item.quantity }}</p></td>
                    <td class="border border-gray-300 p-2"><p class="text-xs lg:text-sm">{{ item.price.toFixed(2) + ' €' }}</p></td>
                    <td class="border border-gray-300 p-2"><p class="text-xs lg:text-sm">{{ (item.price * item.quantity).toFixed(2) + ' €' }}</p></td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>

</template>

<script setup lang="ts">
import OneLabelAndDataTagInRow from '../dataTags/OneLabelAndDataTagInRow.vue'
import { computed, ref, watch } from 'vue'
import { useTableStore } from '@/stores/TableStore'
import type { Order } from '@/types/Order'
import { usePayDeskStore } from '@/stores/payDeskStore'
import { useScreenStore } from '@/stores/ScreenStore'

const props = defineProps<{
    order: Order,
    height: number
}>()
const screenStore = useScreenStore()
const tableStore = useTableStore()
const payDeskStore = usePayDeskStore()
const orderRef = ref<Order>(props.order)
const height = ref<number>(props.height)

watch(() => props.height, (newHeight) => {
    height.value = newHeight
})
watch(() => props.order, (newOrder) => {
    orderRef.value = newOrder
})
const componentHeight = computed(() => {
    if(screenStore.isSmallScreen){
        console.log('visina', height.value)
        return height.value - 104
    }else{
        return height.value - 32
    }
})
const tableName = computed(() => {
    return tableStore.getTableById(orderRef.value.tableId)?.name || ''
})
const payDeskName = computed(() => {
    return payDeskStore.getPayDeskById(orderRef.value.payDeskId)?.name || ''
})
</script>
