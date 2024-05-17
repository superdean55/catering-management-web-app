<template>
    <div class="grid grid-cols-3 gap-2 w-full">
        <div class="col-span-2 flex flex-col gap-2">
            <AddAndEditCategory 
                title="Dodaj Kategoriju" 
                second-button-label="Dodaj"
                @delete="onDeleteCategory"
                @confirm="onAddCategory"
            >
                <template v-slot:secondButtonIcon><span class="material-symbols-outlined">add</span></template>
            </AddAndEditCategory>
            <CategoryPreview title="Pregled Kategorije" category-name="ime" level="level" image-url=""></CategoryPreview>
            <AddAndEditCategory title="Izmjena Kategorije" first-button-label="Obriši" second-button-label="Ažuriraj">
                <template v-slot:firstButtonIcon><span class="material-symbols-outlined">delete</span></template>
                <template v-slot:secondButtonIcon><span class="material-symbols-outlined">upgrade</span></template>
            </AddAndEditCategory>
        </div>
        <div class="col-span-1">
            
            <CategoryList></CategoryList>
        </div>
    </div> 
</template>

<script setup lang="ts">
import RoundedCard from '../cards/RoundedCard.vue'
import CategoryPreview from './categoryComponents/CategoryPreview.vue'
import AddAndEditCategory from './categoryComponents/AddAndEditCategory.vue'
import CategoryList from './categoryComponents/CategoryList.vue';
import { useArticleStore } from '@/stores/ArticleStor';

const articleStore = useArticleStore()
const categorys = articleStore.categorys

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

