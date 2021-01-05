<template>
	<div>
		<section v-if="false" class="space-bottom">
			<h1><strong>PRO-TIP</strong></h1>
			<hr>
			<p><b>{{ RandomGameTip.role }}</b></p>
			<p>{{ RandomGameTip.tip }}</p>
		</section>
		<section>
			<p id="game-code"><strong>LNFWIF</strong></p>
		</section>
		<button @click="openAmongUs" class="space-top btn-special center-h large">Open Game</button>
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

	#game-code {
		border-radius: $green;
		background: rgba($green, 0.5);
		font-size: 22px;
		width: 100%;
		height: 40px;
		text-align: center;
		line-height: 41px;
		font-family: 'Uni Sans';
	}

</style>