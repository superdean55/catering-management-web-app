<template>
    <RoundedCard>
        <div v-if="category" class="w-full flex flex-row">
            <div  class="flex items-center ">
                <img class="max-w-40 max-h-40" :src="category.imageUrl">
            </div>
            <div class="flex items-center ">
                <img class="max-w-40 max-h-40" src="@/assets/blank_profile_picture.jpg">
            </div>
            <div class="w-full flex flex-col gap-2 pl-2">
                <div class="flex justify-center">
                        <p class="font-bold text-xl" >Pregled Kategorije</p>
                </div>
                <div class="h-px bg-slate-600 w-full"></div>
                <OneLabelAndDataTagInRow label="Ime Kategorije:" :data="category.name"></OneLabelAndDataTagInRow>
                <OneLabelAndDataTagInRow label="Razina kategorije" :data="category.level"></OneLabelAndDataTagInRow>
            </div>
        </div>
    </RoundedCard>
</template>

<script setup lang="ts">
import OneLabelAndDataTagInRow from '@/components/dataTags/OneLabelAndDataTagInRow.vue';
import RoundedCard from '@/components/cards/RoundedCard.vue';
import { useRoute } from 'vue-router';
import { useArticleStore } from '@/stores/ArticleStor';
const route = useRoute();
const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
const articleStore = useArticleStore();

// Dohvatite kategoriju na temelju userId
const category = articleStore.getCategoryById(id);

</script>