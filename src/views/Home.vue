<template>
	<section class="space-bottom">
		<h1>PROTIP</h1>
		<hr>
		<p><b>{{ RandomGameTip.role }}</b></p>
		<p>{{ RandomGameTip.tip }}</p>
	</section>
	<section>
		<button @click="openAmongUs" class="btn center-h large">Open Game</button>
		<button @click="REMOVE()" class="btn-inverted center-h large">Voice</button>
	</section>
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
		computed: {
			RandomGameTip: (): GameTip => {
				const { role, tip } = GameTips[Math.floor(Math.random() * GameTips.length)] as GameTip
				return { role: role.charAt(0).toUpperCase() + role.slice(1), tip } as GameTip;
			}
		},
		methods: {
			openAmongUs: function() {
				this.$emit('submit', true);
				ipcRenderer.send('open-game');
			},
			REMOVE: function() { this.$router.push('voice') }
		},
    });

</script>

<style lang="scss" scoped>

	@import './src/assets/styles/variables.scss';

</style>