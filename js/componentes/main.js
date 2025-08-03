
import {Aux} from '../util/aux.js'

export class Main extends Aux{
    
    constructor() {
        
        super();
        this.element = document.createElement('main');
        //this.element.className = 'off';
        this.element.id = 'main';

        this.sections = [
            {name:'opcoes', icon:'bi bi-music-note',  id: 'painelOptions', className: 'painel grid f2vh w-20', style: {alignContent: 'flex-start'}},
            {name:'arquivos', icon:'bi bi-music-note', id: 'painelFiles', className: 'painel f2vh w-20'},
            {name:'acordes', icon:'bi bi-music-note', id: 'painelChords', className: 'painel f2vh w-30'},
            {name:'metronomo', icon:'bi bi-music-note', id: 'painelClock', className: 'painel f2vh w-30'},
         //   {name:'meet', id: 'painelMeet', className: 'painel f2vh', hidden: true}
        ];
    }


    addBraco() {
        const braco = document.createElement('div');
            braco.id = 'braco';
            //braco.style.maxWidth = '100vw';
            //braco.style.overflowX = 'scroll';
            this.element.appendChild(braco);
        return this;
    }

    addPaineis() {
        const paineis = document.createElement('article');
        paineis.id = 'paineis';
        paineis.className = 'flexCenter gap1 filterC';
        paineis.style.maxWidth = '';
        paineis.style.overflowX = '';

        this.sections.forEach(sectionData => {
            const section = document.createElement('section');
            section.id = sectionData.id;
            section.className = sectionData.className;
            if(sectionData.style) {
                Object.assign(section.style, sectionData.style);
            }
            if(sectionData.hidden) {
                section.hidden = true;
            }
            paineis.appendChild(section);
        });

        this.element.appendChild(paineis);
        return this;
    }

    build() {
        const header = document.querySelector('header');

         this.addBraco();
            
            setTimeout( ()=>{
                const braco = document.getElementById('braco');
        
                    let video = this.renderVideo();
                    braco.insertAdjacentHTML('afterend', video);

            },100)
            
         this.addPaineis();
            
         header.insertAdjacentElement('afterend', this.element);

         header.classList.add('on');
         this.triggers();
                    
    }

    addFooter(){

        this.getById('footer').classList.remove('off');

        let buttons = this.sections.map(btn => `
                <span id=${btn.name}  class="navBtn btn3" data-panel="${btn.id}">
                    <i class="${btn.icon}"></i>
                    <a style='text-transform:capitalize'>${btn.name}</a>
                </span>`).join('');    

       this.getById('navegacao').innerHTML = buttons; 

       this.painelNav();
        
    }

    renderVideo(){

         const isMobile = /Mobi|Android/i.test(navigator.userAgent);

             
                let classe = isMobile ? 'mobile' : 'desktop';
                let controls = isMobile ? 'controls' : '';

        return`
             <div id='video'class='off' >
                <video class='video ${classe}' id='currentVideo' ; 
                        controls
                        playsinline
                        autoplay
                        >
                    <source src="" type="video/mp4">
                    Seu navegador não suporta a tag de vídeo.
                </video>
            </div>
            `
    }

    painelNav(){
        const navBtns = this.getAllClass('navBtn');

        navBtns.forEach((btn) => {
            btn.onclick = () => {
                //estetica do botao
                this.chooseTab(btn)
                
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

     

    }
}
   //return this;

