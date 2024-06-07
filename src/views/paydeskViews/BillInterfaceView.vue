<template>
    <RoundedCard class="max-w-5xl">
        <div class="w-full grid grid-cols-7 gap-2">
            <ProductSelectionInterface class="col-span-3" @product="onProduct"></ProductSelectionInterface>
            <BillItemsInterface :product="product" class="col-span-4"></BillItemsInterface>
        </div>
    </RoundedCard>
</template>

<script setup lang="ts">
import RoundedCard from '@/components/cards/RoundedCard.vue'
import ProductSelectionInterface from '@/components/paydeskComponents/ProductSelectionInterface.vue'
import BillItemsInterface from '@/components/paydeskComponents/BillItemsInterface.vue'
import type { Product } from '@/types/Product'
import { ref } from 'vue';

const product = ref<Product>()

const onProduct = (_product: Product) => {
    product.value = _product
}
</script>
