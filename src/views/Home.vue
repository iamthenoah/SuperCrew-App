<template>
	<div>
		<button v-if="proxy" class="btn-danger large" @click="shutdownProxy">shutdown proxy</button>
		<section v-if="GameData">
			<GameCode :gameCode="GameData.lobbyCode" />
			<p>Players:</p>
			<div v-bind:key="player.id" v-for="player in GameData.players">
				<PlayerAvatar :player="player" />
			</div>
		</section>
	</div>
</template>

<script lang="ts">

	import { defineComponent } from 'vue';
	const { ipcRenderer } = window.require('electron');
	import { AmongUsGameData } from '@/common/proxy/AmongUsGameData';
	import GameCode from '@/components/GameCode.vue';
	import PlayerAvatar from '@/components/PlayerAvatar.vue';

    export default defineComponent({
		emits: ['submit'],
		components: {
			PlayerAvatar,
			GameCode
		},
		data() {
			const GameData: AmongUsGameData | null = null;
			return {
				GameData,
				proxy: true
			}
		},
		mounted() {
			ipcRenderer.on('game-data', (_: Electron.IpcRendererEvent, data: AmongUsGameData | null) => this.GameData = data as null);
		},
		methods: {
			shutdownProxy: function () {
				this.$emit('submit');
				ipcRenderer.send('shutdown-game-proxy');
				this.proxy = false;
			}
		},
	});

</script>

<style lang="scss">

	@import './src/assets/styles/variables.scss';


</style>