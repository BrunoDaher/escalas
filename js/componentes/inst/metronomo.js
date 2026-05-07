
import { Aux } from "../../util/aux.js";

//dependencia
const aux = new Aux();


export class Metronomo{
    constructor() {
        this.metronomo = null;
        this.i = 0;
        this.pulsos = 4;
        this.isRunning = false;
        this.volumes = [50, 50, 50];
        this.angles = [0, 0, 0];
        this.bpm = 120;
        this.knobs = [];
        this.bpmInput = null;
        this.toggleBtn = null;
       // this.init();
        this.figuraCount = 4;
    }

    init() {
        this.buildPainelClock();
        this.cacheElements();
        this.addListeners();
    }

    buildPainelClock() {
        const painelClock = aux.getById('painelClock');
        painelClock.innerHTML = '';

        painelClock.innerHTML += `
            <label class="comp p-2 flexList">
                <a><i class="bi bi-clock"></i> Metrônomo </a>
                <label for="metroToggle" class="switch">
                    <input type="checkbox" id="metroToggle" checked>
                    <span class="slider round"></span>
                </label>
            </label>
            
        `;

        const figuras = [
            { value: 1, title: 'Semínima', text: ')' },
            { value: 2, title: 'Colcheia', text: '))' },
            { value: 3, title: 'Semicolcheia', text: ')))' },
            { value: 4, title: 'Fusa', text: '))))' },
            { value: 5, title: 'Semifusa', text: ')))))' }
        ];

        let figurasHtml = 
            `<label class='card-header bg-dark m-2' for='bpm'>
                Batidas por Tempo</label>
                <div class="flex gap2" id="figuraBtns">
            `;
        
      
            let classe = '';

        for (const fig of figuras) {

            classe = fig.value === 1 ? 'active' : '';

            figurasHtml += 
            
            `<button class="btnChord f2em figura-btn ${classe}  figritm" 
                data-value="${fig.value}" 
                title="${fig.title}">
                ${fig.text}
            </button>`;

            
        }

        figurasHtml += `</div>`;

        painelClock.innerHTML += `<div class="flexCenter gap2 itemCenter my-1 p-1">${figurasHtml}</div>`;
  
        let wrap =   `  <label class="itemCenter my-1 flexList">
                <a><i class="bi bi-grid"></i> Layout </a>
                <label for="wrap" class="switch">
                    <input type="checkbox" id="wrap" checked>
                    <span class="slider round"></span>
                </label>
            </label>
            `; 
        
        painelClock.innerHTML += `
            <div class="card bpm bgDark">
                    
                    <article class="comp flexcol justContAround">
                        
                        <section class='lista flexrow w-100 gap2 justCenter itemCenter p-2'>
                            <input class="w-75 bpm" type="range" min="1" max="240" value="120" id="bpm">    
                            <div class='card-header bg-dark ' id='lbpm' for='bpm'>120 BPM</div>
                        </section>
                        
                        <div id='pulsos' class="flexcol w-100 justCenter itemCenter">
                            <legend class='f1rem colorD p-1' id='lbpm' for='bpm'>Pulsos</legend>
                            <div class="comp justContBetween w-full px-2 flexrow gap2 ">
                                ${[1, 2, 3, 4].map(i => `
                                        <button id="pls${i}" count="${i}" class="compCount flexCenter f1rem  p-1 ${i === 4 ? 'active' : ''}">
                                            <i class='ind bi-hand-index-thumb f3vh'></i>
                                            ${i}
                                        </button>
                                `).join('')}
                            </div>
                        </div>
                        

                    </article>
                    
                    <div id="compasso" class="compasso p-2 ">
                        ${[1, 2, 3, 4].map(i => `
                            <div id='p${i}' value="${i}" class="pulse  justContBetween">
                                ${Array(this.figuraCount).fill().map((_, j) => 
                                    `<div class="subdivision">
                                    ${j + 1}</div>`).join('')}
                            </div>
                        `).join('')}
                    </div>
                </div>
        `;
    }

    cacheElements() {
        this.bpmInput = aux.getById("bpm");
        this.toggleBtn = aux.getById("metroToggle");
        this.knobs = aux.getAllClass('knob');
        this.bpm = this.bpmInput.value;
    }

    setPulses(n) {
        
        this.pulsos = n;
        [2, 3, 4].forEach(p => {
            aux.getById(`p${p}`).classList.toggle('none', this.pulsos < p);
        });
    }

