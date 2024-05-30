<template>
    <RoundedCard class="border border-gray-500">
        <div class="inline-block">
            <div class="flex flex-col ">
                <div class="flex flex-row gap-2">
                    <InputLabelV2
                        class=""
                        label="Šifra:"
                        type="number"
                        :value="code"
                        @update="onCodeChanged"
                        >
                    </InputLabelV2>
                    <SelectBox
                    label="Jed. mjere:"
                    :option="unit"
                    :object="ArticleUnit"
                    @selectedValue="onSelectedUnit"
                    :disabled="true"
                    >
                    </SelectBox>
                </div>
                <CategoryBox
                    class=""
                    label="Ime:"
                    :option="rawMaterialId"
                    :object="rawMaterials"
                    @selectedValue="onSelectedMaterial"
                    :error="rawMaterialErrorMessage"
                    >
                </CategoryBox>
                <div class="flex flex-row">
                    <InputLabelV2
                        label="Količina:"
                        type="number"
                        :value="quantity"
                        @update="onQuantityChanged"
                        :error="qunatityErrorMessage"
                    >
                    </InputLabelV2>
                    <div class="flex flex-col justify-end ml-1">
                        <p>{{ rawMaterialById?.unit }}</p>
                        <div class="h-px"></div>
                        <div class="h-px"></div>
                    </div>
                </div>
                <div class="flex flex-row">
                    <InputLabelV2
                    label="Jed. cijena:"
                    type="number"
                    :value="pricePerUnit"
                    @update="onPricePerUnitChanged"
                    :error="pricePerUnitErrorMessage"
                    >
                    </InputLabelV2>
                    <div class="flex flex-col justify-end ml-1">
                        <p>€</p>
                        <div class="h-px"></div>
                        <div class="h-px"></div>
                    </div>
                </div>
                <div class="flex flex-row">
                    <InputLabelV2
                    label="Iznos:"
                    type="number"
                    :value="amount"
                    @update="onAmountChanged"
                    :error="amountErrorMessage"
                    >
                    </InputLabelV2>
                    <div class="flex flex-col justify-end ml-1">
                        <p>€</p>
                        <div class="h-px"></div>
                        <div class="h-px"></div>
                    </div>
                </div>
                
                <div class="flex felx-row justify-center">
                    <ConfirmButton
                        v-if="oldReceiptItem"
                        label="Ažuriraj"
                        @confirm="onConfirm"
                    >
                    <span class="material-symbols-outlined">update</span>
                    </ConfirmButton>
                    <ConfirmButton
                        v-else
                        label="Dodaj Sirovinu"
                        @confirm="onConfirm"
                    >
                    <span class="material-symbols-outlined">add</span>
                    </ConfirmButton>
                </div>
            </div>
        </div>
    </RoundedCard>
</template>

<script setup lang="ts">
import InputLabelV2 from '@/components/inputs/InputLabelV2.vue';
import CategoryBox from '@/components/inputs/CategoryBox.vue';
import SelectBox from '@/components/inputs/SelectBox.vue';
import RoundedCard from '@/components/cards/RoundedCard.vue';
import ConfirmButton from '@/components/buttons/ConfirmButton.vue';
import { ArticleUnit } from '@/types/ArticleUnit';
import { computed, ref, watch } from 'vue';
import { useArticleStore } from '@/stores/ArticleStor';
import { isTwoDecimalNumber } from '@/helpers/isTwoDecimalNumber';
import type { ReceiptItem } from '@/types/ReceiptItem';

const props = defineProps<{
    oldReceiptItem: ReceiptItem | null
}>()

const emit = defineEmits<{
  (e: 'confirm', rawMaterialId: string, quantity: string, pricePerUnit: string, amount: string, update: boolean): void
}>()

const articleStore = useArticleStore()
const rawMaterials = articleStore.rawMaterials
const rawMaterialId = ref<string>('')
const rawMaterialErrorMessage = ref<string>('')
const unit = ref<string>('')
const code = ref<string>('')
const quantity = ref<string>('')
const qunatityErrorMessage = ref<string>('')
const pricePerUnit = ref<string>('')
const pricePerUnitErrorMessage = ref<string>('')
const amount = ref<string>('')
const amountErrorMessage = ref<string>('')
const update = ref(false)

