<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle } from 'lucide-svelte';
	import { audioStore } from '$stores/audioStore';
	import { playerStore } from '$stores/playerStore';
	import { formatDuration, getAudioBlobUrl, revokeAudioBlobUrl } from '$utils/fileHandler';
	import * as audioProcessor from '$utils/audioProcessor';

	let currentAudio: any = null;
	let currentBlobUrl: string | null = null;

	// Reactive statements
	$: currentAudio = $audioStore.audios[$audioStore.currentIndex] || null;
	$: if (currentAudio?.id) {
		loadAudio(currentAudio);
	}

	onMount(() => {
		audioProcessor.initAudioContext();

		// Setup event listeners
		const element = audioProcessor.getAudioElement();

		const onTimeUpdate = () => {
			playerStore.setCurrentTime(audioProcessor.getCurrentTime());
		};

		const onLoadedMetadata = () => {
			playerStore.setDuration(audioProcessor.getDuration());
		};

		const onEnded = () => {
			handleTrackEnd();
		};

		audioProcessor.addEventListener('timeupdate', onTimeUpdate);
		audioProcessor.addEventListener('loadedmetadata', onLoadedMetadata);
		audioProcessor.addEventListener('ended', onEnded);

		return () => {
			audioProcessor.removeEventListener('timeupdate', onTimeUpdate);
			audioProcessor.removeEventListener('loadedmetadata', onLoadedMetadata);
			audioProcessor.removeEventListener('ended', onEnded);
		};
	});

	onDestroy(() => {
		if (currentBlobUrl) {
			revokeAudioBlobUrl(currentBlobUrl);
		}
	});

	function loadAudio(audio: any) {
		if (currentBlobUrl) {
			revokeAudioBlobUrl(currentBlobUrl);
		}

		currentBlobUrl = getAudioBlobUrl(audio.blob);
		audioProcessor.setAudioSource(currentBlobUrl);
		playerStore.setDuration(0);
		playerStore.setCurrentTime(0);

		if ($playerStore.isPlaying) {
			audioProcessor.play();
		}
	}

	function togglePlay() {
		if ($playerStore.isPlaying) {
			audioProcessor.pause();
			playerStore.pause();
		} else {
			if (currentAudio) {
				audioProcessor.play();
				playerStore.play();
			}
		}
	}

	function previousTrack() {
		if ($audioStore.currentIndex > 0) {
			audioStore.setCurrentIndex($audioStore.currentIndex - 1);
		} else if ($audioStore.audios.length > 0) {
			audioStore.setCurrentIndex($audioStore.audios.length - 1);
		}
		playerStore.pause();
		playerStore.setCurrentTime(0);
	}

	function nextTrack() {
		if ($audioStore.currentIndex < $audioStore.audios.length - 1) {
			audioStore.setCurrentIndex($audioStore.currentIndex + 1);
		} else if ($audioStore.audios.length > 0) {
			audioStore.setCurrentIndex(0);
		}
		playerStore.pause();
		playerStore.setCurrentTime(0);
	}

	function handleTrackEnd() {
		if ($playerStore.repeat === 'one') {
			playerStore.setCurrentTime(0);
			audioProcessor.play();
		} else {
			nextTrack();
			audioProcessor.play();
			playerStore.play();
		}
	}

	function toggleRepeat() {
		const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one'];
		const currentMode = $playerStore.repeat;
		const currentIndex = modes.indexOf(currentMode);
		const nextIndex = (currentIndex + 1) % modes.length;
		playerStore.setRepeat(modes[nextIndex]);
	}

	function handleProgressChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const time = parseFloat(target.value);
		playerStore.setCurrentTime(time);
		audioProcessor.setCurrentTime(time);
	}

	function handleVolumeChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const volume = parseFloat(target.value);
		playerStore.setVolume(volume);
		audioProcessor.setVolume(volume);
	}

	function toggleMute() {
		playerStore.toggleMute();
		audioProcessor.setVolume($playerStore.volume);
	}
