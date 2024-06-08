<template>
    <div class="card-size-80">
      <div  class="relative w-full h-full rounded-xl border border-gray-600 flex flex-col justify-center items-center">
        <div class="absolute right-1 top-1 w-2 h-2 rounded-full bg-green-500"></div>
        <div class="table-size-40  bg-gray-500 flex felx-row justify-end" :class="tableShape">
          <div class="w-full h-full flex flex-col justify-center items-center">
            <p class="text-xs text-white">{{ tableName }}</p>
          </div>
        </div>
        <div v-for="(chair, index) in chairPositions" :key="index" :class="chair"></div>
      </div>
    </div>
</template>

<script setup lang="ts">
import type { TableCircleShapes } from '@/types/TableCircleShapes';
import type { TableCubeShapes } from '@/types/TableCubeShapes';
import {computed, ref, watch } from 'vue'
const props = defineProps<{
  shape: TableCircleShapes | TableCubeShapes
  name: string
}>()


const numberOfChairs = ref<number>(0)
const chairPosition = ref<string>(props.shape)
const tableShape = ref('rounded-full')
const tableName = ref(props.name)

watch(() => props.shape, (newShape) => {
  if(newShape){
    chairPosition.value = newShape
    if(chairPosition.value.includes('cube')){
      tableShape.value = ''
    }else{
      tableShape.value = 'rounded-full'
    }
  }
})
watch(() => props.name, (newName) => {
    tableName.value = props.name
})

if(chairPosition.value.includes('cube')){
  tableShape.value = ''
}
if(parseInt(chairPosition.value)){
  numberOfChairs.value = parseInt(chairPosition.value)
  console.log('numberOfChairs:',numberOfChairs.value)
}

const chairPositions = computed(() => {
  const positions: Record<string, string[]> = {
    '4-circle-4-chair-45': [
      'chair-45 position-circle-top-left-45',
      'chair-45 position-circle-top-right-45',
      'chair-45 position-circle-bottom-left-45',
      'chair-45 position-circle-bottom-right-45'
    ],
    '4-circle-2-chair-left-45-siter-right-0': [
      'chair-45 position-circle-top-left-45',
      'chair-45 position-circle-bottom-left-45',
      'two-siter-y two-siter-position-right-0'
    ],
    '4-circle-2-chair-right-45-siter-left-0': [
      'chair-45 position-circle-top-right-45',
      'chair-45 position-circle-bottom-right-45',
      'two-siter-y two-siter-position-left-0'
    ],
    '4-circle-2-chair-top-45-siter-bottom-0': [
      'chair-45 position-circle-top-left-45',
      'chair-45 position-circle-top-right-45',
      'two-siter-x two-siter-position-bottom-0'
    ],
    '4-circle-2-chair-bottom-45-siter-top-0': [
      'chair-45 position-circle-bottom-left-45',
      'chair-45 position-circle-bottom-right-45',
      'two-siter-x two-siter-position-top-0'
    ],
    '3-circle-3-chair-0-45-45': [
      'chair-45 position-circle-bottom-left-45',
      'chair-45 position-circle-bottom-right-45',
      'chair-0 position-circle-top-center-0'
    ],
    '2-circle-2-chair-y-0': [
      'chair-0 position-circle-bottom-center-0',
      'chair-0 position-circle-top-center-0'
    ],
    '2-circle-2-chair-x-0': [
      'chair-0 position-circle-left-center-0',
      'chair-0 position-circle-right-center-0'
    ],
    '2-circle-2-chair-left-45': [
      'chair-45 position-circle-top-left-45',
      'chair-45 position-circle-bottom-left-45'
    ],
    '2-circle-2-chair-top-45': [
      'chair-45 position-circle-top-left-45',
      'chair-45 position-circle-top-right-45'
    ],
    '2-circle-2-chair-right-45': [
      'chair-45 position-circle-top-right-45',
      'chair-45 position-circle-bottom-right-45'
    ],
    '2-circle-2-chair-bottom-45': [
      'chair-45 position-circle-bottom-left-45',
      'chair-45 position-circle-bottom-right-45'
    ],
    '2-circle-siter-top-0':[
      'two-siter-x two-siter-position-top-0'
    ],
    '2-circle-siter-right-0':[
      'two-siter-y two-siter-position-right-0'
    ],
    '2-circle-siter-bottom-0':[
      'two-siter-x two-siter-position-bottom-0'
    ],
    '2-circle-siter-left-0':[
      'two-siter-y two-siter-position-left-0'
    ],
    '4-cube-2-chair-top-0-2-chair-bottom-0': [
      'chair-0 chair-position-cube-top-left-0',
      'chair-0 chair-position-cube-top-right-0',
      'chair-0 chair-position-cube-bottom-left-0',
      'chair-0 chair-position-cube-bottom-right-0',
    ],
    '4-cube-2-chair-left-0-2-chair-right-0': [
      'chair-0 chair-position-cube-left-top-0',
      'chair-0 chair-position-cube-left-bottom-0',
      'chair-0 chair-position-cube-right-top-0',
      'chair-0 chair-position-cube-right-bottom-0',
    ],
    '4-cube-2-chair-left-0-siter-right-0': [
      'chair-0 chair-position-cube-left-top-0',
      'chair-0 chair-position-cube-left-bottom-0',
      'two-siter-y two-siter-position-right-0',
    ],
    '4-cube-2-chair-top-0-siter-bottom-0': [
      'chair-0 chair-position-cube-top-left-0',
      'chair-0 chair-position-cube-top-right-0',
      'two-siter-x two-siter-position-bottom-0',
    ],
    '4-cube-2-chair-right-0-siter-left-0': [
      'chair-0 chair-position-cube-right-top-0',
      'chair-0 chair-position-cube-right-bottom-0',
      'two-siter-y two-siter-position-left-0',
    ],
    '4-cube-2-chair-bottom-0-siter-top-0': [
      'chair-0 chair-position-cube-bottom-left-0',
      'chair-0 chair-position-cube-bottom-right-0',
      'two-siter-x two-siter-position-top-0',
    ],
    '4-cube-4-chair-center-0': [
      'chair-0 position-circle-left-center-0',
      'chair-0 position-circle-top-center-0',
      'chair-0 position-circle-right-center-0',
      'chair-0 position-circle-bottom-center-0',
    ],
    '2-cube-2-chair-left-0': [
      'chair-0 chair-position-cube-left-top-0',
      'chair-0 chair-position-cube-left-bottom-0'
    ],
    '2-cube-2-chair-top-0': [
      'chair-0 chair-position-cube-top-left-0',
      'chair-0 chair-position-cube-top-right-0'
    ],
    '2-cube-2-chair-right-0': [
      'chair-0 chair-position-cube-right-top-0',
      'chair-0 chair-position-cube-right-bottom-0'
    ],
    '2-cube-2-chair-bottom-0': [
      'chair-0 chair-position-cube-bottom-left-0',
      'chair-0 chair-position-cube-bottom-right-0'
    ],
  }
  return positions[chairPosition.value] || []
})


