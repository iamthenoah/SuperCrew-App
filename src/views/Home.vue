<template>
	<section>
		<h1>HOME</h1>
		<pre>{{ GameData }}</pre>
	</section>
</template>

<script lang="ts">

	import { defineComponent } from 'vue';
	const { ipcRenderer } = window.require('electron');
	import { AmongUsGameData } from '@/common/proxy/AmongUsGameData';

    export default defineComponent({
		emits: ['submit'],
		data() {
			const GameData: AmongUsGameData | null = null;
			return {
				GameData
			}
		},
		mounted() {
			ipcRenderer.on('game-data', (_: Electron.IpcRendererEvent, data: AmongUsGameData | null) => this.GameData = data as null);
		},
		methods: {
			shutdownApp: function () {
				this.$emit('submit');
				ipcRenderer.send('shutdown-game-proxy');
			}
		},
	});

</script>

<style lang="scss">

	@import './src/assets/styles/variables.scss';

</style>