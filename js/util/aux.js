export class Aux {
    // Elimina uma classe de todos os elementos do array
    arrayRemoveClass(array, classe) {
        array.forEach(elem => {
            elem.classList.remove(classe);
        });
    }

    getById(id){
        return document.getElementById(id);
    }

    getByClass(classe){
        return document.querySelector(`.${classe}`)
    }

    getAllClass(classe){
        return document.querySelectorAll(`.${classe}`)
    }
    
    clone(source, target) {
        // Copiar atributos
        [...source.attributes].forEach(attr => target.setAttribute(attr.name, attr.value));
        
        // Mover filhos
        target.id = source.id;
        target.value = source.innerText;
        target.innerHTML = source.innerHTML;
    }


    // Simula um clique no elemento cujo id está no atributo 'target'
    preload(element) {
        let target = element.getAttribute('target');
        this.getById(target).click();
    }

    // Altera o estado readOnly de todos os elementos com a classe 'painelBtn'
    read(boleano,classe) {
        this.getAllClass(classe).forEach(element => {
            element.readOnly = boleano;
        });
    }

    // Limpa a sessão
    clearSession() {
        sessionStorage.clear();
    }

    // Limpa o armazenamento local
    clearStorage() {
        localStorage.clear();
    }

    // Retorna um array com elementos únicos
    unico(array) {
        return [...new Set(array)];
    }

    // Remove a classe 'name' de todos os elementos que a possuem
    resetClass(name) {
        this.getAllClass(name).forEach(element => {
            element.classList.remove(name);
        });
    }

    // Alterna a classe 'off' no elemento com o id fornecido
    togglePainel(id) {
        this.getById(id).classList.toggle('off');
    }

    removeAll(grupo,classe){

       let btns = this.getAllClass(`${grupo}`);
           btns.forEach(btn => {
            btn.classList.remove(classe);
        }); 

    }

    addAll(grupo, classe){
        let btns = this.getAllClass(`${grupo}`);
           btns.forEach(btn => {
            btn.classList.add(classe);
        }); 
    }
}
