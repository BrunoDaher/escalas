import { Efeitos } from './efeitos.js';


export class Tocador {


    constructor() {

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

    playNote(frequency, type) {
        if (this.audioContext) {
            const now = this.audioContext.currentTime;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            let eq = this.efeitos.equalizer();

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

    playSequence() {
       // let v = getDataJSON('velo');
        //let n = getDataJSON('notas');
    }


    playChord(notas, velo, arrayNotas) {

       
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

    getInterval(obj, ch) {
        let str = obj.parentElement.id;
        let casa = str.split(':')[0];
        let corda = str.split(':')[1];
        let ini = parseInt(casa);
        let fim = parseInt(casa) + 3;
        let intervalo = [];

        for (let index = ini; index < fim; index++) {
            let int = corda == 'A' ? ['A', 'D', 'G', 'B', 'e'] : ['E', 'A', 'D', 'G', 'B', 'e'];
            int.forEach(element => {
                let id = index + ':' + element;
                let div = document.getElementById(id);
                let btn = div.children[0];
                intervalo.push(btn);
                btn.classList.add('set');
            });
        }

        let typeChord = document.getElementById('typeChord');
        switch (typeChord.value) {
            case '1':
                ch.splice(1, 3);
                break;
            case '2':
                ch.splice(1, 1);
                ch.splice(2, 1);
                break;
            case '3':
                ch.splice(3, 1);
                break;
            case '4':
                break;
            default:
                break;
        }

        resetClass('on');
        resetClass('set');

        let tonica = obj.innerText;
        let ntsLabel = [];
        let oitavas = [];
        let cont = 0;
        intervalo.forEach(element => {
            element.classList.add('set');
            ntsLabel.push(element.innerText);
            if (ch.includes(element.innerText)) {
                element.classList.add('on');
                if (ntsLabel.includes(element.innerText)) {
                    if (element.innerText == tonica) {
                        oitavas.push(element.id);
                        cont++;
                    }
                }
                element.classList.add('on');
            }
        });

        if (typeChord.value == 4) {
            document.getElementById(oitavas.sort((a, b) => a - b)[1]).classList.remove('on');
        }

        obj.classList = 'nota on';
        return ('intervalo de: ' + (casa) + ' até ' + [parseInt(casa) + 3]);
    }

    // Placeholder for getFig, getDataJSON, setDataJSON, salvaLocal, resetClass, equalizer, this.efeitos.conectChorus, this.efeitos.conectReverb, this.efeitos.conectDelay, notas, slotId
    // These should be implemented or imported elsewhere in your codebase.
}
