<template>
    <div class="w-full font-merienda">
        <div class="w-full flex flex-col gap-2" :style="{ height: screenStore.isSmallScreen ? componentHeight + 'px' : 'auto'}">
            
            <div class="flex felx-row items-center" v-if="!screenStore.isSmallScreen">
                <p class="font-bold truncate ">Držite</p>
                <span class="material-symbols-outlined text-orange-600 text-lg">shift</span>
                <p class="font-bold truncate ">(shift) za horizontalno skrolanje</p>
            </div>
            <div 
                :class="screenStore.isSmallScreen ? 'grid gap-2 overflow-y-scroll' + tableColumns : 'flex flex-row gap-2 overflow-x-scroll'"
                class="rounded-xl p-2 bg-gray-200 scrollbar-hide overflow-hidden"
                :style="screenStore.isSmallScreen ? '' : ''"
            >
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
import { useScreenStore } from '@/stores/ScreenStore';
import { computed } from 'vue';

const tableStore = useTableStore()
const screenStore = useScreenStore()
const emit = defineEmits<{
    (e:'table', table: Table): void
}>()

const onTableClicked = (table: Table) => {
    emit('table', table)
}

const componentHeight = computed(() => {
    return screenStore.screenHeight -192
})

const tableColumns = computed(() => {
    if(screenStore.screenWidth > 375 && screenStore.screenWidth <= 455){
        return ' grid-cols-4 '
    }
    else if(screenStore.screenWidth > 455 && screenStore.screenWidth <= 535){
        return ' grid-cols-5 '
    }
    else if(screenStore.screenWidth > 535 && screenStore.screenWidth <= 615){
        return ' grid-cols-6 '
    }
    else if(screenStore.screenWidth > 615 && screenStore.screenWidth <= 695){
        return ' grid-cols-7 '
    }
    else if(screenStore.screenWidth > 695 && screenStore.screenWidth <= 775){
        return ' grid-cols-8 '
    }
    return ' grid-cols-3 '
})
</script>