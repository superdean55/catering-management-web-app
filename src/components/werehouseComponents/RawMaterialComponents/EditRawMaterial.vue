<template>
    <div class="w-full">
        <RawMaterialInterface 
            confirm-button-label="ažuriraj"
            delete-button-label="obriši"
            @confirm="onConfirm"
            @delete="onDelete"
            title="Izmjeni sirovinu"
            :old-raw-material="rawMaterial"
        >
            <template v-slot:confirm-button-icon><span class="material-symbols-outlined">update</span></template>
        </RawMaterialInterface>

    </div>
</template>

<script setup lang="ts">
import type { RawMaterial } from '@/types/RawMaterial';
import RawMaterialInterface from './RawMaterialInterface.vue'
import { useArticleStore } from '@/stores/ArticleStor';
import { useRoute } from 'vue-router';
import { watch, ref } from 'vue';
import router from '@/router';

const articleStore = useArticleStore()
const route = useRoute();

const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
const rawMaterial = ref(articleStore.getRawMaterialById(id))

watch(() => route.params.id, (newId, oldId) => {
  const id = Array.isArray(newId) ? newId[0] : newId;
  rawMaterial.value = articleStore.getRawMaterialById(id);
});

const onConfirm = (name: string, unit: string, quantity: string, oldRawMaterial: RawMaterial | undefined) => {
    console.log(`recieved\nname: ${name}\nunit: ${unit}\nquantity: ${quantity}`)
    articleStore.manageRawMaterial(name, unit, quantity, oldRawMaterial)
    router.push({ name: 'AddRawMaterial'})
}
const onDelete = (oldRawMaterial: RawMaterial | undefined) => {
    console.log('delete raw material')
    if(oldRawMaterial){
        articleStore.deleteRawMaterial(oldRawMaterial.id)
    }
}
</script>
