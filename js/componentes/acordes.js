import {Dao} from '../acesso/dao.js'
import { Aux } from '../util/aux.js';
import { Dragula} from '../util/dragula.js';
import {Violao} from './inst/violao.js'
import {Tocador} from './inst/tocador.js'


export class Acordes extends Aux{
     
    sections = [
        { id: "seq", label: "Dados", off: false },
        { id: "intro", label: "Intro", off: true },
        { id: "verso", label: "Verso", off: true },
        { id: "ponte", label: "Ponte", off: true },
        { id: "refrao", label: "Refrao", off: true },
        { id: "solo", label: "Solo", off: true }
    ];
       
    constructor() {
        super(); // Chama o construtor da classe pai

             this.violao = new Violao();
             
             this.slotId = 'acordes';
           this.editMode = false;
        this.dragEnabled = true;
               this.velo = 10; // Default speed
               this.drag = new Dragula();
                this.dao = new Dao();
                this.tocador = new Tocador();
    }

    controles(){
        return `
           <!-- Bloco: Controles Gerais -->
                <label for="velo" class="justContStart flex comp p-1 textStart itemCenter gap2">
                <a class="bi-command"> Controles</a>
            </label>
                <div class=" flexCenter gap2 justContAround px-2" style="zoom:0.9">  
            </div>
        `
    }
   

    getViolao(){
        return this.violao;
    }
    
    renderSectionButtons() {
      
        return this.sections.map(s => 
            `<span class="btnChord p-2 
                section-btn${s.active ? " active" : ""}" 
                data-target="div-${s.id}"
                id=btn_${s.id}
                >
                ${s.label}
            </span>`
        ).join('');
    }

    renderEstruturaAreas() {
        return this.sections.map(
            s => `
            <div class="sectionPanel${s.off ? " off" : ""}" id="div-${s.id}">
                <div id="${s.id}" class="p-1 gap1 flexWrap dragContainer" 
                    style="line-height: normal;max-height: 9vh;">
                </div>  
            </div>`
        ).join('');
    }

    renderPainelChords() {
        return `

            <!-- Bloco: Memória de Acordes & Escalas -->   
            <div class="grid ">
              

                <!-- Bloco: Estrutura Musical -->
                <div class="gap2 "
                style="overflow: hidden"> 
                        <legend hidden class="off" id="labelNomeSlot"></legend>       
                        <input hidden id="dataLoad" type="file"/>
                        <div class="">
                        
                            <div class='flex justContBetween gap1 comp filterC  p-1'> 

                                    <a id="btnEstrutura" class="p-1 comp bi bi-music-note-beamed flex">Estrutura</a>  


                                    <div  class='flex ${this.infoNavegador.desktop ? 'off' : ''}'>
                                        <label for='btnVideo' class="gap1 flex itemCenter">
                                                <a>Video</a>
                                                <label class="switch">
                                                    <input id="btnVideo" target='video' type="checkbox" checked/>
                                                    <span class="slider round"></span>
                                                </label>
                                                <a>Braço</a>
                                        </label>
                                    </div>

                                    <div class='flex itemCenter'>
                                        <i class='bi bi-music-note'>Notas</i>
                                        <label class="switch flex itemCenter">
                                            <input class='active cleanReq' id="cleanMode2" type="checkbox" checked >
                                            <span class="slider round"></span>
                                        </label>    
                                    </div>
                            
                                </div>
                            </div>
                            
                            <!-- Botões de Seção -->
                        
                                <div class="flex" 
                                    id="sectionButtons">
                                    ${this.renderSectionButtons()}
                                </div>
                            
                        </div>
                        <!-- Áreas das Seções -->
    
                        <div id="div-estrutura" class="bgDark p-1 textStart" 
                                style="height: 12vh">
                                
                                ${this.renderEstruturaAreas()}
                        </div>

                        <div  id='trash' 
                            class="bi-trash dragContainer  
                            flexCenter gap1 p-2 "
                            style='
                                border-style: ridge;
                                border-color: black;'
                            >
                        </div>
                    </div>
               
                ${this.renderSectionChords()}
                
            <section id="memoria" class="bgDark memoria  
                    textCenter gap1 p-2 dragContainer">
                </section>

                <!-- Controle: Adicionar/Remover -->
                <div class="flex abs addRem itemCenter gap2">
                </div>
            </section>
            
            <div class="textStart grid my-1">
              ${this.renderFx()}
            </div>
        `;
    }

