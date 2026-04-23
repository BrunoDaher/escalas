// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDr0frs3E6bDroBl09Gw4zVOO-VUjh5Ag0",
  authDomain: "virtuaguitar.firebaseapp.com",
  projectId: "virtuaguitar",
  storageBucket: "virtuaguitar.appspot.com",
  messagingSenderId: "1041664705298",
  appId: "1:1041664705298:web:c510fde7a35162c89669cb",
  measurementId: "G-SJTCVCVY75"
};


export class Fire {
  

  constructor() {

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    this.auth = firebase.auth();
    this.database = firebase.database();
    
    
  }


  getConfig(){
    return firebaseConfig;
  }

  async getRole(){
    
    
    await this.verificaAcesso();
    return this.role;
  }

  

  getIdToken(){
    return this.auth.currentUser.getIdToken();
  }

  setRole(_role){
    //cosole.log(`role ${this.role} alterada para`, _role);

    setTimeout(()=>{
      this.role = _role;
    },300)
    
  }

  getRef(base){

    return firebase.database().ref(`/${base}`);
  }

  getAuth(){
    return firebase.auth();
  }

  signIn(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => userCredential.user)
      .catch((error) => {
        throw error;
      });
  }

  signOut() {
    return this.auth.signOut()
      .then(() => {
       // //cosole.log("Usuário deslogado.");
         document.body.remove(); 
         document.location.reload();
      })
      .catch((error) => {

        console.error("Erro ao fazer logout:", error.message);
      });
  }

  async verificaAcesso() {

    try {
      const contatosRef = this.getRef('contatos');
      const snapshot = await contatosRef.get();

      if (snapshot.exists()) {
       // console.log("Usuário tem acesso à tabela contatos.")
        
        this.role = 'adm';
        return true
      }
      
    } catch (error) {

      this.role = 'user';
      
      //console.log("Sem acesso a contatos");
      return false
    }
    
      
     
    
  }

 async estaLogado() {
    return new Promise((resolve) => {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          //let(user.email)
         
          //document.getElementById('userInfo').innerText = user.email;
          //cosole.log("Usuário logado:", user.email);
        }
        resolve(!!user);
      });
    });
  }

  
}




// Exportando para uso externo

