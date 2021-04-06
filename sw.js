self.addEventListener('install', (event) => {
	event.waitUntil(
	  caches.open('Fpdfe').then((cache) => {
		return cache.addAll([
			'./',
			'./index.html',
			'./style.css',
			'./fpdfe.js',
			'./Forms_Element.class.js',
			'./lib/jszip.min.js',
			'./lib/csv.min.js',
			'./lib/pdf-lib.min.js',
			'./icon.svg',
		]);
	  })
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		fetch(event.request).catch(function() {
			return caches.match(event.request);
		})
	);
});
