export class Aux {
    // Elimina uma classe de todos os elementos do array
    arrayRemoveClass(array, classe) {
        array.forEach(elem => {
            elem.classList.remove(classe);
        });
    }

    hideParents(){
        const btnViews = this.getAllClass('btnView');

            btnViews.forEach(btn => {
                btn.onclick = ()=>{
                const irmaos = [...btn.parentNode.children].filter(
                    (el) => el !== btn );

                    let targetA = this.getById(irmaos[0].getAttribute('target'));
                        targetA.classList.add('off');
                        irmaos[0].classList.remove('active');

                    let targetB = this.getById(btn.getAttribute('target'))
                        targetB.classList.remove('off');
                        btn.classList.add('active');
                    
                }
        });
    }
        

    getById(id){
        return document.getElementById(id);
    }

    getByClass(classe){
        return document.querySelector(`.${classe}`)
    }

    getAllClass(classe){
        return document.querySelectorAll(`.${classe}`)
    }
    
    clone(source, target) {
        // Copiar atributos
        [...source.attributes].forEach(attr => target.setAttribute(attr.name, attr.value));
        
        // Mover filhos
        target.id = source.id;
        target.value = source.innerText;
        target.innerHTML = source.innerHTML;
    }

    // Simula um clique no elemento cujo id está no atributo 'target'
    preload(element) {
        let target = element.getAttribute('target');
        this.getById(target).click();
    }

    // Altera o estado readOnly de todos os elementos com a classe 'painelBtn'
    read(boleano,classe) {
        this.getAllClass(classe).forEach(element => {
            element.readOnly = boleano;
        });
    }

    // Limpa a sessão
    clearSession() {
        sessionStorage.clear();
    }

    // Limpa o armazenamento local
    clearStorage() {
        localStorage.clear();
    }

    // Retorna um array com elementos únicos
    unico(array) {
        return [...new Set(array)];
    }

    // Remove a classe 'name' de todos os elementos que a possuem
    resetClass(name) {
        this.getAllClass(name).forEach(element => {
            element.classList.remove(name);
        });
    }

    deactivePainel(id){
        this.getById(id).classList.add('off');
    }

    activePainel(id){
        this.getById(id).classList.remove('off');
    }
    // Alterna a classe 'off' no elemento com o id fornecido
    togglePainel(id) {
        console.log(id)
        this.getById(id).classList.toggle('off');
    }

    removeAll(grupo,classe){

       let btns = this.getAllClass(`${grupo}`);
           btns.forEach(btn => {
            btn.classList.remove(classe);
        }); 

    }

    addAll(grupo, classe){
        let elems = this.getAllClass(`${grupo}`);
           elems.forEach(elem => {
            elem.classList.add(classe);
        }); 
    }

      navegador(){
          let agent = navigator.userAgent.toLowerCase();
    
       // Additional checks for mobile devices
        let isMobileByPlatform = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(agent);
        let isMobileByScreen = window.innerWidth <= 800 && window.innerHeight <= 900;
        let isMobileByTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        let isMobileByVendor = /android|iphone|kindle|silk/i.test(navigator.vendor || navigator.platform);
        let land = window.screen.orientation.angle == 90 ? true:false;
        
        let ismobile = isMobileByPlatform || isMobileByScreen || isMobileByTouch || isMobileByVendor;
        let ipad =  agent.includes('ipad') && isMobileByPlatform;
        let iphone =  agent.includes('iphone') && isMobileByPlatform;
        let desktop = !ismobile;

        let foneLand = land && iphone;

        let tablet = (!isMobileByScreen) || foneLand;  
        
        
       
        
        if(tablet && !land){
            tablet= false;
            iphone = true;
        }    

        let dados = {'ipad':ipad, 'iphone':iphone,'tablet':tablet,'landscape':land, 'desktop':desktop};
      
        return dados
      }

      isTablet(){
        return this.navegador().tablet || this.navegador().ipad;
      }


      isMobile(){
        let mobile = this.navegador().iphone || this.navegador().ipad || this.navegador().tablet;
        return mobile;
      }
    
}
