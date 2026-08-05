const CACHE_NAME = 'meu-pwa-v2';

// sw.js
self.addEventListener("install", (event) => {
  // Pula a espera para ativar o worker imediatamente
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // Deleta a versão antiga
          }
        })
      );
    })
  );
});

// OBRIGATÓRIO para PWA: Um evento de fetch, mesmo que vazio.
self.addEventListener("fetch", (event) => {
  // Não faz cache. Apenas deixa o navegador seguir o fluxo normal de rede.
  return;
});