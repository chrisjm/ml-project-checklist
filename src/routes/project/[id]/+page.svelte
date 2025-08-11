<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { projects } from '$lib/stores/projects';
	import type { Project } from '$lib/types';
	import type { ChecklistItem as TChecklistItem } from '$lib/types';
	import ChecklistSection from '$lib/components/ChecklistSection.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import { EllipsisVertical, Pencil, Copy, Download, Trash2 } from 'lucide-svelte';

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
	function download(filename: string, text: string) {
		const blob = new Blob([text], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	}
	function exportProject() {
		if (!project) return;
		try {
			const json = projects.exportProject(projectId);
			const safe = (project.name || 'project').replace(/[^a-z0-9-_]+/gi, '_');
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

	// Actions menu state and a11y
	let menuOpen = $state(false);
	function toggleMenu() {
		menuOpen = !menuOpen;
	}
	function onAction(fn: () => void) {
		fn();
		menuOpen = false;
	}
	$effect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape') menuOpen = false;
		}
		function onDown(e: Event) {
			const t = e.target as HTMLElement | null;
			if (!t) return;
			if (!t.closest('[data-actions-menu]') && !t.closest('[data-actions-trigger]')) {
				menuOpen = false;
			}
		}
		document.addEventListener('keydown', onKey);
		document.addEventListener('pointerdown', onDown, true);
		return () => {
			document.removeEventListener('keydown', onKey);
			document.removeEventListener('pointerdown', onDown, true);
		};
	});
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
			<div class="flex items-start justify-between gap-2">
				<div>
					<h1 class="text-2xl font-semibold">{project.name}</h1>
					<p class="text-sm text-gray-500">Updated {new Date(project.updatedAt).toLocaleString()}</p>
				</div>
				<div class="relative">
					<button
						class="rounded border p-2 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
						aria-haspopup="menu"
						aria-label="Project actions"
						aria-expanded={menuOpen}
						onclick={toggleMenu}
						data-actions-trigger
					>
						<span class="sr-only">Project actions</span>
						<EllipsisVertical size={18} aria-hidden="true" />
					</button>
					{#if menuOpen}
						<div class="absolute right-0 z-10 mt-2 w-48 overflow-hidden rounded border bg-white shadow-lg" data-actions-menu>
							<button class="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" onclick={() => onAction(renameProject)}>
								<Pencil size={14} aria-hidden="true" />
								<span>Rename</span>
							</button>
							<button class="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" onclick={() => onAction(duplicateProject)}>
								<Copy size={14} aria-hidden="true" />
								<span>Duplicate</span>
							</button>
							<button class="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" onclick={() => onAction(exportProject)}>
								<Download size={14} aria-hidden="true" />
								<span>Export</span>
							</button>
							<button class="flex w-full items-center gap-2 px-3 py-2 text-left text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500" onclick={() => onAction(deleteProject)}>
								<Trash2 size={14} aria-hidden="true" />
								<span>Delete</span>
							</button>
						</div>
					{/if}
				</div>
			</div>
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
