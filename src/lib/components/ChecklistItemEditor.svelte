<script lang="ts">
	import type { ChecklistItem } from '$lib/types';
	import { ArrowUp, ArrowDown, Trash2 } from 'lucide-svelte';

	let {
		item,
		onToggle,
		onText,
		onDelete,
		onMoveUp,
		onMoveDown,
		disableUp = false,
		disableDown = false
	} = $props<{
		item: ChecklistItem;
		onToggle: (id: string) => void;
		onText: (id: string, value: string) => void;
		onDelete: (id: string) => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
		disableUp?: boolean;
		disableDown?: boolean;
	}>();

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		onText(item.id, target.value);
	}
</script>

<li class="flex items-start gap-3">
	<input
		id={item.id}
		type="checkbox"
		class="mt-1 h-4 w-4 rounded border-gray-300 accent-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none dark:border-gray-600 dark:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
		checked={item.checked}
		onchange={() => onToggle(item.id)}
	/>
	<div class="flex w-full items-center gap-2">
		<input
			class="w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
			value={item.text}
			oninput={handleInput}
			placeholder="Item text"
		/>
		<div class="flex items-center gap-1">
			<button
				class="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-700"
				disabled={disableUp}
				onclick={onMoveUp}
				aria-label="Move up"
			>
				<ArrowUp size={16} aria-hidden="true" />
			</button>
			<button
				class="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-700"
				disabled={disableDown}
				onclick={onMoveDown}
				aria-label="Move down"
			>
				<ArrowDown size={16} aria-hidden="true" />
			</button>
			<button
				class="rounded p-1 text-red-600 hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none dark:text-red-400 dark:hover:bg-red-950/40"
				onclick={() => onDelete(item.id)}
				aria-label="Delete"
			>
				<Trash2 size={16} aria-hidden="true" />
			</button>
		</div>
	</div>
</li>
