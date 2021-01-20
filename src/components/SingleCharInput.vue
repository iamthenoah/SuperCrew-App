<template>
	<input @click="listenForInput()" @keypress="changeInput()" class="" :value="inputChar" disabled>
</template>

<script lang="ts">

	import { defineComponent } from 'vue';

    export default defineComponent({
        emits: [ 'onCharChanged' ],
		data() {
			return {
				isListening: false,
				char: null
			}
		},
		props: {
            inputChar: null
		},
		methods: {
            chageInput: function() {
				this.isListening = false;
                this.$emit('onCharChanged', );
            },
            listenForInput: function() {
                this.isListening = true;
            }
		},
    });

</script>

<style lang="scss" scoped>

	@import './src/assets/styles/variables.scss';

</style>