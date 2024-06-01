<template>
    <div class="max-w-4xl">
        <div class="grid grid-cols-2 gap-2">
            <div v-if="!receiptStore.receipts.length" class="col-span-2 flex flex-row justify-center">
                <p>Ne postoji niti jedna primka</p>
            </div>
            <div v-else v-for="receipt in receiptStore.receipts" :key="receipt.id" class="col-span-1">
                <RouterLink :to="{ name: 'ReceiptPreview', params: { id: receipt.id }}">
                    <RoundedCard class="bg-gray-200 hover:bg-gray-400">
                        <div class="felx flex-col">
                            <div class="w-full">
                                <TwoLabelAndDataTagInRow 
                                    first-label="Br. primke"
                                    :first-data="receipt.receiptNumber"
                                    second-label="Ime Dobavljača"
                                    :second-data="receipt.supplierName"
                                >
                                </TwoLabelAndDataTagInRow>
                            </div>
                            <div class="w-full h-2"></div>
                            <div class="w-full">
                                <TwoLabelAndDataTagInRow 
                                    first-label="Kreirano"
                                    :first-data="receipt.uploadDate"
                                    second-label="Broj stavki"
                                    :second-data="receipt.receiptItems.length.toString()"
                                >
                                </TwoLabelAndDataTagInRow>
                                
                            </div>
                        </div>
                    </RoundedCard>
                </RouterLink>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { useReceiptStore } from '@/stores/ReceiptStore.ts'
import RoundedCard from '@/components/cards/RoundedCard.vue'
import TwoLabelAndDataTagInRow from '@/components/dataTags/TwoLabelAndDataTagInRow.vue';

const receiptStore = useReceiptStore()


</script>
