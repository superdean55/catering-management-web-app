<template>
    <main class="w-full h-screen bg-slate-300 p-0 overflow-x-scroll">
    <div class="h-10 w-full"></div>
    <div class="h-10 w-full"></div>
    <div class="flex flex-row justify-center">
        <div class="flex flex-col max-w-sm w-full rounded-lg bg-gray-900 font-merienda text-gray-200">
            <div class="flex flex-row justify-center py-4">
                <p class="text-5xl">Cijenik</p>
            </div>
            <div
                v-for="category in categoryStore.categorys" :key="category.id"
                class="flex flex-col m-5"
            >
                <div class="w-full flex flex-row justify-center">
                    <p class="text-2xl">{{ category.name }}</p>
                </div>
                <div 
                    v-for="product in category.items" :key="product.productId"
                    class="w-full flex flex-col"
                >
                    <div class="w-full flex flex-row items-center">
                        <div class="w-12 h-12 overflow-hidden rounded-lg">
                            <img :src="productStore.getProductById(product.productId)?.imageUrl" alt="" class="w-full h full object-cover rounded-lg">
                        </div>
                        <div class="pl-4">
                            <p>{{ productStore.getProductById(product.productId)?.name }}</p>
                        </div>
                        <div class="ml-auto">
                            <p>{{ productStore.getProductById(product.productId)?.price }} €</p>
                        </div>
                    </div>
                    <div class="h-2"></div>
                </div>
            </div>
        </div>
    </div>
    </main>
</template>

<script setup lang="ts">
import { useCategoryStore } from '@/stores/CategoryStore';
import { useProductStore } from '@/stores/ProductStore';

const categoryStore = useCategoryStore()
const productStore = useProductStore()


</script>
