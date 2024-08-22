<template>
    <CustomDialog background-color="bg-gray-800" :show-dialog="showCustomDialog" @update="onShowDialogUpdate">
        <div v-if="showMainOrderProductScreen" class="w-full flex flex-row gap-4">
            <div class="flex flex-col gap-2 items-center">
                <div class="flex flex-col items-center">
                    <p class="font-bold text-lg text-white">{{ table.name }}</p>
                    <p class="text-xs text-white">Aktivan prije:</p>
                    <p class="font-bold text-xs text-white">{{ table.timeDifference + ' min'}}</p>
                </div>
                <div class="w-24 h-24 flex felx-row justify-center items-center">
                    <TableCard :shape="selectedTable.shape" :name="selectedTable.name" :backgroud-color="backgroudColor"></TableCard>
                </div>
            </div>
            <div class="flex flex-col items-center justify-center gap-2 w-28">
                <button @click="onOrderProductClicked" class="w-full py-1 rounded bg-orange-600 hover:bg-orange-800">
                    <div class="w-full flex flex-row justify-center gap-1">
                        <p class="font-bold text-white text-lg">Naruči</p>
                        <span class="material-symbols-outlined text-lg text-white">shopping_cart_checkout</span>
                    </div>
                </button>
                
                <div class="m-auto"></div>
                <button @click="onCancelTableDialog" class="w-full py-1 rounded bg-orange-600 hover:bg-orange-800">
                    <div class="w-full flex flex-row justify-center gap-1">
                        <p class="font-bold text-white text-lg">Izađi</p>
                        <span class="material-symbols-outlined text-lg text-white">cancel</span>
                    </div>
                </button>
            </div>
        </div>
        <div v-if="showOrderProductScreen"  :style="{width: isSmallScreen ? smallDialogWidth + 'px' : '900px', height: isSmallScreen ? smallDialogHeight + 'px' : ''}" >
            <div class="w-full">
                <div v-if="userStore.user" class="w-full flex flex-col gap-2">
                    <div @click="onArrowBack" class="flex flex-row justify-center items-center rounded-full w-10 h-10 bg-gray-300 hover:bg-gray-500 cursor-pointer"><span class="material-symbols-outlined text-lg text-white">arrow_back</span></div>
                    <div v-if="isSmallScreen" class="flex flex-row gap-2">
                        <NavButton label="Odabir proizovda" :selected="activeComponent === 'ProductSelection' ? true : false" @confirm="onProductInterface"></NavButton>
                        <NavButton label="Narudžba" :selected="activeComponent === 'OrderProduct' ? true : false" @confirm="onOrderInterface"></NavButton>
                    </div>
                    <div class="w-full grid grid-cols-1 lg:grid-cols-5 gap-2">
                        <ProductSelectionInterface 
                        v-if="!isSmallScreen || activeComponent === 'ProductSelection'" 
                        @product="onProduct" class="col-span-1 sm:col-span-2"
                        :style="{height: smallInterfaceHeight + 'px'}"
                        ></ProductSelectionInterface>
                        <OrderProductInterface
                            v-if="!isSmallScreen || activeComponent === 'OrderProduct'"
                            class="col-span-1 sm:col-span-3"
                            :product="product"
                            :user="userStore.user"
                            :table="selectedTable"
                            :change="change"
                            @order="onOrder"
                            :style="{height: smallInterfaceHeight + 'px'}"
                        ></OrderProductInterface>
                    </div>
                </div>
            </div>
        </div>
        
    </CustomDialog>
</template>

<script setup lang="ts">
import type { Table } from '@/types/Table'
import CustomDialog from './CustomDialog.vue'
import TableCard from '../restaurantTables/TableCard.vue'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { TableCircleShapes } from '@/types/TableCircleShapes'
import { TableCubeShapes } from '@/types/TableCubeShapes'
import { useTableStore } from '@/stores/TableStore'
import ProductSelectionInterface from '../paydeskComponents/ProductSelectionInterface.vue'
import OrderProductInterface from '../paydeskComponents/OrderProductInterface.vue'
import { Product } from '@/types/Product'
import { useUserStore } from '@/stores/UserStore'
import type { Order } from '@/types/Order'
import NavButton from '../buttons/NavButton.vue'
import { generateId } from '@/helpers/generateId'
import type { BillItem } from '@/types/BillItem'
import { useOrderStore } from '@/stores/OrderStore'
import { useScreenStore } from '@/stores/ScreenStore'

const props = defineProps<{
    showDialog: boolean,
    table: Table
}>()

const emit = defineEmits<{
    (e: 'update', showDialog: boolean): void
}>()

const screenStore = useScreenStore()
const userStore = useUserStore()
const orderStore = useOrderStore()
const showCustomDialog = ref<boolean>(props.showDialog)
const selectedTable = ref<Table>(props.table)
const product = ref<Product>()
const change = ref<number>(0)
const activeComponent = ref<'ProductSelection' | 'OrderProduct'>('ProductSelection')
const backgroudColor = ref<string>(props.table.backgroundColor)

const showMainOrderProductScreen = ref<boolean>(true)
const showOrderProductScreen = ref<boolean>(false)
const showChangeNameScreen = ref<boolean>(false)


const isSmallScreen = computed(() => {
      return screenStore.screenWidth < 1024
})
const smallDialogWidth = computed(() => {
    return screenStore.screenWidth - 32
})
const smallDialogHeight = computed(() => {
    return screenStore.screenHeight - 128
})
const smallInterfaceHeight = computed(() => {
    return smallDialogHeight.value - 96
}) 
const onShowDialogUpdate = (showDialog: boolean) => {
    showMainOrderProductScreen.value = true
    showOrderProductScreen.value = false
    showChangeNameScreen.value = false
    emit('update', showDialog)
}
watch(() => props.showDialog, (newValue) => {
    showCustomDialog.value = newValue
})
watch(() => props.table, (newTable) => {
    selectedTable.value = newTable
    backgroudColor.value = newTable.backgroundColor
})

const onProduct = (product_: Product) => {
    product.value = product_
    change.value ++
    const price = isNaN(parseFloat(product_.price)) ?  0 : parseFloat(product_.price)
    const billItem = {
        id: generateId(),
        productId: product_.id,
        productName: product_.name,
        quantity: 1,
        price: price,
    }as BillItem
    orderStore.addOrderItem(billItem)
}
const onOrderProductClicked = () => {
    showMainOrderProductScreen.value = false
    showOrderProductScreen.value = true
    showChangeNameScreen.value = false
    
}
const onTableReservationClicked = () => {
    
}
const onCancelTableDialog = () => {
    showMainOrderProductScreen.value = true
    showOrderProductScreen.value = false
    showChangeNameScreen.value = false
    emit('update', false)
}
const onArrowBack = () => {
    showMainOrderProductScreen.value = true
    showOrderProductScreen.value = false
    showChangeNameScreen.value = false
}
const onOrder = (order: Order) => {
    orderStore.addOrder(order)
    showMainOrderProductScreen.value = true
    showOrderProductScreen.value = false
    showChangeNameScreen.value = false
}
const onProductInterface = () => {
    activeComponent.value = 'ProductSelection'
}
const onOrderInterface = () => {
    activeComponent.value = 'OrderProduct'
}
</script>
