<template>
    <div class="mx-auto max-w-xl font-merienda">
        <RoundedCard>
            <div class="flex flex-col gap-2">
                <div class="w-full flex flex-row justify-center">
                    <p class="font-bold text-xl">Dodaj Novu blagajnu</p>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <InputLabelV2
                        label="Ime blagajne:"
                        :value="name"
                        :error="nameErrorMessage"
                        @update="onNameChanged"
                        type="text"
                    >
                    </InputLabelV2>
                    <div class="flex flex-row">
                        <InputLabelV2
                            label="Polog:"
                            :value="deposit"
                            :error="depositErrorMessage"
                            @update="onDepositChanged"
                            type="number"
                        >
                        </InputLabelV2>
                        <p class="mt-auto ml-2">€</p>
                    </div>
                </div>
                <div class="w-full pt-2">
                    <p class="font-bold">Radno vrijeme</p>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <InputLabelV2
                        label="Početak:"
                        :value="startOfWorkingHours"
                        :error="startOfWorkingHoursErrorMessage"
                        @update="onStartOfWorkingHoursChanged"
                        type="time"
                    >
                    </InputLabelV2>
                    <InputLabelV2
                        label="Kraj:"
                        :value="endOfWorkingHours"
                        :error="endOfWorkingHoursErrorMessage"
                        @update="onEndOfWorkingHoursChanged"
                        type="time"
                    >
                    </InputLabelV2>
                </div>
                <div v-if="payDesk" class="w-full flex flex-row justify-end mt-2">
                    <ConfirmButton label="Ažuriraj" @confirm="onDelete">
                        <span class="material-symbols-outlined">delete</span>
                    </ConfirmButton>
                    <div class="w-2"></div>
                    <ConfirmButton label="Ažuriraj" @confirm="onConfirm">
                        <span class="material-symbols-outlined">update</span>
                    </ConfirmButton>
                </div>
                <div v-else class="w-full flex flex-row justify-end mt-2">
                    <ConfirmButton label="Kreiraj Blagajnu" @confirm="onConfirm">
                        <span class="material-symbols-outlined">add</span>
                    </ConfirmButton>
                </div>
            </div>
        </RoundedCard>
    </div>
</template>

<script setup lang="ts">
import RoundedCard from '@/components/cards/RoundedCard.vue'
import InputLabelV2 from '@/components/inputs/InputLabelV2.vue'
import ConfirmButton from '@/components/buttons/ConfirmButton.vue'
import { ref } from 'vue'
import { isValidInput } from '@/helpers/isValidInput'
import { isPositiveNumber } from '@/helpers/isPositiveNumber'
import { isTwoDecimalNumber } from '@/helpers/isTwoDecimalNumber'
import { isValidTime } from '@/helpers/isValidTime'
import type { PayDesk } from '@/types/PayDesk'
import type { FieldValue } from 'firebase/firestore'

const props = defineProps<{
    payDesk?: PayDesk
}>()
const emit = defineEmits<{
  (e: 'delete', productId: string): void
  (e: 'change', payDesk: PayDesk, oldPayDesk: PayDesk | null): void
}>()
const name = ref<string>('')
const nameErrorMessage = ref<string>('')
const deposit = ref<string>('100.00')
const depositErrorMessage = ref<string>('')
const startOfWorkingHours = ref<string>('07:00')
const startOfWorkingHoursErrorMessage = ref<string>('')
const endOfWorkingHours = ref<string>('23:00')
const endOfWorkingHoursErrorMessage = ref<string>('')

if(props.payDesk){
    name.value = props.payDesk.name
    deposit.value = props.payDesk.deposite
    startOfWorkingHours.value = props.payDesk.startOfWorkingHours
    endOfWorkingHours.value = props.payDesk.endOfWorkingHours
}
const onNameChanged = (value: string) => {
    nameErrorMessage.value = ''
    name.value = value
}
const onDepositChanged = (value: string) => {
    depositErrorMessage.value = ''
    deposit.value = value
}
const onStartOfWorkingHoursChanged= (value: string) => {
    startOfWorkingHoursErrorMessage.value = ''
    startOfWorkingHours.value = value
}
const onEndOfWorkingHoursChanged = (value: string) => {
    endOfWorkingHoursErrorMessage.value = ''
    endOfWorkingHours.value = value
}
const onDelete = () =>{
    if(props.payDesk){
        emit('delete', props.payDesk.id)
    }
}
const onConfirm = () => {
    var isValid = true
    if(!isValidInput(name.value)){
        nameErrorMessage.value = 'min. 2, max. 50 znakova'
        isValid = false
    }
    if(isPositiveNumber(deposit.value)){
        const number = parseFloat(deposit.value)
        deposit.value = number.toFixed(2)
    }
    if(!isTwoDecimalNumber(deposit.value)){
        depositErrorMessage.value = 'Neispravan unos'
        isValid = false
    }
    if(!isValidTime(startOfWorkingHours.value)){
        startOfWorkingHoursErrorMessage.value = 'neispravan format'
        isValid = false
    }
    if(!isValidTime(endOfWorkingHours.value)){
        endOfWorkingHoursErrorMessage.value = 'neispravan format'
        isValid = false
    }
    if(isValid){
        console.log('is valid')
        const payDesk = {
            id: '',
            name: name.value,
            deposite: deposit.value,
            startOfWorkingHours: startOfWorkingHours.value,
            endOfWorkingHours: endOfWorkingHours.value,
            totalCash: '',
            userId: '',
            bills: [],
            isInUse: false,
            creatinoDate: '',
            timestamp: null as FieldValue | null,
            }as PayDesk
        if(props.payDesk){
            console.log('edit')
            emit('change', payDesk, props.payDesk)    
        }else{
            console.log('paydesk add')
            console.log('paydesk object = ',payDesk)
            emit('change', payDesk, null)
        }
    }
}

</script>