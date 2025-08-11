<script lang="ts">
	import type { ChecklistSection as TChecklistSection } from '$lib/types';
	import ChecklistItem from '$lib/components/ChecklistItem.svelte';
	import NotesEditor from '$lib/components/NotesEditor.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import type { ChecklistItem as TChecklistItem } from '$lib/types';

	let { section, onToggle, onNotes } = $props<{
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

	// Progress for this section
	const total = $derived(section.items.length);
	const completed = $derived(section.items.filter((i: TChecklistItem) => i.checked).length);
	const value = $derived(total === 0 ? 0 : completed / total);
</script>

<div
	class="rounded border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
>
	<div class="mb-3 flex items-end justify-between gap-4">
		<h2 class="text-lg font-medium tracking-tight">{section.title}</h2>
		<div class="text-sm text-gray-600 dark:text-gray-400">{completed}/{total} completed</div>
	</div>
	<div class="mb-4">
		<ProgressBar {value} label={`${Math.round(value * 100)}%`} />
	</div>
	<ul class="space-y-2">
		{#each section.items as item (item.id)}
			<ChecklistItem {item} onToggle={handleToggle} />
		{/each}
	</ul>

	<div class="mt-4">
		<NotesEditor id={'notes-' + section.id} value={section.notes} onInput={handleNotes} />
	</div>
</div>
