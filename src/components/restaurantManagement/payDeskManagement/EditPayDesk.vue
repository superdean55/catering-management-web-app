<template>
    <div class="mx-auto">
        <PayDeskInterface 
            v-if="payDesk" 
            :payDesk="payDesk"
            @delete="onDelete"
            @change="onConfirm"
        >
        </PayDeskInterface>

    </div>
</template>

<script setup lang="ts">
import { usePayDeskStore } from '@/stores/payDeskStore'
import PayDeskInterface from './PayDeskInterface.vue'
import type { PayDesk } from '@/types/PayDesk'

import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const payDeskStore = usePayDeskStore()

const route = useRoute()

const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
const payDesk = ref(payDeskStore.getPayDeskById(id))

watch(() => route.params.id, (newId) => {
  const id = Array.isArray(newId) ? newId[0] : newId
  payDesk.value = payDeskStore.getPayDeskById(id)
})

const onConfirm = (payDesk: PayDesk, oldPayDesk: PayDesk | null) => {
    console.log()
    if(oldPayDesk){
        
    }
}
const onDelete = (paydeskId: string) => {
    payDeskStore.deletePayDesk(paydeskId)
}
</script>