    renderSectionChords(){

        let isAdm = this.dao.isStored('adm')

        return `
         <section id='chords' class='mt-2'>
                    <div>    
                        <div class="comp filterC flex justContBetween p-1"> 
                            
                        <span class=' bi-music-note-list'> Acordes & Escalas </span>
                        
                        <div class="flex itemCenter gap1 f2vh">
                            <span id="addMem" class="btn1 f2vh bi bi-plus filter"></span>
                            <span id="removeMem" class="btn1 f2vh bi bi-dash filter"></span> 
                        </div>

                    </div>
                        
                    <div id='blocoVelocidade' class="justContBetween p-1 flex textStart"> 
                
                        <!-- Bloco: Velocidade -->
                        <label for="velo" class="flex p-1 itemCenter gap2">
                            <i class="bi bi-clock colorB flex"> Velô</i>  
                            <input type="range" id="velo" max="800" value="10" class="w-100 comp" step="10"/> 
                        </label>
                        
                          ${this.renderEditMode()}
                    <div>

                  
                
            </section>
        `
    }

    renderEditMode(){

          return `
           <section class='flex'>
                <div class="gap1 flex itemCenter">
                    <a>Edit</a>
                    <label class="switch">
                        <input id="editMode" type="checkbox" checked/>
                        <span class="slider round"></span>
                    </label>
                </div>
                <!-- Controle: Arrastar -->
                <div class="gap1 flex itemCenter">
                    <a>Drag</a>
                    <label class="switch">
                        <input id="drag" type="checkbox" checked="false">
                        <span class="slider round"></span>
                    </label>
                </div>
            </section>
                `

    }

    chordShortcut(data){
        return `<span 
            id="${data.id}" 
            slot="${data.idMemoria}"
            class="btnChord bordaA painelBtn shortcut item" 
            draggable="false" 
            velo="${data.velo}" 
            value="${data.value}" 
            style="user-select: none;" 
            seq="${data.seq}"
        >${data.value}</span>`  
    }

    renderFx(){
        return `
            <a class="bi-radioactive comp filterC p-1"> Efeitos</a  >
            <div class="comp flexCenter gap1 p-2">
                <span id='contexto'></span>
                <span class="efeito btn1 " id="chorus" value="false">Chorus</span>
                <span class="efeito btn1 active" id="reverb" value="true">Reverb</span>
                <span class="efeito btn1" id="delay" value="false">Delay</span>
            </div>
        `
    }

    renderAll() {
        this.violao.init();
        const painelChords = document.getElementById('painelChords');
        painelChords.innerHTML = this.renderPainelChords();

        this.triggers();
          document.addEventListener('estrutura', (e) => {
            this.salvaEstrutura(e.detail);
        });   
    }

    fx(event) {
        let el = event.srcElement;
        if (el.getAttribute('value') == 'true') {
            el.setAttribute('value', false);
        } else {
            el.setAttribute('value', true);
        }
        el.classList.toggle('active');
    }

    triggers(){
        //criar label

            const btnCleanMode = document.getElementById('cleanMode2');


        
            btnCleanMode.onclick = ()=>{

                     const event = new CustomEvent('clean-request', {
                         detail: btnCleanMode, // Dados para o método clean
                    });
                document.dispatchEvent(event);
            }
        
          const btnVideo = this.getById('btnVideo');
                btnVideo.onclick = ()=>{
                    //logica reversa
                    let showVideo = !btnVideo.checked?true:false;
                    let idPainel = btnVideo.getAttribute('target')
                  
                    let mobiLand = (this.infoNavegador.mobile && this.infoNavegador.landscape)


                    if(showVideo){
                        this.togglePainel(idPainel);
                        
                        if(mobiLand){
                            this.getById('braco').classList.remove('off');
                        }
                    }
                    else{
                        this.togglePainel(idPainel);

                        if(mobiLand){
                            this.getById('braco').classList.add('off');
                        }
                    }

                }

        
            // Botões de efeitos
          const btnsEfeito = document.querySelectorAll('.efeito')
                btnsEfeito.forEach(btn => {
                    const efeitoBtn = document.getElementById(btn.id);
                    if (efeitoBtn) {
                        efeitoBtn.addEventListener('click', (event) => {
                            this.fx(event); 
                        });
                    }
                });

        let toggleEditMode = this.getById('editMode');
            toggleEditMode.onclick = ()=>{
                this.fnEdit(toggleEditMode);
            }

        let btnVelo = this.getById('velo');
            btnVelo.onchange = ()=>{
                this.setVelo(btnVelo);
            } 

         let btnAdd = this.getById('addMem')   
             btnAdd.onclick = ()=>{
               this.createSlot();
             }

        let btnRem = this.getById('removeMem')   
             btnRem.onclick = ()=>{
                this.removeSlot()
             }

         let sectionBtns = this.getAllClass('section-btn');    


         sectionBtns.forEach(btn => {
            btn.addEventListener('click', this.clicaSection.bind(this,btn));
         });



    }

