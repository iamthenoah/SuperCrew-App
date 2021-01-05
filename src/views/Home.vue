<template>
	<div>
		<button v-if="proxy" class="btn-danger large" @click="shutdownProxy">shutdown proxy</button>
		<section v-if="GameData">
			<GameCode :gameCode="GameData.lobbyCode" />
			<p>Players:</p>
			<div v-bind:key="player.id" v-for="player in GameData.players">
				<PlayerAvatarProfile class="resize-avatar" :avatar="{
					colorId: player.appearance.colorId,
					skinId: player.appearance.skinId,
					hatId: player.appearance.hatId,
					ghost: player.properties.isDead,
					impostor: player.properties.isImpostor,
					name: player.name
				}" />
			</div>
		</section>
	</div>
</template>

<script lang="ts">

	import { defineComponent } from 'vue';
	const { ipcRenderer } = window.require('electron');
	import { AmongUsGameData } from '@/common/proxy/AmongUsGameData';
	import GameCode from '@/components/GameCode.vue';
	import PlayerAvatarProfile from '@/components/PlayerAvatarProfile.vue';

    export default defineComponent({
		emits: ['submit'],
		components: {
			PlayerAvatarProfile,
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

	.resize-avatar {
		position: relative;
		height: 100px;
	}
</style>