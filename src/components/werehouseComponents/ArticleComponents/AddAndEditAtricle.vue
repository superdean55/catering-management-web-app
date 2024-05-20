<template>
    <RoundedCard>
        <div class="w-full flex flex-row">
            <div class="flex items-center ">
                <img ref="articleImage" @click="performClick" v-if="imageUrl.length" class="max-w-40 max-h-40" :src="imageUrl">
                <img ref="articleImage" @click="performClick" v-else class="max-w-40 max-h-40" src="@/assets/blank_profile_picture.jpg">
                <input @change="handleImageUpdate" type="file" class="hidden">
            </div>
            <div class=" ml-4 w-full flex flex-col gap-2">
                <InputLabelV2 
                    type="text" 
                    :value="name" 
                    label="Ime artikla:" 
                    @update="onNameChanged">
                </InputLabelV2>
                
                <InputLabelV2 type="number" :value="code" label="Šifra:" @update="onCodeChanged"></InputLabelV2>
                <div class="grid grid-cols-2 gap-2">
                    <SelectBox
                            label="Jedinica mjere:"
                            @selectedValue="onSelectedUnit"
                            :option="articleUnit"
                            :object="ArticleUnit"
                            >
                    </SelectBox>
                    <SelectBox
                            label="Porezna stopa:"
                            @selectedValue="onSelectedTaxRate"
                            :option="articleTaxRate"
                            :object="TaxRate"
                            >
                    </SelectBox>
                </div>
                <CategoryBox
                        label="Kategorija:"
                        @selectedValue="onSelectedArticleCategory"
                        :option="articleCategory"
                        :object="categorys"
                        >
                </CategoryBox>
            </div>
        </div>
    </RoundedCard>
</template>

<script setup lang="ts">
import InputLabelV2 from '@/components/inputs/InputLabelV2.vue';
import RoundedCard from '@/components/cards/RoundedCard.vue';
import SelectBox from '@/components/inputs/SelectBox.vue';
import CategoryBox from '@/components/inputs/CategoryBox.vue';
import type { Article } from '@/types/Article';
import { computed, ref } from 'vue';
import { ArticleUnit } from '@/types/ArticleUnit';
import { TaxRate } from '@/types/TaxRate';
import { useArticleStore } from '@/stores/ArticleStor';

const props = defineProps<{
    article?: Article
}>()
const articleStore = useArticleStore()
const categorys = articleStore.categorys

const imageUrl = ref<string>('')
const name = ref<string>('')
const code = ref<string>('')
const articleUnit = ref(ArticleUnit.piece)
const articleTaxRate = ref(TaxRate.currentTax)
const articleCategory = ref('')
const articleImage = ref<HTMLImageElement | null>(null)
const selectedArticleImageUrl = ref<string | null>(null)
const imageErrorMessage = ref<string>('')

if(props.article){
    imageUrl.value = props.article.imageUrl
}
if(categorys.length){
    articleCategory.value =  articleStore.firstCategoryId
}
const onNameChanged = (inputValue: string) => {
    name.value = inputValue
    console.log(`name: ${name.value}`)
}
const onCodeChanged = (inputValue: string) => {
    code.value = inputValue
    console.log(`code: ${code.value}`)
}
const onSelectedUnit = (selectedUnit: ArticleUnit) => {
    articleUnit.value = selectedUnit
    console.log(`unit: ${articleUnit.value}`)
}
const onSelectedTaxRate = (selectedTaxRate: TaxRate) => {
    articleTaxRate.value = selectedTaxRate
    console.log(`tax rate: ${articleTaxRate.value}`)
}
const onSelectedArticleCategory = (selectedArticleCategory: string) => {
    articleCategory.value = selectedArticleCategory
    console.log(`category: ${articleCategory.value}`)
}

const performClick = (e: any) => {
    e.target.parentElement.children[1].click()
}
const handleImageUpdate = (e: any) => {
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    selectedArticleImageUrl.value = imageUrl
    imageErrorMessage.value = ''

    if (articleImage.value) {
      articleImage.value.src = imageUrl;
    }
}
</script>