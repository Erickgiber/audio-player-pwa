<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let animationId: number;
	let dataArray: Uint8Array;
	let analyser: AnalyserNode | null = null;

	export let isPlaying = false;

	onMount(() => {
		try {
			// Get audio context from window
			const audioContext = (window as any).__audioContext as AudioContext;
			if (!audioContext) {
				console.warn('[v0] AudioContext not available for visualizer');
				return;
			}

			analyser = audioContext.createAnalyser();
			analyser.fftSize = 256;
			dataArray = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));

			// Connect to destination for visualization
			// Note: In Player component, we should expose analyser node

			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			const draw = () => {
				animationId = requestAnimationFrame(draw);

				if (!analyser || !isPlaying) {
					ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
					ctx.fillRect(0, 0, canvas.width, canvas.height);
					return;
				}

				analyser.getByteFrequencyData(dataArray as unknown as Uint8Array<ArrayBuffer>);

				// Clear canvas
				ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
				ctx.fillRect(0, 0, canvas.width, canvas.height);

				// Draw frequency bars
				const barWidth = (canvas.width / dataArray.length) * 2.5;
				let barHeight;
				let x = 0;

				for (let i = 0; i < dataArray.length; i++) {
					barHeight = (dataArray[i] / 255) * canvas.height;

					const hue = (i / dataArray.length) * 360;
					ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
					ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

					x += barWidth + 1;
				}
			};

			draw();
		} catch (error) {
			console.warn('[v0] Visualizer initialization failed:', error);
		}

		return () => {
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
		};
	});
</script>

<canvas bind:this={canvas} class="w-full h-32 rounded-lg bg-gradient-to-b from-slate-800 to-slate-900"></canvas>
