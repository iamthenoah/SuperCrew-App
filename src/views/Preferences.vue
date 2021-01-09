<template>
	<section>
		<h4>Player</h4>
		<label>Reference Name</label>
		<input type="text">
		<hr>
	</section>
	<section>
		<h4>Voice & Audio</h4>
		<label>Microphone</label>
		<Dropdown
			:noneSelectedText="'No input device'"
			:choiceDescription="'Available Input Devices'"
			:canHaveNoneMessage="'None'"
			:requireSelected="true"
			@onSelectionChanged="setOption($event)"
		/>
		<label>Audio Output</label>
		<Dropdown
			:noneSelectedText="'No output device'"
			:choiceDescription="'Available Output Devices'"
			:canHaveNoneMessage="'None'"
			:requireSelected="true"
			@onSelectionChanged="setOption($event)"
		/>
	</section>
	<section>
		<button class="btn-special large">Save Changes</button>
	</section>
</template>

<script lang="ts">

	import Dropdown from '@/components/Dropdown.vue';

	import { defineComponent } from 'vue';
	// const { ipcRenderer } = window.require('electron');
	
    export default defineComponent({
		emits: ['submit'],
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