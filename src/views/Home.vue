<template>
	<div>
		<button class="btn-danger large" @click="shutdownProxy">shutdown proxy</button>
		<section v-if="GameData">
			<pre>{{ GameData.code }}</pre>
			<p>Players:</p>
			<div v-bind:key="player.id" v-for="player in GameData.players">
				<PlayerAvatar v-bind:player="player" />
			</div>
			<PlayerAvatar v-bind:player="{ colorId: 6, hatId: 22, petId: 0, skinId: 0 }" />
		</section>
	</div>
</template>

<script lang="ts">

	import { defineComponent } from 'vue';
	const { ipcRenderer } = window.require('electron');
	import { AmongUsGameData } from '@/common/proxy/AmongUsGameData';
	import PlayerAvatar from '@/components/PlayerAvatar.vue';

    export default defineComponent({
		emits: ['submit'],
		components: {
			PlayerAvatar
		},
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
			shutdownProxy: function () {
				this.$emit('submit');
				ipcRenderer.send('shutdown-game-proxy');
			}
		},
	});

</script>

<style lang="scss">

	@import './src/assets/styles/variables.scss';

</style>