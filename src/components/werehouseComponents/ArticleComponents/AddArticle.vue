<template>
    <div class="w-full flex flex-row">
        <div class="flex items-center ">
            <img class="max-w-40 max-h-40" src="@/assets/blank_profile_picture.jpg">
        </div>
        <div class="w-full flex flex-col gap-2">
            <TwoLabelAndDataTagInRow first-label="Ime artikla:" first-data="Coca cola" second-label="Šifra artikla:" second-data="456789"></TwoLabelAndDataTagInRow>
            <OneLabelAndDataTagInRow label="Jedinica mjere:" data="Komad"></OneLabelAndDataTagInRow>
            <OneLabelAndDataTagInRow label="Kategorija:" data="Negazirani sok"></OneLabelAndDataTagInRow>
            <OneLabelAndDataTagInRow label="Porezna stopa:" data="25%"></OneLabelAndDataTagInRow>
        </div>
    </div>
</template>

<script setup lang="ts">
import OneLabelAndDataTagInRow from '@/components/dataTags/OneLabelAndDataTagInRow.vue';
import TwoLabelAndDataTagInRow from '@/components/dataTags/TwoLabelAndDataTagInRow.vue';
</script>
