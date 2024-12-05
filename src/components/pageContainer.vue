<script setup>
import {reactive, ref, defineExpose} from 'vue';
import pageComponent from './page.vue';
import { onMounted, onUnmounted } from 'vue';

//global variables:
const page = reactive({   
    dimension: {
        scale: 1,
        w: 210,
        h: 297,
    },
    translation: {
        x:0,
        y:yMargin,
    },
    selected: false,
});

const pageWrapper = ref('null');
const loggingForPhone = ref("");
const yMargin = 14;
const sensitivity = {
    scroll: -0.1,
    zoom: -0.003,
};
const touchUncertainty = 10; //in pixels;
const touchTracker = [];

//debugging tool for phone
const printToPhone = (message, spacing = 5) =>{
    if(loggingForPhone.value.length<800){
        loggingForPhone.value +=  message;
        for(let i = 0; i <= spacing; i++){
            loggingForPhone.value += " \xa0";
        };
    }else{
        loggingForPhone.value = loggingForPhone.value.substring(10);
    }
}

//event handlers
const moveWithKey = (event) => {
    switch(event.key){
            case 'w':translateY(10);break;
            case 'a':translateX(-10);break;
            case 's':translateY(-10);break;
            case 'd':translateX(10);break;
            case 'ArrowUp':translateY(10);break;
            case 'ArrowLeft':translateX(-10);break;
            case 'ArrowDown':translateY(-10);break;
            case 'ArrowRight':translateX(10);break;
            case 'c': resizeToWidth();break;
    };
};

const moveWithScroll = (event) =>{
    if(event.ctrlKey){ //These things are called modifier
        event.preventDefault();
        zoomInOut(sensitivity.zoom * event.deltaY, event.pageX - pageWrapper.value.offsetLeft, event.pageY - pageWrapper.value.offsetTop);
    }else if(event.shiftKey){
        translateX(sensitivity.scroll * event.deltaY)
    }else{
        translateY(sensitivity.scroll * event.deltaY);
        translateX(sensitivity.scroll * event.deltaX);
    }
};

const moveWithDrag = (event) =>{
    translateX(event.movementX / page.dimension.scale);
    translateY(event.movementY / page.dimension.scale)
}

const mousedownHandler = (event) => {
    switch (event.button) {
        case 0: 
            page.selected = true;
            window.addEventListener('mousemove', moveWithDrag);
        break;
        case 1: console.log("middle click"); break;
        case 2: console.log("right click"); break;
        default: console.log(event.button);
    }
}

const mouseupHandler = (event) =>{
    switch (event.button) {
        case 0: 
            page.selected = false;
            window.removeEventListener('mousemove', moveWithDrag);
        break;
        case 1: console.log("middle up"); break;
        case 2: console.log("right up"); break;
        default: console.log(event.button);
    }
}

const touchstartHandler = (event) =>{
    for(let i = 0; i < event.touches.length; i++){
        touchTracker[event.touches[i].identifier]={
            x: event.touches[i].pageX,
            y: event.touches[i].pageY,
            id: event.touches[i].identifier,
        };
    };
};

const touchmoveHandler = (event) =>{
    event.preventDefault();
    //touches, changedTouches, targetTouches
    const deltaX = [0,0,0,0,0];
    const deltaY = [0,0,0,0,0];
    for (let i = 0; i < event.changedTouches.length; i++) {
        const id = event.changedTouches[i].identifier;
        const tracked = touchTracker[id];
        deltaX[id] = event.changedTouches[i].pageX - tracked.x;
        deltaY[id] = event.changedTouches[i].pageY - tracked.y;    
        tracked.x = event.changedTouches[i].pageX;
        tracked.y = event.changedTouches[i].pageY;
    };
    switch (event.touches.length) {
        case 1: 
            translateX(deltaX[0] / page.dimension.scale); 
            translateY(deltaY[0] / page.dimension.scale);
            break;
        case 2:
            // let the line connecting both points of contact be the diameter line
            // zoom : direction vectors are parrallel with diameter line
            // rotation around z: direction vectors are perpendicular to diameter line
            // all units are in pageX and pageY
            const v0 = { // This discribes the diameter line with direction pointing from point 0 to point 1
                x: touchTracker[1].x-touchTracker[0].x,
                y: touchTracker[1].y-touchTracker[0].y,
            };
            const ABSv0 = Math.sqrt(v0.x * v0.x + v0.y * v0.y);
            const absoluteZoomSize0 = (v0.x * deltaX[0] + v0.y * deltaY[0]) / ABSv0; // Dot product calculation

            const v1 = { // This discribes the diameter line with direction pointing from point 1 to point 0
                x: touchTracker[0].x-touchTracker[1].x,
                y: touchTracker[0].y-touchTracker[1].y,
            };
            const ABSv1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
            const absoluteZoomSize1 = (v1.x * deltaX[1] + v1.y * deltaY[1]) / ABSv1;             

            zoomInOut((absoluteZoomSize0 + absoluteZoomSize1)*sensitivity.zoom, (touchTracker[0].x+touchTracker[1].x)/2, (touchTracker[0].y+touchTracker[1].y)/2);
    }
};

