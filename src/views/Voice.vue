<template>
    <div class="content noselect">
        <section>
            <h4>STUFF</h4>
            <hr>
            <pre>{{ object }}</pre>
        </section>
    </div>
</template>

<script lang="ts">

	import { defineComponent } from 'vue';
    const { ipcRenderer } = window.require('electron');
    
    import { io } from 'socket.io-client';
    const socket = io('http://192.168.0.27:3000/');

    export default defineComponent({
        data() {
            return {
                object: {}
            }
        },
        async mounted() {
            console.clear();

            const { input, output } = await ipcRenderer.invoke('get-setting', [ 'input', 'output' ]);
            const audio = { deviceId: input.deviceId }

            navigator.getUserMedia({ video: false, audio }, async (stream) => {

                console.log('SOURCE:', stream.getAudioTracks()[0].label);

                const actx = new AudioContext();
                const source = actx.createMediaStreamSource(stream);
                
                const analyser = actx.createAnalyser();
            	analyser.smoothingTimeConstant = 0.2;
            	analyser.fftSize = 1024;

            	const channels = 2;
                const spn = actx.createScriptProcessor(1024, channels, channels);
    
                source.connect(analyser);
		        analyser.connect(spn); 
                spn.connect(actx.destination);

                socket.on('connect', () => {
                    console.log('connected to server');

                    socket.on('received', (id, data) => console.log(id, data));
                    socket.emit('send', 'D1', JSON.stringify(source));
                });

            }, err => console.error(err));
        }
    });

</script>

<style lang="scss" scoped>

	@import './src/assets/styles/variables.scss';

</style>