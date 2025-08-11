<script lang="ts">
  import type { ChecklistSection as TChecklistSection } from '$lib/types';
  import ChecklistItem from '$lib/components/ChecklistItem.svelte';
  import NotesEditor from '$lib/components/NotesEditor.svelte';

  let {
    section,
    onToggle,
    onNotes
  } = $props<{
    section: TChecklistSection;
    onToggle: (sectionId: string, itemId: string) => void;
    onNotes: (sectionId: string, value: string) => void;
  }>();

  function handleToggle(itemId: string) {
    onToggle(section.id, itemId);
  }
  function handleNotes(value: string) {
    onNotes(section.id, value);
  }
</script>

<div class="rounded border bg-white p-4">
  <h2 class="mb-3 text-lg font-medium">{section.title}</h2>
  <ul class="space-y-2">
    {#each section.items as item (item.id)}
      <ChecklistItem item={item} onToggle={handleToggle} />
    {/each}
  </ul>

  <div class="mt-4">
    <NotesEditor id={"notes-" + section.id} value={section.notes} onInput={handleNotes} />
  </div>
</div>
