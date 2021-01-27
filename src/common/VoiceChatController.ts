export default class VoiceChatController {
    
    private hasCapturedSound: boolean;
    
    private analyser: AnalyserNode;
    private processor: ScriptProcessorNode;

    private onUpdate: (talking: boolean) => void;
    private onVoiceActive: () => void;
    private onVoiceInactive: () => void;

    constructor(context: AudioContext, source: AudioNode) {    
        this.hasCapturedSound = false;
        this.onUpdate = () => { /* ... */ };
        this.onVoiceActive = () => { /* ... */ };
        this.onVoiceInactive = () => { /* ... */ };

        this.analyser = context.createAnalyser();
        this.analyser.smoothingTimeConstant = 0.2;
        this.analyser.fftSize = 1024;
        
        this.processor = context.createScriptProcessor(this.analyser.fftSize, 1, 1);

        this.processor.onaudioprocess = () => {
            const fbc = new Uint8Array(this.analyser.frequencyBinCount);
            this.analyser.getByteFrequencyData(fbc);
            const average = fbc.reduce((a, b) => a + b, 0) / fbc.length;
            const talking = (average >= 50);
            if (this.hasCapturedSound != talking) {
                this.hasCapturedSound = talking;
                this.onUpdate(talking);
                talking ? this.onVoiceActive() : this.onVoiceInactive();
            }
        }
        
        source.connect(this.analyser);
        this.analyser.connect(this.processor);
        this.processor.connect(context.destination);
    }

    public onActive(cb: () => void) {
        this.onVoiceActive = cb;
    }

    public onInactive(cb: () => void) {
        this.onVoiceInactive = cb;
    }
    
    public onVoiceUpdate(cb: (active: boolean) => void) {
        this.onUpdate = cb;
    } 
}