<template> 
	<WindowHeader />
	<main>
		<LoadingBar v-if="globalDisable" />
		<router-view :class="{ 'disabled' : globalDisable }" v-on:submit="toggleGlobalSubmit($event)" v-on:notify="openNotification($event)"/>
	</main>
	<Notification v-if="notification.duration != 0" v-on:close-notification="closeNotification" :duration="notification.duration" :message="notification.message" :type="notification.type"/>
	<ControlOptions />
</template>

<script lang="ts">

	import WindowHeader from '@/components/WindowHeader.vue';
	import LoadingBar from '@/components/LoadingBar.vue';
	import Notification from '@/components/Notification.vue';
	import ControlOptions from '@/components/ControlOptions.vue';

	const { ipcRenderer } = window.require('electron');
	import { defineComponent } from 'vue';

	type Notification = {
    	message: string;
    	type: string;
    	duration: number;
	};

	type NotificationParams = {
		message: string;
    	type: string;
	};

	export default defineComponent({
		components: {
			WindowHeader,
			LoadingBar,
			Notification,
			ControlOptions,
		},
		data() {
			const notification: Notification | null = { message: '', type: '', duration: 0 };
			return {
				globalDisable: false,
				notification
			}
		},
		mounted() {
			ipcRenderer.invoke('check-game-opened').then(async opened => {
				const s = opened ? 'Among Us has been detected!' : 'Could not detect Among Us runnig...';
				this.notification = {
					message: s,
					type: opened ? 'success' : 'warning',
					duration: s.length * 150 /* 150ms/chars, avg. -> 48ms/char */
				} as Notification;
			});
		},
		methods: {
			toggleGlobalSubmit: function(toggle: boolean) {
				this.globalDisable = toggle;
			},
			openNotification: function({ message, type }: NotificationParams) {
				this.notification = { message, type, duration: message.length * 150 } as Notification;
			},
			closeNotification: function() {
				this.notification = { message: '', type: '', duration: 0 };
			},
		},
	});

</script>

<style lang="scss">
	@import './src/assets/styles/variables.scss';
	@import './src/assets/styles/default.scss';
	@import './src/assets/styles/main.scss';
	@import './src/assets/styles/font.scss';
</style>