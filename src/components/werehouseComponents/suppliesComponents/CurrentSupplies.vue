<template>
    <div class="max-w-4xl">
        
        <div v-if="lastSupply">
            <SuppliesPreview
             title="Zalihe- trenutnno stanje"
             :supply="lastSupply"
            >
            </SuppliesPreview>
        </div>
        <div v-else class="flex flex-row justify-center">
            <p class="font-bold">Trenutno ne postoje nikakve zalihe</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import SuppliesPreview from './SuppliesPreview.vue'
import { useSuppliesStore } from '@/stores/SuppliesStore'
import { computed } from 'vue'

const suppliesStore = useSuppliesStore()
const lastSupply = computed(() => suppliesStore.lastSupply)
</script>
