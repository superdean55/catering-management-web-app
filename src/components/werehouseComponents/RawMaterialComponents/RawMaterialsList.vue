<template>
    <RoundedCard>
        <div class="w-full">
            <div class="flex items-center justify-center w-full mb-2">
                <p class="text-red-700">Sirovine</p>
            </div>
            <RoundedCard  class="flex flex-col gap-2 border border-gray-300">
                <RouterLink :to="{ name: 'EditRawMaterial', params: { id: material.id }}"
                    v-for="material in rawMaterials" :key="material.id"
                    class="flex flex-row w-full px-2 py-1 min-h-11 rounded-lg bg-gray-300 hover:bg-gray-400 cursor-pointer">
                    <div class="flex flex-row items-center justify-center">
                        <p class="font-bold pl-4">{{ material.name }}</p>
                    </div>
                </RouterLink>
            </RoundedCard>
        </div>
    </RoundedCard>
</template>

<script setup lang="ts">
import RoundedCard from '@/components/cards/RoundedCard.vue'
import { useArticleStore } from '@/stores/ArticleStore';

const articleStore = useArticleStore()
const rawMaterials = articleStore.rawMaterials
</script>