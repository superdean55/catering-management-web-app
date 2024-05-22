<template>
    <div class="max-w-3xl">
        <RoundedCard>
            <div class="grid grid-cols-1">
                <div class="flex flex-row justify-center mb-4 mt-2">
                    <p class="font-bold text-2xl">Primka</p>
                </div>
                <div class="grid grid-cols-4 gap-2">
                    <div class="col-span-4 h-px bg-black"></div>
                    <div class="col-span-4">
                        <p>Osnovne Informacije:</p>
                    </div>
                    <InputLabelV2
                        class="col-span-2"
                        type="text"
                        label="ime Dobavljača:"
                        :value="name"
                        @update="onNameChanged"
                        :error="nameErrorMessage"
                    ></InputLabelV2>
                    <InputLabelV2
                        class="col-span-2"
                        type="number"
                        label="oib Dobavljača:"
                        :value="oib"
                        @update="onOibChanged"
                        :error="oibErrorMessage"
                    ></InputLabelV2>
                    <InputLabelV2
                        class="col-span-1"
                        type="date"
                        label="Datum:"
                        :value="date"
                        @update="onDateChanged"
                        :error="dateErrorMessage"
                    ></InputLabelV2>
                    <InputLabelV2
                        class="col-start-3"
                        type="number"
                        label="Broj primke:"
                        :value="receiptNumber"
                        :disabled="true"
                    ></InputLabelV2>
                    <InputLabelV2
                        class="col-span-3"
                        type="text"
                        label="Oznaka dokumenta:"
                        :value="documentName"
                        @update="onDocumentNameChanged"
                        :error="documentNameErrorMessage"
                    ></InputLabelV2>
                    <div class="h-2 col-span-4"></div>
                    <div class="col-span-4 h-px bg-black"></div>
                </div>
                <div class="flex felx-row justify-end">
                    <ConfirmButton
                        label="Spremi"
                        @confirm="onConfirm"
                    >
                    <span class="material-symbols-outlined">save</span>
                    </ConfirmButton>
                </div>
            </div>
        </RoundedCard>
    </div>
</template>

<script setup lang="ts">
import RoundedCard from '@/components/cards/RoundedCard.vue';
import InputLabelV2 from '@/components/inputs/InputLabelV2.vue';
import ConfirmButton from '@/components/buttons/ConfirmButton.vue';
import OneLabelAndDataTagInRow from '@/components/dataTags/OneLabelAndDataTagInRow.vue';
import { ref } from 'vue';
import { validateInputString } from '@/helpers/validateInputString';
import { isValidOib } from '@/helpers/isValidOib';

const name = ref<string>('')
const nameErrorMessage = ref<string>('')
const oib = ref<string>('')
const oibErrorMessage = ref<string>('')
const receiptNumber = ref<string>('0')
const documentName = ref<string>('')
const documentNameErrorMessage = ref<string>('')

const formatDate = (): string => {
    const date = new Date()
    return date.toISOString().split('T')[0];
}
const date = ref<string>(formatDate())
const dateErrorMessage = ref<string>('')


const onNameChanged = (value: string) => {
    name.value = value
    nameErrorMessage.value = ''
    console.log(name.value)
}
const onOibChanged = (value: string) => {
    oibErrorMessage.value = ''
    oib.value = value
}
const onDateChanged = (value: string) => {
    date.value = value
    dateErrorMessage.value = ''
    console.log(date.value)
    console.log(`date: ${new Date(date.value)}`)
}
const onDocumentNameChanged = (value: string) => {
    documentNameErrorMessage.value = ''
    documentName.value = value
    console.log(documentName.value)
}
const isFutureDate = (): boolean => {
      if (!date.value) return false;
      return new Date(date.value) > new Date()
}

const isOlderThanSevenDays = () => {
      if (!date.value) return false
      const input = new Date(date.value);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(new Date().getDate() - 7);
      return input < sevenDaysAgo;
}
const onConfirm = () => {
    var isValid = true
    if(!validateInputString(name.value)){
        nameErrorMessage.value = 'minimalno 2 slova'
        isValid = false
    }
    if(!isValidOib(oib.value)){
        oibErrorMessage.value = 'neispravan oib'
        isValid = false
    }
    if(isFutureDate()){
        dateErrorMessage.value = 'buduće vrijeme nije dozvoljeno'
        isValid = false
    }
    if(isOlderThanSevenDays()){
        dateErrorMessage.value = 'ne može biti starije od 7 dana'
        isValid = false
    }
    if(!validateInputString(documentName.value)){
        documentNameErrorMessage.value = 'minimalno 2 slova'
        isValid = false
    }
    if(isValid){
        console.log('podaci ispravni')
    }
}
</script>