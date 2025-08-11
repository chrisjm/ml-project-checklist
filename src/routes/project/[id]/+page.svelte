<script lang="ts">
  import { page } from '$app/stores';
  import { projects } from '$lib/stores/projects';
  import type { Project } from '$lib/types';

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
        <div class="rounded border bg-white p-4">
          <h2 class="mb-3 text-lg font-medium">{sec.title}</h2>
          <ul class="space-y-2">
            {#each sec.items as item (item.id)}
              <li class="flex items-start gap-3">
                <input id={item.id} type="checkbox" class="mt-1" checked={item.checked} onchange={() => toggle(sec.id, item.id)} />
                <label class="select-text leading-6" for={item.id}>{item.text}</label>
              </li>
            {/each}
          </ul>

          <div class="mt-4">
            {#key sec.id}
              <label class="mb-1 block text-sm font-medium text-gray-700" for={"notes-" + sec.id}>Notes</label>
              <textarea
                id={"notes-" + sec.id}
                class="w-full rounded border p-2"
                rows={4}
                value={sec.notes}
                oninput={(e) => updateNotes(sec.id, e)}
              ></textarea>
            {/key}
          </div>
        </div>
      {/each}
    </section>
  {/if}
</div>
