<template>
    <div class="w-full font-merienda">
        <div class="w-full flex flex-col gap-2">
            <div class="w-full flex flex-row items-center justify-between">
                <p class="text-2xl font-bold">{{ paydesk.name }}</p>
                <div class="h-4 w-4 rounded-full" :class="paydesk.isInUse ? 'bg-green-500' : 'bg-red-600'"></div>
            </div>
            <div v-if="user && payDesk.isInUse" class="w-full flex flex-col gap-2">
                
                <TwoLabelAndDataTagInRow
                    first-label="Prijavljen:"
                    :first-data="user.firstName + ' ' + user.lastName"
                    second-label="Vrijeme prijave:"
                    :second-data="payDesk.logInDate"
                    >
                </TwoLabelAndDataTagInRow>
                
                <div class="flex flex-row justify-end gap-2">
                    <FilledButton 
                        label="Odjavi korisnika" 
                        :disabled="paydesk.conclusionItems.length || paydesk.isDisabled ? true : false"
                        @confirm="onLogOut"
                    ></FilledButton>
                    <FilledButton label="Zaključak" :disabled="!paydesk.conclusionItems.length || paydesk.isDisabled ? true : false" @confirm="onConclusion"></FilledButton>
                </div>
            </div>
            <div class="w-full flex flex-col gap-1 py-2">
                <Switch label="Onemoguči blagajnu" :value="isPayDeskDisabled" @update="onPayDeskDisabledUpdate"/>
                <p v-if="paydesk.isDisabled" class="text-red-500">blagajna onemogučena</p>
            </div>
            <div class="w-full h-px bg-black"></div>
            <div class="w-full flex flex-col">
                <p>Radno vrijeme blagajne</p>
                <TwoLabelAndDataTagInRow 
                    first-label="od:" 
                    :first-data="paydesk.startOfWorkingHours"
                    second-label="do:"
                    :second-data="paydesk.endOfWorkingHours"
                    >
                </TwoLabelAndDataTagInRow>
            </div>
            
            <div class="w-full">
                <OneLabelAndDataTagInRow label="Polog:" :data="paydesk.deposite + ' €'"></OneLabelAndDataTagInRow>
            </div>
            <div class="flex flex-row justify-end pr-2">
                <RouterLink 
                    :to="{ name: 'EditPayDesk', params: { id: paydesk.id }}">
                    <FilledButton label="Izmjeni" background-color="bg-orange-700" hoverColor="hover:bg-orange-800" text-color="text-gray-100">
                        <span class="material-symbols-outlined">edit</span>
                    </FilledButton>
                </RouterLink>
            </div>
        </div>
        
    </div>
</template>

<script setup lang="ts">
import { usePayDeskStore } from '@/stores/payDeskStore'
import type { PayDesk } from '@/types/PayDesk'
import TwoLabelAndDataTagInRow from '@/components/dataTags/TwoLabelAndDataTagInRow.vue'
import OneLabelAndDataTagInRow from '@/components/dataTags/OneLabelAndDataTagInRow.vue'
import FilledButton from '@/components/buttons/FilledButton.vue'
import Switch from '@/components/buttons/Switch.vue'
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/UserStore'
import type { User } from '@/types/User'
import { Role } from '@/types/Role'
const payDeskStore = usePayDeskStore()
const userStore = useUserStore()

const prop = defineProps<{
    payDesk: PayDesk
}>()

const paydesk = ref<PayDesk>(prop.payDesk)
const id = ref<string>(prop.payDesk.id)
const isPayDeskDisabled = ref<boolean>(prop.payDesk.isDisabled)

const user = ref<User | null>(userStore.getUserById(prop.payDesk.userId))
console.log('user je',user.value)
watch(() => prop.payDesk,(newPayDesk) => {
    paydesk.value = newPayDesk
    isPayDeskDisabled.value = newPayDesk.isDisabled
    user.value = userStore.getUserById(prop.payDesk.userId)
})
watch(payDeskStore.payDesks, () => {
    const paydesk_ = payDeskStore.getPayDeskById(paydesk.value.id)
    if(paydesk_){
        paydesk.value = paydesk_
        isPayDeskDisabled.value = paydesk_.isDisabled
        user.value = userStore.getUserById(prop.payDesk.userId)
    }
})
const onPayDeskDisabledUpdate = (value: boolean) => {
    payDeskStore.disablePayDesk(paydesk.value.id, value)
}
const onLogOut = () => {
    if(userStore.user?.role === Role.admin && !paydesk.value.conclusionItems.length){
        payDeskStore.logOutFromPayDesk(paydesk.value.id)
    }
}
const onConclusion = () => {
    if(userStore.user?.role === Role.admin && paydesk.value.conclusionItems.length && user.value){
        payDeskStore.conclusion(paydesk.value, user.value)
    }
}
</script>
