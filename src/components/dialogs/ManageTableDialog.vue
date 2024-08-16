<template>
    <CustomDialog background-color="bg-gray-800" :show-dialog="showCustomDialog" @update="onShowDialogUpdate">
        <div v-if="showMainTableScreen" class="flex flex-row items-center justify-center gap-4">
            <div class="flex flex-col gap-2 items-center">
                <div class="flex flex-col items-center">
                    <p class="font-bold text-lg text-white">{{ table.id }}</p>
                    <p class="text-sm text-red-500">{{ shapeErrorMessage }}</p>
                </div>
                <div @click="onTableClicked" class="w-24 h-24 cursor-pointer border border-gray-600 hover:bg-gray-300 flex felx-row justify-center items-center">
                    <TableCard :shape="shape" :name="name" :backgroudColor="backgroudColor"></TableCard>
                </div>
                <div class="flex flex-col items-center">
                    <p @click="onTableNameClicked" class="font-bold text-xl text-white cursor-pointer p-1 border border-gray-600 hover:bg-gray-300">{{ name }}</p>
                    <p class="text-sm text-red-500">{{ nameErrorMessage }}</p>
                </div>
            </div>
            <div class="flex flex-col items-center justify-center gap-2 w-28">
                <button @click="onUpdateTableClicked" class="w-full py-1 rounded bg-orange-600 hover:bg-orange-800">
                    <div class="w-full flex flex-row justify-center gap-1">
                        <p class="font-bold text-white text-lg">Ažuriraj</p>
                        <span class="material-symbols-outlined text-lg text-white">update</span>
                    </div>
                </button>
                <button @click="onDeleteTableClicked" class=" w-full py-1 rounded bg-orange-600 hover:bg-orange-800">
                    <div class="w-full flex flex-row justify-center gap-1">
                        <p class="font-bold text-white text-lg">Obriši</p>
                        <span class="material-symbols-outlined text-lg text-white">delete</span>
                    </div>
                </button>
                <div class="m-auto"></div>
                <button @click="onCancelTableDialog" class="w-full py-1 rounded bg-orange-600 hover:bg-orange-800">
                    <div class="w-full flex flex-row justify-center gap-1">
                        <p class="font-bold text-white text-lg">Izađi</p>
                        <span class="material-symbols-outlined text-lg text-white">cancel</span>
                    </div>
                </button>
            </div>
        </div>
        <div v-else-if="showTablesScreen" :style="{width: screenStore.isSmallScreen ? dialogWidth + 'px' : '576px'}">
            <div class=" w-full flex flex-col gap-2">
                <div @click="onArrowBack" class="flex flex-row justify-center items-center rounded-full w-10 h-10 bg-gray-300 hover:bg-gray-500 cursor-pointer"><span class="material-symbols-outlined text-lg text-white">arrow_back</span></div>         
                <p class="font-bold text-xl">Okrugli stolovi</p>
                <div class="flex flex-row gap-2 rounded-xl p-2 border border-gray-500 overflow-hidden overflow-x-scroll scrollbar-hide horizontal-scroll bg-gray-800">
                    <div
                        v-for="(tableShape, index) in TableCircleShapes"
                        :key="index"
                        class="w-20 h-20 cursor-pointer"
                        :class="shape === tableShape ? 'bg-gray-200' : '' "
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
                        :class="shape === tableShape ? 'bg-gray-200' : '' "
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
        <div v-else-if="showChangeNameScreen" class="flex flex-col gap-2">
            <div @click="onArrowBack" class="flex flex-row justify-center items-center rounded-full w-10 h-10 bg-gray-300 hover:bg-gray-500 cursor-pointer">
                <span class="material-symbols-outlined text-lg text-white">arrow_back</span>
            </div>         
            <div class="flex flex-row justify-center">
                <p class="font-bold text-white text-lg">Promjeni ime stola</p>
            </div>
            <input type="text" v-model="name">
        </div>
    </CustomDialog>
</template>

<script setup lang="ts">
import type { Table } from '@/types/Table'
import CustomDialog from './CustomDialog.vue'
import TableCard from '../restaurantTables/TableCard.vue'
import { computed, ref, watch } from 'vue'
import { TableCircleShapes } from '@/types/TableCircleShapes'
import { TableCubeShapes } from '@/types/TableCubeShapes'
import { isSelectionValid } from '@/helpers/isSelectionValid'
import { useTableStore } from '@/stores/TableStore'
import { useScreenStore } from '@/stores/ScreenStore'

const props = defineProps<{
    showDialog: boolean,
    table: Table,
}>()

const emit = defineEmits<{
    (e: 'update', showDialog: boolean): void
}>()

const tableStore = useTableStore()
const screenStore = useScreenStore()

const showCustomDialog = ref<boolean>(props.showDialog)
const shape = ref<TableCircleShapes | TableCubeShapes>(props.table.shape)
const shapeErrorMessage = ref<string>('')
const name = ref<string>(props.table.name)
const nameErrorMessage = ref<string>('')
const id = ref<string>(props.table.id)
const showMainTableScreen = ref<boolean>(true)
const showTablesScreen = ref<boolean>(false)
const showChangeNameScreen = ref<boolean>(false)
const backgroudColor = ref<string>(props.table.backgroundColor)

const onShowDialogUpdate = (showDialog: boolean) => {
    showMainTableScreen.value = true
    showTablesScreen.value = false
    showChangeNameScreen.value = false
    emit('update', showDialog)
}
const dialogWidth = computed(() => {
    return screenStore.screenWidth - 62
})
watch(() => props.showDialog, (newValue) => {
    showCustomDialog.value = newValue
})
watch(() => props.table, (newTable) => {
    shape.value = newTable.shape
    name.value = newTable.name
    id.value = newTable.id
    backgroudColor.value = newTable.backgroundColor
})
const onTableClicked = () => {
    showMainTableScreen.value = false
    showTablesScreen.value = true
    showChangeNameScreen.value = false
}
const onTableNameClicked = () => {
    showMainTableScreen.value = false
    showTablesScreen.value = false
    showChangeNameScreen.value = true
}
const onTableShapeClicked = (tableShape: TableCircleShapes | TableCubeShapes) => {
    shape.value = tableShape
}
const onUpdateTableClicked = () => {
    var isValid = true
    if(!(name.value.length >= 1 && name.value.length <= 6)){
        nameErrorMessage.value = 'min 1 max 6 znakova'
        isValid = false
    }
    if(!(isSelectionValid(shape.value, TableCircleShapes) || isSelectionValid(shape.value, TableCubeShapes))){
        shapeErrorMessage.value = 'ne postoji'
        isValid = false
    }
    if(isValid){
        
        const table = {
            id: id.value,
            dbId: '',
            name: name.value,
            shape: shape.value,
            creationDate: '',
            lastTimeUsed: '',
            timeDifference: 0,
            backgroundColor: ''
        } as Table
        tableStore.updateTable(table)
        onCancelTableDialog()
    }
}
const onDeleteTableClicked = () => {
    tableStore.deleteTable(id.value)
    onCancelTableDialog()
}
const onCancelTableDialog = () => {
    showMainTableScreen.value = true
    showTablesScreen.value = false
    showChangeNameScreen.value = false
    emit('update', false)
}
const onArrowBack = () => {
    showMainTableScreen.value = true
    showTablesScreen.value = false
    showChangeNameScreen.value = false
}
</script>
