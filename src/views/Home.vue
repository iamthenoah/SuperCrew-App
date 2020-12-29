<template>
	<div>
		<LoadingBar v-if="submitted" />
		<section :class="{ 'disabled' : submitted }">
			<div id="loading-bar"></div>
			<hr>
			<button v-if="!gameOpened" @click="openAmongUs" class="btn center-h">Open Among Us</button>
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
				gameOpened: false,
			}
		},
        methods: {
			openAmongUs: function() {
				this.submitted = true;
				ipcRenderer.invoke('open-game').then((opened) => { this.gameOpened = opened });
				setTimeout(() => { this.submitted = false; }, 3000);
			}
		},
    });

</script>