<template>
    <div>{{ player.appearance }}</div>
</template>

<script lang="ts">

    import { IPlayer } from '@/common/proxy/interfaces/IPlayer';
    import { defineComponent } from 'vue';

    const player: IPlayer | null = null;

    export default defineComponent({
        props: {
            player
        },
    });

</script>

<style lang="scss" scoped>
    
	@import './src/assets/styles/variables.scss';

</style>