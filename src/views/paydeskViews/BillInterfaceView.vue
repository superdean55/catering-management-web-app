<template>
    <div class="w-full font-merienda">
        <RoundedCard class="max-w-5xl" v-if="isUserLoggedInPayDesk && paydesk">
            <div
                class="w-full grid grid-cols-7 gap-2">
                <div v-if="userStore.user" class="col-span-7 flex flex-col gap-2">
                    <div class="flex flex-row justify-between items-center">
                        <p class="text-2xl font-bold">{{ paydesk.name }}</p>
                        <FilledButton label="Odjava" @confirm="onLogOut">
                            <span class="material-symbols-outlined">logout</span>
                        </FilledButton>
                    </div>
                    <div class="grid grid-cols-3 w-full">
                        <OneLabelAndDataTagInRow 
                            class="col-span-1"
                            label="djelatnik:" 
                            :data="userStore.getUserById(paydesk.userId)?.firstName + ' ' + userStore.getUserById(paydesk.userId)?.lastName"
                        ></OneLabelAndDataTagInRow>
                        <OneLabelAndDataTagInRow 
                            class="col-span-1"
                            label="Stanje:" 
                            :data="paydesk.totalCash + ' €'"
                        ></OneLabelAndDataTagInRow>
                    </div>
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
import OneLabelAndDataTagInRow from '@/components/dataTags/OneLabelAndDataTagInRow.vue'
import PayDeskLogIn from '@/components/paydeskComponents/PayDeskLogIn.vue'
import FilledButton from '@/components/buttons/FilledButton.vue'
import { useUserStore } from '@/stores/UserStore'
import type { Product } from '@/types/Product'
import { ref, watch } from 'vue'
import { usePayDeskStore } from '@/stores/payDeskStore'
import { PayDesk } from '@/types/PayDesk'

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
const onLogOut = () => {
    if(userStore.user && paydesk.value){
        console.log('paydesk logOut id= ',paydesk.value.id)
        payDeskStore.logOutFromPayDesk(paydesk.value.id)
    }
}
</script>
