import { Dao } from  '../acesso/dao.js'



    function testes (texto) {
       return document.getElementById('contexto').innerText = texto;
    }

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

            <div id="listaArq" >
                <ul id="salvos" class="flex"></ul>
            </div>
           
           <div class=" grid bgDark my-1">
                <a class="bi w-100  m-1 bi-reload"> Atualizar Lista
               
                </a>
                <div  id="daoBtns" class="flexCenter justContAround gap1" 
                style='transform:scale(0.8)'
                >   
                    <div class="grid rad1 btn1" id="cloudLoad">
                        <i class='bi-cloud-download f3vh'></i>
                        <a>Atualizar</a>
                    </div>
                    <div class="grid rad1 btn1" id="export">
                        <i class=' bi-arrow-down'></i>
                        <a>Exportar</a>
                    </div>
                    <div class="grid rad1 btn1" id="load" target="dataLoad">
                        <i class=' bi-arrow-up'></i>
                        <a>Importar</a>
                    </div>
                </div>
            </div>
        
        `;
    }

    async playVideo(song){


        //Dom
        let currentVideo = document.getElementById('currentVideo');
        
        if(currentVideo){

          let localVideo = await this.dao.getLocalVideo(song);

          if(localVideo){
            currentVideo.src = localVideo;               
          }
          else{
            console.log('buscando video na rede')
              const url =  await this.dao.getVideoUrl(song) //api
                if(url) {
                   currentVideo.src = url;
                   
                } else {
                    currentVideo.src = `./data/logo.mp4`
                }
          }
            
        }


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
        document.addEventListener('video-play', (event) => {

            let currentSong = sessionStorage.getItem('currentSong');

            console.log(event.detail, 'recebido')

            testes(event.detail);
            if(event.detail=='seq'){
                currentSong = '';
            }
           
            if(currentSong){
                let song = currentSong.toLowerCase() + '_'+ event.detail;

                console.log('song', song)

                let video = document.getElementById('currentVideo');
                if (video) {
                
                    this.playVideo(song);
                }

            }
            else{
            
            }
       
        });  

        document.addEventListener('video-stop', (event) => {

            let currentSong = sessionStorage.getItem('currentSong');
           
            if(currentSong){
                let song = currentSong.toLowerCase() + '_'+ event.detail;

                let video = document.getElementById('currentVideo');
                if (video) {
                    this.stopVideo();
                }
            }
       
        });  
            
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
                       
                        setTimeout(
                            //
                            ()=>{
                                //disparar um evento q aciona o acordes
                              let btn = document.getElementById('acordes');
                               if(btn){
                                 btn.click();
                               }
                             
                            }
                            ,400)
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
            <div class="flex justCenter itemCenter textCap p-1 ">
                <li id="vg_${nome}" class="clicaMus">${nome}</li>
                <div class="flex off ">
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