import { writable } from 'svelte/store';
import { initDB, getAllAudios, addAudio, deleteAudio, getAudio } from '$utils/audioDb';
import type { AudioMetadata } from '$types/audio';

interface DBState {
	isInitialized: boolean;
	isReady: boolean;
	error: string | null;
}

function createDBStore() {
	const { subscribe, set, update } = writable<DBState>({
		isInitialized: false,
		isReady: false,
		error: null
	});

	let db: IDBDatabase | null = null;

	return {
		subscribe,
		initialize: async () => {
			try {
				db = await initDB();
				update((state) => ({
					...state,
					isInitialized: true,
					isReady: true,
					error: null
				}));
			} catch (error) {
				const errorMsg = error instanceof Error ? error.message : 'Database initialization failed';
				update((state) => ({
					...state,
					isInitialized: true,
					isReady: false,
					error: errorMsg
				}));
				console.error('DB initialization error:', error);
			}
		},
		saveAudio: async (audio: AudioMetadata) => {
			if (!db) return false;
			try {
				await addAudio(db, audio);
				return true;
			} catch (error) {
				console.error('Error saving audio:', error);
				return false;
			}
		},
		loadAllAudios: async (): Promise<AudioMetadata[]> => {
			if (!db) return [];
			try {
				return await getAllAudios(db);
			} catch (error) {
				console.error('Error loading audios:', error);
				return [];
			}
		},
		removeAudio: async (id: string) => {
			if (!db) return false;
			try {
				await deleteAudio(db, id);
				return true;
			} catch (error) {
				console.error('Error removing audio:', error);
				return false;
			}
		},
		getAudio: async (id: string): Promise<AudioMetadata | null> => {
			if (!db) return null;
			try {
				return await getAudio(db, id);
			} catch (error) {
				console.error('Error getting audio:', error);
				return null;
			}
		},
		getDb: () => db
	};
}

export const dbStore = createDBStore();
