/* Cache-first for files saved with "Save for Offline Study"; network otherwise. */
var CACHE='l137-leviathan-s1-offline-v3';
self.addEventListener('install',function(e){ self.skipWaiting(); });
self.addEventListener('activate',function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET') return;
  e.respondWith(caches.open(CACHE).then(function(c){
    return fetch(e.request).then(function(res){
      return c.match(e.request,{ignoreSearch:true}).then(function(hit){ if(hit && res.ok) c.put(e.request,res.clone()); return res; });
    }).catch(function(){
      return c.match(e.request,{ignoreSearch:true}).then(function(hit){ return hit || c.match('index.html'); });
    });
  }));
});
