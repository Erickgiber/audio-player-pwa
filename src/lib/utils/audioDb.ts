import type { AudioMetadata } from '$types/audio';

const DB_NAME = 'MusicPlayerDB';
const DB_VERSION = 1;
const AUDIO_STORE = 'audios';
const MAX_STORAGE_SIZE = 500 * 1024 * 1024; // 500MB

export async function initDB(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;

			// Create object store for audio files
			if (!db.objectStoreNames.contains(AUDIO_STORE)) {
				const store = db.createObjectStore(AUDIO_STORE, { keyPath: 'id' });

				// Create indexes for searching
				store.createIndex('title', 'title', { unique: false });
				store.createIndex('artist', 'artist', { unique: false });
				store.createIndex('album', 'album', { unique: false });
				store.createIndex('dateAdded', 'dateAdded', { unique: false });
			}
		};
	});
}

export async function addAudio(db: IDBDatabase, audio: AudioMetadata): Promise<void> {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([AUDIO_STORE], 'readwrite');
		const store = transaction.objectStore(AUDIO_STORE);

		// Separate blob from metadata to optimize storage
		const audioToStore = {
			...audio,
			blob: audio.blob
		};

		const request = store.add(audioToStore);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => {
			console.log('[v0] Audio added to IndexedDB:', audio.id);
			resolve();
		};
	});
}

export async function getAllAudios(db: IDBDatabase): Promise<AudioMetadata[]> {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([AUDIO_STORE], 'readonly');
		const store = transaction.objectStore(AUDIO_STORE);
		const request = store.getAll();

		request.onerror = () => reject(request.error);
		request.onsuccess = () => {
			const audios = request.result as AudioMetadata[];
			console.log('[v0] Retrieved', audios.length, 'audios from IndexedDB');
			resolve(audios);
		};
	});
}

export async function getAudio(db: IDBDatabase, id: string): Promise<AudioMetadata | null> {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([AUDIO_STORE], 'readonly');
		const store = transaction.objectStore(AUDIO_STORE);
		const request = store.get(id);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => {
			resolve(request.result || null);
		};
	});
}

export async function deleteAudio(db: IDBDatabase, id: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([AUDIO_STORE], 'readwrite');
		const store = transaction.objectStore(AUDIO_STORE);
		const request = store.delete(id);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => {
			console.log('[v0] Audio deleted from IndexedDB:', id);
			resolve();
		};
	});
}

export async function clearAllAudios(db: IDBDatabase): Promise<void> {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([AUDIO_STORE], 'readwrite');
		const store = transaction.objectStore(AUDIO_STORE);
		const request = store.clear();

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve();
	});
}

export async function getStorageEstimate(): Promise<{
	usage: number;
	quota: number;
	percentage: number;
}> {
	if (!navigator.storage || !navigator.storage.estimate) {
		return { usage: 0, quota: MAX_STORAGE_SIZE, percentage: 0 };
	}

	try {
		const estimate = await navigator.storage.estimate();
		return {
			usage: estimate.usage || 0,
			quota: estimate.quota || MAX_STORAGE_SIZE,
			percentage: ((estimate.usage || 0) / (estimate.quota || MAX_STORAGE_SIZE)) * 100
		};
	} catch (error) {
		console.warn('Storage estimate failed:', error);
		return { usage: 0, quota: MAX_STORAGE_SIZE, percentage: 0 };
	}
}
