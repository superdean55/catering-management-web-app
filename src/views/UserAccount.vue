<template>
  <main class="w-full h-screen bg-slate-300 p-0">
    <div class="h-10"></div>
    <div class="max-w-xl mx-auto mt-10">
        <RoundedCard v-if="userStore.user">
            <div class="flex justify-center">
                <img ref="userAccountImage" class="rounded-lg h-40" src="../assets/blank_profile_picture.jpg">
            </div>
            <div class="flex flex-col gap-3 py-5">
                <TwoLabelAndDataTagInRow
                    first-label="Ime:"
                    :first-data="userStore.user.firstName"
                    second-label="Prezime:"
                    :second-data="userStore.user.lastName"
                ></TwoLabelAndDataTagInRow>
                <TwoLabelAndDataTagInRow
                    first-label="Telefon:"
                    :first-data="userStore.user.phoneNumber"
                    second-label="Datum rođenja:"
                    :second-data="userStore.user.born"
                ></TwoLabelAndDataTagInRow>
                <OneLabelAndDataTagInRow label="Email:" :data="userStore.user.email"></OneLabelAndDataTagInRow>
                
            </div>
            <div class="flex flex-row justify-between m-5">
                <ConfirmButton @confirm="signOut" class="w-2/5  lg:w-1/4 flex flex-row justify-center" label="Odjava">
                    <div class="w-2"></div>
                    <span class="material-symbols-outlined">logout</span>
                </ConfirmButton>
                <ConfirmButton @confirm="toEditUser" class="w-2/5  lg:w-1/4 flex flex-row justify-center" label="Izmjeni">
                    <div class="w-2"></div>
                    <span class="material-symbols-outlined">edit</span>
                </ConfirmButton>
            </div>
        </RoundedCard>
    </div>
  </main>
</template>

<script setup lang="ts">
import RoundedCard from '@/components/cards/RoundedCard.vue';
import TwoLabelAndDataTagInRow from '@/components/dataTags/TwoLabelAndDataTagInRow.vue'
import OneLabelAndDataTagInRow from '@/components/dataTags/OneLabelAndDataTagInRow.vue'
import ConfirmButton from '@/components/buttons/ConfirmButton.vue'
import { useUserStore } from '@/stores/UserStore';
import router from '@/router';
import { onMounted, ref } from 'vue';
import { watch } from 'vue';

const userStore = useUserStore()
const userAccountImage = ref<HTMLImageElement | null>(null);

watch(userAccountImage, (newValue, oldValue) => {
  if (newValue !== null && userStore.user && userStore.user.imageUrl && userStore.user.imageUrl !== '') {
    newValue.src = userStore.user.imageUrl;
  }
});

const signOut = () => {
    userStore.signOut()
    
}
const toEditUser = () => {
    console.log('toEditUSer')
    router.push({name: 'EditUserView'})
}
</script>
