<template>
    <div class="p-2 flex flex-col">
        <h2 class="text-xl font-bold mb-4">Zaklučak:{{ conclusion.number + ' ' + conclusion.paydeskName }}</h2>
        <div class="mb-2"><strong>Datum:</strong> {{ conclusion.date }}</div>
        <div class="mb-2"><strong>Vrijeme:</strong> {{ conclusion.time }}</div>
        <div class="mb-2"><strong>Korisnik:</strong> {{ conclusion.userName }}</div>
        
        <h3 class="text-lg font-semibold mb-2">Prodani proizvodi</h3>
        <table class="w-full mb-4 border-collapse">
            <thead>
            <tr class="bg-gray-200">
                <th class="border border-gray-300 p-2">Proizvod</th>
                <th class="border border-gray-300 p-2">Količina</th>
                <th class="border border-gray-300 p-2">Cijena</th>
                <th class="border border-gray-300 p-2">Iznos</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in conclusion.conclusionItems" :key="item.id">
                <td class="border border-gray-300 p-2">{{ item.productName }}</td>
                <td class="border border-gray-300 p-2">{{ item.quantity }}</td>
                <td class="border border-gray-300 p-2">{{ item.price.toFixed(2) + ' €' }}</td>
                <td class="border border-gray-300 p-2">{{ (item.price * item.quantity).toFixed(2) + ' €' }}</td>
            </tr>
            </tbody>
        </table>

        <div class="font-bold mb-2 flex flex-row justify-end"><strong>Ukupno:&nbsp;</strong> {{ conclusion.totalCash.toFixed(2) + ' €' }}</div>
        <div class="flex flex-row justify-end">
            <FilledButton label="Izađi" @confirm="onCancel" background-color="bg-orange-700" hover-color="hover:bg-orange-900" text-color="text-white">
                <span class="material-symbols-outlined">close</span>
            </FilledButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'
import FilledButton from '../buttons/FilledButton.vue'
import type { Conclusion } from '@/types/Conclusion'

const props = defineProps<{ conclusion: Conclusion }>()
const emit = defineEmits<{
    (e:'cancel'): void,
}>()

const onCancel = () => {
    emit('cancel')
}
</script>
