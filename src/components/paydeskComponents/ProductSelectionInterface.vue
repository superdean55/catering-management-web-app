<template>
    <div v-if="categoryStore.categorys.length" class="w-full h-full flex flex-row gap-2 rounded-xl border bg-gray-200 border-gray-300 p-2">
        <div class="flex flex-col gap-1 items-start overflow-y-scroll scrollbar-hide">
            <div
                v-for="category in categoryStore.categorys" :key="category.id"
                @click="onCategoryClick(category)"
                class="flex flex-col rounded-xl border bg-gray-300 border-gray-200 transition duration-300 ease-in-out hover:bg-gray-400 cursor-pointer"
            >   <div class="flex flex-row justify-center truncate">
                    <p>{{ category.name }}</p>
                </div>
                <div class="w-20 h-20 overflow-hidden">
                    <img :src="category.imageUrl" :alt="category.imageName" class="w-full h-full object-cover transition duration-300 ease-in-out hover:opacity-75 rounded-b-xl">
                </div>
            </div>
        </div>
        <div v-if="selectedCategoryProducts.length" class="flex flex-col flex-grow gap-2 py-2">
            <div class="flex felx-row justify-center">
                <p class="font-bold text-xl">{{ currentlySelectedCategoryName }}</p>
            </div>
            <div class="flex flex-col flex-grow gap-2 overflow-y-scroll scrollbar-hide">
                <div
                    v-for="product in selectedCategoryProducts" :key="product.id"
                    class="rounded-xl flex flex-row gap-2 border bg-gray-300 border-gray-100 hover:border-gray-400 hover:bg-gray-400 cursor-pointer  transition duration-300 ease-in-out hover:opacity-60"
                    @click="onProductClicked(product)"
                >
                    <div class="h-16 w-16 overflow-hidden">
                        <img :src="product.imageUrl" :alt="product.imageName" class="w-full h-full object-cover rounded-l-xl">
                    </div>
                    <div class="flex flex-row items-center">
                        <p class="font-bold text-sm lg:text-xl">{{ product.name }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="flex flex-row justify-center gap-2 rounded-xl border border-gray-300 p-2 h-96">
        <p class="font-bold text-xl text-red-500">Ne postoji niti jedna kategorija</p>
    </div>
</template>

<script setup lang="ts">
import { useCategoryStore } from '@/stores/CategoryStore'
import { useProductStore } from '@/stores/ProductStore'
import type { Category } from '@/types/Category'
import type { Product } from '@/types/Product'
import { ref } from 'vue'

const emit = defineEmits<{
    (e:'product', product: Product): void
}>()

const categoryStore = useCategoryStore()
const productStore = useProductStore()
const selectedCategoryProducts = ref<Product[]>([])
const currentlySelectedCategoryName = ref<string>('')

const onCategoryClick = (category :Category) => {
    currentlySelectedCategoryName.value = category.name
    selectedCategoryProducts.value = []
    category.items.forEach(element => {
        const product = productStore.products.find(it => it.id === element.productId)
        if(product){
            selectedCategoryProducts.value.push(product)
        }
    })
}
if(categoryStore.categorys.length){
    onCategoryClick(categoryStore.categorys[0])
}
const onProductClicked = (product :Product) => {
    emit('product', product)
}
</script>
