import { Dao } from  '../acesso/dao.js'

export class Arquivos {

    constructor(acordes) {
        this.dao = new Dao();
        this.acordes = acordes;
        this.containerId ='painelFiles';
    }


    renderPainelFiles() {
        return `
            <div class="comp p-1 flex justContBetween textStart mb-2">
                <div>
                    <i class="bi bi-list"></i>
                    <label class="">Lista </label>
                </div>
                <label class="btn1" id="addSong"><i class="bi bi-plus"></i>Add</label>
            </div>
          
            <div id="listaArq" class="scroll50 mb-1">
                <ul id="salvos" class="flex"></ul>
            </div>
           
         

            <div id='video'class=' grid my-2' >
                <label class="bi-play-circle comp p-1"> Video</label>
                <video id='currentVideo' 
                    style='object-fit:cover; border-radius:0 0 1vh 1vh ' 
                        width="340" 
                        height="160" 
                        controls
                        autoplay
                        >
                    <source src="" type="video/mp4">
                    Seu navegador não suporta a tag de vídeo.
                </video>
            </div>


               <div class="comp grid">
                <a class="bi p-1 bi-file-earmark-music"> Up / Down</a>
                <div id="daoBtns" class="flexCenter justContAround gap1 bgDark2 p-1">
                    <span class="btn1 bi-mouse3-fill" id="chroma"></span>
                    <span class="btn1 bi-cloud-download-fill" id="export"></span>
                    <span class="btn1 bi-cloud-upload-fill" id="load" target="dataLoad"></span>
                </div>
            </div>
            
        

       
        `;
    }

   async renderVideo(song){
        let video = document.getElementById('currentVideo');
        
        if(video){

          let localVideo = await this.dao.getLocalVideo(song);

          if(localVideo){
            console.log('video local')
            video.src = localVideo;
          }
          else{
            console.log('buscando video na rede')
              const url =  await this.dao.getVideoUrl(song) //api
               
                if(url) {
                   video.src = url
                } else {
                    video.src = `./data/logo.mp4`
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
                await this.dao.upload();
                if(this.dao.upload){
                   
                    const elem = document.getElementById('arquivo');
                    this.favBuild(elem.innerText);
                    let btn = document.getElementById('vg_' + elem.innerText);
                     this.acordes.loadSlot(elem);
                    btn.click();
                }
             }) 
        }
        else{
            console.log('no upload')
        }
    }

    triggers(){

        // Add event listener for custom video-play event
        document.addEventListener('video-play', (event) => {

      
            if(sessionStorage.getItem('currentSong')){

                let song = sessionStorage.getItem('currentSong').toLowerCase() + '_'+ event.detail;

                let video = document.getElementById('currentVideo');
                        if (video) {
                            this.renderVideo(song);
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

        const loadBtn = document.getElementById('load')
        let target = loadBtn.getAttribute('target')
        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                sessionStorage.clear();
                this.dao.preload(target);
            });
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
        const div = document.getElementById('salvos');
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