<script setup lang="ts">
  import RoundedCard from '@/components/cards/RoundedCard.vue'
  import InputLabel from '@/components/inputs/InputLabel.vue'
  import SubmitButton from '@/components/buttons/SubmitButton.vue'
  import { useUserStore } from '@/stores/UserStore'
  import { isValidEmail } from '@/helpers/isValidEmail'
  import { ref } from 'vue'
  import { isValidPassword } from '@/helpers/isValidPassword'

  const UserStore = useUserStore()

  const email= ref<string>("")
  const emailErrorMessage = ref<string>("")

  const password = ref<string>("")
  const passwordErrorMessage = ref<string>("")

  const repeatedPassword = ref<string>("")
  const repeatedPasswordErrorMessage = ref<string>("")
  
  const onEmailInput = (value: string) => {
    email.value = value
    emailErrorMessage.value = ""
    
  }
  const onPasswordInput = (value: string) => {
    password.value = value
    passwordErrorMessage.value = ""
  }
  const onRepeatedPasswordInput = (value: string) => {
    repeatedPassword.value = value
    repeatedPasswordErrorMessage.value = ""
  }

  const onSubmit = () => {
    let isValid = true
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
    if(isValid){
        UserStore.signUp(email.value, password.value)
    }
  }
</script>

<template>
    <form @submit.prevent >
        <RoundedCard>
          <InputLabel :value="email" name="Email:" type="email" :error="emailErrorMessage" @update="onEmailInput"/>
          <InputLabel :value="password" name="Lozinka:" type="password" :error="passwordErrorMessage" @update="onPasswordInput"/>
          <InputLabel :value="repeatedPassword" name="Ponovite Lozinku:" type="password" :error="repeatedPasswordErrorMessage" @update="onRepeatedPasswordInput"/>
          <div class="flex justify-center mt-5 mb-2">
              <SubmitButton label="Kreiraj račun" @submit="onSubmit"></SubmitButton>
          </div>
        </RoundedCard>
    </form>
</template>