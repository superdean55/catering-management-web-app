<template>
    <div class="w-full">
        <RawMaterialInterface 
            confirm-button-label="dodaj"
            @confirm="onConfirm"
            title="Dodaj sirovinu"
        >
            <template v-slot:confirm-button-icon><span class="material-symbols-outlined">add</span></template>
        </RawMaterialInterface>

    </div>
</template>

<script setup lang="ts">
import type { RawMaterial } from '@/types/RawMaterial';
import RawMaterialInterface from './RawMaterialInterface.vue'
import { useArticleStore } from '@/stores/ArticleStor';

const articleStore = useArticleStore()
const onConfirm = (name: string, unit: string, code: string, oldRawMaterial: RawMaterial | undefined) => {
    console.log(`recieved\nname: ${name}\nunit: ${unit}\ncode: ${code}`)
    articleStore.manageRawMaterial(name, unit, code, oldRawMaterial)
}
</script>
