<template>
    <div class="w-full flex flex-col rounded-xl p-2 bg-gray-200 h-96">
        <div class="w-full flex flex-row justify-center mb-2">
            <p class="font-bold text-xl">Stavke Računa</p>
        </div>
        <div class="w-full flex flex-col gap-1 h-full overflow-y-scroll scrollbar-hide">
            <div 
                @click="displayQuantityInput(false)"
                v-for="(item, index) in billItems" :key="item.id"
                class="h-16 rounded-xl flex flex-row gap-2  bg-gray-300 hover:bg-gray-400 cursor-pointer  transition duration-300 ease-in-out hover:brightness-70"
            >
                <div class="h-16 w-16 overflow-hidden">
                    <img :src="getImage(item.productId)" class="w-full h-full object-cover rounded-l-xl">
                </div>
                <div class="flex flex-row items-center">
                    <p class="font-bold text-xl">{{ productStore.getProductById(item.productId)?.name }}</p>
                </div>
                <div class="m-auto"></div>
                <div class="flex flex-row items-center">
                    <p class="font-bold text-xl">{{ (item.quantity * item.price).toFixed(2) }} €</p>
                </div>
                <div @click.stop v-if="isQuantityInputVisible" class="flex flex-row items-center justify-center w-14 bg-white">
                    <input 
                        type="number" 
                        v-model:="item.quantity" 
                        class="w-full h-full text-center text-xl"
                        @input="onQuantityChanged(item)"
                    >
                </div>
                <div v-else @click.stop="displayQuantityInput(true)" class="flex flex-row items-center justify-center w-14 bg-white">
                    <p class="font-bold text-xl">{{ item.quantity }}</p>
                </div>
                <div class="flex flex-col items-center">
                    <div class="h-1/2 flex flex-row items-center">
                        <span @click="onArrowUpClicked(item)" class="material-symbols-outlined text-xl hover:text-green-300">keyboard_arrow_up</span>
                    </div>
                    <div class="h-1/2 flex flex-row items-center">
                        <span @click="onArrowDownClicked(item)" class="material-symbols-outlined text-xl hover:text-red-300">keyboard_arrow_down</span>
                    </div>
                </div>
                
                <div class="flex flex-row items-center pr-4 pl-2">
                    <span @click="onRemoveClicked(index)" class="material-symbols-outlined hover:text-red-500">close</span>
                </div>
            </div>
        </div>
        <div class="w-full h-px bg-gray-500"></div>
        <div class="w-full h-2"></div>
        <div class="w-full flex flex-row h-10 justify-between px-4">
            <div class="flex flex-row items-center">
                <p class="font-bold text-xl">Ukupno:</p>
                <p class="font-bold text-xl">{{ totalPrice }} €</p>
            </div>
            <div class="pl-2 flex flex-row items-center">
                <p class="font-bold text-xl">Br.stavki:</p>
                <p class="font-bold text-xl">{{ totalBillItems }}</p>
            </div>
            <div class="pl-2 flex flex-row items-center">
                <p class="font-bold text-xl">Br. proizvoda:</p>
                <p class="font-bold text-xl">{{ totalProductItems }}</p>
            </div>
        </div>
        <div class="w-full h-2"></div>
        <div class="flex flex-row justify-end">
            <FilledButton
                label="Ispis"
                backgroundColor="bg-orange-700"
                hoverColor="hover:bg-orange-900"
                textColor="text-white"
                :disabled="paydesk.isDisabled"
            >
                <span class="material-symbols-outlined text-xl">receipt</span>
            </FilledButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Product } from '@/types/Product'
import type { BillItem } from '@/types/BillItem'
import FilledButton from '../buttons/FilledButton.vue'
import { ref, watch } from 'vue'
import { generateImageName } from '@/helpers/generateImageName'
import { useProductStore } from '@/stores/ProductStore'
import type { PayDesk } from '@/types/PayDesk'

const props = defineProps<{
    product?: Product,
    payDesk: PayDesk
}>()

const productStore = useProductStore()
const billItems = ref<BillItem[]>([])
const paydesk = ref<PayDesk>(props.payDesk)

watch(props.payDesk,(newPayDesk) => {
    paydesk.value = newPayDesk
})
const getImage = (id: string): string => {
    const imageUrl = productStore.getProductById(id)?.imageUrl
    if(imageUrl){
        return imageUrl
    }
    return '@/assets/blank_profile_picture.jpg'
}
const isQuantityInputVisible = ref(false)
const totalPrice = ref<string>('0')
const totalBillItems = ref<string>('0')
const totalProductItems = ref<string>('0')

watch(() => props.product, (newProduct) => {
    if(newProduct){
        const price = isNaN(parseFloat(newProduct.price)) ?  0 : parseFloat(newProduct.price)
        billItems.value.push({
            id: generateImageName(''),
            productId: newProduct.id,
            productName: newProduct.name,
            quantity: 1,
            price: price,
            amount: price.toFixed(2)
        }as BillItem)
        changeTotal()
    }
})

const onArrowUpClicked = (item: BillItem) => {
    item.quantity ++
    
    changeTotal()
}
const onArrowDownClicked = (item: BillItem) => {
    if(item.quantity > 1){
        item.quantity --
       
    }
    changeTotal()
}
const onRemoveClicked = (index: number) => {
    billItems.value.splice(index, 1)
    changeTotal()
}
const displayQuantityInput = (value: boolean) => {
    isQuantityInputVisible.value = value
}
const onQuantityChanged = (item: BillItem) => {
    if(item.quantity == 0){
        item.quantity = 1
    }
    item.quantity = Math.round(item.quantity) 
    
    changeTotal()
}
const changeTotal = () => {
    totalBillItems.value = billItems.value.length.toString()
    var priceTotal = 0
    var productItemsTotal = 0
    billItems.value.forEach(item => {
        priceTotal += item.quantity * item.price
        productItemsTotal += item.quantity
    })
    totalPrice.value = priceTotal.toFixed(2)
    totalProductItems.value = productItemsTotal.toString()
}
</script>
