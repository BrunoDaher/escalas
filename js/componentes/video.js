import {Dao} from '../acesso/dao.js'
import {Aux} from '../util/aux.js'

const aux = new Aux();

export default class VideoObj {
 
    constructor(dao){

        this.url = null;
        this.state = 'pause';
        this.dao = dao;
       
        this.loadingElement = document.getElementById('videoLoading');
    }

    botoesControle (){
        return    [
                    //{id: 'video-pause', icon: 'bi-pause-circle', desc: 'Pausar vídeo'},
                    //{id: 'video-play', icon: 'bi-play-circle', desc: 'Reproduzir vídeo'},
                    {id: 'video-slow', icon: 'bi-clock-history', desc: 'Velocidade lenta', extraClass: 'rev'},
                    {id: 'video-normal', icon: 'bi-clock', desc: 'Velocidade normal'},
                 //   {id: 'video-filter', icon: 'bi-image', desc: 'Aplicar filtro'},
                    
                ] ;
    }


    seletores(){
        this.loadingElement = document.getElementById('videoLoading');
        this.video = document.getElementById('currentVideo');
        this.currentSong = document.getElementById('currentLabelText');
        this.currentVideo = document.getElementById('currentVideo');    
    }

    triggers(){

         this.dao.persiste.listKeys()
            .then(keys => {
                // Aqui dentro você tem acesso à array de chaves
                //console.4("Chaves encontradas:", keys);
            // this.dao.persiste.getVideoBlob(event.detail)
            })
            .catch(err => {
                console.error("Erro ao listar:", err);
            });
                
            document.addEventListener('video-play', async event => {
                
                await this.seletores();
                
                this.onvideoplay(event.detail);
            });  

    this.triggerControles();

    }

    onvideoplay(detail){
 
        {   
        //console.log(detail)
        this.currentSong = detail.mus;
         
         this.video.onclick = ()=>{
            const isPlaying = !this.currentVideo.paused;
            this.currentVideo.classList.toggle('grayscale');
            if (isPlaying) {
                this.currentVideo.pause();
            } else {
                this.currentVideo.play();
            }
         }
 
         //console.log('lançando evento : ',detail, this.currentSong)

            this.currentVideo.onplaying = () => {
                this.loadingElement.classList.add('off');
                let btnVideo = document.getElementById('btnVideo');
                
                if(!btnVideo.checked) {
                    btnVideo.click();
                }
                
            }
            
            this.playVideo(detail);
                 
            
        }
    }

    triggerControles(){
        let btnsControle = document.querySelectorAll('.vControl'); 
                btnsControle.forEach(btn => {

                    btn.onclick = ()=>{
                        
                        const videoActions = {
                                'video-play': (video) => video.play(),
                                'video-pause': (video) => video.pause(),
                                'video-slow': (video) => video.playbackRate = 0.5,
                                'video-normal': (video) => video.playbackRate = 1,
                                //'video-filter': () => {document.getElementById('video').classList.toggle('filterA')},
                                'video-zoom': () => {
                                    this.currentVideo.classList.toggle('zoom2')
                                },
                            };

                        if (videoActions[btn.id]) {
                            videoActions[btn.id](this.video);
                            btnsControle.forEach(element => {
                                element.classList.remove('active');
                            });
                            btn.classList.add('active');
                        }                
                    }

                    btn.onmouseover = ()=>{
                      
                        //btn.insertAdjacentHTML('beforebegin', `<div class="popup" style=" transform:translateX(-50%); background:#000; color:#fff; padding:4px 8px; border-radius:4px; font-size:12px;">${btn.getAttribute('title')}</div>`);
                      //  //console.log(btn)
                       setTimeout(() => {
                           // btn.removeChild(btn.lastChild);
                        }, 210);
                    }

                } );

    }

    setVideoId(id){
        this.video = document.getElementById(id);
    }

    setUrl(url){

        this.url = url;
    }

    pause(){
        this.video.pause();
    }

    play(){
        this.video.play();
    }