    onPulseClick = (e) => {
        
        aux.getAllClass('compCount').forEach(
            b => b.classList.remove('active')
        );
        e.target.classList.add('active');

        this.setPulses(e.srcElement.getAttribute('count') );
    }

    stop() {
        aux.getAllClass('button').forEach(btn => btn.classList.remove('active'));
        console.log(this.toggleBtn)
        if (!this.toggleBtn.classList.contains('active')==true) {
            this.toggleBtn.click();
        }
        clearInterval(this.metronomo);
    } 

start() {

    const pulseIndex = this.i; // congela o pulso atual

    if (pulseIndex <= this.pulsos) {
        this.fig(pulseIndex);
    }

    this.i = this.i < this.pulsos ? this.i + 1 : 1;
}



   fig(pulseIndex) {

    const activeBtn = aux.getByClass('figura-btn.active');
    this.figuraCount = activeBtn ? parseInt(activeBtn.dataset.value, 10) || 1 : 1;

    const intervalo = (60 / this.bpm) * 1000 / this.figuraCount;

    for (let n = 0; n < this.figuraCount; n++) {

        setTimeout(() => {

            let el = document.getElementById("p" + pulseIndex);

            if (el) {
                let subdivision = el.children[n];

                if (subdivision) {
                    subdivision.classList.add('active');

                    setTimeout(() => {
                        subdivision.classList.remove('active');
                    }, intervalo);
                }
            }

        }, n * intervalo);
    }

    this.mark(pulseIndex);
}


mark(index) {

    // remove active de todos
    for (let i = 1; i <= 4; i++) {
        const el = document.getElementById("p" + i);
        if (el) el.classList.remove('btn3');
    }

    // aplica só no pulso atual
    const el = document.getElementById("p" + index);
    if (el) el.classList.add('btn3');
}


    onBpmChange = () => {
     
        this.bpm = this.bpmInput.value;
        this.stop();
        aux.getById("lbpm").textContent = `${this.bpm}  BPM`;
        this.metronomo = setInterval(() => this.start(), 60 / this.bpm * 1000);
    }

    onFiguraBtnClick = (e) => {
        aux.getAllClass('figura-btn').forEach(
            b => b.classList.remove('active')
        );
         e.target.classList.add('active');
        this.figuraCount = e.target.getAttribute('data-value');
        
        aux.getById('compasso').innerHTML = [1, 2, 3, 4].map(i => {
            const isVisible = i <= this.pulsos ? '' : 'none';
            return `
                <div id='p${i}' value="${i}" class="pulse w-75 justCenter drag-container ${isVisible}">
                    ${Array(parseInt(this.figuraCount)).fill().map((_, j) => 
                        `<div class="subdivision ">
                        ${j + 1}</div>`).join('')}
                </div>
            `;
        }).join('');  

        this.addListeners();

    }

    onToggleChange = () => {
        // Interrompe o metrônomo atual
        this.stop();
        
        // Alterna o estado visual do botão toggle
        // Se estava rodando, remove active; se estava parado, adiciona active
        this.toggleBtn.classList.toggle('btn1', !this.isRunning);
        this.toggleBtn.classList.toggle('active', !this.isRunning);
        
        // Se o metrônomo estava parado (!isRunning é true)
        if (!this.isRunning) {
            // Calcula o intervalo em milissegundos baseado no BPM
            const intervalo = (60 / this.bpm * 1000);
            
            // Inicia um novo intervalo que chama this.start() 
            // repetidamente no tempo calculado
            this.metronomo = setInterval(() => this.start(), intervalo);
        }
        
        // Inverte o estado de execução do metrônomo
        this.isRunning = !this.isRunning;
    }

    onWrapChange = () => {
            const compasso = aux.getById('compasso');
            compasso.classList.toggle('flex');
    }

    addListeners() {
        this.bpmInput.onchange = this.onBpmChange;

        aux.getAllClass("compCount").forEach(pulse =>
            pulse.onclick = this.onPulseClick
        );
   // document.getElementById('wrap').addEventListener('change', this.onWrapChange);             
   
// Adicionar ao método addListeners():
    aux.getById('metroToggle').addEventListener('change', this.onToggleChange);             
        aux.getAllClass('figura-btn').forEach(btn =>
            btn.onclick =  this.onFiguraBtnClick
        );

    }
}

// Para usar:

