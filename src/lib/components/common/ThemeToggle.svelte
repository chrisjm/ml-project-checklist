<script lang="ts">
	import { onMount } from 'svelte';
	import { Moon, Sun, Laptop } from 'lucide-svelte';
	import { projects } from '$lib/stores/projects';
	import type { Theme } from '$lib/types';

	let theme: Theme = 'system';
	let mql: MediaQueryList | null = null;

	function effectiveTheme(t: Theme): 'light' | 'dark' {
		if (t === 'system') {
			// On SSR, window is undefined — default to light to avoid errors
			if (typeof window === 'undefined') return 'light';
			const prefers = mql?.matches ?? window.matchMedia('(prefers-color-scheme: dark)').matches;
			return prefers ? 'dark' : 'light';
		}
		return t;
	}

	function applyTheme(t: Theme) {
		// Guard for SSR where document is undefined
		if (typeof document === 'undefined') return;
		const root = document.documentElement;
		const eff = effectiveTheme(t);
		if (eff === 'dark') root.classList.add('dark');
		else root.classList.remove('dark');
	}

	function setupSystemListener() {
		mql = window.matchMedia('(prefers-color-scheme: dark)');
		const onChange = () => {
			if (theme === 'system') applyTheme('system');
		};
		mql.addEventListener?.('change', onChange);
		return () => mql?.removeEventListener?.('change', onChange);
	}

	onMount(() => {
		applyTheme(theme);
		const teardown = setupSystemListener();
		return () => teardown?.();
	});

	// react to store theme changes
	$: theme = $projects.theme;
	$: applyTheme(theme);

	function cycleTheme() {
		// light -> dark -> system -> light
		let next: Theme;
		if (theme === 'light') next = 'dark';
		else if (theme === 'dark') next = 'system';
		else next = 'light';
		projects.setTheme(next);
	}
</script>

<button
	type="button"
	class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-1.5 text-sm text-gray-700 shadow-sm backdrop-blur transition hover:bg-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-800"
	onclick={cycleTheme}
	aria-label="Toggle theme"
	title="Toggle theme"
>
	{#if theme === 'light'}
		<Sun size={16} aria-hidden="true" />
		<span class="hidden sm:inline">Light</span>
	{:else if theme === 'dark'}
		<Moon size={16} aria-hidden="true" />
		<span class="hidden sm:inline">Dark</span>
	{:else}
		<Laptop size={16} aria-hidden="true" />
		<span class="hidden sm:inline">System</span>
	{/if}
</button>
