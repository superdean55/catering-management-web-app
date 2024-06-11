<template>
  <main class="w-full h-screen bg-slate-300 p-0 overflow-x-scroll">
    <div class="h-10 w-full"></div>
    <h1>Home</h1>
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

const tableStore = useTableStore()

</script>

<style scoped>

</style>