<template>
    <div id="control-container" class="noselect">
        <ul>
            <ol>
                <div v-tooltip="'mute'" class="standalone-icon" @click="toggleMute()">
                    <img v-if="!muted" src="@/assets/static/icons/microphone.png">
                    <img v-else src="@/assets/static/icons/microphone_disabled.png">
                </div>
            </ol>
            <ol>
                <div v-tooltip="'deafen'" class="standalone-icon" @click="toggleDeafen()">
                    <img v-if="!deafened" src="@/assets/static/icons/headphones.png">
                    <img v-else src="@/assets/static/icons/headphones_disabled.png">
                </div>
            </ol>
            <ol>
                <div :class="{ 'toggled': settingsOpened }" class="standalone-icon" @click="toggleSettings()"><img src="@/assets/static/icons/gear.png"></div>
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