    clicaSection(btn){
        

                        let trecho = btn.innerText.trim().toLowerCase();

                        console.log('clicando na secao',  trecho)

                        //console.log(trecho)
                        const event = new CustomEvent('video-play', {
                            detail: trecho, // Dados para o método clean
                        });

                        let currentSong = sessionStorage.getItem('currentSong')

                        if(currentSong){
                            let id = `vg_${currentSong}`;
                            let btnLista = this.getById(id);

                            if(btnLista){
                                btnLista.click();
                            }
                            document.dispatchEvent(event);
                         }
                         else{
                            console.log('no current song')
                           // document.dispatchEvent(event);
                         }
                        //funcao aux
                        this.removeAll('section-btn','active')
                            btn.classList.add('active');
                             let tgt = this.getById(btn.getAttribute('data-target'));
                        
                        this.addAll('sectionPanel','off');
                            tgt.classList.remove('off')
    }

    setVelo(btn) {

        let velo = this.dao.getDataJSON('velo');
        console.log('acordes acessa violaoSlotId -> ', this.violao.slotId);

        
        let obj = velo ? velo : [];
            obj[this.violao.slotId] = btn.value;

        this.dao.setDataJSON('velo', obj);
       
    }

    deleta(elemento){

        let target = elemento.getAttribute('data-target')
        this.dao.removeStorage(target);
        elemento.parentNode.parentNode.remove();
    }

    fnEdit(toggle){
        const btnChords = document.querySelectorAll('.btnChord');
        
        let editavel = !toggle.checked;

        btnChords.forEach(botao => {
                botao.classList.add('edit');
                botao.contentEditable = true;
                
            if(!editavel){
                botao.contentEditable = false;
                botao.classList.remove('edit')
            }

        });

        //desliga a chave
        toggle.classList.toggle('recOn');
        //heranca de classe
        this.read(this.editMode,"painelBtn");
        this.editMode = !this.editMode;

        this.drag.eventos();
        //this.triggers();
        
    }

    removeSlot() {
        
        //document.getElementById(slotId).remove();
        this.dao.removeSession(this.violao.slotId);
        this.dao.salvaLocal();

        let slot = document.getElementById(this.violao.slotId);

        slot.remove();
    }

    editaArquivo(elemento){

        // Usa prompt nativo para editar o nome
        let novoNome = prompt('Editar nome:', elemento.innerText);

        let elemTarget = elemento.getAttribute('data-target');

        if (novoNome !== null && novoNome.trim() !== '') {
            console.log('Novo nome:', novoNome);
            // Remove o item antigo do localStorage e sessionStorage
            const oldId = elemTarget;
            const newId = 'vg_' + novoNome.trim();

           let oldData = this.dao.getLocalDataJSON(oldId);
            // Remove o antigo
            
            sessionStorage.setItem('currentSong',novoNome.trim());
            //sessionStorage.removeItem(oldId);

            // Atualiza o id do elemento
            elemento.id = newId;
      
            // Atualiza o texto e salva com o novo id

            let target = (this.getById(elemTarget));

            target.innerText = novoNome;
            this.dao.setLocalDataJSON(newId,oldData);

         

        }
        else{
            console.log('Nome inválido ou vazio');
        }

    
    }

    setSlotName(){
        let div = document.querySelector('.slot.recOn');
        div.name = this.id;
        this.getById('labelNomeSlot').innerText = div.name;
    }   

    createSlot(){
        this.addSlot('note',null)
    }

