<template>
    <div class="w-full">
        <ProductInterface
            v-if="product"
            :product="product"
            @confirm="onConfirm"
            @delete="onDelete"
        >
        </ProductInterface>

    </div>
</template>

<script setup lang="ts">
import ProductInterface from './ProductInterface.vue'
import type { Product } from '@/types/Product.ts'
import { useProductStore } from '@/stores/ProductStore'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const productStore = useProductStore()

const route = useRoute()

const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
const product = ref(productStore.getProductById(id))

watch(() => route.params.id, (newId) => {
  const id = Array.isArray(newId) ? newId[0] : newId
  product.value = productStore.getProductById(id)
})

const onConfirm = (product: Product, oldProduct: Product | null, selectedImageUrl: string | null) => {
    if(oldProduct){
        productStore.updateProduct(product, oldProduct, selectedImageUrl)
    }
}
const onDelete = (product: Product) => {
    productStore.deleteProduct(product.id)
}
</script>
