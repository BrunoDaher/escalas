
import {Aux} from '../util/aux.js'
import VideoObj from './video.js';

export class Main extends Aux{
    
    constructor(dao) {
        
        super();

        this.videoObj = new VideoObj(dao);

        this.header = this.getById('header');
        this.mainDiv = document.createElement('main');
        this.mainDiv.id = 'main';

        this.refreshNav();

        let css = this.infoNavegador.mobile ? 'mobile' : this.infoNavegador.tablet ? 'tablet' : 'desktop';
        
        this.css = css;

                       
        this.sections = [
            {name:'opcoes', icon:'bi bi-gear',  id: 'painelOptions', className: `painel ${css}`},
            {name:'arquivos', icon:'bi bi-file-earmark-music', id: 'painelFiles', className: `painel ${css}`},
            {name:'acordes', icon:'bi bi-headphones', id: 'painelChords', className: `painel ${css}`},
            {name:'clock', icon:'bi bi-clock', id: 'painelClock', className: `painel ${css}`},
            
        ];
    }

    renderBracoViolao() {

        

        return `<div id="braco" class='${this.infoNavegador.landscape ? 'on' : 'off'}'></div>`;
    }

    renderPaineis() {
        
        return `
            <article id="paineis" class=" gap1 ${this.css}">
                ${this.sections.map(obj => `
                    <section id="${obj.id}" class="${obj.className}"></section>
                `).join('')}
            </article>
        `;
    }

    build() {

        this.getById('carregandoInicio').classList.add('off');
        
        this.mainDiv.insertAdjacentHTML('beforeend',this.renderBracoViolao());
        this.mainDiv.insertAdjacentHTML('beforeend',this.videoObj.renderVideo());
        this.mainDiv.insertAdjacentHTML('beforeend', this.renderPaineis());

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
                class="navBtn w-100 grid bordaA btn1 f2vh" 
               
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
                    if(btn.id=='acordes'){
                        let src = 'seq'
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
    }

    triggers(){

         this.videoObj.triggers();
        //document.getElementById('btn_seq').click();
            setTimeout(()=>{
                this.videoObj.setVideoId('currentVideo');
            }
        ,300);

        // Add window orientation change event listener to reload page
        window.addEventListener('orientationchange', function() {
            location.reload();
        });            

    }
}
   //return this;

