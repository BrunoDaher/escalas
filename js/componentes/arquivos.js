import { Dao } from  '../acesso/dao.js'

export class Arquivos {

    constructor(acordes, role) {
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
    
            <div class="comp p-1 flex justContBetween textStart ">
                <div>
                    <i class="bi bi-list"></i>
                    <label class="">Meus Arquivos </label>
                </div>

                <span  class="${controlesShow} bgDark btn" id="addSong"><i class="bi bi-plus"></i>Nova Música</span>
                
            </div>

            ${this.renderMeusArquivos()}

             <div class=" comp p-1 flex justContBetween textStart ">
                <div>
                    <i class="bi bi-list"></i>
                    <label class="">Aulas</label>
                </div>

                <span  class="${controlesShow} bgDark btn" id="addSong"><i class="bi bi-plus"></i>Nova Música</span>
                
            </div>

            ${this.renderMinhasAulas()}
            
            
           
           <div class="grid my-1 ">
                <a class="bi bi-tools colorB comp my-1 p-1 textStart"> Tools
               
                </a>
                 
                ${this.renderDaoBtns()}

            </div>
        
        `;
    }

    renderMeusArquivos(){

        return`
        
            <div id="listaArq" class='p-2 my-1' >
                <div id="salvos" class="flex"></div>
            </div>`
    }

    renderMinhasAulas(){
        
        return`
        
            <div id="minhasAulas" class=' p-2 my-1' >
                <div id="aulasSalvas" class="flex"></div>
            </div>`
    }

    renderDaoBtns(){

        
        let controlesShow = this.role == 'adm' ? '':'off';

        return `
        <div  id="daoBtns" class=" justLeft gap2 p-1 flex ">
                <div class="grid rad1 btn1 gap1 f2vh" id="cloudLoad">
                    <i class='bi-arrow-counterclockwise'></i>
                    <a>Atualizar</a>
                </div>

                <div class='${controlesShow} flex'>
                    <div class="grid rad1 btn1 f2vh" id="export">
                        <i class=' bi-arrow-down'></i>
                        <a>Exportar</a>
                    </div>
                    <div class="grid rad1 btn1 f2vh" id="load" target="dataLoad">
                        <i class=' bi-arrow-up '></i>
                        <a>Importar</a>
                    </div>
                </div>

            </div>
        `
    }

    renderAll(role) {


        this.role = role;
        //iniciando supabase
        this.dao.startSupa();

        

         this.container = document.getElementById(this.containerId);
        //console.log(this.container)
        if (this.container) {
            ////console.log('Renderizando painel de arquivos');
            this.container.innerHTML = this.renderPainelFiles();
            //this.update();
            this.triggers();
           
        }
        else{
         //  //console.log(22)
        }
    }


    novoArquivo(){

        
        let dataLoad = document.getElementById('dataLoad');

        if(dataLoad){
            dataLoad.addEventListener('change', async ()=>{
                ////console.log('uplad de arquivo')

                //aguarda a persistencia (sessionStorage)
                await this.dao.upload();
                if(this.dao.upload){
                    const elem = document.getElementById('arquivo');
                     this.favBuild(elem.innerText.trim());
                }
             }) 
        }
        else{
            //console.log('no upload')
        }
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
           //console.log('ss')
                cloudLoadBtn.addEventListener('click', async ()=>{
                    
                   //console.log('cloudLoad')
                    await this.update()

                    }
                );
           
        }   
        else{
           //console.log('no cloudLoad')   
        }

        const addSongBtn = document.getElementById('addSong');
        if (addSongBtn) {
            addSongBtn.addEventListener('click', () => {

            this.addSong();
            this.triggersFav();
            });
        }

           this.restore();
           this.triggersFav();
       
        
    }


   async update(){
        
            let cloudFiles = await this.dao.cloudSync();

                    if(cloudFiles){

                        document.getElementById('salvos').innerHTML = '';
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
        
       //console.log('trigger favoritos')
        let btnsClicaMus = document.querySelectorAll('.clicaMus');
            let btnsDel = document.querySelectorAll('.bi-eraser-fill');
            let btnsPencil = document.querySelectorAll('.bi-pencil');


            btnsClicaMus.forEach(item => {
                item.addEventListener('click', ()=>{
                   this.clicaMusica(item);
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
         
        document.getElementById('currentLabelText').innerText = item.innerText
         
                        this.acordes.clearMemoria();
                        this.dao.clicaMusica(item);
                        this.acordes.loadSlot(item); 

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
    }

    favBuild(nome){
    

        let urlImg = this.dao.urlImg(nome) ;

        let css = urlImg ? `background-image : url('${urlImg}')` :'';

        let controlesShow = this.role == 'adm' ? '':'off';
       
        
    
        // Cria o template HTML usando template literals
        // /justContBetween
        let template = ` 
            <div name=${nome} id="vg_${nome}" style="${css}"  class=" rad1 bgDark songAlb filterB grid capt p-1 clicaMus">
                    <div  class='gap1 grid '>
                        <legend class="f2vh fundoB filterE">${nome}</legend>
                        <div class="flex ${controlesShow}">
                            <span data-target='vg_${nome}' role="button" class="btn1  bi-arrow-clockwise "></span>
                            <span data-target='vg_${nome}' role="button" class="btn1 bi-eraser-fill "></span>
                            <span data-target='vg_${nome}' role="button" class="btn1 bi-pencil "></span>
                        </div>
                    </div>
            </div>
        `;
        
        

        let div =  this.aulas.includes(nome)? 'aulasSalvas' : 'salvos';

        document.getElementById(div).innerHTML += template;
        

    }

    addSong(){

       //console.log('addSong')
        //jogar pro dao
        sessionStorage.clear();
        const elem = document.getElementById('arquivo');
              elem.innerText = 'arquivo';
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

        document.getElementById('salvos').innerHTML = '';
        //ler os que iniciam por vg
         let str = this.dao.storageReadByTag("vg_");
         
        

         str = str.sort();
         //criar o arquivo 
         str.forEach(mus => {
            
                this.favBuild(mus);
                let btn = document.getElementById('vg_' + mus);
                btn.click();
         });

         this.triggersFav();
         
    }

}