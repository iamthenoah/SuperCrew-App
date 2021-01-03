<template>
    <div id="control-container" class="noselect">
        <ul>
            <ol>
                <div class="standalone-icon" @click="mute">
                    <img v-if="!muted" src="@/assets/icons/microphone.png">
                    <img v-else src="@/assets/icons/microphone_disabled.png">
                </div>
            </ol>
            <ol>
                <div class="standalone-icon" @click="deafen">
                    <img v-if="!deafened" src="@/assets/icons/headphones.png">
                    <img v-else src="@/assets/icons/headphones_disabled.png">
                </div>
            </ol>
            <ol>
                <router-link to="/preferences">
                    <div class="standalone-icon"><img src="@/assets/icons/gear.png"></div>
                </router-link>
            </ol>
        </ul>
    </div>
</template>

<script lang="ts">

    import { defineComponent } from 'vue';

    export default defineComponent({
        data() {
            return {
                muted: false,
                deafened: false
            }
        },
        methods: {
            mute: function() {
                this.muted = !this.muted;
            },
            deafen: function() {
                this.deafened = !this.deafened;
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

</style>