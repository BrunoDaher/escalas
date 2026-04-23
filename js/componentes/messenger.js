
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
                    span.className = 'bi bi-person colorA contact btn1 capt flex gap1';
               
                    span.textContent = contato.split('@')[0];    
                    span.id = contato;        
                     contatosDiv.appendChild(span);
                });
            }

            
    }            

    renderMessenger() {

        //cosole.log('renderizando messenger')

        ;

        let css = this.role == 'adm' ? '' : 'off';

         this.messengerHTML = `
                <section>
              
                    <div class="flex ${css} itemCenter justContBetween" style="color: white;">
                        <a id='msgr'class="colorE p-2 bi-chat "> Mensagens </a>
                        <a id='btnContatos'class="btn1 p-2 bi-person"> Contatos </a>
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

    // Mantido seu código de Role


    const mensagensRef = this.firebase.getRef('/mensagens');

    // 1. Variáveis para guardar os dois lados da conversa
    let msgsRecebidas = {};
    let msgsEnviadas = {};

    // 2. Função que junta as mensagens, ordena por tempo e desenha na tela
    const renderizarChat = () => {
        const receiving = this.getById('receiving');
        if (receiving) {
            receiving.innerHTML = '';
        }

        // Junta tudo num objeto só
        const todasMensagens = { ...msgsRecebidas, ...msgsEnviadas };

        // Transforma o objeto num Array e filtra SÓ a conversa entre Você e o Destinatário
        let conversa = Object.keys(todasMensagens)
            .map(key => ({ key, ...todasMensagens[key] }))
            .filter(msg => 
                (msg.autor === userMail && msg.destino === this.destinatario) || 
                (msg.autor === this.destinatario && msg.destino === userMail)
            );

        // 3. O SEGREDO DA CRONOLOGIA
        // Os IDs gerados pelo Firebase (push keys) já são baseados em tempo!
        // Basta ordená-los alfabeticamente para ter a ordem cronológica perfeita.
        // Se você tiver um campo de data, poderia usar: a.timestamp - b.timestamp
        conversa.sort((a, b) => a.key.localeCompare(b.key));

        // 4. Desenha as mensagens ordenadas
        if (conversa.length > 0) {
            conversa.forEach(mensagem => {
                if (mensagem.autor !== 1) { // Mantido o seu filtro existente
                    
                    let cor = (mensagem.autor !== userMail) ? '#4caf50' : '#888';
                    let pos = (mensagem.autor !== userMail) ? 'justify-content: end;' : '';

                    let html = `
                        <div class='grid' style="margin-bottom: 10px; ${pos}">
                            <div class='contact' style="font-size: 0.8em; color: ${cor};">
                                ${mensagem.autor ? mensagem.autor : ''}
                            </div>
                            <span class='colorA'>${mensagem.conteudo}</span>
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

    // 5. Escuta as mensagens onde você é o DESTINO (Recebidas)
    mensagensRef.orderByChild('destino').equalTo(userMail).on('value', (snapshot) => {
        msgsRecebidas = snapshot.val() || {};
        renderizarChat(); // Atualiza a tela sempre que chegar algo novo
    }, (error) => {
        console.error("Erro ao escutar mensagens recebidas:", error);
    });

    // 6. Escuta as mensagens onde você é o AUTOR (Enviadas)
    mensagensRef.orderByChild('autor').equalTo(userMail).on('value', (snapshot) => {
        msgsEnviadas = snapshot.val() || {};
        renderizarChat(); // Atualiza a tela sempre que mandar algo novo
    }, (error) => {
        console.error("Erro ao escutar mensagens enviadas:", error);
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

      //  console.log(this)
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

