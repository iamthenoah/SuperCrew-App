<template> 
	<div>
		<WindowHeader />
		<main>
			<LoadingBar v-if="globalDisable" />
			<div :class="{ 'disabled' : globalDisable }">
				<router-view v-on:submit="toggleGlobalSubmit($event)" v-on:notification="openNotification($event)"/>
			</div>
			<Notification v-if="notify.duration != 0" v-on:close-notification="closeNotification" :duration="notify.duration" :message="notify.message" :type="notify.type"/>
		</main>
	</div>
</template>

<script lang="ts">

	import WindowHeader from '@/components/WindowHeader.vue';
	import LoadingBar from '@/components/LoadingBar.vue';
	import Notification from '@/components/Notification.vue';

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
		},
		data() {
			const notify: Notification | null = { message: '', type: '', duration: 0 };
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
				this.notify = { message, type, duration: message.length * 150 /* 150ms/chars, avg. -> 48ms/char */ } as Notification;
			},
			closeNotification: function() {
				this.notify = { message: '', type: '', duration: 0 };
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