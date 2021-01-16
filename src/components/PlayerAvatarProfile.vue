<template>
    <div class="noselect">
        <div class="avatar-container noselect">
            <img class="body" :src="Body">
            <img class="hat" v-if="hasHat && !avatar.ghost" :class="{ 'back': isHatInBack }" :style="{ 'z-index': zIndex }" :src="Hat">
            <img class="skin" v-if="hasSkin && !avatar.ghost" :src="Skin">
        </div>
    </div>
</template>

<script lang="ts">

    import { defineComponent } from 'vue';
    import { PlayerAvatar } from '@/common/PlayerAvatar';

    const avatar: PlayerAvatar | null = null;

    export default defineComponent({
        props: { avatar },
        computed: {
            zIndex: function(): number { return new Set([ 4, 6, 15, 29, 39, 42, 85 ]).has(this.avatar.hatId) ? -1 : 0 },
            hasHat: function(): boolean { return this.avatar.hatId !== 0 },
            hasSkin: function(): boolean { return this.avatar.skinId !== 0 },
            Body: function() {
                const colorId: number = this.avatar.colorId;
                const state: string = this.avatar.ghost ? 'dead' : 'alive'; 
                return require(`@/assets/static/players/${state}/${colorId}.png`);
            },
            Hat: function() {
                const hatId: number = this.avatar.hatId;
                if (new Set([ 77 ]).has(hatId)) {
                    const colorId: number = this.avatar.colorId;
                    return require(`@/assets/static/hats/${hatId}/${colorId}.png`)
                } else {
                    require(`@/assets/static/hats/${hatId}.png`);
                }
            },
            Skin: function() {
                const skinId: number = this.avatar.skinId;
                return require(`@/assets/static/skins/${skinId}.png`);
            },
        }
    });

</script>

<style lang="scss" scoped>
    
	@import './src/assets/styles/variables.scss';

    .avatar-container {
        position: relative;
        width: 150px;
        height: 150px;
        outline: red solid 1px;
        padding-top: 100%;
    }

    .avatar-container img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

</style>
