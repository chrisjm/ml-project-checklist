<script lang="ts">
	// static content
</script>

<svelte:head>
	<title>About — ML Project Checklist</title>
	<meta
		name="description"
		content="Learn what the ML Project Checklist is and how it helps you plan and track machine learning projects in a local-first, privacy-friendly way."
	/>
	<meta property="og:title" content="About — ML Project Checklist" />
	<meta
		property="og:description"
		content="A local-first checklist app to plan, track, and ship ML projects. Your data stays in your browser."
	/>
	<meta name="robots" content="index, follow" />
</svelte:head>

<div class="mx-auto max-w-3xl space-y-6 p-6">
	<h1 class="text-2xl font-semibold tracking-tight">About</h1>
	<p class="text-gray-700 dark:text-gray-300">
		ML Project Checklist is a lightweight, local-first tool to help you plan and track machine
		learning projects. It lives entirely in your browser—no accounts, no servers, and no network
		required.
	</p>

	<section class="space-y-3">
		<h2 class="mt-4 text-lg font-medium">Key ideas</h2>
		<ul class="list-disc space-y-2 pl-5 text-gray-700 dark:text-gray-300">
			<li><strong>Local-first</strong>: your projects are stored in your browser storage only.</li>
			<li><strong>Private by default</strong>: nothing is uploaded or synced.</li>
			<li>
				<strong>Portable</strong>: export/import your projects as JSON to move across devices or
				back up.
			</li>
			<li><strong>Simple</strong>: a practical checklist to reduce overhead and keep momentum.</li>
		</ul>
	</section>

	<section class="space-y-3">
		<h2 class="mt-4 text-lg font-medium">How it works</h2>
		<p class="text-gray-700 dark:text-gray-300">
			The app persists state to <code class="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800"
				>localStorage</code
			>
			under a single key. Use the Export/Import actions to move projects between browsers or to create
			backups.
		</p>
	</section>

	<section class="space-y-3">
		<h2 class="mt-4 text-lg font-medium">Dark mode</h2>
		<p class="text-gray-700 dark:text-gray-300">
			Use the theme toggle in the header to switch between Light, Dark, and System. Your preference
			is stored locally.
		</p>
	</section>
</div>
