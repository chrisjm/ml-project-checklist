<script lang="ts">
	import { projects } from '$lib/stores/projects';
	import type { Project } from '$lib/types';
	import type { ChecklistItem as TChecklistItem } from '$lib/types';
	import { goto } from '$app/navigation';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import { EllipsisVertical, Pencil, Copy, Download, Trash2, Plus, Upload } from 'lucide-svelte';

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

	// Per-project progress helpers
	function progressValue(p: Project): number {
		const totals = p.sections.reduce(
			(acc, sec) => {
				acc.total += sec.items.length;
				acc.done += sec.items.filter((i: TChecklistItem) => i.checked).length;
				return acc;
			},
			{ total: 0, done: 0 }
		);
		return totals.total === 0 ? 0 : totals.done / totals.total;
	}
	function progressLabel(p: Project): string {
		const totals = p.sections.reduce(
			(acc, sec) => {
				acc.total += sec.items.length;
				acc.done += sec.items.filter((i: TChecklistItem) => i.checked).length;
				return acc;
			},
			{ total: 0, done: 0 }
		);
		return `${totals.done}/${totals.total} completed`;
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

	function download(filename: string, text: string) {
		const blob = new Blob([text], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	}

	function onExport(id: string, name: string) {
		try {
			const json = projects.exportProject(id);
			const safe = (name || 'project').replace(/[^a-z0-9-_]+/gi, '_');
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

	// Actions menu state
	let openMenuId = $state<string | null>(null);
	function toggleMenu(id: string) {
		openMenuId = openMenuId === id ? null : id;
	}
	function onMobileAction(fn: () => void) {
		fn();
		openMenuId = null;
	}
	// Close menus on Escape and outside click
	$effect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape') openMenuId = null;
		}
		function onDown(e: Event) {
			const t = e.target as HTMLElement | null;
			if (!t) return;
			if (!t.closest('[data-actions-menu]') && !t.closest('[data-actions-trigger]')) {
				openMenuId = null;
			}
		}
		document.addEventListener('keydown', onKey);
		// use pointerdown so it closes before following links
		document.addEventListener('pointerdown', onDown, true);
		return () => {
			document.removeEventListener('keydown', onKey);
			document.removeEventListener('pointerdown', onDown, true);
		};
	});
</script>

<div class="mx-auto max-w-3xl space-y-6 p-6">
	<header class="flex items-center justify-between gap-2">
		<h1 class="text-2xl font-semibold">ML Project Checklist</h1>
		<div class="flex items-center gap-2">
			<button
				class="inline-flex items-center gap-1 rounded border px-3 py-2 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
				onclick={onImport}
			>
				<Upload size={16} aria-hidden="true" />
				<span>Import</span>
			</button>
			<button
				class="inline-flex items-center gap-1 rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
				onclick={onNewProject}
			>
				<Plus size={16} aria-hidden="true" />
				<span>New Project</span>
			</button>
		</div>
	</header>

	{#if !hydrated}
		<div class="space-y-3">
			<div class="rounded border bg-white p-4">
				<div class="animate-pulse space-y-3">
					<div class="h-5 w-1/3 rounded bg-gray-200"></div>
					<div class="h-2 w-full rounded bg-gray-200"></div>
				</div>
			</div>
			<div class="rounded border bg-white p-4">
				<div class="animate-pulse space-y-3">
					<div class="h-5 w-1/2 rounded bg-gray-200"></div>
					<div class="h-2 w-5/6 rounded bg-gray-200"></div>
				</div>
			</div>
			<div class="rounded border bg-white p-4">
				<div class="animate-pulse space-y-3">
					<div class="h-5 w-1/4 rounded bg-gray-200"></div>
					<div class="h-2 w-2/3 rounded bg-gray-200"></div>
				</div>
			</div>
		</div>
	{:else if isEmpty}
		<div class="rounded border border-dashed p-6 text-center text-gray-600">
			<p class="mb-3">No projects yet.</p>
			<button
				class="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
				onclick={onNewProject}
			>
				Create your first project
			</button>
		</div>
	{:else}
		<ul class="divide-y rounded border bg-white">
			{#each projectList as p (p.id)}
				<li class="flex items-center justify-between gap-4 p-4">
					<a class="min-w-0 flex-1 truncate font-medium hover:underline" href={`/project/${p.id}`}
						>{p.name}</a
					>
					<div class="hidden w-64 sm:block">
						<ProgressBar value={progressValue(p)} label={progressLabel(p)} />
					</div>
					<div class="relative">
						<button
							class="rounded border p-2 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
							aria-haspopup="menu"
							aria-label="Actions"
							aria-expanded={openMenuId === p.id}
							onclick={() => toggleMenu(p.id)}
							data-actions-trigger
						>
							<span class="sr-only">Actions</span>
							<EllipsisVertical size={18} aria-hidden="true" />
						</button>
						{#if openMenuId === p.id}
							<div
								class="absolute right-0 z-10 mt-2 w-44 overflow-hidden rounded border bg-white shadow-lg"
								data-actions-menu
							>
								<button
									class="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
									onclick={() => onMobileAction(() => onRename(p.id, p.name))}
								>
									<Pencil size={14} aria-hidden="true" />
									<span>Rename</span>
								</button>
								<button
									class="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
									onclick={() => onMobileAction(() => onDuplicate(p.id))}
								>
									<Copy size={14} aria-hidden="true" />
									<span>Duplicate</span>
								</button>
								<button
									class="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
									onclick={() => onMobileAction(() => onExport(p.id, p.name))}
								>
									<Download size={14} aria-hidden="true" />
									<span>Export</span>
								</button>
								<button
									class="flex w-full items-center gap-2 px-3 py-2 text-left text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
									onclick={() => onMobileAction(() => onDelete(p.id))}
								>
									<Trash2 size={14} aria-hidden="true" />
									<span>Delete</span>
								</button>
							</div>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>
