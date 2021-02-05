<template>
    <div id="control-container" class="noselect">
        <ul>
            <ol>
                <div class="tooltip-container" v-tooltip="muted ? 'unmute' : 'mute'">
                    <div class="standalone-icon" @click="toggleMute()">
                        <div v-if="muted">
                            <div class="crossed-bg"></div>
                            <div class="crossed-red"></div>
                        </div>
                        <img src="@/assets/static/icons/new/microphone.png">
                    </div>
                </div>
            </ol>
            <ol>
                <div class="tooltip-container" v-tooltip="deafened ? 'undeafen' : 'deafen'">
                    <div class="standalone-icon" @click="toggleDeafen()">
                        <div v-if="deafened">
                            <div class="crossed-bg"></div>
                            <div class="crossed-red"></div>
                        </div>
                        <img src="@/assets/static/icons/new/headphones.png">
                    </div>
                </div>
            </ol>
            <ol>
                <div :class="{ 'toggled': settingsOpened }" class="standalone-icon" @click="toggleSettings()">
                    <img src="@/assets/static/icons/new/gear.png">
                </div>
            </ol>
        </ul>
    </div>
</template>

<script lang="ts">

    import { AmongUsGameData } from '@/common/proxy/AmongUsGameData';
    import { defineComponent } from 'vue';
    const { ipcRenderer } = window.require('electron');

    export default defineComponent({
        data() {
            return {
                muted: false,
                deafened: false,
                settingsOpened: false,
                gameRunning: false
            }
        },
        mounted() {
            ipcRenderer.on('game-data', (_: Electron.IpcRendererEvent, data: AmongUsGameData | null) => {
                this.gameRunning = !!data;
            });
            ipcRenderer.on('game-open-state', (_: Electron.IpcRendererEvent, opened: boolean) => {
                this.gameRunning = opened;
			});
        },
        methods: {
            toggleMute: function() {
                this.muted = !this.muted;
            },
            toggleDeafen: function() {
                this.deafened = !this.deafened;
            },
            toggleSettings: function() {
                let route = this.settingsOpened ? '/' : '/preferences';
                if (this.gameRunning && this.settingsOpened) route = '/playing';
                this.settingsOpened = !this.settingsOpened;
                this.$router.push(route);
            }
        },
    });

</script>

<style lang="scss" scoped>

	@import './src/assets/styles/variables.scss';

    #control-container {
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
        height: 50px;
        background: $darker;
        z-index: 1000;
    }

    ul {
        display: flex;
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        width: auto;
    }

    ol {
        margin: 0 2px;
        float: left;
    }

    .toggled {
        background: $darkest;
    }

</style>