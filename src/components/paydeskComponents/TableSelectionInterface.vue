<template>
    <div class="w-full font-merienda">
        <div class="w-full flex flex-col gap-2">
            
            <div class="flex felx-row items-center">
                <p class="font-bold truncate ">Držite</p>
                <span class="material-symbols-outlined text-orange-600 text-lg">shift</span>
                <p class="font-bold truncate ">(shift) za horizontalno skrolanje</p>
            </div>
            <div class="flex flex-row gap-2 rounded-xl p-2  overflow-hidden overflow-x-scroll scrollbar-hide horizontal-scroll bg-gray-200">
                <div
                    v-for="table in tableStore.tables" :key="table.id"
                    class="w-20 h-20 cursor-pointer"
                    @click="onTableClicked(table)"
                >
                    <TableCard
                        :shape="table.shape"
                        :name="table.name"
                        class="hover:cursor-pointer font-sans"
                    ></TableCard>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Table } from '@/types/Table';
import TableCard from '../restaurantTables/TableCard.vue'
import { useTableStore } from '@/stores/TableStore'

const tableStore = useTableStore()
const emit = defineEmits<{
    (e:'table', table: Table): void
}>()

const onTableClicked = (table: Table) => {
    emit('table', table)
}
</script>