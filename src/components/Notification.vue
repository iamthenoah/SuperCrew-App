<template>
    <div class="noselect" :class="{ 'fade-in': show, 'fade-out': !show }">
        <div @click="closeNotification" :class="setColor" id="notification-container">
            <section>
                <p><strong>{{ message }}</strong></p>
            </section>
        </div>
    </div>
</template>

<script lang="ts">

    import { defineComponent } from 'vue';

    export default defineComponent({
        data() {
            return {
                show: true
            }
        },
        props: {
            duration: {
                type: Number,
                default: 0
            },
            message: {
                type: String,
                default: ""
            },
            messageType: {
                type: String,
                default: "error"
            },
            persistent: {
                type: Boolean,
                default: true
            }
        },
        created() {
            if (this.$props.duration > 0) {
                setTimeout(() => {
                    this.closeNotification();
                }, this.$props.duration);            
            }
        },
        computed: {
            setColor: function(): string {
                return ['success', 'warning', 'error'].indexOf(this.$props.messageType) > -1 ? this.$props.messageType : 'error';
            }
        },
        methods: {
            closeNotification: function() {
                this.show = false;
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
        bottom: 0;
        left: 0;
        height: auto;
        max-height: 50px;
        color: white;
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