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
                    {id: 'video-pause', icon: 'bi-pause-circle'},
                    {id: 'video-play', icon: 'bi-play-circle'},
                    {id: 'video-slow', icon: 'bi-clock-history', extraClass: 'rev'},
                    {id: 'video-normal', icon: 'bi-clock'},
                    {id: 'video-filter', icon: 'bi-image'},
                    {id: 'video-zoom', icon: 'bi-zoom-in'},
                ] ;
    }

    triggers(){

        console.log('video triggers')

        document.addEventListener('video-play', (event) => {

            let currentSong = sessionStorage.getItem('currentSong');
        
            if(event.detail=='sequencia'){
                currentSong = null;
                this.playVideo(null);

                 this.video.src = `./data/logo.mp4`
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
                                    document.getElementById('currentVideo').classList.toggle('filterA')
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
        
             
        return `
           <div id='videoControl' 
                    class=' ${!aux.infoNavegador.mobile ? 'on':'off'} 
                    gap2 p-2 flexCenter abs' >
                    ${this.botoesControle().map(btn => `
                            <span id='${btn.id}' 
                                class='vControl f2em btn bi 
                                ${btn.icon} ${btn.extraClass || ''}'>
                            </span>
                        `).join('')
                     }                
                </div>
               
             <div id='video' class='${css}' >
              
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
            alert(error)
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