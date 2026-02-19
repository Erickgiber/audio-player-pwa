import { extractMetadata } from './metadataExtractor';
import type { AudioMetadata, AudioProcessingResult } from '$types/audio';

// Supported audio formats by browser
const SUPPORTED_FORMATS = [
	'audio/mpeg',
	'audio/mp4',
	'audio/wav',
	'audio/ogg',
	'audio/webm',
	'audio/flac',
	'audio/aac',
	'audio/x-wav',
	'audio/x-m4a',
	'audio/x-flac'
];

export function isAudioFile(file: File): boolean {
	return SUPPORTED_FORMATS.includes(file.type) || /\.(mp3|mp4|wav|ogg|webm|flac|aac|m4a)$/i.test(file.name);
}

export async function processAudioFiles(files: File[]): Promise<AudioMetadata[]> {
	const audioFiles = files.filter(isAudioFile);

	if (audioFiles.length === 0) {
		console.warn('[v0] No audio files found');
		return [];
	}

	console.log('[v0] Processing', audioFiles.length, 'audio files');

	const results = await Promise.allSettled(
		audioFiles.map(async (file) => {
			try {
				const result = await extractMetadata(file);

				if (!result.success) {
					console.warn('[v0] Failed to process:', file.name, result.error);
				}

				// Generate unique ID
				const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

				return {
					...result.metadata,
					id,
					blob: result.blob,
					dateAdded: Date.now(),
					size: file.size
				} as AudioMetadata;
			} catch (error) {
				console.error('[v0] Error processing file:', file.name, error);
				throw error;
			}
		})
	);

	const audioMetadata: AudioMetadata[] = [];

	results.forEach((result, index) => {
		if (result.status === 'fulfilled') {
			audioMetadata.push(result.value);
			console.log('[v0] Successfully processed:', audioFiles[index].name);
		} else {
			console.error('[v0] Failed to process:', audioFiles[index].name, result.reason);
		}
	});

	return audioMetadata;
}

export function getAudioBlobUrl(blob: Blob): string {
	return URL.createObjectURL(blob);
}

export function revokeAudioBlobUrl(url: string): void {
	URL.revokeObjectURL(url);
}

export function formatFileSize(bytes: number): string {
	if (bytes === 0) return '0 B';

	const k = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDuration(seconds: number): string {
	if (!isFinite(seconds)) return '0:00';

	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);

	if (hours > 0) {
		return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
	}

	return `${minutes}:${String(secs).padStart(2, '0')}`;
}
