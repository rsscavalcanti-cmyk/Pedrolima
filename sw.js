const CACHE = 'lousa-cache-v1';
const CORE = ['./', './index.html']; // caminhos relativos funcionam bem no GitHub Pages
self.addEventListener('install', e => {
e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
.then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
const req = e.request;
if (req.mode === 'navigate') {
e.respondWith(caches.match('./index.html').then(r => r || fetch(req)));
return;
}
e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => {
const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); return res;
})));
});
