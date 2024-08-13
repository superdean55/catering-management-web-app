<template>
    <main class="w-full h-screen bg-slate-300 p-0">
        <div class="h-10 w-full"></div>
        <div class="w-full p-4">
            <RoundedCard class="w-full" :style="{height: cardHeight + 'px'}">
                <div class="w-full grid grid-cols-3 gap-2">
                    <UserOrderList :height="cardHeight" @card="onOrderCard"></UserOrderList>
                    <UserBillList :height="cardHeight" @card="onBillCard"></UserBillList>
                    <UserBillDetails v-if="isBill(selectedItem)" :bill="selectedItem"></UserBillDetails>
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
import type { Order } from '@/types/Order'
import type { Bill } from '@/types/Bill'

const screenStore = useScreenStore()
const selectedItem = ref<Bill | Order | null>(null)

const cardHeight = computed(() => {
    return screenStore.screenHeight - 72
})

const onOrderCard = (order: Order) => {
    selectedItem.value = order
}

const onBillCard = (bill: Bill) => {
    selectedItem.value = bill
}

function isBill(item: any): item is Bill {
  return item
}
</script>