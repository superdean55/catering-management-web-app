<template>
    <div class="w-full">
        <ProductInterface
            @confirm="onConfirm"
        >
        </ProductInterface>

    </div>
</template>

<script setup lang="ts">
import ProductInterface from './ProductInterface.vue'
import type { Product } from '@/types/Product.ts'
import { useProductStore } from '@/stores/ProductStore'

const productStore = useProductStore()

const onConfirm = (product: Product, oldProduct: Product | null, selectedImageUrl: string | null) => {
    if(selectedImageUrl){
        productStore.addProduct(product, selectedImageUrl)
        console.log('onConfirm')
    }
}
</script>
