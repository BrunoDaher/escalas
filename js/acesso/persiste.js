

export class Persiste {
  constructor(dbName = 'virtuaguitar', storeName = 'videos') {
    this.dbName = dbName
    this.storeName = storeName
    this.db = null
  }

  async init() {
    this.db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName)
        }
      }

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async saveVideo(url, key) {
   //console.log(`[saveVideo] Iniciando para url=${url} e key=${key}`);

    const response = await fetch(url)
    if (!response.ok) {
        const msg = `Erro ao baixar o vídeo: ${response.status} ${response.statusText}`
        console.error(`[saveVideo] ${msg}`);
        throw new Error(msg)
    }

    const blob = await response.blob()
       //console.log("[saveVideo] Blob recebido:", blob)

    return new Promise((resolve, reject) => {
       //console.log("[saveVideo] Abrindo transação readwrite na store:", this.storeName)
            const tx = this.db.transaction(this.storeName, 'readwrite')
            const store = tx.objectStore(this.storeName);

            //console.log(store)

       //console.log("[saveVideo] Executando store.put...", key);
        const request = store.put(blob, key)

        request.onsuccess = () => {
           //console.log("[saveVideo] Blob salvo com sucesso na store. Key:", key)
        }

        request.onerror = (event) => {
            console.error("[saveVideo] Erro ao salvar blob na store:", event.target.error)
            reject(event.target.error)
        }

        tx.oncomplete = () => {
       //console.log("[saveVideo] Transação completa, dado salvo.")
        resolve(true)
        }

        tx.onerror = (event) => {
        console.error("[saveVideo] Erro na transação:", event.target.error)
        reject(event.target.error)
        }
    })
  }

async getVideoBlob(key) {
    if (!this.db) await this.init();
    return new Promise((resolve) => {
        const tx = this.db.transaction([this.storeName], 'readonly');
        const store = tx.objectStore(this.storeName);
        const request = store.get(key);

        request.onsuccess = () => {
            // Importante: retornar null se não houver resultado para cair no else da nuvem
            resolve(request.result || null); 
        };
        request.onerror = () => resolve(null);
    });
}

  async deleteVideo(key) {
    const tx = this.db.transaction(this.storeName, 'readwrite')
    tx.objectStore(this.storeName).delete(key)
    return tx.complete
  }

async listKeys() {
    // Garante que o banco está aberto
    if (!this.db) await this.init();

    const tx = this.db.transaction(this.storeName, 'readonly');
    const store = tx.objectStore(this.storeName);
    const keys = [];
    
    // Usamos openCursor (e não openKeyCursor) porque precisamos testar o 'value'
    const request = store.openCursor();

    return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                // SÓ ADICIONA SE O VALOR EXISTIR E FOR UM BLOB VÁLIDO
                // Isso filtra chaves "fantasmas" ou registros corrompidos
                if (cursor.value instanceof Blob && cursor.value.size > 0) {
                    keys.push(cursor.key);
                }
                
                cursor.continue();
            } else {
                // Fim da listagem
               //console.log(`🔍 Itens reais encontrados no disco: ${keys.length}`);
                resolve(keys);
            }
        };

        request.onerror = () => {
            console.error("Erro ao varrer chaves:", request.error);
            reject(request.error);
        };
    });
}

    async resetBlob() {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readwrite')
      const store = tx.objectStore(this.storeName)
      const request = store.clear()

      request.onsuccess = () => {
       ////console.log("[resetBlob] Store limpa com sucesso")
        resolve(true)
      }

      request.onerror = (event) => {
        //console.error("[resetBlob] Erro ao limpar store:", event.target.error)
        reject(event.target.error)
      }
    })
  }   
}
