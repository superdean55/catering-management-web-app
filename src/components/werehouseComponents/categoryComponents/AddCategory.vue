<template>
    <CategoryInterface
        @confirm="onConfirm"
    >
        <template v-slot:secondButtonIcon><span class="material-symbols-outlined">add</span></template>
    </CategoryInterface>
</template>

<script setup lang="ts">
import type { Category } from '@/types/Category'
import CategoryInterface from './CategoryInterface.vue'
import { useCategoryStore } from '@/stores/CategoryStore'

const categoryStore = useCategoryStore()


const onConfirm = (category: Category, selectedCategoryImageUrl: string | null, oldCategory: Category | null) => {
    console.log('Add Category')
    console.log(category)
    console.log(selectedCategoryImageUrl)
    console.log(oldCategory)
    if(selectedCategoryImageUrl){
        categoryStore.addCategory(category, selectedCategoryImageUrl)
    }
    
}
</script>

