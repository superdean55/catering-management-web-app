<template>
    <div>
        <RouterLink :to="{ name: 'AddCategory' }" class="inline-block px-2 py-1 rounded-2xl bg-gray-600 hover:bg-gray-800 text-white">
                <p >Dodaj Kategoriju</p>
        </RouterLink>
    </div>
    <CategoryInterface 
        @delete="onDeleteCategory"
        @confirm="onConfirm"
        :category="category"
    >
    </CategoryInterface>
</template>

<script setup lang="ts">
import CategoryInterface from './CategoryInterface.vue'
import { useRoute } from 'vue-router'
import { useCategoryStore } from '@/stores/CategoryStore'
import { ref } from 'vue'
import type { Category } from '@/types/Category'

const categoryStore = useCategoryStore()
const route = useRoute()

var id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
const category = ref(categoryStore.getCategoryById(id))

const onDeleteCategory = (categoryId: string) => {
    categoryStore.deleteCategory(categoryId)
}
const onConfirm = (category: Category, selectedCategoryImageUrl: string | null, oldCategory: Category | null) => {
    if(oldCategory){
        categoryStore.updateCategory(category, selectedCategoryImageUrl, oldCategory)
    }
}
</script>

