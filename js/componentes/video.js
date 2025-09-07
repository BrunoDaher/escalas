import {Dao} from '../acesso/dao.js'
import {Aux} from '../util/aux.js'

const aux = new Aux();

export default class VideoObj {
 
    constructor(){

        this.url = null;
        this.state = 'pause';
        this.dao = new Dao();
    }

    botoesControle (){
        return    [
                    {id: 'video-pause', icon: 'bi-pause-circle', desc: 'Pausar vídeo'},
                    {id: 'video-play', icon: 'bi-play-circle', desc: 'Reproduzir vídeo'},
                    {id: 'video-slow', icon: 'bi-clock-history', desc: 'Velocidade lenta', extraClass: 'rev'},
                    {id: 'video-normal', icon: 'bi-clock', desc: 'Velocidade normal'},
                    {id: 'video-filter', icon: 'bi-image', desc: 'Aplicar filtro'},
                    
                ] ;
    }

    triggers(){

        

        document.addEventListener('video-play', (event) => {

            let currentSong = sessionStorage.getItem('currentSong');


        
            if(event.detail=='sequencia'){
                currentSong = null;
                this.playVideo('seq');

                 //this.video.src = `./data/logo.mp4`
            }
            else{
                if(currentSong){
                    let song = currentSong.toLowerCase() + '_'+ event.detail;
                    
                        if (this.video) {
                            this.playVideo(song);
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
                                'video-filter': () => {
                                    document.getElementById('video').classList.toggle('filterA')
                                },
                                'video-zoom': () => {
                                    document.getElementById('currentVideo').classList.toggle('zoom2')
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
                      //  console.log(btn)
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

        
            let css =  aux.infoNavegador.desktop && !aux.infoNavegador.mobile ? 'tablet':
                       aux.infoNavegador.tablet ? 'tablet' : 'mobile';

        let controls = aux.infoNavegador.desktop ? 'controls' : '';

        let showVideo = aux.infoNavegador.mobile && !aux.infoNavegador.tablet;

     
             
        return `
           <div id='videoControl' 
                    class='${showVideo ? 'off':'on'} 
                    gap2 p-2 flexCenter abs' >
                         ${this.botoesControle().map(btn => `
                            <span id='${btn.id}' 
                                title='${btn.desc}'
                                class='vControl f2em btn bi rel 
                                ${btn.icon} ${btn.extraClass || ''}'>
                            </span>
                        `).join('')
                     }                
                </div>
               
            <div class='flex itemCenter' id='currentLabel'>
              <img src='https://brunodaher.github.io/escalas/img/alb.png' class='mini  filterD' >
                <a id="currentLabelText" class="f2vh colorA"> </a>
               
            </div>

             <div id='video' class='${css} on' >
              
                    <video class='video ${css}' id='currentVideo' ; 
                            ${controls}
                            playsinline
                            autoplay
                            >
                        <source src="" type="video/mp4">
                        Seu navegador não suporta a tag de vídeo.
                    </video>
                
                </div>
            `
    }

    async playVideo(song){


        
    
        let currentVideo = document.getElementById('currentVideo');
        
        if(currentVideo && song){

          let localBlob = await this.getLocalVideo(song);

            if(localBlob){
                currentVideo.src = localBlob;               
            }
            else{
                
                console.log('buscando video na rede')
                const url =  await this.getVideoUrl(song) //api
                    if(url) {
                         currentVideo.src = url;
                    } else {
                        console.log('video não encontrado')
                        currentVideo.src = `./data/logo.mp4`
                    }
            }
            
        }
        else{
            console.log(currentVideo, song)
        }


    }

    async saveVideo(url,key){

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
              await  this.dao.saveVideoUrl(url, song);
            }
            else{
                console.log('erro')
            }
                
        return url
            
    }
        
  

}