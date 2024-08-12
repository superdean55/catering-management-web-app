<template>
    <div class="max-w-4xl">
        <div class="w-full grid grid-cols-2 gap-2">
            <RoundedCard>
                <div class="grid grid-cols-4 gap-2">
                    <div class="col-span-4">
                        <p class="font-bold">Primka: osnovne Informacije</p>
                    </div>
                    <InputLabelV2
                        class="col-span-4"
                        type="text"
                        label="ime Dobavljača:"
                        :value="name"
                        @update="onNameChanged"
                        :error="nameErrorMessage"
                    ></InputLabelV2>
                    <InputLabelV2
                        class="col-span-3"
                        type="number"
                        label="oib Dobavljača:"
                        :value="oib"
                        @update="onOibChanged"
                        :error="oibErrorMessage"
                    ></InputLabelV2>
                    <InputLabelV2
                        class="col-span-2"
                        type="date"
                        label="Datum:"
                        :value="date"
                        @update="onDateChanged"
                        :error="dateErrorMessage"
                    ></InputLabelV2>
                    <InputLabelV2
                        class="col-span-2"
                        type="number"
                        label="Broj primke:"
                        :value="receiptNumber"
                        :disabled="true"
                    ></InputLabelV2>
                    <InputLabelV2
                        class="col-span-4"
                        type="text"
                        label="Oznaka dokumenta:"
                        :value="documentName"
                        @update="onDocumentNameChanged"
                        :error="documentNameErrorMessage"
                    ></InputLabelV2>
                    <div class="h-2 col-span-4"></div>
                    
                </div>
            </RoundedCard>
            <ReceiptItemInterface    
                @add="onAddReceiptItem"
                @update="onUpdateReceiptItem"
                :oldReceiptItem="oldReceiptItem"
            >
            </ReceiptItemInterface>
            <RoundedCard class="col-span-2">
                <div class="flex flex-col w-full">
                    <ReceiptItemsList 
                        :receiptItems="receiptItems"
                        @remove="onRemoveReceiptItem"
                        @update="onUpdateReceiptItemFromList"
                    >
                    </ReceiptItemsList>
                    <div class="flex flex-row justify-center">
                        <p class="text-red-600">{{ listErrorMessage }}</p>
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
        
    </div>
</template>

<script setup lang="ts">
import RoundedCard from '@/components/cards/RoundedCard.vue';
import InputLabelV2 from '@/components/inputs/InputLabelV2.vue';
import ConfirmButton from '@/components/buttons/ConfirmButton.vue';
import ReceiptItemInterface from './ReceiptItemInterface.vue'
import { ref } from 'vue';
import { isValidInput } from '@/helpers/isValidInput';
import { isValidOib } from '@/helpers/isValidOib';
import ReceiptItemsList from './ReceiptItemsList.vue';
import type { ReceiptItem } from '@/types/ReceiptItem';
import { generateId } from '@/helpers/generateId';
import type { Receipt } from '@/types/Receipt';
import { useReceiptStore } from '@/stores/ReceiptStore'

const receiptStore = useReceiptStore()

const name = ref<string>('')
const nameErrorMessage = ref<string>('')
const oib = ref<string>('')
const oibErrorMessage = ref<string>('')
const receiptNumber = ref<string>(receiptStore.receipts.length.toString())
const documentName = ref<string>('')
const documentNameErrorMessage = ref<string>('')
const receiptItems = ref<ReceiptItem[]>([])
const oldReceiptItem = ref<ReceiptItem | null>(null)
const listErrorMessage = ref<string>('')
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

const onAddReceiptItem = (receiptItem: ReceiptItem) => {
    console.log(`add receipt item: ${receiptItem}`)
    listErrorMessage.value = ''
    receiptItems.value.push(receiptItem)
}

const onUpdateReceiptItem = (receiptItem: ReceiptItem) => {
    const index = receiptItems.value.findIndex(it => it.id === receiptItem.id)
    console.log('index ', index)
    if(index !== -1){
        receiptItems.value[index] = receiptItem
    }
    oldReceiptItem.value = null
}
const onRemoveReceiptItem = (index: number) => {
    receiptItems.value.splice(index, 1)
}
const onUpdateReceiptItemFromList = (index: number) => {
    console.log('update is clicked')
    oldReceiptItem.value = receiptItems.value[index]
}
const onConfirm = () => {
    var isValid = true
    if(!isValidInput(name.value)){
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
    if(!isValidInput(documentName.value)){
        documentNameErrorMessage.value = 'minimalno 2 slova'
        isValid = false
    }
    if(!receiptItems.value.length){
        listErrorMessage.value = 'lista mora sadržavati barem jednu sirovinu'
        isValid = false
    }
    if(isValid){
        const newReceipt: Receipt = {
            id: '',
            supplierName: name.value,
            supplierOib: oib.value,
            documentDate: date.value,
            receiptNumber: receiptNumber.value,
            documentIdentifier: documentName.value,
            receiptItems: receiptItems.value,
            uploadDate: formatDate()
            }as Receipt

        console.log(newReceipt)
        receiptStore.addReceipt(newReceipt)
        console.log('podaci ispravni')
    }
}
</script>