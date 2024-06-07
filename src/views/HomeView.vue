<template>
  <main class="w-full h-screen bg-slate-300 p-0">
    <div class="h-10 w-full"></div>
    <h1>Home</h1>
    <TableCard :table-shape="TableCircleShapes.fourChairs"></TableCard>
    
  </main>
</template>

<script setup lang="ts">
import TableCard from '@/components/restaurantTables/TableCard.vue'
import { TableCircleShapes } from '@/types/TableCircleShapes'
</script>