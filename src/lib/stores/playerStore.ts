import { writable } from 'svelte/store';

type RepeatMode = 'off' | 'all' | 'one';

interface PlayerState {
	isPlaying: boolean;
	currentTime: number;
	duration: number;
	volume: number;
	repeat: RepeatMode;
	shuffle: boolean;
	isMuted: boolean;
}

const initialState: PlayerState = {
	isPlaying: false,
	currentTime: 0,
	duration: 0,
	volume: typeof localStorage !== 'undefined' ? parseFloat(localStorage.getItem('volume') || '0.8') : 0.8,
	repeat: 'off',
	shuffle: false,
	isMuted: false
};

function createPlayerStore() {
	const { subscribe, set, update } = writable<PlayerState>(initialState);

	return {
		subscribe,
		togglePlay: () =>
			update((state) => ({
				...state,
				isPlaying: !state.isPlaying
			})),
		play: () =>
			update((state) => ({
				...state,
				isPlaying: true
			})),
		pause: () =>
			update((state) => ({
				...state,
				isPlaying: false
			})),
		setCurrentTime: (time: number) =>
			update((state) => ({
				...state,
				currentTime: time
			})),
		setDuration: (duration: number) =>
			update((state) => ({
				...state,
				duration
			})),
		setVolume: (volume: number) => {
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem('volume', String(volume));
			}
			return update((state) => ({
				...state,
				volume,
				isMuted: volume === 0
			}));
		},
		setRepeat: (repeat: RepeatMode) =>
			update((state) => ({
				...state,
				repeat
			})),
		toggleShuffle: () =>
			update((state) => ({
				...state,
				shuffle: !state.shuffle
			})),
		toggleMute: () =>
			update((state) => {
				const isMuted = !state.isMuted;
				if (typeof localStorage !== 'undefined' && !isMuted) {
					localStorage.setItem('volume', String(state.volume));
				}
				return {
					...state,
					isMuted,
					volume: isMuted ? 0 : state.volume
				};
			}),
		reset: () => set(initialState)
	};
}

export const playerStore = createPlayerStore();
