<template>
    <RoundedCard class="flex flex-col max-h-screen overflow-y-auto scrollbar-hide gap-2 w-full">
        <div class="flex flex-col items-center justify-center w-full mb-3">
            <p class="font-bold">Categorys List</p>
        </div>
        
        <CategoryLevelCard v-if="levelZeroCategories.length" :categorys="levelZeroCategories" level="Level 0"></CategoryLevelCard>
        <CategoryLevelCard v-if="levelOneCategories.length" :categorys="levelOneCategories" level="Level 1"></CategoryLevelCard>
        <CategoryLevelCard v-if="levelTwoCategories.length" :categorys="levelTwoCategories" level="Level 2"></CategoryLevelCard>
        <CategoryLevelCard v-if="levelThreeCategories.length" :categorys="levelThreeCategories" level="Level 3"></CategoryLevelCard>
        <CategoryLevelCard v-if="levelFourCategories.length" :categorys="levelFourCategories" level="Level 4"></CategoryLevelCard>
    </RoundedCard>
</template>

<script setup lang="ts">
import RoundedCard from '@/components/cards/RoundedCard.vue';
import CategoryLevelCard from './CategoryLevelCard.vue'
import { useArticleStore } from '@/stores/ArticleStor';
import { computed } from 'vue';

const articleStore = useArticleStore()
const levelZeroCategories = computed(() => articleStore.levelZeroCategories);
const levelOneCategories = computed(() => articleStore.levelOneCategories);
const levelTwoCategories = computed(() => articleStore.levelTwoCategories);
const levelThreeCategories = computed(() => articleStore.levelThreeCategories);
const levelFourCategories = computed(() => articleStore.levelFourCategories);
</script>
