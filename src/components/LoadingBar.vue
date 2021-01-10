<template>
    <div id="loading-bar"></div>
</template>

<style lang="scss" scoped>
    
	@import './src/assets/styles/variables.scss';

	#loading-bar {
		position: absolute;
		z-index: 1000;
        height: 4px;
		animation: load 1000ms ease-out infinite;
        background: $theme;
    }

    @keyframes load {
		0% {
			width: 0;
			left: 0;
		}
		40% {
			width: 75%;
			left: 0;
		}
		80% {
			width: 0;
			left: 100%;
		}
		100% {
			width: 0;
			left: 100%;
		}
    }
    
</style>