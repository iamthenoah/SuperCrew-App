<template>
	<section v-if="GameData">
		<button v-if="proxy" class="btn large" @click="this.stop = !this.stop">Toggle Cycle</button>
		<div v-bind:key="player.id" v-for="player in GameData.players">
			<PlayerAvatarProfile :style="{ height: randomValue() + 'px', width: randomValue() + 'px' }" class="rat" :avatar="{
				colorId: player.appearance.colorId,
				skinId: player.appearance.skinId,
				hatId: player.appearance.hatId,
				ghost: player.properties.isDead,
				impostor: player.properties.isImpostor,
				name: player.name
			}" />
		</div>
	</section>
</template>

<script lang="ts">

	import { defineComponent } from 'vue';
	import { AmongUsGameData } from '@/common/proxy/AmongUsGameData';
	import PlayerAvatarProfile from '@/components/PlayerAvatarProfile.vue';
	const { ipcRenderer } = window.require('electron');

    export default defineComponent({
		emits: ['submit'],
		components: {
			PlayerAvatarProfile,
		},
		data() {
			const GameData: AmongUsGameData | null = null;
			return {
				GameData,
				proxy: true,
				value: 0,
				stop: false
			}
		},
		mounted() {
			ipcRenderer.on('game-data', (_: Electron.IpcRendererEvent, data: AmongUsGameData | null) => this.GameData = data as null);
		},
		methods: {
			randomValue: function() {
				if (this.stop) return this.value
				else return this.value = 60 + Math.floor(120 * Math.random())
			},
		},
	});

</script>

<style lang="scss">

	@import './src/assets/styles/variables.scss';

	// .rat {
	// 	position: relative;
	// 	outline: yellow solid;
	// 	width: fit-content;
	// }

</style>