</script>

<style scoped>
.card-size-80{
  width: 80px;
  height: 80px;
}
.table-size-40{
  width: 40px;
  height: 40px;
}
.chair-45 {
  width: 13px;
  height: 13px;
  background-color: #6b7280;
  position: absolute;
  transform: rotate(45deg);
}
.chair-0{
  width: 13px;
  height: 13px;
  background-color: #6b7280;
  position: absolute;
}
.two-siter-x{
  width: 40px;
  height: 13px;
  background-color: #6b7280;
  position: absolute;
}
.two-siter-y{
  width: 13px;
  height: 40px;
  background-color: #6b7280;
  position: absolute;
}
.two-siter-position-right-0{
  top:19px;
  right:3px;
}
.two-siter-position-left-0{
  top:19px;
  left:3px;
}
.two-siter-position-top-0{
  top:3px;
  left:19px;
}
.two-siter-position-bottom-0{
  bottom:3px;
  left:19px;
}
.position-circle-top-center-0{
  left:33px;
  top:3px;
}
.position-circle-bottom-center-0{
  left:33px;
  bottom:3px;
}
.position-circle-left-center-0{
  top:33px;
  left:3px;
}
.position-circle-right-center-0{
  top:33px;
  right:3px;
}

.position-circle-bottom-left-45{
  left: 11px;
  bottom: 11px;
}
.position-circle-bottom-right-45{
  right: 11px;
  bottom: 11px;
}
.position-circle-top-left-45{
  top: 11px;
  left: 11px;
}
.position-circle-top-right-45{
  top: 11px;
  right: 11px;
}
.chair-position-cube-top-left-0{
  left:19px;
  top:3px;
}
.chair-position-cube-top-right-0{
  right:19px;
  top:3px;
}
.chair-position-cube-bottom-left-0{
  left:19px;
  bottom:3px;
}
.chair-position-cube-bottom-right-0{
  right:19px;
  bottom:3px;
}
.chair-position-cube-left-top-0{
  left:3px;
  top:19px;
}
.chair-position-cube-left-bottom-0{
  left:3px;
  bottom:19px;
}
.chair-position-cube-right-top-0{
  right:3px;
  top:19px;
}
.chair-position-cube-right-bottom-0{
  right:3px;
  bottom:19px;
}
</style>