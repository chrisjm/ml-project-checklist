<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { projects } from '$lib/stores/projects';
	import type { Project } from '$lib/types';
	import ChecklistSection from '$lib/components/ChecklistSection.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import { Pencil, Copy, Download, Trash2 } from 'lucide-svelte';
	import { computeTotals, valueFromTotals, labelFromTotals } from '$lib/utils/progress';
	import { download, safeFileName } from '$lib/utils/file';
	import ActionsMenu from '$lib/components/common/ActionsMenu.svelte';

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

	const totals = $derived(computeTotals(project));
	const progressValue = $derived(valueFromTotals(totals));
	const progressLabel = $derived(labelFromTotals(totals));

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

	// Project-level actions
	function renameProject() {
		if (!project) return;
		const name = prompt('Rename project', project.name) ?? project.name;
		projects.renameProject(projectId, name);
	}
	function duplicateProject() {
		const newId = projects.duplicateProject(projectId);
		goto(`/project/${newId}`);
	}
	// download helper moved to '$lib/utils/file'
	function exportProject() {
		if (!project) return;
		try {
			const json = projects.exportProject(projectId);
			const safe = safeFileName(project.name || 'project');
			download(`${safe}.json`, json);
		} catch (e) {
			alert(String(e));
		}
	}
	function deleteProject() {
		if (!project) return;
		if (confirm('Delete this project? This cannot be undone.')) {
			projects.deleteProject(projectId);
			goto('/');
		}
	}

	// Actions menu handled by shared component
</script>

<div class="mx-auto max-w-4xl space-y-8 p-6">
	<nav>
		<a class="text-sm text-blue-700 hover:underline dark:text-blue-400" href="/"
			>← Back to projects</a
		>
	</nav>

	{#if !project}
		<div class="rounded border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
			<div class="animate-pulse space-y-4">
				<div class="h-6 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
				<div class="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
				<div class="h-2 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
				<div class="h-2 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
			</div>
		</div>
	{:else}
		<header class="space-y-2">
			<div class="flex items-start justify-between gap-2">
				<div>
					<h1 class="text-2xl font-semibold tracking-tight">{project.name}</h1>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Updated {new Date(project.updatedAt).toLocaleString()}
					</p>
				</div>
				<div>
					<ActionsMenu label="Project actions">
						{#snippet children({ close })}
							<button
								class="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
								onclick={() => {
									renameProject();
									close();
								}}
							>
								<Pencil size={14} aria-hidden="true" />
								<span>Rename</span>
							</button>
							<button
								class="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
								onclick={() => {
									duplicateProject();
									close();
								}}
							>
								<Copy size={14} aria-hidden="true" />
								<span>Duplicate</span>
							</button>
							<button
								class="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
								onclick={() => {
									exportProject();
									close();
								}}
							>
								<Download size={14} aria-hidden="true" />
								<span>Export</span>
							</button>
							<button
								class="flex w-full items-center gap-2 px-3 py-2 text-left text-red-700 hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none dark:text-red-400 dark:hover:bg-red-950/40 dark:focus-visible:ring-offset-gray-900"
								onclick={() => {
									deleteProject();
									close();
								}}
							>
								<Trash2 size={14} aria-hidden="true" />
								<span>Delete</span>
							</button>
						{/snippet}
					</ActionsMenu>
				</div>
			</div>
			<div>
				<ProgressBar value={progressValue} label={progressLabel} />
			</div>
		</header>

		<section class="space-y-8">
			{#each project.sections as sec (sec.id)}
				<ChecklistSection section={sec} onToggle={toggle} onNotes={updateNotesValue} />
			{/each}
		</section>
	{/if}
</div>
