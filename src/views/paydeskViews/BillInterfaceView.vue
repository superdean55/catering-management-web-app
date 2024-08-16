<template>
    <div class="w-full font-merienda">
        <div class="w-full grid grid-cols-7 gap-2">
            <RoundedCard class="col-span-7" v-if="isUserLoggedInPayDesk && screenStore.isSmallScreen && paydesk && user" :style="{height: adjustedHeight + 'px'}">
                <div class="w-full grid grid-cols-1 gap-4">
                    <SmallScreenNav :icons="navIconsRef" :external-change="change" @selected="onIconSelected"></SmallScreenNav>
                    <PayDeskInfoPanel 
                        class="col-span-1" 
                        :payDesk="paydesk"
                        v-if="selectedIcon === 'Panel'"
                    ></PayDeskInfoPanel>
                    <ProductSelectionInterface 
                        class="col-span-1" 
                        @product="onProduct" 
                        :style="{height: smallInterfaceHeight + 'px'}"
                        v-else-if="selectedIcon === 'Proizvodi'"
                    ></ProductSelectionInterface>
                    <BillItemsInterface
                        v-else-if="selectedIcon === 'Ispis'"
                        :product="product"
                        :order="order"
                        :productListHeight="productInterfaceHeight"
                        :user="user"
                        :table="selectedTable"
                        :change="change"
                        :payDesk="paydesk"
                        @bill="onBillPrinting"
                        class="col-span-1"
                        :style="{height: smallInterfaceHeight + 'px'}"
                    ></BillItemsInterface>
                    <TableSelectionInterface 
                        class="col-span-1"
                        @table="OnTableSelected"
                        v-else-if="selectedIcon === 'Stolovi'"
                    ></TableSelectionInterface>
                    <ListOfOrders 
                        class="col-span-1" 
                        @order="onOrder"
                        v-else-if="selectedIcon === 'Narudžbe'"
                        :style="{height: smallInterfaceHeight + 'px'}"
                    ></ListOfOrders>
                </div>
            </RoundedCard>
            <RoundedCard class="col-span-5" v-else-if="isUserLoggedInPayDesk && paydesk && user" :style="{height: adjustedHeight + 'px'}">
                <div class="w-full h-full grid grid-cols-7 gap-2">
                    <PayDeskInfoPanel class="col-span-7" :payDesk="paydesk"></PayDeskInfoPanel>
                    <ProductSelectionInterface class="col-span-3 overflow-hidden" @product="onProduct" :style="{height: interfaceHeight + 'px'}"></ProductSelectionInterface>
                    <BillItemsInterface
                        :product="product"
                        :order="order"
                        :productListHeight="productInterfaceHeight"
                        :user="user"
                        :table="selectedTable"
                        :change="change"
                        :payDesk="paydesk"
                        @bill="onBillPrinting"
                        class="col-span-4 overflow-hidden"
                        :style="{height: interfaceHeight + 'px'}"
                    ></BillItemsInterface>
                    <TableSelectionInterface class="col-span-7 overflow-hidden" @table="OnTableSelected"></TableSelectionInterface>
                </div>
            </RoundedCard>
            <RoundedCard v-else-if="!payDeskStore.payDesks.length" class="col-span-5">
                <div class="w-full flex flex-col gap-2 items-center">
                    <p class="text-red-500">Ne postoji niti jedan blagajna</p>
                    <p>Obratite se administratoru</p>
                </div>
            </RoundedCard>
            <RoundedCard v-else class="col-span-5">
                <PayDeskLogIn @logIn="onLogIn"></PayDeskLogIn>
            </RoundedCard>
            <RoundedCard class="col-span-2" v-if="isUserLoggedInPayDesk && !screenStore.isSmallScreen && paydesk && user" :style="{height: adjustedHeight + 'px'}">
                <ListOfOrders class="w-full" @order="onOrder"></ListOfOrders> 
            </RoundedCard>
        </div>
    </div>
</template>

<script setup lang="ts">
import RoundedCard from '@/components/cards/RoundedCard.vue'
import ProductSelectionInterface from '@/components/paydeskComponents/ProductSelectionInterface.vue'
import BillItemsInterface from '@/components/paydeskComponents/BillItemsInterface.vue'
import PayDeskInfoPanel from '@/components/paydeskComponents/PayDeskInfoPanel.vue'
import PayDeskLogIn from '@/components/paydeskComponents/PayDeskLogIn.vue'
import TableSelectionInterface from '@/components/paydeskComponents/TableSelectionInterface.vue'
import SmallScreenNav from '@/components/phone_nav/SmallScreenNav.vue'
import { useUserStore } from '@/stores/UserStore'
import type { Product } from '@/types/Product'
import { computed, ref, watch } from 'vue'
import { usePayDeskStore } from '@/stores/payDeskStore'
import type { PayDesk } from '@/types/PayDesk'
import type { User } from '@/types/User'
import type { Table } from '@/types/Table'
import type { Bill } from '@/types/Bill'
import { useProductStore } from '@/stores/ProductStore'
import type { SupplyItem } from '@/types/SupplyItem'
import { useArticleStore } from '@/stores/ArticleStor'
import { useSuppliesStore } from '@/stores/SuppliesStore'
import ListOfOrders from '@/components/paydeskComponents/ListOfOrders.vue'
import { useOrderStore } from '@/stores/OrderStore'
import { useScreenStore } from '@/stores/ScreenStore'
import type { Order } from '@/types/Order'
import type { NavIcon } from '@/types/NavIcon'

