<template>
    <div class="grid grid-cols-5 gap-2 max-w-4xl">
        <div class="w-full col-span-3">
            <RoundedCard>
                <div class="w-full flex flex-col">
                    <div class="w-full flex flex-row">
                        <div class="flex flex-col items-center justify-center">
                            <img @click="performClick" v-if="imageUrl.length" class="max-w-40 max-h-40" :src="imageUrl">
                            <img ref="image" @click="performClick" v-else class="max-w-40 max-h-40" src="@/assets/blank_profile_picture.jpg">
                            <input @change="handleImageUpdate" type="file" class="hidden">
                            <div class="flex flex-row justify-center w-full">
                                <p class="text-red-500">{{ imageErrorMessage }}</p>
                            </div>
                        </div>
                        <div class=" ml-4 w-full flex flex-col gap-2">
                            <InputLabelV2
                                type="text"
                                :value="name"
                                label="Ime artikla:"
                                @update="onNameChanged"
                                :error="nameErrorMessage"
                            >
                            </InputLabelV2>
                            <InputLabelV2 
                                type="number" 
                                :value="code" 
                                label="Šifra:" 
                                @update="onCodeChanged"
                                :error="codeErrorMessage"
                            >
                            </InputLabelV2>
                            <div class="grid grid-cols-2 gap-2">
                                <SelectBox
                                        label="Jedinica mjere:"
                                        @selectedValue="onSelectedUnit"
                                        :option="unit"
                                        :object="ArticleUnit"
                                        :error="unitErrorMessage"
                                        >
                                </SelectBox>
                                <SelectBox
                                        label="Porezna stopa:"
                                        @selectedValue="onSelectedTaxRate"
                                        :option="taxRate"
                                        :object="TaxRate"
                                        :error="taxRateErrorMessage"
                                        >
                                </SelectBox>
                            </div>
                            <div class="flex flex-row gap-2">
                                <InputLabelV2 
                                    type="number" 
                                    :value="productPrice" 
                                    label="Prodajna cijena:" 
                                    @update="onProductPriceChanged"
                                    :error="productPriceErrorMessage"
                                >
                                </InputLabelV2>
                                <div class="flex flex-row items-end mr-2">
                                    <p>€</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="w-full h-2"></div>
                    <div class="w-full h-px bg-gray-500"></div>
                    <div class="w-full h-2"></div>
                    <div class="w-full flex flex-col items-center">
                        <p>Komponente Proizvoda:</p>
                    </div>
                    <div class="w-full h-2"></div>
                    <div v-if="productItems.length" class="flex flex-col w-full">
                        <div class="grid grid-cols-6 w-full">
                            <div class="col-span-6 h-px bg-slate-600"></div>
                            <div class="flex flex-row justify-between items-center pl-1 bg-slate-300">
                                <p class="truncate">R. broj:</p>
                            </div>
                            <div class="col-span-2 flex flex-row justify-between items-center pl-1">
                                <p class="truncate">ime:</p>
                            </div>
                            <div class="flex flex-row justify-between items-center pl-1  bg-slate-300">
                                <p class="truncate">jed. mjere:</p>
                            </div>
                            <div class="flex flex-row justify-between items-center pl-1 ">
                                <p class="truncate">Količina:</p>
                            </div>
                            <div class="flex flex-row justify-between items-center pl-1  bg-slate-300">
                                <p class="truncate">Ukloni:</p>
                            </div>
                            <div class="col-span-6 h-px bg-slate-600"></div>
                        </div>
                        <div v-for="(item, index) in productItems" :key="item.rawMaterialId" class="grid grid-cols-6 w-full">
                            <div class="flex flex-row justify-between items-center pl-1 bg-slate-300">
                                <p class="truncate">{{ index + 1 }}.</p>
                            </div>
                            <div class="col-span-2 flex flex-row justify-between items-center pl-1">
                                <p class="truncate">{{ articleStore.getRawMaterialById(item.rawMaterialId)?.name }}</p>
                            </div>
                            <div class="flex flex-row justify-between items-center pl-1 bg-slate-300">
                                <p class="truncate">{{ articleStore.getRawMaterialById(item.rawMaterialId)?.unit }}</p>
                            </div>
                            <div class="flex flex-row justify-start pl-1 w-full ">
                                <input 
                                type="number" 
                                v-model.number="item.quantity" 
                                class="w-full" min="0.00" :step="getStep(articleStore.getRawMaterialById(item.rawMaterialId)?.unit)" 
                                @input="validateQuantity(item)">
                            </div>
                            <div class="flex flex-row justify-center bg-slate-300">
                                <span @click="removeProductItem(item.rawMaterialId)" class="material-symbols-outlined hover:text-red-500 cursor-pointer">cancel</span>
                            </div>
                            <div class="col-span-6 h-px bg-slate-600"></div>
                        </div>
                    </div>
                    <div v-else class="flex flex-row w-full justify-center">
                        <p class="font-bold">lista komponenti je prazna</p>
                    </div>
                    <div class="flex flex-row justify-center">
                        <p class="text-red-500">{{ productItemsErrorMessage }}</p>
                    </div>
                    <div class="flex flex-row justify-end mt-2">
                        <div
                            v-if="product"
                            class="flex flex-row"
                        >
                            <ConfirmButton label="Obriši" @confirm="onDelete">
                                <span class="material-symbols-outlined">delete</span>
                            </ConfirmButton>
                            <ConfirmButton  label="Ažuriraj" @confirm="onProductConfirm">
                                <span class="material-symbols-outlined">update</span>
                            </ConfirmButton>
                        </div>
                        <ConfirmButton v-else label="Dodaj Proizvod" @confirm="onProductConfirm">
                            <span class="material-symbols-outlined">add</span>
                        </ConfirmButton>
                    </div>
                </div>
            </RoundedCard>
        </div>
        <div class="w-full col-span-2">
            <RoundedCard>
                <div class="flex flex-col">
                    <div class="flex flex-row justify-center w-full mb-2">
                        <p class="font-bold">Sirovine</p>
                    </div>
                    <div class="flex flex-row justify-center w-full mb-2">
                        <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Pretraži sirovine..."
                        class="border border-gray-300 rounded px-2 py-1"
                        />
                    </div>
                    <RoundedCard v-if="rawMaterials.length" class="border border-gray-300" >
                        <div class="flex flex-col gap-2" v-if="filteredMaterials.length">
                            <div
                                v-for="material in filteredMaterials" :key="material.id"
                                @click="onRawMaterialClicked(material.id)"
                                class="flex flex-row w-full px-2 py-1 min-h-11 rounded-lg bg-gray-300 hover:bg-gray-400 cursor-pointer"
                            >
                                <div class="flex flex-row items-center justify-center">
                                    <p class="font-bold pl-4">{{ material.name }}</p>
                                </div>
                            </div>
                        </div>
                        <div v-else class="flex flex-row justify-center">
                            <p>Tražena sirovina ne postoji</p>
                        </div>
                    </RoundedCard>
                    <div v-else class="flex flex-row justify-center">
                        <p>Sve sirovine su već dodane</p>
                    </div>
                </div>
            </RoundedCard>
        </div>
    </div>
