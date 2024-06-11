<template>
    <main class="w-full min-h-screen bg-slate-300 p-0">
        <div class="h-10 w-full"></div>
        <ManageTableDialog v-if="tableClicked" :showDialog="showTableDialog" :table="tableClicked" @update="onTableDialogUpdate"></ManageTableDialog>
        <div class="w-full flex flex-col gap-2 py-5">
            <RestaurantLayout>
                <template v-for="slot in tableSlots" :key="slot.id" v-slot:[slot.id]>
                    <div v-if="slot.name === 'empty'" @click="onEmptySlotClicked(slot.id)"  class="w-20 h-20 flex flex-col justify-center items-center bg-gray-500 cursor-pointer">
                        <p>{{ slot.id }}</p>
                        <p>prazan slot</p>
                    </div>
                    <TableCard v-else :name="slot.name" :shape="slot.shape" @click="onTableClicked(slot)" class="cursor-pointer"></TableCard>

                </template>
                <template #info>
                    <div class="w-full flex flex-row justify-center items-center">
                        <span class="material-symbols-outlined text-orange-600">warning</span>
                        <p class="font-bold truncate text-orange-600">Kliknite na prazan slot za dodavanje stola</p>
                    </div>
                </template>
            </RestaurantLayout>
            <div class="flex flex-col gap-2 py-5">
                <div class="flex flex-row gap-4 justify-center">
                    <div class="flex flex-col gap-2">
                        <p class="font-bold text-xl">Dodaj stol</p>
                        <div class="flex flex-col gap-2 items-center w-60 rounded-xl border border-gray-500 p-2 bg-gray-200">
                            <div class="felx flex-col h-7 gap-1">
                                <p v-if="tableId.length" class="font-bold text-xl">{{ tableId }}</p>
                                
                                <p v-else class="text-red-500">{{ idErrorMessage }}</p>
                            </div>
                            <div class="flex flex-col items-center">
                                <div v-if="selectedTableShape">
                                    <TableCard :name="tableName" :shape="selectedTableShape"></TableCard>
                                </div>
                                <div v-else class="w-20 h-20 bg-gray-500 flex flex-row justify-center items-center">
                                    <p class="font-bold text-sm text-white">prazno</p>
                                </div>
                                <p v-if="selectedTableErrorMessage.length" class="text-red-500">{{ selectedTableErrorMessage }}</p>
                            </div>
                            <InputLabelV2
                                type="text"
                                label="ime stola:"
                                :value="tableName"
                                @update="onTableNameChanged"
                                :error="nameErrorMessage"
                            ></InputLabelV2>
                            <div class="w-full flex flex-row justify-center" id="section">
                                <ConfirmButton @confirm="onAddTableConfirm" label="Dodaj"></ConfirmButton>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="flex flex-col gap-2 max-w-3xl">
                            <div class="h-6"></div>
                            <div class="flex flex-row items-center">
                                <span class="material-symbols-outlined text-orange-600 text-lg">warning</span>
                                <p class="font-bold truncate pl-1">Potrebno je kliknuti na neki od stolova</p>
                            </div>
                            <div class="flex felx-row items-center">
                                <p class="font-bold truncate ">Držite</p>
                                <span class="material-symbols-outlined text-orange-600 text-lg">shift</span>
                                <p class="font-bold truncate ">(shift) za horizontalno skrolanje</p>
                            </div>
                            <p class="font-bold text-xl">Okrugli stolovi</p>
                            <div class="flex flex-row gap-2 rounded-xl p-2 border border-gray-500 overflow-hidden overflow-x-scroll scrollbar-hide horizontal-scroll bg-gray-800">
                                <div
                                    v-for="(tableShape, index) in TableCircleShapes"
                                    :key="index"
                                    class="w-20 h-20 cursor-pointer"
                                    @click="onTableShapeClicked(tableShape)"
                                >
                                    <TableCard
                                        :shape="tableShape"
                                        name="ime"
                                        class="hover:cursor-pointer"
                                    ></TableCard>
                                </div>
                            </div>
                            <p class="font-bold text-xl">Kockasti stolovi</p>
                            <div class="flex flex-row gap-2 rounded-xl p-2 border border-gray-500 overflow-hidden overflow-x-scroll scrollbar-hide horizontal-scroll bg-gray-800">
                                <div
                                    v-for="(tableShape, index) in TableCubeShapes"
                                    :key="index"
                                    class="w-20 h-20 cursor-pointer"
                                    @click="onTableShapeClicked(tableShape)"
                                >
                                    <TableCard
                                        :shape="tableShape"
                                        name="ime"
                                        class="hover:cursor-pointer"
                                    ></TableCard>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
      
    </main>
