

import { Acesso} from './acesso/acesso.js';

import { Dragula } from './util/dragula.js';
import { Acordes } from './componentes/acordes.js';
import { Opcoes } from './componentes/opcoes.js';
import { Arquivos } from './componentes/arquivos.js';
import { Messenger } from './componentes/messenger.js'
import { Metronomo } from './componentes/inst/metronomo.js'
import { Aux} from './util/aux.js'
import { Main } from './componentes/main.js'

             
const acordes = new Acordes();

const dragula = new Dragula();
const opcoes = new Opcoes();
const acesso = new Acesso();

let role = await acesso.getFire().getRole();

const arquivos = new Arquivos(acordes, role);
const msg = new Messenger();
const metronomo = new Metronomo();
const aux = new Aux();
const main = new Main(acordes.dao);

aux.refreshNav()

   //sw//
        if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("./service-worker.js")
            .then(reg => console.log("PWA pronto para instalação"))
            .catch(err => console.log("Erro ao registrar SW", err));
        });
        }
        else{
            console.log('no sw')
        }


  init();

  
      
 function init() {


     



      acesso.fire.auth.onAuthStateChanged(async (user) => {
          if (user) {
             role = await acesso.getFire().getRole();
             
             acesso.showUser();
              main.build();
              triggers();
             
          } else {
              aux.getById('main')?.remove();           
              acesso.showSignIn();
          }
      });
 }

 function triggers(){

    //carregamentos
    msg.setFirebase(acesso.getFire())
    msg.renderMessenger();  
    opcoes.init();
    acordes.renderAll();
    arquivos.renderAll(role);
    metronomo.init();  
    dragula.init();
    
    main.renderSections();
      
      aux.getById('arquivos').click();
 };    

