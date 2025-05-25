
let label = null;

function favBuild(nome){
  
    let div = document.createElement('div');
        div.className = 'flexCenter itemCenter textCap placeContBetween';          
        
    let elemento = document.createElement('li');
        elemento.innerText = nome;
        elemento.id = "vg_" + nome;
        elemento.onclick = clicaMusica;
        
        //o tipo da chamada interfere no "This"
        // precisa passar o evento pra poder usar o this

    let btnDel = document.createElement('btn');
        btnDel.onclick = ()=> {deleta(elemento)};
        btnDel.type = 'button'
      
        btnDel.classList.add('trash');

        div.append(elemento)   
        div.append(btnDel)    
    
    document.getElementById('salvos').append(div);
    
    return elemento;
 
}

function deleta(elemento){

    localStorage.removeItem(elemento.id,JSON.stringify(localStorage));
    elemento.parentNode.remove();
}

function salva(elemento){
    localStorage.setItem(elemento.id,JSON.stringify(sessionStorage));
}

//PAINEL
function favorite(){
    let nome =  document.getElementById('arquivo').innerText;  

    let data = getLocalDataJSON('vg_' +  nome);
    
    setTimeout(()=>{
        

  
    if(data == null){
      let el = favBuild(nome);
      salva(el);
      console.log('salvando novo')
    }
    else{
        console.log('ja existe')
    }
        
        
        
    },
    500);
    


  //  if(data == null){
      
   // }
   // else{
        
        //temporariamente pisca
      //  document.getElementById('vg_' + nome).parentNode.classList.toggle('active');

      //  setTimeout(()=>{
      //      document.getElementById('vg_' + nome).parentNode.classList.toggle('active');
     //   },400)
   // }
    
}

//PAINEL
function setSlotName(){
    let div = document.querySelector('.slot.recOn');
    div.name = this.id;
    console.log(this)
    showSlotName(div.name);
}

//PAINEL
function setBracoPos(){
    let braco = document.getElementById("braco");
    braco.classList.toggle('inclinado');

    let n = document.querySelectorAll(".nota");

    n.forEach(element => {
        element.classList.toggle('inclinado');
    });

    //n.classList.toggle('inclinado')
}

//PAINEL
function addSlot(chordLabel,id){
    
    let mem = document.getElementById('memoria');
    let curSize = mem.childElementCount;

    let btn = document.createElement('input');
        btn.type = 'text'
        btn.size = '7'
        btn.readOnly = true

        //console.log(chordLabel)
        //valor do botao - ternario
        btn.value = chordLabel ? chordLabel : curSize+1;

        btn.id = id ? id:curSize + 1;
        btn.setAttribute('velo',document.getElementById('velo').value);
    
        btn.classList = 'btn1 bordaA painelBtn slot';

        btn.onclick = getChord;

        btn.onchange = function (){
            console.log('salvar no Dao - array')
            let data = [];
            
            if(label){
                label[this.id] = this.value;    
            }
            else{
                label = {[this.id]:this.value};
            }

            //sessionStorage
            if(getDataJSON('label')){
                data = getDataJSON('label');
            }

            console.log(this.value)
            console.log(data)
            
            //data['label'] = JSON.stringify(label);

            btn.name = this.value;

           // console.log(data);

          // setDataJSON('label',data);

           // salvaLocal();
            
        };

        btn.oncancel = function (){
        // this.readOnly = true;
         console.log('salvar no Dao - array')
     };

    //executa acorde ou escala
   //btn.onclick = getChord;
    mem.appendChild(btn);
    //btn.click();
   
    setTimeout( ()=>{
        reset();
    }
    ,700);

}

function chordBuild(obj){

    if(chordEditStatus){

        let semitons = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

        let mG = getMG();
        let data = this.value;

        if(obj.type == 'submit'){
        data = obj.innerText;
        }

        let pos2 = semitons.indexOf(data);

        //monta novamente as 7 notas pra aplicar a tetrade
        //usa como base as receitas de mG e o intervalo de semitons
        let modo = document.getElementById('modo').value;

        let escala = [];

        mG[modo].forEach(element => {
            escala.push(semitons[pos2]);
            pos2 = pos2 + element[1];
            pos2 = f2(pos2)
        });

        //posicao da letra q representa a tônica
        let pos = escala.indexOf(data);

        let terca = pos + 2;
        let quinta = terca + 2;
        let setima = quinta + 2;

        function f2(x){
            if(x >= 12){
                x = x - 12;
            }
            return x  
        }

        function f(x){
            if(x >= 7){
                x = x - 7;
            }
            return x  
        }

        let ch = [escala[pos],escala[f(terca)],escala[f(quinta)],escala[f(setima)]];

    // console.log(escala)
        getInterval(obj,ch);

    // console.log(pos + ' ' + terca + ' ' + quinta + ' ' + setima);
    // console.log(notas[pos] + ' ' + notas[f(terca)] + ' ' + notas[f(quinta)] + ' ' + notas[f(setima)]);
    }
}


