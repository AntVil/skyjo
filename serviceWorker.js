let cacheName = "skyjo";
let filesToCache = [
    "/skyjo/",
    "/skyjo/index.html",
    "/skyjo/scripts/Card.js",
    "/skyjo/scripts/CardDeck.js",
    "/skyjo/scripts/CardGrid.js",
    "/skyjo/scripts/Game.js",
    "/skyjo/scripts/GameRound.js",
    "/skyjo/scripts/Player.js",
    "/skyjo/scripts/ScreenHandler.js",
    "/skyjo/scripts/main.js",
    "/skyjo/style.css",
    "/skyjo/images/-2.svg",
    "/skyjo/images/-1.svg",
    "/skyjo/images/0.svg",
    "/skyjo/images/1.svg",
    "/skyjo/images/2.svg",
    "/skyjo/images/3.svg",
    "/skyjo/images/4.svg",
    "/skyjo/images/5.svg",
    "/skyjo/images/6.svg",
    "/skyjo/images/7.svg",
    "/skyjo/images/8.svg",
    "/skyjo/images/9.svg",
    "/skyjo/images/10.svg",
    "/skyjo/images/11.svg",
    "/skyjo/images/12.svg",
    "/skyjo/images/NaN.svg",
    "/skyjo/images/hidden.svg"
];

self.addEventListener("install", (event) => {
    event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(filesToCache)));
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request).then((response) => {
            let copy = response.clone();
            caches.open(cacheName)
            .then((cache) => {
                cache.put(event.request, copy);
            });
            return response;
        }).catch(() => {
            return caches.match(event.request).then((response) => {
                return response;
            })
        })
    );
});
