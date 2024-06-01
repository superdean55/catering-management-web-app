<template>
    
        <div v-if="receiptItems.length" class="flex flex-col w-full">
            <div class="w-full flex flex-row justify-center">
                <p class="font-bold text-xl">Lista dodanih sirovina</p>
            </div>
            <div class="w-full h-4"></div>
            <div :class="preview ? 'grid grid-cols-8 w-full' : 'grid grid-cols-10 w-full'">
                <div class="col-span-10 h-px bg-slate-600"></div>
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
                <div class="flex flex-row justify-between items-center pl-1">
                    <p class="truncate">jed. cijena:</p>
                </div>
                <div class="flex flex-row justify-between items-center pl-1 bg-slate-300">
                    <p class="truncate">Iznos:</p>
                </div>
                <div v-if="!preview" class="flex flex-row justify-between items-center pl-1">
                    <p class="truncate">Obriši:</p>
                </div>
                <div v-if="!preview" class="flex flex-row justify-between items-center pl-1 bg-slate-300">
                    <p class="truncate">Ažuriraj:</p>
                </div>
                <div class="col-span-10 h-px bg-slate-600"></div>
            </div>
            <div >
                <div v-for="(receiptItem, index) in receiptItems" :key="receiptItem.id" :class="preview ? 'grid grid-cols-8 w-full' : 'grid grid-cols-10 w-full'">
                    <div class="flex flex-row justify-between items-center pl-1 bg-slate-300">
                        <p class="truncate">{{ index + 1 }}.</p>
                    </div>
                    <div class="flex flex-row justify-between items-center pl-1">
                        <p class="truncate">{{ getRawMaterial(receiptItem.rawMaterialId)?.code }}</p>
                    </div>
                    <div class="col-span-2 flex flex-row justify-between items-center pl-1 bg-slate-300">
                        <p class="truncate">{{ getRawMaterial(receiptItem.rawMaterialId)?.name }}</p>
                    </div>
                    <div class="flex flex-row justify-between items-center pl-1">
                        <p class="truncate">{{ getRawMaterial(receiptItem.rawMaterialId)?.unit }}</p>
                    </div>
                    <div class="flex flex-row justify-between items-center pl-1 bg-slate-300">
                        <p class="truncate">{{ receiptItem.quantity }}</p>
                    </div>
                    <div class="flex flex-row justify-between items-center pl-1">
                        <p class="truncate">{{ receiptItem.pricePerUnit }} €</p>
                    </div>
                    <div class="flex flex-row justify-between items-center pl-1 bg-slate-300">
                        <p class="truncate">{{ receiptItem.amount }} €</p>
                    </div>
                    <div v-if="!preview" class="flex flex-row justify-center items-center">
                            <span class="material-symbols-outlined cursor-pointer hover:text-orange-700" @click="emit('remove', index)">close</span>
                    </div>
                    <div v-if="!preview" class="flex flex-row justify-center items-center bg-slate-300">
                            <span class="material-symbols-outlined cursor-pointer hover:text-green-700" @click="emit('update', index)">update</span>
                    </div>
                    <div class="col-span-10 h-px bg-slate-600"></div>
                </div>
            </div>
            
        </div>
        <div v-else class="flex flex-row justify-center">
                <p class="font-bold mb-2">Lista sirovina je prazna</p>
        </div>
    
</template>

<script setup lang="ts">
import type { ReceiptItem } from '@/types/ReceiptItem'
import { useArticleStore } from '@/stores/ArticleStor'
import { defineProps, withDefaults } from 'vue'

const articleStore = useArticleStore()

const props = withDefaults(defineProps<{
    receiptItems: ReceiptItem[]
    preview?: boolean
}>(), {
    preview: false
})

const emit = defineEmits<{
    (e: 'remove', index: number): void
    (e: 'update', index: number): void
}>()
const getRawMaterial = (id: string) => {
  return articleStore.rawMaterials.find((item) => item.id === id) || null;
}
</script>

