<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import ThemeToggle from '$lib/components/common/ThemeToggle.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<!-- Prevent theme FOUC: set initial theme class ASAP -->
	<script>
		(function () {
			try {
				var t;
				var raw = localStorage.getItem('mlpchecklist:v1');
				if (raw) {
					try { t = JSON.parse(raw)?.theme; } catch (_) { t = undefined; }
				}
				// legacy fallback
				if (!t) t = localStorage.getItem('theme');
				var prefersDark =
					window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
				var isDark = t === 'dark' || ((t === 'system' || t == null) && prefersDark);
				var root = document.documentElement;
				if (isDark) root.classList.add('dark');
				else root.classList.remove('dark');
			} catch (e) {}
		})();
	</script>
</svelte:head>

<div class="min-h-dvh bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
	<header
		class="sticky top-0 z-40 border-b border-gray-200 bg-white/70 backdrop-blur dark:border-gray-800 dark:bg-gray-900/70"
	>
		<div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
			<a href="/" class="font-semibold tracking-tight hover:opacity-90">ML Project Checklist</a>
			<ThemeToggle />
		</div>
	</header>
	<main>
		{@render children?.()}
	</main>
</div>
