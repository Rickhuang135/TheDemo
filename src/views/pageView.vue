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
    <div class="flex flex-col h-dvh lg:flex-row">
        <sideBar v-if="showSideBar" v-model:barStatus="showSideBar" 
        @resizeToWidth="container.resizeToWidth()"
         @zoomIn="container.zoomInOut(0.1)" 
         @zoomOut="container.zoomInOut(-0.1)"/>
        <div v-else class="
        absolute top-0 w-full text-center
        lg:left-0 lg:w-auto lg:mt-[20vh]" 
        @click="showSideBar = true; container.resizeToWidth()"  >
            <div class="hidden lg:block">
                <i class="pi pi-angle-double-right text-white text-3xl"></i>
            </div>
            <div class="block lg:hidden">
                <i class="pi pi-angle-double-down text-white text-3xl"></i>
            </div>
        </div>
        <pageContainer ref="container" />
    </div>
</template>