    renderVideo(){

            aux.refreshNav();

            let css = aux.infoNavegador.mobile ? 'mobile' : aux.infoNavegador.tablet ? 'tablet' : 'desktop';

        let controls = aux.infoNavegador.desktop ? 'controls' : 'no-controls';

        let showVideo = aux.infoNavegador.landscape;

       
             
        return `
        
               
             <div id='video' class='${css} ${aux.infoNavegador.portrait || aux.infoNavegador.desktop ? 'on' : 'off'}' >

                <div id='videoControl' 
                    class='${showVideo ? 'on':'on'} 
                    gap2 p-2 flexCenter abs w-fit' >
                         ${this.botoesControle().map(btn => `
                            <span id='${btn.id}' 
                                title='${btn.desc}'
                                class='vControl f2em btn bi rel 
                                ${btn.icon} ${btn.extraClass || ''}'>
                            </span>
                        `).join('')
                     }                
                </div>

                    <div class='flex itemCenter boxC colorD' id='currentLabel'>
                        <a class='bi bi-play-btn-fill f2em'></a>
                        <a id="currentLabelText" class="f2vh"> </a>
                    </div>

                     
                    <div  id='videoLoading' class='videoLoading flex justCenter off itemCenter  colorD'>

                        <div class="pick">
                            <img  src='./img/alb.png' width="16vh" height='16vh' class=''>
                            
                        </div>
                 
                    <!--<img  src='./data/loading.gif' width="" class='off videoLoading '>-->
                        
                    </div>

                    <video class='video ${css}' id='currentVideo'  
                            ${controls}
                            playsinline
                            preload="metadata"
                            autoplay
                            >
                        <source src="./data/abertura.mp4" type="video/mp4">
                        Seu navegador não suporta a tag de vídeo.
                    </video>
                
                </div>
            `
    }

 async playVideo(detail) {

  this.loadingElement.classList.remove('off');
  // 1. Reset e Feedback Visual Imediato

  
  this.currentVideo.pause();

  // 2. Limpeza de Cache de Memória (Essencial para não travar o browser)
  if (this.currentVideo.src.startsWith('blob:')) {
    //oculta loading 
    this.loadingElement.classList.add('off');
    URL.revokeObjectURL(this.currentVideo.src);
  }

  try {
    let fileName = `${detail.mus}_${detail.secao}`;
    
    //apresentacao do video local ou online
    if (detail.secao == 'dados') {
         // Busca a Signed URL
        const urlDados = await this.getVideoUrl(fileName);

        if (urlDados) {
          this.currentVideo.src = urlDados;
        }
        else{

              this.loadingElement.classList.add('off');
            this.currentVideo.src = `./data/pratica.mp4`;
        }
    } 
    else if (this.currentVideo && detail.mus) {
      
      // Tenta Local primeiro (IndexedDB)
      let localBlob = await this.getLocalVideo(fileName);

      if (localBlob) {
        
        this.currentVideo.src = localBlob;
      } else {

        const url = await this.getVideoUrl(fileName);

        if (url) {
          this.currentVideo.src = url;
          this.dao.saveVideoUrl(url, fileName);
        } 
        else{
            this.currentVideo.src = `./data/pratica.mp4`;
        }
      }

      this.currentVideo.onloadedmetadata = () => {
        this.loadingElement.classList.add('off');
        this.currentVideo.play().catch(e => console.warn("Play automático bloqueado"));
      };
    }
  } catch (err) {   
    console.error('Erro ao processar vídeo:', err);
    this.loadingElement.classList.remove('off');
  }
}

    
    async getLocalVideo(key) {
        return new Promise((resolve, reject) => {
        const request = indexedDB.open("virtuaguitar");

        request.onerror = (event) => {
            console.error("Erro ao abrir o banco IndexedDB:", event.target.error);
            reject(event.target.error);
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['videos'], 'readonly');
            const objectStore = transaction.objectStore('videos');

            objectStore.openCursor().onsuccess = (event) => {
            const cursor = event.target.result;
            if (!cursor) {
                // Fim dos registros
                resolve(null);
                return;
            }

            if (cursor.key === key) {
                const blob = cursor.value;
                const url = URL.createObjectURL(blob);
                resolve(url); // ✅ retorna a URL
            } else {
                cursor.continue();
            }
            };

            objectStore.openCursor().onerror = (event) => {
            console.error("Erro ao iterar o object store:", event.target.error);
            reject(event.target.error);
            };
        };
        });
    }

    async getVideoUrl(song) {
    
        song = song.toLowerCase();
        let url = await this.dao.getUrlVideo(song);

            if(url) {
               //console.log('url encontrado na rede', song)
                
            }
            else{
                //console.log('video nao encontrado')
            }
                
        return url
            
    }
        
  

}