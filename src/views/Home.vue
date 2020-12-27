<template>
	<LoadingBar />
	<section>
		<button v-if="!gameOpened" @click="openAmongUs" class="btn center-h">Open Among Us</button>
	</section>
	<Notification message="Game does not seem to be opened..." messageType="warning" />
</template>

<script lang="ts">

    import Notification from '@/components/Notification.vue';
	import LoadingBar from '@/components/LoadingBar.vue'
	import { defineComponent } from 'vue';
	const { ipcRenderer } = window.require('electron');

    export default defineComponent({
		components: {
			Notification,
			LoadingBar
		},
		data() {
			return {
				gameOpened: false,
			}
		},
        methods: {
			openAmongUs: function() {
				ipcRenderer.invoke('open-game').then((opened) => { this.gameOpened = opened });
			}
		},
    });

</script>