export interface AudioMetadata {
	id: string;
	title: string;
	artist: string;
	album: string;
	duration: number;
	cover: string | null; // Data URL
	blob: Blob;
	fileName: string;
	mimeType: string;
	dateAdded: number;
	size: number;
}

export interface AudioProcessingResult {
	metadata: Omit<AudioMetadata, 'id' | 'blob' | 'dateAdded' | 'size'>;
	blob: Blob;
	success: boolean;
	error?: string;
}
