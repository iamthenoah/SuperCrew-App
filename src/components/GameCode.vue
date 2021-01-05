<template>
	<button class="btn large" id="game-code">{{ code }}</button>
</template>

<script lang="ts">

	import { defineComponent } from 'vue';

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
		border: rgba(white, 0.1) 3px solid;
		background: $dark;
		font-size: 20px;
		height: 50px;
		font-family: 'Oswald', sans-serif;
		font-weight: 600;
	}

</style>