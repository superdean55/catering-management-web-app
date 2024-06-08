<template>
  <main class="w-full h-screen bg-slate-300 p-0 overflow-x-scroll">
    <div class="h-10 w-full"></div>
    <h1>Home</h1>
    <RestaurantLayout>
      <template v-for="table in tables" :key="table.id" v-slot:[table.id]>
        <TableCard :name="table.name" :shape="table.tableShape"></TableCard>
      </template> 
    </RestaurantLayout>
    
    
  </main>
</template>

<script setup lang="ts">
import { TableCircleShapes } from '@/types/TableCircleShapes'
import TableCard from '@/components/restaurantTables/TableCard.vue';
import RestaurantLayout from '../components/restaurantLayout/RestaurantLayout.vue'
const tables = [
  {
    id: 'table-1',
    name: 'G-1',
    tableShape: TableCircleShapes.fourChairs
  },
  {
    id: 'table-2',
    name: 'G-2',
    tableShape: TableCircleShapes.fourChairs
  },
  {
    id: 'table-3',
    name: 'G-3',
    tableShape: TableCircleShapes.threeCharis
  },
  {
    id: 'table-4',
    name: 'G-4',
    tableShape: TableCircleShapes.threeCharis
  }
]
</script>

<style scoped>

</style>