<template>
    <div class="w-full">
        <RawMaterialInterface 
            confirm-button-label="dodaj"
            @confirm="onConfirm"
        >
            <template v-slot:confirm-button-icon><span class="material-symbols-outlined">add</span></template>
        </RawMaterialInterface>

    </div>
</template>

<script setup lang="ts">
import RawMaterialInterface from './RawMaterialInterface.vue';
const onConfirm = (name: string, unit: string, quantity: string) => {
    console.log(`recieved\nname: ${name}\nunit: ${unit}\nquantity: ${quantity}`)
}
</script>
