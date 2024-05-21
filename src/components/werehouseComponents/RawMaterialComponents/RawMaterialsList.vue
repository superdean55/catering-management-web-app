<template>
    <RoundedCard>
        <div class="flex items-center justify-center w-full mb-2">
            <p class="text-red-700">Sirovine</p>
        </div>
        <RoundedCard  class="flex flex-col gap-2 border border-gray-300">
            <RouterLink :to="{ name: 'EditRawMaterial', params: { id: material.id }}"
                v-for="material in rawMaterials" :key="material.id" 
                class="flex felx-row w-full px-2 py-1 h-11 rounded-lg bg-gray-300 hover:bg-gray-400 cursor-pointer">
                <div class="flex flex-row items-center justify-center">
                    <p class="font-bold pl-4">{{ material.name }}</p>
                </div>
            </RouterLink>
        </RoundedCard>
    </RoundedCard>
</template>

<script setup lang="ts">
import RoundedCard from '@/components/cards/RoundedCard.vue'
import { useArticleStore } from '@/stores/ArticleStor';

const articleStore = useArticleStore()
const rawMaterials = articleStore.rawMaterials
</script>