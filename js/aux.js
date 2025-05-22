//AUX
function arrayRemoveClass(array,classe)
{
    array.forEach(elem => {
        elem.classList.remove(classe);
    });
}

//AUX
function preload(){
    let target = this.getAttribute('target');
    document.getElementById(target).click();
}

function read(boleano){
    
    console.log(boleano)
    let painelBtns = document.querySelectorAll('.painelBtn');
  
    painelBtns.forEach(element => {
            element.readOnly = boleano;
    });
}

function clearSession(){
  sessionStorage.clear()
}

function clearStorage(){
    clearStorage.clear()
  }

  function unico(a) {
    var jaVisto = {};
    return a.filter(function(item) {
        return jaVisto.hasOwnProperty(item) ? false : (jaVisto[item] = true);
    });
}

function resetClass(name){
   
    let cl = document.querySelectorAll('.' + name);

    cl.forEach(element => {
       //element.classList.remove('set') 
       element.classList.remove(name) 
    });
}