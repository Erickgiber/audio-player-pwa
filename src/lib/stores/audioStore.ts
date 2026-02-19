import { writable } from 'svelte/store';
import type { AudioMetadata } from '$types/audio';

interface AudioState {
	audios: AudioMetadata[];
	currentIndex: number;
	isLoading: boolean;
}

const initialState: AudioState = {
	audios: [],
	currentIndex: -1,
	isLoading: false
};

function createAudioStore() {
	const { subscribe, set, update } = writable<AudioState>(initialState);

	return {
		subscribe,
		addAudio: (audio: AudioMetadata) =>
			update((state) => ({
				...state,
				audios: [...state.audios, audio]
			})),
		addAudios: (audios: AudioMetadata[]) =>
			update((state) => ({
				...state,
				audios: [...state.audios, ...audios]
			})),
		removeAudio: (id: string) =>
			update((state) => {
				const newAudios = state.audios.filter((a) => a.id !== id);
				return {
					...state,
					audios: newAudios,
					currentIndex: state.currentIndex >= newAudios.length ? newAudios.length - 1 : state.currentIndex
				};
			}),
		setCurrentIndex: (index: number) =>
			update((state) => ({
				...state,
				currentIndex: index
			})),
		setAudios: (audios: AudioMetadata[]) =>
			update((state) => ({
				...state,
				audios
			})),
		setLoading: (isLoading: boolean) =>
			update((state) => ({
				...state,
				isLoading
			})),
		clear: () => set(initialState)
	};
}

export const audioStore = createAudioStore();
