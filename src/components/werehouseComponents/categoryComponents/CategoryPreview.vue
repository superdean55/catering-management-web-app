<template>
    <RoundedCard v-if="category">
        <div class="w-full flex flex-col gap-2">
            <div class="w-full flex flex-row justify-center">
                <p class="text-xl font-bold">Pregeld Kategorije</p>
            </div>
            <div class="w-full h-4"></div>
            <div  class="w-full flex flex-row">
                <div v-if="category.imageUrl.length" class="w-28 h-28 overflow-hidden">
                    <img class="w-full h-full object-cover rounded-xl" :src="category.imageUrl">
                </div>
                <div v-else class="flex items-center ">
                    <img class="max-w-40 max-h-40" src="@/assets/blank_profile_picture.jpg">
                </div>
                <div class="flex flex-col gap-2 ml-2">
                    <OneLabelAndDataTagInRow label="Ime Kategorije:" :data="category.name"></OneLabelAndDataTagInRow>
                    <OneLabelAndDataTagInRow label="Datum i vrijeme kreiranja:" :data="category.creationDate"></OneLabelAndDataTagInRow>
                </div>
            </div>
            <div class="w-full h-2"></div>
            <div class="flex flex-row justify-center">
                <p class="font-bold text-lg">Proizvodi kategorije:</p>
            </div>
            
            <div class="w-full flex flex-col gap-2 justify-center">
                <div 
                    class="flex flex-row gap-2 rounded-xl bg-slate-300"
                    v-for="item in category.items" :key="item.productId"
                >
                    <div class="w-10 h-10 overflow-hidden">
                        <img class="w-full h-full object-cover rounded-l-xl" :src="getImageUrl(item)">
                    </div>
                    <div class="flex flex-row items-center">
                        <p class="font-bold text-xl">{{ productStore.getProductById(item.productId)?.name }}</p>
                    </div>
                </div>
            </div>
            <div class="flex flex-row justify-end">
                <RouterLink :to="{ name: 'EditCategory', params: { id: category.id }}">
                    <ConfirmButton label="Uredi">
                        <span class="material-symbols-outlined pl-2">edit</span>
                    </ConfirmButton>
                </RouterLink>
            </div>
        </div>
    </RoundedCard>
    <RoundedCard v-else>
        <div class="w-full flex flex-row justify-center">
            <p class="font-bold text-xl">Nije selektirana niti jedna kategorija</p>
        </div>
    </RoundedCard>
</template>

<script setup lang="ts">
import OneLabelAndDataTagInRow from '@/components/dataTags/OneLabelAndDataTagInRow.vue'
import RoundedCard from '@/components/cards/RoundedCard.vue'
import ConfirmButton from '@/components/buttons/ConfirmButton.vue'
import { watch, ref } from 'vue'
import type { Category } from '@/types/Category'
import { useProductStore } from '@/stores/ProductStore'
import type { CategoryItem } from '@/types/CategoryItem'

const props = defineProps<{
    category?: Category
}>()

const productStore = useProductStore()
const category = ref(props.category)
const getImageUrl = (item: CategoryItem): string => {
    const imageUrl = productStore.getProductById(item.productId)?.imageUrl
    if(imageUrl){
        return imageUrl
    }
    return  '@/assets/blank_profile_picture.jpg'
}

watch(() => props.category, (newCategory) => {
  category.value = newCategory
})

</script>