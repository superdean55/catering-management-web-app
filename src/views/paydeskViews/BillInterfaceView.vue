<template>
    <RoundedCard class="max-w-5xl">
        <div class="w-full grid grid-cols-7 gap-2">
            <div v-if="userStore.user" class="col-span-7">
                <OneLabelAndDataTagInRow label="djelatnik:" :data="userStore.user.firstName + ' ' + userStore.user.lastName"></OneLabelAndDataTagInRow>
            </div>
            <ProductSelectionInterface class="col-span-3" @product="onProduct"></ProductSelectionInterface>
            <BillItemsInterface :product="product" class="col-span-4"></BillItemsInterface>
            <div class="col-span-7 flex flex-row justify-end">
                <button class="rounded-xl bg-orange-700 hover:bg-orange-900">
                    <div class="flex flex-row justify-center gap-1 items-center g-1 px-2 py-1">
                        <p class="font-bold text-xl text-white">Ispis</p>
                        <span class="material-symbols-outlined text-xl text-white">receipt</span>
                    </div>
                </button>
            </div>
        </div>
    </RoundedCard>
</template>

<script setup lang="ts">
import RoundedCard from '@/components/cards/RoundedCard.vue'
import ProductSelectionInterface from '@/components/paydeskComponents/ProductSelectionInterface.vue'
import BillItemsInterface from '@/components/paydeskComponents/BillItemsInterface.vue'
import OneLabelAndDataTagInRow from '@/components/dataTags/OneLabelAndDataTagInRow.vue'
import { useUserStore } from '@/stores/UserStore'
import type { Product } from '@/types/Product'
import { ref } from 'vue'

const product = ref<Product>()
const userStore = useUserStore()

const onProduct = (_product: Product) => {
    product.value = _product
}
</script>
