<script setup>
import { ref } from 'vue';
import { defineModel } from 'vue';

const barStatus = defineModel('barStatus');

const emit = defineEmits(['resizeToWidth', 'zoomIn', 'zoomOut']);

const resizeToWidth = ()=>{
    emit("resizeToWidth");
};

</script>

<template>
    <div class="flex justify-around
    flex-row w-full h-[10vh]
    lg:flex-col lg:w-[20vw] lg:h-full ">
        <button @click = "barStatus = !barStatus" class="bg-yellow-400">
            Hide sidebar
        </button>
        <button @click = "emit('resizeToWidth')" class="bg-orange-400">
            Resize to width
        </button>
        <button @click = "emit('zoomIn')" class="bg-yellow-400">
            Zoom In
        </button>
        <button @click = "emit('zoomOut')" class="bg-orange-400">
            Zoom Out
        </button>
    </div>

</template>