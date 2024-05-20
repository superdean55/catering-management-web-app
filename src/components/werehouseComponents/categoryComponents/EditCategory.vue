<template>
    <div>
        <RouterLink :to="{ name: 'AddCategory' }" class="inline-block px-2 py-1 rounded-2xl bg-gray-600 hover:bg-gray-800 text-white">
                <p >Dodaj Kategoriju</p>
        </RouterLink>
    </div>
    <AddAndEditCategory 
        title="Izmjeni Kategoriju" 
        first-button-label="Obriši"
        second-button-label="Ažuriraj"
        @delete="onDeleteCategory"
        @confirm="onAddCategory"
        :category="category"
    >
        <template v-slot:firstButtonIcon><span class="material-symbols-outlined">delete</span></template>
        <template v-slot:secondButtonIcon><span class="material-symbols-outlined">update</span></template>
    </AddAndEditCategory>
</template>

<script setup lang="ts">
import AddAndEditCategory from './AddAndEditCategory.vue';
import { useArticleStore } from '@/stores/ArticleStor';
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import type { Category } from '@/types/Category';
import router from '@/router';

const articleStore = useArticleStore()
const route = useRoute();

var id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
const category = ref(articleStore.getCategoryById(id))

const onDeleteCategory = (categoryId: string) => {
    articleStore.deleteCategory(categoryId)
}
const onAddCategory = (imageUrl: string | null, categoryName: string, selectedCategoryLevel: string, oldCategoryData: Category) => {
    console.log('Update Category')   
    console.log(`category: on edit :${category}`)
    articleStore.manageCategory(imageUrl, categoryName, selectedCategoryLevel, oldCategoryData)
    router.push({ name: 'AddCategory'})
}
</script>

