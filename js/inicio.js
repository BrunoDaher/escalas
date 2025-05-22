
const notas = ['E','F','F#','G','G#','A','A#','B','C','C#','D','D#'];    

let editMode = false;

let chordEditStatus = false;

let email = document.querySelector('#email');
let password = document.querySelector('#senha');

let slotId = 'notas';
let isCleanMode = false;

let freq = { 'E':82.407,'A':110.00,'D':146.83,'G':195.99,'B':246.93,'e':329.63}


let nCordas = ['borda','e','B','G','D','A','E'];

let modus = 'guitar';

if(modus == 'bass'){
  nCordas = ['borda','G','D','A','E'];
}

let constante = 1.05946096812164;
//constante = 1.122464407206753;        
 constante = 1.059;        

window.onload = triggers;


function start() {
  document.getElementById('paineis').classList = 'showOff';
  document.getElementById('paineis').classList.remove('showOff');
  document.querySelector('#logtools').classList = 'showOff'
  document.querySelector('main').classList.remove('showOff');
  document.querySelector('#logoff').classList.remove('showOff');

    setTimeout(()=>{
      audioContext = new AudioContext();
        
     if(document.getElementById(1)){
        //loadSlot();
        document.getElementById(1).click()
     }else{
        loadSlot();
        //ocument.getElementById(1).click()
     }        
    },100);
  }

  function triggers(){
//triggers

    document.getElementById('editMode').onclick = fnEditMode;
    document.querySelector('#playChord').onclick = playChord;   
    document.querySelector('#cleanMode').onclick = cleanMode;
    document.querySelector('#addMem').onclick = createSlot;
    document.querySelector('#removeMem').onclick = removeSlot;
    document.querySelector('#velo').onchange = setVelo;
    document.querySelector('#playSeq').onclick = playSequence;
    document.querySelector('#chroma').onclick = chroma;
   // document.querySelector('#chordEdit').onclick = chordEdit;
    //document.querySelector('#ch').onchange = getTetrade;

    //password.onchange = log;
    //document.querySelector('#logoff').onclick = logoff;
    //  document.querySelector('#logon').onclick = log;
    // document.querySelector('#bracoInc').onclick = setBracoPos;
    document.querySelector('#reset').onclick = resetClean;
    //teste
    document.querySelector('#export').onclick = exportData;
    document.querySelector('#load').onclick = preload;
    document.querySelector('#favorite').onclick = favorite;
    // document.querySelector('#arquivo').onclick = arquivo;
    document.querySelector('#dataLoad').onchange = upload;
    //document.getElementById('clearSession').onclick = clearSession;
   //document.querySelector('#nomeSlot').onchange = setSlotName;    
    
    // colocar condicao

    //carregamentos
        storageRead();
  
    montaBraco();
    loadSlot();

};    

function showSlotName(name){
  //console.log(name)
    document.getElementById('labelNomeSlot').innerText = name;
}

function createSlot(){
  addSlot('note',null)
}