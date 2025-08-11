
import {Fire}  from './firebase.js';
import {Aux} from '../util/aux.js'
import { Supa } from './supa.js';
import {Persiste} from './persiste.js'
 
const aux = new Aux();

export class Acesso {

    constructor() {
        this.fire = new Fire();
        this.persiste = new Persiste();

    }

    async authFireSupa(){
    // Assume user is already authenticated with Firebase
        const user =  await this.fire.estaLogado();
   
        if (user) {
            let idToken = await this.fire.getIdToken();

            const response = await fetch('https://pqixqvfjfzgcxbkllqfx.supabase.co/functions/v1/verify-firebase-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ idToken })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log(' Usuário verificado:', data);
                    } else {
                        console.log(response)
       //               console.error(' Falha na verificação do token Firebase');
                    }
        }
  }

    async userOn() {
        const isLogged = await this.fire.estaLogado();
      
      
        if (isLogged) {
          //  await this.authFireSupa();
            return true
        } else {
            return false
        }
    }

    getFire()
    {
        return this.fire;
    }

    renderLogon() {
        return `
          
            <div id="acesso" class="grid p-2  gap1  selfCenter me2">
                <input type="text" id="login" placeholder="Login" class="btn2 bgDark2">
                <input type="password" id="senha" placeholder="Senha" class="bgDark2 btn2">
                 <button id="btnSignIn" class="btn3 bi bi-door bordaA m1">Entrar</button>
            <div id='logReturn' class='colorA'></div>
            </div>
           
        `;
    }

    renderUser() {

        let userInfo = this.fire.getAuth().currentUser.email || '';

        aux.getById('userInfo').innerText = userInfo;

        //aux.getById('userInfo').classList.add('bi bi-person-circle');

       // aux.getById('headerContainer').classList.add('flex justContBetween');

        return `
            <section id="divUser" class="grid ">
               
                <div class=' itemCenter flex gap2 '>
                    <small id='btnMsgr'  
                        class="bi-chat" 
                        data-target="messenger">
                         Mensagens
                    </small>
                    <small id='btnSignOut' class="btn bi bi-person-walking ">Sair</small>
                </div>
                 
            </section>
        `;
    }

    showSignIn() {

        aux.getById('dataEnter').innerHTML = this.renderLogon();

         let btnSignin = aux.getById('btnSignIn');

        //trigger botao logon
        btnSignin.onclick = async () => {
            const login = aux.getById('login').value;
            const senha = aux.getById('senha').value;
            try {
                await this.fire.signIn(login, senha);
                this.renderUser();
                this.showUser();
            } catch (error) {

                aux.getById('logReturn').innerHTML = 'e-mail ou senha inválidos';
                

                //alert('Erro ao entrar no app: ' + error.message);
            }
        }
    }

    showUser() {
        aux.getById('hMenu').innerHTML = this.renderUser();
        let btnSignOut = aux.getById('btnSignOut');

       // aux.getById('wellcome').innerHTML += this.renderUser();
        aux.getById('wellcome').classList.remove('off');
        
        aux.getById('enter')?.remove()
        //trigger botao logoff
        btnSignOut.onclick = async () => {
            try {
                await this.fire.signOut();
                this.showSignIn();
            } catch (error) {
                console.log('Erro ao sair da app: ' + error.message);
            }
        }
    }
}

// Exemplo de uso:
// Exemplo de uso:
// const acesso = new Acesso();
// acesso.init();