<template>
	<section>
		<h1>HOME</h1>
		<p>{{ gameCode }}</p>
	</section>
</template>

<script lang="ts">

	import { defineComponent } from 'vue';
	const { ipcRenderer } = window.require('electron');

    export default defineComponent({
		data() {
			return {
				gameCode: 'No Game Code Found.'
			}
		},
		mounted() {
			ipcRenderer.on('game-code', (_: Electron.IpcRendererEvent, code: string) => this.gameCode = code);
		},
	});

</script>

<style lang="scss">

	@import './src/assets/styles/variables.scss';

</style>