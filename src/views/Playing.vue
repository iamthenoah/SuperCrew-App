<template>
	<section v-if="me">
		<div class="me">
			<PlayerAvatarRing
				:avatar="{
					colorId: me.appearance.colorId,
					skinId: me.appearance.skinId,
					hatId: me.appearance.hatId,
					isGhost: me.properties.isDead,
				}"
				:isImpostor="me.properties.isImpostor"
				:playerName="me.properties.playerName"
			/>
		</div>
		<hr>
	</section>
	<section v-if="GameData">
		<div v-bind:key="player.id" v-for="player in GameData.players">
			<div v-if="!player.properties.isLocal">
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
		</div>
	</section>
</template>

<script lang="ts">

	import { defineComponent } from 'vue';
	import { AmongUsGameData } from '@/common/proxy/AmongUsGameData';
	import PlayerAvatarRing from '@/components/PlayerAvatarRing.vue';
	import { IPlayer } from '@/common/proxy/interfaces/IPlayer';
	const { ipcRenderer } = window.require('electron');

	const me: IPlayer | null = null;
	const GameData: AmongUsGameData | null = null;

    export default defineComponent({
		emits: ['submit'],
		components: {
			PlayerAvatarRing,
		},
		data() {
			return {
				GameData,
				proxy: true,
				me
			}
		},
		mounted() {
			ipcRenderer.on('game-data', (_: Electron.IpcRendererEvent, data: AmongUsGameData | null) => {
				this.GameData = data as null;
				this.me = data?.players.find(p => p.properties.isLocal) as unknown as null;
			});
		},
	});

</script>

<style lang="scss">

	@import './src/assets/styles/variables.scss';

	.me {
		width: 100%;
		height: 70px;
	}
	
</style>