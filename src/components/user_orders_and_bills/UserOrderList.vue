<template>
    <div 
    class="w-full flex flex-col  gap-2 font-merienda overflow-y-hidden"
    :style="{height: componentHeight + 'px'}"
    >
        <div class="w-full flex flex-row justify-center">
            <p class="text-xs md:text-lg font-bold">Vaše Narudžbe</p>
        </div>
        <div v-if="userStore.orders.length" class="w-full flex flex-col gap-2 overflow-y-scroll scrollbar-hide">
            <div v-for="order in userStore.orders" :key="order.id" class="w-full ">
                <OrderCard :order="order" @click="onCardClicked(order)"></OrderCard>
            </div>
        </div>
        <div v-else class="w-full flex flex-row justify-center">
            <p class="text-xs md:text-lg text-red-500">Nemate niti jednu narudžbu</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Order } from '@/types/Order'
import OrderCard from './OrderCard.vue'
import { useUserStore } from '@/stores/UserStore'
import { computed, ref, watch } from 'vue'


const props = defineProps<{
    height: number
}>()
const emit = defineEmits<{
    (e:'card', order: Order): void
}>()
const userStore = useUserStore()
const height = ref<number>(props.height)
watch(() => props.height, (newHeight) => {
    height.value = newHeight
})

const componentHeight = computed(() => {
    return height.value - 32
})

const onCardClicked = (order: Order) => {
    emit('card', order)
}
</script>
