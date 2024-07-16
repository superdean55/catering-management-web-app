<template>
        <div class="mx-auto max-w-xl">
            <RoundedCard>
                <form @submit.prevent="createUser">
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
                                :required="true"
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
                            <InputLabel
                                :value="password"
                                type="password"
                                name="Lozinka:"
                                @update="onPasswordChanged"
                                :error="passwordErrorMessage"
                                >
                            </InputLabel>
                        </div>
                        <div class="flex flex-row gap-2 w-full">
                            
                            <InputLabel
                                :value="repeatedPassword"
                                type="password"
                                name="Ponovite Lozinku:"
                                @update="onRepeatedPasswordChanged"
                                :error="repeatedPasswordErrorMessage"
                                >
                            </InputLabel>
                            <EnumSelectBox
                                label="Uloga:"
                                @selectedValue="onSelectedRole"
                                :option="role"
                                :object="Role"
                                :error="roleErrorMessage"
                                >
                            </EnumSelectBox>
                        </div>
                    </div>
                    <div class="flex justify-center">
                        <ConfirmButton @confirm="createUser" label="Dodaj">
                            <span class="material-symbols-outlined">add</span>
                        </ConfirmButton>
                    </div>
                </form>
            </RoundedCard>
        </div>
</template>

<script setup lang="ts">
import RoundedCard from '@/components/cards/RoundedCard.vue'
import InputLabel from '@/components/inputs/InputLabel.vue'
import ConfirmButton from '@/components/buttons/ConfirmButton.vue'
import SelectBox from '@/components/inputs/SelectBox.vue'
import EnumSelectBox from '@/components/inputs/EnumSelectBox.vue'
import { inputDateToString } from '@/helpers/dateFormatterFun'
import { useUserStore } from '@/stores/UserStore'
import { ref, watch } from 'vue'
import { useLoadingStore } from '@/stores/LoadingStore'
import { Role } from '@/types/Role'
import { isValidPhoneNumber } from '@/helpers/isValidPhoneNumber'
import { isValidInput } from '@/helpers/isValidInput'
import { isValidEmail } from '@/helpers/isValidEmail'
import { isSelectionValid } from '@/helpers/isSelectionValid'
import { isValidPassword } from '@/helpers/isValidPassword'
import type { User } from '@/types/User'


const userStore = useUserStore()

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
const password = ref<string>("")
const passwordErrorMessage = ref<string>("")
const repeatedPassword = ref<string>("")
const repeatedPasswordErrorMessage = ref<string>("")
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
const onPasswordChanged = (value: string) => {
    password.value = value
    passwordErrorMessage.value = ""
  }
const onRepeatedPasswordChanged = (value: string) => {
    repeatedPassword.value = value
    repeatedPasswordErrorMessage.value = ""
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

const createUser = () => {
    let isValid = true
    if(!isValidInput(firstName.value)){
        firstNameErrorMessage.value = 'min 2, max 50 znakova'
        isValid = false
    }
    if(!isValidInput(lastName.value)){
        lastNameErrorMessage.value = 'min 2, max 50 znakova'
        isValid = false
    }
    var date: string = ''
    console.log('born value = ', born.value)
    if(born.value){
        date = inputDateToString(born.value)
    }
    if(phoneNumber.value){
        if(!isValidPhoneNumber(phoneNumber.value)){
            phoneNumberErrorMessage.value = 'treba sadržavati 9 ili 10 brojeva'
            isValid = false
        }
    }
    if(!isValidEmail(email.value)){
        emailErrorMessage.value = 'neispravan email'
        isValid = false
    }
    if(!isValidPassword(password.value)){
      passwordErrorMessage.value = 'min 8, max 32 znakova, veliko i malo slovo, broj i spec. znak'
      isValid = false
    }
    if(!(password.value === repeatedPassword.value)){
      repeatedPasswordErrorMessage.value = 'lozinke nisu jednake'
      isValid = false
    }
    if(!isSelectionValid(role.value, Role)){
        roleErrorMessage.value = 'neispravna uloga'
        isValid = false
    }
    if(isValid){
        const user = {
            uid: '',
            email: email.value,
            firstName: firstName.value,
            lastName: lastName.value,
            imageUrl: '',
            imageName: '',
            born: date,
            phoneNumber: phoneNumber.value,
            role: role.value
        } as User
        userStore.createEmployee(user, password.value, selectedImageUrl.value)
        imageUrl.value = ''
        firstName.value = ''
        firstNameErrorMessage.value = ''
        lastName.value = ''
        lastNameErrorMessage.value = ''
        born.value = ''
        phoneNumber.value = ''
        phoneNumberErrorMessage.value = ''
        email.value = ''
        emailErrorMessage.value = ''
        password.value = ''
        passwordErrorMessage.value = ''
        repeatedPassword.value = ''
        repeatedPasswordErrorMessage.value = ''
        role.value = Role.user
        roleErrorMessage.value = ''
        selectedImageUrl.value = null
    }
}
</script>
