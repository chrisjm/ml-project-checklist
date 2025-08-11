<script lang="ts">
  import { page } from '$app/stores';
  import { projects } from '$lib/stores/projects';
  import type { Project } from '$lib/types';
  import ChecklistSection from '$lib/components/ChecklistSection.svelte';

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

  function toggle(sectionId: string, itemId: string) {
    projects.toggleItem(projectId, sectionId, itemId);
  }

  function updateNotes(sectionId: string, e: Event) {
    const target = e.target as HTMLTextAreaElement;
    projects.updateNotes(projectId, sectionId, target.value);
  }

  // For component usage (NotesEditor emits value directly)
  function updateNotesValue(sectionId: string, value: string) {
    projects.updateNotes(projectId, sectionId, value);
  }
</script>

<div class="mx-auto max-w-4xl p-6 space-y-8">
  <nav>
    <a class="text-sm text-blue-700 hover:underline" href="/">← Back to projects</a>
  </nav>

  {#if !project}
    <p class="text-red-600">Project not found.</p>
  {:else}
    <header class="space-y-1">
      <h1 class="text-2xl font-semibold">{project.name}</h1>
      <p class="text-sm text-gray-500">Updated {new Date(project.updatedAt).toLocaleString()}</p>
    </header>

    <section class="space-y-8">
      {#each project.sections as sec (sec.id)}
        <ChecklistSection
          section={sec}
          onToggle={toggle}
          onNotes={updateNotesValue}
        />
      {/each}
    </section>
  {/if}
</div>
