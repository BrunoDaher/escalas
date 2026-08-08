import { Dao } from  '../acesso/dao.js'
import {Aux} from '../util/aux.js'

export class Arquivos extends Aux{

    constructor(acordes, role) {

        super();

        this.dao = acordes.dao;
        this.acordes = acordes;
        this.containerId ='painelFiles';

        this.role = role;

        this.aulas = this.dao.getAulas();
    }

    //paliativo

    renderPainelFiles() {

        let controlesShow = this.role == 'adm' ? '':'off';
        
        return `
            ${this.renderFilesMenu()}

            <fieldset id='minhasAulas' class=" filesPanel rad1 bordaA  textStart ">
                ${this.renderMinhasAulas()}
            </fieldset  >

              <fieldset id='meusArqs' class="off filesPanel rad1 bordaA textStart ">
                ${this.renderMeusArquivos()}
            </fieldset  >
           
           <div class="fundoC justCenter w-full">
                ${this.renderDaoBtns()}
            </div>
        
        `;
    }


    renderFilesMenu(){
        return `<menu class='flex justCenter gap2 fundoC w-100 f2vh'>
                    <span class='active p-1 flex gap1 menuFiles' target='minhasAulas'>
                        <i  class='bi-hand-index-thumb ind'></i>
                        <label class="">Conceitos </label>
                    </span>

                    <span class='flex gap1 p-1 menuFiles' target='meusArqs'>
                        <i class='bi-hand-index-thumb ind'></i>
                        <label class="">Práticas </label>
                    </span>

            </menu>`;
    }

    renderMeusArquivos(){

        this.refreshNav();


        //console.log(this.getDispositivo())

        return`
            <div id="salvos" class="${this.getDispositivo()}  "></div>
            `
    }

    renderMinhasAulas(){

         this.refreshNav();
        
        return`
            <div id="aulasSalvas" class="${this.getDispositivo()} "></div>
            `
    }

    renderDaoBtns(){

        
        let controlesShow = this.role == 'adm' ? '':'off';

        return `
            <div id="daoBtns" class="flexBtns justContBetween p-1">
                
                <button class="itemCenter" id="cloudLoad">
                    <img src="./img/ico/icoApp.png" 
                        style='width:6vh height:6vh' class='mini pick justCenter' alt="" srcset="">
                    <a>Atualizar</a>
                </button>

                <div class='${controlesShow} gap2 flexBtns'>
                    <button class="itemCenter " id="export">
                        <i class='bi-file-earmark-arrow-down  f3vh colorD '></i>
                        <a>Exportar</a>
                    </button>
                    <button class=" itemCenter  " id="load" target="dataLoad">
                        <i class=' bi-file-earmark-arrow-up  f3vh colorD  '></i>
                        <a>Importar</a>
                    </button>
                    <button class=" ${controlesShow} itemCenter " id="addSong">
                        <i class=' bi-music-note  f3vh colorD  '></i>
                        <a>Add Song</a>
                    </button>
                </div>

                

            </div>
        `
    }

    renderAll(role) {


        this.role = role;
        //iniciando supabase
        this.dao.startSupa();

        

         this.container = this.getById(this.containerId);
        ////console.log(this.container)
        if (this.container) {
            //////console.log('Renderizando painel de arquivos');
            this.container.innerHTML = this.renderPainelFiles();
            //this.update();
            this.triggers();
           
        }
        else{
         //  ////console.log(22)
        }
    }


