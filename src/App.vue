<template> 
	<div>
		<WindowHeader />
		<main>
			<router-view/>
			<div v-if="notify.message">
				<Notification :message="notify.message" :messageType="notify.type" :duration="notify.duration" />
			</div>
		</main>
	</div>
</template>

<script lang="ts">

	const { ipcRenderer } = window.require('electron');
	import Notification from '@/components/Notification.vue';
	import WindowHeader from '@/components/WindowHeader.vue';
	import { defineComponent } from 'vue';

	export default defineComponent({
		components: {
			WindowHeader,
			Notification,
		},
		data() {
			return {
				onGlobalSubmit: false,
				notify: {
					type: "",
					message: "", 
					duration: 0
				}
			}
		},
		mounted() {
			ipcRenderer.invoke('check-game-opened', 'Among Us.exe').then(opened => {
				if (opened) {
					this.notify = {
						message: "Among Us has been detected!",
						type: "success",
						duration: 3000
					};
				} else {
					this.notify = {
						message: "Could not detect Among Us runnig...",
						type: "warning",
						duration: 5000
					};
				}
			});
			//window.onerror = (message, source, line, column, error) => {
			//	console.error("ERRREROORE: " + message);
			//};
		},
	});

</script>

<style lang="scss">
	@import './src/assets/styles/variables.scss';
	@import './src/assets/styles/default.scss';
	@import './src/assets/styles/main.scss';
	@import './src/assets/styles/font.scss';
</style>