<template>
    <div class="content noselect">
        <section>
            <h4>STUFF</h4>
            <hr>
            <button @click="send()" class="btn large">Send Message</button>
            <pre>{{ object }}</pre>
        </section>
    </div>
</template>

<script lang="ts">

	import { defineComponent } from 'vue';
    const { ipcRenderer } = window.require('electron');
    import VoiceChatController from '@/common/VoiceChatController';
    
    // import { io } from 'socket.io-client';
    // const socket = io('https://supercrew.herokuapp.com/');

    export default defineComponent({
        data() {
            return {
                object: {},
            }
        },
        async mounted() {
            console.clear();

            const { input } = await ipcRenderer.invoke('get-setting', [ 'input', 'output' ]);
            const audio = { deviceId: input.deviceId };

            navigator.getUserMedia({ video: false, audio }, async stream => {
                
                console.log('SOURCE:', stream.getAudioTracks()[0].label);
                
                const audioContext = new AudioContext();
                const source: AudioNode = audioContext.createMediaStreamSource(stream);

                const vcc = new VoiceChatController(audioContext, source);
                vcc.onActive(() => console.log('talking...'));
                vcc.onInactive(() => console.log('stopped.'));

            }, err => console.error(err));

            // socket.on('connect', () => {
            //     console.log('connected to server');

            //     socket.on('received', (id, data) => {
            //         this.object = JSON.parse(data);
            //         console.log(id, data)
            //     });

            //     socket.on('talking', (id: string, stream: MediaStream) => {
            //         const a = document.createElement('audio');
            //         document.body.appendChild(a);
            //         a.srcObject = stream;
            //     });
            // });
        },
        methods: {
            send() {
                console.log('sending...')
                // socket.emit('send', 'D1', JSON.stringify({name:'this.object'}));
            },
        }
    });

</script>

<style lang="scss" scoped>

	@import './src/assets/styles/variables.scss';

</style>