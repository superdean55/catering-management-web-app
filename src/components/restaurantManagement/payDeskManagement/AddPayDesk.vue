<template>
    <div class="w-full">
        <PayDeskInterface @change="onConfirm"></PayDeskInterface>

    </div>
</template>

<script setup lang="ts">
import { usePayDeskStore } from '@/stores/payDeskStore'
import PayDeskInterface from './PayDeskInterface.vue'
import type { PayDesk } from '@/types/PayDesk'


const payDeskStore = usePayDeskStore()
const onConfirm = (payDesk: PayDesk, oldPayDesk: PayDesk | null) => {
    if(!oldPayDesk){
        payDeskStore.addPayDesk(payDesk)
    }
}
</script>