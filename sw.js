const staticCacheName = 'site-static-v-1.0.1';
const assets = [
    '/',
    '/index.html',
    '/script.js',
    '/style.css',
    '/images/favicon-16x16.png',
    '/images/favicon-32x32.png',
    '/images/favicon.ico'
]
//install serviceWorker
self.addEventListener('install',(e)=>{
    // console.log('service worker installed');
    e.waitUntil(
      caches.open(staticCacheName)
      .then((cache)=>{
         cache.addAll(assets);
      })
    );
    
}); 

//activate serviceWorker
self.addEventListener('activate',(e)=>{
    console.log('service worker is activated');
    //deleting old cache
    e.waitUntil(
        caches.keys().then((keys)=>{
            //this keys return an array of all cache name
            return Promise.all(keys
                .filter((key)=> key!== staticCacheName )
                .map((key)=> caches.delete(key) )
            )

        })
    );
});

//listen to fetch events
self.addEventListener('fetch',(e)=>{
    e.respondWith(
        caches.match(e.request).then((cacheResponse)=>{
            return cacheResponse || fetch(e.request);
        })
    );
});