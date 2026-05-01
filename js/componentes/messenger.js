
import { Aux } from "../util/aux.js";


export class Messenger extends Aux{

    constructor(){

        super();


        this.role = 'user';
        this.contatos = [];
        
        //default
        this.destinatario = 'adm@virtuaguitar.web.app';

        
    }

    

    setFirebase(_firebase){
              this.firebase = _firebase;

              this.role = this.firebase.role;
    }

  
     updateContatos() {

             const contatosDiv = this.getById('contatos');
            
             if (contatosDiv) {
                contatosDiv.innerHTML = '';
                contatosDiv.className='gap2 flex p-2 scroll25 my-1 off'
                
                this.contatos.forEach(contato => {
                    const span = document.createElement('span');
                    span.className = 'bi bi-person bordaA boxC colorE contact grid';
               
                    span.textContent = contato.split('@')[0];    
                    span.id = contato;        

                    span.addEventListener('click', () => {

                        this.arrayRemoveClass(Array.from(contatosDiv.children),'active')
                        span.classList.add('active');
                        
                        this.setDestino(span.id);
                        
                    })
                     contatosDiv.appendChild(span);
                });
            }

            
    }            

    renderMessenger() {

        //cosole.log('renderizando messenger')

        ;

        let css = this.role == 'adm' ? '' : 'off';

         this.messengerHTML = `
                <section class='w-100 p-1'>
              
                    <div class="flex ${css} itemCenter justContBetween" style="color: white;">
                        <a id='msgr'class="colorE p-2 bi-chat "> Mensagens </a>
                        <span id='btnContatos' class="colorE px-2 bi-person"> Contatos </span>
                    </div>  
                    
                    <div id="receiving" class="p-2"></div>

                    <div id="sending" class="fundoE colorA">
                        <input type="text"
                            id="inputMensagem"
                            class="p-1 flex w-100"
                            placeholder="Digite sua mensagem...">
                    </div>

                      <div id='contatos' class='off ${css}  flex scroll25 my-1'>  
                            
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

    filtraMensagem(){

        
    }

    //implementar chegada de novas mensagens
    //listen to new messages
      

     //retrieve contatcs
      getContatos() {
       
        this.firebase.verificaAcesso().then((autorizado) => {
            if (autorizado) {
                const contact = this.firebase.getRef('/contatos');
                contact.once('value').then((snapshot) => {
                    const cont = snapshot.val();
                    if (cont) {
                            Object.entries(cont).forEach(([key, contato]) => {
                                this.contatos.push(contato);
                            });

                           
                            this.updateContatos();
                    }
                    else{
                        console.log('sem contatos')
                    }
                });
            }
        }); 
}
        
  escutarMinhasMensagens(string) {
      
        const user = this.firebase.getAuth().currentUser;
            if (!user) {
                console.error("Usuário não autenticado.");
                return;
            }

        const userMail = user.email;
        const mensagensRef = this.firebase.getRef('/mensagens');

        // Função que renderiza o chat em ordem cronológica baseada em timestamp
        const renderizarChat = (todasMensagens) => {
            const receiving = this.getById('receiving');
            if (receiving) {
                receiving.innerHTML = '';
            }

            // Transforma o objeto num Array e filtra SÓ a conversa entre Você e o Destinatário
            let conversa = Object.keys(todasMensagens)
                .map(key => ({ key, ...todasMensagens[key] }))
                .filter(msg => 
                    (msg.autor === userMail && msg.destino === this.destinatario) || 
                    (msg.autor === this.destinatario && msg.destino === userMail)
                );

            // ORDENAÇÃO CORRETA: usar timestamp para ordem cronológica real
            conversa.sort((a, b) => a.timestamp - b.timestamp);

            // Desenha as mensagens ordenadas
            if (conversa.length > 0) {
                conversa.forEach(mensagem => {
                    if (mensagem.autor !== 1) {
                        let cor = (mensagem.autor !== userMail) ? '#4caf50' : '#888';
                        let pos = (mensagem.autor !== userMail) ? 'justify-content: end;' : '';

                        let html = `
                            <div class='grid' style="margin-bottom: 10px; ${pos}">
                                <div class='contact' style="font-size: 0.8em; color: ${cor};">
                                    ${mensagem.autor ? mensagem.autor : ''}
                                </div>
                                <span class='msgtext colorA'>${mensagem.conteudo}</span>
                            </div>
                        `;

                        let tempDiv = document.createElement('div');
                        tempDiv.innerHTML = html;
                        receiving.appendChild(tempDiv.firstElementChild);
                    }
                });
            } else {
                console.log('Nenhuma mensagem entre você e', this.destinatario);
            }
        };

        // Uma única listener que escuta TODAS as mensagens e filtra as relevantes
        // Ordena por timestamp no Firebase para maior eficiência
        mensagensRef.orderByChild('timestamp').on('value', (snapshot) => {
            const todasMensagens = snapshot.val() || {};
            
            if (Object.keys(todasMensagens).length > 0) {
                this.getById('btnMsgr').classList.add('filterA');
            }
            
            renderizarChat(todasMensagens);
        }, (error) => {
            console.error("Erro ao escutar mensagens:", error);
        });
}

    setDestino(_dest){
        
        //let _dest = event.srcElement.innerText.trim();
        //valida mais uma vez
        
        console.log(_dest)
        if(this.contatos.includes(_dest)){

            this.destinatario = _dest;

            //renderizar novamente as msg
        }
        else{
            console.log('contato nao encontrado')
        }

        this.escutarMinhasMensagens(this.destinatario)
        console.log('destinatario',this.destinatario)

    }

    setContacts(){

    
    // trigger destino
            let contacts = this.getAllClass('contact');

         //   console.log(this.contatos)
     
            for(let contact of contacts) {

                contact.onclick = (event) => {
                    
                    this.setDestino(event.target.id);

                    //filtrar mensagens tambem
                  //   this.escutarMinhasMensagens(event.target.innerText.trim());
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
                    msg.classList.remove('filterA');
                    this.togglePainel('messenger');
                }
            
            let inputMensagem = document.getElementById('inputMensagem');
            
                inputMensagem.onkeydown = (event)=>{
                    if(event.key === 'Enter' && inputMensagem.value) {
                        this.enviarMensagem(event);
                    }
                }

            this.getContatos();
            this.escutarMinhasMensagens();

            


            let btnContatos = this.getById('btnContatos');
                btnContatos.onclick = ()=>{
                    this.togglePainel('contatos');
                }

            setTimeout(()=>{
                this.setContacts();
            },1000);
            
    }

}

