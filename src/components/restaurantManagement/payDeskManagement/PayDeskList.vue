<template>
    <RoundedCard class="font-merienda">
        <div class="flex items-center justify-center w-full mb-2">
            <p>Blagajne</p>
        </div>
        <RoundedCard  class="border border-gray-300">
            <div v-if="payDeskStore.payDesks" class="flex flex-col gap-2">
                <div
                    v-for="paydesk in payDeskStore.payDesks" :key="paydesk.id"
                    @click="onPayDeskClicked(paydesk)"
                    class="flex flex-row w-full p-2 min-h-11 rounded-lg bg-gray-300 hover:bg-gray-400 cursor-pointer">
                    <div class="w-full flex flex-row items-center justify-between px-2 py-2">
                        <p class="font-bold">{{ paydesk.name }}</p>
                        <div :class="[
                            'w-4 h-4 rounded-full',
                            paydesk.isInUse ? 'bg-green-500' : 'bg-red-500'
                            ]"
                        >
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="w-full flex flex-col items-center gap-2">
                    <p class="text-red-500">Niti jedna blagajna nije kreirana</p>
                    <RouterLink 
                        :to="{ name: 'AddPayDesk'}"
                    >
                        <div class="bg-green-500 p-2 rounded-lg"><p>Kreiraj</p></div>
                    </RouterLink>
            </div>
        </RoundedCard>
    </RoundedCard>
</template>

<script setup lang="ts">
import RoundedCard from '@/components/cards/RoundedCard.vue'
import { usePayDeskStore } from '@/stores/payDeskStore'
import type { PayDesk } from '@/types/PayDesk'

const payDeskStore = usePayDeskStore()

const emit = defineEmits<{
    (e:'paydesk', payDesk: PayDesk): void
}>()

const onPayDeskClicked = (payDesk: PayDesk) => {
    emit('paydesk', payDesk)
}
</script>