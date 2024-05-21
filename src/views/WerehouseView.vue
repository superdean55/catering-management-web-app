<template>
    <main class="w-full min-h-screen bg-slate-300 p-0">
    <div class="h-10"></div>
        <div class="grid grid-cols-6 gap-2">
            <div class="h-full">
                <nav>
                    <ul>
                        <li><div class="h-1 w-full bg-black"></div></li>
                        <li class="bg-orange-700 hover:bg-orange-800 text-white">
                            <RouterLink :to="{ name: 'AddArticle' }" class="flex items-center justify-center h-10 w-full">Dodaj Artikl</RouterLink>
                        </li>
                        <li class="h-px w-full bg-slate-600"></li>
                        <li class="bg-orange-700 hover:bg-orange-800 text-white">
                            <RouterLink :to="{ name: 'AddCategory' }" class="flex items-center justify-center h-10 w-full">Dodaj Kategoriju</RouterLink>
                        </li>
                        <li class="h-px w-full bg-slate-600"></li>
                        <li class="bg-orange-700 hover:bg-orange-800 text-white">
                            <RouterLink :to="{ name: 'AddRawMaterial' }" class="flex items-center justify-center h-10 w-full">Sirovine</RouterLink>
                        </li>
                    </ul>
                </nav>
            </div>
            <RouterView name="werehouse" class="col-span-5 mt-2"></RouterView>
        </div>
  </main>
</template>

<script setup lang="ts">
import { useArticleStore } from '@/stores/ArticleStor';

const articleStore = useArticleStore()
articleStore.getCategorys()
</script>
