<template>
    <div class="w-full flex flex-row justify-center gap-2">
        <div class="">
          <div class="border-8 rounded-lg border-gray-500 bg-gray-800 inline-block p-2">
            <div class="restaurant-layout-container">
              <div class="col-span-2 row-span-2"></div>
              <div class="col-span-4 row-span-2 bg-gray-200 flex flex-row justify-center items-center border border-gray-400">
                <p class="font-bold text-gray-500 text-xl">Toalet Ženski</p>
              </div>
              <div class="col-span-2 row-span-2"></div>
              <div class="col-span-2 row-span-2"><slot name="table-13"></slot></div>
              <div class="col-span-1 row-span-2"></div>
              <div class="col-span-2 row-span-2"><slot name="table-14"></slot></div>
              <div class="col-span-2 row-span-2"></div>
              <div class="col-span-4 row-span-2 bg-gray-200 flex flex-row justify-center items-center border border-gray-400">
                <p class="font-bold text-gray-500 text-xl">Toalet Muški</p>
              </div>
              <div class="col-span-7 row-span-1"></div>
              <div class="col-span-2 row-span-2"></div>
              <div class="col-span-2 row-span-2"><slot name="table-11"></slot></div>
              <div class="col-span-1 row-span-2 "></div>
              <div class="col-span-2 row-span-2"><slot name="table-12"></slot></div>
              <div class="col-span-5 row-span-2  border-t border-gray-500 flex felx-row justify-center items-center">
                <p class="font-bold text-white text-xl">Šank</p>
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
        </div>
        <div class="flex flex-col gap-2">
          <div class="border-8 rounded-lg border-gray-500 bg-gray-800 inline-block p-2">
            <div class="terrace-layout-container">
                <div class="col-span-2 row-span-2"><slot name="table-15"></slot></div>
                <div class="col-span-1 row-span-2 "></div>
                <div class="col-span-2 row-span-2"><slot name="table-16"></slot></div>
                <div class="col-span-3 row-span-2"></div>
                <div class="col-span-2 row-span-2"><slot name="table-17"></slot></div>
                <div class="col-span-1 row-span-2 "></div>
                <div class="col-span-2 row-span-2"><slot name="table-18"></slot></div>
                <div class="col-span-1 row-span-1"></div>
                <div class="col-span-11 row-span-1 flex flex-row justify-center"><p class="font-bold text-xl text-gray-600">Terasa</p></div>
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
          <div class="slot-width">
            <slot name="info">

            </slot>
          </div>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.slot-width{
  width: 552px;
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
.toalet-woman{
  grid-column: 3 / 7;
  grid-row: 1/3;
}
.toalet-man{
  grid-column: 3 / 7;
  grid-row: 3/5;
}
.item-1{
  grid-column: 1 / 3;
  grid-row: 1/3;
}
</style>