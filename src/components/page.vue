<script setup>
import { defineProps, ref } from 'vue';

const props = defineProps({
    scale: {
        type: Number,
        default: 1,
    },
    logger: {
        type: String,
        default: "testing",
    }
});

const dynamicTextSize = (relativeSize) =>{
    console.log("dynamic text size invoked")
    return {
        fontSize : props.scale*relativeSize+ "px", 
    };
};




</script>

<template>
    <!-- <div :style=""></div> -->
    <p class="text-wrap h-full" :style="dynamicTextSize(10)" >{{ logger }}</p>

</template>