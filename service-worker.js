

// sw.js
self.addEventListener("install", (event) => {
  // Pula a espera para ativar o worker imediatamente
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Assume o controle das abas abertas imediatamente
  event.waitUntil(clients.claim());
});

// OBRIGATÓRIO para PWA: Um evento de fetch, mesmo que vazio.
self.addEventListener("fetch", (event) => {
  // Não faz cache. Apenas deixa o navegador seguir o fluxo normal de rede.
  return;
});