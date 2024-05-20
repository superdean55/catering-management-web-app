<template>
    <div class="grid grid-cols-3 gap-2 w-full">
        <div class="col-span-2 flex flex-col gap-2">
            <RouterView name="interface"></RouterView>
        </div>
        <div class="col-span-1 mr-2">
            <RouterView name="articleList"></RouterView>
        </div>
    </div> 
</template>

<script setup>

</script>
