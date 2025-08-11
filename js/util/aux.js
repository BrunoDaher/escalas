export class Aux {
    // Elimina uma classe de todos os elementos do array
    
    
    constructor() {
        this.refreshNav();
    }
    
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

    refreshNav(){

        let agent = navigator.userAgent.toLowerCase();
         // Additional checks for mobile devices
       // let isMobileByScreen = window.innerWidth <= 500 && window.innerHeight <= 950;
        let landscape = window.screen.orientation.angle == 90 ? true:false;
        
        this.infoNavegador.landscape = landscape;
        this.infoNavegador.ipad =  agent.includes('ipad');
        this.infoNavegador.iphone =  agent.includes('iphone');
        this.infoNavegador.android = agent.includes('android');
        
        let ismobile =  this.infoNavegador.iphone || this.infoNavegador.android;
       
        this.infoNavegador.mobile = ismobile;
        
        let foneLand = landscape && ismobile;
        
        this.infoNavegador.desktop = !ismobile && (agent.includes('mac os') || agent.includes('windows'));
        this.infoNavegador.tablet = !ismobile && !this.infoNavegador.desktop;

        
    }
      infoNavegador = {
        'ipad': false,
        'android': false,
        'iphone': false,
        'tablet': false,
        'landscape': false,
        'desktop': false,
        'mobile': false
      }

}
