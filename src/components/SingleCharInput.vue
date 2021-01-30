<template>
	<div
		tabindex="0"
		v-click-outside="finishOperation"
		@click="listenForInput"
		@keydown="changeInput($event)"
		@keyup="finishOperation()"
		:class="{ 'focus-border' : focused }"
		class="single-char-input-container"
	>
		<!-- tabindex prop makes div susceptible to key press events -->
		<div class="input-char">
			{{ focused ? inputTextPress : key }}
		</div>
	</div>
</template>

<script lang="ts">

	import { defineComponent } from 'vue';

    export default defineComponent({
		emits: [ 'onCharChanged' ],
		data() {
			return {
				focused: false,
				key: '',
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
			},
			validation: {
				type: Function,
				default: () => true
			},
			uniqueInputIdentifier: {
				type: String,
				default: ''
			}
		},
		mounted() {
			setTimeout(() => this.key = this.inputChar, 10)
		},
		methods: {
            changeInput: async function(e: KeyboardEvent) {
				this.finishOperation();
				
				const c = e.keyCode;
				const k = e.key.toUpperCase();

				if (c === 27) return;
				const canChangeInput = await this.validation(this.uniqueInputIdentifier, c);
				
				if (canChangeInput) {
					this.key = k;
					this.$emit('onCharChanged', {
						keyText: k,
						keyCode: c 
					});
				}
            },
            listenForInput: function() {
				this.focused = true;
			},
			finishOperation: function () {
				this.$el.blur();
				this.focused = false;
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
		outline: none;
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