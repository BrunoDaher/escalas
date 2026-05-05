import { Aux } from '../../util/aux.js';


export class ChordFactory extends Aux {
    constructor() {
        super();
        this.notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        this.scales = {
            major: [0, 2, 4, 5, 7, 9, 11],
            minor: [0, 2, 3, 5, 7, 8, 10],
            harmonic_minor: [0, 2, 3, 5, 7, 8, 11]
        };
        this.variacao = {
            triade: [0, 4, 7],
            tetrade: [0, 4, 7, 11],
            pentablues: [0, 3, 5, 7, 10],
        };  
        this.adicional = {
            nine: 1, //segundo grau na proxima oitava
            seven:7, //considerando 0 start
            quarta:3, //considerando 0 start
            quartamajor:4,
            sevenmajor:8,
            sevenminor:6,
        };

        this.leituraAcorde();
        
    }

    leituraAcorde(){
         
    }

    getAdicional(array){
        
        return  array[this.adicional[item]];
    }

    getVariation(escala, variacao) {
        if (!variacao) {
            return this.scales[escala] || this.scales.major;
        }

        return this.variacao[variacao] || this.scales[escala] || this.scales.major;
    }

    getChord(nota, escala, variacao) {
        // Retorna as notas da escala para a nota raiz, tipo de escala e variação
        const intervals = this.getVariation(escala, variacao);
        const rootIndex = this.notes.indexOf(nota);
        if (rootIndex === -1) return [];
        return intervals.map(interval => this.notes[(rootIndex + interval) % 12]);
    }

    getHarmonics(nota, graus, escala) {
        // Para escalas harmônicas, assume graus como 'harmonic' para menor harmônica
        if (escala === 'minor' && graus === 'harmonic') {
            return this.getChord(nota, 'harmonic_minor', '');
        }
        // Caso contrário, retorna array vazio ou implementar lógica adicional
        return [];
    }
}