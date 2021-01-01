<template>
    <div id="control-container">
        <div class="noselect">
            <section>
                <p>Tha00ber</p>
                <router-link to="/preferences">
                    <div class="standalone-icon"><img src="@/assets/static/icons/gear.png"></div>
                </router-link>
                <div class="standalone-icon"><img src="@/assets/static/icons/headphones.png"></div>
                <div class="standalone-icon"><img src="@/assets/static/icons/microphone.png"></div>
            </section>
        </div>
    </div>
</template>
<script lang="ts">

    import { defineComponent } from 'vue';

    export default defineComponent({

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

</style>