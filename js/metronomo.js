let metronomo = null;
let bpmInput = document.getElementById("bpm");
let bpm = bpmInput.value;
let i = 0;
let pulsos = 4;
let compassos = 1;

// triggers
bpmInput.addEventListener("change", function () {
    
    bpm = this.value;
    stop();
    document.getElementById("lbpm").textContent = this.value + "  BPM";
    metronomo = setInterval(start, 60 / bpm * 1000);
});

// pulsações
document.querySelectorAll("input[name='pulsos']").forEach(radio => {
   // radio.addEventListener("change", setPulses);
});

//document.getElementById("qtdPulsos").addEventListener("change", setPulses);

document.querySelectorAll(".pulse").forEach(pulse => {    

  //  console.log(pulse);
    pulse.addEventListener("click", function () {
        let el = document.getElementById(this.id);
      //  console.log(el.value);
        setPulses(el.value)
        
    });
 });


// on off

let toggleBtn = document.getElementById("metroToggle");
let isRunning = false;

toggleBtn.addEventListener("change", function () {
    console.log("Toggle button clicked");
    if (isRunning) {
        stop();
        this.classList.remove('active');
    } else {
        stop();
        this.classList.add('active');
        metronomo = setInterval(start, 60 / bpm * 1000);
    }
    isRunning = !isRunning;
});

function setPulses(nPulsos) {
    // Use event or fallback to global

   // console.log("setPulses", e);
  //  pulsos = e && e.target ? e.target.value : this.value;

  pulsos = nPulsos;
    // Remove all 'none' classes first
    ["p2", "p3", "p4"].forEach(id => {
        document.getElementById(id).classList.remove('none');
    });

    if (pulsos < 4) {
        document.getElementById("p4").classList.add('none');
    }
    if (pulsos < 3) {
        document.getElementById("p3").classList.add('none');
    }
    if (pulsos < 2) {
        document.getElementById("p2").classList.add('none');
    }
}

// funções
function stop() {
    document.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));

     let ligado = document.getElementById("metroToggle").classList.contains('active');

     console.log('ligado',ligado);
    if (!ligado) {
        document.getElementById("metroToggle").click();
    }

   
    window.clearInterval(metronomo);
}

function start() {

   // document.getElementById("metroOn").classList.add('active');
    i < pulsos ? i++ : i = 1;

    play();

    fig();
    function play() {
        playNote(i == 1 ? '10' : '10', 'sine');
    }
}

function fig() {

    //tempo deve ser o mesmo do metronomo

    
    //console.log
    console.log('por segundo',bpm/60);
    console.log('por pulso',bpm/60 * pulsos);

    
    
    setTimeout(mark,120 );
    mark()
}

function mark() {
  
    let el = document.getElementById("p" + i);
    if (el) el.classList.toggle('active');
}


const knobs = document.querySelectorAll('.knob');
const volumes = [50, 50, 50]; // Volume inicial de cada knob
const angles = [0, 0, 0]; // Ângulo inicial de cada knob


const updateVolume = (index, deltaY,e) => {




    e.srcElement.setAttribute('valor',volumes[index])

    

  //  console.log(e.srcElement.id)
    angles[index] += deltaY * 0.01; // Sensibilidade
    angles[index] = Math.max(-135, Math.min(135, angles[index])); // Limitar o ângulo de rotação
    volumes[index] = Math.round(((angles[index] + 135) / 270) * 100); // Converter ângulo em volume

    // Atualizar visual do knob e exibição do volume
    knobs[index].style.transform = `rotate(${angles[index]}deg)`;
    knobs[index].nextElementSibling.textContent = `${e.srcElement.id}: ${volumes[index]} b.p.m`;
};

//trigger
knobs.forEach((knob, index) => {
    knob.addEventListener('wheel', (e) => {
      e.preventDefault();
     
      updateVolume(index, e.deltaY,e);
    });
});
