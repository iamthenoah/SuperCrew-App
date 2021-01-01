<template>
	<section>
		<router-link to="/information" class="btn-inverted">Info</router-link>
		<router-link to="/preferences" class="btn-inverted">Preferences</router-link>
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
				ipcRenderer.invoke('open-game')
					.then(() => setTimeout(() => this.isGameOpened = true, 4000))
					.catch(async err => {
						let s: string = err.message as string;
						s = s.substring(s.lastIndexOf(':') + 1).trim();
						await this.$emit('notify', { message: s, type: 'success' });
					})
					.finally(() => setTimeout(() => this.$emit('submit', false), 4000));
			},
		},
    });

</script>