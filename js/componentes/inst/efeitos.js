export class Efeitos {
    constructor(audioContext) {
        this.audioContext = audioContext;
    }

    resetContext(){
        
    }

    equalizer(context) {
    
        this.audioContext = context;

        const low = this.audioContext.createBiquadFilter();
        low.type = 'lowshelf';
        low.frequency.value = 120;
        low.Q.value = 1;
        low.gain.value = 15;

        const mid = this.audioContext.createBiquadFilter();
        mid.type = 'peaking';
        mid.frequency.value = 1000;
        mid.Q.value = 2;
        mid.gain.value = -40;

        const high = this.audioContext.createBiquadFilter();
        high.type = 'highshelf';
        high.frequency.value = 2200;
        high.Q.value = 1;
        high.gain.value = -10;

        return { low, mid, high };
    }

    conectChorus(type, frequency, now, eq) {
      
        const chorusOsc = this.audioContext.createOscillator();
        chorusOsc.type = type;
        chorusOsc.frequency.value = frequency * 0.99;
        chorusOsc.detune.value = 0.1;

        const chorusGain = this.audioContext.createGain();
        chorusGain.gain.setValueAtTime(0.01, now);

        chorusOsc.connect(chorusGain);
        chorusGain.connect(eq.high);
       

        chorusOsc.start(now);
        chorusGain.gain.linearRampToValueAtTime(0, now + 0.6);
        chorusOsc.stop(now + 0.6);
    }

    conectComp(type, frequency, now, eq) {
     
        const compressor = this.audioContext.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-30, now);
        compressor.knee.setValueAtTime(20, now);
        compressor.ratio.setValueAtTime(4, now);
        compressor.attack.setValueAtTime(0.01, now);
        compressor.release.setValueAtTime(0.2, now);

        const compOsc = this.audioContext.createOscillator();
        compOsc.type = type;
        compOsc.frequency.value = frequency;
        compOsc.detune.value = 0;

        const compGain = this.audioContext.createGain();
        compGain.gain.setValueAtTime(0.03, now);

        compOsc.connect(compGain);
        compGain.connect(compressor);
        compressor.connect(eq.high);

        compOsc.start(now);
        compGain.gain.linearRampToValueAtTime(0, now + 1);
        compOsc.stop(now + 1);
    }

    conectReverb(type, frequency, now, eq) {

        const convolver = this.audioContext.createConvolver();
        const rate = this.audioContext.sampleRate;
        const length = rate * 2.5;
        const impulse = this.audioContext.createBuffer(2, length, rate);
        for (let i = 0; i < 2; i++) {
            let channel = impulse.getChannelData(i);
            for (let j = 0; j < length; j++) {
                channel[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / length, 2.5);
            }
        }
        convolver.buffer = impulse;

        const reverbOsc = this.audioContext.createOscillator();
        reverbOsc.type = type;
        reverbOsc.frequency.value = frequency;
        reverbOsc.detune.value = 0;

        const reverbGain = this.audioContext.createGain();
        reverbGain.gain.setValueAtTime(0.2, now);

        reverbOsc.connect(reverbGain);
        reverbGain.connect(convolver);
        convolver.connect(eq.mid);
        convolver.connect(eq.low);

        reverbOsc.start(now);
        reverbGain.gain.linearRampToValueAtTime(0, now + 0.5);
        reverbOsc.stop(now + 0.5);
    }

    conectDelay(type, frequency, now, eq) {
      
        const delayNode = this.audioContext.createDelay();
        delayNode.delayTime.setValueAtTime(0.85, now);

        const feedbackGain = this.audioContext.createGain();
        feedbackGain.gain.setValueAtTime(0.95, now);

        const delayGain = this.audioContext.createGain();
        delayGain.gain.setValueAtTime(0.03, now);

        const delayOsc = this.audioContext.createOscillator();
        delayOsc.type = type;
        delayOsc.frequency.value = frequency;
        delayOsc.detune.value = 0;

        delayOsc.connect(delayGain);
        delayGain.connect(delayNode);
        //delayNode.connect(feedbackGain);
        feedbackGain.connect(delayNode);
        delayNode.connect(eq.low);

        delayOsc.start(now);
        delayOsc.stop(now + 0.250);
    }
}
