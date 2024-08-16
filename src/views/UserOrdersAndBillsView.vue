<template>
    <main class="w-full h-screen bg-slate-300 p-0">
        <div class="h-10 w-full"></div>
        <div class="w-full p-2 md:p-4">
            <RoundedCard class="w-full" :style="{height: cardHeight + 'px'}">
                <div v-if="isSmallScreen" class="w-full grid grid-cols-1 gap-2">
                    <SmallScreenNav :icons="navIconsRef" :external-change="change" @selected="onIconSelected"></SmallScreenNav>
                    <UserOrderList
                    v-if="selectedIcon === 'Narudžbe'"
                    :height="cardHeight"
                    @card="onOrderCard"
                    />
                    <UserBillList
                    v-else-if="selectedIcon === 'Računi'"
                    :height="cardHeight"
                    @card="onBillCard"
                    />
                    <UserBillDetails
                    v-else-if="selectedIcon === 'Detalji' && isBill(selectedItem)"
                    :bill="selectedItem"
                    :height="cardHeight"
                    />
                    <UserOrderDetails
                    v-else-if="selectedIcon === 'Detalji' && isOrder(selectedItem)"
                    :order="selectedItem"
                    :height="cardHeight"
                    />
                    <div v-else class="w-full flex flex-row justify-center">
                        <p class="mt-4 text-xs md:text-sm text-red-500">
                            Nije označen niti jedan račun ili narudžba X
                        </p>
                    </div>
                </div>
                <div v-else class="w-full grid grid-cols-3 gap-2"> 
                    <UserOrderList :height="cardHeight" @card="onOrderCard"></UserOrderList>
                    <UserBillList :height="cardHeight" @card="onBillCard"></UserBillList>
                    <UserBillDetails v-if="isBill(selectedItem)" :bill="selectedItem" :height="cardHeight"></UserBillDetails>
                    <UserOrderDetails v-else-if="isOrder(selectedItem)" :order="selectedItem" :height="cardHeight"></UserOrderDetails>
                    <div v-else class="w-full flex flex-row justify-center">
                        <p class="mt-4 text-xs md:text-sm text-red-500">Nije označen niti jedan račun ili narudžba ??</p>
                    </div>
                </div>
            </RoundedCard>
        </div>
    </main>
</template>

<script setup lang="ts">
import RoundedCard from '@/components/cards/RoundedCard.vue'
import { useScreenStore } from '@/stores/ScreenStore'
import { computed, ref } from 'vue'
import UserOrderList from '@/components/user_orders_and_bills/UserOrderList.vue'
import UserBillList from '@/components/user_orders_and_bills/UserBillList.vue'
import UserBillDetails from '@/components/user_orders_and_bills/UserBillDetails.vue'
import UserOrderDetails from '@/components/user_orders_and_bills/UserOrderDetails.vue'
import SmallScreenNav from '@/components/phone_nav/SmallScreenNav.vue'
import type { Order } from '@/types/Order'
import type { Bill } from '@/types/Bill'
import type { NavIcon } from '@/types/NavIcon'

const screenStore = useScreenStore()
const selectedItem = ref<Bill | Order | null>(null)
const selectedIcon = ref<string>('Narudžbe')
const change = ref<number>(0)

const icons = [
  { icon: 'article', title: 'Narudžbe', isSelected: true } as NavIcon,
  { icon: 'article', title: 'Računi', isSelected: false } as NavIcon,
  { icon: 'article', title: 'Detalji', isSelected: false } as NavIcon
]

const navIconsRef = ref<NavIcon[]>(icons)

const cardHeight = computed(() => {
    if(isSmallScreen){
        return screenStore.screenHeight - 60
    }
    return screenStore.screenHeight - 72
})

const isSmallScreen = computed(() => {
    return screenStore.screenWidth < 768
})

const onOrderCard = (order: Order) => {
    selectedItem.value = order
    changeSelection('Detalji')
    change.value ++
}

const onBillCard = (bill: Bill) => {
    selectedItem.value = bill
    changeSelection('Detalji')
    change.value ++
}
const onIconSelected = (selectedIcon_: string) =>{
    selectedIcon.value = selectedIcon_
}

function isBill(item: any): item is Bill {
    return item && typeof item.JIR === 'string'
}
function isOrder(item: any): item is Order {
    return item && typeof item.isApproved === 'boolean'
}

function changeSelection(title: string){
    navIconsRef.value.forEach(icon => {
        if(icon.title === title){
            icon.isSelected = true
        }else{
            icon.isSelected = false
        }
    })
}
</script>