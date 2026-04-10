import {Dao} from '../acesso/dao.js'
import {Aux} from '../util/aux.js'

const aux = new Aux();

export default class VideoObj {
 
    constructor(dao){

        this.url = null;
        this.state = 'pause';
        this.dao = dao;
       
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

    triggers(){

         this.dao.persiste.listKeys()
            .then(keys => {
                // Aqui dentro você tem acesso à array de chaves
                console.log("Chaves encontradas:", keys);
            // this.dao.persiste.getVideoBlob(event.detail)
            })
            .catch(err => {
                console.error("Erro ao listar:", err);
            });
        
   
    
    document.addEventListener('video-play', (event) => {
        

         this.currentVideo = aux.getById('currentVideo');
         this.currentSong = aux.getById('currentLabelText').innerText.trim();

         this.video.onclick = ()=>{
            const isPlaying = !this.currentVideo.paused;
            if (isPlaying) {
                this.currentVideo.pause();
                this.currentVideo.classList.add('grayscale');
                
            } else {
                this.currentVideo.classList.remove('grayscale');
                this.currentVideo.play();
            }
         }
 
         console.log('lançando evento : ',event.detail, this.currentSong)
         

            this.currentVideo.onplaying = () => {
                document.getElementById('videoLoading').classList.add('off');
            }
            
            if(event.detail=='seq'){
                //this.currentSong = null;
                this.playVideo('seq');
            }
            else{
                if(this.currentSong){
                    let song = this.currentSong.toLowerCase() + '_'+ event.detail;

                        if (this.video) {
                            this.playVideo(song);
                           // console.log('tocando', event.detail, this.url);
                            
                            //so salvar se ja nao tiver no blob
                           // this.dao.saveVideoUrl(this.video.src, song);

                        }
                    }
                else{
                        console.log('no current song')
                    }
            }
        });  

          
        this.triggerControles();
       

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


        //cenarios video

        /*
            mostra braco e video
            mobile-landscape, tablet-landscape e desktop

            alterna braco e video
            mobile-portrait e tablet-portrait
        */
    
             
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
              <a class='bi bi-play-btn-fill   f2em  ' >
                <a id="currentLabelText" class="f2vh "> </a>
               
            </div>
              
                
                    <img src='./data/loading.gif' id='videoLoading'  width="" class='videoLoading off'>
                

                    <video class='video ${css}' id='currentVideo' ; 
                            ${controls}
                            playsinline
                            preload="metadata"
                            autoplay
                            >
                        <source src="" type="video/mp4">
                        Seu navegador não suporta a tag de vídeo.
                    </video>
                
                </div>
            `
    }

 async playVideo(song) {
  // 1. Reset e Feedback Visual Imediato
  this.currentVideo.pause();
  const loadingElement = document.getElementById('videoLoading');

   loadingElement.src = `./data/loading.gif`;
  if(song !== 'seq') {
    loadingElement.classList.remove('off');
  }

  // 2. Limpeza de Cache de Memória (Essencial para não travar o browser)
  if (this.currentVideo.src.startsWith('blob:')) {
    //oculta loading 
    loadingElement.classList.add('off');
    URL.revokeObjectURL(this.currentVideo.src);
  }

  try {
    console.log(song)
    if (song == 'seq') {
        
        this.currentVideo.src = `./data/logo.mp4`;
    } else if (this.currentVideo && song) {
      
      // Tenta Local primeiro (IndexedDB)
      let localBlob = await this.getLocalVideo(song);

      if (localBlob) {
        //oculta loading 
        
        this.currentVideo.src = localBlob;
      } else {
   
        
        // Busca a Signed URL
        const url = await this.getVideoUrl(song);

        if (url) {
            console.log('existe url')
          this.currentVideo.src = url;
          // Dispara o salvamento no IndexedDB sem 'await' 
          // para não segurar o início do vídeo
          this.dao.saveVideoUrl(url, song);
        } else {
            console.log('n existe url')
            loadingElement.src = `./data/emBreve.gif`;
            loadingElement.classList.remove('off');

            console.log(loadingElement)

         // this.currentVideo.src = `./data/emBreve.mp4`;
        }
      }

      // 3. Força o carregamento e aguarda apenas os metadados (rápido)
      //this.currentVideo.load();
      
      // 'loadedmetadata' dispara assim que o browser sabe o tamanho/tempo do vídeo
      this.currentVideo.onloadedmetadata = () => {
        loadingElement.classList.add('off');
        this.currentVideo.play().catch(e => console.warn("Play automático bloqueado"));
      };
    }
  } catch (err) {
    console.error('Erro ao processar vídeo:', err);
    loadingElement.classList.add('off');
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