

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
const arquivos = new Arquivos(acordes);
const dragula = new Dragula();
const opcoes = new Opcoes();
const acesso = new Acesso();
const msg = new Messenger();
const metronomo = new Metronomo();
const aux = new Aux();
const main = new Main();

      let user = await acesso.userOn();

      if(!user){
        acesso.showSignIn();
      }
      else{
        acesso.showUser();
      }
      
      init();
   
 function init() {

      acesso.fire.auth.onAuthStateChanged((user) => {
          if (user) {
              acesso.showUser();
              main.build();
              triggers();
             
          } else {
              aux.getById('main')?.remove();           
          }
      });
 }

 function triggers(){

    //carregamentos
    msg.setFirebase(acesso.getFire())
    msg.renderMessenger();  
    opcoes.init();
    acordes.renderAll();
    arquivos.renderAll();
    metronomo.init();  
    dragula.init();
    
        main.renderFooter()
      
      aux.getById('arquivos').click();

      
      
      
      
    
 };    

