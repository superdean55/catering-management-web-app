<template>
    <div class="w-full flex flex-col gap-1">
        <div class="w-full flex flex-row justify-between">
            <p class="text-xs">0%</p>
            <p class="text-xs">50%</p>
            <p class="text-xs">100%</p>
        </div>
        <div class="w-full h-4 rounded-full bg-gray-100 relative overflow-hidden">
        <div
          class="absolute h-full rounded-full transition-all duration-300 ease-in-out"
          :class="progressClass"
        ></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Order } from '@/types/Order'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  order: Order
}>()

const orderRef = ref<Order>(props.order)
watch(() => props.order, (newOrder) => {
    orderRef.value = newOrder
})

const progressClass = computed(() => {
  if (!orderRef.value.isApproved && !orderRef.value.isCompleted) {
    return 'bg-red-500 w-4'
  } else if (orderRef.value.isApproved && !orderRef.value.isCompleted) {
    return 'bg-yellow-500 w-1/2'
  } else if (orderRef.value.isCompleted) {
    return 'bg-green-500 w-full'
  }
  return ''
})



</script>
