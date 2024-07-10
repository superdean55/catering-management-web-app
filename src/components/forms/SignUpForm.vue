<script setup lang="ts">
  import RoundedCard from '@/components/cards/RoundedCard.vue'
  import InputLabel from '@/components/inputs/InputLabel.vue'
  import SubmitButton from '@/components/buttons/SubmitButton.vue'
  import { useUserStore } from '@/stores/UserStore'
  import { ref } from 'vue'

  const UserStore = useUserStore()

  const email= ref<string>("")
  const emailErrorMessage = ref<string>("")

  const password = ref<string>("")
  const passwordErrorMessage = ref<string>("")

  const repeatedPassword = ref<string>("")
  const repeatedPasswordErrorMessage = ref<string>("")
  
  const onEmailInput = (e: { target: { value: string } }) => {
    email.value = e.target.value
    emailErrorMessage.value = ""
    
  }
  const onPasswordInput = (e: { target: { value: string } }) => {
    password.value = e.target.value
    passwordErrorMessage.value = ""
  }
  const onRepeatedPasswordInput = (e: { target: { value: string } }) => {
    repeatedPassword.value = e.target.value
    repeatedPasswordErrorMessage.value = ""
  }

  const onSubmit = () => {
    if(validateEmial() && validatePassword() && validateRepeatedPassword()){
        UserStore.signUp(email.value, password.value)
    }
  }
  
  const validateEmial = () : boolean => {
    const emailRegex: RegExp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/
    if(!emailRegex.test(email.value)) {
        emailErrorMessage.value = "neispravan mail"
        return false
    }
    return true
  }

  const validatePassword = (): boolean => {
    const passwordRegex: RegExp = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,32}$/
    if(!passwordRegex.test(password.value)){
        passwordErrorMessage.value = "lozinka mora sadržavati: 8,32 znaka, min. jedno malo slovo, jedno veliko slovo, jedan specijalan znak"
        return false
    }
    return true
  }

  const validateRepeatedPassword = (): boolean => {
    if(!(password.value === repeatedPassword.value)){
        repeatedPasswordErrorMessage.value = "lozinke se ne poklapaju"
        return false
    }
    return true
  }
</script>

<template>
    <form @submit.prevent >
        <RoundedCard>
            <InputLabel :value="password" name="Lozinka:" type="password" :error="passwordErrorMessage" @input="onPasswordInput"/>
            <InputLabel :value="repeatedPassword" name="Ponovite Lozinku:" type="password" :error="repeatedPasswordErrorMessage" @input="onRepeatedPasswordInput"/>
            <InputLabel :value="email" name="Email:" type="email" :error="emailErrorMessage" @input="onEmailInput"/>
            <div class="flex justify-center mt-5 mb-2">
                <SubmitButton label="Kreiraj račun" @submit="onSubmit"></SubmitButton>
            </div>
        </RoundedCard>
    </form>
</template>