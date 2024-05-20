<template>
    <AddAndEditCategory 
        title="Dodaj Kategoriju" 
        second-button-label="Dodaj"
        @delete="onDeleteCategory"
        @confirm="onAddCategory"
    >
        <template v-slot:secondButtonIcon><span class="material-symbols-outlined">add</span></template>
    </AddAndEditCategory>
</template>

<script setup lang="ts">
import type { Category } from '@/types/Category';
import AddAndEditCategory from './AddAndEditCategory.vue';
import { useArticleStore } from '@/stores/ArticleStor';
import router from '@/router';

const articleStore = useArticleStore()
    const onDeleteCategory = () => {
    console.log('deleting category')
}
const onAddCategory = (imageUrl: string | null, categoryName: string, selectedCategoryLevel: string, oldCategoryData: Category) => {
    console.log('Add Category')
    console.log(imageUrl)
    console.log(categoryName)
    console.log(selectedCategoryLevel)
    console.log(`category: on add :${oldCategoryData}`)
    
    articleStore.manageCategory(imageUrl, categoryName, selectedCategoryLevel, oldCategoryData)
    
}
</script>

