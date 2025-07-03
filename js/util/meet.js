 let streams = {};

 async function toggleCamera(event) {
  
    let elem = event.srcElement;
    if(!elem.checked){
       startCamera(elem.value) 
    }
   // startCamera(camNum);
    
 }

async function startCamera(camNum) {
    const videoElem = document.getElementById('video' + camNum);
    const btn = document.getElementById('btnCam' + camNum);

    btn.setAttribute('on',true);

    // Stop previous stream if exists
    if (streams[camNum]) {
        streams[camNum].getTracks().forEach(track => track.stop());
        streams[camNum] = null;
    }

    try {
        // Request permission first to avoid enumerateDevices errors
        await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        if (videoDevices.length === 0) {
            alert('Nenhuma câmera encontrada');
            return;
        }

        // Pick device: camNum 1 = first, camNum 2 = second (if exists)
        const deviceIndex = (camNum - 1 < videoDevices.length) ? camNum - 1 : 0;
        const deviceId = videoDevices[deviceIndex].deviceId;

        const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: deviceId } },
            audio: false
        });
        videoElem.srcObject = stream;
        streams[camNum] = stream;
        btn.textContent = 'Desligar';
        btn.onclick = () => stopCamera(camNum);
    } catch (e) {
        alert('Erro ao acessar a câmera: ' + (e.message || e.name));
    }
}

function stopCamera(camNum) {
    const videoElem = document.getElementById('video' + camNum);
    const btn = document.getElementById('btnCam' + camNum);

    console.log(btn.inn)

    btn.setAttribute('on',false);

    if (streams[camNum]) {
        streams[camNum].getTracks().forEach(track => track.stop());
        streams[camNum] = null;
    }
    videoElem.srcObject = null;
    btn.textContent = 'Ligar' + camNum;
    btn.onclick = () => startCamera(camNum);
}

/**
 * Recebe um MediaStream remoto (por exemplo, via WebRTC) e exibe em um elemento de vídeo.
 * @param {MediaStream} remoteStream - O stream de vídeo recebido de outro computador.
 * @param {string} videoElemId - O id do elemento <video> onde o stream será exibido.
 */
function receiveRemoteStream(remoteStream, videoElemId) {
    const videoElem = document.getElementById(videoElemId);
    if (videoElem) {
        videoElem.srcObject = remoteStream;
        videoElem.play();
    } else {
        console.warn('Elemento de vídeo não encontrado:', videoElemId);
    }
}