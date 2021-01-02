<template>
	<section>
		<button v-if="!isGameOpened" @click="openAmongUs" class="btn center-h">Open Among Us</button>
	</section>
</template>

<script lang="ts">

	import { defineComponent } from 'vue';
	const { ipcRenderer } = window.require('electron');
	
    export default defineComponent({
		data() {
			return {
				isGameOpened: false,
			}
		},
        methods: {
			openAmongUs: function() {
				this.$emit('submit', true);
				ipcRenderer.invoke('call-error')
					.then(() => this.isGameOpened = true)
					.catch(async err => {
						let s: string = err.message as string;
						s = s.substring(s.lastIndexOf(':') + 1).trim();
						await this.$emit('notify', { message: s, type: 'error' });
					})
					.finally(() => this.$emit('submit', false));
			},
		},
    });

</script>