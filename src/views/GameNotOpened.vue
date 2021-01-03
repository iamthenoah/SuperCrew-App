<template>
	<div class="content noselect">		
		<section class="space-bottom">
			<h1>{{ RandomGameTip.role.toUpperCase() }} TIP</h1>
			<hr>
			<p>{{ RandomGameTip.tip }}</p>
		</section>
		<button @click="openAmongUs" class="space-top btn-special center-h large">Open Game</button>
	</div>
</template>

<script lang="ts">

	import { defineComponent } from 'vue';
	import { IGameTip } from '@/common/interfaces/IGameTip';
	const { ipcRenderer } = window.require('electron');
	import GameTips from '@/assets/static/GameTips.json';

    export default defineComponent({
		emits: ['submit'],
		methods: {
			openAmongUs: function() {
				this.$emit('submit', true);
				ipcRenderer.send('open-game');
			},
		},
		computed: {
			RandomGameTip: (): IGameTip => GameTips[Math.floor(Math.random() * GameTips.length)] as IGameTip
		},
    });

</script>

<style lang="scss">

	@import './src/assets/styles/variables.scss';

</style>