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
                
                const actx = new AudioContext();
                const source: AudioNode = actx.createMediaStreamSource(stream);

                const talking = (active: boolean) => {
                    console.log('talking?', active);
                    // socket.emit('talking', )
                }; 

                this.audioInput(actx, source, (active: boolean) => talking(active));

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
            audioInput(actx: AudioContext, source: AudioNode, onUpdate: (active: boolean) => void) {

                let hasHeardSound = false;
                const update = (talking: boolean) => {
                    hasHeardSound = talking;
                    onUpdate(talking);
                }
                
                const analyser = actx.createAnalyser();
                analyser.smoothingTimeConstant = 0.2;
                analyser.fftSize = 1024;

                const processor = actx.createScriptProcessor(analyser.fftSize, 1, 1);

                processor.onaudioprocess = () => {
                    const array = new Uint8Array(analyser.frequencyBinCount);
                    analyser.getByteFrequencyData(array);
                    const average = array.reduce((a, b) => a + b, 0) / array.length;
                    const talking = (average >= 50);
                    if (hasHeardSound != talking) update(talking)
                }

                source.connect(analyser);
                analyser.connect(processor);
                processor.connect(actx.destination);
            }
        }
    });

</script>

<style lang="scss" scoped>

	@import './src/assets/styles/variables.scss';

</style>