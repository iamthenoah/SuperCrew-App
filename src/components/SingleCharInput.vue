<template>
	<div v-click-outside="onClickOutside" @click="listenForInput()" class="single-char-input-container" :class="{ 'focus-border' : focused }">
		<div class="input-char">{{ focused ? inputTextPress : inputChar }}</div>
	</div>
</template>

<script lang="ts">

	import { defineComponent } from 'vue';

    export default defineComponent({
		emits: [ 'onCharChanged' ],
		data() {
			return {
				focused: false,
			}
		},
		props: {
			inputChar: {
				type: String,
				default: null 
			},
			inputTextPress: {
				type: String,
				default: 'press any key...'
			}
		},
		methods: {
            changeInput: function() {
				this.focused = false;
                this.$emit('onCharChanged', );
            },
            listenForInput: function() {
				this.focused = true;
				console.log('listening...')
			},
			onClickOutside: function (e: MouseEvent) {
				this.focused = false;
				// console.log(e)
			}
		},
    });

</script>

<style lang="scss" scoped>

	@import './src/assets/styles/variables.scss';

	.single-char-input-container {
		position: relative;
		text-align: center;
		height: 33px;
		border-radius: 3px;
		background: $darker;
	    border: transparent solid 1px;
		margin: 10px 0;
		cursor: pointer;   
	}

	.focus-border {
		border-color: $theme;
		color: rgba(white, 0.5);
		line-height: 20px;
	}

	.input-char {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 100%;
		justify-content: center;
		font-family: 'Roboto';
		font-size: 16px;
	}

</style>