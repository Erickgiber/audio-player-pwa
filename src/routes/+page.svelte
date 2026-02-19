<script lang="ts">
	import { onMount } from 'svelte';
	import Player from '$components/Player.svelte';
	import Playlist from '$components/Playlist.svelte';
	import Uploader from '$components/Uploader.svelte';
	import { audioStore } from '$stores/audioStore';

	let showPlaylist = true;
	let isMobile = false;

	onMount(() => {
		const mediaQuery = window.matchMedia('(max-width: 768px)');
		isMobile = mediaQuery.matches;

		const handleChange = (e: MediaQueryListEvent) => {
			isMobile = e.matches;
		};

		mediaQuery.addEventListener('change', handleChange);
		return () => mediaQuery.removeEventListener('change', handleChange);
	});
</script>

<div class="h-full w-full flex flex-col md:flex-row gap-0 bg-background">
	<!-- Player Section -->
	<div class="flex-1 flex flex-col justify-center items-center px-4 py-8 md:py-0 min-h-screen md:min-h-auto">
		<Player />
	</div>

	<!-- Playlist Section -->
	{#if !isMobile || showPlaylist}
		<div class="w-full md:w-96 bg-surface-alt border-l border-border flex flex-col h-screen md:h-auto overflow-hidden">
			<div class="flex-shrink-0 p-4 border-b border-border">
				<h2 class="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Playlist</h2>
			</div>
			
			{#if $audioStore.audios.length === 0}
				<div class="flex-1 flex flex-col items-center justify-center p-4 text-center">
					<Uploader />
				</div>
			{:else}
				<div class="flex-1 overflow-hidden flex flex-col">
					<Playlist />
					<div class="p-4 border-t border-border">
						<Uploader />
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
