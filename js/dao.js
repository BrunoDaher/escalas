  //DAO
function storageRead(){
        
    Object.keys(localStorage).forEach(element => {
        //console.log(element.length) 
        //console.log(element.substring(3,element.length))
        if(element.startsWith("vg_")){
            let nome = element.substring(3,element.length);
          
          //roda fn de construcao
              let el = favBuild(nome);
        }
    });
}

//DAO 
//abre o json e distribui em variaveis no sessionStorage
function arquivo(){

    let chave = this.id; // chamado por link texto <- this ja possui o id como chave
    let lista = JSON.parse(localStorage.getItem(chave));

    document.getElementById('arquivo').innerText = this.innerText;
 
    Object.keys(lista).forEach(chave => {
         sessionStorage.setItem(chave,lista[chave]);    
      });
    
   loadSlot();
}

//DAO
function loadSlot(){
 document.getElementById('memoria').innerHTML ='' ;
 let dataLabel = getDataJSON('label');
 
 if(dataLabel){
  Object.entries(dataLabel).forEach(label => {
    //console.log(label[1],label[2])
    addSlot(label[1],label[0])
  });
}
}

//DAO
function removeSlot(){
  
  
  document.getElementById(slotId).remove();
  removeSession(slotId);

}


function isStored(id){    
    return sessionStorage.getItem(id) ? true:false;
}

function resetById(id){
    let arr = [];
    sessionStorage.setItem(id,JSON.stringify(arr));
}

function clone(nome,id){
    sessionStorage.setItem(nome,sessionStorage.getItem(id));
}

function getDataJSON(id){
    return sessionStorage.getItem(id) ? JSON.parse(sessionStorage.getItem(id)): null;
}

function getLocalDataJSON(id){
  return localStorage.getItem(id) ? JSON.parse(localStorage.getItem(id)): null;
}

function setLocalDataJSON(id,data){
  localStorage.setItem(id , JSON.stringify(data));
}

function setDataJSON(id,data){
    sessionStorage.setItem(id , JSON.stringify(data));
}

function existsOn(elem,id){    
    let nts = sessionStorage.getItem(id);
    return nts.includes(elem) ? true:false;
}

function removeSession(id){    
    sessionStorage.removeItem(id);
}

//incrementa array
function toggleArray(id,elem){            
    
    let saved = getDataJSON(id);
    //
    let arr =  saved ?  saved: [];
    
    //console.log(id)

    //add se não existir
    arr.includes(elem) ? arr.splice(arr.indexOf(elem),1) : arr.push(elem);
    
    //grava
    setDataJSON(id,arr);

   // console.log(arr)
}
//listeners

function salvaLocal(){

    let nome =  document.getElementById('arquivo').innerText;
    let data = getLocalDataJSON('vg_' +  nome);

    let objetos = [];

    Object.keys(sessionStorage).forEach(element => {
        //console.log(element)
        objetos[element] = sessionStorage.getItem(element);
    });

    let sortedKeys = Object.keys(objetos).sort();
    let sortedObjetos = {};
      sortedKeys.forEach(key => {
        sortedObjetos[key] = objetos[key];
      });
    objetos = sortedObjetos;

  
    //atualiza
    setLocalDataJSON('vg_' + nome,objetos);

}

function exportData(){

    //console.log(Object.keys(local));

    let objetos = [];

    Object.keys(sessionStorage).forEach(element => {
        //console.log(element)
        objetos[element] = sessionStorage.getItem(element);
    });


    makeFile('aluno.json',sessionStorage);
    
}

  
function makeFile(name,sessionStorage){
  let fileName = name;

  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";


  var json = JSON.stringify(sessionStorage),
      blob = new Blob([json], {type: "octet/stream"}),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }


function restart(){
//elimina slots
  let mem = document.getElementById('memoria').innerHTML =  '' 

      if(mem){

      Object.keys(sessionStorage).forEach(element => {
          // console.log(element)
          //document.getElementById(element).remove();
          remove(element);
          //remove(local);
      });

      document.getElementById('salvos').innerHTML = '';
    }
      //loadSlot();
    }


function upload() {
  
    const file = document.querySelector('input[type=file]').files[0]; //'input[type=file]'
    const reader = new FileReader();

    let nome;

    if (file) {
      // console.log("tem arquivo")
      reader.readAsText(file);      
      
      let legenda = file.name.split('.')
      document.getElementById('arquivo').innerText = legenda[0];
      nome = legenda[0];
      //console.log(nome)
      
    }
    else{
      console.log("*arquivo não carregado!");
    }
  
    reader.addEventListener("load", function () {
      // convert image file to base64 string //preview.src = reader.result;
      let lista = JSON.parse(reader.result);
      Object.keys(lista).forEach(chave => {
        //sem ser stringfy
        sessionStorage.setItem(chave,lista[chave]);  
      });

    }, false);
    
    // document.getElementById('arquivo').innerText(chave);
      //document.getElementById('favorite').click();
    //setTimeout(location.reload(),1000);

}