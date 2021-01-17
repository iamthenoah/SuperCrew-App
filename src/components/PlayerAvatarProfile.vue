<template>
    <div class="noselect">
        <div class="avatar-container noselect">
            <img class="body" :src="Body">
            <img class="hat" v-if="hasHat && !avatar.ghost" :style="{ 'z-index': zIndex }" :src="Hat">
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
            Body: function(): NodeRequire {
                const colorId: number = this.avatar.colorId;
                const state: string = this.avatar.isGhost ? 'dead' : 'alive';
                return require(`@/assets/static/players/${state}/${colorId}.png`);
            },
            Hat: function(): NodeRequire {
                if (this.hasHat && !this.avatar.isGhost) {
                    const hatId: number = this.avatar.hatId;
                    if (new Set([ 77 ]).has(hatId)) {
                        const colorId: number = this.avatar.colorId;
                        return require(`@/assets/static/hats/${hatId}/${colorId}.png`)
                    }
                    return require(`@/assets/static/hats/${hatId}.png`);
                }
                return null as unknown as NodeRequire;
            },
            Skin: function(): NodeRequire {
                if (this.hasSkin && !this.avatar.isGhost) {
                    const skinId: number = this.avatar.skinId;
                    return require(`@/assets/static/skins/${skinId}.png`);
                }
                return null as unknown as NodeRequire;
            },
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
