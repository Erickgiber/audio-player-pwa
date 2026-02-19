/**
 * Web Audio API wrapper for efficient audio playback
 * Manages AudioContext, audio element, and playback state
 */

let audioContext: AudioContext | null = null;
let audioElement: HTMLAudioElement | null = null;
let currentSource: MediaElementAudioSourceNode | null = null;

export function initAudioContext(): AudioContext {
	if (audioContext) return audioContext;

	try {
		audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
		console.log('[v0] AudioContext initialized with sample rate:', audioContext.sampleRate);
		return audioContext;
	} catch (error) {
		console.error('[v0] AudioContext initialization failed:', error);
		throw new Error('Web Audio API not supported');
	}
}

export function getAudioElement(): HTMLAudioElement {
	if (audioElement) return audioElement;

	audioElement = new Audio();
	audioElement.crossOrigin = 'anonymous';
	audioElement.preload = 'none';

	// Hidden audio element
	audioElement.style.display = 'none';

	if (document.body) {
		document.body.appendChild(audioElement);
	}

	// Resume AudioContext on user interaction (required for iOS)
	const resumeAudioContext = () => {
		if (audioContext && audioContext.state === 'suspended') {
			audioContext.resume();
		}
	};

	audioElement.addEventListener('play', resumeAudioContext);
	audioElement.addEventListener('touchstart', resumeAudioContext);

	return audioElement;
}

export function connectAudioGraph(element: HTMLAudioElement): MediaElementAudioSourceNode {
	const ctx = initAudioContext();

	if (currentSource) {
		return currentSource;
	}

	try {
		currentSource = ctx.createMediaElementSource(element);
		currentSource.connect(ctx.destination);
		console.log('[v0] Audio graph connected');
		return currentSource;
	} catch (error) {
		console.error('[v0] Audio graph connection failed:', error);
		throw error;
	}
}

export function setAudioSource(blobUrl: string) {
	const element = getAudioElement();
	element.src = blobUrl;
	element.load();

	// Ensure audio graph is connected
	if (!currentSource) {
		connectAudioGraph(element);
	}
}

export async function play() {
	const element = getAudioElement();
	try {
		await element.play();
		console.log('[v0] Audio playback started');
	} catch (error) {
		console.error('[v0] Playback error:', error);
	}
}

export function pause() {
	const element = getAudioElement();
	element.pause();
	console.log('[v0] Audio paused');
}

export function stop() {
	const element = getAudioElement();
	element.pause();
	element.currentTime = 0;
	console.log('[v0] Audio stopped');
}

export function setVolume(volume: number) {
	const element = getAudioElement();
	const clampedVolume = Math.max(0, Math.min(1, volume));
	element.volume = clampedVolume;
}

export function setCurrentTime(time: number) {
	const element = getAudioElement();
	element.currentTime = Math.max(0, time);
}

export function getCurrentTime(): number {
	return getAudioElement().currentTime;
}

export function getDuration(): number {
	return getAudioElement().duration;
}

export function getVolume(): number {
	return getAudioElement().volume;
}

export function getIsPlaying(): boolean {
	return !getAudioElement().paused;
}

export function addEventListener(event: string, listener: EventListener) {
	getAudioElement().addEventListener(event as any, listener);
}

export function removeEventListener(event: string, listener: EventListener) {
	getAudioElement().removeEventListener(event as any, listener);
}

export function cleanup() {
	if (audioElement) {
		audioElement.pause();
		audioElement.src = '';
		if (audioElement.parentNode) {
			audioElement.parentNode.removeChild(audioElement);
		}
		audioElement = null;
	}

	currentSource = null;

	if (audioContext && audioContext.state !== 'closed') {
		audioContext.close().catch(() => {});
	}
	audioContext = null;

	console.log('[v0] Audio resources cleaned up');
}
