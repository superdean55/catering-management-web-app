<template>
    <RoundedCard>
        <div class="w-full flex flex-row">
            <div class="flex items-center ">
                <img class="max-w-40 max-h-40" src="@/assets/blank_profile_picture.jpg">
            </div>
            <div class="w-full flex flex-col gap-2 pl-2">
                <div class="flex justify-center truncate">
                        <p class="font-bold text-xl truncate">{{ title }}</p>
                </div>
                <div class="h-px bg-slate-600 w-full"></div>
                <InputLabel type="text" name="Ime kategorije:" :value="categoryName" @input="onCategoryNameInput"></InputLabel>
                <SelectBox label="Razina Kategorije:" @selectedValue="categoryLevel"></SelectBox>
                <div class="flex flex-row pt-2 justify-end">
                    <ConfirmButton v-if="firstButtonLabel" :label="firstButtonLabel" @confirm="$emit('delete')">
                        <slot name="firstButtonIcon"></slot>
                        
                    </ConfirmButton>
                    <div class=""></div>
                    <ConfirmButton :label="secondButtonLabel" @confirm="$emit('confirm')">
                        <slot name="secondButtonIcon"></slot>
                    </ConfirmButton>
                </div>
            </div>
        </div>
    </RoundedCard>
</template>

<script setup lang="ts">
import RoundedCard from '@/components/cards/RoundedCard.vue';
import InputLabel from '@/components/inputs/InputLabel.vue';
import SelectBox from '@/components/inputs/SelectBox.vue';
import ConfirmButton from '@/components/buttons/ConfirmButton.vue';
import { ref } from 'vue';
import { CategoryLevel } from '@/types/CategoryLevel';

defineProps<{
    title: string,
    firstButtonLabel?: string,
    secondButtonLabel: string
}>()
const emit = defineEmits(['catergory', 'level', 'confirm', 'delete'])
const categoryName = ref<string>('')
const categoryNameErrorMessage = ref<string>('')
const selectedValue = ref<string>(CategoryLevel.levelZero)

const onCategoryNameInput = (e: { target: { value: string } }) => {
    categoryName.value = e.target.value;
    categoryNameErrorMessage.value = ""
    emit('catergory', categoryName.value)
  };
const categoryLevel = (value: string) => {
    selectedValue.value = value
    emit('level', selectedValue.value)
}

</script>