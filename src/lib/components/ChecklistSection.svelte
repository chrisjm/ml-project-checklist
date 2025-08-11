<script lang="ts">
	import type { ChecklistSection as TChecklistSection } from '$lib/types';
	import ChecklistItem from '$lib/components/ChecklistItem.svelte';
	import NotesEditor from '$lib/components/NotesEditor.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import type { ChecklistItem as TChecklistItem } from '$lib/types';
	import ChecklistItemEditor from '$lib/components/ChecklistItemEditor.svelte';

	let { section, onToggle, onNotes, onText, onDelete, onReorder, onAdd } = $props<{
		section: TChecklistSection;
		onToggle: (sectionId: string, itemId: string) => void;
		onNotes: (sectionId: string, value: string) => void;
		onText: (sectionId: string, itemId: string, value: string) => void;
		onDelete: (sectionId: string, itemId: string) => void;
		onReorder: (sectionId: string, fromIndex: number, toIndex: number) => void;
		onAdd: (sectionId: string, text: string) => void;
	}>();

	function handleToggle(itemId: string) {
		onToggle(section.id, itemId);
	}
	function handleNotes(value: string) {
		onNotes(section.id, value);
	}

	function handleText(itemId: string, value: string) {
		onText(section.id, itemId, value);
	}
	function handleDelete(itemId: string) {
		onDelete(section.id, itemId);
	}
	function handleReorder(fromIndex: number, toIndex: number) {
		onReorder(section.id, fromIndex, toIndex);
	}

	// Progress for this section
	const total = $derived(section.items.length);
	const completed = $derived(section.items.filter((i: TChecklistItem) => i.checked).length);
	const value = $derived(total === 0 ? 0 : completed / total);

	// Per-section edit mode
	let editing = $state(false);

	// New item state (edit mode)
	let newItemText = $state('');
	const canAdd = $derived(newItemText.trim().length > 0);
	function addNewItem() {
		const value = newItemText.trim();
		if (!value) return;
		onAdd(section.id, value);
		newItemText = '';
	}
</script>

<div
	class="rounded border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
>
	<div class="mb-3 flex items-end justify-between gap-4">
		<h2 class="text-lg font-medium tracking-tight">{section.title}</h2>
		<div class="flex items-center gap-3">
			<div class="text-sm text-gray-600 dark:text-gray-400">{completed}/{total} completed</div>
			<button
				class="text-xs text-blue-700 hover:underline focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none dark:text-blue-400"
				onclick={() => (editing = !editing)}
				aria-pressed={editing}
			>
				{editing ? 'Done' : 'Edit'}
			</button>
		</div>
	</div>
	<div class="mb-4">
		<ProgressBar {value} label={`${Math.round(value * 100)}%`} />
	</div>
	<ul class="space-y-2">
		{#each section.items as item, i (item.id)}
			{#if editing}
				<ChecklistItemEditor
					{item}
					onToggle={handleToggle}
					onText={handleText}
					onDelete={handleDelete}
					onMoveUp={() => handleReorder(i, i - 1)}
					onMoveDown={() => handleReorder(i, i + 1)}
					disableUp={i === 0}
					disableDown={i === section.items.length - 1}
				/>
			{:else}
				<ChecklistItem {item} onToggle={handleToggle} />
			{/if}
		{/each}
	</ul>

	{#if editing}
		<div class="mt-3 flex items-center gap-2">
			<input
				class="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
				placeholder="New item"
				value={newItemText}
				oninput={(e) => (newItemText = (e.target as HTMLInputElement).value)}
				onkeydown={(e) => {
					if ((e as KeyboardEvent).key === 'Enter') addNewItem();
				}}
			/>
			<button
				class="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white disabled:opacity-50 dark:bg-blue-500"
				disabled={!canAdd}
				onclick={addNewItem}
			>
				Add
			</button>
		</div>
	{/if}

	<div class="mt-4">
		<NotesEditor id={'notes-' + section.id} value={section.notes} onInput={handleNotes} />
	</div>
</div>