const userStore = useUserStore()
const suppliesStore = useSuppliesStore()
const productStore = useProductStore()
const articleStore = useArticleStore()
const payDeskStore = usePayDeskStore()
const orderStore = useOrderStore()
const screenStore = useScreenStore()

const product = ref<Product>()
const change = ref<number>(0)
const isUserLoggedInPayDesk = ref<boolean>(false)
const paydesk = ref<PayDesk | null>(null)
const user = ref<User | null>(userStore.user)
const selectedTable = ref<Table | null>(null)
const order = ref<Order | null>(null)
const approvedOrders = ref<Order []>(orderStore.approvedOrders)
const selectedIcon = ref<string>('Stolovi')
const changeIcon = ref<number>(0)

const icons = [
  { icon: 'article', title: 'Stolovi', isSelected: true } as NavIcon,
  { icon: 'article', title: 'Proizvodi', isSelected: false } as NavIcon,
  { icon: 'article', title: 'Ispis', isSelected: false } as NavIcon,
  { icon: 'article', title: 'Narudžbe', isSelected: false } as NavIcon,
  { icon: 'article', title: 'Panel', isSelected: false } as NavIcon
]

const navIconsRef = ref<NavIcon[]>(icons)


if(orderStore.approvedOrders.length){
    order.value = orderStore.approvedOrders[0]
}

watch(orderStore.approvedOrders, (newApprovedOrders) => {
    approvedOrders.value = []
    newApprovedOrders.forEach( order => {
        if(order.payDeskId === paydesk.value?.id){
            approvedOrders.value.push(order)
        }
    })
    if(approvedOrders.value.length){
        order.value = approvedOrders.value[0]
    }else{
        order.value = null
    }
})

const checkIsUserLoggdInPayDesk = () => {
    if(user.value){
        isUserLoggedInPayDesk.value =  payDeskStore.payDesks.some(it => it.userId === user.value?.uid)
    }
    if(isUserLoggedInPayDesk){
        orderStore.fetchOrders()
        orderStore.fetchApprovedOrders()
        const paydesk_ = payDeskStore.payDesks.find(it => it.userId === userStore.user?.uid)
        if(paydesk_){
            paydesk.value = paydesk_
        }
    }
}

checkIsUserLoggdInPayDesk()

const adjustedHeight = computed(() => {
      return screenStore.screenHeight - 96
})

const interfaceHeight = computed(() => {
      return adjustedHeight.value - 276
})

const productInterfaceHeight = computed(() => {
      return interfaceHeight.value - 141
})

const smallInterfaceHeight = computed(() => {
    return adjustedHeight.value - 96
})

watch(payDeskStore.payDesks, () => {
    checkIsUserLoggdInPayDesk()
})

const onProduct = (_product: Product) => {
    product.value = _product
    change.value ++
}
const onLogIn = (payDeskId: string) => {
    if(userStore.user){
        payDeskStore.loginToPayDesk(userStore.user.uid, payDeskId)
    }
}
const OnTableSelected = (table: Table) => {
    selectedTable.value = table
}
const onOrder = (order_: Order) => {
    if(paydesk.value){
        order_.payDeskId = paydesk.value.id
        orderStore.approveTheOrder(order_)
    }
}
const onIconSelected = (selectedIcon_: string) =>{
    selectedIcon.value = selectedIcon_
}
const onBillPrinting = (bill: Bill) => {
    console.log('billPrinting: ', bill)
    selectedTable.value = null
    const supplyItems: SupplyItem [] = []
    bill.billItems.forEach(billItem => {
        const product = productStore.getProductById(billItem.productId)
        if(!product){
            throw new Error('Product not exists')
        }
        product.productItems.forEach(productItem => {
                const rawMaterial = articleStore.rawMaterials.find(it => it.id === productItem.rawMaterialId)
                if(!rawMaterial){
                    throw new Error ('Raw material not exists')
                }
                supplyItems.push({
                        rawMaterialId: productItem.rawMaterialId,
                        name: rawMaterial.name,
                        code: rawMaterial.code,
                        unit: rawMaterial.unit,
                        quantity: (Math.round(productItem.quantity * billItem.quantity * 100) / 100) * (-1)
                    } as SupplyItem)
        })
    })

    console.log('supply items = ',supplyItems)
    if(user.value && paydesk.value){
        payDeskStore.addBill(bill)
        const documentName = bill.paydeskName + ' Rč.br.:' + bill.number.toString()
        suppliesStore.updateSuppliesByBill(user.value, documentName, supplyItems)
        //payDeskStore.updateBillNumberTotalCashAndBillList(paydesk.value, bill.totalCash)
    }
    if(bill.byOrderId !== ''){
        orderStore.completeTheOrder(bill.byOrderId)
        bill.byOrderId
    }
}
</script>
