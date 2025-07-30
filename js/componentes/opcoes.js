import { Aux } from "../util/aux.js";

export class Opcoes extends Aux{
    
    constructor() {
    
        super();
    
        const containerId = 'painelOptions'
        
        this.containerId = containerId;
        this.cores = [
            { id: "corEscala", label: "Escala", cssVar: "--fundoG", name: "fundoG" },
            { id: "corBackground", label: "Fundo A", cssVar: "--fundoC", name: "fundoC" },
            { id: "corPrincipal", label: "Cor Principal", cssVar: "--colorC", name: "colorC" },
            { id: "corSecundaria", label: "Cor Secundária", cssVar: "--colorB", name: "colorB" },
            { id: "corPaineis", label: "Paineis", cssVar: "--fundoD", name: "fundoD" }
        ];
        
    }

    init(){
     
        this.renderAll();
        this.eventos();
    }

    template() {
        const temaInputs = this.cores.map(cor => `
            <label class="flex justContBetween itemCenter" for="${cor.id}">
                <a>${cor.label}</a>
                <input 
                    style="background-color: var(${cor.cssVar})" 
                    id="${cor.id}" name="${cor.name}" 
                    type="color"
                >
            </label>
        `).join('');

        return `
                <div class="flex justContBetween comp p-1 mb-1">
                 
                    <div class='flex itemCenter'>
                        <i class='bi bi-music-note'>Notas</i>
                        <label class="switch flex itemCenter">
                            <input class='active' id="cleanMode" type="checkbox" checked >
                            <span class="slider round"></span>
                        </label>    
                    </div>
                </div>

                <div id="controls" class="flex itemCenter gap2 justCenter" style="height: fit-content;">
                    <input hidden id="playChord" type="button" class="btn1" value="Chord">
                              
                    <input hidden id="reset" type="button" class="btn1 bordaA" value="Reset">
                </div>

                <section class="textStart grid f2vh ">
                    <a class="comp p-1 textStart bi bi-paint-bucket">Tema</a>
                    <div class="gap1 grid p-2 paint-bucket ">
                        ${temaInputs}
                          <span class="btn1 itemCenter btnTema" id="temaPadrao" >
                            <i class="bi bi-arrow-clockwise "></i>
                            <a>Padrao</a>
                        </span>
                        <span class="btn1 itemCenter btnTema" id="temaA" >
                            <i class="bi bi-paint-bucket "></i>
                            <a>TemaA</a>
                        </span>
                        <span class="btn1 itemCenter btnTema" id="temaB" >
                            <i class="bi bi-paint-bucket "></i>
                            <a>TemaB</a>
                        </span>
                    </div>
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

    renderAll() {
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

            const btnCleanMode = document.getElementById('cleanMode');
            
            btnCleanMode.onclick = ()=>{
                     const event = new CustomEvent('clean-request', {
                         detail: btnCleanMode, // Dados para o método clean
                    });
                document.dispatchEvent(event);
            }
    }

    tema(event) {
        const elem = event.target;
        const classeRoot = elem.name;
        const cor = elem.value;
        elem.style.background = cor;
        document.documentElement.style.setProperty('--' + classeRoot, cor);
    }

    setTema(btn) {

        const root = document.documentElement;

          const temaPadrao = {
            '--fundoA': '#f9ac47',
            '--fundoB': 'black',
            '--fundoC': '#3c3d3e', 
            '--fundoD': '#202020',
            '--fundoE': '#1916168c',
            '--fundoF': '#f32121',
            '--fundoG': '#4f4040',
            '--chroma': '#8aad8a',
            '--shadowA': '#d0bc5981',
            '--colorA': 'var(--fundoA)',
            '--colorB': '#D1CCCC',
            '--colorC': '#e3a30a',
            '--colorE': '#438ac5e1'
        };        
        const temaA = {
            '--fundoA': '#f9ac47',
            '--fundoB': 'black', 
            '--fundoC': '#3c3d3e',
            '--fundoD': '#4a4c50',
            '--fundoG': '#656161'
        };

        const temaB = {
            '--fundoA': '#252222',
            '--fundoB': 'black', 
            '--fundoD': '#7E7C7C',
            '--fundoE': 'black',
            '--fundoG': '#656161'
        };



        const temas = {
            temaPadrao: temaPadrao,
            temaA: temaA,
            temaB: temaB
        };

        const selectedTheme = temas[btn.id];
        

        for (const [property, value] of Object.entries(selectedTheme)) {
            root.style.setProperty(property, value);
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
