<template>
    <div class="w-full flex flex-col gap-2">
      <div class="w-full flex justify-center items-center gap-2" :style="{ flexDirection: isMedimuScreen ? 'column' : 'row'}">
        <div class="border-8 rounded-lg border-gray-500 bg-gray-800 p-2">
          <div :class="screenStore.isSmallScreen ? 'restaurant-layout-container-small-screen' : 'restaurant-layout-container'">
            <div class="col-span-2 row-span-2"></div>
            <div class="col-span-4 row-span-2 bg-gray-500 flex flex-row justify-center items-center border border-black">
              <p class="font-bold text-white text-xs md:text-xl">Toalet Ženski</p>
            </div>
            <div class="col-span-2 row-span-2"></div>
            <div class="col-span-2 row-span-2"><slot name="table-13"></slot></div>
            <div class="col-span-1 row-span-2"></div>
            <div class="col-span-2 row-span-2"><slot name="table-14"></slot></div>
            <div class="col-span-2 row-span-2"></div>
            <div class="col-span-4 row-span-2 bg-gray-500 flex flex-row justify-center items-center border border-black">
              <p class="font-bold text-white text-xs md:text-xl">Toalet Muški</p>
            </div>
            <div class="col-span-7 row-span-1"></div>
            <div class="col-span-2 row-span-2"></div>
            <div class="col-span-2 row-span-2"><slot name="table-11"></slot></div>
            <div class="col-span-1 row-span-2 "></div>
            <div class="col-span-2 row-span-2"><slot name="table-12"></slot></div>
            <div class="col-span-5 row-span-2  border-t border-black flex felx-row justify-center items-center">
              <p class="font-bold text-white text-xs md:text-xl">Šank</p>
            </div>
            <div class="col-span-1 row-span-2 bg-gray-500"></div>
            <div class="col-span-7 row-span-1 "></div>
            <div class="col-span-1 row-span-1"></div>
            <div class="col-span-4 row-span-1 bg-gray-500"></div>
            <div class="cols-span-1 row-span-1 bg-gray-500 rounded-br-xl"></div>
            <div class="col-span-2 row-span-2"></div>
            <div class="col-span-2 row-span-2"><slot name="table-9"></slot></div>
            <div class="col-span-1 row-span-2 "></div>
            <div class="col-span-2 row-span-2"><slot name="table-10"></slot></div>
            <div class="col-span-6 row-span-2"></div>
            <div class="col-span-2 row-span-1"></div>
            <div class="col-span-5 row-span-1"></div>
            <div class="col-span-2 row-span-2"><slot name="table-1"></slot></div>
            <div class="col-span-1 row-span-2 "></div>
            <div class="col-span-2 row-span-2"><slot name="table-2"></slot></div>
            <div class="col-span-3 row-span-2"></div>
            <div class="col-span-2 row-span-2"><slot name="table-7"></slot></div>
            <div class="col-span-1 row-span-2 "></div>
            <div class="col-span-2 row-span-2"><slot name="table-8"></slot></div>
            <div class="col-span-12 row-span-1"></div>
            <div class="col-span-1 row-span-1"></div>
            <div class="col-span-2 row-span-2"><slot name="table-3"></slot></div>
            <div class="col-span-1 row-span-2 "></div>
            <div class="col-span-2 row-span-2"><slot name="table-4"></slot></div>
            <div class="col-span-3 row-span-2"></div>
            <div class="col-span-2 row-span-2"><slot name="table-5"></slot></div>
            <div class="col-span-1 row-span-2 "></div>
            <div class="col-span-2 row-span-2"><slot name="table-6"></slot></div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="border-8 rounded-lg border-gray-500 bg-gray-800 p-2">
            <div :class="screenStore.isSmallScreen ? 'terrace-layout-container-small-screen' : 'terrace-layout-container'">
                <div class="col-span-2 row-span-2"><slot name="table-15"></slot></div>
                <div class="col-span-1 row-span-2 "></div>
                <div class="col-span-2 row-span-2"><slot name="table-16"></slot></div>
                <div class="col-span-3 row-span-2"></div>
                <div class="col-span-2 row-span-2"><slot name="table-17"></slot></div>
                <div class="col-span-1 row-span-2 "></div>
                <div class="col-span-2 row-span-2"><slot name="table-18"></slot></div>
                <div class="col-span-1 row-span-1"></div>
                <div class="col-span-11 row-span-1 flex flex-row justify-center"><p class="font-bold text-xs md:text-xl text-gray-500">Terasa</p></div>
                <div class="col-span-1 row-span-1"></div>
                <div class="col-span-2 row-span-2"><slot name="table-19"></slot></div>
                <div class="col-span-1 row-span-2 "></div>
                <div class="col-span-2 row-span-2"><slot name="table-20"></slot></div>
                <div class="col-span-3 row-span-2"></div>
                <div class="col-span-2 row-span-2"><slot name="table-21"></slot></div>
                <div class="col-span-1 row-span-2 "></div>
                <div class="col-span-2 row-span-2"><slot name="table-22"></slot></div>
            </div>
          </div>
          <div :class="screenStore.isSmallScreen ? 'small-slot-width' : 'slot-width'">
          <slot name="info">
          </slot>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { useScreenStore } from '@/stores/ScreenStore'
import { computed } from 'vue'


const screenStore = useScreenStore()
const isMedimuScreen = computed(() => {
  return screenStore.screenWidth < 1024
})
</script>

<style scoped>
.slot-width{
  width: 552px;
}
.small-slot-width{
  width: 292px;
}
.restaurant-layout-container {
  display: grid;
  grid-template-columns: repeat(13, 40px);
  grid-template-rows: repeat(14, 40px);
}
.terrace-layout-container{
  display: grid;
  grid-template-columns: repeat(13, 40px);
  grid-template-rows: repeat(5, 40px);
}
.restaurant-layout-container-small-screen {
  display: grid;
  grid-template-columns: repeat(13, 20px);
  grid-template-rows: repeat(14, 20px);
}
.terrace-layout-container-small-screen {
  display: grid;
  grid-template-columns: repeat(13, 20px);
  grid-template-rows: repeat(5, 20px);
}
</style>