<template>
    <div class="max-w-4xl">
        <div class="w-full grid gap-2" :class="screenStore.isSmallScreen ? 'grid-cols-1' : 'grid-cols-5'" >
            <div :class="screenStore.isSmallScreen ? 'col-span-1' : 'col-span-3'">
                <RoundedCard>
                    <div class="w-full flex flex-col">
                        <div class="w-full flex flex-row">
                            <div class="flex flex-col items-center justify-start w-28">
                                <img ref="categoryImage" v-if="imageUrl.length" @click="performClick" class="max-w-28 max-h-28 rounded-xl" :src="imageUrl">
                                <img ref="categoryImage" v-else @click="performClick" class="max-w-28 max-h-28 rounded-xl" src="@/assets/blank_profile_picture.jpg">
                                <input @change="handleImageUpdate" type="file" class="hidden">
                                <p v-if="imageErrorMessage.length" class="text-red-600">{{ imageErrorMessage }}</p>
                            </div>
                            <div class="w-full flex flex-col gap-2 ml-4">
                                <div class="flex justify-center truncate">
                                        <p v-if="category" class="font-bold text-xl truncate">Izmjeni Kategoriju</p>
                                        <p v-else class="font-bold text-xl truncate">Dodaj Kategoriju</p>
                                </div>
                                <div class="h-px bg-slate-600 w-full"></div>
                                <InputLabel type="text" name="Ime kategorije:"
                                    :value="categoryName"
                                    :error="categoryNameErrorMessage"
                                    @update="onCategoryNameInput">
                                </InputLabel>
                            </div>
                        </div>
                        <div class="w-full h-4"></div>
                        <div class="w-full">
                            <div class="w-full flex flex-row justify-center">
                                <p class="font-bold">Lista dodanih proizvoda</p>
                            </div>
                            <div class="w-full h-4"></div>
                            <div class="w-full flex flex-row justify-center">
                                <div v-if="categoryItems.length" class="w-full flex flex-col gap-2 max-w-xs">
                                    <div
                                        v-for="item in categoryItems" :key="item.productId"
                                        class="rounded-xl bg-green-200 hover:bg-red-200 w-full flex flex-row border border-gray-300 cursor-pointer"
                                        @click="removeItem(item)"
                                    >
                                        <div class="w-10 h-10 overflow-hidden">
                                            <img :src="productStore.getProductById(item.productId)?.imageUrl" class="w-full h-full object-cover rounded-l-xl">
                                        </div>
                                        <div class="flex flex-row items-center justify-center ml-2">
                                            <p class="text-lg font-bold">{{ productStore.getProductById(item.productId)?.name }}</p>
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="w-full flex flex-col items-center gap-2 max-w-xs">
                                    <p>Lista je prazna</p>
                                </div>
                            </div>
                            <div class="w-full flex flex-row justify-center">
                                <p class="text-red-500">{{ categroyItemsErrorMessage }}</p>
                            </div>
                        </div>
                        <div class="flex flex-row pt-2 justify-end">
                            <div v-if="category" class="flex flex-row justify-end">
                                <ConfirmButton label="Obriši" @confirm="onDeleteButton">
                                    <span class="material-symbols-outlined">delete</span>
                                </ConfirmButton>
                                <ConfirmButton label="Ažuriraj" @confirm="onConfirmButton">
                                    <span class="material-symbols-outlined">update</span>
                                </ConfirmButton>
                            </div>
        
                            <ConfirmButton v-else label="Dodaj" @confirm="onConfirmButton">
                                <span class="material-symbols-outlined">add</span>
                            </ConfirmButton>
                        </div>
                    </div>
                </RoundedCard>
            </div>
            <div :class="screenStore.isSmallScreen ? 'col-span-1' : 'col-span-2'">
                <RoundedCard class="grid grid-cols-1">
                    <div class="w-full flex flex-row justify-center">
                        <p>Svi Proizvodi</p>
                    </div>
                    <div class="h-2"></div>
                    <div class="flex flex-row justify-center w-full mb-2">
                            <input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Pretraži proizvode..."
                            class="border border-gray-300 rounded px-2 py-1"
                            />
                    </div>
                    <div class="h-2"></div>
                    <RoundedCard v-if="products.length" class="flex flex-col gap-2 bg-slate-300">
                        <div
                            v-for="product in filteredProducts" :key="product.id"
                            @click="onProductClick(product)"
                            class="rounded-xl flex flex-row bg-gray-200 hover:bg-gray-400 cursor-pointer"
                        >
                            <div class="w-10 h-10 overflow-hidden">
                                <img :src="product.imageUrl" :alt="product.imageName" class="w-full h-full object-cover rounded-l-xl">
                            </div>
                            <div class="flex flex-row items-center pl-2">
                                <p class="font-bold text-lg">{{ product.name }}</p>
                            </div>
                        </div>
                    </RoundedCard>
                    <div v-else class="w-full flex flex-row justify-center">
                        <p>Svi proizvodi su dodani</p>
                    </div>
                </RoundedCard>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import RoundedCard from '@/components/cards/RoundedCard.vue'
