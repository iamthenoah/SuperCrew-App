<template>
    <div class="noselect" :class="{ 'fade-in': show, 'fade-out': !show }">
        <div @click="emitCloseNotification()" :class="setColor" id="notification-container">
            <p><strong>{{ message }}</strong></p>
        </div>
    </div>
</template>

<script lang="ts">

    import { defineComponent } from 'vue';

    export default defineComponent({
        emits: ['onNotificationClosed'],
        data() {
            return {
                show: true,
            }
        },
        props: {
            message: String,
            type: String,
            duration: Number,
        },
        mounted() {
            setTimeout(() => {
                if (this.show) this.emitCloseNotification();
            }, Math.max(this.duration as number, 3000));
        },
        computed: {
            setColor: function(): string {
                if (this.type) return ['success', 'warning', 'error'].indexOf(this.type) > -1 ? this.type : 'error';
                else return 'error';
            },
        },
        methods: {
            emitCloseNotification: function() {
                this.show = false;
                setTimeout(() => this.$emit('onNotificationClosed'), 250);
            }
        },
    });

</script>

<style lang="scss" scoped>

	@import './src/assets/styles/variables.scss';

    #notification-container {
        cursor: pointer;
        position: absolute;
        font-size: 12px;
        width: 100%;
        bottom: 50px;
        left: 0;
        height: auto;
        max-height: 50px;
        color: white;
    }

    p {
        margin: 5px 10px;
    }

    .error {
        background: $red;
    }

    .success {
        background: $green;
    }

    .warning {
        background: $orange;
    }

    .fade-out {
        animation: fade-out ease-in-out 250ms forwards; 
    }

    .fade-in {
        animation: fade-in ease-in-out 250ms forwards;
    }

    @keyframes fade-out {
        0% {
            position: absolute;
            bottom: 0;
            width: 100%;
        }
        100% {
            position: absolute;
            bottom: -50px;
            width: 100%;
        }
    }

    @keyframes fade-in {
        0% {
            position: absolute;
            bottom: -50px;
            width: 100%;
        }
        100% {
            position: absolute;
            bottom: 0;
            width: 100%;
        }
    }

</style>