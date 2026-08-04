const CACHE='ocre-companion-1-0-1-hotfix';
const ASSETS=['./','./index.html','./manifest.webmanifest','./data/ocre-retro-db.js','./data/ocre-retro-db.json','./src/core/engine.js','./icons/icon-180.png','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match('./index.html')))));

self.addEventListener("message",event=>{if(event.data&&event.data.type==="SKIP_WAITING")self.skipWaiting()});

self.addEventListener("fetch",event=>{if(event.request.method!=="GET")return;if(event.request.mode==="navigate")event.respondWith(fetch(event.request).catch(()=>caches.match("./index.html")))});
