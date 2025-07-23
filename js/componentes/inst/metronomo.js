export class Metronomo {
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
        const painelClock = document.getElementById('painelClock');
        painelClock.innerHTML = '';

        painelClock.innerHTML += `
            <label class="comp p-1 flexList">
                <a><i class="bi bi-clock"></i> Metrônomo </a>
                <label class="switch">
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
                <div class="flex gap1" id="figuraBtns">
            `;
        
      
            let classe = '';

        for (const fig of figuras) {

            classe = fig.value === 1 ? 'active' : '';

            figurasHtml += 
            
            `<span class="figura-btn btn3 ${classe}  f2em figritm" 
                data-value="${fig.value}" 
                title="${fig.title}">
                ${fig.text}
            </span>`;

            
        }

        figurasHtml += `</div>`;

        painelClock.innerHTML += `<div class="comp my-2 gridCenter p-1">${figurasHtml}</div>`;
  
        let wrap =   `  <label class="itemCenter my-1 flexList">
                <a><i class="bi bi-grid"></i> Grade </a>
                <label class="switch">
                    <input type="checkbox" id="wrap" checked>
                    <span class="slider round"></span>
                </label>
            </label>
            `; 
        
        painelClock.innerHTML += `
            <div class="card bpm bgDark">${wrap}
                    <div class="comp p-1 flex justContAround">
                        <div class='flex w-50'>
                            <div class='card-header bg-dark ' id='lbpm' for='bpm'>120 BPM</div>
                            <input class="w-100 bpm" type="range" min="1" max="240" value="120" id="bpm">
                        </div>

                          <div class="comp flex ">
                            <a class='card-header flex' id='lbpm' for='bpm'>Compassos</a>
                             ${[1, 2, 3, 4].map(i => `
                                    <span count="${i}" class="compCount btn3 f1rem bordaA p-1 ${i === 4 ? 'active' : ''}">
                                    ${i}
                                </span>
                        `).join('')}
                         </div>
                    </div>
                    
                    <div id="compasso" class="compasso  w-100  m-1 justCenter">
                        ${[1, 2, 3, 4].map(i => `
                            <div id='p${i}' value="${i}" class="pulse w-100   ">
                                ${Array(this.figuraCount).fill().map((_, j) => 
                                    `<div class="subdivision w-100 btn4">
                                    ${j + 1}</div>`).join('')}
                            </div>
                        `).join('')}
                    </div>
                </div>
        `;
    }

    cacheElements() {
        this.bpmInput = document.getElementById("bpm");
        this.toggleBtn = document.getElementById("metroToggle");
        this.knobs = document.querySelectorAll('.knob');
        this.bpm = this.bpmInput.value;
    }

    setPulses(n) {
        
        this.pulsos = n;
        [2, 3, 4].forEach(p => {
            document.getElementById(`p${p}`).classList.toggle('none', this.pulsos < p);
        });
    }

    onPulseClick = (e) => {
        
        document.querySelectorAll('.compCount').forEach(
            b => b.classList.remove('active')
        );
        e.target.classList.add('active');

        this.setPulses(e.srcElement.getAttribute('count') );
    }

    stop() {
        document.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
        if (!this.toggleBtn.classList.contains('active')) this.toggleBtn.click();
        clearInterval(this.metronomo);
    } 

    start() {
        this.i = this.i < this.pulsos ? this.i + 1 : 1;
       // playNote('10', 'sine');
        this.fig();
    }

    fig() {
        const activeBtn = document.querySelector('.figura-btn.active');
        this.figuraCount = activeBtn ? parseInt(activeBtn.dataset.value, 10) || 1 : 1;
        const intervalo = (60 / this.bpm) * 1000 / this.figuraCount;

        
        for (let n = 0; n < this.figuraCount; n++) {
            setTimeout(() => {
                let el = document.getElementById("p" + this.i);
                if (el) {
                    let subdivision = el.children[n];
                    if (subdivision) {
                        subdivision.classList.add('active');
                        setTimeout(() => subdivision.classList.remove('active'), intervalo * 1);
                    }
                }
            }, n * intervalo);
        }
        
        setTimeout(
            this.mark, 
            (60 / this.bpm * 1000) / 4);        
    }

    mark() {
        let el = document.getElementById("p" + this.i);
        if (el){
            el.classList.toggle('active');
        } 
    }

    onBpmChange = () => {
     
        this.bpm = this.bpmInput.value;
        this.stop();
        document.getElementById("lbpm").textContent = `${this.bpm}  BPM`;
        this.metronomo = setInterval(() => this.start(), 60 / this.bpm * 1000);
    }


    onFiguraBtnClick = (e) => {
        document.querySelectorAll('.figura-btn').forEach(
            b => b.classList.remove('active')
        );
         e.target.classList.add('active');
        this.figuraCount = e.target.getAttribute('data-value');
        
        document.getElementById('compasso').innerHTML = [1, 2, 3, 4].map(i => {
            const isVisible = i <= this.pulsos ? '' : 'none';
            return `
                <div id='p${i}' value="${i}" class="pulse w-100 drag-container ${isVisible}">
                    ${Array(parseInt(this.figuraCount)).fill().map((_, j) => 
                        `<div class="subdivision w-100 btn4">
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
            const compasso = document.getElementById('compasso');
            compasso.classList.toggle('flex');
    }

    addListeners() {
        this.bpmInput.addEventListener("change", this.onBpmChange);

        document.querySelectorAll(".compCount").forEach(pulse =>
            pulse.addEventListener("click", this.onPulseClick)
        );
    document.getElementById('wrap').addEventListener('change', this.onWrapChange);             
   

// Adicionar ao método addListeners():
    document.getElementById('metroToggle').addEventListener('change', this.onToggleChange);             
        document.querySelectorAll('.figura-btn').forEach(btn =>
            btn.addEventListener('click', this.onFiguraBtnClick)
        );

        this.toggleBtn.addEventListener("change", this.onToggleChange);

        this.knobs.forEach((knob, idx) =>
            knob.addEventListener('wheel', e => this.onKnobWheel(idx, e))
        );
    }
}

// Para usar:

