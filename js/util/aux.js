export class Aux {
    // Elimina uma classe de todos os elementos do array
    
    
    constructor() {

        //this.refreshNav();
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

                const agent = navigator.userAgent.toLowerCase();
            const width = window.innerWidth;
            const height = window.innerHeight;

            // 1. Detecções de Hardware/SO específicas
            const isIphone = agent.includes('iphone');
            const isAndroid = agent.includes('android');
            // iPadOS 13+ se identifica como Macintosh, mas tem touch. 
            const isIpad = agent.includes('ipad') || (agent.includes('macintosh') && navigator.maxTouchPoints > 1);

            // 2. Orientação
            const landscape = window.matchMedia("(orientation: landscape)").matches;

            // 3. Lógica de Categorização
            // Se for iPad ou (Android com tela larga), tratamos como Tablet
            const isTablet = isIpad || (isAndroid && Math.min(width, height) >= 600);

            // Se for iPhone ou (Android com tela estreita), tratamos como Mobile
            const isMobile = isIphone || (isAndroid && !isTablet);

            // Se não for nenhum dos acima e tiver cara de computador
            const isDesktop = !isMobile && !isTablet && (agent.includes('windows') || agent.includes('macintosh') || agent.includes('linux'));

            // 4. Preenchimento do seu objeto
            this.infoNavegador = {
                'ipad': isIpad,
                'android': isAndroid,
                'iphone': isIphone,
                'tablet': isTablet,
                'landscape': landscape,
                'portrait': !landscape,
                'desktop': isDesktop,
                'mobile': isMobile
            };

            console.log('Resultado:', this.infoNavegador);
        
        
    }
      infoNavegador = {
        'ipad': false,
        'android': false,
        'iphone': false,
        'tablet': false,
        'landscape': false,
        'desktop': false,
        'mobile': false,
        'portrait': false
      }


      
}
