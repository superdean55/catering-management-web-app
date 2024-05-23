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
                    >
                </CategoryBox>
                <div class="flex flex-row">
                    <InputLabelV2
                        label="Količina:"
                        type="number"
                        :value="quantity"
                        @update="onQuantityChanged"
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
                    >
                    </InputLabelV2>
                    <div class="flex flex-col justify-end ml-1">
                        <p>kn</p>
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
                    >
                    </InputLabelV2>
                    <div class="flex flex-col justify-end ml-1">
                        <p>kn</p>
                        <div class="h-px"></div>
                        <div class="h-px"></div>
                    </div>
                </div>
                
                <div class="flex felx-row justify-center">
                    <ConfirmButton
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
import { isValidQuantity } from '@/helpers/isValidQuantity';

const articleStore = useArticleStore()
const rawMaterials = articleStore.rawMaterials
const rawMaterialId = ref<string>('')
const unit = ref<string>('')
const code = ref<string>('')
const quantity = ref<string>('')
const pricePerUnit = ref<string>('')
const amount = ref<string>('')

const foundMaterialByCode = computed(() => {
    return articleStore.rawMaterials.find(it => it.code === code.value) || null
})

const rawMaterialById = computed(() => {
    console.log('computed')
    return articleStore.rawMaterials.find(it => it.id === rawMaterialId.value) || null
})

const onAmountChanged = (value: string) => {
    amount.value = value
    console.log(`amount: ${amount.value}`)
}
const onPricePerUnitChanged = (value: string) => {
    pricePerUnit.value = value
    console.log(`pricePerUnit: ${pricePerUnit.value}`)
}
const onQuantityChanged = (value: string) => {
    quantity.value = value
    console.log(`qunatity: ${quantity.value}`)
}
const onSelectedMaterial = (id: string)  => {
    rawMaterialId.value = id
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
watch(quantity, (newQuantity) => {
    if (pricePerUnit.value) {
        const newAmount = Number(newQuantity) * Number(pricePerUnit.value)
        amount.value = newAmount.toString()
        console.log(`amount: ${amount.value}`)
    }else if(amount.value){
        const newPricePerUnit = Number(amount.value) / Number(newQuantity)
        pricePerUnit.value = newPricePerUnit.toString()
    }
})
watch(amount, (newAmount) => {
    if (quantity.value) {
        const newPricePerUnit = Number(newAmount) / Number(quantity.value)
        pricePerUnit.value = newPricePerUnit.toString()
        console.log(`pricePerUnit: ${pricePerUnit.value}`)
    }else if(pricePerUnit.value){
        const newQuantity = Number(newAmount) / Number(pricePerUnit.value)
        quantity.value = newQuantity.toString()
    }
})
watch(pricePerUnit,(newPricePerUnit) => {
    if(quantity.value){
        const newAmount = Number(quantity.value) * Number(newPricePerUnit)
        amount.value = newAmount.toString()
    }else if(amount.value){
        const newQunatity = Number(amount.value) / Number(newPricePerUnit)
        quantity.value = newQunatity.toString()
    }
})
const onConfirm = () => {
    const isValid = true
    if(!isValidQuantity(unit.value, quantity.value)){
        console.log('invalid')
    }
}
</script>
