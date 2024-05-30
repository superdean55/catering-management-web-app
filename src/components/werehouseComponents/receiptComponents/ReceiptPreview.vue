<template>
    <div class="max-w-4xl">
        <RoundedCard>
            <div class="flex flex-col">
                <div class="flex flex-row justify-center">
                    <p class="font-bold text-2xl">Pregled Primke</p>
                </div>
                <div class="w-full h-4"></div>
                <div class="w-full h-px bg-gray-400"></div>
                <div class="w-full h-4"></div>
                <div v-if="receipt" class="flex flex-col w-full">
                    <div class="grid grid-cols-3 gap-2">
                        <div class="flex flex-row justify-between items-center">
                            <OneLabelAndDataTagInRow label="Br. primke:" :data="receipt.receiptNumber"></OneLabelAndDataTagInRow>
                            <div class="w-px bg-gray-400 h-8"></div>
                        </div>
                        <div class="flex flex-row justify-between items-center">
                            <OneLabelAndDataTagInRow label="Ime Dobavljača:" :data="receipt.supplierName"></OneLabelAndDataTagInRow>
                            <div class="w-px bg-gray-400 h-8"></div>
                        </div>
                        <OneLabelAndDataTagInRow label="Oib Dobavljača:" :data="receipt.supplierOib"></OneLabelAndDataTagInRow>
                        <div class="flex flex-row justify-between items-center">
                            <OneLabelAndDataTagInRow label="Oznaka Dokumenta" :data="receipt.documentIdentifier"></OneLabelAndDataTagInRow>
                            <div class="w-px bg-gray-400 h-8"></div>
                        </div>
                        <div class="flex flex-row justify-between items-center">
                            <OneLabelAndDataTagInRow label="Datum dokumenta:" :data="receipt.documentDate"></OneLabelAndDataTagInRow>
                            <div class="w-px bg-gray-400 h-8"></div>
                        </div>
                        <OneLabelAndDataTagInRow label="Datum unosa" :data="receipt.uploadDate"></OneLabelAndDataTagInRow>
                    </div>

                </div>
                <div class="w-full h-4"></div>
                <div class="w-full h-px bg-gray-400"></div>
                <div class="w-full h-4"></div>
                <div class="flex flex-row justify-center items-center h-10">
                    <p class="font-bold text-xl">Lista sirovina:</p>
                </div>
                <ReceiptItemsList
                    v-if="receipt"
                    :receiptItems="receipt.receiptItems"
                    :preview="true"
                >
                </ReceiptItemsList>
            </div>
        </RoundedCard>
    </div>
</template>

<script setup lang="ts">
import RoundedCard from '@/components/cards/RoundedCard.vue'
import { useRoute } from 'vue-router'
import { useReceiptStore } from '@/stores/ReceiptStore'
import { ref, watch } from 'vue'
import ReceiptItemsList from './ReceiptItemsList.vue'
import OneLabelAndDataTagInRow from '@/components/dataTags/OneLabelAndDataTagInRow.vue'

const route = useRoute()
const receiptStore = useReceiptStore()
const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
const receipt = ref(receiptStore.getReceiptById(id))

watch(() => route.params.id, (newId) => {
  const id = Array.isArray(newId) ? newId[0] : newId
  receipt.value = receiptStore.getReceiptById(id)
});

</script>
