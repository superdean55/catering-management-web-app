<template>
    <div class="p-2 flex flex-col">
        <AlertDialog 
            :title="alertTitle"
            :message="alertMessage" 
            :show-dialog="isAlertDialogVisible"
            @confirm="onAlertDialogConfirm"
            @reject="onAlertDialogReject"
        ></AlertDialog>
        <h2 class="text-xl font-bold mb-4">Račun</h2>
        <div v-if="!bill.isCancelled" class="flex flex-row justify-end">
            <FilledButton label="Storniraj" @confirm="onBillCancelled" background-color="bg-red-500" hover-color="hover:bg-green-500"></FilledButton>
        </div>
        <div class="mb-2"><strong>Rč.Br:</strong> {{ bill.number }}</div>
        <div class="mb-2"><strong>Datum:</strong> {{ bill.Date }}</div>
        <div class="mb-2"><strong>Vrijeme:</strong> {{ bill.Time }}</div>
        <div class="mb-2"><strong>Table ID:</strong> {{ bill.tableId }}</div>
        <div class="mb-2"><strong>User:</strong> {{ bill.user }}</div>
        <div class="mb-2"><strong>Blagajna:</strong> {{ bill.paydeskName }}</div>
        
        <div class="mb-4"><strong>Cancelled:</strong> {{ bill.isCancelled ? 'Yes' : 'No' }}</div>
        
        <h3 class="text-lg font-semibold mb-2">Proizvodi</h3>
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
            <tr v-for="item in bill.billItems" :key="item.id">
                <td class="border border-gray-300 p-2">{{ item.productName }}</td>
                <td class="border border-gray-300 p-2">{{ item.quantity }}</td>
                <td class="border border-gray-300 p-2">{{ item.price.toFixed(2) + ' €' }}</td>
                <td class="border border-gray-300 p-2">{{ (item.price * item.quantity).toFixed(2) + ' €' }}</td>
            </tr>
            </tbody>
        </table>
  
        <div class="font-bold mb-2 flex flex-row justify-end"><strong>Ukupno:&nbsp;</strong> {{ bill.totalCash.toFixed(2) + ' €' }}</div>
        <div class="mb-2 text-xs"><strong>JIR:</strong> {{ bill.JIR }}</div>
        <div class="mb-2 text-xs"><strong>ZKI:</strong> {{ bill.ZKI }}</div>
        <div class="flex flex-row justify-end">
            <FilledButton label="Izađi" @confirm="onCancel" background-color="bg-orange-700" hover-color="hover:bg-orange-900" text-color="text-white">
                <span class="material-symbols-outlined">close</span>
            </FilledButton>
        </div>
    </div>
    
  </template>
  
  <script setup lang="ts">
  import { defineProps, ref } from 'vue'
  import type { Bill } from '@/types/Bill'
  import FilledButton from '../buttons/FilledButton.vue'
  import AlertDialog from '../dialogs/AlertDialog.vue'
  
  const props = defineProps<{ bill: Bill }>()
  const emit = defineEmits<{
    (e:'cancel'): void,
    (e:'billcancelled', bill: Bill)
  }>()
  const alertMessage = ref<string>('')
  const alertTitle = ref<string>('Storniranje računa')
  const isAlertDialogVisible = ref<boolean>(false)

  const onBillCancelled = () => {
    isAlertDialogVisible.value = true
    alertMessage.value = `Jeste li sigurni da želite obrisati Rč.Br.:${props.bill.number}`
  }
  const onAlertDialogConfirm = () => {
    isAlertDialogVisible.value = false
    emit('billcancelled', props.bill)
  }

  const onAlertDialogReject = () => {
    isAlertDialogVisible.value = false
  }
  const onCancel = () => {
    emit('cancel')
  }
  </script>
