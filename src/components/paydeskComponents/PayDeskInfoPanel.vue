<template>
    
    <div v-if="userStore.user" class="w-full flex flex-col gap-2">
        <AlertDialog 
            :showDialog="isVisible" 
            title="Blagajna"
            :message="message"
            @confirm="onDialogConfirm"
            @reject="onDialogReject"
        ></AlertDialog>
        <div class="flex gap-2 items-center" :style="{ flexDirection: screenStore.isSmallScreen ? 'column' : 'row' }">
            <p class="text-2xl font-bold">{{ paydesk.name }}</p>
            <div class="w-4 mx-auto" v-if="!screenStore.isSmallScreen"></div>
            <div class="flex flex-row gap-2">
                <FilledButton
                    label="Zaključak"
                    @confirm="onShowConclusionDialog"
                    :disabled="!paydesk.conclusionItems.length || paydesk.isDisabled ? true : false"
                >
                    <span class="material-symbols-outlined">done_all</span>
                </FilledButton>
                <FilledButton
                    label="Odjava"
                    @confirm="onShowLogOutDialog"
                    :disabled="paydesk.conclusionItems.length || paydesk.isDisabled ? true : false"
                >
                    <span class="material-symbols-outlined">logout</span>
                </FilledButton>
            </div>
        </div>
        <div class="grid gap-2 w-full" :class="screenStore.isSmallScreen ? 'grid-cols-1' : 'grid-cols-3'">
            <OneLabelAndDataTagInRow 
                class="col-span-1"
                label="Djelatnik:" 
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
                :data="paydesk.logInDate + ' ' + paydesk.logInTime"
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
import { useScreenStore } from '@/stores/ScreenStore'

const props = defineProps<{
    payDesk: PayDesk
}>()

const userStore = useUserStore()
const payDeskStore = usePayDeskStore()
const screenStore = useScreenStore()

const paydesk = ref<PayDesk>(props.payDesk)
const isVisible = ref<boolean>(false)
const message = ref<string>('')
const dialogAction = ref<string>('')

watch(() => props.payDesk, (newPayDesk) => {
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
        if(dialogAction.value === 'conclusion' && userStore.user.uid === paydesk.value.userId){
            payDeskStore.conclusion(paydesk.value, userStore.user)
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
