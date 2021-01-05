<template>
	<input @mouseenter="revealLobbyCode" @mouseleave="hideLobbyCode" @click="copyLobbyCode" class="btn large" id="game-code" ref="input" :value="lobbyCode">
</template>

<script lang="ts">

	import { defineComponent } from 'vue';

    export default defineComponent({
		data() {
			return {
				lobbyCode: '---'
			}
		},
		props: {
            gameCode: null
        },
		methods: {
			revealLobbyCode: function() { this.lobbyCode = this.$props.gameCode },
			hideLobbyCode: function() { this.lobbyCode = 'Click to copy!' },
			copyLobbyCode: function() {
				const input = this.$refs.input as HTMLInputElement;
      			input.select();
      			document.execCommand("copy");
    		}
		},
    });

</script>

<style lang="scss" scoped>

	@import './src/assets/styles/variables.scss';
	@import './src/assets/styles/font.scss';

	#game-code {
		border: rgba(white, 0.1) 3px solid;
		background: $dark;
		font-size: 20px;
		height: 50px;
		font-family: 'Oswald', sans-serif;
		font-weight: 600;
		transition: all 100ms ease-in;
	}

</style>