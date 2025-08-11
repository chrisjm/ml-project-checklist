<script lang="ts">
	import { EllipsisVertical } from 'lucide-svelte';

	const { label = 'Actions', align = 'right', width = 'w-48' } = $props<{
		label?: string;
		align?: 'left' | 'right';
		width?: string;
	}>();

	let open = $state(false);
	let root: HTMLDivElement | null = null;

	function toggle() {
		open = !open;
	}
	function close() {
		open = false;
	}

	$effect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape') close();
		}
		function onDown(e: Event) {
			const t = e.target as HTMLElement | null;
			if (!t || !root) return;
			if (!root.contains(t)) close();
		}
		document.addEventListener('keydown', onKey);
		document.addEventListener('pointerdown', onDown, true);
		return () => {
			document.removeEventListener('keydown', onKey);
			document.removeEventListener('pointerdown', onDown, true);
		};
	});
</script>

<div class="relative" bind:this={root}>
	<button
		class="rounded border p-2 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
		aria-haspopup="menu"
		aria-label={label}
		aria-expanded={open}
		onclick={toggle}
	>
		<span class="sr-only">{label}</span>
		<EllipsisVertical size={18} aria-hidden="true" />
	</button>
	{#if open}
		<div class={`absolute ${align === 'right' ? 'right-0' : 'left-0'} z-10 mt-2 ${width} overflow-hidden rounded border bg-white shadow-lg`} role="menu">
			<slot {close} />
		</div>
	{/if}
</div>
