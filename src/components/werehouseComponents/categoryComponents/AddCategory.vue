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
import AddAndEditCategory from './AddAndEditCategory.vue';
import { useArticleStore } from '@/stores/ArticleStor';

const articleStore = useArticleStore()
    const onDeleteCategory = () => {
    console.log('deleting category')
}
const onAddCategory = (imageUrl: string | null, categoryName: string, selectedCategoryLevel: string) => {
    console.log('Add Category')
    console.log(imageUrl)
    console.log(categoryName)
    console.log(selectedCategoryLevel)
    if(imageUrl && categoryName.length && selectedCategoryLevel.length){
        articleStore.addCategory(imageUrl, categoryName, selectedCategoryLevel)
    }
    
}
</script>

