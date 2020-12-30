<template>
	<div>
		<LoadingBar v-if="submitted" />
		<section :class="{ 'disabled' : submitted }">
			<div id="loading-bar"></div>
			<hr>
			<p  v-if="!error" class="error">{{ error }}</p>
			<button v-if="!isGameOpened" @click="openAmongUs" class="btn center-h">Open Among Us</button>
		</section>
	</div>
</template>

<script lang="ts">

	import LoadingBar from '@/components/LoadingBar.vue';
	import { defineComponent } from 'vue';
	const { ipcRenderer } = window.require('electron');

    export default defineComponent({
		components: {
			LoadingBar
		},
		data() {
			return {
				submitted: false,
				isGameOpened: false,
				error: "",
			}
		},
        methods: {
			openAmongUs: function() {
				this.submitted = true;
				ipcRenderer.invoke('open-game')
					.then((opened) => this.isGameOpened = opened)
					.catch(err => this.error = err);
				this.submitted = false;
			}
		},
    });

</script>