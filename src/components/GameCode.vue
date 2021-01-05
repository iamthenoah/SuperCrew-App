<template>
</template>

<script lang="ts">

	import { defineComponent } from 'vue';

	export interface GameTip {
	    role: string;
    	tip: string;
	}

    export default defineComponent({
        props: {
            gameCode: null
        },
        computed: {
            code: function(): string { return this.$props.gameCode === null ? '---' : this.$props.gameCode }
        }
    });

</script>

<style lang="scss" scoped>

	@import './src/assets/styles/variables.scss';
	@import './src/assets/styles/font.scss';

	#game-code {
		border-radius: $green;
		background: rgba($green, 0.5);
		font-size: 22px;
		width: 100%;
		height: 40px;
		text-align: center;
		line-height: 41px;
        font-family: 'Bebas Neue', cursive;
	}

</style>