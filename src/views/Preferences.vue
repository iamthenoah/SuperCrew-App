<template>
	<section>
		<h4>Player & Gameplay</h4>
		<label>Reference Name</label>
		<input type="text" spellcheck="false" v-model="settings.displayName">
		<button class="btn-special large">Update Name</button>
		<label>Hide Code in Lobby</label>
		<input type="text" spellcheck="false" v-model="settings.configs.hideCode">
	</section>
	<section>
		<hr>
		<h4>Voice & Audio</h4>
		<label>Microphone</label>
		<Dropdown
			:selectedOption="settings.perifs.input"
			:noneSelectedText="'No input device'"
			:choiceDescription="'Available Input Devices'"
			:canHaveNoneMessage="'None'"
			:requireSelected="true"
			:options="inputDevices"
			@onSelectionChanged="changePerif($event, 'input')"
		/>
		<label>Audio Output</label>
		<Dropdown
			:selectedOption="settings.perifs.output"
			:noneSelectedText="'No output device'"
			:choiceDescription="'Available Output Devices'"
			:canHaveNoneMessage="'None'"
			:requireSelected="true"
			:options="outputDevices"
			@onSelectionChanged="changePerif($event, 'output')"
		/>
		<label>Push to Talk Shortcut</label>
		<input type="text" v-model="settings.shortcuts.pushToTalk">
		<label>Deafen Shortcut</label>
		<input type="text" v-model="settings.shortcuts.deafen">
	</section>
	<section>
		<hr>
		<h4>Appearance</h4>
		<label>App Theme</label>
		<input type="text" spellcheck="false" v-model="settings.configs.theme">
	</section>
	<section>
		<hr>
		<h4>Server (Advanced)</h4>
		<label>Server Source</label>
		<input type="text" spellcheck="false" v-model="settings.server">
		<button class="btn-special large">Update Source</button>
	</section>
	<section>
		<hr>
		<h4>Danger Zone</h4>
		<button class="btn-danger-inverted large">Reset Settings to Default</button>
		<p>Resets app settings to its initial state.</p>
		<p>display name, server source, audio sources, etc.</p>
	</section>
</template>

<script lang="ts">

	import Dropdown, { DropdownOption } from '@/components/Dropdown.vue';
	import { defineComponent } from 'vue';
	const { ipcRenderer } = window.require('electron');

	type ConfigurableSettings = {
		displayName: string;
		server: string;
        perifs: {
            input: string | null;
            output: string | null;
        };
        shortcuts: {
            pushToTalk: string;
            deafen: string;
        };
        configs: {
            pushToTalk: boolean;
            hideCode: boolean;
            theme: string | null;
        };		
	}

	const inputDevices: DropdownOption[] = [];
	const outputDevices: DropdownOption[] = [];
	const settings: ConfigurableSettings = {
		displayName: '',
        server: 'https://supercrew.herokuapp.com',
        perifs: {
            input: null,
            output: null
        },
        shortcuts: {
            pushToTalk: 'V',
            deafen: 'B',
        },
        configs: {
            pushToTalk: true,
            hideCode: false,
            theme: null,
        }
    }; 

    export default defineComponent({
		emits: ['submit', 'notify'],
		components: {
			Dropdown
		},
		data() {
			return {
				inputDevices,
				outputDevices,
				settings
			}
		},
		async mounted() {
			navigator.mediaDevices.enumerateDevices()
				.then(stream => {
					for (const [ _, device ] of Object.entries(stream))
						if (device.kind !== 'videoinput')
							(device.kind === 'audioinput')
								? this.inputDevices.push({ key: device.deviceId, name: device.label })
								: this.outputDevices.push({ key: device.deviceId, name: device.label })
				}).catch(err => this.$emit('notify', err.message));
			this.settings = await ipcRenderer.invoke('get-user-settings') as ConfigurableSettings;
			if (!this.inputDevices) this.settings.perifs.input = null;
			if (!this.outputDevices) this.settings.perifs.output = null;
		},
		methods: {
			changeSetting: function (key: string, value: string) { ipcRenderer.send('set-setting', ([[ key, value ]])) },
			changePerif: function(option, key) { this.changeSetting(key, option ? option.name : null) },
		}
	});

</script>