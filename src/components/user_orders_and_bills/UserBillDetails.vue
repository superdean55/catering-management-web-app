<template>
    <div class="w-full flex flex-col gap-2 font-merienda" :style="{height: componentHeight + 'px'}">
        <div class="w-full flex flex-row justify-center">
            <p class="text-xs md:text-xl font-bold">Račun</p>
        </div>
        <div class="w-full flex flex-col gap-2 overflow-y-scroll scrollbar-hide">
            <div class="w-full grid grid-cols-2">
                <OneLabelAndDataTagInRow label="RČ.Br." :data="billRef.number.toString()"></OneLabelAndDataTagInRow>
                <OneLabelAndDataTagInRow label="Blagajna:" :data="billRef.paydeskName"></OneLabelAndDataTagInRow>
            </div>
            <div class="w-full grid grid-cols-2">
                <OneLabelAndDataTagInRow label="Datum:" :data="billRef.Date"></OneLabelAndDataTagInRow>
                <OneLabelAndDataTagInRow label="Vrijeme:" :data="billRef.Time"></OneLabelAndDataTagInRow>
            </div>
            <div class="w-full grid grid-cols-2">
                <OneLabelAndDataTagInRow label="Operator:" :data="billRef.user"></OneLabelAndDataTagInRow>
                <OneLabelAndDataTagInRow label="Stol:" :data="tableName"></OneLabelAndDataTagInRow>
            </div>
            <OneLabelAndDataTagInRow label="Račun storniran:" :data="billRef.isCancelled ? 'Da' : 'Ne'"></OneLabelAndDataTagInRow>
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
                <tr v-for="item in bill.billItems" :key="item.id">
                    <td class="border border-gray-300 p-2"><p class="text-xs lg:text-sm">{{ item.productName }}</p></td>
                    <td class="border border-gray-300 p-2"><p class="text-xs lg:text-sm">{{ item.quantity }}</p></td>
                    <td class="border border-gray-300 p-2"><p class="text-xs lg:text-sm">{{ item.price.toFixed(2) + ' €' }}</p></td>
                    <td class="border border-gray-300 p-2"><p class="text-xs lg:text-sm">{{ (item.price * item.quantity).toFixed(2) + ' €' }}</p></td>
                </tr>
                </tbody>
            </table>
            <div class="font-bold flex flex-row text-xs md.text-sm lg:text-lg justify-end"><strong>Ukupno:&nbsp;</strong> {{ bill.totalCash.toFixed(2) + ' €' }}</div>
            <div class="mb-2 text-xs"><strong>JIR:</strong> {{ bill.JIR }}</div>
            <div class="mb-2 text-xs"><strong>ZKI:</strong> {{ bill.ZKI }}</div>
        </div>
    </div>

</template>

<script setup lang="ts">
import type { Bill } from '@/types/Bill'
import OneLabelAndDataTagInRow from '../dataTags/OneLabelAndDataTagInRow.vue'
import { computed, ref, watch } from 'vue'
import { useTableStore } from '@/stores/TableStore'
import { useScreenStore } from '@/stores/ScreenStore';

const props = defineProps<{
    bill: Bill,
    height: number
}>()

const screenStore = useScreenStore()
const tableStore = useTableStore()
const billRef = ref<Bill>(props.bill)
const height = ref<number>(props.height)

watch(() => props.height, (newHeight) => {
    height.value = newHeight
})
watch(() => props.bill, (newBill) => {
    billRef.value = newBill
})
const componentHeight = computed(() => {
    if(screenStore.isSmallScreen){
        return height.value - 88
    }else{
        return height.value - 32
    }
})
const tableName = computed(() => {
    return tableStore.getTableById(billRef.value.tableId)?.name || ''
})
</script>