</script>

<div class="flex flex-col items-center gap-8 w-full max-w-md">
	<!-- Album Cover -->
	<div class="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl group">
		{#if currentAudio?.cover}
			<img
				src={currentAudio.cover}
				alt={currentAudio.title}
				class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
				class:spin-slow={$playerStore.isPlaying}
			/>
		{:else}
			<div class="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
				<div class="text-center text-slate-400">
					<div class="text-6xl mb-4">♪</div>
					<p class="text-sm">No Cover</p>
				</div>
			</div>
		{/if}

		<!-- Play button overlay -->
		<div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
			<button
				on:click={togglePlay}
				class="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
				aria-label={$playerStore.isPlaying ? 'Pause' : 'Play'}
			>
				{#if $playerStore.isPlaying}
					<Pause size={32} class="text-white fill-white" />
				{:else}
					<Play size={32} class="text-white fill-white ml-1" />
				{/if}
			</button>
		</div>
	</div>

	<!-- Track Info -->
	<div class="text-center w-full px-4">
		<h2 class="text-2xl font-bold text-white mb-2 truncate" title={currentAudio?.title}>
			{currentAudio?.title || 'No Track Selected'}
		</h2>
		<p class="text-slate-400 text-sm truncate" title={currentAudio?.artist}>
			{currentAudio?.artist || 'Unknown'}
		</p>
	</div>

	<!-- Progress Bar -->
	<div class="w-full px-4 space-y-2">
		<input
			type="range"
			min="0"
			max={$playerStore.duration || 0}
			value={$playerStore.currentTime}
			on:change={handleProgressChange}
			class="w-full"
			style="--value: {($playerStore.currentTime / ($playerStore.duration || 1)) * 100}%"
			aria-label="Progress"
		/>
		<div class="flex justify-between text-xs text-slate-400 font-mono">
			<span>{formatDuration($playerStore.currentTime)}</span>
			<span>{formatDuration($playerStore.duration)}</span>
		</div>
	</div>

	<!-- Controls -->
	<div class="flex items-center justify-center gap-4 w-full px-4">
		<button
			on:click={toggleRepeat}
			class="btn-icon"
			class:text-red-500={$playerStore.repeat !== 'off'}
			aria-label="Repeat"
		>
			<Repeat size={20} />
		</button>

		<button on:click={previousTrack} class="btn-icon-lg" aria-label="Previous">
			<SkipBack size={24} />
		</button>

		<button
			on:click={togglePlay}
			class="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 active:scale-95 flex items-center justify-center transition-all shadow-lg"
			aria-label={$playerStore.isPlaying ? 'Pause' : 'Play'}
		>
			{#if $playerStore.isPlaying}
				<Pause size={28} class="text-white fill-white" />
			{:else}
				<Play size={28} class="text-white fill-white ml-1" />
			{/if}
		</button>

		<button on:click={nextTrack} class="btn-icon-lg" aria-label="Next">
			<SkipForward size={24} />
		</button>

		<button on:click={() => playerStore.toggleShuffle()} class="btn-icon" class:text-red-500={$playerStore.shuffle} aria-label="Shuffle">
			<Shuffle size={20} />
		</button>
	</div>

	<!-- Volume Control -->
	<div class="w-full px-4 flex items-center gap-3">
		<button on:click={toggleMute} class="btn-icon flex-shrink-0" aria-label="Mute">
			{#if $playerStore.isMuted || $playerStore.volume === 0}
				<VolumeX size={20} />
			{:else}
				<Volume2 size={20} />
			{/if}
		</button>

		<input
			type="range"
			min="0"
			max="1"
			step="0.01"
			value={$playerStore.volume}
			on:change={handleVolumeChange}
			class="flex-1"
			style="--value: {$playerStore.volume * 100}%"
			aria-label="Volume"
		/>
	</div>
</div>

<style lang="postcss">
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	:global(.spin-slow) {
		animation: spin 4s linear infinite;
	}
</style>
