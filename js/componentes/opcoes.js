import { Aux } from "../util/aux.js";

export class Opcoes extends Aux{
    
    constructor() {
    
        super();
    
        const containerId = 'painelOptions'
        
        this.containerId = containerId;
        this.cores = [
            { id: "corEscala", label: "Escala", var: "--fundoG", name: "fundoG" },
            { id: "corBackground", label: "Background", var: "--fundoC", name: "fundoC" },
            { id: "corPrincipal", label: "Cor Principal", var: "--fundoE", name: "fundoE" },
            { id: "corSecundaria", label: "Cor Secundária", var: "--fundoA", name: "fundoA" },
            { id: "corPaineis", label: "Paineis", var: "--fundoD", name: "fundoD" }
        ];
        
    }

    init(){
        console.log('renderizando', this)
        this.renderAll();
        this.eventos();
    }

    template() {
        const temaInputs = this.cores.map(cor => `
            <label class="flex justContBetween itemCenter" for="${cor.id}">
                <a>${cor.label}</a>
                <input 
                    style="background-color: var(${cor.var})" 
                    id="${cor.id}" name="${cor.name}" 
                    type="color"
                >
            </label>
        `).join('');

        return `
                <div class="flex justContBetween comp p-1 mb-1">
                 
                    <div class='flex itemCenter'>
                        <i class='comp bi bi-music-note'>Notas</i>
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
                        <span class="btn1  itemCenter" id="resetTemaBtn">
                            <i class="bi bi-arrow-clockwise"></i>
                            <a>Original</a>
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
            const resetBtn = document.getElementById('resetTemaBtn');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => this.resetTema());
            }

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

    resetTema() {
        const root = document.documentElement;
        root.style.setProperty('--fundoA', '#f9ac47');
        root.style.setProperty('--fundoB', 'black');
        root.style.setProperty('--fundoC', '#3c3d3e');
        root.style.setProperty('--fundoD', '#4a4c50');
        root.style.setProperty('--fundoE', '#1916168c');

        const colorMap = [
            { id: 'corEscala', cssVar: '--fundoG' },
            { id: 'corBackground', cssVar: '--fundoC' },
            { id: 'corPrincipal', cssVar: '--fundoE' },
            { id: 'corSecundaria', cssVar: '--fundoA' },
            { id: 'corPaineis', cssVar: '--fundoD' }
        ];

        colorMap.forEach(({ id, cssVar }) => {
            const input = document.getElementById(id);
            if (input) {
                input.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue(cssVar);
            }
        });
    }
}

// Para usar:
// new OptionsPanel(); // ou new OptionsPanel('options');
