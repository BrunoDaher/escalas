  export class Main {
    constructor() {
        this.element = document.createElement('main');
        //this.element.className = 'off';
        this.element.id = 'main';
    }

    addBraco() {
        const braco = document.createElement('div');
        braco.id = 'braco';
        braco.style.maxWidth = '100vw';
        braco.style.overflowX = 'scroll';
        this.element.appendChild(braco);
        return this;
    }

    addPaineis() {
        const paineis = document.createElement('article');
        paineis.id = 'paineis';
        paineis.className = 'flexCenter gap1 my-1';
        paineis.style.maxWidth = '100vw';
        paineis.style.overflowX = 'scroll';

        const sections = [
            {id: 'painelOptions', className: 'painel grid f2vh', style: {alignContent: 'flex-start'}},
            {id: 'painelFiles', className: 'painel f2vh'},
            {id: 'painelChords', className: 'painel f2vh'},
            {id: 'painelClock', className: 'painel f2vh'},
            {id: 'painelMeet', className: 'painel f2vh', hidden: true}
        ];

        sections.forEach(sectionData => {
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
        this.addPaineis();
            
         header.insertAdjacentElement('afterend', this.element);
        
                    
    }
}
   //return this;

