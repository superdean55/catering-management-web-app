<template>
    <RoundedCard>
        <div class="flex flex-col">
            <p class="font-bold">{{ title }}</p>
            <div class="flex felx-row">
                <div class="felx felx-col w-full">
                    <InputLabelV2
                        type="text"
                        label="Ime Sirovine:"
                        :value="name"
                        :error="nameErrorMessage"
                        @update="onNameChanged"
                        >
                    </InputLabelV2>
                    <div class="grid grid-cols-2 gap-2 mt-2">
                        <SelectBox
                            label="Jedinica mjere:"
                            :option="unit"
                            :object="ArticleUnit"
                            @selectedValue="onUnitChanged"
                        >
                        </SelectBox>
                        <InputLabelV2
                            type="number"
                            label="Početna količina:"
                            :value="quantity"
                            :error="quantityErrorMessage"
                            @update="onQuantityChanged"
                            >
                        </InputLabelV2>
                    </div>
                </div>
                
            </div>
            <div class="flex flex-row items-center justify-end mt-2">
                    <ConfirmButton 
                        v-if="deleteButtonLabel"
                        :label="deleteButtonLabel"
                        @confirm="onDeleteButton"
                    >
                        <span class="material-symbols-outlined">delete</span>
                    </ConfirmButton>
                    <ConfirmButton 
                        v-if="confirmButtonLabel"
                        :label="confirmButtonLabel"
                        @confirm="onConfirmButton"
                    >
                        <slot name="confirm-button-icon"></slot>
                    </ConfirmButton>
                </div>
        </div>
    </RoundedCard>
</template>

<script setup lang="ts">
import RoundedCard from '@/components/cards/RoundedCard.vue'
import InputLabelV2 from '@/components/inputs/InputLabelV2.vue'
import SelectBox from '@/components/inputs/SelectBox.vue';
import ConfirmButton from '@/components/buttons/ConfirmButton.vue';
import { ArticleUnit } from '@/types/ArticleUnit';
import { ref, watch } from 'vue';
import { validateInputString } from '@/helpers/validateInputString';
import { isValidNumber } from '@/helpers/isValidNumber';
import { isSelectionValid } from '@/helpers/isSelectionValid';
import type { RawMaterial } from '@/types/RawMaterial';

const props = defineProps<{
    deleteButtonLabel?: string,
    confirmButtonLabel?: string,
    oldRawMaterial?: RawMaterial,
    title: string
}>()

const emit = defineEmits<{
  (e: 'delete', oldRawMaterial: RawMaterial | undefined): void
  (e: 'confirm', name: string, unit: string, quantity: string, oldRawMaterial: RawMaterial | undefined): void
}>()

const name = ref<string>('')
const nameErrorMessage = ref<string>('')
const unit = ref<string>(ArticleUnit.piece)
const unitErrorMessage = ref<string>('')
const quantity = ref<string>('0')
const quantityErrorMessage = ref<string>('')

if(props.oldRawMaterial){
    name.value = props.oldRawMaterial.name
    unit.value = props.oldRawMaterial.unit
    quantity.value = props.oldRawMaterial.quantity.toString()
}

watch(() => props.oldRawMaterial, (newMaterial, oldMaterial) => {
    if(props.oldRawMaterial){
        name.value = props.oldRawMaterial.name
        unit.value = props.oldRawMaterial.unit
        quantity.value = props.oldRawMaterial.quantity.toString()
    }
});
const onNameChanged = (value: string) => {
    nameErrorMessage.value = ''
    name.value = value
}
const onUnitChanged = (value: string) => {
    unitErrorMessage.value = ''
    unit.value = value
}
const onQuantityChanged = (value: string) => {
    quantityErrorMessage.value = ''
    quantity.value = value
}
const onConfirmButton = () => {
    var valid = true
    if(!validateInputString(name.value)){
        nameErrorMessage.value = 'minimalno 2 slova'
        valid = false
    }
    if(!isValidNumber(quantity.value)){
        quantityErrorMessage.value = 'broj neispravan'
        valid = false
    }
    if(!isSelectionValid(unit.value, ArticleUnit)){
        unitErrorMessage.value = 'jed. mj. ne postoji'
        valid = false
    }
    if(valid){
        emit('confirm', name.value, unit.value, quantity.value, props.oldRawMaterial)
        name.value = ''
        unit.value = ArticleUnit.piece
        quantity.value = '0'
        
    }
}
const onDeleteButton = () => {
    emit('delete', props.oldRawMaterial)
}

</script>
