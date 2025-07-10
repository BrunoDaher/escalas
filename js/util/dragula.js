export class Dragula {
  
  constructor() {
    
   // this.initEvents();
    //this.toggleDragula(); // Inicializa o estado
  }

  init(){
    const dragId = 'drag';
    const containerSelector = '.dragContainer'

    this.drag = document.getElementById(dragId);
 
    this.containers = Array.from(document.querySelectorAll(containerSelector));
    this.toggleDragula = this.toggleDragula.bind(this);

    this.drag.addEventListener('click', this.toggleDragula);
  }

  toggleDragula() {

    let copy = true;
    this.drakeInit(copy);
    this.eventos();

    if (!this.drag.checked) {
      this.drake.containers.forEach(c => c.setAttribute('data-drag-enabled', 'true'));
    } else {
      this.drake.containers.forEach(c => c.setAttribute('data-drag-enabled', 'false'));
    }
     
  }

  drakeInit(_copy) {
    
    if(this.drake){
      this.drake.destroy();
    }
 
    this.drake = dragula(this.containers, {
     // copy: _copy,
      revertOnSpill: true,
      moves: (el, source, handle, sibling) => {
        return true;
      },
      accepts: (el, target, source, sibling) => {
        return true // bloqueia soltar nesse container
      },
      copy: (el, source) => {
        let interno = source.id === el.parentElement.id;

        console.log(source.id, el.parentElement.id)
          return true// clona só se estiver vindo do container de origem
        }
      });   

}

  eventos() {

    this.drake
      .on('drag', (el) => {
        if(el.draggable){
          el.classList.add('voando'); 
        }
        else{
           el.classList.remove('voando'); 
        }
      })
      .on('drop', (el, target, source) => {
        el.setAttribute('seq', target.id);
        //trocar id
        
        console.log(target)
        if(target.id == 'trash'){
          document.getElementById(el.id).remove();
          
          document.getElementById('trash').innerHTML = ''        }
       
          el.id = el.innerText + '_' + target.id + '_'+ el.id; 
          
          if (this.drag.checked) 
            {
              this.drake.cancel(true);
            }
    
       })
      .on('cloned', (clone, original, type) => {

        console.log(clone.getAttribute('seq'))
         clone.onclick = ()=>{
             original.click();
        }
        if (this.drag.checked) {
          this.drake.cancel(true);
        }
      })
      .on('over', (el, container) => {
         if(el.classList.contains('gu-transit')){
          el.classList.add('voando');
         }
          
        if (this.drag.checked) 
        {
          this.drake.cancel(true);
           
        }
      })
      .on('out', (el, container) => {
         //deve conter isso, nao há t ry catch pra tal
         let nota = {id:el.id, velo:el.getAttribute('velo'), value:el.innerText.trim(), seq:el.getAttribute('seq')}
         // salvar na memoria, dentro da musica
        if (this.drag.checked) 
          {
            this.drake.cancel(true);
          }
        else {
            container.style.backgroundColor = '';
        }
        el.classList.remove('voando');
      })
   
  }
}

