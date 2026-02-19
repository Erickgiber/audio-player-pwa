/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

import { build, files, version } from '$service-worker';

const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE).then((cache) => {
			cache.addAll(ASSETS);
		})
	);
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then(async (keys) => {
			for (const key of keys) {
				if (key !== CACHE) await caches.delete(key);
			}
			self.clients.claim();
		})
	);
});

self.addEventListener('fetch', (event) => {
	// Skip non-GET requests
	if (event.request.method !== 'GET') return;

	// Always use network for API calls
	if (event.request.url.includes('/api/')) {
		event.respondWith(
			fetch(event.request).catch(() => new Response('Network error', { status: 503 }))
		);
		return;
	}

	// Serve from cache, fallback to network
	event.respondWith(
		caches.match(event.request).then((response) => {
			if (response) return response;

			return fetch(event.request)
				.then((networkResponse) => {
					if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
						return networkResponse;
					}
					// Clone immediately; cloning later can fail if the body was already consumed.
					const responseToCache = networkResponse.clone();
					event.waitUntil(caches.open(CACHE).then((cache) => cache.put(event.request, responseToCache)));
					return networkResponse;
				})
				.catch(() =>
					caches.match('/index.html').then((fallback) => fallback ?? new Response('Offline', { status: 503 }))
				);
		})
	);
});
