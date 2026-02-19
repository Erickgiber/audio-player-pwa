/// <reference types="svelte" />
/// <reference types="vite/client" />

declare namespace App {
	interface Locals {
		// Add your locals here
	}

	interface PageData {
		title?: string;
		description?: string;
	}

	// interface Error {}
	// interface Platform {}
}

declare module 'jsmediatags';
