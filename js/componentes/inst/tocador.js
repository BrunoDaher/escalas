import { Efeitos } from './efeitos.js';


export class Tocador {


    constructor() {
        console.log('novo contexto')
        this.notas = ['E','F','F#','G','G#','A','A#','B','C','C#','D','D#'];

        this.timer = null;
        this.audioContext = new AudioContext();
        this.sustain = 0.01;

        this.efeitos = new Efeitos(this.audioContext);
    }

    tocadorStart() {
        this.setNote(0.5);
       // this.timer = setInterval(() => this.nota(), this.getFig());
    }

    getNota() {
        return sessionStorage.getItem('notaTap');
    }

    setNote(oitava) {
        sessionStorage.setItem('notaTap', this.notas["A"] * oitava);
    }

    play(duracao) {
        setTimeout(() => this.nota(), duracao);
    }

    nota() {
        this.playNote(this.getNota(), 'triangle');
    }

    fx(event) {
        let el = event.srcElement;
        if (el.getAttribute('value') == 'true') {
            el.setAttribute('value', false);
        } else {
            el.setAttribute('value', true);
        }
        el.classList.toggle('active');
    }
  
    playSequence() {
       // let v = getDataJSON('velo');
        //let n = getDataJSON('notas');
    }

    async playChord(notas, velo, arrayNotas) {

        if(arrayNotas){
            let cont = 1;
            arrayNotas.forEach(element => {           
            
                let nota = document.getElementById(element).children[0];      
                
                setTimeout(()=>{
                    if(cont==1){
                        velo = 1;
                    }

                    this.playNote(nota.id,'square')
            
                    let corda = document.getElementById(nota.parentElement.parentElement.id);
                    corda.classList.add('playing')

                    setTimeout(() => {
                        corda.classList.remove('playing');
                    }, 150);


                    nota.classList.remove('off')
                    nota.classList.add('on')},   
                velo * cont 
                );    
                cont++;
            });
        }
    
    }

    playNote(frequency, type) {

        if (this.audioContext.state) {
            const now = this.audioContext.currentTime;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            let eq = this.efeitos.equalizer(this.audioContext);

            let btnChorus = document.getElementById('chorus');
            let btnReverb = document.getElementById('reverb');
            let btnDelay = document.getElementById('delay');

            if (btnChorus.getAttribute('value') == 'true') {
                this.efeitos.conectChorus( type, frequency, now, eq);
            }
            if (btnReverb.getAttribute('value') == 'true') {
              //  console.log(this.audioContext)
                this.efeitos.conectReverb( type, frequency, now, eq);
            }
            if (btnDelay.getAttribute('value') == 'true') {
                this.efeitos.conectDelay( type, frequency, now, eq);
            }

            oscillator.type = type;
            oscillator.frequency.value = frequency;

            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(this.sustain, now + 1.5);

            oscillator.connect(gainNode);
            gainNode.connect(eq.low);
            eq.low.connect(eq.mid);
            eq.mid.connect(eq.high);
            eq.high.connect(this.audioContext.destination);

            oscillator.start(now);
            oscillator.stop(now + 1);
        }
        else{
            console.log('noPlay')
        }
    }

}
