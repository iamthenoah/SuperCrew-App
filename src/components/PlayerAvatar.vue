<template>
    <div class="noselect">
        <div class="avatar-container">
            <img class="body" :src="Body">
            <img v-if="hasHat" class="hat" :src="Hat">
            <img v-if="hasSkin" class="skin" :src="Skin">
        </div>
    </div>
</template>

<script lang="ts">

/*
const hatId: number = this.$props.player.appearance.hatId;
const hatOffsets: number[] = [
    45, 25, 50, 37, 33, 60, 70, 20, 27, 35, 41, 52,
    35, 29, 40, 49, 34, 40, 25, 52, 55, 46, 41, 49, 46, 36, 44,
    59, 44, 39, 30, 32, 37, 26, 61, 40, 43, 26, 50, 51,
    37, 44, 30, 22, 40, 42, 8, 29, 32, 36, 28, 22, 39, 42,
    24, 30, 47, 27, 52, 44, 26, 44, 48, 47, 42, 48, 50, 32, 44,
    38, 56, 19, 27, 30, 42, 43, 60, 34, 10, 45, 50, 33, 13,
    2, 40, 32, 32, 55, 22, 10, 26, 29, 43
];
return hatOffsets[hatId - 1];
*/

    import { IPlayer } from '@/common/proxy/interfaces/IPlayer';
    import { defineComponent } from 'vue';

    const player: IPlayer | null = null;

    export default defineComponent({
        props: {
            player,
        },
        computed: {
            hasHat: function(): boolean { return this.$props.player.appearance.hatId !== 0 },
            hasSkin: function(): boolean { return this.$props.player.appearance.skinId !== 0 },
            Body: function() {
                const colorId: number = this.$props.player.appearance.colorId;
                return require(`@/assets/static/players/alive/${colorId}.png`);
            },
            Hat: function() {
                const hatId: number = this.$props.player.appearance.hatId;
                // const hatY = 17 - hatOffsets[hat];
                // hatY > 0 ? 0 : -hatY
                return require(`@/assets/static/hats/${hatId}.png`);
            },
            Skin: function() {
                const skinId: number = this.$props.player.appearance.skinId;
                return require(`@/assets/static/skins/${skinId}.png`);
            },
        }
    });

</script>

<style lang="scss" scoped>
    
	@import './src/assets/styles/variables.scss';

    .avatar-container {
        position: absolute;
        width: 100px;
        height: 130px;
        outline: red solid 1px;
    }

    .hat, .body {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }

    .hat {
        top: 0;
    }

    .body {
        bottom: 0;
    }

    .skin {
        position: absolute;
        bottom: 5px;
        right: 16px;
        height: 50px;
        width: 57.5px;
    }
    
</style>
