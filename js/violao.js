

function fnEditMode(){
    this.classList.toggle('recOn');
    read(editMode);
    editMode = !editMode;
}

//----BRACO------
function reset(){            
    let notas = document.querySelectorAll('.nota');                
        notas.forEach(nota => {
            let classes = Object.values(nota.classList);               
                      nota.classList.remove('on')                      
                      if(!isCleanMode && !classes.includes('cordaSolta'))
                          {
                            nota.classList.add('off');                          
                          }                   
        });
}

//BRACO
function chroma(){
    this.classList.toggle('active');
    document.getElementById('braco').classList.toggle('chroma')
}

//BRACO
function resetClean(){
let notas = document.querySelectorAll(".nota");


    notas.forEach(element => {
        if(element.classList.contains("on")){
            //element.click();
            element.classList.add("off")
        } 
    });
}
        
//BRACO
function getChord(){
    //limpa o braço
    reset()

   
    //monta o acorde
    slotId = this.id;
    let slots = document.querySelectorAll('.slot');

   // console.log(this)

    //this.name = document.getElementById('nomeSlot').value;
    showSlotName(this.name)
   
   //seleção de item de menu
   //oculta os do grupo e marca o corrente
    arrayRemoveClass(slots,'recOn')
    this.classList.add('recOn');
    
    //pra caso seja executado antes q a definição do Slot
    if (isStored(this.id)){
        reset();
        
       // console.log(this.value)

        let vel = getDataJSON('velo')[this.id];
        document.getElementById('velo').value = vel;
        if(!editMode){
        playChord(this.id,vel);
        }
    }

}

//BRACO
function montaBraco(){
    document.querySelector('#braco').innerHTML ='';    
    nCordas.forEach(ncorda => {                               
            document.querySelector('#braco').append(braco(ncorda));                    
        });   
}
//BRACO
let braco = function (ncorda){

    let corda = document.createElement('div');             

    corda.classList.add('corda');
    corda.id = ncorda;

    //pega oitava
    let oitavas = getOitava(ncorda);
    
    //itera oitava duplicada
    let casa = 1;

    //bolinhas de harmonico
    let marcas = [3,5,7,9,15,17,19];    
    let dupla = ['13:A','13:B']         
    
    if(modus=='bass'){
        dupla = ['13:A','13:G'];
    }

    Object.values(oitavas).forEach(oitava => {
        
        let cel = document.createElement('div');              
        let btn = document.createElement('button'); 
        
        //id do container da nota
        cel.id = casa + ':' + ncorda;

        let stringMarca = modus=='bass'?'D':'G';

       // console.log(cel.id)        
        //colocando marcação no braço
            if(marcas.includes(casa-1)){                                                                    
                if(corda.id==stringMarca){
                    cel.classList.add('marca');    
                }
            }
            
            if(dupla.includes(cel.id)){
                //cel.classList.add('marca');    
                cel.classList.add('marca');    
            }

        btn.id = oitava.freq.toFixed(2);
        btn.append(oitava.tom);
        
        //playNote
        btn.onclick = function (){  
            //toca nota single
            playNote(this.id,'triangle');     
            
            chordBuild(this);
            
            let celCont = this.parentNode.id;                    
            this.classList.toggle('on')
            
            if(Object.values(this.classList).includes('off')){
                this.classList.toggle('off')
            }
            
            //aciona o Dao
            toggleArray(slotId,celCont);
        }
        
        btn.classList.add('nota');
        //btn.classList.add('off');
        
        //borda superior
        if(ncorda != 'borda' || casa >1){
            cel.append(btn);    
        }

        if(casa==1){
            cel.classList.add('capo');
            btn.classList.add('cordaSolta')
        }

        corda.append(cel);                 
        casa++;
    });
                
    //oitavas = oitavas.concat(oitavas);            
    return corda;
}    

//BRACO
function getOitava(corda){
    let pos = notas.indexOf(corda.toUpperCase());
    let escala = [];
    //freq que vem do inicio.js
    let curFreq = freq[corda];

    let _notas = notas.concat(notas);
    
    for (let x = 1; x < _notas.length; x++) {                
        let tom =   _notas[pos];

        //monta indice
        if(corda!='borda'){
        //indexa cada tom
            escala[tom + curFreq] = {'freq':curFreq,corda:corda, tom:tom, casa:x};               
        }
        // console.log(notas[pos] + ":" + x + "->" + curnote + "-" + pos+1)
        pos = pos + 1 == 24 ? 0: pos + 1;
        
        //calcula proxima frequencia
        curFreq = (curFreq * constante);     
    }
    
    // retorna um array com as notas
    return escala;
}
            
//BRACO
function cleanMode(){
    
    this.classList.toggle('active')

    let notas = document.querySelectorAll('.nota');

    if(!isCleanMode)
    {
        arrayRemoveClass(notas,'off');
    }
    else 
    { 
        notas.forEach(nota => {
        let classes = Object.values(nota.classList);
        if(!classes.includes('on') && !classes.includes('cordaSolta'))
            {nota.classList.toggle('off')}
            });            
    }
    
    isCleanMode = !isCleanMode;
}

function chordEdit(){   
    //console.log(chordEditStatus);
    this.classList.toggle('on');
    chordEditStatus = !chordEditStatus;
   // console.log(chordEditStatus);
    
}