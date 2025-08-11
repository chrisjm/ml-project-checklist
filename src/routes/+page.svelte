<script lang="ts">
  import { projects } from '$lib/stores/projects';
  import type { Project } from '$lib/types';
  import { goto } from '$app/navigation';

  let allProjects = $state<Record<string, Project>>({});
  $effect(() => {
    const unsub = projects.subscribe((s) => {
      allProjects = s.projects;
    });
    return unsub;
  });

  const projectList = $derived(Object.values(allProjects));
  const isEmpty = $derived(projectList.length === 0);

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
</script>

<div class="mx-auto max-w-3xl p-6 space-y-6">
  <header class="flex items-center justify-between">
    <h1 class="text-2xl font-semibold">ML Project Checklist</h1>
    <button class="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700" onclick={onNewProject}>
      New Project
    </button>
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
        <li class="flex items-center justify-between gap-2 p-4">
          <a class="flex-1 font-medium hover:underline" href={`/project/${p.id}`}>{p.name}</a>
          <div class="flex items-center gap-2 text-sm">
            <button class="rounded border px-2 py-1 hover:bg-gray-50" onclick={() => onRename(p.id, p.name)}>Rename</button>
            <button class="rounded border border-red-200 px-2 py-1 text-red-700 hover:bg-red-50" onclick={() => onDelete(p.id)}>Delete</button>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>