</template>

<script setup lang="ts">
import InputLabelV2 from '@/components/inputs/InputLabelV2.vue'
import RoundedCard from '@/components/cards/RoundedCard.vue'
import SelectBox from '@/components/inputs/SelectBox.vue'
import ConfirmButton from '@/components/buttons/ConfirmButton.vue'
import { computed, ref } from 'vue'
import { ArticleUnit } from '@/types/ArticleUnit'
import { TaxRate } from '@/types/TaxRate'
import { useArticleStore } from '@/stores/ArticleStor'
import { useProductStore } from '@/stores/ProductStore'
import type { ProductItem } from '@/types/ProductItem'
import type { RawMaterial } from '@/types/RawMaterial'
import { watch } from 'vue'
import { validateInputString } from '@/helpers/validateInputString'
import { isSelectionValid } from '@/helpers/isSelectionValid'
import { isTwoDecimalNumber } from '@/helpers/isTwoDecimalNumber'
import type { Product } from '@/types/Product'
import type { FieldValue } from 'firebase/firestore'

const props = defineProps<{
    product?: Product,
}>()

const emit = defineEmits<{
  (e: 'delete', product : Product): void
  (e: 'confirm', product: Product, oldProduct: Product | null, selectedImageUrl: string | null): void
}>()

const articleStore = useArticleStore()
const productStore = useProductStore()

const productItems = ref<ProductItem[]>([])
const rawMaterials = ref<RawMaterial[]>([])
rawMaterials.value =  JSON.parse(JSON.stringify(articleStore.rawMaterials))

const productItemsErrorMessage = ref<string>('')

const imageUrl = ref<string>('')
const name = ref<string>('')
const nameErrorMessage = ref<string>('')
const code = ref<string>('')
const codeErrorMessage = ref<string>('')
const unit = ref(ArticleUnit.piece)
const unitErrorMessage = ref<string>('')
const taxRate = ref(TaxRate.currentTax)
const taxRateErrorMessage = ref<string>('')
const image = ref<HTMLImageElement | null>(null)
const selectedImageUrl = ref<string | null>(null)
const imageErrorMessage = ref<string>('')
const productPrice = ref<string>('')
const productPriceErrorMessage = ref<string>('')
const searchQuery = ref('')

if(props.product){
    name.value = props.product.name
    unit.value = props.product.articleUnit
    code.value = props.product.code
    imageUrl.value = props.product.imageUrl
    taxRate.value = props.product.taxRate
    productPrice.value = props.product.price
    props.product.productItems.forEach(element => {
        const index = rawMaterials.value.findIndex(it => it.id === element.rawMaterialId)
        if(index !== -1){
            rawMaterials.value.splice(index, 1)
        }
    })
    productItems.value = props.product.productItems
}

