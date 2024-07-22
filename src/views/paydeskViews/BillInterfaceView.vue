<template>
    <div class="w-full font-merienda">
        <RoundedCard class="max-w-5xl" v-if="isUserLoggedInPayDesk && paydesk">
            <div
                class="w-full grid grid-cols-7 gap-2">
                <PayDeskInfoPanel class="col-span-7" :payDesk="paydesk"></PayDeskInfoPanel>
                <ProductSelectionInterface class="col-span-3" @product="onProduct"></ProductSelectionInterface>
                <BillItemsInterface :product="product" :payDesk="paydesk" class="col-span-4"></BillItemsInterface>  
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
import { useUserStore } from '@/stores/UserStore'
import type { Product } from '@/types/Product'
import { ref, watch } from 'vue'
import { usePayDeskStore } from '@/stores/payDeskStore'
import type { PayDesk } from '@/types/PayDesk'

const product = ref<Product>()
const userStore = useUserStore()
const payDeskStore = usePayDeskStore()

const isUserLoggedInPayDesk = ref<boolean>(false)
const paydesk = ref<PayDesk | null>(null)


const checkIsUserLoggdInPayDesk = () => {
    isUserLoggedInPayDesk.value =  payDeskStore.payDesks.some(payDesk => payDesk.userId === userStore.user?.uid)
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
}
const onLogIn = (payDeskId: string) => {
    if(userStore.user){
        payDeskStore.loginToPayDesk(userStore.user.uid, payDeskId)
    }
}

</script>
