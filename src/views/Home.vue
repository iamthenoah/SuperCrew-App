<template>
	<div>
		<section class="space-bottom">
			<h1><strong>PROTIP</strong></h1>
			<hr>
			<p><b>{{ RandomGameTip.role }}</b></p>
			<p>{{ RandomGameTip.tip }}</p>
		</section>
		<section>
			<button @click="openAmongUs" class="btn center-h large">Open Game</button>
		</section>
	</div>
</template>

<script lang="ts">

	import { defineComponent } from 'vue';
	import GameTips from '@/assets/GameTips.json';
	const { ipcRenderer } = window.require('electron');

	export interface GameTip {
	    role: string;
    	tip: string;
	}

    export default defineComponent({
		emits: ['submit'],
		methods: {
			openAmongUs: function() {
				this.$emit('submit', true);
				ipcRenderer.send('open-game');
			},
		},
		computed: {
			RandomGameTip: (): GameTip => {
				const { role, tip } = GameTips[Math.floor(Math.random() * GameTips.length)] as GameTip
				return { role: role.charAt(0).toUpperCase() + role.slice(1), tip } as GameTip;
			}
		},
    });

</script>

<style lang="scss" scoped>

	@import './src/assets/styles/variables.scss';

</style>