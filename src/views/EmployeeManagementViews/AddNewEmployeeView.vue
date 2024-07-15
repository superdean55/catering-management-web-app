<template>
        <div class="mx-auto max-w-xl">
            <RoundedCard>
                <div class="w-full flex flex-row justify-center">
                    <img @click="performClick" v-if="selectedImageUrl" class="rounded-lg max-h-40" :src="selectedImageUrl">
                    <img @click="performClick" v-else-if="imageUrl.length" class="rounded-lg max-h-40" :src="imageUrl">
                    <img @click="performClick" v-else class="rounded-lg max-h-40" src="@/assets/blank_profile_picture.jpg">
                    <input @change="handleFileUpload" type="file" class="hidden">
                </div>
                <div class="flex flex-col gap-2 p-4">
                    <div class="flex flex-row gap-2 w-full">
                        <InputLabel 
                            :value="firstName" 
                            type="text" 
                            name="Ime:"
                            @update="onFirstNameChanged"
                            :error="firstNameErrorMessage"
                        >
                        </InputLabel>
                        <InputLabel 
                            :value="lastName" 
                            type="text" 
                            name="Prezime:"
                            @update="onLastNameChanged"
                            :error="lastNameErrorMessage"
                            >
                        </InputLabel>
                    </div>
                    <div class="flex flex-row gap-2 w-full">
                        <InputLabel 
                            :value="born" 
                            type="date" 
                            name="Datum rođenja:"
                            @update="onDateChanged"
                            >
                        </InputLabel>
                        <InputLabel 
                            :value="phoneNumber" 
                            type="number" 
                            name="Telefon:"
                            @update="onPhoneNumberChanged"
                            :error="phoneNumberErrorMessage"
                            >
                        </InputLabel>
                    </div>
                    <div class="flex flex-row gap-2 w-full">
                        <InputLabel 
                            :value="email" 
                            type="email" 
                            name="Email:"
                            @update="onEmailChanged"
                            :error="emailErrorMessage"
                            >
                        </InputLabel>
                        <SelectBox
                            label="Uloga:"
                            @selectedValue="onSelectedRole"
                            :option="role"
                            :object="Role"
                            :error="roleErrorMessage"
                            >
                        </SelectBox>
                    </div>
                </div>
                <div class="flex justify-center">
                    <ConfirmButton @confirm="updateUser" label="Dodaj">
                        <span class="material-symbols-outlined">add</span>
                    </ConfirmButton>
                </div>
            </RoundedCard>
        </div>
</template>

<script setup lang="ts">
import RoundedCard from '@/components/cards/RoundedCard.vue'
import InputLabel from '@/components/inputs/InputLabel.vue'
import ConfirmButton from '@/components/buttons/ConfirmButton.vue'
import SelectBox from '@/components/inputs/SelectBox.vue'
import CategoryBox from '@/components/inputs/CategoryBox.vue'
import { inputDateToString } from '@/helpers/dateFormatterFun'
import { useUserStore } from '@/stores/UserStore'
import { ref, watch } from 'vue'
import { useLoadingStore } from '@/stores/LoadingStore'
import { Role } from '@/types/Role'



const loadingStore = useLoadingStore()

const imageUrl = ref<string>('')
const firstName = ref<string>('')
const firstNameErrorMessage = ref<string>('')
const lastName = ref<string>('')
const lastNameErrorMessage = ref<string>('')
const born = ref<string>('')
const phoneNumber = ref<string>('')
const phoneNumberErrorMessage = ref<string>('')
const email = ref<string>('')
const emailErrorMessage = ref<string>('')
const role = ref<Role>(Role.user)
const roleErrorMessage = ref<string>('')

const selectedImageUrl = ref<string | null>(null)

const onFirstNameChanged = (value: string) => {
    firstNameErrorMessage.value = ''
    firstName.value = value
}
const onLastNameChanged = (value: string) => {
    lastNameErrorMessage.value = ''
    lastName.value = value
}
const onPhoneNumberChanged = (value: string) => {
    phoneNumber.value = value
    phoneNumberErrorMessage.value = ''
}
const onDateChanged = (value: string) => {
    born.value = value
}

const onEmailChanged = (value: string) => {
    email.value = value
}

const onSelectedRole = (value: Role) => {
    role.value = value
}

const handleFileUpload = (event: any) =>{
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file)
    selectedImageUrl.value = imageUrl
}
const performClick = (e: any) => {
    e.target.parentElement.children[1].click()
}

const updateUser = () => {
    let isValid = true
    if(!(firstName.value.length <= 30)){
        firstNameErrorMessage.value = 'max 30 znakova'
        isValid = false
    }
    if(!(lastName.value.length <= 30)){
        lastNameErrorMessage.value = 'max 30 znakova'
        isValid = false
    }
    var date: string = ''
    console.log('born value = ', born.value)
    if(born.value){
        date = inputDateToString(born.value)
    }
    /*if(isValid && userStore.user){
        userStore.updateUser(
            {
            uid: userStore.user.uid,
            email: userStore.user.email,
            firstName: firstName.value,
            lastName: lastName.value,
            imageUrl: userStore.user.imageUrl,
            imageName: userStore.user.imageName,
            born: date,
            phoneNumber: phoneNumber.value,
            role: userStore.user.role
            }, selectedImageUrl.value
        )
    }
    */
}
</script>
