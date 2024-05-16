<template>
    <RoundedCard>
        <div class="w-full flex flex-row">
            <div class="flex items-center ">
                <img class="max-w-40 max-h-40" src="@/assets/blank_profile_picture.jpg">
            </div>
            <div class="w-full flex flex-col gap-2 pl-2">
                <div class="flex justify-center">
                        <p class="font-bold text-xl" >Pregled Kategorije</p>
                </div>
                <div class="h-px bg-slate-600 w-full"></div>
                <OneLabelAndDataTagInRow label="Ime Kategorije:" data="Negazirani sok"></OneLabelAndDataTagInRow>
                <OneLabelAndDataTagInRow label="Razina kategorije" data="Level 0"></OneLabelAndDataTagInRow>
            </div>
        </div>
    </RoundedCard>
</template>

<script setup lang="ts">
import OneLabelAndDataTagInRow from '@/components/dataTags/OneLabelAndDataTagInRow.vue';
import TwoLabelAndDataTagInRow from '@/components/dataTags/TwoLabelAndDataTagInRow.vue';
import RoundedCard from '@/components/cards/RoundedCard.vue';
</script>