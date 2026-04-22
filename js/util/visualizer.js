export class Visualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        
        // Força a resolução interna para 1080p (Full HD)
        this.canvas.width = 1920;
        this.canvas.height = 1080;
        
        this.numBars = 64;
        this.frequencies = new Array(this.numBars).fill(0);
        this.active = false;
    }

    start() {
        if (this.active) return;
        this.active = true;
        this.render();
    }

    stop() {
        this.active = false;
    }

    render() {
        if (!this.active) return;

        // Limpa o frame com transparência ou cor de fundo
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const spacing = 12;
        const barWidth = (this.canvas.width / this.numBars) - spacing;

        for (let i = 0; i < this.numBars; i++) {
            // Algoritmo de oscilação orgânica (simula picos de áudio)
            const time = Date.now() * 0.005;
            const noise = Math.sin(time + i * 0.2) * 150;
            const targetHeight = Math.random() * 300 + noise + 400;
            
            // Interpolação para suavizar o movimento das barras
            this.frequencies[i] += (targetHeight - this.frequencies[i]) * 0.15;

            const h = this.frequencies[i];
            const x = i * (barWidth + spacing);
            const y = this.canvas.height - h;

            // Gradiente inspirado no tema do appEscalas
            const gradient = this.ctx.createLinearGradient(0, this.canvas.height, 0, y);
            gradient.addColorStop(0, '#275b8b');   // --colorA (Azul Escuro)
            gradient.addColorStop(0.6, '#0c74b9'); // --colorC (Azul Vibrante)
            gradient.addColorStop(1, '#ffffff');   // Brilho no topo

            this.ctx.fillStyle = gradient;
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = 'rgba(12, 116, 185, 0.5)';
            
            // Desenha a barra com topo arredondado
            this.ctx.beginPath();
            this.ctx.roundRect(x, y, barWidth, h, [15, 15, 0, 0]);
            this.ctx.fill();
        }

        requestAnimationFrame(() => this.render());
    }
}