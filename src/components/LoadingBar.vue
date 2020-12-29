<template>
    <div id="loading-bar"></div>
</template>

<style lang="scss" scoped>
    
	@import './src/assets/styles/variables.scss';

	#loading-bar {
		position: absolute;
		z-index: 1000;
        width: 100%;
        height: 4px;
		animation: load 1000ms ease-in-out alternate-reverse infinite;
        background: $theme;
    }

    @keyframes load {
		0% {
			left: -100%;
		}
		100% {
			left: 100%;
		}
    }
    
</style>