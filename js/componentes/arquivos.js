import { Dao } from  '../acesso/dao.js'


export class Arquivos {

    

    constructor(acordes) {
        this.dao = new Dao();
        this.acordes = acordes;
        this.containerId ='painelFiles';
        
    }

    renderPainelFiles() {
        return `
    
            <div class="comp p-1 flex justContBetween textStart ">
                <div>
                    <i class="bi bi-list"></i>
                    <label class="">Lista </label>
                </div>
                <span class="bgDark btn" id="addSong"><i class="bi bi-plus"></i>Nova Música</span>
                
            </div>

            <div id="listaArq" class='my-1' >
                <div id="salvos" class="grid2"></div>
            </div>
           
           <div class="grid my-1 p-1">
                <a class="bi bi-tools colorB comp my-1 p-1 textStart"> Tools
               
                </a>
                 
                ${this.renderDaoBtns()}

            </div>
        
        `;
    }


    renderDaoBtns(){

        return `
        <div  id="daoBtns" class=" justCenter gap2 p-1 flex ">
                <div class="grid rad1 btn1 gap1 f2vh" id="cloudLoad">
                    <i class='bi-cloud-download'></i>
                    <a>Atualizar</a>
                </div>
                <div class="grid rad1 btn1 f2vh" id="export">
                    <i class=' bi-arrow-down'></i>
                    <a>Exportar</a>
                </div>
                <div class="grid rad1 btn1 f1vh" id="load" target="dataLoad">
                    <i class=' bi-arrow-up '></i>
                    <a>Importar</a>
                </div>
            </div>
        `
    }

    renderAll() {

        //iniciando supabase
        this.dao.startSupa();

         this.container = document.getElementById(this.containerId);
        if (this.container) {
            //console.log('Renderizando painel de arquivos');
            this.container.innerHTML = this.renderPainelFiles();
            this.triggers()
        }
        else{
            console.log(22)
        }
    }


    novoArquivo(){

        let dataLoad = document.getElementById('dataLoad');

        if(dataLoad){
            dataLoad.addEventListener('change', async ()=>{
                //console.log('uplad de arquivo')

                //aguarda a persistencia (sessionStorage)
                await this.dao.upload();
                if(this.dao.upload){
                    const elem = document.getElementById('arquivo');
                     this.favBuild(elem.innerText);
                }
             }) 
        }
        else{
            console.log('no upload')
        }
    }

    dataSong(nomeMusica){
    
            let btn = document.getElementById('vg_' + nomeMusica);
            this.acordes.loadSlot(elem);
            btn.click();
   }

    triggers(){

        // Add event listener for custom video-play event
        
            
        this.novoArquivo();

        // Botões de ação (chroma, export, load)
        const chromaBtn = document.getElementById('chroma');
        if (chromaBtn) {
            chromaBtn.addEventListener('click', () => {
                this.acordes.getViolao().chroma(chromaBtn);
            });
        }

        const exportBtn = document.getElementById('export');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
               // alert('Exportar arquivo');
                this.dao.exportData();
                // Lógica para exportar
            });
        }

        //load
        const loadBtn = document.getElementById('load')
        let target = loadBtn.getAttribute('target')
        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                sessionStorage.clear();
                this.dao.preload(target);
            });
        }

        //cloudLoad
        const cloudLoadBtn = document.getElementById('cloudLoad')
           
        if (cloudLoadBtn) {

            cloudLoadBtn.addEventListener('click', async () => {
                    let cloudFiles = await this.dao.cloudSync();
                
                    if(cloudFiles){

                        localStorage.clear();

                        document.getElementById('salvos').innerHTML = '';
                        cloudFiles.forEach(async song => {
                            let songName = song.replace('.json','');

                            let json = await this.dao.getFile(song);
                            this.dao.setLocalDataJSON('vg_' + songName, json);
                            //this.dataSong(songName);
                            this.favBuild(songName);

                            this.triggersFav();
                    });
                   
                    
                }
           })
        }   

         const addSongBtn = document.getElementById('addSong');
            if (addSongBtn) {
                addSongBtn.addEventListener('click', () => {

                this.addSong();
                });
            }

        this.restore();
        this.triggersFav();
    }

    triggersFav() {
        
        let btnsClicaMus = document.querySelectorAll('.clicaMus');
            let btnsDel = document.querySelectorAll('.bi-eraser-fill');
            let btnsPencil = document.querySelectorAll('.bi-pencil');


            btnsClicaMus.forEach(item => {
                item.addEventListener('click', ()=>{
                    this.acordes.clearMemoria();
                        this.dao.clicaMusica(item);
                        this.acordes.loadSlot(item); 

                        console.log(item)
                        //document.getElementById('contexto').innerText = item
                       
                        setTimeout(
                            //
                            ()=>{
                                //disparar um evento q aciona o acordes
                              let btn = document.getElementById('acordes');
                               if(btn){
                                 btn.click();
                               }
                             
                            }
                            ,300)
                       // this.renderVideo(item)
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

            console.log('triggers ')
        
    }

    favBuild(nome){
        
      
        // Cria o template HTML usando template literals
        // /justContBetween
        let template = ` 
            <div id="vg_${nome}"  class=" clicaMus bgDark grid capt p-2 ">
            <div class='grid'>
                <a id="vg_${nome}" class=" f2vh">
                    ${nome}
                </a>
                <img src='https://brunodaher.github.io/escalas/img/alb.png' class='capa filterD' >
            </div>
                
                <a class="clicaMus"></a>
                <div class="flex off">
                    <span data-target='vg_${nome}' role="button" class="btn2 bi-eraser-fill colorE"></span>
                    <span data-target='vg_${nome}' role="button" class="btn2 bi-pencil colorE"></span>
                </div>
            </div>
        `;

        document.getElementById('salvos').innerHTML += template;
        

    }

    addSong(){

        //jogar pro dao
        sessionStorage.clear();
        const elem = document.getElementById('arquivo');
              elem.innerText = 'newSong';
        this.favBuild(elem.innerText)
        const salvos = document.getElementById('salvos');
              salvos.append(elem)
      
    //const nome = fileName.toLowerCase();
    }

    deleta(elemento){

        let target = elemento.getAttribute('data-target')
        this.dao.removeStorage(target);
        elemento.parentNode.parentNode.remove();
    }

    restore(){

        //ler os que iniciam por vg
         let str = this.dao.storageReadByTag("vg_");
         
         //criar o arquivo 
         str.forEach(mus => {
                this.favBuild(mus);
                let btn = document.getElementById('vg_' + mus);
                btn.click();
         });
         
    }

}