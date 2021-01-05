<template> 
	<WindowHeader />
	<main>
		<LoadingBar v-if="globalDisable" />
		<div class="content noselect" :class="{ 'disabled' : globalDisable }">
			<router-view v-on:submit="globalSubmit($event)" />
		</div>
	</main>
	<Notification v-if="notification.duration != 0" v-on:close-notification="closeNotification" :duration="notification.duration" :message="notification.message" :type="notification.type"/>
	<ControlOptions />
</template>

<script lang="ts">

	import WindowHeader from '@/components/WindowHeader.vue';
	import LoadingBar from '@/components/LoadingBar.vue';
	import Notification from '@/components/Notification.vue';
	import ControlOptions from '@/components/ControlOptions.vue';
	
	import { NotificationType } from '@/common/NotificationType';
	import { defineComponent } from 'vue';
	const { ipcRenderer } = window.require('electron');

	type Notification = {
    	message: string;
    	type: NotificationType;
    	duration: number;
	};

	export default defineComponent({
		components: {
			WindowHeader,
			LoadingBar,
			Notification,
			ControlOptions,
		},
		data() {
			const notification: Notification = { message: '', type: NotificationType.ERROR, duration: 0 };
			return {
				globalDisable: false,
				notification,
			}
		},
		mounted() {
			ipcRenderer.send('check-game-opened');
			ipcRenderer.on('game-opened', (_: Electron.IpcRendererEvent, opened: boolean) => {
				if (opened) {
					ipcRenderer.send('run-game-proxy');
					this.$router.push('/home'); 
				} else {
					this.$router.push('/');
				}
			});

			ipcRenderer.on('notify', (_: Electron.IpcRendererEvent, message: string, type = NotificationType.ERROR, duration: number = message.length * 150) => {
				if (message) this.notification = { message, type, duration } as Notification;
				this.globalDisable = false;
			});
		},
		methods: {
			globalSubmit: function(submit: boolean) {
				this.globalDisable = submit;
			},
			closeNotification: function() {
				this.notification = { message: '', type: NotificationType.ERROR, duration: 0 };
			},
		},
	});

</script>

<style lang="scss">

	@import './src/assets/styles/variables.scss';
	@import './src/assets/styles/default.scss';
	@import './src/assets/styles/main.scss';
	@import './src/assets/styles/font.scss';

	@font-face {
		font-family: 'Uni Sans';
		src: url('./assets/fonts/uni-sans.heavy-caps.woff');
	}

</style>