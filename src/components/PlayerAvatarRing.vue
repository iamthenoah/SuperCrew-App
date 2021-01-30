<template>
    <div 
        class="ring noselect" 
        v-tooltip="'player.properties.playerName'" 
        :style="{ 'border': `solid 3px ${setRingColor()}`}"
    >
        <PlayerAvatarProfile :avatar="avatar"/>
    </div>
</template>

<script lang="ts">

    import PlayerAvatarProfile from '@/components/PlayerAvatarProfile.vue';
    import { defineComponent } from 'vue';
    import { PlayerAvatar } from '@/common/PlayerAvatar';

    const avatar: PlayerAvatar | null = null;

    export default defineComponent({
        props: {
            avatar,
            playerName: String,
            isImpostor: Boolean
        },
        components: {
            PlayerAvatarProfile
        },
        methods: {
            setRingColor: function() {
                return !this.avatar.isGhost ? (this.isImpostor ? '#ee3e3b' : '#00c452') : 'white'; 
            }
        }
    });

</script>

<style lang="scss" scoped>
    
	@import './src/assets/styles/variables.scss';

	.ring {
		position: relative;
		border-radius: 100%;
		height: 60px;
        width: 60px;
		overflow: hidden;
		object-fit: contain;
		float: left;
		margin-right: 10px;
        margin-bottom: 10px;
    }

</style>
