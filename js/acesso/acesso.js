
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
          
            <div id="acesso" class="grid p-2  gap1">
                <input type="text" id="login" placeholder="Login" class="bordaA btn2">
                <input type="password" id="senha" placeholder="Senha" class="bordaA btn2">
                
            </div>
            <button id="btnSignIn" class="btn3 bi bi-door bordaA m1">Entrar</button>
        `;
    }

    renderUser() {

        let userInfo = this.fire.getAuth().currentUser.email || '';

        return `
            <section id="divUser" class="grid gap1 itemCenter m-1 ">
               
                <div class='flex itemCenter '>
                    <span id='btnMsgr'  
                        class="btn bi-chat flex gap1" 
                        data-target="messenger"> Mensagens
                    </span>
                    <span id='btnSignOut' class="flex btn bi bi-person-walking "> Sair</span>
                </div>
                 <i id='userInfo' class=" bi bi-person-circle flex itemCenter">
                 ${userInfo}
                </i>
            </section>
        `;
    }

    showSignIn() {

        aux.getById('hMenu').innerHTML = this.renderLogon();

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
                alert('Erro ao entrar no app: ' + error.message);
            }
        }
    }

    showUser() {
        aux.getById('hMenu').innerHTML = this.renderUser();
        let btnSignOut = aux.getById('btnSignOut');

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