const touchendHandler = (event) => {
    // console.log(touchTracker);
    for (let i = 0; i < event.changedTouches.length; i++) {
        touchTracker.splice(event.changedTouches[i].identifier,1);
    }
}

//Life cycle actions
onMounted(()=>{
    resizeToWidth();
    window.addEventListener('keydown', moveWithKey);
    window.addEventListener('wheel', moveWithScroll, {passive: false});
});

onUnmounted(()=>{
    window.removeEventListener("keydown", moveWithKey);
    window.removeEventListener("wheel", moveWithScroll);
});


//functions for page transformations
const resizeToWidth = () => {
    let ratio = 0;
    if(window.innerWidth<1024){
        ratio = 9/10;
    }else{
        ratio = 4/5;
    }
    page.dimension.scale = (pageWrapper.value.clientWidth * ratio) / page.dimension.w;
    centerToPage();
}

const dynamicPosition = () => {
    const styleWidth = page.dimension.w * page.dimension.scale;
    const styleHeight = page.dimension.h * page.dimension.scale;
    const styleLeft = page.translation.x * page.dimension.scale;
    const styleTop = page.translation.y * page.dimension.scale;
    return {
        width: styleWidth + "px",
        height: styleHeight + "px",
        left: styleLeft + "px",
        top: styleTop + "px",
    }
};

const centerToPage = () => {
    page.translation.x = (pageWrapper.value.clientWidth - page.dimension.w * page.dimension.scale) / (2*page.dimension.scale);
    if(page.dimension.h * page.dimension.scale < pageWrapper.value.clientHeight){
        page.translation.y = (pageWrapper.value.clientHeight - page.dimension.h * page.dimension.scale) / (2*page.dimension.scale);
    }else{
        if(page.translation.y > yMargin){
            page.translation.y = yMargin;
        }
        else if(page.translation.y < ( pageWrapper.value.clientHeight/page.dimension.scale - page.dimension.h -yMargin)){
            page.translation.y =  pageWrapper.value.clientHeight/page.dimension.scale - page.dimension.h -yMargin;
        };
    };
}

const translateX = (size) =>{
    page.translation.x += size;
}

const translateY = (size) =>{
    page.translation.y += size;
}

const zoomInOut = ( deltaScale = 0.1, Px = pageWrapper.value.clientWidth/2, Py = pageWrapper.value.clientHeight/2) =>{
    const So = page.dimension.scale;
    const Sn = So + deltaScale;
    const L1x = page.translation.x;
    const L1y = page.translation.y;
    const L2x = (So/Sn - 1) * (Px/So - L1x) + (So/Sn) * L1x;
    const L2y = (So/Sn - 1) * (Py/So - L1y) + (So/Sn) * L1y;
    page.translation.x = L2x;
    page.translation.y = L2y;
    page.dimension.scale = Sn;
}

defineExpose({resizeToWidth, zoomInOut});


</script>

<template>
    <div ref="pageWrapper" class="bg-blue-500 w-full h-full overflow-hidden">
        <div 
        :class="['bg-blue-200', 'overflow-hidden', 'relative',' border-2', 'border-black', 
        page.selected ? 'border-dashed' : 'border-transparent']"  
        :style="dynamicPosition()"  @mousedown="mousedownHandler" 
        @mouseup="mouseupHandler" @touchmove="touchmoveHandler" 
        @touchstart="touchstartHandler" @touchend="touchendHandler">
            <pageComponent  :scale="page.dimension.scale"  :logger="loggingForPhone"/>
        </div>
    </div>
</template>