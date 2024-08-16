<template>
    <div 
    class="w-full flex flex-col gap-2 font-merienda overflow-y-hidden"
    :style="{height: componentHeight + 'px'}"
    >
        <div class="w-full flex flex-row justify-center items-start">
            <p class="text-xs md:text-lg font-bold">Vaši Računi</p>
        </div>
        <div v-if="userStore.bills.length" class="w-full flex flex-col gap-2 overflow-y-scroll scrollbar-hide">
            <div v-for="bill in userStore.bills" :key="bill.id" class="w-full ">
                <BillCard class="cursor-pointer" :bill="bill" @click="onCardClicked(bill)"></BillCard>
            </div>
        </div>
        <div v-else class="w-full flex flex-row justify-center">
            <p class="text-xs md:text-lg text-red-500">Nemate niti jednu račun</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useScreenStore } from '@/stores/ScreenStore';
import BillCard from './BillCard.vue'
import { useUserStore } from '@/stores/UserStore'
import type { Bill } from '@/types/Bill'
import { computed, ref, watch } from 'vue'


const props = defineProps<{
    height: number
}>()
const emit = defineEmits<{
    (e:'card', bill: Bill): void
}>()
const screenStore = useScreenStore()
const userStore = useUserStore()
const height = ref<number>(props.height)
watch(() => props.height, (newHeight) => {
    height.value = newHeight
})

const componentHeight = computed(() => {
    if(screenStore.isSmallScreen){
        return height.value - 88
    }else{
        return height.value - 32
    }
})

const onCardClicked = (bill: Bill) => {
    emit('card', bill)
}
</script>
