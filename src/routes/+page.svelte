<script lang="ts">
	import { projects } from '$lib/stores/projects';
	import type { Project } from '$lib/types';
	import { goto } from '$app/navigation';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import { Pencil, Copy, Download, Trash2, Plus, Upload } from 'lucide-svelte';
	import { computeTotals, valueFromTotals, labelFromTotals } from '$lib/utils/progress';
	import { download, safeFileName } from '$lib/utils/file';
	import ActionsMenu from '$lib/components/common/ActionsMenu.svelte';

	let allProjects = $state<Record<string, Project>>({});
	let hydrated = $state(false);
	$effect(() => {
		const unsub = projects.subscribe((s) => {
			allProjects = s.projects;
			hydrated = true;
		});
		return unsub;
	});

	const projectList = $derived(Object.values(allProjects));
	const isEmpty = $derived(projectList.length === 0);

	// Per-project progress helpers (via shared utils)
	function progressValue(p: Project): number {
		return valueFromTotals(computeTotals(p));
	}
	function progressLabel(p: Project): string {
		return labelFromTotals(computeTotals(p));
	}

	function onNewProject() {
		const name = prompt('Project name?') ?? '';
		const id = projects.createProject(name);
		goto(`/project/${id}`);
	}

	function onDelete(id: string) {
		if (confirm('Delete this project? This cannot be undone.')) {
			projects.deleteProject(id);
		}
	}

	function onRename(id: string, current: string) {
		const name = prompt('Rename project', current) ?? current;
		projects.renameProject(id, name);
	}

	function onDuplicate(id: string) {
		const newId = projects.duplicateProject(id);
		goto(`/project/${newId}`);
	}

	function onExport(id: string, name: string) {
		try {
			const json = projects.exportProject(id);
			const safe = safeFileName(name || 'project');
			download(`${safe}.json`, json);
		} catch (e) {
			alert(String(e));
		}
	}

	function onImport() {
		const json = prompt('Paste exported project JSON');
		if (!json) return;
		try {
			const id = projects.importProject(json);
			goto(`/project/${id}`);
		} catch (e) {
			alert(String(e));
		}
	}

	// Actions menu handled by shared component
</script>

<div class="mx-auto max-w-3xl space-y-6 p-6">
	<header class="flex items-center justify-between gap-2">
		<h1 class="text-2xl font-semibold tracking-tight">ML Project Checklist</h1>
		<div class="flex items-center gap-2">
			<button
				class="inline-flex items-center gap-1 rounded border border-gray-200 bg-white/80 px-3 py-2 text-gray-700 shadow-sm backdrop-blur hover:bg-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
				onclick={onImport}
			>
				<Upload size={16} aria-hidden="true" />
				<span>Import</span>
			</button>
			<button
				class="inline-flex items-center gap-1 rounded bg-blue-600 px-3 py-2 text-white shadow-sm hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none dark:focus-visible:ring-offset-gray-900"
				onclick={onNewProject}
			>
				<Plus size={16} aria-hidden="true" />
				<span>New Project</span>
			</button>
		</div>
	</header>

	{#if !hydrated}
		<div class="space-y-3">
			<div
				class="rounded border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
			>
				<div class="animate-pulse space-y-3">
					<div class="h-5 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
					<div class="h-2 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
				</div>
			</div>
			<div
				class="rounded border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
			>
				<div class="animate-pulse space-y-3">
					<div class="h-5 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
					<div class="h-2 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
				</div>
			</div>
			<div
				class="rounded border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
			>
				<div class="animate-pulse space-y-3">
					<div class="h-5 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
					<div class="h-2 w-2/3 rounded bg-gray-200 dark:bg-gray-700"></div>
				</div>
			</div>
		</div>
	{:else if isEmpty}
		<div
			class="rounded border border-dashed border-gray-300 bg-white p-6 text-center text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
		>
			<p class="mb-3">No projects yet.</p>
			<button
				class="rounded bg-blue-600 px-3 py-2 text-white shadow-sm hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none dark:focus-visible:ring-offset-gray-900"
				onclick={onNewProject}
			>
				Create your first project
			</button>
		</div>
	{:else}
		<ul
			class="divide-y divide-gray-100 rounded border border-gray-200 bg-white shadow-sm dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"
		>
			{#each projectList as p (p.id)}
				<li class="flex items-center justify-between gap-4 p-4">
					<a class="min-w-0 flex-1 truncate font-medium hover:underline" href={`/project/${p.id}`}
						>{p.name}</a
					>
					<div class="hidden w-64 sm:block">
						<ProgressBar value={progressValue(p)} label={progressLabel(p)} />
					</div>
					<div>
						<ActionsMenu width="w-44">
							{#snippet children({ close })}
								<button
									class="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
									onclick={() => {
										onRename(p.id, p.name);
										close();
									}}
								>
									<Pencil size={14} aria-hidden="true" />
									<span>Rename</span>
								</button>
								<button
									class="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
									onclick={() => {
										onDuplicate(p.id);
										close();
									}}
								>
									<Copy size={14} aria-hidden="true" />
									<span>Duplicate</span>
								</button>
								<button
									class="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
									onclick={() => {
										onExport(p.id, p.name);
										close();
									}}
								>
									<Download size={14} aria-hidden="true" />
									<span>Export</span>
								</button>
								<button
									class="flex w-full items-center gap-2 px-3 py-2 text-left text-red-700 hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none dark:text-red-400 dark:hover:bg-red-950/40 dark:focus-visible:ring-offset-gray-900"
									onclick={() => {
										onDelete(p.id);
										close();
									}}
								>
									<Trash2 size={14} aria-hidden="true" />
									<span>Delete</span>
								</button>
							{/snippet}
						</ActionsMenu>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>
