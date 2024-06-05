<template>
        <RoundedCard :background-color="backgroundColor">
            <div class="w-full flex flex-col">
                <div v-if="title" class="w-full flex flex-col">
                    <div class="flex flex-row justify-center">
                        <p class="font-bold text-xl">{{ title }}</p>
                    </div>
                    <div class="w-full h-5"></div>
                </div>
                <TwoLabelAndDataTagInRow
                    first-label="Ažuriranje uzrokovano dokumentom:"
                    :first-data="supply.updateCausedByDocumentName"
                    second-label="Ažurirano:"
                    :second-data="supply.updateDate"
                >
                </TwoLabelAndDataTagInRow>
                <div class="w-full h-2"></div>
                <OneLabelAndDataTagInRow label="Promjenu uzrokovao korisnik:" :data="supply.email"></OneLabelAndDataTagInRow>
                <div class="w-full h-5"></div>
                <div class="flex flex-col w-full">
                    <div class="grid grid-cols-6 w-full">
                        <div class="col-span-6 h-px bg-slate-600"></div>
                        <div class="flex flex-row justify-between items-center pl-1 bg-slate-300">
                            <p class="truncate">R. broj:</p>
                        </div>
                        <div class="flex flex-row justify-between items-center pl-1">
                            <p class="truncate">Šifra:</p>
                        </div>
                        <div class="col-span-2 flex flex-row justify-between items-center pl-1 bg-slate-300">
                            <p class="truncate">ime:</p>
                        </div>
                        <div class="flex flex-row justify-between items-center pl-1">
                            <p class="truncate">jed. mjere:</p>
                        </div>
                        <div class="flex flex-row justify-between items-center pl-1 bg-slate-300">
                            <p class="truncate">Količina:</p>
                        </div>
                        <div class="col-span-6 h-px bg-slate-600"></div>
                    </div>
                    <div v-for="(item, index) in supply.supplyItems" :key="item.rawMaterialId" class="grid grid-cols-6 w-full">
                        <div class="flex flex-row justify-between items-center pl-1 bg-slate-300">
                            <p class="truncate">{{ index + 1 }}.</p>
                        </div>
                        <div class="flex flex-row justify-between items-center pl-1">
                            <p class="truncate">{{ articleStore.getRawMaterialById(item.rawMaterialId)?.code }}</p>
                        </div>
                        <div class="col-span-2 flex flex-row justify-between items-center pl-1 bg-slate-300">
                            <p class="truncate">{{ articleStore.getRawMaterialById(item.rawMaterialId)?.name }}</p>
                        </div>
                        <div class="flex flex-row justify-between items-center pl-1">
                            <p class="truncate">{{ articleStore.getRawMaterialById(item.rawMaterialId)?.unit }}</p>
                        </div>
                        <div class="flex flex-row justify-between items-center pl-1 bg-slate-300">
                            <p class="truncate">{{ item.quantity }}</p>
                        </div>
                        <div class="col-span-6 h-px bg-slate-600"></div>
                    </div>
                </div>
            </div>
        </RoundedCard>
</template>

<script setup lang="ts">
import RoundedCard from '@/components/cards/RoundedCard.vue'
import TwoLabelAndDataTagInRow from '@/components/dataTags/TwoLabelAndDataTagInRow.vue'
import OneLabelAndDataTagInRow from '@/components/dataTags/OneLabelAndDataTagInRow.vue'
import { useArticleStore } from '@/stores/ArticleStor'
import type { Supply } from '@/types/Supply'

const props = defineProps<{
    title?: string,
    supply: Supply,
    backgroundColor?: string
}>()

const articleStore = useArticleStore()

</script>
