<template>
    <div class="w-full flex flex-col rounded-xl p-2 bg-gray-200 h-96">
        <div class="w-full flex flex-row justify-center mb-2">
            <p class="font-bold text-sm lg:text-xl">Stavke Narudžbe</p>
        </div>
        <div class="w-full flex flex-col gap-1 h-full overflow-y-scroll scrollbar-hide">
            <div 
                @click="displayQuantityInput(false)"
                v-for="(item, index) in orderStore.billItems" :key="item.id"
                class=" h-14 lg:h-16 rounded-xl w-full flex flex-row gap-2  bg-gray-300 hover:bg-gray-400 cursor-pointer  transition duration-300 ease-in-out hover:brightness-70"
            >
                <div class="h-14 lg:h-16 w-14 lg:w-16 overflow-hidden">
                    <img :src="getImage(item.productId)" class="w-full h-full object-cover rounded-l-xl">
                </div>
                <div class="flex flex-row items-center">
                    <p class="font-bold text-xs lg:text-xl">{{ productStore.getProductById(item.productId)?.name }}</p>
                </div>
                <div class="m-auto"></div>
                <div class="flex flex-row items-center">
                    <p class="font-bold text-xs lg:text-xl">{{ (item.quantity * item.price).toFixed(2) }} €</p>
                </div>
                <div @click.stop v-if="isQuantityInputVisible" class="flex flex-row items-center justify-center w-14 bg-white">
                    <input 
                        type="number" 
                        v-model:="item.quantity" 
                        class="w-full h-full text-center text-xs lg:text-xl"
                        @input="onQuantityChanged(item)"
                    >
                </div>
                <div v-else @click.stop="displayQuantityInput(true)" class="flex flex-row items-center justify-center w-14 bg-white">
                    <p class="font-bold text-xs lg:text-xl">{{ item.quantity }}</p>
                </div>
                <div class="flex flex-col items-center">
                    <div class="h-1/2 flex flex-row items-center">
                        <span @click="onArrowUpClicked(item)" class="material-symbols-outlined text-sm lg:text-xl hover:text-green-300">keyboard_arrow_up</span>
                    </div>
                    <div class="h-1/2 flex flex-row items-center">
                        <span @click="onArrowDownClicked(item)" class="material-symbols-outlined text-sm lg:text-xl hover:text-red-300">keyboard_arrow_down</span>
                    </div>
                </div>
                
                <div class="flex flex-row items-center pr-4 pl-2">
                    <span @click="onRemoveClicked(index)" class="material-symbols-outlined text-sm lg:text-xl hover:text-red-500">close</span>
                </div>
            </div>
        </div>
        <div class="w-full h-px bg-gray-500"></div>
        <div class="w-full h-2"></div>
        <div class="w-full flex flex-row h-10 justify-between px-4">
            <div class="flex flex-row items-center">
                <p class="font-bold text-xs lg:text-xl">Ukupno:</p>
                <p class="font-bold text-xs lg:text-xl">{{ totalPrice }} €</p>
            </div>
            <div class="pl-2 flex flex-row items-center">
                <p class="font-bold text-xs lg:text-xl">Br.stavki:</p>
                <p class="font-bold text-xs lg:text-xl">{{ totalBillItems }}</p>
            </div>
            <div class="pl-2 flex flex-row items-center">
                <p class="font-bold text-xs lg:text-xl">Br. proizvoda:</p>
                <p class="font-bold text-xs lg:text-xl">{{ totalProductItems }}</p>
            </div>
        </div>
        <div class="w-full h-2"></div>
        <div class="flex flex-row items-center justify-between">
            <p class="font-bold pl-4">{{ 'Stol: ' + tableSelected.name }}</p>
            <FilledButton
                label="Naruči"
                backgroundColor="bg-orange-700"
                hoverColor="hover:bg-orange-900"
                textColor="text-white"
                :disabled="orderStore.billItems.length === 0 || tableSelected === null"
                @confirm="onCreateOrder"
            >
                <span class="material-symbols-outlined text-xl">receipt</span>
            </FilledButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Product } from '@/types/Product'
import { BillItem } from '@/types/BillItem'
import FilledButton from '../buttons/FilledButton.vue'
import { ref, watch } from 'vue'
import { generateImageName } from '@/helpers/generateImageName'
import { useProductStore } from '@/stores/ProductStore'
import type { PayDesk } from '@/types/PayDesk'
import type { Bill } from '@/types/Bill'
import type { User } from '@/types/User'
import { usePayDeskStore } from '@/stores/payDeskStore'
import type { Table } from '@/types/Table'
import { generateId } from '@/helpers/generateId'
import type { Order } from '@/types/Order'
import type { FieldValue } from 'firebase/firestore'
import { useOrderStore } from '@/stores/OrderStore'


const props = defineProps<{
    user: User,
    table: Table,
    change: number,
}>()
const emit = defineEmits<{
    (e:'order', order: Order): void
}>()

const productStore = useProductStore()
const orderStore = useOrderStore()
watch(() => props.change, () => {
    changeTotal()
})
const tableSelected = ref<Table>(props.table)

const isQuantityInputVisible = ref(false)
const totalPrice = ref<string>('0.00')
const totalBillItems = ref<string>('0')
const totalProductItems = ref<string>('0')

watch(() => props.table,(newTable) =>{
    tableSelected.value = newTable
})

const getImage = (id: string): string => {
    const imageUrl = productStore.getProductById(id)?.imageUrl
    if(imageUrl){
        return imageUrl
    }
    return '@/assets/blank_profile_picture.jpg'
}
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
    orderStore.removeOrderItem(index)
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
    totalBillItems.value = orderStore.billItems.length.toString()
    var priceTotal = 0
    var productItemsTotal = 0
    orderStore.billItems.forEach(item => {
        priceTotal += item.quantity * item.price
        productItemsTotal += item.quantity
    })
    totalPrice.value = priceTotal.toFixed(2)
    totalProductItems.value = productItemsTotal.toString()
}

changeTotal()
const onCreateOrder = () => {

    if(orderStore.billItems.length && tableSelected.value){
        const order = {
            id: '',
            code: '',
            tableId: tableSelected.value.id,
            payDeskId: '',
            date: '',
            time: '',
            billItems: orderStore.billItems,
            uid: props.user.uid,
            timestamp: null as FieldValue | null,
            isApproved: false,
            isCompleted: false
        } as Order
        emit('order', order)
        orderStore.billItems = []
        totalPrice.value = '0.00'
        totalBillItems.value = '0'
        totalProductItems.value = '0'
    }
}
</script>
