import jsmediatags from 'jsmediatags';
import type { AudioProcessingResult } from '$types/audio';

const MAX_COVER_SIZE = 1024 * 1024; // 1MB max for cover image

export async function extractMetadata(file: File): Promise<AudioProcessingResult> {
	return new Promise((resolve) => {
		// Get duration from audio element
		const audio = new Audio();
		const objectUrl = URL.createObjectURL(file);

		const onLoadedMetadata = () => {
			audio.removeEventListener('loadedmetadata', onLoadedMetadata);
			const duration = audio.duration;

			// Extract ID3 tags
			jsmediatags.read(file, {
				onSuccess: (tag: any) => {
					try {
						const tags = tag.tags || {};
						const result: AudioProcessingResult = {
							metadata: {
								title: sanitize(tags.title || file.name.replace(/\.[^/.]+$/, '')),
								artist: sanitize(tags.artist || 'Unknown Artist'),
								album: sanitize(tags.album || 'Unknown Album'),
								fileName: file.name,
								mimeType: file.type,
								duration: Math.round(duration),
								cover: tags.picture ? extractCover(tags.picture) : null
							},
							blob: file,
							success: true
						};

						URL.revokeObjectURL(objectUrl);
						resolve(result);
					} catch (error) {
						handleError(error, file, duration, objectUrl, resolve);
					}
				},
				onError: (error: any) => {
					console.warn('[v0] jsmediatags read error:', error);
					handleError(error, file, duration, objectUrl, resolve);
				}
			});
		};

		const onError = () => {
			audio.removeEventListener('error', onError);
			console.error('[v0] Audio load error');
			URL.revokeObjectURL(objectUrl);
			resolve({
				metadata: {
					title: file.name.replace(/\.[^/.]+$/, ''),
					artist: 'Unknown Artist',
					album: 'Unknown Album',
					fileName: file.name,
					mimeType: file.type,
					duration: 0,
					cover: null
				},
				blob: file,
				success: false,
				error: 'Could not load audio file'
			});
		};

		audio.addEventListener('loadedmetadata', onLoadedMetadata);
		audio.addEventListener('error', onError);
		audio.src = objectUrl;
	});
}

function extractCover(picture: any): string | null {
	try {
		if (!picture || !picture.data) return null;

		const data = picture.data;
		const base64String = String.fromCharCode.apply(null, data as any);
		const base64 = btoa(base64String);

		// Check size
		if (base64.length > MAX_COVER_SIZE) {
			console.warn('[v0] Cover image too large, compressing...');
			return compressCoverImage(`data:${picture.format || 'image/jpeg'};base64,${base64}`);
		}

		return `data:${picture.format || 'image/jpeg'};base64,${base64}`;
	} catch (error) {
		console.warn('[v0] Cover extraction error:', error);
		return null;
	}
}

function compressCoverImage(dataUrl: string): string | null {
	try {
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement('canvas');
			const maxSize = 256;
			let width = img.width;
			let height = img.height;

			if (width > height) {
				if (width > maxSize) {
					height = Math.round((height * maxSize) / width);
					width = maxSize;
				}
			} else {
				if (height > maxSize) {
					width = Math.round((width * maxSize) / height);
					height = maxSize;
				}
			}

			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext('2d');
			if (ctx) {
				ctx.drawImage(img, 0, 0, width, height);
				return canvas.toDataURL('image/jpeg', 0.7);
			}
		};
		img.src = dataUrl;
		return dataUrl; // Fallback
	} catch (error) {
		console.warn('[v0] Image compression error:', error);
		return dataUrl;
	}
}

function handleError(
	error: any,
	file: File,
	duration: number,
	objectUrl: string,
	resolve: (result: AudioProcessingResult) => void
) {
	URL.revokeObjectURL(objectUrl);
	resolve({
		metadata: {
			title: sanitize(file.name.replace(/\.[^/.]+$/, '')),
			artist: 'Unknown Artist',
			album: 'Unknown Album',
			fileName: file.name,
			mimeType: file.type,
			duration: Math.round(duration),
			cover: null
		},
		blob: file,
		success: true, // Still success as we have basic metadata
		error: undefined
	});
}

function sanitize(str: string): string {
	return str
		.trim()
		.replace(/[\n\r\t]/g, ' ')
		.replace(/\s+/g, ' ')
		.slice(0, 200); // Limit to 200 chars
}
