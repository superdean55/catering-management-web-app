<template>
    <div class="grid grid-cols-3 gap-2 w-full">
        <div class="col-span-2">
            <RoundedCard>
                <AddArticle></AddArticle>
            </RoundedCard>
        </div>
        <div class="col-span-1">
            <RoundedCard><p>Component List</p></RoundedCard>
        </div>
    </div> 
</template>

<script setup>
import RoundedCard from '../cards/RoundedCard.vue'
import AddArticle from './ArticleComponents/AddArticle.vue'
</script>
