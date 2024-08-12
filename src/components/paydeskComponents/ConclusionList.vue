<template>
    <div class="w-full font-merienda">
        <CustomDialog background-color="bg-white" :show-dialog="showDialog" @update="onShowDialogUpdate">
            <ConclusionDetail v-if="conclusion" :conclusion="conclusion" @cancel="onConclusionDetailsCancelClicked"></ConclusionDetail>
        </CustomDialog>
        <div class="w-full flex flex-col gap-2">
            <div class="w-full flex flex-row gap-2 justify-center">
                <div class="inline-block">
                    <InputLabelV2
                        label="Početak:"
                        type="date"
                        :value="startDate"
                        @update="onStartDateChanged"
                    ></InputLabelV2>
                </div>
                <div class="inline-block">
                    <InputLabelV2
                        label="Kraj:"
                        type="date"
                        :value="endDate"
                        @update="onEndDateChanged"
                    ></InputLabelV2>
                </div>
            </div>
            <div class="w-full" v-if="payDeskStore.conclusions.length">
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                    <RoundedCard
                        v-for="conclusion in payDeskStore.conclusions" :key="conclusion.id"
                        class="bg-gray-100 hover:bg-gray-400 cursor-pointer"
                        @click="onConclusionClicked(conclusion)"
                    >
                        <div class="flex flex-row gap-2">
                            <OneLabelAndDataTagInRow label="Br. Zaključka:" :data="conclusion.number.toString() + ' ' + conclusion.paydeskName"></OneLabelAndDataTagInRow>
                            <OneLabelAndDataTagInRow label="Iznos:" :data="conclusion.totalCash.toString() + ' €'"></OneLabelAndDataTagInRow>
                            <OneLabelAndDataTagInRow label="Broj stavki:" :data="conclusion.conclusionItems.length.toString()"></OneLabelAndDataTagInRow>
                        </div>
                    </RoundedCard>
                </div>
            </div>
            <div v-else class="w-full flex flex-row justify-center">
                <p class="text-xl"> Nema zaključaka za zadani raspon</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { usePayDeskStore } from '@/stores/payDeskStore'
import RoundedCard from '../cards/RoundedCard.vue'
import OneLabelAndDataTagInRow from '../dataTags/OneLabelAndDataTagInRow.vue'
import ConclusionDetail from './ConclusionDetail.vue'
import InputLabelV2 from '../inputs/InputLabelV2.vue'
import { useUserStore } from '@/stores/UserStore'
import CustomDialog from '../dialogs/CustomDialog.vue'
import { ref } from 'vue'
import type { User } from '@/types/User'
import type { Conclusion } from '@/types/Conclusion'
import { isEmployee } from '@/helpers/isEmployee'
import { inputDateToString, storageDateToInputString } from '@/helpers/dateFormatterFun'

const payDeskStore = usePayDeskStore()
const userStore = useUserStore()

const showDialog = ref<boolean>(false)
const conclusion = ref<Conclusion | null>(null)
const user = ref<User | null>(userStore.user)
const startDate = ref<string>(new Date().toLocaleDateString('sv-SE'))
const endDate = ref<string>(new Date().toLocaleDateString('sv-SE'))

if(user.value && isEmployee(user.value)){
    payDeskStore.fetchConclusions(startDate.value, endDate.value)
}else{
    payDeskStore.conclusions = []
}

const onConclusionClicked = (conclusion_: Conclusion) => {
    conclusion.value = conclusion_
    showDialog.value = true
}
const onShowDialogUpdate = (showDialogUpdate: boolean) => {
    showDialog.value = showDialogUpdate
}
const onConclusionDetailsCancelClicked = () => {
    showDialog.value = false
}
const onStartDateChanged = (value: string) => {
    startDate.value = value
    payDeskStore.fetchConclusions(startDate.value, endDate.value)
}
const onEndDateChanged = (value: string) => {
    endDate.value = value
    payDeskStore.fetchConclusions(startDate.value, endDate.value)
}
</script>
