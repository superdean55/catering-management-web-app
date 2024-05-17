<template>
    <RoundedCard>
        <div class="w-full flex flex-row">
            <div class="flex flex-col items-center justify-center w-40">
                <img ref="categoryImage" v-if="imageUrl.length" @click="performClick" class="max-w-40 max-h-40 rounded-xl" :src="imageUrl">
                <img ref="categoryImage" v-else @click="performClick" class="max-w-40 max-h-40 rounded-xl" src="@/assets/blank_profile_picture.jpg">
                <input @change="handleImageUpdate" type="file" class="hidden">
                <p v-if="imageErrorMessage.length" class="text-red-600">{{ imageErrorMessage }}</p>
            </div>
            <div class="w-full flex flex-col gap-2 pl-2">
                <div class="flex justify-center truncate">
                        <p class="font-bold text-xl truncate">{{ title }}</p>
                </div>
                <div class="h-px bg-slate-600 w-full"></div>
                <InputLabel type="text" name="Ime kategorije:" 
                    :value="categoryName" 
                    :error="categoryNameErrorMessage"
                    @input="onCategoryNameInput">
                </InputLabel>
                <SelectBox label="Razina Kategorije:" @selectedValue="categoryLevel" :error="categoryLevelErrorMessage"></SelectBox>
                <div class="flex flex-row pt-2 justify-end">
                    <ConfirmButton v-if="firstButtonLabel" :label="firstButtonLabel" @confirm="$emit('delete')">
                        <slot name="firstButtonIcon"></slot>
                        
                    </ConfirmButton>
                    <div class=""></div>
                    <ConfirmButton :label="secondButtonLabel" @confirm="onConfirmButton">
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
import { validateInputString } from '@/helpers/validateCategory';

defineProps<{
    title: string,
    firstButtonLabel?: string,
    secondButtonLabel: string
}>()

const emit = defineEmits(['confirm', 'delete'])

const imageUrl = ref('')
const categoryImage = ref<HTMLImageElement | null>(null)
const selectedCategoryImageUrl = ref<string | null>(null)
const imageErrorMessage = ref<string>('')

const categoryName = ref<string>('')
const categoryNameErrorMessage = ref<string>('')
const selectedCategoryLevel = ref<string>(CategoryLevel.levelZero)
const categoryLevelErrorMessage = ref<string>('')

const onCategoryNameInput = (e: { target: { value: string } }) => {
    categoryName.value = e.target.value;
    categoryNameErrorMessage.value = ""
  };
const categoryLevel = (value: string) => {
    selectedCategoryLevel.value = value
    categoryLevelErrorMessage.value = ''
}
const performClick = (e: any) => {
    e.target.parentElement.children[1].click()
}
const handleImageUpdate = (e: any) => {
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    selectedCategoryImageUrl.value = imageUrl
    imageErrorMessage.value = ''

    if (categoryImage.value) {
      categoryImage.value.src = imageUrl;
    }
}

const onConfirmButton = () => {
    if(!validateInputString(categoryName.value)){
        categoryNameErrorMessage.value = 'minimalno dva slova'
    }
    if(selectedCategoryImageUrl.value === null && imageUrl.value == ''){
        imageErrorMessage.value = 'image is required'
    }
    if(categoryNameErrorMessage.value.length === 0 && imageErrorMessage.value.length === 0){
        emit('confirm', selectedCategoryImageUrl.value, categoryName.value, selectedCategoryLevel.value)
    }
}
</script>