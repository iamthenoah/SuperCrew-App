<template>
	<section class="content noselect">
		<h1>{{ RandomGameTip.role }}</h1>
		<hr>
		<p>{{ RandomGameTip.tip }}</p>
	</section>
	<section>
		<button @click="openAmongUs" class="btn center-h">Open Among Us</button>
	</section>
</template>

<script lang="ts">

	import { defineComponent } from 'vue';
	import { GameTips } from '@/assets/gameTips';
	import { IGameTip } from '@/common/interfaces/IGameTip';
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
			RandomGameTip: function(): IGameTip {
				const gameTip: IGameTip = GameTips[Math.floor(Math.random() * GameTips.length)];
				return gameTip;
			}
		},
    });

</script>

<style lang="scss">

	@import './src/assets/styles/variables.scss';

</style>