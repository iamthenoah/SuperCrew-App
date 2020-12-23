<template>
	<WindowHeader />
	<router-view/>
</template>

<script lang="ts">

	import { defineComponent } from 'vue';
	import WindowHeader from '@/components/WindowHeader.vue';

	export default defineComponent({
		components: {
			WindowHeader,
		},
	});

</script>

<style lang="scss">
	@import './src/assets/styles/variables.scss';
	@import './src/assets/styles/default.scss';
	@import './src/assets/styles/main.scss';
	@import './src/assets/styles/font.scss';
</style>