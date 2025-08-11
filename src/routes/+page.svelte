<script lang="ts">
  import { projects } from '$lib/stores/projects';
  import type { Project } from '$lib/types';
  import type { ChecklistItem as TChecklistItem } from '$lib/types';
  import { goto } from '$app/navigation';
  import ProgressBar from '$lib/components/ProgressBar.svelte';

  let allProjects = $state<Record<string, Project>>({});
  $effect(() => {
    const unsub = projects.subscribe((s) => {
      allProjects = s.projects;
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
</script>

<div class="mx-auto max-w-3xl p-6 space-y-6">
  <header class="flex items-center justify-between gap-3">
    <h1 class="text-2xl font-semibold">ML Project Checklist</h1>
    <div class="flex items-center gap-2">
      <button class="rounded border px-3 py-2 hover:bg-gray-50" onclick={onImport}>Import</button>
      <button class="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700" onclick={onNewProject}>
        New Project
      </button>
    </div>
  </header>

  {#if isEmpty}
    <div class="rounded border border-dashed p-6 text-center text-gray-600">
      <p class="mb-3">No projects yet.</p>
      <button class="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700" onclick={onNewProject}>
        Create your first project
      </button>
    </div>
  {:else}
    <ul class="divide-y rounded border bg-white">
      {#each projectList as p (p.id)}
        <li class="flex items-center justify-between gap-4 p-4">
          <a class="min-w-0 flex-1 truncate font-medium hover:underline" href={`/project/${p.id}`}>{p.name}</a>
          <div class="hidden w-64 md:block">
            <ProgressBar value={progressValue(p)} label={progressLabel(p)} />
          </div>
          <div class="flex items-center gap-2 text-sm">
            <button class="rounded border px-2 py-1 hover:bg-gray-50" onclick={() => onRename(p.id, p.name)}>Rename</button>
            <button class="rounded border px-2 py-1 hover:bg-gray-50" onclick={() => onDuplicate(p.id)}>Duplicate</button>
            <button class="rounded border px-2 py-1 hover:bg-gray-50" onclick={() => onExport(p.id, p.name)}>Export</button>
            <button class="rounded border border-red-200 px-2 py-1 text-red-700 hover:bg-red-50" onclick={() => onDelete(p.id)}>Delete</button>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>
