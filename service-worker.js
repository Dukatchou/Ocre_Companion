const CACHE="ocre-companion-1-1-0-beta-4";
const ASSETS=[
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./VERSION.json",
  "./src/core/engine.js",
  "./data/ocre-retro-db.json"
];

self.addEventListener("install",event=>{
  event.waitUntil(
    caches.open(CACHE).then(cache=>cache.addAll(ASSETS))
  );
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(
        keys
          .filter(key=>key!==CACHE && key.startsWith("ocre-companion-"))
          .map(key=>caches.delete(key))
      ))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("message",event=>{
  if(event.data && event.data.type==="SKIP_WAITING"){
    self.skipWaiting();
  }
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;

  const url=new URL(event.request.url);

  // VERSION.json doit toujours venir du réseau pour détecter les mises à jour.
  if(url.pathname.endsWith("/VERSION.json")){
    event.respondWith(
      fetch(event.request,{cache:"no-store"})
        .catch(()=>caches.match(event.request))
    );
    return;
  }

  // Navigation : réseau d'abord, secours hors-ligne.
  if(event.request.mode==="navigate"){
    event.respondWith(
      fetch(event.request)
        .then(response=>{
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put("./index.html",copy));
          return response;
        })
        .catch(()=>caches.match("./index.html"))
    );
    return;
  }

  // Ressources statiques : cache d'abord, puis réseau.
  event.respondWith(
    caches.match(event.request).then(cached=>{
      if(cached)return cached;
      return fetch(event.request).then(response=>{
        if(!response || response.status!==200 || response.type==="opaque")return response;
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request,copy));
        return response;
      });
    })
  );
});
