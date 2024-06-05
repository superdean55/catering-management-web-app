<template>
    <div class="w-full flex flex-col rounded-xl p-2 bg-gray-200">
        <div class="w-full flex flex-row justify-center mb-2">
            <p class="font-bold text-xl">Stavke Računa</p>
        </div>
        <div class="w-full flex flex-col gap-1">
            <div 
                v-for="(item, index) in billItems" :key="item.id"
                class="rounded-xl flex flex-row gap-2 border bg-gray-300 border-gray-100 hover:border-gray-400 hover:bg-gray-400 cursor-pointer  transition duration-300 ease-in-out hover:brightness-70"
            >
                <div class="h-16 w-16 overflow-hidden">
                    <img :src="getImage(item.productId)" class="w-full h-full object-cover rounded-l-xl">
                </div>
                <div class="flex flex-row items-center">
                    <p class="font-bold text-xl">{{ productStore.getProductById(item.productId)?.name }}</p>
                </div>
                <div class="m-auto"></div>
                <div class="flex flex-row items-center px-6 bg-white">
                    <p class="font-bold text-xl">{{ item.quantity }}</p>
                </div>
                <div class="flex flex-col items-center">
                    <div class="h-1/2 flex flex-row items-center">
                        <span @click="onArrowUpClicked(item)" class="material-symbols-outlined text-xl hover:text-green-500">keyboard_arrow_up</span>
                    </div>
                    <div class="h-1/2 flex flex-row items-center">
                        <span @click="onArrowDownClicked(item)" class="material-symbols-outlined text-xl hover:text-red-500">keyboard_arrow_down</span>
                    </div>
                </div>
                <div class="flex flex-row items-center pr-6 pl-2">
                    <span @click="onRemoveClicked(index)" class="material-symbols-outlined hover:text-red-500">close</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Product } from '@/types/Product'
import type { BillItem } from '@/types/BillItem'
import { ref, watch } from 'vue'
import { generateImageName } from '@/helpers/generateImageName'
import { useProductStore } from '@/stores/ProductStore'

const props = defineProps<{
    product?: Product
}>()

const productStore = useProductStore()
const billItems = ref<BillItem[]>([])
const getImage = (id: string): string => {
    const imageUrl = productStore.getProductById(id)?.imageUrl
    if(imageUrl){
        return imageUrl
    }
    return '@/assets/blank_profile_picture.jpg'
}
watch(() => props.product, (newProduct) => {
    if(newProduct){
        billItems.value.push({
            id: generateImageName(''),
            productId: newProduct.id,
            quantity: 0
        }as BillItem)
    }
})

const onArrowUpClicked = (item: BillItem) => {
    item.quantity ++
}
const onArrowDownClicked = (item: BillItem) => {
    if(item.quantity >= 1){
        item.quantity --
    }
}
const onRemoveClicked = (index: number) => {
    billItems.value.splice(index, 1)
}
</script>