</template>
  
<script setup lang="ts">
import { TableCircleShapes } from '@/types/TableCircleShapes'
import TableCard from '@/components/restaurantTables/TableCard.vue'
import RestaurantLayout from '../components/restaurantLayout/RestaurantLayout.vue'
import { ref, watch } from 'vue'
import { TableCubeShapes } from '@/types/TableCubeShapes'
import InputLabelV2 from '@/components/inputs/InputLabelV2.vue'
import ConfirmButton from '@/components/buttons/ConfirmButton.vue'
import { useTableStore } from '@/stores/TableStore'
import type { Table } from '@/types/Table'
import { storeToRefs } from 'pinia'
import { isValidTableId } from '@/helpers/isValidTableId'
import ManageTableDialog from '../components/dialogs/ManageTableDialog.vue'

const selectedTableShape = ref<TableCircleShapes | TableCubeShapes | null>(null)
const tableName = ref<string>('')
const nameErrorMessage = ref<string>('')
const tableId = ref<string>('')
const selectedTableErrorMessage = ref<string>('')
const idErrorMessage = ref<string>('')
const tableStore = useTableStore()
const tableClicked = ref<Table>()

const showTableDialog = ref<boolean>(false)

const tableSlots = ref<Table[]>([])
const { tables } = storeToRefs(tableStore)

const tableSlotsUpdate = () => {
    tableSlots.value = []
    for (let i = 0; i < 22; i++) {
        var id = `table-${i + 1}`
        const table = tableStore.getTableById(id)
        if(table){
            console.log('in if')
            tableSlots.value.push(
                table as Table  
            )
        }else{
            tableSlots.value.push(
                {
                    id: id,
                    name: 'empty',
                    shape: 'empty' as TableCircleShapes,
                    cretaionDate: '',
                    lastTimeUsed: ''
                } as Table
            )
        }
    }
}

tableSlotsUpdate()

watch(tables.value, (newState) => {
    console.log('newState')
    tableSlotsUpdate()
})

const onEmptySlotClicked = (id: string) => {
    tableId.value = id
    idErrorMessage.value = ''
    setTimeout(() => {
        const sectionElement = document.getElementById('section')
        if (sectionElement) {
            sectionElement.scrollIntoView({ behavior: 'smooth' })
        }
    }, 0)
}
const onTableNameChanged = (value: string) => {
    nameErrorMessage.value = ''
    tableName.value = value
}
const onTableShapeClicked = (tableShape: TableCircleShapes | TableCubeShapes) => {
    selectedTableErrorMessage.value = ''
    selectedTableShape.value = tableShape
}
const onTableClicked = (table: Table) => {
    tableClicked.value = table
    showTableDialog.value = true
}
const onTableDialogUpdate = (showDialog: boolean) => {
    showTableDialog.value = showDialog
}
const onAddTableConfirm = () => {
    var isValid = true
    if(!selectedTableShape.value){
        selectedTableErrorMessage.value = 'stol nije odabran'
        isValid = false
    }

    if(!tableId.value.length){
        idErrorMessage.value = 'niste kliknuli na prazan slot'
        isValid = false
    }
    if(tableStore.getTableById(tableId.value)){
        idErrorMessage.value = 'id zauzet'
        isValid = false
    }
    if(!isValidTableId(tableId.value)){
        idErrorMessage.value = 'neispravan id'
        isValid = false
    }
    if(!(tableName.value.length >= 1 && tableName.value.length <= 6)){
        nameErrorMessage.value = 'min 1 max 6 znakova'
        isValid = false
    }
    if(isValid){
        console.log('adding table')
        const table = {
            id: tableId.value,
            dbId: '',
            name: tableName.value,
            shape: selectedTableShape.value,
            cretaionDate: '',
            lastTimeUsed: ''
        } as Table
        console.log(table)
        tableStore.addTable(table)
        tableId.value = ''
        tableName.value = ''
        selectedTableShape.value = null
    }

}
</script>

<style scoped>

</style>