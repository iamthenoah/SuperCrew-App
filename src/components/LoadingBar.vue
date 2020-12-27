<template>
    <span id="loading-bar"></span>
</template>

<style lang="scss" scoped>
    
	@import './src/assets/styles/variables.scss';

    #loading-bar {
        position: relative;
        width: 100%;
        height: 100px;
        animation: load 500ms ease-in-out forwards;
        background: $theme;
    }

    @keyframes load {
        0% {
            left: 0;
            width: 0;
        }
        25% {
            width: 25%;
            left: 0%;
        }
        50% {
            width: 50%;
            left: 25%;
        }
        75% {
            width: 25%;
            left: 50%;
        }
        100% {
            width: 0%;
            left: 75%;
        }
    }
</style>