const STATIC = 'staticv1';
const STATIC_LIMIT = 15;
const INMUTABLE = 'inmutablev1';
const DYNAMIC = 'dynamicv1';
const DYNAMIC_LIMIT = 30;

//console.log('SERVICEWORKER');
//Todos aquellos recursos propios de la aplicación 
const APP_SHELL = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/pages/offline.html',
    '/img/1.png',
    '/js/app.js',
];
// Todos aquellos recursos que nunca cambian
const APP_SHELL_INMUTABLE = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js'
];

self.addEventListener('install', (e) => {
    //e.skipWaiting();
    const staticCache = caches.open(STATIC).then(cache => {
        cache.addAll(APP_SHELL);
    });
    const inmutableCache = caches.open(INMUTABLE).then((cache) => {
        cache.addAll(APP_SHELL_INMUTABLE);
    });
    e.waitUntil(Promise.all([staticCache, inmutableCache]));
});

self.addEventListener('activate', (e) => {
    console.log('Activado');
});

/**
 * Por medio de alguna estrategia de cache y el evento fetch mostrar en pantalla la página offline
 * cuando se solicite el recurso page2.html y no haya internet
 */

addEventListener('fetch', e => {

    //console.log(e.request);
    //if(e.request.url.includes('1.jpg'))
    //e.respondWith(fetch('img/2.png'));
    //else e.respondWith(fetch(e.request));


    // 4. Cache with network update
    // Rendimiento crítico, si el rendimiento es bajo utilizar.
    // Toda nuestra aplicación está un paso atrás, siempre va a devolver desde caché 
    // siempre va a actualizar todos nuestros archivos
    //if(e.request.url.includes('bootstrap'))
    //    return e.respondWith(caches.match(e.request));
    //const source = caches.open(STATIC).then(cache => {
    //    fetch(e.request).then( res => {
    //        cache.put(e.request, res);
    //    });
    //    return cache.match(e.request);
    //});


    // 3. Network with cache fallback
    /* const source = fetch(e.request)
    .then(res => {
        if(!res) throw Error('NotFound');
        // Checar si el recurso ya existe en algún cache
        caches.open(DYNAMIC).then(cache => {
            cache.put(e.request, res);
        });
        return res.clone();
    }).catch(err => {
        return caches.match(e.request);
    }); */
    //e.respondWith(source);


    // 2. Cache with network fallback
    //const source = caches.match(e.request).then((res) => {
    //if(res) return res;
    //return fetch(e.request).then(resFetch => {
    //    caches.open(DYNAMIC).then((cache) => {
    //        cache.put(e.request, resFetch);
    //    });
    //    return resFetch.clone();
    //});
    //});


    //1. Cache only
    //e.respondWith(caches.match(e.request));


    // ejercicio
    if (e.request.url.includes('page2.html')) {
        e.respondWith(
            fetch(e.request).catch(() => {
                return caches.match('/pages/offline.html');
            })
        );
        return;
    }

    e.respondWith(
        fetch(e.request).then(res => {
            if (!res || !res.ok) throw Error('No encontrado');
            const resClone = res.clone();
            caches.open(DYNAMIC).then(cache => {
                cache.put(e.request, resClone);
            });

            return res;
        }).catch(err => {
            console.warn('Error:', err);
            return caches.match(e.request);
        })
    );
});


//self.addEventListener('push', (e) => {
//    console.log('Notificacion push');
//});

//self.addEventListener('sync', (e) => {
//    console.log('SYNC EVENT');
//});