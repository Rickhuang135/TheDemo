<script setup>
    import sideBar from "@/components/sideBar.vue";
    import pageContainer from "@/components/pageContainer.vue";
    import { nextTick, ref, watch } from 'vue';

    const container = ref();

    const showSideBar = ref(true);

    watch(showSideBar, async (newVal,preVal)=>{
        await nextTick();
        container.value.resizeToWidth();
    })

</script>

<template>
    <div class="flex flex-col lg:flex-row">
        <sideBar v-if="showSideBar" v-model:barStatus="showSideBar" 
        @resizeToWidth="container.resizeToWidth()"
         @zoomIn="container.zoomInOut(0.1)" 
         @zoomOut="container.zoomInOut(-0.1)"/>
        <div v-else class="absolute left-0 mt-[20vh] bg-gray-500 z-10" 
        @click="showSideBar = true; container.resizeToWidth()"  >
            <i class="pi pi-angle-double-right text-white text-3xl"></i>
        </div>
        <pageContainer ref="container" />
    </div>
</template>