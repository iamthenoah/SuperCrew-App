<template>
	<section>
		<input type="text">
		<Dropdown
			:noneSelectedText="'No output device'"
			:choiceDescription="'Output Devices'"
			:requireSelected="true"
			@onSelectionChanged="setOption($event)"
		/>
	</section>
</template>

<script lang="ts">

	import Dropdown from '@/components/Dropdown.vue';

	import { defineComponent } from 'vue';
	// const { ipcRenderer } = window.require('electron');
	
    export default defineComponent({
		components: {
			Dropdown
		},
		methods: {
			setOption: function(option) {
				//console.log(option);
			}
		},
	});

</script>