watch(() => props.product, () => {
    if(props.product){
        name.value = props.product.name
        unit.value = props.product.articleUnit
        code.value = props.product.code
        imageUrl.value = props.product.imageUrl
        taxRate.value = props.product.taxRate
        productPrice.value = props.product.price
        productItems.value = props.product.productItems
    }
});

const filteredMaterials = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return rawMaterials.value.filter(material => 
    material.name.toLowerCase().includes(query)
  )
})


const codeExists = computed(() => {
      return productStore.products.some(it => it.code === code.value)
})

const onNameChanged = (inputValue: string) => {
    nameErrorMessage.value = ''
    name.value = inputValue
    console.log(`name: ${name.value}`)
}
const onCodeChanged = (inputValue: string) => {
    codeErrorMessage.value = ''
    code.value = inputValue
    console.log(`code: ${code.value}`)
    if(codeExists.value && !(props.product?.code === code.value)){
        codeErrorMessage.value = 'šifra je zauzeta'
    }
}
const onSelectedUnit = (selectedUnit: ArticleUnit) => {
    unitErrorMessage.value = ''
    unit.value = selectedUnit
    console.log(`unit: ${unit.value}`)
}
const onSelectedTaxRate = (selectedTaxRate: TaxRate) => {
    taxRateErrorMessage.value = ''
    taxRate.value = selectedTaxRate
    console.log(`tax rate: ${taxRate.value}`)
}
const onProductPriceChanged = (value: string) => {
    productPriceErrorMessage.value = ''
    productPrice.value = value
    console.log(productPrice.value)
}
const performClick = (e: any) => {
    e.target.parentElement.children[1].click()
}
const handleImageUpdate = (e: any) => {
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    selectedImageUrl.value = imageUrl
    imageErrorMessage.value = ''

    if (image.value) {
      image.value.src = imageUrl
    }
}
const onRawMaterialClicked = (rawMaterialId: string) => {
    productItems.value.push({
        rawMaterialId: rawMaterialId,
        quantity: 0.00
    }as ProductItem)
    const index = rawMaterials.value.findIndex(it => it.id === rawMaterialId)
    if(index !== -1){
        rawMaterials.value.splice(index, 1)
    }
    console.log(productItems.value)
}
const validateQuantity = (item: ProductItem) => {
    productItemsErrorMessage.value = ''
    if (item.quantity < 0.00) {
        item.quantity = 0.00
    }
}
const removeProductItem = (rawMaterialId: string) => {
    const index = productItems.value.findIndex(it => it.rawMaterialId === rawMaterialId)
    if(index !== -1){
        productItems.value.splice(index, 1)
        const rawMaterial = articleStore.getRawMaterialById(rawMaterialId)
        if(rawMaterial){
            rawMaterials.value.push(rawMaterial)
        }  
    }
}
const getStep = (unit: string | undefined) => {
  return (unit === 'komad' || unit === 'g') ? 1 : (unit === 'litra' || unit === 'kg' ? 0.01 : 1)
}
const onDelete = () => {
    if(props.product){
        emit('delete', props.product)
    }
}
const onProductConfirm = () => {
    var isValid = true
    if(!validateInputString(name.value)){
        nameErrorMessage.value = 'min. 2 do max. 50 znakova'
        isValid = false
    }
    if(!validateInputString(code.value)){
        codeErrorMessage.value = 'min. 2 do max. 50 znakova'
        isValid = false
    }
    if(!isSelectionValid(taxRate.value, TaxRate)){
        taxRateErrorMessage.value = 'nepostojeća stopa'
        isValid = false
    }
    if(!isSelectionValid(unit.value, ArticleUnit)){
        unitErrorMessage.value = 'nepostojeća mjera'
        isValid = false
    }
    if(!isTwoDecimalNumber(productPrice.value)){
        productPriceErrorMessage.value = 'neispravan format pr: 1,22'
        isValid = false
    }
    if(selectedImageUrl.value === null && imageUrl.value === ''){
        imageErrorMessage.value = 'slika je obavezna'
        isValid = false
    }
    productItems.value.forEach(element =>{
        if(element.quantity <= 0.00){
            isValid = false
            productItemsErrorMessage.value = 'Količina pojedinih sirovina mora bit veća od 0'
        }
    })
    if(isValid){
        console.log('new product is valid')
        const product = {
                id: '',
                name: name.value,
                code: code.value,
                articleUnit: unit.value,
                taxRate: taxRate.value,
                price: productPrice.value,
                creationDate: '',
                imageName: '',
                imageUrl: '',
                productItems: productItems.value,
                timestamp: null as FieldValue | null,
            }as Product
        if(props.product){
            emit('confirm', product , props.product, selectedImageUrl.value)
        }else{
            emit('confirm', product , null , selectedImageUrl.value)
        }   
    }
}
</script>