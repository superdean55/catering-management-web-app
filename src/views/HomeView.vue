<template>
  <main class="w-full h-screen bg-slate-300 p-0 overflow-x-scroll">
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
    <RestaurantLayout>
      <template v-for="table in tableStore.tables" :key="table.id" v-slot:[table.id]>
        <TableCard :name="table.name" :shape="table.shape"></TableCard>
      </template> 
    </RestaurantLayout>
    
    
  </main>
</template>

<script setup lang="ts">
import TableCard from '@/components/restaurantTables/TableCard.vue'
import RestaurantLayout from '../components/restaurantLayout/RestaurantLayout.vue'
import { useTableStore } from '@/stores/TableStore'
import PriceListView from './PriceListView.vue'
import RoundedCard from '@/components/cards/RoundedCard.vue'

const tableStore = useTableStore()

</script>

<style scoped>

</style>