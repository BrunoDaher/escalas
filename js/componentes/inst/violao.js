
import { Tocador } from "./tocador.js";   
import { Dao } from  '../../acesso/dao.js'
import { Aux } from '../../util/aux.js'


const aux = new Aux();
const dao = new Dao();


export class Violao {
    
    constructor() {

        //console.log('instanciando violao')
        
        
        this.tocador = new Tocador();
        this.editMode = false;
        this.chordEditStatus = false;
        this.slotId = 1;
        this.isCleanMode = false;
        this.notas = ['E','F','F#','G','G#','A','A#','B','C','C#','D','D#'];
        this.freq = { 'E':82.407,'A':110.00,'D':146.83,'G':195.99,'B':246.93,'e':329.63 };
        this.nCordas = ['borda', ...Object.keys(this.freq).reverse()];
        this.modus = 'guitar';
        if(this.modus == 'bass'){
            this.nCordas = ['borda','G','D','A','E'];
        }
        this.constante = 1.059;

       
    }


    init(){
         this.montaBraco();

        this.trigger();
    }

      
   //event trigger 
    trigger(){
         document.addEventListener('clean-request', (event) => {
           let btn = event.detail;
           this.cleanMode(btn);
        });
    }
    
    getTocador(){
        return this.tocador;
    }

    getSlotId(){
        return this.slotId;
    }

    reset() {
        let classNotas = document.querySelectorAll('.nota');
        classNotas.forEach(nota => {
            let classes = Object.values(nota.classList);
            nota.classList.remove('on');
            if(!this.isCleanMode && !classes.includes('cordaSolta')) {
                nota.classList.add('off');
            }
        });
    }

    chroma(btn) {
        btn.classList.toggle('active');
        aux.getById('braco').classList.toggle('chroma');
        
    }

    resetClean() {
        let notas = document.querySelectorAll(".nota");
        notas.forEach(element => {
            if(element.classList.contains("on")){
                element.classList.add("off");
            }
        });
    }
    
    getChord(btn) {

        btn =  btn.srcElement;
        this.reset();
        this.slotId = btn.id;
        let slots = document.querySelectorAll('.slot');

        aux.getById('labelNomeSlot').innerText = btn.name;
        
        this.arrayRemoveClass(slots,'on');
        btn.classList.add('on');

        if (this.isStored(btn.id)){
            this.reset();
            
            let vel = dao.getDataJSON('velo')[btn.id];
            aux.getById('velo').value = vel;

            this.editMode = aux.getById('editMode').checked;
          
            if(this.editMode){
             
                this.tocador.playChord(btn.id,vel, dao.getDataJSON(btn.id));
            }
        }
    }

    isStored(id) {
        return sessionStorage.getItem(id) ? true : false;
    }

    montaBraco() {
        aux.getById('braco').innerHTML ='';

        if(aux.infoNavegador.mobile && aux.infoNavegador.landscape){
             aux.getById('braco').classList.add('mobile');
        }

        this.nCordas.forEach(ncorda => {
            aux.getById('braco').append(this.braco(ncorda));
        });
    }

    braco(ncorda) {
        
        let corda = document.createElement('div');
        corda.classList.add('corda');
        corda.id = ncorda;
        let oitavas = this.getOitava(ncorda);
        let casa = 1;
        let marcas = [3,5,7,9,15,17,19];
        let dupla = ['13:A','13:e'];
        if(this.modus=='bass'){
            dupla = ['13:A','13:G'];
        }
        Object.values(oitavas).forEach(oitava => {
            let cel = document.createElement('div');
            let btn = document.createElement('button');
            corda.id = ncorda;
            cel.id = casa + ':' + ncorda;
            let stringMarca = this.modus=='bass'?'D':'G';
            if(marcas.includes(casa-1)){
                if(corda.id==stringMarca){
                    cel.classList.add('marca');
                }
            }
            if(dupla.includes(cel.id)){
                cel.classList.add('marca');
            }

            btn.id = oitava.freq.toFixed(2);
            btn.append(oitava.tom);
            btn.onclick = () => {
                this.tocador.playNote(btn.id,'square');
                btn.classList.toggle('on');
                if(Object.values(btn.classList).includes('off')){
                    btn.classList.toggle('off');
                }
                dao.toggleArray(this.slotId,cel.id);
            }; 

            console.log(ncorda)
            //if(btn.id.contains('borda')){
            btn.classList.add('nota');
            //}


            

            if(casa >0 && ncorda!=='borda'){
                cel.append(btn);
            }
            if(casa==1){
                cel.classList.add('capo');
                btn.classList.add('cordaSolta');
            }
        
            corda.append(cel);
            casa++;
        });
        return corda;
    }

    getOitava(corda) {
        let pos = this.notas.indexOf(corda.toUpperCase());
        let escala = [];
        let curFreq = this.freq[corda];
        let _notas = this.notas.concat(this.notas);
        for (let x = 1; x < _notas.length; x++) {
            let tom = _notas[pos];
            if(corda!='borda'){
                escala[tom + curFreq.toFixed(2)] = {'freq':curFreq,corda:corda, tom:tom, casa:x};
            }
            else{
                escala['mTop' + x] = ({'freq':0,corda:corda, tom:'', casa:x})
            }
            pos = pos + 1 == 24 ? 0: pos + 1;
            curFreq = (curFreq * this.constante);
        }

       // console.log(escala)
        return escala;
    }

    cleanMode(btn) {
        btn.classList.toggle('active');
        let notas = document.querySelectorAll('.nota');
        if(!this.isCleanMode) {
           aux.arrayRemoveClass(notas,'off');
        } else {
            notas.forEach(nota => {
                let classes = Object.values(nota.classList);
                if(!classes.includes('on') && !classes.includes('cordaSolta')) {
                    nota.classList.toggle('off');
                }
            });
        }
        this.isCleanMode = !this.isCleanMode;
    }

    arrayRemoveClass(array, classe) {
        array.forEach(elem => {
            elem.classList.remove(classe);
        });
    }

    chordEdit(btn) {

        console.log('editando acorde')
        btn.classList.toggle('on');
        this.chordEditStatus = !this.chordEditStatus;
    }
}
