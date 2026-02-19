<script lang="ts">
	import { Trash2, Music } from 'lucide-svelte';
	import { audioStore } from '$stores/audioStore';
	import { playerStore } from '$stores/playerStore';
	import { dbStore } from '$stores/dbStore';
	import { formatDuration } from '$utils/fileHandler';

	let playlistContainer: HTMLDivElement;

	$: activeIndex = $audioStore.currentIndex;

	async function selectTrack(index: number) {
		audioStore.setCurrentIndex(index);
		playerStore.pause();
		playerStore.setCurrentTime(0);
	}

	async function deleteTrack(id: string, index: number) {
		await dbStore.removeAudio(id);
		audioStore.removeAudio(id);

		if (index === activeIndex && index > 0) {
			audioStore.setCurrentIndex(index - 1);
		}
	}

	function scrollToActive() {
		if (playlistContainer && activeIndex >= 0) {
			const items = playlistContainer.querySelectorAll('[data-index]');
			const activeItem = items[activeIndex] as HTMLElement;
			if (activeItem) {
				activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
			}
		}
	}

	$: if (activeIndex >= 0) {
		setTimeout(scrollToActive, 0);
	}
</script>

<div class="flex-1 overflow-y-auto smooth-scroll" bind:this={playlistContainer}>
	<div class="space-y-1 p-2">
		{#each $audioStore.audios as audio, index (audio.id)}
			<div
				data-index={index}
				class="group relative"
			>
				<button
					on:click={() => selectTrack(index)}
					class={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
						index === activeIndex
							? 'bg-red-500/20 text-red-400'
							: 'hover:bg-slate-700/50 text-slate-300'
					}`}
				>
					<div class="flex items-start gap-2 min-w-0">
						<div class="flex-shrink-0 mt-0.5">
							{#if index === activeIndex && $playerStore.isPlaying}
								<div class="flex gap-0.5 items-center justify-center w-4 h-4">
									<div class="w-0.5 h-2 bg-red-400 animate-pulse"></div>
									<div class="w-0.5 h-3 bg-red-400 animate-pulse" style="animation-delay: 0.2s"></div>
									<div class="w-0.5 h-2 bg-red-400 animate-pulse" style="animation-delay: 0.4s"></div>
								</div>
							{:else}
								<Music size={16} class="opacity-50" />
							{/if}
						</div>
						<div class="flex-1 min-w-0">
							<p class="text-sm font-medium truncate">{audio.title}</p>
							<p class="text-xs opacity-75 truncate">{audio.artist}</p>
						</div>
					</div>
				</button>

				<button
					on:click={() => deleteTrack(audio.id, index)}
					class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 text-slate-400 hover:text-red-400"
					aria-label="Delete track"
				>
					<Trash2 size={16} />
				</button>
			</div>
		{/each}
	</div>
</div>
