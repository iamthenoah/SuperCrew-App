<template>
    <div id="control-container">
        <div class="noselect">
            <section>
                <ul>
                    <ol><div class="standalone-icon"><img src="@/assets/static/icons/microphone.png"></div></ol>
                    <ol><div class="standalone-icon"><img src="@/assets/static/icons/headphones.png"></div></ol>
                    <ol><div class="standalone-icon"><img src="@/assets/static/icons/gear.png"></div></ol>
                </ul>
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

    ul {
        position: relative;
        top: 25%;
        float: right;
    }

    ol {
        margin: 0 2px;
        float: left;
    }

</style>