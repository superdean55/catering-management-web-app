<template>
  <main class="w-full h-screen bg-slate-300 p-0">
    <div class="h-10"></div>
    <div class="max-w-xl mx-auto mt-10">
        <RoundedCard>
            <div class="flex justify-center">
                <img class="rounded-lg h-40" src="@/assets/blank_profile_picture.jpg" alt="">
            </div>
            <div class="flex flex-col gap-3 py-5">
                <TwoLabelAndDataTagInRow
                    first-label="Ime:"
                    first-data="Dejan"
                    second-label="Prezime:"
                    second-data="Mihić"
                ></TwoLabelAndDataTagInRow>
                <OneLabelAndDataTagInRow label="Email:" :data="userStore.user.email"></OneLabelAndDataTagInRow>
                <OneLabelAndDataTagInRow label="Telefon:" data="0977047011"></OneLabelAndDataTagInRow>
            </div>
            <div class="flex flex-row justify-between mx-5">
                <ConfirmButton @confirm="signOut" class="w-1/4 flex flex-row justify-center" label="Log Out">
                    <div class="w-2"></div>
                    <span class="material-symbols-outlined">logout</span>
                </ConfirmButton>
                <ConfirmButton class="w-1/4 flex flex-row justify-center" label="Edit">
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

const userStore = useUserStore()
const signOut = () => {
    userStore.signOut()
    router.push({ name: 'HomeView'})
}
</script>
