<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	onMount(async () => {
		// Register service worker
		if ('serviceWorker' in navigator && !navigator.serviceWorker.controller) {
			try {
				await navigator.serviceWorker.register('/service-worker.js', { type: 'module' });
			} catch (err) {
				console.warn('Service Worker registration failed:', err);
			}
		}
	});
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content={data.description} />
</svelte:head>

<main class="h-screen w-screen bg-background text-foreground overflow-hidden antialiased">
	<slot />
</main>

<style global lang="postcss">
	:global(html, body) {
		@apply h-full w-full m-0 p-0 overflow-hidden;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	:global(*) {
		@apply box-border;
	}

	:global(input, textarea, button) {
		-webkit-user-select: text;
		-moz-user-select: text;
		-ms-user-select: text;
		user-select: text;
	}
</style>
