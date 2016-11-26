const KEY = "notes.js";

self.addEventListener("install", (event) => {
	console.log("installing serviceworker");

	event.waitUntil(precache());
});

self.addEventListener("fetch", (event) => {
	console.log("service worker is serving this request");

	const { request } = event;

	event.respondWith(fromNetwork(request, 400).catch(function () {
		return fromCache(request);
	}));
});

function precache() {
	return caches.open(KEY).then((cache) => {
		return cache.addAll([
			"./",
			"./index.html",
			"./todo.js",
			"./todo.css",
		]);
	});
}

function fromNetwork(request, timeout) {
	return new Promise(function(fulfill, reject) {
		let timeoutId = setTimeout(reject, timeout);

		console.log("trying network");
		fetch(request).then(function (response) {
			clearTimeout(timeoutId);

			caches.open(KEY).then(function (cache) {
				console.log("updating cache");
				cache.put(request, response);
				cache.match(request).then(function (matching) {
					fulfill(matching);
				})
			});
		}, reject);
	});
}

function fromCache(request) {
	console.log("trying cache");
	return caches.open(KEY).then(function (cache) {
		return cache.match(request).then(function (matching) {
			return matching || Promise.reject("no-match"); 
		})
	});
}