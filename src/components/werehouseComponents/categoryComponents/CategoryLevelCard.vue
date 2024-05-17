<template>
    <RoundedCard  class="bg-orange-100 flex flex-col gap-2 border border-gray-300">
            <div class="w-full flex justify-center">
                <p class="font-bold pb-2">Categorys {{ level }}</p>
            </div>
            <RouterLink :to="{ name: 'CategoryPreview', params: { id: category.id }}"
                v-for="category in categorys" :key="category.id" 
                class="flex felx-row w-full px-2 py-1 h-11 rounded-lg bg-gray-300 hover:bg-gray-400 cursor-pointer">
                <div class="w-10 flex flex-row items-center justify-center">
                    <img :src="category.imageUrl" class="max-h-10 maw-w-10 rounded-lg">
                </div>
                <div class="flex flex-row items-center justify-center">
                    <p class="font-bold pl-4">{{ category.name }}</p>
                </div>
            </RouterLink>
    </RoundedCard>
</template>

<script setup lang="ts">
import RoundedCard from '@/components/cards/RoundedCard.vue';
import { Category } from '@/types/Category.ts'
defineProps<{
    categorys: Category[],
    level: string
}>()
</script>

