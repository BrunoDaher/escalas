

export default class VideoObj {
 
    constructor(){

        this.url = null;
        this.state = 'pause';
        
        

    }


    triggers(){
        document.addEventListener('video-play', (event) => {

            let currentSong = sessionStorage.getItem('currentSong');

            console.log(event.detail, 'recebido')

            if(event.detail=='seq'){
                currentSong = '';
            }
           
            if(currentSong){
                let song = currentSong.toLowerCase() + '_'+ event.detail;
               
                if (this.video) {
                    this.playVideo(song);
                }
            }
            else{
            
            }
       
        });  

        //pra botoes de
         document.addEventListener('video-control', (event) => {

            if(event.detail == 'video-pause'){
                this.video.pause();
            }
            else if(event.detail == 'video-play'){
                this.video.play();
            }
            else if(event.detail == 'video-stop'){
                this.video.stop();
            }
            
       
        });  


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

    async playVideo(song){


        //Dom
        let currentVideo = document.getElementById('currentVideo');
        
        if(currentVideo){

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
                    currentVideo.src = `./data/logo.mp4`
                }
          }
            
        }


    }


    renderVideo(){

         const isMobile = /Mobi|Android/i.test(navigator.userAgent);

             
                let classe = isMobile ? 'mobile' : 'desktop';
                let controls = isMobile ? '' : 'controls';

                    


        return`
             <div id='video' class='off' >
                <video class='video ${classe}' id='currentVideo' ; 
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
  
  let url = await this.supa.getUrlVideo(song);

      if(url) {
       await  this.persiste.saveVideo(url, song);
      }
      else{
        console.log('erro')
      }
        

    return url
      
  }
    


}