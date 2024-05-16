<template>
    <div class="grid grid-cols-3 gap-2 w-full">
        <div class="col-span-2 flex flex-col gap-2">
            <AddAndEditCategory 
                title="Dodaj Kategoriju" 
                second-button-label="Dodaj"
                @catergory="onCategoryName"
                @level="onLevel"
                @delete="onDeleteCategory"
                @confirm="onConfirmCategory"
            >
                <template v-slot:secondButtonIcon><span class="material-symbols-outlined">add</span></template>
            </AddAndEditCategory>
            <CategoryPreview></CategoryPreview>
            <AddAndEditCategory title="Izmjena Kategorije" first-button-label="Obriši" second-button-label="Ažuriraj">
                <template v-slot:firstButtonIcon><span class="material-symbols-outlined">delete</span></template>
                <template v-slot:secondButtonIcon><span class="material-symbols-outlined">upgrade</span></template>
            </AddAndEditCategory>
        </div>
        <div class="col-span-1">
            <RoundedCard><p>Category List</p></RoundedCard>
        </div>
    </div> 
</template>

<script setup lang="ts">
import RoundedCard from '../cards/RoundedCard.vue'
import CategoryPreview from './categoryComponents/CategoryPreview.vue'
import AddAndEditCategory from './categoryComponents/AddAndEditCategory.vue'
import { ref } from 'vue'

const addCategoryName = ref('')
const addLevel = ref('')
const onCategoryName = (value: string) => {
    addCategoryName.value = value
    console.log(`cat: ${addCategoryName.value}`)
}
const onLevel = (value: string) => {
    addLevel.value = value
    console.log(`level: ${addLevel.value}`)
}
const onDeleteCategory = () => {
    console.log('deleting category')
}
const onConfirmCategory = () => {
    console.log('confirmCategory')
}
</script>

