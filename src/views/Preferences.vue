<template>
	<section>
		<h4>Player & Gameplay</h4>
		<label>‣ Reference Name</label>
			<form @submit.prevent="changeSetting('displayName', this.settings.displayName)">
				<div class="tooltip-container large-input" v-tooltip="'displayed name while playing'">
					<input type="text" spellcheck="false" v-model="settings.displayName">
				</div>
				<button type="submit" class="btn-special large">Update Name</button>
			</form>
		<label>‣ Hide Code in Lobby</label>
		<div class="large-input">
			<input type="text" spellcheck="false" v-model="settings.configs.hideCode">
		</div>
	</section>
	<section>
		<h4>Voice & Audio</h4>
		<label>‣ Microphone</label>
		<Dropdown
			:selectedOption="settings.perifs.input?.name"
			:noneSelectedText="'No input device'"
			:choiceDescription="'Available Input Devices'"
			:canHaveNoneMessage="'None'"
			:requireSelected="true"
			:options="inputDevices"
			@onSelectionChanged="changePerif('input', $event)"
		/>
		<label>‣ Audio Output</label>
		<Dropdown
			:selectedOption="settings.perifs.output?.name"
			:noneSelectedText="'No output device'"
			:choiceDescription="'Available Output Devices'"
			:canHaveNoneMessage="'None'"
			:requireSelected="true"
			:options="outputDevices"
			@onSelectionChanged="changePerif('output', $event)"
		/>
		<label>‣ Push to Talk Shortcut</label>
		<div class="tooltip-container" v-tooltip="'push to talk keyboard shortcut'">
			<SingleCharInput
				:validation="validateShortcutInput"
				:uniqueInputIdentifier="'pushToTalkKey'"
				:inputChar="settings.shortcuts.pushToTalkKey?.keyText"
				@onCharChanged="changeSetting('pushToTalkKey', $event)"
			/>
		</div>
		<label>‣ Deafen Shortcut</label>
		<div class="tooltip-container" v-tooltip="'deafen keyboard shortcut'">
			<SingleCharInput 
				:validation="validateShortcutInput"
				:uniqueInputIdentifier="'deafenKey'"
				:inputChar="settings.shortcuts.deafenKey?.keyText"
				@onCharChanged="changeSetting('deafenKey', $event)"
			/>
		</div>
	</section>
	<section>
		<h4>Appearance</h4>
		<label>‣ App Theme</label>
		<div class="tooltip-container large-input" v-tooltip="'change the apps color theme'">
			<input type="text" spellcheck="false" v-model="settings.configs.theme">
		</div>
	</section>
	<section>
		<h4>Server (Advanced)</h4>
		<label>‣ Server Source</label>
		<div class="tooltip-container large-input" v-tooltip="'specify voice chanel server origin'">
			<input type="text" spellcheck="false" v-model="settings.server">
		</div>
		<button class="btn-special large">Update Source</button>
	</section>
	<section>
		<h4>Danger Zone</h4>
		<button class="btn-inverted large">Reset Settings</button>
		<p>Resets app settings to its initial state.</p>
		<p>display name, server source, audio sources, etc.</p>
	</section>
</template>

<script lang="ts">

	import Dropdown, { DropdownOption } from '@/components/Dropdown.vue';
	import SingleCharInput from '@/components/SingleCharInput.vue';
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
            pushToTalkKey: {
				keyText: string;
				keyCode: number;
			} | null;
            deafenKey: {
				keyText: string;
				keyCode: number;
			} | null;
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
            pushToTalkKey: null,
            deafenKey: null,
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
			Dropdown,
			SingleCharInput
		},
		data() {
			return {
				inputDevices,
				outputDevices,
				settings,
			}
		},
		async mounted() {
			navigator.mediaDevices.enumerateDevices()
				.then(stream => {

					this.inputDevices = [];
					this.outputDevices = [];

					// eslint-disable-next-line
					for (const [ _, device ] of Object.entries(stream)) 
						if (device.kind !== 'videoinput')
							(device.kind === 'audioinput')
								? this.inputDevices.push({ key: device.deviceId, name: device.label })
								: this.outputDevices.push({ key: device.deviceId, name: device.label });

				}).catch(err => this.$emit('notify', err.message));

			this.settings = await ipcRenderer.invoke('get-user-settings') as ConfigurableSettings;

			if (!this.inputDevices)
				this.settings.perifs.input = null;
			if (!this.outputDevices)
				this.settings.perifs.output = null;
		},
		methods: {
			getSetting: async function(params: string[]) {
				return await ipcRenderer.invoke('get-setting', params);
			},
			changeSetting: function (key: string, value: unknown) {
				ipcRenderer.send('set-setting', ([[ key, value ]]));
			},
			changePerif: function(key: string, option: { key: string; name: (string | object | number) }) {
				this.changeSetting(key, option ? { deviceId: option.key, name: option.name } : null);
			},
			validateShortcutInput: async function(key: string, code: number): Promise<boolean> {
				const toWords = (cword: string): string => {
					const s = cword.replace(/([A-Z])/g, " $1");
					return s.charAt(0).toUpperCase() + s.slice(1);
				}

				const from = key.indexOf('pushToTalkKey') > -1 ? 'deafenKey' : 'pushToTalkKey';
				const res = await this.getSetting([from]);
				const valid = res[from].keyCode !== code;

				if (!valid) this.$emit('notify', `${toWords(key)} cannot be the same as ${toWords(from)}.`);
				return valid;
			}
		}
	});

</script>