    novoArquivo(){

        
        let dataLoad = this.getById('dataLoad');

        if(dataLoad){
            dataLoad.addEventListener('change', async ()=>{
                //////console.log('uplad de arquivo')

                //aguarda a persistencia (sessionStorage)
                await this.dao.upload();
                if(this.dao.upload){
                    const elem = this.getById('arquivo');
                     this.favBuild(elem.innerText.trim());
                }
             }) 
        }
        else{
            ////console.log('no upload')
        }
    }

   
    triggers(){

        // Add event listener for custom video-play event
            
        this.novoArquivo();


               //menuFiles
         const menuFilesBtn = this.getAllClass('menuFiles') || false;
            if (menuFilesBtn) {
                
                menuFilesBtn.forEach(btn => {
                    btn.addEventListener('click', () => {
                        if(!btn.classList.contains('active')){
                            this.toggleAll('menuFiles','active')
                            this.toggleAll('filesPanel','off')
                        }
                        
                    });
                });

        }
      

        // Botões de ação (chroma, export, load)
        const chromaBtn = this.getById('chroma');
        if (chromaBtn) {
            chromaBtn.addEventListener('click', () => {
                this.acordes.getViolao().chroma(chromaBtn);
            });
        }

        const exportBtn = this.getById('export');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
               // alert('Exportar arquivo');
                this.dao.exportData();
                // Lógica para exportar
            });
        }

        //load
        const loadBtn = this.getById('load')
        let target = loadBtn.getAttribute('target')
        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                sessionStorage.clear();
                this.dao.preload(target);
            });
        }

        //cloudLoad
        const cloudLoadBtn = this.getById('cloudLoad')
           
        if (cloudLoadBtn) {
           ////console.log('ss')
                cloudLoadBtn.addEventListener('click', async ()=>{
                    
                   ////console.log('cloudLoad')

                    this.togglePainel('paineis');
                    this.activePainel('carregandoInicio');
                    
                    await this.update();
                    
                    this.togglePainel('paineis');
                    this.deactivePainel('carregandoInicio');


                    }
                );
           
        }   
        else{
           ////console.log('no cloudLoad')   
        }

        const addSongBtn = this.getById('addSong');
        if (addSongBtn) {
            addSongBtn.addEventListener('click', () => {

            this.addSong();
            this.triggersFav();
            });
        }

           this.restore();

       
        
    }


   async update(){
        
            let cloudFiles = await this.dao.cloudSync();

                    if(cloudFiles){

                        this.getById('salvos').innerHTML = '';
                        localStorage.clear();
                        this.dao.refreshBlob();
                       
                        await Promise.all(cloudFiles.map(async song => {
                            
                            let json = await this.dao.getFile(song);
                            if (json) {
                            let songName = song.replace('.json', '');
                            this.dao.setLocalDataJSON('vg_' + songName, json);
                        }
                       }));

                       this.triggers();
    }
}

    triggersFav() {
        
       console.log('trigger favoritos')
        let btnsClicaMus = document.querySelectorAll('.clicaMus');
            let btnsDel = document.querySelectorAll('.bi-eraser-fill');
            let btnsPencil = document.querySelectorAll('.bi-pencil');


            btnsClicaMus.forEach(item => {
                item.addEventListener('click', ()=>{
                    console.log('clicando no btn musica')
                   this.clicaMusica(item);

                        this.violao.setTune(this.dao.getData('tune') || 'standard');
                        this.violao.init();
                })
            });
        
            btnsDel.forEach(item => {
                item.addEventListener('click', ()=>{
                    this.deleta(item)
                })
            });
        
            btnsPencil.forEach(item => {
                item.addEventListener('click', ()=>{
                    this.acordes.editaArquivo(item)
                })
            });


        
    }

    clicaMusica(item){
         
        this.getById('currentLabelText').innerText = item.innerText
         
            this.acordes.clearMemoria();
            this.dao.clicaMusica(item);

            //

            this.acordes.loadSlot(item); 

            //this.getById('contexto').innerText = item
            
            //ativa div pratica
            setTimeout(
                //
                ()=>{
                    //disparar um evento q aciona o acordes
                    let btn = this.getById('pratica');
                    if(btn){
                        btn.click();
                    }
                    
                }
                ,300)
    }

    favBuild(nome){
    

        let urlImg = this.dao.urlImg(nome) ;

        

        let css = urlImg ? `background-image : url('${urlImg}')` :'';

        let controlesShow = this.role == 'adm' ? '':'off';
    
        //transforma camelCase pra espaço
        let legend = this.camelToSpace(nome);
        // Cria o template HTML usando template literals
        // /justContBetween
        let template = ` 
            <div name=${nome} id="vg_${nome}" style="${css}" 
                 class=" rad1 flexColBetween  songAlb  capt p-1 clicaMus">
            <legend class=" f2vh fundoGrad2">${legend}</legend>        
                <div class=" flexCenter f1rem p-1 gap2 justCenter  ${controlesShow}">
                    <span data-target='vg_${nome}' role="button" class="btn1  fundoC bi-eraser-fill "></span>
                    <span data-target='vg_${nome}' role="button" class="btn1 fundoC bi-pencil "></span>
                </div>    

            </div>
        `;

  
        
        
        let div =  this.aulas.includes(nome)? 'aulasSalvas' : 'salvos';

        this.getById(div).innerHTML += template;
        

    }

    addSong(){

       ////console.log('addSong')
        //jogar pro dao
        sessionStorage.clear();
        const elem = this.getById('arquivo');
              elem.innerText = 'arquivo';
        this.favBuild(elem.innerText)
        const salvos = this.getById('salvos');
              salvos.append(elem)
      
    //const nome = fileName.toLowerCase();
    }

    deleta(elemento){

        let target = elemento.getAttribute('data-target')
        this.dao.removeStorage(target);
        elemento.parentNode.parentNode.remove();
    }

    restore(){

        console.log('restore')

        this.getById('salvos').innerHTML = '';
        this.getById('aulasSalvas').innerHTML = '';
        //ler os que iniciam por vg
         let str = this.dao.storageReadByTag("vg_");
         

         str = str.sort();
         //criar o arquivo 
         str.forEach(mus => {
            
                this.favBuild(mus);
                let btn = this.getById('vg_' + mus);
                btn.click();
         });

         this.triggersFav();
         
    }

}