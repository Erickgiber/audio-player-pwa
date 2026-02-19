<script lang="ts">
	import { Plus, Upload, FolderOpen } from 'lucide-svelte';
	import { audioStore } from '$stores/audioStore';
	import { dbStore } from '$stores/dbStore';
	import { processAudioFiles } from '$utils/fileHandler';
	import { onMount } from 'svelte';

	let fileInput: HTMLInputElement;
	let folderInput: HTMLInputElement;
	let isLoading = false;

	onMount(async () => {
		await dbStore.initialize();
		const audios = await dbStore.loadAllAudios();
		if (audios.length > 0) {
			audioStore.setAudios(audios);
		}
	});

	async function handleFiles(files: FileList | null) {
		if (!files || files.length === 0) return;

		isLoading = true;

		try {
			const fileArray = Array.from(files);
			const processedAudios = await processAudioFiles(fileArray);

			for (const audio of processedAudios) {
				await dbStore.saveAudio(audio);
				audioStore.addAudio(audio);
			}

			console.log('[v0] Added', processedAudios.length, 'audio files');
		} catch (error) {
			console.error('[v0] Error processing files:', error);
		} finally {
			isLoading = false;
			// Reset file inputs
			if (fileInput) fileInput.value = '';
			if (folderInput) folderInput.value = '';
		}
	}

	function openFilePicker() {
		fileInput?.click();
	}

	function openFolderPicker() {
		folderInput?.click();
	}
</script>

<input
	bind:this={fileInput}
	type="file"
	accept="audio/*"
	multiple
	on:change={(e) => handleFiles(e.currentTarget.files)}
	aria-label="Upload audio files"
/>

<input
	bind:this={folderInput}
	type="file"
	webkitdirectory
	accept="audio/*"
	on:change={(e) => handleFiles(e.currentTarget.files)}
	aria-label="Upload audio folder"
/>

<div class="flex flex-col gap-2 w-full">
	<button
		on:click={openFilePicker}
		disabled={isLoading}
		class="btn-secondary w-full flex items-center justify-center gap-2 py-2"
	>
		<Upload size={18} />
		<span>Add Files</span>
	</button>

	<button
		on:click={openFolderPicker}
		disabled={isLoading}
		class="btn-secondary w-full flex items-center justify-center gap-2 py-2"
	>
		<FolderOpen size={18} />
		<span>Add Folder</span>
	</button>
</div>

<style lang="postcss">
	button:disabled {
		@apply opacity-50 cursor-not-allowed;
	}
</style>
