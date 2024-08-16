<template>
  <main class="w-full h-screen bg-slate-300 p-0 overflow-x-scroll">
    <OrderProductDialog v-if="selectedTable" :showDialog="showOrderProductDialog" :table="selectedTable" @update="onOrderProductDialogUpdate"></OrderProductDialog>
    <div class="h-10 w-full"></div>
    <div class="h-10 w-full"></div>
    <div class="w-full flex flex-row justify-center">
      <div class="inline-block h-36 overflow-hidden">
        <RouterLink :to="{ name: 'PriceListView'}">
          <div class="flex flex-row justify-center p-4 bg-gray-900 font-merienda text-gray-200 rounded-lg">
                <p class="text-5xl">Cijenik</p>
          </div>
        </RouterLink>
      </div>
    </div>
    <div class="w-full flex flex-row justify-center">
      <RestaurantLayout>
        <template v-for="table in tableStore.tables" :key="table.id" v-slot:[table.id]>
          <TableCardSmall 
            v-if="screenStore.isSmallScreen"
            @click="onTableClicked(table)" 
            :name="table.name" 
            :shape="table.shape" 
            class="cursor-pointer"
            :backgroudColor="table.backgroundColor"
          ></TableCardSmall>
          <TableCard v-else
            @click="onTableClicked(table)" 
            :name="table.name" 
            :shape="table.shape" 
            class="cursor-pointer"
            :backgroudColor="table.backgroundColor"
          ></TableCard>
        </template>
      </RestaurantLayout>
    </div>
    
    
  </main>
</template>

<script setup lang="ts">
import TableCard from '@/components/restaurantTables/TableCard.vue'
import RestaurantLayout from '../components/restaurantLayout/RestaurantLayout.vue'
import { useTableStore } from '@/stores/TableStore'
import OrderProductDialog from '@/components/dialogs/OrderProductDialog.vue'
import PriceListView from './PriceListView.vue'
import RoundedCard from '@/components/cards/RoundedCard.vue'
import { ref } from 'vue'
import type { Table } from '@/types/Table'
import { useUserStore } from '@/stores/UserStore'
import TableCardSmall from '@/components/restaurantTables/TableCardSmall.vue'
import { useScreenStore } from '@/stores/ScreenStore'

const tableStore = useTableStore()
const userStore = useUserStore()
const selectedTable = ref<Table>()
const screenStore = useScreenStore()

const showOrderProductDialog = ref<boolean>(false)
const onTableClicked = (table_: Table) => {
  if(userStore.user){
  selectedTable.value = table_
  showOrderProductDialog.value = true
  }
}
const onOrderProductDialogUpdate = (showDialog: boolean) => {
  showOrderProductDialog.value = showDialog
}
</script>

<style scoped>

</style>