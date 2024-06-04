<template>
    <div class="max-w-4xl">
        
        <div v-if="reversedSupplies">
            <div class="flex flex-col gap-2">
                <div v-for="(supply, index) in reversedSupplies" :key="supply.id" class="flex flex-col gap-2">
                    <SuppliesPreview :class="index === 0 ? 'bg-green-300' : 'bg-red-300'"
                        v-bind="index === 0 ? { title: 'Zalihe - trenutno stanje' } : {}"
                        :supply="supply"
                    >
                    </SuppliesPreview>
                    <div v-if="(reversedSupplies.length -1) != index" class="w-full flex flex-row justify-center">
                        <span class="material-symbols-outlined text-4xl">
                            arrow_downward
                        </span>
                    </div>
                </div>
            </div>
            
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
const reversedSupplies = computed(() => suppliesStore.supplies.slice().reverse())
</script>