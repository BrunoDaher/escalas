

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
    console.log(`[saveVideo] Iniciando para url=${url} e key=${key}`);

    const response = await fetch(url)
    if (!response.ok) {
        const msg = `Erro ao baixar o vídeo: ${response.status} ${response.statusText}`
         console.error(`[saveVideo] ${msg}`);
        throw new Error(msg)
    }

    const blob = await response.blob()
        console.log("[saveVideo] Blob recebido:", blob)

    return new Promise((resolve, reject) => {
        console.log("[saveVideo] Abrindo transação readwrite na store:", this.storeName)
            const tx = this.db.transaction(this.storeName, 'readwrite')
            const store = tx.objectStore(this.storeName);

            //console.log(store)

        console.log("[saveVideo] Executando store.put...", key);
        const request = store.put(blob, key)

        request.onsuccess = () => {
            console.log("[saveVideo] Blob salvo com sucesso na store. Key:", key)
        }

        request.onerror = (event) => {
            console.error("[saveVideo] Erro ao salvar blob na store:", event.target.error)
            reject(event.target.error)
        }

        tx.oncomplete = () => {
        console.log("[saveVideo] Transação completa, dado salvo.")
        resolve(true)
        }

        tx.onerror = (event) => {
        console.error("[saveVideo] Erro na transação:", event.target.error)
        reject(event.target.error)
        }
    })
    }



  async getVideoUrl(key) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readonly')
      const store = tx.objectStore(this.storeName)
      const request = store.get(key)

      request.onsuccess = () => {
        const blob = request.result
        if (blob) {
          const url = URL.createObjectURL(blob)
          resolve(url)
        } else {
          resolve(null)
        }
      }

      request.onerror = () => reject(request.error)
    })
  }

  async deleteVideo(key) {
    const tx = this.db.transaction(this.storeName, 'readwrite')
    tx.objectStore(this.storeName).delete(key)
    return tx.complete
  }

  async listKeys() {
    const tx = this.db.transaction(this.storeName, 'readonly')
    const store = tx.objectStore(this.storeName)
    const keys = []
    const request = store.openCursor()

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor) {
          keys.push(cursor.key)
          cursor.continue()
        } else {
          resolve(keys)
        }
      }
      request.onerror = () => reject(request.error)
    })
  }
}
