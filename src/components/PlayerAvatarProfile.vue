<template>
    <div class="noselect">
        <div class="avatar-container">
            <img class="body" :src="Body">
            <img v-if="hasHat" :class="{ 'back': isHatInBack }" class="hat" :style="{ top: hatOffset + 'px' }" :src="Hat">
            <img v-if="hasSkin" class="skin" :src="Skin">
        </div>
    </div>
</template>

<script lang="ts">

    import { defineComponent } from 'vue';
    import { PlayerAvatar } from '@/common/PlayerAvatar';
    const avatar: PlayerAvatar | null = null;

    export default defineComponent({
        props: {
            avatar
        },
        computed: {
            isHatInBack: function(): boolean { return new Set([ 4, 6, 15, 29, 39, 42, 85 ]).has(this.avatar.hatId) },
            hasHat: function(): boolean { return this.avatar.hatId !== 0 },
            hasSkin: function(): boolean { return this.avatar.skinId !== 0 },
            Body: function() {
                const colorId: number = this.avatar.colorId;
                console.log()
                const state: string = this.avatar.isDead ? 'dead' : 'alive'; 
                return require(`@/assets/static/players/${state}/${colorId}.png`);
            },
            Hat: function() {
                const hatId: number = this.avatar.hatId;
                return require(`@/assets/static/hats/${hatId}.png`);
            },
            Skin: function() {
                const skinId: number = this.avatar.skinId;
                return require(`@/assets/static/skins/${skinId}.png`);
            },
            hatOffset: function(): number {
                const hatId: number = this.avatar.hatId;
                const offsets: Array<number> = [
                    45, 25, 50, 37, 35, 60, 65, 20, 27,         //  1 -  9
                    35, 41, 52, 35, 29, 45, 49, 34, 40, 25,     // 10 - 19
                    52, 57, 40, 41, 49, 48, 36, 44, 59, 48,     // 20 - 29
                    36, 24, 32, 35, 26, 61, 40, 43, 26, 54,     // 30 - 39
                    51, 38, 46, 30, 21, 40, 42, 3, 29, 31,      // 40 - 49
                    36, 28, 23, 41, 41, 25, 27, 48, 28, 49,     // 50 - 59
                    44, 26, 44, 45, 47, 41, 48, 48, 32, 46,     // 60 - 69
                    38, 56, 16, 27, 30, 42, 43, 63, 32, 5,      // 70 - 79
                    45, 50, 33, 14, 6, 40, 34, 35, 53, 22,      // 80 - 89
                    10, 26, 29, 45                              // 90 - 93
                ];

                // WEIRD X OFFSET THAT NEEDS CORRECTION
                // 9 12 18 19 26 27 31 33 38 47 58 62 70 71 80 81 85 87 88 91

                return 65 - offsets[hatId - 1];
            },
        }
    });

</script>

<style lang="scss" scoped>
    
	@import './src/assets/styles/variables.scss';

    .avatar-container {
        position: absolute;
        width: 100px;
        height: 150px;
        outline: red solid 1px;
    }

    .body {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }

    .hat {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
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

    .back {
        z-index: -1;
    }
    
</style>
