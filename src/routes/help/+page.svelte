<script lang="ts">
	// static content
</script>

<svelte:head>
	<title>Help — ML Project Checklist</title>
	<meta
		name="description"
		content="How to use the ML Project Checklist. Learn how data is stored locally, how to export/import projects, and how to manage themes."
	/>
	<meta property="og:title" content="Help — ML Project Checklist" />
	<meta
		property="og:description"
		content="Tips for using this local-first checklist app: projects live in your browser; export/import for portability."
	/>
	<meta name="robots" content="index, follow" />
</svelte:head>

<div class="mx-auto max-w-3xl space-y-6 p-6">
	<h1 class="text-2xl font-semibold tracking-tight">Help</h1>
	<p class="text-gray-700 dark:text-gray-300">
		This app is local-first. Your projects are stored in your current browser only. To move projects
		between devices or browsers, use Export and Import from the homepage or a project's actions
		menu.
	</p>

	<section class="space-y-3">
		<h2 class="mt-4 text-lg font-medium">Creating a project</h2>
		<p class="text-gray-700 dark:text-gray-300">
			On the homepage, click <em>New Project</em>. You can rename, duplicate, export, and delete
			projects via the actions menu.
		</p>
	</section>

	<section class="space-y-3">
		<h2 class="mt-4 text-lg font-medium">Export / Import</h2>
		<ul class="list-disc space-y-2 pl-5 text-gray-700 dark:text-gray-300">
			<li>
				Export creates a <code class="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">.json</code>
				file you can save.
			</li>
			<li>Import accepts a JSON export to restore a project into this browser.</li>
			<li>Keep your exports safe if they contain sensitive details.</li>
		</ul>
	</section>

	<section class="space-y-3">
		<h2 class="mt-4 text-lg font-medium">Local storage & privacy</h2>
		<p class="text-gray-700 dark:text-gray-300">
			Data is stored using <code class="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800"
				>localStorage</code
			> under a single key. Clearing browser storage or using private windows may remove your data.
		</p>
	</section>

	<section class="space-y-3">
		<h2 class="mt-4 text-lg font-medium">Theme</h2>
		<p class="text-gray-700 dark:text-gray-300">
			Use the theme toggle to switch Light/Dark/System. The selection is saved with the app state.
		</p>
	</section>
</div>
