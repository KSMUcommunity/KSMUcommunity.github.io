const CACHE='kgmu-v162-kgmu-20261115';
/* расписание групп (data/g/*.js) — отдельный кэш: при выходе новой версии сайта не стирается, иначе офлайн пропадали бы пары */
const DATA='kgmu-data';
const ASSETS=['./','./index.html','./schedule-data.js','./img/kgmu-logo.webp','./img/ksmu-mark.webp','./img/ksmu-logo.webp','./cloud-sync.js','./community-extras.js','./kg-theme.css','./kg-ui.js','./kg-app.css','./kg-e.css','./fonts/inter-latin.woff2','./fonts/inter-cyrillic.woff2','./kg-app.js','./manifest.webmanifest','./img/favicon-32.png','./img/favicon-64.png','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('kgmu-')&&k!==CACHE&&k!==DATA).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
/* Страницу (index.html) всегда сверяем с сервером: GitHub Pages разрешает кэшировать HTML 10 минут,
   и без этого после деплоя Telegram и браузеры показывают старую версию. Остальное — сеть, затем кэш.
   В кэш кладём по адресу без «?…»: иначе каждая версия/запрос с параметром сохранялась отдельной копией (schedule.json — 8 МБ). */
self.addEventListener('fetch',e=>{const request=e.request;if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
 const page=request.mode==='navigate'||/\/(index\.html)?$/.test(new URL(request.url).pathname);
 const net=page?fetch(request.url,{cache:'no-cache',credentials:'same-origin'}):fetch(request);
 const u=new URL(request.url),key=page?'./index.html':u.origin+u.pathname;
 e.respondWith(net.then(r=>{if(r.ok&&r.status===200){const copy=r.clone();e.waitUntil(caches.open(/\/data\/g\//.test(u.pathname)?DATA:CACHE).then(c=>c.put(key,copy)).catch(()=>{}));}return r;}).catch(()=>caches.match(key,{ignoreSearch:true}).then(r=>r||(page?caches.match('./index.html'):Response.error()))));});
