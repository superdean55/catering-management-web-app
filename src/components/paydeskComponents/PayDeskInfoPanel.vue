<template>
    
    <div v-if="userStore.user" class="w-full flex flex-col gap-2">
        <AlertDialog 
            :showDialog="isVisible" 
            title="Blagajna"
            :message="message"
            @confirm="onDialogConfirm"
            @reject="onDialogReject"
        ></AlertDialog>
        <div class="flex flex-row items-center">
            <p class="text-2xl font-bold">{{ paydesk.name }}</p>
            <div class="w-4 mx-auto"></div>
            <FilledButton 
                label="Zaključak" 
                @confirm="onShowConclusionDialog" 
                :disabled="!paydesk.bills.length || paydesk.isDisabled ? true : false"
            >
                <span class="material-symbols-outlined">done_all</span>
            </FilledButton>
            <div class="w-4"></div>
            <FilledButton 
                label="Odjava" 
                @confirm="onShowLogOutDialog" 
                :disabled="paydesk.bills.length || paydesk.isDisabled ? true : false"
            >
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
            <OneLabelAndDataTagInRow 
                class="col-span-1"
                label="Prijavljen:" 
                :data="paydesk.logInDate"
            ></OneLabelAndDataTagInRow>
        </div>
    </div>
</template>

<script setup lang="ts">
import OneLabelAndDataTagInRow from '../dataTags/OneLabelAndDataTagInRow.vue'
import FilledButton from '../buttons/FilledButton.vue'
import AlertDialog from '../dialogs/AlertDialog.vue'
import { useUserStore } from '@/stores/UserStore'
import { usePayDeskStore } from '@/stores/payDeskStore'
import type { PayDesk } from '@/types/PayDesk'
import { ref, watch } from 'vue'

const props = defineProps<{
    payDesk: PayDesk
}>()

const userStore = useUserStore()
const payDeskStore = usePayDeskStore()

const paydesk = ref<PayDesk>(props.payDesk)
const isVisible = ref<boolean>(false)
const message = ref<string>('')
const dialogAction = ref<string>('')

watch(props.payDesk, (newPayDesk) => {
    paydesk.value = newPayDesk
})
function showDialog(dialogMessage: string, action: string){
    isVisible.value = true
    dialogAction.value = action
    message.value = dialogMessage
}
const onShowLogOutDialog = () => {
    showDialog('Jeste li sigurni da se želite odjaviti?', 'log_out')
}
const onShowConclusionDialog = () => {
    showDialog('Jeste li sigurni da želite napraviti zaključak blagajne?', 'conclusion')
}
const onDialogConfirm = () => {
    if(userStore.user && paydesk.value){
        if(dialogAction.value ==='log_out'){
            payDeskStore.logOutFromPayDesk(paydesk.value.id)
        }
        if(dialogAction.value === 'conclusion'){

        }
    }
    resetDialog()
}
const onDialogReject = () => {
    resetDialog()
}
function resetDialog(){
    isVisible.value = false
    dialogAction.value = ''
    message.value =''
}

</script>
