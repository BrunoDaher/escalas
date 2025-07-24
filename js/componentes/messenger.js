
import { Aux } from "../util/aux.js";

export class Messenger extends Aux{

    constructor(){

        super();
  
        this.role = 'user';
        this.contatos = [];
        this.destinatario = 'adm@virtuaguitar.web.app';
    }

    setFirebase(_firebase){
              this.firebase = _firebase;
    }

    renderMessenger() {

        //cosole.log('renderizando messenger')

         this.messengerHTML = `
                <section>
                    <div class="flex itemCenter justContBetween" style="color: white;">
                        <a id='msgr'class="p-2 bi-chat"> Mensagens </a>
                    </div>
                    <div id="receiving" class="p-2"></div>
                    <div id="sending" class="">
                        <input type="text"
                            id="inputMensagem"
                            class="p-1 flex w-full"
                            style="background: var(--colorA);"
                            placeholder="Digite sua mensagem...">
                    </div>
                </section>
       
        `;
        // Supondo que você tenha um elemento com id 'container' para inserir o messenger


        setTimeout(()=>{
            this.triggers()
        },500);
        //this.triggers();
    }

    enviarMensagem(event) {
        let elem = event.srcElement;
        let conteudo = elem.value;

        // Referência ao banco de dados no Firebase
        //const mensagensRef = this.firebase.database().ref('/mensagens');
        const mensagensRef = this.firebase.getRef('mensagens');
        
       // console.log(this.destinatario)

        // Criação do objeto da nova mensagem
        const novaMensagem = {
            autor: this.firebase.getAuth().currentUser ? this.firebase.getAuth().currentUser.email : "Anônimo", // Apenas o email do autor
            conteudo: conteudo,
            destino:this.destinatario,
            timestamp: Date.now()
        };

        // Envia a mensagem para o banco de dados
        mensagensRef.push(novaMensagem)
            .then(() => {
            
                let html = `
                        <div style="margin-bottom: 10px;">
                            <div style="font-size: 0.8em; color:white;">${novaMensagem.autor}</div>
                            <span class='colorA'>${novaMensagem.conteudo}</span>
                        </div>
                    `;

                    let user = this.firebase.getAuth().currentUser;

            })
            .catch((error) => {
                console.error("Erro ao enviar mensagem:", error);
            });

        // Limpa o campo de entrada
        elem.value = '';


    }

    escutarMinhasMensagens(event){
        
            const user = this.firebase.getAuth().currentUser;
            if (!user) {
                console.error("Usuário não autenticado.");
                return;
            }

            const userMail = user.email;
            let mensagensRef = this.firebase.getRef('/mensagens');

            this.firebase.verificaAcesso().then((autorizado) => {
                if (autorizado) {
                    const contact = this.firebase.getRef('/contatos');
                    contact.once('value').then((snapshot) => {
                        const cont = snapshot.val();
                        if (cont) {
                            Object.entries(cont).forEach(([key, contato]) => {
                                this.contatos.push(contato); // 'this' da classe é preservado
                            });
                            this.firebase.setRole('adm'); // Preservando contexto
                        }
                    });
                } else {
                    //cosole.log("Usuario ok");
                }
            });


            // Query para buscar mensagens trocadas entre dois autores, ordenadas por timestamp
            let query = mensagensRef.orderByChild('timestamp');
        
                query.on('value', (snapshot) => {
                    const mensagens = snapshot.val();
                    const mensagensFiltradas = {};
                    if (mensagens) {
                        Object.entries(mensagens).forEach(([key, mensagem]) => {
                            // Filtra mensagens onde o usuário é autor ou destino
                            if (mensagem.autor === userMail ||mensagem.destino === userMail ) {
                                mensagensFiltradas[key] = mensagem;
                            }
                        });
                    }
        
                // Chama o restante do código usando o snapshot filtrado
                const receiving = document.getElementById('receiving');
                if (receiving) {
                    receiving.innerHTML = '';
                }

                if (mensagensFiltradas) {
                    Object.entries(mensagensFiltradas).forEach(([key, mensagem]) => {
                        let cor = (mensagem.autor !== mensagem.destino && mensagem.autor !== userMail) ? '#4caf50' : '#888';
                        let pos = (mensagem.autor !== mensagem.destino && mensagem.autor !== userMail) ? 'justify-content: end;' : ';';

                        let html = `
                            <div class='grid' style="margin-bottom: 10px;${pos}">
                                <div class='contact'  style=" font-size: 0.8em; color: ${cor};">
                                    ${mensagem.autor ? mensagem.autor : ''}
                                </div>
                                <span class='colorA'>${mensagem.conteudo}</span>
                            </div>
                        `;

                        if (receiving) {
                            let tempDiv = document.createElement('div');
                            tempDiv.innerHTML = html;
                            receiving.appendChild(tempDiv.firstElementChild);
                        }
                    });
                }
            }, (error) => {
                console.error("Erro ao escutar mensagens:", error);
            });

    }

    setDestino(_dest){
        
        //let _dest = event.srcElement.innerText.trim();
        //valida mais uma vez
        
        if(this.contatos.includes(_dest)){
            this.destinatario = _dest;
        }

       // console.log('destinatario',this.destinatario)

    }

    setContacts(){

      //  console.log(this)
    // trigger destino
            let contacts = this.getAllClass('contact');
            
            for(let contact of contacts) {
                contact.onclick = (event) => {
                    
                    this.setDestino(contact.innerText.trim());
                }
            }
    }

    triggers(){

        //cosole.log('setando Triggers')
        
        let divMsgr = document.getElementById('messenger');
            divMsgr.innerHTML = this.messengerHTML;

                divMsgr.onclick = (event)=>{
                    //heranca de classe
                    if(event.target.id === 'messenger') {
                        this.togglePainel('messenger');
                    }  
                
                }
            
            let msg = document.getElementById('btnMsgr');
                msg.onclick = ()=>{
                    //heranca de classe
                    this.togglePainel('messenger');
                }
            
            let inputMensagem = document.getElementById('inputMensagem');
            
                inputMensagem.onkeydown = (event)=>{
                    if(event.key === 'Enter' && inputMensagem.value) {
                        this.enviarMensagem(event);
                    }
                }

            this.escutarMinhasMensagens();

            setTimeout(()=>{
                this.setContacts();
            },1000);
            
    }

}

