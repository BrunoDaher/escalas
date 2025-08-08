import { Supa } from './supa.js';
import { Persiste } from './persiste.js';

export class Dao {
  constructor() {
 
  }

  storageReadByTag(tag) {

    let obj = [];

    Object.keys(localStorage).forEach(element => {
      if (element.startsWith(tag)) {
        let nome = element.substring(3, element.length);
        obj.push(nome);
      }
    });

    return obj
  }

  preload(target) {
      document.getElementById(target).click();
  }

  startSupa(){
        this.supa = new Supa();
        this.supa.start();

      
        this.persiste = new Persiste();
        this.persiste.init();
  }

  async getUrlVideo(song){
    this.startSupa();
    return await this.supa.getUrlVideo(song);
  }

  async saveVideoUrl(url,song){
    await this.persiste.saveVideo(url,song)
  }

  async getFile(song){
    return this.supa.getFile(song)
  }

  async cloudSync(){
    
   return await this.supa.cloudSync();
  }

  async getJsonUrl(song){


     let url = await this.supa.getJsonUrl(song);

      if(url) {
       //await // this.persiste.saveVideo(url, song);
       return url
      }
      else{
        // //console.log('erro')
        return false
      }

      return url
        
  }

  async checkUrl(url) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      return res.ok;
    } catch {
      return false;
    }
  }

  async validateUrl(url) {
    const isValid = await checkUrl(url);
    if(isValid) {
      console.log('Image URL is valid');
    } else {
      console.log('Image URL is invalid');
    }
  }

  preloadImage(imagePath) {
    // Create new image element
    const img = new Image();
    
    // Set source to trigger preload
    img.src = `img/${imagePath}`;
    
    // Return promise that resolves when image loads
    return new Promise((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
    });
  }  

  clicaMusica(mus) {

    console.log(mus)
    sessionStorage.clear();

    let chave = mus.id;
    let lista = JSON.parse(localStorage.getItem(chave));

    let texto = mus.innerText;
    texto = texto.charAt(0).toUpperCase() + texto.slice(1);

    sessionStorage.setItem('currentSong', texto);
    document.getElementById('arquivo').innerText = texto;

    Object.keys(lista).forEach(chave => {
      sessionStorage.setItem(chave, lista[chave]);
    });

    document.querySelectorAll('.clicaMus').forEach(el => {
      el.classList.remove('active');
    });
    mus.classList.add('active');

    document.getElementById('seq').innerHTML = '';
  }

  removeSlot(slotId) {
    document.getElementById(slotId).remove();
    this.removeSession(slotId);
    this.salvaLocal();
  }

  isStored(id) {
    return sessionStorage.getItem(id) ? true : false;
  }

  resetById(id) {
    let arr = [];
    sessionStorage.setItem(id, JSON.stringify(arr));
  }

  clone(nome, id) {
    sessionStorage.setItem(nome, sessionStorage.getItem(id));
  }

  getDataJSON(id) {
    return sessionStorage.getItem(id) ? JSON.parse(sessionStorage.getItem(id)) : null;
  }

  getLocalDataJSON(id) {
    return localStorage.getItem(id) ? JSON.parse(localStorage.getItem(id)) : null;
  }

  setLocalDataJSON(id, data) {
    console.log('salvando no localstorage')
    localStorage.setItem(id, JSON.stringify(data));
  }

  setDataJSON(id, data) {
    sessionStorage.setItem(id, JSON.stringify(data));

     this.salvaLocal();
  }

  existsOn(elem, id) {
    let nts = sessionStorage.getItem(id);
    return nts && nts.includes(elem) ? true : false;
  }

  removeStorage(id){

    localStorage.removeItem(id);
  }

  removeSession(id) {
    let session = sessionStorage;
    let labelObj = session.label ? JSON.parse(session.label) : {};
    let veloObj = session.velo ? JSON.parse(session.velo) : {};

    delete labelObj[id];
    delete veloObj[id];

    sessionStorage.setItem('label', JSON.stringify(labelObj));
    sessionStorage.setItem('velo', JSON.stringify(veloObj));
    sessionStorage.removeItem(id);
  }

  toggleArray(id, elem) {
    let saved = this.getDataJSON(id);
    let arr = saved ? saved : [];
    arr.includes(elem) ? arr.splice(arr.indexOf(elem), 1) : arr.push(elem);
    this.setDataJSON(id, arr);
  }

  salvaLocal() {
    let nome = sessionStorage.getItem('currentSong') || document.getElementById('arquivo').innerText;
    let objetos = {};

    Object.keys(sessionStorage).forEach(element => {
      objetos[element] = sessionStorage.getItem(element);
    });

    let sortedKeys = Object.keys(objetos).sort();
    let sortedObjetos = {};
    sortedKeys.forEach(key => {
      sortedObjetos[key] = objetos[key];
    });
    objetos = sortedObjetos;

    this.setLocalDataJSON('vg_' + nome, objetos);
  }

  exportData() {
    let objetos = {};

    Object.keys(sessionStorage).forEach(element => {
      objetos[element] = sessionStorage.getItem(element);
    });

    let currentSong = sessionStorage.getItem('currentSong');
    this.makeFile(currentSong + '.json', sessionStorage);
  }

  makeFile(name, sessionStorageObj) {
    let fileName = name;

    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";

    var json = JSON.stringify(sessionStorageObj),
      blob = new Blob([json], { type: "octet/stream" }),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  restart() {
    document.getElementById('memoria').innerHTML = '';

    Object.keys(sessionStorage).forEach(element => {
      sessionStorage.removeItem(element);
    });

    document.getElementById('salvos').innerHTML = '';
  }


  async upload() {
    const fileInput = document.querySelector('input[type=file]');
    const file = fileInput && fileInput.files[0];

    if (!file) {
      return false;
    }

    const reader = new FileReader();
    const fileName = file.name.split('.')[0];

    const elem = document.getElementById('arquivo');
    elem.innerText = fileName;
    const nome = fileName.toLowerCase();

    return new Promise((resolve) => {
      reader.onload = () => {
        try {
          const lista = JSON.parse(reader.result);

          //persiste na sessao session
          Object.entries(lista).forEach(([chave, valor]) => {
            sessionStorage.setItem(chave, valor);
          });

          this.salvaLocal();

          resolve(true);
        } catch (e) {
          resolve(false);
        }
      };

      reader.readAsText(file);
    });
  }


}
