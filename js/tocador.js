let timer;

var audioContext;

var audioCtx;


audioContext = new AudioContext();
function tocadorStart(){  
  setNote(0.5);   
  timer = setInterval( () => nota(), getFig());    
}

function getNota(){
    return sessionStorage.getItem('notaTap');
}

function setNote(oitava){
    sessionStorage.setItem('notaTap',notas["A"]*oitava);
}

function play(duracao){
    setTimeout( () => nota(), duracao);
}

function nota(){
    playNote(getNota(),'triangle');      
}

function playNote(frequency, type) {
    if (audioContext) {
        const now = audioContext.currentTime;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        
        oscillator.type = type;
        oscillator.frequency.value = frequency;

        gainNode.gain.setValueAtTime(0.1, now); // Início suave
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1); // Decaimento

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start(now);
        oscillator.stop(now + 1); // Duração de 1 segundo
    }
}

function playSequence(){
    let v = getDataJSON('velo');    
    let n = getDataJSON('notas');
}

function setVelo(){

    let vel =  getDataJSON('velo');
    let obj = vel ? vel : [];
    obj[slotId] = this.value;
   // console.log(obj);
   // document.getElementById(slotId).setAttribute('velo',slotId);    
    setDataJSON('velo',obj);
    salvaLocal();

}

function playChord(notas,velo){

    //mode - simultaneo ou dedilhado
       if(getDataJSON(notas)){
        let cont = 1;
        //itera notas guardadas no array
        getDataJSON(notas).forEach(element => {           
           let nota = document.getElementById(element).children[0];      
                 
           //playNote(nota.id,'sine');
           setTimeout( function(){
               if(cont==1){
                   velo = 1;
               }
               //toca nota
               playNote(nota.id,'triangle')
                //marca visualmente
                let corda= nota.parentElement.id[2];

                //console.log(document.getElementById(corda).classList.add('act'))

                nota.classList.remove('off')
                nota.classList.add('on')},   
            velo * cont 
            );    
           cont++;
        });
    }
}

function playTriade(tonica,modo){
            

    console.log(this)

    let seg = (tonica)*(constante)*(constante);
    let terca = (seg)*(constante)*(constante);
    let quinta = terca*constante*constante*constante;
    let oitava = tonica*2;

    playNote(tonica,'triangle');
    
    document.querySelector('#'+terca.toFixed(0)).classList.add('on');
    document.querySelector('#'+quinta.toFixed(0)).classList.add('on');
    document.querySelector('#'+oitava.toFixed(0)).classList.add('on');
    
    //console.log(terca)

    setTimeout( ()=>{playNote(terca.toFixed(0),'triangle')},100);
    setTimeout( ()=>{playNote(quinta.toFixed(0),'triangle')},200);            
    setTimeout( ()=>{playNote(oitava.toFixed(0),'triangle')},300);
    setTimeout( ()=>{playNote((terca*2).toFixed(0),'triangle')},400);
}


function getMG(){

    let T = ["T",2];
  let st = ["ST",1];


    return  mG = 
    {
        jonio:[T,T,st,T,T,T,st],
        dorico:[T,st,T,T,T,st,T],
        frigio:[st,T,T,T,st,T,T], 
        lidio:[T,T,T,st,T,T,st],
    mixolidio:[T,T,st,T,T,st,T],
        eolio:[T,st,T,T,st,T,T],
        locrio:[st,T,T,st,T,T,T]
    };  
}

function getInterval(obj,ch){

    let str = obj.parentElement.id;
    
    let casa = str.split(':')[0];
    let corda = str.split(':')[1];

    //pestana
    let ini = parseInt(casa);
    let fim = parseInt(casa) + 3
    
    /*caged
    let ini = parseInt(casa);
    let fim = parseInt(casa) + 3
    */

    let intervalo = [];

    for (let index = ini; index < fim; index++){
        //considerando corda Mi
        let int = corda == 'A' ? ['A','D','G','B','e']:['E','A','D','G','B','e'];  
        
        //cria array de notas do intervalo
        int.forEach(element => {
            
           let id = index +':'+ element;
           let div = document.getElementById(id);
           let btn = div.children[0];

           intervalo.push(btn);
           btn.classList.add('set')
        });
    }

    //se modo for triada elimina ultima posicao do array
    let typeChord = document.getElementById('typeChord');

   //console.log(ch)
        
   switch (typeChord.value) {
    case '1':   // oitava
        ch.splice(1,3);
        break;
    case '2': // power chord
        ch.splice(1,1);
        ch.splice(2,1);
        break;
    case '3': // triade
         ch.splice(3,1);
        break;
    case '4': // tetrade
        //pega a segunda oitava da tonica e remove do intervalo
        break;
    default:
        break;
   }
   
    resetClass('on');
    resetClass('set');

    let tonica = obj.innerText;

    let ntsLabel = [];
    let oitavas = [];

    //console.log(oitavas)

    let cont = 0;
    intervalo.forEach(element => {
        element.classList.add('set')
       // console.log(element.innerText);
       ntsLabel.push(element.innerText);
        if(ch.includes(element.innerText)){
            element.classList.add('on');
              if(ntsLabel.includes(element.innerText)){
                   if(element.innerText == tonica){
                    oitavas.push(element.id);
                    cont++;
                   }
                }
            //marca acorde
            element.classList.add('on')
        }
    });
    


    //removendo oitava de tetrade
    if(typeChord.value == 4){
        //console.log(oitavas.sort((a, b) => a - b));
        document.getElementById(oitavas.sort((a, b) => a - b)[1]).classList.remove('on');
    }
    
    obj.classList = 'nota on';

    return ('intervalo de: '+ (casa) + ' até ' +[parseInt(casa) + 3])
}