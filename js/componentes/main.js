
import {Aux} from '../util/aux.js'
import VideoObj from './video.js';

export class Main extends Aux{
    
    constructor(dao) {
        
        super();

        this.videoObj = new VideoObj(dao);

        this.header = this.getById('header');
        
        this.mainDiv = document.createElement('main');
        this.mainDiv.id = 'main';
        this.mainDiv.className = 'flexColBetween';
        
        this.refreshNav();

        let css = this.getDispositivo();

        this.css = this.getDispositivo();
                       
        this.sections = [
            
            {name:'arquivos', icon:'bi bi-file-earmark-music', id: 'painelFiles', className: `painel ${this.css}`},
            {name:'pratica', icon:'bi bi-headphones', id: 'painelChords', className: `painel ${this.css}`},
            {name:'clock', icon:'bi bi-clock', id: 'painelClock', className: `painel ${this.css}`},
            {name:'opcoes', icon:'bi bi-gear',  id: 'painelOptions', className: `painel ${this.css}`},
            
        ];
    }

    renderBracoViolao() {

        this.refreshNav()

        
        let disp = this.getDispositivo();


        
        let show = disp == 'desktop' || this.infoNavegador.landscape? 'on' : 'off';

        
        
        return `<section id='topMainDiv' class='contBraco ${show} ${disp}' ><div id="braco" class='${disp}'></div></section>`;
    }

    renderPaineis() {
        
        return `
            <article id="paineis" class="gap1 ${this.css}">
                ${this.sections.map(obj => `
                    <section id="${obj.id}" class="${obj.className}"></section>
                `).join('')}
            </article>
        `;
    }

    renderBodyDiv() {
        return `        
            <section id="bodyMainDiv" class='flexrow'>
                ${this.renderPaineis()}
                ${this.videoObj.renderVideo()}
            </section>
        `
    }

    build() {

        this.getById('carregandoInicio').classList.add('off');
        
        this.mainDiv.insertAdjacentHTML('beforeend',this.renderBracoViolao());
        
        this.mainDiv.insertAdjacentHTML('beforeend',this.renderBodyDiv());

        this.header.insertAdjacentElement('afterend', this.mainDiv);
        

         setTimeout(()=>{
                this.triggers()
            },
            300)
    }

    renderSections(){

        this.getById('footer').classList.remove('off');

        let self = this;
        
        let buttons = this.sections.map(btn => `
            <span id=${btn.name}  
                class="navBtn w-100 grid colorB f2vh" 
                data-panel="${btn.id}">
                <i class="${btn.icon}"></i>
                <a style='text-transform:capitalize'>${btn.name}</a>
            </span>`).join('');    
       
       
       this.getById('navegacao').insertAdjacentHTML('beforeend', buttons);
      
       //acoes
       this.navTriggers();
        
    }

    navTriggers(){
        const navBtns = this.getAllClass('navBtn');

            navBtns.forEach((btn) => {
                btn.onclick = () => {
                    //estetica do botao
                    if(btn.id=='pratica'){
                        let src = 'dados'
                    }
                    this.chooseTab(btn);
                };
            });
    }

    chooseTab(btn){
        
        this.removeAll(`navBtn`,'active');
        btn.classList.add('active');
        this.addAll(`painel`,'off');
        this.activePainel(btn.getAttribute('data-panel'));

        if(!this.infoNavegador.desktop && !this.infoNavegador.landscape){

            let cont = this.getById('btnVideo').checked ? 'video' : 'topMainDiv';

            if(['arquivos','opcoes','clock'].includes(btn.id)){
                    this.getById(cont).classList.add('off');
                }
            else{
                this.getById(cont).classList.remove('off');

            }
        }

       
    }

    triggers(){

         this.videoObj.triggers();
        
            setTimeout(()=>{
                this.videoObj.setVideoId('currentVideo');
                this.videoObj.play();
            }
        ,300);

        // Add window orientation change event listener to reload page
        window.addEventListener('orientationchange', function() {
            location.reload();
        });            

    }
}
   //return this;

