<template> 
	<div>
		<WindowHeader />
		<main>
			<LoadingBar v-if="globalDisable" />
			<router-view v-on:submit="toggleGlobalSubmit($event)" v-on:notification="openNotification($event)" :class="{ 'disable' : globalDisable }" />
			<div v-if="notify.duration != 0">
				<pre>{{ notify }}</pre>
				<Notification v-on:close-notification="closeNotification" :duration="notify.duration" :message="notify.message" :type="notify.type"/>
			</div>
		</main>
	</div>
</template>

<script lang="ts">

	import WindowHeader from '@/components/WindowHeader.vue';
	import LoadingBar from '@/components/LoadingBar.vue';
	import Notification from '@/components/Notification.vue';

	import { INotification } from '@/interfaces/INotification';
	import { INotificationParams } from '@/interfaces/INotificationParams';
	import { defineComponent } from 'vue';

	const { ipcRenderer } = window.require('electron');

	export default defineComponent({
		components: {
			WindowHeader,
			LoadingBar,
			Notification,
		},
		data() {
			const notify: INotification | null = { message: '', messageType: '', duration: 0 };
			return {
				globalDisable: false,
				notify
			}
		},
		mounted() {
			ipcRenderer.invoke('check-game-opened').then(async opened => {
				const s = opened ? 'Among Us has been detected!' : 'Could not detect Among Us runnig...';
				this.notify = {
					message: s,
					messageType: opened ? 'success' : 'warning',
					duration: s.length * 150 /* 150ms/chars, avg. -> 48ms/char */
				} as INotification;
			});
		},
		methods: {
			toggleGlobalSubmit: function(toggle: boolean) {
				this.globalDisable = toggle;
			},
			openNotification: function({ message, messageType }: INotificationParams) {
				console.log('PRE  openNotification');
				this.notify = { message, messageType, duration: message.length * 150 /* 150ms/chars, avg. -> 48ms/char */ } as INotification;
				console.table(this.notify);
				console.log('POST openNotification');
			},
			closeNotification: function() {
				console.log('PRE  closeNotification');
				this.notify = { message: '', messageType: '', duration: 0 };
				console.log('POST closeNotification');
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