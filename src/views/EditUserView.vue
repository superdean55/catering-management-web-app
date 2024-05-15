<template>
    <main class="w-full h-screen bg-slate-300 p-0">
        <div class="h-10"></div>
        <div class="mx-auto max-w-xl mt-10">
            <RoundedCard v-if="user">
                <div class="flex justify-center">
                    <img ref="myImage" @click="selectPicture" class="rounded-lg h-40" src="@/assets/blank_profile_picture.jpg">
                    <input @change="handleFileUpload" type="file" accept="image/*" id="userImage" name="userImageUpload" style="display: none;">
                </div>
                <div class="flex flex-col gap-2 p-4">
                    <div class="flex flex-row gap-2 w-full">
                        <InputLabel class="w-full" v-model:value="firstName" type="text" name="Ime:"></InputLabel>
                        <InputLabel class="w-full" v-model:value="lastName" type="text" name="Prezime:"></InputLabel>
                    </div>
                    <div class="flex flex-row gap-2 w-full">
                        <InputLabel class="w-full" v-model:value="born" type="date" name="Datum rođenja:"></InputLabel>
                        <InputLabel class="w-full" v-model:value="phoneNumber" type="number" name="Telefon:"></InputLabel>
                    </div>
                </div>
                <div class="flex justify-center">
                    <button @click="updateUser">Update user</button>
                </div>
            </RoundedCard>
        </div>
    </main>
</template>

<script setup lang="ts">
import RoundedCard from '@/components/cards/RoundedCard.vue';
import InputLabel from '@/components/inputs/InputLabel.vue';
import { storageDateToInputString, inputDateToString} from '@/helpers/dateFormatterFun';
import { useUserStore } from '@/stores/UserStore';
import { watch } from 'vue';

import { ref } from 'vue';

const userStore = useUserStore()
const user = ref(userStore.user)

const firstName = ref(userStore.user?.firstName)
const lastName = ref(userStore.user?.lastName)
const born = ref(storageDateToInputString(userStore.user?.born as string))
const phoneNumber = ref(userStore.user?.phoneNumber)


const myImage = ref<HTMLImageElement | null>(null);
const selectedImageUrl = ref<string | null>(null)
console.log(`selected file initial: ${selectedImageUrl.value}`)

watch(myImage, (newValue, oldValue) => {
  if (newValue !== null && userStore.user && userStore.user.imageUrl && userStore.user.imageUrl !== '') {
    newValue.src = userStore.user.imageUrl;
  }
});

const selectPicture = () => {
    const inputElement = document.getElementById('userImage');
      if (inputElement) {
        inputElement.click();
      }
}
const handleFileUpload = (event: any) =>{
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    selectedImageUrl.value = imageUrl

    if (myImage.value) {
      myImage.value.src = imageUrl;
    }
}

const updateUser = () => {
    var date: string = ''
    if(born.value){
        date = inputDateToString(born.value)
    }
    if(
        selectedImageUrl.value && 
        userStore.user &&
        firstName.value &&
        lastName.value &&
        born.value &&
        phoneNumber.value
    ){
        console.log('in upload')
        userStore.uploadUserImage(selectedImageUrl.value, {
            uid: userStore.user.uid,
            email: userStore.user.email,
            firstName: firstName.value,
            lastName: lastName.value,
            imageUrl: '',
            imageName: '',
            born: date,
            phoneNumber: phoneNumber.value,
        })
    }
}
</script>
