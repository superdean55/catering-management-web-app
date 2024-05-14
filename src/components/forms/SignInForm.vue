<script setup lang="ts">
  import RoundedCard from '@/components/cards/RoundedCard.vue'
  import InputLabel from '@/components/inputs/InputLabel.vue'
  import SubmitButton from '@/components/buttons/SubmitButton.vue'
  import { useUserStore } from '@/stores/UserStore'
  
  import { ref } from 'vue'
  const UserStore = useUserStore()
  const email= ref<string>("");
  const password = ref<string>("")
  const emailErrorMessage = ref<string>("")
  const passwordErrorMessage = ref<string>("")

// output value key by key
  const onEmailInput = (e: { target: { value: string } }) => {
    email.value = e.target.value;
    emailErrorMessage.value = ""
    console.log(email.value)
  };
  const onPasswordInput = (e: { target: { value: string } }) => {
    password.value = e.target.value;
    passwordErrorMessage.value = ""
    console.log(password.value)
  };
  const onSubmit = () => {
    console.log('submit')
    console.log(email.value)
    console.log(password.value)
    UserStore.signIn(email.value, password.value)
  }
  const validateEmial = () => {
    console.log('email validation')
    const emailRegex: RegExp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/
    if(!emailRegex.test(email.value)) {
        console.log('email is not valid')
        emailErrorMessage.value = "is not valid email"
    }
  }
  const validatePassword = () => {
    console.log('pass validation')
    const passwordRegex: RegExp = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,32}$/
    if(!passwordRegex.test(password.value)){
        console.log('password is not valid')
        passwordErrorMessage.value = "lozinka mora sadržavati: 8,32 znaka, min. jedno malo slovo, jedno veliko slovo, jedan specijalan znak"
    }
  }
</script>

<template>
    <form @submit.prevent >
        <RoundedCard class="shadow-2xl">
            <InputLabel :value="email" name="Email:" type="email" :error="emailErrorMessage" @input="onEmailInput"/>
            <InputLabel :value="password" name="Password:" type="password" :error="passwordErrorMessage" @input="onPasswordInput"/>
            <div class="flex justify-center my-5">
                <SubmitButton label="Sign In" @submit="onSubmit"></SubmitButton>
            </div>
            <div class="flex justify-center">
                <RouterLink class="inline-block" :to="{ name: 'SignUpView' }" >You dont have account? Register</RouterLink>
            </div>
        </RoundedCard>
    </form>
</template>