watch(() => props.oldReceiptItem,(newValue) => {
    console.log('watch is active in receipt item interface')
    if(props.oldReceiptItem){
        const rawMaterial = articleStore.rawMaterials.find(it => it.id === props.oldReceiptItem?.rawMaterialId)
        if(rawMaterial){
            code.value = rawMaterial.code
            unit.value = rawMaterial.unit
            rawMaterialId.value = rawMaterial.id
            quantity.value = props.oldReceiptItem.quantity
            pricePerUnit.value = props.oldReceiptItem.pricePerUnit
            amount.value = props.oldReceiptItem.amount
            update.value = true
        }
    }
})

const foundMaterialByCode = computed(() => {
    return articleStore.rawMaterials.find(it => it.code === code.value) || null
})

const rawMaterialById = computed(() => {
    console.log('computed')
    return articleStore.rawMaterials.find(it => it.id === rawMaterialId.value) || null
})

const onAmountChanged = (value: string) => {
    amount.value = value
    amountErrorMessage.value = ''
    console.log(`amount: ${amount.value}`)
    if (quantity.value) {
        const newPricePerUnit = Number(amount.value) / Number(quantity.value)
        pricePerUnit.value = newPricePerUnit.toFixed(2).toString()
        console.log(`pricePerUnit: ${pricePerUnit.value}`)
        quantity.value = formatToTwoDecimalPlaces(quantity.value)
    }
}
const onPricePerUnitChanged = (value: string) => {
    pricePerUnit.value = value
    pricePerUnitErrorMessage.value = ''
    console.log(`pricePerUnit: ${pricePerUnit.value}`)
    if(quantity.value){
        const newAmount = Number(quantity.value) * Number(pricePerUnit.value)
        amount.value = newAmount.toFixed(2).toString()
        quantity.value = formatToTwoDecimalPlaces(quantity.value)
        amountErrorMessage.value = ''
    }
}
const onQuantityChanged = (value: string) => {
    quantity.value = value
    qunatityErrorMessage.value = ''
    pricePerUnitErrorMessage.value = ''
    amountErrorMessage.value = ''
    console.log(`qunatity: ${quantity.value}`)
    if (pricePerUnit.value) {
        const newAmount = Number(quantity.value) * Number(pricePerUnit.value)
        amount.value = newAmount.toFixed(2).toString()
        console.log(`amount: ${amount.value}`)
    }else if(amount.value){
        const newPricePerUnit = Number(amount.value) / Number(quantity.value)
        pricePerUnit.value = newPricePerUnit.toFixed(2).toString()
    }
}
const onSelectedMaterial = (id: string)  => {
    rawMaterialId.value = id
    rawMaterialErrorMessage.value = ''
    console.log(`rawMaterialId: ${rawMaterialId.value}`)
    if(rawMaterialById.value){
        unit.value = rawMaterialById.value.unit
        code.value = rawMaterialById.value.code
    }
}
const onSelectedUnit = (value: string) => {
    unit.value = value
    console.log(`unit: ${unit.value}`)
}
const onCodeChanged = (value: string) => {
    code.value = value
    console.log(`code: ${code.value}`)
    if(foundMaterialByCode.value){
        unit.value = foundMaterialByCode.value.unit
        rawMaterialId.value = foundMaterialByCode.value.id
    }else{
        unit.value = ''
        rawMaterialId.value = ''
    }
}
const formatToTwoDecimalPlaces = (input: string) => {
  const number = parseFloat(input)
  if (isNaN(number)) {
    return 0.00.toString()
  }
  return number.toFixed(2).toString()
}
const onConfirm = () => {
    quantity.value = formatToTwoDecimalPlaces(quantity.value)
    var isValid = true
    if(!isTwoDecimalNumber(quantity.value)){
        qunatityErrorMessage.value = 'neispravan format/broj'
        isValid = false
    }
    if(!isTwoDecimalNumber(pricePerUnit.value)){
        pricePerUnitErrorMessage.value = 'neispravan format/broj'
        isValid = false
    }
    if(!isTwoDecimalNumber(amount.value)){
        amountErrorMessage.value = 'neispravan format/broj'
        isValid = false
    }
    if(!(articleStore.rawMaterials.find(it => it.id === rawMaterialId.value) || null)){
        rawMaterialErrorMessage.value = 'sirovina nije odabrana'
        isValid = false
    }
    if(isValid){
        console.log(`valid raw material`)
        emit('confirm', rawMaterialId.value, quantity.value, pricePerUnit.value, amount.value, update.value)
        code.value = ''
        rawMaterialId.value = ''
        unit.value = ''
        quantity.value = ''
        pricePerUnit.value = ''
        amount.value = ''
        qunatityErrorMessage.value = ''
        pricePerUnitErrorMessage.value = ''
        amountErrorMessage.value = ''
        rawMaterialErrorMessage.value = ''
        update.value = false
    }
}
</script>
