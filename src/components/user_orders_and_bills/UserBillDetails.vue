<template>
    <div class="w-full p-2 flex flex-col gap-2 font-merienda">
        <div class="w-full flex flex-row justify-center">
            <p class="text-xs md:text-xl font-bold mb-4">Račun</p>
        </div>
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
        <OneLabelAndDataTagInRow label="Račun storniran:" :data="billRef.isCancelled ? 'da' : 'ne'"></OneLabelAndDataTagInRow>
        <p class="text-xs md:text-lg">Proizvodi</p>
        <table class="w-full mb-4 border-collapse">
            <thead>
            <tr class="bg-gray-200">
                <th class="border border-gray-300 p-2">Proizvod</th>
                <th class="border border-gray-300 p-2">Količina</th>
                <th class="border border-gray-300 p-2">Cijena</th>
                <th class="border border-gray-300 p-2">Iznos</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in bill.billItems" :key="item.id">
                <td class="border border-gray-300 p-2">{{ item.productName }}</td>
                <td class="border border-gray-300 p-2">{{ item.quantity }}</td>
                <td class="border border-gray-300 p-2">{{ item.price.toFixed(2) + ' €' }}</td>
                <td class="border border-gray-300 p-2">{{ (item.price * item.quantity).toFixed(2) + ' €' }}</td>
            </tr>
            </tbody>
        </table>

        <div class="font-bold flex flex-row justify-end"><strong>Ukupno:&nbsp;</strong> {{ bill.totalCash.toFixed(2) + ' €' }}</div>
        <div class="mb-2 text-xs"><strong>JIR:</strong> {{ bill.JIR }}</div>
        <div class="mb-2 text-xs"><strong>ZKI:</strong> {{ bill.ZKI }}</div>
    </div>

</template>

<script setup lang="ts">
import type { Bill } from '@/types/Bill'
import OneLabelAndDataTagInRow from '../dataTags/OneLabelAndDataTagInRow.vue'
import { computed, ref } from 'vue';
import { useTableStore } from '@/stores/TableStore'

const props = defineProps<{
    bill: Bill
}>()

const tableStore = useTableStore()
const billRef = ref<Bill>(props.bill)
const tableName = computed(() => {
    return tableStore.getTableById(billRef.value.tableId)?.name || ''
})
</script>
