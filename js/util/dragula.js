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
    this.drake = dragula(this.containers);

    this.toggleDragula = this.toggleDragula.bind(this);
  }

  toggleDragula() {
    if (this.drag.checked) {
      this.drake.containers.forEach(c => c.setAttribute('data-drag-enabled', 'true'));
    } else {
      this.drake.containers.forEach(c => c.setAttribute('data-drag-enabled', 'false'));
    }
  }

  eventos() {


    this.init();
    this.drag.addEventListener('click', this.toggleDragula);
    

    this.drake
      .on('drag', (el) => {
        if (this.drag.checked == "true") {
          el.classList.add('voando');
          this.drake.cancel(true);
        }
      })
      .on('drop', (el, target, source) => {
        el.setAttribute('seq', target.id);
        if (this.drag.checked) this.drake.cancel(true);
      })
      .on('over', (el, container) => {
        if (this.drag.checked) this.drake.cancel(true);
      })
      .on('out', (el, container) => {
        if (this.drag.checked) this.drake.cancel(true);
        else container.style.backgroundColor = '';
      })
      .on('cloned', (clone, original, type) => {
        if (this.drag.checked) this.drake.cancel(true);
      });


        this.toggleDragula();
  }


}

// Para usar:
// const dragulaManager = new DragulaManager();