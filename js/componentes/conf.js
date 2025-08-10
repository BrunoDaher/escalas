export class CameraGrid {
   
    constructor() {
        this.cameras = [1, 2];
        this.init();
    }

    init() {
        // Verifica se o elemento painelMeet existe, se não, cria e adiciona ao body
        this.painelMeet = document.getElementById('painelMeet');
      
        // Verifica se o elemento camera-grid existe, se não, cria e adiciona ao painelMeet
        this.cameraGrid = document.getElementById('camera-grid');
        if (!this.cameraGrid) {
            this.cameraGrid = document.createElement('div');
            this.cameraGrid.id = 'camera-grid';
            this.painelMeet.appendChild(this.cameraGrid);
        }

        this.renderCameras();
    }

    renderCameras() {
        this.cameraGrid.innerHTML = this.cameras.map(i => `
            <div id="camera${i}" class="camera">
                <video id="video${i}" autoplay playsinline style="object-fit:cover; border-radius:8px; width:40vh;"></video>
                <label for="btnCam${i}" class="f2em btn1 flex itemsCenter gap1">
                    <i id="iconCam${i}" class="bi-camera"></i>
                    <span class="switch">
                        <input onclick="toggleCamera(event)" value="${i}" id="btnCam${i}" type="checkbox" checked="false">
                        <span class="slider round"></span>
                    </span>
                </label>
            </div>
        `).join('');
    }
}
