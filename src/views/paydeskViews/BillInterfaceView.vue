<template>
    <div class="w-full font-merienda">
        <RoundedCard class="max-w-5xl" v-if="isUserLoggedInPayDesk && paydesk && user">
            <div
                class="w-full grid grid-cols-7 gap-2">
                <PayDeskInfoPanel class="col-span-7" :payDesk="paydesk"></PayDeskInfoPanel>
                <ProductSelectionInterface class="col-span-3" @product="onProduct"></ProductSelectionInterface>
                <BillItemsInterface 
                    :product="product" 
                    :user="user" 
                    :table="selectedTable"
                    :change="change" 
                    :payDesk="paydesk"
                    @bill="onBillPrinting" 
                    class="col-span-4"
                ></BillItemsInterface> 
                <TableSelectionInterface class="col-span-7" @table="OnTableSelected"></TableSelectionInterface> 
            </div>
        </RoundedCard>
        <RoundedCard v-else-if="!payDeskStore.payDesks.length" class="max-w-md mx-auto">
            <div class="w-full flex flex-col gap-2 items-center">
                <p class="text-red-500">Ne postoji niti jedan blagajna</p>
                <p>Obratite se administratoru</p>
            </div>
        </RoundedCard>
        <RoundedCard v-else class="max-w-md mx-auto">
            <PayDeskLogIn @logIn="onLogIn"></PayDeskLogIn>
        </RoundedCard>
    </div>
</template>

<script setup lang="ts">
import RoundedCard from '@/components/cards/RoundedCard.vue'
import ProductSelectionInterface from '@/components/paydeskComponents/ProductSelectionInterface.vue'
import BillItemsInterface from '@/components/paydeskComponents/BillItemsInterface.vue'
import PayDeskInfoPanel from '@/components/paydeskComponents/PayDeskInfoPanel.vue'
import PayDeskLogIn from '@/components/paydeskComponents/PayDeskLogIn.vue'
import TableSelectionInterface from '@/components/paydeskComponents/TableSelectionInterface.vue'
import { useUserStore } from '@/stores/UserStore'
import type { Product } from '@/types/Product'
import { ref, watch } from 'vue'
import { usePayDeskStore } from '@/stores/payDeskStore'
import type { PayDesk } from '@/types/PayDesk'
import type { User } from '@/types/User'
import type { Table } from '@/types/Table'
import type { Bill } from '@/types/Bill'

const userStore = useUserStore()
const payDeskStore = usePayDeskStore()

const product = ref<Product>()
const change = ref<number>(0)
const isUserLoggedInPayDesk = ref<boolean>(false)
const paydesk = ref<PayDesk | null>(null)
const user = ref<User | null>(userStore.user)
const selectedTable = ref<Table | null>(null)


const checkIsUserLoggdInPayDesk = () => {
    if(user.value){
        isUserLoggedInPayDesk.value =  payDeskStore.payDesks.some(it => it.userId === user.value?.uid)
    }
    if(isUserLoggedInPayDesk){
        const paydesk_ = payDeskStore.payDesks.find(it => it.userId === userStore.user?.uid)
        if(paydesk_){
            paydesk.value = paydesk_
        }
    }
}
checkIsUserLoggdInPayDesk()
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

const onBillPrinting = (bill: Bill) => {
    console.log('billPrinting: ', bill)
    selectedTable.value = null
}
</script>
