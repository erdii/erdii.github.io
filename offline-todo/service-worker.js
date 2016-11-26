self.addEventListener("install", (e) => {
	e.waitUntil(
		caches.open("notes.js").then((cache) => {
			return cache.addAll([
				"/",
				"/index.html",
				"/todo.js",
				"/todo.css",
				"/service-worker.js",
			]);
		})
	)
});

self.addEventListener("fetch", (e) => {
	e.respondWith(
		caches.match(e.request).then((cachedResponse) => (
			cachedResponse || fetch(e.request)
		))
	);
});