import {Dao} from '../acesso/dao.js'
import { Aux } from '../util/aux.js';
import { Dragula} from '../util/dragula.js';
import {Violao} from './inst/violao.js'
import {Tocador} from './inst/tocador.js'


export class Acordes extends Aux{
     
        sections = [
            { id: "seq", label: "Sequencia", off: false },
            { id: "intro", label: "Intro", off: true },
            { id: "verso", label: "Verso", off: true },
            { id: "refrao", label: "Refrao", off: true },
            { id: "ponte", label: "Ponte", off: true }
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

    getViolao(){
        return this.violao;
    }
    
    renderSectionButtons() {
      
        return this.sections.map(s => `<span class="btn4 section-btn${s.active ? " active" : ""}" data-target="div-${s.id}">${s.label}</span>`
        ).join('');
    }

    renderEstruturaAreas() {

        return this.sections.map(
            s => `
            <div class="sectionPanel bg-Dark${s.off ? " off" : ""}" id="div-${s.id}">
                
                <div id="${s.id}" class="p-1 gap1 flex dragContainer" 
                    style="line-height: normal;">
                </div>  
            </div>`
        ).join('');
    }

    controles(){
        return `
           <!-- Bloco: Controles Gerais -->
            
                     <label for="velo" class="justContStart flex comp p-1 textStart itemCenter gap2">
                        <a class="bi-command"> Controles</a>
                    </label>
                     <div class="bgDark2 flexCenter gap2 justContAround px-2" style="zoom:0.9">  
                        <!-- Controle: Arrastar -->
                            <label class="gap1 flex itemCenter">
                                <a>Arrastar acordes</a>
                                <label class="switch">
                                    <input id="drag" type="checkbox" checked="false"/>
                                    <span class="slider round"></span>
                                </label>
                            </label>
                        <!-- Bloco: Velocidade -->
                            <label for="velo" class="flex p-1 itemCenter gap2">
                                <i class="bi bi-clock flex"> Velocidade</i>  
                                <input type="range" id="velo" max="300" value="10" class="w-100 transp" step="10"/> 
                            </label>
                        
                        <!-- Controle: Adicionar/Remover -->
                        <div class="flex itemCenter gap2">
                            <a>Add/Rem</a>
                            <div class="flex itemCenter gap1 f2vh">
                                <span id="addMem" class="btn1 f2vh bi bi-plus filter"></span>
                                <span id="removeMem" class="btn1 f2vh bi bi-dash filter"></span> 
                            </div>
                        </div>
                    </div>`
    }

    renderPainelChords() {
        return `
                <!-- Bloco: Memória de Acordes & Escalas -->
                <div class="grid">
                    <div class="comp justContBetween p-1 flex textStart"> 
                        <a class="bi-music-note-list"> Acordes & Escalas</a>
                        <!-- Controle: Renomear -->
                        <label class="gap1 flex itemCenter">
                            <a>Renomear</a>
                            <label class="switch">
                                <input id="editMode" type="checkbox" checked/>
                                <span class="slider round"></span>
                            </label>
                        </label>
                    </div>
                    
                    <div style="height: 12vh;" id="memoria" class="memoria bgDark2 textCenter gap1 p-1 dragContainer"></div>
                </div>
                    <div class="grid rad2 my-1">
                    ${this.controles()}
                    </div>


                <!-- Bloco: Estrutura Musical -->
                <div class="gap2" style="justify-content: normal;text-align: start;">
                    <legend hidden class="off" id="labelNomeSlot"></legend>       
                    <input hidden id="dataLoad" type="file"/>
                    <div class="comp">
                        <a id="btnEstrutura" class="p-1 comp bi bi-music-note-beamed flex">Estrutura</a>  
                        <!-- Botões de Seção -->
                        <div class="bgDark2 flex gap1 p-1" id="sectionButtons" style="flex-wrap: wrap;">
                            ${this.renderSectionButtons()}
                        </div>
                    </div>
                    <!-- Áreas das Seções -->
                    <div id="div-estrutura" class="bgDark p-1 textStart" style="height: 9em">
                        ${this.renderEstruturaAreas()}
                    </div>
                </div>
      
        `;
    }

    renderAll() {


        this.violao.init();

        const painelChords = document.getElementById('painelChords');
        painelChords.innerHTML = this.renderPainelChords();

        this.triggers();
    }

    triggers(){
    
        //criar label

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
               
                btn.onclick = ()=>{

                    //remove on
                    this.removeAll('section-btn','active')
                    btn.classList.add('active');

                    let tgt = this.getById(btn.getAttribute('data-target'));
                    
                    this.addAll('sectionPanel','off');
                        tgt.classList.remove('off')
                        //remover de todos irmaos

                    //this.togglePainel(tgt);
                }
             });


    }

    setVelo(btn) {

        let velo = this.dao.getDataJSON('velo');

        console.log(this.violao.getSlotId())
       
        console.log('acordes acessa violaoSlotId -> ', this.violao.slotId);
       // this.violao.slotId = btn.value;

        let obj = velo ? velo : [];

        
        obj[this.slotId] = btn.value;
        
        console.log(this.violao.slotId)
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

        if (novoNome !== null && novoNome.trim() !== '') {
            // Remove o item antigo do localStorage e sessionStorage
            const oldId = elemento.id;
            const newId = 'vg_' + novoNome.trim();

            // Remove o antigo
            localStorage.removeItem(oldId);
            sessionStorage.setItem('currentSong',novoNome.trim());
            //sessionStorage.removeItem(oldId);

            // Atualiza o id do elemento
            elemento.id = newId;

            // Atualiza o texto e salva com o novo id
            elemento.innerText = novoNome;
            this.dao.setLocalDataJSON(novoNome,elemento);

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
            let mem = document.getElementById('memoria');
            let curSize = mem.childElementCount;
            let velo = document.getElementById('velo').value;
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
                >${btnLabel}<span>
            `);


            // Recupera o elemento recém-adicionado
            let btn = mem.lastElementChild;
            btn.value = btnLabel;

            // Evento de clique para executar acorde
            btn.addEventListener('click', (btn)=>{
                
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
        
        this.getById('memoria').innerHTML = '';
        let dataLabel = this.dao.getDataJSON('label');

        //preenche memoria
        if (dataLabel) {
            Object.entries(dataLabel).forEach(label => {
                this.addSlot(label[1], label[0]);
            });
        }
        else{
            //cosole.log('sem dados ')
        }
    }

}

// Exemplo de uso:
// const painel = new PainelChords();
// document.body.innerHTML = painel.renderAll();
