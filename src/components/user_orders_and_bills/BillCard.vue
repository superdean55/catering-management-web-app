<template>
    <div class="w-full flex flex-col gap-2 font-merienda p-2 bg-gray-200 rounded-lg">
        <div class="w-full grid grid-cols-2 gap-2 items-center">
            <OneLabelAndDataTagInRow label="Datum:" :data="billRef.Date"></OneLabelAndDataTagInRow>
            <OneLabelAndDataTagInRow label="Vrijem:" :data="billRef.Time"></OneLabelAndDataTagInRow>
            
        </div>
        <div class="w-full grid grid-cols-3 gap-2 items-center">
            <OneLabelAndDataTagInRow label="Br.Rč:" :data="billRef.number.toString()+  ' ' + billRef.paydeskName"></OneLabelAndDataTagInRow>
            <OneLabelAndDataTagInRow label="Iznos:" :data="billRef.totalCash.toString() + ' €'"></OneLabelAndDataTagInRow>
            <OneLabelAndDataTagInRow label="Stol:" :data="tableName"></OneLabelAndDataTagInRow>
        </div>
    </div>
</template>

<script setup lang="ts">
import OneLabelAndDataTagInRow from '../dataTags/OneLabelAndDataTagInRow.vue'
import { computed, ref, watch } from 'vue'
import { useTableStore } from '@/stores/TableStore'
import type { Bill } from '@/types/Bill'

const props = defineProps<{
   bill: Bill
}>()

const tableStore = useTableStore()
const billRef = ref<Bill>(props.bill)
watch(() => props.bill, (newBill) => {
    billRef.value = newBill
})

const tableName = computed(() => {
    return tableStore.getTableById(billRef.value.tableId)?.name || ''
})
</script>
