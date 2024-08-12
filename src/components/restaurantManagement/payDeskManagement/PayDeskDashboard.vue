<template>
    <div class="flex flex-row gap-2 font-merienda">
        <div class="w-full max-w-lg">
            <RoundedCard>
                <div v-if="selectedPaydesk" class="w-full grid grid-cols-1">
                    <div class="col-span-1">
                        <PayDeskManagementInterface :payDesk="selectedPaydesk"></PayDeskManagementInterface>
                    </div>
                </div>
            </RoundedCard>
        </div>
        <div class="w-full max-w-xs">
            <div class="w-full grid grid-cols-1">
                <div class="col-span-1">
                    <PayDeskList @paydesk="onPayDeskSelected"></PayDeskList>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import RoundedCard from '@/components/cards/RoundedCard.vue'
import PayDeskManagementInterface from './PayDeskManagementInterface.vue'
import PayDeskList from './PayDeskList.vue'
import { usePayDeskStore } from '@/stores/payDeskStore'
import { ref, watch } from 'vue'
import type { PayDesk } from '@/types/PayDesk'
const payDeskStore = usePayDeskStore()
const selectedPaydesk = ref<PayDesk | null>(null)

if(payDeskStore.payDesks){
    selectedPaydesk.value = payDeskStore.payDesks[0]
}

watch(payDeskStore.payDesks, (newPayDesksLenght) => {
    console.log('watch selectedpaydesk')
    if(payDeskStore.payDesks.length){
        selectedPaydesk.value = payDeskStore.payDesks[0]
    }
})

const onPayDeskSelected = (PayDesk: PayDesk) => {
    selectedPaydesk.value = PayDesk
}
</script>