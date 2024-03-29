<template>
    <div class="noselect">
        <div class="avatar-container noselect">
            <img class="body" :src="Body">
            <img class="hat" v-if="hasHat && !avatar.ghost" :style="{ 'z-index': zIndex, 'opacity': HatOpacity }" :src="Hat">
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
            zIndex: function(): number { return new Set([ 4, 6, 15, 29, 39, 42, 75, 85 ]).has(this.avatar.hatId) ? -1 : 0 },
            hasHat: function(): boolean { return this.avatar.hatId !== 0 },
            hasSkin: function(): boolean { return this.avatar.skinId !== 0 },
            Body: function(): NodeRequire {
                const colorId: number = this.avatar.colorId;
                const state: string = this.avatar.isGhost ? 'dead' : 'alive';
                return require(`@/assets/static/game/players/${state}/${colorId}.png`);
            },
            Hat: function(): NodeRequire {
                if (this.hasHat) {
                    const hatId: number = this.avatar.hatId;
                    if (hatId === 77 || hatId === 90) {
                        const colorId: number = this.avatar.colorId;
                        return require(`@/assets/static/game/hats/${hatId}/${colorId}.png`)
                    }
                    return require(`@/assets/static/game/hats/${hatId}.png`);
                }
                return null as unknown as NodeRequire;
            },
            Skin: function(): NodeRequire {
                if (this.hasSkin && !this.avatar.isGhost) {
                    const skinId: number = this.avatar.skinId;
                    return require(`@/assets/static/game/skins/${skinId}.png`);
                }
                return null as unknown as NodeRequire;
            },
            HatOpacity: function(): number {
                return this.avatar.isGhost ? 0.5 : 1; 
            }
        }
    });

</script>

<style lang="scss" scoped>
    
	@import './src/assets/styles/variables.scss';

    .avatar-container {
        position: absolute;
        top: 50%;
        transform: translateY(-45%);
        width: 100%;
        height: 150%;
        pointer-events: none;
    }

    .avatar-container img {
        position: absolute;
        object-fit: contain;
        width: 100%;
        height: 100%;
    }

</style>