    addSlot(chordLabel,id){
            
            // Adiciona um novo slot de acorde na memória usando template literals e reduz redundâncias
            let mem = this.getById('memoria');
            let curSize = mem.childElementCount;
            let velo = this.getById('velo').value;
            let btnId = id ? id : curSize + 1;
            let btnLabel = chordLabel ? chordLabel : btnId;

           
            // Cria o elemento usando template e insere no innerHTML
            mem.insertAdjacentHTML('beforeend', `
                <span
                    id="${btnId}" 
                    class="btnChord bordaA painelBtn slot item" 
                    draggable="false" 
                    velo="${velo}" 
                    value='${btnLabel}'
                    style="user-select: none;"
                >${btnLabel}</span>
            `);


            // Recupera o elemento recém-adicionado
            let btn = mem.lastElementChild;
            btn.value = btnLabel;

            // Evento de clique para executar acorde
            btn.addEventListener('click', (btn)=>{
                // Check if video button is checked and click it if true
             let video = this.getById('video');

                
                console.log(btn.target)

                
                if (video && !video.classList.contains('off')) {
                    //btnVideo.click();
                }                                
                    this.slotId = id;
                    this.violao.getChord(btn);
            });

            // Evento de alteração para salvar nome do acorde
            btn.addEventListener('blur' , (btn)=> {
                btn = btn.target;
                btn.value = btn.textContent
                let data = this.dao.getDataJSON('label') || {};

                data[btn.id] = btn.value;
                btn.name = btn.value;

                this.dao.setDataJSON('label', data);
                this.dao.salvaLocal();
            });

            // Evento de cancelamento (opcional)
            btn.oncancel = function () {};
            // Pequeno delay para resetar UI
            setTimeout(() => {
                this.violao.reset();
            }, 700);

    }
    
    clearMemoria(){
        this.getById('memoria').innerHTML = '';

    

    }

     loadSlot() {

        console.log('loading slots')
        
        this.getById('memoria').innerHTML = '';
        let dataLabel = this.dao.getDataJSON('label');

        //preenche memoria
        if (dataLabel) {
            Object.entries(dataLabel).forEach(label => {
                this.addSlot(label[1], label[0]);
            });
            
                this.loadEstrutura();

        }
        else{
            console.log('sem dados ')
        }
    }
  
    salvaEstrutura(e) {


        let estrutura = this.dao.getDataJSON('estrutura') || {};

        if (estrutura[e.seq]) {
            if (e.add) {
                // Somar: adiciona o valor ao array existente
                estrutura[e.seq] = [...estrutura[e.seq], {'tone':e.value, 'slot':e.idMemoria}];
            } else {
               // console.log('remocao')
                if (Array.isArray(estrutura[e.seq])) {
                    estrutura[e.seq] = estrutura[e.seq].filter(item => item.tone !== e.value);
                    
                } else {
                    console.warn(`estrutura[${e.seq}] não é um array. Valor atual:`, estrutura[e.seq]);
                }
            }
        } else {
            // Se for adição, cria como array com o valor. Caso contrário, cria array vazio.
            if(e.add){
                
                estrutura[e.seq] = [{'tone':e.value, 'slot':e.idMemoria}];
            }
   
    }

    this.dao.setDataJSON('estrutura', estrutura);
    }

    cleanSection(){
    
        console.log('limpando secao')
        this.sections.forEach(section => {
            document.getElementById(section.id).innerHTML = '';


        });
        
    }

    async loadEstrutura(){    

        console.log('carregand estrutura')

        this.cleanSection();
       // console.log('carregando estrutura', item.innerText)
        let estrutura = this.dao.getDataJSON('estrutura') || {};

        if(estrutura){
        
            
            Object.entries(estrutura).forEach(([chave,valor]) => {

                
                if(valor.length > 0){
                 
                    let div = this.getById(chave);

                      
                 //   div.innerHTML = ''; // Limpa o conteúdo da div antes de adicionar novos botões
                  
                    if(div){
                     
                        valor.forEach(element => {

                           // console.log(element)
                            
                            let btn = this.chordShortcut({
                                id: chave+element.tone,
                                idMemoria: element.slot,
                                value: element.tone,
                                velo: 0,
                                seq: chave
                            });
                   
                       div.innerHTML += btn;
                    }); 
                          
                    }
                }
            });
        }
        
        setTimeout(() => {
            //trigger q atribui evendo de click ao idOriginal 
            // de cada botao clonado durante o drag and drop

           let btns = this.getAllClass('shortcut');
                btns.forEach(btn => {
                btn.onclick = (e) => {

                    //console.log('acorde clicado -> ' ,e.srcElement.innerText, btn)

                    this.arrayRemoveClass(btns,'on');
                    btn.classList.add('on')

                   let id = this.getById(btn.getAttribute('slot'));
                   
                   id.click();
                };
            });
            
            
        }, 300);
        //falta rodar os triggers
        // Preenche as áreas de estrutura com os dados
    
    }

}

// Exemplo de uso:
// const painel = new PainelChords();
// document.body.innerHTML = painel.renderAll();
