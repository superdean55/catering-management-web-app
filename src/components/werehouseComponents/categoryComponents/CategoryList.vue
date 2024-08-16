<template>
    <div class="w-full grid grid-cols-4 gap-2">
        <div class="w-full" :class="screenStore.isSmallScreen ? 'col-span-4' : 'col-spa-2'">
            <RoundedCard>
                <div class="flex flex-col w-full">
                    <div class="w-full flex flex-row justify-center">
                        <p class="font-bold text-xl">Kategorije</p>
                    </div>
                    <div class="w-full h-4"></div>
                    <div v-if="categoryStore.categorys.length" class="flex flex-col gap-2">
                        <div
                            class="flex flex-row justify-start rounded-xl bg-slate-200 hover:bg-slate-400"
                            v-for="category in categoryStore.categorys" :key="category.id"
                            @click="onCategoryClicked(category)"
                        >
                            <div class="w-20 h-20 overflow-hidden">
                                <img :src="category.imageUrl" :alt="category.imageName" class="w-full h-full object-cover rounded-l-xl">
                            </div>
                            <div class="ml-2 flex flex-row items-center">
                                <p class="font-bold text-2xl">{{ category.name }}</p>
                            </div>
                        </div>
                    </div>
                    <div v-else class="flex flex-row justify-center">
                        <p class="text-sm">Ne postoji niti jedna kategorija</p>
                    </div>
                </div>
            </RoundedCard>
        </div>
        <div class="w-full" :class="screenStore.isSmallScreen ? 'col-span-4' : 'col-spa-2'">
            <CategoryPreview :category="category"></CategoryPreview>
        </div>
    </div>
    
</template>

<script setup lang="ts">
import RoundedCard from '@/components/cards/RoundedCard.vue'
import { useCategoryStore } from '@/stores/CategoryStore'
import CategoryPreview from './CategoryPreview.vue'
import type { Category } from '@/types/Category'
import { ref } from 'vue'
import { useScreenStore } from '@/stores/ScreenStore'

const categoryStore = useCategoryStore()
const screenStore = useScreenStore()
const category = ref<Category>()
const onCategoryClicked = (selectedCategory: Category) => {
    category.value = selectedCategory
}
</script>
