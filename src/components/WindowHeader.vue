<template>
    <header>
        <div class="app-name">SuperCrew</div>
        <div class="titlebar-controls">
            <div @click="minimize" class="titlebar-minimize">
                <svg x="0px" y="0px" viewBox="0 0 10 1"><rect fill="#000000" width="10" height="1"></rect></svg>
            </div>
            <div @click="close" class="titlebar-close">
                <svg x="0px" y="0px" viewBox="0 0 10 10"><polygon fill="#000000" points="10,1 9,0 5,4 1,0 0,1 4,5 0,9 1,10 5,6 9,10 10,9 6,5"></polygon></svg>
            </div>
        </div>
    </header>
</template>

<script lang="ts">

    import { defineComponent } from 'vue';
    const { ipcRenderer } = window.require('electron');

    export default defineComponent({
        methods: {
            minimize: function() {
                ipcRenderer.invoke('minimize-window');
            },
            close: function() {
                ipcRenderer.invoke('close-window');
            }
        }
    });

</script>

<style lang="scss" scoped>
    
	@import './src/assets/styles/variables.scss';

    header {
        position: fixed;
        z-index: 1000;
    }
    
    .app-name {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        margin-left: 7.5px;
        width: auto;
        color: $lighter;
        font-size: 13px;
        text-transform: uppercase;
        font-family: 'Roboto';
    }

    .titlebar-controls {
        position: absolute;
        z-index: 10000;
        height: 100%;
        top: 0;
        right: 0;
        z-index: 1000;
        cursor: pointer;
        -webkit-app-region: no-drag;
    }

    .titlebar-minimize,
    .titlebar-close {
        width: 25px;
        height: 25px;
        float: left;
        text-align: center;
        line-height: 27px;
        transition: background-color .1s;
    }

    .titlebar-minimize svg,
    .titlebar-close svg {
        width: 10px;
        height: 10px;
    }

    .titlebar-close svg polygon {
        transition: fill .1s;
    }

    .titlebar-close:hover > svg polygon {
        fill: white;
    }

    .titlebar-close:hover {
        background: $red;
    }

    .titlebar-minimize:hover {
        background: rgba(white, 0.1);
    }

    svg polygon,
    svg rect {
        fill: $lighter;
    }

</style>