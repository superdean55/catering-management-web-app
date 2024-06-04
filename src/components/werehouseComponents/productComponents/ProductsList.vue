<template>
    <div class="max-w-4xl">
        <div class="w-full grid grid-cols-2 gap-2">
            <RouterLink 
                :to="{ name: 'EditProduct', params: { id: product.id }}"
                v-for="product in products" :key="product.id"
                class="rounded-xl flex flex-row bg-gray-100 hover:bg-gray-400"
            >
                <div class="w-50 h-50 overflow-hidden">
                    <img :src="product.imageUrl" :alt="product.imageName" class="w-full h-full object-cover rounded-l-xl">
                </div>
                <div class="flex flex-col w-full gap-2 p-4">
                    <OneLabelAndDataTagInRow label="ime:" :data="product.name"></OneLabelAndDataTagInRow>
                    <TwoLabelAndDataTagInRow
                        first-label="šifra:"
                        :first-data="product.code"
                        second-label="Cijena:"
                        :second-data="product.price+'€'"
                        class="w-full"
                    >
                    </TwoLabelAndDataTagInRow>
                    <TwoLabelAndDataTagInRow
                        first-label="jed. mjere:"
                        :first-data="product.articleUnit"
                        second-label="porezna stopa:"
                        :second-data="product.taxRate"
                        class="w-full"
                    >
                    </TwoLabelAndDataTagInRow>
                </div>
                
            </RouterLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import OneLabelAndDataTagInRow from '@/components/dataTags/OneLabelAndDataTagInRow.vue';
import TwoLabelAndDataTagInRow from '@/components/dataTags/TwoLabelAndDataTagInRow.vue'
import { useProductStore } from '@/stores/ProductStore'

const productStore = useProductStore()
const products = productStore.products
</script>