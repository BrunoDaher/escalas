
import {Aux} from '../util/aux.js'
import VideoObj from './video.js';

export class Main extends Aux{
    
    constructor() {
        
        super();
        this.element = document.createElement('main');
        //this.element.className = 'off';
        this.element.id = 'main';

        this.videoObj = new VideoObj();

        let css =  this.navegador().desktop ? 'desktop':
                   this.navegador().tablet ? 'tablet' : 'mobile';

                   console.log(css)

               
        this.sections = [
            {name:'opcoes', icon:'bi bi-gear',  id: 'painelOptions', className: `painel f2vh ${css}`},
            {name:'arquivos', icon:'bi bi-file-earmark-music', id: 'painelFiles', className: `painel f2vh ${css}`},
            {name:'acordes', icon:'bi bi-headphones', id: 'painelChords', className: `painel f2vh ${css}`},
            {name:'clock', icon:'bi bi-clock', id: 'painelClock', className: `painel f2vh ${css}`},
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

        //sections é um array de obj

        let painelClasse = this.navegador().iphone ? 'mobile':'';
        this.sections.forEach(obj => {
            const section = document.createElement('section');
            section.id = obj.id;
            section.className = obj.className + ' '+  painelClasse;

          
            paineis.appendChild(section);
        });

        this.element.appendChild(paineis);
    }

    build() {
        const header = document.querySelector('header');

         this.addBraco();
            
            setTimeout( ()=>{
                const braco = document.getElementById('braco');
                      braco.insertAdjacentHTML('afterend', this.videoObj.renderVideo());
            },100)
            
         this.addPaineis();
         
         header.insertAdjacentElement('afterend', this.element);
         header.classList.add('on');

         setTimeout(()=>{this.triggers()},300)
    }

    addFooter(){

        this.getById('footer').classList.remove('off');
        
        let buttons = this.sections.map(btn => `
                <span id=${btn.name}  
                    class="navBtn w-100 grid bordaA btn1 p-1 f2vh" 
                    data-panel="${btn.id}">
                    <i class="${btn.icon}"></i>
                    <a style='text-transform:capitalize'>${btn.name}</a>
                </span>`).join('');    
       
       this.getById('navegacao').innerHTML = buttons; 
       this.painelNav();
        
    }

    painelNav(){
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
           //     document.getElementById('btn_seq').click();
        setTimeout(()=>{
                this.videoObj.setVideoId('currentVideo');
            }
        ,300);


        // Add window orientation change event listener to reload page
window.addEventListener('orientationchange', function() {
    location.reload();
});            }
}
   //return this;