import InputLabel from '@/components/inputs/InputLabel.vue'
import ConfirmButton from '@/components/buttons/ConfirmButton.vue'
import { computed, ref } from 'vue'
import { isValidInput } from '@/helpers/isValidInput'
import type { Category } from '@/types/Category'
import { useProductStore } from '@/stores/ProductStore'
import { useCategoryStore } from '@/stores/CategoryStore'
import type { CategoryItem } from '@/types/CategoryItem'
import type { Product } from '@/types/Product'
import type { FieldValue } from 'firebase/firestore'
import { useScreenStore } from '@/stores/ScreenStore'

const props = defineProps<{
    category?: Category
}>()

const emit = defineEmits<{
    (e:'delete', categoryId: string): void,
    (e:'confirm', category: Category, selectedCategoryImageUrl: string | null, oldCategory: Category | null): void
}>()

const productStore = useProductStore()
const categoryStore = useCategoryStore()
const screenStore = useScreenStore()
const products = ref<Product[]>([])

products.value =  JSON.parse(JSON.stringify(productStore.products))

categoryStore.categorys.forEach(element => {
    element.items.forEach(product => {
        const index = products.value.findIndex(it => it.id === product.productId)
        if(index !== -1){
            products.value.splice(index, 1)
        }
    })
})

const categoryItems = ref<CategoryItem[]>([])
const categroyItemsErrorMessage = ref('')

const imageUrl = ref('')
const categoryImage = ref<HTMLImageElement | null>(null)
const selectedCategoryImageUrl = ref<string | null>(null)
const imageErrorMessage = ref<string>('')

const categoryName = ref<string>('')
const categoryNameErrorMessage = ref<string>('')
const searchQuery = ref('')

if(props.category){
    imageUrl.value = props.category.imageUrl
    categoryName.value = props.category.name
    categoryItems.value = props.category.items
}

const filteredProducts = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return products.value.filter(product => 
    product.name.toLowerCase().includes(query)
  )
})

const onCategoryNameInput = (value: string) => {
    categoryName.value = value
    categoryNameErrorMessage.value = ""
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
const onProductClick = (product: Product) => { 

    categroyItemsErrorMessage.value = ''
    categoryItems.value.push({
        productId: product.id,  
    }as CategoryItem)

    const index = products.value.findIndex(it => it.id === product.id)
    if(index !== -1){
        products.value.splice(index, 1)
    }
    console.log(categoryItems.value)
}
const removeItem = (item: CategoryItem) => {
    const index = categoryItems.value.findIndex(it => it.productId === item.productId)
    if(index !== -1){
        categoryItems.value.splice(index, 1)
        const product = productStore.getProductById(item.productId)
        if(product){
            products.value.push(product)
        }  
    }
}
const onConfirmButton = () => {
    var isValid = true
    if(!isValidInput(categoryName.value)){
        categoryNameErrorMessage.value = 'min. 2 i max. 50 znakova'
        isValid = false
    }
    if(selectedCategoryImageUrl.value === null && imageUrl.value == ''){
        imageErrorMessage.value = 'slika nije dodana'
        isValid = false
    }
    if(!categoryItems.value.length){
        categroyItemsErrorMessage.value = 'Lista mora sadržavati minimalno jedan proizvod'
        isValid = false
    }
    if(isValid){
        const category = {
            id: '',
            name: categoryName.value,
            imageName: '',
            imageUrl: '',
            creationDate: '',
            timestamp: null as FieldValue | null,
            items: categoryItems.value
        }as Category
        emit('confirm', category, selectedCategoryImageUrl.value , props.category == null ? null : props.category)
        imageUrl.value = ''
        categoryName.value = ''
        selectedCategoryImageUrl.value = null
        imageErrorMessage.value = ''
        categoryNameErrorMessage.value = ''
    }
}

const onDeleteButton = () => {
    if(props.category){
        emit('delete', props.category.id)
    }
}
</script>