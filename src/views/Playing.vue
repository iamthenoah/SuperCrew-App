<template>
	<section v-if="GameData">
		<div v-bind:key="player.id" v-for="player in GameData.players">
			<PlayerAvatarRing
				:avatar="{
					colorId: player.appearance.colorId,
					skinId: player.appearance.skinId,
					hatId: player.appearance.hatId,
					isGhost: player.properties.isDead,
				}"
				:isImpostor="player.properties.isImpostor"
				:playerName="player.properties.playerName"
			/>
		</div>
	</section>
</template>

<script lang="ts">

	import { defineComponent } from 'vue';
	import { AmongUsGameData } from '@/common/proxy/AmongUsGameData';
	import PlayerAvatarRing from '@/components/PlayerAvatarRing.vue';
	const { ipcRenderer } = window.require('electron');

    export default defineComponent({
		emits: ['submit'],
		components: {
			PlayerAvatarRing,
		},
		data() {
			const GameData: AmongUsGameData | null = null;
			return {
				GameData,
				proxy: true,
			}
		},
		mounted() {
			ipcRenderer.on('game-data', (_: Electron.IpcRendererEvent, data: AmongUsGameData | null) => this.GameData = data as null);
		},
	});

</script>

<style lang="scss">

	@import './src/assets/styles/variables.scss';

</style>