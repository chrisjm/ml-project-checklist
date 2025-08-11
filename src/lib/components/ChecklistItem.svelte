<script lang="ts">
	import type { ChecklistItem } from '$lib/types';

	let { item, onToggle } = $props<{ item: ChecklistItem; onToggle: (id: string) => void }>();
</script>

<li class="flex items-start gap-3">
	<input
		id={item.id}
		type="checkbox"
		class="mt-1 h-4 w-4 rounded border-gray-300 accent-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none dark:border-gray-600 dark:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
		checked={item.checked}
		onchange={() => onToggle(item.id)}
	/>
	<label
		class="leading-6 text-gray-800 select-text dark:text-gray-200"
		class:opacity-70={item.checked}
		class:line-through={item.checked}
		for={item.id}>{item.text}</label
	>
</li>
