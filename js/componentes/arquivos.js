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
                <label class="btn1" id="addSong"><i class="bi bi-plus"></i>Nova Música</label>
                
            </div>

            <div id="listaArq" class="scroll50">
                <ul id="salvos" class="flex"></ul>
            </div>
           
           <div class=" grid me-2 ">
                <a class="bi p-2 comp bi-reload"> Atualizar Lista
                 <span class="btn4 my-2 bi-cloud-download" id="cloudLoad" ></span>
                </a>
                <divhidden  id="daoBtns" class="flexCenter justContAround gap1 ">
                    <span hidden class="btn1 my-2 bi-arrow-down" id="export"></span>
                    <span hidden class="btn1 my-2 bi-arrow-up" id="load" target="dataLoad"></span>
                   
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
            console.log('video local')
            currentVideo.src = localVideo;
          }
          else{
            console.log('buscando video na rede')
              const url =  await this.dao.getVideoUrl(song) //api
                if(url) {
                   htmlVideo.src = url
                } else {
                    htmlVideo.src = `./data/logo.mp4`
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
           
            if(currentSong){
                let song = currentSong.toLowerCase() + '_'+ event.detail;

                let video = document.getElementById('currentVideo');
                if (video) {
                    this.playVideo(song);
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
        
        console.log('favBuild', nome);
        // Cria o template HTML usando template literals
        let template = `
            <div class="flex justContBetween itemCenter textCap ">
                <li id="vg_${nome}" class="clicaMus">${nome}</li>
                <div class="flex ">
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