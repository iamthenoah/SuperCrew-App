<template>
	<div>
		<section class="space-bottom">
			<h1><strong>PRO-TIP</strong></h1>
			<hr>
			<p><b>{{ RandomGameTip.role }}</b></p>
			<p>{{ RandomGameTip.tip }}</p>
		</section>
		<button @click="openAmongUs" class="space-top btn-special center-h large">Open Game</button>
	</div>
</template>

<script lang="ts">

	import { defineComponent } from 'vue';
	import { IGameTip } from '@/common/interfaces/IGameTip';
	import GameTips from '@/assets/GameTips.json';
	const { ipcRenderer } = window.require('electron');

    export default defineComponent({
		emits: ['submit'],
		methods: {
			openAmongUs: function() {
				this.$emit('submit', true);
				ipcRenderer.send('open-game');
			},
		},
		computed: {
			RandomGameTip: (): IGameTip => {
				const { role, tip } = GameTips[Math.floor(Math.random() * GameTips.length)] as IGameTip
				return { role: role.charAt(0).toUpperCase() + role.slice(1), tip } as IGameTip;
			}
		},
    });

</script>

<style lang="scss" scoped>

	@import './src/assets/styles/variables.scss';

</style>