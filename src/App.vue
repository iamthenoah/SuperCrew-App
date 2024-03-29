<template> 
	<WindowHeader />
	<main>
		<LoadingBar v-if="disableWindow" />
		<div class="content noselect" :class="{ 'disabled' : disableWindow }">
			<router-view 
				@submit="globalSubmit($event)"
				@notify="notifyUser($event)"
			/>
		</div>
		<div id="notif-container">
			<Notification 
				v-if="notification.duration != 0"
				@onNotificationClosed="closeNotification()"
				:duration="notification.duration"
				:message="notification.message"
				:type="notification.type"
			/>
		</div>
	</main>
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
				disableWindow: true,
				notification,
			}
		},
		mounted() {
			ipcRenderer.send('check-game-opened');
			ipcRenderer.on('game-open-state', (_: Electron.IpcRendererEvent, opened: boolean) => {
				this.$router.push(opened ? '/playing' : '/');
				this.globalSubmit(false);
			});
			ipcRenderer.on('notify', (_: Electron.IpcRendererEvent, message: string, type = NotificationType.ERROR, duration: number = message.length * 150) =>
				this.notifyUser(message, type, duration));
		},
		methods: {
			globalSubmit: function(submit: boolean) {
				this.disableWindow = submit;
			},
			closeNotification: function() {
				this.notification = { message: '', type: NotificationType.ERROR, duration: 0 };
			},
			notifyUser: function(message: string, type = NotificationType.ERROR, duration: number = message.length * 150) {
				if (message) this.notification = { message, type, duration } as Notification;
				this.globalSubmit(false);
			}
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

	#notif-container {
		position: fixed;
		bottom: 0;
		height: auto;
		width: 100%;
	}
	
</style>