<template>
    <div class="w-full flex flex-col gap-2 font-merienda">
        <div class="flex flex-row justify-center">
            <p class="text-red-600">Niste prijavljeni u blagajnu</p>
        </div>
        <div class="w-full flex flex-col gap-2">
            <div
                v-for="payDesk in payDeskStore.payDesks" :key="payDesk.id"
                class="w-full rounded-lg bg-gray-300 hover:bg-gray-400 p-2"
            >   
                <div v-if="!payDesk.isInUse" class="w-full flex flex-row justify-between items-center">
                    <p>{{ payDesk.name }}</p>
                    <FilledButton 
                        label="Prijavi se"
                        @confirm="onLogIn(payDesk.id)"
                    >
                        <span class="material-symbols-outlined">login</span>
                    </FilledButton>
                </div>
                <div v-else class="w-full flex flex-row gap-2 items-center p-2">
                    <p>{{ payDesk.name }}</p>
                    <p>{{ payDesk.userId }}</p>
                    <p class="mx-auto">{{ 'Prijavljen: '+ userStore.getUserById(payDesk.userId)?.firstName + ' ' +  userStore.getUserById(payDesk.userId)?.lastName}}</p>
                    <div class="pl-4 w-4 h-4 rounded-full bg-green-500"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/UserStore"
import { usePayDeskStore } from "../../stores/payDeskStore"
import FilledButton from "../buttons/FilledButton.vue"
import type { PayDesk } from "@/types/PayDesk"
import { ref, watch } from "vue"

const payDeskStore = usePayDeskStore()
const userStore = useUserStore()
const emit = defineEmits<{
    (e:'logIn', payDeskId: string): void
}>()

const payDesks = ref<PayDesk[]>(payDeskStore.payDesks)

watch(payDeskStore.payDesks, (newPayDesks) => {
    console.log('watch in logiIn to paydesk')
    payDesks.value = newPayDesks
})
const onLogIn = (payDeskId: string) => {
    console.log('logIn in paydesk')
    emit('logIn', payDeskId)
}
</script>