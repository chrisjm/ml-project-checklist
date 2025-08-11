<script lang="ts">
	import { page } from '$app/stores';
	import { projects } from '$lib/stores/projects';
	import type { Project } from '$lib/types';
	import type { ChecklistItem as TChecklistItem } from '$lib/types';
	import ChecklistSection from '$lib/components/ChecklistSection.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';

	let params = $state<{ id: string }>({ id: '' });
	$effect(() => {
		const unsub = page.subscribe((p) => {
			params = { id: p.params?.id ?? '' };
		});
		return unsub;
	});
	const projectId = $derived(params.id);

	let allProjects = $state<Record<string, Project>>({});
	$effect(() => {
		const unsub = projects.subscribe((s) => {
			allProjects = s.projects;
		});
		return unsub;
	});
	const project = $derived(allProjects[projectId]);

	const totalItems = $derived(
		!project ? 0 : project.sections.reduce((sum, sec) => sum + sec.items.length, 0)
	);
	const completedItems = $derived(
		!project
			? 0
			: project.sections.reduce(
					(sum, sec) => sum + sec.items.filter((i: TChecklistItem) => i.checked).length,
					0
				)
	);
	const progressValue = $derived(totalItems === 0 ? 0 : completedItems / totalItems);

	function toggle(sectionId: string, itemId: string) {
		projects.toggleItem(projectId, sectionId, itemId);
	}

	function updateNotes(sectionId: string, e: Event) {
		const target = e.target as HTMLTextAreaElement;
		projects.updateNotes(projectId, sectionId, target.value);
	}

	function updateNotesValue(sectionId: string, value: string) {
		projects.updateNotes(projectId, sectionId, value);
	}
</script>

<div class="mx-auto max-w-4xl space-y-8 p-6">
	<nav>
		<a class="text-sm text-blue-700 hover:underline" href="/">← Back to projects</a>
	</nav>

	{#if !project}
		<div class="rounded border bg-white p-4">
			<div class="animate-pulse space-y-4">
				<div class="h-6 w-1/3 rounded bg-gray-200"></div>
				<div class="h-3 w-1/2 rounded bg-gray-200"></div>
				<div class="h-2 w-full rounded bg-gray-200"></div>
				<div class="h-2 w-5/6 rounded bg-gray-200"></div>
			</div>
		</div>
	{:else}
		<header class="space-y-2">
			<h1 class="text-2xl font-semibold">{project.name}</h1>
			<p class="text-sm text-gray-500">Updated {new Date(project.updatedAt).toLocaleString()}</p>
			<div>
				<ProgressBar value={progressValue} label={`${completedItems}/${totalItems} completed`} />
			</div>
		</header>

		<section class="space-y-8">
			{#each project.sections as sec (sec.id)}
				<ChecklistSection section={sec} onToggle={toggle} onNotes={updateNotesValue} />
			{/each}
		</section>
	{/if}
</div>
