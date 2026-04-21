import { Aux } from "../util/aux.js";

export class Opcoes extends Aux{
    
    constructor() {
    
        super();

        const containerId = 'painelOptions';
        
        this.containerId = containerId;
        this.cores = [
            { id: "corEscala", label: "Escala", cssVar: "--fundoG", name: "fundoG" },
            { id: "corBackground", label: "Fundo A", cssVar: "--fundoC", name: "fundoC" },
            { id: "corPrincipal", label: "Cor A", cssVar: "--colorA", name: "colorA" },
            { id: "corSecundaria", label: "Cor B", cssVar: "--colorB", name: "colorB" },
            { id: "corPaineis", label: "Paineis", cssVar: "--fundoD", name: "fundoD" }
        ];
        
    }

    init(){
     
        this.renderAll();
        this.eventos();
    }

    initTemas(){
    
        this.root = document.documentElement;
        

         const temaPadrao = {
            '--fundoA': '#275b8b', // Substituído pelo seu novo azul
            '--fundoB': 'black',
            '--fundoC': '#3c3d3e', 
            '--fundoD': '#202020',
            '--fundoE': '#1916168c',
            '--fundoF': '#f32121',
            '--fundoG': '#a77b6b85', // Atualizado conforme sua lista
            '--chroma': '#8aad8a',
            '--shadowA': '#d0bc5981',
            '--colorA': '#275b8b',
            '--colorB': '#D1CCCC',
            '--colorC': '#0c74b9',
            '--colorD': '#c59143e1',
            '--colorE': '#438ac5e1'
        };        

        const temaA = {
            '--fundoA': '#2d6a4f',
            '--fundoB': '#08140f',
            '--fundoC': '#262121',
            '--fundoD': '#131614',
            '--fundoE': '#08140f8c',
            '--fundoF': '#d90429',
            '--fundoG': '#8b5a2b85',
            '--chroma': '#52b788',
            '--shadowA': '#74c69d81',
            '--colorA': '#52b788',
            '--colorB': '#d8e2dc',
            '--colorC': '#1b4332',
            '--colorD': '#ffb703e1',
            '--colorE': '#52b788e1',
        };

        const temaB = {
        '--fundoA': '#800000', // Bordô/Crimson escuro
            '--fundoB': '#050505', // Preto quase puro
            '--fundoC': '#242424', // Cinza neutro para painéis
            '--fundoD': '#141414', // Cinza escuro
            '--fundoE': '#0505058c',
            '--fundoF': '#ff3333', // Vermelho vivo
            '--fundoG': '#5c403385', // Madeira Nogueira (escura)
            '--chroma': '#4caf50', // Verde padrão de sucesso
            '--shadowA': '#ff4d4d81', // Brilho vermelho
            '--colorA': '#e63946', // Vermelho principal para destaques
            '--colorB': '#f0f0f0', // Branco bem puro para alto contraste
            '--colorC': '#a81a1a', // Vermelho escuro para botões ativos
            '--colorD': '#e0a96de1', // Dourado/Latão velho (remete a ferragens de guitarra)
            '--colorE': '#e63946e1'
        };


        const temaC = {
            '--fundoA': '#2d6a4f', // Verde musgo
            '--fundoB': '#08140f', // Preto esverdeado
            '--fundoC': '#22382c', // Painéis verde acinzentado escuro
            '--fundoD': '#16241c', 
            '--fundoE': '#08140f8c',
            '--fundoF': '#d90429', // Vermelho padrão
            '--fundoG': '#8b5a2b85', // Madeira clássica (mantida neutra)
            '--chroma': '#52b788', 
            '--shadowA': '#74c69d81', // Brilho menta
            '--colorA': '#52b788', // Verde menta para destaques
            '--colorB': '#d8e2dc', // Texto verde/cinza bem claro e suave
            '--colorC': '#1b4332', // Verde escuro para botões ativos
            '--colorD': '#ffb703e1', // Âmbar para contraste
            '--colorE': '#52b788e1'
        }


        this.temas = {
            'Padrao': temaPadrao,
            'TemaA': temaA,
            'TemaB': temaB,
            'TemaC': temaC
        };
    }

    template() {
        const temaInputs = this.cores.map(cor => `
            <label class="grid gap1 itemCenter labelTema " for="${cor.id}">
                <a>${cor.label}</a>
                <input 
                    style="background-color: var(${cor.cssVar})" 
                    id="${cor.id}" name="${cor.name}" 
                    type="color"
                >
            </label>
        `).join('');

        return `

                <div id="controls" class="flex itemCenter gap2 justCenter" style="height: fit-content;">
                    <input hidden id="playChord" type="button" class="btn1" value="Chord">
                    <input hidden id="reset" type="button" class="btn1 bordaA" value="Reset">
                </div>

                <section class="textStart grid  ">
                    <legend class="comp filterC p-1 textStart bi bi-paint-bucket">Tema</legend>
                  
                    <div class="gap2 flexCenter p-2 paint-bucket justContAround">
                        ${temaInputs}
                    </div>

                    <legend class="comp filterC p-1 bi bi-paint-bucket flex gap1">Opções</legend>
                
                    <div class="p-1"> 
                    ${this.renderTemas()}
                    <div>
                </section>

                <div id="currentItem" class="off flexCenter gap2 itemCenter justCenter my-2 filterB">
                    <span id="arquivo">Arquivo</span>
                    <i id="favorite" class="bi bi-arrow-right-circle inv"></i>
                </div>

                <div hidden>
                    <input type="text" id="nomeSlot">
                    <input id="playChord" type="button" class="btn1 bordaA" value="Chord">
                </div>

         
        `;
    }


    renderTemas(){

        return `
            <div class='flexCenter gap2 p-1 justCenter '>
                  
                    ${Object.keys(this.temas).map(key => `
                        <span class="grid itemCenter btnTema" id="${key}" >
                            <i class="bi bi-paint-bucket"></i>
                            <a>${key}</a>
                        </span>
                    `).join('')}

                </div>
            `
    }

    renderAll() {
        this.initTemas();
        const div = document.getElementById(this.containerId);
        if (div) {
            div.innerHTML = this.template();
        }
        else{
            console.log('tilt')
        }

        this.eventos();
    }

    eventos() {
        
             //tema cores
            this.cores.forEach(cor => {
                const input = document.getElementById(cor.id);
                if (input) {
                    input.addEventListener('change', (event) => this.tema(event));
                }
            });

            // Reset tema
            const setTema = document.querySelectorAll('.btnTema');

            setTema.forEach(btn => {
                btn.addEventListener('click', () => this.setTema(btn));
            });

            
    }

    tema(event) {
        const elem = event.target;
        const classeRoot = elem.name;
        const cor = elem.value;
        elem.style.background = cor;
        document.documentElement.style.setProperty('--' + classeRoot, cor);
    }

    setTema(btn) {

        const selectedTheme = this.temas[btn.id];

        console.log(selectedTheme)
        for (const [property, value] of Object.entries(selectedTheme)) {
            
            this.root.style.setProperty(property, value);
        }

        
        this.cores.forEach(({ id, cssVar }) => {
            const input = document.getElementById(id);
            if (input) {
                input.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue(cssVar);
            }
        });
    }
}

// Para usar:
// new OptionsPanel(); // ou new OptionsPanel('options');
