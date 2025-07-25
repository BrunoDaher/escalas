

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

      let tester = false;

     // if(!checkMobile() || tester){
        init();
     // }
     // else{
        
        /*
        aux.getById('main')?.remove();

        ['main','hMenu','footer'].forEach(elem => {
          let el = aux.getById(elem);
             el?.remove();
        });
     
        let platforms = document.getElementById('platforms');
          platforms.classList.remove('off');      
          */
    //  }
 
   
function checkMobile() {
    let agent = navigator.userAgent.toLowerCase();
    //console.log('checkMobile', agent);
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(agent);
 }    
   
 function init() {

      acesso.fire.auth.onAuthStateChanged((user) => {
          if (user) {
            console.log('user on')
       
              acesso.showUser();
              main.build();
              triggers();
               //aux.getById('main').classList.remove('off');
              //aux.getById('braco').classList.remove('off');

              //document.getElementById('main').classList.remove('off');
          } else {
           // document.location.reload();
            
              console.log('user off');
              //acesso.showSignIn();
               
              
              aux.getById('main')?.remove();           
              //location.reload()
          }
      });
 }

 function triggers(){

    console.log('triggers')
    //carregamentos
    msg.setFirebase(acesso.getFire())
    msg.renderMessenger();  
    opcoes.init();
    acordes.renderAll();
    arquivos.renderAll();
    metronomo.init();  
    dragula.init();

    

    if(checkMobile()){
      main.addFooter();

      console.log(this)
      aux.getById('acordes').click();
    }
 };    

