<template>
    <div class="">
        <PayDeskInterface @change="onConfirm"></PayDeskInterface>

    </div>
</template>

<script setup lang="ts">
import { usePayDeskStore } from '@/stores/payDeskStore'
import PayDeskInterface from './PayDeskInterface.vue'
import type { PayDesk } from '@/types/PayDesk'


const payDeskStore = usePayDeskStore()
const onConfirm = (payDesk: PayDesk, oldPayDesk: PayDesk | null) => {
    console.log('in add paydesk vue')
    if(!oldPayDesk){
        console.log('in if')
        payDeskStore.addPayDesk(payDesk)
    }
}
</script>