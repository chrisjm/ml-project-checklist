<script lang="ts">
	let { id, value, onInput } = $props<{
		id: string;
		value: string;
		onInput: (value: string) => void;
	}>();

	function handleInput(e: Event) {
		const el = e.target as HTMLTextAreaElement;
		onInput(el.value);
	}
</script>

<label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300" for={id}>Notes</label
>
<textarea
	{id}
	class="w-full rounded border border-gray-300 bg-white p-2 text-gray-800 shadow-sm placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:placeholder:text-gray-500 dark:focus-visible:ring-offset-gray-900"
	rows={4}
	{value}
	oninput={handleInput}
></textarea>
